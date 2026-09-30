# Project Memory - Fruitful Lab

Route-group update, 2026-09-30: `apps/lab/app/(stepanoskin)/` is a top-level
Lab sandbox group with a pass-through layout. It inherits the root layout and
serves the public `/stepanoskin` landing page without login. Its page lives at
`(stepanoskin)/stepanoskin/page.tsx`.

The Stepanoskin landing page uses Loopforge art assets and a data-driven game
menu prepared for three to five destinations. Game Monetization is the first
public choice. Native dictionaries cover English (default), French, Spanish,
Russian, Mandarin Chinese, and Thai; the visitor's explicit locale is stored
in the versioned `stepanoskin_locale_v1` browser cookie and shared with the
destination placeholder.

Status: current working memory as of 2026-05-21 after adding the Fruitful Lab customer site foundation.

Use this file as the durable architectural memory for future Codex/LLM work on this repo. It records the structure, layers, contracts, and working patterns that should be assumed going forward unless code proves otherwise.

## What This Project Is

Fruitful Lab is becoming a brand/app monorepo for multiple separately deployed web properties and shared tool infrastructure. The current implementation is still a Next.js + FastAPI platform that hosts Fruitful Pin/Fruitful Lab public tools, gated admin workflows, contractor placeholders, analytics plumbing, and Pinterest account stats ingestion.

Related planning note:

- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` is the current target architecture reference. It defines the shift from a single-app layout toward separate apps under `apps/*`, beginning with `apps/lab` for Fruitful Lab and later `apps/fruitful-pin` for the Fruitful Pin migration. Future brand apps may include Bloom Whispers and Bricoli.
- `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md` is the active PR-gated execution plan for the monorepo migration. It defines PR 1 as docs/architecture baseline, PR 2 as the completed structure-only `frontend/` to `apps/lab/` move, PR 3 as Fruitful Pin app foundation, and later PRs for inventory, content contracts, templates, CMS integration, and launch prep.
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
- first-pass public routes for `/`, `/pinterest-services`, `/resources`, `/pinterest-fit-check`, `/blog`, root-level blog posts, `/case-studies`, `/about`, `/contact`, `/privacy`, `/privacy-policy`, `/terms`, and legacy `/services`,
- brand/site constants in `apps/fruitful-pin/lib/site.ts`,
- content boundary in `apps/fruitful-pin/lib/content.ts`,
- WordPress connection placeholder in `apps/fruitful-pin/lib/wordpress.ts`,
- local tests in `apps/fruitful-pin/__tests__/`.

First-pass checkpoint memory:

- Fruitful Pin should feel airy, breezy, editorial, warm, and Pinterest-specific rather than corporate, generic, or boxy.
- Primary CTAs use solid `#950952` pink. Gradients are for text highlights and occasional intentional accents, not CTA buttons.
- Top navigation should stay intentionally lean: Home, Blog, Services, Resources, and About. Case Studies, Contact, Privacy, and Terms can live in the footer and contextual page CTAs.
- Resources is a soft-conversion hub. It features the native Pinterest Fit Check and keeps guide/resource/blog paths underneath.
- Pinterest Fit Check is the Fruitful Pin-native diagnostic tool at `/pinterest-fit-check`; it lives inside `apps/fruitful-pin` rather than importing from `apps/lab`.
- Blog templates should support a sidebar, featured images, table of contents, key takeaways, pin graphic slots, pull quotes, comparison tables, FAQs, and reader navigation.
- Contact is the fit-call page: embedded TidyCal first, then the general inquiry form/email option. Do not wire new email automation, CRM, or form backend integrations without explicit approval.
- Case studies/proof is currently a first-pass holding structure until Susy is ready to build real visual case studies and proof packets.

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
- Phase-one CMS direction is WordPress as headless CMS/editor on the existing prepaid hosting model, following the Fruitful Pin approach.
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
- Backend contractor dependency exists as `get_current_