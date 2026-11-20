# First complete Day 1–2 playthrough · ENGINE handoff

20 November 2026 · Built from master at `92ae04d4` · Owner review in [PR #177](https://github.com/stepan-o/fruitful-lab/pull/177).

[Open the preview at the Loopforge landing](https://fruitful-hepumbsgm-stepan-oskins-projects.vercel.app/stepanoskin/loopforge) · [Approved Conveyor specification](https://github.com/stepan-o/fruitful-lab/blob/866687e46d43268acc036749908784c8c4fdfb5a/docs/loopforge/studio-briefs/day-2-conveyor-rules.md)

## Play from the entrance

1. Select **Enter the factory**, open **Settings**, change Quality and return to the menu. **Enter factory** starts the sprite intro. Follow the named speech bubbles through the third rack arrival and departure.
2. At blackout the same run opens in the director’s chair. Answer **Leadership calling**, receive the quota and acknowledge it. The record shows **3 of 60 due Day 7**. The first-playtest quota is configured by `playtestQuota` in `shifts/playthrough.ts`. STILETTO’s personal shift goal is five.
3. Read each pitch and both posted assignments. A pitch selects the proposed posting. **Commit assignment** starts the crew’s walk. The camera can switch between Security and Conveyor while the shared shift clock advances. Main menu pauses the shift. Resume restores this tab’s original departure, journal, camera and elapsed ticks.
4. To play **LIMEN on Conveyor**, accept **STILETTO’s pitch**. After jo’s second Forge delivery, C1 is on the rack, max is waiting off the treadle and one intervention remains. Both cards are with ed, sam heard him and bob missed it. The earlier conversation slot is spent. Tap **Clear** at Forge. LIMEN calls max for C2. Watch max receive the call, make the stroke and send C2 to the rack. On another run, leave him waiting through the bell.
5. To play **STILETTO on Conveyor**, accept **LIMEN’s pitch**. Inspect bob’s missing ID. Issue the daily pass or let the desk deadline expire. On Conveyor, select a worker portrait, compare Force, Precision and Timing with the station’s numeric bars, and send the worker to a post. Walking takes time. The pass spends the exceptional intervention. Portrait orders remain available.
6. At the bell compare **new rack arrivals** with the cumulative week count. **Return to main menu → Enter factory** starts a fresh run for the other appointment.

## Normal-speed gameplay evidence

[Watch the clips and matched results](/loopforge-shifts/review/first-playthrough/index.html). The 1000 × 800 desktop recording and the 320 × 844 touch recording both start at the landing, change Quality and verify the saved preference, run the sprite intro at 1×, receive the quota, commit a bid and end at the bell. The desktop Clear and watch runs yielded 2 and 1 new arrivals. The touch runs yielded 14 with a pass, 0 with detention, 10 with Wash recovery and 18 after moving kit. Both returned to a fresh menu. [Browser checks and original recordings](https://github.com/stepan-o/fruitful-lab/actions/runs/44807380801)

I also ran both appointments from the hosted landing at `1963a623` with a new browser session for each appointment. The desktop route first observed its Clear control at tick 8080, 39.05 seconds before the bell. The recordings from the same game revision caught the initial eligible tick at 8074 (39.35 s). Both produced 2 versus 1. On the hosted 320 px route the pass, detention and recovery totals were again 14, 0 and 10. The kit transfer produced 17 that time, compared with 18 in the recorded run and the first-eligible-tick simulation. These are timing-sensitive portrait orders. [Hosted measurements](/loopforge-shifts/review/first-playthrough/hosted-measurements.json)

## Matched simulation measurements

All pairs start at the same saved decision in an ordinary run. The real intro produces the departure supplied to the shift. The simulator runs at 20 ticks per second. The totals below include each physically racked carrier once.

| Conveyor supervisor and policy | Day 2 arrivals | Week total / 60 | Observation |
| --- | ---: | ---: | --- |
| LIMEN · Clear Forge immediately and watch | 2 | 5 | At tick 8074 the bell is 39.35 s away. The call reaches max at +0.50 s, his stroke finishes at +2.50 s and C2 racks at +3.00 s. |
| LIMEN · Watch the same wait through the bell | 1 | 4 | Only the opening C1 racks. The bell is tick 8861 in both runs. |
| STILETTO · Pass, bob to Wash, jo to Belt | 14 | 17 | From the Security case, first rack +22.90 s, last +83.35 s. SYSTEMS projected 14. |
| STILETTO · Detention, same worker orders when available | 0 | 3 | bob stays in custody. Wash cannot start another carrier. SYSTEMS projected zero. |
| STILETTO · Detention, kit recovers Wash | 10 | 13 | The first recovered carrier racks +40.60 s after the case opens. |
| STILETTO · Pass, move kit from Forge to Belt | 18 | 21 | Kit leaves Forge on tick 7887 and reaches Belt on 7932. Forge falls from 138 to 96 work units/tick and Belt rises from 88 to 148 after the 2.25 s walk. |

The regular-route case opens at tick 7541 with 86.15 s to the bell at 9264. Both routes use #176’s provisional staffing rates and time budgets. The matched policy issues orders on the first eligible tick. Input timing in a browser can change its totals.

## Reproduce the checks

From `apps/lab`, run `node scripts/shifts/first-playthrough.cjs`. It exercises each policy, compares cold replay with the live record, retries a clearance and checks both authored silences, ID custody, hearing and the spent conversation opportunity. The browser recording script runs the entrance and Day 1 at 1×, then restores a copy of the same decision for the comparisons.

For design comparison, the [standalone Day 1 player](/stepanoskin/loopforge/play/day-one), [Days 2–4 player and review checkpoints](/loopforge-shifts/index.html) and [earlier first-turn console](/stepanoskin/loopforge/play?review=first-turn) remain accessible. The cast still uses shared worker sprites for eight workers. The owner reviews the two games, pacing and first-playtest target before deciding whether to iterate or ship.

---

## Days 2–4 dialogue · ENGINE handoff

20 November 2026 · Owner play review · [First implementation, merged in PR #172](https://github.com/stepan-o/fruitful-lab/pull/172)

[Play the shifts](/loopforge-shifts/index.html) · [2D Shifts tab](/stepanoskin/loopforge/design#2d-shifts) · [Gameplay and downloads](/loopforge-shifts/review/dialogue/index.html)

Choose a bid and commit both jobs. Watch Security as the crew walks to the grate, LIMEN welcomes them and the helpers take their posts. A morning appointment leaves one intervention. Switch to Conveyor after the first clearances. The bell releases people from different responsibilities, and **Next morning** carries their personal observations and the actual cards forward.

## Two decisions to watch

| Review checkpoint | What to watch in the room | What to inspect |
| --- | --- | --- |
| G5 · early cutoff, then G5 · exit after early cutoff | At Wash sam gets as far as “Somebody found one.” At departure bob turns to ben and hears about gus’s boot. | Select bob. The inspection records the anonymous find and then the boot lead. |
| G5 · late cutoff, then G5 · exit after late cutoff | STILETTO cuts in two ticks later. Bob hears “ed’s desk.” At departure he approaches ed and receives an invitation. | Select bob. The desk lead traces back to sam hearing ed’s anonymous register entry. Both partners were in reach in both readings. ed retains both originals at each bell. |
| 3D · hands at the desk | Watch LIMEN return jo’s card. The worker in front can block the hand for someone behind. | Ordinary speech, a sight of the hand and a secondhand account have separate receipts. |
| 4D · firsthand return / W1 · reported return | Today jo crosses in both. Ben follows in the first reading and reports to mae on Conveyor. In the second he stays at Security. Both hear the same orders and jo’s account. | Select ben. Both traces contain jo’s account and today’s crossing. Only the firsthand trace contains yesterday’s hand return. |
| 4F · late check at bell | Kit is at the desk, Wash is vacant and the bell interrupts the check. | Switch rooms. The production count measures actual rack arrivals. |

Use **Play 1×** after loading a checkpoint. **Save this moment** and **Return to saved moment** preserve the active phrase, listener receipts, reservations and seeded draw. **Actor and event inspection** shows the selected worker’s evidence, decisions and recent received words. The review controls drive the same simulation as a fresh appointment.

Start at **Morning bids**, choose **LIMEN · Keep the posts** and commit. The staff door is in frame before the crew enters. Bob and sam talk while walking. The cut reveals the last 3.8 seconds of the crew walking into the Security shot. After the greeting and three replies, STILETTO marches up the east aisle. LIMEN opens the boom for her, watches her pass, speaks about stability and calls ed and gus out of the crowd. They walk to their desks before the first ID check. The simulation advances the omitted corridor travel and a saved moment preserves both clocks.

At 1× a short line stays visible for at least 3.2 seconds. Longer lines allow one second to locate the speaker plus 0.4 seconds per word. The three simultaneous greeting replies clear together after the longest reply’s reading time. Pause holds the text.

Tynan Sylvester discusses easing time pressure when players struggle to process simultaneous demands in *Designing Games*, “Decisions,” “Avoiding Overflow,” p. 144 (PDF page 152). Here the owner’s play observation applies to reading the evidence behind a decision. The interval is a setting for play review. The cutoff and who heard the clue still resolve on the original simulation ticks.

## Kernel and evidence

The measured p95 for simulation plus public hash was 1.68 ms across 650 ticks. The TypeScript worker advances at 20 Hz. It owns shift commands, positions, individual receipts, gate crossing, staffing, output, physical custody and overnight state. The viewer renders hashed `shift_floor_1` snapshots and differences. The portable HTML embeds that worker, the viewer, art and manifests. A later Rust port must reproduce admission, snapshots and replay fixtures before replacing the reference implementation.

The manuscript compiler reads the approved table read and chat bank. It preserves 60 exchanges, 40 valid and four missing-card readings, ten paired approach asides and the welcome and posting alternatives. The scene test checks all 37 IDs. The worked run may legitimately lose a slot to another pair. For 3C, 3F and 4F the suite checks the applicable card, tray or idle-press condition separately from whether its conversation wins.

| Nine regression fixtures | Before dialogue, on the corrected floor | Dialogue player |
| --- | --- | --- |
| Immediate pass / detention | 7 / 0 | 6 / 0 |
| Morning LIMEN / STILETTO | 0 / 3 | 0 / 5 |
| Rushed / slow | 5 / 3 | 5 / 3 |
| Conflict unaided / back LIMEN / back STILETTO | 1 / 1 / 1 | 0 / 0 / 0 |

These are new rack arrivals. The walk, inspections and staffing timing change the time available to finish a piece. The seed is early / 3241 for the matched comparisons. On E2, kit fills the bench position opposite mae. His report uses the second Conveyor slot and carries the Producer as its source. On Q1, a stopped Belt and free hands admit kit’s elbow advice. The operation waits for the demonstration and jo can acknowledge it on the walk out.

From the repo root run `node apps/lab/scripts/shifts/dialogue-cases.cjs` for G1–G11 and the matched ben comparison, `node apps/lab/scripts/shifts/scene-readings.cjs` for the 37 conditions, and `node apps/lab/scripts/shifts/replays.cjs` for deterministic fixture verification. Build the worker and viewer with `node apps/lab/scripts/shifts/build.cjs`. Package the current HTML and fixtures with `python3 apps/lab/scripts/shifts/portable.py /tmp/shift-player`.

**Wording for owner review.** The worked 2G table read addresses ben by name. The K08 bank opener omits the leading “ben.” The player uses the 2G wording after the anonymous Wash fragment and the bank wording for a fresh boot inquiry. ENGINE recommends retaining both approved readings with that distinction.

The [1× browser recordings](/loopforge-shifts/review/dialogue/index.html#recordings) identify the gameplay build, seed, checkpoint, tick and viewport. The 1280 × 800 and 320 × 844 sessions exercise the embedded board served by the design route, standalone player, and portable file with networking disabled. Each restores an in-progress Wash exchange and observes it from the other room. The 1× recordings cover the matched branches and the late check. The full 60-entry bank and all 44 desk alternatives have not each been filmed or individually accepted in ordinary play. The worker’s welcome receipt starts a 3.28-second spoken greeting in the Security view. **Hear LIMEN’s greeting** toggles the voice. The portable HTML embeds the same audio. The delivery uses a provisional Flite RMS reading pending owner voice review. The remaining exchanges use named speech bubbles and visible movement. Individual character animation remains at the approved calibration level. The physical-device and screen-reader experience has not been tested. Owner acceptance and merge authorization remain open.

## Earlier floor integration and measurements

## Security and Conveyor floors · 19 November 2026

[Play the two cameras](/loopforge-shifts/index.html) · [Matched 1× gameplay and measurements](/loopforge-shifts/review/floors/index.html) · [Download the portable player and fixtures](/loopforge-shifts/review/floors/Loopforge-Days-2-4-review.zip)

[ENGINE integration `13dedce7`](https://github.com/stepan-o/fruitful-lab/commit/13dedce79122bd12d83cdbebb535a00c2483b331) binds [ART’s placement manifest](/loopforge-design/floor-correction/v1/manifest.json) to the Days 2–4 camera. PR #167 depends on [ART PR #166](https://github.com/stepan-o/fruitful-lab/pull/166). The renderer repeats each 4 m enamel material in factory coordinates and draws the corresponding room light and wear once beneath the props and cast. A page decodes four floor images. Each camera retains its last composited backdrop until its dimensions or projection change. The portable HTML embeds the same bytes. Extract the ZIP and open `Loopforge-Days-2-4.html` to play offline.

1. Restore **Missing ID**. Follow the cool light across the held queue to LIMEN’s desk. Open the signal, issue the pass, close the report and press **Play 1×**. Watch bob leave and jo step up.
2. Restore **Conveyor chat** and press **Play 1×**. Track the first carrier from Wash to Belt, Forge and the rack under the amber light. Switch to Security and back, resize, then restore.

The nine frozen comparisons reproduce the initial private hashes, admitted inputs, public journals, hearing, event ticks and terminal results. The immediate pass yields seven rack arrivals. Watching Conveyor yields detention and zero. The 20 Hz worker and Day One calibration retain their original bytes. Both viewport comparisons and the offline run passed. Final visual acceptance and any merge rest with the owner. [Dependent ENGINE PR #167](https://github.com/stepan-o/fruitful-lab/pull/167)

## Saved art in the live player

The host loads the v1 manifest and its three atlases once per page. The bundled ART selector sees only a frame accepted by `wire.read`. The presenter passes the current room, open case and locally selected bid. A deliberate button press calls the supplied `commandPayload` helper, then the existing worker admits or rejects that intention. The simulation runs independently at 20 Hz.

The gate, signal and case copy identify a held line. Open the register, close its report, switch cameras and reopen it while the shift continues. Its report stays readable after spending the intervention and after resolution. The pass records its holder, issuer, shift and expiry. Detention uses the Security insert. The next worker moves on the existing route. On Conveyor, post tags follow physical coverage and the handoff lamps follow the active workpiece. Three rack sockets have separate rear, contents and foreground layers. The docket counts every arrival even when the same sockets are reused.

Speech uses the last delivered words per speaker, a named plate and a tail. Interrupted speech takes the torn plate. At a clash the public endorsement and each committed choice appear independently. The open reviewer inspector is the separate entry point for recorded reasoning. The end docket records staffed controls, output, expiry or release and the subsequent morning carries the completed total.

[Watch the normal-speed comparison](/loopforge-shifts/review/shifts-art-1x.mp4) · [Read the dated ENGINE evidence](/loopforge-shifts/review/2026-11-19.md)

## Matched runs

Times below are seconds after restoring the listed checkpoint. Counts are new physical arrivals at the rack that shift. Three Day One cortexes are already there.

| Checkpoint | Player decision | What changes |
| --- | --- | --- |
| Day 2 · Missing ID | Immediate daily pass | LIMEN resolves the case. At 2.30 s jo steps forward. Six cortexes reach the rack. |
| Same inspection | Watch Conveyor | LIMEN closes the case at 14 s. jo steps forward at 14.45 s. Wash stays uncovered and zero new cortexes reach the rack. |
| Day 2 · Morning bids | Appoint LIMEN / appoint STILETTO | With LIMEN at Security, bob’s missing original holds the line. With STILETTO at Security, expedited clearance lets Conveyor finish five. |
| Day 2 · Conveyor chat | Keep STILETTO’s pace | At 1.80 s bob hears “Somebody found one.” STILETTO interrupts at 3.20 s. Five cortexes reach the rack. |
| Identical crew and posts | Slow the line | At 3.25 s bob hears “ed’s desk.” Three cortexes reach the rack. |
| Day 4 · Conflicting orders | Crew decides / back LIMEN / back STILETTO | ben’s choice depends on firsthand evidence and public backing. Inspect ben’s record after jo crosses. |

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

The original credential and the worker’s motive are separate. A shown credential requires a public credential event or admitted pass. The private hearing trace remains in the reviewer evidence. The verified Day 4 endorsement at tick 9467 reached sam and missed mae in both restored backing runs.

The remaining character dependencies are bob’s injured gait and credential handling, ed’s card handling, distinct worker silhouettes, directional movement and supervisory gestures. The detention insert covers the recorded custody result. A physical detention position and route still require LEVEL and character work. The carrier uses the earlier in-process token. The three sockets share capacity with cumulative output. The TypeScript kernel, bounded intentions and local KVP profile remain the migration boundary for a future Rust implementation and a future 3D viewer. Owner review is pending.
