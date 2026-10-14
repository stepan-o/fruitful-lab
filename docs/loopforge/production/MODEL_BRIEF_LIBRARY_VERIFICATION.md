# Model brief library verification — 14 October 2026

Update later on 14 October: CATHEXIS first exports now have a static player linked from the archive and Agents tab. The earlier archive-only checks below describe the initial publication. See [CATHEXIS intake verification](CATHEXIS_INTAKE_REVIEW.md) for the eight-source audit, six runtime candidates, visual findings and current limits.

Scope: Loopforge within apps/lab, dedicated branch codex/loopforge-model-brief-library. Current 3D bodies, animation curves, simulation and AWS access are unchanged. Shared project memory records the archive contract.

## Completed checks

- Board publication verifies SHA-256 and byte counts for every input and preview image. Four character kits, 26 modeling/reference images, 18 numbered prompts. LIMEN's missing original prompt is explicitly reconstructed; CATHEXIS is a generation proposal with no model yet.
- All four per-model ZIPs and the combined archive pass independent Python ZIP/CRC checks. Unicode paths and binary content round-trip; traversal, absolute paths and duplicate archive names are rejected.
- Actual browser download of the combined kit saved 9,703,265 bytes / 60 entries. Every packaged file matches its manifest hash. Browser download-event automation timed out, but the downloaded file and success status were verified directly.
- Production build passed (Next compilation, TypeScript, all 77 static pages; assets, factory floor and character checks passed). Existing middleware deprecation and missing local GrowthBook key notices remain unrelated.
- Scoped ESLint and JavaScript syntax checks passed; git diff whitespace check passed.
- Local production route /stepanoskin/loopforge/design#model-briefs reviewed at desktop 1440 × 1000, tablet 768 × 1024, phone 390 × 844 and 320 × 740, DPR 1. No horizontal document overflow. Archive buttons meet 44px target minimum. Body/mask art remains readable, with large JPG inspection links.
- Four model switches show the correct text, art, viewer and download link. LIMEN viewer opened and its return link selected the LIMEN brief. The shared navigation also supplies model-specific Worker/STILETTO links.
- Keyboard Enter on Copy Meshy stages moves focus to the prompt section. Copy stage reports success; plain-text downloads provide a clipboard-independent path. Reference-image jump and native stage disclosures work.
- No continuous motion, audio or canvas is introduced in the archive. Still state is complete; no animations were active in the new library. No browser console errors were recorded during the archive checks.

## Delivery and limits

Only a tiny catalog and the selected model record load on entering the tab; WebP thumbnails use responsive sources and lazy loading. High-quality JPG inputs are fetched for inspection or explicit download. The desktop header chose the 360px CATHEXIS WebP for a 238px display. Other model GLBs are fetched only after following a viewer link. ZIPs are assembled on demand, so deployment storage does not contain duplicate archives or high-resolution PNG masters.

Screenshots are retained locally in model-brief-library-review/ within the task visualization archive, outside production assets. Cold/warm browser interactions were responsive, but network timing, physical-phone performance and field Core Web Vitals were not benchmarked. No claim of field-performance compliance is made. Model/animation approvals and pending cleanup remain in the linked review records.

Hosted preview verification is recorded in the PR after its deployment becomes ready.

## Rear-panel repair update — 14 October 2026

The current CATHEXIS kit replaces only its rear input, retains front/profile references, and starts with a localized repair prompt for the existing body. All kit file sizes/hashes and the standalone repair ZIP CRCs pass. The runtime body remains unchanged. Four review-camera tests and scoped ESLint pass. All six static CATHEXIS assets pass the character validator. A broad TypeScript check reports errors in existing test files (floor types, readonly NODE_ENV, Testing Library options and GrowthBook mocks); it reports none in the changed files. This is not a clean whole-repository type check. Named side buttons now reset the orbit before turning the model; they are commands rather than potentially stale pressed-state indicators. Hosted visual verification is performed after deployment.
