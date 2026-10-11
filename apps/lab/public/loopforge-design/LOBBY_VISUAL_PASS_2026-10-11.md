# Lobby visual pass — 11 October 2026

Scope: follow-up to merged PR #102. Preserve the accepted 72 × 48 m lobby,
15 m structural height and Lobby → Dispatch connection. No payroll/economy changes.
Public viewer: `/stepanoskin/loopforge/play/factory-floor`. The old address is removed without a redirect.

## Checklist

- [x] Inspect the original lobby concept and capture the current implementation.
- [x] Generate a flat paperwork wall, enamel, worn stone and floor insignia from that reference.
- [x] Publish selected assets through the existing immutable image pack pipeline.
- [x] Replace the counter/charging-block placeholder with five worker-scale claim desks.
- [x] Model lamps, CRTs, drawer relief, stools, major pipes and the Dispatch threshold.
- [x] Add two staged seated workers, filing/stamp cues and a removable feeder attachment.
- [x] Keep animation and attachments in presentation; the kernel remains unchanged.
- [x] Inspect the renderer at hall, desk, orbit and whole-room scales.
- [x] Check compact framing, reduced motion, 10/100 workers and room/build transitions.
- [x] Record performance, limitations and final comparison screenshots.
- [x] Production build, asset validation and route response checks pass.
- [x] Post-merge regression suite: 85 suites, 436 tests, one snapshot passed.
- [x] Changed-source ESLint and asset-tool tests passed.
- [x] Review evidence and docs prepared on `codex/loopforge-lobby-visual-pass`.

## Implementation choice

This first authored bay uses a reproducible native Babylon geometry recipe, shared
image surfaces and typed socket/placement records. It does not introduce Blender,
GLB or KTX2 delivery yet. The current supported image pipeline can therefore deliver
and version the kit without pretending that model import/export tools are complete.

`lobby-scene.ts` owns the visual recipe. `spatial/lobby.ts` contains serializable
desk dimensions, sockets and authored bay placements. It carries no simulation
state. Material batching leaves form, head, hand and stamp transforms independent.
A selected immutable `loopforge-lobby` release supplies four shared textures;
scene disposal owns their lifetime. Its largest selected variants total 1,966,200
transfer bytes; that is not their expanded GPU-memory footprint.

The `Inspect claim desk` camera and `Study diagnostics → Fit paper feeders` controls
are review tools. Filing, waiting, accepted and returned cues are staged examples,
not assertions about a worker's balance or an approved wage claim.

## Visual evidence

Screenshots are repository review evidence, excluded from the public runtime media
library. See `docs/loopforge/evidence/lobby-2026-10-11/`:

- `before.png`: original counter/charging-block lobby.
- `hall-final.png`: paperwork wall, floor emblem, five desk bays and open Dispatch threshold.
- `desk-final.png`: worker-scale desk, paperwork, rectangular CRT and localized lamp.
- `orbit-final.png`: alternate camera angle and fitted paper feeder.
- `phone-final.png`: 390 × 844 CSS-pixel desk view.

The reference remains the original `01_loopforge_factory_rooms_lobby.png` in the
old Loopforge repository. Geometry carries desk depth, pipes and doorway silhouettes;
authored surfaces carry distressed olive/enamel/brass detail. The stone was regenerated
after the first runtime review exposed the old plain square grid. The source record
and exact stone-floor generation prompt live under
`apps/lab/assets/sources/loopforge-lobby/` (`provenance.json`, `stone-floor-prompt.txt`).

## Interaction checks

The production build was inspected through the actual in-app browser:

- Lobby, desk, orbit, whole-room, overview and room-focus cameras.
- Fit/remove feeders, motion on/off and camera redraw with motion disabled.
- 320/390/768 CSS-pixel layouts; tablet navigation now wraps and camera framing uses
  measured top/bottom controls instead of a guessed mobile inset.
- Floor-plan dialog and Escape/focus return.
- 100-worker fixture; clearance terminal, gate and conveyor-drive construction.
- Night → morning → running shift → next night.
- Production movement, deliberate line obstruction and release.
- No browser error/warning entries at the end of the check.
- New public route: HTTP 200. Removed study address: HTTP 404, no redirect.

## Local performance observations

Device: Intel HD Graphics 620, Linux/Mesa, Codex in-app browser. Samples read from
the on-screen diagnostic panel. These are local observations, not a controlled
benchmark or field-performance certification.

| Scene | Workers | Internal render size | FPS sample | Pose / render submission |
| --- | ---: | --- | ---: | --- |
| Desk detail, idle animation | 10 | 1280 × 720 | 30 | 2 / 7 ms |
| Desk detail, compact viewport | 10 | 390 × 844 | 30 | 1 / 3 ms |
| Conveyor during shift | 100 | 1280 × 720 | 30 | 3 / 20 ms |
| Lobby after shift | 100 | 1280 × 720 | 30 | 2 / 12 ms |

The render-submission timing is CPU-side, not a GPU timestamp. An earlier revision
of this pass sampled 23 fps at a reduced 832 × 468 internal size. Moving resource
readiness checks out of steady-state frames and correcting idle cadence removed
that observed regression. Do not interpret the before/after as isolated causal
measurement of one optimization.

Idle animation targets 30 Hz; camera gestures and production remain uncapped.
Motion-disabled stopped scenes draw on changes; hidden tabs suspend rendering.
Scoped desk lights avoid lighting the full factory. None of these alter the
integer 20 Hz commissioning kernel or its event order.

## Development-host stability

The host kernel recorded an out-of-memory kill of the Codex/ChatGPT process during
this work. The machine has about 12 GB RAM and its swap was full. That establishes
memory pressure, not a proven application leak. Task previews are now stopped before
compiling; other workstreams and user applications are preserved.

`floor:build` limits Node heap to 1,536 MiB, uses one Next build worker and a 768 MiB
Turbopack cache target. `floor:preview` runs the built app with a 512 MiB Node heap.
These are opt-in local aids; they do not cap every native allocation or change
Vercel defaults. The final production compilation took 30.6 seconds, followed by
successful TypeScript and static generation.

## Remaining boundaries

This is a visual kit ready for owner review, not final acceptance of the art direction.
Workers do not yet queue, claim wages or spend money. Clerks demonstrate animation
and attachment affordances. Baked lightmaps, imported models, GPU-compressed textures,
measured GPU frame-time tails and physical-phone testing remain future work. The
larger hall deliberately preserves the accepted buildable scale rather than filling
it with decorative desks. Other rooms retain their previous calibration geometry.
