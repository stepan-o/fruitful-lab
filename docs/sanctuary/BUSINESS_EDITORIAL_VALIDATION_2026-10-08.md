# Business chapters — editorial revision, 8 October 2026

Scope: chapters 2 and 3, their manuscript/source records, and the Half-Life identification image. Based on merged PR #97. The approved chapter 1 is byte-for-byte unchanged in the chapter data; other chapter prose and the interactive diagrams are unchanged.

- Chapter 2 now maps production, publishing/promotion, distribution, game access and computing in roughly 400 words. The first diagram introduces selected arrangements; the second exposes compatible combinations. The CD PROJEKT example distinguishes a publisher agreement from the player’s subscription.
- Valve follows update distribution, third-party sales, library/audience relationships, discovery, measurement and compatible hardware. Two additional primary sources are recorded. Game-plot summaries are removed.
- Official Half-Life promotional art replaces the gameplay screenshot. Full composition retained, source/use record added. WebP derivatives: 320px / 21,646 bytes and 616px / 54,838 bytes. Existing immutable releases remain available; the active manifest pointer selects the new release.
- Required app CI passed: 65 suites, 335 tests, asset integrity checks and Next.js production build. Scoped ESLint and whitespace checks passed. The first build exposed the empty retired-record chapter array’s inferred type; the source-index type now explicitly permits empty chapter lists, and the full CI passed after that fix.
- Both chapter-specific manuscripts match the complete manuscript and runtime paragraphs. Citation IDs and paragraph positions were checked. The existing market-map/inline-figure ordering test passes with the new heading.
- Local production preview on port 3106 verified at desktop and 390px mobile widths: new copy, diagram order, cloud tab interaction, replacement image loading and enlargement, and no horizontal page overflow. The Valve page reported no browser errors. Temporary viewport override reset.

The publication decision remains the established bounded editorial use. Source availability and attribution are not represented as a blanket licence. The retired gameplay record remains for provenance and is omitted from the Valve chapter’s visual-source index.
