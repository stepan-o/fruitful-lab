# Chapter 8 — separate visual review

Writing was accepted before this pass. Scope: the three interactive studies (`ParallelWait`, `PerformanceComparison`, `StallMap`), opening-performance evidence, and shared presentation/accessibility source. No source edits or browser control by this reviewer. Rendered captures are pending from the parent reviewer.

## Source review

The visual sequence supports distinct decisions rather than repeating a single graphic: a six-worker timeline separates recipient wait from total effort; a measured comparison exposes the difference between average rate and interruptions; the retained event map locates a consequential interval without assigning a cause. The earlier matched opening and later delivered-day records remain separate. The screenshot documents the retained scene and historical performance specimen; it is evidence, not another synthetic comparison.

The timeline's arithmetic preserves its stated contract: five findings exist at 6 s; synthesis permits the partial brief at 7 s; all six permit completion at 13 s. With a partial issue, the late finding does not silently enter the released brief. Cancellation caps the late investigation at six worker-seconds, while leaving it running preserves the eventual finding and spends more effort. Durations are explicitly authored.

Source supports keyboard-operated native buttons, range and selects; visible focus; text equivalents for chart values and the selected event; responsive control stacking; and a table for all comparison readings. Control heights meet the 44-pixel target in the relevant styles. Shared motion gating respects offscreen, hidden-document, reduced-motion and persistent pause states. The evidence image has explicit dimensions and 480/800/1270-pixel WebP variants (17/35/68 KB); the inspection image mounts on demand. These are source observations, not measured delivery or assistive-technology test results.

### Material finding

**P2 — name the evidence inspector dialog.** `apps/lab/components/agentic-systems/Evidence.tsx` renders its `<dialog>` without `aria-label` or `aria-labelledby`. The opening-performance inspector therefore has no programmatic dialog name even though its image has alt text. Add a concise name derived from the evidence description, such as `aria-label={\`Image detail: ${alt}\`}`. Native dialog behavior already supplies modal dismissal and normal focus restoration; retain those.

## Requested rendered states

1. Timeline: default 6 s/all findings; 7 s/partial cutoff without cancellation; 13 s/partial cutoff with cancellation. Include a whole-card 320-pixel capture.
2. Comparison: delivered-day average rate and pause count; earlier-opening pause count. Include a 390-pixel chart plus readings, and the expanded six-reading table.
3. Stall map: all shots in the first minute; Passage filter; a selected event. Include a 320-pixel controls/plot/receipt capture and an empty-shot state if possible.
4. Evidence: inline opening-performance image and its phone inspector; verify the zoom/help/close controls fit.

**Status: source review complete; rendered acceptance pending.**

## Rendered follow-up — accepted

Confirmed the shared `Evidence.tsx` dialog now has `aria-label={\`Image detail: ${alt}\`}`. The source-level accessibility finding is resolved.

Inspected these supplied captures:

- `08-wait-default-320.png` and `08-wait-partial-320.png`: the 320-pixel layout preserves the shared timeline, each investigation's name/status, finish markers and the selected policy. The six lanes are necessarily tall, but the controls and type remain readable without visible clipping.
- `08-performance-average-390.png`, `08-performance-pauses-390.png`, `08-performance-table-390.png`: the phone chart retains both bars and its threshold; A/B labels are immediately resolved by the textual result cards. Switching from average rate to pauses reveals the intended reversal. The complete table fits its captured width with readable rows and thresholds. The overall protocol failure remains explicit beside the within-limit averages.
- `08-stalls-320.png`: the enlarged first minute makes the cluster visible; axis units, 15-of-28 count, selected event, phase and causal limitation remain legible. The image and record perform different explanatory jobs rather than repeating a caption.
- `08-wait-cancel-receipt-320.png` (replacement inspected): the corrected capture shows the sixth investigation labeled Canceled, the released partial brief with 5 of 6 findings and an explicit missing-report statement, the 7-second clock, checked cancellation control, and 25 worker-seconds spent. The receipt and controls remain readable at 320 pixels. The earlier evidence-capture mismatch is resolved.

**Visual accepted for the reviewed chapter surfaces; no remaining material visual finding.** This acceptance combines inspected phone captures, source inspection and the parent's reported interaction/no-horizontal-overflow checks. It does not claim an independently operated browser, assistive-technology test, device-performance measurement or rendered inspector review; no inspector capture was supplied in this set.
