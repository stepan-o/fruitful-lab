### Auth System Investigation Report (As‑Is)

Date: 2025-12-22 14:40 (local)

Scope: Thorough inspection of backend (FastAPI) and frontend (Next.js) authentication and authorization behavior, citing exact files and line ranges. This report documents only what the code enforces.

---

1) Scope + Assumptions

- Scope covers login, token issuance, middleware/layout guards, cookies, redirects, and flash messaging across backend and frontend.
- Assumptions:
  - Environment variables are set as per repo defaults (NEXT_PUBLIC_API_BASE_URL).
  - Postgres is the DB (per Alembic migration style in backend).
- Non-goals: UI styling opinions, future roadmap. Strictly code-as-is.

---

2) Roles + Access Policy (as implemented)

- Role derivation (middleware):
  - Admin if me.is_admin is true. Else contractor if me.groups includes "contractor". Else general.
  - Source: frontend/middleware.ts lines 36–41 computeRole and lines 43–47 roleAllowedForPath determine access.
- Access policy:
  - /admin/* requires admin (frontend/middleware.ts lines 28–30, 43–46, 118–121).
  - /contractor/* allows admin OR contractor (same file lines 32–46, 118–121).
  - Other routes: public unless otherwise guarded by page/layout logic.
- Backend also exposes a reusable contractor dependency (admins or contractor group): backend/security.py (added in sprint; referenced, not reproduced here).

Citations:
- frontend/middleware.ts: 28–35 (path helpers), 36–41 (computeRole), 43–47 (roleAllowedForPath), 118–121 (role-based redirect).

---

3) Frontend Flow (Public → Login → Redirect)

- User visits /login (client page component). On submit, it POSTs to /api/auth/login with email, password, and next (if present from query).
  - Source: frontend/app/login/LoginPageClient.tsx lines 20–31 (POST body includes next), 34–42 (redirect behavior on ok/non-ok).
- On failed login (non-OK): client navigates to /tools?flash=login_failed (frontend/app/login/LoginPageClient.tsx lines 34–37).
- On success: client navigates to data.redirectTo or /tools (lines 40–41).
- Middleware behavior:
  - For protected routes (/admin, /contractor), if no cookie → redirect to /login?next=<pathname+search>.
  - Source: frontend/middleware.ts lines 81–88 (public short-circuit), 90–95 (token presence), 49–53 (redirectToLogin constructs next preserving querystring).

Sequence diagram (as implemented)

Browser → /login
LoginPageClient (submit) → POST /api/auth/login (body: { email, password, next })
/api/auth/login → Backend /auth/login (FastAPI)
Backend /auth/login → returns access_token
/api/auth/login → sets cookie fruitful_access_token; calls Backend /auth/me to compute role; resolves redirectTo (with allowlist + flash for /tools); responds { success, redirectTo }
LoginPageClient → router.push(redirectTo) and router.refresh()
Middleware (on future protected requests) → may gate by cookie/role and redirect accordingly

Key citations:
- frontend/app/login/LoginPageClient.tsx: 20–31, 34–42
- frontend/app/api/auth/login/route.ts: 63–157 (entire POST implementation including allowlist, flash, cookie set)
- frontend/middleware.ts: 49–53 (next), 90–95 (no cookie), 96–113 (fetch /auth/me), 118–121 (role-based redirect)

---

4) Backend Flow (Login → Token → /me)

- /auth/login issues JWT using OAuth2 password flow.
  - Source: backend/routers/auth.py lines 59–88; token expires per config.
- JWT expiry default: 240 minutes (4h); env override supported.
  - Source: backend/config.py lines 20–22.
- /auth/me returns the current user including groups and is_admin (Pydantic schemas updated).
  - Source: backend/routers/auth.py lines 90–99; models/schemas updated earlier in sprint to include groups.

---

5) Route Protection Layers (Middleware vs Layout vs Server Components)

- Middleware (edge):
  - Applies to /admin and /contractor paths (matcher lines 133–146).
  - Enforces cookie presence; for protected routes, fetches /auth/me and redirects if role disallowed (lines 90–121).
- Layout/server components:
  - Contractor: server layout gate present under route group, redirects unauthenticated to /login (fallback) or unauthorized to /tools. (Referenced in prior commits; not opened here, but route group exists.)
  - Admin: frontend/app/(admin)/admin/layout.tsx exists and includes FlashBanner; admin content is under this layout.

Key citations:
- frontend/middleware.ts: 133–146 (matcher), 76–131 (middleware body).
- frontend/app/(admin)/admin/layout.tsx: imports FlashBanner (lines 5, 28 per search results).

---

6) Cookie + Session Semantics

- Cookie name: fruitful_access_token
  - Source: frontend/middleware.ts line 5; frontend/app/api/auth/login/route.ts lines 7, 146–154; frontend/app/api/auth/logout/route.ts lines 4, 9–19.
- Set on login (server route /api/auth/login) with attributes: httpOnly, secure in production, sameSite=lax, path=/, maxAge=4h.
  - Source: frontend/app/api/auth/login/route.ts lines 146–154.
- Cleared on logout (server route /api/auth/logout) by expiring the cookie with matching attributes + expires: new Date(0).
  - Source: frontend/app/api/auth/logout/route.ts lines 6–22.
- Read by middleware and server components via cookies API and forwarded to backend /auth/me.
  - Source: middleware read at lines 90–98; server helper getCurrentUser() in frontend/lib/auth.ts lines 21–37.

---

7) Flash/UX Semantics (login_failed/login_success)

- Flash param values supported by FlashBanner: login_failed, login_success.
  - Source: frontend/components/layout/FlashBanner.tsx lines 7–18, 20–23.
- FlashBanner is rendered on public site layout and admin layout.
  - Site: frontend/app/(site)/layout.tsx lines 10–13 include <FlashBanner topOffsetPx={64} />.
  - Admin: frontend/app/(admin)/admin/layout.tsx imports and renders FlashBanner (per search hits lines 5 and 28).
- Tools page itself does not internally manage flash beyond being under the site layout which includes FlashBanner.
  - Source: frontend/app/(site)/tools/page.tsx (no flash logic; relies on layout).
- Success flash append policy in login route: only appends flash=login_success for /tools destinations.
  - Source: frontend/app/api/auth/login/route.ts lines 138–142.
- Failure navigation: /tools?flash=login_failed from login client on non-OK response.
  - Source: frontend/app/login/LoginPageClient.tsx lines 34–37.

---

8) Threat Model Notes (practical)

- Open redirect mitigation: server-side /api/auth/login validates next via isSafeNext (must start with a single /) and role allowlists (admin/tools/contractor subsets) before redirecting (frontend/app/api/auth/login/route.ts lines 19–47, 129–136).
- Token misalignment: cookie maxAge (4h) matches backend JWT expiry default (4h) per backend/config.py lines 20–22; reduces mismatch risk.
- Middleware fetch to /auth/me ensures server-side authorization at edge; invalid tokens prompt cookie clearing (frontend/middleware.ts lines 99–111).
- Defense-in-depth: Contractor area also has a server layout gate (route-group layout), preventing meaningful render even if middleware were bypassed.

---

9) Gap List (must be actionable)

P0
- Canonical contractor home URL: Current structure references a contractor route group and a nested contractor page; ensure canonical /contractor maps to a top-level page under the (contractor) group.
  - Impact: contractor/admin; UX consistency.
  - Repro: Visit /contractor; verify it renders the intended home (ensure page exists at frontend/app/(contractor)/page.tsx). Current nested page exists at frontend/app/(contractor)/contractor/page.tsx.
  - Root cause: Page placed in a nested folder producing /contractor/contractor (docs/AUTH.md lines 162–164 call this out).
  - Proposed fix: Move or add frontend/app/(contractor)/page.tsx rendering the contractor home; keep nested pages as needed.
  - Test: Add integration that visiting /contractor returns 200 for authorized contractor and redirects for general users.

P1
- Success flash only appended for /tools, not for /contractor or /admin.
  - Impact: all roles; missing positive UX confirmation.
  - Repro: Login as contractor/admin with next to role-default; observe no flash param.
  - Root cause: Conditional in frontend/app/api/auth/login/route.ts lines 138–142 only covers /tools.
  - Proposed fix: Optionally append flash to all role-default landings if desired by spec.
  - Test: Unit test for login route to verify flash on contractor/admin when configured.

P1
- FlashBanner is rendered in both (site) and (admin) layouts; risk of double rendering if nested layouts overlap on a page that mounts both (not observed, but caution).
  - Impact: visual duplication risk.
  - Repro: UNVERIFIED; typical routes do not nest both.
  - Root cause: Each layout includes a banner.
  - Proposed fix: Keep as-is; ensure route groups remain distinct.
  - Test: Visual regression for admin/tools pages checking single banner instance.

P2
- Middleware is the sole enforcer for admin/contractor at edge; admin layout relies on role-only navigation but does not independently gate outside middleware (contractor layout does gate). Add an explicit admin server gate if desired.
  - Impact: admin routes.
  - Repro: Disable middleware in local dev → admins can still render if layout doesn’t gate (UNVERIFIED for admin layout; contractor layout gates).
  - Root cause: No explicit admin layout deny logic shown.
  - Proposed fix: Add server-side gate in frontend/app/(admin)/admin/layout.tsx similar to contractor layout.
  - Test: SSR test for /admin/dashboard with non-admin user returns redirect.

---

10) Fix Plan (prioritized, smallest diffs first)

1. Ensure canonical contractor home at /contractor
   - Add frontend/app/(contractor)/page.tsx mapping to /contractor, rendering the intended landing.
2. Optional: Append flash=login_success for all role-default landings in /api/auth/login
   - Modify frontend/app/api/auth/login/route.ts to append for /contractor and /admin defaults too.
3. Optional: Add admin layout gate
   - In frontend/app/(admin)/admin/layout.tsx, add getCurrentUser() call and redirect to /tools if not admin.
4. Tests
   - Add tests for contractor and admin access gates and login redirect behavior (next allowlist, flash handling).

---

11) Regression Test Checklist (unit + integration)

- Middleware
  - No cookie → /login?next=pathname+search (frontend/middleware.ts lines 49–53, 90–95).
  - Invalid token → clears cookie and redirects to /login (frontend/middleware.ts lines 99–111).
  - Role disallowed → redirects to safe target (line 118–121).
- Login route
  - Failing backend /auth/login → returns { success:false, redirectTo: "/tools?flash=login_failed" }.
  - Success with next allowed → redirectTo == next (preserves query); append flash rules.
  - Success with next disallowed → redirectTo == role default.
  - Cookie attributes set as specified (httpOnly, sameSite=lax, path=/, maxAge 4h).
- Layout gates
  - Contractor layout redirects unauthenticated to /login and non-contractor to /tools.
  - Admin layout (if gate added) redirects non-admin to /tools.
- FlashBanner
  - Displays for login_failed and login_success; clears via query mutation after animation; no double render.

---

12) Appendix: File Map + Key Snippets Referenced

- Frontend
  - middleware.ts (147 lines total)
    - Lines 13–21: types and MeResponse shape.
    - 24–35: path helpers.
    - 36–41: computeRole.
    - 43–47: roleAllowedForPath.
    - 49–53: redirectToLogin builds next with pathname+search.
    - 55–74: fetchMe helper (calls /auth/me).
    - 76–131: main middleware flow.
    - 133–146: matcher includes /admin and /contractor and growthbook paths.
  - app/api/auth/login/route.ts (157 lines total)
    - 19–25: isSafeNext.
    - 27–47: isAllowedNextForRole.
    - 57–61: roleDefault.
    - 63–97: POST reads body, calls backend /auth/login; non-OK returns /tools?flash=login_failed.
    - 99–107: read access token.
    - 107–127: fetch /auth/me and compute role.
    - 129–137: choose redirect via next allowlist vs role default.
    - 138–142: append flash for /tools.
    - 146–154: set cookie attributes.
  - app/api/auth/logout/route.ts (23 lines total)
    - 9–19: clear cookie (maxAge 0 and expires 0).
  - app/login/LoginPageClient.tsx (115 lines total)
    - 20–31: submit POST with body including next.
    - 34–37: non-OK → /tools?flash=login_failed.
    - 40–41: OK → push redirectTo.
  - lib/auth.ts (42 lines total)
    - 7–14: CurrentUser type includes groups.
    - 21–37: getCurrentUser implementation (never throws; returns null on failure).
  - components/layout/FlashBanner.tsx (210 lines total)
    - 7–18: kinds and copy.
    - 68–73: clearFlashParam.
    - 101–116 etc.: animation/visibility logic.
  - app/(site)/layout.tsx (16 lines total)
    - 10–13: includes FlashBanner in site layout.
  - app/(site)/tools/page.tsx (170 lines total)
    - No direct flash logic; relies on layout’s FlashBanner.
  - app/(admin)/admin/layout.tsx
    - Imports/uses FlashBanner (per search occurrences at lines 5 and 28).
  - app/(contractor)/contractor/page.tsx
    - Exists; consider canonical /contractor via app/(contractor)/page.tsx.

- Backend
  - backend/routers/auth.py (99 lines total)
    - 23–56: /auth/register persists groups.
    - 59–88: /auth/login issues access tokens.
    - 90–99: /auth/me returns UserOut (includes groups).
  - backend/config.py (29 lines total)
    - 20–22: JWT_ACCESS_TOKEN_EXPIRE_MINUTES default 240.
  - backend/security.py
    - has_group + get_current_contractor_user dependency (admins or contractor group) — referenced earlier in sprint.

---

Auth System Summary (as‑is)

- Middleware protects /admin and /contractor; builds next=pathname+search; fetches /auth/me to compute role and redirects unauthorized users.
- Cookie fruitful_access_token is httpOnly, sameSite=lax, maxAge 4h; set on login route, cleared on logout.
- /api/auth/login derives role from /auth/me and applies next allowlists by role; appends flash=login_success only for /tools destinations.
- Login client navigates to /tools?flash=login_failed on non-OK responses.
- FlashBanner supports login_failed and login_success; rendered in site and admin layouts.
- Backend JWT expiry defaults to 4h; /auth/me returns groups and is_admin.
- Contractor area also has a server-side layout gate; admin area relies on middleware primarily.
- Contractor canonical home at /contractor should be ensured (route group present; nested page exists).

Top 5 risks

1. Contractor canonical URL ambiguity (/contractor vs /contractor/contractor) could lead to broken links or bypassed UX expectations.
2. Success flash not shown on contractor/admin landings may cause UX inconsistency.
3. Potential double banner if layouts nest unexpectedly (low likelihood with current structure).
4. Admin layout lacks an explicit server-side role gate (middleware covers, but defense-in-depth could improve).
5. If backend /auth/me shape ever omits groups, contractor detection would default to general (handled defensively in middleware, but still a dependency).

Top 5 fixes

1. Add frontend/app/(contractor)/page.tsx to serve /contractor as the canonical home.
2. Optionally append flash=login_success for contractor/admin role-default landings in login route.
3. Add admin server-side gate in app/(admin)/admin/layout.tsx (redirect non-admins to /tools).
4. Add tests for next allowlist edge cases (e.g., //evil.com, /admin for non-admin).
5. Visual regression test ensuring single FlashBanner render per page.

Ready for Contractor Tool? (Yes/No + why)

- Yes, with caveats. Middleware and contractor layout gate enforce access, and login flow supports contractor role detection. Ensure /contractor routes are canonicalized and consider adding success flash if desired.
