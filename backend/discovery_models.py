"""Additive storage for the bounded CDMX field-game prototype."""

from sqlalchemy import Column, ForeignKey, Integer, JSON, LargeBinary, String
from db import Base


class DiscoveryProfile(Base):
    __tablename__ = "discovery_profiles"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    data = Column(JSON, nullable=False, default=dict)


class DiscoveryGroup(Base):
    __tablename__ = "discovery_groups"
    id = Column(String(36), primary_key=True)
    invite = Column(String(64), nullable=False, unique=True)
    data = Column(JSON, nullable=False, default=dict)


class DiscoveryRecord(Base):
    __tablename__ = "discovery_records"
    id = Column(String(36), primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    group_id = Column(
        String(36), ForeignKey("discovery_groups.id"), nullable=True, index=True
    )
    publication = Column(String(12), nullable=False, default="private", index=True)
    data = Column(JSON, nullable=False)
    photo = Column(LargeBinary, nullable=False)
