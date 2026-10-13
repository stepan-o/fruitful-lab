# Producing room assets and prefabs

**Character art review — 12 October:** the owner rejected the production-test bodies as clumsy, overly spherical and poorly textured. The import/action pipeline remains useful; its meshes are engineering stand-ins. The next pass is one deliberately modelled, UV-unwrapped and textured mechanical worker, reviewed as an actual animated asset before variants or supervisors. Blender-led authoring is recommended; image-to-3D is an optional starting-mesh experiment with the same cleanup and acceptance gates. See [the revised character direction](AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md#model-direction-reset-after-production-review).

**Current direction — 12 October 2026:** The world is prebuilt; all player construction and the night-zero installation tutorial are removed. First entry is the morning console and mandatory leadership call. [Agents: character, movement and contact](AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md) defines the next art/animation/BDI pipeline and supersedes earlier building references in this record. Main-play figures remain placeholders. The separate `/play/agent-test` review now supplies offline-authored GLB worker/LIMEN/STILETTO rigs, paired contacts and a bounded deterministic trace; general BDI and main-game integration remain open. See [the production-test record](production/AGENT_PRODUCTION_TEST.md).


**Next-build priority (11 October):** [Factory-floor scale, grain and motion](FACTORY_FLOOR_VISUAL_SCALE_PLAN.md) now defines the camera, material, movement and joint visual/performance gates. Calibrate the active work area before expanding this kit or treating imported-model tooling as the immediate next milestone. This is a design proposal; it does not change the current renderer.

Updated 11 October 2026. Production pipeline proposal, with a native lobby kit now implemented. Companion: [Webview rendering and assets](WEBVIEW_RENDERING_AND_ASSETS.md). The native kit is a first production path, not a functioning model-generation/export pipeline.

## What is missing

We have image publication/CDN delivery and a native Babylon lobby recipe with shared surfaces, desk sockets and articulated parts. The character production test now implements a first imported-model path: reproducible offline geometry, embedded surface maps, 17-joint rigs, seven clips, GLB validation, immutable publication and an in-engine contact bench. Broader equipment prefab sockets, a Blender workflow and art approval are still open. Earlier desk/wall milestones below describe the room pipeline, not the character test.

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

The owner is moving asset storage to S3 with CloudFront delivery to avoid repeating binary libraries in code deployments. CloudFront account verification is pending. LIMEN’s private source is already in S3; the owner explicitly approved a temporary optimized app-hosted `loopforge-limen` pack. Keep the immutable manifest contract and migrate delivery at the asset boundary once the CDN is ready. Remove migrated files from deployment output as well as changing URLs. See [LIMEN Meshy review](production/LIMEN_MESHY_REVIEW.md).

## LIMEN body and blade production slice

The owner supplied a separate rigged v2 body and unrigged blade. Both masters and the optimized body review copy are verified in private S3; the prior source is retired, while runtime migration remains separate. [The blade contract](LIMEN_BLADE_DESIGN.md) defines the next deliverable: a light housing mesh and baked maps, calibrated forearm socket, procedural energy geometry/material, bounded action effects and versioned dependencies. The source blade has 1,145,974 triangles and is not a runtime payload. The first importer now trims modeled energy from this exact revision, simplifies the housing to 4,994 triangles, retains three 1024² material maps and generates MikkTSpace tangents. It publishes two immutable GLBs totaling 5.49 MB. The recipe checks source hashes and is not a general segmentation tool or a new material bake. The review assembles these with procedural energy; contact actions and full CCTV/crowd acceptance remain open. No additional owner-generated source art is currently needed.

## First package and gates

Build one pay-claim desk with an alternate attachment, stool/lamp/terminal, paper/stamp animation, one forms-and-pipes wall bay and a floor-emblem surface. Two desk instances prove reuse; one worker proves contact.

Automated checks cover GLB validity, resource/hash integrity, scale/bounds, sockets/clips and invalid-input rejection. Runtime checks cover first load, repeated create/dispose, failed/slow resources, room transition, attachment swapping, 10/100 workers and memory growth. Visual checks compare original art, light sweeps, three-quarter/rear/top views and phone readability. A similarity score is not artistic approval.

First complete one source → export → inspect → publish cycle. Then automate repeatable work and expand the kit. Art authoring/calibration is likely the main effort; packaging cannot compensate for weak art. Estimate broader production after the first kit establishes actual authoring time, download size, GPU memory and frame cost.

## Delivery boundary

The first `lobby.pay-claim-desk` is a reproducible Babylon recipe, versioned as `lobby-claim-hall/1`. `spatial/lobby.ts` records dimensions, sockets and placements; `lobby-scene.ts` assembles five instances and animates two staged clerks. Its four authored image surfaces use the existing `loopforge-lobby` immutable pack. Original PNGs and provenance stay outside runtime delivery. The feeder is a separately toggleable attachment. This establishes an inspectable native kit without prematurely extending the asset schema.

For the room kit, Blender authoring, KTX2 and the broader prefab compiler remain unimplemented. The later character test supplies the pinned GLB loader, imported-model validation, clip metadata and a reproducible offline export recipe; its rejected geometry is not an art-approved prefab library. Payroll economics remain separately designed. The current calibration does not claim queued worker tasks or live settlement. See [the visual-pass record](LOBBY_VISUAL_PASS_2026-10-11.md).

Primary references checked 10 October 2026: [Blender to Babylon via glTF](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/Blender_to_glTF), [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator), [Babylon KTX2](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/ktx2Compression/). Verify behavior against pinned export/runtime versions when implementing the first kit.

For the LIMEN slice, the owner can supply targeted Meshy revisions. Inspect the current master first; request a housing-only revision if separation, mounting or silhouette fails. Procedural energy remains a renderer effect, independent of generated mesh detail. See [the blade contract](LIMEN_BLADE_DESIGN.md#targeted-meshy-regeneration-is-available).

## Production asset review — 13 October

Game Design → Agents links to `/stepanoskin/loopforge/play/asset-review`. A typed catalog identifies each subject and revision; the review loads one explicit character/equipment adapter in the real renderer. LIMEN is the first production entry, with concept comparison, idle/walk/run, seekable action beats, three CCTV-scale angles, reduced effects and evidence download. Future assets require compatible rigs/materials and acceptance checks; arbitrary source GLBs are not exposed.

LIMEN’s new emitter-check idle is authored and baked offline (331 poses, nine rotation tracks, 11 seconds). Browser work is quaternion interpolation plus the existing single energy shader draw. Pure cosmetic cues drive shutdown, two bounded partial-power attempts and restart from the same clock. Turquoise/ice-blue braid variation stays independent of simulation truth. Blender has not been used for this pass; use it for fingers, armour weights and precise contacts. Existing accepted Meshy geometry and the forearm socket are preserved. See `production/LIMEN_MESHY_REVIEW.md`.
