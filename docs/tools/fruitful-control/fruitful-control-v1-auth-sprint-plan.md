# Sprint Plan — Contractor Identity + Enforcement Primitives (Option 1)

**Sprint Goal:** Introduce a **backend-authoritative contractor identity model** (`groups: ["contractor"]`) and the **enforcement primitives** needed to gate `/contractor/*` **server-side before meaningful render**, while preserving existing analytics/experiment behavior.

**Locked Decisions**
- **Contractor gating = backend identity model (groups/roles) + server-side enforcement**
- **Backend JWT expiry default = 4 hours (240 minutes)** to align with frontend cookie `maxAge=4h`
- **`next` param preserves querystring** (pathname + search)
- **Middleware must include `/contractor/*` in `config.matcher`** (not just `PROTECTED_PATHS`)

**Reality Inputs (confirmed)**
- Login cookie set by: `POST /api/auth/login` → sets `fruitful_access_token` (HttpOnly, maxAge=4h)
- Identity oracle: `frontend/lib/auth.ts` reads cookie → calls backend `GET /auth/me`
- Middleware currently runs on `/dashboard*` and `/tools/pinterest-potential*` (experiment cookies)

**Non-Goals**
- No UI polish or redesign
- No speculative analytics events
- No contractor tool features beyond access model + primitives

# Sub-Sprint 1 — Backend Identity Model: `groups[]` (Source of Truth)

## 1.1 Update DB model
**File**
- `backend/models.py`

**Task**
- Add `groups` column to `User` as a JSON list, non-null, default empty list.

**DoD**
- `User.groups` exists, is non-null, and round-trips as a Python list.
- New users default to `groups=[]` unless explicitly provided.

---

## 1.2 Update Pydantic schemas
**File**
- `backend/schemas.py`

**Tasks**
- Add `groups: list[str]` to `UserOut` (**required**).
- Add `groups: list[str] = []` to `UserCreate` (internal registration only).

**DoD**
- `/auth/me` response validates against `UserOut` and includes `groups`.

---

## 1.3 Wire groups through auth endpoints
**File**
- `backend/routers/auth.py`

**Tasks**
- `POST /auth/register`: store `groups=payload.groups` on the new User.
- `GET /auth/me`: unchanged, but now returns `groups` via updated schema/model.

**DoD**
- Register → login → `/auth/me` returns `groups` exactly as stored.

# Sub-Sprint 2 — Auth Lifetime Alignment (JWT default = 4h)

## 2.1 Align backend JWT expiry default to 4 hours (240 minutes)
**Why**
- Frontend cookie maxAge is already **4 hours**; backend default is **60 minutes**.
- Misalignment creates “cookie present but token expired” behavior (middleware passes, server redirects later).

**File**
- `backend/config.py`

**Task**
- Set default `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` to `240` while preserving env override.

**DoD**
- Backend default JWT expiry is **240 minutes**.
- Decision explicitly recorded in `docs/SYSTEM_IMPLEMENTATION_AUDIT.md` under Auth/JWT config.

# Sub-Sprint 3 — Backend Enforcement Primitive: Contractor Access

## 3.1 Add contractor access dependency (admin OR contractor group)
**File**
- `backend/security.py`

**Tasks**
- Add helper `has_group(user, "contractor")`.
- Add dependency `get_current_contractor_user`:
    - Passes if `current_user.is_admin == True`
    - OR if `"contractor"` is in `current_user.groups`
    - Otherwise returns `403 Contractor access required`

**DoD**
- Contractor access is enforceable server-side via a reusable dependency.
- Fails closed (no implicit grants).

# Sub-Sprint 4 — DB Operations Path (Rebuild or Migration)

## 4.1 Choose operational approach (no backwards compatibility)
**Pick one**
- **Path A: DB rebuild** (fastest; aligned with “we can rebuild anything”)
    - Drop + recreate schema / wipe DB
- **Path B: Alembic migration** (if migrations are in active use)
    - Add migration for `users.groups` JSON NOT NULL DEFAULT '[]'

**DoD**
- `users.groups` exists and is non-null in the database schema.
- Bootstrapping a clean environment produces a working schema with `groups` present.
- This approach is recorded in the audit (DB/migrations section).

# Sub-Sprint 5 — Backend Tooling: User Management Supports `--groups`

## 5.1 Extend manage_users CLI to create contractor users
**File**
- `backend/manage_users.py`

**Tasks**
- Add CLI flag: `--groups "contractor,foo"`
- Parse to list[str] and store on `models.User(groups=...)`
- Update list output to include groups

**DoD**
- Can create a contractor user via:
    - `python backend/manage_users.py create email pass --groups contractor`
- Can still create admin users with secret guard unchanged.
- Listing users shows groups clearly.

# Sub-Sprint 6 — Frontend Identity Contract: Add `groups` to CurrentUser

## 6.1 Update CurrentUser type
**File**
- `frontend/lib/auth.ts`

**Task**
- Extend `CurrentUser` with `groups: string[]` (required).

**DoD**
- TypeScript compiles.
- Server-side `getCurrentUser()` returns `groups` from `/auth/me`.

# Sub-Sprint 7 — Frontend Middleware: Protect `/contractor/*` (Auth Presence)

## 7.1 Add `/contractor` to protected paths AND matcher
**File**
- `frontend/middleware.ts`

