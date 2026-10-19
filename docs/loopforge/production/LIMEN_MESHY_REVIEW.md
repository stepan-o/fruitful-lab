# LIMEN character and motion review

## New motion intake — 19 October 2026

The LIMEN viewer now offers two explicit model/motion banks. **New source** opens paused on Shouting Angrily and includes all 17 newly downloaded takes. **Approved assembly** retains the accepted 42k body, walk/run and authored emitter-check idle. The source candidate is not a replacement for the game performer: it is a different 9,752-triangle body with 80 skin joints, animated finger chains and up to eight influences per vertex.

The 17 takes are Agree Gesture, Air Squat, Alert, All Night Dance, Angry Ground Stomp, Arise, Axe Breathe and Look Around, Axe Spin Attack, Boxing Warm Up, Confident Strut, Confused Scratch, Idle 02, Idle 11, Injured Walk, Shouting Angrily, Shrug and Stand and Chat. `Idle_1.zip` actually contains **Idle_02**; the viewer uses the internal clip name. Each archive contains a fully skinned animated FBX and PBR maps. All 17 animated bodies share the inspected geometry, bind pose and skin weights. No standalone worker recovery take or Right Hand Sword Slash was present.

One derived GLB holds one body and all 17 clips: **10,391,048 bytes / 9.91 MiB**, SHA-256 `730fcb9d3bbce10e59ed343d2de4dd34a49e7a1d112d82a078152d74dcd2d2cd`. Embedded maps are 2048² colour/normal and 1024² metallic/roughness; normal and metallic/roughness JPEGs use 4:4:4 chroma. The source helper icosphere is omitted from rendering. Clips are sampled from the FBX at 30 Hz with their source transforms retained, then resampled with a 1e-6 tolerance. Generated tangents and normalized weights pass the glTF validator with zero errors and warnings.

`prepare-limen-motions.py` converts inspected `fbx-motion-dump.c` / ufbx v0.21.3 dumps into the consolidated source GLB. `import-limen-motions.mjs` prepares maps, tangents and the immutable asset pack. `check-limen-motions.mjs` checks the delivered hash/size, all 17 names, skeleton, skin, finite arrays, map presence and 9,752-triangle budget. The full-resolution source archives stay outside the app deployment. This is an offline conversion; there is no FBX parser or animation authoring solver in the player.

The review provides play/pause, scrub and seconds controls, speed, an explicit repeat option, front/side/back/orbit, factory rooms and CCTV views. Non-repeating clips hold their last frame. Hidden tabs pause. Switching banks disposes the previous assembly; only the selected bank and shared emitter are loaded. The new rig uses the existing physical forearm socket offset, converted to metres, as a **candidate** fit for visual inspection. Accepted palette and reduced-energy controls work in both banks.

Review notes remain visible beside each motion. Shouting Angrily is a warning candidate. Axe Spin Attack has a large windup/spin and needs paired contact and blade-path cleanup before use as the doorway strike. Arise starts with its hips about 1.95 m below the source floor and does not finish standing; the viewer deliberately preserves this defect. Confused Scratch and Agree Gesture also have visible contact/translation considerations. Showing a source clip does not certify clearance or assign an engine capability. The Day 1 strike, worker collapse, recovery and limp still need a coordinated scene pass.

Validation: all 17 takes rendered in the actual factory viewer with no browser errors. Desktop, 390 px and 768 px layouts passed; play/pause, seconds/frame scrubbing, one-shot end hold, repeat, CCTV, surfaces, blade toggling and switching both banks passed. Network inspection confirmed the inactive body bank is not eagerly fetched. The embedded-asset validation, five existing camera tests, scoped lint and complete production build passed. These checks establish preview operation, not animation-contact or device-performance acceptance.

## Approved palette transfer — 19 October 2026

The shared `loadLimen` model applies the accepted comparison-studio pale steel (`#AAB9BD`, 100%) by default. The existing luminance mask preserves texture wear and deep mechanical recesses. Cyan source markings are distinguished by colour and shifted to `#08798B`; this is an approximate material mask, not a newly authored armour texture.

The opaque energy shader uses a deeper teal-cyan core and darker jade/cyan/blue/violet strands. Its timing, displacement, idle shutdown/restart and reduced-motion behaviour are unchanged. The body GLB, emitter housing, rig, animation curves and scale are unchanged. This adds no maps, geometry, lights or draw calls; it adds a small amount of work in the existing shaders.

