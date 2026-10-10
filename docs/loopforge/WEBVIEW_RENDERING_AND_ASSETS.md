# Webview: rendering, assets and delivery

10 October 2026. Recommended rendering direction; implementation status is explicit below. Reader chapter: `/stepanoskin/loopforge/architecture/webview`. First calibration case: [Lobby art direction](LOBBY_ART_DIRECTION.md).

## Decision

Keep Babylon.js for the navigable factory. Build a hybrid of authored materials, reusable 3D kits, baked static lighting and bounded live animation/light. Procedural code assembles and animates the world; authored artwork establishes each room's identity. Animation does not require every visible detail to be generated in code.

This updates the earlier aspiration for a wholly procedural visual world. The owner now explicitly allows painted walls and objects alongside modeled objects. The accepted spatial layout, physical scale, room connections and common 15 m height remain fixed. Visual calibration must not silently redesign them.

React/Next.js continues to own focused decision interfaces, semantic controls and documents. Babylon.js 9.30.0 is installed for the separate commissioning study. No renderer replacement, framework upgrade or new render abstraction is justified by this pass. Pin compatible loaders when imported models are introduced. WebGPU can be evaluated later; it is not a prerequisite for the art direction or a promised speedup.

## Current code and proposed work

| Already implemented | Proposed next |
| --- | --- |
| Integer 20 Hz commissioning kernel, local host and individual worker records | Economy/task records for pay claims, if gameplay design approves their rules |
| Shared spatial map, build/production camera, procedural room and machine geometry | Room-specific authored materials and reusable model kits |
| Static mesh batching, instanced workers/belt, adaptive pixel resolution, cached shadow maps | Room/bay visibility and detail tiers verified against representative camera movement |
| Immutable image/audio/JSON media releases on Vercel CDN | Typed GLB/model and KTX2/texture asset support, including dependency validation |
| Authored room images in the console | Fully navigable hybrid rooms, beginning with the lobby |

The media schema currently rejects GLB/KTX2. Do not hide those bytes in image/JSON entries or imply the existing image optimizer can author game materials. No such pipeline extension is implemented by this documentation change.

## Model, paint or animate

Use real geometry when an element changes the silhouette, occludes a worker, defines navigation, can be modified or casts an important moving shadow. Use surface textures for small detail that stays attached to the same face. Use a normal map for shallow relief, not a replacement for a large protruding pipe or doorway.

Painted elements are world-space materials or decals, not graphics fixed to the viewport. The factory retains shared orbit/pan/zoom controls. A single camera-projected concept image would break as the camera moves. Start from the concept's composition and reconstruct its visible structure; author previously unseen faces coherently. A cinematic default camera can favour the strongest angle without secretly disabling navigation.

Author bevels and a few irregular silhouettes on hero objects. Bake high-detail modeling/procedural materials offline into low-complexity meshes and texture maps. Avoid one mesh/material per bolt or form. Repeated furniture uses shared kits; custom slots preserve wear, labels and individual task state. Do not merge a modifiable desk permanently into its wall.

## Lighting and materials

The first test should use a small, controlled material family: albedo, tangent-space normal, packed occlusion/roughness/metalness, and emissive masks where needed. Painted linework and wear carry the illustrated feel; roughness and selective specular response retain weight. Do not make all surfaces polished brass. Preserve readable dark values on a phone instead of hiding missing detail in black.

Bake static indirect light and fixed-architecture occlusion to a separate, non-overlapping lightmap UV set. Keep task/action light dynamic. Do not bake the shadows of movable desks, robots or upgrade attachments into the floor. Use local object AO, economical contact treatment and selected dynamic casters. A replacement desk must not reveal its predecessor's shadow. Night/morning changes require separable light contributions or authored lighting variants; avoid a single permanently lit colour texture that resists all relighting.

All lamp geometry, illuminated surface and shadow direction must share the same source transform. A beacon impulse can affect the nearby wall, robot and desk. Limit casters and receiver area before adding resolution. No blanket volumetric fog, screen-space reflections or expensive full-screen AO by default. Small local dust/steam effects must earn their overdraw.

## Asset contract and CDN

Preserve the current release model documented in `apps/lab/assets/README.md`: optimized bytes → content-hashed files → immutable manifest → short-cached pointer. Files/manifests use one-year immutable caching; pointers use 30-second browser / 60-second edge freshness plus 30-second edge stale-while-revalidate. A CDN improves delivery, not draw calls or GPU memory.

