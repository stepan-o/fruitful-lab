### System Implementation Audit — Fruitful Lab Tech Hub

Status: Confirmed repository state as of 2026-01-10 17:33 (local)

This document describes the system as implemented in this repository. It is descriptive only. No recommendations, no inferred intent. Unknowns are explicitly marked with missing evidence.

Contents
- 1. Repository Layout & Structure
- 2. Frontend Architecture (Next.js App Router)
- 3. Routing Map + Access Tier Map
- 4. Middleware (Auth + Experiments)
- 5. Auth Flow (End-to-End)
- 6. Analytics Implementation (GTM / GA4)
- 7. Public Tools System
- 8. Experiments & Feature Flags (GrowthBook)
- 9. Backend API (FastAPI)
- 10. DB / Migrations
- 11. Testing & CI
- 12. Known Ambiguities & Missing Pieces

## 1. Repository Layout & Structure

Top-level directories (runtime relevance):
- backend — FastAPI application. Evidence: backend/main.py (lines 33–36) includes routers for auth and stats.
- frontend — Next.js App Router application. Evidence below.
- docs — Documentation only; non-runtime.
- prompts — Prompts/specs; non-runtime.

Monorepo boundaries:
- Frontend and backend live side-by-side. No workspace tooling detected in this audit. Evidence: project root listing in issue context.

## 2. Frontend Architecture (Next.js App Router)

Root layout behavior:
- GTM injection occurs when NEXT_PUBLIC_GTM_ID is present. Evidence: frontend/app/layout.tsx (lines 32–70) sets window.dataLayer and injects GTM script + noscript iframe.
- Fonts via next/font: Playfair_Display_SC and Poppins. Evidence: frontend/app/layout.tsx (lines 7–19).

Route groups and layout nesting:
- (site) group provides public site layout. Evidence: frontend/app/(site)/layout.tsx (file exists; contents not shown here) used by public pages like /tools (see below).
- (flow) group contains flow routes such as the Pinterest Potential Calculator entry. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (entire file).
- (admin)/admin group for admin area with a layout that gates access. Evidence: frontend/app/(admin)/admin/layout.tsx (lines 10–22 access checks) wraps children (lines 24–60).
- (contractor) group with access gating in layout. Evidence: frontend/app/(contractor)/layout.tsx (lines 13–25).

Identify server vs client components:
- Root layout (server component): frontend/app/layout.tsx.
- Home route (server component): frontend/app/page.tsx (lines 6–25) uses getCurrentUser and redirect.
- Tools index page is client component ("use client"). Evidence: frontend/app/(site)/tools/page.tsx (line 1).
- Pinterest Potential entry /tools/pinterest-potential is server component that selects variant and lead mode. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 32–61, 70–90).
- Admin layout is server component enforcing access. Evidence: frontend/app/(admin)/admin/layout.tsx (lines 10–22).
- Contractor layout is server component enforcing access. Evidence: frontend/app/(contractor)/layout.tsx (lines 13–25).
- Client-side analytics helpers and hooks are marked "use client". Evidence: frontend/lib/gtm.ts (line 1); frontend/lib/hooks/useToolAnalytics.ts (line 1).

## 3. Routing Map + Access Tier Map

Table lists routes discovered and their access tier, with enforcement location and failure behavior.

