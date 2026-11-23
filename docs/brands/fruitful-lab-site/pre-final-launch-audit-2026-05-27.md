# Fruitful Lab Customer Site Pre-Final Launch Audit

Date: 2026-05-27
App: `apps/fruitful-lab-site/`
Domain target: `https://fruitfulab.com`
Worktree: `/private/tmp/fruitful-lab-services-design`
Branch: `codex/fruitful-lab-services-design-fix`

## Executive Status

The Fruitful Lab customer site is structurally ready for final launch preparation. The site exports statically, route coverage is complete for the planned V1 scope, SEO basics are in place, and the remaining work is mostly content/assets/account setup rather than page-building.

There are no current engineering blockers for continuing toward Cloudflare Pages preview. The main launch dependencies are final visual assets, final proof/legal decisions, analytics/consent setup, and the future form/email platform decision.

## Validation Completed

Run from `apps/fruitful-lab-site/`:

- `npm run lint` passed.
- `npm test -- --runInBand` passed: 1 suite, 3 tests.
- `npm run build` passed.
- Static export generated 20 app routes and 19 HTML files in `out/`.
- Static export scan found 0 missing internal links/assets across generated HTML.
- Metadata scan confirmed public pages have title, description, Open Graph metadata, and route-specific canonicals.

## SEO Basics Status

Completed in this pass:

- Root metadata has `metadataBase`, title template, default description, index/follow robots, Open Graph metadata, and Twitter summary-large-image metadata.
- A temporary default social image is configured using `/images/service-product-lab-photo.jpg`.
- `/resources/`, `/privacy/`, and `/terms/` now have page descriptions instead of title-only metadata.
- Every public content route now has the correct canonical URL:
  - `/`
  - `/services/`
  - `/how-we-work/`
  - `/resources/`
  - `/blog/`
  - all `/blog/[slug]/` posts
  - `/about/`
  - `/contact/`
  - `/privacy/`
  - `/terms/`
- Blog post pages include article Open Graph metadata, Twitter metadata, canonical paths, BlogPosting JSON-LD, and breadcrumb JSON-LD.
- `sitemap.xml` includes all static pages and all code-managed blog posts.
- `robots.txt` allows crawling and points to the sitemap.

Still recommended before public launch:

- Create a branded 1200x630 Open Graph/social image instead of using the temporary product-workbench photo.
- Add final favicon/app icons.
- Revisit blog titles/descriptions after final copy pass.

## Cloudflare Static Export Readiness

Current app settings are compatible with a simple Cloudflare Pages static deployment:

- Next config uses `output: "export"`.
- Images are configured with `unoptimized: true` for static export.
- `trailingSlash: true` aligns with exported directory routes.
- Build command: `npm run build`.
- Output directory: `out`.
- Suggested Cloudflare Pages root directory: `apps/fruitful-lab-site`.

Environment variables for launch:

- `NEXT_PUBLIC_TIDYCAL_URL`: optional but recommended if the final booking URL differs from the current fallback `https://tidycal.com/susycid`.
- `NEXT_PUBLIC_CLICKUP_FORM_URL`: available but intentionally parked. Only set this if a ClickUp Form becomes the temporary intake path.
- Future MailerLite or newsletter variables: not added yet. Decide when the MailerLite account exists.

Not included yet:

- Analytics/consent integration.
- MailerLite or newsletter form wiring.
- Native Cloudflare Function for form submissions.
- Redirect map from any previous public URLs.

## Route Content Inventory

| Route | Current status | What remains |
| - | - | - |
| `/` | V1 launch-acceptable skeleton. Positioning, service system, process, founder direction, blog cards, and CTA are present. | Replace founder photo placeholders; add real proof/case visuals when available; final copy polish later. |
| `/services/` | V1 launch-acceptable. Clear engagement phases, service models, process/case/proof structure, FAQ, and CTA. | Replace proof/case-study structure with real case proof when available; decide whether pricing stays general or becomes explicit. |
| `/how-we-work/` | V1 launch-acceptable. Process is clear and matches the Fruitful Lab model. | Optional final copy tightening; replace generic product imagery if a stronger process visual is generated. |
| `/resources/` | Intentional coming-soon page. Good enough if resources are not ready. | Real resources, lead magnet, MailerLite capture, and resource graphics later. |
| `/blog/` | V1 launch-acceptable archive design. Categories, grid, and CTA are in place. | Final editorial copy pass; real blog/card graphics if desired. |
| `/blog/[slug]/` | V1 launch-acceptable template. Article layout, sidebar, TOC, related posts, CTA, JSON-LD, and vertical graphic slots exist. | Final blog copy; real vertical graphics; newsletter wiring parked. |
| `/about/` | V1 approved visually. Founder/story/team/value/proof/CTA structure is present. | Founder imagery is the biggest remaining asset need; final proof/testimonials should be reviewed before public launch. |
| `/contact/` | Usable fallback state. TidyCal, email, and local intake-to-email draft flow exist. | Form platform decision parked: ClickUp Form, MailerLite, or Cloudflare Function later. |
| `/privacy/` | Simple placeholder legal page. Metadata now present. | Final legal/business review. |
| `/terms/` | Simple placeholder legal page. Metadata now present. | Final legal/business review. |

