import argparse
import getpass
import os

from sqlalchemy import text

from db import SessionLocal

TABLE = "pinterest_account_stats_monthly"


def require_secret() -> None:
    expected = os.getenv("ADMIN_DANGEROUS_SECRET")
    if not expected:
        raise SystemExit("❌ ADMIN_DANGEROUS_SECRET is not set. Refusing to run.")
    provided = getpass.getpass("Admin dangerous secret: ")
    if provided != expected:
        raise SystemExit("❌ Invalid secret. Aborting.")


def wipe_monthly_stats(*, yes: bool) -> None:
    require_secret()

    if not yes:
        confirm = input(
            f'⚠️ This will DELETE ALL rows from {TABLE}.\n'
            'Type "WIPE_PINTEREST_MONTHLY_STATS" to confirm: '
        )
        if confirm != "WIPE_PINTEREST_MONTHLY_STATS":
            print("❌ Aborted. No changes made.")
            return

    db = SessionLocal()
    try:
        count = db.execute(text(f"SELECT COUNT(*) FROM {TABLE}")).scalar() or 0
        db.execute(text(f"DELETE FROM {TABLE}"))
        db.commit()
        print(f"🔥 Wiped monthly stats table. Deleted {count} row(s).")
    finally:
        db.close()


def count_monthly_stats() -> None:
    db = SessionLocal()
    try:
        count = db.execute(text(f"SELECT COUNT(*) FROM {TABLE}")).scalar() or 0
        print(f"Rows in monthly stats: {count}")
    finally:
        db.close()


def main() -> None:
    p = argparse.ArgumentParser(description="Manage Pinterest monthly stats")
    sub = p.add_subparsers(dest="cmd", required=True)

    wipe = sub.add_parser("wipe", help="Wipe ALL monthly stats rows (dangerous)")
    wipe.add_argument("--yes", action="store_true", help="Skip phrase confirmation")

    sub.add_parser("count", help="Count rows")

    args = p.parse_args()
    if args.cmd == "wipe":
        wipe_monthly_stats(yes=bool(args.yes))
    elif args.cmd == "count":
        count_monthly_stats()


if __name__ == "__main__":
    main()
