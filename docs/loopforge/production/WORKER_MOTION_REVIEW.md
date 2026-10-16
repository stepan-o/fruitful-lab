# Worker 01 motion cleanup — 16 October 2026

## Delivered candidate

Game design → Agents → Production asset player → Worker 01. Direct route: `/stepanoskin/loopforge/play/asset-review/worker`. Worker is the first character tab, before the supervisors.

This revision implements the previously committed correction and hand plan. The earlier pass imported and audited the source; it did not repair it. The new bank contains nineteen corrected derivatives beside nineteen untouched source motions, plus Relax, Grip and Release hand studies. The default view is corrected Idle, paused. Original/Corrected switches preserve the selected time and camera for comparison. Source-contact markers retain their original meaning.

The accepted 25,893-triangle body is unchanged. The source skin has 24 joints; the corrected skin has 34, adding one rigid hinge per visible finger. The existing separated fingers support this movement without replacing the hands or regenerating the character. The mesh does not have suitable intermediate knuckle loops, so this is ten articulated digit plates, not a full human finger rig.

## What changed

- Leg clearance is corrected with a smooth whole-chain swing from the hip. Knee-local source curves are preserved, avoiding a new independent knee wobble. Feet retain source orientation; the source lowest-sole height is restored without flattening jumps, the limp or collapse. Foot centerline crossing is not treated as a collision by itself.
- Arms get per-clip clearance adjustments. Rest/locomotion wrists have reduced extreme flex; expressive gestures retain their intent. Scratch, agreement and Hot Walk were refined again against the final exported finger geometry.
- Finger weights are rigid on each digit. All corrected clips explicitly set finger poses, preventing a previous grip from leaking into another clip. Three separate hand studies demonstrate the range.
- The review scene anchors once at the first frame. A 10 cm floor grid exposes actual travel instead of moving the scene with every hip sway. Following travel remains an optional inspection aid.

Corrections are baked offline with the checked-in Python/NumPy/SciPy tooling and a small C triangle-intersection helper. Blender was not used for this pass. Babylon plays ordinary skeletal tracks; no runtime IK, finger physics, retargeter or per-frame finger React updates were added. Original and corrected versions share geometry/textures; only the selected body is rendered.

## Export verification

The delivered GLB is 10,794,320 bytes (10.29 MiB), with 41 tracks. SHA-256: `12f1714557a25ca9152e45d5d2d5b5385de3416bf5b703ebd84899342240a2a3`.

The validator checks the original geometry, skin, bind matrices and every source animation sampler against the pinned original bank. They remain unchanged. It also validates the corrected rig, all nineteen derivatives, explicit finger tracks, finite data, normalized weights and the hash-pinned clearance report. glTF validation reports zero errors; the inherited non-root skinned-mesh warning remains.

The final exported mesh was sampled at 120 Hz across every full clip: **13,551 poses, 5,138 source contact frames, zero detected corrected contact frames** in the tested regions. These are interior triangle crossings between legs, opposing forearms, hands/head, forearms/torso and hands/legs. This is not swept-volume, coplanar/contained-volume, machine-contact or transition certification. Intentional contact still needs artistic review.

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
python scripts/characters/bake-worker-cleanup.py /tmp/worker-cleanup
node scripts/characters/import-worker-cleanup.mjs /tmp/worker-cleanup
python scripts/characters/check-worker-clearance.py /tmp/worker-cleanup/worker-runtime.glb /tmp/worker-cleanup/audit.json
# If the exported fingers introduce residual contacts:
python scripts/characters/refine-worker-contacts.py /tmp/worker-cleanup /tmp/worker-cleanup/worker-runtime.glb
python scripts/characters/bake-worker-cleanup.py /tmp/worker-cleanup --reuse
node scripts/characters/import-worker-cleanup.mjs /tmp/worker-cleanup
python scripts/characters/check-worker-clearance.py /tmp/worker-cleanup/worker-runtime.glb /tmp/worker-cleanup/audit.json
```

Run `python scripts/characters/check-worker-fingers.py /tmp/worker-cleanup/worker-runtime.glb` for the three hand studies.

Update the committed audit from the final export, retaining the authoring measurements and hand-study results, then run `node scripts/characters/check-worker-review.mjs`. The validator rejects a report whose hash or clearance results do not match the delivered bank. Review the exact immutable asset in the production player at normal and quarter speed, with the fixed floor and from several angles.

## Remaining scene work

This is an implemented cleanup candidate awaiting owner visual review, not blanket gameplay approval. `afraid_recoil` and precision `work_cradle` are still separate authored actions. Carry Heavy Walk is a carrying gait, not machine interaction. Align grips against actual props; verify blend boundaries, navigation speed, reservations, planted contacts, falls and paired supervisor actions in their scenes. Broader rigid armor weighting and crowd/device performance are not certified by this pass.

Catching Breath retains a running approach (about 6.24 m); Discuss While Moving retains travel (about 1.75 m). Turn and fall clips retain their heading/displacement. Do not label these stationary merely because the camera can follow them. Hot Walk remains a worker-body source reference; CATHEXIS has her own accepted gait and model. Do not mix these tracks directly with other supervisors' differently named rigs.

Delivery uses the existing immutable asset pack and temporary app hosting while CloudFront setup is pending. No game/BDI/API, AWS permissions or CDN changes are made.

## Verification record

The bounded production build and character validators pass. Source preservation and full-cycle exported-mesh checks are complete. Browser review and focused test results are recorded with this revision in the PR. Physical-device and crowd measurements remain open; no earlier supervisor benchmark is claimed as a worker result.

Browser check (16 October): the production build loaded the corrected bank, source/corrected Walk 2 comparison preserved 0.97 s, mouse orbit changed the camera, Run Fast 10 / Injured Walk / Scratch / Agreement and Grip were inspected, quarter-speed playback and Forge CAM 2 worked. A 390 × 844 viewport had no horizontal overflow; no captured browser warnings/errors. Scoped ESLint and the four review-camera tests passed. These checks do not replace owner motion approval or physical-device testing.
