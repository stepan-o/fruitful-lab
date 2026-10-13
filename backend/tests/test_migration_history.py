"""Isolated upgrade tests. Set MIGRATION_TEST_DATABASE_URL for PostgreSQL.

PostgreSQL cases create and remove only a randomly named schema. SQLite
cases always run. No case uses the application's DATABASE_URL for storage.
"""

import importlib.util
import io
import os
from pathlib import Path
from uuid import uuid4

import pytest
import sqlalchemy as sa
from alembic import command
from alembic.config import Config
from alembic.migration import MigrationContext
from alembic.operations import Operations
from alembic.script import ScriptDirectory

ROOT = Path(__file__).resolve().parents[1]
LEGACY, BASELINE, HEAD = "c1a2b3c4d5e6", "0f1db0936876", "4city121026"
PASSWORD = "migration-test-passphrase"


@pytest.fixture(params=["sqlite", "postgresql"])
def database(request, tmp_path):
    if request.param == "postgresql":
        url = os.getenv("MIGRATION_TEST_DATABASE_URL")
        if not url:
            pytest.skip("Set MIGRATION_TEST_DATABASE_URL for isolated PostgreSQL tests")
        engine = sa.create_engine(url)
        assert engine.dialect.name == "postgresql"
    else:
        engine = sa.create_engine(f"sqlite:///{tmp_path / 'migrations.db'}")
    with engine.connect() as connection:
        schema = "migration_test_" + uuid4().hex
        if request.param == "postgresql":
            connection.exec_driver_sql(f'CREATE SCHEMA "{schema}"')
            connection.exec_driver_sql(f'SET search_path TO "{schema}"')
            connection.commit()
        cfg = Config(str(ROOT / "alembic.ini"))
        cfg.attributes["connection"] = connection
        yield connection, cfg
        connection.rollback()
        if request.param == "postgresql":
            connection.exec_driver_sql("SET search_path TO public")
            connection.exec_driver_sql(f'DROP SCHEMA "{schema}" CASCADE')
            connection.commit()
    engine.dispose()


def upgrade(connection, cfg, target="head"):
    command.upgrade(cfg, target)
    connection.commit()


def revision(connection):
    result = connection.execute(
        sa.text("SELECT version_num FROM alembic_version")
    ).scalar_one()
    connection.commit()
    return result


def seed(connection):
    from security import hash_password

    connection.execute(
        sa.text("""INSERT INTO users
        (email, full_name, hashed_password, is_active, is_admin, groups, created_at, updated_at)
        VALUES ('migration-player@example.com', 'Existing player', :password, true, false, '[]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    """),
        {"password": hash_password(PASSWORD)},
    )
    connection.execute(
        sa.text("""INSERT INTO pinterest_account_stats_monthly
        (account_name, calendar_month, impressions, engagements, outbound_clicks, saves, uploaded_at, created_at, updated_at)
        VALUES ('existing-account', '2026-01-01', 123, 45, 6, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    """)
    )
    connection.commit()


def core_rows(connection):
    from migrations.baseline import CORE_COLUMNS

    result = {
        table: connection.execute(
            sa.text(f"SELECT {', '.join(columns)} FROM {table} ORDER BY id")
        ).all()
        for table, columns in CORE_COLUMNS.items()
    }
    connection.commit()
    return result


