"""Validate the legacy core schema before applying the game/account migrations.

Revision ID: 0f1db0936876
Revises: c1a2b3c4d5e6

This revision used to be a disconnected fresh-database root. Its schema is
now bootstrapped by the legacy snapshot; databases already on this revision
or its descendants continue without replaying either baseline.
"""

from alembic import context, op
import sqlalchemy as sa

from migrations.baseline import validate_core_schema

revision = "0f1db0936876"
down_revision = "c1a2b3c4d5e6"
branch_labels = None
depends_on = None


def upgrade():
    if context.is_offline_mode():
        # A full fresh install emits the snapshot first. Adopting an existing
        # legacy database requires live inspection, never an unchecked SQL stamp.
        if context.get_context().opts.get("starting_rev") not in (None, "base"):
            raise RuntimeError("Legacy upgrades require online schema validation.")
        return
    connection = op.get_bind()
    validate_core_schema(connection)
    if connection.dialect.name == "postgresql":
        # The archived c1 migration removed this default; the consolidated
        # baseline and current ORM rely on it for future statistics inserts.
        op.alter_column(
            "pinterest_account_stats_monthly",
            "uploaded_at",
            server_default=sa.text("CURRENT_TIMESTAMP"),
        )


def downgrade():
    # Both baselines represent the same core tables. Never drop existing users
    # or statistics when traversing this compatibility boundary.
    pass
