# CATHEXIS — Mirror Viewing and Red Carpet cleanup

Reviewed 2026-10-16. Hot Walk, Happy Sway Standing and full/half Grace fit remain owner-approved. Mirror Viewing and Red Carpet Walk now have **corrected candidates awaiting owner review**, alongside their untouched exports. Hot Walk remains CATHEXIS’s sole approved travel gait.

[Open CATHEXIS motion and face viewer](/stepanoskin/loopforge/play/asset-review/cathexis) · [Approved motion record](CATHEXIS_MOTION_REVIEW.md)

## Delivery identity

- `Meshy_AI_Cathexis_Body_v2_Rig__biped_Head_Hold_In_Pain.zip` actually contains `Meshy_AI_Cathexis_Body_v2_Rig__biped_Animation_Mirror_Viewing_withSkin.fbx`. Its embedded take is `Armature|Armature|Mirror_Viewing|baselayer`: **Mirror Viewing**, 7.333 s. The viewer uses the embedded identity. Head Hold in Pain has not been delivered in this archive.
- `Meshy_AI_Cathexis_Body_v2_Rig__biped_Red_Carpet_Walk.zip` contains the matching textured, skinned Red Carpet FBX. Embedded take: `Armature|Armature|Red_Carpet_Walk|baselayer`: **Red Carpet Walk**, 5.967 s.
- Both exports contain the same 51,031-triangle body, matching the approved geometry to within 0.000127 mm, with 23 weighted body joints (one unused FBX end cluster is omitted). Both carry full character skins; these are not animation-only files.
- Archive and FBX hashes, conversion measurements and sampled surface audit are recorded in `apps/lab/lib/loopforge/agents/cathexis-auditions-audit.json`.

## Conversion and delivery

The FBX bind orientations and spine labels differ from the earlier GLB. Import rebases source deformation into the existing canonical skeleton. It retains each source motion and skin rather than applying motion curves to incompatible weights. Eight weights per vertex preserve the FBX’s influence distribution. At five sampled checkpoints per clip, maximum deformation difference from the full FBX weights is 0.085 mm for Mirror Viewing and 0.106 mm for Red Carpet Walk; this is not an exhaustive all-frame equivalence claim.

The separate, on-demand audition bank now contains source and corrected versions of both clips. Geometry and textures are shared; the corrected skin adds six baked skirt controls. The approved Hot Walk/Happy Sway bank remains byte-identical. Both banks use the same mask attachment, eyes, camera controls, floor guide, playback speed, timeline and saved review evidence. Corrected auditions are labelled candidates; their presence in the player does not imply owner acceptance.

- Runtime: `/media/files/be77f243b1f794ef0d57a53920d6ae833d580f125f35210807f71fa36cf0ce1f.glb`
- SHA-256: `be77f243b1f794ef0d57a53920d6ae833d580f125f35210807f71fa36cf0ce1f`
- Size: 13,875,328 bytes, below the 14.5 MB audition-bank budget. Loaded only when selected. Eight influence skinning is for this isolated review; it does not certify crowd performance.
- Validator: zero errors; two expected non-root skinned-mesh warnings.
- Source bank `b9271a9e10a7f2109782ff33aa0083bcf333ac91be82e344a7df0479a068e891` remains the pinned authoring input.
- No new runtime cloth simulation, IK or per-frame collision solver. No source FBX archive duplication in app delivery.

## What changed

Both corrected clips restart from the pinned, untouched exports. The earlier fixed foot lanes and high palm targets are discarded.

Mirror Viewing uses the approved Hot Walk hand orientation as the reference for a lower waist contact, with the fingers beside the hip ornaments. The palm centre is 65 mm lower and 20 mm closer to the body in depth than the rejected correction. Lower, rearward elbow guides avoid the elevated-wing posture. The complete arm chain blends in from 0.45–1.10 s and releases from 6.10–6.75 s, retaining the original opening and closing gestures. The hands follow the pelvis through the turn; this is authored motion, not runtime IK.

Red Carpet uses the same measured STILETTO Quick Walk lateral trajectories and knee bend planes as the approved Hot Walk correction. Each original forward reach is phase-matched to the corresponding reference stride, preserving Red Carpet’s varying stride timing, hip sway, upper-body acting, forward/vertical foot path and foot roll. Only the local knee-armour clearance needed at passing poses is added. The signed ankle spacing varies from 27.6 to 142.0 mm (approved Hot Walk: 22.6–141.6 mm); minimum knee-centre distance is 132.7 mm. These describe the trajectories, not a claim of owner approval.

