# Chapter 6 — separate visual review

## Source and idea pass

Scope: `SearchYard`, `CandidateArchive`, `StoryWorkshop`, `SentenceBench`; their local data, styling, motion gate, figure notes, and current Chapter 6 placement. No repository edits. No browser driven. Rendered appearance and interaction acceptance remain pending current captures and runtime evidence.

**Provisional verdict: the four visual ideas are distinct and appropriately placed; one material control-design issue needs correction or explicit acceptance.**

| Study | Distinct job | Assessment from source |
| --- | --- | --- |
| SearchYard | A better ranking can select an infeasible candidate; inspection is different from promotion. | Proposal count, evaluator, inspected candidate and actual door condition each change a meaningful part of the experiment. Separate selected and inspected result fields prevent a card click from silently becoming selection. First placement makes the failure available before explaining it. |
| CandidateArchive | Retained alternatives can become useful when the requirement changes. | Reuses the preceding route family for a new question, so this is a justified continuation rather than a second ranking demonstration. The cabinet, discarded cards, changed requirement and available result correspond to the argument. The retention-switch reset presently weakens the comparison; see below. |
| StoryWorkshop | Choosing an activity changes the history; changing a line need not. | Intent, asking, activity, exit and wording expose genuinely different decisions. Prerequisite explanations remain available on the controls rather than requiring unexplained trial and error. The record and fact panel make consequences inspectable. Placement after the obligations introduction is appropriate. |
| SentenceBench | An attractive line may imply a fact or commitment absent from the accepted record. | Holding the scene record fixed while switching lines isolates the editorial question. Highlighting the relevant record row ties the verdict to evidence. This adds a useful second level to StoryWorkshop rather than repeating its activity choice. |

## Material issue

**CandidateArchive changes the requirement when the user changes retention.** In `apps/lab/components/agentic-systems/visuals/CandidateArchive.tsx:7`, both retention buttons call `setClosed(false)`. After observing the E-only policy fail under the closed-door requirement, selecting the three-route archive simultaneously restores the original open-door requirement. The immediate successful result is E again, so the important contrast has to be reconstructed with an additional click. The reverse switch similarly hides the failure that ought to demonstrate the cost of discarded alternatives.

Preserve the current requirement when switching retention policy. That allows a direct comparison of E-only/no usable candidate against A/B/E/A available under the same closed-door requirement. A separate reset can restore the initial scenario if desired. The existing sentence disclosing the reset is truthful but does not restore a clean one-variable comparison.

## Captions, notes and controls

- SearchYard's caption adds the distinction between inspection and evaluator selection. The clearance note explains the footprint calculation rather than repeating the title.
- CandidateArchive's caption responsibly explains A/B's tie. Its note explains that route definitions are retained and re-evaluated, not merely old scores. Both add information the cabinet cannot supply.
- StoryWorkshop's caption explains why two histories can reach the same exit. The eligibility note correctly distinguishes permission from selection. Authored status and the undeployed case relationship remain explicit.
- SentenceBench's caption adds downstream appointment work. Its note is a useful qualification about character error or deception; the fixed annotations are not represented as a model judge.
- Primary controls have at least 46px minimum heights in the supplied styles; figure-note triggers have 44px. Native buttons/selects, pressed/expanded states, focus outlines and live outcomes are present. StoryWorkshop deliberately uses `aria-disabled` rather than native disabled so an unavailable action can explain its missing condition.
- No tooltip is required to discover a primary action. The shared note component supports focus, touch/click pinning, Escape and outside dismissal from the source; actual behavior remains unverified here.

## Mobile and motion review targets

The styles provide compact control grids, stacked results, and a vertically arranged SentenceBench record/typewriter. There is no per-frame React update in these studies. The shared hook gates CSS motion by visibility, document state, stored motion preference and reduced-motion preference; static outcomes remain available. SearchYard includes a separate stopping-point control and hides its trial-play button under reduced motion.

These are implementation provisions, not a rendered pass. Inspect current captures/runtime at 320, 390, 768 and desktop for:

1. SearchYard's 125%-width mobile SVG crop: receiving dock/path endpoints must remain visible, with the separately rendered result retaining any meaning lost from the side-panel crop.
2. StoryWorkshop's 120%-width mobile crop: the press, final Lou/Kit positions and exit must remain understandable without clipping a consequential gesture.
3. CandidateArchive's small SVG drawer labels: the DOM result should preserve readable meaning; verify the cabinet is still recognizable rather than relying on tiny lettering.
4. SentenceBench's longest line and four tab labels: no paper overflow, hidden sentence, or unstable desktop/mobile reading surface.
5. SearchYard completion and manual pause during travel; all four reduced-motion states; note placement and keyboard dismissal on a phone-sized viewport.

## Rendered review

Pending captures from the parent. No rendered state, continuous motion, responsiveness or production performance certified in this source pass.

## Final visual verdict after fix and capture review

**Accepted for visual concept, current placement, and the visible rendered compositions. No material visual-design issue remains from this pass.** The archive control issue is resolved in source: both retention choices now preserve the current requirement, and the explanation describes the direct comparison. The parent reports browser verification of E-only failure and A/B/E availability under the same closed-door requirement; the two supplied 320px captures corroborate those displayed outcomes.

Inspected all seven supplied files in `/tmp/agentic-team-efficiency-visuals/`:

- `06-archive-failed-320.png`: closed-door requirement remains explicit; E-only retention and “Nothing retained can do this job” are readable. Small drawer lettering is supported by the larger result text.
- `06-archive-retained-320.png`: the same closed-door requirement remains in place; retained A/B/E and A available at twelve units are visible. The clerk is captured during retrieval, so the still is not evidence of the final paper pose.
- `06-search-desktop.png`: legible evaluator, seven-card family and yard composition. **This file shows baseline A, 1/7 proposals, distance-only rule, door open. It is not an E-failure capture.**
- `06-search-390.png`: E is selected after five proposals; the door is closed and the cart is visibly stopped at its threshold. The mobile crop preserves both docks, the route and obstruction. The omitted right-side lamp panel is not needed to understand this displayed outcome.
- `06-story-390.png`: private intention, reset, recognizable workshop, character positions and all five action controls fit. The cropped edges remove peripheral scenery without losing the press or exit.
- `06-story-rehearsal-390.png`: spent-period guards, available exit action and rehearsal dialogue are visible and coherent. A still does not establish the full transition or final walking poses.
- `06-sentence-320.png`: stacked record, active “Tomorrow unscheduled” row, readable invitation, four wrapping choice labels and typewriter composition fit. **This capture shows “An invitation,” not the unsupported commitment or the longest sentence.**

No material element clipping is visible in these regions. Several screenshots stop partway through their figures because the page continues below the viewport; that is capture framing, not demonstrated layout overflow. Consequently these stills do not certify the unseen lower results, notes/captions, longest sentence, 768px layout, keyboard/touch behavior, reduced-motion/manual-pause runtime behavior, continuous motion, or production performance. Those limits do not reopen the accepted source/idea and visible-composition judgments.
