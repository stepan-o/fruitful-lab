# Auth Landing & Flash UX Contract (v1)

**Status:** Draft (for lock)  
**Scope:** Frontend + Backend integration for post-login routing + user-visible “flash” notes  
**Applies to:** `frontend/app/login/*`, `frontend/app/api/auth/login/route.ts`, protected middleware, `/tools`, `/contractor`, `/dashboard`

---

## 0. Purpose

Define a **single authoritative contract** for:

1) **Where users land after login** (by role)
2) **What happens on failed login**
3) How we show **short-lived UX notes** (“flash”) without introducing client-only security gates
4) How `next=` is handled **safely** and **role-aware**

**Goal:** eliminate “logged in but routed wrong” drift and keep behavior deterministic + testable.
md
Copy code
## 1. Terms & Roles

### 1.1 Identity fields (authoritative)
Source: Backend `GET /auth/me` → returned to frontend via `frontend/lib/auth.ts`.

Required fields:
- `is_admin: boolean`
- `groups: string[]` (non-null; empty list allowed)

### 1.2 Role classification (deterministic)
- **Admin**: `is_admin === true`
- **Contractor**: `is_admin === false` AND `groups.includes("contractor")`
- **General user**: neither admin nor contractor

> **Invariant:** Admin always wins over group membership.
md
Copy code
## 2. Landing Routes (Post-Login)

### 2.1 Default landing targets (by role)
- **Admin** → `/dashboard`
- **Contractor** → `/contractor`
- **General user** → `/tools`

### 2.2 Success behavior (required)
On successful authentication:
- The server MUST resolve identity via `/auth/me` and choose landing route.
- The server returns JSON `{ success: true, redirectTo: "<path>" }`.
- The client MUST `router.push(redirectTo)` and `router.refresh()`.

**No client-side role inference is allowed** as the routing authority.
md
Copy code
## 3. Failure UX (Login Failed → Tools with Note)

### 3.1 Failure landing behavior (required)
On failed login (invalid credentials OR token cannot be validated):
- The client MUST navigate to:
    - `/tools?flash=login_failed`
- `/tools` MUST display a visible banner:
    - “Login failed — try again.”

### 3.2 No failure details leakage
- The UX banner is generic.
- The API may return a more detailed message, but we treat it as internal/non-authoritative.

> **Invariant:** The redirect destination on failure is deterministic: `/tools?flash=login_failed`.
md
Copy code
## 4. Flash Messaging Contract (Query Param v1)

### 4.1 Flash parameter
Use a single query param:
- `flash=<value>`

Allowed values (v1):
- `login_failed`
- `login_success`

### 4.2 Flash placement rules
- On **success**, append `flash=login_success` to the computed destination:
    - `/tools?flash=login_success`
    - `/contractor?flash=login_success`
    - `/dashboard?flash=login_success`
- On **failure**, always go to:
    - `/tools?flash=login_failed`

### 4.3 Flash consumption
- Pages that may display flash:
    - `/tools` (required)
    - `/contractor` (optional but recommended)
    - `/dashboard` (optional; may be added later)
- Flash banners MUST NOT affect authorization logic.
- Flash banners are a UX-only affordance.

> Optional: Auto-dismiss after N seconds (v1 not required).
md
Copy code
## 5. `next=` Contract (Role-Aware + Fail-Closed)

### 5.1 Definition
`next` is the **intended return path** captured by middleware on protected routes.

### 5.2 Construction (middleware)
When redirecting to `/login`:
- `next = req.nextUrl.pathname + req.nextUrl.search`

### 5.3 Validation (server)
The server MUST treat `next` as untrusted input and apply:
- Must start with `/` and MUST NOT start with `//`
- Must be role-allowed (see allowlist below)
- Otherwise ignore it and use the role default landing route.

### 5.4 Role allowlists (v1)
- **Admin**: allow any safe relative path (`/...`)
- **Contractor**: allow only:
    - `/contractor`
    - `/contractor/:path*`
- **General user**: allow only:
    - `/tools`
    - `/tools/:path*`

