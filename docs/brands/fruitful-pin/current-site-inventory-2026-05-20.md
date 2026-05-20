# Fruitful Pin Current Site Inventory

Status: working inventory captured from public pages on 2026-05-20.

This inventory supports the Fruitful Pin Next.js migration. It is intentionally read-only: no WordPress, A2, GoDaddy, Cloudflare, DNS, or production settings were changed.

## Confirmed Public URL Map

| Current URL | Purpose | Migration handling |
| - | - | - |
| `/` | Homepage and primary sales path | Preserve exactly. |
| `/pinterest-services/` | Main services page | Preserve as canonical services URL. Keep `/services/` as compatibility path or redirect later at hosting layer. |
| `/about/` | Brand/about/Susy positioning | Preserve exactly. |
| `/blog/` | Blog index | Preserve exactly. |
| `/resources/` | Free tools/resources hub | Add to new app and footer nav. |
| `/contact/` | Discovery call and contact form path | Preserve exactly. |
| `/privacy-policy/` | Legal page | Preserve or redirect from `/privacy/` if final URL changes. |
| `/terms/` | Legal page | Preserve exactly if current URL remains valid. |
| `/pinterest-marketing-for-gardening-brands/` | Blog post | Preserve root-level slug. |
| `/pinterest-organic-vs-ads/` | Blog post | Preserve root-level slug. |
| `/pinterest-in-2026-for-product-brands/` | Blog post | Preserve root-level slug. |

## Homepage Content Blocks

- Hero: Pinterest as a 24/7 growth engine for brands/blogs.
- Problem framing: Pinterest is not broken; the strategy is.
- Method: Fruitful Pin builds Pinterest with a plan, not random posting.
- Services teaser: Full-funnel Pinterest growth, organic Pinterest management, Pinterest ads management.
- Proof snapshots: Organic Prairie, Visit Southern Spain, Armstrong-Clark.
- Process: kickoff call, implementation, results/optimization.
- Blog teaser: recent educational posts.
- Footer: quick links, resources, contact email, legal links.

## Services Page Content Blocks

Canonical URL observed: `/pinterest-services/`.

Core offers:

- Full-Funnel Pinterest Growth.
- Organic Pinterest Management.
- Pinterest Ads Management.

One-time/a la carte offers:

- Pinterest Account Audit, listed at USD $497.
- Pinterest Keyword Bank + Board Strategy, listed at USD $397.
- Custom Pin Template Pack, listed at USD $125.
- Pinterest Strategy Session, listed at USD $247.

The services page also includes proof snapshots, a funnel-stage service map, and a discovery-call CTA.

## About Page Content Blocks

- Positioning: strategy, optimization, and scale rather than pinning alone.
- Origin story: started with Pinterest work for a bean-to-bar chocolate maker.
- Audience fit: content creators and product-based brands.
- Values: strategic over trendy, data-informed, inclusive/global, clear human communication, creativity with purpose.
- Founder section: Susy as Pinterest strategist, supported by a small network.
- CTA: map what Pinterest could look like for the brand.

## Contact Page Content Blocks

- Discovery-call CTA.
- Call agenda: current Pinterest status, goals/timelines/constraints, practical plan.
- Contact form fields: name, email, website/brand, inquiry type, message.
- Contact email: `hello@fruitfulpin.com`.
- Fit/not-fit criteria.

## Resources Page Content Blocks

- Free Pinterest tools section.
- Pin-Ready Blueprint mini course.
- Pinterest Content Checklist.
- Client-Attracting Pin Ideas Prompt Sheet.
- Newsletter CTA.
- Tools list: ClickUp, MailerLite, Metricool.
- Services CTA.

## Blog Inventory

Observed recent posts from the homepage/blog path:

- `pinterest-marketing-for-gardening-brands` - Pinterest Marketing for Gardening: How to Show Up in Real Searches.
- `pinterest-organic-vs-ads` - Pinterest Organic vs Ads: What Each One Is Actually For.
- `pinterest-in-2026-for-product-brands` - Pinterest in 2026 for Product Brands: Pretty Pins Don't Win. Strategy Does.

Search results also showed older posts, including:

- Before-and-After Pins: The Secret Weapon for Home Renovation Marketing on Pinterest.
- Pinterest Marketing for Gardening Brands: The Key to Conquer Urban Markets.
- Exploring Pinterest Management: What Does a Pinterest Manager Do?

## Migration Risks And Follow-Ups

- The public `/services/` URL triggered a verification loader in one public fetch, while navigation points to `/pinterest-services/`; treat `/pinterest-services/` as canonical and define redirect/compatibility behavior later.
- Sitemap and WordPress REST API checks could not be completed from this Codex shell without network permission; use browser/web results for now and confirm via WordPress/admin or an approved crawler later.
- Final legal URLs need confirmation: the scaffold currently has `/privacy/`, while current site links indicate `Privacy Policy`.
- Contact form implementation should not be guessed. Keep contact path as booking/email first until form provider or backend target is confirmed.
- Case-study claims need final approval and source material before launch.