| Route | Access Tier | Enforcement location | Failure behavior |
| - | - | - | - |
| / | Public for logged-out; redirects for logged-in | frontend/app/page.tsx (lines 6–25) | Logged-in admin → /admin/dashboard; contractor → /contractor; others → /tools |
| /tools | Public | client page at frontend/app/(site)/tools/page.tsx (entire file) | N/A |
| /tools/pinterest-potential | Public | server page at frontend/app/(flow)/tools/pinterest-potential/page.tsx (entire file) | N/A |
| /login | Public | frontend/app/login/page.tsx (entire file) renders LoginPageClient | N/A |
| /admin and /admin/:path* | Admin | middleware and server layout | Middleware: frontend/middleware.ts (lines 133–146); Server layout gate: frontend/app/(admin)/admin/layout.tsx (lines 10–22) | If unauth in middleware: redirect to /login?next=… (lines 49–53). If authed but not admin in layout: redirect to /contractor or /tools (lines 18–22) |
| /admin/dashboard | Admin | server page and layout | If no user: redirect("/login?next=/admin/dashboard") at frontend/app/(admin)/admin/dashboard/page.tsx (lines 24, 36) |
| /contractor and /contractor/:path* | Contractor (admin also allowed) | middleware and server layout | Middleware matchers: frontend/middleware.ts (lines 133–141). If no token: redirect to /login?next=… (lines 90–95, 49–53). If authed but not allowed: redirect to /tools (lines 118–121). Server layout: frontend/app/(contractor)/layout.tsx redirects to /login?next=/contractor if unauth (lines 17–19) and to /tools if not allowed (lines 21–25). |

Notes:
- Middleware’s protected path list is ["/admin", "/contractor"]. Evidence: frontend/middleware.ts (lines 13–35, 133–141).
- No /dashboard route outside /admin scope is present; redirects refer explicitly to /admin/dashboard.

## 4. Middleware (Auth + Experiments)

Matchers (which paths run middleware):
- frontend/middleware.ts config.matcher includes:
  - "/admin", "/admin/:path*"
  - "/contractor", "/contractor/:path*"
  - "/tools/pinterest-potential", "/tools/pinterest-potential/:path*" (for experiment cookies)
  Evidence: frontend/middleware.ts (lines 133–146).

Auth cookie name(s):
- fruitful_access_token. Evidence: frontend/middleware.ts (line 5); also frontend/lib/auth.ts (line 4); API route sets the same cookie (frontend/app/api/auth/login/route.ts lines 146–154).

Redirect behavior and next param preservation:
- When unauthenticated on protected routes: redirect to /login?next=<pathname+search>. Evidence: frontend/middleware.ts (lines 49–53, 90–95).
- When token invalid per backend /auth/me: middleware clears cookie (maxAge 0) and redirects to /login with next param. Evidence: frontend/middleware.ts (lines 99–112).
- When authed but role not permitted: redirect to role-appropriate target without next param (admin → /admin/dashboard; contractor → /contractor; general → /tools). Evidence: frontend/middleware.ts (lines 118–121).

Experiment cookie assignment logic (GrowthBook-related):
- Middleware applies experiment cookies for /tools/pinterest-potential* via applyExperimentCookies(req, res). Evidence: frontend/middleware.ts (lines 79–88, 125–130).
- Cookie name for the Pinterest Potential experiment variant: pp_variant. Evidence: frontend/lib/tools/pinterestPotentialConfig.ts (line 17) and used in frontend/lib/growthbook/middleware.ts (lines 59–76).
- Cookie attributes when set by applyExperimentCookies: httpOnly: false, sameSite: "lax", path: "/", maxAge ≈ 90 days. Evidence: frontend/lib/growthbook/middleware.ts (lines 70–76).

## 5. Auth Flow (End-to-End)

Frontend identifies the user:
- getCurrentUser reads fruitful_access_token cookie and calls backend /auth/me. Evidence: frontend/lib/auth.ts (lines 21–41). Used by pages and layouts, e.g., frontend/app/page.tsx (lines 6–25), frontend/app/(admin)/admin/layout.tsx (lines 10–22), frontend/app/(contractor)/layout.tsx (lines 13–25).

Where the access token cookie is read:
- Server-side via next/headers cookies(): frontend/lib/auth.ts (lines 21–29).
- Middleware via req.cookies.get(): frontend/middleware.ts (lines 91–94).

Where it is written:
- The login API route /api/auth/login writes fruitful_access_token. Evidence: frontend/app/api/auth/login/route.ts (lines 146–154).

