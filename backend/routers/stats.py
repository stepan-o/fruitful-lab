# backend/routers/stats.py
import csv
from datetime import datetime
from io import StringIO

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

import models
from schemas import PinterestAccountStatsMonthlyOut
from security import get_db, get_current_active_user, get_current_admin_user
from utils import parse_calendar_month, parse_int_field

router = APIRouter(tags=["pinterest"])

@router.get("/users")
def list_users(
        db: Session = Depends(get_db),
        current_admin = Depends(get_current_admin_user),  # admin-only
):
    users = db.query(models.User).all()
    return users


@router.get("/pinterest-stats")
def list_pinterest_stats(
        db: Session = Depends(get_db),
        current_admin = Depends(get_current_admin_user),  # admin-only
):
    stats = db.query(models.PinterestAccountStatsMonthly).all()
    return stats


@router.post("/pinterest-stats/upload-csv")
async def upload_pinterest_stats_csv(
        file: UploadFile = File(...),
        convert_calendar_range: bool = False,
        default_calendar_year: int | None = None,
        db: Session = Depends(get_db),
        current_admin = Depends(get_current_admin_user),  # admin-only
):
    # (body is exactly what you had in main.py)
    if file.content_type not in (
            "text/csv",
            "application/vnd.ms-excel",
            "application/octet-stream",
    ):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    content = await file.read()
    text = content.decode("utf-8-sig")

    reader = csv.DictReader(StringIO(text))

    required_columns = {
        "calendar_month",
        "impressions",
        "engagements",
        "outbound_clicks",
        "saves",
    }
    if not required_columns.issubset(reader.fieldnames or []):
        raise HTTPException(
            status_code=400,
            detail=f"CSV must contain columns: {', '.join(sorted(required_columns))}",
        )

    inserted = 0
    line_number = 1

    try:
        for row in reader:
            line_number += 1

            raw_cm = row["calendar_month"]

            if convert_calendar_range:
                calendar_month = parse_calendar_month(
                    raw_cm,
                    default_year=default_calendar_year,
                )
            else:
                calendar_month = datetime.strptime(raw_cm, "%Y-%m-%d").date()

            stats = models.PinterestAccountStatsMonthly(
                calendar_month=calendar_month,
                impressions=parse_int_field(row["impressions"], "impressions"),
                engagements=parse_int_field(row["engagements"], "engagements"),
                outbound_clicks=parse_int_field(row["outbound_clicks"], "outbound_clicks"),
                saves=parse_int_field(row["saves"], "saves"),
            )

            db.add(stats)
            inserted += 1

        db.commit()

    except (ValueError, KeyError) as exc:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error parsing CSV on line {line_number}: {exc}",
        )

    return {"inserted_rows": inserted}


@router.get(
    "/pinterest-stats/monthly",
    response_model=list[PinterestAccountStatsMonthlyOut],
)
def list_pinterest_stats_monthly(
        db: Session = Depends(get_db),
        current_admin = Depends(get_current_admin_user),  # admin-only → dashboard-only
):
    stats = (
        db.query(models.PinterestAccountStatsMonthly)
        .order_by(models.PinterestAccountStatsMonthly.calendar_month.asc())
        .all()
    )
    return stats
