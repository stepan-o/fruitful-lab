# Chapter 2 — separate visual-design review

Status: source/design pass complete; rendered review pending new captures.

Scope: current Chapter 2 manuscript and captions; `ThreeLoops`, `SmallWorld`, `WorldBoard`, `CommitWindow`, `CustodyRoom`, `HearingRoom`; their styles and state models; shared motion, tooltip and evidence-image controls; the retained `help-and-card` image and the moved Generative Agents source figure. Inspected local source images, not browser-rendered chapter states. No browser driven and no repository files changed.

## Verdict

The visual sequence fits the revised shared-world argument and each study has a distinct job. One targeted framing revision is warranted before final rendered acceptance: the close crop in CommitWindow cuts into the geometry of the successful output. All final judgments about visual fit, control reachability, focus behavior and mobile rendering remain pending captures/interaction evidence.

## Material finding — keep the committed output inside the close view

**Location:** `apps/lab/components/agentic-systems/visuals/WorldBoard.tsx`, close `viewBox` and output-tray group, consumed by `CommitWindow.tsx`.

The close view uses `258 102 255 230`, ending at x=513. Bob's completed output extends to x=524, and its receiving tray extends to x=551. The graphic that proves the successful final state therefore crosses the view's right boundary. This is a source-level framing mismatch, not a claim that a new browser capture was inspected.

Widen/reposition the close view to include the complete output and a little surrounding space while keeping the control station and both workers readable. Check the final “Stay at the control” state at desktop and 320/390 px. The other two sequences should still show the failed operation and retained reservation clearly.

## Visual-purpose map

| Visual | Distinct contribution | Design/source assessment |
| --- | --- | --- |
| ThreeLoops | Separates the builder's authority to edit, runtime authority to commit, and player's limited interface. The exchanges specify what crosses each boundary. | Fits. It establishes authority before the shared-state study rather than supplying another team roster. The compact mode selects a legible close station and retains `Builder ⇄ Game ⇄ Player`; the exchange rows and explanatory notes remain outside the crop. Capture all three selected stations. |
| SmallWorld / WorldBoard | Makes position, card custody and reservation diverge; exposes refusal, recovery and request identity. | Fits. The visible card and press are backed by separate textual facts, receipts and an inspector. Explicit beats prevent decorative motion from advancing state. The caption usefully identifies the teaching rules and reconstruction boundary. |
| CommitWindow | Shows that a valid start does not guarantee a valid completion; distinguishes staying, departing and passing the card. | Distinct from the free-form floor and uses the same transition logic. Its focused story and beat control reduce exploration cost. Fix/check the successful-output crop above. |
| Retained help-and-card image | Anchors the abstract custody/knowledge distinction in a dated actual specimen. | Fits. The image establishes the simultaneous help and card possession; the prose and record carry the claim about Bob's ignorance. Caption adds date, factory time and preservation information rather than reciting the lesson. Source is not cropped by the book. |
| CustodyRoom | Makes the world record diverge from a particular observer's account, then lets the reader inspect source/mode/sequence. | Fits. Blocked/clear view, three events and three records each alter a distinct question. The caption's “agreement by accident” asks the reader to inspect provenance, adding a task the title does not supply. |
| Generative Agents Figure 4 | Supplies the visible party outcome for the narrow distinction between intended and fulfilled commitments. | Fits after the writing revision. It remains a visual citation, not a diagram purporting to display missing intentions or all twelve invitees. The caption identifies the event/source and sends evaluation to the paper; prose owns the attendance inference. Inspected the local source image. |
| HearingRoom | Separates addressing, physical delivery, attributed testimony and true custody. | Fits. Near/far, doorway and voice controls can produce a genuine refusal; the false claim produces a received report while custody stays fixed. This adds a delivery channel to CustodyRoom rather than repeating observer access. The caption gives a meaningful order of experiments. |

## Mobile and motion: source-supported assessment

