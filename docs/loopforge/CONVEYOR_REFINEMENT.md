# Factory entrance conveyor · 3 October 2026

## Active visual rebuild after owner review

The previous flat specimens and braid pass are rejected as too sloppy. The new
acceptance bar is a carefully composed, dimensional factory with cinematic
lighting. Performance remains important; it must not excuse unfinished visuals.

- [x] Fit logo, horizontal three-path menu, adjacent reset lever and prominent
  conveyor into the first viewport on desktop and phones, including short screens.
- [x] Replace flat cargo with shaded procedural 3D cortex forms and restrained,
  accurately seated cyan wiring. Preserve damaged specimens and factory oddities.
- [x] Rotate the beacon reflector continuously 360 degrees about its vertical
  shaft. The housing stays upright; it must not rock from side to side.
- [x] Use the same light orientation for lens, beam, stage-wide reflections,
  glare and projected shadows. Running amber stays quiet; a jam turns it red.
- [x] Review multiple phases in motion, compare original factory art, iterate.
- [x] Measure the GPU scene's bounded geometry, resolution and frame work; verify
  motion preferences, keyboard/phone controls, first viewport and production CI.
- [x] Update PR #59 and verify the hosted result.

## Current implementation

This procedural WebGL2 scene replaces the Canvas2D passes documented below.
Three.js 0.186.1 is scoped to the landing. It uses generated cortex/harness geometry,
a procedural reflection environment, one 1024px rotating shadow map, bounded
volumetric/flare geometry, generated grain and merged/instanced stationary parts.
No external reference pixels, models, textures or new runtime raster art ship.

The belt holds its decorative distance during a jam. Periodic carrier/roller
strain and a tugging, glowing reset handle give the stopped machine tension.
The instruction is beside the menu-mounted lever, including on phones. It is
associated with that button for screen readers. Reset works by drag, click or
keyboard; restart releases the strain. Reduced motion retains a readable still
state. Pause reuses the renderer; graphics loss stops work and shows a fallback.

Output is capped at 1800 × 1100 pixels, 1.5× CSS resolution and 30 submissions/s.
Static geometry is batched by material; belt/rollers/bolts are instanced. Shader
preparation is asynchronous. Geometry, textures and materials are disposed, and
resizing releases the previous merged frame. This is a larger delivery/runtime
budget than Canvas2D, accepted to support dimensional surfaces and coherent light.
Actual-phone and field performance remain unmeasured. Older measurements below
belong to superseded implementations.

## Verification for the 3D stage

- Required CI: 43 suites / 190 tests, asset validation and optimized Next/TypeScript
  build passed after merging master f6467a8. Focused ESLint passed. Two added tests
  cover menu-local reset instructions/renderer reuse and graphics loss/recovery.
- Browser checks: desktop 1280 × 720, 320 × 568, 390 × 844, 768 × 1024 and short
  landscape 844 × 390. Conveyor and control stay in the first viewport. Keyboard
  reset and a 43px pointer pull both enter DRIVE ENGAGING. A late landscape
  alignment correction and viewport-dependent support fix are in the final build.
- No browser console errors in the optimized build. Pause/hidden/reduced-motion
  and teardown behavior have automated coverage; pause does not recreate Three.
- Three-containing production chunk: 619,122 bytes raw / 156,197 bytes gzip in
  the first optimized build (not the total route payload). The prior Canvas2D
  renderer chunk was approximately 13KB gzip; this is an explicit cost for depth,
  surface lighting, coherent shadows and a reusable scene foundation.
- Representative cold desktop submission sample: 1280 × 720, 1800 × 1013 buffer,
  120 frames, 10.12ms mean / 427.70ms maximum including initialization. 176 draw
  calls / about 401k triangles at the captured phase. Shadow/visibility phases
  change these counts. This is CPU submission on a shared desktop, not GPU/FPS,
  actual-phone or field evidence. The startup outlier is retained.
- Hosted preview d998c27 is READY and verified without console errors:
  https://fruitful-gpb0qfrg5-stepan-oskins-projects.vercel.app/stepanoskin/loopforge
  The deployed red lens, stage sweep, jam tension and adjacent hint were reviewed.
  A phone-size pull, keyboard reset and pause/resume passed. At 320px and 390px,
  document width equals viewport width; the hint stays inside the first screen.
  Landscape 844 × 390 has no menu/conveyor overlap. Production awaits owner merge.
- Hosted cold sampling also recorded a 737.2ms draw outlier and 18.26ms mean over
  the first 120 landscape submissions. These include startup/shared-host overhead;
  the larger outlier is retained rather than treating the earlier sample as a bound.

