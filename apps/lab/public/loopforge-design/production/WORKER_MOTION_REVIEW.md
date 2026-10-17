# Worker 01 motion cleanup — 17 October 2026

## Delivered candidate

Game design → Agents → Production asset player → Worker 01. Direct route: `/stepanoskin/loopforge/play/asset-review/worker`. Worker is the first character tab, before the supervisors.

This revision implements the previously committed correction and hand plan. The cleanup repairs limb clearance, hand contacts and posture. The latest revision authors both arms for Scratch: central-palm head contact and a relaxed free arm. The other 40 tracks, including the previous Fall correction, retain identical sampler arrays. The new bank contains nineteen corrected derivatives beside nineteen untouched source motions, plus Relax, Grip and Release hand studies. The default view is corrected Idle, paused. Original/Corrected switches preserve the selected time and camera for comparison. Source-contact markers retain their original meaning.

The accepted 25,893-triangle body is unchanged. The source skin has 24 joints; the corrected skin has 34, adding one rigid hinge per visible finger. The existing separated fingers support this movement without replacing the hands or regenerating the character. The mesh does not have suitable intermediate knuckle loops, so this is ten articulated digit plates, not a full human finger rig.

## What changed

- Leg clearance is corrected with a smooth whole-chain swing from the hip. Knee-local source curves are preserved, avoiding a new independent knee wobble. Feet retain source orientation; the source lowest-sole height is restored without flattening jumps, the limp or collapse. Foot centerline crossing is not treated as a collision by itself.
- Confused Scratch starts from the original reaching-arm motion, then fits an actual central palm triangle to the moving scalp. The palm surface is tilted relative to the wrist bone: fitting only a wrist axis or fingertip target was insufficient. Two small scratching beats and the puzzled hold share a continuous palm contact. A two-bone solve preserves the source bend plane and limits elbow flexion to 130°; the hand receives a complete contact orientation. The free arm rests beside the torso, with a soft elbow, inward-facing palm and relaxed fingers. This replaces the exact-source-elbow restriction, which forced the wrist to compensate when fitting full-palm contact. Injured Walk’s existing thigh brace is unchanged.
- Agree Gesture turns the palms toward each other for two claps. Angry Stomp folds the arms at separate heights and depths; the front elbow lowers before uncrossing. Contacts follow the moving head, thigh or chest.
- Standing hands use a stronger relaxed curl with inward palm orientation and twist distributed between forearm and wrist. Gesture-specific curls open the clap and support the injured leg.
- Electrocuted Fall restores the source left-elbow and left-wrist curves exactly. Smooth shoulder lift keeps the hand above the floor without the rejected forced palm twist. The right-hand correction is unchanged. Both hands stay above the fixed Y=0 floor. A dedicated floor audit checks all hand vertices throughout the fall; the body-region crossing test alone could not catch this problem.
- The viewer adds named contact-pose shortcuts and a Hands & head close-up control. Original source-contact markers remain separate and unchanged; source comparison preserves the same camera and time.
- Finger weights are rigid on each digit. All corrected clips explicitly set finger poses, preventing a previous grip from leaking into another clip. Three separate hand studies demonstrate the range.
- The review scene anchors once at the first frame. A 10 cm floor grid exposes actual travel instead of moving the scene with every hip sway. Following travel remains an optional inspection aid.

Corrections are baked offline with the checked-in Python/NumPy/SciPy tooling and a small C triangle-intersection helper. Blender was not used for this pass. Babylon plays ordinary skeletal tracks; no runtime IK, finger physics, retargeter or per-frame finger React updates were added. Original and corrected versions share geometry/textures; only the selected body is rendered.

## Export verification

The delivered GLB is 11,829,260 bytes (11.28 MiB), with 41 tracks. SHA-256: `4706b780ccbde6a553f954a5235c511e48c9b0770fd2748fbdbcba026bf53357`.

The validator checks the original geometry, skin, bind matrices and every source animation sampler against the pinned original bank. They remain unchanged. It also validates the corrected rig, all nineteen derivatives, explicit finger tracks, finite data, normalized weights and the hash-pinned clearance report. glTF validation reports zero errors; the inherited non-root skinned-mesh warning remains.

