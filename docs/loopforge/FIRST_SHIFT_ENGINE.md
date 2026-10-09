# First-shift engine and viewer contract

Implementation: `apps/lab/lib/loopforge/first-shift/`. Public experience: `/stepanoskin/loopforge/play`. API: `POST /api/loopforge/first-shift`. Author-facing explanation: `/stepanoskin/loopforge/engine-notes`. The former eight-shift teaching console remains at `/stepanoskin/loopforge/play/teaching`; its engine and narration endpoint are separate and unchanged.

## Whole-day cadence — design target

The owner sets the entire game day at about one minute for routine play and two to three minutes at most for heavier days. Include adviser choice, briefing/approval, running, warranted decisions, allocation and normal reading/transitions. The current 48-beat slice, 900ms normal advance delay and two scheduled incidents remain unchanged; it does not establish repeatable daily/weekly pacing. Do not meet a wall-time target by changing outcomes on slower clients. Reading pauses consume no in-world production opportunity; an accepted stop order does. Future daily carry-forward and weekly settlement need explicit engine/projection contracts. See [daily-loop inventory](ONE_MINUTE_LOOP.md).

## Intent and limits

A complete first-day interaction slice for testing adviser choice, authority, output versus wear, permanent allocation and the readability of consequences. It is not a replacement for the whole old sim-sim, a completed ECS, a balanced Act 1, a persistent multiplayer world, or a general BDI implementation.

The six-camera organization, director-console hierarchy and scene lookup idea come from the original `frontend/loopforge-webview/src/viewers/sim_sim/`. Current code reuses its published artwork; it does not copy Pixi renderer state, old economy rules, washed-brain sale rules, five-brain worker conversion, day-gated unlocks or preassigned rosters. The first two rooms are accessible; four sealed bays communicate the floor’s future without requiring more first-day choices.

## Ownership and portability

| Module | Owns | Cannot own |
| --- | --- | --- |
| `contract.ts` | Primitive payload types, tagged commands, version IDs, canonical integer JSON | Framework, network, assets, hidden psychology |
| `workers.ts` | Stable worker IDs, component tables, work/strain/casualty/allocation systems and derived counts | UI, provider, anonymous count-only workers |
| `kernel.ts` | Complete run state; pure ordered transitions; seeded risk; private histories and traces | Clock, renderer, provider, external I/O |
| `projection.ts` | Allowlisted player knowledge and observable character remarks | Sending raw private state |
| `server.ts` | Input admission, bounded replay, hashes, envelopes and diff generation | Client animation or per-process world storage |
| `viewer.ts` | Snapshot/operation reconstruction, order and integrity validation | Importing or calling the kernel |
| `useRun.ts` | One in-flight request, confirmed transcript, explicit recovery and download | Optimistic production, unconfirmed commitments |
| `FirstShift.tsx` / `audio.ts` | Responsive panels, camera composition, pace requests and event cues | Deciding incidents, trait changes or production results |

Rust-native discipline here means explicit IDs and discriminated unions; integer state; one mutation owner per accepted transition; bounded values; no ambient randomness; fixed ordering; clear domain versus I/O boundaries; and golden fixtures for future ports. TypeScript does not enforce Rust ownership statically. Transitions clone their input and tests check non-mutation; a Rust port can replace this with borrowed input and owned output without changing the contract.

Workers are individual entities from the first shift, including a ten-worker scenario. Component tables hold identity/origin, body and lifecycle, assignment, psychology, conditioning and history, joined by stable worker IDs. An explicit ordered ID list governs iteration; object/map iteration order does not drive results. There is no independent mutable workforce counter. Counts are projections over those components. No generic ECS library is needed to establish this architecture. Domain records do not embed art, DOM, camera coordinates or audio handles.

## Frontend decision

The first slice uses the existing Next.js App Router, React and TypeScript, with CSS Modules for composition, transitions and camera effects and Web Audio for optional recorded/procedural cues. The camera feeds are illustrated scenes, not a live 3D renderer. No animation framework, game engine or state-management dependency is added for this interaction test.

