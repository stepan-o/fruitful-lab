### System Implementation Audit — Fruitful Lab Tech Hub

Status: Confirmed repository state as of 2025-12-21 11:11 (local)

This document describes the system as it exists in this repository and, where inferable from code, how the deployed system would behave. It is descriptive only. No recommendations are included.

Contents
- 1. Repository Layout & Structure
- 2. Frontend Application Architecture (Next.js)
- 3. Global Styles & Design System
- 4. Public Hub Pages
- 5. Public Tools System
- 6. Analytics Implementation (GTM / GA4)
- 7. Experiments & Feature Flags (GrowthBook)
- 8. Backend API (FastAPI)
- 9. Auth Flow (End-to-End)
- 10. Environment Configuration
- 11. Testing & CI (As Implemented)
- 12. Known Ambiguities & Open Questions

## 1. Repository Layout & Structure

Top-level folders (from provided project root listing):
- Makefile — Build/utility targets (not inspected in detail).
- backend — FastAPI application (auth, stats, models, security, etc.).
- docs — Documentation and specs; this audit file lives here.
- frontend — Next.js application (App Router), middleware, GrowthBook, GTM, public tools.
- prompts — Internal prompt/spec files (non-runtime guidance/notes).

Monorepo notes:
- Single repo houses both frontend (Next.js) and backend (FastAPI). No shared package mechanism other than direct file references within each side.
- No explicit package workspace configuration observed.

Active vs legacy:
- Active: backend/, frontend/, docs/.
- prompts/ contains planning/specification prompts; not used at runtime.
- No explicit legacy/unused directories found, but some routes referenced in nav are not present (see Sections 4 and 12).

## 2. Frontend Application Architecture (Next.js)

Framework: Next.js App Router (TypeScript).

App Router structure (examples):
- frontend/app/layout.tsx — Root layout. Injects fonts, loads GTM script when NEXT_PUBLIC_GTM_ID is set, renders {children}.
- frontend/app/page.tsx — Home route (/). Server component that redirects based on current user; otherwise renders PublicHubLanding.
- Route groups:
  - frontend/app/(site)/layout.tsx — Site layout with header/footer for public site-like pages.
  - frontend/app/(site)/tools/page.tsx — Tools index page (/tools).
  - frontend/app/(flow)/tools/pinterest-potential/page.tsx — Pinterest Potential Calculator entry (/tools/pinterest-potential). Dynamic, variant-resolving.
- Dashboard:
  - frontend/app/dashboard/page.tsx — Admin-only dashboard view.

Layouts
- Root layout: frontend/app/layout.tsx
  - Loads Google Tag Manager if NEXT_PUBLIC_GTM_ID is present (script + noscript iframe).
  - Sets global fonts via next/font.
- Public site layout: frontend/app/(site)/layout.tsx
  - Wraps content with SiteHeader and SiteFooter components.

Public vs gated routes (as implemented):
- Public: /, /tools, /tools/pinterest-potential (the tool page itself is public; gating behavior is handled within the tool flow’s leadMode rather than route protection), public API debug endpoint (see Section 7).
- Gated: /dashboard is protected. Middleware and server components enforce authentication and admin role.

Client vs Server Components
- Many pages are server components by default (e.g., app/page.tsx, dashboard/page.tsx, the tool entry page).
- Explicit client components include: Tools index page (frontend/app/(site)/tools/page.tsx uses "use client"), PinterestPotentialV1 (client) and its wizard, analytics helpers in frontend/lib/gtm.ts (client-only).

Navigation
- Centralized public navigation config: frontend/lib/nav.ts
  - Links include /tools, /case-studies, and https://fruitfulpin.com (external). Note: /case-studies is referenced but route not found in the repo (see Section 12).
- Header/footer components referenced by site layout (exact implementations not listed in reviewed files).

Middleware
- frontend/middleware.ts
  - Protects /dashboard (and subpaths) by checking the cookie fruitful_access_token; redirects to /login if absent.
  - Applies experiment cookies for /tools/pinterest-potential via applyExperimentCookies.
  - Next.js matcher limits middleware to dashboard and pinterest-potential paths.

## 3. Global Styles & Design System

