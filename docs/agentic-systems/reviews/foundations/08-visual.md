# Chapter 8 — dedicated visual review

27 October 2026. Independent critic `foundations_critic_08`.

## Scope and current verdict

**Source/design review: one semantic clarification required. Rendered visual acceptance remains pending.**

Reviewed the installed Chapter 8, `ParallelWait.tsx` and its CSS, `PerformanceComparison.tsx`, `StallMap.tsx`, their common performance CSS and retained data, the reader's figure composition, term notes, motion controls, shared motion/visibility hook, and compact-viewport hook. No browser was used, as instructed. No application files were edited. Desktop/phone appearance, real control operation, and computed motion behavior are not inferred from source.

The previous editorial acceptance remains valid for the argument and authored numerical mechanism. This dedicated pass checks how that mechanism is visually encoded and how the chapter's figures work together.

## One source-level blocker

**Label the ParallelWait track encoding before visual clearance.** Each worker's track is the same 12-second width; the fill is `elapsed / 12`, and the small endpoint marks that worker's authored finish time. This is a shared time scale, not individual percentage completion. There is currently no visible axis or legend explaining that encoding. Consequently, a completed two-second investigation has a green bar occupying only one-sixth of its track, while an unfinished slow investigation can have a much longer bar. The Ready/Canceled text supplies status but does not explain what bar length means.

A compact visible scale/legend is enough: **“Each track spans 0–12 seconds. Marker: this investigation's finish time.”** An aligned 0/6/12-second ruler would be stronger if it remains readable on a phone. Keep the authored endpoint rather than changing the bars to percent completion: the common scale is useful for the dependency story once named. This request concerns the semantics visible to the reader, not the accepted arithmetic.

## Distinct concepts and sequence

| Visual | Specific job | Distinct contribution |
| --- | --- | --- |
| ParallelWait | Shared input → six independently finishing questions → synthesis → released brief | Explains why five completed findings can coexist with a waiting recipient; separates release, cancellation, and consumed work. |
| PerformanceComparison | Two recorded variants, one selectable measurement, a limit, exact readings | Shows why an acceptable average cannot substitute for the complete timing protocol. The earlier matched opening also makes successful preservation of visual value inspectable. |
| Retained opening screenshot | A dated concrete specimen of the earlier optimized scene | Identifies what the measurement protected and anchors the case in an actual artifact. It is not additional statistical evidence. |
| StallMap | Long-frame event location, zoom, shot filter, event receipt | Narrows where an investigation should begin without presenting correlation as a cause. Its purpose is localization, not another before/after comparison. |

This is a coherent set rather than three versions of the same chart. The authored AI workflow now leads, with graphics performance as a case at the consuming end. The shared source snapshot and receiving document also give the new model a production-work identity without implying that the six factory characters run language models.

The early authored model and measured comparison are adjacent figures. That could make a long visual interval on a phone, but the concepts are distinct and the second caption explicitly names the change of evidence. Assess the rendered pacing before adding prose or another decorative transition.

## Chronology and evidence boundaries

The present prose distinguishes three recorded workloads: the failed completed day on 26 October, the earlier successful matched opening optimization on 21 October, and the separate failed opening /12 used by the stall map. The screenshot caption also pins the earlier before-the-shift/5 specimen. The comparison offers the two recorded pairs as explicit workload choices, with separate contexts and complete-protocol status.

The stall data contains 28 long-frame events, with 15 in Passage; the first-minute selection contains 15 events. The y-range covers the retained 101.7–213.5 ms events. The actual event records, the deliberately omitted ordinary frames, the 30-second warm-up note, and the failed-run boundary remain visible in the component or its note. No duration, event-count, or sequence contradiction was found in source.

The authored model explicitly excludes acquisition timing, model speed, and finding quality. A partial brief at 7 seconds holds five findings after a 6-second cutoff and one-second synthesis. Its late sixth finding does not rewrite the release. These restrictions are visually relevant because they prevent the model from borrowing the authority of the measured charts that follow.

## Titles, prose, captions, and notes

