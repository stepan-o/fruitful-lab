# Frontend performance acceptance: first-room crowd

Protocol `room-crowd-1`, frozen before the first run on 17 October 2026.

Open `/stepanoskin/loopforge/play/performance-test` from Scene studies or the shared model navigation. Load the scene, start the test, and press **Check response** at least once while it runs. Save the JSON when it finishes. Keep the tab and canvas visible; backgrounding or scrolling the stage away makes the run invalid. Cancellation stops rendering. No live game/save changes occur.

## Workload

- 24 approved Worker 01 corrected bodies, each with its own 34-joint skeleton and phase; six corrected motions distributed evenly. One worker download, shared geometry and material/texture resources; no per-worker inspection lights. Skeleton updates remain full rate, without crowd animation LOD.
- LIMEN with his approved emitter-maintenance idle and animated cyan energy; STILETTO with twin blades, red visor and Threaten motion. Their inspection lights are disabled in favor of the room lighting.
- Current Security/Conveyor shells, machinery, gate/scanner, dynamic shadows, bloom and FXAA. A single selected room and camera is rendered. All 26 actors are placed in the selected room for a deliberately crowded workload.
- Two projected speech bubbles, changing every six seconds. Text and poses are authored workload fixtures, not a new BDI simulation. Walks sample in place; navigation, contacts and final room art are not evaluated.
- Fixed 1280 × 720 internal render size, adaptive resolution disabled. CSS size can differ, but record viewport/DPR. Three fixed overview angles per room. Warm both rooms/all angles for 30 seconds, then measure 600 active seconds. Change angle every 20 seconds and room every minute: 29 measured switches, nine of which also change room.

## Gates

A run is valid only if it completes the entire timeline without visibility interruption or resolution change. All measured draw-completion intervals, including room-switch stalls, contribute to the result; warm-up is excluded. The application does not drop long intervals or substitute the closing rolling FPS for whole-run results.

- Average cadence ≥30 FPS.
- Frame p95 ≤33.333 ms overall and in **each** 20-second room/angle segment.
- Frame p99 ≤66.667 ms; at most six intervals over 100 ms; no interval over 500 ms.
- All 29 scheduled view changes reach a completed draw within 200 ms of their scheduled time. At least one real button event must complete a response draw within 200 ms of its event timestamp.
- No WebGL context loss and no positive net growth in mesh, material, GPU texture-cache, skeleton, geometry or animation-group counts between warmed baseline and final state.

These are initial project gates, not general browser guarantees. A failure remains visible and downloadable. Thresholds must not be relaxed after seeing a result.

## Evidence and limitations

The JSON includes every segment's timing distribution, total stalls, switch and input delays, optional browser heap samples and resource counts every ten seconds, long-task observations, asset hashes, renderer, viewport, DPR and preparation duration. Heap values are browser estimates and may be quantized or include GC variation. Resource counts detect some leaks but do not establish total GPU memory use. Draw-completion timing measures the JavaScript/render submission cadence, not GPU execution or the compositor's presentation timestamps. Local preparation is not a cold internet-download benchmark.

Do not run compilers or other deliberate heavy jobs alongside the benchmark. Record existing machine memory pressure. The first reference is the development laptop: Intel i5-7200U, Intel HD 620, approximately 12 GB RAM. A desktop browser viewport does not certify physical phones, tablets, Safari, three simultaneous camera feeds, or later Act I crowds.

## Implementation

The existing Babylon factory renderer accepts an optional fixed render size; ordinary viewers retain adaptive resolution. `worker-crowd.ts` supplies reusable independently posed workers sharing one asset bank. `performance-run.ts` schedules the workload and observes the real scene; the pure acceptance recorder owns pass/fail rules. React status updates happen once per second; speech anchors update directly. On completion/cancel, animation and rendering stop; leaving/resetting releases the scene and all actor instances.

## Recorded runs

### 17 October 2026 · Intel HD 620 · FAIL

The complete optimized-build run measured 600.03 seconds after the 30-second warm-up, with 24 workers, both supervisors and all six room/camera combinations. **This full-detail workload does not meet the older-computer target.** The thresholds above remain unchanged.

| Measurement | Observed | Gate | Result |
| --- | --- | --- | --- |
| Average cadence | 20.75 FPS across 12,453 intervals | ≥30 FPS | Fail |
| Frame p95 | 66.1 ms | ≤33.33 ms | Fail |
| Frame p99 | 124.5 ms | ≤66.67 ms | Fail |
| Worst interval | 779.6 ms | ≤500 ms | Fail |
| Intervals over 100 ms | 212 | ≤6 | Fail |
| Per-angle p95 | All 30 segments exceeded 33.33 ms | Every segment passes | Fail |
| Scheduled switches | 28/29 within 200 ms; worst 219.4 ms | All 29 within 200 ms | Fail |
| Real control responses | 47.8 / 43.6 / 38.5 ms | ≤200 ms | Pass |
| Resource-count growth | Zero in all six tracked counts | No positive net growth | Pass |
| Graphics-context losses | 0 | 0 | Pass |

All resource samples stayed at 263 meshes, 40 materials, 82 GPU texture-cache entries, 26 skeletons, 212 geometries and 50 animation groups. Browser heap estimate moved from 227.90 MB to 228.00 MB, with a sampled range of 225.91–232.83 MB. This supports stability over this run, not a proof that all memory leaks are absent. The browser recorded 396 long tasks. Preparation took 8.49 seconds locally; cold internet delivery is unmeasured.

Machine: Intel Core i5-7200U, two cores/four threads, Intel HD 620 using ANGLE/Mesa, approximately 12 GB physical RAM. Chromium 154; viewport 1440 × 1080; DPR 1; fixed canvas 1280 × 720. The browser's coarse `deviceMemoryGiB: 8` value is not the physical RAM total. Other desktop applications were open. A mid-run host sample showed about 1.9 GB RAM available and nearly full 8 GB swap, with no swap traffic in that brief sample. No compiler or deliberate heavy job ran alongside the timed test. CPU versus GPU bottlenecks and thermal effects have not been isolated.

Evidence: [download the full result JSON](performance-results/2026-10-17-hd620-room-crowd-1.json), [completed scene screenshot](performance-results/2026-10-17-hd620-room-crowd-1.png). The browser's **Save result** download was checked against the captured result and matched exactly. Result export, reset/reload controls and a 390 px layout were checked separately from the timed run; narrow-layout checks do not certify mobile performance.

Build provenance: optimized local build from `426d8ea` plus this acceptance-test implementation. It also contained an existing, uncommitted LIMEN facing-only correction (`root.rotation.y = yaw * Math.PI / 180` instead of adding `Math.PI`). That patch is excluded from the acceptance commit and did not alter mesh counts or animation data; this record is a local-build baseline, not a measurement of an exact published commit. Post-run changes only improve the finished-result display and clear the disposed scene on reset; they do not alter the measured workload or gates.

### Decision and next experiment

Keep the approved detailed character assets for closeups, but do not accept this quality level for a full room on HD 620. Next, profile and compare worker distance LOD, shadow cost and pose-update cost while preserving supervisor silhouettes and readable speech. Reduce distant worker geometry/shadows and introduce a bounded animation update tier where measured evidence supports it. Re-run this same ten-minute protocol after the optimization pass; do not substitute a shorter favorable rolling sample.

Real phone/tablet tests, cold loading, final-room art, BDI/pathfinding/contact costs and three simultaneous CCTV feeds remain separate gates. The current result establishes an optimization requirement, not that browser delivery is impossible.