Current hosted evidence:
- [Desktop jam and red sweep](evidence/loopforge-stage-jam-desktop.webp)
- [Phone jam and adjacent instruction](evidence/loopforge-stage-jam-phone.webp)
- [Short landscape composition](evidence/loopforge-stage-landscape.webp)

## Brief and checklist

- [x] Inspect the original assembly-line, three-lane and conveyor-character art.
- [x] Inspect moving conveyor and rotating-beacon references, and Sanctuary's
  bounded procedural hearth implementation.
- [x] Build a dimensional, worn conveyor with supported trays and varied brains.
- [x] Add deterministic procedural cargo: organic, augmented, contained,
  damaged/rejected, plus occasional skull/halo/other factory mischief.
- [x] Add uneven drive pulls, chain take-up, carrier settling and local sparks.
- [x] Add occasional jams and a touch/keyboard/pull restart lever.
- [x] Put the beacon beneath the belt: subdued amber running, red on jam.
  Its light and cast shadows must reach across the scene's full screen width.
- [x] Remove the entire Working Exhibit from overview chapter 01 only.
- [x] Verify the actual landing on desktop and phones, time-separated movement,
  jam/restart, reduced motion, hidden/offscreen suspension and render cost.
- [x] Run required CI; publish an isolated PR and verify its hosted preview.
  Completed in PR #57; merged as `6ba00fe` and verified in production.

## References and interpretation

Owner-supplied images inspected in the separate Loopforge repository:
`cards/rooms/cortex_assembly_line.png`, `concept_art/loopforge_3_lanes.png`,
`concept_art/loopforge_factory_rooms.png`, and the conveyor-operation images
`stiletto_conveyor_success_1`, `cathexis_conveyor_failure`,
`rivet_witch_conveyor_repair`. Cues: heavy linked steel, cradled exposed brains,
brass wear, dark bearing recesses, teal equipment, hot amber work lights, cages,
skull rejects and small engraved identification plates. These remain references;
new runtime machinery is drawn procedurally.

Moving references, viewed in the browser:

