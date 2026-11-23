# Chapter 7 visual review

## Source pass — rendered review pending

Scope: current Chapter 7, its four visual components and styles, shared figure/term-note presentation, motion gates, and the executable teaching models. Read the repo design/performance standard. No source edits or browser actions performed. The separate writing acceptance remains unchanged.

### One actionable accessibility finding

**P2 — Announce the selected Judge Desk record when Previous/Next changes it.** In `apps/lab/components/agentic-systems/visuals/JudgeDesk.tsx`, the central `.browse` span contains the record number, delivered/missing status and accept/hold decision, but it is outside a live region. Browsing changes those outputs while focus stays on Previous/Next. The `.scores` live region does not change during browsing, and the updated SVG accessible name is not a reliable announcement for an unfocused image. Put the selected-record summary in a concise polite atomic status region, then verify that one Next action announces the record and verdict once. Source establishes the missing announcement mechanism; actual assistive-technology behavior has not been tested here.

### Concept and redundancy

- **Inspection Bench:** separates a rule check from the complete delivery boundary. The severed-wire state can show a passing direct probe beside a failed delivery; the duplicated-count specimen establishes that the direct probe still has a legitimate purpose. It does not merely make testing look foolish.
- **Coverage Floor:** preserves the same five place stamps while changing situation coverage and outcome. The interrupted itinerary with lost ownership is the decisive comparison. The model explicitly disclaims navigation/collision testing.
- **Judge Desk:** independently varies base rate and decision policy, keeping missed faults and needless holds visible. It accurately identifies its perfect count inspector as a deterministic known-value rule, not evidence of model ability.
- **Flight Tunnel:** changes which fixed population succeeds and clears results when the configuration changes. It makes the limited proxy concrete without claiming difficulty or enjoyment.
- These are four distinct arguments. Shared crate/room vocabulary gives continuity, while the machine, floor plan, inspection desk and flight apparatus supply different compositions. Captions and closer-inspection notes add state/interpretation details rather than repeating the visual headings.
- The revised production-team prose now does the transfer from these authored physical examples to agent-team review. A fifth illustration is not needed solely to repeat that transfer.

### Source responsiveness and motion

All four studies provide native labeled selects/buttons, visible focus treatments and minimum 46px button/select heights. Flight pilot buttons expose their selected state. Mobile rules stack controls and result records; Coverage and Flight move side controls below the scene. Key outcomes have HTML summaries rather than relying solely on color or SVG text. Tiny in-scene lettering should nevertheless be inspected at phone width.

State changes drive finite CSS animation; there are no per-frame React updates in these components. Shared gating checks visibility, document state, stored manual pause and reduced motion. Static final-state geometry and outcome records remain when animation is disabled. Each study is dynamically imported through the selected figure mapping and uses inline SVG, with no raster media payload in these four instruments. This source review is not a load/performance measurement.

### Priority rendered states requested from parent

1. **Inspection Bench:** severed wire after direct probe and one control press; desktop and 320px. The tray, severed connection and diverging receipts must remain easy to distinguish.
2. **Coverage Floor:** interrupted itinerary + erased reservation at failed completion/delivery and final return; compare kept reservation with successful delivery. Include phone width to check room/condition correspondence and control fit.
3. **Judge Desk:** accept-everything, 19 complete/1 missing, missing record selected; compare 5 missing or hold-everything. At 320px, inspect central record navigation and all three metric cards. Separate keyboard/screen-reader verification is needed for the finding above.
4. **Flight Tunnel:** lower opening with A passed and B stopped recorded together; change to wide opening, confirm records reset, then both pass. Include phone width and a paused/reduced-motion result.

Rendered appearance, actual horizontal overflow, live keyboard/screen-reader behavior, and laboratory/field performance are not accepted by this source pass. Parent-provided captures will be reviewed separately below.

## Final rendered recheck — accepted for reviewed states

Directly inspected all six parent-provided captures:

- `/tmp/agentic-team-efficiency-visuals/07-bench-390.png`
- `/tmp/agentic-team-efficiency-visuals/07-bench-desktop.png`
- `/tmp/agentic-team-efficiency-visuals/07-coverage-failed-320.png`
- `/tmp/agentic-team-efficiency-visuals/07-coverage-kept-320.png`
- `/tmp/agentic-team-efficiency-visuals/07-judge-320.png`
- `/tmp/agentic-team-efficiency-visuals/07-flight-320.png`

The desktop bench gives the broken connection, empty delivery tray and successful direct probe clear spatial separation. The 390px presentation keeps the commission and divergent receipts legible. The two 320px coverage captures preserve identical five-room/situation records while changing the delivery result; the refused/kept comparison is explicit in the event and final outcome, even though small room lettering serves primarily as illustration at that width. Judge Desk keeps the missing selected delivery, accept verdict, 95% agreement and 0/1 faults caught visible together. Flight keeps the two recorded outcomes and chosen pilot distinct. Controls, text and result panels fit the captured widths; no clipping or obscured actions found.

The repeated palette is cohesive, while the four physical arrangements remain recognizable and explanatory. At phone size the HTML records carry the exact claims; tiny decorative apparatus lettering is not required to recover the argument. No material visual/prose/caption redundancy found in these states.

**The P2 announcement finding is resolved in source.** The selected Judge Desk record summary now has `aria-live="polite" aria-atomic="true"`. Parent reports using Next and observing Record 2 / one crate / accept inside that region. I verified the implementation; I did not independently operate a screen reader, so the report does not claim a spoken-announcement test.

Parent reports no horizontal overflow in the captured states and supplied tall 1500px phone viewports to include the result panels. That measurement is attributed to the parent; my direct evidence is inspection of the captures and source. This closes the visual review for the represented desktop/320px/390px states, with **no remaining material finding**. Other interaction permutations, 768px, wide-aperture reset, runtime motion and loading/performance were assessed only where described in the earlier source pass, not independently exercised here. No field-performance acceptance is implied.