- Global CSS: frontend/app/globals.css
  - Uses Tailwind via @import "tailwindcss".
  - CSS variables defined for colors, brand tokens (e.g., --brand-raspberry, --brand-bronze), surfaces (--card, --card-hover), borders, foreground-muted, and a set of backdrop animation tunings.
  - Light and dark theme tokens are defined using :root and [data-theme] selectors, with a prefers-color-scheme fallback when no explicit data-theme is present.
  - Inline tailwind @theme mapping to expose CSS variables as Tailwind color tokens.
  - Animations: Names referenced in components (e.g., start-here pulse, hubPulse) appear to rely on defined keyframes/utility classes set in globals.css.

Patterns
- Styling appears to be class-based with Tailwind and custom CSS variables.
- Design tokens are implemented as CSS variables and consumed via utility classes (e.g., bg-[var(--background)]).

## 4. Public Hub Pages

Landing page (/)
- File: frontend/app/page.tsx
- Behavior: Server component checks current user via getCurrentUser().
  - If user.is_admin: redirect to /dashboard.
  - If user (non-admin): redirect to /tools.
  - If no user: renders PublicHubLanding component.
- Entry component: frontend/components/PublicHubLanding.tsx
  - Purpose: Marketing-style hub page for tools/case studies with CTAs and animated backdrop.
  - CTAs: “Go to Fruitful Pin site” (external), “Browse public tools” (/tools).
  - Links sourced from PUBLIC_NAV_LINKS (frontend/lib/nav.ts).
  - Analytics hooks: Not directly pushing events in this component; CTAs are plain links (no trackCtaClick in this file). ThemeToggle present.

Tools index page (/tools)
- File: frontend/app/(site)/tools/page.tsx (client component)
- Purpose: Lists tools with status. Main card links to Pinterest Potential Calculator.
- CTAs: Primary link triggers trackCtaClick("Open calculator →", { location: "/tools" }). Footer includes link back to hub and an external main site link (tracked with trackCtaClick as well).
- Status pills indicate "Live" or "Coming soon". Only Pinterest Potential Calculator is marked live with href: /tools/pinterest-potential.

Case studies (public content)
- Referenced in nav (/case-studies) and on PublicHubLanding cards.
- Route or implementation not found among reviewed files. Marked as Missing/Unclear (see Section 12).

## 5. Public Tools System

Pinterest Potential Calculator (primary tool)
- Route: /tools/pinterest-potential
- Entry page: frontend/app/(flow)/tools/pinterest-potential/page.tsx
  - Dynamic page: export const dynamic = "force-dynamic" to respect query param overrides (e.g., ?variant=v2).
  - Variant handling:
    - Variant type and constants: frontend/lib/tools/pinterestPotentialConfig.ts
      - PinterestPotentialVariant = "v1" | "v2"
      - DEFAULT_VARIANT = "v1"
      - ALL_VARIANTS = ["v1", "v2"]
      - PINTEREST_POTENTIAL_VARIANT_COOKIE = "pp_variant"
      - ENABLE_AB_SPLIT = false (note: middleware still sets cookies; page resolver does not call GrowthBook directly)
    - Page resolver resolvePinterestPotentialVariant(requested, cookieValue):
      1) Honors valid ?variant= query param (debug/QA override).
      2) Else uses valid cookie value from pp_variant.
      3) Else falls back to DEFAULT_VARIANT.
    - Components mapping:
      - v1 → frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx
      - v2 → frontend/components/tools/pinterestPotential/PinterestPotentialV2 (imported; implementation not reviewed here).
  - Lead handling:
    - Uses getCurrentUser() (server) to identify if signed-in.
    - Accepts t query param; resolveLeadFromToken(token) attempts to resolve a Lead (implementation not shown here).
    - Determines isKnownLead from user or tokenLead.
    - leadMode is resolved using resolveLeadMode with requested leadMode, optional cookie ppc_lead_mode (commented as future), and isKnownLead.
    - initialLead is derived from tokenLead or current user (name/email) when present.
  - Rendered component receives leadMode and initialLead as props.

Internal structure (v1)
- frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx (client)
  - Renders a heading indicating phase (wizard vs results) and describes that progress is saved for this session.
  - Uses PinterestPotentialWizard (frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx) with props: leadMode, initialLead, onPhaseChange, onStart.
  - Hooks into analytics via useToolAnalytics({ toolName: "pinterest_potential" }) and calls trackToolStart when the wizard starts.