**Preceding focused-console baseline, 8 October:** Start entered the full-screen leadership call directly, then a wall of six repeated monitor housings with two active feeds and four off. Return did not require a separate acknowledgement. The accepted focused jobs remain: a roster with two available advisers and three future channels, explicit appointment, intercom/briefing, placement, room focus, dispatch, debrief, development and records. Incidents, guidance, instrument details and settings use native dialogs. `ConsoleParts.tsx` owns presentation primitives; workspace components, `AdviserSelection.tsx` and `LeadershipCall.tsx` own their jobs; `FirstShift.tsx` owns navigation, transient choices and lifecycle above `useRun`. The old permanent action column stays removed. Planning/focused reading and dialogs pause advance requests; navigation does not invent facts. Historical validation of this build is not validation of the four-skin replacement.

**Approved producer-console delivery, implementation/verification underway:** all four skins are being integrated without awaiting a winner. [Producer console direction](PRODUCER_CONSOLE_DIRECTION.md) defines **Start → producer console → Answer leadership → cinematic call → Acknowledge quota → console → Choose adviser → roster/appointment → brief → placements**. The incoming receiver is the sole opening gameplay action; settings, mute and exit remain usable. Early close leaves the lock intact. `ProducerConsole.tsx` and its typed art/geometry adapter own shared glass, separate receiver/selector, original room feeds, read-only projected facts and local light. Foundry, Broadcast and porcelain Obedience have six-pane profiles; Dispatch office has one primary plus five. Two feeds start live, four off. Six old material themes leave the selector and remain internal to focused components/historical assets. No new kernel/API command, balance or worker-state rule is introduced. Final runtime and first-shift checks remain to be evidenced.

For this single-day prototype, the `incoming / connected / acknowledged` lifecycle belongs to per-run presentation state above `useRun`, not a new world phase or command. Settings, skin changes and menu/resume preserve acknowledgement and unconfirmed placement/dispatch choices without remounting the run; new runs reset the lifecycle. Reading topics, muting, early close or restoring a screen cannot acknowledge for the player. Reopening an acknowledged mandate never relocks the run. Acknowledge quota enables the internal selector; explicit appointment still sends `choose_adviser`. Block all gameplay entry points while unacknowledged, without claiming current HTTP admission enforces this client gate. A later multi-week mandate needs explicit run/week identity and a versioned server contract. Retain cinematic choreography and focused jobs.

The original dispatch office illustrates allocation, logistics illustrates debrief and the lobby illustrates the menu; they are not additional managed rooms. Internal theme kits preserve sockets and focused monitor proportions; shared tape/speech/icons live in `loopforge-focused`. New skin defaults pair foundry-desk/baseline, broadcast-control/broadcast-desk, dispatch-office/foundry-switchboard and obedience-organ/neural-diagnostics. Old material names are no longer player options. `/play/console-study` remains a read-only historical density fixture, not evidence of later gameplay or the new receiver gate. Call topics/fades and the captured opening report remain presentation state; future weeks need actual settled reports and a quota contract. No fifth supervisor enters the first-day command union for a visual study. Owner feedback on the actual running game remains decisive.

The later live, tick-fed 3D factory is a cinematic observation layer alongside these interfaces. Both consume the same knowledge-filtered state/events and emit commands through the same boundary. The illustrated loop must work when the 3D layer is absent or unavailable. Camera selection, scene nodes, materials, animation clips and asset URLs remain outside the kernel. Future spatial facts require an explicitly versioned projection extension; the present HTTP profile is not silently declared sufficient for a full spatial world.

Babylon.js remains a candidate for that future scene, not an installed dependency or final commitment. Validate actual art, lighting, moving production, input response and mobile performance before selecting it. The old Sim4/KVP implementation uses a Pixi isometric viewer; Sim5's broader viewer plans are design references, not an inherited finished 3D implementation. None of this changes simulation authority, BDI ownership or the model-service boundary.

## Clock and command semantics

`tick` is the committed transition revision. Every accepted command increments it by exactly one, including planning. `shiftTick` advances only on an admitted `advance`, and stops at 48. This distinction is explicit: the HTTP profile uses revision ticks and is **not** claiming the old protocol’s simulation-time semantics verbatim. Production uses `workTicks`, excluding withheld production beats. All three are integers.

The viewer requests one advance after the previous response is validated, normally after 900ms (300ms at 3×). This is response-paced HTTP, not an autonomous world clock. Network delay can slow the shift; it cannot change its deterministic outcome. Planning, pending decisions, record inspection, development, settings, manual pause and hidden tabs stop advance requests. CSS can interpolate the image but never advances facts.

