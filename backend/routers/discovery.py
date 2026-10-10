"""Authenticated field records and bounded private-group gameplay.

All mutations recheck authority under database row locks. Scores are derived
from unique records and settled challenges; the browser cannot submit totals.
"""

import base64
import binascii
import copy
import io
import secrets
import time
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response
from PIL import Image, ImageOps, UnidentifiedImageError
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, defer

import models
from account_service import create_user
from discovery_models import DiscoveryGroup, DiscoveryProfile, DiscoveryRecord
from security import get_current_active_user, get_db

router = APIRouter(prefix="/discovery", tags=["discovery"])
CATEGORIES = {"art", "food", "books", "nature", "history"}
REWARDS = {
    "orientation": 15,
    **{
        f"city-{x}": 20
        for x in ["lake", "causeway", "south", "metro", "cable", "airport"]
    },
    **{f"nahuatl-{x}": 10 for x in ["atl", "tepetl", "xochitl", "milli", "ehecatl"]},
    "nahuatl-xochimilco": 20,
    "nahuatl-xochitepec": 20,
}
Image.MAX_IMAGE_PIXELS = 16_000_000


def fail(code: str, status: int = 400):
    raise HTTPException(status_code=status, detail=code)


def clock():
    return int(time.time() * 1000)


def identity(user):
    return {"id": str(user.id), "name": (user.full_name or "Explorador").strip()[:60]}


