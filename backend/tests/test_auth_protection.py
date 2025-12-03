# backend/tests/test_auth_protection.py

import os
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


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
def test_stats_endpoint_allows_authenticated_user():
    # 1) Register a unique user
    email = f"testuser_{uuid4().hex}@example.com"
    password = "super-secret-password"

    register_resp = client.post(
        "/auth/register",
        json={
            "email": email,
            "full_name": "Test User",
            "password": password,
            "is_active": True,
        },
    )
    assert register_resp.status_code == 200, register_resp.text

    # 2) Login to get token
    login_resp = client.post(
        "/auth/login",
        data={"username": email, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == 200, login_resp.text
    token = login_resp.json()["access_token"]

    # 3) Call protected endpoint with Authorization header
    stats_resp = client.get(
        "/pinterest-stats/monthly",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert stats_resp.status_code == 200, stats_resp.text

    data = stats_resp.json()
    assert isinstance(data, list)
