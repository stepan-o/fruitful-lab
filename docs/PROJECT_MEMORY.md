# Project Memory - Fruitful Lab

Status: current working memory as of 2026-05-28 after adding the separate Fruitful Pin Pinterest Readiness Check resource.

Use this file as the durable architectural memory for future Codex/LLM work on this repo. It records the structure, layers, contracts, and working patterns that should be assumed going forward unless code proves otherwise.

## What This Project Is

Fruitful Lab is becoming a brand/app monorepo for multiple separately deployed web properties and shared tool infrastructure. The current implementation is still a Next.js + FastAPI platform that hosts Fruitful Pin/Fruitful Lab public tools, gated admin workflows, contractor placeholders, analytics plumbing, and Pinterest account stats ingestion.

Related planning note:

- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` is the current target architecture reference. It defines the shift from a single-app layout toward separate apps under `apps/*`, beginning with `apps/lab` for Fruitful Lab and later `apps/fruitful-pin` for the Fruitful Pin migration. Future brand apps may include Bloom Whispers and Bricoli.
- `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md` is the active PR-gated execution plan for the monorepo migration. It defines PR 1 as docs/architecture baseline, PR 2 as the completed structure-only `frontend/` to `apps/lab/` move, PR 3 as Fruitful Pin app foundation, and later PRs for inventory, content contracts, templates, CMS integration, and launch prep.
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md` is the current planning reference for a Fruitful Bean / Fruitful Pin-only migration of `fruitfulpin.com` to a coded Next.js marketing site. It explicitly does not propose rebuilding Fruitful Lab, removes Kadence from future cost comparisons, assumes GoDaddy domain registration and prepaid A2 hosting until 2027, and prefers Cloudflare hosting for the public Next.js frontend. The original spec proposed phase-one headless WordPress, but Susy changed the B1 launch direction on 2026-05-24: Fruitful Pin should launch with code-managed content and a Codex-assisted publishing workflow, while WordPress/A2 remains only as the old-site source/archive unless headless is explicitly reopened later.

The current Fruitful Lab app is not just a marketing site. It is a tool-and-analytics system with:

- public lead/value tools,
- role-gated internal/admin areas,
- contractor-gated work areas,
- GTM data-layer event instrumentation,
- GrowthBook experiment infrastructure,
- a FastAPI/Postgres backend for auth and Pinterest stats.

## Target Monorepo Direction

The target repo shape is:

- `apps/lab/` - current Fruitful Lab Next.js app; hosted on Vercel as a sandbox/prototype platform.
- `apps/fruitful-pin/` - Fruitful Pin commercial marketing site foundation; static-first Next.js app with Cloudflare Pages as the preferred public frontend host.
- `apps/fruitful-lab-site/` - Fruitful Lab customer-facing umbrella marketing site foundation for `fruitfulab.com`; separate from the sandbox app on `fruitfulab.net`.
- `apps/bloom-whispers/` - future separate brand/site example.
- `apps/bricoli/` - future separate brand/site example.
- `packages/*` - shared code extracted only after real cross-app reuse exists.
- `backend/` - current FastAPI backend, used where needed and not assumed by every future brand app.

Current Fruitful Lab code lives in `apps/lab/`.

Working pattern:

- Keep separate brands as separate apps and deployments.
- Do not import directly across apps.
- Promote reusable code into `packages/*` before sharing it across apps.
- Keep hosting assumptions per app: Fruitful Lab sandbox on Vercel, Fruitful Pin public frontend on Cloudflare in the current plan, and Fruitful Lab customer site following the same Cloudflare/static-first direction as Fruitful Pin.
- Use Fruitful Lab as the prototype/sandbox space and promote mature tools into commercial brand apps through shared packages.

## Top-Level Layout Today

- `apps/lab/` - current Next.js App Router app for Fruitful Lab.
- `apps/fruitful-pin/` - separate Next.js App Router foundation for Fruitful Pin.
- `apps/fruitful-lab-site/` - separate Next.js App Router foundation for the public Fruitful Lab customer site at `fruitfulab.com`.
- `backend/` - FastAPI app with SQLAlchemy, Alembic, JWT auth, and Postgres.
- `docs/` - current memory, audits, implementation notes, guides, and archived plans.
- `prompts/` - LLM architect prompts and sprint plans.
- `Makefile` - root convenience commands for backend and Lab app tests/builds.
- `repo-tree.txt` - static repo tree snapshot.


## Fruitful Pin App Foundation

`apps/fruitful-pin/` is now the separate Fruitful Pin app foundation. It is intentionally not a production launch and does not change `fruitfulpin.com`, GoDaddy, A2, WordPress, or Cloudflare settings.

Current foundation:

- static-first Next.js App Router app,
- `output: "export"` for Cloudflare Pages compatibility,
- V1 public sitemap/navigation routes for `/`, `/pinterest-services`, `/resources`, `/pinterest-fit-check`, `/pinterest-readiness-check`, `/blog`, root-level blog posts, `/about`, `/contact`, `/privacy`, `/privacy-policy`, and `/terms`,
- legacy `/services` redirects to `/pinterest-services`, and `/case-studies` is preserved as a V2 redirect/holding route that also points to `/pinterest-services` during V1,
- brand/site constants in `apps/fruitful-pin/lib/site.ts`,
- content boundary in `apps/fruitful-pin/lib/content.ts`,
- WordPress connection placeholder in `apps/fruitful-pin/lib/wordpress.ts` retained as optional future/historical plumbing, not the B1 launch path,
- local tests in `apps/fruitful-pin/__tests__/`.

First-pass checkpoint memory:

- Fruitful Pin should feel airy, breezy, editorial, warm, and Pinterest-specific rather than corporate, generic, or boxy.
- Primary CTAs use solid `#950952` pink. Gradients are for text highlights and occasional intentional accents, not CTA buttons.
- Top navigation should stay intentionally lean: Home, Blog, Services, Resources, and About. Contact, Privacy, and Terms can live in the footer and contextual page CTAs. Case Studies is held for V2 and should not be linked in V1 navigation or sitemap.
- Resources is a soft-conversion hub. It features the native Pinterest Fit Check, includes the migrated Pinterest Readiness Check as a separate ready-now assessment resource, and keeps guide/resource/blog paths underneath.
- Pinterest Fit Check is the Fruitful Pin-native diagnostic tool at `/pinterest-fit-check`; it lives inside `apps/fruitful-pin` rather than importing from `apps/lab`.
- Pinterest Readiness Check is a separate migrated assessment at `/pinterest-readiness-check`; it preserves the approved Fruitful Lab assessment questions, scoring, guardrails, result copy, and email-unlock behavior without replacing or renaming the native Pinterest Fit Check.
- Blog templates should support a sidebar, featured images, table of contents, key takeaways, pin graphic slots, pull quotes, comparison tables, FAQs, and reader navigation.
- Contact is the fit-call page: embedded TidyCal first, then the general inquiry form. The general inquiry form is approved for ClickUp routing in B1 and posts to `/api/contact`.
- Case studies/proof is currently a first-pass holding structure until Susy is ready to build real visual case studies and proof packets.

B1 launch content direction approved on 2026-05-24:

- Fruitful Pin B1 should use a code-managed blog/content workflow, not headless WordPress.
- WordPress/A2 may remain available through the prepaid period as the old-site source/archive, but the new public site should not rely on WordPress as the CMS unless Susy explicitly changes direction.
- Existing WordPress posts that should launch with B1 need to be migrated into the Next.js content model and rendered through the approved blog templates.
- Required media should be copied into the app or another approved permanent asset location; avoid production dependencies on `fruitfulpin.com/wp-content/uploads/*` once DNS points to the new site.
- ClickUp can be used as the editorial planning/intake workspace. The live published copy, metadata, and optimized images should still be committed into `apps/fruitful-pin`.
- MailerLite is the B1 integration target for newsletter signups, Fit Check result emails, the Pinterest Readiness Check full-readout email step, and future resource waitlists. The Readiness Check submits rich result fields on a best-effort basis and falls back to the existing resource-interest group if no dedicated `MAILERLITE_READINESS_CHECK_GROUP_ID` is configured, so missing custom fields should not block the user from seeing the full readout. Analytics setup now includes Cloudflare Web Analytics, Google Search Console with `https://fruitfulpin.com/sitemap.xml`, GA4 Measurement ID `G-E0TLX9V17Q` wired through `apps/fruitful-pin/components/GoogleAnalytics.tsx`, Microsoft Clarity project `wyaafqmk6j` loaded as a direct root-layout script in `apps/fruitful-pin/app/layout.tsx`, and Pinterest Tag ID `2612504823331` wired through `apps/fruitful-pin/components/PinterestTag.tsx`. GA4 V1 conversion events are `fit_check_completed`, `newsletter_signup`, `resource_interest`, `contact_form_submitted`, and `fit_call_click`; the Readiness Check also emits readiness-specific events such as `readiness_check_started`, `readiness_check_completed`, and `readiness_check_email_unlocked`. Affiliate URLs remain pending from Susy.
- Contact page messages use a Cloudflare Pages Function at `/api/contact` to create a ClickUp task. Configure `CLICKUP_API_TOKEN` and `CLICKUP_CONTACT_LIST_ID` in Cloudflare; do not commit the token to the repo.
- Case Studies should be preserved for V2 and should not block B1 launch. For V1, hide it from public navigation/sitemap and redirect `/case-studies` to `/pinterest-services` while keeping the future proof/story work available for later.

Use `npm run build` from `apps/fruitful-pin/` or `make fruitful-pin-build` from the repo root to verify the static export. Cloudflare Pages should use `apps/fruitful-pin` as the root, `npm run build` as the build command, and `out` as the build output directory. If later WordPress preview, SSR, or dynamic route needs exceed static export, switch this app to the Cloudflare Workers/OpenNext path in a dedicated PR.

Local preview note for Codex:

- Request network permission before starting `next dev` or any local preview server. Fresh-thread testing on 2026-05-20 confirmed that Codex cannot bind `127.0.0.1:4173` without network permission and fails with `listen EPERM`; after permission is granted, the Fruitful Pin dev server renders locally.
- Confirmed local preview command target: `make fruitful-pin-dev` from the repo root, or `npm run dev:local` from `apps/fruitful-pin/`. Use `http://127.0.0.1:4173/` for browser review.

## Fruitful Lab Customer Site Foundation

`apps/fruitful-lab-site/` is the separate public customer-facing Fruitful Lab site foundation for `https://fruitfulab.com`.

Domain split:

- `fruitfulab.net` remains the sandbox/tools/experiments app in `apps/lab/`.
- `fruitfulab.com` is the public umbrella marketing site in `apps/fruitful-lab-site/`.
- `fruitfulpin.com` remains the Pinterest-specific commercial brand in `apps/fruitful-pin/`.
- Do not use `fruitfullab.com`; Susy confirmed the only correct .com domain is `fruitfulab.com`.

Current foundation:

- static-first Next.js App Router app,
- `output: "export"` for Cloudflare Pages compatibility,
- first-pass public routes for `/`, `/services`, `/blog`, `/blog/[slug]`, `/resources`, `/about`, `/contact`, `/privacy`, and `/terms`,
- brand/site constants in `apps/fruitful-lab-site/lib/site.ts`,
- content boundary in `apps/fruitful-lab-site/lib/content.ts`,
- WordPress connection placeholder in `apps/fruitful-lab-site/lib/wordpress.ts`,
- sitemap and robots metadata routes,
- local tests in `apps/fruitful-lab-site/__tests__/`.

Brand and offer direction memory:

- Fruitful Lab is the bigger umbrella brand where Susi and Esteban can combine AI marketing, funnels, paid media, email, content systems, and workflow expertise.
- Fruitful Lab is the parent-company style home for Fruitful Pin, Bloom Whispers, Bricoli Studio, and future brands.
- Fruitful Pin and Fruitful Lab can share a family resemblance, but Fruitful Lab should lean more navy/gold and less pink while Fruitful Pin stays more pink/yellow and Pinterest-specific.
- Initial site scope includes Home, About, Services, Blog, Resources, Contact, Privacy, and Terms.
- Case studies and tools/experiments are intentionally out of the first skeleton.
- Contact path uses `hello@fruitfulab.com` and a TidyCal booking destination. `NEXT_PUBLIC_TIDYCAL_URL` can override the default fallback.
- CMS direction for the Fruitful Lab customer site has not been re-decided after the Fruitful Pin 2026-05-24 code-managed pivot. Do not automatically inherit either WordPress/headless or code-managed content for `apps/fruitful-lab-site` without a separate decision.
- Cloudflare/static-first is the preferred public frontend hosting direction when launch work begins.

Use `npm run build` from `apps/fruitful-lab-site/` to verify the static export. Cloudflare Pages should use `apps/fruitful-lab-site` as the root, `npm run build` as the build command, and `out` as the build output directory. Do not point `fruitfulab.com` at this app until preview, content, analytics, redirects, and launch checks are explicitly approved.

## Frontend Layers

### App Router

`apps/lab/app/` owns Fruitful Lab routes, layouts, and Next route handlers.

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

- `apps/lab/app/layout.tsx` - root HTML/body and GTM injection when `NEXT_PUBLIC_GTM_ID` is present.
- `apps/lab/app/globals.css` - Tailwind import plus project tokens, light/dark variables, scrollbars, and PPC-specific visual tokens.
- `apps/lab/components/layout/*` - headers, footers, flash banner, logout, book-call button, flow shell/header.
- `apps/lab/lib/nav.ts` - shared public and contractor navigation config.


Working pattern:

- Server components by default.
- Client components only for interaction, browser APIs, or analytics event pushes.
- Shared visual tokens live in CSS variables, not scattered hard-coded palettes.
- Do not duplicate route paths in many places when `apps/lab/lib/nav.ts` can own them.

## Tool System

Public tools are explicit flows with typed config/data/compute layers under `apps/lab/lib/tools/*` and UI components under `apps/lab/components/tools/*`. These remain inside `apps/lab/` until a second app needs them; then stable reusable logic should move to `packages/tools` and reusable UI may move to `packages/tool-ui`.

### Pinterest Potential Calculator

Route:

- `apps/lab/app/(flow)/tools/pinterest-potential/page.tsx`

Key UI:

- `PinterestPotentialV1` - `welcome` variant.
- `PinterestPotentialV2` - `no_welcome` variant shell.
- `PinterestPotentialWizard` - core wizard.
- Step components under `apps/lab/components/tools/pinterestPotential/steps/`.
- View components under `apps/lab/components/tools/pinterestPotential/views/`.

Key logic:

- `apps/lab/lib/tools/pinterestPotentialConfig.ts` - variant constants and A/B enable flag.
- `apps/lab/lib/tools/pinterestPotential/compute.ts` - calculation logic.
- `apps/lab/lib/tools/pinterestPotential/pinterestPotentialSpec.ts` - typed spec/contracts.
- `apps/lab/lib/tools/pinterestPotential/leadMode.ts` - lead gating mode resolver.
- `apps/lab/lib/tools/pinterestPotential/leadGatingConfig.ts` - lead gating config.
- `apps/lab/lib/tools/pinterestPotential/leadToken.ts` - current lead-token stub/QA decoder.

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

- `apps/lab/app/(flow)/tools/pinterest-fit-assessment/page.tsx`

Key UI:

- `apps/lab/components/tools/pinterestFit/PinterestFitAssessment.tsx`
- `IntroScreen`, `QuestionScreen`, `ResultsScreen`

Key logic:

- `apps/lab/lib/tools/pinterestFit/questions.ts`
- `apps/lab/lib/tools/pinterestFit/engine.ts`
- `apps/lab/lib/tools/pinterestFit/results.ts`
- `apps/lab/lib/tools/pinterestFit/tracking.ts`
- `apps/lab/lib/tools/pinterestFit/types.ts`

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

- `apps/lab/lib/auth.ts`
- `apps/lab/middleware.ts`
- `apps/lab/app/api/auth/login/route.ts`
- `apps/lab/app/api/auth/logout/route.ts`
- `apps/lab/app/login/LoginPageClient.tsx`

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

- `apps/lab/lib/experiments/config.ts`

GrowthBook integration:

- `apps/lab/lib/growthbook/middleware.ts` - Edge-safe middleware assignment.
- `apps/lab/lib/growthbook/edgeAdapter.ts` - Edge-safe adapter import.
- `apps/lab/lib/growthbook/flags.ts` - server-side adapter with tracking callback.
- `apps/lab/app/api/debug/growthbook/route.ts` - debug/health endpoint.
- `apps/lab/app/api/experiment-events/route.ts` - dev-friendly event intake.

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

- Root GTM injection lives in `apps/lab/app/layout.tsx`.
- Data-layer helpers live in `apps/lab/lib/gtm.ts`.
- `window.dataLayer` typing lives in `apps/lab/types/global.d.ts`.

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
- Some comments and older prompts still describe contractor route examples or dashboard redirects from prior iterations. Verify against `apps/lab/app/` and `apps/lab/middleware.ts`.
- `apps/lab/app/(admin)/admin/analytics/page.tsx` currently expects accounts as `{ accounts: Account[] }` in one code path, while the proxy/backend returns a raw string array. This looks like a runtime bug or unfinished refactor; verify before relying on that UI.
- `backend/routers/stats.py` still contains older `/pinterest-stats/upload-csv` behavior that constructs monthly stats without `account_name`, even though the model now requires it. Treat `/admin/pinterest-stats/*` as the current admin ingestion path.
- `resolveLeadFromToken()` is not secure verification; it is a stub/demo decoder.

## Testing and Verification

Root commands:

- `make backend-test`
- `make lab-test`
- `make lab-build`
- `make test`
- `make all`

Direct commands:

- `cd backend && uv run pytest -q`
- `cd apps/lab && npm test`
- `cd apps/lab && npm run build`
- `cd apps/lab && npm run ci`

Test surface:

- Backend tests cover auth, auth protection, config, DB schema, health endpoints, Pinterest stats API, security, and Pinterest Fit spec/scenarios.
- Frontend tests cover routes, middleware auth, dashboard, auth helpers, GrowthBook/experiment helpers, Pinterest Potential compute, Pinterest Fit engine/components, public landing, and layout components.

## How To Work With This Project Going Forward

1. Start by reading `docs/REPO_GROUNDING_PACK.md` and this file.
2. Verify current code before trusting old prompts, archived docs, or dated audits.
3. For route or auth changes, inspect `apps/lab/app`, `apps/lab/middleware.ts`, `apps/lab/lib/auth.ts`, and backend auth dependencies together.
4. For tool changes, keep UI, typed config, compute/scoring, and tracking contracts aligned.
5. For analytics changes, update `apps/lab/lib/gtm.ts` or tool-specific tracking helpers and document event schema changes here.
6. For experiment changes, update `apps/lab/lib/experiments/config.ts`, middleware assignment logic, and the tool page resolver together.
7. For API/data changes, update backend model/schema/router, migrations, frontend proxy/helper, and tests together.
8. When architectural contracts change, update this file and add or refresh a dated implementation audit.
