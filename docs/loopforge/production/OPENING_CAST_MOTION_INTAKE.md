# Opening cast motion intake

21 October 2026. Working production record; these are review candidates, not the accepted opening-scene cast.

The four-frame storyboard and separate found-card frame are published in draft PR #126. The corrected found-card composition is at commit `3575383161c6bbd9c3caac5c8fedad7bbec76c9e`, verified at https://fruitful-9f9txiask-stepan-oskins-projects.vercel.app/loopforge-design/narrative-episode.html#found-card. Its left-leg correction preserves the approved viewpoint. Rehearsal revision 10 adds physical card custody and sam’s paired support. The full goal remains unfinished.

## Bodies and motion transfer

All ten current Meshy body rigs completed and downloaded. The cumulative ledger is 400 credits, including the retired first bob and its rig, LIMEN’s right-hand slash, bob’s native Idle comparison, and native pickup trials for jo and ed, and sam’s native kneel source. 100 credits remain within the authorized total; no generation jobs are in flight. The approved card-holder seed is ed; the jo pickup remains a source trial, not the opening’s custody action.

Each rig has 24 joints and a single textured skinned mesh. The local candidate bank contains 19 transferred Worker 01 motions, the neutral source take and Meshy's companion walk/run: 22 clips per worker; bob has an additional locally authored Checkpoint Get Up, for 23. Source assets remain untouched. Transfer maps the accepted source rotations in bind space and preserves target bone lengths. Some source clips animate skeleton scale; the transfer now normalizes against each clip's actual leg length before transferring pelvis displacement. The earlier unnormalized transfer visibly lifted bob's feet.

The new bodies have no finger joints. Worker 01's ten finger tracks cannot be treated as transferred articulation. Hand/head, hand/leg and floor contacts require fitting to each new body.

## Delivery candidates

Local outputs have three independently loadable detail levels. All retain their full animation bank and the same rig. Attribute-aware Meshopt simplification preserves skin-weight fields, normals and UVs; WebP maps and Meshopt compression reduce transfer cost. The shared review loads the selected immutable asset and a local decoder, with its MIT notice preserved. The source body stays available at portrait detail; no private Meshy responses or signed download URLs are part of the delivery pack.

Across ten workers:

| Level | Triangles | Total model bytes | Texture edge |
| - | -: | -: | -: |
| Portrait | 248,218 | 25,766,960 | 1,024 px |
| Factory floor | 92,385 | 13,188,268 | 512 px |
| Console | 45,542 | 9,113,616 | 256 px |

These are asset measurements, not a frame-rate result. The first reduction damaged bob’s eye surfaces. Delivery revision 3 protects his head topology and preserves head UV seams on the other workers; it stops before the nominal reduction target when needed. bob uses 11,608 triangles on the floor and 9,054 in the console candidate. Both now retain the large circular lenses in the browser. Fine surface detail is reversible and defaults off for the console level. bob retains his source finish; the other workers have a reversible blue-enamel treatment for review.

## Contact evidence and outstanding work

The first bob scan samples 19 transferred clips at 15 Hz against his actual skinned mesh. It found head/hand contacts in Confused Scratch and the collapse, hand/leg contacts in several resting gestures, and up to 178 mm of floor penetration during the collapse. Earlier Worker 01 acceptance does not cover these new proportions.

The current fitted bank contains five bob clips and seven selected clips on each other worker. The source motion remains intact outside those fitted tracks. bob’s fall and recovery now use smooth elbow extension within the original arm plane in addition to shoulder clearance. At the 30 Hz sampled poses, both have zero remaining measured hand/head and arm-region intersections and a minimum mesh height of 2 mm above the source floor. This does not establish continuous-time, transition or partner-contact acceptance.

The nine other bodies receive individual hip and shoulder envelopes for Idle, Walk 2, Alert, Listening, Discuss, Agree and Catching Breath. ed, gus, mae and max clear the measured regions in these seven clips. Remaining samples include kit’s Agree arms, sam’s Agree arm, and leg-region contacts on ben, jo and lou. These require inspection of the actual surfaces; widening every stance until a coarse region test passes would damage the acting. Do not label the whole bank accepted.

