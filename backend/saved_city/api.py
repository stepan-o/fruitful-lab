import copy
import hashlib
import time
from uuid import uuid4
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import BaseModel, ConfigDict, Field, field_validator
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from security import get_current_active_user, get_db
from discovery_models import DiscoveryGroup, DiscoveryRecord
from .models import Collection, Item, Job, Note, Revision
from .fetch import clean_url, fetch_public, ImportFailure

router = APIRouter(prefix="/discovery/saved", tags=["saved city"])


def now():
    return int(time.time() * 1000)


def fail(code, status=400):
    raise HTTPException(status_code=status, detail=code)


def groups(db, user):
    return [
        g
        for g in db.query(DiscoveryGroup).all()
        if str(user.id) in [m["id"] for m in g.data.get("members", [])]
    ]


def collections(db, user):
    ids = [g.id for g in groups(db, user)]
    return (
        db.query(Collection)
        .filter(or_(Collection.owner_id == user.id, Collection.group_id.in_(ids)))
        .all()
    )


def collection_for(db, user, cid, write=False):
    c = db.query(Collection).filter_by(id=cid).with_for_update().first()
    if not c:
        fail("not_found", 404)
    own = c.owner_id == user.id
    member = c.group_id in [g.id for g in groups(db, user)]
    if not own and not member:
        fail("not_found", 404)
    if write and not own and c.access != "contribute":
        fail("read_only", 403)
    return c


def item_for(db, user, iid, write=False):
    i = db.query(Item).filter_by(id=iid).with_for_update().first()
    if not i:
        fail("not_found", 404)
    c = collection_for(db, user, i.collection_id)
    if write and i.owner_id != user.id and c.owner_id != user.id:
        fail("owner_required", 403)
    return i


def effective(i):
    data = {**i.extracted, **i.overrides}
    if (
        data.get("locationSource") == "google"
        and data.get("locationExpiresAt", 0) <= now()
    ):
        for key in ["lat", "lng"]:
            data.pop(key, None)
    return data


def sync_location(i):
    d = effective(i)
    i.lat, i.lng = d.get("lat"), d.get("lng")


def collection_json(c, user):
    return {
        "id": c.id,
        "name": c.name,
        "groupId": c.group_id,
        "access": c.access,
        "owner": str(c.owner_id),
        "canManage": c.owner_id == user.id,
        "canAdd": c.owner_id == user.id or c.access == "contribute",
    }


def item_json(db, i, user, summary=False):
    d = effective(i)
    n = db.get(Note, (i.id, user.id))
    c = db.get(Collection, i.collection_id)
    j = db.get(Job, i.id)
    if summary:
        d = {
            k: v
            for k, v in d.items()
            if k
            in {
                "title",
                "address",
                "price",
                "currency",
                "pricePeriod",
                "maintenance",
                "bedrooms",
                "bathrooms",
                "area",
                "areaType",
                "category",
                "startDate",
                "endDate",
                "lat",
                "lng",
                "precision",
                "locationSource",
                "availability",
            }
        }
    else:
        d = {
            **d,
            "evidence": {
                **i.extracted.get("evidence", {}),
                **{
                    k: {"source": "user", "text": str(v)}
                    for k, v in i.overrides.items()
                },
            },
        }
        d.pop("image", None)
    return {
        "id": i.id,
        "kind": i.kind,
        "state": i.state,
        "owner": str(i.owner_id),
        "collectionId": i.collection_id,
        "url": i.url,
        "data": d,
        "revision": i.revision,
        "canEdit": i.owner_id == user.id or c.owner_id == user.id,
        "status": n.status if n else "saved",
        "note": n.note if n and not summary else "",
        "recordId": n.record_id if n else None,
        "hasImage": bool(effective(i).get("image")),
        "createdAt": i.created_at,
        "checkedAt": i.checked_at,
        "updatedAt": i.updated_at,
        "job": {"state": j.state, "phase": j.phase, "error": j.error} if j else None,
    }


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class CollectionInput(Strict):
    name: str = Field(min_length=1, max_length=100)
    groupId: str | None = None
    access: Literal["view", "contribute"] = "view"

    @field_validator("name")
    @classmethod
    def trim(cls, value):
        if not value.strip():
            raise ValueError("name_required")
        return value.strip()


