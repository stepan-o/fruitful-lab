# Agent Instructions - Fruitful Lab

Always read the current project memory before architectural or code work:

1. `docs/REPO_GROUNDING_PACK.md`
2. `docs/PROJECT_MEMORY.md`
3. `docs/SYSTEM_IMPLEMENTATION_AUDIT-2026-05-15.md`
4. `docs/AGENT_OPERATING_PROCEDURES.md`
5. `docs/CANONICAL_DOMAINS.md`

These files are the repo-level memory for structure, layout, key components, auth, experiments, analytics, frontend/backend contracts, domains, and working patterns.
`docs/AGENT_OPERATING_PROCEDURES.md` is the explicit process authority for Susie's end-to-end change delivery workflow.

## Authority Order

1. Current code
2. `docs/PROJECT_MEMORY.md`
3. `docs/REPO_GROUNDING_PACK.md`
4. Latest dated system audit
5. Older audits, archived plans, and prompts

If old docs or prompts disagree with current code, verify the code and update the current memory files.

## Project Shape

- Current Fruitful Lab app: Next.js App Router in `apps/lab/`.
- Canonical Fruitful Lab public domain: `https://fruitfulab.net` (one `l` in the middle: `fruitfulab`, not `fruitfullab`). `https://fruitfulab.net` redirects to `https://www.fruitfulab.net`.
- App structure: brand/app monorepo under `apps/*`, starting with `apps/lab` for the current Fruitful Lab app and `apps/fruitful-pin` for the Fruitful Pin migration.
- Backend: FastAPI + SQLAlchemy/Postgres in `backend/`.
- Shared-code target: extract reusable code into `packages/*` only when there is real cross-app reuse.
- Public tools today: typed logic in `apps/lab/lib/tools/*`, UI in `apps/lab/components/tools/*` until shared packages are intentionally extracted.
- Gated areas: `/admin/*` and `/contractor/*`.
- Auth source of truth: backend `/auth/me`, using the `fruitful_access_token` cookie on the frontend.
- Experiments: configured in `apps/lab/lib/experiments/config.ts`, assigned before render in middleware.
- Analytics: GTM/dataLayer helpers in `apps/lab/lib/gtm.ts`; no direct `gtag()` calls.

## Brand/App Monorepo Direction

- Treat this repo as the long-term home for multiple separate brand apps, including Fruitful Lab, Fruitful Pin, Bloom Whispers, and Bricoli.
- Keep separate brands as separate apps and deployments under `apps/*`; do not mix brand sites into one route tree.
- Fruitful Lab is the sandbox/prototype app. Fruitful Pin is the first commercial marketing-site migration target.
- Hosting can differ by app: Fruitful Lab may remain on Vercel, while Fruitful Pin should target Cloudflare for the public frontend.
- Apps must not import directly from other apps. Promote reusable code into `packages/*` first.
- Read `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` before repo-structure, hosting, shared-package, or new-brand work.
- Read `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md` before executing the monorepo migration PR sequence.
- Read `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md` before Fruitful Pin migration work.

## Working Rules

- Keep server-side/layout/middleware auth gates aligned when changing protected routes.
- Keep tool UI, typed config/spec, compute/scoring, tracking, and tests aligned.
- Keep experiment variants, cookies, middleware assignment, and page resolvers aligned.
- Keep backend models, schemas, migrations, routers, frontend proxies/helpers, and tests aligned.
- Preserve current memory by updating `docs/PROJECT_MEMORY.md` and `docs/REPO_GROUNDING_PACK.md` when contracts change.
- Fruitful Lab Vercel must build from `apps/lab/`.
- Before starting a local dev server from Codex, request network permission for the turn; local binding to `127.0.0.1` can fail with `listen EPERM` without it.
