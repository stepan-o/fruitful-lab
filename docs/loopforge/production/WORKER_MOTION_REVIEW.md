# Worker 01 motion review — 13 October 2026

## Where to review

Game design → Agents → Production asset player → Worker 01. Direct route: `/stepanoskin/loopforge/play/asset-review/worker`.

The real Babylon Security/Forge renderer now reviews one worker with 19 named motions, a neutral pose, three CCTV angles, scrubbing, slow playback, textured/clay/wireframe modes, sampled-contact shortcuts and downloadable review evidence. Starts paused, pauses when hidden, disposes its scene on exit. No main-play cast, BDI, save or production rules change. These clips are candidates, not blanket gameplay acceptance.

## Correction status — confirmed 16 October 2026

The worker bank has been imported and audited, but has **not** received the
offline motion-correction pass applied to STILETTO. All 19 clips retain their
source movement. Review centering is a camera convenience, not a gait repair.

First correction targets: Walk 2 (shin intersection near 0.97 s), Run Fast 10
(leg intersection near 0.78 s) and Injured Walk (near 6.83 s). Then review the
flagged gesture/pivot contacts, preserving deliberate head scratching, limping
and expressive poses. Keep each source clip beside its corrected derivative,
sample the exported result through the full cycle, and compare in factory light.
Hot Walk remains reserved for CATHEXIS; her own corrected version is now approved.
Afraid recoil and precision machine/cradle work still require authored actions;
an audit or a renamed catalog gesture does not supply them.

## Owner decision: Hot Walk belongs to Cathexis

**Hot Walk is the correct public name and Cathexis’s intended default gait.** The owner confirmed both its Meshy catalog label and visual movement. Preserve its expressive hip-led crossover, confidence and attitude. The internal FBX alias `Confident_Walk` is provenance, not a reason to rename the motion or reject its style. Its runtime name is `Hot_Walk`.

The worker player retains it as a source-motion reference. CATHEXIS now has her own accepted body and corrected Hot Walk in her dedicated player. Deliberate leg crossing and actual surfaces intersecting are distinct: preserve the former while correcting the latter on the final character. Do not copy this FBX’s tracks directly onto LIMEN’s differently named 23-joint rig.

## Planned posture and hand pass — 14 October 2026

The owner asks for more natural arm/hand posture and finger articulation. This is
the next worker cleanup scope, not a claim that the current asset has changed.

1. **Posture on the existing rig.** Adjust shoulders, elbows, forearm roll and
   wrists per clip. Start with idle, walk and run; preserve the puzzled scratch,
   injured gait and intended prop contacts. Bake corrections into separate clips.
   A one-time runtime bone rotation would be overwritten by the next animation
   sample; a global arm offset could break deliberate gestures.
2. **Inspect the hands.** The present 24-joint skin stops at the hands. Inspect
   finger geometry, separation and hinge locations before adding finger chains.
   Usable geometry can be reweighted; fused or unsuitable fingers need local
   mesh cleanup or replacement hands. Do not regenerate the accepted whole body
   unless this inspection establishes a reason.
3. **Add mechanical articulation in Blender.** Parent finger chains below the
   existing hand bones while preserving body bone names, hierarchy and bind
   transforms. Use rigid weights for finger plates and hinges, with deformation
   confined to suitable joint geometry. Author relaxed curl, grip and release
   first; individual finger acting follows actual scene needs. Existing body
   clips need explicit/default finger poses so clip changes do not retain a
   previous grip accidentally.
4. **Export and compare.** Publish a new rig revision with updated skin-joint
   metadata and validators, preserving the current 24-joint source. Compare the
   rendered result against the source through all 19 motions. Check scratch/head,
   hand/body, gait, floor, blend and actual prop contacts; a gripping pose alone
   is not a completed work/cradle action.

Bake animation offline and play skeletal clips in Babylon; do not introduce
per-finger physics, per-frame React updates or a live retargeter. Keep hand detail
for close acting and compare its cost at CCTV/crowd scale before selecting a
background simplification. No performance improvement is assumed without a
measurement.