@router.post("/collections", status_code=201)
def create_collection(
    payload: CollectionInput,
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user),
):
    if payload.groupId and payload.groupId not in [g.id for g in groups(db, user)]:
        fail("group_forbidden", 403)
    if db.query(Collection).filter_by(owner_id=user.id).count() >= 50:
        fail("collection_limit", 429)
    c = Collection(
        id=str(uuid4()),
        owner_id=user.id,
        name=payload.name,
        group_id=payload.groupId,
        access=payload.access,
        created_at=now(),
    )
    db.add(c)
    db.commit()
    return collection_json(c, user)


@router.patch("/collections/{cid}")
def edit_collection(
    cid: str,
    payload: CollectionInput,
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user),
):
    c = collection_for(db, user, cid)
    if c.owner_id != user.id:
        fail("owner_required", 403)
    if payload.groupId and payload.groupId not in [g.id for g in groups(db, user)]:
        fail("group_forbidden", 403)
    c.name, c.group_id, c.access = payload.name, payload.groupId, payload.access
    db.commit()
    return collection_json(c, user)


class ImportInput(Strict):
    url: str = Field(min_length=8, max_length=2048)
    kind: Literal["activity", "rent", "buy"]
    collectionId: str


@router.post("/imports", status_code=202)
def submit(
    payload: ImportInput,
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user),
):
    c = collection_for(db, user, payload.collectionId, True)
    try:
        url = clean_url(payload.url)
    except ImportFailure as e:
        fail(e.code)
    digest = hashlib.sha256(url.encode()).hexdigest()
    old = db.query(Item).filter_by(collection_id=c.id, url_hash=digest).first()
    if old:
        return item_json(db, old, user)
    if db.query(Item).filter_by(collection_id=c.id).count() >= 500:
        fail("item_limit", 429)
    if (
        db.query(Item)
        .filter(Item.owner_id == user.id, Item.created_at > now() - 3600000)
        .count()
        >= 30
    ):
        fail("import_limit", 429)
    i = Item(
        id=str(uuid4()),
        owner_id=user.id,
        collection_id=c.id,
        url=url,
        url_hash=digest,
        kind=payload.kind,
        state="queued",
        extracted={},
        overrides={},
        created_at=now(),
        updated_at=now(),
    )
    db.add(i)
    db.flush()
    db.add(
        Job(
            item_id=i.id,
            state="queued",
            phase="queued",
            attempts=0,
            available_at=now(),
            lease_until=0,
        )
    )
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        old = db.query(Item).filter_by(collection_id=c.id, url_hash=digest).first()
        if old:
            return item_json(db, old, user)
        raise
    return item_json(db, i, user)


@router.get("")
def listing(
    kind: Literal["activity", "rent", "buy"] | None = None,
    collection: str | None = None,
    scope: Literal["all", "mine", "group"] = "all",
    offset: int = Query(0, ge=0),
    limit: int = Query(60, ge=1, le=100),
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user),
):
    cs = collections(db, user)
    ids = [
        c.id
        for c in cs
        if (not collection or c.id == collection)
        and (
            scope == "all"
            or (scope == "mine" and not c.group_id)
            or (scope == "group" and c.group_id)
        )
    ]
    q = db.query(Item).filter(Item.collection_id.in_(ids))
    if kind:
        q = q.filter(Item.kind == kind)
    rows = (
        q.order_by(Item.created_at.desc(), Item.id)
        .offset(offset)
        .limit(limit + 1)
        .all()
    )
    return {
        "items": [item_json(db, i, user, True) for i in rows[:limit]],
        "hasMore": len(rows) > limit,
        "collections": [collection_json(c, user) for c in cs],
        "groups": [
            {"id": g.id, "name": g.data.get("name", "")} for g in groups(db, user)
        ],
    }


