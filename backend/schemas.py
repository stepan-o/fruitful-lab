# backend/schemas.py

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class PinterestAccountStatsMonthlyBase(BaseModel):
    calendar_month: date
    impressions: int
    engagements: int
    outbound_clicks: int
    saves: int


class PinterestAccountStatsMonthlyOut(PinterestAccountStatsMonthlyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    # Pydantic v2-style config
    model_config = ConfigDict(from_attributes=True)