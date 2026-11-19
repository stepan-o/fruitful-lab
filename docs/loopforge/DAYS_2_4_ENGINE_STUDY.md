# Days 2–4 engine study

19 November 2026 · ENGINE MASTER · Build plan for owner approval

The editable baseline is the head of [draft Day One PR #157](https://github.com/stepan-o/fruitful-lab/pull/157), `d5999b54`, in the isolated `codex/days-2-4-engine` checkout. The studio brief is on master at `1aa0d512`. The owner assigned ENGINE this thread. SYSTEMS owns the design tab and its plan at `16a54fc8` on `codex/days-2-4-systems`. ART owns commissioned UI and props. Engine scope covers the shared simulation and protocol, fixtures, thin 2D review surface, engine boundary and its own handoff. Reconcile the reviewed Day One and studio bases before publishing an extension.

## Evidence from the running kernel

| Check on the PR source | Observed result | Consequence for the extension |
| --- | --- | --- |
| Step the approved intro to tick 5463 | Three individually processed cortexes finish. bob is limping. His original is stowed with ed. bob’s last observation puts it on the floor at tick 1686. | Open Day 2 from the authoritative ending. Record bob discovering his empty holder and ed’s custody separately. Carry forward witnessed events and clerk assignments as explicit inputs. The public snapshot deliberately hides the stowed item. |
| With the same two-second test reply, admit ed’s speech and cancel after one 50 ms tick. Put the addressed listener 0.8 m away for one run and 15 m away for the other. | Nearby bob retained the entire claim at the admission tick, attributed to ed. Distant bob received none. Cancellation ended the bubble but retained delivered knowledge. | For interruptible chat, schedule meaningful pieces of a line separately. Check hearing at delivery. Cancelling the remainder should leave only completed pieces in each listener’s history. This is a proposed extension. |
| Run the score check, the four intro integration tests and all 18 encounter suites | Score matched. All four intro tests and 109 encounter tests passed in Node. Coverage includes blocked movement, operator loss, concurrent speech, prop transfer, ordered diffs, hash verification and recovery. | Keep these as Day One regressions. Day One admits playback hints, reconstructs seeks from its opening, and filters private evidence. A multi-day restore must also recover actors’ private histories, in-flight work, issued permissions and admitted commands. |

The original KVP-0001 input section, semantics and canonical hashing rules are preserved in the studio source at `3267ea7`. The current TypeScript profile exposes a baseline and ordered public diffs. Extending its command set and schema needs a versioned consumer fixture. The historical Python supervisor conflict is reference material. In this commission a worker’s perceived orders, sightings, prior experiences and available routes determine whether that worker moves.

## Proposed acceptance work

- Start two runs from the same morning. Accept each supervisor’s whole bid. Measure time through the gate, time at the handoffs and cortexes physically completed by the bell. Exercise an uncovered station and the case where one operator walks between stations.
- From a captured failed check, issue the pass or let LIMEN close the case. Compare a spent intervention with rushed clearance before discovery. After expiry, replay a fresh failed check twice from the same morning. On one run renew the pass and verify that the intervention is spent, ed still holds the original and bob still wants it. On the other let the case close, verify bob’s absence from work, then his release at the bell. Also check that a skipped inspection never offers renewal and that retrying a command cannot issue a second pass.
- Interrupt the same conversation immediately before and after a claim reaches its audience. Compare what each worker can subsequently say or do while an independent operator continues.
- Restore the same later clash with an unused intervention. Compare silence, public backing for LIMEN and public backing for STILETTO. Include two workers in earshot with different firsthand histories, and one outside earshot. Keep the attributed public report and private inspection separate.
- Supply stable command and event examples for SYSTEMS and ART, desktop and phone-sized 1× captures of actual play, deterministic restore checks, and sustained input latency and memory measurements. The accident route remains a worked example. Preview and visual acceptance belong to the build and owner-review stages.

Sylvester, *Designing Games*, chapter 2, “Elegance from Emergence,” printed pp. 49–50, PDF pages 57–58 (one-based). A few independent mechanics can yield distinct outcomes when their conditions interact. This informed the choice to change listener distance with the same utterance and cutoff in the study above. For the proposed clash test, vary endorsement from a common checkpoint, then inspect which individual worker changed course and why. The hearing probe established current delivery behavior only.

## Owner decision · daily pass renewal

19 November · A. Each fresh failed inspection makes bob eligible for another daily pass if the player still has that shift’s intervention. The new pass admits him through the bell. The original stays with its holder, and bob keeps looking for it. If the case closes without a pass, LIMEN detains bob through the bell. A skipped check creates no case.

## Owner decision · hold the Security line

19 November · A. When LIMEN discovers bob has no ID, bob holds his place and the Security line waits until Security resolves the case. A worker behind him cannot clear via another desk. Workers cleared before discovery can continue to their stations, and staffed machinery keeps running. A faster-clearance policy can skip discovery before a check. Once the case is open, a pace change or a supervisor’s demand leaves it open.

If bob still lacks the original, issuing a valid daily pass clears him for the shift. If the opportunity closes without a pass, LIMEN detains him for the rest of the shift, including when the player is watching Conveyor. Either outcome resolves the case and lets the next worker be checked. Any independent reason to hold that worker still applies.

Replay from the same failed inspection with one worker already cleared and another queued behind bob. Check that the queued worker receives no clearance while the case is open, that the cleared worker can continue moving or working, and that Security resumes after either resolution. Verify event order on uninterrupted playback and after restoring the open case.

## Proposed implementation order

1. **Continue the same factory.** Add a Days 2–4 TypeScript entry point alongside `apps/lab/lib/loopforge/intro/`. Start it from the committed Day One ending. Carry forward items, worker histories, posts and completed output. Implement the morning bid, room policies, shift end and the next morning. Record which effective assignment and policy each room received.
2. **Run both rooms on the same clock.** Reuse the encounter kernel’s action admission, spatial hearing, reservations and guarded work. Bind the Security hold and resolution to authoritative events. Time the actionable window from simulated work at the desk and tune its duration in the review build. A worker who hears part of a conversation can act on the delivered information. A reassigned worker must reach a control before contributing to output. Compare actual time at each handoff and the rack at the bell.
3. **Let the crew resolve the later clash.** Carry each concession and each witness’s experience into the night. From the same eligible conflict, run no endorsement and each public endorsement. Trace individual decisions and verify the resulting staffing. A worker outside earshot needs new evidence before the endorsement can affect their behavior.
4. **Deliver the shared interface and playable proof.** Define the versioned KVP commands, ordered events, snapshots, diffs, hashes, restore rules and language-neutral fixtures for SYSTEMS and ART. Bind a thin 2D review route to those same records with live speaker names and bubbles. Keep private decision inspection in reviewer controls. Measure sustained input response and memory, rerun the Day One checks, record 1× desktop and phone-sized examples, and update the engine-boundary page and ENGINE handoff. Deliver the scoped PR and verified preview for owner review.

The measured findings above apply to Day One. The queue, cross-shift behavior and review route are planned acceptance work. Implementation awaits approval of this scope.
