## Chunk 1 — Title

# Database Migrations Guide — Fruitful Lab Backend

**Scope:** `backend/` (FastAPI + SQLAlchemy + Alembic)  
**Audience:** anyone changing DB schema (`models.py`, tables, columns, constraints)  
**Reality anchor:** this repo uses Alembic with migrations located in `backend/migrations/` (not `backend/alembic/`).

## 1) Repo Tie-Ins (Where things live)

**Alembic config**
- `backend/alembic.ini`
    - `script_location = %(here)s/migrations`

**Alembic environment**
- `backend/migrations/env.py`
    - imports `DATABASE_URL` from `backend/db.py`:
        - `from db import DATABASE_URL`
    - sets Alembic’s `sqlalchemy.url` from `DATABASE_URL` when present
    - uses SQLAlchemy metadata from:
        - `from models import Base`
        - `target_metadata = Base.metadata`

**Migration files**
- `backend/migrations/versions/*.py`

**SQLAlchemy models**
- `backend/models.py`

**DB engine / session**
- `backend/db.py` (defines `DATABASE_URL`, `engine`, `SessionLocal`, `Base`)

**Dialect note**
- Current migrations indicate Postgres usage (existing migration imports `sqlalchemy.dialects.postgresql`).

## 2) Migration Invariants (Non-Negotiable)

1) **Schema changes must be represented in two places**
    - `backend/models.py` (runtime model truth)
    - `backend/migrations/versions/*` (migration history truth)

2) **Never “hand-edit the DB” in production**
    - No manual SQL applied outside Alembic.
    - If a hotfix is needed, write a migration.

3) **Migrations must be reversible**
    - Every migration must implement both `upgrade()` and `downgrade()`.

4) **Migrations must be deterministic**
    - No time-dependent or environment-dependent behavior inside migrations.
    - If data backfills are needed, they must be explicit and idempotent.

5) **Fail closed on unknown state**
    - If a migration requires assumptions about existing data, validate it (or stop).

## 3) When You Must Create a Migration

Create a new migration whenever you change **anything** that affects the DB schema, including:

- Add/remove/rename columns or tables
- Change column types
- Add/remove NOT NULL constraints
- Add indexes / unique constraints
- Change server defaults
- Change relationship tables / foreign keys
- Add JSON fields (like `users.groups`)

**Example (recent):**
- `users.groups` was added to `backend/models.py`
- A matching migration must add `users.groups` in the database and backfill existing rows.

## 4) Running Alembic (Repo-Specific)

Run Alembic commands from the `backend/` directory because:
- `backend/alembic.ini` sets `script_location = %(here)s/migrations`

### Standard commands
```bash
cd backend

# create a new migration (empty template)
alembic revision -m "describe change"

# create a migration using autogenerate (preferred for schema diffs)
alembic revision --autogenerate -m "describe change"

# apply migrations
alembic upgrade head

# rollback one migration
alembic downgrade -1

# show current revision
alembic current

# show history
alembic history
```

### DB URL source (important)
Alembic gets the DB URL from:
- `backend/migrations/env.py` which uses `DATABASE_URL` from `backend/db.py`

So your environment must set whatever `backend/db.py` uses to build `DATABASE_URL` (or `DATABASE_URL` itself, depending on implementation).


## 5) Recommended Workflow (Step-by-Step)

### Step 1 — Update models first
- Make the schema change in `backend/models.py`

### Step 2 — Generate migration
Prefer:
```bash
cd backend
alembic revision --autogenerate -m "add X to Y"
```

If autogenerate cannot infer the right change (common with JSON defaults, complex constraints), use:
```bash
alembic revision -m "add X to Y"
```
…and hand-write the operations.

### Step 3 — Inspect the migration carefully
Open the new file under:
- `backend/migrations/versions/<revision>_<slug>.py`

Verify:
- `down_revision` points to the current head
- `upgrade()` matches your intended DB schema
- `downgrade()` correctly reverses the upgrade
- Any backfill is explicit and safe

### Step 4 — Apply locally
```bash
cd backend
alembic upgrade head
```

### Step 5 — Run tests
- Run backend tests (existing suite in backend/tests/)
```bash
cd backend
pytest
```

## 6) Handling NOT NULL + Defaults (Backfill Pattern)

When adding a column that must be **NOT NULL**:

### Preferred pattern
1) Add the column with a **server_default** so existing rows are valid
2) Optionally remove the server_default after the backfill if desired (only if consistent with project style)

