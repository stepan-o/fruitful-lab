# First turn — executable contract

11 October 2026. Current `/stepanoskin/loopforge/play` implementation. Read alongside [the build checklist](FIRST_TURN_BUILD_PLAN.md); implementation is not evidence that all visual/performance gates have passed.

## One world, several jobs

Night commissioning, the producer console, room cameras, operating controls, adviser interfaces and Dispatch share one run. The playable renderer never starts `StudyHost`. `/factory-floor` remains an independent author calibration fixture. Its test population, pace and installation state cannot affect the game.

`lib/loopforge/first-turn/kernel.ts` composes the existing adviser/worker/incident systems with commissioning and a finite-buffer line. It owns accepted state transitions. `first-turn/presentation.ts` maps permitted facts into the renderer's existing room shape. The latter cannot produce workers, decide risk or charge funds.

| Module | Responsibility |
| --- | --- |
| `first-turn/contract.ts` | Primitive tagged commands, public spatial/process records, versions and bounded time constants |
| `first-turn/kernel.ts` | Installation order/cost, phase gates, fixed steps, buffers, individual body/task positions and settlement |
| `first-shift/workers.ts` | Individual worker identity, body, assignment, psychology, conditioning and history components |
| `first-shift/kernel.ts` | Adviser proposal, overrides, room authority, seeded incidents and permanent allocation; an internal typed operating input replaces legacy scheduled production |
| `first-turn/server.ts` and API route | Admission, replay, projection hashing and full/diff envelopes |
| `first-turn/viewer.ts` / `useFirstTurnRun.ts` | Ordered reconstruction, one in-flight request, confirmed transcript and explicit recovery |
| `TurnFloor.tsx` / Babylon scene | One room composition, three physical camera poses, build previews and process controls |

The old `/api/loopforge/first-shift` profile and its golden replay stay available for regression. Main play deliberately uses `POST /api/loopforge/first-turn`, protocol `loopforge-kvp-http/2`, schema `loopforge_first_turn_1`, engine `first-turn-1.0.0`. This is an application profile inspired by KVP; it is not wire-compatible with every historical Loopforge service.

## Time and authority

One `advance` runs twenty fixed 50 ms steps, stopping if an incident needs a decision or the shift ends. The production/clearance systems currently evaluate every twentieth step. Spatial carriers and belt travel advance at 20 Hz. Revision counts accepted commands; `simTick` counts simulation steps; `shiftTick` is the 48-beat first-shift clock. Its displayed day runs from 06:00 to 24:00: eighteen working hours followed by six hours of charging. Do not conflate them.

The browser requests another batch after the last response, at normal or accelerated presentation cadence. It is not an autonomous server daemon, continuous socket stream or lockstep network game. Latency slows wall-clock presentation; it never skips simulation time or changes seeded outcomes. Reading, settings, menu, hidden document and consequential decisions suspend requests. Renderer interpolation smooths confirmed states; it cannot invent production while disconnected.

No model, renderer, clock, browser object or network call lives in the domain. Integer coordinates are millimetres, time is fixed ticks and iteration follows stable worker IDs. A transition owns a cloned next state. This preserves a practical Rust migration boundary without claiming TypeScript supplies borrow checking.

## Commission, operate, settle

Opening funds 240; 24 inherited workers; condition 82; weekly quota 60, due day seven. No assignments until adviser approval. The first night installs a 35-fund terminal, 35-fund gate and 70-fund drive in that order. An optional 60-fund physical outtake carriage removes two units per clearance instead of one. These are bounded commissioning sockets, not an unrestricted builder.

Closing intake stops new supply while existing work clears. Metered intake admits one cradle per four production beats; open admits one per beat, capped at six waiting cradles. Assembly requires 80 work units and an available exit slot. Capacity derives from actual living Conveyor workers and its operator. Pushing increases work by 50% and consumes more condition. Outtake holds three; Security clears every three beats under LIMEN or two under STILETTO. The approved Conveyor operator supplies the initial setting: metered for LIMEN, open for STILETTO; both begin with steady drive. A full exit stops useful assembly. No UI warning can coexist with unlimited hidden production through a blocked chain.

Released units create real worker entities awaiting allocation. Final Dispatch assigns each to retained workforce or weekly delivery once. Delivery pays 12 funds per unit; keeping units forgoes that income. Construction and payment are visible in the ledger. No repair, station-staffing puzzle, daily wage economy, Theatre, smart-worker chain, second day or cloud save is delivered by this slice.

Incidents emerge from the bounded opening's load and clearance conditions; severity/response use the deterministic seeded baseline. This is a small authored ruleset, not completed general BDI. The adviser's actual assigned room determines automatic authority. Outside it, a pending response blocks further advances and controls. Private beliefs and histories remain server-only; visible actors expose ID, location, facing and task, not psychological meters.

## View and delivery

Three authored poses inspect the same room and bodies. Desktop uses one primary feed plus two small alternatives; narrower layouts show one selected angle. Night construction and focused operation use the same geometry with direct camera navigation. Returning to observation restores the selected room/angle. Auxiliary feeds do not instantiate additional worlds or React loops.

Each feed is a rendering pass and is counted in the total budget. Play isolates the selected room’s architecture and equipment; the calibration route retains whole-floor navigation. Small worker bearings use fewer segments at their actual screen footprint. The diagnostics report whole-frame draw calls and triangles across camera/shadow passes, frame-interval percentiles and the renderer identity. Reuse the same meshes/materials, thin-instance worker parts, cached local shadows and calibrated room geometry. Render loops stop when this workspace is hidden. Reduced motion suppresses ornamental movement; accepted facts and accessible controls remain. Scene initialization/disposal and resize cannot reset the simulation.

The game uses existing versioned immutable artwork for phase cards and the focused console interfaces. No new runtime art release is needed for this integration. See [rendering and asset delivery](WEBVIEW_RENDERING_AND_ASSETS.md) and [scale/performance gates](FACTORY_FLOOR_VISUAL_SCALE_PLAN.md).

## Transport and recovery limits

Requests carry a bounded transcript (256 commands; 32 KB body) and optionally the previous revision/hash. Server replay reconstructs authority; the browser cannot submit production, hidden traits or operating work units. Responses contain an allowlisted full snapshot or ordered field/event operations, with SHA-256 over canonical projection JSON. Baseline, order, protocol, schema and run identity fail closed. An interrupted request leaves the last confirmed transcript intact; explicit recovery replays that confirmed history.

This is a replayable single-player prototype, not tamper-proof online progression: the caller can restart a seed or provide another legal history. There is no paid LLM work in the hot path. Later reasoning must improve a measured baseline and preserve the same authority/projection boundary.