/login existence and behavior:
- Route exists: frontend/app/login/page.tsx (entire file) renders LoginPageClient. The client submits to /api/auth/login and redirects based on API response. Evidence: frontend/app/login/LoginPageClient.tsx (submission at line 26; redirect handling lines 34–42 referenced in docs; file present in repo per search results).

Backend endpoints used:
- /auth/login (POST): OAuth2 password flow, returns access_token. Evidence: backend/routers/auth.py (lines 59–88).
- /auth/me (GET): returns current user object including is_admin and groups. Evidence: backend/routers/auth.py (lines 90–99).

Failure behaviors:
- Failed login responds with redirectTo: "/tools?flash=login_failed". Evidence: frontend/app/api/auth/login/route.ts (lines 86–96).
- Successful login computes role and returns redirectTo to either requested "next" (validated and role-allowed) or default per role; appends flash=login_success only when landing is under /tools. Evidence: frontend/app/api/auth/login/route.ts (lines 129–143).

## 6. Analytics Implementation (GTM / GA4)

Where GTM is injected and how window.dataLayer is initialized:
- GTM injected in root layout when NEXT_PUBLIC_GTM_ID is set. Script initializes window.dataLayer and loads GTM. Evidence: frontend/app/layout.tsx (lines 32–53, 55–63).

Analytics helper module(s) and available functions:
- frontend/lib/gtm.ts defines pushEvent, trackToolView, trackToolStart, trackLeadSubmit, trackCtaClick. Evidence: frontend/lib/gtm.ts (lines 11–44).

Canonical event emission coverage:

Analytics Event Coverage Table

| event name | helper exists | callsites exist? | where | payload keys | guarded? |
| - | - | - | - | - | - |
| tool_view | Yes | Yes | frontend/lib/hooks/useToolAnalytics.ts (lines 20–25) | { event: "tool_view", tool_name, location } | useRef firedRef prevents double firing (lines 12–25) |
| tool_start | Yes | Yes | Fired via useToolAnalytics().trackToolStart; used by PinterestPotentialV1: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 19, 30–35) and triggered on first successful Next in wizard: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 297–304) via onStart | { event: "tool_start", tool_name, location } | Guarded by hasStartedRef in wizard (lines 259, 297–304) |
| lead_submit | Yes | Yes | PinterestPotentialWizard: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 306–315) | { event: "lead_submit", location, tool_name, button_label } | Emitted only when lead step completes; no additional duplicate guard beyond flow step type check |
| cta_click | Yes | Yes | Tools index CTA link: frontend/app/(site)/tools/page.tsx (lines 72–76) and external link (lines 157–165) | { event: "cta_click", button_label, location, [tool_name?] } | No explicit dedupe; normal click handler |

Search across repo found no direct window.dataLayer.push usage outside helpers. Evidence: repo search for "dataLayer.push" returned none in app code.

## 7. Public Tools System

Pinterest Potential Calculator route entry page:
- Path: /tools/pinterest-potential. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (file header comment line 1 and export default function lines 32–61).

Variant resolution precedence:
- 1) ?variant query param if valid, 2) cookie value if valid, 3) DEFAULT_VARIANT. Evidence: resolvePinterestPotentialVariant in frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 70–81) and normalizeVariant (lines 83–90). Cookie name is pp_variant (frontend/lib/tools/pinterestPotentialConfig.ts line 17).
- Cookie is assigned in middleware via applyExperimentCookies when visiting this route. Evidence: frontend/middleware.ts (lines 79–88, 125–130) and cookie write attributes: frontend/lib/growthbook/middleware.ts (lines 70–76).

Lead mode resolution + lead token flow:
- Lead mode is resolved with resolveLeadMode using requested leadMode, optional cookie ppc_lead_mode, and whether a user or tokenLead is present. Evidence: frontend/app/(flow)/tools/pinterest-potential/page.tsx (lines 39–50). Token-derived lead via resolveLeadFromToken(searchParams.t). Evidence: same file (lines 41–55) and types from frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts (file exists per recent files list).

