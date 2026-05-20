# System Implementation Audit - Fruitful Lab

Status: confirmed from local repository scan on 2026-05-15.

This audit describes what is implemented in the repo today. It is descriptive, not a plan. For the compact working-memory version, use `docs/PROJECT_MEMORY.md`.

Planning update after this audit:

- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` defines the target brand/app monorepo direction adopted on 2026-05-20.
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md` defines the Fruitful Pin phase-one migration plan.
- The code described below still reflects the pre-migration layout where the current Fruitful Lab app lives in `frontend/`.

## 1. Repository Layout

Top-level runtime folders:

| Path | Current purpose |
| - | - |
| `frontend/` | Next.js App Router app for public pages, tools, login, admin, contractor routes, frontend API proxies, analytics, and experiments. |
| `backend/` | FastAPI app for auth, users, Pinterest stats, DB models, migrations, and admin ingestion endpoints. |
| `docs/` | Documentation, current project memory, audits, guides, tool specs, and archived implementation notes. |
| `prompts/` | LLM architect prompts and sprint prompts. Useful context, not runtime truth. |

Tooling:

- Root `Makefile` contains backend/frontend test and build targets.
- Frontend uses Next.js 16, React 19, TypeScript, Tailwind 4, Jest.
- Backend uses Python 3.12, FastAPI, SQLAlchemy, Postgres/psycopg, Alembic, pytest, JWT via `python-jose`.

## 2. Frontend Architecture

The frontend is a Next.js App Router application.

Active route groups:

- `frontend/app/(site)` - public site layout and tools index.
- `frontend/app/(flow)` - public tool flow layout and tool pages.
- `frontend/app/(admin)` - admin-only route group under `/admin`.
- `frontend/app/(contractor)` - contractor/admin route group under `/contractor`.

Important route files:

- `frontend/app/page.tsx` - home route. Renders public hub for logged-out users and redirects logged-in users by role.
- `frontend/app/layout.tsx` - root layout and optional GTM injection.
- `frontend/app/globals.css` - global theme tokens and tool-specific visual tokens.
- `frontend/app/login/page.tsx` and `frontend/app/login/LoginPageClient.tsx` - login UI.
- `frontend/middleware.ts` - protected route auth and Pinterest Potential experiment cookie assignment.

Public pages:

- `/`
- `/tools`
- `/tools/pinterest-fit-assessment`
- `/tools/pinterest-potential`
- `/case-studies`
- `/hub`
- `/login`

Protected pages:

- `/admin`, `/admin/dashboard`, `/admin/analytics`, `/admin/accounts`
- `/contractor`, `/contractor/fruitful-qa`

## 3. Layout and Navigation

Root layout:

- Injects GTM when `NEXT_PUBLIC_GTM_ID` is set.
- Does not inject GTM when the env var is absent.

Public site layout:

- `frontend/app/(site)/layout.tsx`
- Uses `SiteHeader`, `FlashBanner`, and `SiteFooter`.

Flow layout:

- `frontend/app/(flow)/layout.tsx`
- Used by public tool flows.

Admin layout:

- `frontend/app/(admin)/admin/layout.tsx`
- Calls `getCurrentUser()`.
- Redirects missing user to `/login?next=/admin/analytics`.
- Redirects non-admin contractors to `/contractor`.
- Redirects other non-admin users to `/tools`.

Contractor layout:

- `frontend/app/(contractor)/layout.tsx`
- Calls `getCurrentUser()`.
- Redirects missing user to `/login?next=/contractor`.
- Allows admins and users whose `groups` includes `contractor`.
- Redirects other users to `/tools`.

Navigation:

- Public nav and contractor nav live in `frontend/lib/nav.ts`.
- Contractor nav is currently aligned to `/contractor` and `/contractor/fruitful-qa`.

## 4. Authentication and Authorization

Cookie:

- `fruitful_access_token`

Frontend files:

- `frontend/lib/auth.ts`
- `frontend/middleware.ts`
- `frontend/app/api/auth/login/route.ts`
- `frontend/app/api/auth/logout/route.ts`
- `frontend/app/login/LoginPageClient.tsx`

Backend files:

- `backend/routers/auth.py`
- `backend/security.py`
- `backend/models.py`
- `backend/schemas.py`

Backend endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Login flow:

1. Browser posts JSON `{ email, password, next }` to `/api/auth/login`.
2. Next route validates body shape.
3. Next route calls backend `/auth/login` using OAuth2 password form fields.
4. Backend authenticates by email/password and returns a bearer token.
5. Next route calls backend `/auth/me` with the token.
6. Next route computes role from `is_admin` and `groups`.
7. Next route validates the requested `next` against role-safe destinations.
8. Next route sets `fruitful_access_token` as an HTTP-only cookie with 4-hour max age.
9. Login client navigates to returned `redirectTo`.

