# Fruitful Pin

Fruitful Pin is the Pinterest-specific commercial marketing site. It is separate from the Fruitful Lab sandbox app and should be deployed as its own project.

## Current Foundation

- Next.js App Router app in `apps/fruitful-pin/`.
- Static-first Cloudflare Pages target for phase one.
- WordPress on prepaid A2 remains the planned headless CMS/editor, but this foundation does not connect to live WordPress yet.
- No DNS, A2, WordPress admin, or Cloudflare production settings are changed by this app shell.

## Commands

```bash
npm ci
npm test
npm run build
```

From the repo root:

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
