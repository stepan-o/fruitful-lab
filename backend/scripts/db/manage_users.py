# Run from backend/: python -m scripts.db.manage_users
import argparse
import getpass
import os
from datetime import UTC, datetime

import models
from db import SessionLocal
from security import get_user_by_email, hash_password


def parse_groups(raw: str | None) -> list[str]:
    """Parse a comma-separated group string into a normalized list[str]."""
    if not raw:
        return []
    parts = [p.strip().lower() for p in raw.split(",")]
    return [p for p in parts if p]


def create_user(
    email: str,
    password: str,
    *,
    full_name: str | None = None,
    is_admin: bool = False,
    groups: list[str] | None = None,
) -> None:
    """Create a new user. Admins must be explicitly requested & validated."""
    groups = groups or []
    email = email.strip().lower()

    db = SessionLocal()
    try:
        existing = get_user_by_email(db, email)
        if existing:
            print(f"User with email {email} already exists (id={existing.id}).")
            return

        now = datetime.now(UTC)

        user = models.User(
            email=email,
            full_name=full_name,
            hashed_password=hash_password(password),
            is_active=True,
            is_admin=is_admin,
            groups=groups,
            created_at=now,
            updated_at=now,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        tag = " [ADMIN]" if is_admin else ""
        print(f"✅ Created user {email} (id={user.id}){tag} groups={user.groups}")
    finally:
        db.close()


def delete_user(email: str) -> None:
    """Delete a user by email."""
    db = SessionLocal()
    try:
        user = get_user_by_email(db, email)
        if not user:
            print(f"User with email {email} not found.")
            return

        db.delete(user)
        db.commit()
        print(f"🗑️ Deleted user {email}")
    finally:
        db.close()


def list_users() -> None:
    """List all users (with admin flag + groups)."""
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        for u in users:
            groups = getattr(u, "groups", None) or []
            print(
                f"- id={u.id}, email={u.email}, "
                f"active={getattr(u, 'is_active', None)}, "
                f"is_admin={getattr(u, 'is_admin', None)}, "
                f"groups={groups}"
            )
    finally:
        db.close()


def wipe_users(*, yes: bool = False) -> None:
    """Delete all rows from the users table. Fail-closed confirmation required."""
    if not yes:
        confirm = input('⚠️ This will DELETE ALL USERS. Type "WIPE" to confirm: ')
        if confirm != "WIPE":
            print("❌ Aborted. No changes made.")
            return

    db = SessionLocal()
    try:
        count = db.query(models.User).count()
        db.query(models.User).delete()
        db.commit()
        print(f"🔥 Wiped users table. Deleted {count} user(s).")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage Fruitful Lab users")
    sub = parser.add_subparsers(dest="command", required=True)

    # create
    create_cmd = sub.add_parser("create", help="Create a new user")
    create_cmd.add_argument("email")
    create_cmd.add_argument(
        "password", nargs="?", help="Omit for a private password prompt"
    )
    create_cmd.add_argument(
        "--name",
        dest="full_name",
        help="Optional full name for the user",
    )
    create_cmd.add_argument(
        "--admin",
        action="store_true",
        help="Create as admin (requires ADMIN_CREATION_SECRET)",
    )
    create_cmd.add_argument(
        "--groups",
        help='Comma-separated groups, e.g. "contractor,foo"',
    )

    # delete
    delete_cmd = sub.add_parser("delete", help="Delete a user by email")
    delete_cmd.add_argument("email")

    # list
    sub.add_parser("list", help="List all users")

    # wipe
    wipe_cmd = sub.add_parser("wipe", help="Wipe ALL users from the database")
    wipe_cmd.add_argument(
        "--yes",
        action="store_true",
        help="Skip interactive confirmation (DANGEROUS)",
    )

    args = parser.parse_args()

    if args.command == "create":
        # Default: non-admin
        is_admin = False

        if args.admin:
            # Only allow admin creation if secret matches
            secret_env = os.getenv("ADMIN_CREATION_SECRET")
            if not secret_env:
                print(
                    "❌ ADMIN_CREATION_SECRET is not set in the environment.\n"
                    "   Refusing to create an admin user."
                )
                return

            provided = getpass.getpass("Admin creation secret: ")
            if provided != secret_env:
                print("❌ Invalid admin creation secret. Aborting admin user creation.")
                return

            is_admin = True

        groups = parse_groups(getattr(args, "groups", None))

        password = args.password or getpass.getpass(
            "Password (at least 10 characters): "
        )
        if len(password) < 10 or len(password) > 128:
            parser.error("Password must be between 10 and 128 characters")
        if args.password is None and password != getpass.getpass("Confirm password: "):
            parser.error("Passwords do not match")

        create_user(
            args.email,
            password,
            full_name=args.full_name,
            is_admin=is_admin,
            groups=groups,
        )

    elif args.command == "delete":
        delete_user(args.email)

    elif args.command == "list":
        list_users()

    elif args.command == "wipe":
        wipe_users(yes=bool(getattr(args, "yes", False)))


if __name__ == "__main__":
    main()
