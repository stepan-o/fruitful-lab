# backend/routers/admin_pinterest_stats.py
import csv
import re
from datetime import datetime, timezone, date
from io import StringIO
from typing import Dict, List, Tuple

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

import models
from security import get_db, get_current_admin_user
from utils import parse_calendar_month, parse_int_field

router = APIRouter(
    prefix="/admin/pinterest-stats",
    tags=["admin_pinterest_stats"],
)

REQUIRED_HEADERS_NORM = {
    "date_range",
    "impressions",
    "engagements",
    "outbound_clicks",
    "saves",
}


def norm_header(s: str) -> str:
    # "Outbound Clicks" -> "outbound_clicks"
    s = (s or "").strip().lower()
    s = re.sub(r"[^a-z0-9]+", "_", s).strip("_")
    return s


def find_header_row(rows: List[List[str]]) -> Tuple[int, List[str]]:
    """
    Find the first row that looks like the real header row.
    This handles CSVs exported from sheets with title rows above the headers.
    Returns (header_row_index, normalized_fieldnames).
    """
    for i, row in enumerate(rows):
        norms = [norm_header(c) for c in row]
        if REQUIRED_HEADERS_NORM.issubset(set(norms)):
            return i, norms
    raise ValueError(
        "Could not find a header row containing: "
        + ", ".join(sorted(REQUIRED_HEADERS_NORM))
    )


def row_to_dict(header_norms: List[str], row: List[str]) -> Dict[str, str]:
    # Pad short rows, ignore extra columns.
    padded = row + [""] * max(0, len(header_norms) - len(row))
    return {header_norms[i]: padded[i] for i in range(len(header_norms))}


@router.post("/upload")
async def upload_monthly_stats_csv(
        account_name: str = Form(...),
        file: UploadFile = File(...),
        db: Session = Depends(get_db),
        current_admin=Depends(get_current_admin_user),  # admin-only
):
    account_name = (account_name or "").strip()
    if not account_name:
        raise HTTPException(status_code=400, detail="account_name is required")

    if file.content_type not in (
            "text/csv",
            "application/vnd.ms-excel",
            "application/octet-stream",
    ):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    raw = (await file.read()).decode("utf-8-sig")
    reader = csv.reader(StringIO(raw))
    rows = [r for r in reader if any((c or "").strip() for c in r)]  # drop empty rows

    try:
        header_idx, header_norms = find_header_row(rows)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    data_rows = rows[header_idx + 1 :]

    now = datetime.now(timezone.utc)
    inserted = 0
    updated = 0

    try:
        for n, r in enumerate(data_rows, start=header_idx + 2):  # 1-based-ish line nums
            d = row_to_dict(header_norms, r)

            # Parse month from "Date Range" (e.g. "09/01-09/30 2023")
            cm = parse_calendar_month(d["date_range"])
            calendar_month = date(cm.year, cm.month, 1)  # normalize to first of month

            impressions = parse_int_field(d["impressions"], "impressions")
            engagements = parse_int_field(d["engagements"], "engagements")
            outbound_clicks = parse_int_field(d["outbound_clicks"], "outbound_clicks")
            saves = parse_int_field(d["saves"], "saves")

            existing = (
                db.query(models.PinterestAccountStatsMonthly)
                .filter(models.PinterestAccountStatsMonthly.account_name == account_name)
                .filter(models.PinterestAccountStatsMonthly.calendar_month == calendar_month)
                .first()
            )

            if existing:
                existing.impressions = impressions
                existing.engagements = engagements
                existing.outbound_clicks = outbound_clicks
                existing.saves = saves
                existing.uploaded_at = now
                updated += 1
            else:
                db.add(
                    models.PinterestAccountStatsMonthly(
                        account_name=account_name,
                        calendar_month=calendar_month,
                        impressions=impressions,
                        engagements=engagements,
                        outbound_clicks=outbound_clicks,
                        saves=saves,
                        uploaded_at=now,
                    )
                )
                inserted += 1

        db.commit()

    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {exc}")

    return {
        "account_name": account_name,
        "uploaded_at": now.isoformat(),
        "inserted": inserted,
        "updated": updated,
    }


@router.get("/accounts")
def list_accounts(
        db: Session = Depends(get_db),
        current_admin=Depends(get_current_admin_user),
):
    rows = (
        db.query(models.PinterestAccountStatsMonthly.account_name)
        .distinct()
        .order_by(models.PinterestAccountStatsMonthly.account_name.asc())
        .all()
    )
    return [r[0] for r in rows]


@router.get("/monthly")
def list_monthly(
        account_name: str,
        db: Session = Depends(get_db),
        current_admin=Depends(get_current_admin_user),
):
    account_name = (account_name or "").strip()
    if not account_name:
        raise HTTPException(status_code=400, detail="account_name is required")

    stats = (
        db.query(models.PinterestAccountStatsMonthly)
        .filter(models.PinterestAccountStatsMonthly.account_name == account_name)
        .order_by(models.PinterestAccountStatsMonthly.calendar_month.asc())
        .all()
    )
    return stats
