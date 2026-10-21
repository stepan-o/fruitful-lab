# Opening cast motion intake

21 October 2026. Working production record; these are review candidates, not the accepted opening-scene cast.

The revised strike panel and four-frame storyboard are published in draft PR #126 at commit `990107508281961a037a73889b0abf03811c994c`. The verified Vercel preview is https://fruitful-hsm8bnnh2-stepan-oskins-projects.vercel.app/loopforge-design/narrative-episode.html. The strike uses a low camera beside bob, sam reaching from the foreground and witnesses at different depths. This addresses the owner's request for a composition distinct from the greeting. The full animated scene remains unfinished.

## Bodies and motion transfer

All ten current Meshy body rigs completed and downloaded. The cumulative ledger remains 385 credits, including the retired first bob and its rig. There have been no additional paid tasks during motion fitting.

Each rig has 24 joints and a single textured skinned mesh. The local candidate bank contains 19 transferred Worker 01 motions, the neutral source take and Meshy's companion walk/run: 22 clips per worker. Source assets remain untouched. Transfer maps the accepted source rotations in bind space and preserves target bone lengths. Some source clips animate skeleton scale; the transfer now normalizes against each clip's actual leg length before transferring pelvis displacement. The earlier unnormalized transfer visibly lifted bob's feet.

The new bodies have no finger joints. Worker 01's ten finger tracks cannot be treated as transferred articulation. Hand/head, hand/leg and floor contacts require fitting to each new body.

## Delivery candidates

Local outputs have three independently loadable detail levels. All retain the 22 clips and the same rig. Attribute-aware Meshopt simplification preserves skin-weight fields, normals and UVs; WebP maps and Meshopt compression reduce transfer cost. The shared review loads the selected immutable asset and a local decoder, with its MIT notice preserved. The source body stays available at portrait detail; no private Meshy responses or signed download URLs are part of the delivery pack.

Across ten workers:

| Level | Triangles | Total model bytes | Texture edge |
| - | -: | -: | -: |
| Portrait | 248,218 | 25,324,652 | 1,024 px |
| Factory floor | 92,385 | 12,745,940 | 512 px |
| Console | 45,542 | 8,671,312 | 256 px |

These are asset measurements, not a frame-rate result. The first reduction damaged bob’s eye surfaces. Delivery revision 3 protects his head topology and preserves head UV seams on the other workers; it stops before the nominal reduction target when needed. bob uses 11,608 triangles on the floor and 9,054 in the console candidate. Both now retain the large circular lenses in the browser. Fine surface detail is reversible and defaults off for the console level. bob retains his source finish; the other workers have a reversible blue-enamel treatment for review.

## Contact evidence and outstanding work

The first bob scan samples 19 transferred clips at 15 Hz against his actual skinned mesh. It found head/hand contacts in Confused Scratch and the collapse, hand/leg contacts in several resting gestures, and up to 178 mm of floor penetration during the collapse. Earlier Worker 01 acceptance does not cover these new proportions.

A first offline fitting pass on six opening motions sampled at 30 Hz clears the measured body-region contacts in Alert, Idle, Walk 2, Listening Gesture and Injured Walk. It preserves the source knee/elbow curves and applies small shoulder envelopes. This has **not** received visual acceptance or a final high-frequency scan. In particular, the injured hand must still read as touching the sore leg rather than merely clearing it.

The fitted fall keeps the sampled mesh above the stationary floor, but 49 sampled frames still have hand/head contacts. Its shoulder-only correction is insufficient and must be replaced by a targeted elbow/wrist/contact treatment. Do not publish it as a finished recovery or use the local fitted bank as an accepted runtime asset.

All detailed results and original/derived GLBs are under `output/opening-cast/<worker>/`. The shared review route `/stepanoskin/loopforge/play/asset-review/worker?worker=bob` now has a Workers sub-navigation for all ten characters, plus the retained Worker 01 reference. Workers remain ahead of supervisors. The player offers 22 clips, three detail levels, fixed-floor scrubbing, orbit, front/side/back views, factory cameras, and a downloadable review record. It currently loads the transfer candidates, not the separate experimental fitted banks. Both the review and encounter adapter sample the same baked tracks; the encounter adapter removes horizontal root travel while preserving vertical motion.

Local browser checks loaded every worker and sampled each clip. The rebuilt bob head was inspected at floor and console detail, and kit was inspected on a 320-pixel viewport. Layout widths of 320, 390 and 768 pixels have no horizontal overflow; the reference page remains usable. These checks establish loading and controls, not motion acceptance. All 30 packed banks pass integrity, skin, finite-channel and cross-detail clip-timing checks. The new sampler test covers source travel, both root-motion conventions, missing channels and blend endpoints.

The six-clip fitting experiment has also run on the other nine workers. It still leaves contacts on several broad bodies, notably ben and jo, and has not replaced any review asset.

Next: finish bob’s paired fall/recovery and hand/head acting, fit the other proportions, integrate the new cast into the encounter, stage the revised script including STILETTO’s passage, then run actual device performance acceptance. None of those gates is implied by successful asset generation or compression.