class Registration(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr
    password: str = Field(min_length=10, max_length=128)
    full_name: str = Field(min_length=1, max_length=60)


@router.post("/register", status_code=201)
def register(payload: Registration, db: Session = Depends(get_db)):
    create_user(db, str(payload.email), payload.full_name, payload.password)
    db.commit()
    return {"success": True}


def profile(db, user):
    p = db.query(DiscoveryProfile).filter_by(user_id=user.id).with_for_update().first()
    if p is None:
        p = DiscoveryProfile(
            user_id=user.id, data={"groups": [], "learning": {}, "goal": None}
        )
        db.add(p)
        try:
            db.flush()
        except IntegrityError:
            db.rollback()
            p = (
                db.query(DiscoveryProfile)
                .filter_by(user_id=user.id)
                .with_for_update()
                .one()
            )
    return p


def member_group(db, group_id, user):
    group = db.query(DiscoveryGroup).filter_by(id=group_id).with_for_update().first()
    if not group or str(user.id) not in [m["id"] for m in group.data["members"]]:
        fail("group_forbidden", 403)
    return group


def expire(data, now):
    for challenge in data["challenges"]:
        if challenge["deadline"] and challenge["deadline"] <= now:
            if (
                challenge["together"]
                and challenge["status"] in {"active", "submitted", "clarification"}
                and not all(
                    m in challenge["evidence"]
                    for m in [challenge["sender"], challenge["target"]]
                )
            ):
                challenge["status"] = "incomplete"
            elif challenge["status"] == "active":
                challenge["status"] = "expired"
    data["blocks"] = [b for b in data["blocks"] if b["until"] > now]


def record_json(record, public=False):
    data = {
        k: v
        for k, v in record.data.items()
        if not public or k not in {"groupId", "challengeId"}
    }
    return {
        **data,
        "publication": record.publication,
        "photo": f"/api/mexico-city/{'public-photos' if record.publication == 'approved' else 'photos'}/{record.id}",
    }


def public_ranks(db):
    # Aggregate the complete approved collection; the map feed is bounded.
    rows = (
        db.query(models.User.id, models.User.full_name, func.count(DiscoveryRecord.id))
        .join(DiscoveryRecord, DiscoveryRecord.owner_id == models.User.id)
        .filter(DiscoveryRecord.publication == "approved")
        .group_by(models.User.id, models.User.full_name)
        .order_by(func.count(DiscoveryRecord.id).desc(), models.User.id)
        .limit(100)
        .all()
    )
    return [
        {"id": str(uid), "name": (name or "Explorador").strip()[:60], "count": count}
        for uid, name, count in rows
    ]


def snapshot(db, user):
    p = profile(db, user)
    groups = (
        db.query(DiscoveryGroup)
        .filter(DiscoveryGroup.id.in_(p.data["groups"]))
        .order_by(DiscoveryGroup.id)
        .with_for_update()
        .all()
    )
    now = clock()
    for group in groups:
        data = copy.deepcopy(group.data)
        expire(data, now)
        group.data = data
    ids = [g.id for g in groups]
    records = (
        db.query(DiscoveryRecord)
        .options(defer(DiscoveryRecord.photo))
        .filter(
            (DiscoveryRecord.owner_id == user.id) | DiscoveryRecord.group_id.in_(ids)
        )
        .all()
    )
    public = (
        db.query(DiscoveryRecord)
        .options(defer(DiscoveryRecord.photo))
        .filter_by(publication="approved")
        .limit(300)
        .all()
    )
    moderation = (
        db.query(DiscoveryRecord)
        .options(defer(DiscoveryRecord.photo))
        .filter_by(publication="pending")
        .limit(100)
        .all()
        if user.is_admin
        else []
    )
    result = {
        "me": {**identity(user), "admin": bool(user.is_admin), "email": user.email},
        "learning": p.data["learning"],
        "goal": p.data.get("goal"),
        "groups": [{**g.data, "id": g.id, "invite": g.invite} for g in groups],
        "records": [record_json(r) for r in records],
        "publicRecords": [record_json(r, public=True) for r in public],
        "publicRanks": public_ranks(db),
        "moderation": [record_json(r) for r in moderation],
        "serverTime": now,
    }
    db.commit()
    return result


@router.get("/state")
def state(db: Session = Depends(get_db), user=Depends(get_current_active_user)):
    return snapshot(db, user)


@router.get("/community")
def community(db: Session = Depends(get_db)):
    return {
        "ranks": public_ranks(db),
        "records": [
            record_json(r, public=True)
            for r in db.query(DiscoveryRecord)
            .options(defer(DiscoveryRecord.photo))
            .filter_by(publication="approved")
            .limit(300)
            .all()
        ],
    }


class Command(BaseModel):
    model_config = ConfigDict(extra="forbid")
    kind: Literal[
        "create_group",
        "join_group",
        "challenge",
        "accept",
        "decline",
        "forfeit",
        "record",
        "review",
        "block",
        "learn",
        "goal",
        "publish",
        "moderate",
    ]
    id: UUID
    groupId: str | None = None
    target: str | None = None
    challengeId: str | None = None
    recordId: str | None = None
    title: str = Field(default="", max_length=120)
    category: str = "art"
    note: str = Field(default="", max_length=1200)
    place: str = Field(default="", max_length=160)
    lat: float | None = Field(default=None, ge=-90, le=90, allow_inf_nan=False)
    lng: float | None = Field(default=None, ge=-180, le=180, allow_inf_nan=False)
    photo: str = Field(default="", max_length=1_400_000)
    invite: str = Field(default="", max_length=64)
    duration: int = 1440
    reward: int = 100
    loss: int = 25
    together: bool = False
    decision: Literal["confirm", "clarify", "reject"] = "confirm"
    publish: bool = False
    learningId: str | None = None
    goalId: str | None = None


def normalize_photo(value):
    try:
        prefix, encoded = value.split(",", 1)
        if prefix not in {
            "data:image/jpeg;base64",
            "data:image/png;base64",
            "data:image/webp;base64",
        }:
            fail("photo_type")
        raw = base64.b64decode(encoded, validate=True)
        if len(raw) > 1_000_000:
            fail("photo_size")
        with Image.open(io.BytesIO(raw)) as original:
            if original.width * original.height > 16_000_000:
                fail("photo_size")
            image = ImageOps.exif_transpose(original).convert("RGB")
            image.thumbnail((1280, 1280))
            output = io.BytesIO()
            image.save(output, format="JPEG", quality=78, optimize=True)
        if output.tell() > 600_000:
            fail("photo_size")
        return output.getvalue()
    except (
        ValueError,
        binascii.Error,
        UnidentifiedImageError,
        OSError,
        Image.DecompressionBombError,
    ):
        fail("photo_invalid")


@router.post("/command")
def command(
    c: Command, db: Session = Depends(get_db), user=Depends(get_current_active_user)
):
    p = profile(db, user)
    uid, cid, now = str(user.id), str(c.id), clock()
    pd = copy.deepcopy(p.data)
    if c.kind == "create_group":
        existing = db.get(DiscoveryGroup, cid)
        if existing:
            member_group(db, cid, user)
        else:
            if len(pd["groups"]) >= 8 or not c.title.strip():
                fail("group_limit")
            group = DiscoveryGroup(
                id=cid,
                invite=secrets.token_urlsafe(18),
                data={
                    "name": c.title.strip(),
                    "members": [identity(user)],
                    "challenges": [],
                    "blocks": [],
                },
            )
            db.add(group)
            pd["groups"].append(cid)
    elif c.kind == "join_group":
        group = (
            db.query(DiscoveryGroup)
            .filter_by(invite=c.invite.strip())
            .with_for_update()
            .first()
        )
        if not group:
            fail("invite_invalid", 404)
        data = copy.deepcopy(group.data)
        if uid not in [m["id"] for m in data["members"]]:
            if len(data["members"]) >= 8 or len(pd["groups"]) >= 8:
                fail("group_limit")
            data["members"].append(identity(user))
            group.data = data
            pd["groups"].append(group.id)
    elif c.kind in {"goal", "learn"}:
        if c.kind == "learn":
            if c.learningId not in REWARDS:
                fail("learning_invalid")
            pd["learning"][c.learningId] = True
        else:
            if c.goalId not in {None, "mural", "books", "nature", "taco", "history"}:
                fail("goal_invalid")
            pd["goal"] = c.goalId
    elif c.kind == "record":
        existing = db.get(DiscoveryRecord, cid)
        if existing:
            if existing.owner_id != user.id:
                fail("record_forbidden", 403)
            return snapshot(db, user)
        if (
            c.category not in CATEGORIES
            or not c.title.strip()
            or not c.place.strip()
            or c.lat is None
            or c.lng is None
        ):
            fail("record_required")
        if db.query(DiscoveryRecord).filter_by(owner_id=user.id).count() >= 200:
            fail("record_limit")
        photo = normalize_photo(c.photo)
        group = member_group(db, c.groupId, user) if c.challengeId else None
        if group:
            data = copy.deepcopy(group.data)
            expire(data, now)
            ch = next((x for x in data["challenges"] if x["id"] == c.challengeId), None)
            if not ch or uid not in (
                [ch["sender"], ch["target"]] if ch["together"] else [ch["target"]]
            ):
                fail("challenge_forbidden", 403)
            if (
                ch["status"] not in {"active", "submitted", "clarification"}
                or ch["category"] != c.category
            ):
                fail("challenge_not_active")
            existing_evidence = ch["evidence"].get(uid)
            if existing_evidence and existing_evidence["status"] != "clarification":
                fail("already_submitted", 409)
            if not existing_evidence and ch["deadline"] <= now:
                fail("challenge_expired", 409)
            ch["evidence"][uid] = {
                "recordId": cid,
                "status": "submitted",
                "submittedAt": now,
                "feedback": "",
            }
            # On-time evidence awaits review; together rewards require both on time.
            ch["status"] = "submitted"
            group.data = data
        goal_categories = {
            "mural": "art",
            "books": "books",
            "nature": "nature",
            "taco": "food",
            "history": "history",
        }
        completed_goal = (
            pd.get("goal")
            if not c.challengeId and goal_categories.get(pd.get("goal")) == c.category
            else None
        )
        record = DiscoveryRecord(
            id=cid,
            owner_id=user.id,
            group_id=group.id if group else None,
            publication="pending" if c.publish else "private",
            photo=photo,
            data={
                "id": cid,
                "owner": uid,
                "name": identity(user)["name"],
                "title": c.title.strip(),
                "category": c.category,
                "note": c.note.strip(),
                "place": c.place.strip(),
                "lat": c.lat,
                "lng": c.lng,
                "createdAt": now,
                "goalId": completed_goal,
                "challengeId": c.challengeId,
                "groupId": group.id if group else None,
            },
        )
        db.add(record)
        if completed_goal:
            pd["goal"] = None
    elif c.kind in {"publish", "moderate"}:
        record = (
            db.query(DiscoveryRecord).filter_by(id=c.recordId).with_for_update().first()
        )
        if not record:
            fail("record_missing", 404)
        if c.kind == "publish":
            if record.owner_id != user.id:
                fail("record_forbidden", 403)
            if record.publication in {"private", "rejected"}:
                record.publication = "pending"
        else:
            if not user.is_admin or record.owner_id == user.id:
                fail("review_forbidden", 403)
            if record.publication == "pending":
                record.publication = (
                    "approved" if c.decision == "confirm" else "rejected"
                )
    else:
        group = member_group(db, c.groupId, user)
        data = copy.deepcopy(group.data)
        expire(data, now)
        members = [m["id"] for m in data["members"]]
        if c.kind in {"challenge", "block"}:
            if (
                c.target not in members
                or c.target == uid
                or c.category not in CATEGORIES
            ):
                fail("target_invalid")
            if c.kind == "block":
                if any(b["id"] == cid and b["sender"] == uid for b in data["blocks"]):
                    db.commit()
                    return snapshot(db, user)
                if any(b["sender"] == uid for b in data["blocks"]) or any(
                    ch["target"] == c.target
                    and ch["category"] == c.category
                    and ch["status"] in {"active", "submitted", "clarification"}
                    for ch in data["challenges"]
                ):
                    fail("block_conflict", 409)
                data["blocks"].append(
                    {
                        "id": cid,
                        "sender": uid,
                        "target": c.target,
                        "category": c.category,
                        "until": now + 86_400_000,
                    }
                )
            elif not any(ch["id"] == cid for ch in data["challenges"]):
                if (
                    len(data["challenges"]) >= 200
                    or sum(
                        ch["sender"] == uid
                        and ch["status"]
                        in {"offered", "active", "submitted", "clarification"}
                        for ch in data["challenges"]
                    )
                    >= 3
                ):
                    fail("challenge_limit")
                if (
                    c.duration not in {10, 60, 1440}
                    or c.reward not in {50, 100, 150}
                    or c.loss not in {0, 25, 50}
                    or not c.title.strip()
                ):
                    fail("challenge_invalid")
                data["challenges"].append(
                    {
                        "id": cid,
                        "sender": uid,
                        "target": c.target,
                        "title": c.title.strip(),
                        "category": c.category,
                        "duration": c.duration,
                        "reward": c.reward,
                        "loss": 0 if c.together else c.loss,
                        "together": c.together,
                        "status": "offered",
                        "deadline": None,
                        "evidence": {},
                    }
                )
        else:
            ch = next((x for x in data["challenges"] if x["id"] == c.challengeId), None)
            if not ch:
                fail("challenge_missing", 404)
            if c.kind in {"accept", "decline", "forfeit"}:
                if ch["target"] != uid:
                    fail("challenge_forbidden", 403)
                if c.kind == "accept" and ch["status"] == "offered":
                    if any(
                        b["target"] == uid and b["category"] == ch["category"]
                        for b in data["blocks"]
                    ):
                        fail("category_blocked", 409)
                    ch["status"], ch["deadline"] = (
                        "active",
                        now + ch["duration"] * 60_000,
                    )
                elif c.kind == "decline" and ch["status"] == "offered":
                    ch["status"] = "declined"
                elif c.kind == "forfeit" and ch["status"] == "active":
                    ch["status"] = "forfeited"
            elif c.kind == "review":
                if ch["status"] not in {"submitted", "clarification", "confirmed"}:
                    fail("challenge_not_active", 409)
                author = c.target
                if (
                    author == uid
                    or author not in [ch["sender"], ch["target"]]
                    or uid not in [ch["sender"], ch["target"]]
                    or (not ch["together"] and uid != ch["sender"])
                ):
                    fail("review_forbidden", 403)
                evidence = ch["evidence"].get(author)
                if not evidence:
                    fail("evidence_missing")
                if evidence["status"] != "confirmed":
                    evidence["status"] = (
                        "confirmed" if c.decision == "confirm" else "clarification"
                    )
                    evidence["feedback"] = c.note.strip()
                    required = (
                        [ch["sender"], ch["target"]]
                        if ch["together"]
                        else [ch["target"]]
                    )
                    ch["status"] = (
                        "confirmed"
                        if all(
                            ch["evidence"].get(m, {}).get("status") == "confirmed"
                            for m in required
                        )
                        else "clarification"
                        if c.decision != "confirm"
                        else "submitted"
                    )
        group.data = data
    p.data = pd
    # Release the command's group lock before a snapshot locks all groups in
    # sorted order. This avoids reverse lock ordering across two groups.
    db.commit()
    return snapshot(db, user)


@router.get("/photos/{record_id}")
def photo(
    record_id: str, db: Session = Depends(get_db), user=Depends(get_current_active_user)
):
    record = db.get(DiscoveryRecord, record_id)
    if not record:
        fail("record_missing", 404)
    allowed = (
        record.owner_id == user.id
        or record.publication == "approved"
        or (user.is_admin and record.publication == "pending")
    )
    if not allowed and record.group_id:
        member_group(db, record.group_id, user)
        allowed = True
    if not allowed:
        fail("record_forbidden", 403)
    return Response(
        record.photo,
        media_type="image/jpeg",
        headers={
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )


@router.get("/public-photos/{record_id}")
def public_photo(record_id: str, db: Session = Depends(get_db)):
    record = db.get(DiscoveryRecord, record_id)
    if not record or record.publication != "approved":
        fail("record_missing", 404)
    return Response(
        record.photo,
        media_type="image/jpeg",
        headers={"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"},
    )
