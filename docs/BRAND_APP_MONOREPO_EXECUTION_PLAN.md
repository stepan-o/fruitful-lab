# Brand App Monorepo Execution Plan

Status: active execution plan created 2026-05-20.

This plan governs the current migration sequence from the existing single Fruitful Lab frontend layout toward a brand/app monorepo with separate deployed apps. It is organized around self-review gates and PR merge gates because Codex can create branches, commits, pushes, and PRs, but Susy/Stepan must review and merge PRs and approve external hosting/DNS changes.

## Source References

Read these before doing migration work:

1. `AGENTS.md`
2. `docs/REPO_GROUNDING_PACK.md`
3. `docs/PROJECT_MEMORY.md`
4. `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md`
5. `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md`
6. `docs/AGENT_OPERATING_PROCEDURES.md`

## Execution Principles

- Keep Fruitful Lab, Fruitful Pin, Bloom Whispers, Bricoli, and future brands as separate apps under `apps/*`.
- Keep hosting separate per app.
- Do not import directly across apps; promote reusable code into `packages/*` only after real cross-app reuse exists.
- Keep Fruitful Lab rendering unchanged during the structure migration.
- Do not touch GoDaddy, A2, WordPress admin, Cloudflare production projects, Vercel project settings, or DNS without explicit external approval and credentials.
- Create PRs as draft PRs unless Susy explicitly asks for ready-for-review.
- Prefer meaningful PR checkpoints over tiny granular PRs, because every merge can trigger a Fruitful Lab Vercel rebuild. Bundle small docs/config updates into the next substantial PR when safe.
- Pause after PR creation until Susy/Stepan review and merge.
- Preserve unrelated user edits. Stage explicit files only.

## PR 1: Documentation And Architecture Baseline

Goal:

- Persist the brand/app monorepo architecture and the Fruitful Pin phase-one migration direction before moving code.

Scope:

- `AGENTS.md`
- `README.md`
- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md`
- `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md`
- `docs/AGENT_OPERATING_PROCEDURES.md`
- `docs/PROJECT_MEMORY.md`
- `docs/REPO_GROUNDING_PACK.md`
- `docs/SYSTEM_IMPLEMENTATION_AUDIT-2026-05-15.md`
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md`
- `docs/brands/**`

Self-review gate:

- Confirm terminology is consistent:
  - Fruitful Lab is the sandbox/prototype app.
  - Fruitful Pin / Fruitful Bean is the first commercial migration target.
  - Bloom Whispers and Bricoli are future separate brand examples.
  - Bricoli is spelled correctly.
- Confirm the documented phase-one Fruitful Pin architecture is:

```txt
GoDaddy domain
-> Cloudflare hosts the public Next.js site from apps/fruitful-pin
-> WordPress remains on prepaid A2 as a headless CMS/editor
```

- Confirm Kadence is excluded from future cost comparisons.
- Confirm A2 is described as prepaid until 2027 and retained only as the phase-one WordPress CMS host.
- Confirm the first structure migration step is `frontend/` to `apps/lab/`.
- Confirm docs distinguish current paths from target paths.
- Confirm no unrelated frontend implementation files are staged.

Validation:

- Documentation diff review.
- No app tests required because this PR should not change runtime code.

PR handoff:

- Open a draft PR.
- Ask Susy/Stepan to review and merge.
- Pause until PR is merged.

Susy/Stepan review tasks:

- Confirm the architecture matches the intended brand strategy.
- Confirm Fruitful Pin phase-one CMS choice remains WordPress on prepaid A2.
- Confirm Cloudflare remains the preferred Fruitful Pin public frontend host.
- Merge PR 1 when approved.

## PR 2: Structure-Only Move From `frontend/` To `apps/lab/`

Goal:

- Move the current Fruitful Lab Next.js app into the target monorepo app location without changing behavior.

Scope:

- Move `frontend/` to `apps/lab/`.
- Update root `Makefile` commands.
- Update GitHub workflows that currently use `frontend/`.
- Update docs and path references that must change with the move.
- Keep backend unchanged.
- Do not introduce `apps/fruitful-pin` yet unless explicitly approved.

Self-review gate:

- Confirm the diff is primarily a path move plus path-reference updates.
- Confirm no Fruitful Lab route, UI, auth, analytics, experiment, or backend behavior was intentionally changed.
- Confirm no generated build artifacts are staged.
- Confirm existing unrelated work is not staged.
- Confirm docs clearly say the current Fruitful Lab app now lives in `apps/lab/`.

Local validation:

- From `apps/lab/`:
  - install dependencies if needed,
  - run tests,
  - run `API_BASE_URL=http://localhost:8000 npm run ci`,
  - run production build.
- From repo root:
  - run relevant `make` targets after updating them.
