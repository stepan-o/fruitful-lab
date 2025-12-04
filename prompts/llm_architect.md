Fruitful Lab – Architect Handoff
1. High-level overview

Goal of this app (current scope)
Internal dashboard + API for Fruitful Lab to:

Store monthly Pinterest account stats in Postgres.

Expose them via a typed JSON API.

Secure all sensitive endpoints behind JWT auth, with admin-only protection for data management.

Provide a simple Next.js frontend that:

Authenticates against the backend.

Fetches and displays Pinterest stats for authorized users.

Monorepo layout

fruitful-lab/
backend/     # FastAPI + SQLAlchemy + Postgres API
frontend/    # Next.js 16 + React 19 dashboard
.github/     # (future CI workflows)


Deployments:

Backend: Railway, project root = backend/, exposed via Cloudflare at https://api.fruitfulab.net.

Frontend: Vercel, domain https://fruitfulab.net (+ www.fruitfulab.net), uses backend via env config.

2. Backend – key files, deps & tests
   2.1 Core modules

All paths below are relative to backend/.

main.py

Creates the FastAPI app (with lifespan to Base.metadata.create_all).

Configures CORS:

origins = [
"http://localhost:3000",
"http://127.0.0.1:3000",
"https://fruitfulab.net",
]


Includes routers:

from routers.auth import router as auth_router
from routers.stats import router as stats_router

app.include_router(auth_router)
app.include_router(stats_router)


Public routes:

GET / → {"status": "ok"}

GET /health → {"status": "ok"} (Railway healthcheck)

config.py

Loads environment variables via python-dotenv.

OpenAI:

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
def require_openai_api_key() -> str:
...


JWT:

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)
def require_jwt_secret() -> str:
...


db.py

SQLAlchemy engine bound to DATABASE_URL.

SessionLocal and Base for ORM.

models.py

User:

email, full_name, hashed_password

is_active: bool

is_admin: bool

created_at, updated_at (NOT NULL)

PinterestAccountStatsMonthly:

calendar_month: date

impressions, engagements, outbound_clicks, saves (ints)

created_at, updated_at.

schemas.py (Pydantic v2)

Auth:

Token, TokenData

UserBase, UserCreate, UserOut (with from_attributes=True)

Stats:

PinterestAccountStatsMonthlyBase

PinterestAccountStatsMonthlyOut (adds id, timestamps).

security.py

Passwords: passlib pbkdf2_sha256

hash_password(password: str) -> str
verify_password(plain, hashed) -> bool


User lookup + auth:

get_db() → yields SessionLocal().

get_user_by_email(db, email).

authenticate_user(db, email, password).

JWT:

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
now = datetime.now(timezone.utc)
payload = {"sub": subject, "iat": now, "exp": now + expires_delta}
return jwt.encode(payload, require_jwt_secret(), algorithm=JWT_ALGORITHM)


Dependencies:

get_current_user(token=Depends(oauth2_scheme), db=Depends(get_db))

401 if token invalid/expired/missing.

get_current_active_user(current_user=Depends(get_current_user))

400 if is_active=False.

get_current_admin_user(current_user=Depends(get_current_active_user))

403 "Admin access required" if is_admin=False.

routers/auth.py

POST /auth/login (OAuth2 password flow).

Accepts form data: username (email), password.

Uses authenticate_user.

Returns Token(access_token=..., token_type="bearer").

GET /auth/me

Uses get_current_active_user.

Returns UserOut (includes is_admin, timestamps).

POST /auth/register currently exists but is meant for internal/manual use, not public sign-up flow.

Creates user with hash_password, is_active from payload, is_admin=False.

Sets created_at / updated_at = now.

routers/stats.py

All endpoints here require admin:

current_admin = Depends(get_current_admin_user).

GET /users → list all users (admin only).

GET /pinterest-stats → raw stats list (admin only).

POST /pinterest-stats/upload-csv → admin upload of stats CSV.

Uses parse_calendar_month + parse_int_field from utils.py.

Handles both exact dates and calendar ranges.

GET /pinterest-stats/monthly (this is what the frontend uses)

response_model=list[PinterestAccountStatsMonthlyOut]

Ordered by calendar_month ASC

Requires admin token.

manage_users.py

CLI helper to create/update users and set admin flags (used to create the “test admin” and “test user” accounts in production/test DBs).

Makefile

.PHONY: test run dev-sync

dev-sync:
uv sync --group dev

test:
uv run --group dev pytest -q

run:
uv run uvicorn main:app --host 0.0.0.0 --port $${PORT:-8000}


railway.json

{
"build": { "builder": "NIXPACKS" },
"deploy": {
"startCommand": "uv run uvicorn main:app --host 0.0.0.0 --port=$PORT",
"healthcheckPath": "/health",
"restartPolicyType": "ON_FAILURE",
"restartPolicyMaxRetries": 10,
"numReplicas": 1,
"sleepApplication": false
}
}


