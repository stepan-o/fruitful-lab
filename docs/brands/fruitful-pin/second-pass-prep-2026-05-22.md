# Fruitful Pin Second-Pass Prep

Status: active prep note for the second-pass buildout branch started on 2026-05-22.

This file records the current checkpoint after the first-pass Fruitful Pin site was merged and before the next deeper buildout. It should be read with:

- `docs/brands/fruitful-pin/README.md`
- `docs/brands/fruitful-pin/current-site-inventory-2026-05-20.md`
- `docs/brands/fruitful-pin/content-contract-2026-05-20.md`
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md`

## Branch Purpose

This branch is for Fruitful Pin second-pass preparation and guardrails. It should not include unrelated Fruitful Lab customer-site work, Bloom Whispers work, or Bricoli work.

Allowed scope:

- Fruitful Pin docs and project memory.
- Fruitful Pin site contract fixes that match Susy's accepted first-pass decisions.
- Non-visual tests that protect route, SEO, navigation, content, and launch-readiness assumptions.
- Prep notes for assets, integrations, migration, and final review gates.

Not allowed without explicit approval:

- DNS changes for `fruitfulpin.com`.
- Cloudflare production deployment changes.
- WordPress/A2 configuration changes.
- Live contact form, CRM, MailerLite, or email automation wiring.
- Final SEO strategy, final sales copy, final proof claims, or final case-study claims.

## Current App Snapshot

Current app path: `apps/fruitful-pin/`

Current public routes:

- `/`
- `/pinterest-services`
- `/services` as a compatibility route for the services page
- `/resources`
- `/pinterest-fit-check`
- `/blog`
- root-level blog posts:
  - `/pinterest-marketing-for-gardening-brands`
  - `/pinterest-organic-vs-ads`
  - `/pinterest-in-2026-for-product-brands`
- `/case-studies`
- `/about`
- `/contact`
- `/privacy`
- `/privacy-policy`
- `/terms`

Current main navigation contract:

- Home
- Blog
- Services
- Resources
- About

Footer/contextual-only routes:

- Case Studies
- Contact
- Privacy
- Terms

## First-Pass Decisions To Preserve

- Fruitful Pin is the Pinterest-specific commercial brand, not the Fruitful Lab sandbox or the Fruitful Lab customer site.
- The site should feel warm, airy, editorial, and human. Avoid corporate, generic, boxy page composition.
- Primary buttons use the solid Fruitful Pin pink `#950952`; gradients should support text highlights, small accents, and graphic moments, not CTA fills.
- The top nav should stay lean and intentional.
- Contact is mainly a fit-call path: embedded TidyCal first, then message/email.
- Resources is a soft-conversion hub and should feature the Pinterest Fit Check while still linking to other resources and blog content.
- The Pinterest Fit Check should have its own traffic-friendly URL at `/pinterest-fit-check`.
- Blog index and blog post templates should be ready for real WordPress content, featured images, pin graphics, sidebars, table of contents, key takeaways, pull quotes, comparison tables, FAQs, and related paths.
- Case studies are acceptable as a first-pass proof holding structure until Susy creates real visual proof packets.

## Migration And Launch Gaps

Content and URLs:

- Preserve current live WordPress URL shapes, especially root-level post slugs.
- Decide later whether `/services` should remain as a rendered compatibility route or become a redirect to `/pinterest-services`.
- Confirm legal-page final URLs before launch.
- Final copy should be reviewed page by page after structure stabilizes.

Assets:

- Fruitful Pin logo files.
- Susy photos for homepage, about, contact, and sidebar use.
- Pinterest certification badge image files.
- Client/testimonial photos or permission-safe placeholders.
- Featured images for each blog post.
- Pin graphics and portfolio examples for blog posts and case studies.
- Case-study proof visuals, screenshots, one-page proof packets, or infographic cards.

Integrations:

- TidyCal embed is currently represented by the known Fruitful Pin booking path.
- Contact form is visual only until provider, spam protection, destination, storage, and privacy expectations are approved.
- Email capture/list-building is not wired yet. Gating or partial-gating for the Pinterest Fit Check should be decided as a funnel strategy, not as a hidden implementation choice.
- WordPress remains the planned phase-one editor/headless CMS while A2 hosting is prepaid.
- Cloudflare is still the preferred public frontend host, but production DNS should wait for an explicit launch gate.

SEO:

- Current SEO work is scaffolding: metadata, sitemap, robots, route shape, and rich templates.
- Final title strategy, keyword targeting, schema strategy, internal linking, and content briefs remain open for Susy's review.
- FAQs should answer real reader/search questions. Do not add FAQ blocks only to chase rich snippets.

## Second-Pass Work Chunks

1. Contract and safety prep
   - Keep navigation, sitemap, robots, and root-level blog post URLs protected by tests.
   - Keep implementation-status words out of visitor-facing pages.
   - Add checklist docs for launch readiness and migration.

2. Asset readiness
   - Create a clean asset inventory.
   - Add stable image slots in code where real assets will be dropped later.
   - Avoid fabricating trust badges or proof imagery.

3. Content migration readiness
   - Expand the content contract for WordPress fields that are needed by the current templates.
   - Map live WordPress pages/posts to the coded app routes.
   - Identify any redirects needed before `fruitfulpin.com` switches frontend hosting.

4. Conversion and form readiness
   - Keep TidyCal as the safe fit-call path.
   - Prepare, but do not wire, form/email-capture integration choices.
   - Document any approval needed for MailerLite, CRM, backend storage, or spam protection.

5. Local validation before PR
   - Run Fruitful Pin tests.
   - Run Fruitful Pin static build.
   - Check `git diff --check`.
   - Stage only Fruitful Pin files and Fruitful Pin docs for the PR.

## Review Gates

Susy should review before:

- Final page copy.
- Final homepage composition.
- Final service offer language.
- Final SEO strategy.
- Final contact form/email capture wiring.
- Final case-study proof claims.
- Final visual assets.
- Any DNS, Cloudflare, WordPress, A2, or production launch change.

Stepan should review or pair on:

- Hosting/deployment configuration.
- Form and email capture architecture if secrets, APIs, or data handling are involved.
- Shared package extraction from `apps/lab` into `packages/*`.
- Anything that changes production infrastructure.
