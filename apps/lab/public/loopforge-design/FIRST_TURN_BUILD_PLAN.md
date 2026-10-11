# First turn — build and execution plan

11 October 2026. Owner requested a complete plan, then execution. Scope: `/stepanoskin/loopforge/play`, one complete opening night/day and its settled result. The existing factory-floor route stays a calibration tool, not a second run the player must visit.

## The playable promise

I commission a line, choose whose judgment to trust, operate the machinery under their influence, and decide what to do with the robots we made. The resulting factory is visibly mine. Observation supplies evidence and payoff; it cannot replace doing.

Producer console → selected room / three CCTV angles → focused action → saved console context. All use one authoritative run and stable worker/equipment IDs. Three cameras are not three simulations. Build and operation use the same room geometry. The one-time night-zero arrival teaches the controls before the normal console loop.

## Full first-turn flow

| Beat | Player action and information | Interface | Engine gate / visible payoff |
| --- | --- | --- | --- |
| Start / night | Enter the factory through the lobby; move to Security | Existing lobby art, three-second Night card, procedural room workspace | No adviser or assignments; production stopped |
| Commission Security | Select, preview and install the clearance terminal, then the gate in marked sockets | Night builder with camera/pick and accessible confirm controls | Ordered installation, validated cost; physical equipment appears |
| Commission Forge | Install the drive; optionally invest in outtake handling rather than keep cash | Same builder in Lattice Forge | Equipment persists; cash changes once; capacity improvement is physically visible |
| Morning | Return to console and receive leadership's call | Three-second Morning card; existing cinematic leadership screen | Server admits acknowledgement only after commissioning; quota 60 due day seven |
| Choose adviser | Compare LIMEN and STILETTO's pitches, known priorities and tradeoffs; appoint one | Dedicated roster, structured illustrated brief, assignments | No hidden meters; first assignments happen only on approval; override is remembered |
| Release the shift | Start the approved arrangement | Console control; three-second Shift start card | Assignments bind individuals; prepared crew is present at its stations |
| Operate | Read intake / assembly / outtake, change intake rate and drive effort, see queues and exposure respond | Selected room's CCTV for observation; a focused operating deck for action | Fixed ticks, finite buffers, real throughput and wear. Operator influences capacity and clearance. No station staffing or early repair |
| Incident, if warranted | Back or override a legal response outside adviser room; see automatic actions in their room | Existing incident/evidence dialog plus room consequence | Decision pause; deterministic seeded outcomes; causal record and individual loss/strain |
| Dispatch | Preview then commit produced robots to retained workforce or weekly quota | Existing Dispatch artwork and focused allocation controls | Same produced entity IDs; permanent split; prototype contract payment only for dispatched units |
| Night / result | See output, retained workers, committed quota, spending, wear and outstanding consequences | Three-second Night card; logistics debrief and optional records | Settled first-turn checkpoint, not an automatic second day. Replay/export available; no claim of completed Act 1 |

## Concrete operating puzzle

The first chain has intake storage, assembly work and an outtake buffer. Metered intake admits fewer cradles; open intake can supply a faster line but overloads a bottleneck. Closing intake lets existing buffers clear without admitting new supply. A steady drive preserves headroom; a pushed drive can use that supply at a higher wear/exposure cost. LIMEN is slower on the line; STILETTO increases capacity. Security clearance can delay the outtake and leave observable disorder under STILETTO. Supervisors remain useful even when the player operates controls.

The opening optional outtake attachment costs cash and increases removal capacity. It is a small investment choice, not a mandatory extra tutorial placement. No repair tool, new material currency, Theatre operation, smart workers or Brain 2.0 secret is introduced. Routine safe operation can succeed without forced emergencies. A full buffer must stop useful work, not continue spawning robots behind a warning badge.

Initial parameters are prototype fixtures, not final balance: 24 inherited workers, 240 funds, condition 82, quota 60 by day seven; terminal 35, gate 35, drive 70; optional outtake attachment 60. Contract payment is 12 funds per basic robot committed to quota, paid at dispatch. Retained robots forgo that payment. This settles the first-turn currency sink/source for testing and does not establish the later economy.

Target first play: 120–180 seconds including guided construction, reading, production and three-second transitions. Repeat play targets 60–120 seconds. Reading is never timed or punished. The production window is approximately 48 seconds at normal cadence; requests can slow it but cannot skip authoritative time. Measure total experience, not only belt runtime.

## Architecture and integration

Keep the existing first-shift kernel as the tested adviser/worker/incident baseline. Introduce a separately versioned first-turn orchestration contract that composes that state with commissioning, fixed-time production buffers, individual spatial/task records and settlement. The old HTTP profile remains available for its existing tests; the main game adopts the new profile deliberately. There must be no second StudyHost driving the playable floor.

