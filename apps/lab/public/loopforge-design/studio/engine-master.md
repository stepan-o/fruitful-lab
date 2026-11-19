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

**19 November 2026 · active assignment: integrate the saved Days 2–4 art into the live prototype.** [PR #161](https://github.com/stepan-o/fruitful-lab/pull/161) is merged into `master` at `be1b212481ff170759f2eab8f38b5e6f0e9720a7`; its art commit is `0ad0d1b473b92ed6614481ce3d558f91411bc08d`. Start from current master containing that merge and verify any later changes. The pack has 48 assets, three atlases, editable masters and 48 composed proof images. Publication and gallery checks passed. Live runtime integration and owner acceptance of that integration are still pending. Do not regenerate or repaint the saved art, rewrite frozen proof evidence, or present the gallery as gameplay footage.

The [playable shifts](/loopforge-shifts/index.html) continue from the Day One ending in merged PR #157, which includes the opening-shift work from PR #160. Restore Missing ID, Conveyor chat, Morning bids or Conflicting orders to compare from the same checkpoint. The [engine handoff](/loopforge-shifts/ENGINE-HANDOFF.md) gives source-specific timings, events and actor anchors; [nine replay fixtures](/loopforge-shifts/fixtures/index.json) preserve public records and separate review evidence. Inspect `apps/lab/lib/loopforge/shifts/` (especially `viewer.ts`, `painter.ts`, `worker.ts`, `wire.ts`, `simulation.ts` and `navigation.ts`) and the scoped scripts under `apps/lab/scripts/shifts/` before changing the presenter.

### Integration scope and invariants

- Preserve existing Days 2–4 mechanics, timings, command admission, one intervention per shift, checkpoint/replay behavior, private knowledge, credential custody, production and approved geometry `approved-factory/day-one-3`. The Day One edit and its three inherited cortexes remain intact. Artwork coordinates are registration points, not new actor routes or authority to move fixtures.
- Load the existing manifest and three atlases relative to `/loopforge-design/days-2-4-art/v1/`. Inspect `binding/shift-art.mjs` and its documented exports `selectShiftArt`, `commandPayload` and `drawAsset`. Adapt their host integration to current verified frames; do not introduce another simulation, clock or scripted outcome sequence.
- Bind morning Security/Conveyor bids and accepted assignments; desk signal, pass or custody result and individual queue advancement; station coverage, workpieces and inherited/new rack output; delivered and interrupted speech; conflicting orders and each worker’s actual response; reports, bell, pass expiry, release and next morning. Public UI reads the public projection. Private hearing and beliefs stay behind the separate reviewer inspector.
- Keep the existing TypeScript simulation and KVP boundary frontend-independent, with the explicit later Rust migration. A future 3D skin must consume the same state and commands. Describe the implemented bounded BDI behavior and supported protocol profile honestly; this art pass does not establish general planning or full KVP compliance.
- Preserve B / Raking light, crisp atlas sampling, pivots, foreground occlusion, nine-slice borders and live semantic text. Use measured geometry and the pack’s 64 source pixels per ground metre for world art; UI uses its specified insets and scale. Retain keyboard access, visible focus and at least 44 × 44 CSS pixel activation targets. Opening a report is local inspection, not a spent intervention; the world continues according to the existing clock.
- Cache decoded assets and frame-independent work. Keep rendering separate from fixed simulation steps; avoid per-frame atlas loading, full-world rebuilding or unnecessary allocations. Compare sustained performance and memory with the unmodified baseline under the same declared workload.

### Verification and limits

Establish the current baseline before integration, then compare matched checkpoint decisions, public events, state hashes and outcomes after integration. Keep the approved map, actor paths and mechanical results stable. Exercise keyboard/touch controls, room switching, report reopening, the spent-intervention state, restart/checkpoint restoration and Days 2–4 progression. Review live desktop and 390/320-pixel phone viewports. Capture actual normal-speed before/after gameplay with exact source/build/context captions; art compositions remain labeled as compositions.

Read both the adapter’s frozen notes and the later ART review. The earlier capture had an outdated sam/mae hearing expectation; the later isolated recheck on simulation `fb4d822c25f5` and wire `0844e450fa61` passed nine deterministic comparisons and 21 public snapshot checks with mae outside hearing. Do not revive the old assertion as a current blocker or silently change hearing to satisfy it. Verify current master’s actual events and fixture hashes, preserve private/public separation, and record any newly reproduced baseline failure separately from integration regressions.

The custody insert is available now; a physical detention position and route are not delivered by this art pack. Missing injured walking/credential actions, supervisory gestures, directional motion and worker silhouettes remain explicit character-art dependencies. Use the existing lawful presentation or clearly identified placeholders, complete the integration that is possible, and report precise remaining gaps. Do not invent new floor geometry or wait for an Act 1 redesign.

This is an approved integration task: study the current baseline, give a concise implementation plan, and proceed. Reopen the interview only for a material design choice not settled by the owner or existing sources. The earlier Day One commission remains historical context, not a request to rebuild the intro.

## Delivery and continuity

Ship a scoped PR, verified live preview and normal-speed game capture with exact build/context. Include the supported KVP profile, real BDI behavior versus stubs, Rust migration seam, measured performance and remaining findings. Update the engine boundary page and this brief with the actual delivered interfaces and evidence. A successful build alone is not the finish line.