def legacy_schema(connection, cfg):
    if connection.dialect.name == "postgresql":
        # Recreate pre-Alembic tables, then execute unmodified archived scripts.
        # Independent of the new snapshot and validation schema.
        connection.exec_driver_sql("""CREATE TABLE users (
            id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE,
            full_name VARCHAR(255), hashed_password VARCHAR(255) NOT NULL,
            is_active BOOLEAN NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now())""")
        connection.exec_driver_sql("""CREATE TABLE pinterest_account_stats_monthly (
            id SERIAL PRIMARY KEY, calendar_month DATE NOT NULL,
            impressions INTEGER NOT NULL, engagements INTEGER NOT NULL,
            outbound_clicks INTEGER NOT NULL, saves INTEGER NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now())""")
        for name in [
            "b105958cfa97_add_is_admin_to_users.py",
            "3f2a1c9e4b6d_add_groups_json_to_users.py",
            "c1a2b3c4d5e6_monthly_stats_add_account_name_uploaded_at.py",
        ]:
            spec = importlib.util.spec_from_file_location(
                "archived", ROOT / "migrations/_legacy_versions" / name
            )
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            with Operations.context(MigrationContext.configure(connection)):
                module.upgrade()
        connection.commit()
        # Fixture only: represents the historical deployment's version row.
        command.stamp(cfg, LEGACY)
        connection.commit()
    else:
        upgrade(connection, cfg, LEGACY)


def test_fresh_upgrade_and_repeated_deploy(database):
    connection, cfg = database
    upgrade(connection, cfg)
    assert revision(connection) == HEAD
    assert {
        "users",
        "pinterest_account_stats_monthly",
        "discovery_profiles",
        "discovery_groups",
        "discovery_records",
        "account_access_tokens",
        "city_items",
        "city_collections",
        "city_import_jobs",
        "city_notes",
        "city_revisions",
    } <= set(sa.inspect(connection).get_table_names())
    connection.commit()
    seed(connection)
    before = core_rows(connection)
    upgrade(connection, cfg)
    assert core_rows(connection) == before


def test_legacy_upgrade_preserves_rows_and_supports_account_recovery(
    database, monkeypatch
):
    connection, cfg = database
    legacy_schema(connection, cfg)
    seed(connection)
    before = core_rows(connection)
    upgrade(connection, cfg)
    assert revision(connection) == HEAD
    assert core_rows(connection) == before
    assert (
        connection.execute(sa.text("SELECT session_version FROM users")).scalar_one()
        == 0
    )
    connection.commit()
    upgrade(connection, cfg)
    assert core_rows(connection) == before

    from fastapi import FastAPI
    from fastapi.testclient import TestClient
    from sqlalchemy.orm import sessionmaker
    import account_service
    from routers import accounts, auth
    from security import get_db

    Session = sessionmaker(bind=connection)
    app = FastAPI()
    app.include_router(auth.router)
    app.include_router(accounts.router)

    def session():
        with Session() as db:
            yield db

    app.dependency_overrides[get_db] = session
    monkeypatch.setattr(account_service, "SessionLocal", Session)
    monkeypatch.setenv("RESEND_API_KEY", "local-test-key")
    monkeypatch.setenv("ACCOUNT_EMAIL_FROM", "local@example.com")
    monkeypatch.setenv("ACCOUNT_PUBLIC_ORIGIN", "https://www.fruitfulab.net")
    messages = []
    monkeypatch.setattr(
        account_service, "send_email", lambda *args: messages.append(args)
    )
    accounts._buckets.clear()
    with TestClient(app) as client:
        credentials = {"username": "migration-player@example.com", "password": PASSWORD}
        login = client.post("/auth/login", data=credentials)
        assert login.status_code == 200
        old_token = login.json()["access_token"]
        response = client.post(
            "/auth/password/forgot", json={"email": credentials["username"]}
        )
        assert response.status_code == 202
        assert len(messages) == 1
        token = messages[0][2].split("#token=", 1)[1].split()[0]
        response = client.post(
            "/auth/password/reset",
            json={"token": token, "password": "new-migration-passphrase"},
        )
        assert response.status_code == 200
        assert (
            client.get(
                "/auth/me", headers={"Authorization": f"Bearer {old_token}"}
            ).status_code
            == 401
        )
        assert client.post("/auth/login", data=credentials).status_code == 401
        credentials["password"] = "new-migration-passphrase"
        assert client.post("/auth/login", data=credentials).status_code == 200


