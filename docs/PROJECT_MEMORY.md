# Project Memory - Fruitful Lab

Status: current working memory as of 2026-05-20 after adopting the brand/app monorepo direction.

Use this file as the durable architectural memory for future Codex/LLM work on this repo. It records the structure, layers, contracts, and working patterns that should be assumed going forward unless code proves otherwise.

## What This Project Is

Fruitful Lab is becoming a brand/app monorepo for multiple separately deployed web properties and shared tool infrastructure. The current implementation is still a Next.js + FastAPI platform that hosts Fruitful Pin/Fruitful Lab public tools, gated admin workflows, contractor placeholders, analytics plumbing, and Pinterest account stats ingestion.

Related planning note:

- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` is the current target architecture reference. It defines the shift from a single `frontend/` app toward separate apps under `apps/*`, beginning with `apps/lab` for Fruitful Lab and later `apps/fruitful-pin` for the Fruitful Pin migration. Future brand apps may include Bloom Whispers and Bricoli.
- `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md` is the active PR-gated execution plan for the monorepo migration. It defines PR 1 as docs/architecture baseline, PR 2 as the structure-only `frontend/` to `apps/lab/` move, PR 3 as Fruitful Pin app foundation, and later PRs for inventory, content contracts, templates, CMS integration, and launch prep.
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md` is the current planning reference for a Fruitful Bean / Fruitful Pin-only migration of `fruitfulpin.com` to a coded Next.js marketing site. It explicitly does not propose rebuilding Fruitful Lab, removes Kadence from future cost comparisons, assumes GoDaddy domain registration and prepaid A2 hosting until 2027, prefers Cloudflare hosting for the public Next.js frontend, and keeps WordPress on A2 as the phase-one headless CMS/editor to avoid a CMS learning curve during migration.

The current Fruitful Lab app is not just a marketing site. It is a tool-and-analytics system with:

- public lead/value tools,
- role-gated internal/admin areas,
- contractor-gated work areas,
- GTM data-layer event instrumentation,
- GrowthBook experiment infrastructure,
- a FastAPI/Postgres backend for auth and Pinterest stats.

## Target Monorepo Direction

The target repo shape is:

- `apps/lab/` - current Fruitful Lab Next.js app after the first structure migration PR; hosted on Vercel as a sandbox/prototype platform.
- `apps/fruitful-pin/` - planned Fruitful Pin commercial marketing site; preferred public frontend host is Cloudflare.
- `apps/bloom-whispers/` - future separate brand/site example.
- `apps/bricoli/` - future separate brand/site example.
- `packages/*` - shared code extracted only after real cross-app reuse exists.
- `backend/` - current FastAPI backend, used where needed and not assumed by every future brand app.

Current code still lives in `frontend/` until the first structure PR moves it to `apps/lab/`.

Working pattern:

- Keep separate brands as separate apps and deployments.
- Do not import directly across apps.
- Promote reusable code into `packages/*` before sharing it across apps.
- Keep hosting assumptions per app: Fruitful Lab on Vercel, Fruitful Pin public frontend on Cloudflare in the current plan.
- Use Fruitful Lab as the prototype/sandbox space and promote mature tools into commercial brand apps through shared packages.

## Top-Level Layout Today

- `frontend/` - current Next.js App Router app for Fruitful Lab; planned to move to `apps/lab/`.
- `backend/` - FastAPI app with SQLAlchemy, Alembic, JWT auth, and Postgres.
- `docs/` - current memory, audits, implementation notes, guides, and archived plans.
- `prompts/` - LLM architect prompts and sprint plans.
- `Makefile` - root convenience commands for backend/frontend tests and builds.
- `repo-tree.txt` - static repo tree snapshot.

## Frontend Layers

### App Router

`frontend/app/` owns routes, layouts, and Next route handlers today. After the structure PR, this becomes `apps/lab/app/`.

Current route groups:

- `(site)` - public site shell with `SiteHeader`, `FlashBanner`, `SiteFooter`.
- `(flow)` - tool flow shell for public tool experiences.
- `(admin)` - admin-only area under `/admin`.
- `(contractor)` - contractor/admin-only area under `/contractor`.

Public routes:

- `/` - public hub when logged out. Logged-in users redirect by role.
- `/tools` - public tools index.
- `/tools/pinterest-fit-assessment` - public Pinterest Fit Assessment.
- `/tools/pinterest-potential` - public Pinterest Potential Calculator.
- `/case-studies` - coming-soon public page.
- `/hub` - knowledge hub preview.
- `/login` - login screen.

Protected routes:

- `/admin`, `/admin/*`
- `/contractor`, `/contractor/*`

### Layouts and Shared UI

- `frontend/app/layout.tsx` - root HTML/body and GTM injection when `NEXT_PUBLIC_GTM_ID` is present.
- `frontend/app/globals.css` - Tailwind import plus project tokens, light/dark variables, scrollbars, and PPC-specific visual tokens.
- `frontend/components/layout/*` - headers, footers, flash banner, logout, book-call button, flow shell/header.
- `frontend/lib/nav.ts` - shared public and contractor navigation config.

After the structure PR, replace the `frontend/` prefix above with `apps/lab/`.

Working pattern:

- Server components by default.
- Client components only for interaction, browser APIs, or analytics event pushes.
- Shared visual tokens live in CSS variables, not scattered hard-coded palettes.
- Do not duplicate route paths in many places when `frontend/lib/nav.ts` can own them.

## Tool System

Public tools are explicit flows with typed config/data/compute layers under `frontend/lib/tools/*` and UI components under `frontend/components/tools/*`. After the structure PR these remain inside `apps/lab/` until a second app needs them; then stable reusable logic should move to `packages/tools` and reusable UI may move to `packages/tool-ui`.

### Pinterest Potential Calculator

Route:

- `frontend/app/(flow)/tools/pinterest-potential/page.tsx`

Key UI:

- `PinterestPotentialV1` - `welcome` variant.
- `PinterestPotentialV2` - `no_welcome` variant shell.
- `PinterestPotentialWizard` - core wizard.
- Step components under `frontend/components/tools/pinterestPotential/steps/`.
- View components under `frontend/components/tools/pinterestPotential/views/`.

Key logic:

- `frontend/lib/tools/pinterestPotentialConfig.ts` - variant constants and A/B enable flag.
- `frontend/lib/tools/pinterestPotential/compute.ts` - calculation logic.
- `frontend/lib/tools/pinterestPotential/pinterestPotentialSpec.ts` - typed spec/contracts.
- `frontend/lib/tools/pinterestPotential/leadMode.ts` - lead gating mode resolver.
- `frontend/lib/tools/pinterestPotential/leadGatingConfig.ts` - lead gating config.
- `frontend/lib/tools/pinterestPotential/leadToken.ts` - current lead-token stub/QA decoder.

Current variant contract:

- Variant type: `welcome | no_welcome`.
- Default: `welcome`.
- Cookie: `pp_variant`.
- `ENABLE_AB_SPLIT` is currently `false`.
- In non-production only, `?variant=` can override for QA.
- Page resolution order is query override, then cookie if A/B split is enabled, then default.

Current lead contract:

- Lead modes: `hard_lock | soft_lock`.
- Known leads come from authenticated user or token-derived lead.
- `resolveLeadFromToken()` is currently a stub/demo decoder, not server-signed verification.
- Optional `ppc_lead_mode` cookie exists as a future override input.

### Pinterest Fit Assessment

Route:

- `frontend/app/(flow)/tools/pinterest-fit-assessment/page.tsx`

Key UI:

- `frontend/components/tools/pinterestFit/PinterestFitAssessment.tsx`
- `IntroScreen`, `QuestionScreen`, `ResultsScreen`

Key logic:

- `frontend/lib/tools/pinterestFit/questions.ts`
- `frontend/lib/tools/pinterestFit/engine.ts`
- `frontend/lib/tools/pinterestFit/results.ts`
- `frontend/lib/tools/pinterestFit/tracking.ts`
- `frontend/lib/tools/pinterestFit/types.ts`

Current behavior:

- Client-side seven-question assessment.
- Generates a run id.
- Tracks start, question completion, final completion, result shown, and CTA click.
- Scores deterministically with typed answer/result contracts and guardrails.

## Authentication and Authorization

Authentication is JWT-based, with the frontend storing the backend access token in an HTTP-only cookie.

Cookie:

- `fruitful_access_token`

Frontend auth files:

- `frontend/lib/auth.ts`
- `frontend/middleware.ts`
- `frontend/app/api/auth/login/route.ts`
- `frontend/app/api/auth/logout/route.ts`
- `frontend/app/login/LoginPageClient.tsx`

Backend auth files:

- `backend/routers/auth.py`
- `backend/security.py`
- `backend/models.py`
- `backend/schemas.py`

Backend endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Login flow:

1. Browser submits email/password to Next route `/api/auth/login`.
2. Next route posts OAuth2 form fields to FastAPI `/auth/login`.
3. FastAPI returns JWT access token.
4. Next route calls FastAPI `/auth/me` with the new token.
5. Next route computes role: admin, contractor, or general.
6. Next route sets `fruitful_access_token` and returns a role-safe `redirectTo`.
7. Login client navigates to `redirectTo`.

Authorization model:

- Admin: `user.is_admin === true`.
- Contractor: `groups` includes `"contractor"`.
- General: authenticated but not admin/contractor.

Protected route enforcement:

- Middleware protects `/admin` and `/contractor`.
- Middleware calls backend `/auth/me` to validate token and role before render.
- Admin layout calls `getCurrentUser()` and fail-closes to login/tools/contractor.
- Contractor layout calls `getCurrentUser()` and fail-closes to login/tools.
- Backend admin APIs use `get_current_admin_user`.
- Backend contractor dependency exists as `get_current_contractor_user`, though current contractor pages are frontend placeholders.

Working pattern:

- Do not rely on UI-only gating.
- Keep role decisions explicit.
- Keep the backend `/auth/me` response as the source of session truth.
- Preserve safe `next` handling in login redirects.

## Experiments and Feature Flags

Experiment config:

- `frontend/lib/experiments/config.ts`

GrowthBook integration:

- `frontend/lib/growthbook/middleware.ts` - Edge-safe middleware assignment.
- `frontend/lib/growthbook/edgeAdapter.ts` - Edge-safe adapter import.
- `frontend/lib/growthbook/flags.ts` - server-side adapter with tracking callback.
- `frontend/app/api/debug/growthbook/route.ts` - debug/health endpoint.
- `frontend/app/api/experiment-events/route.ts` - dev-friendly event intake.

Current registered experiment:

- Key: `pinterest_potential_variant`
- GrowthBook key: `pinterest_potential_variant`
- Variants: `welcome`, `no_welcome`
- Default: `welcome`

Assignment pattern:

- Middleware is the assignment layer.
- Pages should read cookie/query state and render; they should not call GrowthBook directly.
- Middleware ensures stable anonymous id cookie `fp_anon_id` when assignment is enabled.
- Middleware persists variant cookie `pp_variant`.
- GrowthBook is attempted first; local weighted fallback is used if GrowthBook is unavailable.

Current important reality:

- `ENABLE_AB_SPLIT` is set to `false`, so the live resolver defaults to `welcome` unless a non-production query override is used.

## Analytics

GTM/Data Layer:

- Root GTM injection lives in `frontend/app/layout.tsx`.
- Data-layer helpers live in `frontend/lib/gtm.ts`.
- `window.dataLayer` typing lives in `frontend/types/global.d.ts`.

Generic helper pattern:

- `pushEvent(eventName, params)` is the primitive.
- Generic tool helpers wrap `tool_view`, `tool_start`, `lead_submit`, and `cta_click`.
- `useToolAnalytics()` fires `tool_view` once and exposes `trackToolStart`.

Pinterest Potential events:

- `ppc_view_start`
- `ppc_start`
- `ppc_answer`
- `ppc_complete`
- `ppc_cta_click`
- `ppc_lead_view`
- `ppc_lead_submit`
- `ppc_lead_skip`
- `ppc_back`

Pinterest Fit events:

- `assessment_started`
- `assessment_question_completed`
- `assessment_completed`
- `result_strong_fit`
- `result_possible_fit`
- `result_not_right_now`
- `cta_fit_call_clicked`

Working pattern:

- Emit events to `window.dataLayer`.
- Let GTM decide destinations.
- Do not add direct `gtag()` calls.
- Keep event schemas stable and flat enough for GTM/GA4.
- For new tools, define tracking close to the tool library and call through `pushEvent`.

## Backend Layers

Backend entry:

- `backend/main.py`

Routers:

- `backend/routers/auth.py`
- `backend/routers/stats.py`
- `backend/routers/admin_pinterest_stats.py`

Core modules:

- `backend/config.py` - env config for OpenAI and JWT.
- `backend/db.py` - SQLAlchemy engine/session/Base, requires `DATABASE_URL`.
- `backend/security.py` - password hashing, JWT, current-user/admin/contractor dependencies.
- `backend/models.py` - SQLAlchemy models.
- `backend/schemas.py` - Pydantic schemas.
- `backend/utils.py` - parsing helpers for stats ingestion.

Models:

- `User`
  - `email`, `full_name`, `hashed_password`
  - `is_active`
  - `is_admin`
  - `groups` JSON list
  - timestamps
- `PinterestAccountStatsMonthly`
  - `account_name`
  - `calendar_month`
  - `impressions`
  - `engagements`
  - `outbound_clicks`
  - `saves`
  - `uploaded_at`
  - timestamps
  - unique `(account_name, calendar_month)`

Migrations:

- Current active migration: `backend/migrations/versions/0f1db0936876_initial_schema.py`
- Legacy migrations live under `backend/migrations/_legacy_versions/`.

## Frontend/Backend Contract

Required frontend env:

- `API_BASE_URL` - server-side origin used by middleware, auth, and Next API proxies.
- `NEXT_PUBLIC_API_BASE_URL` - browser/server helper fallback used by legacy dashboard stats fetch.
- `NEXT_PUBLIC_GTM_ID` - optional GTM container id.
- `GROWTHBOOK_CLIENT_KEY` and optional `GROWTHBOOK_API_HOST` - optional experiment SDK config.

Backend required env:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- optional `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`
- optional `OPENAI_API_KEY`

Primary contracts:

- Frontend `/api/auth/login` proxies backend `/auth/login` and `/auth/me`.
- Frontend `getCurrentUser()` calls backend `/auth/me`.
- Middleware calls backend `/auth/me`.
- Admin frontend proxies under `/api/admin/pinterest-stats/*` forward to backend `/admin/pinterest-stats/*`.
- Legacy dashboard helper calls backend `/pinterest-stats/monthly` directly with bearer token.

Admin Pinterest stats contract:

- Backend `/admin/pinterest-stats/upload` accepts multipart form data with `account_name` and `file`.
- CSV header detection expects normalized fields including `date_range`, `impressions`, `engagements`, `outbound_clicks`, and `saves`.
- Upload upserts by `account_name + calendar_month`.
- Backend `/admin/pinterest-stats/accounts` returns a string array.
- Backend `/admin/pinterest-stats/monthly?account_name=...` returns rows for that account.

## Known Drift / Watch Points

- `docs/SYSTEM_IMPLEMENTATION_AUDIT-2026-01-10.md` is historical and stale in several areas. Use the 2026-05-15 audit for current work.
- Some comments and older prompts still describe contractor route examples or dashboard redirects from prior iterations. Verify against `frontend/app/` and `frontend/middleware.ts`.
- `frontend/app/(admin)/admin/analytics/page.tsx` currently expects accounts as `{ accounts: Account[] }` in one code path, while the proxy/backend returns a raw string array. This looks like a runtime bug or unfinished refactor; verify before relying on that UI.
- `backend/routers/stats.py` still contains older `/pinterest-stats/upload-csv` behavior that constructs monthly stats without `account_name`, even though the model now requires it. Treat `/admin/pinterest-stats/*` as the current admin ingestion path.
- `resolveLeadFromToken()` is not secure verification; it is a stub/demo decoder.

## Testing and Verification

Root commands:

- `make backend-test`
- `make frontend-test`
- `make frontend-build`
- `make test`
- `make all`

Direct commands:

- `cd backend && uv run pytest -q`
- `cd frontend && npm test`
- `cd frontend && npm run build`
- `cd frontend && npm run ci`

Test surface:

- Backend tests cover auth, auth protection, config, DB schema, health endpoints, Pinterest stats API, security, and Pinterest Fit spec/scenarios.
- Frontend tests cover routes, middleware auth, dashboard, auth helpers, GrowthBook/experiment helpers, Pinterest Potential compute, Pinterest Fit engine/components, public landing, and layout components.

## How To Work With This Project Going Forward

1. Start by reading `docs/REPO_GROUNDING_PACK.md` and this file.
2. Verify current code before trusting old prompts, archived docs, or dated audits.
3. For route or auth changes, inspect `frontend/app`, `frontend/middleware.ts`, `frontend/lib/auth.ts`, and backend auth dependencies together.
4. For tool changes, keep UI, typed config, compute/scoring, and tracking contracts aligned.
5. For analytics changes, update `frontend/lib/gtm.ts` or tool-specific tracking helpers and document event schema changes here.
6. For experiment changes, update `frontend/lib/experiments/config.ts`, middleware assignment logic, and the tool page resolver together.
7. For API/data changes, update backend model/schema/router, migrations, frontend proxy/helper, and tests together.
8. When architectural contracts change, update this file and add or refresh a dated implementation audit.
