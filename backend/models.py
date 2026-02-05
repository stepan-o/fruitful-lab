# backend/models.py

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Integer,
    String,
    JSON,
    UniqueConstraint,
)
from sqlalchemy.sql import func

from db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    is_admin = Column(Boolean, default=False, nullable=False)

    # New: groups as JSON list, non-null, default empty list
    groups = Column(JSON, default=list, nullable=False)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class PinterestAccountStatsMonthly(Base):
    __tablename__ = "pinterest_account_stats_monthly"

    __table_args__ = (
        UniqueConstraint(
            "account_name",
            "calendar_month",
            name="uq_pinterest_monthly_account_month"
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    account_name = Column(String(255), nullable=False, index=True)

    # Month this row represents (you can store e.g. 2025-12-01 for December 2025)
    calendar_month = Column(Date, nullable=False, index=True)

    impressions = Column(Integer, nullable=False, default=0)
    engagements = Column(Integer, nullable=False, default=0)
    outbound_clicks = Column(Integer, nullable=False, default=0)
    saves = Column(Integer, nullable=False, default=0)

    uploaded_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # When this DB row was first created
    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    # when the row was last changed for any reason (system meaning)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
