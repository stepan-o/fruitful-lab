# Backend migration history and Railway recovery

## Incident and cause — 11 October 2026

Railway built PR #105, then failed its pre-deploy command with:

```text
Can't locate revision identified by 'c1a2b3c4d5e6'
```

The database still records the February legacy head. Commit `d238301` archived
that history and introduced the disconnected fresh-database root `0f1db0936876`.
The new mandatory pre-deploy migration exposed this mismatch. Railway kept the
previous PR #104 deployment active, explaining the 404 recovery endpoint.
This failure occurs before email delivery and is independent of Resend setup.

## Compatibility path

```text
c1a2b3c4d5e6 → 0f1db0936876 → 2cdmx101026 → 3acct101026
legacy snapshot   schema check      game          accounts
```

The active `c1a2b3c4d5e6` file is explicitly a consolidated bootstrap snapshot,
not a claim that the archived incremental scripts created an empty database.
Those scripts depended on pre-Alembic core tables and remain unchanged for audit.
The snapshot contains the frozen CREATE statements previously in `0f1db0936876`.

- **Empty database:** the legacy snapshot creates the core tables; the bridge
  checks them; game and account migrations follow normally.
- **Existing legacy head:** Alembic skips the snapshot. The bridge inspects
  required columns, types, string capacities, nullability, PostgreSQL timezone
  types, primary keys and uniqueness. It preserves all rows and extra columns.
- **Existing current-chain revision:** neither baseline replays. Only unapplied
  game/account migrations run.
- **Unexpected schema or older/unknown revision:** stop for inspection. No
  version-row override, broad catch-and-continue, table recreation or stamp.

On PostgreSQL the bridge restores `uploaded_at DEFAULT CURRENT_TIMESTAMP`,
removed by the archived migration but expected by the consolidated schema/ORM.
It affects future inserts only. Historical values, IDs, passwords, roles and
statistics remain intact. Existing legacy server defaults such as groups `[]`
are retained. Validation intentionally does not depend on evolving ORM models.

The bridge downgrade keeps core tables intact. Automatic downgrade below the
legacy snapshot is blocked rather than deleting accounts/statistics. Later
migration downgrades retain their existing behavior. Offline SQL is supported
for fresh creation and later current-chain upgrades; an existing legacy upgrade
requires online inspection and cannot be emitted as unchecked SQL.

## Railway rollout

After merging the compatibility fix, deploy the latest `master` in the existing
Fruitful backend service. Keep the configured pre-deploy command:

```sh
uv run --group dev alembic upgrade head
```

Do not remove the pre-deploy step, run `stamp head`, edit `alembic_version`, or
recreate the database. Successful logs should show the legacy-to-baseline bridge,
then the game and account migrations. `alembic current` should report
`3acct101026`. If validation lists a schema mismatch, retain the log and inspect
that specific difference before any data change.

Confirm the service starts and `https://api.fruitfulab.net/openapi.json` includes
`/auth/password/forgot`, `/auth/password/reset` and `/admin/users`.
An empty JSON request to `/auth/password/forgot` should return validation status
422, not 404; it cannot send mail. Test actual inbox delivery with an account the
owner controls after confirming `RESEND_API_KEY`, `ACCOUNT_EMAIL_FROM` and
`ACCOUNT_PUBLIC_ORIGIN`; configuration alone is not proof of inbox delivery.

## Verification

`backend/tests/test_migration_history.py` runs isolated SQLite cases by default.
Set `MIGRATION_TEST_DATABASE_URL` to a disposable PostgreSQL server to run the
same checks there, including fixtures constructed by executing the unmodified
archived migrations. Each PostgreSQL case owns a random schema and removes only
that schema. Never point the application's test suite at production.

```sh
uv run --group dev pytest -q tests/test_migration_history.py
```

Coverage includes fresh install, populated legacy upgrade, all existing current
revisions, repeated upgrades, unchanged original rows, malformed schemas,
unknown revisions, safe baseline downgrade, the offline guard and full PostgreSQL rollback if a later migration fails. A migrated
legacy account can log in, request recovery (mocked email), reset its password,
reject its old session/password and log in with the new password.

Locally verified on 11 October: **24 migration cases passed across SQLite and
PostgreSQL** (one PostgreSQL-only rollback case is skipped for SQLite), using a
disposable local PostgreSQL server. The complete backend suite passed **68 tests
with one expected skip**. Changed Python files pass Ruff checks and formatting. Production database
contents and live inbox delivery have not been inspected or changed by this fix.

Reference: [Alembic migration history and pruning](https://alembic.sqlalchemy.org/en/latest/cookbook.html#building-an-up-to-date-database-from-scratch).
