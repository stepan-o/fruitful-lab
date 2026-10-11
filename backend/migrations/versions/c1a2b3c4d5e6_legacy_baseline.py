"""Retain the deployed legacy head as the supported bootstrap snapshot.

Production still records c1a2b3c4d5e6. Its original incremental script and
ancestors remain in _legacy_versions for audit, but depend on pre-Alembic
creation of the core tables. Empty databases therefore create the complete
core snapshot here (the DDL previously owned by 0f1db0936876). Existing legacy
databases skip this revision and are checked by the following bridge.
Older archived revisions are intentionally not silently adopted.
"""

from alembic import op
import sqlalchemy as sa

revision = "c1a2b3c4d5e6"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    # Frozen DDL from the former 0f1db0936876 fresh-database root.
    op.create_table(
        "pinterest_account_stats_monthly",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("account_name", sa.String(length=255), nullable=False),
        sa.Column("calendar_month", sa.Date(), nullable=False),
        sa.Column("impressions", sa.Integer(), nullable=False),
        sa.Column("engagements", sa.Integer(), nullable=False),
        sa.Column("outbound_clicks", sa.Integer(), nullable=False),
        sa.Column("saves", sa.Integer(), nullable=False),
        sa.Column(
            "uploaded_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "account_name", "calendar_month", name="uq_pinterest_monthly_account_month"
        ),
    )
    op.create_index(
        op.f("ix_pinterest_account_stats_monthly_account_name"),
        "pinterest_account_stats_monthly",
        ["account_name"],
        unique=False,
    )
    op.create_index(
        op.f("ix_pinterest_account_stats_monthly_calendar_month"),
        "pinterest_account_stats_monthly",
        ["calendar_month"],
        unique=False,
    )
    op.create_index(
        op.f("ix_pinterest_account_stats_monthly_id"),
        "pinterest_account_stats_monthly",
        ["id"],
        unique=False,
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_admin", sa.Boolean(), nullable=False),
        sa.Column("groups", sa.JSON(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)


def downgrade():
    raise RuntimeError(
        "The legacy core schema is a preserved baseline; automatic downgrade "
        "below c1a2b3c4d5e6 is not supported. Restore a reviewed backup instead."
    )