State persistence
- The v1 component copy states "Your progress is saved for this session." The underlying mechanism is not shown in the reviewed code. The Wizard component likely manages local state and may use sessionStorage/localStorage, but this is not confirmed here.

Lead capture behavior
- UI-level lead capture is implied via leadMode and the Wizard, but specific submission or API endpoints for lead persistence are not present in the reviewed files.

Variant/experiment cookie assignment
- Middleware (frontend/middleware.ts) applies experiment cookies on requests to /tools/pinterest-potential* using applyExperimentCookies (see Section 7 for details).

## 6. Analytics Implementation (GTM / GA4)

GTM Injection
- File: frontend/app/layout.tsx
  - Loads GTM script and noscript iframe when NEXT_PUBLIC_GTM_ID is set.
  - Script initializes window.dataLayer and injects GTM.

Data Layer Helpers
- File: frontend/lib/gtm.ts (client-only)
  - pushEvent(eventName, params)
  - trackToolView(tool_name, location)
  - trackToolStart(tool_name, location)
  - trackLeadSubmit({ location, button_label, tool_name? })
  - trackCtaClick(button_label, extras?: { location?, tool_name? })

Observed usage in code
- Tools index page uses trackCtaClick on links to the calculator and external site.
- PinterestPotentialV1 initializes useToolAnalytics; specifics of event firing beyond start are not shown here.

Confirmed vs exists-but-unused
- Confirmed: GTM code injection in root layout; trackCtaClick used in /tools page CTAs; trackToolStart is wired in v1 wizard start callback.
- Unclear/Not observed: Explicit page-view events, lead_submit calls in components (helper exists but usage not confirmed in reviewed components).

## 7. Experiments & Feature Flags (GrowthBook)

Experiment configuration
- Canonical config: frontend/lib/experiments/config.ts
  - Experiment key: "pinterest_potential_variant"
  - Variants: reuse PinterestPotentialVariant ("v1", "v2").
  - Default: mirrors DEFAULT_VARIANT from tool config ("v1").
  - Optional fallback weights exist for local randomization (equal split 0.5/0.5).

GrowthBook adapter and tracking
- File: frontend/lib/growthbook/flags.ts
  - Uses growthbookAdapter from @flags-sdk/growthbook.
  - Sets tracking callback to forward exposure events via logExperimentEvent (implementation not covered here); logs to console in development.
  - Initializes adapter only if GROWTHBOOK_CLIENT_KEY is present; keeps a debug state (envConfigured, initialized, lastError).

Server experiment runner & middleware integration
- Cookie assignment: frontend/lib/growthbook/middleware.ts
  - getExperimentCookieName(key) and normalizeVariant(raw) utilities.
  - chooseVariantFromWeights() for local fallback selection.
  - applyExperimentCookies(req, res) behavior:
    1) If a valid variant cookie already exists (pp_variant), do nothing.
    2) Else, calls runServerExperiment(exp) to choose a variant (uses GrowthBook first, fallback weights otherwise).
    3) Persists the cookie pp_variant for ~90 days, non-HttpOnly.
- App middleware: frontend/middleware.ts
  - For requests to /tools/pinterest-potential* it invokes applyExperimentCookies, both for public and protected paths.

Exposure tracking
- Exposure tracking is configured in the adapter via the tracking callback, triggered when GrowthBook evaluates experiments. Where and how evaluations are called in this app beyond the server middleware path is not visible in the reviewed code; cookie assignment itself uses runServerExperiment.

Debug endpoint
- File: frontend/app/api/debug/growthbook/route.ts (/api/debug/growthbook)
  - Returns environment/config status and a ping to the GrowthBook CDN using the client key.
  - Dev-only oriented; no secrets returned.

Variant precedence (as implemented for the calculator page)
1) ?variant= query param (if valid)
2) experiment cookie pp_variant (if valid)
3) DEFAULT_VARIANT ("v1")

## 8. Backend API (FastAPI)

Entry point
- File: backend/main.py
  - FastAPI app with lifespan; CORS configured for specific origins:
    - http://localhost:3000, http://127.0.0.1:3000,
    - https://fruitfulab.net, https://fruitful-lab.vercel.app
  - Routers included: auth_router (backend/routers/auth.py), stats_router (backend/routers/stats.py)
  - Endpoints:
    - GET / → {"status":"ok"}
    - GET /health → {"status":"ok"}

