# Loopforge implementation decisions

3 October 2026 · learning prototype. These decisions apply to the new bounded
web demo; they do not claim feature parity with the Python project.

## Rendering: choose per surface

The presentations use server-rendered HTML, SVG instruments, optimized original
art and CSS transforms. This fits editorial reading, keyboard navigation,
responsive composition and the approved Sanctuary craft. The conveyor uses
repeated vector geometry with an explicit animation lifecycle. React never
updates the world every animation frame.

| Candidate | Useful strength | Decision for this slice |
| --- | --- | --- |
| HTML + SVG + CSS | Readable text, semantic controls, composed 2D art, small dependency surface | Use for presentations and the illustrated director console |
| PixiJS 8 | Large sprite populations, texture batching, 2D filters and Spine ecosystem | Keep as a renderer option when the scene needs it; six illustrated monitors do not yet justify a full scene graph |
| Three.js / React Three Fiber | Genuine 3D geometry, lighting, camera choreography, glTF ecosystem | Revisit for a spatial factory, after acquiring suitable 3D assets and measuring the slice |
| WebGPU | Modern graphics and compute capabilities | Progressive rendering option; never a prerequisite for reading or playing |

No claim that one choice is universally fastest. Performance depends on the
scene, hardware, browser and implementation. Pixi's current documentation
recommends WebGL for production; Three's WebGPU renderer has a WebGL2 fallback
and migration differences. Newness alone is not an evidence-based selection.

Sources checked 2026-10-03:
- https://pixijs.com/8.x/guides/components/renderers
- https://threejs.org/manual/pages/webgpurenderer
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API

## Runtime: a small TypeScript kernel

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
