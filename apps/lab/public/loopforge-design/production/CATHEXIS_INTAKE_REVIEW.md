# CATHEXIS — accepted v2 body and face intake

14 October 2026. Accepted body; fitted rigid-face candidates, not an accepted rig.

Review player: `/stepanoskin/loopforge/play/asset-review/cathexis`.
Generation kit: Game Design → Model briefs → CATHEXIS. The Agents tab and every character player link into the shared library.

Current handoff: the owner accepted body v2 and its repaired rear skirt on 14 October 2026. The public viewer contains only v2, per the owner’s request to drop superseded bodies. Start the staged rig test in Model briefs; the normal map matched to the 50k delivery still needs exporting. Static face fitting is available; moving costume and face clearance remain open.

## Files actually received

Eight Meshy FBX packages were found in Downloads and inspected with ufbx. Every export has one mesh/material and **zero skin joints and zero animation clips**. Original archive names, FBX hashes and bounds are recorded in `apps/lab/lib/loopforge/agents/cathexis-review.json`.

| Source | Source triangles | Viewer delivery |
| --- | ---: | --- |
| Body v2 master | 3,403,416 | Private source only |
| Body v2 50k | 51,034 | Accepted source geometry; 5.43 MiB |
| Mask Grace master | 603,694 | Private source only |
| Mask Grace 3k | 3,058 | Source geometry; 0.75 MiB |
| Mask Grace 8k | 8,128 | Source geometry; 0.97 MiB |
| Mechanism Grimace master | 1,992,300 | Local 11,996-triangle inspection copy; 1.35 MiB |
| Mechanism Fury master | 2,123,714 | Local 11,986-triangle inspection copy; 1.45 MiB |
| Mechanism Distress master | 1,291,824 | Local 11,996-triangle inspection copy; 1.31 MiB |

The mechanical derivatives are inspection candidates. They are not Meshy delivery models and do not replace the retained masters. Assembly mode keeps the body loaded and fetches only the selected face; switching releases the prior face. Separate-parts mode loads only its selected GLB. No source FBX, ZIP or million-triangle model is shipped.

## Rendered visual review

The initial six runtime candidates were inspected in the production-built Babylon player with textured and shape-only views. Front, side and reverse views support these observations:

- The body preserves the porcelain/brass costume, open skirt, crown and mechanical heels. Its head still has a grinning skull surface. The teeth read strongly in the texture; shape-only inspection shows the underlying skull/nose/face volume. This is not yet a prepared recessed seat for interchangeable expression inserts. The assembly viewer now preserves this entire face under Grace; the earlier cutout has been removed.
- Grace has open eye holes, a hollow reverse and a raised upper mounting/strap shape. Both budgets preserve the silhouette. At close inspection, 3k is visibly more faceted around the cheek/forehead; 8k is smoother. Keep 3k as a lightweight candidate and 8k for close fitting tests until mounted camera comparisons establish the required budget. Both are now mounted candidates, pending owner acceptance.
- Grimace is asymmetric; Fury has strongly lowered brows and an open mouth; Distress has raised inner brows and a downturned mouth. They read as distinct isolated expressions. The models are rigid single meshes, not mechanical jaw/brow rigs. The enlarged inspection does not establish their readability on a distant worker-facing character.
- Local simplification retains useful expression shapes; it is not a claim that every master detail survives. These are earlier isolated studies; the original body face now supplies the mechanical appearance.

## Confirmed intake gaps

- Faces have approximately the same exported height as the entire body (about 1.90 m). The assembly adapter scales each face to approximately 19 cm and provides a versioned fit transform. The isolated viewer normalizes every selected object to a 1.9-unit display height; this is explicitly **not shared anatomical scale**.
- The Body 50k and Grace 3k/8k packages do not contain normal maps. Their master packages do. Do not apply a master normal map to a remesh without establishing compatible UVs or rebaking it.
- No skeleton, skinning, Hot Walk or theatrical acting is present. There is no animation selector because there are no clips to play.
- Half coverage is derived directly from Grace in the viewer. Separate half-shell and expression generation are retired from the current scope. Grime variants and facial articulation are not implemented.
- Head-seat, eye-aperture, mouth-cavity and layer-clearance acceptance now uses the assembled viewer; isolated source review remains available.

## Inspection controls and evidence

Body, Grace 3k, Grace 8k, Grimace, Fury and Distress share the same player. Drag or use arrow keys to orbit, use scroll/pinch or the visible zoom buttons, and reset the camera. Front/side/back buttons reset the orbit to its canonical direction before rotating the subject, so their names remain correct after manual mouse orbit or CCTV use; Grace comparison buttons retain camera pose and subject orientation. The body also offers a closer face-seat framing. Textured, untextured shape and wireframe modes reveal different issues. The inspection lamp can be disabled. Fixed Security and Lattice Forge CCTV presets remain available, with a warning that enlarged isolated faces do not prove mounted readability.

Each player uses the common six review gates and character navigation. Save review evidence exports asset revision/hash, source filename, camera pose, room, selected material mode, lamp setting, viewport and available frame counters. A static single-object scene is not a crowd or physical-device performance test.

## Reproduction and checks