Extend the schema deliberately for render assets. Each room package should declare:

- Stable logical IDs, pack/schema version and renderer compatibility.
- File hash, MIME, byte size, dimensions or geometry counts and dependency hashes.
- Metre units, coordinate convention, pivot, bounds and material slots.
- Texture role, colour space, mip chain and supported quality/fallback variants.
- Animation clips and semantic attachment points: worker seat, hand contact, paper output, lamp, queue entrance.
- Source artwork, modeling/generation provenance and reproducible export recipe outside the public runtime pack.

GLB is the proposed model interchange format. Keep large shared textures reusable across kits. KTX2 is the proposed runtime GPU-texture container; assess encoder mode and actual transcoded quality separately for colour and normal/data maps. Use sRGB for colour and linear handling for data maps. A download-small WebP is still expanded when used as a GPU texture. At 2048², one uncompressed RGBA8 texture is about 16 MiB before mipmaps, roughly 21.3 MiB with a full mip chain; several material maps multiply that cost.

Use lossless intermediate maps and inspect compressed normals, linework, lettering and gradients. Do not blindly run every material map through the reader's lossy WebP recipe. Self-host matching decoder resources or pin their trusted origin; account for decoder startup and memory in measurement.

Publish and verify every dependency before switching the pointer. Pin a complete compatible release for the current scene; adopt updates at a safe scene boundary. Keep prior releases and provide rollback through a new deployment containing both versions. Failed downloads leave the previous complete kit or a legible fallback, never a room with missing walls or blocked input. Private snapshots, credentials and personalized results are not public asset cache entries.

Load the lobby plus the shared worker kit first. Prepare adjacent Dispatch/Security as needed; fetch detailed later rooms on approach/unlock, not all at startup. Retain lightweight silhouettes for the whole-floor overview and use a bounded cache for revisited rooms. Keep loading independent of simulation tick ownership.

Track retained deployment storage separately from download traffic and GPU memory. Shipping the public media library inside every preview also retains that deployment's static output. Batch preview publishing, audit output size and review retention of obsolete previews while preserving active reviews, production and needed rollback releases. Before large model/material packs multiply this footprint, evaluate a shared immutable media origin so code deployments reference versioned assets instead of carrying the whole library. An external origin still needs dependency validation, cache rules and a retention policy; it is not a substitute for them. See [Vercel deployment storage](https://vercel.com/docs/deployment-storage). No storage deletion or hosting migration is performed by this pass.

## Babylon-specific optimization order

1. Record a baseline before increasing detail: first useful frame, input response, CPU/GPU frame time, draw calls, material switches, texture memory, shadow passes and transfer bytes.
2. Chunk static geometry by room or bay and material so hidden chunks can be excluded. Preserve separate nodes for modifiable furniture and articulated parts.
3. Instance repeated static kits. Thin instances reduce scene-object overhead but share visibility bounds; do not put the entire factory in one batch. Use ordinary instances or explicit objects when frequent removal, independent visibility or control makes them appropriate.
4. Share texture atlases/trim materials. Add mipmaps and detail tiers. Preserve hero surfaces at working distance; remove unseen geometry, distant microdetail and expensive secondary shadows first.
5. Budget live light and transparent effects. Keep the current hidden-tab suspension and reduced-motion controls. Frozen materials/matrices apply only to genuinely static compatible objects, not blindly to animated or swapped resources.
6. Keep render interpolation and GPU buffer updates outside React. Publish UI readouts at a bounded frequency. A room swap must dispose meshes, textures, observers and audio without leaking or discarding still-shared assets.

A 30 fps floor is an initial acceptance target on the agreed modest test device, with 60 fps desirable on capable desktop hardware. Measure frame-time tails and long stalls, not only average fps. Previous integrated-GPU samples were below a stable 30 fps; no current result establishes that the hybrid will pass. Start with 10 workers and then 100, including queues, camera movement, room changes and light impulses. Reserve browser/UI headroom within the 33.3 ms frame interval rather than spending it all on rendering.

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

## Next calibration gate

Finish one lobby bay: two desk instances, a seated worker, a short queue, a wall of forms, the floor emblem and the hero doorway/pipe assembly. Compare the same camera against the original art, then orbit and move close. Check normal operation, a staged paper problem, a lighting impulse and a swapped desk attachment. Only after both artistic and performance review should this kit spread across the whole lobby and become the pattern for other rooms. This is a visual test; payroll rules remain a separate design task.
