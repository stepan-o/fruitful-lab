Sanctuary arcade-first revision (2026-10-03, local): the 22-chapter reader now
starts at `insert-coin` (Gauntlet), continues to `several-histories` (the purchased
copy and later offers), then `the-fork` (creative economics and BG3/D4) and Concord.
All previous stable URLs remain. The new SVG cabinet compares player/operator
perspectives without continuous work; `Figure.afterParagraph` positions existing
immutable evidence images inline. The overview, metadata, counts and navigation
follow the new order. Cinema/catalog artwork and the later diptych are preserved.
This supersedes the opening order recorded below; later chapters remain iterative.
See `docs/sanctuary/NARRATIVE_REBUILD.md` for research boundaries and scope.

Stepanoskin landing design brief (2026-10-03, revised after visual feedback): `docs/stepanoskin/DESIGN_GUIDELINES.md` is the landing-specific authority. Almost empty white, centered solid block typography with level baselines and coherent extruded depth. Stepan Oskin sits at the top with slight emphasis. DATA SCIENCE is the dark primary choice, with professional CV floating beneath/behind it; GAME MONETIZATION, GAME ENGINES AND LLMs, and ABOUT are equal gray peers. Refined faces, small shadows, idle float, hover lift and the shared selection clang; performance is paramount. This supersedes the pastel/card and strongly rotated pixel-grid drafts.

Sanctuary context visuals (2026-10-03, local): the opening now uses the economics of creative work and audience attachment as its lens, with a cinema/Netflix comparison and the 2013 Adobe transition. `sanctuary-context` is a separate immutable asset pack; `lib/sanctuary/context-media.json` feeds its source records into the public credits page. The original SVG master and responsive logo derivatives are stored with the project; bounded CSS atmosphere pauses offscreen and with motion preferences; no new dependencies. See `docs/sanctuary/NARRATIVE_REBUILD.md`.

Shared visual/UI requirement: [Design and performance standards](DESIGN_AND_PERFORMANCE_STANDARDS.md), inherited by every Fruitful Lab project.
Sanctuary now serves 24 selected publisher images through the public `sanctuary-editorial` pack, with original plates/diagrams, chapter-scoped metadata and on-demand image inspection. Its public rights/source register is `/stepanoskin/game-monetization/credits`. `apps/lab/lib/sanctuary/editorial-media.json` records per-image publication decisions; `rights-sources.ts` holds fixed dated excerpts. The private archive is optional for builds and is no longer required to view the manuscript's screenshots.

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
- `apps/` - home for separate deployable brand apps. Current apps include `apps/lab`, `apps/fruitful-pin`, and `apps/fruitful-lab-site`; future examples include `apps/bloom-whispers` and `apps/bricoli`.
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
- Versioned media: `apps/lab/assets/README.md`, `scripts/assets.mjs`, `lib/assets/*`, and `components/media/AssetImage.tsx`; content-hashed files/manifests and short-cached per-pack pointers. `npm run build` validates retained releases; `npm run ci` also runs asset-pipeline tests.
- Public site layout: `apps/lab/app/(site)/layout.tsx`
- Public tools index: `apps/lab/app/(site)/tools/page.tsx`
- Flow layout: `apps/lab/app/(flow)/layout.tsx`
- Sanctuary Economics: public `/stepanoskin/game-monetization` with `?chapter=<stable-id>` navigation; `apps/lab/lib/sanctuary/` owns 21 English chapters and six-language reader UI, `components/sanctuary/` owns the responsive reader. The public edition combines the original devil, a scene and diagram in every chapter, and selected publisher images in the `sanctuary-editorial` pack. A private source archive remains optional and gated to local research. Shared clang, motion preferences and bounded canvas effects restore atmosphere; subdued fire appears only at the document end, while shadows and embers remain ambient. Editorial/provenance notes: `docs/sanctuary/README.md`. The 21 distinct plates and bespoke exhibits follow `docs/sanctuary/VISUAL_DIRECTION.md`; original plates have on-demand inspection, and models reset per chapter.
- Sanctuary opening reconstruction (2026-10-03, local): `the-fork` is now “The business of keeping a world alive,” moving from the wider economic context through games and BG3/D4 into history. Reading order begins opening → history → Concord. The animated diptych is preserved in Where progress lives; the opening uses the publisher image pair and an original player/production/payment exhibit. `docs/sanctuary/NARRATIVE_REBUILD.md` records the accepted full direction and the pending history/Diablo passes. All 21 stable IDs remain; only the opening is rebuilt so far.
- Sanctuary editorial media (2026-10-03): `docs/sanctuary/EDITORIAL_MEDIA_RIGHTS.md` records the researched publication considerations, without granting legal clearance. The public opening pairs official BG3 key art with a supplied D4 reference. The public editorial pack has 24 images/76 variants and a dated source register.
- Sanctuary design authority: `docs/sanctuary/DESIGN_SYSTEM.md` records the accepted local visual/editorial system and code mappings; `docs/sanctuary/design-system/index.html` is its offline visual reference. The approved opening is the latest illustration quality benchmark, with later chapter adoption still in progress. Update these references when accepted design rules change.
- Stepanoskin foundation: `apps/lab/app/(stepanoskin)/layout.tsx`; inherits the root layout and serves public routes without login. `/stepanoskin` is the six-language project directory for Data Science & Production Systems, Sanctuary Economics, Loopforge, and the `/stepanoskin/about` placeholder. The factory entrance now lives at `/stepanoskin/loopforge` and links only to its overview, architecture and play routes. Both entrances and About share `stepanoskin_locale_v1`; factory assets/effects stay scoped to Loopforge (updated 2026-10-03).
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


