"""Isolated two-player API stories; never touch the configured app database."""

import base64
import io
from uuid import uuid4
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from PIL import Image
from db import Base
import models
from routers import discovery
from discovery_models import DiscoveryRecord
from security import get_db, get_current_active_user


@pytest.fixture
def game():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    users = [
        models.User(
            email=f"player{i}@example.test",
            full_name=name,
            hashed_password="test",
            is_active=True,
            is_admin=i == 3,
            groups=[],
        )
        for i, name in enumerate(["Susy", "Stepan", "Other", "Moderator"])
    ]
    db.add_all(users)
    db.commit()
    actor = [users[0]]
    app = FastAPI()
    app.include_router(discovery.router)
    app.dependency_overrides[get_db] = lambda: db
    app.dependency_overrides[get_current_active_user] = lambda: actor[0]
    client = TestClient(app)

    def act(index):
        actor[0] = users[index]

    def send(kind, status=200, **data):
        if kind == "record":
            data = {"lat": 19.41, "lng": -99.16, **data}
        response = client.post(
            "/discovery/command", json={"kind": kind, "id": str(uuid4()), **data}
        )
        assert response.status_code == status, response.text
        return response.json()

    yield client, db, users, act, send
    db.close()
    engine.dispose()


def picture():
    out = io.BytesIO()
    Image.new("RGB", (24, 24), "green").save(out, "JPEG")
    return "data:image/jpeg;base64," + base64.b64encode(out.getvalue()).decode()


def pair(game):
    _, _, users, act, send = game
    result = send("create_group", title="Susy + Stepan")
    group = result["groups"][0]
    act(1)
    send("join_group", invite=group["invite"])
    act(0)
    result = send(
        "challenge",
        groupId=group["id"],
        target=str(users[1].id),
        title="A mural",
        category="art",
        reward=100,
        loss=25,
        duration=10,
    )
    return group["id"], result["groups"][0]["challenges"][0]["id"]


def test_photo_review_rewards_authority_and_once_only(game, monkeypatch):
    client, db, users, act, send = game
    gid, cid = pair(game)
    act(2)
    send("accept", status=403, groupId=gid, challengeId=cid)
    db.rollback()
    act(1)
    state = send("accept", groupId=gid, challengeId=cid)
    deadline = state["groups"][0]["challenges"][0]["deadline"]
    rid = str(uuid4())
    record = dict(
        id=rid,
        title="A mural",
        category="art",
        place="Roma",
        lat=19.41,
        lng=-99.16,
        photo=picture(),
        groupId=gid,
        challengeId=cid,
    )
    state = send("record", **record)
    assert len(state["records"]) == 1
    state = send("record", **record)
    assert len(state["records"]) == 1
    send("review", status=403, groupId=gid, challengeId=cid, target=str(users[1].id))
    db.rollback()
    monkeypatch.setattr(discovery, "clock", lambda: deadline + 100_000)
    assert (
        client.get("/discovery/state").json()["groups"][0]["challenges"][0]["status"]
        == "submitted"
    )
    act(0)
    state = send(
        "review",
        groupId=gid,
        challengeId=cid,
        target=str(users[1].id),
        decision="confirm",
    )
    state = send(
        "review",
        groupId=gid,
        challengeId=cid,
        target=str(users[1].id),
        decision="confirm",
    )
    assert state["groups"][0]["challenges"][0]["status"] == "confirmed"
    assert db.query(DiscoveryRecord).count() == 1
    act(2)
    assert client.get(f"/discovery/photos/{rid}").status_code == 403
    assert client.get(f"/discovery/public-photos/{rid}").status_code == 404
    assert client.get("/discovery/community").json()["records"] == []
    act(1)
    send("publish", recordId=rid)
    act(0)
    send("moderate", status=403, recordId=rid)
    db.rollback()
    act(3)
    send("moderate", recordId=rid, decision="confirm")
    community = client.get("/discovery/community").json()
    assert community["ranks"] == [
        {"id": str(users[1].id), "name": "Stepan", "count": 1}
    ]
    public = community["records"][0]
    assert "groupId" not in public and "challengeId" not in public
    assert client.get(f"/discovery/public-photos/{rid}").status_code == 200


def test_expiry_and_cooperative_incomplete(game, monkeypatch):
    _, _, users, act, send = game
    gid, cid = pair(game)
    act(1)
    state = send("accept", groupId=gid, challengeId=cid)
    deadline = state["groups"][0]["challenges"][0]["deadline"]
    monkeypatch.setattr(discovery, "clock", lambda: deadline + 1)
    state = send("goal", goalId="books")
    assert state["groups"][0]["challenges"][0]["status"] == "expired"
    act(0)
    state = send(
        "challenge",
        groupId=gid,
        target=str(users[1].id),
        title="Together",
        category="nature",
        duration=10,
        together=True,
    )
    challenge = state["groups"][0]["challenges"][-1]
    assert challenge["loss"] == 0
    act(1)
    state = send("accept", groupId=gid, challengeId=challenge["id"])
    deadline2 = state["groups"][0]["challenges"][-1]["deadline"]
    send(
        "record",
        title="Tree",
        place="Park",
        category="nature",
        photo=picture(),
        groupId=gid,
        challengeId=challenge["id"],
    )
    monkeypatch.setattr(discovery, "clock", lambda: deadline2 + 1)
    state = send("goal", goalId="nature")
    assert state["groups"][0]["challenges"][-1]["status"] == "incomplete"


