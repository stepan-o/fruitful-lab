# Lattice-forge visual rebuild

Supersedes the art-quality conclusions in BRAINCRAFT.md. The prior procedural
cortical relief read as flat embossed plaques; its geometric machinery did not
match Loopforge's dense, realistic industrial paintings.

## Visual authority and production assets

User-owned Loopforge reference paintings:
- `04_loopforge_rooms_neural_lattice_out_1.png`: rounded anatomical folds,
  dense dark clefts, heavy tissue and furnace bounce.
- `04_loopforge_rooms_neural_lattice_converyor_2_rivet_witch_cagewalker.png`:
  teal atmospheric depth, oxidized iron/brass, recesses and machinery layers.

Three new generated assets derive from these references, created with built-in
ImageGen on 4 October 2026. They are interpretations, not extracted original
concept-art sprites. Source master PNGs remain outside runtime deployment in
Codex's generated_images archive. Optimized build inputs are in
`apps/lab/assets/loopforge-stage/`; the `loopforge-stage` immutable pack owns
responsive delivery. Transparency was verified on the specimen sheet.

- Six-specimen atlas: anatomical hemispheres, organic folds, damaged cortex,
  implants, surgical repair and a fine brass astronomical-wire specimen.
- Lattice environment: empty straight belt, recessed machinery, teal/amber hall.
- Beacon: fixed worn cage and smoked fluted glass; rotating reflection is code.

## Rendering approach

Hybrid artwork and procedural animation. Static assets supply material detail
and anatomical form; code supplies shared drive motion, jam strain, restart,
registered fine neural fibres, pulses/discharges, fog, dust, the beacon orbit,
stage-wide light/shadow sweeps and specimen light response. Canvas runs at a
30 fps cap with a bounded drawing resolution, and no per-frame React updates.

The atlas contains six distinct specimens. Twelve carriers vary scale and
specimen order; particles and activity use deterministic seeds. Artwork loading
must complete before motion starts. Failed loads retain an illustrated HTML
still and usable navigation. Pause, reduced motion, visibility and unmount
all stop drawing; async completion cannot restart an unmounted scene.

## Checklist

- [x] Replace embossed cortex with anatomical specimen artwork.
- [x] Replace smooth geometric conveyor with lattice-forge machinery.
- [x] Add layered teal/furnace atmosphere without covering menu copy.
- [x] Match beacon material and preserve the upright rotating reflector.
- [x] Preserve uneven continuous travel, genuine jams and reset instructions.
- [x] Complete desktop / 320 / 390 / 768 visual and interaction review.
- [x] Verify production build, automated behavior and runtime delivery costs.
- [x] Publish draft PR and check the exact hosted preview.

Field performance remains unmeasured. CPU drawing measurements are not frame
rate or GPU measurements. The visual result requires its own screenshot review;
a passing test suite does not establish art quality.

## Local review

Inspected 1280×720, 390×844, 320×568 and 768×1024. Navigation and the
conveyor remain in the initial viewport, without horizontal overflow. A 42px
pointer pull restarted a jam on the phone; Enter restarted it on the tablet.
Manual pause stopped animation. Automated coverage includes reduced motion,
hidden/offscreen suspension, artwork failure and late resolution after unmount.

The static art pack is 217,806 bytes for its phone variants and 701,722 bytes
for desktop variants. This excludes the existing logo and noise texture;
high-DPR logo selection can exceed the typical initial-image target. That
tradeoff retains anatomy and material detail in the prominent factory scene.
Runtime art is loaded once; six cached specimens are shared by twelve carriers.
Phone specimen caches are 256px; desktop caches are 420px. No new dependency.

The first complete CI run passed 196 tests. Two asynchronous loading tests were
then added and the focused suite passed. The final broad test run's three auth
suites needed API_BASE_URL restored; their rerun and final build are recorded
in the delivery evidence below.

## Hosted evidence

PR #71, runtime commit `8fc0a033c5715809817f52531b22642f19d27a70`, Vercel
`dpl_94f3zFoEBFBL5H86yc2T1YGMGyFA` READY. Hosted desktop and phone showed no
console errors or overflow. The actual 45px phone pull and desktop Enter both
changed LINE JAMMED to DRIVE ENGAGING. The attached screenshots show the running
desktop and jammed phone; `evidence/lattice-desktop-jam.webp` shows red glass.

The final test state is 198 passing tests across 45 suites (181 in the broad
run, then 17 auth tests with the required environment restored). The optimized
production build, ESLint and asset integrity checks pass. The landing chunk is
44,451 bytes raw / 17,065 gzip before the final sizes-string-only correction.

Hosted phone at 390×844 / DPR 1 selected the 768px scene and atlas plus 160px
beacon and 384px logo: 278,778 total image bytes including noise. The original
440px logo sizes hint overfetched on desktop; it now mirrors the actual responsive
CSS width. At 1280×720 / DPR 1 this targets 762,694 total image bytes. Higher-DPR
logos can exceed these typical budgets; anatomy/material quality takes priority.

Representative hosted CPU draw samples: phone mean 1.84ms / max 19.3ms over
1,200 frames, with 57.4ms cache creation. Desktop mean 2.78ms / max 83.5ms over
240 frames, with 125.3ms cache creation. These include startup/browser contention;
the maximum is a real outlier, not an assertion of locked 30fps. GPU and real
device field performance remain unmeasured. First and cached reloads both rendered
correctly; cold/warm network timings were not measured.

The global PROJECT_MEMORY and REPO_GROUNDING_PACK updates remain local pending
explicit publication approval after automatic review blocked their full payloads.
The runtime and Loopforge-specific notes are published independently.

![Desktop running](evidence/lattice-desktop.webp)
![Phone jammed](evidence/lattice-phone.webp)