The animation viewer starts with the approved palette, provides an original-model colour comparison, and links the accepted concept sheet. The static readability studio reuses the same body material plugin, so Original restores the source appearance and Treatment applies paint only once. Clay inspection bypasses paint and restores the chosen palette when textures return. Saved review evidence includes the palette selection and colour definition. The palette is applied by the application; downloading the unchanged source GLB alone does not include it.

Validation for this transfer is recorded in PR #125. Earlier performance numbers below are historical; this visual change is not a new device-performance acceptance result.

## Purpose and route

`/stepanoskin/loopforge/play/agent-test/limen` reviews the owner's Meshy export inside the real Security/Lattice Forge renderer. It is linked from the agent production test and the design Agents tab. This is a model/clip bench: it does not replace the cast in main play, run BDI decisions or simulate worker contacts. An authored emitter-maintenance idle is now included as cosmetic acting.

The owner approved temporary app-hosted delivery while AWS resolves CloudFront account verification. The source stays private in S3. No CloudFront distribution, bucket policy or credential change is needed to run this test.

## Current source revision — body and separate blade

The owner regenerated LIMEN with the blade removed from the body and supplied a separate energy-blade prop. Both masters, the optimized body review copy and source provenance are uploaded and checksum-verified in private S3. The current source record selects `meshy-2026-10-12-v2`. The former source is marked retired and archived; its former object location remains because the scoped publisher cannot delete it. Bucket details remain private.

| Asset | Current source / review status |
| --- | --- |
| Body v2 | 24,184,936 bytes; SHA-256 `2085f27c0264c417b876ee038919175712fd7fcc02c6c2601c1b2d65325a0ad4`; 42,354 triangles and 23 Mixamo joints. Local walk/run review is usable for the next pass. No finger bones or source idle; the review supplies a separate baked maintenance clip. Minor soft armour deformation remains. |
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

Idle/rest/walk/run, play/pause, scrubbing, speed, turn, room, surfaces, original art and measurement download remain available. New controls switch the whole blade assembly on/off, preview a half-second energy surge and select close inspection or three elevated CCTV-scale framing presets. Those presets frame this stationary subject; they do not change production cameras. The inspection lamp remains optional.

No autoplay. Reduced motion freezes braid displacement, removes surge/flicker and preserves the slow power-down/restart. The review can force reduced effects without overriding a system request for reduced motion. Pausing freezes both clip and cosmetic clock; the body scrubber does not seek a world action timeline. Hidden tabs pause and offscreen canvases stop rendering. Navigation/failed loads dispose containers, shader, light and scene. The main-play cast, game state and simulation random stream are unchanged.

The manual surge is a labelled preview, not a fabricated intervention. Event-keyed contact sparks, trails, spatial audio, authored carry/interaction clips and full game integration remain to build. No new Meshy source is required for this assembly review.


## Emitter-check idle and review library — 13 October

The owner accepted the existing blade/body clearance and prefers energy flowing from the forearm. Keep body, housing and calibrated socket unchanged. The new 11-second idle plants the feet, raises the emitter, looks along it, powers down, brings the opposite hand to the housing, attempts two small restarts, reignites and lowers the arm. It uses wrist/hand contact; the source has no articulated fingers. This is prototype acting, not a finished finger-operated control animation.

`build-limen-idle.mjs` solves the arm poses offline against the pinned body hash and bakes 331 frames / nine rotation tracks (~113 KiB JSON). The browser resets the base joint pose and interpolates those rotations with reused scratch quaternions. The authored clip and pure power cue share an 11-second timeline; pause, seek, speed and loop endpoints agree. Build validation checks exact regeneration, finite normalized quaternions and loop closure. The source GLBs and supplied walking/running tracks are unchanged.

Energy uses the existing single 672-triangle draw. A narrower core exposes thicker, displaced braids with four-times-faster displacement and faster outward brightness packets. Each strand independently shifts through jade, cyan and electric blue, with occasional violet, around a steady pale-cyan core. Time-hashed tonal targets interpolate in the vertex shader; pause/seek reproduces a pose and its colours without CPU random draws. Geometry, displacement bounds and draw count remain unchanged. Two localized partial-power attempts occur during adjustment; the core retracts to its emitter when off. Reduced effects remove those attempts and strand motion. No added light, transparency pass, particle pool or simulation random calls.

