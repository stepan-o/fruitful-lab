# Bloom Whispers Documentation

Status: V1 site design approved 2026-05-28.

Bloom Whispers is a separate brand/site in the brand/app monorepo direction.

App path:

```txt
apps/bloom-whispers/
```

Canonical domain:

```txt
https://bloomwhispers.com
```

## Current Direction

Bloom Whispers starts as a gentle editorial and ritual brand: seasonal letters, soft botanical notes, and small reflective practices for quieter creative living.

Current homepage prototype direction: Midnight Botanical Editorial. The prototype explores a magical, premium night-garden flower world built around flower meanings, folklore, journal content, email-list growth, a V1 flower-message quiz flow, and a soft coming-soon shop/waitlist layer.

The `/flower-message-quiz` route renders the V1 visual quiz experience using the structured quiz data in `docs/brands/bloom-whispers/quiz-implementation-data-2026-05-23.ts`. Email capture remains placeholder-only until the real list integration is selected.

## Approved V1 Checkpoint

Approved across 2026-05-26 through 2026-05-28:

- Homepage V1 visual direction: approved as the current Midnight Botanical Editorial baseline.
- Homepage V1 section order: Hero, What You'll Find Here, Quiz CTA, Bloom Journal, Bloom Letter, Podcast, Shop Soon, Footer.
- Flower-message quiz V1: approved as the current interactive quiz and result-card baseline.
- Result-card routing: podcast CTA points to `/podcast`; flower healing link points to the migrated Bloom Whispers post; guide and shop CTAs point to the V1 guide/shop pages.
- Journal archive V1, hibiscus journal post template V1, About, Contact, Podcast, Shop, Flower Meaning Guide, Privacy, and Terms are approved as V1 pages.
- Header primary CTA points to the flower-message quiz. Flower Meaning Guide is the first navigation item and has a dedicated capture page.
- Email capture and shop/waitlist behavior remain placeholder smoke-test surfaces for V1.

Known V2 candidates:

- Refine quiz copy and scoring after more review paths.
- Refine mobile result-card and shop-section details if live QA shows friction.
- Wire real email/list capture once the email platform is chosen.
- Expand analytics/click tracking for quiz starts, guide signups, Bloom Letter signups, podcast clicks, and contact submissions.
- Download/archive media assets locally before DNS cutover if the old WordPress upload URLs will not remain available.

First-pass routes:

- `/`
- `/flower-meaning-guide`
- `/flower-message-quiz`
- `/journal`
- `/journal/hibiscus-flower-meaning`
- `/podcast`
- `/shop`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

## Journal Content Migration

The live Bloom Whispers WordPress export from 2026-05-29 is the source of truth for V1 journal bodies. Its published
post titles, slugs, dates, metadata, and body HTML have been moved into the app-level journal content source in
`apps/bloom-whispers/lib/journalPosts.ts`. Migrated articles are served through the approved journal template and use
clean root-level public slugs such as `/hibiscus-flower-meaning/` as their primary URLs, matching the Pinterest-friendly
URL structure Susy wants to preserve.

The `/journal/[slug]` route remains available for internal organization, but migrated article cards and canonical
metadata prefer the clean root-level public path for each article. Temporary `/post/[slug]` aliases are also served for
legacy internal links found in older content.

Current media audit: the migrated journal content referenced 127 unique files under
`https://bloomwhispers.com/wp-content/uploads/...`. Those files have been downloaded into
`apps/bloom-whispers/public/wp-content/uploads/...`, and migrated article HTML now uses local
`/wp-content/uploads/...` URLs where the WordPress export embedded media inside post bodies. Keep this folder with the
Bloom app before DNS cutover so Pinterest-distributed article URLs and article media remain stable after WordPress is
retired.

The app is static-first for Cloudflare-style hosting compatibility. It should not import directly from other apps. Shared code should be promoted into `packages/*` first only after real reuse exists.

## Locked Instagram Content System

Bloom Whispers Instagram is about flower stories, signs, uses, and discoveries. It is not a daily flower meaning quote account.

Core audience promise: every post should help someone discover something meaningful, useful, surprising, or emotionally resonant about flowers.

The locked Instagram content pillars are:

1. Flower Stories & Symbolism
2. Surprising Flower Facts
3. Emotional Flower Messages
4. Everyday Flower Discoveries
5. Practical Flower Wisdom
6. Lessons From Flowers
7. Flower Identity & Interactive Content

The working Instagram strategy, content system, and batching docs are:

```txt
docs/brands/bloom-whispers/instagram-strategy-2026-08-02.md
docs/brands/bloom-whispers/instagram-content-pipeline-2026-08-02.md
docs/brands/bloom-whispers/instagram-idea-bank-2026-08-02.md
docs/brands/bloom-whispers/instagram-content-pipeline-tracker-2026-08-02.csv
```

