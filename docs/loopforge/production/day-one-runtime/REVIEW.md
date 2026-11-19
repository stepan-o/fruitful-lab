# Day One live intro

Open **Day 1 intro → Play the live Day One intro** on the [design board](/stepanoskin/loopforge/design#day-one-intro). The [player](/stepanoskin/loopforge/play/day-one) starts paused. Its timeline uses edited seconds. Names follow each visible character; speaking characters have a highlighted name inside their anchored bubble. Watch the volunteer replies at 85–90 s and the replies after the bell for simultaneous speech.

The [normal-speed capture](/loopforge-intro/day-one-1x.mp4) contains 3,813 H.264 frames at 20 fps, 960 × 600, with no audio. It samples the live TypeScript simulation and the same canvas painter in a headless export. The screenshot proofs and gallery videos are not inputs to playback. Capture SHA-256 is `33709745349018b07b44420405d62e3c05a92a112b125cbfa99a6781bbeda06c`.

## Simulation and reuse

The source is under `apps/lab/lib/loopforge/intro/`. The 50 ms tick, admission, reservation, condition checks, prop identity and transfer, observed/reported beliefs, hearing delivery, cancellation and guarded process phases come from the encounter kernel. Speech can reserve a separate utterance channel. A machine phase can reserve its particular cortex; existing callers keep the original single-workpiece reservation. The original 3D scene studies still consume their existing local snapshot. Their former eight-worker crew, old machine locations, global scripted selectors and animation clip names do not define this run.

`intro-score.mjs` compiles the LEVEL score and current writer's script against the floor-plan generator's approved geometry. A route supplies timed destinations. The simulation advances each actor's own route clock only after swept body, obstacle, gate and cast clearance succeed. The collision radius is 400 mm and the pair separation is 850 mm with up to 2 mm rounding tolerance. A changed location cannot snap back onto a distant track. The two edit cuts run the hidden world ticks; the worker sends a new baseline after catching up. The final edited time is 190.60391778732966 s. Its closest world tick is 5463.

Each cortex has a separate stage, socket, position and rack destination. Intake, washing, belt and press reserve the item and the working control. The material travels to the next socket after the stage commits. bob's palm action needs a jammed press, the heard instruction and actual contact. His injury is committed by LIMEN's strike. The dropped card slides to ed; his taking custody gives him new knowledge. bob's last observation still places it on the floor. The fourth credential has a separate owner and passes via the reader tray.

### Agent decisions

Perception, goal scoring and selection are replaceable policies. Actors store the observation source and tick. Their bounded plans name a desire, priority, conditions and opportunity window. Deliberation considers due opportunities, keeps admitted intentions until completion or failure and can retry while a window remains open. ed can watch a loose credential out of reach and prefers taking it when contact is available. bob uses reported instructions to decide whether to work and free the door. Selection breaks equal scores by stable plan ID. Several different speakers and a working body can act on the same tick.

Open **Production notes and agent trace → Inspect recent decisions** for observations, goals, intentions and mechanical outcomes. This explicitly requested local developer probe uses a separate message. The normal state projection excludes private beliefs and concealed inventory. The route score and authored opportunity windows constrain this introduction. Long-horizon planning, richer psychological inference and model-generated intentions are deferred.

### KVP capability matrix

| Surface | Day One profile |
|---|---|
| Identity and handshake | KVP 0.1 envelopes, UUID run identity, `loopforge_intro_ts` / `day_one_1`, fixed seed, 20 Hz, render spec and bounds. The viewer checks the engine/schema pair. |
| Subscription | Only the complete WORLD, AGENTS, ITEMS, EVENTS set; LIVE, ON_JOIN, DIFF_ONLY and NONE compression. A unique baseline immediately follows SUBSCRIBED. Invalid ordering, unsupported sets, policies and messages return errors. |
| Diff and recovery | Ordered operations, one tick per diff, previous and resulting SHA-256. The viewer rejects a gap/chain mismatch, issues DESYNC_REPORT and accepts a new baseline. The worker waits for baseline application before advancing its stream. |
| Hash and visibility | UTF-8 JCS over filtered world, sorted agents/items and events ordered by tick/ID. Q1E3 uses half-away-from-zero rounding. Integer millimetres cross the wire. Hidden knowledge, debug traces, camera and framing do not enter the hash. |
| Viewer commands | Recorded, idempotent VIEW_CONTROL play/pause with tick validation and accepted/rejected replies. Movement, item creation and direct state writes have no viewer command. |
| Review navigation | The local host can reconstruct the same deterministic session at an edited seek point and rebaseline. Presentation switching uses the existing frame, history, tick and worker. |
| Offline | `artifacts.ts` reads this profile's bounded baseline/diff inventory and verifies SHA-256 file bytes, pointer type and tick chain without a handshake. The checked-in fixture covers ticks 0–2. The worker rejects hosted REPLAY_* requests. Full offline export packaging, remote transport and multiplayer are outside this implementation. |

### Rust replacement boundary

Replace the worker's simulation and KVP encoder behind the ordered envelopes. The TypeScript viewer needs no mutable world reference. Entity IDs are stable strings; time, positions, custody and stages use explicit records. The scorer and planner are deterministic. The baseline uses no random draws. Source route compilation still uses double-precision distance calculations; Rust should consume the same frozen route input and reproduce the millimetre positions at tick boundaries. Sorting in protocol space uses scalar ID order. The language-neutral vectors, baseline, diffs and ten checkpoint hashes are in `apps/lab/lib/loopforge/intro/golden.json`. At tick 5463 the public hash is `fa5c31dd56749cc77691eb9611243fd85a67ebe6cc7007aa4248a2df5fd4a4ba`. Compare private custody, hearing and production assertions as well as public hashes. The shipping kernel is TypeScript.

## Art corrections for the next pass

`intro-art.py` verifies the four archive digests and packs the shipped layers losslessly using the manifest's source rectangle, trim, ground pivot, exposure table and socket positions. Both skins use east-positive X and south-positive Y. Body registration is 64 source pixels/metre. bob's 70 px and max's 85 px are the scale references. The camera normally caps scale at 77 CSS pixels/metre on desktop and 62 on phone. The close shots cap at 120 and 100. The speaker-group bounds can widen a shot.

| Edited time | Required drawing or review |
|---|---|
| 0.50–1.50 and 12.50–14.30 s | Review max's jaw imitation and bob's glance on the native gait. Add east and west walking facings and a separate injured gait. Eight named workers currently share the marked bob fallback. |
| 26–32 s | Replace LIMEN's provisional stance with the strike, bob's collapse, sam's kneel and ed's pickup. The mechanical strike and transfer already occur. |
| 101.30–110.50 s | Review bob's right palm against the C4 face at 108.90 s, including the injured plant at phone size. C4 has authentic rear and foreground layers. Other controls need equivalent station art. |
| 125.10–140.10 s | Revise LIMEN's inspection silhouette and STILETTO's approach, blades and hold. Confirm the portrait is legible at 130.70–137.65 s and max's duck reads at the return. |
| Bell to blackout | Give the remaining workers individual bodies, establish supervisor walking cycles for the slow exit, and add exterior/Lobby/Dispatch plates. Current art reuses the selected floor swatches outside the two calibrated rooms. |

## Verification and recovery

Run `node apps/lab/scripts/intro-score.mjs --check` and `node apps/lab/scripts/intro-test.cjs`. Four grouped integration tests cover the complete scene, overlap, control occupancy, physical interruption, changed beliefs and goals, KVP ordering, unsupported commands, hash fixtures, desync recovery and seek reconstruction. The existing 18 encounter suites contain 109 passing tests. The new player route passed an optimized Next.js webpack build using the previous verified build's font bytes for the offline local build.

The predeclared gates are 60 FPS desktop target and a 30 FPS reference floor, p95 ≤33.33 ms, p99 ≤66.67 ms, no interval >500 ms, at most six >100 ms per ten minutes and control-to-draw ≤200 ms. Review cold loading, resource counts and memory across repeated runs. Browser input-to-draw and compositor timing require browser measurements.

The first [three-run software capture](software-run.json) exercised the compiled worker on an i5-7200U with 12 GB RAM. It measured 59.9, 59.9 and 59.7 mean FPS at 1280 × 720, 390 × 580 and 1280 × 720. All three had an 18 ms rounded p95 and produced the same final hash. The native process RSS grew from 229 MiB to 2.26 GiB across those runs, so the initial resource-stability check failed. A focused 3,500-frame A/B on a fixed 960 × 600 scene isolated the issue in drawing a full opaque fill without clearing the canvas. Explicit clearing stabilized RSS near 259 MiB instead of climbing to 513 MiB by the last sample. Both runs used normal garbage collection.

The benchmark command is `node apps/lab/scripts/intro-software-benchmark.cjs <compiled-worker.js> <installed-@napi-rs/canvas-path> <output.json>`. It exercises real-time playback, two skin changes per run, pause/resume and restart. CPU software rasterization and phone-sized viewports do not measure a physical phone or browser compositor.

Branch `codex/day-one-live-engine` uses the merged #156 tree, which contains #153 and #155. The scoped checkout is `.tmp/day-one-live`; the source, recording and fixtures are committed there. Owner visual acceptance is pending.
