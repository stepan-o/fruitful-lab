"""monthly stats: add account_name + uploaded_at, unique(account_name, calendar_month)

Revision ID: c1a2b3c4d5e6
Revises: 3f2a1c9e4b6d
Create Date: 2026-02-05
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision: str = "c1a2b3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "3f2a1c9e4b6d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TABLE = "pinterest_account_stats_monthly"
UQ_NAME = "uq_pinterest_monthly_account_month"
IX_ACCOUNT = "ix_pinterest_account_stats_monthly_account_name"


def upgrade() -> None:
    conn = op.get_bind()

    # If an older unique constraint exists on calendar_month, drop it (compat).
    insp = inspect(conn)
    for uc in insp.get_unique_constraints(TABLE):
        cols = list(uc.get("column_names") or [])
        if [c.lower() for c in cols] == ["calendar_month"]:
            op.drop_constraint(uc["name"], TABLE, type_="unique")

    # Add columns (nullable first). You said table will be empty when running this;
    # we still follow a safe pattern.
    op.add_column(TABLE, sa.Column("account_name", sa.String(length=255), nullable=True))
    op.add_column(
        TABLE,
        sa.Column(
            "uploaded_at",
            sa.DateTime(timezone=True),
            nullable=True,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.create_index(IX_ACCOUNT, TABLE, ["account_name"])

    # Enforce NOT NULL going forward
    op.alter_column(TABLE, "account_name", nullable=False)
    op.alter_column(TABLE, "uploaded_at", nullable=False, server_default=None)

    # Uniqueness: one row per month per account
    op.create_unique_constraint(UQ_NAME, TABLE, ["account_name", "calendar_month"])


def downgrade() -> None:
    op.drop_constraint(UQ_NAME, TABLE, type_="unique")
    op.drop_index(IX_ACCOUNT, table_name=TABLE)
    op.drop_column(TABLE, "uploaded_at")
    op.drop_column(TABLE, "account_name")
