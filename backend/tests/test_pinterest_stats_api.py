import os

import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping API DB test",
)
def test_pinterest_stats_monthly_endpoint_shape():
    client = TestClient(app)

    resp = client.get("/pinterest-stats/monthly")
    assert resp.status_code == 200

    data = resp.json()
    assert isinstance(data, list)

    if data:
        row = data[0]
        # Just sanity-check the contract, not the exact values
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
