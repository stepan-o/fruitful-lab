# ENGINE MASTER

Read the [shared Studio instructions](/stepanoskin/loopforge/design/studio) with this brief. They define the owner-directed workflow, reference-book discipline, source ownership and delivery requirements. The owner’s current task supplies the scope.

## Mandate

ENGINE MASTER owns the Loopforge kernel and guards [KVP-0001](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001.md). This standing owner decision applies to every commission. Budget engineering and verification time for the engine work each feature requires.

## Architecture requirements

- Implement game behavior in the shared Rust crate. The browser runs its WebAssembly build. The same native crate must reproduce the run from its initial conditions and accepted inputs. This includes scripted intros, tutorials, custom events, supervisor dialogue, generic shift loops and future episodes.
- Write each character decision in terms of beliefs, desires and intentions. Record how the actor learned a fact, which goal the fact supports, the alternatives available and the intention admitted. Keep intentions until completion, interruption or a change in evidence. Recheck contact, custody, reservations, authority and hearing at the point where an action takes effect.
- Put fixed ticks, clock holds, command admission, game consequences, persistence and replay under kernel authority. The viewer submits intentions over KVP and paints verified public state. Asset loading, camera easing, accessibility and input focus belong to the viewer. Use the approved room geometry for every skin and episode.
- Treat the KVP-0001 semantics, canonicalization rules and compliance checklist as normative. Negotiate the schema and channels, verify the baseline and every adjacent diff, validate command identities and target ticks, and reconstruct replay from hash-verified artifacts. Keep private beliefs and presentation overlays outside the public state hash.
- Review each change from the normal game entry. Exercise alternate actions, expiry, tutorial holds, save/resume and rewind across episode boundaries. Run the same protocol fixtures against native Rust and the shipped WebAssembly binary. Record divergences and measured performance on the delivery.
- ENGINE owns compatibility with existing runs and the distinction between a shipped feature and a historical study. Record the scope and evidence for migrations in the current handoff. The owner reviews the playable result and decides when to merge.

## Start an ENGINE assignment

1. Read the [KVP contract](/loopforge-design/sources/kvp.md), its semantics, canonicalization rules and A–M checklist linked below. Record the current game branch and open PR in the handoff. Follow the landing page into the ordinary game menu to identify the player's actual route.
2. Trace that route from `GameClient.tsx` through `lib/loopforge/engine/campaign.worker.ts`, then through `engine/src/session.rs` into `campaign.rs`. Read `world.rs` for physical state, `bdi.rs` for belief and intention admission, `intro.rs` for authored opportunity windows, `shift.rs` for the shift and `line.rs` for production. Browser components bind controls and draw the verified projection.
3. For every authored beat, write down the actor, the local cue or attributed memory, the desire competing for attention, the persistent intention, the resource or person it needs, and the receipt that commits the outcome. Specify what happens when the cue is missed, the station is busy, the deadline expires or a player takes another action. A recorded conversation can supply words and opportunity windows. Custody, hearing, movement and rack arrivals require world evidence.
4. Add or extend Rust admission rules and public projections. Keep stable actor, card, carrier, command and event identities. Route an intro shortcut through the same actions as the played intro. At an instructional hold, accept the required world command while factory time stands still. At a live incident, let the kernel deadline resolve the case when the player takes no action.
5. Use the run journal for restore and branching. Verify the replayed state before exposing it. A seek across the intro, call or appointment must restore actors, posts, cards, cortexes, clock and tutorial holds together. A new action in the past invalidates the superseded future. Keep native and browser fixture hashes with the change.
6. Before returning a build, run the crate tests, rebuild the shipped Wasm with the pinned toolchain, compare a native wire trace against that binary and exercise the ordinary game route at phone and desktop sizes. Include a normal run and a counterfactual that changes an actor's knowledge or an admitted input. Record the exact commands, failures, remaining coverage and playable link where the next ENGINE can find them.
7. Maintain this page, its **Current handoff**, the downloadable starting prompt and the dated Studio journal whenever a delivery changes the architecture, known gaps or evidence. Update the editable sources under `docs/loopforge/studio-briefs`, regenerate the published pages with `python docs/loopforge/game-design/studio_briefs.py`, and verify that both copies and the in-page prompt agree. ENGINE owns the accuracy of this handoff between chats.

## Key references