Commands:

- `choose_adviser { adviser }`: only from `choose`; picks one adviser and exposes their structured briefing. Assignments remain null.
- `approve_plan { assignments }`: only from `briefing`; both rooms need distinct valid supervisors. The proposal or swap becomes authoritative; an override records private reactions.
- `start_shift`: only from `ready`.
- `advance`: only while `running`; applies one fixed beat, production, wear and any scheduled observation in fixed order.
- `resolve_incident { incident, response }`: only for the current pending incident and one of its legal responses. Adviser-room incidents never create this pending player decision.
- `commit_output { retain }`: only from `allocation`; integer 0…produced. The remainder goes to the weekly quota. This is terminal for the slice.

There is deliberately no repair, priority-selection, station-staffing, sale, paid-generation or hidden-stat inspection command.

## First-day fixtures, not final balance

Start: 24 basic workers, reserve funds 240, equipment condition 82/100, weekly quota 60 due at end of day seven. Cash does not settle during the slice; development prices and payment cadence remain open. The day begins with empty assignments and no adviser.

LIMEN proposes himself on Conveyor and Stiletto on Security, prioritizing operating limits. Stiletto proposes the inverse, prioritizing output. Approving the plan automatically assigns the existing crew: one sixth (rounded down, minimum one) to Security, the rest to Conveyor. This is an explicit provisional crew rule, not a player station-staffing action. Each active Conveyor worker contributes one integer production-work unit per working beat under LIMEN, two under Stiletto. Every four working beats the line converts accumulated work at 80 units per new robot; fractional work is carried as an integer remainder. Thus the default 20-worker Conveyor crew produces one or two per batch, while a larger crew contributes more work. Baseline equipment wear remains one condition per eight or four shift beats. Room throughput caps, materials and balancing are future mechanics, not reasons to aggregate away people.

Two scheduled observations at beats 12 and 30 make both authority modes testable in one short playthrough. They are not claims of fully emergent event timing. At beat 12 the line’s load rises; at beat 30 Security encounters a clearance mismatch. The adviser’s own room resolves using their authored priority. The other room pauses for the director to support or override it. Assigning the adviser elsewhere changes which observation requires a player decision.

Easing load or verifying records withholds three future working beats. It does not restore condition. Pushing the line preserves opportunity but adds wear and a seeded risk of a worker loss; operator, exposure, mean Conveyor-crew stress and equipment wear affect the bounded threshold. A separate seeded draw chooses a particular exposed robot. Its entity is marked destroyed, never deleted or replaced by a counter decrement. Only workers assigned to that room receive a witnessed-loss memory; Security does not magically learn it. It does not guarantee an accident. Waving the crew through preserves output and records an unresolved exception. Its larger downstream effect is outside this first-day slice and must not be sold as an already implemented arc.

The PRNG is an unsigned 32-bit LCG: `next = (1664525 * state + 1013904223) mod 2^32`, implemented with `Math.imul` and `>>> 0`; the bounded fixture draw is `next % 100`. A rejection-sampling scheme would be preferable where tiny modulo bias matters; this prototype makes no claim of competitive randomness. Same seed and accepted commands produce identical state.

## Belief, intention, action, memory

Each supervisor carries private confidence, loyalty, respect, stress and memory entries. Opening advisers are sincere; distinct authored policies generate the briefing priority, proposed placements and incident response. Traces preserve actor, believed observation, desire, intention and reason. Overrides and outcomes alter bounded state and create memories. The visible remark reflects support, override or injury, with no trait meter.

This is a small authored BDI baseline. It does not yet score competing intentions, propagate disputed rumours or generate long episode arcs. Both current supervisors observe the director’s broadcast orders in this slice. Future disclosure and rumour routing must use explicit recipient knowledge before triggering reactions; the current broadcast simplification is not a universal information rule.

Every produced robot immediately receives an ID, origin tick, body, stress, unconditioned status and creation event reference. It awaits allocation without joining the current crew. Allocation changes those same entities to active retained workers or dispatched quota units in stable production order. Their IDs and histories survive. Inherited workers have an explicitly unknown conditioning history; manufacture before Theatre is explicitly unconditioned. Neither state leaks through the player projection.

