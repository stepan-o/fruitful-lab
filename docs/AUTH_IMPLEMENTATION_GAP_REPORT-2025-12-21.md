# Auth Implementation Gap Report (vs docs/AUTH.md)

Date: 2025-12-21 22:19 (local)

Scope: Compare current repository implementation against the contract defined in docs/AUTH.md and document matches, gaps, and minimal alignment steps. Focus areas include login flow, middleware, flash UX, and contractor/admin routing.

---

## Executive summary

- Strong alignment achieved on identity shape and middleware next handling.
- Key gaps remain in post-login routing authority, failure UX redirection, flash messaging, and contractor route canonical path.
- Backend largely conforms to identity requirements; most deltas are frontend behavior per the contract.

---

## What the contract requires (condensed)

From docs/AUTH.md:

1) Identity fields from /auth/me must include is_admin and groups: string[] (non-null). Roles are derived as Admin, Contractor (groups.includes("contractor")), or General.
2) Post-login success: server (frontend/app/api/auth/login/route.ts) authenticates, sets cookie, calls /auth/me, computes role-appropriate landing, and responds { success: true, redirectTo }. Client pushes redirectTo and refreshes.
3) Post-login failure: deterministic navigation to /tools?flash=login_failed.
4) Flash UX: flash query param with values login_failed or login_success; success appends flash=login_success to chosen destination; /tools must display the banner (others optional).
5) next handling: middleware builds next from pathname + search; login route validates next (must start with /, must be role-allowed via allowlist), otherwise falls back to role default.
6) Authorization remains server-side: middleware presence + server layout gates; routing is not a substitute.
7) Route structure: canonical contractor URL is /contractor; with route group, preferred file is frontend/app/(contractor)/page.tsx (not a nested /contractor/contractor).

---

## Findings by component

### Backend
- backend/routers/auth.py
  - Provides /auth/login and /auth/me.
  - With recent changes, UserOut includes groups, and model persists it. Matches identity fields requirement.
- backend/security.py
  - Adds contractor helper and dependency (admin OR contractor). Aligns with enforcement needs; not directly in AUTH.md but compatible.
- backend/config.py
  - JWT lifetime aligned to 4 hours; consistent with cookie lifetime and broader plan (outside AUTH.md but supportive).

Assessment: Compliant with identity shape; no gaps affecting AUTH.md contract.

### Frontend API route — POST /api/auth/login
- File: frontend/app/api/auth/login/route.ts
  - Current behavior:
    - Authenticates against backend /auth/login and sets cookie.
    - Determines redirectTo using body.next if it starts with "/"; otherwise defaults to "/dashboard".
    - Returns { success: true, redirectTo }.
  - Missing behaviors per AUTH.md:
    - Does not call backend /auth/me using the newly issued token to compute role.
    - Does not compute role-based default (Admin→/dashboard, Contractor→/contractor, General→/tools).
    - Does not validate next against role allowlists (admin:any, contractor:/contractor[/**], general:/tools[/**]).
    - Does not append flash=login_success to redirectTo.

Assessment: Non-compliant with sections 2, 4, and 5 of AUTH.md.

### Login page client
- File: frontend/app/login/LoginPageClient.tsx
  - On failure, currently shows an inline error message and stays on /login.
  - Contract requires redirect to /tools?flash=login_failed.
  - On success, it does push(data.redirectTo) and refresh (this part matches).

Assessment: Partially compliant. Failure path is non-compliant with section 3.

### Middleware
- File: frontend/middleware.ts
  - PROTECTED_PATHS includes /dashboard and /contractor. ✅
  - Redirect when unauthenticated preserves pathname + search in next. ✅ (per Sub‑Sprint 8)
  - Experiment cookie behavior untouched. ✅

Assessment: Compliant with section 5.2 and protection scope for contractor.

### Server-side identity helper
- File: frontend/lib/auth.ts
  - CurrentUser includes groups: string[]. ✅
  - getCurrentUser reads cookie, calls /auth/me, never throws; returns null on failure. ✅

Assessment: Compliant with section 1.1 and support expectations.

### Contractor route structure and gate
- Files:
  - frontend/app/(contractor)/layout.tsx — server-side gate present: redirects unauthenticated to /login (middleware handles full next); redirects authenticated non-admin/non-contractor to /tools. ✅
  - frontend/app/(contractor)/contractor/page.tsx — current contractor home lives here.
  - AUTH.md preference: contractor home should map to /contractor via frontend/app/(contractor)/page.tsx (not /contractor/contractor).

Assessment: Gate is compliant. Route structure is non-compliant with section 7.1 note: current page path renders at /contractor/contractor instead of canonical /contractor.

### Tools page flash UX
- File: frontend/app/(site)/tools/page.tsx
  - Does not consume flash query param or display a banner for login_failed or login_success.

Assessment: Non-compliant with section 4.3 (required for /tools).

---

## Summary matrix

- Identity fields (is_admin, groups): Compliant (backend + frontend types)
- Role-based post-login routing authority in API route: Non-compliant
- Flash param on success (login_success): Non-compliant
- Deterministic failure redirect to /tools?flash=login_failed: Non-compliant
- Middleware next includes querystring: Compliant
- Role-aware next allowlist validation server-side: Non-compliant
- Server-side gates for /contractor: Compliant
- Contractor canonical route at /contractor: Non-compliant (current path is /contractor/contractor)
- Tools page flash banner display: Non-compliant

---

## Minimal alignment steps (implementation-ready)

1) frontend/app/api/auth/login/route.ts
   - After obtaining the token, call GET `${API_BASE_URL}/auth/me` with Authorization: Bearer <token>.
   - Derive role from is_admin and groups.
   - Validate incoming body.next per allowlist:
     - Admin: allow any path starting with "/" but not "//".
     - Contractor: allow only /contractor and /contractor/:path*.
     - General: allow only /tools and /tools/:path*.
   - Choose redirectTo = allowed next OR role default.
   - Append flash=login_success to redirectTo (preserving existing query if present).
   - Return { success: true, redirectTo } as today.

2) frontend/app/login/LoginPageClient.tsx
   - On non-OK response from /api/auth/login, navigate to `/tools?flash=login_failed` instead of showing inline error.

3) Flash banners
   - frontend/app/(site)/tools/page.tsx: read search param flash and render a small banner for:
     - login_failed → “Login failed — try again.”
     - login_success → “You’re signed in.” (or similar; copy per brand style)

4) Contractor route canonicalization
   - Move or add contractor home to frontend/app/(contractor)/page.tsx to map to /contractor.
   - Keep existing nested pages under frontend/app/(contractor)/contractor/* only if URLs are intended to be /contractor/contractor/* (AUTH.md suggests they are not).

Notes:
- Middleware and getCurrentUser already meet the contract; no changes needed there.
- No JWT or backend changes required for this alignment.

---

## Risk assessment

- Redirect loops: Ensure login route never returns a contractor URL to a general user by enforcing allowlists.
- Querystring handling: When appending flash, preserve existing search parameters and avoid duplicate flash keys.
- Backwards compatibility: Changing failure behavior to redirect to /tools may affect tests or expectations; update tests accordingly.

---

## Artifacts reviewed

- docs/AUTH.md
- frontend/app/api/auth/login/route.ts
- frontend/app/login/LoginPageClient.tsx
- frontend/middleware.ts
- frontend/lib/auth.ts
- frontend/app/(site)/tools/page.tsx
- frontend/app/(contractor)/layout.tsx
- frontend/app/(contractor)/contractor/page.tsx
- backend/routers/auth.py, backend/schemas.py, backend/models.py, backend/security.py
