"""Account-to-worker-to-map stories against an isolated database."""

import json
from uuid import uuid4
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from db import Base
from models import User
from discovery_models import DiscoveryGroup
from saved_city.api import router, now
from saved_city.models import Item, Job, Note, Revision
from saved_city.worker import run_once, claim
from saved_city.extract import extract
from saved_city.fetch import clean_url, public_addresses, ImportFailure
from security import get_db, get_current_active_user


@pytest.fixture
def city():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine)
    with factory() as db:
        users = [
            User(
                email=f"saved{i}@example.test",
                full_name=str(i),
                hashed_password="test",
                is_active=True,
                groups=[],
            )
            for i in range(3)
        ]
        db.add_all(users)
        db.flush()
        ids = [u.id for u in users]
        group = DiscoveryGroup(
            id=str(uuid4()),
            invite=str(uuid4()),
            data={
                "name": "Together",
                "members": [{"id": str(i), "name": str(i)} for i in ids[:2]],
            },
        )
        db.add(group)
        db.commit()
        gid = group.id
    actor = [ids[0]]

    def session():
        with factory() as db:
            yield db

    def user():
        with factory() as db:
            return db.get(User, actor[0])

    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_db] = session
    app.dependency_overrides[get_current_active_user] = user
    yield TestClient(app), factory, actor, ids, gid
    engine.dispose()


def collection(c, group=None, access="view"):
    response = c.post(
        "/discovery/saved/collections",
        json={"name": "Places", "groupId": group, "access": access},
    )
    assert response.status_code == 201, response.text
    return response.json()["id"]


def submit(c, cid, url="https://example.org/flat", kind="rent"):
    response = c.post(
        "/discovery/saved/imports", json={"url": url, "kind": kind, "collectionId": cid}
    )
    assert response.status_code == 202, response.text
    return response.json()


def source(price=20000):
    return (
        '<script type="application/ld+json">'
        + json.dumps(
            {
                "@type": "Apartment",
                "name": "A home",
                "address": "Roma, CDMX",
                "geo": {"latitude": 19.41, "longitude": -99.16},
                "numberOfBedrooms": 2,
                "offers": {"price": price, "priceCurrency": "MXN"},
            }
        )
        + "</script>"
    )


def run(factory, html=None):
    return run_once(
        factory,
        fetcher=lambda url: (url, (html or source()).encode(), "text/html"),
        extractor=lambda html, url, kind: extract(html, url, kind, False),
        locator=lambda d: d,
    )


def test_durable_import_map_replay_and_refresh_preserves_edits(city):
    c, f, actor, ids, gid = city
    cid = collection(c)
    i = submit(c, cid)
    iid = i["id"]
    assert submit(c, cid)["id"] == iid
    with f() as db:
        assert db.query(Job).count() == 1
    assert c.get("/discovery/saved/map").json()["items"] == []
    assert run(f)
    i = c.get(f"/discovery/saved/items/{iid}").json()
    assert i["state"] == "ready" and i["data"]["price"] == 20000
    assert c.get("/discovery/saved/map").json()["items"][0]["id"] == iid
    assert c.get("/discovery/saved/map?west=-99.1&east=-98.9").json()["items"] == []
    edited = c.patch(
        f"/discovery/saved/items/{iid}",
        json={
            "revision": i["revision"],
            "fields": {"title": "My corrected title", "maintenance": 1200},
        },
    )
    assert edited.status_code == 200, edited.text
    assert (
        c.patch(
            f"/discovery/saved/items/{iid}",
            json={"revision": i["revision"], "fields": {"title": "stale"}},
        ).status_code
        == 409
    )
    with f() as db:
        db.get(Item, iid).checked_at = 0
        db.get(Job, iid).available_at = 0
        db.commit()
    assert c.post(f"/discovery/saved/items/{iid}/refresh").status_code == 202
    run(f, source(21000))
    item = c.get(f"/discovery/saved/items/{iid}").json()
    assert (
        item["data"]["title"] == "My corrected title" and item["data"]["price"] == 21000
    )
    assert len(item["history"]) == 2


