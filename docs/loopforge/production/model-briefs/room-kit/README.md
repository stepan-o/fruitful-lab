# Room kit · first production pass

22 October 2026. Candidate assets in the opening rehearsal. This is not acceptance of the complete rooms.

The Conveyor is a sequence of physical operations: intake, literal washing, controlled travel and compression to a supervisor-head-sized output. Station facts belong to the encounter kernel. The renderer reads those facts; a texture scroll, reduced-effects setting, camera change or screenshot cannot produce a brain.

## Numbered rebuild briefs

- [Brain shape](brain/01-shape.txt), [material states](brain/02-material-states.txt), [process and delivery](brain/03-process-and-delivery.txt).
- [Brain Wash shape](brain-wash/01-shape.txt), [mechanisms and contacts](brain-wash/02-mechanisms-and-contacts.txt), [delivery](brain-wash/03-delivery.txt).
- [Carrier shape](carrier/01-shape.txt), [carrier contacts](carrier/02-contacts-and-delivery.txt).
- [Lattice Forge frame](lattice-forge/01-frame.txt), [pressure and delivery](lattice-forge/02-pressure-and-delivery.txt).
- [Belt and effects](conveyor/01-belt-and-effects.txt). These exact repeated parts are authored in the engine; generation is reserved for housings and distinctive cast shapes.

The current brain uses one 4,185-triangle mesh with 512px maps. The two 512px material variants preserve source positions, UVs and triangle indices. Dirty deposits fade into the washed surface during rinsing; the press produces a smaller matte grey-ochre workpiece. The source model is 9.05 MB; the delivered mesh and base maps are 253 KB, plus 94 KB for both material variants.

The wash housing is 10,997 triangles with 1K maps, 1.16 MB delivered from a 13.12 MB source. Housings are fitted to station envelopes and do not own collisions or progress. The wash housing, nozzle alignment, carrier clearance and character contacts need visual review together. A generated housing is not assumed to have usable pivots or openings.

Reference images and source deliveries are retained locally beside their numbered briefs; the deck publishes the text and measured delivery records. `delivery-v1.json` and `material-delivery-v1.json` record hashes and measurements. `prepare-room-asset.mjs` and `prepare-brain-states.mjs` reproduce delivery from the retained source GLBs. Signed download links and raw service responses are excluded from publication.

## Lobby, Security and Conveyor deliveries

| Asset | Triangles | Maps | Download |
|---|---:|---:|---:|
| [entrance](entrance/delivery-v1.json) | 10,128 | 1024 px | 1.25 MB |
| [portal](portal/delivery-v1.json) | 9,694 | 1024 px | 1.12 MB |
| [desk](desk/delivery-v1.json) | 7,485 | 1024 px | 0.97 MB |
| [intake](intake/delivery-v1.json) | 12,041 | 1024 px | 1.14 MB |
| [crate](crate/delivery-v1.json) | 1,979 | 512 px | 0.17 MB |
| [lattice-forge](lattice-forge/delivery-v1.json) | 16,092 | 1024 px | 1.44 MB |
| [carrier](carrier/delivery-v1.json) | 2,030 | 512 px | 0.32 MB |

The five new architecture and handling props add 4.64 MB. Two Security desks share geometry and materials. Their numbered shape, contact and delivery briefs are saved beside each record. Source references and exact generation inputs remain available for rebuilding.

The doorway apertures were measured before fitting. Security retains its four-metre clear passage; workers converge slightly through the main doorway, then spread into the waiting crowd. The Forge frame is fitted around the independent carrier, ram and platen. These numerical checks still require visual confirmation from the scene cameras.

## Lighting and performance

The first full room-pilot run failed the sustained frame/stall gates despite 46.3 FPS average. Optional spill and shadow lighting are compared separately; glow remains the default. See [measured evidence and comparison protocol](../../GRAPHICS_AND_PERFORMANCE.md#opening-room-pilot-and-lighting-experiment--21-october-2026).

## Budget

Owner-authorized cumulative cap: **1,000 Meshy credits**. Recorded spend: **710**, with **290 remaining** and no pending paid jobs. The initial cast used 400; wash, brain and two material states used 80; LIMEN's successful rebuild and rig used 35; Forge and carrier used 60; entrance, desk, portal, intake and crate used 135. Reference images were generated with the built-in image tool. The unused paid Meshy image stage was omitted. Geometry delivery does not establish scene acceptance.

[Open the rehearsal](/stepanoskin/loopforge/play/scene-studies). [Conveyor kit](../../CONVEYOR_ASSET_BUILD_PLAN.md). [Lobby and Security kit](../../SECURITY_LOBBY_ASSET_BUILD_PLAN.md).
