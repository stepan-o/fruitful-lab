# Repo Grounding Pack - Fruitful Lab

Status: refreshed from local repo scan and planning updates on 2026-05-21.

This is the high-signal orientation file for Fruitful Lab. Treat it as the first stop before changing the system. The fuller current-state memory is `docs/PROJECT_MEMORY.md`; the dated implementation audit is `docs/SYSTEM_IMPLEMENTATION_AUDIT-2026-05-15.md`.

Related planning reference:

- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` is the target architecture reference for the shift to separate brand apps under `apps/*`, shared packages under `packages/*`, and future apps such as Bloom Whispers and Bricoli.
- `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md` is the active PR-gated execution plan for moving from docs baseline to `apps/lab`, then `apps/fruitful-pin`, then launch preparation.
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md` captures the corrected Fruitful Bean / Fruitful Pin-only plan for migrating `fruitfulpin.com` to a coded Next.js marketing site. Fruitful Lab remains as-is for that plan; Cloudflare is the preferred public frontend host for cost; WordPress stays on prepaid A2 hosting as the phase-one headless CMS/editor; Kadence is excluded from future cost comparisons.

## Authority Model

- Code is the highest authority.
- `docs/PROJECT_MEMORY.md` is the durable working memory for structure, contracts, and architectural patterns.
- `docs/SYSTEM_IMPLEMENTATION_AUDIT-2026-05-15.md` is the evidence-oriented snapshot from the latest deep scan.
- Older dated audits and archived sprint plans are historical context only.
- If docs and code disagree, update docs or code after verifying the actual runtime contract.

## Repo Map

- `apps/lab/` - current Next.js App Router app for Fruitful Lab public pages, tool flows, login, admin, contractor pages, analytics proxies, and experiment diagnostics.
- `apps/fruitful-pin/` - Fruitful Pin static-first Next.js first-pass marketing site targeting Cloudflare Pages; not connected to live DNS or WordPress yet.
- `apps/fruitful-lab-site/` - Fruitful Lab customer-facing umbrella marketing site foundation for `fruitfulab.com`; separate from the sandbox app on `fruitfulab.net`.
- `apps/bloom-whispers/` - Bloom Whispers editorial/ritual brand app foundation and migrated journal site; content workflow docs live under `docs/brands/bloom-whispers/`.
- `apps/` - home for separate deployable brand apps. Current apps include `apps/lab`, `apps/fruitful-pin`, `apps/fruitful-lab-site`, and `apps/bloom-whispers`; future examples include `apps/bricoli`.
- `packages/` - target home for shared code once real cross-app reuse exists. Do not create broad shared abstractions prematurely.
- `backend/` - FastAPI app for auth, users, Pinterest stats, Postgres models, Alembic migrations, and admin-only CSV ingestion.
- `docs/` - current memory, audits, guides, and historical implementation notes.
- `prompts/` - LLM architect prompts and sprint prompts; useful as context, not runtime truth.
- `repo-tree.txt` - static tree snapshot; regenerate only when intentionally needed.

## Frontend Anchors

Current Fruitful Lab paths use `apps/lab/`.

- App router entry: `apps/lab/app/`
- Root layout and GTM injection: `apps/lab/app/layout.tsx`
- Global styles and tokens: `apps/lab/app/globals.css`
- Public site layout: `apps/lab/app/(site)/layout.tsx`
- Public tools index: `apps/lab/app/(site)/tools/page.tsx`
- Flow layout: `apps/lab/app/(flow)/layout.tsx`
- Admin layout gate: `apps/lab/app/(admin)/admin/layout.tsx`
- Contractor layout gate: `apps/lab/app/(contractor)/layout.tsx`
- Middleware auth and experiment cookie assignment: `apps/lab/middleware.ts`
- Navigation config: `apps/lab/lib/nav.ts`

## Public Routes

- `/` - public hub for logged-out visitors; logged-in users are redirected by role.
- `/tools` - public tools index.
- `/tools/pinterest-fit-assessment` - public Pinterest Fit Assessment.
- `/tools/pinterest-potential` - public Pinterest Potential Calculator entry with variant and lead-mode resolution.
- `/case-studies` - public coming-soon case-studies page.
- `/hub` - public knowledge-hub preview.
- `/login` - public login UI.

## Gated Routes

- `/admin` and `/admin/*` - admin-only. Middleware checks token and role via backend `/auth/me`; admin layout also fail-closes server-side.
- `/admin/dashboard` - legacy/early Pinterest stats dashboard using backend `/pinterest-stats/monthly`.
- `/admin/analytics` - admin Pinterest stats upload and monthly-row UI through frontend API proxies.
- `/admin/accounts` - admin account list UI.
- `/contractor` and `/contractor/*` - allowed for admins and users in the `contractor` group. Middleware and layout both gate access.
- `/contractor/fruitful-qa` - placeholder contractor QA assistant route.

## Auth Anchors

- Cookie: `fruitful_access_token`
- Frontend server helper: `apps/lab/lib/auth.ts`
- Frontend login proxy: `apps/lab/app/api/auth/login/route.ts`
- Frontend logout proxy: `apps/lab/app/api/auth/logout/route.ts`
- Middleware gate: `apps/lab/middleware.ts`
- Backend auth router: `backend/routers/auth.py`
- Backend dependencies and JWT helpers: `backend/security.py`
- Backend user schema/model: `backend/schemas.py`, `backend/models.py`

Auth flow:
- Frontend login posts email/password to `/api/auth/login`.
- The Next route calls FastAPI `/auth/login`, receives a JWT, calls `/auth/me`, computes role, sets `fruitful_access_token`, and returns a safe `redirectTo`.
- Server components call `getCurrentUser()`, which reads the cookie and calls backend `/auth/me`.
- Middleware uses the same cookie and backend `/auth/me` for protected route role checks.
- Backend JWT subject is the user email. Active users only can pass `/auth/me`.

## Experiment Anchors

- Canonical experiment config: `apps/lab/lib/experiments/config.ts`
- Middleware cookie assignment: `apps/lab/lib/growthbook/middleware.ts`
- Edge-safe GrowthBook adapter: `apps/lab/lib/growthbook/edgeAdapter.ts`
- Server GrowthBook adapter/tracking callback: `apps/lab/lib/growthbook/flags.ts`
- Event ingestion endpoint: `apps/lab/app/api/experiment-events/route.ts`
- Debug endpoint: `apps/lab/app/api/debug/growthbook/route.ts`
- Pinterest Potential variant constants: `apps/lab/lib/tools/pinterestPotentialConfig.ts`

Current reality:
- The only registered experiment key is `pinterest_potential_variant`.
- Valid variants are `welcome` and `no_welcome`; default is `welcome`.
- `ENABLE_AB_SPLIT` is currently `false`, so middleware does not assign random variants in normal operation.
- Non-production can still use `?variant=welcome` or `?variant=no_welcome` for QA.
- When enabled, middleware persists `fp_anon_id` and `pp_variant`, using GrowthBook first and weighted local fallback second.

## Analytics Anchors

- GTM script injection: `apps/lab/app/layout.tsx`
- Data layer helper: `apps/lab/lib/gtm.ts`
- Generic tool hook: `apps/lab/lib/hooks/useToolAnalytics.ts`
- Pinterest Fit tracking: `apps/lab/lib/tools/pinterestFit/tracking.ts`

Current event families:
- Generic events: `tool_view`, `tool_start`, `lead_submit`, `cta_click`
- Pinterest Potential vNext events: `ppc_view_start`, `ppc_start`, `ppc_answer`, `ppc_complete`, `ppc_cta_click`, `ppc_lead_view`, `ppc_lead_submit`, `ppc_lead_skip`, `ppc_back`
- Pinterest Fit events: `assessment_started`, `assessment_question_completed`, `assessment_completed`, result-specific events, and `cta_fit_call_clicked`

Invariant:
- App code pushes events to `window.dataLayer` through helpers.
- GTM is the orchestrator. Do not add direct `gtag()` calls in app code.

## Tool System Anchors

Pinterest Potential:
- Route: `apps/lab/app/(flow)/tools/pinterest-potential/page.tsx`
- Variants: `PinterestPotentialV1` for `welcome`, `PinterestPotentialV2` for `no_welcome`
- Wizard: `apps/lab/components/tools/pinterestPotential/PinterestPotentialWizard.tsx`
- State draft helper: `apps/lab/components/tools/pinterestPotential/usePinterestPotentialDraft.ts`
- Compute/spec layer: `apps/lab/lib/tools/pinterestPotential/*`
- Lead gating: `leadMode.ts`, `leadGatingConfig.ts`, `leadToken.ts`

Pinterest Fit:
- Route: `apps/lab/app/(flow)/tools/pinterest-fit-assessment/page.tsx`
- Client assessment component: `apps/lab/components/tools/pinterestFit/PinterestFitAssessment.tsx`
- Scoring engine and typed config: `apps/lab/lib/tools/pinterestFit/*`

## Fruitful Pin Anchors

- App root: `apps/fruitful-pin/`
- Static export config: `apps/fruitful-pin/next.config.ts`
- Site constants: `apps/fruitful-pin/lib/site.ts`
- Content boundary: `apps/fruitful-pin/lib/content.ts`
- WordPress adapter placeholder: `apps/fruitful-pin/lib/wordpress.ts`
- Native Pinterest Fit Check: `apps/fruitful-pin/app/pinterest-fit-check/page.tsx`, `apps/fruitful-pin/components/PinterestFitAssessmentEmbed.tsx`, `apps/fruitful-pin/lib/fitAssessment.ts`
- SEO/static export routes: `apps/fruitful-pin/app/sitemap.ts`, `apps/fruitful-pin/app/robots.ts`
- Routes: `/`, `/pinterest-services`, `/resources`, `/pinterest-fit-check`, `/blog`, root-level blog posts, `/case-studies`, `/about`, `/contact`, `/privacy`, `/privacy-policy`, `/terms`, and legacy `/services`
- Root checks: `make fruitful-pin-test`, `make fruitful-pin-build`, `make fruitful-pin-ci`
- Local preview from Codex requires network permission before starting the server; otherwise `next dev -H 127.0.0.1 -p 4173` can fail with `listen EPERM`.

Do not point `fruitfulpin.com` at this app until preview, content migration, redirects, analytics, and launch checks are explicitly approved.

## Fruitful Lab Customer Site Anchors

- App root: `apps/fruitful-lab-site/`
- Canonical domain: `https://fruitfulab.com`
- Distinct from `apps/lab/`, which remains the `fruitfulab.net` sandbox/tools/experiments app.
- Static export config: `apps/fruitful-lab-site/next.config.ts`
- Site constants: `apps/fruitful-lab-site/lib/site.ts`
- Placeholder content boundary: `apps/fruitful-lab-site/lib/content.ts`
- WordPress connection placeholder: `apps/fruitful-lab-site/lib/wordpress.ts`
- Routes: `/`, `/services`, `/blog`, `/blog/[slug]`, `/resources`, `/about`, `/contact`, `/privacy`, `/terms`
- Contact email: `hello@fruitfulab.com`
- TidyCal URL can be set with `NEXT_PUBLIC_TIDYCAL_URL`; default fallback is `https://tidycal.com/susycid`.

Do not point `fruitfulab.com` at this app until preview, content, analytics, redirects, and launch checks are explicitly approved.

## Bloom Whispers Editorial Anchors

- App root: `apps/bloom-whispers/`
- Brand docs: `docs/brands/bloom-whispers/`
- Editorial orchestrator: `docs/brands/bloom-whispers/agents/orchestrator-agent.md`
- Pipeline manifest template: `docs/brands/bloom-whispers/content-pipeline/_templates/pipeline-status-template.md`
- First orchestrator pilot: `docs/brands/bloom-whispers/content-pipeline/marigold/pipeline-status.md`

Fundamental workflow objective: preserve Bloom Whispers' quality promise while reducing Susy's manual routing between separate researcher, writer, editor, creative, and publisher tasks. The orchestrator is the preferred user-facing coordination layer for multi-stage Bloom Whispers content work; specialist agents still own their craft lanes, while the orchestrator owns state, sequencing, handoffs, and human approval gates.

Fundamental reader-arrival principle: research should make the article richer and support the source list, not make the opening feel academic. The first screen must give a general English-speaking reader a familiar, sensory, plain-English doorway before it introduces dense cultural terms, source names, botanical Latin, or institutional proof. Susy's rejection of reader arrival supersedes any prior numerical score or editor approval.

Fundamental hook principle: curiosity-led Bloom Whispers copy must create immediate tension, specificity, or a clear reader payoff. A number alone is not a hook, vague "surprising things" phrasing is not enough, and ornate internal-brand language should not appear as public H1/H2 copy when it makes the reader work harder.

Bloom Whispers media production is staged: Media Strategy proposes five concrete concepts by category, Susy selects, Creative Director creates prototype direction, Production Agent creates ChatGPT-ready prompts plus Canva edit notes, and Publisher implements only approved assets/placeholders. Susy prefers generating text-included image drafts in ChatGPT and refining or rebuilding the text/layout in Canva; Codex image generation is not the default unless explicitly requested.

Current Marigold pilot state: live publish authorized / production deployment in progress as of 2026-08-13. The V3 9.1/10 verdict is preserved as historical context but is no longer current approval; V4 fixed reader arrival, V5 over-tightened and introduced confusing thesis language, and V6 restores V4 as the base with Susy's clearer line: "Marigold meaning changes by where the flower is placed." Susy approved V6 on 2026-08-12, while noting the writing style can still improve as a future polish/watch point. Current media direction: `docs/brands/bloom-whispers/content-pipeline/marigold/media-ideas-v1.md`; selected concepts: `docs/brands/bloom-whispers/content-pipeline/marigold/media-selection-decision-v1.md`; prompt/Canva handoff: `docs/brands/bloom-whispers/content-pipeline/marigold/media/production-prompts-v1.md`; first generated PNG QA: `docs/brands/bloom-whispers/content-pipeline/marigold/media/asset-review-v1.md`; approved launch media handoff: `docs/brands/bloom-whispers/content-pipeline/marigold/media/selected-media-handoff-v1.md`; Publisher Brief Only: `docs/brands/bloom-whispers/content-pipeline/marigold/publisher-brief-v1.md`; Site Implementation: `docs/brands/bloom-whispers/content-pipeline/marigold/site-implementation-v1.md`. The article is implemented in `apps/bloom-whispers/lib/journalPosts.ts` with canonical clean route `/marigold-meaning/`, internal route `/journal/marigold-meaning/`, five selected assets staged in `apps/bloom-whispers/public/assets/marigold/`, FAQ/schema support, visible safety notes, and source list. A real sub-agent rerun was completed on 2026-08-12 with Writer, Editor/Critic, Media/Creative, Publisher readiness, Production, Publisher Brief, and Publisher QA outputs recorded in the Marigold pipeline. Future quote graphics should feel like wisdom/inspiration/motivation or a useful reminder, not merely cute or decorative.

## Backend/API Anchors

- FastAPI app: `backend/main.py`
- CORS origins: localhost frontend, `fruitfulab.net`, and Vercel app.
- DB setup: `backend/db.py`
- Env config: `backend/config.py`
- Models: `User`, `PinterestAccountStatsMonthly`
- Current migration: `backend/migrations/versions/0f1db0936876_initial_schema.py`

Admin Pinterest stats contract:
- Frontend proxies under `/api/admin/pinterest-stats/*`.
- Backend admin endpoints under `/admin/pinterest-stats/*`.
- All admin stats endpoints require backend admin dependency.
- `PinterestAccountStatsMonthly` is unique by `(account_name, calendar_month)`.

## Tests and Commands

- Root test target: `make test`
- Backend tests: `cd backend && uv run pytest -q`
- Lab tests: `cd apps/lab && npm test`
- Lab build: `cd apps/lab && npm run build`
- Fruitful Pin tests: `cd apps/fruitful-pin && npm test`
- Fruitful Pin build: `cd apps/fruitful-pin && npm run build`
- Full frontend CI-ish path: `cd apps/lab && npm run ci`
- Root full target: `make all`

## Working Rules

- Start with code, then this grounding pack, then `docs/PROJECT_MEMORY.md`.
- For architecture, repo-structure, hosting, shared-package, or new-brand work, read `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md`.
- Keep brands as separate apps/deployments; do not mix Fruitful Pin, Bloom Whispers, Bricoli, or other future brand sites into the Fruitful Lab route tree.
- Apps must not import directly from other apps. Move reusable code into `packages/*` before cross-app use.
- Fruitful Lab now lives in `apps/lab/`; preserve Fruitful Lab behavior and Vercel rendering when changing it.
- Preserve role checks in both middleware and server layouts for gated areas.
- Preserve the backend as the source of user truth through `/auth/me`.
- Keep experiment assignment before render; pages may read cookies/query params but should not call GrowthBook directly.
- Keep analytics helper-driven and GTM-oriented.
- Keep public tools deterministic, typed, and step-based.
- Update `docs/PROJECT_MEMORY.md` and the latest dated audit when architecture, auth, analytics, experiment, route, or API contracts change.
