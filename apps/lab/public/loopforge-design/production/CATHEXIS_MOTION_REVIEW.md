# CATHEXIS — Hot Walk and Happy Sway cleanup

15 October 2026, arm/contact quality pass. The owner accepts the body, dress flow and full/split Grace fit. Hot Walk keeps its rebuilt curved gait, with a corrected right-arm blend into the temple gesture. Happy Sway is calmer and holds a planted stance. On 15 October 2026 the owner approved both corrected animations: Hot Walk (106) and Happy Sway Standing (415), including the arm/contact cleanup. This approval applies to the current `cathexis-contact-v7` delivery, whose runtime hash is recorded below; untouched source takes and future clips are not approved by this decision.

Open [CATHEXIS review](/stepanoskin/loopforge/play/asset-review/cathexis). **Motion & face review** opens paused with corrected Hot Walk. Compare Original export at the same time, scrub or play at normal/half/quarter speed, and inspect **Knees passing**, **Foot recovery**, **Forward reach** and **Hip & temple**. **Arm approach** and **Arm release** expose the corrected right-arm transitions. Happy Sway has **Weight shift** and **Opposite sway** markers. **Floor contact grid · 10 cm** is fixed to the floor; **Supervisor portrait** tests the same performer at information-screen scale. Captions sit below the canvas so the feet stay visible. The **Appearance** selector fits full Grace, either half or the exposed body face on both motion versions. **Inspect head & face seat** provides a moving close-up; skirt/feet framing remains separate. **Face & asset fitting** retains the static source inspection. [STILETTO’s viewer](/stepanoskin/loopforge/play/asset-review/stiletto) retains Quick Walk for comparison.

## Source and delivery

- Meshy GLB: `Meshy_AI_Cathexis_Body_v2_Rigged_biped_Hot_walk.glb`, SHA-256 `a15bb25903042ca5830963f3231818df99101338ef4d6df960218995b8889dc1`.
- Happy Sway FBX ZIP: SHA-256 `f63a384ac5049a21e962cb993e783b76c262ede6aaf364241eaf02cdc0c2bb6a`; neutral and animated FBX, matching base/metallic/roughness maps. GLB is the canonical motion source; FBX timing is not asserted byte-identical.
- Reference: STILETTO `Quick_Walk`, runtime SHA-256 `ad84c17431f6eea244b9a15f46296f0da63d7ae9726e2f7d2622f9d522b6f97b`. The checked-in reference samples one complete stride at 120 Hz. It records six hip-relative leg joints, not a replacement CATHEXIS animation.
- Rigged delivery: 51,031 triangles, 23 source skin joints. Meshy’s rigging export differs slightly from the accepted 51,034-triangle static source. This cleanup does not remodel either body.
- `Confident_Walk` (catalog 106) is publicly **Hot Walk**, 5.8333 s. `Happy_Sway_Standing` (415) is 10.0417 s. Source Walking/Running are excluded: CATHEXIS never runs and uses Hot Walk only.
- Runtime: 11,512,604 bytes, SHA-256 `156f11fff75c4eba27c74d953b5b1c5b9246786aa15785e3e2b0fd9295245cc5`. Immutable `loopforge-cathexis-motion` pack, four source/corrected clips, two skins sharing geometry/maps; only one body renders. Superseded runtime files are removed from the deployment.

## Rebuilt gait

The previous fixed foot lanes and forced forward knee pole are retired for Hot Walk. Each bake restores the original six leg rotation tracks before solving; it never compounds corrections from an earlier delivery.

The original left/right forward reaches align CATHEXIS’s strides to corresponding moments in STILETTO’s Quick Walk. This transfers the curved lateral ankle path and knee bend-plane while preserving CATHEXIS’s 5.8333-second duration, variable step timing, forward stride, hip/torso acting, foot orientation and toe animation. Reference distances scale to her limb lengths. A small lateral allowance accommodates her leg geometry; the feet still approach the centre during landing and arc outward during recovery. Smooth reach limiting prevents a fully extended knee from snapping as the target moves.

CATHEXIS’s knee armour is wider than STILETTO’s. An additional local correction keeps the knee shells apart when they pass at similar depth and height. It does not force the same stance width throughout the stride. World-X foot/knee spacing alone cannot prove a collision: one leg may be safely in front of the other. Actual skinned surfaces and three-dimensional knee distance are checked separately.

The gait pass changed six thigh/knee/ankle rotation tracks. This subsequent arm/contact pass preserves that gait and Hot Walk’s dress, hips, torso, left-hand contact and toes exactly. A regression digest pins 153 unchanged channels: both original exports and all corrected Hot Walk channels except the three right-arm rotations. Happy Sway is separately rebaked as described below. Neutral geometry, material maps, file size and runtime joint counts are unchanged.

## Preserved dress and hand cleanup

Six baked skirt controls carry the rear fabric clear of the legs, producing 29 indexed joints in the corrected skin. The 20 cm waist blend avoids an abrupt fold. The rear arc has reduced backward flare; front panels follow their own thigh instead of blending across both legs. The accepted cloth/grounding envelope is evaluated before rebuilding Hot Walk’s legs, preserving those curves exactly.

Hot Walk’s left palm follows the hip. The right hand approaches the temple from 1.35–1.85 s, holds through 4.5 s and releases by 5.1 s. Offline two-bone IK preserves limb lengths and the free gesture outside that interval. The prior solver blended the wrist target while substituting the full elbow bend plane even at near-zero contact. This caused a roughly 116° right upper-arm key jump at release. The new bake blends the solved upper arm, forearm and hand from their source rotations together. Held contacts remain precise; maximum upper-arm key change is now 7.28°. Happy Sway retains its arm and head acting; no finger joints were added.