> **Invariant:** If `next` is not allowed, we do not “best effort” it. We fall back to defaults.
md
Copy code
## 6. Server-Side Authority & Enforcement Points

### 6.1 Single routing authority
The source of truth for `redirectTo` MUST be:
- `frontend/app/api/auth/login/route.ts`

Responsibilities:
1) Authenticate against backend `/auth/login`
2) Set cookie `fruitful_access_token`
3) Fetch backend `/auth/me` using the new token
4) Compute role + allowed destination
5) Return `{ success: true, redirectTo }`

### 6.2 Server-side route gates remain required
Even with correct post-login routing:
- `/contractor/*` MUST remain protected by:
    - middleware presence check
    - server layout gate (fail closed)
- `/dashboard/*` remains protected similarly (existing behavior)

> **Invariant:** Routing is never a substitute for authorization.
md
Copy code
## 7. Route Structure & Canonical Paths

### 7.1 Contractor area canonical route
Canonical contractor namespace:
- `/contractor`

Contractor group layout location:
- `frontend/app/(contractor)/layout.tsx`

Contractor home page location MUST match the redirect target:
- `frontend/app/(contractor)/page.tsx`  ✅ recommended
    - This maps to `/contractor` directly.

> **Note:** If we currently have `frontend/app/(contractor)/contractor/page.tsx`,
> that maps to `/contractor/contractor` (double contractor). This should be corrected.

### 7.2 Tools page canonical route
- `/tools` lives under:
    - `frontend/app/(site)/tools/page.tsx`

### 7.3 Admin home (current)
- `/dashboard` (existing)
  md
  Copy code
## 8. Implementation Tie-Ins (Repo-Specific)

### 8.1 Files that MUST implement this contract
- `frontend/app/api/auth/login/route.ts`
    - role-aware redirect resolution
    - `next` validation + allowlist
    - `flash=login_success` append
- `frontend/app/login/LoginPageClient.tsx`
    - on failure → `router.push("/tools?flash=login_failed")`
    - on success → `router.push(data.redirectTo)`
- `frontend/middleware.ts`
    - protected path matching includes `/contractor/*`
    - `next` preserves querystring
- `frontend/lib/auth.ts`
    - `CurrentUser.groups: string[]` required

### 8.2 Backend dependencies relied upon
- `backend/routers/auth.py`
    - `/auth/login` issues access token
    - `/auth/me` returns `UserOut` including `groups`
- `backend/security.py`
    - identity is derived from JWT + DB user lookup
      md
      Copy code
## 9. Acceptance Tests (Manual)

### 9.1 Failed login
1) Go to `/login`
2) Enter wrong password
3) Expect navigation to:
    - `/tools?flash=login_failed`
4) Tools page shows:
    - “Login failed — try again.”

### 9.2 General user login
1) Go to `/login?next=/tools`
2) Login with non-admin, non-contractor user
3) Expect:
    - `/tools?flash=login_success`

### 9.3 Contractor login
1) Visit protected contractor page while logged out:
    - `/contractor/somewhere?x=1`
2) Expect redirect:
    - `/login?next=/contractor/somewhere?x=1`
3) Login with contractor user
4) Expect:
    - `/contractor/somewhere?x=1&flash=login_success`
    - (or `/contractor?flash=login_success` if next not used)

### 9.4 Admin login
1) Visit protected admin page while logged out:
    - `/dashboard`
2) Expect redirect:
    - `/login?next=/dashboard`
3) Login with admin user
4) Expect:
    - `/dashboard?flash=login_success`
      md
      Copy code
## 10. Non-Goals (Explicit)

- No persistent “toast” framework
- No client-side role gating beyond UX
- No redesign of dashboard or contractor UI in this doc
- No backwards compatibility guarantees
- No analytics events changes (unless a new doc explicitly adds them)
  md
  Copy code
## 11. Open Items to Lock (Needs Your Yes/No)

1) Confirm canonical contractor home route:
    - **Preferred:** `/contractor` implemented by `frontend/app/(contractor)/page.tsx`
2) Should `/contractor` show a flash banner on login success?
    - Recommended but not required.
3) Should we add `flash=login_success` for admin `/dashboard` now, or defer?
    - Optional.