The final exported mesh was sampled at 120 Hz across every full clip: **13,551 poses, 5,138 source contact frames, zero detected corrected contact frames** in the tested regions. These are interior triangle crossings between legs, opposing forearms, hands/head, forearms/torso and hands/legs. This is not swept-volume, coplanar/contained-volume, machine-contact or transition certification. Intentional contact still needs artistic review. The fall has zero sampled hand/floor penetrations: minimum left/right hand heights are 3.91/0.65 mm above Y=0. These heights apply to this asset on a flat floor; scene placement must preserve that plane.

| Motion | Sampled poses | Source contact frames | Corrected contact frames |
| --- | ---: | ---: | ---: |
| Agree Gesture | 1561 | 136 | 0 |
| Alert | 481 | 0 | 0 |
| Angry Stomp | 961 | 413 | 0 |
| Carry Heavy Walk | 781 | 0 | 0 |
| Catching Breath | 841 | 247 | 0 |
| Hot Walk | 693 | 344 | 0 |
| Confused Scratch | 1381 | 705 | 0 |
| Discuss While Moving | 965 | 834 | 0 |
| Electrocuted Fall | 761 | 71 | 0 |
| Electrocution Reaction | 561 | 0 | 0 |
| Idle Turn Left | 113 | 102 | 0 |
| Idle Turn Right | 133 | 133 | 0 |
| Listening Gesture | 1121 | 1121 | 0 |
| Push Forward and Stop | 313 | 110 | 0 |
| Victory Cheer | 1121 | 306 | 0 |
| Idle | 481 | 255 | 0 |
| Injured Walk | 1041 | 291 | 0 |
| Run Fast 10 | 97 | 23 | 0 |
| Walk 2 | 145 | 47 | 0 |

The three hand studies were checked separately at 60 Hz: 363 samples with no detected finger-to-finger crossings. Comparing knee-local rotations at 30 Hz gives a maximum difference of 0.000149°, within export precision. This preserves the original knee articulation; it does not certify the visual quality of every source performance.

The largest hip swing corrections for Walk 2, Run Fast 10 and Injured Walk are respectively 7.80°, 7.30° and 4.80°. There is no forced wide foot lane. Source hip acting, timing and root travel remain. Per-clip authoring measurements and the full region counts are in `apps/lab/lib/loopforge/agents/worker-cleanup.json` and the downloadable rebuild kit.

## Rebuild and review

Run from `apps/lab` with Python, NumPy, SciPy and a C compiler available. Use a temporary output directory outside the deployment tree. The scripts pin the accepted source bank; regeneration requires another import/validation pass.

```sh
# Prepare and refine the baseline limb-clearance bank first.
python scripts/characters/bake-worker-cleanup.py /tmp/worker-cleanup --clearance-only
node scripts/characters/import-worker-cleanup.mjs /tmp/worker-cleanup
python scripts/characters/refine-worker-contacts.py /tmp/worker-cleanup /tmp/worker-cleanup/worker-runtime.glb
python scripts/characters/bake-worker-cleanup.py /tmp/worker-cleanup --reuse --clearance-only
# Author the contact acting from those inspected intermediate poses.
python scripts/characters/bake-worker-cleanup.py /tmp/worker-cleanup --reuse
python scripts/characters/polish-worker-acting.py /tmp/worker-cleanup/worker-corrected.glb /tmp/worker-cleanup/worker-fitted.glb --rate 120
# Restore source articulation for the two visually rejected arm performances.
python scripts/characters/rebuild-worker-source-arms.py /tmp/worker-cleanup/worker-fitted.glb /tmp/worker-cleanup/worker-source-arms.glb
python scripts/characters/fit-worker-head-contact.py /tmp/worker-cleanup/worker-source-arms.glb /tmp/worker-cleanup/worker-corrected.glb
node scripts/characters/import-worker-cleanup.mjs /tmp/worker-cleanup
python scripts/characters/check-worker-clearance.py /tmp/worker-cleanup/worker-runtime.glb /tmp/worker-cleanup/audit.json
```

