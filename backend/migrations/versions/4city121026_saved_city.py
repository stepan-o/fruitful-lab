"""Saved city items, collections and durable import jobs (additive)."""

import sqlalchemy as sa
from alembic import op

revision = "4city121026"
down_revision = "3acct101026"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "city_collections",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column(
            "owner_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete=None),
            primary_key=False,
            nullable=False,
        ),
        sa.Column("name", sa.String(length=100), primary_key=False, nullable=False),
        sa.Column(
            "group_id",
            sa.String(length=36),
            sa.ForeignKey("discovery_groups.id", ondelete=None),
            primary_key=False,
            nullable=True,
        ),
        sa.Column("access", sa.String(length=12), primary_key=False, nullable=False),
        sa.Column("created_at", sa.BigInteger(), primary_key=False, nullable=False),
    )
    op.create_index("ix_city_collections_owner_id", "city_collections", ["owner_id"])
    op.create_index("ix_city_collections_group_id", "city_collections", ["group_id"])
    op.create_table(
        "city_items",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column(
            "owner_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete=None),
            primary_key=False,
            nullable=False,
        ),
        sa.Column(
            "collection_id",
            sa.String(length=36),
            sa.ForeignKey("city_collections.id", ondelete=None),
            primary_key=False,
            nullable=False,
        ),
        sa.Column("url", sa.String(length=2048), primary_key=False, nullable=False),
        sa.Column("url_hash", sa.String(length=64), primary_key=False, nullable=False),
        sa.Column("kind", sa.String(length=12), primary_key=False, nullable=False),
        sa.Column("state", sa.String(length=20), primary_key=False, nullable=False),
        sa.Column("extracted", sa.JSON(), primary_key=False, nullable=False),
        sa.Column("overrides", sa.JSON(), primary_key=False, nullable=False),
        sa.Column("lat", sa.Float(), primary_key=False, nullable=True),
        sa.Column("lng", sa.Float(), primary_key=False, nullable=True),
        sa.Column("revision", sa.Integer(), primary_key=False, nullable=False),
        sa.Column("created_at", sa.BigInteger(), primary_key=False, nullable=False),
        sa.Column("updated_at", sa.BigInteger(), primary_key=False, nullable=False),
        sa.Column("checked_at", sa.BigInteger(), primary_key=False, nullable=True),
        sa.UniqueConstraint("collection_id", "url_hash", name="uq_city_collection_url"),
    )
    op.create_index("ix_city_items_owner_id", "city_items", ["owner_id"])
    op.create_index("ix_city_items_collection_id", "city_items", ["collection_id"])
    op.create_table(
        "city_notes",
        sa.Column(
            "item_id",
            sa.String(length=36),
            sa.ForeignKey("city_items.id", ondelete="CASCADE"),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete=None),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("note", sa.String(length=4000), primary_key=False, nullable=False),
        sa.Column("status", sa.String(length=20), primary_key=False, nullable=False),
        sa.Column(
            "record_id",
            sa.String(length=36),
            sa.ForeignKey("discovery_records.id", ondelete=None),
            primary_key=False,
            nullable=True,
        ),
    )
    op.create_table(
        "city_revisions",
        sa.Column("id", sa.String(length=36), primary_key=True, nullable=False),
        sa.Column(
            "item_id",
            sa.String(length=36),
            sa.ForeignKey("city_items.id", ondelete="CASCADE"),
            primary_key=False,
            nullable=False,
        ),
        sa.Column("data", sa.JSON(), primary_key=False, nullable=False),
        sa.Column("created_at", sa.BigInteger(), primary_key=False, nullable=False),
    )
    op.create_index("ix_city_revisions_item_id", "city_revisions", ["item_id"])
    op.create_table(
        "city_import_jobs",
        sa.Column(
            "item_id",
            sa.String(length=36),
            sa.ForeignKey("city_items.id", ondelete="CASCADE"),
            primary_key=True,
            nullable=False,
        ),
        sa.Column("state", sa.String(length=16), primary_key=False, nullable=False),
        sa.Column("phase", sa.String(length=16), primary_key=False, nullable=False),
        sa.Column("attempts", sa.Integer(), primary_key=False, nullable=False),
        sa.Column("available_at", sa.BigInteger(), primary_key=False, nullable=False),
        sa.Column("lease_until", sa.BigInteger(), primary_key=False, nullable=False),
        sa.Column(
            "lease_token", sa.String(length=36), primary_key=False, nullable=True
        ),
        sa.Column("error", sa.String(length=40), primary_key=False, nullable=True),
    )
    op.create_index(
        "ix_city_import_jobs_available_at", "city_import_jobs", ["available_at"]
    )
    op.create_index("ix_city_import_jobs_state", "city_import_jobs", ["state"])


def downgrade():
    op.drop_table("city_import_jobs")
    op.drop_table("city_revisions")
    op.drop_table("city_notes")
    op.drop_table("city_items")
    op.drop_table("city_collections")
