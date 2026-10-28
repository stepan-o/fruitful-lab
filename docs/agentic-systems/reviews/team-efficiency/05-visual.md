# Chapter 5 visual-design review

**Status: source/design pass and supplied 320-pixel capture review complete. Accept the visual structure and observed mobile layout, with the specific capture and behavior limits below.**

No browser was driven. No repository files were edited. This review covers the current Chapter 5 manuscript, the five interactive studies, their styles and figure notes, the shared tooltip and image inspector, and the shared motion gate. It follows `docs/DESIGN_AND_PERFORMANCE_STANDARDS.md`.

## Visual argument

The retained visuals earn their place. I would keep this set rather than add another large illustration.

| Anchor | Distinct job | Assessment |
| --- | --- | --- |
| Retained balloon before/after | Establish an actual, bounded integration repair | Strong evidence anchor; preserves the distinction between exposing an existing face and commissioning new acting. |
| Composition stage | Make camera distance, visual separation and text placement tradeoffs inspectable | Appropriate interactive comparison. Its turn controls make the unit an exchange rather than an attractive silent frame. |
| Frame allocation | Show a layout rule changing the space left for the picture | Related to composition, but not redundant: the first changes staging inside a picture; this changes the picture's available container over time. The chosen 50/50 versus 75/25 allocations and their limitation are disclosed. |
| Operator's desk / MDA | Let the reader experience information having a cost and changing a later choice | Moving this into Chapter 5 strengthens the chapter. The changed rules, resulting strategy and intended uncertainty make MDA concrete; no additional generic three-box diagram is necessary. |
| Retained departure pose | Establish the gap between valid asset structure and recognizable action | Useful authentic interruption before the authored movement study. Caption keeps pose judgment separate from unobserved motion. |
| Contact stage | Hold the reaching hand's path constant while changing the surrounding performance | Distinct from both Chapter 4's temporal sampling and the following shared-contact study. It asks what a correct trajectory means, not merely whether the viewer saw it. |
| Release score | Expose a dependency between two actors, expressed as action order | A useful final expansion from one body's performance to a relationship that two crafts must preserve. |

TF2 and CrafTeam do not need extra decorative imagery here. The silhouette mode already supplies an authored visual bridge to the TF2 discussion. CrafTeam's relevant contribution is the bounded finding about human orchestration, not a measured comparison that deserves a chart.

## What the source supports

- Core buttons are at least 44–46 CSS pixels high; Player's action controls are larger. Focus styles and `aria-pressed` states are present.
- Frame allocation stacks at 650 pixels; Contact's six beat choices become two rows; Player moves its controls below the scene at 600 pixels. The intended mobile treatments preserve the conceptual comparisons rather than dropping them.
- The tooltip is available by hover, focus and click/tap; it supports Escape and outside-pointer dismissal. Its fixed panel is bounded to the viewport and can scroll. This is source evidence only, not confirmation of placement or touch behavior in the built page.
- The shared motion gate checks intersection, document visibility, reduced-motion preference and the persisted manual preference. CSS owns animation; these studies do not update React on every frame.
- Contact offers beat buttons and a slider, so its essential comparison remains available without playback. Player has textual feedback and ordinary-text counters outside the SVG. Release score is usable as a sequence of still poses.
- Evidence images open an on-demand native dialog with fit/detail modes and a scrollable inspection region. The new captures should verify dismissal and focus restoration on the actual route.

## Resolved editorial improvement

The Contact study's internal note now asks the reader to compare preparation, pressing and settling, while its external caption owns the controlled hand-path statement. The supplied capture shows this change. The caption/prose/instrument duplication is resolved.

## Original capture checklist