## Placeholder And Asset Inventory

Intentional placeholders still present:

- Homepage founder cards show `Photo` placeholders for Susy and Stepan.
- About page founder/photo areas still need generated or real founder imagery.
- About page story imagery currently uses conceptual slots like `Product path map` and `Systems bench`.
- Homepage proof/case-study module is a proof structure, not a real case study.
- Services case-study/proof section describes the intended proof model but does not include a real client case yet.
- Blog post template has vertical graphic placeholders.
- Blog subscribe/newsletter capture is frontend-only and not wired to MailerLite or another email platform.
- Resources page is intentionally coming soon.
- Contact form destination is parked; current local form only opens an email draft.
- Privacy and terms are lightweight placeholders pending review.

Not problematic placeholders:

- `/resources/` saying coming soon is intentional for V1.
- Contact fallback is acceptable while forms are parked because it does not pretend to submit to a CRM.
- Abstract blog/archive graphics are acceptable as a design system until real editorial artwork exists.

## Image And Graphics Needed

Highest priority before public launch:

1. Founder portrait for Susy.
   - Use on About and possibly homepage founder card.
   - Recommended crop: vertical 4:5 and square 1:1.
   - Direction: warm, founder-led, strategic, clean background, natural light, not corporate stock.

2. Founder portrait for Stepan.
   - Match Susy's visual style and crop.
   - Direction: systems/data/workbench feeling, warm and human, not overly technical or cold.

3. Optional two-founder image.
   - Use as an About or homepage humanizing asset.
   - Direction: both founders at a table, reviewing product/story/system notes, collaborative and candid.

4. About story/process imagery.
   - Replace conceptual `Product path map` and `Systems bench` slots.
   - Direction: product samples, notebook/whiteboard, laptop, analytics/reporting, search/content map.

5. Blog vertical graphics.
   - Template currently expects one large vertical graphic and two smaller companion graphics per post style.
   - Recommended dimensions: 1080x1350 or 1080x1920 source files so they crop well.
   - Direction: Fruitful Lab palette, abstract product-discovery systems, search paths, content maps, AI workflow motifs.

6. Open Graph/social share image.
   - Recommended dimensions: 1200x630.
   - Current temporary fallback is `/images/service-product-lab-photo.jpg`.
   - Direction: Fruitful Lab name, gradient cue, product-discovery/system visual, strong readability at small sizes.

7. Favicon and app icons.
   - Needed sizes: favicon `.ico` or PNG set, 180x180 Apple touch icon, 512x512 app icon if desired.
   - Direction: simple `FL` or lab mark using Prussian Blue plus one brand accent.

8. Real proof/case-study graphics.
   - Needed only when proof is approved.
   - Direction: before/after product path, search/content/email/data signal, no fake metrics.

Lower priority:

- Additional product-brand ambience images for Services/How We Work.
- Resource thumbnail system for future guides/templates.
- Blog archive card artwork if the abstract CSS visuals start feeling too generic.

## Content Still Needing Human Review

- Final homepage and services copy polish after assets are selected.
- About page founder bios and kind words/testimonials: confirm names, permission, and exact phrasing before public launch.
- Blog posts: currently code-managed V1 content, not final editorial content.
- Legal pages: privacy and terms should be reviewed for actual collection tools once forms/newsletter/analytics are chosen.
- Contact flow: copy should be revisited after choosing ClickUp, MailerLite, or a native Cloudflare submission path.

## Account / Platform Decisions Parked

- Form destination: parked. Options remain ClickUp Form, MailerLite, or native Cloudflare Function to ClickUp/API later.
- Newsletter destination: parked. MailerLite is likely but not set up yet.
- Analytics: not connected yet.
- Consent banner: not connected yet.
- Cloudflare Pages project: not created/connected in this audit.

## Recommended Next Steps

1. Generate or select founder imagery.
2. Generate a branded Open Graph image and favicon/app icon set.
3. Decide analytics/consent minimum for launch.
4. Decide whether `/contact/` launches with TidyCal/email fallback only, or waits for MailerLite/ClickUp.
5. Do a final copy/legal pass after the asset decisions are in place.
6. Create Cloudflare Pages project and deploy preview from `apps/fruitful-lab-site`.
