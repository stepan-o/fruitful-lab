"""Real JWT/account lifecycle against an isolated DB; no real email or user data."""

import hashlib
from datetime import timedelta

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import account_service as service
import models
from db import Base
from routers import accounts, auth, discovery
from security import get_db, hash_password

PASSWORD = "local-test-passphrase"
NEW_PASSWORD = "a-new-local-passphrase"


@pytest.fixture
def system(monkeypatch):
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    with Session() as db:
        db.add_all(
            [
                models.User(
                    email=email,
                    full_name=email.split("@")[0],
                    hashed_password=hash_password(PASSWORD),
                    is_admin=admin,
                    is_active=True,
                    groups=groups,
                )
                for email, admin, groups in [
                    ("admin@example.com", True, []),
                    ("player@example.com", False, ["mexico-city", "contractor"]),
                    ("secondadmin@example.com", True, []),
                ]
            ]
        )
        db.commit()
    app = FastAPI()
    for router in (accounts.router, auth.router, discovery.router):
        app.include_router(router)

    def database():
        with Session() as db:
            yield db

    app.dependency_overrides[get_db] = database
    monkeypatch.setattr(service, "SessionLocal", Session)
    monkeypatch.setenv("RESEND_API_KEY", "fake-test-key")
    monkeypatch.setenv("ACCOUNT_EMAIL_FROM", "local@example.com")
    monkeypatch.setenv("ACCOUNT_PUBLIC_ORIGIN", "https://www.fruitfulab.net")
    messages = []
    monkeypatch.setattr(
        service, "send_email", lambda *message: messages.append(message)
    )
    accounts._buckets.clear()
    client = TestClient(app)

    def login(email="admin@example.com", password=PASSWORD):
        response = client.post(
            "/auth/login", data={"username": email, "password": password}
        )
        assert response.status_code == 200, response.text
        return {"Authorization": "Bearer " + response.json()["access_token"]}

    yield client, Session, login, messages
    engine.dispose()


def create_pending(client, login):
    response = client.post(
        "/admin/users",
        headers=login(),
        json={"email": "new@example.com", "full_name": "Susy"},
    )
    assert response.status_code == 201, response.text
    return response.json()


def reset(client, token, password=NEW_PASSWORD):
    return client.post(
        "/auth/password/reset", json={"token": token, "password": password}
    )


def test_admin_gate_and_role_injection(system):
    client, _, login, _ = system
    for path, method in [
        ("/admin/users", "get"),
        ("/admin/users", "post"),
        ("/admin/users/2", "patch"),
        ("/admin/users/2/setup-link", "post"),
        ("/auth/register", "post"),
    ]:
        assert getattr(client, method)(path).status_code == 401
        assert (
            getattr(client, method)(
                path, headers=login("player@example.com")
            ).status_code
            == 403
        )
    assert (
        client.post(
            "/admin/users",
            headers=login(),
            json={"email": "x@example.com", "full_name": "X", "is_admin": True},
        ).status_code
        == 422
    )
    assert (
        client.patch(
            "/admin/users/2", headers=login(), json={"groups": ["admin"]}
        ).status_code
        == 422
    )


def test_pending_setup_login_and_game_access(system):
    client, Session, login, _ = system
    result = create_pending(client, login)
    assert result["user"]["status"] == "pending"
    assert (
        client.post(
            "/auth/login",
            data={"username": "new@example.com", "password": NEW_PASSWORD},
        ).status_code
        == 401
    )
    with Session() as db:
        record = db.get(models.AccountAccessToken, result["user"]["id"])
        assert record.token_hash == hashlib.sha256(result["token"].encode()).hexdigest()
    listing = client.get("/admin/users", headers=login()).text
    assert result["token"] not in listing and "token_hash" not in listing
    assert reset(client, result["token"]).status_code == 200
    assert reset(client, result["token"]).status_code == 400
    headers = login("NEW@example.com", NEW_PASSWORD)
    assert client.get("/discovery/state", headers=headers).status_code == 200
    assert client.get("/auth/me", headers=headers).json()["groups"] == ["mexico-city"]
    assert (
        client.post(
            "/admin/users",
            headers=login(),
            json={"email": "NEW@example.com", "full_name": "Duplicate"},
        ).status_code
        == 409
    )


def test_reissue_expiry_and_admin_protection(system):
    client, Session, login, _ = system
    result = create_pending(client, login)
    uid = result["user"]["id"]
    assert (
        client.patch(
            f"/admin/users/{uid}", headers=login(), json={"is_active": True}
        ).status_code
        == 409
    )
    replacement = client.post(f"/admin/users/{uid}/setup-link", headers=login()).json()[
        "token"
    ]
    assert reset(client, result["token"]).status_code == 400
    with Session() as db:
        db.get(models.AccountAccessToken, uid).expires_at = service.now() - timedelta(
            seconds=1
        )
        db.commit()
    assert reset(client, replacement).status_code == 400
    for uid in (1, 3):
        assert (
            client.post(f"/admin/users/{uid}/setup-link", headers=login()).status_code
            == 403
        )
        assert (
            client.patch(
                f"/admin/users/{uid}", headers=login(), json={"is_active": False}
            ).status_code
            == 403
        )