Middleware behavior:

- Protected paths are `/admin` and `/contractor`.
- Middleware calls backend `/auth/me` with the cookie token.
- Missing token redirects to `/login?next=...&flash=auth_required`.
- Invalid token clears the cookie and redirects to login with `flash=logged_out`.
- Authenticated users with insufficient role are redirected to `/admin/analytics`, `/contractor`, or `/tools` according to role.

Backend auth dependencies:

- `get_current_active_user`
- `get_current_admin_user`
- `get_current_contractor_user`

Confirmed invariant:

- Gated route access is not UI-only. It is checked in middleware and layout, and backend admin APIs use backend admin dependencies.

## 5. Public Tools

### Pinterest Potential Calculator

Route:

- `/tools/pinterest-potential`
- `frontend/app/(flow)/tools/pinterest-potential/page.tsx`

Core files:

- `frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx`
- `frontend/components/tools/pinterestPotential/PinterestPotentialV2.tsx`
- `frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx`
- `frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts`
- `frontend/lib/tools/pinterestPotential/*`
- `frontend/lib/tools/pinterestPotentialConfig.ts`

Variant contract:

- Type: `welcome | no_welcome`
- Default: `welcome`
- Cookie: `pp_variant`
- A/B enable flag: `ENABLE_AB_SPLIT`
- Current value of `ENABLE_AB_SPLIT`: `false`

Resolution behavior:

- In non-production, valid `?variant=` query param can override.
- If A/B split is enabled, a valid `pp_variant` cookie can be read.
- Otherwise route uses default `welcome`.

Lead behavior:

- Lead modes are `hard_lock` and `soft_lock`.
- Lead mode is resolved from request, optional `ppc_lead_mode` cookie, and config default.
- Known lead status is based on authenticated user or URL token-derived lead.
- URL token lead resolution is a demo/stub decoder, not secure server verification.

### Pinterest Fit Assessment

Route:

- `/tools/pinterest-fit-assessment`
- `frontend/app/(flow)/tools/pinterest-fit-assessment/page.tsx`

Core files:

- `frontend/components/tools/pinterestFit/PinterestFitAssessment.tsx`
- `frontend/components/tools/pinterestFit/IntroScreen.tsx`
- `frontend/components/tools/pinterestFit/QuestionScreen.tsx`
- `frontend/components/tools/pinterestFit/ResultsScreen.tsx`
- `frontend/lib/tools/pinterestFit/*`

Behavior:

- Client-side 7-question assessment.
- Uses deterministic typed scoring in `engine.ts`.
- Tracks a run id across one assessment run.
- Applies configured guardrails before final outcome.

## 6. Analytics Implementation

GTM:

- Injected in `frontend/app/layout.tsx` when `NEXT_PUBLIC_GTM_ID` exists.
- App helper initializes/pushes to `window.dataLayer`.

Central helper:

- `frontend/lib/gtm.ts`

Generic events:

- `tool_view`
- `tool_start`
- `lead_submit`
- `cta_click`

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

Confirmed pattern:

- Application code does not need direct `gtag()` calls.
- Tool code should use the central data-layer helper or a tool-specific wrapper around it.

## 7. Experiments and GrowthBook

Config:

- `frontend/lib/experiments/config.ts`

GrowthBook files:

- `frontend/lib/growthbook/middleware.ts`
- `frontend/lib/growthbook/edgeAdapter.ts`
- `frontend/lib/growthbook/flags.ts`

API routes:

- `POST /api/experiment-events`
- `GET /api/debug/growthbook`

Current experiment registry:

| App key | GrowthBook key | Variants | Default |
| - | - | - | - |
| `pinterest_potential_variant` | `pinterest_potential_variant` | `welcome`, `no_welcome` | `welcome` |

Middleware assignment behavior when enabled:

- Runs for `/tools/pinterest-potential*`.
- Respects existing valid `pp_variant`.
- Ensures stable anonymous id cookie `fp_anon_id`.
- Attempts GrowthBook evaluation with `{ id: fp_anon_id }`.
- Falls back to local weighted choice.
- Persists `pp_variant` for about 90 days.

Current reality:

- `ENABLE_AB_SPLIT` is currently `false`, so middleware does not run assignment under normal conditions.

## 8. Backend API and Data Model

App entry:

- `backend/main.py`

Included routers:

