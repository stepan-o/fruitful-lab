# Security and Conveyor floors

19 November 2026 · ART DIRECTOR to ENGINE MASTER · raking-floor/1
Baseline 73658a934ccf9fab0bfe72657a266ad70d5bb299 · approved-factory/day-one-3 · B / Raking light

## Draw two layers

| Camera | Asset | NW origin (x, y m) | Ground width × height | Source |
|---|---|---:|---:|---:|
| Security | `security-material.webp` · repeat X/Y | (104.75, 95.5) | 4 × 4 m | 256 × 256 RGB |
| Security | `security-room.webp` · draw once | (113, 108) | 32 × 30.25 m | 1024 × 968 RGBA |
| Conveyor | `conveyor-material.webp` · repeat X/Y | (74.75, 138.25) | 4 × 4 m | 256 × 256 RGB |
| Conveyor | `conveyor-room.webp` · draw once | (108, 138.25) | 38 × 23 m | 1216 × 736 RGBA |

Use [manifest.json](manifest.json) and its file hashes. Metres increase east and south. The material is 64 px/m. The room layer is 32 px/m and includes its site-specific hardware, abrasion, reflected light and shaft. Both assets are unprojected plan views. The room origin is the upper-left texel boundary. All four outer edges of the room export are transparent.

In `lib/loopforge/shifts/painter.ts`, replace the backdrop pass. For each visible 4 m cell, project its NW and SE boundaries with the existing `floorView(w,h,room).xy`. Round the two endpoints separately and draw the image between them. Adjacent cells share a rounded edge. This keeps the tile phase in factory coordinates when the camera changes. Cover the current camera background just as the existing painter does.

Project the room rectangle by the same method. Draw it once, clipped to the view, with smoothing off, `globalCompositeOperation = "source-over"` and `globalAlpha = 1`. The 0.67 ground foreshortening is already in `xy`. Keep all rails, desk/gate depths, contact shadows, actors, credentials, control indicators, workpieces, labels and UI above the backdrop. Cache the composite per art version, room, camera transform and canvas size. Load the files once per session. The layers need only a redraw when that key changes.

## Migrate the consumers independently

Days 2–4 currently loads both old swatches from `/loopforge-intro/` in `loadArt()`. Point only its floor entries at the four new `/loopforge-design/floor-correction/v1/` URLs. Include them in the shifts portable packer (`apps/lab/scripts/shifts/portable.py` currently embeds the intro bank). Rebuild the shipped shifts viewer. Restore both checkpoints after a resize and a room switch. An issued pass and a moving workpiece should keep their original depth and contrast.

Day One also loads `tile-security.webp` and `tile-forge.webp`. Its 2D path in `components/loopforge/intro/paint.ts` world-anchors those tiles and switches them using bob's room and the camera. Its isometric view uses zone polygons. Leave Day One on the **dated 18 November calibration** for this binding. A later Day One migration should opt into both new layers together, project them with its own moving camera and clip by the approved room polygons. Recheck the fourth credential inspection and the press sequence before adopting that migration. Preserve the old URLs and the calibration archive used by `scripts/intro-art.py`.

[Original Security sample](https://www.fruitfulab.net/loopforge-intro/tile-security.webp) · [Original Forge sample](https://www.fruitfulab.net/loopforge-intro/tile-forge.webp) · [Frozen B archive](https://github.com/stepan-o/fruitful-lab/blob/73658a934ccf9fab0bfe72657a266ad70d5bb299/docs/loopforge/production/day-one-sprite-calibration/01-style-B.zip)

## What the evidence covers

The [review](index.html) shows paused Day 2 frames. Missing ID uses the held queue at tick 5671. Conveyor chat uses tick 6142 with sam at Intake, bob at Wash, jo at Belt and max at Forge. The light at the press crosses the operator aisle to the left. The teal light crosses the queue toward the first desk. The localized marks and practicals have a single factory position. Fasteners and staggered stamped panels still recur.

The four full-viewport references are actual production screenshots taken after checkpoint restore. The matched before/after camera plates are offline compositions using the pinned painter, sprites, approved coordinates and the same verified public snapshot in each pair. The cue and desk button are drawn for the proofs. Desktop is a 1280 × 860 CSS viewport with an 872 × 370 camera. Phone is a 320 × 740 CSS viewport with a 289 × 266 camera. The browser capture service resampled the full-viewport JPEGs. Font rasterization can differ between captures and compositions. The 4 × 3 material contact sheets use the desktop camera's projected tile size.

The supplemental issued-pass camera comes from the accepted public snapshot for Missing ID. The workpiece sits at Wash in Conveyor chat. At 320 px the speech plate overlaps part of the beam, and crew identity still depends on the labels. The floor pass does not address the cast or machinery. ENGINE owns live playback and the final resize, mobile and 1× motion check. The owner makes the final visual decision in that integrated player.