## Loopforge learning prototype — 2026-10-03

The Stepanoskin group now includes two English Loopforge readers (8 overview and
16 architecture chapters) and an eight-shift director console at
`/stepanoskin/loopforge`. Routes/components/logic are scoped to `apps/lab`; owned
art uses the versioned `loopforge` asset pack. See `docs/loopforge/README.md`,
`DELIVERY_CHECKLIST.md`, `ARCHITECTURE_DECISIONS.md`, `BDI_AND_PROTOCOL_REVIEW.md`
and `OPERATIONS_AND_EVALS.md` in that directory.

`POST /api/loopforge/run` validates a bounded seed/command history and reconstructs
server state with `lf-teaching-1`; the public demo allows forks and has no account,
scarce currency or shared-world claim. The pure TS kernel has explicit integer
rules and seeded replay. A small deterministic BDI advisor recommends one-shift
doctrine; persistent autonomous BDI and LLM intention admission remain future work.

`GET/POST /api/loopforge/narrative` is a separate slow lane. It derives evidence
from the kernel, validates structured OpenAI output, and cannot mutate mechanics.
The paid path requires server credentials, a private gate and a durable Redis
reservation budget. It fails closed without configuration. Narration artifacts
retain source hash, model/prompt, usage and latency. Twelve real responses across
two prompt versions and cached retrieval are verified within the owner-approved
$1 allocation. `docs/loopforge/LIVE_EVALUATION.md` records costs, latency and
remaining semantic defects; envelope acceptance is not a human quality score.

Original Stepanoskin landing now links to both decks, the console, Sanctuary
and the Production Systems profile, preserving its translated menu labels.
The broader front-page redesign is deferred. Current Sanctuary work and the
reference Loopforge repository remain separate.

## Production systems profile · 2026-10-03

Public `/stepanoskin/production-systems` is a professional profile and methodology
presentation for Stepan Oskin, linked from the six-language `/stepanoskin` menu.
The profile is in English and sets its own language scope. It presents abstract
current-role context at Prodigy Education, publicly verifiable work, an original
production-loop diagram, four illustrative applications, primary-source notes,
and LinkedIn/print actions. It discloses no internal project details or results.
Static server content and scoped CSS contain most of the page; small client
components handle domain selection and printing. Profile actions reuse `cta_click`.
No auth, API, experiment assignment, dependencies, or other apps change.
See `docs/brands/lab/production-systems-profile.md` for the brief, sources and checks.


### Production profile procedural scenes · 2026-10-03

`/stepanoskin/production-systems` now has eight server-rendered SVG studies based
on Mechanical Turk engravings. `ProfileMotion` owns one visibility observer and
CSS-motion lifecycle, with the independent persistent preference
`production_systems_motion_v1`; reduced motion and hidden/offscreen states stop
movement. No JavaScript retains complete still illustrations. Fine figure paths
are generated offline from the credited public-domain Racknitz plate; no runtime
raster references, fonts, dependencies or per-frame React updates are added.
Professional facts, APIs, analytics and experiment contracts are unchanged.
See `docs/brands/lab/production-systems-design/DESIGN_GUIDELINES.md` for provenance
and `docs/brands/lab/production-systems-evidence/engraving-verification.md` for checks.

Sanctuary opening art (local draft, 3 October): cinema and catalog geometry lives
under `components/sanctuary/plates/`; shared reference credits are in
`lib/sanctuary/cover-references.ts`. `useLivingPlate` gates CSS motion and native
cover dialogs provide enlargement. See `docs/sanctuary/CINEMA_CATALOG_ART_PASSES.md`.

## Loopforge entrance conveyor · 2026-10-03

The `/stepanoskin/loopforge` entrance uses `FactoryConveyor`, a bounded Canvas2D
scene with cached machinery and twelve seeded cargo sprites. Decorative drive
state is isolated in `factory-drive.ts`: uneven pulls, a jam after 19 seconds of
active viewing, manual lever restart, then 33–55 seconds between later jams.
An amber beacon beneath the belt becomes red on a jam. Pointer drag, click and
keyboard activation share the reset action; the shared sound preference gates
the user-triggered clang. Motion obeys the shared manual preference, OS reduced
motion, intersection and document visibility; a static SVG remains if canvas
is unavailable. No model requests or new runtime media/dependencies. Compact
reader/play conveyors remain separate. Overview chapter `the-factory` has no
Working Exhibit; `Chapter.exhibit` is optional and other chapters retain theirs.
References, visual checks and rendering limits: `docs/loopforge/CONVEYOR_REFINEMENT.md`.
