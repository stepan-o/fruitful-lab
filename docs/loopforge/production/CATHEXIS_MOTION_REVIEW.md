# CATHEXIS — Hot Walk and Happy Sway cleanup

15 October 2026, third quality pass. Local baked candidates, awaiting owner appearance/motion acceptance.

Open [CATHEXIS review](/stepanoskin/loopforge/play/asset-review/cathexis). **Motion cleanup** opens paused with corrected Hot Walk. Compare Original export at the same time, scrub or play at normal/half/quarter speed, inspect the rear skirt, feet and **Hip & temple** / **Foot paths** poses, and switch to Happy Sway. **Face & asset fitting** retains full Grace, half Grace and the intact mechanical face; masks are not yet fitted to the moving rig.

## Delivered evidence

- Meshy GLB: `Meshy_AI_Cathexis_Body_v2_Rigged_biped_Hot_walk.glb`, SHA-256 `a15bb25903042ca5830963f3231818df99101338ef4d6df960218995b8889dc1`.
- Happy Sway FBX ZIP: SHA-256 `f63a384ac5049a21e962cb993e783b76c262ede6aaf364241eaf02cdc0c2bb6a`; neutral and animated FBX, matching base/metallic/roughness maps. GLB is the canonical motion source; FBX timing is not asserted byte-identical.
- Rigged delivery: 51,031 triangles, 23 skin joints. Meshy’s rigging export differs slightly from the accepted 51,034-triangle static source. This cleanup does not remodel either body.
- `Confident_Walk` (catalog 106) is publicly **Hot Walk**, 5.8333 s. `Happy_Sway_Standing` (415) is 10.0417 s. Source Walking/Running are excluded: CATHEXIS never runs and uses Hot Walk only.
- Runtime: 11,512,604 bytes, SHA-256 `96bf18561160749fae91f7528977330d99a6cd9fe61be9c5b3917940d1851632`. Immutable `loopforge-cathexis-motion` pack. Four source/corrected clips, two skins sharing geometry/maps; only one body renders.

## What changed

Original positions, normals, UVs, topology, original skin and source curves remain available. Six additional baked skirt controls (29 corrected skin joints) carry the rear fabric clear of the legs. The waist transition now spans 20 cm instead of the earlier abrupt 8 cm join. Controls extend to the waist, and lateral ease changes gradually down the skirt instead of stepping between control rows. The rear arc has less backward flare, with a small clearance allowance for the heel at maximum stride and the calf during the deepest sway. Front panels follow their own thigh; the exported opposite-thigh weights were pulling them through the legs. The accepted neutral geometry remains unchanged.

Both clips now have separate foot paths. Offline two-bone IK adjusts thigh, knee and ankle rotations while preserving the source’s forward timing, foot orientation, toe animation and hip/torso acting. Knee targets use a forward bend with lateral separation, avoiding an exaggerated bow-legged stance. These clips remain theatrical Hot Walk and Happy Sway; no generic walk or run is substituted.

Hot Walk’s left palm now follows the hip. The right hand approaches the temple from 1.35–1.85 s, holds through 4.5 s, and releases by 5.1 s. Offline two-bone IK adjusts shoulder, elbow and wrist rotation, preserving limb lengths and the free gesture outside the contact window. Happy Sway keeps its original arm acting. No finger joints were added.

The pelvis is lowered to ground the supporting sole. A short seam correction closes each loop. Both endpoint poses coincide; velocity continuity and foot locking throughout stance are not certified. Materials remove the incorrectly exported whole-body emission and restore the matching supplied metallic/roughness maps. The delivery normal map is still missing.

All solving happens offline in Python/Numpy/Scipy, then plays as ordinary Babylon skeletal animation. Blender was not used. The runtime file and joint counts remain the same size as the previous pass. No runtime collision solver, cloth simulation, network inference or animation-driven game outcomes were added.

## Sampled clearance on the exact runtime file

120 Hz sampling includes frames between the 60 Hz baked keys. The test checks non-coplanar triangle crossings between 14,855 lower-costume triangles and 5,420 leg triangles, and independently between the left and right leg surfaces below 0.85 m. Signed world-X ankle/knee separation is an additional diagnostic for these forward-facing clips. The collision helper keeps separate acceleration structures for the two checks; switching topology sizes rebuilds them safely.

| Clip | Corrected poses | Dress/leg: source → corrected | Leg/leg: source → corrected | Supporting sole height | Endpoint gap |
| --- | ---: | --- | --- | --- | --- |
| Hot Walk | 701 | 652 → 0 | 276 → 0 | 1.32–3.93 mm | 0 m |
| Happy Sway | 1,206 | 433 → 0 | 362 → 0 | 1.95–2.09 mm | 0 m |

These are **1,907 sampled corrected poses**, not a guarantee of arbitrary motion. The method excludes tangency, coplanar overlap, full containment, costume self-contact, other body parts, animation blends, workers, machinery and uneven floors. A passing sample does not grant artistic acceptance or certify crowd/mobile performance.

A separate 120 Hz check of the exported Hot Walk measures a wrist-relative palm proxy against its authored body-relative target: maximum error 0.026 mm at the hip (701 poses) and 0.031 mm at the temple (318 held-contact poses). This verifies contact stability through export; it does not certify finger placement or all hand/body surface contacts.

The minimum signed ankle separation is 193.0 mm in Hot Walk and 204.4 mm in Happy Sway. Minimum knee separation is 146.8 / 178.7 mm respectively. Consecutive 60 Hz corrected leg keys rotate at most 6.27° / 4.95°; a regression guard rejects abrupt steps above 0.20 radians. These diagnostics support this candidate’s review and do not certify velocity continuity or arbitrary animation blends.

## Reproduce and maintain

Run from `apps/lab` with private source downloads available:

1. `python scripts/characters/bake-cathexis-motion.py SOURCE.glb raw.glb` (numpy/scipy). The expected source hash is enforced.
2. `node scripts/characters/prepare-cathexis-motion.mjs raw.glb MATCHING_TEXTURE_DIRECTORY runtime.glb`.
3. `python scripts/characters/audit-cathexis-motion.py runtime.glb audit.json` (C compiler required). Keep audit bound to that exact hash.
4. `node scripts/characters/import-cathexis-motion.mjs runtime.glb`, then `node scripts/characters/check-cathexis-motion.mjs` and the production build.
5. Inspect front/side/back, loop boundary, original comparison and CCTV in the common player. Save review evidence with clip/version/time, runtime hash, camera and viewport.

The bake is reproducible from the pinned source and checked-in scripts. Runtime validation has zero errors; two expected non-root skinned-mesh warnings reflect the source hierarchy. Babylon adds an unweighted common ancestor to the corrected skeleton, so validate indexed skin joints, not its raw bone-array length.

Remaining: owner review of drape/acting, moving Grace/head/eye fit, matching normal map, grime variants, blends, paired worker/machine contacts, rigid armour/finger refinement and device/crowd measurements. No new Meshy body generation is needed for this cleanup.
