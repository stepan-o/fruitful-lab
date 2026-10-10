# Fruitful Lab accounts

Current implementation: 10 October 2026. The website and Mexico city discovery game share the existing backend `users` table and `fruitful_access_token` session cookie. This change requires deploying the backend migration and frontend together; a frontend preview alone does not install backend routes.

## Website flows

- `/mexico-city/play`: Spanish-default login, create account and forgot password; English is available. Public signup creates an ordinary player with the `mexico-city` directory label. It cannot assign roles. Existing Fruitful Lab users can sign in without creating another account.
- An existing email during signup offers login or recovery. A wrong password offers retry or recovery; it never resets a password automatically.
- `/login`: the existing role-aware Lab login, with links to the same account creation and recovery flows.
- `/admin/users`: administrator-only account directory. Search by name/email, switch between game players and all accounts, create a pending player, edit names/the game directory label, pause/restore access, and issue private password links. Accessible from the admin navigation and an administrator's game profile.
- `/account/reset`: choose and confirm a password using a private link. On success, sign in normally. There is no automatic login.
- A newly created administrator-managed account is pending until its owner chooses a password. An administrator never chooses or sees that person's password. Setup links last 24 hours; recovery links for active accounts last one hour. Generating another replaces the old link.
- Pausing an account signs it out across Fruitful Lab, invalidates outstanding links and preserves discoveries. Recovery cannot reactivate a paused account. Administrator role assignment and disabling administrator accounts are deliberately absent from this screen.
- Existing game users created before this directory label existed appear under **All accounts**; add the game label there. The label organizes the directory, not game authorization: any active Lab user can play.

The authenticated game waits for its own server snapshot before showing a score. Home greets the player, shows their saved discoveries/completed outings and real pending challenge/review actions. Profile separates discovery and learning points from each group's competitive score. Community shows the player's contributions. A matching solo photo completes the selected outing; unrelated and competitive discoveries preserve that goal. The guest outing and all-modes rehearsal remain explicitly separate, temporary experiences.

## Backend rollout and recovery email

1. Keep the existing backend `DATABASE_URL` and `JWT_SECRET_KEY`. Apply `uv run --group dev alembic upgrade head` from `backend/` before running the new code. Head is `3acct101026`, following the game migration `2cdmx101026`. It adds `users.session_version` and `account_access_tokens`; existing accounts and passwords remain intact.
2. `backend/railway.json` includes this pre-deploy command. Confirm the Railway service uses this config file, the backend root and the intended database; otherwise set the same command in its deployment settings. Do not recreate or stamp an existing database to work around a migration error.
3. For self-service recovery, configure **backend** environment variables:
   - `RESEND_API_KEY`: a Resend sending key, stored as a server secret.
   - `ACCOUNT_EMAIL_FROM`: a sender at a domain verified in Resend, e.g. `Fruitful Lab <accounts@your-verified-domain>`.
   - `ACCOUNT_PUBLIC_ORIGIN`: `https://www.fruitfulab.net` in production; an HTTPS staging origin when staging has a separate backend/database. This origin is trusted configuration and never inferred from the incoming Host header.
4. Verify the sending domain's DNS in Resend, deploy the backend, then request a recovery email from an account you control. Check both receipt and one-time use. Never paste a sending key, password or private recovery link into a PR.
5. Deploy the frontend from `apps/lab` with the existing `API_BASE_URL`. No new browser-visible credential or Google Maps setting is needed for accounts.

Until email is configured, recovery displays a clear unavailable message. Administrators can still create and copy private setup/reset links; these are **not emailed** by the directory. Share them privately with the intended account owner. The interface's email-ready indicator checks configuration presence, not DNS validity or delivery success.

An ordinary forgot-password request returns the same accepted response for registered, unknown and paused emails. Delivery runs after the response. Provider/database failures are logged without addresses, tokens, passwords or provider responses. Resend acceptance is not proof of inbox delivery.

References: [Resend sending API](https://resend.com/docs/api-reference/emails/send-email), [Railway pre-deploy commands](https://docs.railway.com/deployments/pre-deploy-command), [OWASP recovery guidance](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html).

## Contracts and controls

| Frontend | Backend | Authority |
| --- | --- | --- |
| `/api/admin/users` GET / POST | `/admin/users` | Backend admin dependency |
| `/api/admin/users/:id` PATCH | `/admin/users/:id` | Backend admin dependency; protected admin accounts |
| `/api/admin/users/:id/setup-link` POST | `/admin/users/:id/setup-link` | Backend admin dependency; ordinary accounts only |
| `/api/account/forgot` POST | `/auth/password/forgot` | Public, bounded recovery requests |
| `/api/account/reset` POST | `/auth/password/reset` | Unexpired one-time bearer link |
| `/api/mexico-city/register` POST | `/discovery/register` | Public, ordinary player creation only |
| Existing login proxy | `/auth/login`, `/auth/me` | Existing shared cookie/JWT flow |

Legacy `/auth/register` is now administrator-only because its payload accepts role groups. Public game signup does not use it. Public signup, admin creation and CLI lookup normalize email casing.

Only a SHA-256 digest of a cryptographically random token is stored. Reissue, consumption and pause lock the user row; consumption re-reads the token after locking. Tokens cannot be reused. Password reset and pause/restore increment the user's session version, so previous JWTs remain invalid even after restoring access. Legacy JWTs without a version are treated as version zero.

The reset document has no analytics/third-party scripts, a restrictive hashed CSP, no-referrer and no-store. The token arrives in a fragment, is immediately removed from the address bar and stays only in page memory until submitted. Refreshing requires reopening the original link. Proxy mutation routes reject cross-origin requests and oversized bodies; the backend independently checks permissions and payloads. Account APIs must not be cached.

Recovery throttling is bounded per process (five requests per email / 15 minutes, sixty per connection address / 15 minutes) plus a database-backed sixty-second per-account resend cooldown. Vercel proxy connections can share an address. Before broad/multi-worker operation, add a shared edge rate limiter and durable email delivery with retries/monitoring; the present background-task sender is suitable for the bounded initial game. The registration/login abuse controls remain a separate hardening item.

## Backend account scripts

The existing maintenance helper is `backend/scripts/db/manage_users.py`. Run it from **`backend/`** as a module, with the intended `DATABASE_URL` set. Prefer the website for routine account work. Omit the password argument to use a private prompt and confirmation, avoiding shell history.

```bash
uv run python -m scripts.db.manage_users list
uv run python -m scripts.db.manage_users create player@example.com --name "Player" --groups mexico-city
uv run python -m scripts.db.manage_users create contractor@example.com --groups contractor
uv run python -m scripts.db.manage_users create admin@example.com --admin --name "Administrator"
```

The administrator command requires `ADMIN_CREATION_SECRET` in the backend environment and prompts for it. This is the bootstrap path when no administrator exists. The CLI still supports `delete` and `wipe`, but those are destructive maintenance operations, not website actions; existing game foreign keys can prevent deleting an account. Use pause to preserve its history. Never run wipe against a shared database for account setup.

## Verification

See `docs/mexico-city-discovery/ACCOUNT_VERIFICATION.md` for the validation performed for this change and production prerequisites. No real user account or real email is created by the automated checks.
