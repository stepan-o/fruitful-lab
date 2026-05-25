# Fruitful Pin B1 Content Inventory

Status: first-pass public scan on 2026-05-24.

Purpose: migration checklist for launching Fruitful Pin B1 with a code-managed blog and local/permanent media assets. This inventory is based on the public `fruitfulpin.com` pages visible without WordPress admin access. It should be reviewed by Susy before migration work begins.

## Current B1 Content Direction

- B1 is code-managed, not headless WordPress.
- WordPress/A2 is the old-site source/archive during migration.
- Published B1 posts, SEO fields, and optimized media should live in `apps/fruitful-pin`.
- ClickUp may be used as the editorial intake workspace, but it should not host production images for the live site.
- MailerLite is the likely target for email signup, Fit Check result saves, and waitlist/resource forms.

## Scan Notes

- Public blog archive found six visible blog posts.
- Susy confirmed these are the six current live posts.
- Susy clarified the new B1 blog entries were placeholder/partial content, not real migrated posts. All six posts need migration before launch.
- Public page scan did not confirm every media URL. Media migration still needs a focused asset pass.
- A direct admin/export or WordPress XML export would be more complete if Susy wants to guarantee no hidden draft, unpublished, or orphaned content is missed.

## Public Pages

| Current URL | Current purpose | B1 status | Migration action |
| --- | --- | --- | --- |
| `https://fruitfulpin.com/` | Homepage | Replaced by approved B1 homepage | Keep new B1 page. Redirect/preserve root. |
| `https://fruitfulpin.com/pinterest-services/` | Services page | Replaced by approved B1 services page | Keep new B1 page at same route. |
| `https://fruitfulpin.com/about/` | About page | Replaced by approved B1 about page | Keep new B1 page at same route. |
| `https://fruitfulpin.com/blog/` | Blog archive | Replaced by approved B1 blog archive | Keep new B1 archive at same route. |
| `https://fruitfulpin.com/resources/` | Resources hub | Replaced by approved B1 resources page | Keep new B1 page at same route. |
| `https://fruitfulpin.com/contact/` | Booking/contact page | Replaced by approved B1 contact page | Keep new B1 page at same route. |
| `https://fruitfulpin.com/privacy-policy/` | Privacy policy | Exists in B1 | Review legal copy after MailerLite/analytics are wired. |
| `https://fruitfulpin.com/terms/` | Terms | Exists in B1 | Review legal copy after MailerLite/analytics/affiliate links are finalized. |

## Blog Post Inventory

| Current title | Current public URL | Date shown publicly | Current category labels shown | B1 recommendation | Current B1 status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Pinterest Marketing for Gardening: How to Show Up in Real Searches | `https://fruitfulpin.com/pinterest-marketing-for-gardening-brands/` | 2026-02-05 | Marketing, E-commerce Marketing | Must launch with B1 | Placeholder/partial in B1 | Needs full migration, SEO/media check, and final QA. |
| Pinterest Organic vs Ads: What Each One Is Actually For | `https://fruitfulpin.com/pinterest-organic-vs-ads/` | 2026-01-17 | E-commerce Marketing, Marketing Tips, Pinterest Marketing | Must launch with B1 | Pilot migration in progress | First post selected to prove the repeatable workflow. |
| Pinterest in 2026 for Product Brands: Pretty Pins Don't Win. Strategy Does. | likely `https://fruitfulpin.com/pinterest-in-2026-for-product-brands/` | 2026-01-17 | E-commerce Marketing, Marketing, Marketing Tips, Pinterest Marketing | Must launch with B1 | Placeholder/partial in B1 | Needs full migration. URL should be confirmed from WordPress export or admin before redirect map is finalized. |
| Before-and-After Pins: The Secret Weapon for Home Renovation Marketing on Pinterest | `https://fruitfulpin.com/before-and-after-pins-the-secret-weapon-for-home-renovation-marketing-on-pinterest/` | 2025-08-06 | Marketing | Must launch with B1 | Not yet migrated | Needs full migration and tone/layout QA. |
| Pinterest Marketing for Gardening Brands: The Key to Conquer Urban Markets | URL not confirmed from public scan | 2025-08-06 | Marketing | Must launch with B1 | Not yet migrated | Needs full migration. Review internal links to avoid awkward overlap with newer gardening post. |
| Exploring Pinterest Management: What Does a Pinterest Manager Do? | URL not confirmed from public scan | 2025-08-06 | Marketing | Must launch with B1 | Not yet migrated | Needs full migration and careful positioning QA so it does not sound like a generic Pinterest VA page. |

## Suggested B1 Blog Decision

Confirmed B1 set:

1. Migrate all six current WordPress posts before launch.
2. Use `Pinterest Organic vs Ads` as the pilot migration.
3. After pilot approval, batch migrate the remaining five posts using the same workflow.

## Media/Asset Migration Checklist

- Replace remote WordPress headshots currently used by B1 pages with local approved assets or a new uploaded portrait.
- Confirm featured image needs for each blog post.
- Move web-ready images into `apps/fruitful-pin/public/assets/` or `apps/fruitful-pin/public/images/`.
- Add alt text for each migrated image.
- Avoid depending on `fruitfulpin.com/wp-content/uploads/*` after DNS points to the new site.

## Redirect Checklist

Required:

- `/pinterest-services/` -> keep as current B1 services route.
- `/services/` -> keep legacy route or redirect to `/pinterest-services/`.
- `/pinterest-marketing-for-gardening-brands/` -> keep.
- `/pinterest-organic-vs-ads/` -> keep.
- `/pinterest-in-2026-for-product-brands/` -> keep after confirming current live URL.
- `/before-and-after-pins-the-secret-weapon-for-home-renovation-marketing-on-pinterest/` -> keep or redirect after migration decision.

Need WordPress/admin export confirmation:

- Current URL for `Pinterest Marketing for Gardening Brands: The Key to Conquer Urban Markets`.
- Current URL for `Exploring Pinterest Management: What Does a Pinterest Manager Do?`.
- Any hidden/noindex pages, older posts, landing pages, media-only URLs, or attachment pages that should redirect.

## Next Action

Susy should mark each blog post as:

- B1 must launch,
- B1.1/V2 later,
- consolidate into another post,
- skip/no migrate,
- rewrite before publishing.

After that, Codex can migrate selected posts into the B1 blog template, move required images locally, and prepare the redirect map.
