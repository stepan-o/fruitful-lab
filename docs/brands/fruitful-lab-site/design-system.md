# Fruitful Lab Customer Site Design System

Status: started 2026-05-22.

This note documents the first CSS design-system layer for the Fruitful Lab customer site at `apps/fruitful-lab-site/`. The goal is to make new pages and future refinements start from shared primitives instead of one-off page styling.

## CSS Source

Primary implementation lives in `apps/fruitful-lab-site/app/globals.css`.

The design-system layer uses the `--fl-*` token prefix and generic `fl-*` utility/component classes. Existing page-specific classes such as `cfs-*`, `cfc-*`, and `flb-*` can remain while each page is still being designed, but new work should reuse or map back to the shared tokens first.

## Typography Lock

- Comfortaa 700 is the only heading/display font. Use it for `h1`-`h6`, hero headlines, section titles, brand marks, and deliberate display accents. Keep it at the loaded 700 weight so headings stay rounded but not too thin.
- Raleway is the only body/interface font. Use it for paragraphs, navigation, buttons, form controls, captions, and labels. Raleway is loaded from 500 through 800 in this app, so body copy uses 500 and heavier labels use 800 instead of synthetic 900.
- The implementation tokens must resolve through the loaded Next font variables: `--fl-font-heading` uses `--font-heading` for Comfortaa 700, and `--fl-font-body` uses Raleway. Do not add page-local font stacks that bypass these tokens.
- Do not add page-local font stacks or utility weights to heading tags unless the typography role is intentionally changed and documented.


## Typography Decision Log

- 2026-05-30: Approved Comfortaa 700 as the Fruitful Lab heading/display font, paired with Raleway for body copy, navigation, buttons, labels, forms, and interface text. This replaced the earlier heading test after visual review against the new Fruitful Lab logo. Keep this as a token-level decision so it remains easy to revert or adjust later.

## V1 Type Scale Lock

- Site-wide typography is locked through the late CSS block named `Fruitful Lab V1 type-scale lock` in `apps/fruitful-lab-site/app/globals.css`.
- Hero `h1` headlines use one shared V1 hero scale across Home, Services, How We Work, Blog, Blog Post, About, Resources, Contact, Privacy, and Terms.
- Major section `h2` headlines use one shared V1 section scale. Card and module headings use one shared V1 card scale. Legal/body section headings stay on a smaller heading scale.
- Keep Comfortaa/Raleway separate from size conversations: Comfortaa owns display/headings; Raleway owns copy, nav, buttons, labels, inputs, and UI text.
- Do not introduce page-local font families. If a page needs a different size rhythm, add a named token here first instead of one-off Tailwind type utilities.

## Token Groups

- Color: `--fl-color-*` for ink, muted text, surfaces, periwinkle, flame, and mint.
- Gradients: `--fl-gradient-brand`, `--fl-gradient-brand-soft`, and `--fl-gradient-text`.
- Type: `--fl-font-heading`, `--fl-font-body`, `--fl-type-hero`, `--fl-type-hero-large`, `--fl-type-section`, `--fl-type-card`, and line-height tokens.
- Layout: `--fl-shell`, `--fl-shell-services`, `--fl-shell-narrow`, gutters, and section spacing.
- Shape and motion: radius, shadow, transition, and gradient-motion tokens.

## Shared Classes

Use these before introducing new page-local classes:

- `.fl-shell`, `.fl-shell-services`, `.fl-shell-narrow`
- `.fl-section`, `.fl-section-page`, `.fl-section-warm`, `.fl-section-dark`
- `.fl-eyebrow`
- `.fl-gradient-text`
- `.fl-title-hero`, `.fl-title-section`, `.fl-title-card`
- `.fl-copy`
- `.fl-actions`
- `.fl-button`, `.fl-button-primary`, `.fl-button-secondary`, `.fl-button-accent`
- `.fl-panel`, `.fl-card`

Legacy generic classes `.eyebrow`, `.gradient-text`, `.btn`, `.btn-primary`, `.btn-secondary`, and `.btn-gold` now share the same tokenized foundation so existing pages keep working while future JSX can move to the clearer `fl-*` names.

## Current Visual Checkpoint

The Blog archive design is first-pass accepted as of 2026-05-22. Do not make further visual changes to the Blog archive during design-system cleanup unless Susy asks for them. Future Blog work should focus on copy/content and later post-template polish.

## Working Rule

When adding a new page section, choose the closest tokenized primitive first. If a page needs a bespoke pattern, keep it page-scoped, but use the shared colors, type scale, spacing, radii, shadows, and motion tokens unless there is a clear design reason not to.

## Lesson Learned

When typography and sizing are discussed together, separate the request into two checks: font family/weight first, size scale second. For future passes, validate the computed browser font family on the main pages before declaring typography work complete.

## Blog Post Template Direction

- Blog post pages should follow the Fruitful Pin coded post-template structure: centered hero, featured visual, quick answer, key takeaways, table of contents, article body, newsletter capture, vertical graphic placeholders, previous/next navigation, next-step cards, sticky sidebar, related posts, and final CTA.
- Translate the structure only. Preserve Fruitful Lab branding: white/ghost-white base, Prussian/dark CTA cards, Lab gradient, Comfortaa headings, Raleway body text, and broader product-discovery/growth-systems language.
- Fruitful Lab posts live at `/blog/[slug]/`, unlike Fruitful Pin's current root-level blog-post URLs.

## About Page Direction Lock

- The About page follows the public Fruitful Pin About page structure as the reference model, adapted to Fruitful Lab: centered hero, origin story, who-we-work-with fit section, guiding values, two-founder story, dark kind-words section, and final clarity CTA.
- The hero must stay centered with no right-side founder or illustration block. Use a gradient-highlighted phrase, a small curved underline/accent, supporting paragraph, and two centered CTAs.
- Adapt the people section for two founders: visible "Hi, I am Susy" and "Hi, I am Stepan" sections with founder imagery. Current V1 founder photos are installed, but can be replaced later with final approved portraits.
- The fit section should show right-fit and not-fit cards side by side on desktop. Do not add large check/cross icons to the card headings; keep the symbols at the list-item level only.
- Do not reintroduce the failed Commence-style animated ribbon, embedded calendar panel, hero founder tiles, or valued-collaborators strip unless Susy asks for those specifically in a later pass.
- About headlines should keep Fruitful Lab gradient emphasis on important words. Do not leave the About hero or major section titles as plain all-navy text.
- Use pronounced arch/curve transitions between major sections, especially hero-to-story, values-to-founders, founders-to-kind-words, and dark kind-words-to-final-CTA.
- Preserve Fruitful Lab branding, colors, and the typography pairing: Comfortaa for headings/display and Raleway for body/interface. Fruitful Lab About should use white/ghost-white and dark Prussian/black contrast, not Fruitful Pin cream/beige backgrounds or pale final CTA cards.
- Values can be shown as a client-centered orbit: the client/product sits in the middle, and the principles revolve around that center instead of appearing as disconnected blocks.
- Keep future About edits section-by-section. If a section is disliked, replace that section instead of redesigning the entire page at once.


## Fruitful Pin About Reference Translation

When Susy asks for the About page to copy Fruitful Pin, translate the layout rhythm and section order, not the Fruitful Pin copy or Pinterest positioning. Keep the Fruitful Lab message focused on product discovery systems, search, content, lifecycle, data, testing, AI workflows, and founder-led partnership.
