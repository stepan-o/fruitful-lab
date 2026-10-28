# Chapter 9 — source review before rendered acceptance

Reviewed 27 October 2026. Read `ResourceLedger.tsx`, `resource-ledger.ts`, `CommissionDesk.tsx`, the commission model, shared closure styles, compact-layout hook, motion gate and `TermNote`. No browser driven. This is a source/idea review; **final visual acceptance remains pending captures and interaction evidence**.

## Current judgment

No accounting or interaction-state blocker found in the new source. The later focused account is now the default, zero rows are handled safely, the enclosing day is clearly labeled as containing the focus, and the historical retrospective retains its own method. The missing-account caveats have moved into visible ordinary text outside the mobile crop. The bounded creative commission is now the default and fits the chapter's argument.

The preserved cabinet remains an attractive number display; the stacked bar and role bars carry the actual quantitative comparison. Whether their hierarchy works on a phone, and whether the whole figure is too tall relative to its explanatory return, cannot be accepted from source alone.

## Small improvements before captures

### 1. Make rescaling across windows explicit

`ResourceLedger.tsx`, role-chart explanation: “Categories use separate scales.”

The maximum is recomputed for both the category **and the selected window**. The displayed maximum makes the math inspectable, but the prose should name both so readers do not infer a common absolute scale when switching from focused to day.

Suggested copy:

> Each window and category is scaled to its largest role. Common zero; longest bar = [value]. Select a row to inspect its account.

This is a minor accounting-clarity refinement, not an arithmetic failure. The composition bar is correctly a within-account percentage display.

### 2. Include the selected window in the cabinet's accessible name

`ResourceLedger.tsx`, SVG `aria-label`, currently begins with role/category and quantity but omits the selected period. The same role/category label can describe three materially different accounts. Add `account.label` or `account.period` so the image is intelligible when reached separately through a screen reader's graphic navigation.

Likewise, adding the short window label to the live receipt would make window changes clearer to a screen reader without requiring a large announcement. This is useful but should remain concise; do not make the full methodology a live region.

## Accounting and control-state findings

- `windowIndex=0` correctly chooses the 25 October 16:00–23:50 UTC focus. The first selector visibly states the period and overlap relationship before the number display.
- Changing the window resets the role to the all-role aggregate. This avoids accidentally retaining an index into a differently ordered historical role list.
- The data mapping correctly uses uncached input, cache reads and output as three disjoint fields. The sum of those fields matches `combined`; reasoning is not added again.
- Aggregate counts sum input-bearing requests for the two later accounts. The earlier account uses observed sessions and labels them accordingly. These should not be represented as the same measure, and the current UI does not do so.
- Role-specific medians include cache and are displayed only where available. There is no invalid average-of-role-medians aggregate.
- `resourceShare` returns zero for an empty account. Writer and several other roles therefore render an empty composition without `NaN`, and the text explains “No counted use.” The zero note also avoids inferring no prior work or no external cost.
- Role bars use a shared zero and explicit dynamic maximum. Their lengths do not claim token-to-outcome attribution or a waste proportion.
- The visible bottom note lists Root, independent review, owner attention and later work as excluded; money and tails remain unknown. This fixes the previous dependence on a strip cropped out of the compact SVG.
- The three optional notes are supplementary. Essential accounting boundaries remain visible without opening them.
- Sources switch with the account, while later outcomes stay a distinct link. The selected-window model owns its method and boundary instead of the component silently reusing the old historical text.

## Responsive and semantic assessment

Source supports the intended layout: controls collapse to one column below 600px, role bars become two-line rows, action buttons stack, and the exact table is intentionally scrollable rather than widening the whole page. Exact values remain visible when percentage labels are hidden on small screens. Cabinet text is duplicated in larger ordinary text, so the illustration is not the sole carrier of meaning.

The first compact render is selected after hydration through `useSyncExternalStore`; the server snapshot is wide. Check for a visible resize/layout jump on a phone. This is a verification point, not a demonstrated regression.

Native labeled selects, pressed-state role buttons, a politely announced receipt, semantic details/summary and a captioned table provide reasonable keyboard and assistive-technology structure. The shared notes support focus, click, Escape and outside dismissal. Their panel positioning and the long historical timestamp still need actual 320px inspection.

Buttons/selects are at least 46px high in these styles. Focus outlines are present. Exact-table headers could additionally use `scope="col"` and role headers `scope="row"`, but the simple table is not a blocker on that basis.

## Motion assessment

The motion gate observes visibility, document hidden state, the persistent manual preference and reduced motion. CSS stops both animations and transitions when disabled; the reduced-motion media query supplies an independent stop. The visuals remain complete when static. The animations are brief transforms/opacity/width changes, with no frame-by-frame React updates or continuous background work.

The gear/paper remount keys do not contain the window index, so selecting a different account with the same role/category may update the number without replaying those ornamental animations. That is harmless and does not need repair. Verify actual pause/reduced-motion behavior in the rendered route rather than expanding animation merely for consistency.

