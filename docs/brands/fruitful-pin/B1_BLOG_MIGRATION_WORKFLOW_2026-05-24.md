# Fruitful Pin B1 Blog Migration Workflow

Status: pilot workflow started 2026-05-24.

Pilot post: `Pinterest Organic vs Ads: What Each One Is Actually For`

## Workflow Principle

The workflow should maximize delegation to Codex and minimize Susy's involvement. Susy's main role is approval and final judgment on brand, claims, and assets.

## Ownership Split

| Step | Owner | Notes |
| --- | --- | --- |
| 1. Source collection | Codex | Pull current public article text, visible metadata, image references, internal links, and current URL. Ask Susy only if public source is incomplete. |
| 2. Migration packet | Codex | Create a structured packet with title, slug, excerpt, SEO draft, outline, image needs, CTA placement, and review notes. |
| 3. Template fit check | Codex | Check whether the B1 blog template handles the real content: headings, lists, tables, images, FAQs, CTA blocks, mobile layout. |
| 4. Implementation | Codex | Add content to the code-managed blog, update template only where needed, wire metadata, preserve URL, and place images or image references. |
| 5. QA | Codex | Run lint/tests/build, inspect layout, links, images, mobile, metadata, and sitemap. |
| 6. Review | Susy | Review the browser version and approve or request edits. |
| 7. Workflow lock | Both | If approved, Codex documents the repeatable pattern and migrates remaining posts with the same rules. |

## Default Codex Decisions

Codex may proceed without asking Susy for:

- preserving existing public slugs when clean,
- drafting SEO title and meta description from the article,
- formatting headings, bullets, tables, FAQs, and article graphics into the approved template,
- adding internal links to existing B1 pages where natural,
- placing a Fit Call CTA near the end,
- drafting image alt text,
- doing minor readability cleanup that does not change the article's claim or meaning.

Codex should ask Susy or flag for review when:

- the source article is incomplete or hidden,
- an image/graphic is missing or unclear,
- a claim needs business/accuracy confirmation,
- a meaningful rewrite is needed for positioning,
- two posts overlap enough that consolidation may be smarter than migration,
- a post's current tone conflicts with the approved B1 voice.

## Pilot Migration Packet

| Field | Value |
| --- | --- |
| Source URL | `https://fruitfulpin.com/pinterest-organic-vs-ads/` |
| Current visible title | Pinterest Organic vs Ads: What Each One Is Actually For |
| SEO title draft | Pinterest Organic vs Ads: Which Strategy Is Best for You? |
| Slug | `pinterest-organic-vs-ads` |
| Date | January 17, 2026 |
| Category | Pinterest Ads |
| Primary CTA | Book a Fit Call |
| Secondary path | Blog archive, resources, services |
| Template needs discovered | Real article needs support for multi-paragraph sections, H3 subsections, bullets, numbered combo plays, a four-column comparison table, FAQ items, and real pin graphic images. |
| Asset status | Article image references currently point to WordPress media. Acceptable for pilot preview, but must be copied locally or moved to permanent asset hosting before DNS launch. |

## Pilot QA Notes

- The pilot should preserve the article's current public URL.
- The comparison table should appear early, after the table of contents.
- The source article uses a more casual tone than the approved marketing pages. For pilot migration, preserve meaning and do only light normalization. Full editorial rewrite requires Susy approval.
- Before launch, replace or locally migrate WordPress-hosted images.
