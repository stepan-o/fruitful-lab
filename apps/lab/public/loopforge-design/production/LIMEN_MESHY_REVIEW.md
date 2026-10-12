# LIMEN Meshy model review — 12 October 2026

## Purpose and route

`/stepanoskin/loopforge/play/agent-test/limen` reviews the owner's Meshy export inside the real Security/Lattice Forge renderer. It is linked from the agent production test and the design Agents tab. This is a model/clip bench: it does not replace the cast in main play, run BDI decisions or invent inspection/contact animations.

The owner approved temporary app-hosted delivery while AWS resolves CloudFront account verification. The source stays private in S3. No CloudFront distribution, bucket policy or credential change is needed to run this test.

## Asset provenance and derivative

- Source: the private Loopforge source store, owner-provided Meshy LIMEN export dated 12 October 2026 (`limen_rigged.glb`). The storage address remains in private operational configuration.
- Source SHA-256: `5cf991bb1be950dae7d2ba92353488562b7c6c2742cdfc169eef5febe7b220ef`.
- Source 25,582,380 bytes; runtime 4,865,140 bytes (81% less).
- Geometry preserved: 41,326 triangles, one mesh/material, a 23-joint Mixamo skin.
- Supplied animations: Walking (1.083 s), Running (0.708 s), Rest (renamed from the short bind/rest clip). No finger joints or factory-contact clips are present.
- The embedded 4096² PNG becomes a 2048² JPEG, quality 88. This reduces the colour texture's approximate decoded RGBA+mipmap budget from 85.3 to 21.3 MiB. It does not reduce the geometry or animation data.
- Remove the source's full-body emissive colour-map assignment and invalid specular extension. Use a moderate constant metal/roughness response (0.35 / 0.6). This is a review material, not a completed PBR bake; the source contains no normal/roughness textures.
- All runtime dependencies are embedded. The immutable `loopforge-limen` pack is capped at 5 MB and records MIME, bytes, checksum and integrity metadata.

Rebuild from `apps/lab` using `node scripts/characters/import-limen.mjs /absolute/path/limen_rigged.glb`. The importer verifies the pinned source hash and publishes only the derivative. `npm run characters:check` validates the rig, named clips, finite accessors, weight sums, joint ranges, triangle count, texture dimensions, material and file budget. Khronos validation has zero errors and one inherited `NODE_SKINNED_MESH_NON_ROOT` warning; actual posed import must also be inspected in Babylon because that hierarchy warning is not an animation-quality guarantee.

## Review controls and boundaries

Rest/walk/run, play/pause, timeline scrubbing, quarter/half/full speed, front/side/back and continuous turning, camera distance, room selection, textured/clay/wireframe surfaces, original-art comparison and downloadable measurement records. The inspection lamp affects the character only and can be switched off to judge ordinary room light. No autoplay; reduced-motion users start with the same still. Hidden tabs pause the clip, offscreen canvases stop rendering, and navigation releases the model, animation observer, light and scene.

A single selected model is loaded lazily with an abortable, time-limited fetch, checksum enforcement and same-origin preview authentication. It does not load the previous cast. Clip playback is presentation time only; authored BDI/action timing, root motion, foot plants, blade/grip weighting and paired contacts need a separate integration pass after visual acceptance.

## Delivery migration

Current runtime URLs are relative immutable app files. Once CloudFront is ready, publish the same content-hashed file and manifest to the shared origin, configure CORS/cache behaviour, and move URL resolution at the asset boundary. Remove migrated binary copies from app output after deployment references are verified; changing URLs alone does not reduce deployment storage. Keep the master and pipeline/provenance records outside the browser pack. Do not expire any asset still referenced by an active release.

## Validation status

The local browser review covers body silhouette, supplied walk/run clips, frame scrubbing, rotation, surfaces and room framing. Owner art acceptance, contact animation, controlled device performance and full game integration remain open. Asset-publication tests, all 56 retained pack checks, semantic GLB checks, 20 agent/layout regression tests, scoped lint and the low-memory production build passed. Desktop and 320/390-pixel layouts, walk/run playback, keyboard scrub, art-dialog dismissal and room switching were reviewed locally. The full local Jest suite and a broader Loopforge UI run were interrupted after sustained CPU/memory growth with no completed-suite report; they are not claimed as passing. Plain repository-wide tsc also reports existing test-file type errors; the Next production type check passed. Runtime and validation results are recorded with the PR; this bench is not a claim that the production character is finished.
