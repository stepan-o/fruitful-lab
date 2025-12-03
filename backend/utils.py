# backend/utils.py
import re
from datetime import datetime, date


def parse_calendar_month(raw: str, default_year: int | None = None) -> date:
    """
    (existing code you already have)
    """
    raw = raw.strip()

    # 1) Try ISO format first
    try:
        return datetime.strptime(raw, "%Y-%m-%d").date()
    except ValueError:
        pass

    # 2) Try 'MM/DD-MM/DD YYYY' or 'MM/DD-MM/DD'
    m = re.match(
        r"^(?P<start_month>\d{2})/(?P<start_day>\d{2})-"
        r"(?P<end_month>\d{2})/(?P<end_day>\d{2})"
        r"(?:\s+(?P<year>\d{4}))?$",
        raw,
    )
    if not m:
        raise ValueError(f"Unrecognized calendar_month format: {raw!r}")

    year_str = m.group("year")
    if year_str is None:
        if default_year is None:
            raise ValueError(
                f"Missing year in calendar_month value: {raw!r}. "
                "Please use 'MM/DD-MM/DD YYYY' or provide a default year."
            )
        year = default_year
    else:
        year = int(year_str)

    start_month = int(m.group("start_month"))
    start_day = int(m.group("start_day"))

    return date(year, start_month, start_day)


def parse_int_field(raw: str, field_name: str) -> int:
    """
    Parse an integer field that may contain thousand separators like '1,313'.

    - Strips whitespace
    - Removes commas
    - Treats empty string as 0
    """
    value = (raw or "").strip().replace(",", "")
    if value == "":
        return 0

    try:
        return int(value)
    except ValueError as exc:
        raise ValueError(f"Invalid integer for {field_name}: {raw!r}") from exc
