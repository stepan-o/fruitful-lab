# Manage Users via `uv run` (Fruitful Lab Backend)

This repo includes a CLI helper at:

- `backend/manage_users.py`

It lets you **create**, **list**, **delete**, and **wipe** users in the `users` table (including `groups[]`).

---

## Prerequisites

### 1) Be in the `backend/` directory
All commands below assume you run them from:

- `backend/`

### 2) Set your DB connection
This project’s Alembic config (`backend/migrations/env.py`) pulls the DB URL from:

- `db.DATABASE_URL`

So make sure the environment that `backend/db.py` reads (typically `DATABASE_URL`) is set appropriately for your target DB (local / staging / prod).

### 3) If creating admins, set the admin secret
Admin creation requires:

- `ADMIN_CREATION_SECRET` (env var)

If it’s missing, `--admin` will refuse to run.

---

## Quick Start: Common Commands

### List users
```bash
uv run python manage_users.py list
```

Expected output includes `is_admin` and `groups`:
- `groups=[...]`

### Create a normal user
```bash
uv run python manage_users.py create user@example.com password123 --name "User Name"
```

### Create a contractor user
```bash
uv run python manage_users.py create contractor@example.com password123 --groups contractor
```

### Create a user with multiple groups
```bash
uv run python manage_users.py create multi@example.com password123 --groups "contractor,foo,bar"
```

Normalization rules:
- comma-separated
- trimmed
- lowercased
- empty entries removed

So `" Contractor , Foo "` → `["contractor","foo"]`.

---

## Admin User Creation (Protected)
### Create an admin user (interactive secret prompt)
```bash
uv run python manage_users.py create admin@example.com password123 --admin --name "Admin User"
```

Behavior:
- script checks ADMIN_CREATION_SECRET is set
- prompts: Admin creation secret:
- only creates admin if the typed secret matches

---

## Delete a User
```bash
uv run python manage_users.py delete user@example.com
```

If not found:
- prints a not-found message and does nothing.

---

## Wipe All Users (DANGEROUS)
### Interactive confirmation (recommended)
```bash
uv run python manage_users.py wipe
```

You must type exactly:
- `WIPE`

Or it aborts.

### Non-interactive wipe (CI / reset scripts)
```bash
uv run python manage_users.py wipe --yes
```

This skips the confirmation prompt and immediately deletes all rows in `users`.

---

## Notes About Safety + Scope
- This tool only touches the `users` table (`models.User`).
- `wipe` is destructive by design; it does not affect migrations or schema.
- Group membership is stored as JSON:
  - `models.User.groups` (non-null, defaults to `[]`)

---

## Troubleshooting
### “It connected to the wrong DB”
Double-check the environment in your shell:
- confirm what backend/db.py uses for DATABASE_URL
- ensure you exported the correct value before running uv run

### “Admin creation refused”
Make sure you set:
- `ADMIN_CREATION_SECRET`

Example (shell):
```bash
export ADMIN_CREATION_SECRET="your-secret"
```

### “groups didn’t save”
Confirm:
- your DB migration for `users.groups` was applied
- `users.groups` exists and is `NOT NULL` in the schema
- you’re running against the expected DB