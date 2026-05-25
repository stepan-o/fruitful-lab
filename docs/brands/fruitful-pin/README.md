# Fruitful Pin Documentation

Status: created 2026-05-20.

Fruitful Pin / Fruitful Bean is the Pinterest-specific service brand and the first commercial marketing-site migration target in the brand/app monorepo direction.

Current active spec:

- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md`
- `docs/brands/fruitful-pin/second-pass-prep-2026-05-22.md`
- `docs/brands/fruitful-pin/V1_BLOG_TEMPLATE_RULES_2026-05-25.md`

Current phase-one target:

```txt
GoDaddy domain
-> Cloudflare hosts the public Next.js site from apps/fruitful-pin
-> Content is managed in the Next.js repo through Codex-assisted updates
```

Fruitful Lab remains separate and should not be rebuilt as part of Fruitful Pin work unless Susy explicitly changes the scope.

## Brand Direction Notes

These notes reflect Susy's direction from the 2026-05-20 local prototype review.

- Keep the site airy, breezy, white-led, and editorial rather than corporate, heavy, or boxy.
- Use the primary pink `#950952` for primary CTAs. Do not use the brand gradient for CTA buttons.
- Use the gradient for text highlights and occasional intentional accents. Do not repeat the short straight gradient-bar motif across sections; Susy said it reads like a mistake rather than a brand element. Current test direction is a simple bronze curved underline/accent, not a wavy thread.
- Core palette: `#950952` primary pink, `#a44200` rust, `#d58936` bronze, `#0b132b` navy, `#171a21` ink, `#dfdfdf` light gray, `#ffffff` white.
- Primary gradient: `linear-gradient(90deg, #d68a37 0%, #a54200 36%, #960a52 72%, #960a52 100%)`.
- Secondary warm gradient: `linear-gradient(90deg, #ffffff 0%, #d58936 58%, #a54300 100%)`.
- Current typography test: Playfair Display Medium for headings/accent text and Raleway for body. Avoid overly bold/thick Playfair weights; Susy wants the more stylized editorial version.
- Homepage sections should feel connected through curves and flowing transitions, not like stacked rectangles with a wave pasted between each block.
- About-page direction should stay close to the current live-site shape: simple centered opening, story plus photo, who-we-work-with fit section, values, personal/fun-facts section, credibility, kind words, and CTA.
- Who-we-work-with needs a clear visual distinction between right-fit and not-fit signals, such as green check markers and red/negative markers.
- Values should use actual icon-style marks, not 1/2/3 numbered badges. Examples: strategy arrows, data marks, world icon, communication bubble, creative pen/spark.
- Certification proof should use a fuller banner/ribbon treatment. Real Pinterest badge assets should replace the temporary gold-square placeholders when Susy provides them.
- The About page can include a warmer "Kind words" section using Susy's LinkedIn recommendations as source material, edited/paraphrased into concise testimonial-style cards.
- Real Pinterest badge assets should be added when Susy provides them; do not create fake trust badges.
- Blog index direction should include a sidebar, not only a post grid. Sidebar should support list building/lead magnet placement, Susy/about intro, search/discovery, popular reads, and resource links. Elaine Timms' blog index was used as a broad layout reference, and the current Fruitful Pin blog index confirms sidebar/email capture is important.
- Blog category pills should only appear when they work as real filters. If filtering is not implemented yet, avoid non-clickable category chips because they are distracting.
- Blog cards and individual blog posts should support a featured-image slot. If no image is set yet, use a branded placeholder; later WordPress/CMS content should map its featured image into this field.
- The blog sidebar opt-in/list-building strategy is not locked; copy, lead magnet, and email form integration can change later.
- Individual blog post pages should feel like polished article templates, not raw content dumps: editorial hero, featured image, key takeaways, readable body width/typography, inline opt-in, related posts, and a final fit-call CTA.
- Individual blog post pages should also support article-specific content blocks: in-body table of contents, pin-ready graphic placeholders, larger pure-image in-article Pinterest graphic slots, pull/highlight quotes, comparison tables, FAQ sections, and previous/next article navigation.
- Table of contents belongs inside the blog post/article flow, not in the sidebar. The sidebar can keep search, Susy/about, lead magnet, and exploration links.
- For article order, prefer featured image, key takeaways, a short human intro bridge, then table of contents. This feels warmer and less mechanical than stacking TOC and takeaways directly together.
- Large Pinterest graphic slots should appear mid-article, not immediately after the featured image, and should be image-only/asset-like rather than a side-by-side image plus explanatory text block.
- Avoid showing duplicate article recommendations when previous/next already points to the same small article pool. Until there are enough posts for genuinely distinct related content, use a "Where to go next" section with action paths such as Blog archive, Resources, and Services.
- FAQ sections are useful when they answer genuine search/reader questions. Do not add FAQs only for markup/rich-snippet chasing; use them to improve clarity and cover likely long-tail questions.

