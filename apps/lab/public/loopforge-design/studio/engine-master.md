# ENGINE MASTER

Read the [shared Studio instructions](/stepanoskin/loopforge/design/studio) with this brief. They define the owner-directed workflow, reference-book discipline, source ownership and delivery requirements. The owner’s current task supplies the scope.

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
- [Live Days 2–4 prototype](/loopforge-shifts/index.html)
- [Days 2–4 engine handoff](/loopforge-shifts/ENGINE-HANDOFF.md)
- [Days 2–4 art gallery](/stepanoskin/loopforge/design#days-2-4-art)
- [Days 2–4 art-to-engine handoff](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/days-2-4-art/ENGINE.md)
- [Art review and later replay recheck](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/days-2-4-art/REVIEW.md)
- [Art adapter contract and frozen review caveats](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/days-2-4-art/binding/README.md)
- [Saved art manifest](/loopforge-design/days-2-4-art/v1/manifest.json) and [editable pack](/loopforge-design/days-2-4-art/v1/Loopforge-Days-2-4-Art.zip)
- [Day One art-to-engine handoff](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/day-one-sprite-calibration/ENGINE-MASTER.md)
- [KVP-0001](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001.md)
- [KVP semantics](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001%20%E2%80%94%20Semantics%20v0.1.md)
- [KVP canonicalization and hashing](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001%20%E2%80%94%20Canonicalization%20%26%20Hashing.md)
- [BDI and protocol review](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/BDI_AND_PROTOCOL_REVIEW.md)
- [Current encounter/action source](https://github.com/stepan-o/fruitful-lab/tree/master/apps/lab/lib/loopforge/encounters)
- [Legacy kernel](https://github.com/stepan-o/loopforge/blob/master/backend/sim_sim/kernel/state.py)
- [Frontend performance acceptance](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/FRONTEND_PERFORMANCE_ACCEPTANCE.md)

Use *Designing Games* when an engineering choice affects agency, feedback, learning or pacing. Cite its actual application; technical performance claims also require measurements, not a book citation.

## Current handoff

**19 November 2026 · live Days 2–4 art integration · owner review pending.** [Play the shifts](/loopforge-shifts/index.html), [watch the before/after gameplay](/loopforge-shifts/review/shifts-art-1x.mp4), or open the [ENGINE handoff](/loopforge-shifts/ENGINE-HANDOFF.md). [PR #163](https://github.com/stepan-o/fruitful-lab/pull/163) carries the build from `e36b83b` against master `901df37`, including the saved ART pack from PR #161 and assignment from PR #162. [Dated measurements and limitations](/loopforge-shifts/review/2026-11-19.md).

The 2D host binds the three atlases to verified `shift_floor_1` frames. Four checkpoints and nine replay results cover accepted bids, held and reopened cases, pass and custody, room coverage, speech and cutoff, backing, individual action, bell and the next shift. The reviewer can restore or inspect independently. Read `skin.ts`, `painter.ts` and `viewer.ts` for presentation, and `wire.ts` and `worker.ts` for hash recovery and admission. The approved geometry, simulation and fixtures carry through byte for byte.

Use the current reviewer record for hearing. At tick 9467 sam heard either public endorsement and mae was outside hearing. The player sees public backing and the crew’s actions. Private reasoning remains behind the inspector. TypeScript runs the bounded simulation today. A Rust port must reproduce the same integer positions, tick order, public hashes and command outcomes; a 3D skin can subscribe to the same worker interface.

For review, open Missing ID, inspect the desk and issue a pass, then restore and watch Conveyor through detention. Compare Conveyor chat at both paces and the three outcomes of Conflicting orders. Look for the intervening worker’s first step, readable overlapping speech and physical handoff timing. The [ART handoff](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/days-2-4-art/ENGINE.md) defines the outstanding injured and directional walks, credential performances, supervisory gestures and cast silhouettes. Physical detention staging awaits a measured destination and route. The custody insert is active.

## Delivery and continuity

Ship a scoped PR, verified live preview and normal-speed game capture with exact build/context. Include the supported KVP profile, real BDI behavior versus stubs, Rust migration seam, measured performance and remaining findings. Update the engine boundary page and this brief with the actual delivered interfaces and evidence. A successful build alone is not the finish line.
