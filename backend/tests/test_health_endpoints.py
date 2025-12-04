from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_ok():
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok"


def test_health_ok():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json().get("status") == "ok"