- [Dorner 2200 modular conveyor footage](https://www.dornerconveyors.com/videos/2200-series-conveyor-videos)
  ([specific video](https://www.youtube.com/watch?v=_Jk2aTqqVkU)): linked surface,
  stationary side rails, end return and cargo supported by the moving bed.
- [WERMA rotating-beacon demonstration](https://www.automationdirect.com/videos/video?videoToPlay=EztVCzVsxjE):
  a concentrated bright sector travels behind ribbed translucent plastic;
  the lens stays dark elsewhere. Use this optical relationship with a much slower
  artistic sweep, not its 180rpm product speed.
- [Anatomography rotating brain](https://commons.wikimedia.org/wiki/File:Rotating_brain.gif):
  hemisphere separation, irregular rounded gyri and deep sulci. Shape study only;
  no source pixels or geometry are shipped.
- [Workshop welding footage](https://www.pexels.com/video/professional-welding-steel-6046358/):
  reference for localized bright origin, short ballistic trails and fast cooling.

Sanctuary's `Hearth.tsx` / `hearth-renderer.ts` supply the rendering discipline:
bound pixel/frame work, separate light from material, and compare actual motion.
This scene uses cached Canvas2D machinery/cargo sprites with one 30fps loop;
no per-frame React state, texture downloads, new graphics package or model call.
Modern industrial reference machinery is smoother than the deliberately worn
Loopforge drive: hesitation, backlash, impacts and jams are artistic exaggeration
requested by the owner. The beacon's position below the belt supersedes the
earlier instruction to place it on top.

## Verification record

- Production CI passes: asset integrity checks, 40 Jest suites / 178 tests,
  optimized Next build and its TypeScript check. Focused ESLint passes.
- The standalone `tsc --noEmit` command also visits unrelated test files and
  reports existing test-typing errors in Pinterest, Sanctuary and GrowthBook;
  none are in this change. The required production build passes.
- Actual entrance reviewed at 320, 390, 768 and the default 1280px desktop
  viewport. No page overflow. Phone pause is 44px high; lever is 92 × 119px.
- Browser checks: automatic jam, persistent stop, downward pointer drag,
  keyboard Enter restart, paused reset, pause/resume persistence. Automated
  coverage additionally checks OS reduced motion, hidden/offscreen cancellation,
  teardown and missing canvas. No autoplay sound.
- Cargo folds revised after comparison: replaced uniform tiles with seeded
  hemisphere ridges and broad form shadows. Tablet scene height tightened.
  Beacon intensified with a slow reflector-facing horizontal flare, not a strobe.
- Pixel work capped at 1600 × 540 and 1.25 resolution scale; no more than 30
  draws/second. Cached backgrounds, fascia, slats and 12 cargo variants are
  regenerated only on setup or resize. The drive is decoration, not game state.
- Added image/video payload: **0 bytes**. References are linked, never embedded.
  No LLM testing or narration calls were needed. Field Core Web Vitals remain
  unmeasured; local render timings are laboratory observations only.

Production laboratory sample (1280 × 720, DPR 1): drawing surface 1575 × 413,
1,380 sampled draws, 2.06ms mean CPU submission time with a 167.20ms worst
observation on the shared development host. The mean is not an FPS or GPU
measurement and the outlier is not hidden. Frame count stayed at 2,220 across
time-separated observations after scrolling the scene offscreen.
The complete entrance client chunk is 17,295 bytes gzip (including existing
menu/effects and this renderer). Existing desktop logo is 152,560 bytes, served
at 608 × 405 CSS pixels; conveyor adds no images. Cold production navigation
and warm internal navigation were visually checked for complete layout; browser
performance timing APIs were unavailable, so no cold/warm speed claim is made.

Screenshots from the optimized production build:

- [Desktop entrance](evidence/conveyor-desktop.webp)
- [Running / amber](evidence/conveyor-running.webp)
- [Jammed / red](evidence/conveyor-jammed.webp)
- [Phone](evidence/conveyor-phone.webp)

Phone-width production sample (390px, DPR 1, desktop browser emulation): 1,020 draws,
1.05ms mean / 17.50ms maximum CPU submission time. Real mobile hardware remains
unmeasured. Phone-size click restart passed with no browser errors.

## Cyan neural braids · follow-up

Owner direction: make the specimens read as Loopforge brains, including cyan
braids that pulse and occasionally burst. The reference forge paintings have
dense, deeply shadowed folds, bronze machinery and cold cyan equipment.

- [x] Reinspect the owner's cortex assembly, three-lane factory,
  `04_loopforge_rooms_neural_lattice_converyor_1` and
  `08_loopforge_rooms_brain_forge_10` paintings.
- [x] Replace shallow regular ridges with dense, asymmetric rounded lobules.
- [x] Weave three cyan fibre cores around each specimen, with dark casing,
  brass ferrules, variant-specific routing and loose damaged ends.
- [x] Add independent travelling signal packets, slow emission pulses and
  infrequent branching discharges with short cooling fragments.
- [x] Keep static/reduced-motion brains lit; reuse the existing visibility,
  pause, 30fps and pixel limits. Preserve all cargo variants and lever behavior.
- [x] Review the finished production build at desktop, 320, 390 and 768px.
- [ ] Record performance, screenshots and CI; publish a focused PR/preview.

Additional moving reference: Colin's
[plasma globe filmed from above](https://commons.wikimedia.org/wiki/File:Plasma_globe_23s.webm)
(2013, viewed in the browser). Thin, wandering filaments terminate in brighter
knots; local bloom surrounds a narrow light core. The procedural interpretation
uses a slower single discharge envelope, not the video's continuous flicker.
No reference pixels or video are shipped.

`factory-neural.ts` builds the braid geometry once for each of the 12 cached
specimens. Static material and emission sprites are separate. Only packets and
a maximum of one scene-wide discharge are drawn dynamically. Discharge onsets
are seeded and irregular, at least 4.6 seconds apart; each lasts at most 1.15
seconds and fades without high-frequency flashes. Geometry and timing have no
relationship to authoritative game state or model calls. No dependencies,
downloaded textures or runtime media bytes are added.

Verification: all 43 suites / 188 tests, asset checks, optimized Next/TypeScript
build and focused ESLint pass. Desktop, 320, 390 and 768px views have no horizontal
overflow. Time-separated browser views show travelling packets and a localized
branching burst. Phone-size click restart and manual pause/resume pass; the paused
view keeps the cyan material. Offscreen animation reports inactive; existing
automated coverage also checks reduced motion, hidden documents and teardown.
No browser console errors. Cold production navigation and subsequent warm
navigation/resizing were reviewed; no field-loading claim is made.

CPU draw-submission samples from this shared desktop host (DPR 1): desktop
1280 × 720 / 1575 × 413 drawing surface, 300 frames: 3.67ms mean / 21.80ms max.
Phone emulation at 390 × 844 / 463 × 325, 1,380 frames: 5.64ms mean / 253.70ms
max. The large phone-sample outlier is retained; these observations are not GPU,
FPS, actual-device or field-performance measurements. The renderer-containing
production JS chunk is 12,743 bytes gzip; this is not the complete route payload.
New emission layers use twelve fixed 340 × 280 cached surfaces, disposed on
teardown. Field Core Web Vitals and real-phone performance remain unmeasured.

- [Desktop brain refinement](evidence/cyan-brains-desktop.webp)
- [Phone brain refinement](evidence/cyan-brains-phone.webp)