@router.get("/map")
def map_items(
    west: float = Query(-100, ge=-180, le=180),
    east: float = Query(-98, ge=-180, le=180),
    south: float = Query(18, ge=-90, le=90),
    north: float = Query(21, ge=-90, le=90),
    collection: str | None = None,
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user),
):
    if west > east or south > north:
        fail("invalid_bounds")
    ids = [c.id for c in collections(db, user) if not collection or c.id == collection]
    rows = (
        db.query(Item)
        .filter(
            Item.collection_id.in_(ids),
            Item.lat >= south,
            Item.lat <= north,
            Item.lng >= west,
            Item.lng <= east,
        )
        .order_by(Item.created_at.desc())
        .limit(301)
        .all()
    )
    items = [item_json(db, i, user, True) for i in rows[:300]]
    return {
        "items": [i for i in items if i["data"].get("lat") is not None],
        "truncated": len(rows) > 300,
    }


@router.get("/items/{iid}")
def detail(
    iid: str, db: Session = Depends(get_db), user=Depends(get_current_active_user)
):
    i = item_for(db, user, iid)
    result = item_json(db, i, user)
    result["history"] = [
        {
            "at": r.created_at,
            "data": {
                k: v
                for k, v in r.data.items()
                if k
                in {
                    "price",
                    "currency",
                    "maintenance",
                    "availability",
                    "startDate",
                    "endDate",
                }
            },
        }
        for r in db.query(Revision)
        .filter_by(item_id=iid)
        .order_by(Revision.created_at.desc())
        .limit(10)
    ]
    return result


class EditFields(Strict):
    title: str | None = Field(None, max_length=300)
    description: str | None = Field(None, max_length=2500)
    address: str | None = Field(None, max_length=500)
    category: str | None = Field(None, max_length=80)
    price: float | None = Field(None, ge=0, le=1e12, allow_inf_nan=False)
    currency: Literal["MXN", "USD", "CAD", "EUR"] | None = None
    pricePeriod: Literal["month", "night", "week", "total"] | None = None
    maintenance: float | None = Field(None, ge=0, le=1e9, allow_inf_nan=False)
    deposit: float | None = Field(None, ge=0, le=1e9, allow_inf_nan=False)
    bedrooms: float | None = Field(None, ge=0, le=100, allow_inf_nan=False)
    bathrooms: float | None = Field(None, ge=0, le=100, allow_inf_nan=False)
    area: float | None = Field(None, ge=0, le=1e8, allow_inf_nan=False)
    areaType: Literal["floor", "land"] | None = None
    furnished: str | None = Field(None, max_length=100)
    availability: str | None = Field(None, max_length=100)
    schedule: str | None = Field(None, max_length=500)
    startDate: str | None = Field(None, max_length=60)
    endDate: str | None = Field(None, max_length=60)
    lat: float | None = Field(None, ge=-90, le=90, allow_inf_nan=False)
    lng: float | None = Field(None, ge=-180, le=180, allow_inf_nan=False)
    precision: Literal["exact", "approximate"] | None = None

    @field_validator("startDate", "endDate")
    @classmethod
    def date(cls, value):
        if value:
            from datetime import datetime

            datetime.fromisoformat(value.replace("Z", "+00:00"))
        return value


class Edit(Strict):
    revision: int
    fields: EditFields | None = None
    kind: Literal["activity", "rent", "buy"] | None = None
    collectionId: str | None = None


