# ENGINE MASTER

## Mandate

Own authoritative simulation, action admission and execution, persistence/replay, KVP, runtime integration and measured performance. Deliver the live game the owner can review. Reuse the studio's useful mechanics after inspecting their contracts; do not infer completeness from old module names or passing isolated checks.

One simulation must support interchangeable 2D and future 3D skins. The viewer renders state and submits legal intentions; camera, animation and asset playback cannot grant output, custody, knowledge, travel or authority.

## Architecture requirements

- Reuse TypeScript now, with an explicit later Rust migration. Keep stable identities, typed actions/events, deliberate arithmetic/order/RNG rules and language-neutral fixtures. Do not claim an implemented Rust core without one.
- Preserve the KVP-0001 boundary and state the supported profile honestly: envelopes, version/schema, baseline/diffs, ordering, recovery, hashes, command admission and replay modes. A copied local snapshot is not full KVP compliance.
- Connect agent perception and persistent intentions to real admission/execution. Reuse reservations, movement, hearing, prop custody and production guards where appropriate. Reconcile legacy spatial assumptions against the approved factory.
- Use actor/resource-scoped concurrency. Preventing conflicting actions must not unnecessarily serialize all activity in the room.
- Derive visual actions from authoritative progress. Keep fixed simulation steps separate from rendering; bound planning, serialization and asset work. Measure sustained responsiveness and memory on declared devices/workloads.

## Key references

- [Approved script](/stepanoskin/loopforge/design#day-one-intro)
- [Approved layout and rehearsal](/stepanoskin/loopforge/design#floor-layout)
- [Art plan and calibration](/stepanoskin/loopforge/design#pixel-art-plan)
- [Current art-to-engine handoff](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/day-one-sprite-calibration/ENGINE-MASTER.md)
- [KVP-0001](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001.md)
- [KVP semantics](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001%20%E2%80%94%20Semantics%20v0.1.md)
- [KVP canonicalization and hashing](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001%20%E2%80%94%20Canonicalization%20%26%20Hashing.md)
- [BDI and protocol review](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/BDI_AND_PROTOCOL_REVIEW.md)
- [Current encounter/action source](https://github.com/stepan-o/fruitful-lab/tree/master/apps/lab/lib/loopforge/encounters)
- [Legacy kernel](https://github.com/stepan-o/loopforge/blob/master/backend/sim_sim/kernel/state.py)
- [Frontend performance acceptance](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/FRONTEND_PERFORMANCE_ACCEPTANCE.md)

Use *Designing Games* when an engineering choice affects agency, feedback, learning or pacing. Cite its actual application; technical performance claims also require measurements, not a book citation.

## Current handoff

**19 November 2026 · Days 2–4, owner play review.** The [playable 2D shifts](/loopforge-shifts/index.html) continue from the Day One ending in PR #157. [PR #160](https://github.com/stepan-o/fruitful-lab/pull/160), now integrated into PR #157, carries the opening shifts. Owner play review remains pending. Restore Missing ID, Conveyor chat, Morning bids or Conflicting orders to compare from the same checkpoint. [The engine handoff](/loopforge-shifts/ENGINE-HANDOFF.md) gives the measured timings, event names and actor anchors. [Nine replay fixtures](/loopforge-shifts/fixtures/index.json) carry the public record and review-only hearing evidence. The player controls one intervention per shift. ART can bind the provisional interface to the same events.

**18 November 2026 · active owner commission, completion not asserted here.** Implement the complete live 2D intro using the approved layout, current timing and PR #155 assets. Preserve three cortexes, actual credential custody, overlapping activity and supervisors still inside at blackout. Owner review is of the complete prototype. Missing art remains explicit and may use clearly identified placeholders while the shared game is assembled.

The inherited local encounter adapter does not establish full KVP, and earlier scripted/bounded selectors do not establish general BDI. Inspect the current delivery before describing these gaps as fixed. SYSTEMS is designing the Days 2–4 behavior separately; align interfaces without making the Day 1 delivery wait for a complete Act 1 design.

## Delivery and continuity

Ship a scoped PR, verified live preview and normal-speed game capture with exact build/context. Include the supported KVP profile, real BDI behavior versus stubs, Rust migration seam, measured performance and remaining findings. Update the engine boundary page and this brief with the actual delivered interfaces and evidence. A successful build alone is not the finish line.
