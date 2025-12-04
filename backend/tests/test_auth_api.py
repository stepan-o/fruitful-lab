# backend/tests/test_auth_api.py

import os

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

ADMIN_EMAIL_ENV = "TEST_ADMIN_EMAIL"
ADMIN_PASSWORD_ENV = "TEST_ADMIN_PASSWORD"
USER_EMAIL_ENV = "TEST_USER_EMAIL"
USER_PASSWORD_ENV = "TEST_USER_PASSWORD"


def _require_env(name: str) -> str:
    """Fetch an env var or HARD FAIL the test suite if missing."""
    value = os.getenv(name)
    assert value, f"{name} must be set for auth API tests"
    return value


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping auth API tests",
)
def test_login_and_me_admin_user():
    """
    Happy path for an ADMIN user:
    - Login with correct credentials
    - /auth/me returns expected fields and is_admin == True
    """
    email = _require_env(ADMIN_EMAIL_ENV)
    password = _require_env(ADMIN_PASSWORD_ENV)

    # Login
    login_resp = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == 200, login_resp.text
    token = login_resp.json()["access_token"]

    # /auth/me
    me_resp = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200, me_resp.text
    me_data = me_resp.json()

    assert me_data["email"] == email
    assert me_data["is_active"] is True
    assert me_data["is_admin"] is True


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping auth API tests",
)
def test_login_and_me_non_admin_user():
    """
    Happy path for a NON-ADMIN user:
    - Login with correct credentials
    - /auth/me returns expected fields and is_admin == False
    """
    email = _require_env(USER_EMAIL_ENV)
    password = _require_env(USER_PASSWORD_ENV)

    # Login
    login_resp = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == 200, login_resp.text
    token = login_resp.json()["access_token"]

    # /auth/me
    me_resp = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert me_resp.status_code == 200, me_resp.text
    me_data = me_resp.json()

    assert me_data["email"] == email
    assert me_data["is_active"] is True
    assert me_data["is_admin"] is False


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping auth API tests",
)
def test_login_wrong_password_rejected():
    """
    If password is wrong, login should return 401.

    Uses the non-admin test account as the target.
    """
    email = _require_env(USER_EMAIL_ENV)
    wrong_password = "this-password-is-definitely-wrong"

    login_resp = client.post(
        "/auth/login",
        data={"username": email, "password": wrong_password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == 401
    body = login_resp.json()
    assert "Incorrect email or password" in body.get("detail", "")
