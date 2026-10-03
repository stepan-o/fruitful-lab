# Factory entrance conveyor · 3 October 2026

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
- [ ] Run required CI; publish an isolated PR and verify its hosted preview.

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
