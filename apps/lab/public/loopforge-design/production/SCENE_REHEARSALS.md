# Scene rehearsals: action, speech and consequence

17 October 2026 · implemented isolated prototype; multi-day integration pending.

[Open the scene player](/stepanoskin/loopforge/play/scene-studies). [Five-day direction](../FIRST_FIVE_DAYS_SHOW_PROPOSAL.md). [Room scale and Meshy kits](ROOM_ASSET_BRIEFS.md).

## What this build proves

The approved cast can perform together under a headless action engine. An authored planner proposes intentions; it cannot move bodies, reserve stations or award results itself. The kernel admits feasible actions, reserves actors and resources atomically, advances phases in 50 ms ticks, commits effects once and releases reservations. Interruption retains already-heard information while cancelling uncommitted effects. Deterministic replay reconstructs any storyboard frame from the same fixture and choice.

Three fixtures are available:

- **Your workers are still here:** day-one STILETTO sees empty workstations, walks to the actual Security–Conveyor portal, calls for her workers and hears LIMEN defend clerical staffing. Each reply requires the preceding attributed report. The producer’s backing changes remembered treatment. STILETTO returns to her still-empty line; this scene does not invent an admission or completed robot.
- **The name on the list:** a worker reports a clearance mismatch. Verified release and an exception produce different interpretations and trust changes.
- **The line can wait:** a worker reports overload. Easing pressure or maintaining it changes the worker’s willingness to report; the supervisor hears that response.

These are reproducible auditions. They are not a completed day-one simulation, a crowd benchmark or proof of final acting quality.

## Shared engine boundary

`lib/loopforge/encounters` contains the renderer-independent contract, reservation primitive, kernel and fixtures. The existing legacy action test imports the same reservation primitive. Existing first-turn day authority remains the owner of production, economics and settlement; the encounter world does not secretly create a second economy.

Future integration must supply a stable worker/supervisor ID, room/position, observed facts, actor availability and station resources to the encounter kernel, then apply committed domain effects to the authoritative day state once. An effect needs an encounter/phase ID for deduplication. A day cannot pay, retain or destroy an actor twice because a scene was replayed. Save both durable consequences and enough action state to resume an interrupted shift. The current scene player intentionally holds only an isolated in-memory rehearsal.

| Boundary | Present | Next integration |
| --- | --- | --- |
| Intent provider | Deterministic authored sequence, belief/fact preconditions | BDI proposal provider, priority/arbitration, interruption/replanning |
| Spatial service | Canonical zone bounds and portal graph; short clear lanes with actor separation | Obstacle navigation, queue-slot reservation, door availability and crowd movement |
| Actions | Admission, atomic ownership, phases, cancellation, idempotent completion | Persistence, machine-specific effects and validation against day authority |
| Speech | Attributed claims, addressed recipients, local/shouted hearing, bounded memories | General acoustic/visibility zones, overhearing witnesses, bounded dialogue selection |
| Body presentation | Existing accepted assets, independent pose/placement, semantic motion mapping | Smooth entry/exit blends, travel-speed matching, specific inspection and paired contact clips |
| Producer choice | Branch replay changes real rehearsal state | Authorized day commands and next-morning continuity |
| Room | Existing factory shell and scale mockups | Compact occupied interiors and production prefabs from the room brief |

## Speech is an action with listeners

An utterance records speaker, addressed recipients, speech act, reason, duration and optional claim. A claim updates a listener’s belief with source and time; it never overwrites world truth. The same misleading statement can therefore produce a truthful record of a mistaken belief.

Normal speech reaches a nearby partner in the same room. The doorway fixture permits shouts across the named open Security–Conveyor portal only when both participants are near it. Adjacency alone does not grant factory-wide hearing. Each supervisor’s reply checks that the relevant claim was actually heard. A closed doorway or distant recipient blocks that chain.

The player projection contains bodies, visible effects and at most two active speech bubbles. It excludes private stress, trust, beliefs and memories. A separate author disclosure exposes those for verification. The speech budget limits presentation only; it must never silently erase perception. Future overhearing and thought bubbles need their own visibility rules rather than reusing unrestricted debug state.

## Timing and performance

World time is fixed-step and independent of camera, rendering speed and particles. The client samples accepted clips from action phase time; it does not let an animation callback award production. Room/character modules load on demand. Offscreen/hidden playback pauses; the player begins paused and remains complete with reduced motion. Only the active two-character cast is loaded. No new source GLBs are duplicated by this feature.

LIMEN currently listens with the approved emitter idle. The worker’s scratch is an excerpt of the accepted gesture. No hand-to-paper, scanner or cradle contact is claimed. Speech rehearsal must not be mistaken for finished industrial work. Contact clips, blends and floor/prop clearance are explicit acceptance gates before this enters the main play loop.

## Review protocol

Use the three scene tabs, compare both priorities, pause/scrub and orbit. Capture a storyboard frame and its evidence JSON; the latter preserves the exact tick, camera, projection and author state. Verify cause, reaction and later interpretation from both a readable close composition and the eventual room CCTV view. Camera changes must not alter world state. Check touch/keyboard controls, active cast disposal and loading failures.

Automated coverage includes reservation contention, duplicate admission, cancelled effects, blocked routes, unheard claims, attributed belief versus fact, closed/distant doorway hearing, deterministic outcomes and projection privacy. The first-turn briefing regression confirms both advisers initially propose Security/LIMEN and Conveyor/STILETTO, while an explicit player swap still exercises room-based authority.

## Remaining production gates

1. Admission queue: persist each worker through arrival, paper inspection, clerical diversion and release. Charge real elapsed shift time while preserving enough reading time in playback.
2. Production dependency: a line without required crew stays idle; released workers travel to stations before production resumes. Couple overtime/tempo compensation to strain, wear and risk.
3. Next morning: derive each supervisor’s diagnosis, treatment, priority and proposal from remembered evidence. Preserve worker reporting habits and visible callbacks.
4. Five-day progression and week-one evaluation: cumulative quota, recovery/charging, safe allocation/settlement and deterministic alternate-run comparison.
5. Scene craft: final compact room prefabs, actual work/inspection contacts, witness reactions, transitions and measured 24-worker performance.

## Delivery verification · 17 October

The production build, asset validation, affected 72-test engine/console/camera suite, legacy reservation tests and targeted lint pass. The broader serial run passed 95 of 99 suites initially; the remaining feedback expectations were updated for native day-one assignments, and the three environment-dependent suites were rerun successfully with `API_BASE_URL` set.

An initial browser pass identified a missing STILETTO walk alias and a gate-column staging overlap. The source binding, paired facing, portal-centre positions and default oblique camera were corrected. The browser connection became unavailable before the final visual rerun, responsive inspection and PNG download check could finish. Those visual gates remain open; this record does not certify final blocking, blends, contact or crowd performance. PNG export includes the exact frame and public dialogue; JSON separately contains author evidence.
