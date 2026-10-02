# Sanctuary: a cabinet of working ideas

This pass takes its personal style reference from the owner's Loopforge. It
keeps Sanctuary's black, brass, ember and muted teal palette. The original
illustrations refer to recognizable mechanics and compositions; they do not
trace screenshots, reproduce publisher characters, or reconstruct a game's UI.

## What was studied

The Loopforge references were read and inspected in the local repository:

- `docs/sim_sim/sim_sim_ui_spec_v1.md`: diegetic consoles, a purposeful primary
  action, distinct modules rather than a uniform card kit, restrained feedback.
- `docs/sim_sim/sim_sim_ui_style_sheet_v1.png` and
  `frontend/loopforge-webview/src/viewers/sim_sim/ui/{skin,bezelPanel}.ts`:
  cut metal, bevels, fasteners, glass, low-contrast wear, semantic signal colors.
- The Cognition Brewery and Resonance Cathedral room concepts: lived-in
  alchemical machinery, readable focal light, diagrams inside the world, and
  small touches of mechanical mischief.
- `docs/legacy/visual/STAGE_VISION.md` and the Helios initial specification:
  make a system understandable as an experience; let motion carry meaning.
- The Chaos Goblin passages in the legacy architecture notes and system prompt:
  controlled strangeness, discovery and personality without sacrificing clarity.

These are style references, not imported assets or operating instructions.
No Loopforge room-art binaries were added to the public asset library.

## Plate and exhibit pairs

| Chapter | Original plate | Exhibit and primary action |
| --- | --- | --- |
| The fork | Four contracts at the devil's counter | Switch the transaction and follow what changes hands |
| Six games | A six-window cabinet of journey emblems | Compare design, commerce and completion across the same six games |
| The reset | A Seasonal-to-Eternal transfer engine | End the season; distinguish character transfer from a fresh start |
| Several histories | A crooked arcade of coexisting machines | Highlight a mechanism across selected historical anchors |
| Concord | Opposing spawn bays around an empty arena | Documented launch/closure timeline beside unquantified queue constraints |
| What decides | A handmade receiver and miniature orbital system | Choose an uncertainty; see the probe, observation and decision change |
| Shape of money | Shop, furnace and inhabited world | Trace the service's continuing obligations |
| Why people play | Three intentions around one campfire | View the same return event through three motivation lenses |
| Play beyond score | Fractured chapel and conspicuous counter | Compare visible measurement with interpretation |
| Anatomy of a loop | A dungeon nested inside larger rhythms | Inspect a timescale and its rule/behavior/experience chain |
| Loot table | A slotted inventory and sought-after relic | Change fixed odds and attempts; read the cumulative curve |
| Checklist | Reward machinery driven by a great clock | Take a week off; compare expiration with continuing availability |
| Familiar verbs | Two tactical floors with the same attack | Change a constraint and see movement/attack paths change |
| Access | A paid door with work still behind it | Satisfy ownership and readiness in either order |
| Identity | Three invented ceremonial armors | Change appearance and motive while the mechanical baseline stays fixed |
| Time | A forge route and an exchange bridge | Compare craft, purchase and trade with their remaining conditions |
| Power | Monster and market offering one imagined sword | Trace which activity the acquisition route rewards |
| What things cost | A currency transmutation engine | Compare cash, pack, item and balance on consistent token scales |
| Two-key lock | Catalog key plus refillable Favor reservoir | Unlock, earn, claim and refill; distinguish held from lifetime totals |
| Abstraction | Reward altar with separated condition plates | Gather the same terms into one complete decision |
| Does it work | An instrument cabinet beside a returning traveler | Compare what four evidence types can and cannot establish |

`lib/sanctuary/art-direction.ts` owns recognition cues and captions.
`components/sanctuary/plates/ScenePlate.tsx` owns the 21 compositions; shared
engraving primitives supply materials and hardware, not a repeated scene.
`ChapterDiagram.tsx` dispatches to a separate exhibit for each chapter.

## Rules for the next pass

Keep interaction tied to the chapter's claim. Each control must change a
relationship, condition, view or calculation that the reader can explain.
Static evidence remains static: Concord gets a timeline, not invented sales,
cost, population or causal sliders. No toy experiment is presented as a game
capture or measured player data.

