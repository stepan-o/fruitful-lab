# Factory floor calibration — 9 October 2026

Scope: the complete first-floor layout in `/stepanoskin/loopforge/play/factory-study`. This extends PR #102's procedural study; it does not replace the existing `/play` console or implement later-room production.

## Authority and source reconciliation

`apps/lab/lib/loopforge/spatial/floor.ts` is the versioned, framework-free source for room footprints, portals, admission and direct interaction edges. It uses the old Loopforge repository's `backend/sim4/world/loopforge_layout.py` and the annotated `frontend/loopforge-webview/public/assets/factory_floor_layout_annotated.png` (35 × 25 tiles). The hand-drawn `concept_art/world/loopforge_factory_floor_1_map.png` grounds the support spaces and interior context. Coordinates increase east and south; rectangles exclude their maximum edge. Babylon's coordinate transform exists only at the presentation boundary.

The sources are not identical. The Sim4 room rectangles put Security against Neural Lattice but omit their graph edge. The later sim_sim kernel includes Security–Conveyor and gates hostile-supervisor events on neighbouring assignments, but some other sim_sim edges do not match the physical plan; even its prose spec has a different edge list. We retain the original physical footprints and Sim4 neighbours, add the owner-required Security–Conveyor threshold, and provide six-tile passages through enclosed service infill for legacy separated-room connections. We do not invent a direct Conveyor–Theatre or Conveyor–Brewery doorway across intervening rooms.

Legacy Neural Lattice is the current Synaptic Lattice Forge / Conveyor. The original Brain Forge footprint is reserved for current Cortex Assembly. These aliases do not create extra managed rooms.

## Calibrated floor

The reference plan is uniformly expanded by eight in each direction: **280 × 200 tiles**. One tile is approximately one metre as a design convention. Room proportions and the thirteen portal relationships remain unchanged. Door centres follow the enlarged map; architectural openings remain six metres wide. Equipment is not enlarged to fill the extra space. The Forge grows to 80 × 56 m with 2,068 m² of explicit construction reserve and a separate six-metre delivery aisle.

| Zone | Tile rectangle (x, y, width, height) | First-turn state |
| --- | --- | --- |
| Weaving Gallery | 40, 16, 80, 64 | Sealed |
| Substrate Brewery | 120, 16, 88, 64 | Sealed |
| Burn-in Theatre | 224, 32, 56, 64 | Sealed |
| Lobby | 8, 80, 72, 48 | Support / entry |
| Dispatch | 80, 80, 32, 48 | Support / transit |
| Security | 112, 80, 32, 48 | Unlocked |
| Lattice Forge | 80, 128, 80, 56 | Unlocked |
| Cortex Assembly | 160, 112, 64, 88 | Sealed |
| Shipping | 240, 120, 40, 80 | Support / no active production; unreachable through sealed wings |

Support spaces do not increase the managed-room count. Exactly Security and Conveyor are unlocked in the first-turn snapshot. Later rooms are covered and their shutters closed; the viewer can inspect their location and name without seeing a functioning interior or offering build actions there. There is no timed or debug unlock button in this study.

Direct managed-room edges: Security–Conveyor, Security–Brewery, Security–Cortex, Weaving–Brewery, Brewery–Theatre and Conveyor–Cortex. Lobby–Dispatch–Security is the entry chain; additional original links are Weaving–Lobby, Weaving–Dispatch, Dispatch–Conveyor, Cortex–Shipping and Theatre–Shipping. A path through another room is not a direct contact edge.

## Continuous building envelope — 10 October 2026

The owner accepted the enlarged scale and requested closure of the gaps. All nine room rectangles, equipment positions, reserves and thirteen door relationships stay fixed. `spatial/envelope.ts` defines one orthogonal outer boundary around them. Five large foundation slabs and derived utility blocks close the interior space; this is not a larger platform with floating buildings above it. The legacy six-metre passages run between enclosed service blocks.

![Top-down factory plan](maps/factory-floor-plan.svg)

[Open the vector plan](maps/factory-floor-plan.svg). The same exported plate appears near the top of the design deck's **Conveyor mini-game** tab; the in-game Floor plan dialog also shows this envelope and construction reserves.

- Plan extent remains 280 × 200 m; the stepped enclosed footprint is **40,384 m²**.
- Original room floor totals **34,176 m²**; **6,208 m²** of service infill closes the remaining interior. Exterior steps in the silhouette are intentional, not internal holes.
- Service blocks are utility/structural context. They are not new managed rooms, purchasable ground or walkable shortcuts. Portal admission and direct supervisor-contact edges remain authoritative.
- The map shows original room names/IDs, dimensions, first-turn status, all thirteen portals, prototype machinery, reserves, north and a metre scale. The 3D room covers continue to hide locked interiors during ordinary play.
- `npm run floor-plan:build` exports the SVG directly from the TypeScript layout, equipment and capacity records. `npm run floor-plan:check` prevents stale exports in the production build. The docs retain an editable vector output and the website uses a content-hashed file; previous releases remain valid.
- The scene uses a small coalesced rectangle set and material batching, not per-tile infill geometry. Building continuity is tested independently from room admission and routing.