@router.patch("/items/{iid}")
def edit_item(
    iid: str,
    payload: Edit,
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user),
):
    i = item_for(db, user, iid, True)
    if i.revision != payload.revision:
        fail("changed_elsewhere", 409)
    d = payload.fields.model_dump(exclude_unset=True) if payload.fields else {}
    if ("lat" in d) != ("lng" in d) or (d.get("lat") is None) != (d.get("lng") is None):
        fail("invalid_location")
    if "lat" in d:
        d.update(
            locationSource="user",
            locationExpiresAt=None,
            precision=d.get("precision") or "exact",
        )
    if (
        "address" in d
        and d["address"] != effective(i).get("address")
        and "lat" not in d
    ):
        d.update(
            lat=None,
            lng=None,
            precision=None,
            locationSource="user",
            locationExpiresAt=None,
        )
    if payload.collectionId and payload.collectionId != i.collection_id:
        if i.owner_id != user.id:
            fail("owner_required", 403)
        collection_for(db, user, payload.collectionId, True)
        if (
            db.query(Item)
            .filter_by(collection_id=payload.collectionId, url_hash=i.url_hash)
            .first()
        ):
            fail("already_saved", 409)
        i.collection_id = payload.collectionId
    i.overrides = {**i.overrides, **d}
    if payload.kind:
        i.kind = payload.kind
    sync_location(i)
    i.state = (
        "ready" if effective(i).get("title") and i.lat is not None else "needs_review"
    )
    i.revision += 1
    i.updated_at = now()
    db.commit()
    return item_json(db, i, user)


class Personal(Strict):
    note: str = Field("", max_length=4000)
    status: Literal[
        "saved",
        "planned",
        "visited",
        "shortlisted",
        "contacted",
        "viewing",
        "discarded",
    ] = "saved"
    recordId: str | None = None


@router.patch("/items/{iid}/personal")
def personal(
    iid: str,
    payload: Personal,
    db: Session = Depends(get_db),
    user=Depends(get_current_active_user),
):
    i = item_for(db, user, iid)
    if payload.recordId:
        r = db.get(DiscoveryRecord, payload.recordId)
        if not r or r.owner_id != user.id:
            fail("record_forbidden", 403)
    n = db.get(Note, (iid, user.id))
    if not n:
        n = Note(item_id=iid, user_id=user.id)
        db.add(n)
    n.note, n.status, n.record_id = payload.note, payload.status, payload.recordId
    db.commit()
    return item_json(db, i, user)


@router.post("/items/{iid}/refresh", status_code=202)
def refresh(
    iid: str, db: Session = Depends(get_db), user=Depends(get_current_active_user)
):
    i = item_for(db, user, iid, True)
    j = db.query(Job).filter_by(item_id=iid).with_for_update().one()
    if j.state in {"queued", "running"}:
        return item_json(db, i, user)
    if now() - max(i.checked_at or 0, j.available_at or 0) < 60000:
        fail("refresh_wait", 429)
    (
        j.state,
        j.phase,
        j.attempts,
        j.available_at,
        j.lease_until,
        j.lease_token,
        j.error,
    ) = "queued", "queued", 0, now(), 0, None, None
    i.state = "queued"
    db.commit()
    return item_json(db, i, user)


@router.delete("/items/{iid}", status_code=204)
def delete(
    iid: str, db: Session = Depends(get_db), user=Depends(get_current_active_user)
):
    i = item_for(db, user, iid, True)
    for cls in [Note, Revision, Job]:
        db.query(cls).filter_by(item_id=iid).delete()
    db.delete(i)
    db.commit()
    return Response(status_code=204)


@router.get("/items/{iid}/image")
def image(
    iid: str, db: Session = Depends(get_db), user=Depends(get_current_active_user)
):
    i = item_for(db, user, iid)
    url = effective(i).get("image")
    if not url:
        fail("not_found", 404)
    try:
        _, content, mime = fetch_public(url, image=True)
        from PIL import Image, ImageOps
        import io

        with Image.open(io.BytesIO(content)) as source:
            if source.width * source.height > 16_000_000:
                fail("image_size", 413)
            source = ImageOps.exif_transpose(source).convert("RGB")
            source.thumbnail((1000, 1000))
            out = io.BytesIO()
            source.save(out, "WEBP", quality=78)
        return Response(
            out.getvalue(),
            media_type="image/webp",
            headers={"Cache-Control": "private, no-store"},
        )
    except (ImportFailure, OSError, ValueError):
        fail("image_unavailable", 404)
