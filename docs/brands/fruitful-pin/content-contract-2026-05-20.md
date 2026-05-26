# Fruitful Pin Content Contract

Status: working contract for the first local Next.js implementation pass.

This contract defines how the coded Next.js site should consume content now and how it can later map to headless WordPress fields without changing the public rendering layer.

## Content Source Phases

1. Local structured content in `apps/fruitful-pin/lib/content.ts` for fast local iteration.
2. Headless WordPress on A2 for phase-one editing once fields/API shape are confirmed.
3. Future CMS or repo-content migration near the A2 renewal decision.

## Shared Page Fields

Every editable marketing page should support:

- `slug`
- `title`
- `seoTitle`
- `seoDescription`
- `heroEyebrow`
- `heroTitle`
- `heroDescription`
- `primaryCtaLabel`
- `primaryCtaHref`
- `secondaryCtaLabel`
- `secondaryCtaHref`
- ordered content sections

## Service Package Model

Fields:

- `title`
- `kicker`
- `description`
- `bestFor`
- `includes[]`
- `cta`
- optional `price` for one-time offers
- optional `proof` references

Current service families:

- Full-Funnel Pinterest Growth
- Organic Pinterest Management
- Pinterest Ads Management
- Pinterest Account Audit
- Pinterest Keyword Bank + Board Strategy
- Custom Pin Template Pack
- Pinterest Strategy Session

## Blog Post Model

Fields:

- `slug`
- `title`
- `category`
- `date`
- `excerpt`
- `featuredImage` later
- `keyTakeaways[]`
- `sections[]` or WordPress rich text body
- `cta`
- `relatedPosts[]`

Important URL rule: current posts use root-level slugs, not `/blog/<slug>`. The Next app should preserve those root-level post URLs or define explicit redirects before launch.

## Resources Model

Fields:

- `title`
- `type`
- `description`
- `ctaLabel`
- `ctaHref`
- optional `integration` or delivery provider

Current resources:

- Pin-Ready Blueprint
- Pinterest Content Checklist
- Client-Attracting Pin Ideas Prompt Sheet
- recommended tools such as ClickUp, MailerLite, and Metricool

## Proof / Case Study Model

Fields:

- `brand`
- `context`
- `result`
- `metricLabel`
- `metricValue`
- `approvedQuote`
- `image`
- `permissionStatus`

Do not expand proof claims beyond approved source material.

## Contact Model

Phase-one safe fields:

- discovery call URL
- contact email
- fit criteria
- not-fit criteria

Confirmed B1 contact provider: ClickUp. The public contact form posts to `/api/contact`, which creates a ClickUp task through a Cloudflare Pages Function. Keep spam protection lightweight for B1 with a honeypot field, and keep `CLICKUP_API_TOKEN` plus `CLICKUP_CONTACT_LIST_ID` in Cloudflare env vars rather than the repo.

Confirmed B1 analytics: Cloudflare Web Analytics is enabled for `fruitfulpin.com`, Google Search Console is verified with `https://fruitfulpin.com/sitemap.xml`, GA4 uses Measurement ID `G-E0TLX9V17Q` through the app-level Google Analytics component, and Pinterest Tag ID `2612504823331` is loaded through the app-level Pinterest Tag component.

## WordPress Mapping Notes

The current local content can map to WordPress in two ways:

- Standard pages/posts for broad rich text content.
- Advanced Custom Fields or similar structured fields for service packages, CTAs, proof blocks, FAQs, and resource cards.

The phase-one goal is to preserve Susy's familiar WordPress editing workflow while letting Next.js own layout, routing, performance, and UX.
