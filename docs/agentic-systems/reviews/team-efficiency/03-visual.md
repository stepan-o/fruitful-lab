# Chapter 3 — separate visual review

27 October 2026. Scope: newly implemented TeamTopology, shared team-studies styles, registration and chapter placement, supporting hooks/notes, and the published case accounts. This is a **source and explanatory-design review**. No browser was driven and no new rendered frame has yet been inspected.

## Current verdict

**The visual idea is sound and distinct from the existing studies. Two source-level accessibility/readability corrections are needed before final visual acceptance; responsive and composition acceptance awaits captures.**

The graphic answers who can assign, integrate, inspect, and stop work. WorkBenches asks what can proceed at the same time. The new bridge makes the difference explicit. Parnas still explains private change, the grip exposes a receiving contract, and the later studies cover discretion, partial assistance, execution, and residual work. No original study needs removal.

## Required source corrections

### 1. Keep the role labels readable in inactive states

`TeamTopology.tsx`, node group around line 32, applies opacity 0.67 to the entire inactive node, including text. The active subtitle is also relatively light against its pale tile.

Source-color calculations (not a screenshot measurement) give:

| Label treatment | Approximate contrast |
|---|---:|
| Active subtitle #476452 on #d9c59a | 3.86:1 |
| Inactive subtitle, including group opacity over wall-gradient endpoints | 2.54–2.64:1 |
| Inactive main label, including group opacity over wall-gradient endpoints | 2.89–3.02:1 |

The main labels are 20/22 SVG units and the subtitles 12/13 units before scaling. A reader should be able to identify the unselected participants while examining an interface; those labels are relevant information, not disabled controls. Keep text opaque and use fill/border treatment to de-emphasize an inactive node. Darken active subtitles and raise inactive text/background contrast. Rendered inspection should confirm both selected and unselected roles.

### 2. Give the image an accessible description of its actual map

The SVG around line 21 is a single `role="img"` with an `aria-label`. That label gives the current title and a general caveat, but omits the six role names/responsibilities and the selected connections. SVG text children should not be relied on to supply that missing content when the whole image has been exposed as one named image.

Add a concise `title`/`desc` relationship or equivalent accessible text. It should identify Owner, Root, Producer, Animator, Engine and the grouped Review function, then say which participants/relationships the current interface emphasizes. Distinguish review's functional grouping from a single historical agent. The visible receipt is already useful, but it does not enumerate the map or all role labels.

Avoid an unhelpful readout of coordinates or every decorative line. Describe the production relationship.

## Responsive watchpoint

The compact layout is selected only at viewport widths <=600px. Above that, the 800-unit-wide SVG can be placed in a much narrower column:

- Around 640px, the reader has about 596px before borders; a 13-unit subtitle renders around 9.7px.
- Just above the 850px sidebar breakpoint, the remaining content width is again only about 590px; a subtitle can be similarly small.
- At 320px the compact view has around 284px available; 12-unit subtitles become about 9.5px.

The narrow layout is structurally better than shrinking the desktop geometry, but small secondary labels may still be unreadable. Include a 640px capture in addition to desktop/390px. A larger breakpoint, a container-width decision, larger subtitles, or moving role descriptions into visible HTML could address this; choose after looking at the actual composition. This is a likely legibility problem, not a claim that a screenshot has already failed.

## Case/authority accuracy

The distinctions are supported by the published records:

- The first Producer account identifies Producer as the native coordinator choosing assignments, order, boundaries and requested return evidence, and enumerates nine crafts.
- Root's second account separates Producer's scheduling/production decisions, Engine's implementation/integration, and Root's access responsibility. It also distinguishes owner approval from technical findings.
- The independent second assessment identifies Producer delivery, Engine integration and Root access support, and retains the owner's merge decision.
- Animator/Engine are a defensible selected pair for this particular shared-body/contact problem. The note correctly says the map is not exhaustive.

Internal primary locations consulted:

- `apps/lab/public/loopforge-dev-blog/posts/2026-10-22-what-i-mistook-for-progress/index.html`
- `apps/lab/public/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/root-account.html`
- `apps/lab/public/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/independent-assessment.md`

No material factual role error found. “Joint acceptance” describes the receiving specimen, while the accompanying text correctly refuses to equate a pose/export/test with acceptance of the assembled performance. “Review” deliberately groups functions, and the note avoids falsely collapsing Critic, independent reviewer and Root.

