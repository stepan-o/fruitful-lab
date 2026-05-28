# Fruitful Pin Content Contract

Status: working contract for the B1 code-managed Next.js implementation.

This contract defines how the coded Next.js site should consume content now. A future CMS can still map into these fields later, but B1 is code-managed unless Susy explicitly reopens the headless WordPress path.

## Content Source Phases

1. Local structured content in `apps/fruitful-pin/lib/content.ts` and app-specific tool libraries for B1 publishing.
2. ClickUp can support editorial planning/intake, but the published copy, metadata, and optimized assets live in the repo.
3. Future CMS/headless WordPress remains optional and should be treated as a separate decision, not the current B1 path.

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

- Pinterest Fit Check at `/pinterest-fit-check`
- Pinterest Readiness Check at `/pinterest-readiness-check`, migrated as a separate assessment resource and not a replacement for the native Fit Check
- Coming-soon guide/checklist/keyword/prompt resources
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

Confirmed B1 analytics: Cloudflare Web Analytics is enabled for `fruitfulpin.com`, Google Search Console is verified with `https://fruitfulpin.com/sitemap.xml`, GA4 uses Measurement ID `G-E0TLX9V17Q` through the app-level Google Analytics component, Microsoft Clarity uses project ID `wyaafqmk6j` through a direct root-layout script, and Pinterest Tag ID `2612504823331` is loaded through the app-level Pinterest Tag component. GA4 V1 conversion events are `fit_check_completed`, `newsletter_signup`, `resource_interest`, `contact_form_submitted`, and `fit_call_click`; the Pinterest Readiness Check also emits readiness-specific events for start, completion, question progress, and email unlock.

## WordPress Mapping Notes

The current local content can map to WordPress in two ways:

- Standard pages/posts for broad rich text content.
- Advanced Custom Fields or similar structured fields for service packages, CTAs, proof blocks, FAQs, and resource cards.

The original phase-one idea was to preserve Susy's familiar WordPress editing workflow while letting Next.js own layout, routing, performance, and UX. That is no longer the B1 direction; keep this section only as a future mapping reference.
