"""Administrator account controls and public password recovery; shared Lab identity."""

import hashlib
import threading
import time
from typing import Literal

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    HTTPException,
    Query,
    Request,
    Response,
)
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy import String, cast, or_
from sqlalchemy.orm import Session

import models
from account_service import (
    GAME_GROUP,
    aware,
    create_user,
    deliver_recovery,
    email_ready,
    issue_link,
    notify_password_changed,
    now,
)
from security import get_current_admin_user, get_db, hash_password

router = APIRouter(tags=["accounts"])


class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


class AccountCreate(Strict):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=60)

    @field_validator("full_name")
    @classmethod
    def name_is_not_blank(cls, value):
        if not value.strip():
            raise ValueError("Name is required")
        return value.strip()


class AccountEdit(Strict):
    full_name: str | None = Field(default=None, min_length=1, max_length=60)
    is_active: bool | None = None
    game_member: bool | None = None

    @field_validator("full_name")
    @classmethod
    def name_is_not_blank(cls, value):
        if value is not None and not value.strip():
            raise ValueError("Name is required")
        return value.strip() if value else value


class Recovery(Strict):
    email: EmailStr
    locale: Literal["es", "en"] = "es"


class Reset(Strict):
    token: str = Field(min_length=32, max_length=128, pattern=r"^[A-Za-z0-9_-]+$")
    password: str = Field(min_length=10, max_length=128)
    locale: Literal["es", "en"] = "es"


def account_json(user, access=None):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "is_active": user.is_active,
        "is_admin": user.is_admin,
        "game_member": GAME_GROUP in (user.groups or []),
        "status": "pending"
        if access and access.purpose == "setup"
        else "active"
        if user.is_active
        else "paused",
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


@router.get("/admin/users")
def list_accounts(
    response: Response,
    search: str = Query(default="", max_length=100),
    offset: int = Query(default=0, ge=0),
    game_only: bool = False,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin_user),
):
    response.headers["Cache-Control"] = "no-store"
    query = db.query(models.User)
    if search.strip():
        # Escape LIKE metacharacters so user input is a literal substring.
        term = (
            "%"
            + search.strip()
            .replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_")
            + "%"
        )
        query = query.filter(
            or_(
                models.User.email.ilike(term, escape="\\"),
                models.User.full_name.ilike(term, escape="\\"),
            )
        )
    if game_only:
        query = query.filter(cast(models.User.groups, String).contains('"mexico-city"'))
    total, users = (
        query.count(),
        query.order_by(models.User.id.desc()).offset(offset).limit(30).all(),
    )
    ids = [u.id for u in users]
    access = (
        {
            r.user_id: r
            for r in db.query(models.AccountAccessToken)
            .filter(models.AccountAccessToken.user_id.in_(ids))
            .all()
        }
        if ids
        else {}
    )
    return {
        "users": [account_json(u, access.get(u.id)) for u in users],
        "total": total,
        "offset": offset,
        "limit": 30,
        "email_ready": email_ready(),
        "me": admin.id,
    }


@router.post("/admin/users", status_code=201)
def add_account(
    payload: AccountCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin_user),
):
    user = create_user(db, str(payload.email), payload.full_name)
    token, expiry = issue_link(db, user, purpose="setup", actor=admin.id)
    db.commit()
    return {
        "user": account_json(user, db.get(models.AccountAccessToken, user.id)),
        "token": token,
        "expires_at": expiry,
    }


def editable(db, user_id, admin):
    user = db.query(models.User).filter_by(id=user_id).with_for_update().first()
    if not user:
        raise HTTPException(404, "account_not_found")
    return user


