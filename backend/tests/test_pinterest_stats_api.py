import os

import pytest
from fastapi.testclient import TestClient

from main import app

ADMIN_EMAIL_ENV = "TEST_ADMIN_EMAIL"
ADMIN_PASSWORD_ENV = "TEST_ADMIN_PASSWORD"


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping API DB test",
)
def test_pinterest_stats_monthly_endpoint_shape():
    client = TestClient(app)

    admin_email = os.getenv(ADMIN_EMAIL_ENV)
    admin_password = os.getenv(ADMIN_PASSWORD_ENV)

    # HARD FAIL if admin creds aren’t configured
    assert admin_email, f"{ADMIN_EMAIL_ENV} must be set for this test"
    assert admin_password, f"{ADMIN_PASSWORD_ENV} must be set for this test"

    # 1) Login as existing ADMIN user
    login_resp = client.post(
        "/auth/login",
        data={"username": admin_email, "password": admin_password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == 200, login_resp.text
    token = login_resp.json()["access_token"]

    # 2) Call the protected endpoint with Authorization header
    resp = client.get(
        "/pinterest-stats/monthly",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 200, resp.text

    data = resp.json()
    assert isinstance(data, list)

    if data:
        row = data[0]
        for key in [
            "id",
            "calendar_month",
            "impressions",
            "engagements",
            "outbound_clicks",
            "saves",
            "created_at",
            "updated_at",
        ]:
            assert key in row
