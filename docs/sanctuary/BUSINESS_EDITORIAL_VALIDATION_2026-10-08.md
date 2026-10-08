# Business chapters — editorial revision, 8 October 2026

Scope: chapters 2 and 3, their manuscript/source records, and the Half-Life identification image. Based on merged PR #97. The approved chapter 1 is byte-for-byte unchanged in the chapter data; other chapter prose and the interactive diagrams are unchanged.

- Chapter 2 introduces the industry roles through the work between a promising game and its audience: financing a release, getting noticed, and reaching equipment that can run it. It then follows the different commercial uses of a game through console ecosystems, Steam/GeForce NOW and a catalog agreement. The structure remains functions → ecosystems → products; the prose is a continuous argument rather than a set of definitions.
- The CD PROJEKT example uses Nowakowski’s complete opening sentence in question 5 of the Q3 2025 earnings transcript (PDF page 6, 18 quoted words). Management’s view of displaced purchases and the expansion opportunity is attributed. No private contract amount, per-play payment or measured sales effect is invented. Ten paragraphs, 657 words; the market map follows paragraph 5 and the promotional image follows paragraph 8 (zero-based).
- Valve follows update distribution, third-party sales, library/audience relationships, discovery, measurement and compatible hardware. Its data is unchanged by the chapter 2 narrative pass. Game-plot summaries were removed in the earlier PR revision.
- Official Half-Life promotional art replaces the gameplay screenshot. Full composition retained, source/use record added. WebP derivatives: 320px / 21,646 bytes and 616px / 54,838 bytes. Existing immutable releases remain available; the active manifest pointer selects the new release. No further media changes in the chapter 2 pass.
- App CI for the narrative revision (`c346bdc`) passes: 65 suites, 335 tests, asset integrity checks and Next.js production build. Scoped ESLint and whitespace checks pass. Both manuscripts match the runtime paragraphs, all citation IDs resolve, and the existing test verifies market-map/heading/figure order after the paragraph positions changed.

The publication decision remains the established bounded editorial use. Source availability and attribution are not represented as a blanket licence. The retired gameplay record remains for provenance and is omitted from the Valve chapter’s visual-source index.

Local production reading check: the new opening, section sequence and attributed quotation render correctly. Desktop (1280px) and mobile (390px) have no horizontal page overflow; no browser errors were reported. Temporary viewport settings were reset.

The subsequent owner-supplied opening sentence expansion is synchronized across the chapter data and both manuscripts. The existing reader suite passes again (13 tests); whitespace checks pass. This copy-only edit preserves paragraph positions, citations and diagrams.