Keep screenshots inside the existing local-only research boundary. The public
plate's caption names the game/mechanic being referenced and identifies the
work as an original illustration. The cover, ember field, clang and preference controls remain. Fire and shadows
now have independent procedural fields, described below.

## Performance and accessibility

The pass adds no media downloads, chart package, animation library or remote
request. Geometry is deterministic; integer-mixed texture noise avoids engine
rounding differences during hydration. The plate is memoized, and enlarged
geometry mounts only while the native inspection dialog is open. Only the
current chapter renders. Exhibits keep their own small local state, reset when
the chapter changes, and compute results directly without animation loops.

Buttons expose pressed/disabled state; sliders and the Favor meter have labels.
Live readouts explain the consequence. Dense SVG instruments retain legible
geometry in a keyboard-focusable horizontal scroll area on narrow screens;
text explanations remain outside the SVG. Native dialogs support Escape.
Transitions and wire motion respect both reduced-motion and the shared manual
motion setting. Existing hashed assets and manifest caching remain unchanged.

Validation for this pass: 143 tests in 32 suites and the production build pass,
including the asset-boundary checks. Browser inspection covered all 21 plates
and all 21 mobile chapter layouts (390px viewport), with no page overflow or
publisher images. The main reader/exhibit production chunk measured 32,713
bytes gzip in this build; no new binary assets were added. Functional checks
cover break/return policy, dual-key claims/refills, ownership prerequisites,
cosmetic invariance, term disclosure, encounter constraints and realm transfer.

## Atmosphere revision · 1 October 2026

The former shared orange glow and Bézier silhouettes are replaced by a native
WebGL hearth. One bounded canvas composites two independently timed fields:
slow, domain-warped soot with lit edges, then fire whose heat is carried upward
and cools in a small, double-buffered field. Five procedural depth slices add
bright folds and dark gaps inside the transported heat. The fuel supply varies
across space and time: fronts form, split, detach and disappear rather than
bending persistent pointed columns. The existing Canvas2D embers retain their
movement, color, population and glow. No external textures, media or packages load.

The revision was compared against MIKAEL LOPES’s slow-motion fire footage on
Pexels (video 6158961), at 2.0, 2.5, 3.0, 3.5 and 4.0 seconds. Matched snapshots
compare changing silhouettes, detached tips, bright folds and open gaps; slow
motion is a shape reference, not a measurement of real-time burning speed. The
reference remains outside the product assets. This is stylized procedural fire,
not a physical combustion solver or a claim of photorealism.

The hearth draws at approximately 30fps, with a backbuffer bounded to 960×256
(actual aspect ratio preserved). The heat simulation is separately bounded to
512×192 using two RGBA8 textures; a transport pass precedes the soot and fire
compositing passes. It suspends when hidden or reduced motion is
requested, follows the shared manual motion switch, disposes GPU objects on
unmount, and rebuilds after context restoration. Without WebGL the reading
experience and embers remain available. Lifecycle tests cover these boundaries.

The 21 chapters now have a connected, cited narrative. Optional section headings
and paragraph references are data in the chapter schema; a chapter sends only
its own text and source notes to the client. Numbered references follow chapter
source order and open the supporting work. Research and interpretation remain
distinct, with limitations in the chapter evidence notes. See LITERATURE_PASS.md.

## Reading restraint · 2 October 2026

Fire appears only when the reader’s final one-pixel marker is fully in view.
An IntersectionObserver tracks the actual document end, including expanded
evidence and responsive layout changes. It fades in over 700ms and disappears
when the reader scrolls away; heat transport and flame shading are skipped
while offscreen. The fuel bed is cropped below the viewport, with a soft fringe
limited to the lowest 19% of the hearth and 38% of its former intensity. Slow
shadows and the existing embers remain independent of this end-of-page reveal.

The cover’s eyes have larger pale-hot cores, a broader warm halo and a brighter
minimum in their slow pulse. Reduced motion retains a steady eye glow. Mural
color/geometry attributes round fractional values to keep server and browser
rendering consistent across different JavaScript engines.
