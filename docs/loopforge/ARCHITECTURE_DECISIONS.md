# Loopforge implementation decisions

**Full-floor follow-up, 9 October:** The separate procedural study now uses a calibrated 105 × 75 tile map (3× the reference plan in each direction) with all six managed rooms plus Lobby, Dispatch and Shipping. Security and Conveyor alone are initially unlocked. Room bounds, portals, locks, pathfinding and direct interaction adjacency share a framework-free spatial definition; workers carry integer positions and room identity. The floor-plan dialog and camera consume the same map. The existing console protocol remains unchanged. An explicit Equipment study view reveals staged machinery and operator spaces in all six rooms without granting access or changing the host snapshot. Equipment dimensions stay at worker scale. See [Factory floor calibration](FACTORY_FLOOR_CALIBRATION.md) and [Factory scale and equipment](FACTORY_SCALE_AND_EQUIPMENT.md).


**9 October implementation update:** The procedural commissioning study now uses Babylon.js in a separate route. One persistent factory camera serves night construction and production playback. The eighteen-hour shift / six-hour charge baseline and three-second illustrated day/phase interludes are approved direction. The existing first-shift game protocol is unchanged. See [Procedural factory study](PROCEDURAL_FACTORY_STUDY.md) for the implemented boundaries and verification.

**Next opening, 9 October:** night construction precedes morning briefing and assignments. The proposed kernel phase order is night build/commissioning → morning mandate/advice → authorized operation → settlement. Stable construction jobs and equipment IDs survive phase transitions; tutorial/camera state stays in the viewer. Standard installation is separate from engineering repair. No runtime or protocol extension is implemented in this documentation pass. See [the conveyor proposal](CONVEYOR_MINIGAME_PROPOSAL.md).

9 October 2026 — [Conveyor mini-game proposal](CONVEYOR_MINIGAME_PROPOSAL.md) is the current direction for the next operating prototype. Each room is a distinct puzzle within a common cinematic 3D factory; the console handles overview and communications. Physical machinery, routes, shared policies applied per room and supervisor delegation supply player agency during production. This supersedes the earlier scope of a later observation-only 3D view. The illustrated-console game remains the canonical runtime baseline. The separate commissioning fixture exercises construction and motion without changing that game’s economic or supervisor rules.

Started 3 October 2026; rendering scope updated 8 October. The original bounded
teaching demo and the current first-day prototype are distinct implementations.
Neither claims feature parity with the Python project. See
`FIRST_SHIFT_ENGINE.md` for the current day-one contract.

## Rendering: choose per surface

The presentations use server-rendered HTML, diagrams, optimized art and bounded
effects. Their editorial diagrams do not establish the material language of the
game UI. The landing conveyor now combines authored assets and procedural
motion/lighting; its physical feeling remains the game-interface reference.

The implemented baseline is **asset-driven decision interfaces with
illustrated factory context**. Use the original sim-sim UI assets and patterns
for cameras, plates, resource symbols, character dialogue, controls and
settlement. Native layout, text, semantics and hit areas provide usability;
CSS handles placement, slicing, state transitions and supporting effects.
Almost every visible game element needs authored material and shape. The
previous entrance and generic panel treatment were rejected in owner review.
That director-console composition was also rejected; its functional baseline uses assets across all day-one phases,
with a separate immutable `loopforge-console` pack, two new portraits and
authored normal/hover/pressed control states. It adds no rendering dependency
and changes no kernel or viewer protocol. See `UI_REBUILD_VALIDATION.md`.

The next **live tick-fed 3D factory** is a separate renderer but a central operating interface for the proposed room puzzles. It joins adviser/incident/allocation interfaces through a knowledge-filtered protocol. The kernel remains headless and independent of the renderer; the playable spatial prototype must prove its own visual feedback. The old Sim4/KVP
viewer is an implemented Pixi isometric scene; Sim5's broader viewer stack is a
strategy reference. Do not mistake either for an inherited finished 3D scene.