Blender's [skinning documentation](https://docs.staging.blender.org/manual/en/latest/animation/armatures/skinning/parenting.html)
describes assigning vertices to bone groups; its
[glTF exporter](https://docs.blender.org/manual/en/3.6/addons/import_export/scene_gltf2.html)
supports armature/skinning animation. The pipeline choice here is proposed;
Blender has not yet been used for this worker pass.

## Export audit

The latest `Loopforge Worker 01 - idle.fbx` (4.00 s) and `Loopforge Worker 01 - injured_walk.fbx` (8.67 s) contain real skinned geometry and motion. Geometry, weights, inverse binds and hierarchy match the other 17 standalone exports. Together: 25,893 triangles, 27 source nodes, 24 skin joints (22 weighted), no finger articulation. No vertices are unweighted; source weights are normalized. The original exports remain unchanged.

Idle had no detected contact at the three sampled closest poses. Injured Walk has positive leg mesh intersections at 6.833 s. The earlier replacement Walk 2 and Run Fast 10 still need leg-clearance work. Checking negative foot spacing alone is not sufficient to reject a motion: intentional crossing can be part of acting.

`afraid_recoil` and precision `work_cradle` remain unprovided. Carry Heavy Walk is locomotion with a holding pose, not a substitute for machine interaction. Those two clips need offline authoring against actual props. Meshy’s smooth skinning can also bend metal plates; rigid plate weights and joint clearance remain a later cleanup gate.

## Motion inventory and flags

Source filenames and hashes are captured in `apps/lab/lib/loopforge/agents/worker-review.json`. The public labels below describe the reviewed motion, not inferred action IDs.

| Preview | Duration | Intended actor | Review note |
| --- | --- | --- | --- |
| Idle | 4.00 s | Worker | New export. Staggered stance with torso turns and weight shifts; review foot planting before using as the default idle. No contacts found at the three sampled closest poses. |
| Walk 2 | 1.20 s | Worker | Replacement walk candidate. The worker shins still intersect near 0.97 s; needs clearance adjustment. |
| Run Fast 10 | 0.80 s | Worker | Run is present. Legs cross/intersect near 0.78 s; review at quarter speed. |
| Confused Scratch | 11.50 s | Worker | The requested puzzled idle is present. Check boot clearance near 0.20 s; keep the deliberate hand-to-head gesture. |
| Injured Walk | 8.67 s | Worker | New export. Limp is present; leg meshes intersect near 6.83 s. Keep the damaged gait, adjust clearance. |
| Hot Walk | 5.77 s | Cathexis | Owner confirms Hot Walk in Meshy and selects it as Cathexis’s default walk. The hip-led crossover and attitude are intentional. This worker is only a source-motion reference; CATHEXIS’s own corrected version is now approved. |
| Alert | 4.00 s | Worker | Attentive stance. No contacts found at the three sampled closest poses. |
| Agree Gesture | 13.00 s | Worker | Long acknowledgement, not a tiny nod. Forearms intersect near 10.17 s; trim and adjust contact before gameplay. |
| Angry Stomp | 8.00 s | Worker | Expressive reaction. Check legs near 0.45 s and arm crossing near 5.27 s. |
| Catching Breath | 7.00 s | Worker | Includes a running approach before the recovery pose; about 6.24 m of pelvis travel. Select/author the recovery portion for a stationary overheating idle. |
| Discuss While Moving | 8.03 s | Worker | Gesture with real travel (about 1.75 m net). Check legs near 4.15 s; placement and interruption need authored transitions. |
| Listening Gesture | 9.33 s | Worker | Attentive gesture; boot clearance needs adjustment near the end. |
| Victory Cheer | 9.33 s | Worker | Celebration with close feet near 1.27 s. Review overhead clearance in the room. |
| Electrocution Reaction | 4.67 s | Worker | Shock reaction. No contacts found at the sampled closest poses; keep action timing tied to a confirmed incident. |
| Electrocuted Fall | 6.33 s | Worker | One-shot collapse with vertical and forward travel. Check legs near 4.33 s and author ground contact; do not loop in gameplay. |
| Push Forward and Stop | 2.60 s | Worker | Stepping two-handed push. Needs an actual prop/contact target and leg clearance near 0.87 s. |
| Idle Turn Left | 0.93 s | Worker | Pivot transition. Inspect boot overlap near 0.53 s; reconcile heading with the agent path. |
| Idle Turn Right | 1.10 s | Worker | Pivot transition. Inspect boot overlap near 0.63 s; reconcile heading with the agent path. |
| Carry Heavy Walk | 6.50 s | Worker | Cradled carry pose; no contacts found at the three sampled closest poses. This is not the missing precision work/cradle interaction. |

## Audit limits and conversion

Native ufbx 0.23.0 evaluated each source FBX at 60 Hz. The audit compared geometry/skin/bind/hierarchy hashes, measured pelvis travel and joint clearances, then tested skinned triangle intersections at each clip’s closest-leg, closest-arm and closest-hand/head poses. These are targeted candidates, not a full-cycle or swept-volume collision certificate. A non-contact result does not certify every frame. Markers in the player open those exact source times.

The intermediate GLB uses metre conversion, the verified FBX inverse binds, original per-corner normals/UVs and sampled local TRS. Its source-to-skin check against native evaluation at Walk 2 / 0.9667 s had maximum vertex error below 0.00003 cm. The 8 strongest skin weights are retained/renormalized; the greatest discarded influence is 0.1163%. Source has up to 9 weights. Existing review material maps come from the same worker; full-surface emission is removed. There is no live retargeter or IK in this bench.

`import-worker-review.mjs` pins the verified intermediate hash, welds duplicate vertices, resamples tracks at 1e-5 tolerance, deduplicates data, optimizes the packed metallic/roughness texture and publishes through the existing immutable asset pipeline. One GLB is 7,486,164 bytes / 7.14 MiB, with 43,444 runtime vertices, all 19 clips, a 2048² colour map and a 1024² packed metallic/roughness map. This review-only budget covers the whole motion library, loaded only after opening its player. Source FBXs, duplicated neutral bodies and 4K masters are not shipped. The validator reports zero errors and the inherited non-root skinned-mesh warning, also present in the LIMEN review. Babylon visual verification is required as well as syntax validation.

Horizontal subject-centering is a review transform and can be disabled to expose source travel. It does not alter the clips or certify in-place navigation. Vertical travel remains intact for falls. One-shots stop at their last frame by default; repeat is an explicit review option. Runtime BDI integration must own travel, heading, reservations, transitions and contacts separately.

The raw source archive inventory, parsed frames, skin/contact checks and unoptimized intermediate remain in the local `worker-audit-v2` artifact directory. The imported app derivative has a content-hashed GLB, pinned manifest and short-lived pointer. Temporary app delivery follows the existing owner-approved CloudFront-pending approach; no S3 access policy, credentials or distribution are changed here. Source upload and CDN migration remain separate work.

## Validation

Asset integrity, clip identity, finite animation/skin data and the new review route are checked with the revision. Browser and production-build results are recorded in the PR; physical-device and crowd performance remain unmeasured. Do not inherit prior LIMEN benchmark numbers as worker results.

### Implementation check, 13 October

Production build completed with the full asset/character validation gates. Scoped ESLint passed. The agent-production, console-layout and LIMEN idle-cue suites passed (3 suites / 22 tests); the asset publication test passed. A broad Jest invocation was stopped before results while competing with the build; the focused run completed successfully. Standalone `tsc --noEmit --incremental false` also reports existing test-file type errors (floor test, Pinterest NODE_ENV assignments, Testing Library `exact` options and GrowthBook mocks); no new worker files were reported. The Next production build/type stage succeeded.

Browser verification used the production server: design Agents → library → Worker 01 → back/reopen, 19 selectable motions plus neutral, Hot Walk playback/pause, exact contact jumps, Injured Walk, Confused Scratch, clay view, model/CCTV switching, Security/Forge and the second CCTV angle. The new Idle and Injured Walk were also reviewed as nine-pose source sequences in the diagnostic player. No captured browser warnings/errors. Phone/tablet viewport checks at 320/390/768 px showed no horizontal overflow; 390 px screenshot captured. This is a desktop viewport test, not physical-phone or crowd certification. Review still opens paused; source motion remains unchanged.
