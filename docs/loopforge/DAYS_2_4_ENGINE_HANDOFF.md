# Opening shifts · ENGINE handoff

19 November 2026 · Days 2–4 · Owner review build

[Play the two-room factory](/loopforge-shifts/index.html) · [Replay fixture manifest](/loopforge-shifts/fixtures/index.json)

Appoint either supervisor to play forward from Day 2. The bell opens the next morning through Day 4. The four review checkpoints use the same simulation as ordinary play. Each checkpoint restores the decisions, beliefs, props, work and queue that led to it. Select a room and press **Play 1×** to observe. The clock runs at twenty simulation ticks per second. Selecting a bid starts the clock.

## Matched runs

Times are seconds after the morning appointment. Counts are new physical arrivals at the rack that shift. Three Day One cortexes are already there.

| Checkpoint | Player decision | What changes |
| --- | --- | --- |
| Day 2 · Missing ID | Immediate daily pass | At 10.40 s LIMEN resolves the case. At 10.85 s jo takes the first physical step to the desk. Seven cortexes reach the rack. |
| Same inspection | Watch Conveyor | sam finishes the first Intake handoff at 10.60 s while Security holds. LIMEN closes the case at 24.40 s. jo steps forward at 24.85 s. Wash stays uncovered and zero new cortexes reach the rack. LIMEN’s report identifies bob’s detention. |
| Day 2 · Morning bids | Appoint LIMEN / appoint STILETTO | LIMEN at Security discovers the missing original. With no intervention, the rushed Conveyor finishes zero. STILETTO at Security expedites clearance. LIMEN’s all-clear Conveyor finishes three. |
| Day 2 · Conveyor chat | Keep STILETTO’s pace | sam’s first words reach bob at 35.95 s. STILETTO interrupts at 37.35 s. The first cortex finishes its Belt handoff at 38.35 s and Forge handoff at 40.95 s. Five reach the rack by the bell. |
| Identical crew and posts | Slow the line | At 38.95 s bob hears “ed logged a loose card. Ask at his desk.” He retrieves his original from ed at 50.45 s. The same Belt and Forge handoffs finish at 39.70 and 43.65 s. Three reach the rack. |
| Day 4 · Conflicting orders | Crew decides / back LIMEN / back STILETTO | Unaided, jo goes to work and bob, kit and ben stay. With public backing for LIMEN all four stay. With public backing for STILETTO, jo, kit and ben go while bob stays. mae is outside the endorsement’s audible range. Each run finishes one cortex. |

A pass lasts through the bell and leaves the original with ed. Another confirmed failure next morning permits renewal using that day’s intervention. Reviewing an open desk signal and exchanging camera views are free. The two Security desks share the held line. A demand for quicker processing cannot release it. The next worker’s movement supplies the release cue.

## Records for SYSTEMS and ART

The Web Worker owns the agents, clock, interventions, station reservations, custody, evidence and production. The viewer subscribes to `shift_floor_1`. A `FULL_SNAPSHOT` establishes the public state. Each `FRAME_DIFF` names its previous hash and advances one tick. The viewer recomputes the SHA-256 hash and requests a full snapshot on mismatch. Commands name the observed tick, shift, room, target, incident and a unique command ID. Restoring a checkpoint restores the command history too.

| Record | ART binding |
| --- | --- |
| `desk.signal` | Use `desk.register` at `at` to mark the failed inspection. Read the open case and deadline in the baseline. Display the decision beneath the camera. |
| `case.resolved` → `pass.issued` or `custody.admitted` → `queue.advanced` | Release the desk marker, show the result, then follow the first measured step of the named worker at `actor.<id>`. |
| `speech.delivered`, `chat.interrupted` | Draw only the emitted phrase, anchored to its speaker. The fixture’s review-only `hearing_by_event` gives the individual recipients. A cutoff never delivers the omitted phrase. |
| `station.coverage`, `handoff.started`, `handoff.finished` | Bind lamps and machine action to `control.<station>`. A worker contributes after reaching the control. A handoff records its individual cortex and operator. |
| `rack.arrival` | Place the named cortex at the output position in the event. The bell counts physical arrivals. |
| `report.received`, `worker.choice` | Keep the report’s actual source visible across room switches. Show each worker moving or waiting from their own actor anchor. |

All fixtures include the ordered public journal, stable sequence numbers, absolute ticks, the room, anchor and integer millimetre coordinates, initial and terminal public snapshots, any review command, its accepted baseline and the first diff. Compare `initial_private_hash` before comparing two decisions. The browser-facing public scene omits hidden beliefs. A separate reviewer inspector exposes the recorded reasoning for selected actors. The fixed production, chat and conflicting-order rules are bounded TypeScript behaviors. General planning, an unrestricted conversation system and a Rust runtime remain outside this build.

## Reproduce

From the repository root, with the lab workspace dependencies installed, run `node apps/lab/scripts/shifts/day-one.cjs`, `node apps/lab/scripts/shifts/replays.cjs` and `node apps/lab/scripts/shifts/build.cjs`. The replay command checks the committed JSON byte-for-byte, two independent continuations from each restore, daily renewal, stale/duplicate commands, attributed hearing, physical handoffs, release and expiry. The scoped browser review records normal-speed room views, actions, viewport geometry, screenshots, actual events and terminal counts. The delayed mobile pass deliberately lands later than the fixture’s immediate pass.

Provisional sprites reuse approved Day One assets. The station overlays and decision surface are ENGINE bindings for ART. Owner review is pending.
