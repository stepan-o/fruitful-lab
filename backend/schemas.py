# backend/schemas.py

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ===================== Auth / Users =====================


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: str | None = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    is_active: bool = True


class UserOut(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_admin: bool
    groups: list[str]

    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):
    password: str
    groups: list[str] = Field(default_factory=list)


# ===================== Pinterest Stats =====================


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