Do not run the earlier broad clearance refinement after contact acting: it can pull a purposeful hand contact away from its target. Inspect and fit residual clips with `polish-worker-acting.py --clips <names> --rate 120`; repeat the exact-export audit after any change. The fitter checkpoints each clip. `check-worker-clearance.py --resume` only resumes an identical asset hash. `--reuse-acting` preserves previously inspected acting arrays when rebuilding other clips. Run the head-contact fitter after the source-arm rebuild. Then run `check-worker-head-contact.py` against the final packed runtime and include its hash-pinned report in the clearance audit. Do not apply a broad clearance pass afterwards. The validator requires the central palm surface point within 15 mm of the actual head triangles during all three holds, elbow flexion at or below 130°, wrist bend below 55°, and free-wrist bend below 20°. It also rejects a new arm rotation-speed spike above the source maximum plus 5%. Fall’s left-elbow/wrist samplers still compare exactly with the source. A numeric collision pass alone missed the previously broken elbow and awkward hand: inspect joint articulation and the full performance independently. This is an authoring workflow with visual gates, not an automatic guarantee of acceptable acting.

Run `python scripts/characters/check-worker-fingers.py /tmp/worker-cleanup/worker-runtime.glb` for the three hand studies.

Update the committed audit from the final export, retaining the authoring measurements and hand-study results, then run `node scripts/characters/check-worker-review.mjs`. The validator rejects a report whose hash or clearance results do not match the delivered bank. Review the exact immutable asset in the production player at normal and quarter speed, with the fixed floor and from several angles.

## Remaining scene work

This is an implemented cleanup candidate awaiting owner visual review, not blanket gameplay approval. `afraid_recoil` and precision `work_cradle` are still separate authored actions. Carry Heavy Walk is a carrying gait, not machine interaction. Align grips against actual props; verify blend boundaries, navigation speed, reservations, planted contacts, falls and paired supervisor actions in their scenes. Broader rigid armor weighting and crowd/device performance are not certified by this pass.

Catching Breath retains a running approach (about 6.24 m); Discuss While Moving retains travel (about 1.75 m). Turn and fall clips retain their heading/displacement. Do not label these stationary merely because the camera can follow them. Hot Walk remains a worker-body source reference; CATHEXIS has her own accepted gait and model. Do not mix these tracks directly with other supervisors' differently named rigs.

Delivery uses the existing immutable asset pack and temporary app hosting while CloudFront setup is pending. No game/BDI/API, AWS permissions or CDN changes are made.

## Verification record

The bounded production build and character validators pass. Source preservation and full-cycle exported-mesh checks are complete. Browser review and focused test results are recorded with this revision in the PR. Physical-device and crowd measurements remain open; no earlier supervisor benchmark is claimed as a worker result.

Earlier clearance-pass browser check (16 October; before the contact-acting follow-up): the production build loaded the corrected bank, source/corrected Walk 2 comparison preserved 0.97 s, mouse orbit changed the camera, Run Fast 10 / Injured Walk / Scratch / Agreement and Grip were inspected, quarter-speed playback and Forge CAM 2 worked. A 390 × 844 viewport had no horizontal overflow; no captured browser warnings/errors. Scoped ESLint and the four review-camera tests passed. These checks do not replace owner motion approval or physical-device testing.

Palm-acting revision (17 October): only corrected Scratch’s two arms and finger rotations changed. All 19 sources, the other 18 corrected clips and three hand studies retain identical sampler arrays. The accepted geometry and skin remain unchanged. The final export was reviewed at the reported 2.19 s and 3.40 s poses, in front/profile close-up and through entry/release and the full sequence. The central palm surface stays 9.31–14.71 mm from the head during the holds; maximum elbow flexion is 123.72°, maximum wrist bend 50.12° over the full clip and 24.85° during the puzzled hold, and the free wrist stays within 8.36°. The source’s fast final arm drop remains (about 972°/s peak elbow rotation); no faster rotation spike was introduced. The former v6 asset fails the new palm-contact gate. These geometric checks do not imply owner acceptance.
