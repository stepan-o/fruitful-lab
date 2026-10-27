# Chapter 3 — dedicated visual review

Status: **accepted for explanatory design and the current targeted desktop/mobile rendered review. Prior visible layout watchpoints are closed; coverage limits remain explicit below.**

Reviewed the installed rewritten Chapter 3, `Visual.tsx`, `FigureNotes.tsx` and its note data, `WorkBenches.tsx` / `workshop.ts`, `GripBoundary.tsx`, `HandoffTable.tsx`, `Delegation.tsx`, their styles, the compact-view helper, and shared motion gating. No browser used. No app edits made. This report does not yet certify live desktop/mobile layout, interactions, or accessibility behavior.

## Source-level verdict

**No new blocker.** Each of the seven studies has a distinct causal job in an AI production-systems chapter. Loopforge's two case reconstructions now illustrate general interface and execution problems; the graphics do not require following the studio's chronology.

The visual sequence develops the chapter's argument: determine what can proceed independently; decide what a boundary protects; test what a receiver can use; define the discretion delegated; choose a useful response to uncertainty; locate execution failure; account for the work returned to a human.

## Individual studies

### 1. `work-benches` — How many benches are actually free?

**Role:** distinguish available staffing from independent work, and distinguish finishing branches from delivering the combined result.

The model changes staffing and dependency independently. The handover control isolates transfer delay from the assembly's unavoidable order. Independent searches still require a synthesis beat. This is an explanatory comparison with a visible consequence, not motion added around a claim.

Source-derived expected totals for live verification: independent searches take 10 beats with one worker and 4 with three; the assembly takes 9 with one worker, 11 with three and handover enabled, and 9 with three and handover disabled. These are authored scheduling rules, not measured productivity.

**Layers:** the title asks the reader to examine capacity; the controls and clock expose the mechanism; the prose explains the idle fitter and context cost; the caption discloses model status; the “Synthesis” note adds the important limit that no claim reconciliation or quality evaluation occurs. The layers are distinct.

**Live watchpoint:** the mobile sticky clock should keep controls available without obscuring the active bench or creating confusing movement through the three bench cards.

### 2. `delegation-parnas` — At the cabinet's output slot

**Role:** show why an implementation boundary can reduce coordinated change.

The added reading-view and export cards are stable consumers. Row/tree selection changes only the representation inside the cabinet; the consumer cards and A/B/C result remain. The result text names the protected consumers and says why neither needs rewriting. This now supplies the neighboring-change consequence missing in the earlier version.

**Layers:** the outer title directs attention to what crosses the boundary; the inner title names the concealed decision; the graphic changes internals while retaining recipients and output; the prose explains the change that would otherwise spread, then uses “latest” to distinguish representation from meaning. The caption identifies the authored abstraction and avoids pretending it is Parnas's original implementation. The contract note defines what the recipient can rely on.

**Live watchpoint:** the eye and export icons have no text labels inside their cards. Their identities are supplied by nearby result text and the SVG accessible label. Verify the correspondence is immediately understandable at desktop and phone sizes. Both cards fall within the compact view box in source; actual recognition remains unverified.

### 3. `grip-boundary` — At the receiving bench

**Role:** reveal how a correct local target can fail the complete relationship required by a receiver.

The control does not fix the pose or move the target. It reveals the surrounding body, card, and envelope while leaving the wrist target satisfied. That controlled change is the teaching point: the narrower check omitted the relationship that matters.

**Layers:** the title identifies the receiving perspective; the graphic reveals omitted geometry; the changing internal heading and result explain the selected scope; the prose connects the specimen to data pipelines; the caption makes the geometry's invented status explicit. The body-envelope note is a useful term explanation, not a second conclusion.

This remains a game-shaped example, but its role is integration acceptance in a production system. It does not continue the asset-development log.

**Live watchpoint:** the hatch and body envelope must remain legible on a phone, and the selected wrist marker must remain visibly unchanged across the toggle.

### 4. `delegation-agency` — The destination survives the obstacle

**Role:** distinguish authority to choose a route from authority to change the commission.

The obstruction changes an authored route while the destination stays in place. Its value is the contrast between changing means and stable ends. The visual is correctly limited: it does not claim a real path planner, learned policy, or language model. The route remains visible when motion is paused.

**Layers:** the outer title states the invariant; the inner title and control identify the changing environment; the result identifies the chosen route; the prose explains delegated discretion and relates it to workflows and investigations. The caption and discretion note bound what the model demonstrates.

**Live watchpoint:** in pause/reduced-motion mode, the obstacle and alternate path must still make the distinction complete even if the courier remains at the start.

### 5. `delegation-initiative` — A day, then an hour

**Role:** show a useful contribution at the precision the available information supports.

