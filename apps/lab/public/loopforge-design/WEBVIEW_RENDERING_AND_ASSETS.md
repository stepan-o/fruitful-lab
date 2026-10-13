# Webview: rendering, assets and delivery

**Character art review — 12 October:** the owner rejected the production-test bodies as clumsy, overly spherical and poorly textured. The import/action pipeline remains useful; its meshes are engineering stand-ins. The next pass is one deliberately modelled, UV-unwrapped and textured mechanical worker, reviewed as an actual animated asset before variants or supervisors. Blender-led authoring is recommended; image-to-3D is an optional starting-mesh experiment with the same cleanup and acceptance gates. See [the revised character direction](AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md#model-direction-reset-after-production-review).

**Current direction — 12 October 2026:** The world is prebuilt; all player construction and the night-zero installation tutorial are removed. First entry is the morning console and mandatory leadership call. [Agents: character, movement and contact](AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md) defines the next art/animation/BDI pipeline and supersedes earlier building references in this record. Main-play figures remain placeholders. The separate `/play/agent-test` review now supplies offline-authored GLB worker/LIMEN/STILETTO rigs, paired contacts and a bounded deterministic trace; general BDI and main-game integration remain open. See [the production-test record](production/AGENT_PRODUCTION_TEST.md).


**11 October — current first-turn integration:** Main play now uses a separately versioned first-turn kernel for night prebuilt-floor calibration → mandatory mandate → adviser/assignment → fixed-step room operation → paid permanent dispatch. One persistent Babylon scene supplies the room views. The old first-shift profile and standalone factory fixture remain regression/calibration tools. [Current implementation contract](FIRST_TURN_ENGINE.md) · [Execution checklist](FIRST_TURN_BUILD_PLAN.md). Earlier implementation descriptions below are historical where they conflict with this delivery.

**Next-build priority (11 October):** [Factory-floor scale, grain and motion](FACTORY_FLOOR_VISUAL_SCALE_PLAN.md) now defines the camera, material, movement and joint visual/performance gates. Calibrate one selected room’s three CCTV angles inside the producer console and its focused action workspace before expanding this kit or treating imported-model tooling as the immediate next milestone. This is a design proposal; it does not change the current renderer.

Updated 11 October 2026. Rendering direction and first native lobby kit; implementation status is explicit below. Reader chapter: `/stepanoskin/loopforge/architecture/webview`. First calibration case: [Lobby art direction](LOBBY_ART_DIRECTION.md).

## Decision

Keep Babylon.js for the shared factory world, rendered by default as one selected room through three authored CCTV angles in the producer console. Build a hybrid of authored materials, reusable 3D kits, baked static lighting and bounded live animation/light. Procedural code assembles and animates the world; authored artwork establishes each room's identity. Animation does not require every visible detail to be generated in code.

This updates the earlier aspiration for a wholly procedural visual world. The owner now explicitly allows painted walls and objects alongside modeled objects. The accepted spatial layout, physical scale, room connections and common 15 m height remain fixed. Visual calibration must not silently redesign them.

React/Next.js continues to own focused decision interfaces, semantic controls and documents. Babylon.js 9.30.0 is installed for the separate prebuilt-floor calibration study. No renderer replacement, framework upgrade or new render abstraction is justified by this pass. The imported-character path pins the matching Babylon 9.30.0 glTF loader. WebGPU can be evaluated later; it is not a prerequisite for the art direction or a promised speedup.

## Current code and proposed work

| Already implemented | Proposed next |
| --- | --- |
| Integer 20 Hz prebuilt-floor calibration kernel, local host and individual worker records | Economy/task records for pay claims, if gameplay design approves their rules |
| Shared spatial map, build/production camera, native lobby desk kit and authored lobby surfaces | Extend calibrated kits to the other rooms; imported model pipeline |
| Static mesh batching, instanced workers/belt, adaptive pixels, cached shadows, scoped desk lamps and idle/demand rendering | Room/bay visibility and detail tiers verified against representative camera movement |
| Immutable image/audio/JSON and embedded GLB releases on Vercel CDN; character model/rig validation | KTX2/texture asset support and broader room-prefab dependency validation |
| Authored console images and a navigable hybrid lobby calibration | Complete task-driven room behaviour and remaining authored rooms |

The character production test added explicit embedded GLB model entries and semantic validation. KTX2 remains future work. Do not hide unsupported texture containers in image/JSON entries or imply the image optimizer can author game materials. The original native room kit still uses image entries.

## Model, paint or animate

Use real geometry when an element changes the silhouette, occludes a worker, defines navigation, can be modified or casts an important moving shadow. Use surface textures for small detail that stays attached to the same face. Use a normal map for shallow relief, not a replacement for a large protruding pipe or doorway.

Painted elements are world-space materials or decals, not graphics fixed to the viewport. Default observation uses three authored room angles; construction and inspection may provide bounded orbit/pan/zoom. A single camera-projected concept image would break across these viewpoints. Reconstruct the concept’s structure and previously unseen faces coherently. Console → focused action → console is the recurring navigation; watching those feeds is not the main source of player agency.

Author bevels and a few irregular silhouettes on hero objects. Bake high-detail modeling/procedural materials offline into low-complexity meshes and texture maps. Avoid one mesh/material per bolt or form. Repeated furniture uses shared kits; custom slots preserve wear, labels and individual task state. Do not merge a modifiable desk permanently into its wall.

## Lighting and materials

The first test should use a small, controlled material family: albedo, tangent-space normal, packed occlusion/roughness/metalness, and emissive masks where needed. Painted linework and wear carry the illustrated feel; roughness and selective specular response retain weight. Do not make all surfaces polished brass. Preserve readable dark values on a phone instead of hiding missing detail in black.

Bake static indirect light and fixed-architecture occlusion to a separate, non-overlapping lightmap UV set. Keep task/action light dynamic. Do not bake the shadows of movable desks, robots or upgrade attachments into the floor. Use local object AO, economical contact treatment and selected dynamic casters. A replacement desk must not reveal its predecessor's shadow. Night/morning changes require separable light contributions or authored lighting variants; avoid a single permanently lit colour texture that resists all relighting.

All lamp geometry, illuminated surface and shadow direction must share the same source transform. A beacon impulse can affect the nearby wall, robot and desk. Limit casters and receiver area before adding resolution. No blanket volumetric fog, screen-space reflections or expensive full-screen AO by default. Small local dust/steam effects must earn their overdraw.

## LIMEN: character identity at CCTV scale

[LIMEN’s blade](LIMEN_BLADE_DESIGN.md) is the primary cue for recognizing him in a dark camera feed. Keep a rigid textured housing, a narrow luminous core and a few shader-driven cyan braids. Reserve sparks, trails and brightness surges for visible action phases. Reuse the room bloom; any local spill light has a small receiver scope and must earn its cost. Identity survives low-detail and reduced-motion modes through shape, asymmetric placement and contrast, with correct wall/body occlusion. It must not depend on sound, a name badge or a hidden-stat glow.

The review bench now assembles the 42,354-triangle v2 body, 4,994-triangle housing and 672-triangle procedural energy mesh. Meshoptimizer and MikkTSpace run offline; the housing retains reduced source material maps rather than claiming a new high-to-low bake. Two integrity-pinned GLBs total 5.49 MB. Energy uses one opaque draw and the existing bloom, with no extra light or particle allocation. Three subject-centered CCTV-scale presets are review cameras, not replacements for the game feeds. Contact effects, crowd/device performance and owner acceptance remain open. Sources are private in S3; optimized files remain temporarily app-hosted.

## Asset contract and CDN

12 October: S3 is the selected source store and CloudFront the intended runtime CDN; account verification is still pending. The owner approved temporarily shipping the optimized 4.87 MB LIMEN GLB with the app. Its separate lazy review uses the existing Babylon loader and checksum manifest. See [LIMEN model and delivery contract](production/LIMEN_MESHY_REVIEW.md).

Preserve the current release model documented in `apps/lab/assets/README.md`: optimized bytes → content-hashed files → immutable manifest → short-cached pointer. Files/manifests use one-year immutable caching; pointers use 30-second browser / 60-second edge freshness plus 30-second edge stale-while-revalidate. A CDN improves delivery, not draw calls or GPU memory.

Extend the schema deliberately for render assets. Each room package should declare:

- Stable logical IDs, pack/schema version and renderer compatibility.
- File hash, MIME, byte size, dimensions or geometry counts and dependency hashes.
- Metre units, coordinate convention, pivot, bounds and material slots.
- Texture role, colour space, mip chain and supported quality/fallback variants.
- Animation clips and semantic attachment points: worker seat, hand contact, paper output, lamp, queue entrance.
- Source artwork, modeling/generation provenance and reproducible export recipe outside the public runtime pack.

GLB is the implemented character interchange format and the proposed room-model format. Keep large shared textures reusable across kits. KTX2 is the proposed runtime GPU-texture container; assess encoder mode and actual transcoded quality separately for colour and normal/data maps. Use sRGB for colour and linear handling for data maps. A download-small WebP is still expanded when used as a GPU texture. At 2048², one uncompressed RGBA8 texture is about 16 MiB before mipmaps, roughly 21.3 MiB with a full mip chain; several material maps multiply that cost.

Use lossless intermediate maps and inspect compressed normals, linework, lettering and gradients. Do not blindly run every material map through the reader's lossy WebP recipe. Self-host matching decoder resources or pin their trusted origin; account for decoder startup and memory in measurement.

Publish and verify every dependency before switching the pointer. Pin a complete compatible release for the current scene; adopt updates at a safe scene boundary. Keep prior releases and provide rollback through a new deployment containing both versions. Failed downloads leave the previous complete kit or a legible fallback, never a room with missing walls or blocked input. Private snapshots, credentials and personalized results are not public asset cache entries.

Load the first selected room plus the shared worker kit; the prebuilt game starts at the producer console. Fetch detailed rooms on selection/unlock, not all at startup. Use a bounded cache for revisits and a lightweight whole-floor summary. One engine and room graph supply all three camera passes; update simulation and poses once, and budget total passes/targets rather than treating each feed as a separate allowance. On small screens render only the active angle. Keep loading and camera choice independent of simulation tick ownership.

Track retained deployment storage separately from download traffic and GPU memory. Shipping the public media library inside every preview also retains that deployment's static output. Batch preview publishing, audit output size and review retention of obsolete previews while preserving active reviews, production and needed rollback releases. Migrate to the selected shared S3/CloudFront origin so code deployments reference versioned assets instead of carrying the whole library, once verification is resolved. An external origin still needs dependency validation, cache rules and a retention policy; it is not a substitute for them. See [Vercel deployment storage](https://vercel.com/docs/deployment-storage). No storage deletion or hosting migration is performed by this pass.

## Babylon-specific optimization order

1. Record a baseline before increasing detail: first useful frame, input response, CPU/GPU frame time, draw calls, material switches, texture memory, shadow passes and transfer bytes.
2. Chunk static geometry by room or bay and material so hidden chunks can be excluded. Preserve separate nodes for modifiable furniture and articulated parts.
3. Instance repeated static kits. Thin instances reduce scene-object overhead but share visibility bounds; do not put the entire factory in one batch. Use ordinary instances or explicit objects when frequent removal, independent visibility or control makes them appropriate.
4. Share texture atlases/trim materials. Add mipmaps and detail tiers. Preserve hero surfaces at working distance; remove unseen geometry, distant microdetail and expensive secondary shadows first.
5. Budget live light and transparent effects. Keep the current hidden-tab suspension and reduced-motion controls. Frozen materials/matrices apply only to genuinely static compatible objects, not blindly to animated or swapped resources.
6. Keep render interpolation and GPU buffer updates outside React. Publish UI readouts at a bounded frequency. A room swap must dispose meshes, textures, observers and audio without leaking or discarding still-shared assets.

A 30 fps floor is an initial acceptance target on the agreed modest test device, with 60 fps desirable on capable desktop hardware. Measure frame-time tails and long stalls, not only average fps. The 11 October lobby pass sampled 30 fps at 1280 × 720 with 10 workers and after a 100-worker shift on Intel HD Graphics 620; the active 100-worker conveyor also sampled 30 fps. These are local samples, not frame-time-tail or physical-phone certification; see `LOBBY_VISUAL_PASS_2026-10-11.md`. Start with 10 workers and then 100, including queues, camera movement, room changes and light impulses. Reserve browser/UI headroom within the 33.3 ms frame interval rather than spending it all on rendering.

Test desktop and 320/390/768 CSS-pixel layouts, actual touch hardware where available, cold/warm load, hidden/resumed tabs, motion disabled and repeated asset/room swaps. Report device, viewport, DPR, internal render resolution, quality tier and memory observations. Frontend optimization is the main present workstream; deterministic routing/systems must still be profiled as worker counts and tasks grow.

## Simulation boundary

Stable IDs and plain records own worker position, task, workstation, claim and payment. Babylon handles own no balances or deadlines. A viewer maps permitted state/events to animation; a completed writing clip cannot award money. Cosmetic variation can use a deterministic visual seed without altering simulation RNG. Important task/queue outcomes come from records, not decorative random loops.

Render asset version and simulation/schema version are separate. Changing a desk's texture must not invalidate a run. Changing its footprint or work capacity is a gameplay configuration change with explicit validation and admission. The same state can be presented by a simple inspection view, Babylon or a future renderer.

## Sources and interpretation

Checked 10 October 2026. These official sources establish available techniques; the proposed budgets, room composition and choices above are Loopforge recommendations, not measured results.

- [Babylon: baked lighting](https://doc.babylonjs.com/guidedLearning/lightmaps/) — separate material and lightmap UVs.
- [Babylon: thin instances](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances/) — object overhead, shared visibility and update tradeoffs.
- [Babylon: KTX2](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/ktx2Compression/) — transfer compression versus GPU-resident compression.
- [Blender: render baking](https://docs.blender.org/manual/en/latest/render/cycles/baking.html) — offline material, normal, AO and lighting baking.

## Current calibration and next gate

The first lobby kit now has five desk bays, two staged seated clerks, a wall of forms, the floor emblem and a modeled doorway/pipe assembly. Hall, close and orbit views, paper cues and a swapped feeder were inspected in the production renderer. Evidence and measured limits are in `LOBBY_VISUAL_PASS_2026-10-11.md`. Owner review is the next art-direction gate before extending this pattern to other rooms. Queues, actual claim tasks and their lighting feedback still require simulation records; payroll rules remain a separate design task.

## Local preview memory discipline — 11 October

The 12 GB development machine experienced a kernel OOM kill of the Codex/ChatGPT process during this pass. This is evidence of host memory pressure, not proof that a scene alone leaked. Keep one task preview running; do not run a development compiler and production build together. Preserve other workstreams and user browser sessions.

From `apps/lab`, `npm run floor:build` opts into one build worker, a 1,536 MiB Node heap limit and a 768 MiB Turbopack cache target. `npm run floor:preview` serves the production output on port 3191 with a 512 MiB Node heap limit. Stop that preview before rebuilding. These are bounded-memory aids, not hard limits on all native/GPU allocations. Normal Vercel builds retain their existing defaults. The first bounded compilation took 29.9 seconds; the earlier memory-pressured compilation took 2.2 minutes. These are observations from different warm/cache conditions, not a controlled speedup benchmark.

The viewer retains hidden-tab suspension. Quiet scenes draw at about 30 Hz; camera interaction and running production are uncapped. A stopped scene with motion disabled draws only on state, camera, resize or resource changes. Local desk lights are restricted to their desk meshes and disabled outside the lobby. Rendering cadence never changes the 20 Hz kernel clock.

## Production asset review — 13 October

Game Design → Agents links to `/stepanoskin/loopforge/play/asset-review`. A typed catalog identifies each subject and revision; the review loads one explicit character/equipment adapter in the real renderer. LIMEN, Worker 01 and STILETTO now share model navigation and six explicit review gates: body/materials, equipment/effects, motion, contacts, factory/CCTV readability and performance. Gate acceptance is per slice, not a whole-character approval. The library includes Cathexis, Rivet Witch and Thrum as awaiting-model entries. Each current adapter retains its specialized controls. The next intake should extract a common player shell instead of copying a full viewer. The contract, required provenance, evidence and capability gaps are in `production/CHARACTER_REVIEW_STRUCTURE.md`. Arbitrary source GLBs are not exposed.

LIMEN’s new emitter-check idle is authored and baked offline (331 poses, nine rotation tracks, 11 seconds). Browser work is quaternion interpolation plus the existing single energy shader draw. Pure cosmetic cues drive shutdown, two bounded partial-power attempts and restart from the same clock. Four-times-faster braid displacement and independent jade/cyan/blue/violet tonal shifts stay independent of simulation truth. Tone targets use a time/strand hash in the vertex shader, with smooth interpolation and a stable pale-cyan core. Pausing and reduced effects freeze the colour/motion clock; no extra mesh, draw, texture or light is added. Blender has not been used for this pass; use it for fingers, armour weights and precise contacts. Existing accepted Meshy geometry and the forearm socket are preserved. See `production/LIMEN_MESHY_REVIEW.md`.
