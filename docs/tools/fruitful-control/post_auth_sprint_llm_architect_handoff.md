# Handoff — Contractor “Fruitful QA” Tool Sprint (Next LLM Architect)

You’re picking up **contractor-space development** after the Auth Sprint. The auth system is intended to be “done” and should not need changes unless you discover a real defect. Your mission is to build the **Fruitful QA contractor tool** inside the `/contractor` area using the existing role gates + layouts.

This handoff tells you exactly where to start, what’s already enforced, and which files to inspect before sprint planning.

## 0) Current State: What’s “locked” from Auth Sprint

**Login + role-based routing works as intended**:
- Login issues a backend JWT, stores it in `fruitful_access_token` (httpOnly cookie).
- Redirect target is computed server-side (`/api/auth/login`) via `/auth/me` role lookup + role allowlist.
- Middleware enforces protected paths at edge and does role authorization (admin vs contractor vs general).
- Logout clears the cookie via `/api/auth/logout`.

**Protected spaces (current policy)**:
- `/admin/*` → admin only
- `/contractor/*` → contractor OR admin
- everything else is public unless a page/layout gate adds extra constraints

## 1) Contractor Tool Scope: Where You Will Build

You will build the **Fruitful QA tool** under **contractor space**:

- Canonical entry: **`/contractor`**
- You may add nested routes under `/contractor/*` as needed (ex: `/contractor/qa`, `/contractor/jobs`, etc.)

**Key principle:** contractor pages must assume middleware is present but still be safe if middleware changes. Prefer defense-in-depth in layout (same pattern as contractor gate).

## 2) Auth Architecture (As Implemented)

### Backend (FastAPI)
- `POST /auth/login` → returns `access_token` (JWT)
- `GET /auth/me` → returns `{ is_admin, groups[] }`
- JWT expiry default: **240 minutes (4h)**

### Frontend (Next.js App Router)
- `POST /api/auth/login`:
    - calls backend `/auth/login`
    - stores token in cookie `fruitful_access_token`
    - calls backend `/auth/me` to compute role
    - applies **role-based allowlist** for redirect targets (`next`)
    - appends `flash=login_success` only for `/tools*` destinations
- middleware enforces `/admin` and `/contractor`:
    - missing cookie → `/login?next=<pathname+search>`
    - invalid token → clears cookie and redirects to `/login`
    - authenticated but unauthorized → redirects to role-appropriate safe landing:
        - admin → `/admin/dashboard`
        - contractor → `/contractor`
        - general → `/tools`

## 3) Where Authorization Is Enforced (Defense Layers)

### Layer A — Edge middleware (primary)
- Guards:
    - `/admin/*`
    - `/contractor/*`
- Role check done via backend `/auth/me`
- If token invalid/expired → cookie cleared and redirected to login

### Layer B — Layout gates (defense-in-depth)
- Contractor has (or should have) a server-side gate layout (same idea as auth sprint patterns).
- Admin layout exists and is styled; role gate may be middleware-only (check if a server gate was added).

### Layer C — Page redirects
- Root page (`/`) redirects by role after login (admin → dashboard, contractor → contractor home, general → tools).

## 4) “Do Not Break” Contracts (Expected UX + Behaviors)

- `fruitful_access_token` is the single session cookie.
- `/login` always accepts a `next` param and server validates it.
- Any protected route without cookie must redirect to `/login?next=...` preserving full path + query.
- Invalid token must result in cookie clearing + redirect to `/login`.
- Contractors must never be able to access `/admin/*`.
- General users must never be able to access `/contractor/*`.
- Admins can access both `/admin/*` and `/contractor/*`.

## 5) Mandatory Pre-Sprint Manual Inspection (Files You Must Read)

### Frontend: Access + routing
- `frontend/middleware.ts`
    - role computation + role path policy
    - invalid token cookie clearing behavior
    - redirect-to-login `next` behavior
- `frontend/app/api/auth/login/route.ts`
    - role resolution via `/auth/me`
    - `next` allowlist per role
    - cookie set attributes
- `frontend/app/api/auth/logout/route.ts`
    - cookie clearing contract

### Frontend: Contractor space skeleton
- `frontend/app/(contractor)/...`
    - confirm canonical `/contractor` route exists (`page.tsx`)
    - confirm any contractor layout gates exist and match the middleware policy
- `frontend/lib/auth.ts`
    - `getCurrentUser()` helper behavior (null on failure)
    - CurrentUser shape (`is_admin`, `groups`)

### Frontend: FlashBanner + Suspense build constraint
- `frontend/components/layout/FlashBanner.tsx`
    - uses `useSearchParams()`
- any layout rendering `FlashBanner` must wrap it in `<Suspense fallback={null}>`
    - `frontend/app/(site)/layout.tsx`
    - `frontend/app/(admin)/admin/layout.tsx`
    - any contractor layout using it

### Backend: auth primitives
- `backend/routers/auth.py` (login + me)
- `backend/config.py` (JWT expiry)
- `backend/security.py` (role/group dependencies; esp contractor dependency if used)

## 6) Known Gotchas / Recent Fixes You Should Preserve

- **Next build / Vercel export constraint:** components using `useSearchParams()` must be inside **Suspense** to avoid prerender failures (the `/tools` build failure was exactly this).
- Contractor canonical route: ensure `/contractor` is real and not accidentally `/contractor/contractor`.
- Middleware now calls backend `/auth/me` (requires NEXT_PUBLIC_API_BASE_URL to be correct in env).

## 7) Where To Pick Up Contractor Tool Planning (Starting Point)

Start by confirming:
1) `/contractor` renders the intended contractor home for contractor/admin users.
2) general users visiting `/contractor` get redirected away (middleware should do it).
3) contractor layout (if present) enforces the same rules server-side.

Then plan the Fruitful QA tool as:
- A contractor-only workflow UI under `/contractor/*`
- Using the existing cookie auth + role gating
- With minimal/no changes to auth plumbing

Your sprint planning should focus on:
- IA: `/contractor` landing + tool routes
- Data contracts (what QA inputs/outputs are)
- Backend endpoints needed for QA workflows (if any)
- UI scaffolding + navigation within contractor space

## 8) Quick “Smoke Test” Checklist Before You Write Any New Code

- Unauthed:
    - visit `/contractor` → redirects to `/login?next=/contractor`
- Authed general user:
    - visit `/contractor` → redirected to `/tools`
- Contractor user:
    - visit `/contractor` → allowed
    - visit `/admin/dashboard` → redirected away (should not be allowed)
- Admin user:
    - visit `/admin/dashboard` → allowed
    - visit `/contractor` → allowed
- Logout:
    - clears cookie and protected routes redirect to login again

## 9) If You Find Auth Issues: How To Report Without Scope Creep

If you discover auth defects while building contractor tool:
- Write an “Auth Bug Note” with:
    - exact repro path
    - impacted role(s)
    - the file + lines you believe are responsible
    - proposed minimal fix
- Do NOT refactor auth broadly.
- Aim for smallest possible diff that unblocks contractor tool development.