Nixpacks build phase runs: uv sync --no-dev --frozen then uv sync --group dev --frozen && make test.

2.2 Dependencies (backend)

From pyproject.toml:

Runtime:

fastapi, uvicorn[standard]

sqlalchemy

psycopg[binary] (Postgres)

python-dotenv

passlib

python-jose[cryptography]

python-multipart

email-validator

Dev ([dependency-groups].dev and [project.optional-dependencies].dev):

pytest

alembic

httpx

2.3 Tests (backend)

All tests live in backend/tests/.

Config

test_config.py

Asserts OPENAI_API_KEY is set and require_openai_api_key() returns it.

Security / auth

test_security.py

Verifies password hash+verify roundtrip works.

test_auth_api.py

Uses env-provided users:

TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD (admin)

TEST_USER_EMAIL, TEST_USER_PASSWORD (non-admin)

Tests:

test_login_and_me_admin_user

Login as admin, call /auth/me, assert is_admin=True.

test_login_and_me_non_admin_user

Login as non-admin, call /auth/me, assert is_admin=False.

test_login_wrong_password_rejected

Wrong password → 401.

test_auth_protection.py

Uses TestClient(app) against real DB (DATABASE_URL).

Env vars as above.

Tests:

test_stats_endpoint_requires_auth

Hitting /pinterest-stats/monthly without token → 401 (“Not authenticated” or “Could not validate credentials”).

test_stats_endpoint_denies_non_admin_user

Non-admin token → 403 “Admin access required”.

test_stats_endpoint_allows_admin_user

Admin token → 200 and JSON list.

test_stats_endpoint_rejects_tampered_token

Corrupted token → 401.

test_stats_endpoint_rejects_expired_token

Uses create_access_token with negative expires_delta → 401.

test_stats_endpoint_rejects_token_for_deleted_user

Creates temp user directly via ORM, issues token, deletes user, then call → 401.

API & DB

test_health_endpoints.py

GET / and /health both return {"status": "ok"}.

test_pinterest_stats_api.py

Logs in as admin → calls /pinterest-stats/monthly.

Asserts 200, list shape and keys present (id, calendar_month, metrics, timestamps).

test_database_schema.py

Connects to DATABASE_URL.

Uses SQLAlchemy inspect to ensure DB tables & columns match User and PinterestAccountStatsMonthly models (types, nullability, PKs).

Important for future work:
Tests assume:

Admin + non-admin test accounts already exist in the DB.

JWT_SECRET_KEY, OPENAI_API_KEY, DATABASE_URL, and test user envs are all set in Railway.

3. Frontend – key files, deps & tests

All paths relative to frontend/.

3.1 Core structure

Framework: Next.js 16, React 19.

Script entry points (in package.json):

"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint",
"test": "jest",
"test:watch": "jest --watch",
"ci": "npm test && npm run build"
}


Core deps:

next, react, react-dom.

Dev deps:

jest, jest-environment-jsdom

@testing-library/react, @testing-library/jest-dom, @testing-library/user-event

eslint, eslint-config-next