Work updates each assigned robot's accumulated work beats, body wear and stress. Pushing/relieving load affects the crew's stress; injury and witnessing it create individual memories linked to the causal event. These are small deterministic systems, not a complete individual BDI or rumour simulation. Later beliefs, information receipts, relationships and intentions should be components on these identities, never a second disconnected population. Act 2 unlocks visibility and interaction with richer state; it must not retroactively invent anonymous workers' pasts.

The same kernel is exercised with 10, 24 and 100 starting workers. The HTTP admission allows 10–100 for bounded scenario testing; the player UI still opens the agreed 24-worker fixture. The pure initializer supports up to 1,000 as a safety bound, not a measured capacity promise. At this scale, plain component tables and stable ordered iteration are sufficient. Typed dense storage, indexes and structural sharing can replace their representation after profiling without changing entity identity or rules.

## HTTP KVP application profile

Version tuple: protocol `loopforge-kvp-http/1`, schema `loopforge_first_shift_1`, engine `first-shift-1.0.0`. This is separately versioned and intentionally **not wire-compatible** with locked KVP-0001 v0.1. It preserves the sovereignty and reconstruction patterns while avoiding false compliance with the old LIVE handshake, canonical `{world,agents,items,events}` model, transport replay messages and artifact manifest. A future legacy adapter needs its own conformance suite.

Request: version tuple, UUID-v4 run ID, u32 seed, `initial_workers` (10–100), up to 56 commands and either a null baseline or `{tick, step_hash}`. The HTTP route accepts JSON bodies up to 16KB while reading the stream; a forged `Content-Length` cannot bypass that bound. Unknown command tags and invalid values fail closed. Extra object fields are discarded by the parser rather than being copied into state.

Every response has a discriminated envelope with the version tuple, run ID, UUID message ID and non-authoritative send timestamp. Wall-clock metadata never affects simulation or hashing.

- `FULL_SNAPSHOT`: complete player projection, revision tick and SHA-256 step hash. Requested for initialization or explicit recovery.
- `FRAME_DIFF`: exactly `from_tick → from_tick+1`, previous hash, resulting hash and ordered operations. No `payload.state` or hidden-state replacement. `set_fields` replaces the bounded non-event public record; `append_events` adds only new events. This intentionally coarse schema can become finer-grained entity operations later without changing the ownership model, but a semantic schema change needs a version bump.

Canonicalization accepts null, booleans, strings, safe integers, arrays and records only. It sorts object keys and preserves operation/event arrays. SHA-256 covers the public projection, not envelope metadata. Both server and viewer compute it. The private kernel golden fixture is separate from the public projection hash; public hashes alone do not establish private-state integrity.

The viewer dispatches on message type, validates version/run and tick/hash continuity, rejects unsupported operations and duplicate event IDs, then validates the resulting hash. A diff cannot be applied twice. An incompatible or interrupted response leaves the last confirmed view intact. Reconnect replays only the confirmed transcript and requests a full baseline; an unconfirmed action is not optimistically shown as accepted.

## Hosting, recovery and honest authority limits

Each request reconstructs the bounded run from a seed, initial workforce and command history. No warm-server memory or database is needed. This supports deterministic first-day branching and local replay tests, not tamper-resistant account ownership. A visitor can submit a different valid history; SHA-256 validates consistency, not authorization. There are no paid calls or transferable rewards on this endpoint.

The browser keeps its confirmed transcript in memory. Download exports versions, seed, initial workforce, commands, public view and hash. Reload starts another playtest. Cloud saves, replay import, signed run ownership, durable append-only commands, idempotency receipts, rate controls and storage retention are future work before persistence or paid services depend on this path.

The same portable domain can later be hosted in a worker, a persistent server or Rust. Add durable command admission before autonomous ticks or cross-device saves. New viewers consume the public profile; they do not acquire private memory by importing domain code.

## LLM seam and evaluation

No provider calls in this slice. Authored structured sections and deterministic adviser policies establish the baseline. Later adapters receive an explicit permitted evidence bundle and return a versioned proposal artifact; a separate admission stage must validate claims/actions, record provenance and only then turn admitted intent into domain commands. Provider failures fall back to authored behavior. No model output writes world fields directly.

Compare matched seeded scenarios across: authored BDI; authored BDI with generated prose; and admitted model interpretation/reasoning. Measure owner-rated enjoyment, useful differences in decisions, character consistency, knowledge leakage, causal clarity, latency and cost. Only the selected adviser should incur briefing generation. Budget, retries, cache policy, model version, prompt version and evaluation fixtures belong to that adapter, not this kernel. OpenAI is the approved first provider, with later open-model providers replaceable at the boundary.