@pytest.mark.parametrize("start", [BASELINE, "2cdmx101026", "3acct101026", HEAD])
def test_current_revisions_do_not_replay_legacy(database, start):
    connection, cfg = database
    upgrade(connection, cfg, start)
    seed(connection)
    before = core_rows(connection)
    upgrade(connection, cfg)
    assert revision(connection) == HEAD
    assert core_rows(connection) == before


@pytest.mark.parametrize(
    "damage", ["missing_table", "missing_column", "wrong_type", "missing_unique"]
)
def test_legacy_drift_stops_before_advancing_revision(database, damage):
    connection, cfg = database
    legacy_schema(connection, cfg)
    if damage == "missing_table":
        connection.exec_driver_sql("DROP TABLE users")
    elif damage == "missing_column":
        connection.exec_driver_sql("ALTER TABLE users DROP COLUMN groups")
    elif damage == "wrong_type":
        connection.exec_driver_sql("ALTER TABLE users DROP COLUMN groups")
        connection.exec_driver_sql(
            "ALTER TABLE users ADD COLUMN groups INTEGER NOT NULL DEFAULT 0"
        )
    elif connection.dialect.name == "postgresql":
        connection.exec_driver_sql("ALTER TABLE users DROP CONSTRAINT users_email_key")
    else:
        connection.exec_driver_sql("DROP INDEX ix_users_email")
    connection.commit()
    with pytest.raises(RuntimeError, match="Legacy schema does not match"):
        command.upgrade(cfg, "head")
    connection.rollback()
    assert revision(connection) == LEGACY
    assert "discovery_records" not in sa.inspect(connection).get_table_names()


def test_unknown_revision_remains_unknown(database):
    connection, cfg = database
    legacy_schema(connection, cfg)
    connection.execute(
        sa.text("UPDATE alembic_version SET version_num='unknown_revision'")
    )
    connection.commit()
    with pytest.raises(Exception, match="Can't locate revision"):
        command.upgrade(cfg, "head")
    connection.rollback()
    assert revision(connection) == "unknown_revision"


def test_bridge_downgrade_preserves_core_tables(database):
    connection, cfg = database
    upgrade(connection, cfg, BASELINE)
    seed(connection)
    before = core_rows(connection)
    command.downgrade(cfg, LEGACY)
    connection.commit()
    assert core_rows(connection) == before
    with pytest.raises(RuntimeError, match="preserved baseline"):
        command.downgrade(cfg, "base")
    connection.rollback()
    assert revision(connection) == LEGACY
    assert core_rows(connection) == before


def test_one_head_and_offline_legacy_guard():
    cfg = Config(str(ROOT / "alembic.ini"), output_buffer=io.StringIO())
    assert ScriptDirectory.from_config(cfg).get_heads() == [HEAD]
    command.upgrade(cfg, "head", sql=True)
    assert "CREATE TABLE users" in cfg.output_buffer.getvalue()
    command.upgrade(cfg, "base:head", sql=True)
    with pytest.raises(RuntimeError, match="online schema validation"):
        command.upgrade(cfg, LEGACY + ":head", sql=True)


def test_postgres_later_failure_rolls_back_entire_legacy_upgrade(database):
    connection, cfg = database
    if connection.dialect.name != "postgresql":
        pytest.skip("PostgreSQL transactional DDL guarantee")
    legacy_schema(connection, cfg)
    seed(connection)
    before = core_rows(connection)
    connection.exec_driver_sql(
        "CREATE TABLE discovery_records (id INTEGER PRIMARY KEY)"
    )
    connection.commit()
    with pytest.raises(sa.exc.ProgrammingError, match="already exists"):
        command.upgrade(cfg, "head")
    connection.rollback()
    assert revision(connection) == LEGACY
    assert core_rows(connection) == before
    assert "discovery_groups" not in sa.inspect(connection).get_table_names()
    assert "session_version" not in {
        c["name"] for c in sa.inspect(connection).get_columns("users")
    }
    uploaded = next(
        c
        for c in sa.inspect(connection).get_columns("pinterest_account_stats_monthly")
        if c["name"] == "uploaded_at"
    )
    assert uploaded["default"] is None
