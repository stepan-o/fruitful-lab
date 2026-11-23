# Arcade illustration craft pass — 4 October 2026

Scope: the opening venue and the later “What a coin adds” cabinet in `insert-coin`.
Chapter three reuses the venue. The manuscript, authentic archival images and the
online-courtyard alternative are unchanged. This is a reviewable iteration, not
an assertion that the owner has approved the new artwork.

## Composition correction

The owner rejected the initial ornamental room: architecture borrowed from the
fantasy diptych, inconsistent body proportions, a cabinet in open floor space and
players facing each other. Decorative detail did not resolve the composition.
The replacement starts with an actual photograph and a coherent floor plan.

Primary photographic reference: **Barcade, Brooklyn**, photograph 10 in the
[venue’s own gallery](https://barcade.com/location/brooklyn/photos), described by
that page as “Young people playing classic arcade games in dark bar setting.”
[Direct source image](https://cms.barcadeapp.com/uploads/40417976012_f6ab9b94cf_o_copy_2_scaled_e1686076236328_85912bb44d.jpg).
Photograph 8 in the same gallery supplies a complementary view of warm hanging
lamps, bottle shelves and people at the counter. Consulted 4 October 2026.
No photographer was identified in the gallery’s image metadata inspected here.

What carries over: upright cabinets along one wall, a long timber bar opposite,
an open central aisle, brick, exposed joists, receding pendant lights, screen glow,
and the forward lean of someone using a cabinet. What is authored: all vector
geometry, fictional cabinet designs and screens, stylized people, palette, framing
and motion. Source pixels and venue branding are not included in the runtime.
The photographic reference is retained here for internal design provenance. At the owner’s request, the public caption and visual notebook do not name or link the venue. This is an original imagined scene;
it does not reconstruct Andy Capp’s Tavern or claim to document the 1972 Pong test.

The approved journey/world diptych still supplies engraved surfaces, teal shadow
and warm focal light. The Mechanical Turk/conveyor supplies the expectation of
plausible construction and contacts. Neither supplies this bar’s architecture.

## Element ledger

| Element | Focused pass | Owner |
| --- | --- | --- |
| Room | Ordinary brick, dado boards, exposed joists and a glazed rear door; clear aisle and one shared perspective | `VenueArchitecture.tsx`, `venue-perspective.ts` |
| Wall cabinets | Backs against the left wall, control decks facing the aisle, manufactured laminate, screen glass, rotary/joystick controls and coin entries | `VenueCabinets.tsx` |
| Counter | Continuous timber bar, edge thickness, boards, supported foot rail; foreground end continues out of frame | `VenueFurnishings.tsx` |
| Shelves and lamps | Bottle necks, varied heights, chalk strokes, tap rail and simple pendant shades; all recede with depth | `VenueFurnishings.tsx` |
| People | Simplified silhouettes, consistent human proportions, floor-derived scale, supported seated poses, players leaning toward screens | `VenuePatrons.tsx` |
| Foreground | Cropped timber table establishes camera position; legs drawn behind its surface | `VenueFurnishings.tsx` |
| Light | Local warm brick/shade illumination and cool screen light; ten quiet motes; static people and furniture | `EveningVenue.tsx`, `arcade-craft.module.css` |
| Standalone cabinet | Engraved shell, CRT, four stations, coin/service door, hinges, explanatory circuit board and allowance display | `ArcadeCabinet.tsx` |
| Operator instrument | Native allowance selector and the same three documented settings | `ArcadeExchange.tsx`, `arcade-exchange.module.css` |

`venue-perspective.ts` maps metre-scale coordinates into deterministic SVG points.
Architecture, cabinets and counter share that projection; figures use the same
floor projection and depth scale. This is build/render-time geometry, not a 3D
renderer or an animation loop. The later cutaway retains its own frontal view so
its explanatory controls remain legible. Its circuit and health display are not
claimed to reconstruct Atari wiring or its actual service display.

## Runtime contract

- Original inline SVG; no additional image/font/audio requests or dependencies.
- Memoized scene, deterministic geometry, batched repeated strokes.
- Three small screen opacity layers, six pendant-light layers, ten motes: 19
  independently timed CSS opacity/transform elements. No animated blur, timers,
  canvas, animation-frame loop or per-frame React state.
- Existing `useLivingPlate` gates offscreen, hidden-tab, manual and OS motion
  preferences. Still mode retains the complete scene.
- Existing immutable media delivery and archival notices remain unchanged.

## Validation

The assembled review corrected cabinet depth, counter cropping and foreground
occlusion. The actual reader was reviewed at 1280, 768, 390 and 320 CSS pixels;
the complete opening remains ahead of prose and no page overflow was present.
The 19 animation layers run in view and pause offscreen; the manual motion switch
also disables them. Existing lifecycle tests cover hidden tabs and OS preferences.

Scoped lint, the asset checks and the production build passed. The full test run passed 197/198: the
existing reading-order assertion still expected the old image description. After
updating that locator, all ten tests in the affected file passed (no product
behavior changed to satisfy the test). All 45 suites pass across the run/retry.

Source photographs are visual research, not additional public media assets.
Field Core Web Vitals remain unmeasured.

## Arcade motion follow-through — 2026-10-04

The accepted bar composition remains. The focused CRT pass replaces light-only
pulsing with projected paddle/ball and maze loops. The standalone cabinet now
has a clipped four-player dungeon attract sequence, with static hardware and
user-controlled health settings. Per-element reasoning, source links and runtime
constraints are recorded in [VISUAL_ATLAS.md](VISUAL_ATLAS.md) and the public
chapter notebook. The old 19-layer room count above describes the previous
revision; the new room has 23 CSS animation layers (16 atmosphere + 7 gameplay).


## People and room activity — 4 October 2026

- Heads use a shared engraved profile construction: a rounded cranium, restrained
  nose/chin, ear, hair plane and supported neck. Facing direction follows the
  action; seated guests turn toward the bar and players toward the CRTs.
- Two partners share the nearest paddle cabinet. Each hand endpoint is calculated
  from one of its actual world-space rotary-control positions (depths 1.39 and
  2.03). Bodies render far to near; both keep planted feet and forward attention.
- Rain occupies two batched stroke paths behind the rear door’s glazing. Their
  geometry tiles along the motion vector to avoid a jump at the loop boundary.
  A single low-intensity distant illumination every 19 seconds is clipped to
  the glass; the room and reading surface never flash.
- The bartender supports a glass with one hand while the other forearm and cloth
  rotate a few degrees around a stationary elbow. The glass, shoulder, torso and
  counter stay fixed; there is no whole-person floating or detached cloth.
- Four additional CSS layers bring the room to 27. All use the existing visible,
  document-active, manual-motion and reduced-motion gates. No new image requests,
  libraries, timers or frame-driven React work.
- Public venue attribution is removed from both uses of the scene and the visual
  atlas. This file retains the photographic research trail. Notices on actual
  archival photographs and other source imagery are unchanged.
