# Producing room assets and prefabs

10 October 2026. Implementation proposal for the first lobby kit. Companion: [Webview rendering and assets](WEBVIEW_RENDERING_AND_ASSETS.md). This is not an already functioning model-generation pipeline.

## What is missing

We have downstream image publication/CDN delivery and a procedural Babylon scene. We need the stages between concept art and a reliable game object: modeling, clean material maps, attachment/animation conventions, export, prefab validation and an in-engine review bench. The first milestone is one excellent desk and one wall bay.

| Stage | Output | Acceptance |
| --- | --- | --- |
| Art contract | Reference, silhouette/material sheet, scale, camera distances and visible states | Recognizable Loopforge construction |
| Authoring | Blender mesh/material source or reproducible geometry recipe; separate articulated parts | Correct bevels, back/underside, topology, seams and worker proportions |
| Baking | High-to-low normals/AO, authored colour/roughness and appropriate architectural lightmaps | Aligned maps; no duplicate shadows or painted reflections fighting live light |
| Prefab | Stable ID, visual dependencies, pivot, sockets, clips and detail tiers | Predictable assembly and state switching |
| Export | GLB, lossless intermediate maps and KTX2 quality variants | Units, axes, material channels and animation preserved |
| Validate/inspect | Khronos report, semantic checks and Babylon review scene | No missing resources, contact errors, invisible faces or lifecycle leaks |
| Publish | Typed render assets in the existing immutable release model | Complete, compatible packages with fallback and rollback |

Blender is recommended for offline modeling, procedural recipes, UVs, baking, rigging and GLB export. It was not found on the current shell PATH during review; toolchain setup remains work. Babylon's editor/sandbox can help inspect and light exports, but scene files must not own gameplay data.

Image generation can help author surface art and concept sheets. It cannot reliably produce aligned albedo/normal/roughness maps by requesting three unrelated images, or guarantee usable topology, UVs, a rig and correct unseen faces. Start these mechanical kits with controlled modeled parts and authored/baked surfaces. Generated meshes would need the same cleanup and gates.

## A prefab is more than a model

`lobby.pay-claim-desk` should contain a chassis/material set, detail variants, lamp/terminal/paper-feed attachment points, worker seat/feet/hand contacts, paper-feed/stamp animation names, inspection bounds and a versioned dependency list. A schema validates finite transforms, metre units, unique sockets and required clips. Verify the GLB loader's coordinate conversion before adding any axis correction.

Gameplay configuration separately owns footprint, approach slots, occupancy/capacity, installation rules and task duration. A stable equipment definition joins those facts to a visual prefab ID. Simulation never imports Babylon objects or GLB files. A texture/model change cannot silently change productivity or navigation. Workers and tasks retain identity when a visual attachment is swapped.

## Minimum engineering additions

1. Extend media schema, MIME/path allowlist and pack builder for models/textures while retaining all existing image releases. Hash optimized bytes; verify every dependency before activation.
2. Add a prefab compiler/validator for required sockets/clips, finite transforms, dependencies, quality variants and renderer compatibility. Keep rich authoring metadata outside lean runtime manifests.
3. Add the matching-version Babylon glTF loader and a lazy room/prefab loader with shared resources, bounded cache, cancellation, fallback and reference-aware disposal.
4. Pin authoring/export/encoding tools and preserve reproducible source recipes. Use official glTF validation plus project-specific checks. Geometry compression is optional until measured useful.
5. Add a local review route in the actual viewer: orbit, neutral/final light, bounds, worker contacts, animation states, attachment swaps, detail tiers and performance readouts.

No new CDN is needed for the first kits. Use the existing Git-backed immutable files on Vercel. Object storage becomes useful if binary churn/library size warrants it; the package contract should survive that move.

## First package and gates

Build one pay-claim desk with an alternate attachment, stool/lamp/terminal, paper/stamp animation, one forms-and-pipes wall bay and a floor-emblem surface. Two desk instances prove reuse; one worker proves contact.

Automated checks cover GLB validity, resource/hash integrity, scale/bounds, sockets/clips and invalid-input rejection. Runtime checks cover first load, repeated create/dispose, failed/slow resources, room transition, attachment swapping, 10/100 workers and memory growth. Visual checks compare original art, light sweeps, three-quarter/rear/top views and phone readability. A similarity score is not artistic approval.

First complete one source → export → inspect → publish cycle. Then automate repeatable work and expand the kit. Art authoring/calibration is likely the main effort; packaging cannot compensate for weak art. Estimate broader production after the first kit establishes actual authoring time, download size, GPU memory and frame cost.

## Delivery boundary

This pass documents the pipeline and adds the Webview reader chapter/reference gallery. It does not install Blender, add a model loader, extend the schema or ship a desk prefab. Existing art is enough to begin; no new user artwork is required. Payroll economics remain separately designed.

Primary references checked 10 October 2026: [Blender to Babylon via glTF](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/Blender_to_glTF), [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator), [Babylon KTX2](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/ktx2Compression/). Verify behavior against pinned export/runtime versions when implementing the first kit.
