# Arcade illustration craft pass — 4 October 2026

Scope: the opening imagined venue and the later “What a coin adds” cabinet in
`insert-coin`. The room view in chapter three shares the revised venue. The
online-courtyard alternative, the manuscript and the historical sources are not
rewritten in this pass. This is a reviewable implementation, not an assertion
that every illustration in the deck has reached the benchmark.

## Reference and common language

The approved “A journey completed / A world renewed” pair supplies Sanctuary’s
layered silhouettes, dark teal depth, small warm focal lights and engraved
architecture. The current Mechanical Turk/conveyor in the professional Data
Science presentation supplies a second craft reference: parts have thickness,
visible supports, plausible connections, directional grain and distinct materials.
That active worktree was studied read-only; none of its code or pending edits
were copied or changed.

Subjects can change their silhouette, local palette and period vocabulary. The
continuous identity comes from composition, material hierarchy, contour detail,
lighting and restrained life. An electronic arcade cabinet gets glass, laminate,
controls and electronics; it does not acquire decorative clockwork merely because
the Mechanical Turk has gears. The venue remains an original imagined setting,
not a reconstruction of Andy Capp’s Tavern or a dated documentary image.

## Element ledger

One focused styling pass per element, followed by a scene-level check of scale,
occlusion and contact points. The assembled review corrected patron proportions
and aligned players’ hands with the control deck.

| Element | Pass | Code owner |
| --- | --- | --- |
| Room shell | Single-point floor, recessed arched bays, fitted piers, cornice and dentils, inlaid perimeter | `VenueArchitecture.tsx` |
| Timber and metal | Grain follows the material; slotted screws and inset panels have a lit edge and a recessed face | `ArcadeMaterials.tsx` |
| Shelves and glass | Shelves have thickness and brackets; bottles have shoulders, necks, labels and highlights | `VenueFurnishings.tsx` |
| Furniture | Stools have seats, legs and foot rails; the table is carried by a turned pedestal; glasses meet surfaces or hands | `VenueFurnishings.tsx` |
| Framed landscape | Original woodblock mountain/gate miniature recalls the approved diptych without replacing it | `VenueFurnishings.tsx` |
| Patrons | Seated conversation, standing company and players; tailored clothing, varied hair/headwear, profiles, hands and shoes | `VenuePatrons.tsx` |
| Lamps | Chain, cap, cage, translucent panes and grounded pools of light | `VenueFurnishings.tsx` |
| Cabinet shell | Front/side depth, edge trim, grille, ventilation, feet and original engraved side ornament | `ArcadeCabinet.tsx` |
| CRT | Curved glass, reflected edge, pixel dungeon, tiled masonry, four figures and restrained phosphor light | `ArcadeCabinet.tsx` / `Dungeon` |
| Control deck | Four numbered recessed stations, shafts, ball tops, collars and buttons | `ArcadeCabinet.tsx` / `Control` |
| Coin/service door | Coin entries and returns in the closed view; hinge-mounted open door, wiring, circuit board and setting display in the cutaway | `ArcadeCabinet.tsx` / `CoinDoor` |
| Instrument surround | Inset brass-edged panel, engraved scale and native selector; the same three documented allowances | `arcade-exchange.module.css` |
| Atmosphere | Two independent lamps, 16 slow motes, two small rising wisps and restrained screen light | `EveningVenue.tsx`, `arcade-craft.module.css` |

The health display is an explanatory rendering. The original cutaway is not a
claim to reproduce Atari’s wiring, circuit layout or actual service display.
The adjacent historical manual remains the evidence for the settings.

## Runtime contract

- Local deterministic SVG; no new image, font, sound or dependency request.
- Static geometry is memoized at scene level. Repeated grain, tile and hatch
  strokes are batched into paths or patterns, rather than individual elements.
- New idle motion changes only opacity/transform. No new canvas, animation-frame
  loop, timers, animated blur or per-frame React state.
- `useLivingPlate` independently gates the venue and cabinet against intersection,
  document visibility, the persistent motion preference and OS reduced motion.
- Geometry remains complete in still mode. The cabinet setting is a native
  selector, and its selected amount remains in the accessible readout.
- Historical image delivery, immutable packs and source notices are unchanged.

## Review evidence

Desktop captures and phone captures are saved in the task’s
`outputs/sanctuary-arcade-craft/` directory. Review is on the actual chapter route,
not an isolated gallery. Time-separated room frames were compared; the small
light/air layers move while architecture, people and reading layout remain fixed.
The room pauses offscreen while the in-view cabinet runs; the manual pause stops
all 24 new room animations. Existing lifecycle tests cover document visibility,
OS reduced motion and preference updates.

The scope does not establish field Core Web Vitals or a frame-time guarantee.

Validation: scoped ESLint and the production build passed. The full suite passed
197 of 198 tests; one unrelated Pinterest form test hit its five-second timeout
under parallel load. Its complete nine-test file passed when rerun alone, without
changing that test or product code. All 45 suites therefore passed across the
full run and isolated retry. The deterministic asset-release check also passed.

The chapter was reviewed at desktop and 320, 390 and 768 CSS pixels: no page
horizontal overflow, the opening drawing appears before prose in the first
viewport, the cabinet stacks above its controls, and the selector stays 48px high.
The 100, 600 and 2,000 states retain the matching visual display and accessible
readout. First and repeat production HTTP requests returned 200 and the same
35,618-byte gzip HTML response (153,518 bytes decoded), including the artwork.
That is the document alone, excluding JavaScript/CSS and later images; it is not
a full-page transfer total, cold-cache timing or field performance measurement.