- **ParallelWait:** the figure title supplies the initial dilemma, the controls let the reader alter its resolution, and the caption names assumptions. The preceding prose explains dependencies. Their jobs overlap naturally without merely restating a number. The initial title matches the default six-second state; it remains a scenario headline when the clock changes, rather than a live status claim.
- **PerformanceComparison:** “The average is not the experience” and the figure title repeat the theme, but the chart makes the difference inspectable. The caption now describes real workload/metric controls. The context and limits inside the chart should remain because selected workloads change them. The next prose interprets the refusal to discard scenery rather than duplicating every reading.
- **StallMap:** the title is evocative, the caption explains what blank space does and does not mean, and the prose identifies the failed specimen and the 15-of-28 concentration. The selected-event receipt adds phase/time detail; the note explains measurement zero. These are separate layers, not redundant recitals.
- The new source/effort/cancellation notes contain genuinely additional assumptions. Their placement in supplementary controls is appropriate because the main result remains understandable without opening every note. Keep the scale explanation above visible, however; it defines the central visual encoding and should not be hidden in a note.

No title/prose/caption rewrite is required beyond the new scale clarification.

## Quality and semantic clarity from source

ParallelWait uses the chapter's ink, paper, green, and brass palette; shared-source and receiving-document shapes distinguish entry from output. Worker identity and status have text, so green/brown alone does not carry completion or cancellation. The scale clarification is necessary to make its six small tracks an explanatory timeline rather than ambiguous progress indicators.

PerformanceComparison preserves exact numbers and definitions alongside the graph. The average has a minimum threshold; the slow metrics have maxima. Both variants are simultaneously visible, and the full table is available. Compact mode replaces in-graph names with A/B while keeping named readings below. The reader must still be able to associate those at the rendered phone size; source organization is suitable but does not establish visual success.

StallMap gives numerical axes, units in surrounding text, selected-event status, an explicit empty result, and a categorical shot filter. The visible selection resets appropriately when the filter/window changes. Its moving marker follows a selected retained event rather than pretending to be a continuous recording.

The richer recorder/desk drawings in the older pair establish a family resemblance, while the new figure is closer to a structured working sheet. That difference is defensible because the new visual has six simultaneous dependencies to read. Whether its density feels crafted and legible rather than like a tall generic form requires the forthcoming screenshots; it cannot be accepted or rejected from CSS alone.

## Animation and reduced-motion gates

All three studies begin with `data-playing="false"` and use the shared `useLivingPlate` hook. That hook requires viewport intersection, enabled persistent motion preference, a visible document, and no reduced-motion preference before setting the flag to true. It listens for preference/visibility changes and disconnects observers/listeners on cleanup. If the observer API is unavailable, the initial still state remains.

The new figure's pulse uses opacity/scale and is paused unless the flag permits motion. It is an activity cue; clock progression remains explicitly controlled by the reader. Fill-width and receiving-background transitions are bounded interaction effects, not per-frame React updates. The still flag removes them, and the reduced-motion rule independently disables the pulse and transitions. All labels, fill extents, endpoints, current time, release status, and work accounting remain in the static state.

The existing recorder reels, bar transitions, selected-event cursor, and event-receipt entrance are gated by `data-playing`. Their common stylesheet disables animations/transitions under the still flag and under reduced motion. No timer or loop advances component state. Decorative reel movement is a recording motif rather than a new metric; it should not be interpreted as elapsed-run playback.

**No source-level motion-gating blocker found.** This is an implementation-path assessment, not a test of actual browser preference propagation or viewport behavior.

## Evidence still required for final visual judgment

Root's live pass should supply actual screenshots/control evidence for:

1. ParallelWait at its initial 6-second all-findings state, 7-second partial state, 12/13-second late/full states, and partial cancellation; inspect the scale clarification and 25/26/31 worker-second accounting.
2. The new figure at desktop and 320/390-pixel widths, with no cropped worker labels, note triggers, status text, or offscreen controls. Check that a reader can associate a clock change with its result on a phone.
3. PerformanceComparison's two workloads, average/long-pause contrast, all-readings disclosure, and compact A/B association.
4. StallMap's enlarged Passage view, a selected event, and a zero-event selection, with readable compact axes and consistent receipt content.
5. Keyboard focus, note opening/dismissal, global pause, reduced-motion and offscreen/hidden-state behavior. Still states must preserve the complete explanation.

Initial inspected fingerprints:

