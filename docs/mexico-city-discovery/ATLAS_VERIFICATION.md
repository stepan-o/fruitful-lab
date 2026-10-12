# Illustrated Atlas verification

12 October 2026 · `codex/illustrated-city-atlas` · base `fe07962`

## Scope

`/mexico-city/play` stays the primary game map. Its HUD and learning links lead to the public illustrated `/mexico-city/atlas`. Spanish is the default; English covers the complete learning flow. No backend/auth/database or field-score changes.

Implemented inventory: 16 bilingual borough profiles, 48 approximate place anchors, six three-scene chapters, seven historical windows, three local comparisons, eight stories, eight vocabulary cards, 40 quiz questions and two place-name games. The content and source map is in [ATLAS_CONTENT_MAP.md](ATLAS_CONTENT_MAP.md).

## Automated checks

- Immutable asset round-trip/integrity test passed. All 54 retained asset releases passed asset checks, including the new responsive Mexico City pack.
- Full `API_BASE_URL=http://localhost:8000 LOOPFORGE_LOW_MEMORY=1 npm run ci`: 88 suites passed and one existing Sanctuary suite timed out (456 passing tests). No Atlas failure. The timeout prevented this combined command from reaching the build.
- Serial rerun of the timed-out Sanctuary suite, Atlas data coverage/reward checks, Atlas quiz interactions and existing FieldApp interactions: four suites / 24 tests passed. The full run preceded one added asset-resolution test.
- ESLint: new Atlas components/data clean; modified FieldApp retains three pre-existing image-element warnings and no errors.
- Separate `API_BASE_URL=http://localhost:8000 LOOPFORGE_LOW_MEMORY=1 CI=1 npm run build` passed, including Next.js production type checking and route generation. A subsequent quiz scroll-into-view adjustment passed its two interaction tests; final hosting validation also covers that change and separated Cablebús labels.
- A standalone `tsc --noEmit` check reports existing test-only typing issues in Loopforge, Sanctuary, Pinterest and GrowthBook tests; no Atlas diagnostics. Next.js production type checking passed.

## Browser checks

The development experience was exercised at 320 and 390 CSS pixels: Spanish-default entry, English switch, lake/current-boundary comparison, timeline selection/play/pause, borough → place zoom, history wrong-answer retry → +25 → next question, and a completed Xochimilco word-building game. No horizontal document overflow in checked views. A successful answer disables repeat reward; navigation starts a fresh practice run. The reward tests confirm no new localStorage state is written.

The built app was additionally checked at 390 and 768 CSS pixels: generated Cuicuilco story opened, Escape dismissed it and restored focus, browser Back dismissed a story, Spanish/English source captions remained attached, and Cablebús C2 selected the eastern corridor. Two close Cablebús labels were separated after this inspection.

Phone screenshot: `/tmp/mexico-atlas-phone.jpg` (390 × 844, DPR 1). The initial Explore image selected `2c964bfe802bfaeb6ba85534ac649d0c8dd1c1338b1e87afed31e537a49a51d7.webp`; image bytes are recorded in the immutable manifest. Additional final hosted checks follow in the PR.

## Evidence boundaries

The timeline is a sourced narrated comparison, not a measured urban-growth animation. Historical lake outlines and connecting paths are labeled schematic; modern borough outlines never masquerade as historical boundaries. Archival maps/photos have separate author/date/license records. Four new generated illustrations are labeled interpretive; original prompts are retained with the asset source masters. Additional aerial/INAH archives are linked as research, not copied without a reproduction basis.

Atlas points are visual practice feedback only. They do not alter the account or field-discovery score. Transit layers are dated learning references with operator links, not a live service-status promise.