## Experience and source provenance

[Experience direction](EXPERIENCE_DIRECTION.md) is the visual/audio authority for the prototype. The [game design board](game-design/README.md) remains the source of accepted long arcs and open decisions. Its full prose was migrated without rewriting the agreed 01–05 content. Read-only source snapshots preserve the original producer, Rust-native and KVP doctrines; they are historical references, not automatically implemented capabilities.

Room/character images retain the `loopforge`, `loopforge-supervisors` and `stepanoskin` immutable packs and their provenance. `loopforge-sfx` retains cropped CC0 recordings and procedural fallbacks. The four-skin delivery adds prepared `loopforge-producer-runtime` plates and compact `loopforge-producer-studies` previews through the same versioned pipeline. Concept sample rooms and generated labels are not authoritative content. This presentation work changes no engine commands. Browser, asset and invariant evidence must be recorded for the final revision; historical checks do not prove the new delivery.

## Presentation recipes and beacon receipts

`GameClient` owns menu/session visibility; `FirstShift` retains its run controller and call/draft state while equipment changes. `ThemeProvider` validates recipes, prepares the requested full console plate and focused asset family, then atomically replaces presentation. Version 1 gains an optional console field; parsing resolves it from a new `?console=` link or a valid migrated legacy preference. Four new selections use matching internal material pairs. Invalid IDs fall back to Foundry; failed/superseded loads preserve the previous complete recipe. No skin enters HTTP or kernel contracts. Settings pauses advances and blocks switching until an in-flight order settles; closing it never starts the conveyor.

The beacon reads confirmed public receipts: production green, actual new losses red, required attention amber; ordinary incident prose does not prove an accident. Dark rest and cyan idle life do not imply simulation progress. Each new plate uses calibrated local light instead of the preceding broad main-console beam, with no model calls, simulation randomness or per-frame world updates. Incoming leadership uses attention semantics, not accident red. Verify source alignment and every opening/state transition during delivery. See `UI_THEME_ASSET_SYSTEM.md` and `CONSOLE_LIGHT_FEEDBACK.md`; no engine command changes are implied.


## Expression scenarios — design handoff, 8 October 2026

[Player desires and scenarios](PLAYER_DESIRES_AND_SCENARIOS.md) maps the owner’s expression goals to conditional Parts 01–02 situations and interface feedback. It is an authoring brief, not an extension of the implemented schema. Stable workers, accepted commands, physical consequences and received memories must support the eventual payoffs. A feeling of recognition cannot be supplied solely by generated dialogue.

Expression labels belong to scenario coverage and playtest notes; do not add an inferred player personality or morality component. The same action can serve different intentions. Keep UI complexity independent from engine complexity: a concise commitment and known consequence can sit above detailed deterministic state. Preserve the existing authority, evidence and model-admission boundaries. Multi-day continuity, Theatre programmes and contextual public support remain implementation work.


## Emergent arcs and visible status — design contract, 8 October 2026

The core-loop study adds an authoring obligation, not an implemented runtime claim. Every Act 1 arc must connect a meaningful commitment to world changes, individual observations/interpretations, visible status and a next choice. See [CORE_LOOP_STUDY.md](CORE_LOOP_STUDY.md) for all five stage contracts and the UI presentation rules.

Record stable subject IDs and causal links across commands, state transitions, seeded draws, information delivery, beliefs, intentions, actions and consequences. The player-facing status projection contains only permitted observations with source/time and available actions. Confirmed output, a supervisor's account and an unresolved rumour require distinct semantics. Hidden causes may produce observable behaviour, but no token may reveal a private loyalty number, a secret intention, or knowledge its audience has not received. Later authorised discoveries can explain earlier signs using the same event history.

Presentation consumes these records; it does not create truth. A red accident impulse requires a physical accident, not merely a claim. A successful dispatch updates the quota and permanently commits those worker entities; a repair is unavailable until the first engineer arrives. Quiet success, failed rumours and absent evidence remain valid outcomes. LLM speech must earn its place against the authored baseline and cannot bypass recorded admission or knowledge limits. Replaying one day cannot validate the longer emergent trajectories.
