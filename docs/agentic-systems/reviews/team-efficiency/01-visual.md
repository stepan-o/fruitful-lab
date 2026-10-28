# Chapter 1 — separate visual-design review

27 October 2026. Reviewed the current chapter placement, `ForgeEvidence`, `Release`, `BodyStudy`, `TimingInstrument`, `Workshop`, reader/visual styles, compact-view and motion hooks, `TermNote`, generated poster metadata and the public close-cycle outcome record. No browser operated. No new rendered screenshots inspected in this pass.

## Current verdict

**Explanatory design: accepted, with two small source corrections requested before rendered acceptance. Rendered visual acceptance: pending.**

The revised allocation is right for the new subject. Chapter 1 has a concrete creative artifact near its opening and one inspectable comparison of verdicts. It does not need a new team graphic, animated swarm, token dashboard or another hypothetical exercise. The actual team topology belongs in Chapter 3, where the organization itself becomes the subject.

## Two requested corrections

1. **Preserve the complete phone Support highlight.** `BodyStudy` uses compact view boxes `0 80 500 300` and `510 80 490 300`, ending at y=380. The Support rings are centered at y=351 with radius 42, ending at y=393. The compact SVG therefore clips the lower portion of the selected ring. Extend both compact vertical extents to at least y=400, then inspect both pose selections at 320 and 390 pixels. This is a source-identified clipping condition, not a claim about an unseen browser frame.
2. **Name the performance workload as game runs.** Change “TWO COMPLETE DAYS” / “Two complete days” in `TimingInstrument` to “TWO COMPLETE DAY 1 RUNS” / “Two complete Day 1 runs,” or an equally clear phrase. The public outcome JSON says two complete matched Day 1 cycles per variant, with about 1,656,609.5 ms elapsed for `candidate-full`. The current label can suggest a two-day wall-clock test. Preserve device, resolution, date and the failed verdicts.

The first is a mobile drawing repair; the second is an evidence-label repair. Neither calls for redesigning the instrument.

## What each graphic teaches

### Original Forge footage

**Keep its new opening placement.** The first paragraph supplies a discrepancy, the second identifies the studio and gives a watching task, and the video then provides the actual object of judgment. “Watch the body, then the counter” is a better chapter-facing title than the old fictional-output title. The following paragraph interprets the delivered correction alongside exclusions and failed performance; it does not duplicate the controls or caption.

The two selector buttons expose historically different records, not a simulated improvement. The 25/26 October labels, source build identifiers, dimensions, original-speed statements, diagnostic/ordinary entry contexts and credit line protect the comparison's scope. Keep the full source frame. On a phone, one video at full available width is preferable to putting two tiny scenes side by side. Native fullscreen and the source-study/stills link give the reader a legitimate inspection path without disguising a crop as the original evidence.

No synthetic synchronization, single percentage of “quality gained,” or dollar-return calculation should be added. The recordings support an observable creative correction and an attributed inspection, not an equal-budget production experiment or measured audience comprehension.

**Optional hierarchy improvement:** lead each caption with its human watching instruction and move the build/dimensions/duration after it. The current captions lead with machine identifiers before telling a reader where Max is. All provenance should remain, but its present order is not essential to the first act of looking. This is polish, not an acceptance blocker.

### Release inspector

**Keep the three top-level questions and Completion as the default.** Outcome, action and timing are the right comparison for this chapter: a completed rule, a readable performance and a device requirement are not interchangeable successes. The ensuing prose explains why averaging them would hide a failed obligation. No additional team illustration is needed inside this study.

The BodyStudy is useful as a watching guide because it points to support, contact and recovery on bodies. Its “schematic, not measured motion” qualifier is present on desktop and phone. It should remain visibly different from the actual footage, not be promoted as the missing measured reconstruction.

The TimingInstrument uses recorded summaries and limits. Selecting Average speed reveals a pass without erasing failures in slow tail, pauses and maximum duration. The allowed arc, red limit mark, numerical observed/limit text and explicit PASS/FAIL supply redundant meaning beyond color. Its summary-measurement qualification is necessary and well placed.

Custody and Persistence are secondary game-state examples. They remain behind a second row inside one view and do not dominate the opening, so they no longer prevent acceptance of the chapter's focus. The standalone phone “Card → Ed” rail should stay visually subordinate. Do not expand it with further game chronology; Chapter 2 owns the detailed state lesson.

The outer caption correctly distinguishes schematic body study from reported performance summaries. In the next image pass, check that the scene tag and drawings cannot be mistaken for recovered game footage. “Authored inspection guide” must remain easy to find alongside the panel.

## Source-level interface assessment

**Controls and semantics.** The selectors are native buttons with meaningful labels, grouped controls and `aria-pressed` state. They need no invented tab keyboard behavior because they are presented as button groups. Global and instrument styles provide visible focus. Source sets minimum 44-pixel targets; pose controls use 48 pixels. Body/readout/performance text uses polite live regions for changed interpretation. The video has an accessible name and native controls. This is a sound source design, not a completed assistive-technology test.

The timing explanation's “Matched conditions” control opens a supplementary tooltip with focus, pointer, touch, outside dismissal and Escape handling. The trigger retains the keyboard target and the panel contains no stranded interactive descendants. Verify its actual placement at narrow width, because geometry and scroll behavior cannot be certified by reading the implementation.

