# Fruitful Lab

Fruitful Lab is evolving into a brand/app monorepo for separately deployed web properties, shared marketing tools, analytics, gated internal workflows, and Pinterest account stats ingestion.

The current Fruitful Lab app is not only a marketing site. It is a tool-and-analytics platform with public calculators/assessments, admin dashboards, contractor-gated placeholders, GTM event instrumentation, GrowthBook experiment plumbing, and a FastAPI/Postgres backend.

## Start Here

Before changing architecture, routes, auth, analytics, experiments, tool flows, or backend contracts, read these files:

- `docs/REPO_GROUNDING_PACK.md` - quick map of where truth lives.
- `docs/PROJECT_MEMORY.md` - canonical working memory for structure, patterns, contracts, and maintenance rules.
- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` - target architecture for separate apps under `apps/*`, shared packages, and future brands.
- `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md` - active PR-gated execution plan for the monorepo and Fruitful Pin migration sequence.
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md` - current Fruitful Pin migration spec.
- `docs/SYSTEM_IMPLEMENTATION_AUDIT-2026-05-15.md` - latest dated implementation audit.
- `docs/AGENT_OPERATING_PROCEDURES.md` - required agent workflow for Susie's branch, PR, validation, deployment, and cleanup loop.
- `AGENTS.md` - repo-level instructions for coding agents.

Code is the highest authority. If older docs, archived plans, or prompts disagree with current code and the current memory files, verify the code and update the memory files.

## Repository Layout

- `apps/lab/` - current Next.js App Router app for Fruitful Lab.
- `apps/` - location for separate deployable brand apps, starting with `apps/lab` and `apps/fruitful-pin`; future examples include `apps/bloom-whispers` and `apps/bricoli`.
- `packages/` - target location for shared tool logic, analytics, SEO, CMS, WordPress, UI, and config packages after real reuse exists.
- `backend/` - FastAPI app with SQLAlchemy, Alembic, JWT auth, and Postgres.
- `docs/` - project memory, audits, guides, specs, and historical implementation notes.
- `prompts/` - LLM architect prompts and sprint prompts.
- `Makefile` - root commands for common backend/frontend checks.
- `repo-tree.txt` - static project tree snapshot.

## Frontend

The current Fruitful Lab app lives in `apps/lab/` and uses Next.js App Router. The Fruitful Pin foundation lives in `apps/fruitful-pin/` and is a separate static-first Next.js app targeting Cloudflare Pages.

Route groups:

- `(site)` - public site pages and shell.
- `(flow)` - public tool flows.
- `(admin)` - admin-only area under `/admin`.
- `(contractor)` - contractor/admin-only area under `/contractor`.

Important routes:

- `/` - public hub for logged-out users; logged-in users redirect by role.
- `/tools` - public tools index.
- `/tools/pinterest-fit-assessment` - public Pinterest Fit Assessment.
- `/tools/pinterest-potential` - public Pinterest Potential Calculator.
- `/login` - login UI.
- `/admin/*` - admin-only pages.
- `/contractor/*` - contractor/admin-only pages.

Important frontend anchors:

- `apps/lab/app/layout.tsx` - root layout and GTM injection.
- `apps/lab/middleware.ts` - auth gate and experiment cookie assignment.
- `apps/lab/lib/auth.ts` - server-side current-user helper.
- `apps/lab/lib/nav.ts` - shared navigation config.
- `apps/lab/lib/gtm.ts` - dataLayer/GTM event helpers.
- `apps/lab/lib/experiments/config.ts` - canonical experiment registry.
- `apps/lab/lib/growthbook/*` - GrowthBook integration.
- `apps/lab/lib/tools/*` - typed tool logic, scoring, config, and tracking.
- `apps/lab/components/tools/*` - public tool UI.


## Brand/App Monorepo Direction

Target app structure:

```txt
apps/
  lab/             # Fruitful Lab sandbox/prototype app, Vercel
  fruitful-pin/    # Fruitful Pin commercial marketing site, static-first Cloudflare target
  bloom-whispers/  # future separate brand/site
  bricoli/         # future separate brand/site
```

Target shared-code structure:

```txt
packages/
  tools/
  tool-ui/
  analytics/
  cms/
  wordpress/
  seo/
  ui/
  config/
```

Do not create all shared packages up front. Extract shared packages only when more than one app needs the code.

Fruitful Lab should remain the sandbox/prototype app. Fruitful Pin is the first commercial marketing-site migration target. The current Fruitful Pin phase-one plan is Cloudflare for the public Next.js frontend and WordPress on prepaid A2 hosting as the headless CMS/editor.

## Backend

The backend lives in `backend/` and uses FastAPI with SQLAlchemy/Postgres.

Important backend anchors:

- `backend/main.py` - FastAPI app and router registration.
- `backend/routers/auth.py` - register/login/me endpoints.
- `backend/routers/admin_pinterest_stats.py` - current admin Pinterest stats ingestion and read endpoints.
- `backend/routers/stats.py` - older stats/user endpoints still present.
- `backend/security.py` - password hashing, JWT, current-user/admin/contractor dependencies.
- `backend/models.py` - SQLAlchemy models.
- `backend/schemas.py` - Pydantic schemas.
- `backend/migrations/versions/0f1db0936876_initial_schema.py` - current active migration baseline.

## Auth Pattern

Auth uses a backend JWT stored by the frontend in the HTTP-only `fruitful_access_token` cookie.

Flow:

1. The login UI posts to frontend `/api/auth/login`.
2. The Next route calls backend `/auth/login`.
3. The Next route calls backend `/auth/me` with the new token.
4. The Next route computes role and sets `fruitful_access_token`.
5. Middleware and server layouts use `/auth/me` as the source of truth.

Roles:

- Admin: `is_admin === true`
- Contractor: `groups` includes `"contractor"`
- General: authenticated user without admin/contractor access

Do not rely on UI-only gating. Protected routes are checked in middleware and layouts; backend admin APIs use backend admin dependencies.

## Experiments

Current experiment registry:

- `pinterest_potential_variant`
- Variants: `welcome`, `no_welcome`
- Default: `welcome`
- Variant cookie: `pp_variant`
- Current A/B flag: `ENABLE_AB_SPLIT = false`

Experiment assignment belongs in middleware. Tool pages should read query/cookie state and render; they should not call GrowthBook directly.

## Analytics

Analytics flows through GTM/dataLayer helpers.

Generic events:

- `tool_view`
- `tool_start`
- `lead_submit`
- `cta_click`

Pinterest Potential also emits `ppc_*` events. Pinterest Fit emits assessment-specific events. See `docs/PROJECT_MEMORY.md` for the current event families.

Do not add direct `gtag()` calls in app code.

## Frontend/Backend Contract

Frontend server env:

- `API_BASE_URL` - required for server-side backend calls.
- `NEXT_PUBLIC_API_BASE_URL` - used by legacy dashboard stats helper.
- `NEXT_PUBLIC_GTM_ID` - optional GTM container id.
- `GROWTHBOOK_CLIENT_KEY` and optional `GROWTHBOOK_API_HOST` - optional GrowthBook config.

Backend env:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- optional `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`
- optional `OPENAI_API_KEY`

Admin Pinterest stats currently flow through frontend proxies under `/api/admin/pinterest-stats/*` to backend endpoints under `/admin/pinterest-stats/*`.

## Common Commands

From the repo root:

```bash
make backend-test
make lab-test
make lab-build
make fruitful-pin-test
make fruitful-pin-build
make test
make all
```

Directly:

```bash
cd apps/lab && npm test
cd apps/lab && npm run build
cd apps/fruitful-pin && npm test
cd apps/fruitful-pin && npm run build
cd backend && uv run pytest -q
```


Some backend integration tests require real environment variables and seeded/migrated test data, including `DATABASE_URL`, `JWT_SECRET_KEY`, `TEST_ADMIN_EMAIL`, `TEST_ADMIN_PASSWORD`, `TEST_USER_EMAIL`, and `TEST_USER_PASSWORD`.

## Maintenance Rule

When structure, auth, analytics, experiments, tool contracts, API contracts, migrations, or test commands change, update:

- `docs/PROJECT_MEMORY.md`
- `docs/REPO_GROUNDING_PACK.md`
- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` when app/package/hosting architecture changes
- the latest dated system audit, or add a new dated audit
- this README when the entry-point summary changes