def test_group_access_revocation_and_notes_are_personal(city):
    c, f, actor, ids, gid = city
    cid = collection(c, gid)
    iid = submit(c, cid)["id"]
    c.patch(
        f"/discovery/saved/items/{iid}/personal",
        json={"note": "private budget", "status": "shortlisted"},
    )
    actor[0] = ids[1]
    item = c.get(f"/discovery/saved/items/{iid}").json()
    assert item["note"] == "" and item["status"] == "saved"
    assert (
        c.post(
            "/discovery/saved/imports",
            json={
                "url": "https://example.org/other",
                "kind": "rent",
                "collectionId": cid,
            },
        ).status_code
        == 403
    )
    assert (
        c.patch(
            f"/discovery/saved/items/{iid}",
            json={"revision": 0, "fields": {"title": "attack"}},
        ).status_code
        == 403
    )
    c.patch(
        f"/discovery/saved/items/{iid}/personal",
        json={"note": "my own view", "status": "planned"},
    )
    actor[0] = ids[2]
    assert c.get(f"/discovery/saved/items/{iid}").status_code == 404
    assert c.get(f"/discovery/saved/items/{iid}/image").status_code == 404
    assert c.get("/discovery/saved").json()["items"] == []
    actor[0] = ids[0]
    assert c.get(f"/discovery/saved/items/{iid}").json()["note"] == "private budget"
    c.patch(
        f"/discovery/saved/collections/{cid}",
        json={"name": "Places", "groupId": gid, "access": "contribute"},
    )
    actor[0] = ids[1]
    submit(c, cid, "https://example.org/contribution")
    actor[0] = ids[0]
    c.patch(
        f"/discovery/saved/collections/{cid}", json={"name": "Places", "groupId": None}
    )
    actor[0] = ids[1]
    assert c.get(f"/discovery/saved/items/{iid}").status_code == 404
    assert c.get("/discovery/saved/map").json()["items"] == []


def test_restricted_source_remains_editable_and_delete_clears_jobs(city):
    c, f, actor, ids, gid = city
    cid = collection(c)
    iid = submit(c, cid)["id"]

    def blocked(url):
        raise ImportFailure("source_restricted")

    run_once(f, fetcher=blocked)
    item = c.get(f"/discovery/saved/items/{iid}").json()
    assert (
        item["state"] == "needs_review" and item["job"]["error"] == "source_restricted"
    )
    patched = c.patch(
        f"/discovery/saved/items/{iid}",
        json={
            "revision": 0,
            "fields": {
                "title": "A place",
                "lat": 19.4,
                "lng": -99.1,
                "precision": "approximate",
            },
        },
    ).json()
    assert patched["state"] == "ready"
    c.patch(f"/discovery/saved/items/{iid}/personal", json={"note": "note"})
    assert c.delete(f"/discovery/saved/items/{iid}").status_code == 204
    with f() as db:
        assert db.query(Job).count() == 0 and db.query(Note).count() == 0


def test_lease_recovery_and_stale_workers(city):
    c, f, actor, ids, gid = city
    iid = submit(c, collection(c))["id"]
    first = claim(f)
    assert first and claim(f) is None
    with f() as db:
        db.get(Job, iid).lease_until = 0
        db.commit()
    second = claim(f)
    assert second and first[3] != second[3]
    with f() as db:
        db.get(Job, iid).lease_until = 0
        db.commit()
    run(f)
    assert c.get(f"/discovery/saved/items/{iid}").json()["state"] == "ready"


def test_coordinates_expire_only_for_provider_content(city):
    c, f, actor, ids, gid = city
    iid = submit(c, collection(c))["id"]
    run(f)
    with f() as db:
        i = db.get(Item, iid)
        i.extracted = {
            **i.extracted,
            "locationSource": "google",
            "locationExpiresAt": 1,
        }
        db.commit()
    assert c.get("/discovery/saved/map").json()["items"] == []


def test_explicit_zero_price_and_unknown_currency():
    data = extract(
        '<script type="application/ld+json">{"@type":"Event","name":"Free show","offers":{"price":0},"location":{"address":{"addressLocality":"CDMX"}}}</script>',
        "https://example.org",
        "activity",
        False,
    )
    assert data["price"] == 0 and "currency" not in data and "lat" not in data
    assert "price" not in extract(
        "<title>No price</title>", "https://example.org", "rent", False
    )