Hot Walk grounds the supporting sole and a short seam correction closes each loop. Its travel/stance matching to a moving world agent and velocity continuity remain unverified. Happy Sway reduces lateral/depth hip motion to 42% of the source amplitude, vertical motion to 60%, and pelvis/spine angular deviation to 58%. Offline leg IK maintains the initial staggered ankle targets, foot orientation and toe pose, with a knee-bend reach reserve. This is a stationary expressive idle; the body can move above its supporting feet. The existing drape bake follows that calmer body. Endpoint poses coincide. Materials clear incorrectly exported whole-body emission and restore the supplied matching metallic/roughness maps. The delivery normal map remains missing.

All solving happens offline in Python/Numpy/Scipy and plays as ordinary Babylon skeletal animation. Blender was not used. There is no runtime IK, collision or cloth solver, network inference, or animation-driven game outcome.

## Exported-file checks

The exact runtime is sampled at 120 Hz, including times between the 60 Hz baked keys. Non-coplanar triangle tests compare 14,855 lower-costume triangles against 5,420 leg triangles, and independently compare left/right leg surfaces below 0.85 m.

| Clip | Corrected poses | Dress/leg: source → corrected | Leg/leg: source → corrected | Supporting sole height | Endpoint gap |
| --- | ---: | --- | --- | --- | --- |
| Hot Walk | 701 | 652 → 0 | 276 → 0 | 1.31–5.32 mm | 0 m |
| Happy Sway | 1,206 | 433 → 0 | 362 → 0 | 2.00 mm | 0 m |

Hot Walk’s signed lateral ankle spacing varies from 22.6 to 141.6 mm, replacing the nearly constant 108–126 mm lanes. Minimum three-dimensional knee-centre distance is 132.0 mm. Maximum consecutive leg-key rotation is 5.70° (Happy Sway: 0.75°). The validator checks actual surface crossings, compact but varying foot paths, knee clearance, loop endpoints and smooth key steps.

The stationary audit checks 940 actual sole vertices through 1,206 poses: maximum displacement from the initial sole surface is 2.12 mm (remaining skin deformation), versus 54.8 mm in the original. Ankles remain within a few micrometres. Hip lateral range falls from about 309 mm to 130 mm. It measures planted contact, not just constant floor height. The original/corrected review now anchors each clip once; it no longer recentres the current pelvis every frame. That old preview behaviour added roughly 272 mm of apparent horizontal foot sliding to the source. The fixed grid is an optional single line-system draw and is excluded from game scenes.

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

Remaining: normal maps, grime variants, blends, paired worker/machine contacts, rigid armour/finger refinement and device/crowd measurements. The current corrected Hot Walk and Happy Sway acting, as well as Grace fit, are owner-approved. Next catalog auditions are Mirror_Viewing (48) and Head_Hold_in_Pain (391), followed by the priority acting bank; no new source retarget is accepted automatically. No new Meshy body generation is needed for this cleanup.

## Grace on the moving rig — 15 October 2026

Viewer revision `cathexis-contact-v7` mounts the existing Grace 3k/8k candidates on the animated head. Full, left-covered and right-covered porcelain use the same clipping, cut-edge, materials and recessed eye code as static fitting. The original mechanical face remains complete under the mask. Exposed body eyes and covered mask eyes follow the same head; the illumination toggle affects both. Selection changes preserve the current clip, pose, speed and camera. Switching source/corrected motion retains the mask and pose.

The static fitting body is 1.9 m; the rigged mesh is 1.7 m. The attachment maps static fitting coordinates into the head's inverse-bind space with that ratio. Bounds inflated by skin bind scaling must not be used. The nested mask import's handedness conversion is removed because the animated body already applies it. This adds a rigid transform, not a facial rig, cloth solver or extra skeleton joints. One selected mask loads at a time; switching/disposal cancels stale requests and releases mask resources. The attachment pass did not alter body geometry or source curves; the later arm/contact pass changes only the documented corrected motion tracks.

Run `node scripts/characters/check-cathexis-face-motion.mjs` from `apps/lab` with Node 22.15+. It imports the production adapters and checks the delivered assets in Babylon: 22,908 pose samples (120 Hz, both clips and versions, both Grace resolutions, three fits). Maximum attachment-coordinate error is 0.0021 mm. It also checks clipping side, mask scale, eye toggles, room/turn transforms, rapid replacement, static-fit regression, unchanged body geometry and complete cleanup. This is attachment correctness, not a hand/mask surface-collision certificate. The earlier 1,907-pose audit remains specific to the legs and lower dress.

Visual review uses Hot Walk's temple hold/release, Happy Sway head tilts, profile and split-edge close-ups, and the factory cameras. Facial articulation, taking the mask off/on, new expression items and crowd performance remain outside this change. The owner approved Grace fit and these two corrected motion clips. Other acting, mask handling and paired interactions remain separate reviews.

## Portrait and factory reuse

One versioned performer supplies the body, clip library, sockets, Grace coverage and eye controller to both supervisor information screens and world scenes. Portrait framing and lighting belong to the screen; they must not require a separate sculpt or motion correction. The workbench now provides a portrait framing preset on the same adapter, not a finished supervisor info screen.

Stationary clips keep a fixed world anchor and preserve pelvis weight shift; the camera must not hide foot drift by following the hips. Locomotion needs an explicit in-place versus root-travel policy, travel-speed matching and foot-contact phases. Paired acts need reserved participants/props and authored contact/release moments before the deterministic engine can use them. Those world integrations remain open. The current cleanup is offline baked skinning with no added runtime IK or cloth cost. Single-figure acceptance and crowd/device performance are separate gates.