All detailed results and original/derived GLBs are under `output/opening-cast/<worker>/`. The shared review route `/stepanoskin/loopforge/play/asset-review/worker?worker=bob` now has a Workers sub-navigation for all ten characters, plus the retained Worker 01 reference. Workers remain ahead of supervisors. The player offers every delivered clip (24 for six workers, 26 for bob and jo, 29 for ed and 28 for sam), three detail levels, fixed-floor scrubbing, orbit, front/side/back views, factory cameras, and a downloadable review record. The current local review and scene load the fitted candidates from the same immutable asset pack; motions outside the targeted pass remain transferred candidates. Both the review and encounter adapter sample the same baked tracks; the encounter adapter removes horizontal root travel while preserving vertical motion.

Local browser checks loaded every worker and sampled each clip. The rebuilt bob head was inspected at floor and console detail, and kit was inspected on a 320-pixel viewport. Layout widths of 320, 390 and 768 pixels have no horizontal overflow; the reference page remains usable. These checks establish loading and controls, not motion acceptance. All 30 packed banks pass integrity, skin, finite-channel and cross-detail clip-timing checks. The new sampler test covers source travel, both root-motion conventions, missing channels and blend endpoints.

## Opening integration

The current local scene uses all ten individual workers, LIMEN and STILETTO. A single cast adapter shares assets and deterministic sampling with their portrait reviews. The compact Lobby–Security layout owns both navigation and fixture locations. Security’s two register/tray stations use the same construction vocabulary as the factory equipment study. Workers use individual heights; the two supervisors stand at 1.5 times the median worker height.

The sequence now follows the storyboard: exterior approach from behind, greeting, volunteers, bob’s mistaken step and cyan strike, two helper checks, STILETTO’s continuous Quick Walk while bob remains down, recovery and admission. The strike has a low side composition. The six nearby workers withdraw when STILETTO reaches them; her walk phase continues through the doorway and LIMEN’s Step Back. The scene’s fixed-tick tests check these routes, clearances and causal effects.

LIMEN’s Action 219 right-hand slash was transferred onto the existing body using bind transforms. The unmodified transfer and the fitted Checkpoint Strike remain separate clips. The fitted arc lowers the striking arm 22 degrees during the active window; it leaves the accepted body and other animations intact. The 20-clip delivery bank passes glTF validation. The numbered generation record is `model-briefs/limen/07-checkpoint-strike.txt`.

The opening now has its own ten-minute acceptance protocol: actual repeated scene playback, four held compositions, real navigation and anchored speech, fixed 1280 × 720 reference graphics, 30-second warm-up and uncapped rendering. It checks overall and per-composition frame times, stalls, interaction response, two completed episodes and resource growth. Interrupted or hidden runs are invalid. The older 26-actor test remains a separate workload. The first complete production run on this Intel HD620 computer failed the stall criterion: 54.1 FPS overall, 29.5 ms p95, 39.7 ms p99, 31 pauses over 100 ms (maximum allowed: six), longest pause 176.1 ms. Response was 8.4 ms; two complete episodes and all resource/per-shot checks passed. The raw result and provenance are in `performance-results/2026-10-21-hd620-opening-baseline*.json`. These good averages do not override the failed stall check. The matched optimized production run passed: 55.6 FPS, 28.9 ms p95, 34.8 ms p99, four pauses over 100 ms (longest 122.7 ms), 10.4 ms input response, two full episodes and no resource growth. The strike shot had no pauses over 100 ms. The optimizations reuse sampling buffers, copy world snapshots structurally, reuse projections between ticks and defer closed author-panel contents. See `performance-results/2026-10-21-hd620-opening-optimized*.json` and the saved screenshot. This is one before/after comparison on HD620, not an attribution of each change or certification of other devices.

Remaining gates: review the full paired strike/fall/recovery and STILETTO passage, resolve visible body contacts and transition defects, fit paper/hand interactions, retain the measured performance while completing acting, and verify the published deployment. The pre-prop opening passed this machine’s sustained performance gate; revisions 8–10 need a new matched run, and physical phones remain untested. Successful generation, automated geometry checks and compression do not close these gates.

## Native Idle control

