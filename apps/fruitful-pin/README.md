# Fruitful Pin

Fruitful Pin is the Pinterest-specific commercial marketing site. It is separate from the Fruitful Lab sandbox app and should be deployed as its own project.

## Current Foundation

- Next.js App Router app in `apps/fruitful-pin/`.
- Static-first Cloudflare Pages target for phase one.
- WordPress on prepaid A2 remains the planned headless CMS/editor, but this foundation does not connect to live WordPress yet.
- No DNS, A2, WordPress admin, or Cloudflare production settings are changed by this app shell.

## Commands

Local builds use `next build --webpack` because Codex sandbox testing on 2026-05-20 showed Turbopack can require local network binding and fail with `Operation not permitted` unless network permission is granted.


From `apps/fruitful-pin`:

```bash
npm ci
npm run dev:local
npm test
npm run build
```

From the repo root, the easiest local preview command is:

```bash
make fruitful-pin-dev
```

Root validation commands:

```bash
make fruitful-pin-test
make fruitful-pin-build
make fruitful-pin-ci
```

## Deployment Direction

Initial Cloudflare Pages settings should use:

- Root directory: `apps/fruitful-pin`
- Build command: `npm run build`
- Build output directory: `out`

This app is configured with `output: "export"` for static export. If the WordPress integration later needs SSR, draft previews, or dynamic route handlers, switch to the Cloudflare Workers/OpenNext path in a dedicated PR.

## Local Preview Status

Local preview was confirmed from a fresh Codex thread after network permission was granted: `http://127.0.0.1:4173/` returned 200 and rendered the Fruitful Pin homepage.