1. Retain original FBX/texture ZIPs outside the runtime repository. Audit with `scripts/characters/static-fbx.c` linked against the same ufbx parser used by the character intake pipeline.
2. The static extractor bakes FBX geometry transforms into right-handed, Y-up meters and exports position, normal and flipped-V UV corner data. Source hashes and bounds accompany the binary geometry.
3. Run `scripts/characters/import-cathexis-review.mjs` with the private intake directory. It preserves body/Grace triangle counts, welds shared vertices, reduces mechanical faces to approximately 12k triangles, packs PBR maps, and publishes immutable hashed GLBs. Body texture delivery is 2048px; face textures are 1024px.
4. `scripts/characters/check-cathexis-review.mjs` verifies all six runtime hashes/byte counts, actual triangles, finite geometry/UV attributes, display bounds, expected normal-map presence, absence of rigs/clips, and zero glTF validation errors. It is included in the ordinary character/build checks.
5. Review the rendered surfaces and silhouettes before accepting any candidate. For the accepted v2 body, first test Hot Walk and expressive sway on its rig; continue face fitting as a separate assembly gate before expanding expressions.

Current runtime pack: `loopforge-cathexis-review`, revision `4c36727176798cdcec099dc5f1e24003620eea71b51e3f6fc4d0fc00998f666b`.

## Viewer verification — 14 October 2026

The production build passed asset validation, TypeScript and prerendering. The four camera contract tests pass, including portrait zoom limits/reset and restoration of full-body limits; scoped ESLint passed. All six candidates rendered, textured/clay inspection worked, Grace switched at a fixed camera and native mouse dragging changed the orbit. Desktop plus 390px and 320px layouts were inspected; no horizontal overflow was observed. Narrow controls were expanded to full width. Runtime logs showed no viewer errors during the local check.

Screenshots are retained in the private `cathexis-intake/evidence` folder: body face textured/clay, Grace budgets, Grace profile, all three mechanical fronts and phone controls. These are development evidence, not additional public art assets.

Material and lamp changes explicitly invalidate scene readiness as well as the frame. This keeps the demand-rendered player drawing while replacement shaders compile, instead of leaving a blank model until the next camera gesture.

## Rear skirt repair scope — 14 October 2026

The initial body is the design authority. Fill only the missing central rear cloth behind the legs; retain the original front opening, side panels, hem lengths, outer silhouette, crown and all body parts. Knees and shins must remain behind the new fabric with clearance. Full-dress/crown redesigns and a narrow infill leaving knee openings were rejected. The revised rear input and `08-rear-panel-repair.txt` are in Model briefs and its download kit. This scope produced the subsequently accepted v2 body below; moving costume clearance is still untested.


## Accepted v2 body — 14 October 2026

The owner accepted the revised model after front/side/rear inspection. Rear fabric is continuous behind the thighs, knees and calves to the lower ankles, with exposed heels and a small bottom-center hem split. Front opening remains. Neutral-pose rear knee protrusions were not observed. Meshy changed the arm pose and some face/back machinery details beyond the skirt; the owner accepted the resulting appearance. The model remains unrigged.

Downloads: `Cathexis_Body_v2_50k.zip` and `Cathexis_Body_v2_mast.zip`, both CRC-valid FBX packages. Runtime body: 51,034 triangles, 75,869 vertices, one mesh/material, 5,695,824 bytes with 2K delivery textures; source geometry preserved. Master: 3,403,416 triangles, private only. Both contain zero skin joints and animation clips. Delivery has no normal map; obtain a map matched to its own UVs rather than assuming the master map fits.

The v1 body GLB and its previous pack manifest are removed from the new deployment at the owner’s explicit request. Existing deployments are immutable and are not purged by this code change. Other face candidates are unchanged. The current viewer can inspect single sources or the body with one fitted face. Next: Mixamo-compatible neutral rig plus Hot Walk (106) and expressive sway (415), followed by mirror (48) and head-hold frustration (391) after the first two tests pass. Full acting-bank generation waits on costume/heel/hair clearance.

## Layered Grace and illuminated eyes — 14 October 2026

The appearance selector offers full Grace, half Grace and the exposed original mechanical face. Both Grace budgets can be compared, and the half mask can cover either side. The body is never cut, hidden or remeshed for a mask. This replaces the earlier central-face removal that produced a visible side gap. Separate Grimace/Fury/Distress candidates remain under source inspection only: the owner finds the original body grimace more useful at factory-camera distance.

`cathexis-fit.ts` records the fitted transform. Half coverage clips Grace triangles at local x=0, interpolates normals/UVs and adds a narrow porcelain return edge once on selection. No new GLB or duplicate body texture is deployed. Recessed, depth-tested eye lenses prevent the far eye projecting past the mask silhouette; eye highlighting remains independently switchable.

The visual vocabulary is composure (full porcelain), distress/menace (original mechanism), or both at once (half porcelain). Acting and context still carry emotion; these states do not certify a specific emotional reading at every CCTV distance. This is static appearance work, with no facial articulation, mask-removal animation or rig acceptance. Future attachment follows the head joint.

Mask downloads are integrity checked, abortable and disposed on replacement. Errors leave the original body visible with retry. Evidence includes coverage side, mask/body hashes, fit transform, eye state and camera. Source triangle totals describe the complete source assets, excluding small overlays; half-mask rendered triangles are lower.

## Layering verification

The geometry check partitions both Grace budgets into opposite halves, verifies surface area conservation, finite normalized normals, interpolated UVs and source immutability. Browser checks cover full/half/exposed appearances, both sides, both budgets, oblique/profile inspection, eye toggles and CCTV. Owner appearance acceptance and moving costume clearance remain open.