The interface descriptions sometimes express the responsibility the work **should** satisfy (“must agree,” “must be able to reproduce”), rather than proof that every historical return did so. The explanatory wording and caveats make this reasonable. An optional caption refinement would call the map an authored synthesis of the recorded responsibilities, so the reader does not mistake it for a recovered studio organization diagram.

## Graphic logic and fit

The brass rails, dark wall and paper receipt fit the book's existing industrial visual vocabulary. The diagram adds an actual role/authority view instead of another numerical throughput claim. Selecting an interface changes both highlighted participants and the concrete object crossing the boundary.

The shared-records cabinet is central and does not masquerade as a shared mind. Its paths pass behind the cabinet and some cross; inspect the resulting route clarity in captures, especially Delegation & return. Because the map is deliberately conceptual and lines are undirected interfaces, do not infer message direction, volume, or historical frequency from them.

The review selection retains the owner node, helping distinguish evidence from release authorization. The notes add useful scope information rather than repeating the selected receipt. The role-map title, selected result, limit and caption have different jobs.

## Semantic and motion behavior already supported in source

- Native buttons expose the selected state through `aria-pressed`; controls form a named group.
- The selected receipt has a polite live region.
- Controls have minimum 46px height and visible-focus styles. TermNote supplies native button triggers, focus/click opening, Escape/outside dismissal, and a bounded portal.
- The compact layout repositions nodes rather than merely cropping them.
- Gradients have instance-specific IDs, avoiding duplicate SVG resource IDs.
- Shared motion gating respects viewport visibility, document visibility, the persisted manual preference and reduced motion.
- The diagram begins still before the hook runs; CSS also suppresses animation under reduced motion.
- The dashed-path animation is illustrative selection emphasis, not a data simulation; controls remain authoritative.
- No timers, model/network dependency, canvas rendering, or heavy image payload are introduced.

The control buttons could explicitly use `type="button"` for defensive correctness. The current reader does not put them in a form, so this is a minor robustness suggestion, not an observed behavior defect.

## Capture and interaction evidence needed

After the label/accessibility corrections:

1. Desktop frame including title, all controls, whole map, selected receipt and caption. Use Direction & stopping.
2. Phone 390px frame(s) covering the complete graphic and receipt in Review & release, including the Which reviewer note open once.
3. Mid-width about 640px frame in Delegation & return to settle the scaling and crossing-lines watchpoints.
4. A Joint acceptance frame showing only Animator/Engine emphasized, with the shared-body receipt.
5. Parent's brief control observation: all four selections update node emphasis and receipt; keyboard focus is visible; Escape dismisses a note; global still mode/reduced-motion leaves the diagram fully meaningful.

Two vertical phone captures are preferable to one that cuts away the active legend or authority limitation. Distinguish direct screenshot inspection from parent-reported actions. No fresh exhaustive re-test of unchanged original studies is requested; retain their earlier scoped evidence.

## Acceptance boundary

Writing acceptance remains intact. Final visual acceptance is pending the two source fixes and targeted rendered evidence. This report establishes no desktop/mobile layout pass, screen-reader test, motion smoothness, or device performance result.


## Final source and observed-state acceptance — 2026-10-27

**Accepted within the stated evidence scope.** The two material source issues above are resolved. No new material source/design defect was found. This acceptance covers the current TeamTopology source and the visible Joint acceptance state in the three supplied captures; it is not a claim that every control, tooltip, motion setting, or lower layout was exercised.

### Source corrections confirmed

- Every node stays opaque. The active and inactive label colors now separate clearly from their respective card fills; the former opacity/contrast issue is gone. Active selection is reinforced by card fill and stroke, rather than by making the other roles illegible.
- The SVG accessible name now enumerates all six participant labels, names the highlighted roles, and states the selected transfer and retained authority. It also describes versioned records as links between separate contexts and the lines as conceptual interfaces. This corrects the prior missing textual description without pretending that this was a screen-reader session.
- `useCompactStudy` now observes the actual study container and selects the narrow geometry at 640px. Matching container-query aspect ratios reserve the intended geometry. This resolves the previous viewport-only breakpoint concern at intermediate content widths. The observer is cleaned up.
- The role descriptions, four interface definitions, and explanatory notes still preserve the factual distinctions reviewed above: Producer coordination, Root access/support, specialist integration, scoped review, and owner stopping authority. No claim of a collective mind, exhaustive staffing chart, measured traffic, or matched-budget team advantage has entered the visual.
- The existing visibility/manual/reduced-motion gating remains intact in source. Native selected-state controls, visible focus styling, live receipt, unique SVG IDs, and TermNote behavior remain supported by the implementation. These are source observations, not fresh interaction or assistive-technology tests.