| Candidate | Useful strength | Decision for this slice |
| --- | --- | --- |
| React + native HTML/CSS + authored assets | Readable text, semantic controls and responsive material composition | Current decision interfaces and illustrated cameras; no generic SVG/CSS replacement for the required artwork |
| PixiJS | Existing sim-sim and Sim4 viewer implementation; sprite and texture composition | Reuse source assets and architectural patterns selectively; no mandatory runtime migration for the current interfaces |
| Babylon.js | Candidate integrated scene/lighting toolset | Installed for the isolated commissioning study; evaluate representative art, interaction and performance before expanding |
| Three.js / React Three Fiber | Alternative 3D composition and ecosystem | Future scene alternative, to compare if the representative spike exposes a reason |
| WebGPU | Modern graphics and compute capabilities | Progressive rendering option; never a prerequisite for reading or playing |

No claim that one choice is universally fastest. Performance depends on the
scene, hardware, browser and implementation. The board retains the dated
7 October capability comparison; recheck it before a future renderer selection.
Visual quality, interface load, engine depth and model capability are separate
axes. Prove the spatial operating loop with representative content and benchmark rendering independently of kernel correctness.

Sources checked 2026-10-03:
- https://pixijs.com/8.x/guides/components/renderers
- https://threejs.org/manual/pages/webgpurenderer
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

## Original teaching runtime: a small TypeScript kernel

Rebuild a clearly versioned eight-shift teaching slice in TypeScript. Preserve
the world, cast, management tensions and dramatic intent; document simplified
rules instead of presenting it as a line-for-line port. This enables the same
pure kernel to power interactive explanations, headless tests and the hosted
server without maintaining two implementations of the teaching model.

Server-side commands remain authoritative. The browser submits intent and
renders committed results. An explicit transport boundary permits a later
Python or Rust service without making renderer internals the protocol.
Use request/response for a turn-based single-player slice. Continuous simulation
and spectators would justify a persistent process and streaming protocol later.

## Rust-native design contract

1. One state owner: a transition function consumes a state and command and
   produces a new state/events or a typed error. No UI, network or model I/O in it.
2. Explicit IDs and discriminated unions: phase-specific commands and outcomes;
   exhaustive handling; validate untrusted values at the boundary.
3. Portable arithmetic: bounded integers, a documented u32 PRNG and stable
   iteration order. No wall clock, locale-sensitive sorting or ambient randomness.
4. Data first: plain serializable records, explicit versions and bounded arrays.
   Avoid object graphs, implicit class state and renderer references in snapshots.
5. Deterministic replay: engine version + initial seed + accepted commands
   reproduce mechanical state. Persist generated prose separately for story replay.
6. Explicit resource ownership: cancel work on exit, release rendering resources,
   cap payloads/history and keep model latency outside the mechanical transition.
7. Typed failure: rejected command, expired run, unavailable narration and timeouts
   are distinct outcomes. Do not disguise a template response as a live model.
8. Port through fixtures: test vectors and protocol contracts precede a Rust/WASM
   implementation. A TypeScript rewrite alone supplies no Rust memory-safety or
   zero-allocation guarantee; these are design conventions enforced by tests.

Sources:
- https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html
- https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html
- https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html

## Narrative boundary

Committed events and a bounded character context feed a server-side provider
adapter. The model may narrate and interpret; it cannot assign casualties,
currency or production. Validate its structured output and references, identify
it as generated interpretation, and retain the factual incident record beside it.
Credentials stay server-side. Provider configuration and an approved total
spending cap are dependencies for real calls. No provider calls in unit tests.

https://developers.openai.com/api/docs/guides/structured-outputs

## Hosting and scope

Keep the Next.js frontend and turn API in `apps/lab` for this sandbox. Avoid
shared in-memory state as the sole source of a hosted run. Choose a bounded,
versioned run capability/replay representation for the mechanical demo; document
fork/replay semantics explicitly. Paid narrative requires a protected demo gate
and enforceable provider budget before enabling public calls.

The legacy Python host, broader ECS world, Godot client and Sim4 replay assets
remain reference material. They are not silently rewritten or removed.

https://vercel.com/docs/functions/limitations

## Equipment themes and outcome light — 8 October

All six style directions remain selectable. React/CSS Modules consume authored, immutable monitor and control-state packs through a typed recipe; no new rendering dependency is needed. The build pins pack snapshots, the active recipe is persisted locally, and the run stays mounted during atomic theme changes. Shared world art and character identities do not vary with equipment. A separate bounded Canvas 2D beacon responds to public receipt changes; it is dark between impulses. The kernel remains presentation-agnostic. See `UI_THEME_ASSET_SYSTEM.md` and `CONSOLE_LIGHT_FEEDBACK.md`.
