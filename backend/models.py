# backend/models.py

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Integer,
    String,
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

    id = Column(Integer, primary_key=True, index=True)

    # Month this row represents (you can store e.g. 2025-12-01 for December 2025)
    calendar_month = Column(Date, nullable=False, index=True)

    impressions = Column(Integer, nullable=False, default=0)
    engagements = Column(Integer, nullable=False, default=0)
    outbound_clicks = Column(Integer, nullable=False, default=0)
    saves = Column(Integer, nullable=False, default=0)

    created_at = Column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
