# Mexico city discovery game verification — 10 October 2026

Scope: `/mexico-city` and `/mexico-city/game-design` in `apps/lab`, branch `codex/mexico-city-discovery`, based on `origin/master` at `75c5469`. No backend, authentication, other app or runtime dependency changes. Technical checks support owner playtesting; they do not imply acceptance of the visual direction, historical editing or game balance.

## Design notebook and working reference update

The new design route captures the city-first, private multiplayer direction in Spanish and English, including branding/style, map/learning, accounts/evidence, future modes and open decisions. Interactive challenge scenarios are simulations and cannot change a journal or score. Current game screens, metadata, import errors, export filenames and current design documentation now use the owner's working reference **Mexico city discovery game**. Storage keys and journal format remain compatible.

- Re-ran full Lab CI: **76 suites, 400 tests and one snapshot**, asset checks and production build passed. Scoped ESLint and diff checks passed. A final production rebuild includes the small skip-link visibility correction found during screenshot review.
- [Design browser checks](verify-game-design.mjs): 320/390/768/1440px, Spanish default, persisted English across reload/navigation, all five challenge outcomes, no journal mutation, all four scale descriptions, chapter anchors, expandable reading list, keyboard activation, phone touch, reduced motion and return links. No horizontal overflow, undersized buttons/summary controls or browser runtime errors.
- Re-ran both existing exploration/journal and learning browser suites at all four widths after the working-reference changes. Both passed with zero page errors, preserving all prior gameplay and reward checks.
- Opening design artwork: **130,966 body bytes** on 320/390px phones at DPR 2; **190,158 body bytes** observed at 1440px / DPR 1 including the browser's early lazy image request. Warm image transfers were zero. Immutable responsive variants, reserved image dimensions and lazy figures are reused; no new runtime dependency or media master was added.

[Desktop design page](evidence/design-es-1440.webp) · [Phone design page](evidence/design-es-390.webp) · [English design page](evidence/design-en-1440.webp) · [Challenge walkthrough](evidence/challenge-es-1440.webp) · [Visual identity](evidence/identity-es-1440.webp) · [Phone game label](evidence/game-name-en-320.webp) · [Design image measurements](evidence/design-report.json).

These are Chromium emulation and unthrottled localhost checks. Field performance, physical camera behavior and whether the proposed multiplayer rules are fun remain unmeasured. The older screenshots and timing samples below describe the earlier prototype revision; the linked design evidence above documents this update.

## Build and tests

- Full `API_BASE_URL=http://localhost:8000 npm run ci`: passed — asset-release test, **76 suites / 400 tests / one snapshot**, production build and static generation.
- Six journal tests cover independent scoring, old exports, strict reward validation, duplicate imports, conservative merges and unsupported image payloads.
- Final production rebuild after map/dialog/copy refinements: passed, including TypeScript and **48 retained asset releases**.
- Scoped ESLint across the route, components and logic: passed without warnings. `git diff --check`: passed.
- Translation audit found no missing Spanish dictionary entry for a literal `t()` call; remaining direct JSX words are proper names, transit names, Náhuatl vocabulary or `pts`.
- Static transit data: 12 Metro lines, 195 line-station records, 4 Cablebús line segments, 150 nonempty neighborhood geometries and 12 named streets. Source coverage and historical-diagram limits are documented in [SOURCES.md](SOURCES.md).

The build retains existing middleware-convention and optional GrowthBook-key notices. No test or build failure remains. A separately invoked repository-wide `tsc` surfaced existing unrelated test-file typing errors; the configured Next.js build/type check and the full Jest run above passed. No unrelated files were changed to suppress them.

## Production browser checks

Both [existing exploration/journal checks](verify.mjs) and [new bilingual learning checks](verify-learning.mjs) passed against the optimized `next start` build at all four widths, with **zero browser page errors**. Chromium on Linux; mobile configurations are emulations, not physical-device tests.

| Viewport | Both flows | Initial image body bytes | Cold LCP | Cold CLS | Warm LCP |
| --- | --- | --- | --- | --- | --- |
| 320 × 844 | Pass | 32,626 | 796 ms | 0.0316 | 176 ms |
| 390 × 844 | Pass | 32,626 | 464 ms | 0.0297 | 132 ms |
| 768 × 960 | Pass | 32,626 | 572 ms | 0.0143 | 192 ms |
| 1440 × 960 | Pass | 32,626 | 704 ms | 0.0040 | 160 ms |

