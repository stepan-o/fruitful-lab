"""Shared account creation, one-time access links and transactional email."""

import hashlib
import json
import logging
import os
import secrets
from datetime import UTC, datetime, timedelta
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError

import models
from db import SessionLocal
from security import hash_password

log = logging.getLogger(__name__)
GAME_GROUP = "mexico-city"


def now():
    return datetime.now(UTC)


def aware(value):
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value


def find_user(db, email, *, lock=False):
    query = db.query(models.User).filter(
        func.lower(models.User.email) == email.strip().lower()
    )
    return (query.with_for_update() if lock else query).first()


def create_user(db, email, name, password=None, *, groups=None):
    email = email.strip().lower()
    if not name.strip():
        raise HTTPException(422, "name_required")
    if find_user(db, email):
        raise HTTPException(409, "account_exists")
    user = models.User(
        email=email,
        full_name=name.strip(),
        hashed_password=hash_password(password or secrets.token_urlsafe(48)),
        is_active=password is not None,
        is_admin=False,
        groups=groups if groups is not None else [GAME_GROUP],
        session_version=0,
    )
    db.add(user)
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "account_exists") from None
    return user


def issue_link(db, user, *, purpose="reset", actor=None):
    # Caller holds the user row lock. One link per account; reissue revokes the old one.
    token = secrets.token_urlsafe(48)
    record = db.get(models.AccountAccessToken, user.id)
    if record is None:
        record = models.AccountAccessToken(user_id=user.id)
        db.add(record)
    record.token_hash = hashlib.sha256(token.encode()).hexdigest()
    record.purpose = purpose
    record.created_at = now()
    record.expires_at = now() + timedelta(hours=24 if purpose == "setup" else 1)
    record.created_by = actor
    db.flush()
    return token, record.expires_at


def reset_url(token, locale="es"):
    origin = os.getenv("ACCOUNT_PUBLIC_ORIGIN", "https://www.fruitfulab.net").rstrip(
        "/"
    )
    parsed = urlparse(origin)
    if (
        not parsed.hostname
        or (
            parsed.scheme != "https"
            and not (
                parsed.scheme == "http"
                and parsed.hostname in {"localhost", "127.0.0.1"}
            )
        )
        or parsed.path
        or parsed.query
        or parsed.fragment
        or parsed.username
    ):
        raise RuntimeError("Invalid ACCOUNT_PUBLIC_ORIGIN")
    return f"{origin}/account/reset?lang={locale}#token={token}"


def email_ready():
    return bool(os.getenv("RESEND_API_KEY") and os.getenv("ACCOUNT_EMAIL_FROM"))


def send_email(email, subject, text):
    # Values and provider responses are never printed. Keys belong on the backend only.
    payload = json.dumps(
        {
            "from": os.environ["ACCOUNT_EMAIL_FROM"],
            "to": [email],
            "subject": subject,
            "text": text,
        }
    ).encode()
    request = Request(
        "https://api.resend.com/emails",
        data=payload,
        method="POST",
        headers={
            "Authorization": f"Bearer {os.environ['RESEND_API_KEY']}",
            "Content-Type": "application/json",
            "User-Agent": "FruitfulLab/1.0",
        },
    )
    with urlopen(request, timeout=15) as response:
        if response.status not in {200, 201, 202}:
            raise RuntimeError("Email delivery rejected")


def deliver_recovery(email, locale):
    # Deferred for identical public responses/timing for unknown and registered email.
    with SessionLocal() as db:
        try:
            user = find_user(db, email, lock=True)
            if not user:
                return
            previous = db.get(models.AccountAccessToken, user.id)
            pending = previous is not None and previous.purpose == "setup"
            if not user.is_active and not pending:
                return  # A password reset cannot re-enable a suspended account.
            if previous and aware(previous.created_at) > now() - timedelta(seconds=60):
                return
            token, _ = issue_link(db, user, purpose="setup" if pending else "reset")
            link = reset_url(token, locale)
            db.commit()
            es = locale == "es"
            send_email(
                user.email,
                "Recupera tu cuenta de Fruitful Lab"
                if es
                else "Recover your Fruitful Lab account",
                (
                    "Recibimos una solicitud para elegir una contraseña. Abre este enlace privado:\n\n"
                    if es
                    else "We received a request to choose a password. Open this private link:\n\n"
                )
                + link
                + (
                    "\n\nEl enlace sirve una sola vez y vence en "
                    + ("24 horas." if pending else "una hora.")
                    + " Si no lo pediste, puedes ignorar este correo.\n\nMexico city discovery game · Fruitful Lab"
                    if es
                    else "\n\nThis one-time link expires in "
                    + ("24 hours." if pending else "one hour.")
                    + " If you did not request it, ignore this email.\n\nMexico city discovery game · Fruitful Lab"
                ),
            )
        except Exception:
            db.rollback()
            log.error(
                "Account recovery delivery failed; check database and email provider configuration"
            )


def notify_password_changed(email, locale):
    if not email_ready():
        return
    try:
        send_email(
            email,
            "Tu contraseña cambió" if locale == "es" else "Your password changed",
            "Tu contraseña de Fruitful Lab cambió. Cerramos las sesiones anteriores. Si no fuiste tú, solicita un nuevo enlace de recuperación."
            if locale == "es"
            else "Your Fruitful Lab password changed. Previous sessions have been signed out. If this was not you, request a new recovery link.",
        )
    except Exception:
        log.error("Account password-change notification failed")