Mirror’s separate turning-step clearance remains. The waist-hung fabric weighting supplies a smooth six-level drape rather than bending the skirt with each thigh. Red Carpet’s trailing calf receives an additional fabric-clearance allowance, without widening its foot path. Small vertical root corrections reduce floor penetration and hovering. The last 0.3 s closes each measured endpoint mismatch for repeat inspection; gameplay transitions still need separate review.

## Contact and costume checks

120 Hz sampling detects non-coplanar edge/triangle crossings below 0.85 m. Counts describe sampled poses containing crossings, not unique collisions. These tests exclude tangency, containment, upper-body contact, cloth self-contact, blends and multi-agent interaction.

| Motion / version | Poses | Skirt/leg crossing poses | Leg/leg crossing poses | Supporting sole height | Repeat endpoint difference |
| --- | ---: | ---: | ---: | --- | ---: |
| Mirror Viewing / source | 881 | 205 | 630 | −1.9 to 48.5 mm | 7.2 mm |
| Mirror Viewing / corrected | 881 | 0 | 0 | −3.0 to 7.5 mm | 0 mm |
| Red Carpet Walk / source | 717 | 717 | 307 | 7.3 to 73.3 mm | 16.8 mm |
| Red Carpet Walk / corrected | 717 | 0 | 0 | −0.7 to 5.8 mm | 0 mm |

The separate Mirror hand check samples 881 poses, finding no hand/central-torso triangle crossings. During the full waist contact, maximum palm-target error is 0.070 mm. Maximum adjacent arm key rotation is 4.96°. The test covers hand-weighted surfaces against the central torso/waist, not every arm/head/cloth contact. Palm-target stability alone is not proof of finger fit. Front, profile and rear three-quarter visual checks remain part of acceptance. Floor height is not a planted-foot sliding measurement; neither audition is certified for locomotion speed matching.

Full and half Grace retain the approved fit. Attachment checks cover 19,188 poses across both clips, both versions, full/left/right coverage and 3k/8k masks at 120 Hz. Maximum attachment-coordinate error is 0.0021 mm; fixed subject origin, unchanged body geometry and disposal pass. The approved bank’s separate regression covers 22,908 poses. These establish fit consistency, not motion approval.

## Reproduce

Run from `apps/lab`, with Python NumPy/SciPy and a C compiler:

1. For source conversion, extract each FBX without renaming its embedded take. Build `scripts/characters/fbx-motion-dump.c` against the vetted ufbx library, dump both takes, and run `import-cathexis-auditions.py approved-bank.glb mirror.json red-carpet.json raw-source.glb`. The preserved source bank can be used directly for subsequent cleanup.
2. Run `python scripts/characters/bake-cathexis-auditions.py public/media/files/b9271a9e10a7f2109782ff33aa0083bcf333ac91be82e344a7df0479a068e891.glb public/media/files/156f11fff75c4eba27c74d953b5b1c5b9246786aa15785e3e2b0fd9295245cc5.glb corrected.glb`. Both input hashes are enforced.
3. Run `node scripts/characters/publish-cathexis-auditions.mjs corrected.glb` to validate and publish the immutable pack and manifest.
4. Run `python scripts/characters/audit-cathexis-auditions.py published-bank.glb surface-audit.json` and `python scripts/characters/check-cathexis-audition-hands.py published-bank.glb hands-audit.json`. Bind recorded findings to the resulting runtime hash.
5. Run `node scripts/characters/check-cathexis-face-motion.mjs --auditions`; omit the flag to regress the approved bank. Run the production build and scoped lint checks.
6. In the shared player, compare Corrected with Original export at the same pose; review hands at waist (2.5 s), turning (3.5 s), costume, front/side/rear views, repeat seam and full/split Grace. Save evidence with runtime hash, clip, version, time and camera.

Remaining: owner acceptance of these two corrected auditions, normal maps, grime variants, animation blends, travel-speed matching, paired contacts and device/crowd performance. No change to the closed Stage 2 facial-expression program: Grace, split Grace and the underlying body face remain the expression system.