### Delivery checks

- [x] Preserve approved scale, room geometry, machine placements and construction reserves.
- [x] Define one continuous, hole-free envelope; replace separated bridges with enclosed passage structure.
- [x] Export a measured 2D plan and embed it in the design deck and this document.
- [x] Complete topology/access regression, production build and desktop/phone review.
- Hosted revision and final validation are recorded on PR #102.

### Continuity revision validation

`API_BASE_URL=http://localhost:8000 npm run ci` completed successfully: asset-tool test, **77 suites / 407 tests / one snapshot**, 46 retained asset releases, map freshness, TypeScript and the optimized production build. Focused lint and whitespace validation pass. Thirteen focused spatial/commissioning tests include a flood-fill check for one connected footprint with no enclosed voids, exact non-overlapping room/infill coverage, clear portal passages and unchanged admission.

Visual review: 1280 × 720 building Overview and source SVG; 390 × 844 design-deck map and full-size link; 320 × 720 floor-plan dialog, room selection and Escape/focus restoration. The 320 px document remains 320 px wide. The Overview camera now fits all building corners and roof heights above the control dock. The static SVG is 15.5 KB, lazy-loaded in the deck; it adds no animation or runtime library. Browser emulation is not a native-device performance certification. Final hosted verification is tracked against the published commit on PR #102.

## Simulation and presentation

- `loopforge-floor-1/4` owns geometry, portal spans and stable room IDs; `loopforge-commissioning/4` carries its version and the two unlocked room IDs.
- Four-neighbour tile pathfinding respects boundaries, actual portal widths, locks and reserved machinery footprints. Workers store integer sub-tile positions and their current room; the renderer interpolates them. No renderer-defined orbit supplies worker location.
- The commissioning crew follows a deterministic, precomputed route through Security's actual threshold and around the line. The gate stops each worker at the crossing. This is a route fixture, not a complete task scheduler, collision-avoidance crowd or dynamic construction pathfinder.
- Installation admission checks the owning room in the kernel. Camera orbit/pan/zoom and room focus remain the same in construction and production. Build mode is still restricted to night.
- `interactionEdge` returns a stable direct portal identity for eligible unlocked managed-room neighbours. Future BDI actions must also check simultaneous shifts, character state, motives and event-specific conditions. This change does not manufacture supervisor fights or integrate those events into the existing console kernel.
- The floor-plan dialog and procedural architecture consume the same floor definition. The dialog supports keyboard selection, phone layout and native Escape/focus restoration. In the normal opening, four later wings remain covered. An explicit Equipment study mode removes their covers and shows proposed machinery for scale review. It does not change the host snapshot, unlocks, ownership or production.
- Lobby and Dispatch receive basic procedural reception, charging benches and paperwork infrastructure; Shipping has inactive pallets. They are spatial context, not newly implemented mini-games.

## Delivery checklist

- [x] Inspect original annotated map and physical layout; reconcile contradictory adjacency sources.
- [x] Define all nine footprints, thirteen portals and first-turn room admission.
- [x] Render the complete floor and covered later wings from that definition.
- [x] Relocate Security and Conveyor equipment and route individual workers through valid tiles.
- [x] Add the floor-plan selector and room focus to the existing persistent scene.
- [x] Complete responsive visual and interaction verification.
- [x] Run app tests, asset validation, focused lint and production build; document validation limits.
- Publication and hosted-preview evidence are recorded against the current revision in [PR #102](https://github.com/stepan-o/fruitful-lab/pull/102).

The whole-floor layout is implemented; final procedural art calibration, later-room operation, free machinery placement, room unlock economics and supervisor collision stories remain subsequent work. This document does not claim owner acceptance of the visual study.

## Previous 35 × 25 revision validation

These results describe the preceding revision, not the expanded scene. Current results belong in [Factory scale and equipment](FACTORY_SCALE_AND_EQUIPMENT.md).

- Ten focused topology/kernel tests pass. The full app run passes 77 suites / 404 tests and the stored snapshot; asset checks verify 46 retained releases. Focused lint and the final production build pass. On this memory-constrained host the successful build used a 1280 MB Node heap with the development server stopped; the earlier unbounded combined run was interrupted during typechecking.
- Browser inspection covers 1280 × 720, 1440 × 900, 768 × 1024, 390 × 844 and 320 × 720. Phone and tablet document widths match their viewports. The narrow build panel was compacted after visual review so placement leaves a usable view of the socket.
- Exercised all three placements, stable-angle room focus, sealed-wing inspection, the floor-plan dialog, Escape dismissal/focus restoration, first shift, obstruction, and automatic return to Day 2 with equipment retained and only two managed rooms unlocked. The 100-worker reset retains the same first-turn locks.
- Representative development sample on Intel HD Graphics 620: 29 FPS during the obstructed 10-worker shift at an adaptive 832 × 468 internal resolution; 55 FPS during the quiet night at 253 × 548. These are bounded observations, not a sustained performance gate or mobile-device certification.
- No browser console errors observed in these checks. Final production/hosted results are tracked in PR #102.
