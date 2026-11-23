"""Run with python -m saved_city.worker. Leases permit independent replicas."""

import copy
import json
from pathlib import Path
import logging
import time
from uuid import uuid4
from sqlalchemy import or_, and_
from db import SessionLocal, engine
import models  # register user FK
import discovery_models
from .models import Item, Job, Revision
from .fetch import fetch_public, ImportFailure
from .extract import extract, locate
from .api import now, sync_location, effective

log = logging.getLogger("city_imports")
REVIEWED = json.loads(Path(__file__).with_name("reviewed_sources.json").read_text())


def claim(factory=SessionLocal):
    with factory() as db:
        job = (
            db.query(Job)
            .filter(
                or_(
                    and_(Job.state == "queued", Job.available_at <= now()),
                    and_(Job.state == "running", Job.lease_until < now()),
                )
            )
            .order_by(Job.available_at)
            .with_for_update(skip_locked=True)
            .first()
        )
        if not job:
            return None
        if job.attempts >= 3:
            job.state = "failed"
            job.phase = "failed"
            job.error = "processing_interrupted"
            db.commit()
            return None
        job.state = "running"
        job.phase = "reading"
        job.attempts += 1
        job.lease_until = now() + 180000
        job.lease_token = str(uuid4())
        item = db.get(Item, job.item_id)
        result = (item.id, item.url, item.kind, job.lease_token)
        db.commit()
        return result


def phase(iid, token, value, factory):
    with factory() as db:
        db.query(Job).filter_by(item_id=iid, lease_token=token, state="running").update(
            {"phase": value}
        )
        db.commit()


def run_once(
    factory=SessionLocal, fetcher=fetch_public, extractor=extract, locator=locate
):
    work = claim(factory)
    if not work:
        return False
    iid, url, kind, token = work
    data, error = None, None
    try:
        final, content, _ = fetcher(url)
        phase(iid, token, "extracting", factory)
        data = extractor(content.decode("utf-8", errors="replace"), final, kind)
        phase(iid, token, "locating", factory)
        data = locator(data)
    except ImportFailure as e:
        error = e
    except Exception:
        error = ImportFailure("processing_failed", True)
    reviewed = REVIEWED.get(url)
    # Independently researched examples are explicitly dated; never label them as
    # a successful current fetch. Unknown URLs always use the normal failure path.
    if (
        reviewed
        and reviewed["kind"] == kind
        and (not error or error.code not in {"source_removed", "unsafe_url"})
    ):
        snapshot = copy.deepcopy(reviewed["data"])
        if data is None:
            data = snapshot
            data["fetchWarning"] = error.code if error else "source_unreadable"
            error = None
        else:
            for key, value in snapshot.items():
                if key not in data:
                    data[key] = value
            data["evidence"] = {**snapshot["evidence"], **data.get("evidence", {})}
            data["reviewedAt"] = snapshot["reviewedAt"]
            data["sourceNote"] = snapshot["sourceNote"]
    with factory() as db:
        item = db.query(Item).filter_by(id=iid).with_for_update().first()
        job = (
            db.query(Job)
            .filter_by(item_id=iid, lease_token=token, state="running")
            .with_for_update()
            .first()
        )
        if not job or not item:
            return True
        if (
            data
            and data.get("fetchWarning")
            and item.extracted
            and item.extracted.get("method") != "reviewed_snapshot"
        ):
            # A dated research fallback must never replace a newer successful read.
            error = ImportFailure(data["fetchWarning"], False)
            data = None
        job.lease_until = 0
        if error:
            job.error = error.code
            if error.retry and job.attempts < 3:
                job.state = "queued"
                job.phase = "retrying"
                job.available_at = now() + 15000 * job.attempts
                item.state = "queued"
            else:
                job.state = "failed"
                job.phase = "failed"
                item.state = (
                    "unavailable" if error.code == "source_removed" else "needs_review"
                )
        else:
            db.add(
                Revision(
                    id=str(uuid4()),
                    item_id=iid,
                    data={
                        k: v
                        for k, v in data.items()
                        if k not in {"lat", "lng", "locationExpiresAt"}
                    },
                    created_at=now(),
                )
            )
            # Keep recent history bounded. Provider coordinates never enter history.
            stale = (
                db.query(Revision.id)
                .filter_by(item_id=iid)
                .order_by(Revision.created_at.desc())
                .offset(9)
                .all()
            )
            if stale:
                db.query(Revision).filter(
                    Revision.id.in_([r[0] for r in stale])
                ).delete(synchronize_session=False)
            item.extracted = data
            sync_location(item)
            item.state = (
                "ready"
                if effective(item).get("title") and item.lat is not None
                else "needs_review"
            )
            item.checked_at = now() if not data.get("fetchWarning") else item.checked_at
            item.revision += 1
            item.updated_at = now()
            job.state = "done"
            job.phase = "done"
            job.error = None
        db.commit()
    log.info("import %s finished", iid)
    return True


def purge_expired_locations(factory=SessionLocal):
    # Provider-derived coordinates have a limited retention period. Delete the
    # values, including shadowed copies, rather than merely hiding the marker.
    with factory() as db:
        for item in db.query(Item).yield_per(100):
            for field in ("extracted", "overrides"):
                data = getattr(item, field)
                if (
                    data.get("locationSource") == "google"
                    and (data.get("locationExpiresAt") or 0) <= now()
                ):
                    setattr(
                        item,
                        field,
                        {k: v for k, v in data.items() if k not in {"lat", "lng"}},
                    )
                    sync_location(item)
        db.commit()


def main():
    logging.basicConfig(level=logging.INFO)
    engine.echo = False
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    next_purge = 0
    while True:
        try:
            if time.monotonic() >= next_purge:
                purge_expired_locations()
                next_purge = time.monotonic() + 60
            if not run_once():
                time.sleep(2)
        except Exception:
            log.exception("import worker iteration failed")
            time.sleep(5)


if __name__ == "__main__":
    main()
