# The work of making a world — draft implementation

7 October 2026 · local review on port 3106 · no PR or production deployment in this pass.

## Editorial contract

`making-worlds` is chapter 9 of 30, after `rockstar-world` and before `concord`.
The approved opening chapter is unchanged. The manuscript was written as a
continuous chapter before being assigned to the reader's paragraph/figure slots:
[WORLD_BUILDING_MANUSCRIPT.md](WORLD_BUILDING_MANUSCRIPT.md).

The chapter follows the work of making a world recognize a player's actions.
CDPR and Rockstar establish overlapping authored and systemic approaches;
Nintendo, RimWorld and Dwarf Fortress broaden the comparison. The economics of
engines then lead to CDPR's Unreal partnership and the author's Loopforge
experiment. The closing separates production capability from demonstrated
audience demand, preparing Concord. It does not rank studios, treat story and
simulation as opposites, or equate replayability with recurring revenue.

Loopforge's author relationship is explicit. The wider game's ambitions are
distinguished from its existing teaching prototype. No claim of cheaper AAA
production, universal engine replacement or autonomous character agency is made.
The private story reveal is not disclosed.

## Artwork and use records

The dedicated `sanctuary-worlds` asset pack contains four source masters and
twelve responsive WebP derivatives. Runtime images use content hashes, an
immutable manifest and the existing short-cached pointer. Source records are in
`apps/lab/lib/sanctuary/world-media.json`, including URLs, source hashes, owner,
review date, analytical purpose and treatment. Public credits render those
records and dated short policy excerpts from `rights-sources.ts`.

| Asset | Function | Recorded use basis |
| --- | --- | --- |
| The Witcher 3 official gallery still | Placed encounter within a traversable landscape | Bounded criticism/review assessment; CDPR fan-policy conditions recorded, not assumed to cover promotion |
| Red Dead Redemption 2 official gallery still | Environmental staging and travel between missions | Bounded criticism/review assessment; Rockstar's digital-publishing/product-promotion exclusions recorded; no bespoke permission |
| RimWorld official gallery still | Individual health state alongside colony-wide demands | Bounded criticism/review assessment distinct from Ludeon's conditional User Content licence |
| Loopforge supervisor concept painting | Rivet Witch and Stiletto's opposing priorities | Owner's explicit reuse/derivative authorization; concept art, not gameplay evidence |

Complete source frames are retained. The RimWorld analytical outlines are
separate UI layers. Third-party images remain beside the respective games'
analysis, outside the original Loopforge interactive exhibit and invitation.
This is a documented editorial assessment, not legal clearance or a guarantee.
See [EDITORIAL_MEDIA_RIGHTS.md](EDITORIAL_MEDIA_RIGHTS.md).

The brass mechanisms, recorder and robot bust in `WorldWorkshop.tsx` are original
procedural SVG artwork in the Sanctuary palette. They do not use publisher art.

## Reproducible Loopforge example

The two results were captured by executing the existing teaching engine at
Loopforge presentation commit `54c234b`. Version `lf-teaching-1`, seed 42,
default five supervisor assignments, three balanced shifts, then a fourth
shift with the policy changed. The same random disturbances and assignments
apply to both outcomes. No third-party engine code was copied into Sanctuary.

| Fourth-shift policy | Units in shift | Total units | Strain after shift |
| --- | ---: | ---: | ---: |
| Care | 21 | 109 | 0/100 |
| Pressure | 36 | 124 | 30/100 |

Both begin with 88 units produced and strain 12/100. The capture script,
source-file hashes, per-room outcomes and version metadata accompany
`loopforge-example.json`. These are conditional teaching-model results, not
measurements of people, injury counts or revenue forecasts.

The selector displays those recorded outcomes. Dialogue is visibly labelled as
authored for the exhibit. Changing the account changes words without changing
the result; changing policy changes the recorded outcome. There is no model
request, invented live simulation or claim that structural validation guarantees
factual narration. Links invite inspection of the prototype and architecture.

## Performance and accessibility

- Responsive widths 400/800/1440; no external runtime image dependencies.
- Opening pair totals approximately 72 KiB at 800px, or 22.5 KiB at 400px.
  Largest four variants total approximately 674 KiB. Later figures load lazily.
- Opening images retain intrinsic dimensions; the existing modal loads a larger
  variant when requested. The source master is not shipped as the page image.
- Original exhibit is dynamically loaded; only two small React state values
  change on user action. Motion is CSS transform/opacity, with no per-frame
  React updates. It pauses offscreen and obeys the reader's motion setting and
  reduced-motion stylesheet/hook. No extra animation or drawing library added.
- Native buttons expose selected state; the result region announces updates.
  Minimum 44px controls, visible keyboard focus and a vertical chain on phones.

## Verification

- Full frontend CI passed: 61 Jest suites, 294 tests; asset-pipeline test;
  integrity validation of 16 retained releases; TypeScript and production build.
- Two new tests check fixed consequences across dialogue changes and the
  recorded model's start state, room totals and matched disturbances.
- Edited component/script lint and `git diff --check` passed.
- Local browser inspected at default desktop, 768px, 390px and 320px: no page
  horizontal overflow; controls and figures remain usable. Keyboard account
  selection, both policies, image enlargement/Escape, RimWorld annotation,
  reader motion pause and offscreen pause verified. No observed console errors.
- Local prototype, engine thesis and credits links return 200. New pointer
  returns `public, max-age=30, must-revalidate`; image files return
  `public, max-age=31536000, immutable`.
- Reduced-motion CSS and hook reviewed; no separate OS preference emulation
  claimed. These checks are local, not field Core Web Vitals measurements.

Existing unrelated work was preserved. Remaining first-act reordering and
broader comparisons in the research briefs are not silently treated as shipped.