The controls supply different wording, changing a full-day highlight into an hour slot. No invitation is sent. The model illustrates a graduated response instead of forcing every uncertainty into “ask” or “act.”

**Layers:** the title names the visual change; the controls provide its cause; the highlight shows its consequence; the prose explains the cost of an incorrect or interruptive response. The caption and note state that the display is authored and no confidence score is computed. That distinction prevents an unimplemented inference model from being implied.

**Live watchpoint:** the chosen day and narrow slot, including “Tue · 2 pm,” must remain readable in the compact crop. The current source places them inside it.

### 6. `handoff-table` — The compiler that never received the question

**Role:** locate the boundary actually reached before drawing conclusions about downstream work.

Selecting a record changes the gate that stopped the attempt and the stated limit on what can be inferred. Two records stop at the same gate for different reasons; that is valid evidence, not a need for gratuitous visual variation. The third progresses farther but still never reaches compilation.

**Layers:** the title names the consequential absence; the drawing and numbered route localize it; selected text supplies the particular failure; the prose draws the end-to-end contract lesson. The caption establishes reconstruction/provenance, and the process-group note makes the technical incident accessible.

This is the most incident-specific study, but it now earns its place through a general lesson about delegated execution. It does not require memorizing dates, role admissions, or the sequence of studio repairs.

**Live watchpoint:** at narrow widths the route legend changes from four columns to two. Verify that the numbers still map unmistakably onto the four gates in the drawing and that the selected stop remains clear. The upper labels may become physically small; the larger HTML legend/result must preserve the meaning.

### 7. `delegation-automation` — Who restores the line?

**Role:** expose the responsibility left behind when routine operation is automated.

The four selected states distinguish ordinary operation, an exception, diagnosis, and recovery. The process stays stopped during diagnosis; recovery restores the route. The person and diagnostic/key cues make the transferred work visible.

**Layers:** the outer title asks who inherits the task; the inner title names the returning exception; the result text follows the current stage; the prose explains Bainbridge's mechanism and carefully separates it from the unmeasured studio case. The caption states that skill and elapsed recovery time are not simulated. The residual-work note defines the assignment left over.

This is an industrial-control foundation with a bounded application to AI operations. It is clearly broader than the studio story.

**Live watchpoint:** fault, diagnosis, and recovery should be visibly distinguishable without relying on the text alone; recovery must restore the ordinary route while retaining the person responsible for the intervention.

## Cross-study quality

The common cabinet/bench visual language provides continuity, but the controls change different things: staffing, representation, visible acceptance scope, route, interpretation precision, execution stop, and recovery stage. That difference keeps the set from becoming seven versions of a toggle with the same lesson.

Motion is illustrative rather than authoritative. The shared hook gates it by visibility, document state, preference, and reduced motion; state changes remain under user controls. Source-level still states retain each study's central fact. Control minimum heights and focus-visible styles are present; their actual comfort and visibility require live evidence.

The two static evidence figures have narrower roles: the roster supplies historical context without proving capacity, and the benchmark figure tests whether architecture effects generalize across task types. Neither displaces the seven interactive studies' explanations.

There are modest wording overlaps between outer titles, inner results, notes, and prose, especially in the agency and automation studies. They serve orientation, state feedback, definition, and interpretation respectively. No repeated layer currently warrants an editorial blocker.

## Evidence to append

Await Root's desktop/mobile frames and control observations. The most useful evidence is paired states for the added Parnas consumers, the compact HandoffTable legend, the WorkBenches staffing/dependency comparison, and static courier/automation states with motion paused. Record live findings separately from the source-level conclusions above.


## Rendered evidence addendum

Inspected these five actual saved frames with `view_image`; I did not operate a browser. Root separately reported using the controls: tree then rows; Changed parent; Obstruct the route; Introduce a rare fault then Trace the fault. Those action reports and the static frames are different evidence. The frames record final visible states, not every transition.

### Rendered verdict

**The shown desktop/mobile regions pass this visual spot-check. No new visual blocker was found.** The changed Parnas consumer cards are recognizable and fit both layouts. Controls, result text, historical attribution, figure notes, and captions are visually differentiated in the regions shown. The revised chapter context presents foundations rather than an incident chronology.

This does not establish newly exercised coverage of every combinatorial state, every motion condition, or assistive technology. Existing unchanged-component coverage belongs to its prior record. The present check confirms the supplied current frames and the newly added consumer cards, with the following exact limits.