def test_private_logbook_persistence_and_payload_validation(game):
    client, db, users, act, send = game
    state = send(
        "record", title="Private", category="books", place="Bookshop", photo=picture()
    )
    rid = state["records"][0]["id"]
    assert client.get("/discovery/state").json()["records"][0]["id"] == rid
    act(1)
    assert client.get("/discovery/state").json()["records"] == []
    assert client.get(f"/discovery/photos/{rid}").status_code == 403
    db.rollback()
    send(
        "record",
        status=400,
        title="Invalid",
        category="food",
        place="Market",
        photo="data:image/jpeg;base64,AAAA",
    )
    db.rollback()
    send(
        "record",
        status=400,
        title="No pin",
        place="Somewhere",
        photo=picture(),
        lat=None,
        lng=None,
    )
    db.rollback()
    send("learn", status=400, learningId="fake-million-points")
    db.rollback()
    assert (
        client.post(
            "/discovery/command",
            json={"kind": "goal", "id": str(uuid4()), "score": 100000},
        ).status_code
        == 422
    )


def test_registration_cannot_grant_privileges(game):
    client, db, _, _, _ = game
    registration = {
        "email": "new@example.com",
        "password": "a-long-test-password",
        "full_name": "New player",
    }
    assert (
        client.post(
            "/discovery/register", json={**registration, "is_admin": True}
        ).status_code
        == 422
    )
    assert client.post("/discovery/register", json=registration).status_code == 201
    user = db.query(models.User).filter_by(email="new@example.com").one()
    assert user.is_admin is False and user.groups == ["mexico-city"]
    assert client.post("/discovery/register", json=registration).status_code == 409


def test_decline_and_category_card_preserve_existing_challenges(game):
    _, db, users, act, send = game
    gid, cid = pair(game)
    act(1)
    state = send("decline", groupId=gid, challengeId=cid)
    assert state["groups"][0]["challenges"][0]["status"] == "declined"
    act(0)
    block = dict(id=str(uuid4()), groupId=gid, target=str(users[1].id), category="art")
    send("block", **block)
    state = send("block", **block)
    assert len(state["groups"][0]["blocks"]) == 1
    state = send(
        "challenge",
        groupId=gid,
        target=str(users[1].id),
        title="Blocked",
        category="art",
    )
    act(1)
    send(
        "accept",
        status=409,
        groupId=gid,
        challengeId=state["groups"][0]["challenges"][-1]["id"],
    )
    db.rollback()
    state = send(
        "record", title="Still my own", category="art", place="Street", photo=picture()
    )
    assert len(state["records"]) == 1


def test_together_needs_both_reviews_and_protects_on_time_evidence(game, monkeypatch):
    client, _, users, act, send = game
    gid, _ = pair(game)
    state = send(
        "challenge",
        groupId=gid,
        target=str(users[1].id),
        title="Walk together",
        category="nature",
        duration=10,
        together=True,
    )
    cid = state["groups"][0]["challenges"][-1]["id"]
    act(1)
    state = send("accept", groupId=gid, challengeId=cid)
    deadline = state["groups"][0]["challenges"][-1]["deadline"]
    for actor in [0, 1]:
        act(actor)
        send(
            "record",
            groupId=gid,
            challengeId=cid,
            category="nature",
            title="Our tree",
            place="Park",
            photo=picture(),
        )
    monkeypatch.setattr(discovery, "clock", lambda: deadline + 1000)
    state = client.get("/discovery/state").json()
    assert state["groups"][0]["challenges"][-1]["status"] == "submitted"
    act(0)
    state = send(
        "review",
        groupId=gid,
        challengeId=cid,
        target=str(users[1].id),
        decision="confirm",
    )
    assert state["groups"][0]["challenges"][-1]["status"] == "submitted"
    act(1)
    state = send(
        "review",
        groupId=gid,
        challengeId=cid,
        target=str(users[0].id),
        decision="confirm",
    )
    challenge = state["groups"][0]["challenges"][-1]
    assert challenge["status"] == "confirmed"
    assert challenge["loss"] == 0
    assert all(e["status"] == "confirmed" for e in challenge["evidence"].values())


def test_goal_completion_matches_real_discovery_and_survives_reload(game):
    client, _, _, _, send = game
    send("goal", goalId="books")
    state = send(
        "record", title="A mural", category="art", place="Roma", photo=picture()
    )
    assert state["goal"] == "books"
    rid = str(uuid4())
    state = send(
        "record",
        id=rid,
        title="A bookshop",
        category="books",
        place="Roma",
        photo=picture(),
    )
    assert state["goal"] is None
    completed = next(r for r in state["records"] if r["id"] == rid)
    assert completed["goalId"] == "books"
    state = client.get("/discovery/state").json()
    assert state["me"]["email"] == "player0@example.test"
    assert sum(r.get("goalId") == "books" for r in state["records"]) == 1
