# Fruitful Pin V1 Blog Template Rules

Status: approved V1 pattern as of 2026-05-25.

Purpose: lock the repeatable code-managed blog post pattern for Fruitful Pin V1 so future posts can be published through Codex without re-deciding the template every time.

## Core Template Shape

Every V1 blog post should use the approved article flow:

1. Editorial hero with title, excerpt, author/date, and featured image.
2. Quick Answer box near the top.
3. Key Takeaways card.
4. Short human intro bridge.
5. Table of contents.
6. Main article sections with readable question-style headings where natural.
7. Section-level answer snippets where they genuinely clarify the article.
8. Optional comparison table if the post needs one.
9. Optional in-body graphics where the visual supports a specific section.
10. Bottom "Save for later" Pinterest graphics, capped at 2.
11. FAQ section.
12. Previous/next and "where to go next" navigation.
13. Final Fit Call CTA.

## AEO and SEO Rules

Each migrated or new post should include:

- `seoTitle`
- `seoDescription`
- `sourceUrl` when migrated from the old site
- `quickAnswer` with a plain-English answer to the post's main search question
- question-style section headings where they sound natural
- `answerSnippet` blocks for high-value sections
- FAQs that answer real reader/search questions, not filler

The blog post template renders:

- `BlogPosting` schema
- `BreadcrumbList` schema
- `FAQPage` schema when FAQs exist

Do not add schema claims that are not supported by the visible article content.

## Image and Asset Rules

Blog assets live in:

```txt
apps/fruitful-pin/public/assets/blog/<post-slug>/
```

Use one folder per article. The folder can include a short `README.md` with suggested filenames and notes for Susy.

Recommended asset set per post:

- one wide featured image
- zero or more in-body graphics
- up to two bottom saveable Pinterest graphics

Recommended dimensions:

- Featured image: wide landscape, around `16:9`.
- Pinterest/saveable graphics: vertical, around `2:3`.

Use local assets only for launch. Do not depend on old `fruitfulpin.com/wp-content/uploads/*` media after DNS migration.

## Featured Image Rules

Use `featuredImage` for the post's main wide visual.

The featured image should:

- feel editorial and on-brand
- display cleanly in the article hero media slot
- have useful alt text
- avoid text that becomes unreadable at blog-card sizes

## In-Body Graphic Rules

Use `featuredPinGraphic` for one early full-size vertical graphic when the post has a strong visual that belongs near the start of the article.

Use `bodyGraphics` for any additional full-size graphics that should appear inside the article flow.

Each `bodyGraphics` item should include:

- `afterSectionId`: the section id where the graphic should appear
- `title`
- `description`
- `image.src`
- `image.alt`

Place in-body graphics near the section they explain. Do not push every graphic to the bottom.

## Bottom Pinterest Graphics Rule

The bottom "Save for later" section must show a maximum of 2 graphics.

Use `pinGraphics` for the bottom saveable images. The template caps rendering with `slice(0, 2)` as a safety guard.

If an article has more than two vertical graphics:

- keep the two strongest saveable/pinnable graphics in `pinGraphics`
- move the extra graphics into `featuredPinGraphic` or `bodyGraphics`
- place each extra graphic near the section where it adds context

Bottom graphics should display as individual image figures, not inside a combined frame. Each should remain independently saveable/pinnable.

## Display Rules

Approved V1 visual behavior:

- no orange holding frame around Pinterest graphics
- no extra text overlays from the website on top of image assets
- image-only display for Pinterest graphics
- bottom graphics side by side on desktop and stacked on mobile
- in-body graphics display larger, centered, and contained

If text is needed on a graphic, it should be part of the image asset itself.

## Accessibility Rules

Every image must have descriptive alt text.

Alt text should describe the purpose of the image, not repeat the filename. Example:

```txt
Fruitful Pin graphic showing Pinterest language in board name, pin title and description, and text overlay
```

Do not use empty alt text unless the graphic is purely decorative, which should be rare for blog article images.

## Repeatable Publishing Workflow

1. Create or migrate post content into `apps/fruitful-pin/lib/content.ts`.
2. Preserve the current public slug when possible.
3. Add SEO fields, quick answer, section snippets, and FAQs.
4. Create the article asset folder under `public/assets/blog/<post-slug>/`.
5. Add refreshed image files to the folder.
6. Wire `featuredImage`, `featuredPinGraphic`, `bodyGraphics`, and `pinGraphics`.
7. Confirm bottom `pinGraphics` has no more than two intended visuals.
8. Run `npm run build`.
9. Run `npm test -- --runInBand`.
10. Run `git diff --check`.
11. Review the local static preview.

## Current Approved Examples

Use these posts as V1 references:

- `pinterest-organic-vs-ads`
- `pinterest-marketing-for-gardening-brands`
- `pinterest-for-product-based-business`

These examples show the approved AEO structure, featured image usage, in-body graphics, and two-image bottom Pinterest graphic treatment.
