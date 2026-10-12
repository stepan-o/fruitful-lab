# Atlas history reader verification

12 October 2026 · `codex/atlas-water-chapter` · base `2079cac` (PR #111)

## Scope

Eight continuous ES/EN history chapters replace the six short scene sequences. Chinampas have a dedicated second chapter. Each chapter has three sections, an archival figure and its own three-question concluding quiz. The manuscript has 5,175 Spanish narrative words and 4,474 English narrative words, excluding captions, sources and quiz content. Every factual passage and answer resolves a source link.

The reader adds 24 questions to the existing 40-question practice library. Scores are visual practice feedback only; neither account scores nor backend progress change. The game map, login and field-discovery rules are untouched. Atlas maps use explicit selection, zoom, framing and recenter controls rather than drag capture.

## Automated validation

- Full `API_BASE_URL=http://localhost:8000 LOOPFORGE_LOW_MEMORY=1 npm run ci` passed: 90 suites, 459 tests, one snapshot, asset round-trip checks, integrity checks and Next.js production build. Jest reported an existing worker-teardown warning but exited successfully.
- Atlas tests cover bilingual source coverage, chapter loading, valid answers, 2/3 correct → +50, locking submitted answers, navigation to the next chapter, guided diagram selection and no practice-score writes to localStorage.
- Scoped ESLint passed for Atlas components and data. `git diff --check` passed.
- 55 retained asset releases pass verification. Current Mexico City revision: `ffa2e9bddb11809adb490fba477e3d565ed238de41d9faf48de643eb15c12c89`.
- After the full CI run, archive detail views were adjusted to request a larger responsive variant only when selected. A final production build covers that adjustment.

## Reading and media contract

Chapter metadata is separate from eight dynamic manuscript imports. Opening a chapter fetches its manuscript, not the rest of the book. Later archival figures use native lazy loading and reserve intrinsic image dimensions. Details request sharper variants on demand. All historical source masters remain outside `public`; runtime delivery uses content-hashed responsive WebP variants.

New source-image provenance is recorded in `assets/sources/mexico-city/references.json` and [SOURCES.md](SOURCES.md). Full reproductions preserve framing; enlarged details are visibly labeled. No generative edits, modern colorizations or invented documentary images are introduced. Original explanatory SVGs are labeled diagrams and distinguish relative positions/processes from measured historical geography.

Continuous looping motion is absent from chapter figures. Discrete diagram and crop transitions are disabled by the reader's reduced-motion media query. The older optional timeline playback remains separate and retains its existing pause/visibility behavior.

## Browser and delivery evidence

The final built app was reviewed at 320, 390, 768 and 1280 CSS-pixel viewport settings (DPR 1). No horizontal overflow was found in the checked reader, archive, contents, quiz and Explore views. Tests included:

- Spanish chinampas chapter → diagram controls → archive full/detail views → all three answers → +75 points → next chapter.
- Switching to English in the pre-Mexica chapter, jumping to its Teotihuacan section, inspecting the nineteenth-century drawing and its source/rights links, then returning to the eight-chapter contents.
- Desktop lake diagram: south selection highlights Xochimilco/Chalco and changes the explanation. Keyboard Tab reaches the citation link with visible focus.
- Scroll input over the chinampa diagram moves the page. The Explore map reports `touch-action: auto`; explicit zoom and east-view buttons change its transform. Browser inspection caught a 12 px overlap between direction and zoom controls; the final hosted preview confirms a 13 px gap between those groups, with no horizontal overflow.
- The mobile chapter selector keeps the document scrollable; chapter headings and quiz result receive focus. Submitted answers are locked, and the result explicitly distinguishes practice points from account progress.

Representative image selection: the Teotihuacan figure at 320 px used the 400 px file (9,266 bytes); opening its detail increases the requested size to 144vw. Chinampas offers 400/800/1200 px variants of 29,334/101,646/203,394 bytes; the detail loads a sharper variant on demand. Archive figures are below the opening text/diagram and lazy-loaded; screenshots retain source captions. These are measured file sizes and browser-selected sources, not a network-waterfall or field-speed claim.

Cold production navigation and subsequent in-app navigation rendered the selected chapter and figures successfully; a pending chapter has an explicit loading state and a retry affordance for failure. Independent chunk inspection confirmed chinampas and pre-Mexica manuscripts in separate bundles. Reduced-motion behavior was reviewed in CSS: all diagram and crop transitions are disabled; an OS-level reduced-motion emulation was not available in the browser tool.

Evidence:

- [Phone: chinampa diagram](evidence/atlas-history-phone.png)
- [Phone: chapter quiz result](evidence/atlas-history-quiz.png)
- [Desktop: guided lake figure](evidence/atlas-history-desktop.png)

This is laboratory verification, not field Core Web Vitals; field LCP/INP/CLS and full cold/warm transfer timings remain unmeasured.


### Hosted preview

Vercel deployment `dpl_Ewhgx6kdnNiNkWfUg6cBNLWwFdQL` is **READY** for application commit `a227eccd1fd30a56617797bd8bbd407351d1b8af`. [Open the chinampas chapter](https://fruitful-gmr56wt2w-stepan-oskins-projects.vercel.app/mexico-city/atlas?view=chapters&chapter=chinampas).

On the hosted app, all five later chapters loaded with three sections, three quiz questions and their own archival figures; no console errors were observed during those checks. The final deployment was checked at 390 px: map zoom revealed separated direction controls, the measured gap was 13 px, and the chinampas chapter and diagram loaded correctly. Archive delivery was also confirmed: the phone's enlarged chinampas view selected the 800 px / 101,646-byte variant. Final PR delivery details are in [PR #114](https://github.com/stepan-o/fruitful-lab/pull/114). The commit recording this result changes documentation only.

## Atlas landing editorial pass · 12 October 2026

Applied the owner-selected ES/EN copy and a new map note, documented in [EDITORIAL_DESIGN.md](EDITORIAL_DESIGN.md). The entry offers explicit first-chapter/all-chapters actions; borough cards identify concrete places; the bottom navigation uses conversational labels. The note now sits below the map in readable editorial text. Timeline periods have a related-chapter action to fulfill the history panel's invitation. This pass adds no assets to runtime delivery, fonts or dependencies.

Validation for this follow-up:

- Production build passed with `API_BASE_URL=http://localhost:8000 LOOPFORGE_LOW_MEMORY=1 npm run build`, including retained-asset checks and TypeScript validation. Subsequent formatting changes do not change behavior.
- Scoped ESLint passed. Exact-path Mexico City test run passed: **7 suites / 23 tests** with `API_BASE_URL=http://localhost:8000`. The initial broad path-pattern attempt inadvertently selected other tests because the worktree path contains `mexico-city`; it was stopped and replaced by the exact-path run. An earlier test/build overlap hit an intermediate `.next/package.json`; the successful run happened after the build.
- The built landing was inspected at **320, 390, 768 and 1280 CSS px**, DPR 1. No horizontal page overflow was found. Spanish and English navigation labels fit at 320 px without clipping; each tab remains 58 px tall and at least 52 px wide there.
- Verified: first-chapter action opens `chapter=basin`; all-chapters action opens the index; selecting a timeline chapter opens `chapter=peoples`; returning to Explore opens the landing. Searching `Cuicuilco` returns Tlalpan; an unknown term renders the localized no-result message. Map zoom exposes its directional controls; keyboard Tab from the new chapter-index action reaches the first borough with visible focus.
- Phone map caption and history panel retain their layout; the new note is outside the map's controls. Desktop heading, first-chapter card and map/history composition were visually reviewed. No new animation was introduced; existing reduced-motion rules remain.
- Local build log: `/tmp/atlas-editorial-build.log`. Full field performance remains unmeasured; no new cold/warm transfer timing claim is made for this copy pass.

Evidence: [phone opening](evidence/atlas-editorial-phone.png), [phone map and note](evidence/atlas-editorial-map-phone.png), [desktop](evidence/atlas-editorial-desktop.png). Vercel preview verification is reported on PR #114 after the push.