- Domain: primitive tagged records, integer coordinates/time/work, seeded risk, explicit IDs, stable iteration and one mutation owner. No clock, React, Babylon, networking or model call in the kernel.
- Time: 50 ms simulation steps; a bounded advance command executes a short batch. Revision counts accepted commands and is separate from simulation time and first-shift work beats. HTTP remains response-paced, with one request in flight; no claim of an autonomous hosted daemon.
- Spatial projection: expose observable position, facing and task of the real worker IDs, installed equipment and process buffers. Keep private psychology, conditioning, RNG and BDI traces on the server. Night-to-morning prepositioning is explicit; live movement follows authoritative positions.
- Transport: versioned full snapshot/diff, hash and baseline validation, bounded replay/body/commands, replay-safe recovery and no-store responses. Rejected commands leave confirmed state unchanged.
- Viewer: native interfaces emit commands. Babylon only interpolates permitted facts and renders the shared room. One canvas/engine, three camera passes; one large plus two auxiliary desktop views, one active view on small screens. Builder/operating focus preserves the console room/angle.
- Assets: reuse the four console skins, lobby/call/dispatch/logistics art, portraits, room materials, phase cards and licensed sound library. New geometry/material details must follow the floor visual plan. No new external art is required to begin.
- LLM: deterministic briefing baseline for this delivery. No per-tick model call, fabricated observations or paid model budget. A later model layer must beat this baseline on evals; it is not a prerequisite for a playable first turn.

## Execution checklist and gates

- [x] 0. Audit current console, first-shift kernel, floor fixture and accepted camera/agency contract; record this plan.
- [x] 1. Establish first-turn domain/transport: commissioning, cash, fixed ticks, buffers, actual worker records, authority, allocation/payment. Gate: deterministic replay, illegal-action tests, no hidden projection leaks, 10/24/100 worker cases.
- [x] 2. Join the renderer to that projection; author three distinct room angles and an operating/builder camera. Gate: no StudyHost in the game, stable IDs and one render engine, same room across angle/resize/return.
- [x] 3. Integrate night arrival/build → mandatory leadership → adviser/brief/plan → operation → incidents → dispatch → result into `/play`. Gate: entire run is completable with keyboard and touch; no dead ends or navigation/reset loopholes.
- [x] 4. Complete the first calibration pass: materials, framing, working/waiting bodies, queue/result motion, console glare, phase transitions and sound. Gate: action and consequence readable without diagnostic prose; compare original art; no screens of toy-scale empty space.
- [x] 5. Verify combined slice: two advisers, override, protective/productive choices, upgrade/no upgrade, retained/delivered splits, hidden tab, settings, network recovery and reduced motion. Gate: rendered state matches accepted commands and replay; run regression tests and production build.
- [ ] 6. Measure complete composition: frame intervals/resource counts, 10/100 workers, phone layouts and actual-device limitations. Use `FACTORY_FLOOR_VISUAL_SCALE_PLAN.md` targets; no claim that an FPS sample certifies all devices.
- [x] 7. Update game/UI/engine docs and design tab to actual delivery; deliver through the existing coherent PR #110 with evidence and remaining limits. Owner review determines enjoyment and artistic acceptance.

Work sequentially on this memory-limited machine: no concurrent compiler and heavy preview. A beautiful still, passed unit tests or a functional click-through alone cannot clear the combined gate. If actor controls are uninteresting, revise the room puzzle before adding rooms. If camera/detail budgets fail, fix visibility/material/pass costs before reducing the readable action to a blur.

## Execution evidence — 11 October

The implementation is complete through the first settled dispatch. Visual acceptance and broad device certification remain distinct from implementation completion.

- Production build passed after adding the new engine, route and room renderer. The complete app suite passed: 86 suites, 448 tests, one golden snapshot. Asset release verification and the deterministic asset pipeline check passed. The latest base was merged cleanly. The final production build passed; the affected post-merge selection passed 4 suites / 42 tests. Changed-source lint passed.
- Browser walkthrough A: commissioning plus outtake attachment; mandatory call; STILETTO brief and approved placements; open intake / pushed drive; automatic adviser response; 31 completed, 15 retained, 16 delivered, 39 workers, 67 condition and 232 closing funds. This combines several choices and is not a controlled adviser comparison.
- Walkthrough B: required construction only; LIMEN, approved placements, a later open-intake order; Security mismatch, player override; 11 delivered, 24 workers, 76 condition and 232 closing funds. LIMEN's closing statement refers to the overridden procedure. Records retain the installation, operating order and response.
- Room camera promotion survives a console round trip without resetting the run. Keyboard activation opens room inspection. Mobile construction and operation were reviewed at 390 × 844; the canvas remains visible above the controls, and page width stays at 390. The pass found and corrected hidden mobile queue counters and overlapping console click targets.
- Reduced-motion settings preserve the playable flow. The server interruption test kept the confirmed state and exposed reconnection. Replay serialization/hash is tested; browser download automation timed out, so a saved download is not claimed as verified.
- Initial three-camera measurement on Intel HD 620: roughly 615 draws / 1.94 million submitted triangles and 23 fps during the inspected sample. Room isolation and the first bearing trim reduced the measured Forge sample to roughly 294–311 draws / 836–878 thousand submitted triangles and 28–32 fps, with p95 frame intervals of 47–49 ms and p99 of 52–61 ms. Security measured 30 fps with p95 35 ms / p99 37 ms in its warm sample. These do not clear the 34 ms p95 target consistently. Counters include shadow and camera passes. The final geometry/light trim and shadow-list cleanup compiled and passed focused checks, but the browser connection became unavailable before a fresh warm measurement. No additional performance gain is claimed for that final change. The complete composition shares one budget; there is no separate allowance per feed.

The current 24-worker first turn is the delivered slice. Identity/logic tests cover 10, 24 and 100 workers. A real phone GPU, a sustained 100-worker three-camera workload, GPU timer queries, throttled cold loading and field Core Web Vitals are not certified. Do not describe this as “100% performance” or owner-approved artistic quality. The owner should judge the fun, operating friction and visual feel before expanding the factory.
