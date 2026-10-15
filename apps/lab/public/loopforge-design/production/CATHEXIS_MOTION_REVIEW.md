# CATHEXIS — Hot Walk and Happy Sway cleanup

15 October 2026, fifth quality pass. The owner accepted the dress flow but rejected the constrained gait. This candidate rebuilds Hot Walk from its original leg curves using measured STILETTO Quick Walk trajectories. Artistic acceptance remains with the owner.

Open [CATHEXIS review](/stepanoskin/loopforge/play/asset-review/cathexis). **Motion & face review** opens paused with corrected Hot Walk. Compare Original export at the same time, scrub or play at normal/half/quarter speed, and inspect **Knees passing**, **Foot recovery**, **Forward reach** and **Hip & temple**. Happy Sway remains available. The **Appearance** selector fits full Grace, either half or the exposed body face on both motion versions. **Inspect head & face seat** provides a moving close-up; skirt/feet framing remains separate. **Face & asset fitting** retains the static source inspection. [STILETTO’s viewer](/stepanoskin/loopforge/play/asset-review/stiletto) retains Quick Walk for comparison.

## Source and delivery

- Meshy GLB: `Meshy_AI_Cathexis_Body_v2_Rigged_biped_Hot_walk.glb`, SHA-256 `a15bb25903042ca5830963f3231818df99101338ef4d6df960218995b8889dc1`.
- Happy Sway FBX ZIP: SHA-256 `f63a384ac5049a21e962cb993e783b76c262ede6aaf364241eaf02cdc0c2bb6a`; neutral and animated FBX, matching base/metallic/roughness maps. GLB is the canonical motion source; FBX timing is not asserted byte-identical.
- Reference: STILETTO `Quick_Walk`, runtime SHA-256 `ad84c17431f6eea244b9a15f46296f0da63d7ae9726e2f7d2622f9d522b6f97b`. The checked-in reference samples one complete stride at 120 Hz. It records six hip-relative leg joints, not a replacement CATHEXIS animation.
- Rigged delivery: 51,031 triangles, 23 source skin joints. Meshy’s rigging export differs slightly from the accepted 51,034-triangle static source. This cleanup does not remodel either body.
- `Confident_Walk` (catalog 106) is publicly **Hot Walk**, 5.8333 s. `Happy_Sway_Standing` (415) is 10.0417 s. Source Walking/Running are excluded: CATHEXIS never runs and uses Hot Walk only.
- Runtime: 11,512,604 bytes, SHA-256 `6c58ec7537ee20cf68deefccb4f78d935d23e8f795a04c5efb633774bddd0795`. Immutable `loopforge-cathexis-motion` pack, four source/corrected clips, two skins sharing geometry/maps; only one body renders. Superseded runtime files are removed from the deployment.

## Rebuilt gait

The previous fixed foot lanes and forced forward knee pole are retired for Hot Walk. Each bake restores the original six leg rotation tracks before solving; it never compounds corrections from an earlier delivery.

The original left/right forward reaches align CATHEXIS’s strides to corresponding moments in STILETTO’s Quick Walk. This transfers the curved lateral ankle path and knee bend-plane while preserving CATHEXIS’s 5.8333-second duration, variable step timing, forward stride, hip/torso acting, foot orientation and toe animation. Reference distances scale to her limb lengths. A small lateral allowance accommodates her leg geometry; the feet still approach the centre during landing and arc outward during recovery. Smooth reach limiting prevents a fully extended knee from snapping as the target moves.

CATHEXIS’s knee armour is wider than STILETTO’s. An additional local correction keeps the knee shells apart when they pass at similar depth and height. It does not force the same stance width throughout the stride. World-X foot/knee spacing alone cannot prove a collision: one leg may be safely in front of the other. Actual skinned surfaces and three-dimensional knee distance are checked separately.

Only six Hot Walk thigh/knee/ankle rotation tracks change in this pass. A regression digest pins the other 214 tracks: the original exports, all Happy Sway curves, and Hot Walk’s hip, upper body, hand contacts, toes and six skirt controls. Front panels retain their approved own-thigh weights and follow the rebuilt legs. The neutral geometry, material maps, file size and runtime joint counts are unchanged.

## Preserved dress and hand cleanup

Six baked skirt controls carry the rear fabric clear of the legs, producing 29 indexed joints in the corrected skin. The 20 cm waist blend avoids an abrupt fold. The rear arc has reduced backward flare; front panels follow their own thigh instead of blending across both legs. The accepted cloth/grounding envelope is evaluated before rebuilding Hot Walk’s legs, preserving those curves exactly.

Hot Walk’s left palm follows the hip. The right hand approaches the temple from 1.35–1.85 s, holds through 4.5 s and releases by 5.1 s. Offline two-bone IK preserves limb lengths and the free gesture outside that interval. Happy Sway retains its arm acting; no finger joints were added.

The pelvis grounds the supporting sole and a short seam correction closes each loop. Endpoint poses coincide; stance foot locking and velocity continuity are not certified. Materials clear incorrectly exported whole-body emission and restore the supplied matching metallic/roughness maps. The delivery normal map remains missing.