The opening still requests two 256px WebPs totaling **32,626 body bytes**. Warm reloads transfer zero artwork bytes. Archive/modern references mount only when their panel opens; learning artwork mounts when opening the chapter. Measurements are unthrottled localhost samples collected while the two browser suites ran; they do not establish real-device, cellular, regional-CDN or field performance. Field LCP/INP/CLS and physical camera behavior remain unmeasured. No offline/PWA claim is made.

Exploration checks cover all four scales; actual visible label hit targets; touch and keyboard; four-part stories and swiping; story collection; saved places, visits, notes, resized photographs; independent players; reload; export/import; rejection of external-image payloads; Escape/focus return; browser Back; invalid deep links; empty borough states; and reduced motion.

Learning checks cover:

- Spanish default, English switching inside a dialog, translated controls and stories, document language, and persisted language after reload.
- Persistent Metro/Cablebús overlays through city → borough → zone → place; visible area, street and station captions where applicable.
- Lake slider, archive-map opening, causeway choice, borough selection, Metro line isolation, Cablebús selection and airport choice; advancing a lesson returns scroll/focus to its heading.
- Six city quiz rewards, wrong-answer retry, five Náhuatl meaning matches, two name puzzles and replay protection. Susy reaches **225 learning points**; switching to Stepan starts at zero and a correct word gives him 10 while Susy keeps 225.
- Export/import preserves both players’ learning flags; malformed JSON yields the Spanish error and leaves the valid journal intact.
- The Revolución story opens its archive/modern photo pair with public-domain/CC BY-SA attribution, source links and successfully decoded images.
- No horizontal overflow; minimum 44px HTML buttons, range control and reference-panel summaries; reduced-motion mode. SVG map targets have equivalent named HTML controls.

The checks exposed and resolved label crowding, map geometry extending over lesson controls, lesson scroll/focus behavior, and a desktop landmark’s transparent image box intercepting its neighbor’s caption. Test waits explicitly allow dynamic panels to mount and scroll offscreen labels into view before hit-testing. Generated fixture photographs in tests are not claims of actual visits or user photographs.

## Reviewed evidence

| Experience | Screenshots |
| --- | --- |
| Spanish opening | [Desktop](evidence/city-es-1440.webp), [tablet](evidence/city-es-768.webp), [phone](evidence/city-es-390.webp), [320px](evidence/city-es-320.webp) |
| Neighborhood/transit | [Desktop](evidence/metro-zone-es-1440.webp), [phone](evidence/metro-zone-es-390.webp), [320px](evidence/metro-zone-es-320.webp), [landmark hit spacing](evidence/zone-1440.webp) |
| Opening chapter | [Water and island](evidence/water-1440.webp), [phone](evidence/water-390.webp), [causeways](evidence/chapter-2-1440.webp), [boroughs](evidence/chapter-3-1440.webp), [Metro](evidence/chapter-4-1440.webp), [Cablebús](evidence/chapter-5-1440.webp), [airports](evidence/chapter-6-1440.webp), [phone airports](evidence/chapter-6-390.webp) |
| Games/points | [City quiz completion](evidence/city-quiz-finish-390.webp), [Náhuatl desktop](evidence/nahuatl-1440.webp), [Náhuatl phone](evidence/nahuatl-390.webp), [name puzzle](evidence/nahuatl-name-mil-320.webp) |
| Photographs | [Archive/modern pair](evidence/revolution-photos-390.webp), [desktop](evidence/revolution-photos-1440.webp), [journal with test fixture](evidence/journal-1440.webp) |
| Original style-pass comparison | [Initial desktop](evidence/before-city-desktop.webp), [initial phone](evidence/before-city-phone.webp), [initial close-up](evidence/before-zone-desktop.webp) |

Machine-readable reports: [exploration/performance](evidence/browser-report.json) and [learning](evidence/learning-report.json). Test journal exports remain outside the repository.

## Release boundary

Draft PR for owner review; no merge or production promotion. The Vercel preview and commit are recorded on the PR. Scores, notes and photos stay in browser storage with manual file exchange; no authenticated multiplayer or automatic synchronization. Transit is a dated static learning reference, not live navigation. Historical drawings and lake/causeway/airport diagrams are identified as interpretations; archive and modern photographs retain separate credits and licenses.