@router.patch("/admin/users/{user_id}")
def edit_account(
    user_id: int,
    payload: AccountEdit,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin_user),
):
    user = editable(db, user_id, admin)
    if payload.is_active is not None:
        if user.is_admin or user.id == admin.id:
            raise HTTPException(403, "protected_admin")
        pending = db.get(models.AccountAccessToken, user.id)
        if payload.is_active and pending and pending.purpose == "setup":
            raise HTTPException(409, "password_setup_required")
        user.is_active = payload.is_active
        user.session_version += 1
        if pending:
            db.delete(pending)
    if payload.full_name is not None:
        user.full_name = payload.full_name
    if payload.game_member is not None:
        groups = [g for g in (user.groups or []) if g != GAME_GROUP]
        user.groups = groups + ([GAME_GROUP] if payload.game_member else [])
    db.commit()
    return account_json(user, db.get(models.AccountAccessToken, user.id))


@router.post("/admin/users/{user_id}/setup-link")
def access_link(
    user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_user)
):
    user = editable(db, user_id, admin)
    # Administrators recover their own accounts through their inbox, not a shared admin screen.
    if user.is_admin:
        raise HTTPException(403, "protected_admin")
    previous = db.get(models.AccountAccessToken, user.id)
    purpose = "setup" if previous and previous.purpose == "setup" else "reset"
    if not user.is_active and purpose != "setup":
        raise HTTPException(409, "account_paused")
    token, expiry = issue_link(db, user, purpose=purpose, actor=admin.id)
    db.commit()
    return {"token": token, "expires_at": expiry}


# Bounded process-level edge throttle + database-backed per-account resend cooldown.
# Deployments with many workers should additionally use their edge rate limit.
_buckets: dict[str, list[float]] = {}
_lock = threading.Lock()


def throttle(request, email):
    moment = time.monotonic()
    raw_keys = [
        ("email:" + email.lower(), 5),
        ("ip:" + (request.client.host if request.client else "unknown"), 60),
    ]
    with _lock:
        for key in list(_buckets):
            if not _buckets[key] or _buckets[key][-1] < moment - 900:
                del _buckets[key]
        if len(_buckets) > 10_000:
            raise HTTPException(429, "try_later")
        keys = [
            (hashlib.sha256(k.encode()).hexdigest(), limit) for k, limit in raw_keys
        ]
        for key, limit in keys:
            _buckets[key] = [t for t in _buckets.get(key, []) if t > moment - 900]
            if len(_buckets[key]) >= limit:
                raise HTTPException(429, "try_later")
        for key, _ in keys:
            _buckets[key].append(moment)


@router.post("/auth/password/forgot", status_code=202)
def forgot_password(payload: Recovery, request: Request, tasks: BackgroundTasks):
    if not email_ready():
        raise HTTPException(503, "email_unavailable")
    throttle(request, str(payload.email))
    tasks.add_task(deliver_recovery, str(payload.email).strip().lower(), payload.locale)
    return {"success": True}


@router.post("/auth/password/reset")
def reset_password(
    payload: Reset, tasks: BackgroundTasks, db: Session = Depends(get_db)
):
    digest = hashlib.sha256(payload.token.encode()).hexdigest()
    found = (
        db.query(models.AccountAccessToken.user_id).filter_by(token_hash=digest).first()
    )
    if not found:
        raise HTTPException(400, "reset_link_invalid")
    # All issue/consume/disable operations lock user first, then re-read the token.
    user = db.query(models.User).filter_by(id=found.user_id).with_for_update().first()
    access = (
        db.query(models.AccountAccessToken)
        .filter_by(user_id=found.user_id, token_hash=digest)
        .populate_existing()
        .first()
    )
    if (
        not user
        or not access
        or aware(access.expires_at) <= now()
        or (not user.is_active and access.purpose != "setup")
    ):
        raise HTTPException(400, "reset_link_invalid")
    user.hashed_password = hash_password(payload.password)
    user.session_version += 1
    if access.purpose == "setup":
        user.is_active = True
    db.delete(access)
    db.commit()
    tasks.add_task(notify_password_changed, user.email, payload.locale)
    return {"success": True}