Use those docs for Instagram planning before producing carousel covers, treated inner-slide backgrounds, Reels, captions, hashtags, or scheduling files. Treat `instagram-content-pipeline-2026-08-02.md` as the operating system for moving raw sparks into selected, briefed, designed, scheduled, and reviewed posts.

Live Google Sheet:

```txt
Bloom Whispers - Instagram Content Pipeline
https://docs.google.com/spreadsheets/d/1U2YIz41QE6nttl0v4h_k44yKZtbfHy8Bmeo7zk0MOI4
```

## Editorial Workflow

### Editorial Orchestration

The Bloom Whispers content workflow is now organized around a single user-facing Editorial Orchestrator.

The orchestrator's fundamental objective is to preserve Bloom Whispers' quality promise while reducing Susy's manual routing between separate researcher, writer, editor, creative, and publisher tasks. It should keep deep research, source discipline, Bloom Whispers originality, SEO/Pinterest usefulness, safety boundaries, and human taste gates intact while making the current article state and next action obvious.

Reader arrival is a hard editorial gate. Bloom Whispers research exists to make the article richer and to support the source list, not to make the opening sound academic. The first screen must give a general English-speaking reader a familiar, sensory, plain-English doorway before it introduces dense cultural terms, source names, botanical Latin, or institutional proof. If Susy cannot get past the opening, the draft is not approved no matter how high the previous score was.

Curiosity-led copy is also a hard gate. Titles, first paragraphs, Quick Meaning boxes, and public H2s must create immediate tension, specificity, or a clear reader payoff. Do not confuse generic numbered titles, vague "surprising things" phrasing, or poetic internal-brand labels with an actual content hook.

Primary orchestration docs:

```txt
docs/brands/bloom-whispers/agents/orchestrator-agent.md
docs/brands/bloom-whispers/agents/media-agent.md
docs/brands/bloom-whispers/agents/production-agent.md
docs/brands/bloom-whispers/content-pipeline/_templates/pipeline-status-template.md
docs/brands/bloom-whispers/content-pipeline/_templates/orchestrator-pilot-test.md
```

Every orchestrated article package should have a durable status file:

```txt
docs/brands/bloom-whispers/content-pipeline/<topic-slug>/pipeline-status.md
```

The status file is the source of truth for the topic, stage, current draft, latest review, research files, Susy's approval notes, blockers, and next action. Specialist agents still own their craft lanes, but the orchestrator owns sequencing, handoffs, approval gates, and state.

When Susy authorizes sub-agent orchestration and sub-agent tools are available, the orchestrator should use real specialist sub-agents for writing, editor/critic, media strategy, creative direction, production prompts, and publisher/readiness steps. In that mode, the main thread coordinates and records state; it should not silently perform the specialist work itself. Each specialist output should identify the role that produced it and be linked from the topic's pipeline status.

Media workflow rule: visual work is split into separate stages. The Media Strategy Agent studies Bloom Whispers Pinterest/current graphics and proposes five concrete concepts by category: infographic / educational pin, quote graphic, classic Pinterest blog-title pin, comparison / clarity graphic, and editorial or experimental test. Susy selects concepts. The Creative Director turns approved concepts into prototype direction or creative briefs. The Production Agent creates ChatGPT-ready image prompts, prompt variations, Canva edit notes, filenames, and draft alt/caption guidance. Susy normally generates text-included image drafts in ChatGPT and may refine or rebuild the text/layout in Canva; Codex image generation is not the default production route unless Susy explicitly requests it.

The first pilot topic is Marigold:

```txt
docs/brands/bloom-whispers/content-pipeline/marigold/pipeline-status.md
```

The Marigold pilot proved the single-thread orchestration structure is useful, but also exposed a quality-gate failure: V3 was marked 9.1/10 and then rejected by Susy because the first screen still felt too hard to read. Current rule: reader-arrival rejection supersedes prior editor approval and returns the package to revision. V4 fixed reader arrival; V5 over-tightened and introduced confusing thesis language; V6 restores V4 as the base with Susy's clearer line: "Marigold meaning changes by where the flower is placed." Susy approved V6 on 2026-08-12, with writing-style improvement logged as a future polish/watch point rather than a blocker. The current Marigold stage is live publish authorized / production deployment in progress as of 2026-08-13. Selected concepts live at `docs/brands/bloom-whispers/content-pipeline/marigold/media-selection-decision-v1.md`; the broader visual inventory is `docs/brands/bloom-whispers/content-pipeline/marigold/media-ideas-v1.md`; production handoff is `docs/brands/bloom-whispers/content-pipeline/marigold/media/production-prompts-v1.md`; first generated PNG QA is `docs/brands/bloom-whispers/content-pipeline/marigold/media/asset-review-v1.md`; approved launch media handoff is `docs/brands/bloom-whispers/content-pipeline/marigold/media/selected-media-handoff-v1.md`; Publisher Brief Only is `docs/brands/bloom-whispers/content-pipeline/marigold/publisher-brief-v1.md`; Site Implementation is `docs/brands/bloom-whispers/content-pipeline/marigold/site-implementation-v1.md`. The article is implemented in `apps/bloom-whispers/lib/journalPosts.ts` with canonical clean route `/marigold-meaning/`, internal route `/journal/marigold-meaning/`, five selected assets staged in `apps/bloom-whispers/public/assets/marigold/`, FAQ/schema support, visible safety notes, and source list. The real sub-agent workflow created Writer, Editor/Critic, Media/Creative, Publisher readiness, Orchestrator integration, Production, Publisher Brief, and Publisher QA outputs recorded in the Marigold pipeline.

