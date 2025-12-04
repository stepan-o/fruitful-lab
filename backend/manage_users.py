# backend/manage_users.py
import argparse
import getpass
import os
from datetime import datetime, timezone

from db import SessionLocal
import models
from security import hash_password


def create_user(
    email: str,
    password: str,
    *,
    full_name: str | None = None,
    is_admin: bool = False,
) -> None:
    """Create a new user. Admins must be explicitly requested & validated."""
    db = SessionLocal()
    try:
        existing = db.query(models.User).filter(models.User.email == email).first()
        if existing:
            print(f"User with email {email} already exists (id={existing.id}).")
            return

        now = datetime.now(timezone.utc)

        user = models.User(
            email=email,
            full_name=full_name,
            hashed_password=hash_password(password),
            is_active=True,
            is_admin=is_admin,
            created_at=now,
            updated_at=now,
        )
        db.add(user)
        db.commit()
        print(
            f"✅ Created user {email} (id={user.id})"
            + (" [ADMIN]" if is_admin else "")
        )
    finally:
        db.close()


def delete_user(email: str) -> None:
    """Delete a user by email."""
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            print(f"User with email {email} not found.")
            return

        db.delete(user)
        db.commit()
        print(f"🗑️ Deleted user {email}")
    finally:
        db.close()


def list_users() -> None:
    """List all users (with admin flag)."""
    db = SessionLocal()
    try:
        users = db.query(models.User).all()
        for u in users:
            print(
                f"- id={u.id}, email={u.email}, "
                f"active={getattr(u, 'is_active', None)}, "
                f"is_admin={getattr(u, 'is_admin', None)}"
            )
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Manage Fruitful Lab users")
    sub = parser.add_subparsers(dest="command", required=True)

    # create
    create_cmd = sub.add_parser("create", help="Create a new user")
    create_cmd.add_argument("email")
    create_cmd.add_argument("password")
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

    # delete
    delete_cmd = sub.add_parser("delete", help="Delete a user by email")
    delete_cmd.add_argument("email")

    # list
    sub.add_parser("list", help="List all users")

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

        create_user(
            args.email,
            args.password,
            full_name=args.full_name,
            is_admin=is_admin,
        )

    elif args.command == "delete":
        delete_user(args.email)
    elif args.command == "list":
        list_users()


if __name__ == "__main__":
    main()
