# CATHEXIS — first body and face intake

14 October 2026. Candidate intake, not an accepted rig or fitted assembly.

Review player: `/stepanoskin/loopforge/play/asset-review/cathexis`.
Generation kit: Game Design → Model briefs → CATHEXIS. The Agents tab and every character player link into the shared library.

## Files actually received

Eight Meshy FBX packages were found in Downloads and inspected with ufbx. Every export has one mesh/material and **zero skin joints and zero animation clips**. Original archive names, FBX hashes and bounds are recorded in `apps/lab/lib/loopforge/agents/cathexis-review.json`.

| Source | Source triangles | Viewer delivery |
| --- | ---: | --- |
| Body v1 master | 3,506,880 | Private source only |
| Body v1 50k | 51,123 | Source geometry; 5.63 MiB |
| Mask Grace master | 603,694 | Private source only |
| Mask Grace 3k | 3,058 | Source geometry; 0.75 MiB |
| Mask Grace 8k | 8,128 | Source geometry; 0.97 MiB |
| Mechanism Grimace master | 1,992,300 | Local 11,996-triangle inspection copy; 1.35 MiB |
| Mechanism Fury master | 2,123,714 | Local 11,986-triangle inspection copy; 1.45 MiB |
| Mechanism Distress master | 1,291,824 | Local 11,996-triangle inspection copy; 1.31 MiB |

The mechanical derivatives are inspection candidates. They are not Meshy delivery models and do not replace the retained masters. Only the selected GLB loads, and changing selection releases the previous one. No source FBX, ZIP or million-triangle model is shipped.

## Rendered visual review

All six runtime candidates were inspected in the production-built Babylon player with textured and shape-only views. Front, side and reverse views support these observations:

- The body preserves the porcelain/brass costume, open skirt, crown and mechanical heels. Its head still has a grinning skull surface. The teeth read strongly in the texture; shape-only inspection shows the underlying skull/nose/face volume. This is not yet a prepared recessed seat for interchangeable expression inserts. Clear or rework the overlapping surface during assembly.
- Grace has open eye holes, a hollow reverse and a raised upper mounting/strap shape. Both budgets preserve the silhouette. At close inspection, 3k is visibly more faceted around the cheek/forehead; 8k is smoother. Keep 3k as a lightweight candidate and 8k for close fitting tests until mounted camera comparisons establish the required budget. Neither is accepted on the character yet.
- Grimace is asymmetric; Fury has strongly lowered brows and an open mouth; Distress has raised inner brows and a downturned mouth. They read as distinct isolated expressions. The models are rigid single meshes, not mechanical jaw/brow rigs. The enlarged inspection does not establish their readability on a distant worker-facing character.
- Local simplification retains useful expression shapes; it is not a claim that every master detail survives. Exact sockets, rim alignment, mouth backing and half-shell compatibility still need a fitted test.

## Confirmed intake gaps

- Faces have approximately the same exported height as the entire body (about 1.90 m). They need physical scaling, orientation, pivots and mounting alignment. The isolated viewer normalizes every selected object to a 1.9-unit display height; this is explicitly **not shared anatomical scale**.
- The Body 50k and Grace 3k/8k packages do not contain normal maps. Their master packages do. Do not apply a master normal map to a remesh without establishing compatible UVs or rebaking it.
- No skeleton, skinning, Hot Walk or theatrical acting is present. There is no animation selector because there are no clips to play.
- The retained half-shell, other porcelain expressions and grime variants have not arrived. No split-face assembly or facial articulation is implemented.
- Head-seat, eye-aperture, mouth-cavity and layer-clearance acceptance needs an assembled model. Separate attractive objects do not establish compatibility.

## Inspection controls and evidence

Body, Grace 3k, Grace 8k, Grimace, Fury and Distress share the same player. Drag or use arrow keys to orbit, use scroll/pinch or the visible zoom buttons, and reset the camera. Front/side/back buttons rotate the subject; Grace comparison buttons retain camera pose and subject orientation. The body also offers a closer face-seat framing. Textured, untextured shape and wireframe modes reveal different issues. The inspection lamp can be disabled. Fixed Security and Lattice Forge CCTV presets remain available, with a warning that enlarged isolated faces do not prove mounted readability.

Each player uses the common six review gates and character navigation. Save review evidence exports asset revision/hash, source filename, camera pose, room, selected material mode, lamp setting, viewport and available frame counters. A static single-object scene is not a crowd or physical-device performance test.

## Reproduction and checks

1. Retain original FBX/texture ZIPs outside the runtime repository. Audit with `scripts/characters/static-fbx.c` linked against the same ufbx parser used by the character intake pipeline.
2. The static extractor bakes FBX geometry transforms into right-handed, Y-up meters and exports position, normal and flipped-V UV corner data. Source hashes and bounds accompany the binary geometry.
3. Run `scripts/characters/import-cathexis-review.mjs` with the private intake directory. It preserves body/Grace triangle counts, welds shared vertices, reduces mechanical faces to approximately 12k triangles, packs PBR maps, and publishes immutable hashed GLBs. Body texture delivery is 2048px; face textures are 1024px.
4. `scripts/characters/check-cathexis-review.mjs` verifies all six runtime hashes/byte counts, actual triangles, finite geometry/UV attributes, display bounds, expected normal-map presence, absence of rigs/clips, and zero glTF validation errors. It is included in the ordinary character/build checks.
5. Review the rendered surfaces and silhouettes before accepting any candidate. Then fit Grace and one mechanical face to the body, test eye/cavity clearances, and only then expand expressions and rig the character.

Current runtime pack: `loopforge-cathexis-review`, revision `522d72240362a6c4ce61cab6d36226fd3de2a539a6e61adcaee6bda844cc171f`.

## Viewer verification — 14 October 2026

The production build passed asset validation, TypeScript and prerendering. The four camera contract tests pass, including portrait zoom limits/reset and restoration of full-body limits; scoped ESLint passed. All six candidates rendered, textured/clay inspection worked, Grace switched at a fixed camera and native mouse dragging changed the orbit. Desktop plus 390px and 320px layouts were inspected; no horizontal overflow was observed. Narrow controls were expanded to full width. Runtime logs showed no viewer errors during the local check.

Screenshots are retained in the private `cathexis-intake/evidence` folder: body face textured/clay, Grace budgets, Grace profile, all three mechanical fronts and phone controls. These are development evidence, not additional public art assets.

Material and lamp changes explicitly invalidate scene readiness as well as the frame. This keeps the demand-rendered player drawing while replacement shaders compile, instead of leaving a blank model until the next camera gesture.