### Research And Writing Roles

The current Bloom Whispers content research process is documented in
`docs/brands/bloom-whispers/content-research-workflow-2026-06-06.md`.

The current Bloom Whispers post-research writing process is documented in
`docs/brands/bloom-whispers/agents/writer-agent.md`.

The first lane-based pilot dossier is
`docs/brands/bloom-whispers/queen-annes-lace-research-dossier-2026-06-06.md`.

The first visual reader dossier is
`docs/brands/bloom-whispers/queen-annes-lace-visual-dossier-2026-06-06.html`.

The workflow is currently locked as B1. It requires topic setup, a multilingual name map, research by 11 lanes with source material and source contributions attached to the corresponding lanes, a source ledger, claim matrix, paid-source suggestions when useful, curation recommendations, a Quotes For The Article section with five source-backed quote candidates, SEO/AIO outline, questions to capture, source-backed pull-quote opportunities, satellite ideas, Bloom Whispers podcast potential, and a human approval checkpoint before drafting. Completed research should be delivered in two layers: a detailed markdown source dossier and a white-card visual reader dossier that makes curation easier without replacing the source file.

## Pinterest And Metricool Workflow

The current Bloom Whispers Pinterest-to-Metricool scheduling workflow is documented in
`docs/brands/bloom-whispers/pinterest-metricool-workflow-notes-2026-07-17.md`.

Use that workflow before preparing or uploading Bloom Whispers Metricool CSVs. It records the corrected Canva export, Downloads/Freshinator handoff, Dropbox raw-link upload, live Metricool Google Sheet template, Bloom Metricool brand check, QA, and import verification process.

## Editorial Writing Framework

Bloom Whispers writing must be expressive, reader-first, and original, not only accurate and organized. The V2 Writer Agent framework was approved on 2026-06-07 after the Queen Anne's lace pilot showed that factual completeness alone can still feel dry.

The article framework now requires:

- familiar language, short paragraphs, strong verbs, clear headings, and task-focused organization;
- a sensory intro / story lead before or alongside the quick answer;
- a first-five-seconds reader-arrival pass: familiar anchor first, sensory curiosity second, unfamiliar/source-specific terms later;
- a proper-noun ramp that prevents openings from clustering source names, botanical Latin, unfamiliar cultural terms, and institutional names before context;
- source invisibility in the public opening: research should shape the article from underneath, with papers and source names cited at the end or introduced later only when they improve the story;
- a central curiosity object that carries the article;
- a story ladder that moves from answer to discovery to meaning to reader payoff;
- Bloom Whispers original value, including Bloom Wisdom, original quote options, synthesized plain-language definitions, and safe ways to bring the flower into the reader's life;
- Pinterest-ready original lines for pull quotes, text overlays, carousels, email, and social captions;
- clear separation between Bloom Whispers original interpretation and source-backed historical, botanical, cultural, medical, or safety claims.

Working research anchors for this framework:

- Nielsen Norman Group on web reading and scannability: https://www.nngroup.com/articles/how-users-read-on-the-web/
- Digital.gov on plain-language web writing: https://digital.gov/resources/plain-language-web-writing-tips/
- Purdue OWL on leads and inverted pyramid structure: https://owl.purdue.edu/owl/subject_specific_writing/journalism_and_journalistic_writing/writing_leads.html
- Green and Brock on narrative transportation: https://pubmed.ncbi.nlm.nih.gov/11079236/
- Berger and Milkman on emotional activation and online sharing: https://doi.org/10.1509/jmr.10.0353
- Google Search Central on people-first helpful content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Local Preview

From `apps/bloom-whispers/`, use:

```bash
npm run dev:local
```

The script binds to `127.0.0.1:4185` and enables polling/webpack mode because the default Next dev watcher can hit `EMFILE: too many open files` in Codex local preview sessions.

## Direct Tracking Setup

Bloom Whispers V1 uses direct tracking installs instead of Google Tag Manager.

Set these environment variables in the deployment platform:

```txt
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-K6215K4DM8
NEXT_PUBLIC_PINTEREST_TAG_ID=...
NEXT_PUBLIC_CLARITY_PROJECT_ID=rozfnuhll7
```

When a value is absent, that tracking script is not rendered. MailerLite is intentionally separate from this tracking setup and still needs the selected form/embed/API configuration before production lead capture is fully wired.