1. **Player on 320/390 pixels, after Inspect:** its SVG is 650 units wide, so labels such as GUIDE and CONTROL WINDOW become very small at phone width. Ordinary text supplies the diagnosis, but verify that the actual guide, reaching hand, control and delivered tray remain recognizable; otherwise enlarge/reframe the mechanism for phones or move essential labels outside the SVG. Do not solve this by adding another paragraph.
2. **Composition and allocation on phone:** verify readable inside-picture speech, no clipped controls, and that the feet/control disappear only in the intended reactive-layout condition. A static screenshot of the silent initial state is insufficient.
3. **Contact and release at their meaningful middle beats:** compare arm-only/whole-body at Prepare or Press and both release orders at First change. Initial stills cannot establish whether the controlled comparisons are visibly distinct.
4. **Tooltip and motion:** capture one opened note near a viewport edge at 320/390 pixels; confirm Escape/outside tap. Check Contact's manual playback, pause/resume, offscreen behavior and still controls under reduced motion. Confirm the desk's diagnosis remains complete with motion off.

**The original source pass did not certify rendered states.** The observations from the subsequent captures are recorded separately below.


## Supplied capture review

Inspected the nine `/tmp/agentic-team-efficiency-visuals/05-*.png` files directly, including the corrected arm-only capture and the additional close/rail composition capture; no browser was driven.

- **Player after inspection:** the obstructed guide, operator, control and output tray remain recognizable at the supplied phone scale. The in-drawing micro-labels are too small to serve as primary text, but the complete ordinary-text diagnosis immediately below (“A crate is wedged against the guide. The operator reaches the button on time.”), action labels, three remaining turns and zero deliveries carry the relevant meaning. I do not require a mobile redraw for this state.
- **Composition:** the wide-room view makes the occlusion visible, and its controls, state selection and explanation fit cleanly. The actual in-picture line is deliberately tiny at this scale. The additional close/rail capture shows the corrected reading arrangement: the whole sentence and speaker/recipient label are readable in ordinary text below the scene. The figures remain low-contrast because the separation control is off; the source supplies the independent separation toggle. The pair establishes the problem and the readable rail treatment on the phone.
- **Allocation:** the two stacked 50/50 and 75/25 panels communicate the difference clearly. The former hides the feet; the latter preserves the bodies and visible control. The instruction is readable in both. The supplied state earns the second study's place beside composition.
- **Contact:** the Prepare state is legible, with usable slider, beat buttons, playback control and labels. The initial arm-only capture incorrectly selected the body version; the supplied replacement resolves that evidence mismatch and visibly selects “Move the reaching arm.” Both now show the intended 20% still. Their visual difference at Prepare is subtle, which is consistent with the small preparatory body displacement in the source; these images should not be presented as proof of a conspicuous performance contrast or of continuous movement quality. The source makes the body participation larger at arrival/press, and the parent separately checked selection of the Press still.
- **Release ordering:** the first-change states visibly distinguish a withdrawn support with Bob still lowered from maintained contact while Bob rises. The statuses and drawing support the same distinction. This is an effective small-screen anchor for the cross-component dependency.
- **Tooltip:** the support-interval note is fully contained within the phone image, uses readable ordinary text and adds the important distinction between a target relationship and simulated physical support. Its overlay is temporary and does not obscure the action's definition permanently.

The parent separately reports: no horizontal overflow for the tested states; Escape dismissed the note (zero remaining tooltips); Contact playback followed by selecting Press yielded the 58% still and stopped playback. Those are attributed interaction checks, not inferences from the still images.

### Final disposition and limits

**Accept the current visual argument and the mobile layouts shown.** No material visual redesign is indicated by these captures. The source-caption duplication is fixed, the arm-only capture has been corrected, and the added close/rail capture establishes the phone dialogue treatment. There is no remaining capture request for this bounded pass.

This pass does not certify desktop/390/768 rendering, uninterrupted animation quality, manual pause/resume, offscreen or reduced-motion runtime behavior, image-inspector focus restoration, responsive-image bytes, or loading performance. The source supports those intended behaviors in several places, but the supplied stills do not establish them.