**Tasks**
- Add `/contractor` to `PROTECTED_PATHS`.
- Update `config.matcher` to include:
    - `"/contractor"`
    - `"/contractor/:path*"`

**DoD**
- Middleware runs on **all** `/contractor/*` routes (matcher proves it).
- Unauthenticated access to `/contractor/*` redirects to `/login?next=...`.

# Sub-Sprint 8 — Redirect Fidelity: Preserve Querystring in `next`

## 8.1 Make `next` include search params (intentional)
**Decision**
- `next` should be `pathname + search` (full relative path).

**File**
- `frontend/middleware.ts`

**Task**
- When redirecting to `/login`, set:
    - `next = req.nextUrl.pathname + req.nextUrl.search`

**DoD**
- Redirect preserves querystring:
    - `/contractor/tool?variant=v2` → `/login?next=/contractor/tool?variant=v2`
- Decision recorded in `docs/SYSTEM_IMPLEMENTATION_AUDIT.md` under Auth Flow.

# Sub-Sprint 9 — Server-side Authorization Gate for Contractor Routes

## 9.1 Implement server-side group check before meaningful render
**Files (new scaffolding, as needed)**
- `frontend/app/contractor/layout.tsx` (preferred central gate), or
- per-page server components under `frontend/app/contractor/**`

**Tasks**
- Call `getCurrentUser()` server-side.
- Enforce:
    - If no user → redirect `/login?next=...`
    - If not admin AND not `groups.includes("contractor")` → deny (redirect `/tools` or render 403)

**DoD**
- Authenticated non-contractor cannot access contractor pages (fail closed).
- Contractor and admin can access contractor pages.
- No meaningful page content renders before checks complete.

# Sub-Sprint 10 — Tests: Backend

## 10.1 Add/extend backend tests for groups + contractor access
**Files**
- `backend/tests/*` (extend existing auth/security tests or add new ones)

**Test cases**
- `/auth/me` returns `groups` for authenticated user.
- Contractor dependency:
    - allows admin
    - allows contractor group
    - denies normal authenticated user (403)
    - denies inactive user (400 from active user dependency)
- JWT expiry default aligns to 240 minutes (test config default or token exp delta).

**DoD**
- Backend tests pass locally and in CI.
- Contractor gating behavior is covered and deterministic.

# Sub-Sprint 11 — Tests: Frontend

## 11.1 Update frontend tests for new identity shape
**Files**
- `frontend/__tests__/auth.test.ts` (update mocks to include `groups`)
- Add/extend tests for redirect behavior if present

**DoD**
- Frontend tests pass after `groups` becomes required.
- Any existing auth mocks include `groups` explicitly (no implicit undefined).

# Sub-Sprint 12 — Manual Verification Checklist

## 12.1 Auth + cookie + identity checks
- Login via `/login`:
    - confirm response sets `fruitful_access_token` cookie (HttpOnly).
- Call backend `/auth/me` with the cookie token:
    - confirms `groups` returned.

## 12.2 Contractor route checks (critical)
- Visit `/contractor/tool?variant=v2` while logged out:
    - redirects to `/login?next=/contractor/tool?variant=v2`
- Log in as **normal user** (no contractor group):
    - access `/contractor/*` → denied (redirect `/tools` or 403)
- Log in as **contractor user** (`groups=["contractor"]`):
    - access `/contractor/*` → allowed
- Log in as **admin**:
    - access `/contractor/*` → allowed

**DoD**
- All four scenarios behave exactly as specified.
- No partial content render occurs before server-side authorization.

# Sub-Sprint 13 — Update `SYSTEM_IMPLEMENTATION_AUDIT.md` (Reality)

**File**
- `docs/SYSTEM_IMPLEMENTATION_AUDIT.md`

**Required updates**
- Auth model: `User` now includes `groups: list[str]`.
- Auth flow: `/api/auth/login` sets cookie; `/auth/me` returns `groups`.
- Middleware:
    - matcher includes `/contractor/*`
    - protected path behavior includes `/contractor/*`
    - `next` param preserves querystring (pathname + search)
- JWT config: default expiry is **240 minutes (4 hours)** to align with cookie.

**DoD**
- Audit reflects repo reality exactly (no “missing login” ambiguity, no contractor hand-waving).
- All locked decisions (JWT=4h, next includes search, matcher includes contractor) are explicitly stated.

# Final Definition of Done (Sprint-wide)

- Backend:
    - `User.groups` exists (non-null) and defaults to `[]`.
    - `/auth/me` returns `groups` (required in schema).
    - Contractor enforcement dependency exists (`get_current_contractor_user`) and is tested.
    - Backend JWT expiry default is **240 minutes** (aligned with cookie maxAge=4h).
- Frontend:
    - `CurrentUser` includes `groups: string[]`.
    - Middleware protects `/contractor/*` for unauthenticated users.
    - Middleware `config.matcher` explicitly includes `/contractor` and `/contractor/:path*`.
    - Login redirect `next` param preserves querystring (`pathname + search`).
    - Server-side authorization denies non-contractor/non-admin users for `/contractor/*` (fail closed).
- Verification:
    - Manual checklist passes for logged-out, normal user, contractor, and admin.
    - Tests pass (backend + frontend).
- Documentation:
    - `docs/SYSTEM_IMPLEMENTATION_AUDIT.md` updated with all three locked decisions and new contractor identity reality.