A three-credit Action 0 Idle was generated on bob's actual Meshy rig to distinguish a transfer error from the catalog posture. At the inspected pose, its wrist/upper-arm relationship was close to the transferred clip; the corrected bind-space comparison found no rig-basis rotation error. This is a single-pose diagnostic, not whole-clip acceptance. The trial remains a private source comparison and is not included in the runtime bank. Its numbered request and outcome are recorded in `model-briefs/bob/04-native-idle-control.txt`. Further purchases are not warranted by that comparison alone.

## Admission cards and ed’s pickup — local revision 8

The scene now carries physical admission cards with separate ownership, custody and observer knowledge. LIMEN’s strike drops bob’s card. ed stows his own, picks up bob’s from the floor, keeps it in a belt sleeve and takes out his own card before being checked. bob is not given knowledge of ed’s action. His later unchecked admission follows the factory-good exchange. The next LIMEN checkpoint and STILETTO’s throughput policy have engine tests, but their later-day player interface is not yet integrated.

The worker banks include fitted card-carrying idle/walk/limp tracks. ed additionally has the native pickup, fitted Pickup_Card, Stow_Card, Stow_ID and Draw_ID; his current bank has 29 clips at each detail level. The numbered request, source hash, timing and fit checks are in `model-briefs/ed/04-card-pickup.txt`. Preview and scene use the same clips and hand-socket metadata. Ten small card meshes share one 512-pixel atlas and material; ed’s open-top sleeve adds one merged mesh and material.

Local visual review caught and corrected a blank atlas, a floating pickup grip, incorrect orientation/planar-motion assumptions and ed bending into sam’s space. The revised floor contact was inspected in the actual scene at 80.65 seconds, followed by lift and stow. Four encounter suites pass 34 tests, including causal custody, private knowledge, later inspection and the entire opening route. All 30 delivery banks pass integrity and motion checks. At revision 8, sam’s help was still a held proxy pose. Revision 10 replaces it as described below; the new cast’s remaining motions still need acceptance. The earlier HD620 performance result predates revision 8 and must be rerun for this scene.

## Paired support and dialogue — rehearsal revision 10

sam now lowers into a fitted kneel, rests the right palm on bob’s shoulder, braces the other hand on his own knee, attends through the card checks and rises as bob recovers. The native Action 365 remains available as Kneel_Source. Kneel_To_Help and Rise_From_Help are 2.4-second derivatives; Attend_Bob is a six-second hold with restrained upper-body motion. Their 30 Hz surface audit found zero intersections among the ten tested body-region pairs and a 2 mm source-floor minimum. The uncompressed held-palm error is below one micrometre; this is a fitting measurement, not proof of the entire rendered interaction. Intermediate approach targets are reach-limited by up to 66.4 mm without stretching the rig.

The shared sampler’s explicit rootMotion: preserve cue retains the small baked balance shifts for stationary paired actions. Locomotion still removes planar root travel. The transition test covers both policies and arbitrary seek order. sam’s support clock continues across dialogue phases and his card stays put away while his hands are occupied. The raised impact camera makes bob’s fallen silhouette legible. Worker travel headings now follow their authored routes before the next stationary pose supplies a gaze.

The editorial guide is revision 7. TARANTINO_CASE_STUDY.md cites three primary interviews and develops their implications for conversation, group arrivals and revisiting familiar people. OPENING_EPISODE.md revision 7 and the runtime contain the same 50 spoken lines in order. The card arc preserves the approved factory-good exchange and ed seed. No positive trust or forgiveness is awarded for bob’s reply.

Validation: 36 encounter/custody/arrival tests and the shared sampler checks pass. All 30 packed banks pass integrity, 24-joint skin, finite-channel and cross-detail timing checks. The source contact reports are summarized in opening-r10-contacts.json. The review includes sam’s new fitted clips and ed’s pickup/stow/draw with the same props as the encounter. Remaining work includes the other workers’ draw/stow gestures, gus’s card handling, unresolved contacts in unused/secondary motions, the complete later-day search/intervention presentation, full scene artistic acceptance and a new sustained performance run. No additional Meshy jobs were submitted for this revision; spend remains 400/500.
