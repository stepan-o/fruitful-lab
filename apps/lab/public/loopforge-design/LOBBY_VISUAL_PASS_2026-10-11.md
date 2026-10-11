# Lobby visual pass — 11 October 2026

Scope: PR #102, the Babylon factory study. Preserve the accepted 72 × 48 m lobby,
15 m structural height and Lobby → Dispatch connection. No payroll/economy changes.

## Checklist

- [x] Inspect the original lobby concept and capture the current implementation.
- [x] Generate a flat paperwork wall, enamel surface and floor insignia from that reference.
- [x] Publish selected assets through the existing immutable image pack pipeline.
- [x] Replace the counter/charging-block placeholder with five worker-scale claim desks.
- [x] Model lamps, CRTs, drawer relief, stools, major pipes and the Dispatch threshold.
- [x] Add two staged seated workers, filing/stamp cues and a removable feeder attachment.
- [x] Keep the animation and attachments in presentation; the kernel remains unchanged.
- [ ] Inspect the actual renderer at hall, desk, orbit and whole-room scales.
- [ ] Check mobile framing, reduced motion, 10/100 workers and room/build transitions.
- [ ] Record performance, limitations and final comparison screenshots.
- [ ] Complete validation and publish the reviewed result to PR #102.

## Implementation choice

This first authored bay uses a reproducible native Babylon geometry recipe, shared
image surfaces and typed socket/placement records. It does not introduce Blender,
GLB or KTX2 delivery yet. That lets this pass assess the art direction in the real
renderer without describing unbuilt import/export infrastructure as complete.

`lobby-scene.ts` owns the visual recipe. `spatial/lobby.ts` contains serializable
desk dimensions, sockets and authored bay placements. It carries no simulation
state. The existing scene material batching leaves form, head, hand and stamp
transforms independent. A selected immutable `loopforge-lobby` release supplies
the three shared textures; scene disposal owns their lifetime.

The `Inspect claim desk` camera and `Study diagnostics → Fit paper feeders` controls
are review tools. Filing, waiting, accepted and returned cues are staged examples,
not assertions about a worker's bank balance or an approved wage claim.

## Evidence

Baseline captured at `/tmp/lobby-before.png`. Final evidence pending browser review.
Full standalone TypeScript checking also reports existing test-type failures in
console, Sanctuary, Pinterest and GrowthBook tests; no lobby source error was reported.
Production build and task tests remain the required delivery checks.
