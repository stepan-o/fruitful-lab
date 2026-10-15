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

## Worn-cloth reference alignment — 14 October 2026

The current CATHEXIS kit replaces both rear and profile inputs with a matching worn-cloth pair. The original front is explicitly limited to proportions/front-opening guidance. The first copyable stage requests a separate revision of the existing body: rear infill and reduced decorative lace, with body/crown/masks preserved. Full rebuild instructions, delivery order, image roles and provenance agree with that scope. Viewer geometry remains the original unrigged body.

Publication checks verify all input/preview hashes and byte counts; generated kit files and ZIP CRCs are checked before push. No renderer or runtime behavior changes in this revision. Hosted verification follows the preview build.


## Accepted CATHEXIS v2 publication — 14 October 2026

Owner accepted the v2 body and requested removal of v1 from the public viewer. The current pack contains only the 51,034-triangle v2 body plus unchanged face candidates. v1 GLB and its obsolete manifest are removed from this release; source downloads remain private.

Validation: all six static GLBs pass hash, byte count, geometry, normal-map presence and glTF checks. All 31 CATHEXIS kit files match hashes and sizes. Scoped ESLint and the production build (including TypeScript and all asset checks) pass. The built application renders the accepted body with the repaired rear skirt, correct current labels and no v1 option. Phone controls inspected at 390px; 320/390/768px document widths stay within their viewports. No browser console errors during inspection. Existing orbit/camera behavior is retained. Current screenshots are retained in the private cathexis-v2-intake evidence directory.

The new body downloads 5,695,824 bytes, down from 5,898,524. Only the selected asset loads. This static inspection does not establish rigging, costume motion, crowd performance or physical-device frame rates. Normal-map export and first Hot Walk/expressive-sway rig tests are next. Production deployment is verified after the release commit.

## CATHEXIS stage 2 closure — 14 October 2026

Owner closed remaining face generation after the layered Grace preview. Stages 3–7 now request the intact original head, body-only rigging and one shared motion bank; expression-mask exchange and facial articulation are outside the current prototype. Physical Grace handling is optional later work. The brief UI now displays stable filename stage numbers when stage 3 is ordered first. Rebuild/closed stages are labelled and placed after active stages.

Validation: board publication, JavaScript syntax and whitespace checks passed. All four generated kit manifests match source prompts, file hashes and byte counts; independently assembled archives pass ZIP CRC checks (CATHEXIS: 31 files). No model binaries or renderer behavior changed. The preceding optimized application build remains valid for the viewer; the new hosted build and brief controls are checked after push.
