# Loopforge within Stepanoskin

Project index · updated 8 October 2026. The presentations, older teaching demo,
first-day prototype and game design board are implemented. The first-day build
is a functional baseline; its entrance and visual treatment have not met owner
acceptance. The [first-shift checklist](FIRST_SHIFT_CHECKLIST.md) records the
current revision; the [original delivery checklist](DELIVERY_CHECKLIST.md)
retains the earlier presentation/teaching-demo history.

## Current interface direction

Build asset-driven adviser selection, structured briefings, assignments,
incident decisions, permanent daily allocation and debrief. With illustrated
room scenes and the simulation, these interfaces must carry a playable core
loop on their own. The old sim-sim UI supplies the starting materials and
patterns: CCTV rooms, metal/glass framing, instrument plates, resource symbols
and physical controls. Native text and interaction remain accessible and
responsive; generic web panels are not the visual target.

Enter factory should open the paused factory console with opening facts, the
weekly quota and unassigned LIMEN/STILETTO. Adviser choice is the first action.
The welcome and separate handover gates in the current build are superseded
design, awaiting implementation of this revision.

A live tick-fed **3D factory comes later**, alongside these interfaces. It adds
continuous cinematic observation of the same world without owning its rules.
The old Sim4/KVP Pixi isometric viewer informs the data and observation patterns;
it is not an already finished 3D implementation. A renderer candidate does not
bind the headless engine or delay the current interface prototype.

Read [experience direction](EXPERIENCE_DIRECTION.md), the generated
[UI design reference](../../apps/lab/public/loopforge-design/UI_DESIGN.md),
[game design source](game-design/README.md) and
[first-shift engine contract](FIRST_SHIFT_ENGINE.md) together.

## Story development

The [story bible](STORY_BIBLE.md) is the living narrative reference, started
6 October 2026. It opens with the global robot world after an undefined event;
Loopforge is a later consequence of that world’s history. Confirmed direction is
separated from proposed founding events, personnel histories and the player loop.
The workplace dystopia and established character art constrain that history;
Loopforge has not been established as a benevolent civic project. The earlier
prehistory galleries remain exploratory art, pending selection and tone review.

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
- The factory entrance lives at `/stepanoskin/loopforge`. The broader
  `/stepanoskin` landing is now a project directory linking the production
  systems profile, Sanctuary Economics, Loopforge and an About placeholder.
  This routing follow-up was requested on 3 October after the first delivery.

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

- Factory entrance: `/stepanoskin/loopforge` (overview, engine and play menu).
- Overview: `/stepanoskin/loopforge/overview/the-factory` (8 chapters).
- Supervisor scene library: `/stepanoskin/loopforge/overview/the-cast`
  ([five supervisors, room and pair tables, 62 original paintings](SUPERVISOR_ATLAS.md)).
- Story workshop: `/stepanoskin/loopforge/overview/before-the-factory`
  ([six prehistory directions, twelve concept paintings](PREHISTORY_GALLERY.md)).
- Engine: `/stepanoskin/loopforge/architecture/the-thesis` (16 chapters).
- Play: `/stepanoskin/loopforge/play` (adviser-first, one-day prototype).
- Previous teaching demo: `/stepanoskin/loopforge/play/teaching` (8 shifts;
  its existing narration service is separate from the first-day slice).
- Game design: `/stepanoskin/loopforge/design` (author reference and sound library).
- Implementation notes: `/stepanoskin/loopforge/engine-notes`.

See [architecture decisions](ARCHITECTURE_DECISIONS.md), the
[BDI and protocol review](BDI_AND_PROTOCOL_REVIEW.md),
[operations and evaluations](OPERATIONS_AND_EVALS.md), and
[visual verification](VISUAL_REVIEW.md). The pure TypeScript kernel is a new
bounded model, not a migration of the original Python simulation. Both teaching
and first-day policies are narrower than the persistent agent architecture
described in the deck. The first-day slice makes no model calls.
