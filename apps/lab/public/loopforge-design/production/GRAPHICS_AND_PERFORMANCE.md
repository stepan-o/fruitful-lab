# Graphics profiles and controlled performance comparisons

The [static cast-readability studio](/stepanoskin/loopforge/play/readability) auditions room and character treatment with fixed poses, adjustable colour/size and 1280×720 / 320×180 outputs. It reuses the shared factory renderer with a persistent fixed-shot camera and demand rendering. It has no animation playback, FPS acceptance claim or changes to the frozen performance fixture. See [the readability standard](CAST_READABILITY_STANDARD.md#static-comparison-studio--2026-10-18).

18 October 2026. Scope: Fruitful Lab / Loopforge presentation. Gameplay, BDI,
identity, assignments and action timelines are independent of graphics quality.

## Opening room pilot and lighting experiment — 21 October 2026

The 12-character opening with the delivered wash housing, changing brain materials and moving belt **failed** the ten-minute HD620 reference test: 46.3 FPS, 33.9 ms p95, 46.1 ms p99, 28 pauses over 100 ms (limit six). Input response was 78.4 ms and resource counts stayed fixed through four complete episodes. All twelve shots were sampled. Twenty-six pauses occurred in Security shots; this is location evidence, not proof of their cause. The first STILETTO passage and later helper positioning need profiling. [Raw result](performance-results/2026-10-21-hd620-opening-r12.json). This run preceded the optional station-light code and used glow-only effects. Do not present its average FPS as a pass.

Scene studies now offers Glow only, Light spill and Light + shadows. One active-station spotlight serves washing or pressing, with a bounded range and one 512px shadow map. Opaque nearby solids cast; spray streaks do not. Global Shadows off suppresses the map while retaining spill. Glow is the default; additional light is an experiment pending evidence. Shadows must be visible and useful before their cost is accepted.

The three-minute comparison repeats the same 93–113-second wash/press sequence twice per configuration at fixed 1280×720 reference graphics, after five seconds of warm-up. It measures frame cadence, CPU render submission, draw counts and long pauses for glow, spill, shadows and a repeated glow baseline. No GPU timer is claimed. Hidden/scrolled-away/context-loss/settings changes invalidate the diagnostic. It does not replace the sustained opening acceptance test.

## Implemented

The shared preferences are versioned and browser-local. Automatic, Performance,
Balanced, High and Custom control target cadence (30/60), render scale,
shadows, bloom halo and FXAA edge smoothing. Storage failures retain in-session
preferences. Same-tab and cross-tab changes reach mounted renderers. Reset returns
to Automatic. Heavy Babylon code stays behind the existing lazy scene imports.

Automatic starts showcase inspection at full resolution/full shadows, rooms at
85%/512px main shadows, and the future overview profile at 65%/no shadows.
Automatic resolution moves gradually within 50% and the context ceiling. Manual
resolution never adapts. All profiles preserve full approved character geometry,
animations, speech and emissive identity features. Turning off bloom removes the
halo, not the blade/visor/eye emitter. Reduced-motion/pause behavior remains
independent. Presets are starting choices, not hardware certifications.

Controls appear in Game menu → Settings and the in-shift Settings panel, with
shortcuts in character workbenches and scene studies. Opening the in-shift panel
pauses the simulation; changing graphics never restarts the run. Settings are shared; close character inspection and room rehearsals
resolve different automatic budgets. The overview profile is an architecture
extension point, not a completed whole-factory feed.

## Measurements

`/stepanoskin/loopforge/play/performance-lab` loads the approved 24-worker pool,
LIMEN, STILETTO, machinery and two speech bubbles. Eight configurations each warm
for 15 seconds and measure 60 seconds across the same six room/camera combinations:

1. Original full-detail reference.
2. 75% resolution only (960 × 540 instead of 1280 × 720).
3. Shadows off only.
4. Bloom halo off only.
5. Worker poses held; supervisors/machinery continue.
6. Eight visible workers; hidden actors skip pose updates but stay resident.
7. Performance preset, a deliberately combined change.
8. Reference repeat, exposing order/temperature/background-load drift.

There is also a one-configuration run using the current saved room settings.
Automatic settings are resolved and frozen before preparation. Tests ignore the
player frame cap and adaptive resolution so capacity is measurable. Configurations,
actual resolution, assets, environment, six angle samples, CPU submission time,
worker pose time, optional GPU time, draw counts, triangles and stalls are exported.
Absent GPU samples are null/unavailable, never zero. GPU observations arrive
asynchronously; CPU and GPU overlap and must not be summed. CPU time covers JS
updates/render submission; worker pose time is a subset, excluding Babylon's skin
preparation. Context loss, hiding the document, scrolling the scene offscreen or
cancelling invalidates the suite. Results are COMPLETE/INVALID, never acceptance
PASS. Repeat important comparisons in reverse order to test drift before strong
causal claims.

`/stepanoskin/loopforge/play/performance-test` retains the frozen original 720p
reference and adds a selected-settings profile. Each profile records its exact
configuration and uses the same ten-minute acceptance thresholds. Selected
resolution is fixed throughout, clearly separate from the historical reference.
The original recorded HD620 result remains unchanged. See
[acceptance protocol](FRONTEND_PERFORMANCE_ACCEPTANCE.md).

## Visual acceptance alongside frame time — 18 October 2026

The owner’s crowded-room review shows that the current fixture does not make
LIMEN and STILETTO reliably distinguishable from the workers. The real models and
emissive features are loaded, but asset presence is not recognition. The
[cast readability standard](CAST_READABILITY_STANDARD.md) adds a separate visual
gate: persistent silhouette/value/equipment cues, event-led attention and
names/speech-hidden review at actual room-camera sizes across quality settings.
The current regular crowd and fixed wide cameras remain a load fixture, not
accepted gameplay staging. A recognition mode and its evidence are pending;
existing benchmark results and their performance thresholds remain unchanged.

## Next asset and presentation stages

Model/texture quality menus are intentionally absent until tested assets exist.
Derive showcase/floor/overview meshes offline from the approved bodies, preserving
rig, weights, UVs, silhouette, masks, tools and corrected motions. Extend model
metadata with explicit tiers/rig compatibility; load on demand and retain a bounded
cache. Validate screen-size transitions and all approved clips before promotion.

Foreground interactions keep full animation fidelity. Background animation cadence,
baked crowd instances and reduced rigs require measured, separate validation;
they are not implemented by these settings. In particular, reduced geometry alone
does not eliminate pose/skeleton work.

One-room, connected-room, showcase and eventual summary feeds each need their own
sustained workload. Use one authoritative world with scoped visible room sets and
actor IDs. The console aspiration should compare one overview camera with scheduled
small render targets sharing one renderer. Do not create an independent engine and
simulation for each miniature feed. Offscreen decisions and speech/event delivery
remain meaningful even when presentation refresh is reduced.

## Validation record

The first complete comparison ran on 18 October 2026 in the optimized local
production build, using Intel HD Graphics 620 / Mesa / ANGLE, Chrome 154 on Linux,
four reported hardware threads and device-pixel ratio 1. No build or test runner
was active during measurement. Existing user applications remained open. Available
memory before the run was approximately 2.47 GB and swap was full; these are
working-machine measurements, not an isolated hardware certification.

| Configuration | FPS | Frame p95 (ms) | CPU mean (ms) | GPU mean (ms) | Worker pose mean (ms) | Stalls >100 ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Reference | 23.6 | 52.6 | 19.3 | 38.3 | 6.69 | 6 |
| 75% resolution only | 22.5 | 68.9 | 26.8 | 34.8 | 7.81 | 8 |
| Shadows off only | 25.1 | 67.1 | 23.0 | 28.2 | 7.86 | 27 |
| Glow halo off only | 20.7 | 72.9 | 24.7 | 39.9 | 7.56 | 8 |
| Worker poses held only | 20.9 | 70.3 | 17.0 | 39.7 | 0.00 | 9 |
| 8 visible workers only | 29.3 | 51.1 | 15.9 | 24.3 | 2.32 | 5 |
| Performance preset (combined) | 29.7 | 56.1 | 22.4 | 20.1 | 8.02 | 16 |
| Reference repeat / drift check | 20.5 | 70.0 | 24.1 | 40.4 | 7.33 | 11 |

The suite completed, but **this is not a smoothness acceptance pass**. Performance
used 832 × 468, no shadows and no bloom, with all 24 workers animated. Its p95 was
56.1 ms, p99 92.1 ms and longest stall 324.2 ms. Every camera exceeded the 33.33 ms
p95 target; conveyor angle 2 was worst at 18.3 FPS / 135.5 ms p95. A ten-minute
selected-settings certification was not run because even this short comparison
already missed that target.

The repeated reference fell from 23.6 to 20.5 FPS. This approximately 13% drift
limits causal comparisons: do not interpret these rows as precise speedups, or
conclude that lower resolution or disabled bloom inherently slows rendering.
The previous ten-minute reference remains a separate protocol, not a directly
comparable control for this run.

Shadows off reduced mean draw calls from 162 to 116 and submitted triangles,
including shadow passes, from 1.56 million to 0.81 million. Eight visible workers
reduced measured worker pose cost from 6.69 to 2.32 ms and mean GPU time from
38.32 to 24.28 ms. Together these support testing reduced worker meshes/shadow
proxies and background animation batching next, while retaining foreground detail.
Holding poses removes our pose-sampling cost but leaves drawing and Babylon skin
processing; it is not a full animation-off measurement. Bloom's isolated result
shows no demonstrated benefit under this drift, so it should remain an artistic
choice pending a repeat. CPU and GPU measurements overlap.

Resource counts were unchanged from start to finish: 263 meshes, 40 materials,
82 textures, 26 skeletons, 212 geometries and 50 animation groups. Reported heap
rose from approximately 228 MB in the first row to 246 MB in the last. Stable
resource counts do not establish absence of memory leaks. The suite excludes
full BDI/pathfinding, final room assets and other devices. Reverse-order repeat
measurements and sustained acceptance remain required before claiming readiness.

Validation: 102 suites / 544 tests and the full CI production build passed before
the menu addition; 17 focused settings/menu tests, scoped lint and the final
optimized build passed afterward. Desktop and 390px settings layouts were checked
in the browser, including persistence across reload and reset. An integration test
checks shared main-menu/in-shift preferences without restarting the run. The final
comparison exercised all eight renderer configurations and supported GPU timings.
The raw result was saved from the page's exported evidence; the in-app browser's
file-download completion could not be verified by its download-event automation.

The local test build also contained an existing, uncommitted LIMEN yaw experiment.
It is excluded from this change; the provenance file records the exact tested
runtime sources and this distinction. No production deployment or cross-device
performance certification is implied.

Evidence: [raw comparison JSON](performance-results/2026-10-18-hd620-graphics-comparison-1.json),
[build provenance](performance-results/2026-10-18-hd620-graphics-comparison-1-provenance.json).

The first short lighting diagnostic measured 43.9 FPS with glow, 44.9 with spill, 43.4 with shadows and 42.2 on the repeated baseline. This variation does not establish a meaningful mode cost. See [raw evidence and instrumentation caveats](performance-results/2026-10-21-hd620-station-light-diagnostic-1.md). The sustained opening test still fails; this comparison does not supersede it.
