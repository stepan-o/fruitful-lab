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

**20 November 2026 · Days 2–4 dialogue is accepted for ENGINE implementation.** [WRITER’s corrected five-document package](https://github.com/stepan-o/fruitful-lab/blob/9106793390eae36254145457aa26aa1b0793910d/apps/lab/public/loopforge-design/dialogue-engine-review.zip) supplies the approved words and alternatives. The [SYSTEMS behavioral specification](https://github.com/stepan-o/fruitful-lab/blob/1eb05b0bc5b4980665ad4f55b9633dd8667ad110/docs/loopforge/studio-briefs/days-2-4-dialogue-validation.md) governs perception, choice, custody and regression cases. Both [WRITER’s handoff](https://github.com/stepan-o/fruitful-lab/blob/c02c64af7158cd2bbc021ed5bc3cace37096c85e/docs/loopforge/studio-briefs/writer.md#current-handoff) and [SYSTEMS acceptance](https://github.com/stepan-o/fruitful-lab/blob/c02c64af7158cd2bbc021ed5bc3cace37096c85e/docs/loopforge/studio-briefs/game-systems-designer.md#current-handoff) are on master.

Start each morning with the workers approaching together and LIMEN greeting them. Let each worker’s private observations, beliefs, desires and persistent intentions determine what they say and do. Prove G5 by moving the cutoff across “ed’s desk” and observing whom bob seeks at the exit. Prove 4D/W1 by varying whether ben saw yesterday’s card return and observing whether he follows jo today. Carry the accepted G1–G11 cases through the player and portable build. Normal-speed play and these comparisons are still due.

The [corrected 2D player](https://fruitful-bq9libja5-stepan-oskins-projects.vercel.app/loopforge-shifts/index.html) and its [runtime handoff](https://github.com/stepan-o/fruitful-lab/blob/293ce83a96abdee04146453e080a47b521acec20/apps/lab/public/loopforge-shifts/ENGINE-HANDOFF.md) are at `293ce83a`. PRs #167 and #168 landed on [the floor branch in #166](https://github.com/stepan-o/fruitful-lab/pull/166). Check its merge status when starting. Carry that player and the accepted dialogue sources into the isolated implementation branch.

**19 November 2026 · Days 2–4 floor correction · owner play review pending.** [Open the player](/loopforge-shifts/index.html), [compare the four 1× gameplay recordings](/loopforge-shifts/review/floors/index.html) or [download the offline player](/loopforge-shifts/review/floors/Loopforge-Days-2-4-review.zip). The [runtime handoff](/loopforge-shifts/ENGINE-HANDOFF.md) covers the controls, measured branches and remaining character dependencies.

[ENGINE PR #167](https://github.com/stepan-o/fruitful-lab/pull/167) targets the open [ART PR #166](https://github.com/stepan-o/fruitful-lab/pull/166). [Integration `13dedce7`](https://github.com/stepan-o/fruitful-lab/commit/13dedce79122bd12d83cdbebb535a00c2483b331) binds the four `raking-floor/1` exports to the existing camera over `approved-factory/day-one-3`. The repeated material and fixed room lighting use the same factory transform as the floor fixtures. Both the hosted and portable viewers consume verified `shift_floor_1` frames. The public worker bundle, Day One artwork and nine replay fixtures retain their original bytes. The bounded TypeScript simulation and its KVP command boundary remain the reference for a later Rust port and 3D skin.

Restore **Missing ID**, inspect the held queue, issue a pass and watch jo take the next place. Restore **Conveyor chat** and follow the first carrier to the rack. The matched desktop and 320 px touch recordings show both checkpoints. Read the [previous PR #163 measurements](/loopforge-shifts/review/2026-11-19.md) for the underlying cast, speech, credential and station bindings. Physical detention staging still needs a measured destination and route. Final visual acceptance and merge authorization remain with the owner.

## Delivery and continuity

Ship a scoped PR, verified live preview and normal-speed game capture with exact build/context. Include the supported KVP profile, real BDI behavior versus stubs, Rust migration seam, measured performance and remaining findings. Update the engine boundary page and this brief with the actual delivered interfaces and evidence. A successful build alone is not the finish line.
