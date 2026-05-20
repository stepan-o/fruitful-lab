# Canonical Domains

Status: active as of 2026-05-20.

This file records canonical public domains and spelling-sensitive URL decisions for the Fruitful Lab monorepo. Read it before domain, deployment, CORS, external-link, or brand-routing work.

## Fruitful Lab

- Canonical public domain: `https://fruitfulab.net`
- Canonical `www` URL: `https://www.fruitfulab.net`
- Spelling rule: `fruitfulab` has one `l` in the middle. Do not use `fruitfullab` for the Lab domain.
- Runtime check on 2026-05-20: `https://fruitfulab.net` returns a Vercel 308 redirect to `https://www.fruitfulab.net`, and `https://www.fruitfulab.net` returns 200 with the Fruitful Lab page.
- Use this domain spelling in docs, deployment checks, CORS/domain work, external links, and future agent instructions unless Susie explicitly changes the domain.

## Fruitful Pin

- Canonical public domain: `https://fruitfulpin.com`
- Fruitful Pin is a separate commercial Pinterest-specific brand app from Fruitful Lab.