**Mobile structure.** At 600 pixels the three outcome/action/timing choices wrap into flexible buttons, readouts become one column and pose views select one large drawing. The timing view crops to the dial and repeats the omitted device/date/verdict as HTML. These are purposeful adaptations, rather than shrinking desktop artwork until it is unreadable. The Support crop issue above is the one concrete defect found. Also inspect the longest timing label and the longest source caption at 320 pixels; source alone cannot guarantee the final wrapping.

A small optional semantic refinement is to make `BodyStudy`'s compact SVG label name the selected pose, since the compact frame contains one pose while its current label describes a comparison. The adjacent pressed pose button already exposes selection, so this is not a blocking accessibility finding.

**Motion.** `Release` uses the shared visibility/document/manual-preference/reduced-motion gate. Ambient gears, cargo, press, arm and attention rings are paused until that gate permits them. Reduced-motion CSS disables animation and transitions, and manual pause disables transitions as well. Non-completion scenes explicitly stop their machinery. There are no per-frame React state updates in these studies. The timing needle transitions on selection only when motion is permitted. Paused poses retain all decision-relevant facts in source.

The footage is user-started, without autoplay, with its own native controls. It is independent of the decorative-motion switch; do not claim the global “Pause motion” button pauses video playback. Changing source recordings remounts the video, so an old recording is not left playing invisibly. A later runtime check should confirm these expected behaviors.

**Delivery.** Only the selected video is mounted and `preload="none"` is set. Explicit video width/height preserves its source ratio. The poster currently uses the 800-pixel WebP variant, roughly 29 KB for either record, so it is modest even on phone; it is not a multi-megabyte source master. The SVG studies do not add raster downloads. Actual selected resources, requests, load timing and layout stability remain production-browser questions.

## Focused rendered pass to request next

Capture the exact production build, not the earlier accepted foundations build:

1. Desktop opening through the video title and selectors; one frame for each recording showing its visible date and full source-frame treatment.
2. Desktop Release default Completion state, then body comparison and one timing failure; include title, controls, result text and caption where possible rather than cropping only the artwork.
3. At 390 pixels, corrected Support view for both pose selections; at 320 pixels, the full top-level selector row, a complete body drawing, and the longest source caption.
4. At 320 pixels, Timing slow-tail failure and Average-speed pass, including the complete workload label and observed/limit readout. The pass must remain visibly scoped to that metric.
5. One representative keyboard sequence across changed controls, a phone selection, tooltip open/Escape dismissal, and paused/reduced-motion state. Parent-reported interactions and independently inspected pixels should be recorded separately.

There is no need to retest every unchanged custody fact or replay the entire game to judge this chapter's explanatory layout. The actual video must still play and both source links must resolve; screenshots alone cannot establish those actions or motion quality. Initial-media loading, offscreen suspension and console state should be reported from the production browser at their actual tested scope.

## Scope boundary

The writing acceptance remains intact. This source review accepts the teaching roles, placement and visual plan, identifies the two limited repairs, and prepares a precise rendered check. It does **not** certify the new composition, phone rendering, native video controls, assistive technology, actual motion gating or production performance. Those await the promised captures and interaction evidence.

## Rendered review and final visual verdict — 27 October 2026

**ACCEPTED for the reviewed explanatory design and supplied rendered states. No remaining material issue found.**

Inspected these new captures with `view_image`:

- `01-outcome-320.png`: the default Completion view retains the press, three outputs, selected controls, complete result and source/caption. The top-level controls and secondary state choices wrap legibly; no visible horizontal clipping affects the information. The retained-card rail remains a secondary state example.
- `01-support-320.png`: Rejected lunge / Support is selected. The entire support ring is visible, including its lower arc, with both feet readable. The schematic qualifier, pose selectors, feature selectors and interpretation are clear. This closes the identified compact-crop defect for the captured pose. Both compact source view boxes now end at y=405, so the same ring extent is protected in the other pose as well; that other pose was not separately captured here.
- `01-timing-768.png` and `01-timing-desktop.png`: the slow-tail reading shows 47.6 ms against a 33.333 ms maximum, an explicit FAIL, the acceptance arc/limit mark and the summary-measurement qualification. Controls, readout, source and caption have clear hierarchy. Neither frame shows an overlap or clipping problem.

The timing captures still contain the older SVG “TWO COMPLETE DAYS” label. I checked the saved source: its SVG now says “TWO DAY 1 RUNS,” and the compact HTML says “Two complete Day 1 runs.” The requested evidence-label correction is therefore complete in source. These images must not be catalogued as proof that the new words were already rendered. A further full visual sweep is not required for this short label replacement.

Root reports no horizontal overflow at 320, 768 and 1440 pixels; the supplied frames are consistent with that report. I did not run the browser or independently measure overflow. These captures do not show the opening footage, Average-speed selection, Selected-correction pose, tooltip, keyboard navigation or reduced-motion state. The earlier source-level assessment of those unchanged mechanisms remains the basis for those parts of the design; this addendum does not invent rendered or interaction coverage.

The chapter's visual teaching is accepted: actual footage introduces the creative correction, while the release explorer keeps outcome, action and performance judgments distinct. The writing acceptance remains unchanged. The supplied targeted rendered evidence and verified source repairs close this critic's outstanding visual findings; no new graphic or further redesign is requested.
