# Sanctuary visual atlas

The public reading edition carries a closed **About the visuals** notebook at
the end of each chapter. It identifies each original scene, explanatory
instrument, supplementary comparison and visual citation in that chapter.
The rights page also carries a complete original-art atlas and the pre-existing
source-image register. Descriptions are editorial English, like the manuscript;
reader navigation retains its six-language support.

## Where the records live

- `apps/lab/lib/sanctuary/graphic-descriptions.json`: authored scene descriptions,
  visual interpretation, motion, instrument operation and model boundaries for
  every chapter. Stable chapter IDs are the keys; no generic fallback.
- `apps/lab/lib/sanctuary/visual-notes.ts`: typed assembly; Barcade reference;
  cinema, gathering-place and funding comparisons; cover/atmosphere/typography
  notes. Only the current chapter is serialized into the interactive reader.
- `art-direction.ts`: scene titles and immediate reader-facing captions.
- `cover-references.ts`: individual sources and creator credits for all three
  original catalog parodies; these feed both notebooks and credits.
- `editorial-media.json`, `arcade-media.json`, `context-media.json`: source,
  ownership, purpose, date, treatment and use records for every cited asset.
- `content.ts`: the primary-source register. Links marked “Context” explain the
  historical or theoretical reference; they do not authenticate invented art.

These records are the detailed descriptions. Keep them beside the code rather
than maintaining a second prose copy in this document. `VisualNotes.tsx` renders
them with native disclosures and real links, without additional fetching.
Tests require every chapter instrument, displayed chapter illustration and cited
figure to resolve to a unique, populated entry with references.

## Reading hierarchy

The graphic and its short caption stay in the main narrative. The notebook
explains what is shown, why the composition was chosen, how motion/interaction
works, and what the evidence can establish. Provenance detail stays here and in
credits rather than becoming a repeated caption over the artwork. Decorative
cover, ambient and typographic layers are documented in the public atlas so the
landing remains a hero, study-entry action and menu-return navigation.

## Arcade pass — 4 October 2026

**References:** [Barcade Brooklyn gallery](https://barcade.com/location/brooklyn/photos)
for room composition; [Computer History Museum](https://computerhistory.org/blog/50-years-of-fun-with-pong/)
for Pong hardware/context; [Atari’s Gauntlet operator manual](https://files.stardustarcade.com/PDF_Arcade_Atari_Kee/Gauntlet/Gauntlet_TM-284_1st_Printing.pdf)
for health settings; [Ed Logg’s postmortem](https://media.gdcvault.com/gdc2012/slides/Design%20Track/Logg_Ed_Gauntlet_Postmortem.pdf)
for design/commercial context. Existing sourced photos, flyer and gameplay
remain distinct from our animated illustrations.

| Element | Construction and motion decision |
| --- | --- |
| Room and people | Preserve the accepted photographed composition, shared perspective, hand contact, supported seats and open aisle. |
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
