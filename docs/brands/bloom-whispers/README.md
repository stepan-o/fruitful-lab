# Bloom Whispers Documentation

Status: V1 site design approved 2026-05-28.

Bloom Whispers is a separate brand/site in the brand/app monorepo direction.

App path:

```txt
apps/bloom-whispers/
```

Canonical domain:

```txt
https://bloomwhispers.com
```

## Current Direction

Bloom Whispers starts as a gentle editorial and ritual brand: seasonal letters, soft botanical notes, and small reflective practices for quieter creative living.

Current homepage prototype direction: Midnight Botanical Editorial. The prototype explores a magical, premium night-garden flower world built around flower meanings, folklore, journal content, email-list growth, a V1 flower-message quiz flow, and a soft coming-soon shop/waitlist layer.

The `/flower-message-quiz` route renders the V1 visual quiz experience using the structured quiz data in `docs/brands/bloom-whispers/quiz-implementation-data-2026-05-23.ts`. Email capture remains placeholder-only until the real list integration is selected.

## Approved V1 Checkpoint

Approved across 2026-05-26 through 2026-05-28:

- Homepage V1 visual direction: approved as the current Midnight Botanical Editorial baseline.
- Homepage V1 section order: Hero, What You'll Find Here, Quiz CTA, Bloom Journal, Bloom Letter, Podcast, Shop Soon, Footer.
- Flower-message quiz V1: approved as the current interactive quiz and result-card baseline.
- Result-card routing: podcast CTA scrolls to the homepage podcast section; flower healing link points to the live Bloom Whispers post; guide and shop CTAs scroll to homepage anchors.
- Journal archive V1, hibiscus journal post template V1, About, Contact, Podcast, Shop, Flower Meaning Guide, Privacy, and Terms are approved as V1 pages.
- Header primary CTA points to the flower-message quiz. Flower Meaning Guide is the first navigation item and has a dedicated capture page.
- Email capture and shop/waitlist behavior remain placeholder smoke-test surfaces for V1.

Known V2 candidates:

- Refine quiz copy and scoring after more review paths.
- Refine mobile result-card and shop-section details if live QA shows friction.
- Wire real email/list capture once the email platform is chosen.
- Add analytics/click tracking for quiz starts, guide signups, Bloom Letter signups, shop interest clicks, podcast clicks, and contact submissions.
- Migrate existing bloomwhispers.com journal content into the new app.

First-pass routes:

- `/`
- `/flower-meaning-guide`
- `/flower-message-quiz`
- `/journal`
- `/journal/hibiscus-flower-meaning`
- `/podcast`
- `/shop`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

The app is static-first for Cloudflare-style hosting compatibility. It should not import directly from other apps. Shared code should be promoted into `packages/*` first only after real reuse exists.

## Local Preview

From `apps/bloom-whispers/`, use:

```bash
npm run dev:local
```

The script binds to `127.0.0.1:4185` and enables polling/webpack mode because the default Next dev watcher can hit `EMFILE: too many open files` in Codex local preview sessions.