Wizard state storage:
- The wizard component text states "Your progress is saved for this session." Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (lines 26–28). Under-the-hood state storage mechanism within the wizard is not explicitly confirmed in this audit due to scope of the single file view; no localStorage/sessionStorage API usage appears in the inspected slices. Unknown: exact persistence mechanism and keys. Missing evidence: explicit calls to sessionStorage/localStorage in the wizard and related components.

Where tool_start fires:
- On the first successful Next action in the wizard, guarded to fire once. Evidence: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx (lines 297–304) invoking onStart; onStart is trackToolStart passed from V1 component (frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx lines 19, 30–35). The hook computes location from window.location.pathname. Evidence: frontend/lib/hooks/useToolAnalytics.ts (lines 27–33).

## 8. Experiments & Feature Flags (GrowthBook)

Experiment keys and variant enums:
- Pinterest Potential experiment defined with variants from the tool config. Evidence: frontend/lib/experiments/config.ts (lines 46–53 define PINTEREST_POTENTIAL_EXPERIMENT using variants imported from frontend/lib/tools/pinterestPotentialConfig.ts lines 5–11).

Where assignment happens:
- Middleware applies experiment cookies on route match for /tools/pinterest-potential. Evidence: frontend/middleware.ts (lines 79–88, 125–130) calls applyExperimentCookies.
- applyExperimentCookies delegates to runServerExperiment and then sets cookie. Evidence: frontend/lib/growthbook/middleware.ts (lines 53–77).

Cookie name(s) and how they’re set:
- Cookie name: pp_variant. Evidence: frontend/lib/tools/pinterestPotentialConfig.ts (line 17). Set in applyExperimentCookies with httpOnly: false, sameSite: "lax", path: "/", maxAge ≈ 90 days. Evidence: frontend/lib/growthbook/middleware.ts (lines 70–76).

GrowthBook evaluation: client or server
- The middleware uses a server-side experiment runner (runServerExperiment). Evidence: frontend/lib/growthbook/middleware.ts (lines 67–69 comment and call). The exact internals of runServerExperiment and whether GrowthBook SDK is used server-side are not shown in this audit; file referenced at frontend/lib/growthbook/experiments (import line 10). Unknown: explicit GrowthBook client initialization file and exposure callbacks.

Exposure tracking:
- No explicit exposure tracking event emission was identified in the reviewed code for the Pinterest Potential experiment. Unknown/Not Implemented: where a tracking callback is invoked. Missing evidence: calls to a GrowthBook exposure callback or analytics for variant exposure.

Debug endpoints:
- None identified in frontend for experiments. No special debug route discovered by search. Unknown.

Distinction:
- Variant assignment is handled in middleware via cookie; no explicit exposure event was found.

## 9. Backend API (FastAPI)

Routers and endpoints:
- Base app: backend/main.py (lines 33–36) includes routers: auth and stats. Health endpoints at / and /health (lines 37–43).
- Auth router: backend/routers/auth.py
  - POST /auth/register — creates a user. Evidence: lines 23–57.
  - POST /auth/login — OAuth2 password flow; returns Token(access_token, token_type). Evidence: lines 59–88.
  - GET /auth/me — returns current_user (UserOut). Evidence: lines 90–99.
- Pinterest stats router: backend/routers/stats.py
  - GET /users — admin-only list users. Evidence: lines 16–22 with Depends(get_current_admin_user).
  - GET /pinterest-stats — admin-only list all stats. Evidence: lines 25–31 with Depends(get_current_admin_user).
  - POST /pinterest-stats/upload-csv — admin-only CSV upload/ingest. Evidence: lines 34–106 with Depends(get_current_admin_user).
  - GET /pinterest-stats/monthly — admin-only list with response model. Evidence: lines 108–121 with Depends(get_current_admin_user).