| Frame | Directly observed | Exact remaining evidence limit |
|---|---|---|
| `03-parnas-desktop.png` | Rows selected; full cabinet, unchanged A/B/C output, both eye/reading and export cards; readable side-by-side controls and result; contract note, provenance caption, and opening explanatory prose. The two consumer cards connect visibly to the cabinet and are clearly distinct. | No tree-selected rendered frame was supplied. Root reports selecting tree before returning to rows; source-level state structure separately shows the consumers remain stable. This image alone does not prove the tree rendering. |
| `03-parnas-phone.png` | Rows selected; compact cabinet retains the complete output and both consumer cards. Illustration, attribution, inner title, full-width controls, and result text stack clearly without visible horizontal clipping. The text identifies the icons' roles, resolving the source review's recognition watchpoint. | The phone frame ends around the source link, before the note/caption. It also shows rows rather than the tree state. Neither absence indicates clipping by the component; those regions/states are outside this capture. |
| `03-handoff-phone.png` | The preceding mixed-initiative passage and “Account for what comes back” heading are readable. All three case controls fit, Changed parent is visibly selected, and the diagram shows a stop at gate 2. | The screenshot ends during the drawing. It does **not** show the 2×2 HTML route legend or selected failure/result text, so it cannot settle the specific narrow-screen number-to-legend mapping watchpoint. A capture starting at the controls and continuing through the route legend/result is the missing evidence. |
| `03-agency-phone.png` | Obstruct the route is visibly selected; the box, courier, destination edge, result text, discretion note, caption, and beginning of the interpretation are visible. Controls and explanatory layers are legible. | The top of the room and the upper segment of the alternate route are above the frame. The full reroute geometry and its relation to the obstacle cannot be judged from this crop. A frame starting at the top of the room would supply that evidence. This is not a pause/reduced-motion capture. |
| `03-automation-phone.png` | Trace the fault is visibly selected. The operator, diagnostic symbol/record, four controls, stopped-during-diagnosis result, residual-work note, and provenance caption are readable. The current state is distinguishable through both action and result text. | The upper process diagram is cropped. This frame does not establish the complete fault path or the rendered restored-route state. A full diagram capture in Trace would settle the current geometry; a recovery capture would be needed only to claim fresh rendered verification of recovery. Root reports the fault-to-trace selection, not recovery. |

### Effect on acceptance

The Parnas change is accepted for its visible desktop/phone presentation in the supplied rows state, in addition to the earlier source-level acceptance of the stable-consumer comparison. The chapter retains editorial acceptance. No component repair is indicated by these images.

The incomplete handoff and agency crops should not be described as full-diagram visual passes. Their missing portions are precisely identified above; a small recentered capture is sufficient if the release record requires closing those watchpoints. The automation capture supports its current text/control composition, with the cropped flow diagram explicitly outside the claim. No broad repetition of prior control coverage is requested.


## Final recentered-frame review

Inspected the supplied 390 × 1100 recentered frames with `view_image`. This addendum supersedes the earlier unresolved handoff, agency, and automation crop watchpoints. No browser used and no further state sweep requested.

- **`03-handoff-recentered.png`: watchpoint closed.** The full four-gate diagram and two-by-two numbered HTML legend are visible. “2 · Validate handoff” carries the same warning emphasis as the stopped second gate; numbers keep the mapping clear despite the legend's wrap. The result heading is legible below it. **Evidence correction:** this image actually shows **Missing field** selected, with “INCOMPLETE” and the process-group result. It does not show Changed parent, despite the supplied description. Both stop at gate 2 in the source, so the frame still resolves the specific layout/mapping question. It should be catalogued as Missing field; no replacement image is necessary for this review.
- **`03-agency-recentered.png`: watchpoint closed.** The complete room is visible, including the upper and side segments of the longer dashed route, the central obstacle, courier, and unchanged destination. Obstruct the route is selected and the corresponding explanation is legible. The route change now reads directly from the image. This verifies the rendered selected state; it does not certify a separately exercised reduced-motion preference.
- **`03-automation-recentered.png`: watchpoint closed.** The process path is visibly straight again, the operator remains at the console, Restore the line is selected, and the recovery explanation is readable. Together with the earlier Trace frame, this provides current rendered evidence for diagnosis and restored operation. It does not measure recovery time, skill, or continuous animation smoothness; the display correctly says so.

### Final visual judgment

**Accepted.** Chapter 3's seven studies have distinct explanatory purposes and appropriate title/prose/caption roles. The changed Parnas consumer cards are readable on the supplied desktop and phone frames, and the recentered phone captures close the earlier diagram-layout watchpoints. No source-level or visible rendered blocker remains from this review.

This is acceptance of the explanatory design plus the current targeted rendered evidence, not a new claim to exhaustive state, keyboard, screen-reader, motion, or device coverage. The supplied Parnas frames show rows; Root's tree-to-rows control report and the source-level comparison support that transition, but no saved tree frame was independently inspected. The current WorkBenches and GripBoundary judgments remain source-level here, supplemented by the project's prior unchanged-component live coverage rather than a new frame sweep.