## Current Prototype Page Decisions

- Second-pass prep is recorded in `docs/brands/fruitful-pin/second-pass-prep-2026-05-22.md`. Use that file as the active checklist for route/content guardrails, asset gaps, integration gaps, launch gates, and the next implementation chunks.
- Resources is a soft-conversion hub, not the main sales path. It should support article discovery, list-building, future tools, and visitors who are not ready to book a fit call yet.
- Contact is the fit-call page. Current direction, after Susy's 2026-05-21 reset, is to stay close to the live `fruitfulpin.com/contact` structure: one-column intro, full-width embedded TidyCal calendar directly under the intro, then the message form directly underneath. The embed must not be trapped in a fixed-height/cropped wrapper; use a tall, full-width, overflow-visible container and keep the public TidyCal URL as the fallback. Do not wire new email automation, CRM, or form backend integrations without explicit approval.
- Case studies/proof is currently shaped as one featured proof snapshot, supporting proof cards, trust/logos/testimonials, and a small creative-proof/portfolio section that can later hold real pin examples, strategy maps, screenshots, and permission-approved proof packets.
- Support pages should avoid visible "prototype", "placeholder", or implementation-language copy. Temporary implementation state belongs in docs/code comments, not in the visitor-facing UI.
- SEO work in this pass is scaffolding only: page metadata, canonical domain constants, sitemap/robots support, and templates that can carry future SEO strategy. It does not lock title strategy, keyword targets, blog taxonomy, schema strategy, or final content briefs.
- Non-visual safety tests should keep protecting public route coverage, sitemap/robots output, root-level blog slugs, rich article-template content, and accidental implementation-status language in visitor-facing page source.
- Contact page job: be conversion-oriented and do one main thing, get the visitor to book/contact Susy. Put the embedded fit-call calendar first, then a general inquiry form/email option for collaboration, podcasts, speaking, or questions. Avoid extra fit-signal blocks on this page for now; Susy asked to remove the "is Fruitful Pin a good fit" section from the contact pass. Current style direction also borrows from Sarah Burk's contact-page warmth: conversational intro, small Susy/photo personality cue, and a soft animated text ribbon.
- Current public booking URL from the live site is `https://tidycal.com/susycid/is-pinterest-a-good-fit-for-your-brand`; current embed path is `susycid/is-pinterest-a-good-fit-for-your-brand`.
- Top navigation should stay intentionally lean: Home, Blog, Services, Resources, and About. Case Studies, Contact, Privacy, and Terms can live in the footer and contextual page CTAs.
- Pinterest Fit Check is the Fruitful Pin-native diagnostic tool and has its own traffic-friendly URL at `/pinterest-fit-check`. Resources should still feature the Fit Check at the top, then show the guide/library/blog paths underneath. The tool should render inside `apps/fruitful-pin` rather than importing from `apps/lab`; promote shared logic into `packages/*` only if reuse becomes real enough to justify it. Current resource ideas include the Pinterest strategy guide, Pin Ready Blueprint mini-course, Pinterest content checklist, client-attracting pin ideas prompt sheet, and Pinterest blog articles.
- Case studies page is acceptable as a proof holding structure for now. Future case-study work should be created with Susy later; cards may become clickable visual one-page case studies or infographic-style proof packets. Design examples/portfolio currently sit in a supporting creative-proof section, and can move into individual case studies once the result stories are clearer.