**Example: JSON list column on Postgres**
```py
op.add_column(
    "users",
    sa.Column(
        "groups",
        sa.JSON(),
        nullable=False,
        server_default=sa.text("'[]'::json"),
    ),
)
```
### Why this pattern?
- Existing rows immediately satisfy NOT NULL
- Avoids a two-step “add nullable → update rows → alter to not null” sequence
- Keeps migration minimal and reliable

### Notes specific to this repo
- Postgres is strongly implied by existing migrations using `sqlalchemy.dialects.postgresql`
- Use Postgres-safe JSON defaults (`'[]'::json`) unless the repo explicitly changes dialect

## 7) Autogenerate Caveats (What Alembic Won’t Get Right)

Alembic autogenerate often needs manual adjustment for:

- **Server defaults** (especially JSON defaults)
- Certain type conversions
- Constraint naming conventions (if not standardized)
- Data migrations/backfills

**This repo example:**
- Existing migration `backend/migrations/versions/b105958cfa97_add_is_admin_to_users.py`
  - includes `postgresql.TIMESTAMP()` adjustments
  - shows that autogenerate may add extra alterations beyond the target change

**Rule**
- Autogenerate is a starting point, not the final truth.
- Always review the full migration file before applying.

## 8) Migration Discipline (Naming + Ordering)

### File naming
Alembic generates:
- `<rev>_<slug>.py`

Write meaningful messages:
- `alembic revision -m "add groups to users"`

### Revision pointers
Every migration must have:
- `revision: str = "<rev>"`
- `down_revision: ... = "<previous rev>"` (or `None` only for the first migration)

### Single responsibility
Prefer one migration per logical change:
- “add groups to users”
- not “add groups and refactor auth and tweak stats table”

## 9) Environments (Local / Staging / Prod)

### Local
- You can rebuild local DB if needed
- Still prefer migrations to keep history accurate

### Staging / Production
- **Never rebuild**
- Always apply migrations:
```bash
cd backend
alembic upgrade head
```

### Railway / Hosted runtime note
- `backend/railway.json` exists; deployment may run in Railway.
- Ensure the deploy pipeline includes `alembic upgrade head` before serving requests, or as a release step.

## 10) Verification Checklist (Before Merge)

1) **Migration created**
- File exists under `backend/migrations/versions/`

2) **Upgrade works**
- `alembic upgrade head` runs cleanly

3) **Downgrade works**
- `alembic downgrade -1` runs cleanly (when safe to test)

4) **Model + DB match**
- `backend/models.py` matches applied schema

5) **Tests pass**
- `pytest` under `backend/`
- Pay special attention to:
  - `backend/tests/test_database_schema.py`
  - any auth-related tests if user table changed

6) **No silent drift**
- If the migration adds a required field (like `groups`), confirm API schemas include it (e.g., `/auth/me` response).

## 11) Common Operations (Examples for This Repo)

### Add a new column
1) Update `backend/models.py`
2) `cd backend && alembic revision --autogenerate -m "add <col> to <table>"`
3) Review migration file under `backend/migrations/versions/`
4) `alembic upgrade head`
5) Run `pytest`

### Add NOT NULL JSON field (like `groups`)
- Use `server_default=sa.text("'[]'::json")` in the migration to backfill existing rows.

### Remove a column
- Implement `op.drop_column()` in upgrade
- Restore column in downgrade (with correct type and defaults)

## 12) Troubleshooting

### “alembic can’t find the DB url”
- Check `backend/migrations/env.py`:
  - It sets `sqlalchemy.url` from `db.DATABASE_URL`
- Confirm environment variables expected by `backend/db.py` are set (or that `DATABASE_URL` resolves).

### “autogenerate produced unexpected alterations”
- This repo’s existing migration altered timestamp types on multiple tables.
- Fix: edit the migration to include only intended changes (unless the extra changes are required and correct).

### “JSON default failed”
- On Postgres, ensure you used:
  - `sa.text("'[]'::json")`
- If the DB expects jsonb, only switch to `::jsonb` if the repo explicitly uses jsonb elsewhere.

## 13) Policy: What Must Be Recorded When Schema Changes

Whenever you add/change schema:

- Migration file added under `backend/migrations/versions/`
- Any new required fields must be reflected in:
  - `backend/schemas.py` (Pydantic)
- If the change impacts auth/session behavior, update:
  - `docs/SYSTEM_IMPLEMENTATION_AUDIT.md` (reality-first)
- Prefer minimal, explicit notes:
  - what changed
  - where it changed
  - how to apply it