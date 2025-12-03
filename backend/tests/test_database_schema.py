# backend/tests/test_database_schema.py

import os

import pytest
from sqlalchemy import inspect, text   # ← add text here
from sqlalchemy.exc import OperationalError

from db import engine
from models import User, PinterestAccountStatsMonthly


@pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not set; skipping remote DB schema test",
)
def test_remote_db_schema_matches_models():
    """
    Integration-style sanity check:

    - Uses the same engine as the app (db.engine)
    - Connects to the DB defined by DATABASE_URL (e.g. Railway)
    - Verifies that the core tables exist and match the ORM models
    """

    try:
        with engine.connect() as conn:
            # Basic connectivity test (SQLAlchemy 2.x style)
            conn.execute(text("SELECT 1"))

            inspector = inspect(conn)

            def assert_table_matches_model(table_name, model_cls):
                table_names = inspector.get_table_names()
                assert (
                        table_name in table_names
                ), f"Table {table_name!r} missing in database. Found: {table_names}"

                db_columns = {
                    col["name"]: col for col in inspector.get_columns(table_name)
                }
                model_table = model_cls.__table__

                for col in model_table.columns:
                    assert (
                            col.name in db_columns
                    ), f"Column {table_name}.{col.name} missing in database."

                    db_col = db_columns[col.name]

                    # Nullability
                    assert (
                            db_col["nullable"] == col.nullable
                    ), f"Nullability mismatch for {table_name}.{col.name}: " \
                       f"db={db_col['nullable']} model={col.nullable}"

                    # Type (compare python_type for robustness)
                    model_py_type = getattr(col.type, "python_type", None)
                    db_py_type = getattr(db_col["type"], "python_type", None)
                    assert (
                            db_py_type == model_py_type
                    ), f"Type mismatch for {table_name}.{col.name}: " \
                       f"db={db_py_type} model={model_py_type}"

                db_pk_cols = set(
                    inspector.get_pk_constraint(table_name).get(
                        "constrained_columns", []
                    )
                )
                model_pk_cols = set(model_table.primary_key.columns.keys())
                assert (
                        db_pk_cols == model_pk_cols
                ), f"PK mismatch for {table_name}: db={db_pk_cols} model={model_pk_cols}"

            assert_table_matches_model("users", User)
            assert_table_matches_model(
                "pinterest_account_stats_monthly", PinterestAccountStatsMonthly
            )

    except OperationalError as exc:
        pytest.fail(f"Could not connect to database: {exc}")
