# LIMEN Meshy model review — 12 October 2026

## Purpose and route

`/stepanoskin/loopforge/play/agent-test/limen` reviews the owner's Meshy export inside the real Security/Lattice Forge renderer. It is linked from the agent production test and the design Agents tab. This is a model/clip bench: it does not replace the cast in main play, run BDI decisions or invent inspection/contact animations.

The owner approved temporary app-hosted delivery while AWS resolves CloudFront account verification. The source stays private in S3. No CloudFront distribution, bucket policy or credential change is needed to run this test.

## Current source revision — body and separate blade

The owner regenerated LIMEN with the blade removed from the body and supplied a separate energy-blade prop. Both masters, the optimized body review copy and source provenance are uploaded and checksum-verified in private S3. The current source record selects `meshy-2026-10-12-v2`. The former source is marked retired and archived; its former object location remains because the scoped publisher cannot delete it. Bucket details remain private.

| Asset | Current source / review status |
| --- | --- |
| Body v2 | 24,184,936 bytes; SHA-256 `2085f27c0264c417b876ee038919175712fd7fcc02c6c2601c1b2d65325a0ad4`; 42,354 triangles and 23 Mixamo joints. Local walk/run review is usable for the next pass. No finger bones or animated idle; minor soft armour deformation remains. |
| Body v2 derivative | 4,318,356 bytes; SHA-256 `fcb4b356b7905de1bbd52a3f18e72d3de2cecbdef6b4c8cc009c578d2fbda0ee`; geometry/rig preserved, 2048² colour map and material cleanup. Zero validator errors, inherited non-root skinned-mesh warning. |
| Separate blade source | 61,813,440 bytes; SHA-256 `c65ba4fd8556e5203e5f7314c5a6c2877ff70c7806101da4a3e77ecf0e789f0f`; 1,145,974 triangles, one mesh, no skin or clips. Zero validator errors; missing authored tangent-space warning. Prepared as the reduced rigid housing below; the source remains unchanged. |

## Assembled v2 runtime

The separate bench now uses **body v2 + a rigid forearm housing + procedural energy**. The earlier body-with-blade export is retired from this active manifest. Its immutable files remain for older deployment references.

- Body: 4,318,356 bytes; geometry and 23-joint rig preserved, 2048² JPEG colour map, full-body emission removed. No authored body normal/roughness map, finger rig or factory-contact clip is supplied.
- Housing: 1,175,636 bytes, **4,994 triangles**, SHA-256 `f520691b5fe2bb72c3d7864c556e87b35373a9ab4a1e8c7f176d4414ab7c2f3e`. Three retained source maps resized to 1024²; generated MikkTSpace tangents. No skin or animations. Validator: zero errors/warnings.
- Combined downloads: **5,493,992 bytes / 5.24 MiB**, versus 85,998,376 bytes for both masters. Both GLBs embed their dependencies and are checksum-verified before import.
- Energy: **672 triangles**, one opaque shader draw for a tapered core and three displaced braids, sharing the existing bloom. No additional dynamic light or particle system.
- Mount: right forearm TransformNode, centimetre-to-metre conversion and versioned offset. The housing and energy inherit a rigid transform, without skinning the blade into a leg.

From `apps/lab`, run `node scripts/characters/import-limen.mjs /absolute/path/body-v2.glb /absolute/path/blade-master.glb`. Both source hashes are pinned. `prepare-limen-blade.mjs` trims source geometry by position and material colour, simplifies with Meshoptimizer, retains/reduces maps and generates tangents. This recipe is specific to this Meshy revision; a new source requires a new inspection. It does not claim a high-to-low material rebake. All preparation dependencies are development-only.

`npm run characters:check` checks rig/clip structure, finite data, normalized weights, file/triangle/texture budgets, validator issues and sampled leg clearance. The latter skins the leg geometry at 73 points per walking/running clip and checks blade-axis intersections. Current results: zero intersections, nearest leg vertices 12.4 cm walking and 6.6 cm running. Nearest vertices are not the minimum surface distance. Full swept-volume, torso, hand and paired-worker clearance remains a separate contact-animation gate.

## Review controls and boundaries

Rest/walk/run, play/pause, scrubbing, speed, turn, room, surfaces, original art and measurement download remain available. New controls switch the whole blade assembly on/off, preview a half-second energy surge and select close inspection or three elevated CCTV-scale framing presets. Those presets frame this stationary subject; they do not change production cameras. The inspection lamp remains optional.

No autoplay. Reduced motion freezes braid displacement and removes the surge flash. Pausing freezes both clip and cosmetic clock; the body scrubber does not seek a world action timeline. Hidden tabs pause and offscreen canvases stop rendering. Navigation/failed loads dispose containers, shader, light and scene. The main-play cast, game state and simulation random stream are unchanged.

The manual surge is a labelled preview, not a fabricated intervention. Event-keyed contact sparks, trails, spatial audio, authored carry/interaction clips and full game integration remain to build. No new Meshy source is required for this assembly review.

## Earlier v1 record

The first review used a 41,326-triangle body with modeled blade, source SHA-256 `5cf991bb1be950dae7d2ba92353488562b7c6c2742cdfc169eef5febe7b220ef`, 25,582,380 bytes and a 4,865,140-byte derivative. The owner accepted the body/clip direction but reported blade/leg crossing, motivating the separate body and equipment workflow. It is retained as provenance, not the active candidate.

## Delivery migration

Current runtime URLs are relative immutable app files. Once CloudFront is ready, publish the same content-hashed file and manifest to the shared origin, configure CORS/cache behaviour, and move URL resolution at the asset boundary. Remove migrated binary copies from app output after deployment references are verified; changing URLs alone does not reduce deployment storage. Keep the master and pipeline/provenance records outside the browser pack. Do not expire any asset still referenced by an active release.

## Validation status

The first assembly passed the local production build/type check, scoped ESLint, asset-publication test and two agent/layout regression suites (20 tests). The complete asset/character gate includes the new leg-clearance check. Walking/running, the closest running pose, side/behind occlusion, whole-assembly toggle, energy preview, pause/scrub and Security/Forge switching were exercised. Initial running proximity and obscured camera composition led to the corrected mount and dedicated review presets. Browser warning/error capture was empty.

Responsive checks covered 320/390-pixel controls and a 1600-pixel desktop composition without horizontal overflow. These are desktop browser viewport checks, not physical-phone GPU results. At the warmed 862 × 562 canvas in the single-character Forge inspection, observed frame intervals were about 18 ms median / 35 ms p95 with the blade on; a separate blade-off observation was 20 / 36 ms. These uncontrolled samples do not establish a blade timing delta or certify the target budget. The review reports room-inclusive timing and submitted geometry so subsequent measurements can be compared under controlled conditions.

The three review angles keep the stationary character framed. The arm/body can still legitimately occlude the blade from the opposite side; recognizability across moving production cameras and authored carry poses is not signed off. Exact-commit hosted build/test status and preview links are recorded on PR #113 after deployment.

This review does not certify low-end/mobile GPU performance, crowded 10/24/100-worker rooms, main-play integration or owner art acceptance. Do not reuse the previous PR's test totals as results for this revision. The main-game agent fixture has separate checks; this bench remains a single character/equipment review.
