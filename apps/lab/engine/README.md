# Loopforge campaign engine

ENGINE MASTER owns this crate, its KVP schema, the browser integration and the default [ENGINE Studio brief](https://www.fruitfulab.net/stepanoskin/loopforge/design/studio/engine-master). The ordinary game menu and Day One entry use the WebAssembly build. The native executable uses the same Rust implementation, authored opportunities, factory geometry and manuscript.

## From a player action to a consequence

The React view sends a proposed action to the campaign worker. Its viewer adapter negotiates `loopforge_rust / loopforge_campaign_1`, submits a KVP `INPUT_COMMAND` against the next committed tick and verifies each returned state hash. Rust admits commands, runs the BDI and physical simulation, and projects public facts. The adapter passes only a verified frame to the painter. The UI owns the camera, presentation preferences, focus and selection.

- `src/world.rs` stores bodies, attributed beliefs, credentials, rack receipts and speech. `src/bdi.rs` selects admissible desires by priority and stable plan ID and records evidence for the retained intention.
- `src/intro.rs` admits authored opportunities against perception, competing actor lanes and occupied resources. `content/day-one.json` contains the approved blocking, language, priorities and phase effects. Hearing, local contact and prior custody determine which effects can commit.
- `src/navigation.rs` checks body and fixture clearance against the shared factory. `src/shift.rs` owns appointments, the two guided staffing holds, Bob’s card deadline and both supervisors’ openings. `src/line.rs` owns worker ratings, machine work, permits, contact and rack arrivals. Cleared workers can remain available for a live staffing order.
- `src/campaign.rs` owns the episode, time of day, leadership call and quota. A shortcut performs the same Day One simulation and confirmations. Both routes carry the same bodies, memories, original cards and cortexes into Day Two.
- `src/history.rs` stores the accepted input journal and private 100-tick checkpoints. A committed gameplay action can advance the protocol tick while the factory clock is held. A new action in the past branches the run. Pause and speed affect the wall-time budget. Neither changes the result of a simulated tick.
- `src/session.rs` owns handshake, subscriptions, command receipts, adjacent diffs, recovery and artifacts. `src/host.rs` supplies the native and Wasm host services. The adapter under `../lib/loopforge/engine/` reconstructs frames, independently hashes them and draws from the same public facts on both days.

## KVP and replay

Read [KVP-0001](https://github.com/stepan-o/loopforge/blob/master/docs/sim5/SOPs/KVP-0001.md), its semantics and canonicalization companions and the [v0.1 export layout](https://github.com/stepan-o/loopforge/blob/master/docs/kvp_export_layout_v0_1.md) before changing the contract. The shipped schema uses integer millimetres, integer ticks and integer subunits for rates or animation progress. Projected object keys are schema-defined ASCII. The state hash is SHA-256 of canonical UTF-8 JSON over the selected channels. Actor, item and event order and the emitted patch order are deterministic. Private beliefs and camera effects stay outside the hash domain.

LIVE supports WORLD, AGENTS, ITEMS and EVENTS with ON_JOIN, DIFF_ONLY and NONE. After a join or recovery the host waits for the verified baseline receipt. The local adapter acknowledges it through the host binding. The WebSocket viewer can submit a VIEW_CONTROL with the BASELINE_APPLIED hint and the matching tick and step hash. Unknown message kinds, reserved channels and invalid policy values fail closed.

A kernel-hosted seek negotiates ARTIFACTS. Its manifest identifies a keyframe, one record per adjacent tick, the half-open window, anchors, render specification and SHA-256 integrity map. The viewer follows manifest pointers and validates record bytes and the reconstructed state. The local worker resolves content-addressed artifact URLs through a separate read binding. The native host serves the corresponding records over HTTP. Live recovery sends a new snapshot. Replay recovery returns an artifact pointer.

The current save key is `loopforge.kernel.journal.1`. Rust rebuilds old first-playthrough saves from their recorded confirmations and orders. An incompatible old save raises a visible error and retains the original. Use **2nd day** to start a new run. The studio’s separate first-turn review, sprite study and Days 2–4 prototype are historical implementations with their own fixtures. Future gameplay belongs in this crate.

## Build and review

Run the following commands in `apps/lab/engine` with the pinned Rust toolchain and the lab’s Node dependencies installed.

```sh
cargo fmt --check
cargo test --locked --release
cargo build --locked --release --bin loopforge
bash build.sh
node parity.cjs
node socket-test.cjs
```

`bash build.sh` rebuilds the checked-in browser kernel at `../public/loopforge-engine/kernel.wasm`. CI compares its bytes with the committed build. The parity test drives the native binary and the shipped Wasm through the same commands. It also runs the viewer’s independent reconstruction, verifies immutable fixture hashes, seeks across a phase boundary and rejects damaged artifacts. Change a golden only after explaining the intended behavioral or schema change.

For native review, run `cargo run --release -- serve 3008`. The process prints its loopback WebSocket and artifact HTTP addresses. Capture a journal from the playtest tab and run `cargo run --release -- export journal.json new-run-directory` to produce an offline `manifest.kvp.json` and its state records.

For owner review, open the normal landing page, enter the factory, try both supervisor assignments, and follow the clock, custody and rack receipts through the bell. The browser check accepts `LOOPFORGE_URL` and uses the ordinary controls. The governing release checks run in the **Loopforge Rust engine** workflow. Record results, outstanding differences and the reviewed revision in the maintained Studio handoff.
