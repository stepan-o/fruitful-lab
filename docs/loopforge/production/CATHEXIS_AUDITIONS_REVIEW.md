# CATHEXIS — new motion auditions

Reviewed 2026-10-15. Hot Walk, Happy Sway Standing and full/half Grace fit are owner-approved. These two additional clips are source auditions, pending costume and contact cleanup. Hot Walk remains CATHEXIS’s sole approved travel gait.

[Open CATHEXIS motion and face viewer](/stepanoskin/loopforge/play/asset-review/cathexis) · [Approved motion record](CATHEXIS_MOTION_REVIEW.md)

## Delivery identity

- `Meshy_AI_Cathexis_Body_v2_Rig__biped_Head_Hold_In_Pain.zip` actually contains `Meshy_AI_Cathexis_Body_v2_Rig__biped_Animation_Mirror_Viewing_withSkin.fbx`. Its embedded take is `Armature|Armature|Mirror_Viewing|baselayer`: **Mirror Viewing**, 7.333 s. The viewer uses the embedded identity. Head Hold in Pain has not been delivered in this archive.
- `Meshy_AI_Cathexis_Body_v2_Rig__biped_Red_Carpet_Walk.zip` contains the matching textured, skinned Red Carpet FBX. Embedded take: `Armature|Armature|Red_Carpet_Walk|baselayer`: **Red Carpet Walk**, 5.967 s.
- Both exports contain the same 51,031-triangle body, matching the approved geometry to within 0.000127 mm, with 23 weighted body joints (one unused FBX end cluster is omitted). Both carry full character skins; these are not animation-only files.
- Archive and FBX hashes, conversion measurements and sampled surface audit are recorded in `apps/lab/lib/loopforge/agents/cathexis-auditions-audit.json`.

## Conversion and delivery

The FBX bind orientations and spine labels differ from the earlier GLB. Import rebases source deformation into the existing canonical skeleton. It retains each source motion and skin rather than applying motion curves to incompatible weights. Eight weights per vertex preserve the FBX’s influence distribution. At five sampled checkpoints per clip, maximum deformation difference from the full FBX weights is 0.085 mm for Mirror Viewing and 0.106 mm for Red Carpet Walk; this is not an exhaustive all-frame equivalence claim.

The two clips share one textured body in a separate bank, loaded only when selected. The already approved source/corrected bank remains byte-identical. Returning to an approved clip selects its corrected version. New auditions expose only Original export, with no false Corrected option. Both banks use the same mask attachment, eyes, camera controls, floor guide, playback speed, timeline and saved review evidence.

- Runtime: `/media/files/b9271a9e10a7f2109782ff33aa0083bcf333ac91be82e344a7df0479a068e891.glb`
- SHA-256: `b9271a9e10a7f2109782ff33aa0083bcf333ac91be82e344a7df0479a068e891`
- Size: 11,091,588 bytes, below the 12 MB review-bank budget. This is an on-demand audition asset, not an extra initial download. Eight influence skinning is for this isolated review; it does not certify crowd performance.
- Validator: zero errors; one expected non-root skinned-mesh warning.
- No new runtime cloth simulation, IK or per-frame collision solver. No source FBX archive duplication in the app delivery.

## Contact and costume review

Thirty-hertz surface sampling detects non-coplanar edge/triangle crossings below 0.85 m. Counts describe sampled poses with crossings, not a number of unique collisions. They exclude tangency, containment, upper-body/hand/face contacts, cloth self-contact, animation blends and multi-agent interactions.

| Motion | Sampled poses | Skirt/leg contact poses | Left/right leg contact poses | Viewer jump markers |
| --- | ---: | ---: | ---: | --- |
| Mirror Viewing | 221 | 51 | 158 | Skirt/leg 6.20 s; legs 7.10 s |
| Red Carpet Walk | 180 | 180 | 79 | Skirt/leg 4.10 s; legs 5.37 s |

The skirts retain their original FBX weights, without the approved bank’s six authored skirt controls. Both clips therefore need a separate cleanup pass before gameplay use. Red Carpet’s skirt contacts persist throughout the sampled clip. End-to-start maximum surface differences are approximately 7.2 mm and 16.8 mm respectively: looping in the viewer is an inspection convenience, not loop acceptance. Ground-contact and arm/hand acting also require owner review before release as an approved motion.

Full and half Grace use the already approved fit. The attachment check samples both clips at 120 Hz across full/left/right coverage and 3k/8k mask resolutions, checks fixed subject origin and disposal, and leaves the body geometry intact. These attachment checks establish fit consistency, not motion or collision approval.

## Reproduce

1. Extract each downloaded FBX without renaming its embedded take.
2. Build `scripts/characters/fbx-motion-dump.c` against the vetted external ufbx library (`cc -O2 -I<ufbx-directory> fbx-motion-dump.c <ufbx-directory>/ufbx.c -lm -o dump`). Run `dump input.fbx > output.json` for each clip.
3. Run `import-cathexis-auditions.py approved-bank.glb mirror.json red-carpet.json raw.glb` with NumPy and SciPy installed. The importer pins the approved bank’s SHA, verifies geometry/skin compatibility and writes conversion evidence.
4. Run `node scripts/characters/publish-cathexis-auditions.mjs raw.glb` to build the immutable pack, validate it and update its manifest/pointer.
5. Run `node scripts/characters/check-cathexis-face-motion.mjs --auditions` and the same command without the flag to regress the approved bank.
6. Run `audit-cathexis-auditions.py published-bank.glb surface-audit.json`, then use the production player’s markers, portrait, full-body, CCTV and mask controls for visual review.

No change to the closed Stage 2 facial-expression program. Grace, split Grace and the underlying body face remain the expression system.
