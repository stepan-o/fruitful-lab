# Loopforge within Stepanoskin

Project brief · 3 October 2026. The two presentations and deterministic teaching
prototype are implemented. Paid narration is implemented but awaits configuration
and real-provider validation. This document preserves the original design brief;
the [delivery checklist](DELIVERY_CHECKLIST.md) records current completion status.

## Confirmed direction

- Continue within the public Stepanoskin route group in `apps/lab`.
- Begin with two illustrated web presentations: game engine architecture for
  LLM-enabled narrative (how Loopforge is built), and a Loopforge overview
  covering the world, existing concept art, interfaces, characters and mechanics.
- These presentations should support the later hosted, playable Loopforge demo:
  a real simulation backend, web frontend and live LLM connection. Initial scope
  is a small demo, without a requirement for thousands of concurrent players.
- Loopforge is a factory. A moving conveyor should recur throughout the
  experience, giving the pages a recognizable sense of machinery in operation.
- The current `/stepanoskin` landing already largely serves as a Loopforge
  entrance. Use it for this phase; its menu may change to accommodate the work.
- Rebuilding the broader Stepanoskin front page is deferred to a later phase.

## Proposed conveyor treatment

Make the conveyor a recurring piece of the factory with recognizable belt
segments, rollers, supports, guards and a continuous return path where visible.
Keep movement mechanically coherent: rollers and belt agree in direction,
carried objects travel with the belt, and objects enter and exit through
believable openings.

Use it at different scales:

- Entrance: a substantial moving belt integrated with the existing factory
  identity and menu composition.
- Presentation pages: a quieter belt along a frame edge or section boundary,
  keeping the factory present while prose and navigation remain stationary.
- Overview exhibits: convey brains, materials and products through an explained
  production relationship, with captions identifying the actual game mechanic.
- Architecture exhibits: carry representations of commands, events or narrative
  jobs between stations. Identify this as an explanatory metaphor, and preserve
  the actual authority and asynchronous boundaries of the system.
- Future gameplay: connect relevant machinery to real simulation state where
  useful, distinguishing ambient motion from progress or production indicators.

A stalled, accelerating or diverted belt should communicate a documented
condition when used as an instrument. Decorative motion must not imply live
simulation activity, loading progress or a generated LLM response.

Reuse Stepanoskin's persistent motion preference and honor OS reduced motion.
Provide a coherent still state; pause animation offscreen and when the page is
hidden. Keep moving layers out of prose, avoid layout movement, and budget them
with the other visible effects. Sound remains separately controlled; conveyor
motion does not introduce automatic machinery audio.

## Design and implementation references

- [Sanctuary design system](../sanctuary/DESIGN_SYSTEM.md): editorial rhythm,
  composed scenes, meaningful interactive exhibits, motion lifecycle and media
  delivery. Loopforge retains its own factory art and materials.
- [Stepanoskin route group](../../apps/lab/app/(stepanoskin)/README.md): current
  landing, routing, localization and shared preferences.
- [Versioned media](../../apps/lab/assets/README.md): curate and optimize existing
  Loopforge art before publishing it in the Lab app.
- Source project: the separate `loopforge` repository, particularly
  `backend/sim_sim`, `frontend/loopforge-webview`, `docs/sim_sim`, and the character
  bible in `docs/sim5/SOPs/CHARACTER_BIBLE_V2.md`.

## Implemented entry points

- Overview: `/stepanoskin/loopforge/overview/the-factory` (8 chapters).
- Engine: `/stepanoskin/loopforge/architecture/the-thesis` (16 chapters).
- Play: `/stepanoskin/loopforge/play` (8-shift teaching prototype).

See [architecture decisions](ARCHITECTURE_DECISIONS.md), the
[BDI and protocol review](BDI_AND_PROTOCOL_REVIEW.md),
[operations and evaluations](OPERATIONS_AND_EVALS.md), and
[visual verification](VISUAL_REVIEW.md). The pure TypeScript kernel is a new
bounded model, not a migration of the original Python simulation. Its BDI advisor
is explicitly narrower than the persistent agent architecture described in the deck.