@pytest.mark.parametrize(
    "url",
    [
        "file:///etc/passwd",
        "http://127.0.0.1/a",
        "https://[::1]/",
        "http://169.254.169.254/",
        "https://localhost/",
        "https://user:pass@example.org/",
        "https://example.org:8080/",
        "https://example.org/\nsecret",
    ],
)
def test_url_boundaries(url):
    with pytest.raises(ImportFailure):
        clean_url(url)


def test_public_dns_rejects_mixed_and_rebound_targets(monkeypatch):
    monkeypatch.setattr(
        "socket.getaddrinfo",
        lambda *a, **k: [
            (None, None, None, None, ("8.8.8.8", 443)),
            (None, None, None, None, ("10.0.0.1", 443)),
        ],
    )
    with pytest.raises(ImportFailure):
        public_addresses("example.org", 443)


def test_tracking_cleanup_preserves_listing_identity():
    assert (
        clean_url("https://example.org/item?id=3&utm_source=x#top")
        == "https://example.org/item?id=3"
    )


def test_researched_examples_report_snapshot_and_keep_locations_approximate(city):
    from saved_city.worker import REVIEWED

    c, f, *_ = city
    cid = collection(c)

    def blocked(url):
        raise ImportFailure("source_restricted")

    for url, entry in REVIEWED.items():
        iid = submit(c, cid, url, entry["kind"])["id"]
        run_once(f, fetcher=blocked)
        item = c.get(f"/discovery/saved/items/{iid}").json()
        assert item["data"]["method"] == "reviewed_snapshot"
        assert item["data"]["fetchWarning"] == "source_restricted"
        assert item["checkedAt"] is None
        if entry["kind"] == "activity":
            assert item["state"] == "ready"
            assert item["data"]["precision"] == "approximate"
        else:
            assert item["data"]["price"] == 22000
            assert "lat" not in item["data"]
    assert len(c.get("/discovery/saved/map").json()["items"]) == 3


def test_expired_provider_coordinates_are_deleted(city):
    from saved_city.worker import purge_expired_locations

    c, f, *_ = city
    iid = submit(c, collection(c))["id"]
    run(f)
    with f() as db:
        item = db.get(Item, iid)
        item.extracted = {
            **item.extracted,
            "locationSource": "google",
            "locationExpiresAt": 1,
        }
        db.commit()
    purge_expired_locations(f)
    with f() as db:
        assert "lat" not in db.get(Item, iid).extracted
        assert db.get(Item, iid).lat is None


def test_failed_import_cannot_bypass_refresh_cooldown(city):
    c, f, *_ = city
    iid = submit(c, collection(c))["id"]

    def blocked(url):
        raise ImportFailure("source_restricted")

    run_once(f, fetcher=blocked)
    assert c.post(f"/discovery/saved/items/{iid}/refresh").status_code == 429


def test_expired_hidden_coordinates_are_deleted(city):
    from saved_city.worker import purge_expired_locations

    c, f, *_ = city
    iid = submit(c, collection(c))["id"]
    run(f)
    with f() as db:
        item = db.get(Item, iid)
        item.extracted = {
            **item.extracted,
            "locationSource": "google",
            "locationExpiresAt": 1,
        }
        item.overrides = {"lat": None, "lng": None}
        item.lat = item.lng = None
        db.commit()
    purge_expired_locations(f)
    with f() as db:
        assert "lat" not in db.get(Item, iid).extracted


def test_research_fallback_does_not_replace_a_successful_import(city):
    from saved_city.worker import REVIEWED

    c, f, *_ = city
    url = next(url for url, entry in REVIEWED.items() if entry["kind"] == "rent")
    iid = submit(c, collection(c), url, REVIEWED[url]["kind"])["id"]
    run(f)
    with f() as db:
        db.get(Item, iid).checked_at = 0
        db.get(Job, iid).available_at = 0
        db.commit()
    assert c.post(f"/discovery/saved/items/{iid}/refresh").status_code == 202

    def blocked(url):
        raise ImportFailure("source_restricted")

    run_once(f, fetcher=blocked)
    item = c.get(f"/discovery/saved/items/{iid}").json()
    assert item["data"]["title"] == "A home"
    assert item["job"]["error"] == "source_restricted"