Auth dependencies and role/group checks:
- OAuth2PasswordBearer configured with tokenUrl "/auth/login". Evidence: backend/security.py (line 21 per repo search result).
- get_current_active_user and get_current_admin_user used to protect endpoints. Evidence: backend/routers/stats.py (lines 19–21, 28–29, 40–41, 114–115).
- users.groups exists in models/schemas and is used in registration and exposure via /auth/me. Evidence: backend/routers/auth.py (lines 45–52 set groups on user; /auth/me returns UserOut).

Admin-only endpoints vs contractor-scoped endpoints:
- Admin-only endpoints present under stats router as above. No contractor-specific backend endpoints were identified. If any contractor scope exists, it is enforced at frontend route level only in this repo.

## 10. DB / Migrations

Alembic configuration paths:
- backend/alembic.ini exists (file present). Alembic environment found at backend/migrations/env.py. Evidence: repo search results for "alembic".

Migration adding users.groups:
- backend/migrations/versions/3f2a1c9e4b6d_add_groups_json_to_users.py exists. Evidence: repo search results list this migration file.
- admin flag migration also exists: backend/migrations/versions/b105958cfa97_add_is_admin_to_users.py. Evidence: repo search results show this file.

Other migrations relevant to auth or tools:
- No additional tool-specific migrations identified in this audit.

## 11. Testing & CI

Tests (selected):
- Frontend middleware auth tests: frontend/__tests__/middleware.auth.test.ts — covers redirects and role handling. Evidence: references to "/admin/dashboard" etc. in search results.
- Frontend route tests for Pinterest page: frontend/__tests__/routes/pinterestPotentialPage.test.tsx — tests variant resolution and rendering. Evidence: search results.
- Frontend component tests (header, buttons). Evidence: frontend/components/layout/__tests__/SiteHeader.test.tsx; frontend/__tests__/Button.test.tsx.
- Backend tests: backend/tests/test_auth_api.py and backend/tests/test_auth_protection.py — cover /auth/login and protected endpoints. Evidence: search results for "/auth/login" in tests.

CI workflows:
- GitHub workflow files were not enumerated in this audit due to no explicit reference in the provided context. Unknown: workflow file names and steps. Missing evidence: .github/workflows directory listing.

## 12. Known Ambiguities & Missing Pieces

- GrowthBook exposure tracking: Unknown. No explicit exposure event emission found. Missing evidence: calls to a tracking callback or analytics for variant exposure.
- Wizard state persistence mechanism: Unknown. The UI copy states session persistence, but explicit use of sessionStorage/localStorage is not confirmed in the inspected code. Missing evidence: direct storage API calls and keys.
- Experiment evaluation internals: runServerExperiment is imported but its implementation is not included in this audit. Unknown whether GrowthBook SDK is used, and where client is instantiated.
- CI workflows: Unknown. Missing evidence: .github/workflows files content.

Repo Checks (explicit outcomes):
- /login route and any code that sets fruitful_access_token: Present. Route at frontend/app/login/page.tsx; cookie set by frontend/app/api/auth/login/route.ts (lines 146–154).
- /contractor routes and middleware matchers protecting them: Present. Routes under frontend/app/(contractor)/; middleware matcher covers /contractor paths (frontend/middleware.ts lines 133–141); layout also gates (frontend/app/(contractor)/layout.tsx lines 13–25).
- trackToolView( callsites and any tool_view pushes: Present via hook useToolAnalytics; callsite in hook (frontend/lib/hooks/useToolAnalytics.ts lines 20–25) which is used by PinterestPotentialV1 (frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx lines 19–35).
- trackLeadSubmit( callsites and any lead_submit pushes: Present in PinterestPotentialWizard (frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx lines 306–315).
- window.dataLayer.push usage outside helpers: None found in app code (search yielded none).
- Cookie names: fruitful_access_token used in middleware/auth/login; pp_variant used for experiment; optional ppc_lead_mode referenced for lead mode cookie. Evidence: frontend/middleware.ts (line 5); frontend/lib/tools/pinterestPotentialConfig.ts (line 17); frontend/app/(flow)/tools/pinterest-potential/page.tsx (line 44 for ppc_lead_mode read).