- [Approved script](/stepanoskin/loopforge/design#day-one-intro)
- [Approved layout and rehearsal](/stepanoskin/loopforge/design#floor-layout)
- [Art plan and calibration](/stepanoskin/loopforge/design#pixel-art-plan)
- [Historical TypeScript Days 2–4 prototype](/loopforge-shifts/index.html)
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
- [KVP compliance checklist](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/studio/foundations/original-loopforge/docs/sim5/SOPs/KVP-0001%20v0.1%20Compliance%20Checklist.md)
- [BDI and protocol review](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/BDI_AND_PROTOCOL_REVIEW.md)
- [Current encounter/action source](https://github.com/stepan-o/fruitful-lab/tree/master/apps/lab/lib/loopforge/encounters)
- [Legacy kernel](https://github.com/stepan-o/loopforge/blob/master/backend/sim_sim/kernel/state.py)
- [Frontend performance acceptance](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/FRONTEND_PERFORMANCE_ACCEPTANCE.md)

Use *Designing Games* when an engineering choice affects agency, feedback, learning or pacing. Cite its actual application; technical performance claims also require measurements, not a book citation.

## Current handoff

### 26 November 2026 · Recorded score in the playable campaign

Game code `efc0c6e` on master base `2e08e7c`. Open the [ordinary game](/stepanoskin/loopforge/play). Choose **Play music** to hear Menu 06, open Settings for Options 02, then close it to hear the Menu phrase return. Enter the factory at 1× and confirm the eight station instructions. The [music handoff and recording map](/loopforge-design/music-audition/day-two/handoff.html) identifies the recordings and their frame ranges.

On the first Conveyor reveal, the accepted opening plays under the solo work and recedes for dialogue. A station hold or jam brings in the quiet bed. After the opening, the day bed lasts until the crew is present. The two-worker arrangement accompanies the paired run. The four-worker arrangement enters when the picture returns from the fourth Security check. The full arrangement follows the staffed run. In a model using 3,821 verified Wasm frames, an audio clock at 1×, immediate confirmations and decoded files ready to play, the opening finished near edited second 65.6. The scheduled two-, four- and fully staffed parts occupied roughly 8, 11 and 11 seconds, including fades. Device decoding and the player's actions affect those windows.

For a longer listen, use **2nd day**, take the call and post LIMEN at Security. Security plays the original 96-bar Conveyor recording. Listen for LIMEN’s recorded greeting at the desk. On Conveyor, submit the two-worker and four-worker postings and let production run. Try the other appointment to hear the line wait for clearance and pick up again. The score counts working machines on the focused camera. The speech and waiting arrangements hold the work phrase. Music mute and the greeting control are independent. Pause holds musical time. A restored frame selects its current arrangement directly.

The viewer reads verified public state and local camera focus. Rust owns time, staffing, speech receipts, custody, closure and journals. The score sends zero game commands. The [frame manifest](/loopforge-design/music-audition/day-two/cues.json) supplies all recording intervals in 48 kHz source frames. Replay and live frames share the adapter. Returning to a screen, seeking or loading a save suppresses old one-shots. Current closure confirms the bell and triggers the recorded release. Its first beat leaves room for a bell effect. The game has no separate recorded bell sound.

**Verification on the candidate.** Native crate tests and release CLI build passed. The pinned rebuild reproduced the shipped Wasm byte for byte. Native/Wasm comparison and independent public hashes passed over 162 frames, including corruption rejection and restore. The socket test passed. Five focused music checks covered the selector, frame intervals, room phase, long waits, speech, pause, cancellation and the greeting receipt. With the Security decode held open, a confirmed posting scheduled one appointment tap immediately from the cue reel. Visible speech in the same room preserved it. Seek and departure from the room retired any outstanding one-shot. Through public commands, the Day One trace reached the console with three outputs. The LIMEN-at-Security trace verified 5,928 frames, admitted bob with a pass, reached all three working tiers and closed with 38 new arrivals. The STILETTO-at-Security trace verified 2,809 frames, cleared eligible stations and closed with seven new arrivals. Each run selected one bell release.

**Ordinary game checks.** Chromium passed the phone entry suite at `efc0c6e`, from disabled pre-hydration controls through playback speed, seek, skip, call, reload and appointment. The desktop suite played all eight Day One orders, both Day Two staffing tutorials, the missing-card incident, an extra crew posting and shift close. Day One starts all 24 sprite and material downloads before it decodes the images one at a time. A controlled decode failure still reaches the game’s error handling.

Fedora Firefox at 1× on `efc0c6e` sampled nonzero audio from the accepted opening and each of the three Day One arrangements. It passed all eight orders and reached Day Two without page errors. A Firefox check on `a354c95`, which has the same music code, observed both Menu bridges, the returning phrase, silence on mute, pause and resume, both Day Two rooms and the Conveyor opening. A cold appointment started exactly one tap at source second 119.698145833 on the cue reel. The individual Day Two tier results above come from the Wasm traces. The owner’s listening verdict remains open.

### 23 November 2026 · The Operator’s Day 2

ENGINE owns the [live Day 2 campaign](/stepanoskin/loopforge/play). UI DESIGNER owns the [approved walkthrough](/loopforge-design/day-two-ui/index.html), [59 desktop and phone pairs](/loopforge-design/day-two-ui/board.html) and editable overlays. Use the [art map](/loopforge-design/day-two-ui/art.json) and [E1 landscape and portrait placement guides](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/production/missing-id-bob/held-line-r1/UI-DESIGNER.md). The [capture notes](https://github.com/stepan-o/fruitful-lab/tree/master/docs/loopforge/game-design/day-two-ui) describe a historical TypeScript recording. Its example totals belong to those runs.

Play Day 1 or use its shortcut. Both desk monitors paint the same verified departure frame. Expanded cameras use the floor transform for people, dialogue, the case marker and station controls. Opening the E1 painting or returning to Security sends no gameplay command. Rust owns the deadline, admission, custody, staffing, clearance and rack receipts. Public machine and crew labels distinguish a queued reassignment, travel to a post, a clearance call and an inspection.

Review the pass and custody outcomes, then post STILETTO at Security and clear a loaded machine on LIMEN’s line. Restore the tab and rewind across a decision. The [integration PR and browser evidence](https://github.com/stepan-o/fruitful-lab/pull/199) track the shipped build. The owner reviews the integrated experience and authorizes merging.

### Earlier ENGINE handoffs

**22 November 2026 · Menu hydration correction.** The browser failure waiting for “Skip to Day 2” was caused by a lost first click on the server-rendered “Enter factory” button before React attached its handler. The menu and playback controls now remain disabled until the client mounts; keyboard focus is restored after readiness. The browser check verifies the no-JavaScript state and then uses the ordinary controls without sleeps, retries or injected game state. The Rust crate, Wasm, approved layout, scene timing and mechanics are unchanged. CI also binds its development server to the same `127.0.0.1` host used by the browser, keeping Next.js origin checks intact. See [PR #196](https://github.com/stepan-o/fruitful-lab/pull/196) for local and CI results; owner playable acceptance remains separate.

**22 November 2026 · Current master reconciliation.** #182 was merged into #180; the combined delivery has now merged into master through [PR #180](https://github.com/stepan-o/fruitful-lab/pull/180). This reconciliation retains the Rust crate, shipped Wasm, campaign adapter, approved geometry, timing and mechanics from `7bd5ec8d`, while incorporating master’s later UI studies, music, voice and AI Lab publications. Those design proposals do not replace the playable interface in this merge. Use the PR’s current checks and preview for this combined revision; earlier review evidence remains dated to its original build.

**20 November 2026 · Rust campaign and standing ENGINE ownership.** [Architecture PR #182](https://github.com/stepan-o/fruitful-lab/pull/182) builds on [playback and shared factory geometry in #180](https://github.com/stepan-o/fruitful-lab/pull/180). Open the [crate and build instructions](https://github.com/stepan-o/fruitful-lab/blob/codex/loopforge-rust-authority/apps/lab/engine/README.md) for the current branch. After merge, verify the kernel revision, Wasm and golden fixture together on the release branch before changing behavior.

**What runs today.** The ordinary menu and Day One entry use the same Rust engine for the intro, eight station confirmations, Day Two console and call, appointments, timed ID case, assignment tutorials and supervisor-specific Conveyor loops through the bell. The two days share the approved factory geometry. A native WebSocket reviewer and the browser worker negotiate the same engine and schema. The first-turn review, older sprite study and standalone Days 2–4 design prototype preserve earlier builds. Their reviews and fixture hashes belong to those revisions. Bringing a later-day behavior into the game requires a Rust implementation and evidence on the campaign route.

**Expected evidence.** Playing and skipping Day One both put three cortexes on the rack, leave bob injured and leave his original ID with ed. LIMEN at Security gives STILETTO the two-operator and one-per-station tutorials. A pass admits bob. Rejection or timeout detains him until the bell. STILETTO at Security sends the crew to LIMEN’s clearance-driven line. Rewind across an appointment or case and verify the earlier custody, crew, clock and inventory before issuing a different order.

**Run the checks.** From `apps/lab/engine`, run `cargo test --locked --release`, `cargo build --locked --release --bin loopforge`, `bash build.sh`, `node parity.cjs` and `node socket-test.cjs`. The golden trace covers native/Wasm agreement, independent public hashes, artifact corruption and restore. The socket check uses real UTF-8 WebSocket frames and fetches the manifest over HTTP. Run `browser-test.cjs` against the ordinary game menu. The [workflow](https://github.com/stepan-o/fruitful-lab/blob/codex/loopforge-rust-authority/.github/workflows/loopforge-engine.yml) rebuilds the Wasm and regenerates the published Studio pages. Preserve the release compiler pinned in the crate. Rebaseline a fixture only after documenting the approved cause of the difference.

**How to diagnose a report.** Start with run ID, viewer and schema, last verified protocol tick and hash, command ID and target tick, then inspect the actor’s evidence and active plan. Compare a native replay with the browser projection. A wrong outcome with matching frames points to an admission or simulation rule. A mismatched frame calls for KVP desync recovery. A correct frame painted in the wrong room calls for the shared camera or art binding. Include the owner’s choice, observed result and expected consequence in the handoff.

### Prior playtest handoff

**20 November 2026 · Day 1–2 review corrections.** [Play from the landing](https://fruitful-g2dln906r-stepan-oskins-projects.vercel.app/stepanoskin/loopforge) · [Correction PR #178](https://github.com/stepan-o/fruitful-lab/pull/178) · [Correction screenshots and 1× clips](/loopforge-shifts/review/corrections/index.html) · [ENGINE handoff and evidence](/loopforge-shifts/ENGINE-HANDOFF.md). The branch starts at the merge of #177, `4398dc6f`. The corrected runtime is `b3833627`.

Pause the line, inspect bob and choose Wash. Resume to send him there. The phone camera frames the chosen post beside its crew, carrier state and time to bell. Day One now uses the corrected Security and Conveyor floors, saved queue rails, both desks, bob’s original ID, occupied-post signals and rack layers. The crew picker uses the approved cast portraits.

The remaining art includes registered floor sprites for eight workers and the bodies of Intake, Wash and Belt. The [handoff](/loopforge-shifts/ENGINE-HANDOFF.md) maps the remaining scenes and assets. Owner play and visual acceptance are pending.

### Earlier deliveries

**20 November 2026 · Days 2–4 dialogue is playable. The first implementation merged through PR #172 at `944b57c7`.** Start with either morning bid to follow the crew toward the grate and hear LIMEN’s customary welcome. For the two matched readings, use the G5 cutoff and exit checkpoints, then the 4D firsthand and W1 reported return checkpoints. The runtime handoff gives the exact controls, expected movement, evidence chains and comparable rack counts. [Player](/loopforge-shifts/index.html) · [Gameplay, review steps and portable player](/loopforge-shifts/review/dialogue/index.html) · [Runtime handoff](/loopforge-shifts/ENGINE-HANDOFF.md) · [Implementation PR](https://github.com/stepan-o/fruitful-lab/pull/172)

The player uses the accepted writing and SYSTEMS rules on the corrected floor from master at `7f5436ce`. One 20 Hz TypeScript worker owns both rooms, the gate and desk, word and sight receipts, chat reservations, staffing and physical cards. The embedded, full-screen and portable viewers share its `shift_floor_1` interface. LIMEN’s welcome has an audible reading in the Security view and in the portable file. Its deterministic fixtures provide comparisons for Rust ports. G1–G11 and all 37 conditional scene readings have executable checks. The owner’s visual judgment and merge authorization are pending. [WRITER package](/loopforge-design/dialogue-engine-review.zip) · [SYSTEMS specification](/loopforge-design/studio/days-2-4-dialogue-validation.html)

**19 November 2026 · Days 2–4 floor correction · owner play review pending.** [Open the player](/loopforge-shifts/index.html), [compare the four 1× gameplay recordings](/loopforge-shifts/review/floors/index.html) or [download the offline player](/loopforge-shifts/review/floors/Loopforge-Days-2-4-review.zip). The [runtime handoff](/loopforge-shifts/ENGINE-HANDOFF.md) covers the controls, measured branches and remaining character dependencies.

[ENGINE PR #167](https://github.com/stepan-o/fruitful-lab/pull/167) landed on the floor branch and reached master through [ART PR #166](https://github.com/stepan-o/fruitful-lab/pull/166). [Integration `13dedce7`](https://github.com/stepan-o/fruitful-lab/commit/13dedce79122bd12d83cdbebb535a00c2483b331) binds the four `raking-floor/1` exports to the existing camera over `approved-factory/day-one-3`. The repeated material and fixed room lighting use the same factory transform as the floor fixtures. Both the hosted and portable viewers consume verified `shift_floor_1` frames. The public worker bundle, Day One artwork and nine replay fixtures retain their original bytes. The bounded TypeScript simulation and its KVP command boundary remain the reference for a later Rust port and 3D skin.

Restore **Missing ID**, inspect the held queue, issue a pass and watch jo take the next place. Restore **Conveyor chat** and follow the first carrier to the rack. The matched desktop and 320 px touch recordings show both checkpoints. Read the [previous PR #163 measurements](/loopforge-shifts/review/2026-11-19.md) for the underlying cast, speech, credential and station bindings. Physical detention staging still needs a measured destination and route. Final visual acceptance and merge authorization remain with the owner.

## Delivery and continuity

Ship a scoped PR, verified live preview and normal-speed game capture with exact build/context. Include the supported KVP profile, real BDI behavior versus stubs, Rust migration seam, measured performance and remaining findings. Update the engine boundary page and this brief with the actual delivered interfaces and evidence. A successful build alone is not the finish line.