`/stepanoskin/loopforge/play/asset-review` is the production review library, linked from Game Design → Agents and the engine webview chapter. The typed catalog records stable subject IDs, revisions, review routes and acceptance checks. LIMEN is its first production subject. Each future candidate needs an explicit adapter for its rig/equipment, named clips and references; the catalog is not an arbitrary-file viewer. A player opens one assembly, uses the real factory renderer and records camera, clip, effects, immutable file hashes and room-inclusive performance. The engineering crowd/contact fixture remains separate and clearly labelled.

Blender has not been used for this idle pass. Meshy supplied the mesh/rig; the offline authoring script bakes poses, and Babylon renders them. Use Blender for precise contacts, finger rigging, armour skin weights and mesh/material corrections. Request another Meshy generation only when an identified shape problem warrants it, or for the next character. Do not bake animated energy into a generated model.

## Earlier v1 record

The first review used a 41,326-triangle body with modeled blade, source SHA-256 `5cf991bb1be950dae7d2ba92353488562b7c6c2742cdfc169eef5febe7b220ef`, 25,582,380 bytes and a 4,865,140-byte derivative. The owner accepted the body/clip direction but reported blade/leg crossing, motivating the separate body and equipment workflow. It is retained as provenance, not the active candidate.

## Delivery migration

Current runtime URLs are relative immutable app files. Once CloudFront is ready, publish the same content-hashed file and manifest to the shared origin, configure CORS/cache behaviour, and move URL resolution at the asset boundary. Remove migrated binary copies from app output after deployment references are verified; changing URLs alone does not reduce deployment storage. Keep the master and pipeline/provenance records outside the browser pack. Do not expire any asset still referenced by an active release.

## Validation status

The first assembly passed the local production build/type check, scoped ESLint, asset-publication test and two agent/layout regression suites (20 tests). The complete asset/character gate includes the new leg-clearance check. Walking/running, the closest running pose, side/behind occlusion, whole-assembly toggle, energy preview, pause/scrub and Security/Forge switching were exercised. Initial running proximity and obscured camera composition led to the corrected mount and dedicated review presets. Browser warning/error capture was empty.

Responsive checks covered 320/390-pixel controls and a 1600-pixel desktop composition without horizontal overflow. These are desktop browser viewport checks, not physical-phone GPU results. At the warmed 862 × 562 canvas in the single-character Forge inspection, observed frame intervals were about 18 ms median / 35 ms p95 with the blade on; a separate blade-off observation was 20 / 36 ms. These uncontrolled samples do not establish a blade timing delta or certify the target budget. The review reports room-inclusive timing and submitted geometry so subsequent measurements can be compared under controlled conditions.

The three review angles keep the stationary character framed. The arm/body can still legitimately occlude the blade from the opposite side; recognizability across moving production cameras and authored carry poses is not signed off. Exact-commit hosted build/test status and preview links are recorded on PR #113 after deployment.

This review does not certify low-end/mobile GPU performance, crowded 10/24/100-worker rooms, main-play integration or owner art acceptance. Do not reuse the previous PR's test totals as results for this revision. The main-game agent fixture has separate checks; this bench remains a single character/equipment review.

### Idle refinement validation — 13 October

The bounded local run passes 3 suites / 24 tests, scoped ESLint, source/binary/clearance gates, exact idle rebake and the production build/type check. Visual review covered inspect, power-off, adjustment, reignition and return; front/side/three-quarter poses; all three CCTV presets; Security/Forge switching; the closest sampled running pose; walking playback after idle; reduced effects and 320/390/768/1600-pixel layouts. No horizontal overflow or browser warnings/errors were observed in these checks. Existing GLB hashes and mount calibration are unchanged.

The unlit Security view still loses too much body detail: the emissive blade survives, but the inspection lamp is needed to assess the metal silhouette reliably. Production room lighting/contrast and moving-camera crowd recognition remain open, as does physical-device profiling. Opposite-side body occlusion correctly hides the blade; this is not a universal visibility guarantee. The idle is a usable authored prototype on a rig without fingers, not a signed-off cinematic hand-contact animation.

### Energy v2 follow-up — 12 October, local time

Owner feedback asks for much faster energy and wider independent strand colours. Local production build/type checks, asset/character validation and scoped ESLint passed. Browser review covered a moving rest pose, idle power-off/restart, three CCTV presets across Security/Forge, reduced effects and a 390-pixel phone viewport. No browser shader warnings/errors were captured. Geometry and displacement bounds are unchanged; this is not a new crowded-room GPU certification. Exact hosted revision and CI results are recorded on PR #113.