typescript, @types/*

Tailwind 4 scaffolding (tailwindcss, @tailwindcss/postcss), although styling is minimal for now.

3.2 Important frontend modules

I’m summarizing based on current tests; exact filenames may differ slightly but logic is as follows.

app/page.tsx (or app/dashboard/page.tsx depending on route)

Renders the dashboard page component.

Dashboard component (e.g. components/DashboardPage.tsx)

On mount:

Reads JWT token (currently from localStorage.getItem("authToken") in the tests; adapt if you move to cookies).

If token missing → throw or show error (tests expect thrown error in one of the scenarios).

Calls fetchPinterestMonthlyStats(token).

Displays loading / error / table states.

lib/fetchPinterestMonthlyStats.ts

Exports async function:

export async function fetchPinterestMonthlyStats(token: string) {
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const res = await fetch(`${baseUrl}/pinterest-stats/monthly`, {
headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) throw new Error("Failed to fetch stats");
return res.json();
}


The tests mock global.fetch and assert correct URL + headers.

UI components

A simple stats table that reads calendar_month, impressions, engagements, outbound_clicks, saves.

3.3 Frontend tests

__tests__/fetchPinterestMonthlyStats.test.ts

Mocks fetch.

Asserts:

Uses NEXT_PUBLIC_API_BASE_URL correctly.

Includes Authorization: Bearer <token> header.

Parses JSON response.

__tests__/dashboardPage.test.tsx

Uses React Testing Library with JSDOM.

Scenarios:

Renders stats table when:

A token is present.

API returns data.

Throws (or shows error) when:

No token is present.

API returns non-OK status.

Jest + React Testing Library are configured to avoid the React.act issue; tests pass locally and on Vercel.

CI on Vercel

Vercel runs npm run ci:

Executes Jest tests.

Builds Next app.

Domains:

fruitfulab.net (primary)

www.fruitfulab.net → connected to Production environment (no redirect).

DNS:

Managed via Cloudflare; A/CNAME records already set per Vercel’s instructions and show as Valid Configuration in the Domains screen.

4. Security & Auth Model (how it’s supposed to work)
   4.1 Identity & roles

Identities: User rows in Postgres.

Created via internal tools:

manage_users.py CLI (preferred).

Or POST /auth/register (internal use only).

Roles:

is_admin=True

Can access all /pinterest-stats/* and /users endpoints.

Intended for Susy + trusted internal admins.

is_admin=False

Currently cannot access any stats endpoints (403).

Exists to support future flows (e.g., client-level dashboards, lower-privilege users).

4.2 Authentication

Backend side

POST /auth/login:

Form fields: username (email), password.

On success: returns JWT access token.

JWT:

Signed with JWT_SECRET_KEY.

Contains:

sub: <user.email>

iat, exp (expiry configurable).

Clients must send:

Authorization: Bearer <token>


on every protected request.

Frontend side (current)

Assumes some authenticated context already has the token and persists it:

For now, tests use localStorage as the “session”.

Real implementation for public flow can upgrade to:

HTTP-only cookies set via a small FastAPI or Next.js API route (recommended for security).

Or still use localStorage but with care (less secure, more SPA-ish).

4.3 Authorization

Protection is done per-endpoint via dependency injection:

@router.get("/pinterest-stats/monthly")
def list_pinterest_stats_monthly(
db: Session = Depends(get_db),
current_admin = Depends(get_current_admin_user),
):
...


get_current_admin_user chains through:

get_current_user → decode JWT, load user by email.

get_current_active_user → checks is_active.

Then checks is_admin.

This is already enforced by tests, so any relaxation of admin checks must be reflected in tests intentionally.

5. Guidance for the Next Architect – Initial Public Flow
   5.1 What “initial public flow” likely means

The next iteration should:

Define how real users log in to the dashboard at fruitfulab.net (front-door UX).

Keep existing admin locks on stats endpoints (we only want trusted accounts seeing internal Pinterest numbers).

Prepare the path for eventual “client dashboards” but don’t open that up yet.

5.2 Back-of-envelope flow to build on

1. Login page on frontend

Create a Next.js page, e.g.:

/login or /app/login depending on routing preference.

UI:

Email + password form.

Calls a frontend route or direct backend:

Option A (simpler now): browser → backend directly

POST to ${NEXT_PUBLIC_API_BASE_URL}/auth/login with Content-Type: application/x-www-form-urlencoded.

On 200: get access_token, store in localStorage (short term) or cookie.

Option B (more secure, recommended when you’re ready):

Next.js app/api/login/route.ts that:

Forwards credentials to backend /auth/login.

Sets an HTTP-only cookie with the token.

Frontend pages then read auth state via that cookie (server components) or via a lightweight /auth/me call.

After successful login:

Redirect to dashboard page (/dashboard or /app).

2. Dashboard + API integration

Dashboard page should:

Resolve current auth state:

If using localStorage: check for token in useEffect. If missing, redirect to /login.

If using cookies: consider server-side route protection or middleware.

Use fetchPinterestMonthlyStats(token) to call /pinterest-stats/monthly.

Render stats table (already mostly implemented).

Keep using:

NEXT_PUBLIC_API_BASE_URL env var pointing to https://api.fruitfulab.net.

3. Respect existing security contracts

Don’t relax admin checks on backend endpoints unless:

You’re adding a new, separate endpoint for non-admin view (e.g. /pinterest-stats/monthly/public).

You update tests to assert the correct protection model.

Any new public-facing endpoint should not expose:

User list.

Raw stats beyond what’s necessary.

5.3 Concrete references for you

When implementing public flow, you’ll most often touch:

Backend

routers/auth.py

May add:

A POST /auth/logout (JWT is stateless, but you can handle it client-side or maintain a denylist later).

Optional: a small /auth/session endpoint for “am I logged in?” checks.

security.py

If you add refresh tokens or multiple token types, expand here.

Frontend

app/login/page.tsx (new) – login form & submission.

lib/fetchPinterestMonthlyStats.ts – already fetches with token; ensure token source aligns with your auth strategy.

components/DashboardPage.tsx – adapt to new auth context (redirect or show login).

Jest tests:

Extend with:

“redirect to login when unauthenticated”.

“shows validation errors when login fails”.

Env / deployment

On Vercel:

NEXT_PUBLIC_API_BASE_URL=https://api.fruitfulab.net

On Railway:

CORS already allows https://fruitfulab.net. If you add preview deployments, you may need to extend origins (or loosen in dev).

If you (future architect) stick to these contracts:

The backend tests will continue to guarantee:

DB schema integrity.

Auth + JWT behavior (including attack-ish edge cases).

Endpoint protection semantics.

The frontend tests will guarantee:

Correct token usage when calling the API.

Basic dashboard rendering behavior.

From here, your main job is to design a UX that wraps around this auth model cleanly (login, logout, session handling) without weakening the existing security surface.