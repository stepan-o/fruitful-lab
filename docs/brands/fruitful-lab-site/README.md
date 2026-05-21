# Fruitful Lab Customer Site Documentation

Status: created 2026-05-21.

The Fruitful Lab customer site is the public umbrella marketing site for `https://fruitfulab.com`.

## Domain And App Boundary

- Canonical domain: `https://fruitfulab.com`
- App path: `apps/fruitful-lab-site/`
- `fruitfulab.net` remains the sandbox/tools/experiments app in `apps/lab/`.
- `fruitfulpin.com` remains the Pinterest-specific commercial brand in `apps/fruitful-pin/`.
- `fruitfullab.com` is not owned and must not be used as the canonical domain.

## Role

Fruitful Lab customer site is the broader marketing service provider and parent brand. It can represent Susi and Esteban's combined work across:

- AI workflow systems,
- funnel strategy and implementation,
- Meta and other paid media support,
- email marketing,
- content strategy and content engines,
- full-funnel marketing systems,
- the parent-brand relationship to Fruitful Pin, Bloom Whispers, Bricoli Studio, and future brands.

## Phase-One Technical Direction

Use the same general deployment model as Fruitful Pin:

```txt
Domain
-> Cloudflare hosts the public Next.js site from apps/fruitful-lab-site
-> WordPress remains on prepaid hosting as the phase-one headless CMS/editor
```

The current foundation does not change DNS, WordPress, A2, Cloudflare, or any live production setting.

## Initial Site Scope

- Homepage
- About
- Services
- Blog
- Blog post template
- Resources
- Contact
- Privacy
- Terms

Case studies and tools/experiments are intentionally out of the first skeleton. They can be added later when the offer, proof, and tool promotion strategy are clearer.

## Brand Direction

Fruitful Lab can share family resemblance with Fruitful Pin, but it should lean more navy and gold than pink. Fruitful Pin can stay more pink/yellow and Pinterest-specific. Fruitful Lab should feel like the broader, systems-minded parent brand.

Current visual pass:

- Use a mostly white base rather than the cream/beige Fruitful Pin direction.
- Avoid the green/sage labels from the first skeleton; use navy, cobalt, teal, and gold instead.
- Keep a non-pink gradient as an ecosystem cue across the brand family.
- Use Alatsi for body copy and Raleway for headings.
- Favor flowing, guided sections over repeated stacked rectangles.
- Leave visible space for founder presence, future photography, diagrams, and system graphics.

Current services model:

1. Fit Call
2. Growth Systems Diagnostic as the lead product
3. Implementation Sprint for the first useful build
4. Scale Partnership for larger projects or ongoing systems work
