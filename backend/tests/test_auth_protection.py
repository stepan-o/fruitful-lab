import os

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)

ADMIN_EMAIL_ENV = "TEST_ADMIN_EMAIL"
ADMIN_PASSWORD_ENV = "TEST_ADMIN_PASSWORD"
USER_EMAIL_ENV = "TEST_USER_EMAIL"          # non-admin test user
USER_PASSWORD_ENV = "TEST_USER_PASSWORD"    # non-admin test user


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping auth protection tests",
)
def test_stats_endpoint_requires_auth():
    resp = client.get("/pinterest-stats/monthly")
    assert resp.status_code == 401
    body = resp.json()
    assert body.get("detail") in (
        "Not authenticated",
        "Could not validate credentials",
    )


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping auth protection tests",
)
def test_stats_endpoint_denies_non_admin_user():
    """
    Non-admin user should NOT be able to access the admin-only stats endpoint.

    Uses a pre-existing non-admin test account:
      TEST_USER_EMAIL / TEST_USER_PASSWORD
    """

    user_email = os.getenv(USER_EMAIL_ENV)
    user_password = os.getenv(USER_PASSWORD_ENV)

    # HARD FAIL if non-admin test creds aren’t configured
    assert user_email, f"{USER_EMAIL_ENV} must be set for this test"
    assert user_password, f"{USER_PASSWORD_ENV} must be set for this test"

    # Login as NON-ADMIN user
    login_resp = client.post(
        "/auth/login",
        data={"username": user_email, "password": user_password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == 200, login_resp.text
    token = login_resp.json()["access_token"]

    # Attempt to hit ADMIN-ONLY endpoint
    stats_resp = client.get(
        "/pinterest-stats/monthly",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert stats_resp.status_code == 403, stats_resp.text
    assert stats_resp.json().get("detail") == "Admin access required"


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping auth protection tests",
)
def test_stats_endpoint_allows_admin_user():
    """
    Admin user SHOULD be able to access the admin-only stats endpoint.

    Uses a pre-existing admin test account:
      TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD
    """

    admin_email = os.getenv(ADMIN_EMAIL_ENV)
    admin_password = os.getenv(ADMIN_PASSWORD_ENV)

    # HARD FAIL if these aren’t configured – this is a test env misconfig
    assert admin_email, f"{ADMIN_EMAIL_ENV} must be set for admin tests"
    assert admin_password, f"{ADMIN_PASSWORD_ENV} must be set for admin tests"

    login_resp = client.post(
        "/auth/login",
        data={"username": admin_email, "password": admin_password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == 200, login_resp.text
    token = login_resp.json()["access_token"]

    stats_resp = client.get(
        "/pinterest-stats/monthly",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert stats_resp.status_code == 200, stats_resp.text

    data = stats_resp.json()
    assert isinstance(data, list)