- If a local dev server is needed for visual sanity:
  - start the app from `apps/lab/`,
  - open it in the browser,
  - verify the homepage and key tool routes render.

Remote/Vercel validation:

- After pushing the PR branch, inspect the Vercel preview if available.
- If Vercel fails because the project still points at `frontend/`, document that the Vercel project root must be changed to `apps/lab`.
- Use available Vercel integration, browser, or HTTP checks where credentials/access allow.

PR handoff:

- Open a draft PR.
- Clearly call out required external action:
  - update Fruitful Lab Vercel project root directory from `frontend` to `apps/lab`.
- Pause until Susy/Stepan review and merge.

Susy/Stepan review tasks:

- Review the structure-only PR.
- Update Vercel project settings so Fruitful Lab builds from `apps/lab`.
- Confirm the Vercel preview/new build lands successfully.
- Confirm the current Fruitful Lab production site still renders after merge/deploy.
- Merge PR 2 when approved.

## PR 3: Fruitful Pin App Foundation

Status: foundation implementation checkpoint.

Goal:

- Introduce the separate Fruitful Pin app shell under `apps/fruitful-pin` without launching or touching DNS.

Scope:

- Create `apps/fruitful-pin/` as a separate Next.js app.
- Configure it as a static-first Cloudflare Pages target where practical.
- Add initial app shell, routing skeleton, brand placeholder structure, and content adapter boundaries.
- Add minimal WordPress headless CMS adapter scaffolding without requiring credentials or touching the live WordPress site.
- Do not change `fruitfulpin.com` DNS.
- Do not modify WordPress/A2 production content.

Self-review gate:

- Confirm Fruitful Pin is not added inside `apps/lab`.
- Confirm no cross-app imports exist.
- Confirm shared package extraction is avoided unless necessary.
- Confirm Cloudflare is the preferred public frontend target.
- Confirm WordPress on A2 remains the phase-one CMS/editor.

Validation:

- Build/test the new app locally.
- Verify the app runs on a preview/local URL.
- Verify Fruitful Lab still builds if shared repo config changed.

PR handoff:

- Open a draft PR.
- Pause until review and merge.

Susy/Stepan review tasks:

- Confirm app foundation and hosting direction.
- Confirm no production Fruitful Pin changes occurred.
- Merge PR 3 when approved.

## PR 4: Fruitful Pin Inventory And WordPress Content Contract

Goal:

- Convert the existing Fruitful Pin website and WordPress content into a migration-ready map.

Scope:

- Crawl/publicly inventory `fruitfulpin.com`.
- Identify pages, posts, slugs, metadata, images, forms, booking links, CTAs, analytics, and SEO risks.
- Define the WordPress-to-Next.js content contract.
- Decide whether phase one uses existing WordPress fields/blocks or minimal custom fields.
- Produce redirect and URL preservation recommendations.

Self-review gate:

- Confirm no live site edits were made.
- Confirm no DNS, A2, GoDaddy, WordPress admin, or Cloudflare production changes were made.
- Confirm the content contract is realistic for Susy's WordPress editing workflow.

Validation:

- Public crawl checks.
- Manual spot-check of important pages.
- Optional browser/screenshot inspection for top pages.

PR handoff:

- Open a draft PR with inventory docs and content contract.
- Pause until review and merge.

Susy/Stepan review tasks:

- Confirm migration inventory.
- Confirm keep/rewrite/remove/redirect decisions.
- Confirm WordPress editing model is acceptable.

## Later PRs

Likely follow-up PRs:

- Build Fruitful Pin homepage/service/blog templates.
- Implement WordPress API integration and preview/publishing workflow.
- Migrate content into the headless WordPress structure.
- Add analytics/SEO/sitemap/redirect handling.
- Add assessment CTA path or embedded assessment integration.
- Add Cloudflare preview deployment configuration.
- Launch prep PR.

Each later PR should include:

- scoped implementation,
- explicit validation,
- self-review summary,
- no production DNS or hosting changes unless separately approved.

## External Launch Gate

DNS and production launch are outside normal PR authority.

Before launch:

- New Fruitful Pin site must be approved on a preview URL.
- Redirects must be reviewed.
- Analytics, forms, booking links, sitemap, and Search Console must be prepared.
- A rollback plan must exist.

Launch tasks requiring explicit approval:

- Cloudflare project/domain setup.
- GoDaddy DNS or Cloudflare DNS changes.
- WordPress/A2 CMS URL or access changes.
- Production `fruitfulpin.com` switch.

Post-launch validation:

- Codex/Stepan verifies SSL, homepage, important URLs, redirects, sitemap, analytics, form/booking path, and assessment CTAs using browser/HTTP checks.
- Susy verifies the public site visually, confirms forms/booking work from a user perspective, and confirms WordPress editing still feels usable.

