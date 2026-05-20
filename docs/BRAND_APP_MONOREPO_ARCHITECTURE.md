# Brand App Monorepo Architecture

Status: target architecture adopted 2026-05-20; updated after the Fruitful Lab app move to apps/lab.

This document describes the intended long-term repo shape for Fruitful Lab, Fruitful Pin, and future separate brands such as Bloom Whispers and Bricoli. Fruitful Lab now lives in `apps/lab/`.

## Strategic Model

This repository should become a brand/app monorepo.

Fruitful Lab is the sandbox and builder brand. It can host prototypes, internal tools, experiments, one-off marketing efforts, and early versions of assessments or calculators. Fruitful Lab is currently hosted on Vercel and may remain on a free/sandbox-oriented hosting setup where allowed.

Fruitful Pin / Fruitful Bean is a separate Pinterest-specific service brand. It is the first commercial marketing site migration target. It should be hosted separately from Fruitful Lab and should use a commercial-friendly hosting setup. The phase-one plan is Cloudflare for the public Next.js frontend, with WordPress on prepaid A2 hosting as the headless CMS/editor.

Future brands or projects such as Bloom Whispers and Bricoli may also live in this repo as separate apps with separate domains, hosting targets, content sources, analytics, and brand systems.

The repo should support this workflow:

```txt
Prototype a tool or marketing idea in Fruitful Lab
-> test it lightly or use it as a sandbox artifact
-> extract reusable logic/UI into packages only when there is real reuse
-> promote the polished version into a commercial brand site such as Fruitful Pin
```

## Target Directory Shape

Long-term target:

```txt
fruitful-lab/
  apps/
    lab/                # Fruitful Lab sandbox/prototype platform
    fruitful-pin/       # Pinterest-specific service brand site
    bloom-whispers/     # future separate brand/site example
    bricoli/            # future separate brand/site example

  packages/
    tools/              # shared calculators, assessments, scoring/domain logic
    tool-ui/            # reusable tool UI components only when truly shared
    analytics/          # shared analytics/event helpers
    cms/                # shared CMS interfaces/adapters
    wordpress/          # WordPress API helpers if multiple brands use WordPress
    seo/                # metadata/schema/sitemap helpers
    ui/                 # only truly shared design primitives
    config/             # shared TypeScript/Jest/ESLint/Tailwind config if useful

  backend/              # shared FastAPI backend where needed; not required by every brand
  docs/
    brands/
      fruitful-pin/
      bloom-whispers/
      bricoli/
    architecture/
  prompts/
```

Do not create every package up front. Extract packages when a second app creates a real need for reuse.

## Current Structure

Current implementation:

```txt
apps/lab/   # current Fruitful Lab Next.js app
backend/    # FastAPI backend
docs/
prompts/
```

The structure PR moved/renamed the current Fruitful Lab app and updated references, commands, docs, and workflows. Fruitful Lab rendering and behavior should remain unchanged.

## App Boundaries

Each app under `apps/*` is an independently deployable website or web app.

Each app owns:

- its routes and layouts,
- its brand-specific UI,
- its domain and hosting configuration,
- its CMS/content source configuration,
- its environment variables,
- its analytics container or measurement IDs,
- its SEO metadata and sitemap behavior,
- its deployment target.

Apps should not import directly from another app. Shared code should move into `packages/*` first.

## Shared Packages

Shared packages are for proven reuse, not speculative abstraction.

Good candidates:

- deterministic tool/scoring logic,
- shared analytics event helpers,
- SEO/schema/sitemap utilities,
- CMS adapter interfaces,
- WordPress API helper functions,
- reusable assessment UI only when it will be used across more than one app.

Avoid sharing:

- brand-specific page sections,
- brand voice/copy,
- one-off landing page layouts,
- design primitives that only one app uses,
- app-specific auth gates or route assumptions.

## Hosting Model

Fruitful Lab:

- Existing app, currently hosted on Vercel.
- Treat as sandbox/prototype space.
- Vercel must build from `apps/lab`.

Fruitful Pin:

- Commercial Pinterest-specific marketing site.
- Preferred public frontend host: Cloudflare Pages/Workers.
- Phase-one CMS/editor: WordPress on prepaid A2 hosting until the later CMS-off-ramp decision.
- Domain: `fruitfulpin.com`, currently registered at GoDaddy.

Future brand apps:

```txt
GoDaddy or another registrar
-> Cloudflare account / Pages project
-> apps/<brand>
-> brand-specific CMS/content source
```

Multiple brand sites can use the same hosting provider/account, but they should remain separate deployed projects with separate domains and environment settings.

## Fruitful Pin Phase-One Architecture

The current phase-one target is:

```txt
GoDaddy domain
-> Cloudflare hosts the public Next.js site from apps/fruitful-pin
-> WordPress remains on prepaid A2 as a headless CMS/editor
```

This means:

- A2 remains only because it is prepaid and hosts WordPress for editing.
- WordPress/Kadence no longer controls the public frontend.
- Susy keeps the familiar WordPress editing workflow during the first migration.
- CMS replacement is deferred until closer to the A2 renewal window.

See `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md`.

## Example: Adding Bloom Whispers Later

A future Bloom Whispers app would be added as its own app:

```txt
apps/bloom-whispers/
  app/
  components/
  lib/
  public/
  package.json
  next.config.ts
```

It could reuse shared packages:

```txt
apps/bloom-whispers/lib/content.ts
-> packages/cms or packages/wordpress

apps/bloom-whispers/app/sitemap.ts
-> packages/seo

apps/bloom-whispers/components/some-tool.tsx
-> packages/tools and optionally packages/tool-ui
```

It should not import from `apps/lab` or `apps/fruitful-pin`.

## Completed First Migration Step

The first migration PR was a structure-only move:

1. Moved `frontend/` to `apps/lab/`.
2. Updated root commands, workflows, docs, and path references.
3. Kept Fruitful Lab routes, behavior, tests, and rendering unchanged.
4. Update Vercel project settings so the Fruitful Lab project builds from `apps/lab`.
5. Validate the Lab app locally and through the Vercel deployment.

Only after that structure PR is stable should the repo introduce `apps/fruitful-pin`.

