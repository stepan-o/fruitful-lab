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

Fruitful Lab customer site is the broader marketing service provider and parent brand. It can represent Susy and Stepan's combined work across:

- AI workflow systems,
- funnel strategy and implementation,
- Meta and other paid media support,
- email marketing,
- content strategy and content engines,
- data, analytics, reporting, and A/B testing,
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

Fruitful Lab can share family resemblance with Fruitful Pin, but it should use its own palette and movement. Fruitful Pin can stay more pink/yellow and Pinterest-specific. Fruitful Lab should feel like the broader, systems-minded parent brand.

The current positioning spine lives in `docs/brands/fruitful-lab-site/positioning-spine-2026-05-21.md`. The working core idea is: good products should not be hard to discover. This is positioning territory only, not a locked offer. Current language should favor broader search/discovery over Pinterest-specific positioning for Fruitful Lab.

Current visual pass:

- Use a mostly white and ghost-white base rather than the cream/beige Fruitful Pin direction.
- Current palette: Ghost White `#EDEDF4`, Soft Periwinkle `#9984D4`, Blazing Flame `#FF4A1C`, Mint Leaf `#21D19F`, and Prussian Blue `#101935`.
- Keep a non-pink gradient as an ecosystem cue across the brand family, but make it warmer and more editorial than cold SaaS blue/purple.
- Use Alatsi as the primary heading/accent font and Raleway for readable body copy.
- Favor flowing, guided sections over repeated stacked rectangles: waves, organic shapes, offset content, and open white space should lead the visual system.
- Current reference direction: Commence Studio is the structural skeleton and MVR Digital is the pulse. Fruitful Lab should keep its own palette, typography, and product-discovery positioning.
- Borrowable Commence-style patterns: pill navigation, richer service navigation later, full-width moving trust/positioning rail, serious diagnostic offer framing, featured case-study style modules, metrics/signals, and a clear process section.
- Do not copy Commence's exact language, exact layout, colors, client claims, or Shopify-specific positioning. Do not show fake client logos or fake performance proof.
- The homepage hero should stay product-centered: the product/story sits in the middle, with connected discovery paths around it. Avoid generic pills or disconnected floating cards.
- Current hero test direction: proof-style pills can sit above the headline, CTAs should be pill-shaped with the fit-call action first, and the hero visual should illustrate product discovery/search with product imagery or a phone/search mockup rather than an abstract scheme.
- Section transitions should use smooth curves and open space, not jagged waves.
- Shift the visual tone toward a sharper strategic workbench: stronger dark/white contrast, tighter editorial blocks, offset panels, sharper labels, data/search/reporting motifs, and less soft SaaS styling.
- The 9G StandOut Plan page can be used as a broad inspiration point for bolder contrast, clearer paid-strategy entry flow, and more direct problem language. Do not copy its exact layout, icon style, pink palette, or contractor-specific language.
- Leave visible space for founder presence, future photography, diagrams, and system graphics.
- Blog archive should follow the same discovery pattern as Fruitful Pin: featured article, article list, search, about block, lead magnet/list-building block, popular reads, and resource links.

Current services model:

1. Fit Call
2. Growth Systems Diagnostic as the lead product
3. Implementation Sprint for the first useful build
4. Scale Partnership for larger projects or ongoing systems work