### Direct capture observations

Reviewed files:

- `/tmp/agentic-team-efficiency-visuals/03-map-desktop.png`
- `/tmp/agentic-team-efficiency-visuals/03-map-640.png`
- `/tmp/agentic-team-efficiency-visuals/03-map-320.png`

The desktop image shows the chapter transition, title, four controls on one row, and the upper desktop map. The 640px image shows the compact geometry and clean control wrapping. Both end before the bottom of the map. The 320px image includes the whole compact map: Owner at the top, distinct Root and Producer stations, the shared-record cabinet, highlighted Animator/Engine stations, and scoped Review below. Only Animator and Engine are emphasized for Joint acceptance; the other roles remain readable. There is no clipping or overlap inside the visible map. The existing dark wall, brass, paper, and serif vocabulary fits the surrounding chapter.

The 320px role subtitles are small secondary text, but the role names, selection, and object hierarchy remain intelligible. This is a density tradeoff to retain in the record, not a material acceptance blocker. The primary explanation is in normal HTML beneath the diagram.

The parent separately reported selecting Joint acceptance, observing its matching receipt and compact viewBox, and checking that the 320px page had no horizontal overflow. Those are parent-reported checks; the matching receipt body and page overflow measurement are not fully independently visible in these captures.

### Limits and chapter fit

All three supplied captures crop the receipt and notes; desktop and 640px also crop the lower diagram. Therefore this pass does **not** establish complete rendered receipt/notes layout, full desktop lower-map geometry, tooltip placement, keyboard operation, smooth motion, screen-reader output, or every selection state. A lower desktop frame and lower 320px frame would close the principal remaining layout evidence gap if broader visual signoff is needed.

Within the reviewed scope, the study adds a needed responsibility/authority view. It does not repeat the work-benches parallelism lesson or the later delegation/acceptance studies. Keep the original useful studies. The prose bridge gives this map and the workshop distinct jobs. Writing acceptance remains unchanged.


## Additional lower-map capture acceptance — 2026-10-27

**Final visual verdict: accepted for the current source and the observed desktop, 640px, and 320px states.** The additional images resolve the principal lower-desktop evidence gap. No material layout or source issue remains in what was reviewed.

New captures inspected directly:

- `/tmp/agentic-team-efficiency-visuals/03-map-receipt-320.png`
- `/tmp/agentic-team-efficiency-visuals/03-map-lower-320.png`
- `/tmp/agentic-team-efficiency-visuals/03-map-lower-desktop.png`

The first 320px image confirms Review & release selected, with Owner, Root and Producer highlighted and Animator/Engine inactive. The second confirms the highlighted scoped Review station and the matching receipt heading, “A verdict and an authorization are different returns.” The lines, shared-record cabinet, inactive craft stations, review station and paper receipt fit the narrow column without visible overlap. Receipt text wraps in a readable single column; the supplied viewport ends partway through its authority-limit paragraph. The small development indicator overlays the page near the left edge, rather than representing content layout.

The desktop lower frame shows the entire receipt, its authority limitation, all three note triggers, the study boundary and caption, the prose bridge, and the beginning of WorkBenches. The hierarchy is clear: the selected object leads to its explanation and retained-authority limit; the notes sit below; the caption and prose then return the reader to the chapter. Nothing collides or clips. The three note labels remain distinct. The transition makes the two visual jobs explicit without repeating the same lesson: this map identifies responsibility, while WorkBenches explores concurrency.

The parent additionally reported awaiting the Review & release receipt heading after selection. The screenshot now independently confirms that selected state and matching content; this does not establish every other interaction.

Remaining verification limits are narrow and explicit: the final part of the 320px receipt and the mobile note triggers are not shown; no open note, keyboard traversal, screen-reader session, live motion, or exhaustive four-state interaction pass was independently observed. The source review supports those intended behaviors, but this verdict does not substitute for those tests. No further change is requested on the basis of the supplied evidence.
