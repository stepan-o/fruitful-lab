"""add groups json to users

Revision ID: 3f2a1c9e4b6d
Revises: b105958cfa97
Create Date: 2025-12-21 17:58:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3f2a1c9e4b6d"
down_revision: Union[str, Sequence[str], None] = "b105958cfa97"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: add users.groups as JSON NOT NULL with server default []."""
    op.add_column(
        "users",
        sa.Column(
            "groups",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'::json"),
        ),
    )


def downgrade() -> None:
    """Downgrade schema: drop users.groups."""
    op.drop_column("users", "groups")
