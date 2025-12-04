# backend/main.py
import csv
from datetime import datetime
from io import StringIO

from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from db import Base, SessionLocal, engine
import models
from utils import parse_calendar_month, parse_int_field
from schemas import PinterestAccountStatsMonthlyOut
from routers.auth import router as auth_router
from security import get_db, get_current_active_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown (nothing to do yet)


app = FastAPI(lifespan=lifespan)

# --- CORS (update allowed_origins later when frontend is deployed) ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # "https://fruitfulab.net",
    # "https://your-vercel-url.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# NEW: mount auth routes
app.include_router(auth_router)

# --- Startup handled via FastAPI lifespan API (creates tables) ---


# --- Basic routes ---

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users


@app.get("/pinterest-stats")
def list_pinterest_stats(db: Session = Depends(get_db)):
    stats = db.query(models.PinterestAccountStatsMonthly).all()
    return stats


@app.post("/pinterest-stats/upload-csv")
async def upload_pinterest_stats_csv(
        file: UploadFile = File(...),
        convert_calendar_range: bool = False,
        default_calendar_year: int | None = None,
        db: Session = Depends(get_db),
):
    """
    Upload a CSV with columns:
      calendar_month, impressions, engagements, outbound_clicks, saves

    - If convert_calendar_range == False:
        calendar_month must be 'YYYY-MM-DD'
    - If convert_calendar_range == True:
        calendar_month can be:
          - 'YYYY-MM-DD'
          - 'MM/DD-MM/DD YYYY'  (e.g. '01/01-01/31 2024')
          - 'MM/DD-MM/DD'       (e.g. '01/01-01/31') *if* default_calendar_year is provided,
            in which case that year is used.
    """
    # Basic content-type guard (keeps it friendly in the UI)
    if file.content_type not in (
            "text/csv",
            "application/vnd.ms-excel",
            "application/octet-stream",  # some browsers send this for CSV
    ):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    # Read and decode file
    content = await file.read()
    text = content.decode("utf-8-sig")  # strip BOM if present

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
    line_number = 1  # header is line 1

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
                # Strict mode: only ISO date
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
        # Roll back if something goes wrong mid-file
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Error parsing CSV on line {line_number}: {exc}",
        )

    return {"inserted_rows": inserted}


@app.get(
    "/pinterest-stats/monthly",
    response_model=list[PinterestAccountStatsMonthlyOut],
)
def list_pinterest_stats_monthly(
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_active_user),
):
    """
    Typed JSON view of monthly Pinterest stats, ordered by calendar_month.

    This is the endpoint the frontend dashboard will use.
    """
    stats = (
        db.query(models.PinterestAccountStatsMonthly)
        .order_by(models.PinterestAccountStatsMonthly.calendar_month.asc())
        .all()
    )
    return stats