- Buttons and selects in the relevant study styles have 44–46 px minimum height; native buttons, selects, fieldsets, `aria-pressed`, focus outlines and live result text provide reasonable interaction structure.
- SmallWorld commands reflow from a two-column control area to a single column with paired actions. CommitWindow's story moves below the close scene. Custody records and hearing receipts stack.
- CustodyRoom's narrow-screen crop retains the two workers, partition and card area by source geometry. HearingRoom's crop retains Ed, both Bob positions, doorway and distance ruler. These are promising calculated layouts, not rendered clearance.
- ThreeLoops replaces the full three-station view with a selected station at <=600 px while preserving an overview line, station buttons and exchange rows. Verify the change does not cause an objectionable hydration/layout shift on the actual chapter route.
- All five interactive studies use `useLivingPlate`, which gates CSS motion on intersection, document visibility, reduced-motion preference and the stored manual preference. The persistent top-level control toggles that preference. State transitions still occur through explicit controls; animation is not simulation time.
- Reduced-motion selectors disable animations/transitions. Static poses, receipt text, source labels and selected states retain the lesson without movement. No audio is present.
- Evidence images have explicit dimensions, responsive variants and lazy loading. Large inspection content mounts only when opened; the dialog exposes fit/full-detail controls, an independently scrollable keyboard-focusable region, close/Escape handling through the native dialog, and an outside-dismiss path. Actual focus restoration still requires interaction evidence.

## Required capture/interaction follow-up

1. ThreeLoops: Builder, Game and Player at a phone width, plus desktop overview; one expanded exchange note near each horizontal edge.
2. SmallWorld: initial state and a completed handover, inspector open at 320/390 px; refusal text must not be obscured.
3. CommitWindow: final successful output after crop correction; interrupted/held-reservation state; controls and story at 320 px.
4. CustodyRoom: blocked-view final state with Bob's stale record, then world/Ed records; clear-view final state. Verify names, card and partition remain visible on phones.
5. HearingRoom: far/local refusal, near/local success, far/shout blocked-door refusal, and received false floor claim. Verify the complete speaker/listener relationship and stacked receipts at 320/390 px.
6. Both evidence figures: normal page layout, inspector fit/detail, keyboard dismissal and focus return. The party figure should remain clearly a published citation rather than a measured production result.
7. Pause/reduced-motion evidence: controls must continue to change authoritative state and update static explanations; offscreen/hidden motion must stop. Do not infer this runtime result from code inspection alone.

No additional material source/design issue found. Final visual acceptance is deliberately withheld until the pending rendered evidence is inspected.

## Final targeted capture review — accepted

Inspected these newly supplied captures directly:

- `/tmp/agentic-team-efficiency-visuals/02-completed-320.png`
- `/tmp/agentic-team-efficiency-visuals/02-interrupted-320.png`
- `/tmp/agentic-team-efficiency-visuals/02-interrupted-desktop.png`

Also confirmed the current close view is `258 102 305 230`, now ending at x=563. The completed workpiece and its entire tray are visible in the narrow-screen success capture. The control and both workers remain understandable. The two phone captures preserve the choice controls, complete result text, replay button, note and caption within the page width. The desktop interrupted view keeps the scene and explanation in a clear side-by-side composition.

The completed capture shows a delivered piece and the committed result; the interrupted captures show an empty tray and explicitly state that no output was awarded. This is the intended meaningful contrast. The parent reports the browser completed both sequences and found no horizontal overflow; I inspected the supplied still states and did not operate the browser independently.

**Final visual-design verdict: ACCEPT within the reviewed scope.** The sole material framing finding is resolved; no new material design issue appears in these captures. This closes the Chapter 2 source/design review plus the targeted CommitWindow rendered check. The other Chapter 2 figures retain the source/design assessment above; these three captures do not independently certify their rendered states, motion behavior, dialog focus behavior or field performance.
