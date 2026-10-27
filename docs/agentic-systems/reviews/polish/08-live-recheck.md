# Chapter 8 — independent final live-route recheck

27 October 2026 · independent fresh-context critic `final_live_ch08`.

**Final decision: PASS. Gate 6 clears after the actual rebuilt-route checks of both the axis-fill repair and the compact label correction.** Together with the prior independent eight PASS gates in `08-final.md`, this completes Chapter 8 acceptance after the separate literary and visual polish passes. The evidence boundaries below remain explicit.

## Scope and identity

Authorized worktree: `/home/stpn/.codex/worktrees/agentic-systems-book/fruitful-lab`; branch `codex/agentic-systems-book`; initial HEAD `dcefbb8208b84805f73c99d22ee87f6b6b435e7b`. Startup status was clean. The main checkout contains a different workstream and was not edited. This reviewer writes only this report, makes no application or Git changes, and performs no production or studio action.

Read the current relevant book memory and repository process/design requirements, `POLISH_PASSES.md`, `VISUAL_POLISH.md`, revised Chapter 8, `08-final.md`, `final-graphic-recheck.md`, and the current StallMap component. Initial StallMap SHA256 was independently checked as `e6181261629df2b237f1ecbd3d0ceccb0ceb0581fd2b8a995bb82c55da9d1d20`.

All browser work used CUA, in a newly created tab on the actual route `http://127.0.0.1:3194/stepanoskin/agentic-systems?chapter=responsive`. No saved review HTML or standalone SVG artifact was used as live proof. The coordinator identifies this as the fourth local production build. I inspected actual screenshots and the corresponding rendered DOM. This local build predates the late Paul Lewis inline-year correction; the stale `Paul Lewis · Livi` text is the known build boundary, not a newly discovered unresolved application defect. The coordinator separately reports exact committed-source verification on deployment `dpl_GeU6pfmBNe7q5KpK3vbzwHoFE3ik`; I do not claim that hosted check as my own.

The exhaustive controls, six-measure pairs, evidence inspector, notes, source comparisons, Sanctuary opening/studio reference review and eight passing gates in `08-final.md` are supplied prior evidence. I have not relabelled those checks as work performed here. The standalone twenty-state artifact review is corroborating prior evidence only.

## Direct responsive observations

Both the all-shot/whole-run state and Passage/first-minute state were operated and visually inspected at each requested size. Actual `innerWidth` and `innerHeight` were checked, with no unexpected concurrent viewport changes.

| Viewport, CSS pixels | SVG width | Document scroll/client width | All / Passage marks |
| --- | --- | --- | --- |
| 320 × 820 | 262 | 300 / 310 | 28 / 15 |
| 390 × 844 | 332 | 370 / 380 | 28 / 15 |
| 768 × 900 | 702 | 748 / 758 | 28 / 15 |
| 1280 × 900 | 897.8125 | 1260 / 1270 | 28 / 15 |

The former black triangle is absent in all eight live view/width combinations. The beige plot remains open; grid lines, event stems, circles and the brown selected circle remain visible. The all-event picture shows the early cluster, the later assembly cluster and isolated later events. The first-minute view moves the Passage cluster around 30–35 seconds into a useful enlarged position. The page has no horizontal overflow at the four sampled widths. Narrow selectors stack and stay within the page.

The live SVG contains 28 or 15 event circles as appropriate, and the accessible description and visible count agree. Switching filters selects the first matching record. Selecting event 11 displays 32.65 seconds, 213.5 ms and “bob gets up as STILETTO arrives”; its selected circle agrees with that retained event. Switching back to the whole-run view restores event 1. Event 28 displays 398.22 seconds, 112.8 ms and “LIMEN starts doing it right.” The shortened first-study caption is visibly present: “The selector also opens an earlier matched experiment.”

## Direct motion and pause observations