## Commission fit

The initial example is now a bounded correction of one readable action. It preserves accepted work, requires an ordinary-speed integrated view, keeps numeric checks subordinate to creative judgment, gives reusable tooling an expected next use, and defines a stop after the first integrated view. It explicitly does not reopen the studio.

Unassigned authority and resources are visible as draft material. “8/8 text filled” and “DRAFT · NOT DISPATCHED” do not imply approval. Loading an example is a separate button from selection, and the notice says it replaces prior page edits. The download promises a Markdown draft, not execution. The chapter and tool now agree about what the reader is making.

## What captures and interaction evidence must settle

1. At 320px, inspect the default focused account from selector through exclusions. Dates, overlap warning, long numbers, role labels and the tiny output slice's text value must remain legible without page overflow.
2. Inspect day and earlier-window states. The 342.86M day and 565.68M historical total must have unmistakable period labels; the long older timestamps must wrap safely. Confirm selected-source links resolve to the intended account.
3. Inspect a zero-use focused role and an Engine/Producer role with a median. Verify the empty-state explanation, median units and dynamic maximum label.
4. Inspect the commission's default specimen and a later section at phone and desktop widths. Verify the section title, field text, draft status and actions remain visible; test keyboard section changes and actual downloaded contents.
5. Check focus, term-note dismissal/positioning, exact-table access, reduced motion and persistent pause on the actual chapter route.
6. Review the figure sequence as a reader: the preceding ReleaseManifest should establish selected work, excluded experiment and failed performance before the ledger explains observed activity. The composition should connect those ideas without suggesting that individual token amounts have been allocated to each outcome.

Do not mark the visual accepted solely because the build succeeds or these source checks pass. Await the parent-provided renders and interaction observations.

## Rendered review — initial captures

Inspected all six parent-provided captures in `/tmp/agentic-team-efficiency-visuals/`: `09-ledger-desktop.png`, `09-ledger-320.png`, `09-zero-320.png`, `09-median-320.png`, `09-note-320.png` and `09-commission-320.png`. Also confirmed that the latest source adds the selected account/period to the SVG accessible name and explicitly names window-and-category rescaling. Both earlier source recommendations are resolved.

The default desktop and 320px compositions have a clear hierarchy: window first, the non-addition warning, role/category controls, then the cabinet and detailed receipt. The narrow cabinet crop is intentional and readable, and its essential numbers are repeated in larger text. The supplied narrow captures show no page-level horizontal clipping. The 151,978-token median, per-role counts, exact legend values, role buttons and updated scale description wrap legibly. The supplementary note fits inside the viewport with readable text and visible margins. The commission's edited useful-difference text appears in its complete-sheet preview; the preview wraps rather than widening the page, and download controls remain usable in the shown layout.

The parent reports browser verification of all three windows with role reset, Writer zero with no NaN/Infinity, Producer's 151,978 median, tooltip opening/Escape dismissal, and a creative-commission edit reflected in the complete sheet. I treat these as parent-performed interaction checks, not independent browser tests by this reviewer.

**One final visual confirmation pending:** the zero and Producer composition screenshots appear captured during the existing 0.7-second width transition. The zero image still contains a yellow segment despite all values being zero; the Producer image leaves substantial unfilled space despite its components totaling 100%. The source's share calculations are correct and the transition provides a plausible explanation. Requested settled zero and Producer captures after at least one second idle, or with reduced motion, before final bar-state acceptance. No code correction is requested unless those settled states remain wrong.

Limitations so far: the supplied screenshots are development captures (development indicator visible), not production cold/warm or field-performance evidence. They do not establish actual download contents, screen-reader output, keyboard access to the exact-account table, manual-pause persistence or reduced-motion behavior. The screenshots also do not cover the entire chapter's release-manifest/ledger/commission sequence or every viewport. Those boundaries remain explicit; no wider claim follows from the inspected images.

## Final rendered acceptance — 27 October 2026

**Accepted within the reviewed visual and interaction scope.** Inspected `09-zero-settled-320.png` and `09-producer-settled-320.png`. The zero account is now an empty composition with all three values at zero and a clear explanation. The Producer account fills the composition correctly: cache dominates, with the small uncached and output portions supported by exact legend values. The total, 151,978-token request median and selected role remain readable at 320px. The earlier incomplete bars were transient animation frames, not incorrect settled states.

The parent's reported settled inline widths—Writer 0/0/0, Producer approximately 1.81815/97.7907/0.391131 percent—agree with the audited values and inspected results. No further source or visual correction is requested for the ledger/commission revision.

This closes the outstanding chart-state issue. Acceptance covers the inspected desktop/default and 320px states, source-reviewed semantics/motion gating, and the specific browser interactions reported above. It does not convert development captures into production performance evidence, certify untested downloads or assistive-technology behavior, or independently verify the entire chapter sequence and every viewport. Those remaining limits are unchanged.
