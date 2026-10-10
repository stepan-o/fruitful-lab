"""CDMX private discoveries, groups and normalized prototype photos."""

from alembic import op
import sqlalchemy as sa

revision = "2cdmx101026"
down_revision = "0f1db0936876"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "discovery_profiles",
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("data", sa.JSON(), nullable=False),
    )
    op.create_table(
        "discovery_groups",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("invite", sa.String(64), nullable=False, unique=True),
        sa.Column("data", sa.JSON(), nullable=False),
    )
    op.create_table(
        "discovery_records",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("group_id", sa.String(36), sa.ForeignKey("discovery_groups.id")),
        sa.Column("publication", sa.String(12), nullable=False),
        sa.Column("data", sa.JSON(), nullable=False),
        sa.Column("photo", sa.LargeBinary(), nullable=False),
    )
    for name in ["owner_id", "group_id", "publication"]:
        op.create_index(f"ix_discovery_records_{name}", "discovery_records", [name])


def downgrade():
    op.drop_table("discovery_records")
    op.drop_table("discovery_groups")
    op.drop_table("discovery_profiles")