Motion was initially enabled. During real control changes, screenshots show the cursor between its previous position and selected-event destination. For the switch to event 28 at desktop width, the rendered cursor transform was sampled at 471.119 while its target was 561.361, then at the settled 561.361. The visible brown event mark and final dashed cursor agree. The observed transition is 0.7 seconds and follows a selected record; it does not fabricate a continuous trace.

At 320 pixels, I clicked Pause motion, then changed to the enlarged Passage selection and event 11. The visible study reports `data-playing=false`, its cursor transition is `none`, and the full still plot, selected marker, 15-event count and 213.5 ms receipt remain complete. Motion was restored ON: the button again reads Pause motion and the visible study reports `data-playing=true`. Toggle ownership was then explicitly released to the coordinator/Chapter 9 reviewer.

The tab returned no warning/error console entries. This is interface verification, not a physical-phone performance run, new game benchmark, field Core Web Vitals result or hidden-document/reduced-motion retest.

## Additional compact-label finding

The 320/390 screenshots reveal that the leading digit of the vertical labels 100, 150, 200 and 250 partly falls over the darker left frame. The labels are not clipped from the DOM; their contrast is impaired by their position across two backgrounds. At 320, the label bounding boxes begin at x42.588 CSS pixels while the beige paper begins near x48.407. About 5.8 pixels of the leading digit sit on the darker frame. This makes 100 versus 200, and 150 versus 250, unnecessarily hard to distinguish. The complete HTML event receipt does not repair the measuring instrument's tick labels.

Reported immediately to the coordinator, who independently confirmed the same defect on the hosted 390-pixel route. The coordinator moved the compact left plot origin from 80 to 104 SVG units while retaining the current font and right edge; wide geometry remains unchanged. This reviewer made no application edits.

The initial recheck closed the fill defect and held only this newly identified label correction. The completed bounded follow-up is recorded next; this historical finding is no longer open.


## Fifth-build label recheck and final acceptance

The coordinator reported a successful fifth production build and replacement preview PID `3233668` on port 3194. After that ready signal, I reloaded the actual route through CUA. The repaired StallMap source SHA256 is `49d9a529f7fff33a5527e28da25f355ee0c6436297ef89164e9fe4ddf5c95c42`; the repair is the compact origin change above, on the same branch and initial HEAD plus the coordinator's working-tree patch. The build also includes the committed inline-year fix.

I visually inspected four new live screenshots: all-shot/whole-run and Passage/first-minute at both 320 × 820 and 390 × 844. All four vertical numbers are now entirely over the beige paper and readily distinguishable. At 320, the tick text begins at x54.232 CSS pixels against a paper edge near x48.407; at 390, the respective positions are x60.944 and x53.593. The repair supplies a visible clear margin instead of relying on the dark frame for the first digit.

The slightly narrower compact plotting area retains clear grid lines, stems, the early cluster and later isolated records. The selected event 11 remains 213.5 ms at 32.65 seconds, with its settled marker visible in the 390-pixel enlarged screenshot. Counts remain 28 and 15 in both the DOM and rendered count. Scroll/client widths remain 300/310 and 370/380, so no page overflow was introduced. Controls and receipts remain contained.

A new 1280 × 900 live screenshot and DOM check confirm the wide layout still has its original `0 0 900 530` viewBox and nonfilled `M120 85V365H785` axis. All 28 circles, grid, selected event 1 and frame remain clear, with scroll/client width 1260/1270. The wide geometry was not changed by the compact correction. The new live DOM also reads the inline citation exactly **Paul Lewis**, independently closing the known local-build citation boundary.

Motion remained enabled through this follow-up; the visible study reports `data-playing=true`. This narrow origin change does not change the earlier directly verified pause/transition implementation. Browser warning/error entries remain empty. The temporary viewport override was reset on completion.

**Gate 6: PASS. Full Chapter 8 acceptance: PASS**, combining this independent rebuilt-route evidence with the original critic's eight passing substantive gates, prior actual Sanctuary comparison and separately accepted literary revision. Both live-discovered graphic defects are now closed. No further application change is indicated by this review. This does not certify field performance, production publication or the underlying failed game delivery.