- Chapter 8: `c90f22076a4dcc8f5c8030856eb50dac6939a541f8788b8816ec3abb40a95655`.
- ParallelWait: `dd3a67e76a0e1481cbcefeaee948f40e1ea01333bc2ccb4a9f5b7754bc4efbf2`.
- ParallelWait CSS: `eb0267a5ed4f68a33269b45041da42d81653d7876d934f41569f3b68ad733c4e`.
- PerformanceComparison: `ff9b94aecff4b34c87167ff209823959a9c4f0b51f2ced99290e2dae45d77ecf`.
- StallMap: `49d9a529f7fff33a5527e28da25f355ee0c6436297ef89164e9fe4ddf5c95c42`.
- Performance CSS: `78b6a132a40846ccf45cf4391588b731e2f0631cc365d96b65723721c9081c5c`.
- Shared motion hook: `31db3e977dfe023b127e2d31cc31841cce84161e06e8aff83c0b96a8efa4ec47`.

---

## Rendered-image review — first supplied captures

Inspected all ten `/tmp/agentic-foundations-visuals/08-*.png` files directly with `view_image`, without opening a browser. The coordinator supplied actual CUA interaction observations separately. These are distinct evidence sources: composition findings below are my inspection of pixels; the live operation statements are attributed reports.

**Current rendered verdict: BLOCKED on two bounded 320-pixel composition repairs, with a corrected stall-map capture also needed.** The shared-scale semantic blocker is closed. No model, narrative, or desktop redesign is requested.

### Shared scale and desktop composition accepted

The new visible ruler reads **0 s / Shared timeline · marker = finish / 12 s** and aligns with the worker tracks. It makes the shorter completed bars understandable as elapsed duration rather than incomplete progress. The desktop screenshot has a clear hierarchy: policy controls, run time, shared snapshot, six connected questions, and a receiving document. Thin borders, restrained green/gold status colors, and the source/output paper shapes make this a deliberate working instrument rather than a generic collection of cards. The long sixth track supplies the visual exception the title promises.

The partial-at-seven and canceled-at-thirteen captures make different consequences legible. In the former, the sixth investigation is still running, the paper turns active, the brief declares five of six findings, and consumed effort reads 26 worker-seconds. In the latter, the sixth lane says Canceled, the shorter brown interval remains, the partial brief preserves its declared gap, and effort is 25. The controls and output are close enough in these desktop crops to compare the effects. The caption separates authored timing from measured performance. The transition to the measured comparison has adequate whitespace and a distinct title; the adjacent figures do not visually collapse into one experiment.

### Phone composition and required corrections

At the supplied 390-pixel view, the policy buttons, shared source label, scale, and first lane fit. The source note moves to its own row, and the open cancellation note has readable text and comfortable internal padding. The general phone layout uses vertical space deliberately rather than shrinking the desktop graphic into unreadable miniature text.

At 320 pixels, however, two parts become unnecessarily cramped:

1. In `08-timeline-320-top.png`, **13** and **s** split onto separate lines in the run-time header. The number/unit should remain one typographic object. Make the clock `white-space: nowrap` and prevent it from shrinking; allow the descriptive header beside it to wrap instead.
2. In `08-timeline-320-bottom.png`, the receiving panel retains a side-by-side document icon and text even though the remaining text column is very narrow. “Waiting for all six findings” occupies three lines, and the explanatory sentence becomes a tall stack of short fragments. This is visibly more cramped than the surrounding controls and caption. At the narrow breakpoint, stack the decorative document above the text or remove that icon so the receipt uses the available width. Preserve its status, coverage, and missing-evidence wording.

These are modest responsive-layout corrections, not a request to compress the entire diagram. The six-worker structure is worth keeping. Reinspect the 320-pixel header and receiving result after repair, ideally with a released partial result as well as the waiting state.

### Existing figures and screenshot identity

`08-pauses-320.png` visibly shows the earlier-opening comparison, the Pauses over 100 ms selection, two bars, and the 31-versus-4 readings with a threshold line. Its compact chart is legible in the captured region and the large controls fit the page. The lower portion is cut by the viewport, so this is not a complete figure capture.

Two filenames do not match their actual pixels:

- `08-average-320.png` shows ParallelWait's lower controls at 2 seconds, not the average-rate comparison.
- `08-stall-320.png` shows the same earlier-opening pause comparison as `08-pauses-320.png`, not the stall map.

Accordingly, I have not visually inspected a new stall-map capture in this pass and cannot claim that the supplied images demonstrate its rendered Passage or empty state. The coordinator's control report remains usable as attributed interaction evidence; it does not change the contents of these images. A correctly targeted compact stall-map screenshot is requested. An average-rate screenshot would also complete the intended visual comparison.

### Live interaction evidence reported by the coordinator