def test_reset_and_pause_revoke_existing_sessions(system):
    client, _, login, _ = system
    old_session = login("player@example.com")
    token = client.post("/admin/users/2/setup-link", headers=login()).json()["token"]
    assert reset(client, token).status_code == 200
    assert client.get("/auth/me", headers=old_session).status_code == 401
    fresh = login("player@example.com", NEW_PASSWORD)
    token = client.post("/admin/users/2/setup-link", headers=login()).json()["token"]
    assert (
        client.patch(
            "/admin/users/2", headers=login(), json={"is_active": False}
        ).status_code
        == 200
    )
    assert client.get("/auth/me", headers=fresh).status_code == 401
    assert (
        client.post(
            "/auth/login",
            data={"username": "player@example.com", "password": NEW_PASSWORD},
        ).status_code
        == 401
    )
    assert reset(client, token).status_code == 400
    assert client.post("/admin/users/2/setup-link", headers=login()).status_code == 409
    assert (
        client.patch(
            "/admin/users/2", headers=login(), json={"is_active": True}
        ).status_code
        == 200
    )
    assert client.get("/auth/me", headers=fresh).status_code == 401
    login("player@example.com", NEW_PASSWORD)


def test_mail_recovery_generic_cooldown_and_password_notification(system):
    client, _, login, messages = system
    old = login("player@example.com")
    known = client.post("/auth/password/forgot", json={"email": "PLAYER@example.com"})
    unknown = client.post("/auth/password/forgot", json={"email": "nobody@example.com"})
    assert known.status_code == unknown.status_code == 202
    assert known.json() == unknown.json() == {"success": True}
    assert len(messages) == 1
    assert "https://www.fruitfulab.net/account/reset?lang=es#token=" in messages[0][2]
    token = messages[0][2].split("#token=")[1].split()[0]
    assert (
        client.post(
            "/auth/password/forgot", json={"email": "player@example.com"}
        ).status_code
        == 202
    )
    assert len(messages) == 1
    assert client.get("/auth/me", headers=old).status_code == 200
    assert reset(client, token).status_code == 200
    assert len(messages) == 2 and messages[-1][1] == "Tu contraseña cambió"
    assert client.get("/auth/me", headers=old).status_code == 401


def test_recovery_unavailable_throttle_and_paused_accounts(system, monkeypatch):
    client, _, login, messages = system
    monkeypatch.delenv("RESEND_API_KEY")
    assert (
        client.post(
            "/auth/password/forgot", json={"email": "player@example.com"}
        ).status_code
        == 503
    )
    monkeypatch.setenv("RESEND_API_KEY", "fake")
    client.patch("/admin/users/2", headers=login(), json={"is_active": False})
    for _ in range(5):
        assert (
            client.post(
                "/auth/password/forgot", json={"email": "player@example.com"}
            ).status_code
            == 202
        )
    assert not messages
    assert (
        client.post(
            "/auth/password/forgot", json={"email": "player@example.com"}
        ).status_code
        == 429
    )


def test_directory_search_pagination_and_group_preservation(system):
    client, _, login, _ = system
    headers = login()
    data = client.get("/admin/users?game_only=true", headers=headers).json()
    assert data["total"] == 1 and data["users"][0]["email"] == "player@example.com"
    assert client.get("/admin/users?search=%25", headers=headers).json()["total"] == 0
    assert client.get("/admin/users?offset=30", headers=headers).json()["users"] == []
    assert (
        client.patch(
            "/admin/users/2", headers=headers, json={"full_name": "   "}
        ).status_code
        == 422
    )
    assert (
        client.patch(
            "/admin/users/2",
            headers=headers,
            json={"full_name": "Susy", "game_member": False},
        ).status_code
        == 200
    )
    me = client.get("/auth/me", headers=login("player@example.com")).json()
    assert me["full_name"] == "Susy" and me["groups"] == ["contractor"]


def test_delivery_failure_does_not_reveal_account(system, monkeypatch, caplog):
    client, _, _, _ = system

    def failure(*args):
        raise RuntimeError("private details")

    monkeypatch.setattr(service, "send_email", failure)
    assert (
        client.post(
            "/auth/password/forgot", json={"email": "player@example.com"}
        ).status_code
        == 202
    )
    assert (
        "private details" not in caplog.text and "player@example.com" not in caplog.text
    )