Routers
- backend/routers/auth.py
  - POST /auth/register → create user (internal/simple registration)
  - POST /auth/login → OAuth2 password flow; returns Token (access_token, bearer)
  - GET /auth/me → returns current user (requires valid bearer token)
- backend/routers/stats.py
  - GET /users → list users (admin-only)
  - GET /pinterest-stats → list stats (admin-only)
  - POST /pinterest-stats/upload-csv → upload monthly stats CSV (admin-only)
  - GET /pinterest-stats/monthly → ordered monthly stats (admin-only; returns list[PinterestAccountStatsMonthlyOut])

Models and Schemas
- backend/models.py
  - User: id, email, full_name, hashed_password, is_active, is_admin, timestamps
  - PinterestAccountStatsMonthly: id, calendar_month (Date), impressions, engagements, outbound_clicks, saves, timestamps
- backend/schemas.py
  - Token, TokenData
  - UserBase / UserOut / UserCreate
  - PinterestAccountStatsMonthlyBase / PinterestAccountStatsMonthlyOut

Security/auth helpers
- backend/security.py
  - Password hashing via passlib (pbkdf2_sha256)
  - JWT creation/verification via jose
  - OAuth2PasswordBearer(tokenUrl="/auth/login")
  - Dependencies: get_current_user, get_current_active_user, get_current_admin_user

Config
- backend/config.py
  - OPENAI_API_KEY (present, not used by the endpoints shown here)
  - JWT_SECRET_KEY (required for JWT)
  - JWT_ALGORITHM (HS256)
  - JWT_ACCESS_TOKEN_EXPIRE_MINUTES (default 60)

Database
- SQLAlchemy models defined; actual DB session/engine in backend/db.py (not reviewed here). Alembic mentioned in backend/main.py comment; migrations not included in reviewed files.

Authentication
- JWT in Authorization: Bearer <token> header for backend endpoints.
- Admin gating enforced at router dependency level for stats endpoints.

## 9. Auth Flow (End-to-End)

Frontend token handling
- frontend/lib/auth.ts
  - Server helper getCurrentUser() reads cookie "fruitful_access_token" via next/headers cookies() and calls `${NEXT_PUBLIC_API_BASE_URL}/auth/me` with Authorization header.
  - Returns CurrentUser or null. Does not throw on network errors.

Route behaviors
- / (frontend/app/page.tsx):
  - If user.is_admin: redirect /dashboard
  - Else if user exists: redirect /tools
  - Else: render public hub landing.
- /dashboard (frontend/app/dashboard/page.tsx):
  - Server-side checks user via getCurrentUser(); redirects to /login?next=/dashboard if no user; redirects non-admins to /tools.
  - Uses the token from cookies to call backend monthly stats API.
- Middleware (frontend/middleware.ts):
  - Protects /dashboard path by requiring fruitful_access_token; redirects to /login if absent.

Login/logout
- A /login page/component is referenced by redirects but was not found among the reviewed files. Actual login UI and client-side token storage logic are not covered here.
- Token storage expected by frontend: cookie fruitful_access_token (set somewhere outside the reviewed code).

## 10. Environment Configuration