All solving happens offline in Python/Numpy/Scipy and plays as ordinary Babylon skeletal animation. Blender was not used. There is no runtime IK, collision or cloth solver, network inference, or animation-driven game outcome.

## Exported-file checks

The exact runtime is sampled at 120 Hz, including times between the 60 Hz baked keys. Non-coplanar triangle tests compare 14,855 lower-costume triangles against 5,420 leg triangles, and independently compare left/right leg surfaces below 0.85 m.

| Clip | Corrected poses | Dress/leg: source → corrected | Leg/leg: source → corrected | Supporting sole height | Endpoint gap |
| --- | ---: | --- | --- | --- | --- |
| Hot Walk | 701 | 652 → 0 | 276 → 0 | 1.31–5.32 mm | 0 m |
| Happy Sway | 1,206 | 433 → 0 | 362 → 0 | 1.95–2.09 mm | 0 m |

Hot Walk’s signed lateral ankle spacing varies from 22.6 to 141.6 mm, replacing the nearly constant 108–126 mm lanes. Minimum three-dimensional knee-centre distance is 132.0 mm. Maximum consecutive leg-key rotation is 5.70° (Happy Sway: 4.95°). The validator checks actual surface crossings, compact but varying foot paths, knee clearance, loop endpoints and smooth key steps.

A separate 120 Hz check measures a wrist-relative palm proxy against the body-relative target: maximum error 0.026 mm at the hip (701 poses) and 0.031 mm at the temple (318 held poses). This confirms contact stability through export, not finger placement or every hand/body surface contact.

These **1,907 corrected pose samples** do not certify tangencies, coplanar overlaps, full containment, cloth self-contact, other body parts, animation blends, other characters, machines or uneven floors. Passing numbers do not grant artistic acceptance or certify crowd/mobile performance.

## Reproduce and review

Run from `apps/lab`, with private source downloads available:

1. The checked-in `scripts/characters/cathexis-quick-walk-reference.json` contains the measured reference. Regenerate with `python scripts/characters/extract-cathexis-walk-reference.py STILETTO.glb` only from the pinned source hash.
2. `python scripts/characters/bake-cathexis-motion.py SOURCE.glb raw.glb` (numpy/scipy). The expected CATHEXIS source hash is enforced.
3. `node scripts/characters/prepare-cathexis-motion.mjs raw.glb MATCHING_TEXTURE_DIRECTORY runtime.glb`.
4. `python scripts/characters/audit-cathexis-motion.py runtime.glb audit.json` (C compiler required). Bind audit evidence to that exact runtime hash.
5. `node scripts/characters/import-cathexis-motion.mjs runtime.glb`, then `node scripts/characters/check-cathexis-motion.mjs` and the production build.
6. Review front/side/back, original comparison, loop seam, and CCTV in the common player. Save evidence with clip/version/time, runtime hash, camera and viewport.

Runtime validation reports zero errors. Two expected non-root skinned-mesh warnings reflect the source hierarchy. Babylon adds an unweighted common ancestor to the corrected skeleton: validate indexed joints rather than raw bone-array length.

Remaining: owner review of the rebuilt gait and moving Grace/head/eye fit, normal maps, grime variants, blends, paired worker/machine contacts, rigid armour/finger refinement and device/crowd measurements. No new Meshy body generation is needed for this cleanup.

## Grace on the moving rig — 15 October 2026

Viewer revision `cathexis-motion-grace-v6` mounts the existing Grace 3k/8k candidates on the animated head. Full, left-covered and right-covered porcelain use the same clipping, cut-edge, materials and recessed eye code as static fitting. The original mechanical face remains complete under the mask. Exposed body eyes and covered mask eyes follow the same head; the illumination toggle affects both. Selection changes preserve the current clip, pose, speed and camera. Switching source/corrected motion retains the mask and pose.

The static fitting body is 1.9 m; the rigged mesh is 1.7 m. The attachment maps static fitting coordinates into the head's inverse-bind space with that ratio. Bounds inflated by skin bind scaling must not be used. The nested mask import's handedness conversion is removed because the animated body already applies it. This adds a rigid transform, not a facial rig, cloth solver or extra skeleton joints. One selected mask loads at a time; switching/disposal cancels stale requests and releases mask resources. Motion and source GLB bytes are unchanged.

Run `node scripts/characters/check-cathexis-face-motion.mjs` from `apps/lab` with Node 22.15+. It imports the production adapters and checks the delivered assets in Babylon: 22,908 pose samples (120 Hz, both clips and versions, both Grace resolutions, three fits). Maximum attachment-coordinate error is 0.0021 mm. It also checks clipping side, mask scale, eye toggles, room/turn transforms, rapid replacement, static-fit regression, unchanged body geometry and complete cleanup. This is attachment correctness, not a hand/mask surface-collision certificate. The earlier 1,907-pose audit remains specific to the legs and lower dress.

Visual review uses Hot Walk's temple hold/release, Happy Sway head tilts, profile and split-edge close-ups, and the factory cameras. Facial articulation, taking the mask off/on, new expression items and crowd performance remain outside this change. Owner artistic acceptance remains pending.
