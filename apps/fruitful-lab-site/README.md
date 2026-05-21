# Fruitful Lab Customer Site

Fruitful Lab customer site is the public umbrella marketing site for `fruitfulab.com`. It is separate from the existing `apps/lab` sandbox app on `fruitfulab.net`.

## Current Foundation

- Next.js App Router app in `apps/fruitful-lab-site/`.
- Static-first Cloudflare Pages target for phase one.
- WordPress on prepaid hosting remains the planned headless CMS/editor model, but this foundation does not connect to live WordPress yet.
- No DNS, WordPress admin, A2, Cloudflare production, or Vercel settings are changed by this app shell.
- The visual direction starts near the Fruitful Pin family but leans more navy and gold for the broader umbrella brand.

## Commands

From `apps/fruitful-lab-site`:

```bash
npm ci
npm run dev:local
npm test
npm run build
```

From the repo root:

```bash
make fruitful-lab-site-dev
make fruitful-lab-site-test
make fruitful-lab-site-build
make fruitful-lab-site-ci
```

Local preview uses `http://127.0.0.1:4174/`.

## Deployment Direction

Initial Cloudflare Pages settings should use:

- Root directory: `apps/fruitful-lab-site`
- Build command: `npm run build`
- Build output directory: `out`

This app is configured with `output: "export"` for static export. If WordPress previews, authenticated draft flows, or dynamic route handlers are needed later, switch to the Cloudflare Workers/OpenNext path in a dedicated PR.

## Content Direction

Initial pages:

- `/`
- `/about`
- `/services`
- `/blog`
- `/blog/[slug]`
- `/resources`
- `/contact`
- `/privacy`
- `/terms`

The current content is a polished skeleton for the broader Fruitful Lab offer: marketing systems, funnels, paid media, AI workflows, email, and content strategy. It can be narrowed once the final offer and copy are ready.
