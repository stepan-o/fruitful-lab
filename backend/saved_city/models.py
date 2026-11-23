"""Saved intentions are separate from scored, photo-backed discovery records."""

from sqlalchemy import (
    Column,
    String,
    Integer,
    BigInteger,
    Float,
    ForeignKey,
    JSON,
    UniqueConstraint,
)
from db import Base


class Collection(Base):
    __tablename__ = "city_collections"
    id = Column(String(36), primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    group_id = Column(
        String(36), ForeignKey("discovery_groups.id"), nullable=True, index=True
    )
    access = Column(String(12), nullable=False, default="view")
    created_at = Column(BigInteger, nullable=False)


class Item(Base):
    __tablename__ = "city_items"
    id = Column(String(36), primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    collection_id = Column(
        String(36), ForeignKey("city_collections.id"), nullable=False, index=True
    )
    url = Column(String(2048), nullable=False)
    url_hash = Column(String(64), nullable=False)
    kind = Column(String(12), nullable=False)
    state = Column(String(20), nullable=False, default="queued")
    extracted = Column(JSON, nullable=False, default=dict)
    overrides = Column(JSON, nullable=False, default=dict)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    revision = Column(Integer, nullable=False, default=0)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger, nullable=False)
    checked_at = Column(BigInteger, nullable=True)
    __table_args__ = (
        UniqueConstraint("collection_id", "url_hash", name="uq_city_collection_url"),
    )


class Note(Base):
    __tablename__ = "city_notes"
    item_id = Column(
        String(36), ForeignKey("city_items.id", ondelete="CASCADE"), primary_key=True
    )
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    note = Column(String(4000), nullable=False, default="")
    status = Column(String(20), nullable=False, default="saved")
    record_id = Column(String(36), ForeignKey("discovery_records.id"), nullable=True)


class Revision(Base):
    __tablename__ = "city_revisions"
    id = Column(String(36), primary_key=True)
    item_id = Column(
        String(36),
        ForeignKey("city_items.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    data = Column(JSON, nullable=False)
    created_at = Column(BigInteger, nullable=False)


class Job(Base):
    __tablename__ = "city_import_jobs"
    item_id = Column(
        String(36), ForeignKey("city_items.id", ondelete="CASCADE"), primary_key=True
    )
    state = Column(String(16), nullable=False, index=True)
    phase = Column(String(16), nullable=False)
    attempts = Column(Integer, nullable=False, default=0)
    available_at = Column(BigInteger, nullable=False, index=True)
    lease_until = Column(BigInteger, nullable=False, default=0)
    lease_token = Column(String(36), nullable=True)
    error = Column(String(40), nullable=True)
