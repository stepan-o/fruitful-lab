"""Frozen core schema contract at the 2026-02-05 consolidation boundary.

Do not import live ORM metadata here: future model changes must not change
what an already-deployed historical database is required to contain.
"""

import sqlalchemy as sa


CORE_COLUMNS = {
    "users": {
        "id": (sa.Integer(), False),
        "email": (sa.String(255), False),
        "full_name": (sa.String(255), True),
        "hashed_password": (sa.String(255), False),
        "is_active": (sa.Boolean(), False),
        "is_admin": (sa.Boolean(), False),
        "groups": (sa.JSON(), False),
        "created_at": (sa.DateTime(timezone=True), False),
        "updated_at": (sa.DateTime(timezone=True), False),
    },
    "pinterest_account_stats_monthly": {
        "id": (sa.Integer(), False),
        "account_name": (sa.String(255), False),
        "calendar_month": (sa.Date(), False),
        "impressions": (sa.Integer(), False),
        "engagements": (sa.Integer(), False),
        "outbound_clicks": (sa.Integer(), False),
        "saves": (sa.Integer(), False),
        "uploaded_at": (sa.DateTime(timezone=True), False),
        "created_at": (sa.DateTime(timezone=True), False),
        "updated_at": (sa.DateTime(timezone=True), False),
    },
}
CORE_UNIQUES = {
    "users": {"email"},
    "pinterest_account_stats_monthly": {"account_name", "calendar_month"},
}


def validate_core_schema(connection):
    inspector = sa.inspect(connection)
    problems = []
    for table, expected in CORE_COLUMNS.items():
        if not inspector.has_table(table):
            problems.append(f"missing table {table}")
            continue
        actual = {column["name"]: column for column in inspector.get_columns(table)}
        for name, (kind, nullable) in expected.items():
            column = actual.get(name)
            if column is None:
                problems.append(f"missing column {table}.{name}")
                continue
            found = column["type"]
            if not isinstance(found, type(kind)):
                problems.append(f"unexpected type for {table}.{name}")
            if (
                isinstance(kind, sa.String)
                and getattr(found, "length", None) is not None
                and found.length < kind.length
            ):
                problems.append(f"insufficient length for {table}.{name}")
            if (
                isinstance(kind, sa.DateTime)
                and connection.dialect.name == "postgresql"
                and not getattr(found, "timezone", False)
            ):
                problems.append(f"missing timezone for {table}.{name}")
            if column["nullable"] != nullable:
                problems.append(f"unexpected nullability for {table}.{name}")
        if inspector.get_pk_constraint(table).get("constrained_columns") != ["id"]:
            problems.append(f"unexpected primary key for {table}")
        unique_columns = [
            set(item["column_names"])
            for item in inspector.get_unique_constraints(table)
        ]
        unique_columns += [
            set(item["column_names"])
            for item in inspector.get_indexes(table)
            if item.get("unique")
            and not item.get("dialect_options", {}).get("postgresql_where")
        ]
        if CORE_UNIQUES[table] not in unique_columns:
            problems.append(f"missing unique key for {table}")
    if problems:
        raise RuntimeError(
            "Legacy schema does not match the supported baseline; no adoption performed: "
            + "; ".join(problems)
            + ". Inspect this database before retrying; do not stamp or recreate it."
        )