Frontend env vars observed
- NEXT_PUBLIC_GTM_ID — Controls GTM injection in root layout.
- NEXT_PUBLIC_API_BASE_URL — Base URL for backend API (default http://localhost:8000 when undefined in lib/auth.ts; other client libraries may have similar assumptions).
- GROWTHBOOK_CLIENT_KEY — Enables GrowthBook adapter initialization.
- GROWTHBOOK_API_HOST — Optional; defaults to https://cdn.growthbook.io.

Backend env vars observed
- OPENAI_API_KEY — Present in config; not used in reviewed endpoints.
- JWT_SECRET_KEY — Required for JWT operations.
- JWT_ACCESS_TOKEN_EXPIRE_MINUTES — Optional; default 60.

Unclear/Not observed
- Database DSN and Alembic migration configuration (likely in backend/db.py and alembic/, which were not part of the reviewed excerpts).

## 11. Testing & CI (As Implemented)

Backend tests (files exist)
- backend/tests/test_security.py — Security/JWT tests (content not detailed here).
- backend/tests/test_database_schema.py — Schema checks.
- backend/tests/test_pinterest_stats_api.py — Stats API tests.
- backend/tests/test_auth_protection.py — Auth protection scenarios across endpoints.

Frontend tests (files exist)
- frontend/__tests__/auth.test.ts — Frontend auth helper tests.
- frontend/__tests__/fetchPinterestMonthlyStats.test.ts — Tests around stats fetching helper.
- GrowthBook related tests: frontend/lib/growthbook/__tests__/* and frontend/app/api/debug/__tests__/growthbook.route.test.ts.
- Experiment config tests: frontend/lib/experiments/__tests__/config.test.ts.

CI configuration
- .github/workflows/security-audits.yml — Present; details not expanded here.
- Additional workflows directory exists; specific pipelines not fully enumerated in this audit.

Automation status
- No automatic test runner configuration is confirmed from the provided snippets. Presence of workflows suggests some CI is configured; exact triggers/steps should be checked in the YAML (not detailed here).

## 12. Known Ambiguities & Open Questions

- /case-studies route:
  - Referenced in navigation and PublicHubLanding, but no corresponding route/page was found in the reviewed files. Status: Missing (may 404 in current state).

- Login page and token setting:
  - Middleware and dashboard redirects reference /login, and frontend expects a cookie fruitful_access_token. The actual login page and the client-side logic to set this cookie are not present in the reviewed files. Status: Unclear.

- Lead capture persistence for the Pinterest Potential tool:
  - Lead token resolution and leadMode selection are implemented; concrete storage or submission endpoints for leads are not shown. Status: Unclear.

- GrowthBook evaluation points:
  - Experiment cookie assignment is done in middleware using runServerExperiment, but it is unclear where else GrowthBook flag evaluations occur in the user journey. Exposure tracking is wired in the adapter, but invocation points beyond cookie assignment are not documented here. Status: Unclear.

- Database configuration/migrations:
  - Models are defined; DB engine/session and migration setup are not covered in the reviewed snippets. Status: Unclear.

- Analytics coverage:
  - GTM is injected and helpers exist; only some CTAs use trackCtaClick. There is no confirmed global page-view event. Status: Partial/Unclear.

- ENABLE_AB_SPLIT flag:
  - In pinterestPotentialConfig.ts, ENABLE_AB_SPLIT=false. Middleware still sets variant cookies via GrowthBook/fallback. Page-level variant resolver honors cookie and query param regardless. Status: Works as implemented; intent beyond this is not documented.

End of audit.

## DB/Migrations (Auth Sprint — Sub‑Sprint 4, Path B)

This section records the concrete repository reality and chosen operational path for adding users.groups.

DB and migrations (as implemented):
- Alembic is configured in backend/alembic.ini with script_location = migrations (relative to backend/).
- Alembic env: backend/migrations/env.py reads db.DATABASE_URL and assigns sqlalchemy.url accordingly; target_metadata = Base.metadata.
- Migrations live under backend/migrations/versions/.

Change introduced (Path B: Alembic migration):
- New migration adds users.groups as JSON, NOT NULL, with server default [] to backfill existing rows.
    - File: backend/migrations/versions/3f2a1c9e4b6d_add_groups_json_to_users.py
    - Upgrade: op.add_column("users", sa.Column("groups", sa.JSON(), nullable=False, server_default=sa.text("'[]'::json")))
    - Downgrade: op.drop_column("users", "groups")

Bootstrap/apply:
- From backend/, run: alembic upgrade head
- Expected result:
    - Column users.groups exists
    - users.groups is NOT NULL
    - Existing rows have groups = []

## Auth Flow — Middleware Redirect Behavior (Update: Sub‑Sprint 8)

- When a protected route is requested without the auth cookie (fruitful_access_token), middleware redirects to /login.
- The next parameter now preserves the full intended return URL as pathname + search (querystring included).
  - Example: Visiting /contractor/tool?variant=v2 while logged out redirects to
    /login?next=/contractor/tool?variant=v2
-
  Matcher and protected path logic remain unchanged; experiment cookie behavior for /tools/pinterest-potential* is unaffected.
