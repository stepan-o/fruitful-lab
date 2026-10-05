# Sanctuary visual atlas — internal production reference

Updated 5 October 2026. Descriptions, interpretive choices, construction and
animation notes are project documentation. They do not appear in the public
reader or credits page. This supersedes the original public “About the visuals”
notebook; the earlier pass's verification below is historical.

## Where the records live

- `apps/lab/lib/sanctuary/graphic-descriptions.json`: scene descriptions,
  interpretation, motion, instrument operation and model boundaries.
- `visual-notes.ts`: the typed internal assembly, including cover, atmosphere,
  typography and supplementary comparisons. Tests retain coverage of these notes.
- `art-direction.ts`: immediate reader-facing captions and scene titles.
- `cover-references.ts`: source works and named creators for the three original
  catalog parodies, plus internal composition notes.
- `editorial-media.json`, `arcade-media.json`, `context-media.json`: source,
  owner, named credits, analytical purpose, dates, treatment and use basis.
- `visual-sources.ts`: derives only compact source/rights links for the actual
  works used in the active chapter, including embedded logos and cover references.

## Public reading hierarchy

The graphic and its short caption stay in the narrative. The native **Visual
sources & use** disclosure contains titles, source links where known, and links
to full records. It adds no image description, design interpretation, motion
explanation or repeated caption. The credits page is the full provenance and
rights record, not a downloadable collection or a commentary on original art.
Original geometry needs no public explanation. Keep attribution to recognizable
reference works when it is relevant to documenting an adaptation's use.

## Verification of the source-index revision

The focused checks cover complete chapter references (including embedded marks
and cover references), omission of original-art commentary/captions, unknown
source URLs, retained named credits and CC license links, and correct chapter
backlinks after Gauntlet's move. No artwork, image bytes, motion behavior, legal
excerpts or chapter prose changes in this revision. The compact reader metadata
replaces the much larger descriptions; the full original atlas is no longer sent
in the credits-page response.

Validation, 5 October 2026:
- Full Lab CI on the integrated branch: 55 suites / 248 tests, all 11 retained
  asset releases, and the production build passed. The final direct-link change
  also passed the four focused source-record tests and scoped lint.
- Production browser checks at the default desktop viewport, 390px and 320px
  found no horizontal overflow. The disclosure starts closed, opens with Enter,
  and exposes 44px-high links. Named photographer/adapter credit, the CC BY 2.0
  link, analytical purpose and use-review date remain visible in the register.
- Use native page anchors for the cross-route rights links. Repeated client-side
  navigation had duplicated the URL fragment; source records need stable,
  directly reopenable addresses.
- No new image requests, animation loops or dependencies were introduced by
  this component. This is a structural review, not a field Core Web Vitals claim.

## Arcade pass — 4 October 2026

**References:** [Barcade Brooklyn gallery](https://barcade.com/location/brooklyn/photos)
for room composition; [Computer History Museum](https://computerhistory.org/blog/50-years-of-fun-with-pong/)
for Pong hardware/context; [Atari’s Gauntlet operator manual](https://files.stardustarcade.com/PDF_Arcade_Atari_Kee/Gauntlet/Gauntlet_TM-284_1st_Printing.pdf)
for health settings; [Ed Logg’s postmortem](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Logg_Ed_Gauntlet_Postmortem.pdf)
for design/commercial context. The venue reference stays in internal design records, not the public caption or notebook, as requested by the owner. Existing sourced photos, flyer and gameplay
remain distinct from our animated illustrations.

| Element | Construction and motion decision |
| --- | --- |
| Room and people | Preserve the accepted composition, shared perspective, supported seats and open aisle. Rounded engraved head profiles; two partners at the nearest cabinet with hands projected onto separate rotary controls. |
| Weather outside | Two tiled rain stroke groups behind the door glass; one soft distant illumination every 19 seconds, clipped to the panes. No whole-scene flash. |
| Bar activity | A supported glass, stationary upper arm and forearm/cloth polishing around a fixed elbow. Body and counter stay still. |
| Near CRT | Project each rally vertex onto the physical screen plane. An eight-second loop synchronizes both paddles with the ball’s contacts. No floating flat overlay. |
| Far CRTs | Project original maze walls and two patrolling figures onto each cabinet’s plane; offset phases so the room does not blink in unison. |
| Glass | Fixed dim scan lines, a restrained reflection and a dark bezel keep moving game objects behind the surface. |
| Main dungeon | Four color-coded sprites circulate at constant speed around a central island, inside a clipped CRT. Ten-second cycle, quarter-cycle spacing and small stepped walking accents. |
| Secondary game activity | A guard patrol, projectile and treasure highlight occupy their own lane/timing. No suggestion that animation timing is historically measured. |
| Controls and mechanism | Physical knobs, joysticks and hinges stay still; an attract screen does not move unheld hardware. Health selection is user-driven, with documented values; the cutaway electronics are explanatory original geometry. |

All new motion uses bounded CSS transforms/opacity: no frame-by-frame React
state, game engine, canvas or new raster request. `useLivingPlate` stops motion
when offscreen, hidden or paused; CSS also honors reduced motion. Static sprite
positions remain distinct when motion is removed. Geometry and style are local
to Sanctuary; professional Data Science and the journey/world diptych were
technique references, not imports.

## Mobile chrome and navigation

Sanctuary’s nested layout declares dark color scheme, dark theme color and
`viewport-fit=cover`; the reader colors both root and body and respects safe-area
insets. A translated **Back to menu** link appears at the top of the cover and
chapter pages. The study-entry arrow requests text presentation so it does not
turn into a blue emoji button on iOS. Actual Safari chrome is browser-controlled;
verify on the target iPhone in addition to responsive desktop checks.

## Verification for this pass

- Full CI: 206 tests in 46 suites, deterministic retained-asset checks and
  production build pass. Scoped lint and whitespace checks pass.
- Production preview checked at 1280, 390 and 320 CSS pixels; no horizontal
  page overflow. The original art precedes prose and notes remain collapsed.
- Real browser inspection confirms moving game sprites and offscreen pause;
  shared lifecycle tests cover hidden tabs, manual preference and reduced motion.
- The source register renders 52 original-art/instrument entries, with each
  chapter’s image citations resolved from their existing asset records.
- Cover-to-menu navigation works. Dark theme metadata/root backgrounds and
  safe-area declarations verified; actual iPhone Safari toolbar tint is not
  validated by desktop responsive emulation.
- No new raster assets or dependencies; no field Core Web Vitals claim.