- Auth router from `backend/routers/auth.py`
- Stats router from `backend/routers/stats.py`
- Admin Pinterest stats router from `backend/routers/admin_pinterest_stats.py`

Health:

- `GET /`
- `GET /health`

Models:

- `User`
- `PinterestAccountStatsMonthly`

User fields:

- `id`
- `email`
- `full_name`
- `hashed_password`
- `is_active`
- `is_admin`
- `groups`
- `created_at`
- `updated_at`

Pinterest monthly stats fields:

- `id`
- `account_name`
- `calendar_month`
- `impressions`
- `engagements`
- `outbound_clicks`
- `saves`
- `uploaded_at`
- `created_at`
- `updated_at`

DB constraint:

- Unique `(account_name, calendar_month)` on `pinterest_account_stats_monthly`.

Current admin stats endpoints:

- `POST /admin/pinterest-stats/upload`
- `GET /admin/pinterest-stats/accounts`
- `GET /admin/pinterest-stats/monthly?account_name=...`

Older stats endpoints still present:

- `GET /users`
- `GET /pinterest-stats`
- `POST /pinterest-stats/upload-csv`
- `GET /pinterest-stats/monthly`

Watch point:

- The older `/pinterest-stats/upload-csv` constructs `PinterestAccountStatsMonthly` without `account_name`, while the current model requires `account_name`. Treat admin-prefixed stats endpoints as the current ingestion path unless code is intentionally refactored.

## 9. Frontend API Proxies

Auth:

- `POST /api/auth/login`
- `POST /api/auth/logout`

Admin Pinterest stats:

- `GET /api/admin/pinterest-stats/accounts`
- `GET /api/admin/pinterest-stats/monthly?account_name=...`
- `POST /api/admin/pinterest-stats/upload`

Experiment diagnostics:

- `POST /api/experiment-events`
- `GET /api/debug/growthbook`

Current proxy behavior:

- Admin proxies read `fruitful_access_token`.
- Proxies forward bearer token to backend admin endpoints.
- Missing frontend auth cookie returns 401 before upstream call.

Watch point:

- `frontend/app/(admin)/admin/analytics/page.tsx` currently has a code path that expects accounts as `{ accounts: Account[] }`, while the proxy returns the backend string array. Verify/fix before relying on the account dropdown.

## 10. Environment Variables

Frontend/server:

- `API_BASE_URL` - required by `getApiOrigin()` for server-side backend calls.
- `NEXT_PUBLIC_API_BASE_URL` - used by legacy dashboard helper.
- `NEXT_PUBLIC_GTM_ID` - optional GTM container id.
- `GROWTHBOOK_CLIENT_KEY` - optional GrowthBook SDK key.
- `GROWTHBOOK_API_HOST` - optional GrowthBook API host, defaults to CDN host.

Backend:

- `DATABASE_URL` - required by `backend/db.py`.
- `JWT_SECRET_KEY` - required for JWT creation/validation.
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` - optional, defaults to 240.
- `OPENAI_API_KEY` - optional config currently loaded.

## 11. Tests and Verification

Backend test files exist for:

- auth API,
- auth protection,
- config,
- database schema,
- health endpoints,
- Pinterest stats API,
- security,
- Pinterest Fit scenarios/spec.

Frontend tests exist for:

- auth helper,
- middleware auth,
- dashboard,
- public landing,
- route pages,
- GrowthBook/experiments,
- Pinterest Potential compute and optional results behavior,
- Pinterest Fit engine/component,
- UI/layout components.

Commands:

- `make test`
- `make all`
- `cd backend && uv run pytest -q`
- `cd frontend && npm test`
- `cd frontend && npm run build`
- `cd frontend && npm run ci`

## 12. Confirmed Stale Records Updated

The previous grounding pack had stale references to missing `/login` and `/case-studies`; both routes now exist.

The previous grounding pack described older experiment variants and assumptions in places. Current variants are `welcome` and `no_welcome`; A/B assignment is currently disabled by `ENABLE_AB_SPLIT = false`.

The previous grounding pack under-described current analytics. The app now has generic events, PPC-specific `ppc_*` events, and Pinterest Fit assessment-specific events.

The contractor navigation config had stale `/cont` route references. It has been corrected to `/contractor` and `/contractor/fruitful-qa`.

## 13. Recommended Memory Maintenance

Update `docs/PROJECT_MEMORY.md` and this dated audit when any of the following change:

- route structure,
- auth cookie/session behavior,
- role/group authorization policy,
- public tool flow contracts,
- analytics event names or payloads,
- experiment keys, variants, or assignment behavior,
- backend model/schema/API contracts,
- migration baseline,
- required environment variables,
- CI/test commands.