The coordinator reports actual CUA operation confirming: default six-second waiting state with 25 worker-seconds; partial release at seven seconds with five of six findings and 26 worker-seconds; late completion at thirteen with the same partial brief and 31 worker-seconds; cancellation with a Canceled lane and 25 worker-seconds; complete release under the all-results policy at thirteen; no horizontal overflow at 390/320; note opening and Escape dismissal; global Pause setting `data-playing=false` and Enable restoring true when visible; comparison metric/workload changes; Passage/first-minute selection with 15 events and Approach with an honest zero-event state.

These observations support the earlier source-mechanism review. The coordinator did not emulate the OS reduced-motion preference or hide the browser. Offscreen, hidden-document, and OS reduced-motion paths therefore remain source-inspected, not live-tested. No field/device-performance claim is made.

Current source fingerprints after the shared-scale repair:

- `ParallelWait.tsx`: `be833568c9fb8a30384aeff5b63ccc7b20b461cc89b6d19e8788178832c00479`.
- `parallel-wait.module.css`: `1a7e869936e5984f0760be93a514ce8ffb715efe38e9762f6a1d54fc9185db87`.

The earlier editorial and authored-mechanism acceptance is unchanged. Final rendered acceptance awaits the small mobile layout repair and corrected image evidence identified above.

---

## Final rendered clearance after narrow-screen repair

Directly inspected the four replacement captures with `view_image`:

- `08-timeline-320-repaired-header.png`
- `08-timeline-320-repaired-receipt.png`
- `08-average-320-correct.png`
- `08-stall-320-correct.png`

Also verified the installed CSS repair. The replacement average/stall files supersede the earlier mistargeted filenames; the original findings remain above as review history.

**Final rendered visual verdict: ACCEPTED within the documented evidence scope.** The new timeline's desktop, 390-pixel, and repaired 320-pixel composition is accepted. The shared scale is legible, the result remains semantically complete, and the existing comparison and stall visual have distinct, useful jobs. There is no remaining visual correction from this critic.

The repaired header keeps the clock value and unit together. The CSS prevents wrapping and shrinking, including for two-digit values. The repaired receipt gives the result text the full available width by removing the decorative document icon only at widths of 360 pixels or less. In the captured 13-second partial state, “A partial brief is released” reads as a heading rather than a compressed column; the five-of-six count and deliberately missing conflicting report remain readable. The late-finding lane above it makes the distinction between completed background work and an unchanged released brief directly visible. The clock's visible keyboard focus ring is clear. These changes improve the composition without weakening the explanatory model or flattening the desktop design.

The corrected average screenshot shows both compact bars, the 30-FPS threshold, 36.686 and 33.17 FPS values, the delivered-day context, and the beginning of the named A/Minimal reading. Together with the previously inspected earlier-opening pause comparison, the visual evidence now supports the intended average-versus-tail distinction. The compact A/B treatment preserves a readable graph while named readings follow immediately below it.

The corrected stall capture shows the actual Passage/first-minute selection: the complete compact plot, readable 100–250 ms and 0–60 s axes, the concentration around 30 seconds, the “15 of 28” count, omitted-ordinary-frames note, event selector, and the start of the selected 107.5 ms receipt. The graph is contained within the phone page. Its density is appropriate to locating the consequential interval; it does not obscure the event selection or imply a continuous frame trace. This resolves the prior missing-image evidence.

Final verified fingerprints:

- `ParallelWait.tsx`: `be833568c9fb8a30384aeff5b63ccc7b20b461cc89b6d19e8788178832c00479`.
- `parallel-wait.module.css`: `33d56ee053f96d6849fb9db4dfc1ef38753de3ca356db1c0af57499f3cb2f064`.
- `PerformanceComparison.tsx`: `ff9b94aecff4b34c87167ff209823959a9c4f0b51f2ced99290e2dae45d77ecf`.
- `StallMap.tsx`: `49d9a529f7fff33a5527e28da25f355ee0c6436297ef89164e9fe4ddf5c95c42`.

This clearance combines my direct screenshot inspection and source review with the coordinator's attributed actual CUA interaction checks listed above. I did not operate the browser. OS reduced-motion emulation and hidden-browser behavior were not live-tested in this pass; those paths were inspected in source. Field performance, device performance, production delivery, and whole-book acceptance remain outside this chapter's visual verdict. The prior editorial and authored-mechanism acceptance also remains in force.
