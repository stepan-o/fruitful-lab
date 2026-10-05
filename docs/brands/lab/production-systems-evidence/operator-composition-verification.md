# Figure 2 — seated operator composition

5 October 2026 · `codex/profile-operator-composition` · base `3cdd203`.
Scope: the production-systems operator illustration, its source disclosure and
route design authority. Figure 1 is accepted as complete; Figures 3–8, professional
claims, page layout, selectors and other apps are unchanged.

## Visual review and references

- [Desktop section, 1440px viewport](operator-composition-desktop.webp)
- [Figure and caption at reading size](operator-composition-detail.webp)
- [Phone section, 390px viewport](operator-composition-390.webp)
- [Browser observations](operator-composition-browser-report.json)

The earlier composition put a cropped torso behind a counter and ran unrelated
rods across the working space. The new side cutaway completes the seated body,
shows its support and clearance, and keeps the face and hands readable. A compact
pegboard, overhead indicators and roof/rear control path make the work legible.
The cabinet, public board and private board share a consistent depth direction.
One four-piece position ties all three representations together.

Research: [HNF's reconstruction account](https://www.hnf.de/en/permanent-exhibition/exhibition-areas/the-mechanization-of-information-technology/early-automatons-miracles-of-technology/the-reconstruction-of-the-hnfs-chess-turk.html)
and [its illustrated 2024 retrospective](https://blog.hnf.de/zwanzig-jahre-hnf-schachtuerke/).
Reviewed the uncovered tabletop, pantograph and display-clockwork photographs.
The new composition is an interpretation, not a reconstruction claim. Racknitz's
character geometry remains credited; museum photographs are not redistributed.

[Design guidelines v2.0](../production-systems-design/DESIGN_GUIDELINES.md) separate
the accepted opening's shared construction/material/lighting standard from the
original focal action, viewpoint and tempo each later scene must contribute.

## Validation

- Required Lab CI asset test and all **48 Jest suites / 217 tests pass**.
  Production build, TypeScript, retained asset checks and scoped ESLint pass.
  The final build followed the last two geometry refinements (candle-facing
  wheel highlights and the private board's depth direction). No test policy changed.
- Production Chromium review at **1440, 768, 390 and 320 CSS pixels**: no
  horizontal overflow; all eight scenes render. Operator node count remains
  **528** across widths. Phone and desktop captures were visually inspected.
- Five operator animations run when visible: 24s/15s meshing wheels and three
  4.8s flame/light layers. Manual pause freezes transforms across observations;
  the paused preference survives navigation. Keyboard Enter resumes the control.
  With playback enabled, navigating to References leaves zero operator animations
  running; returning to the section resumes all five.
- No console errors in the final production review, duplicate IDs, unresolved
  SVG `use` references, raster images, filters or canvas in the new scene.
  The SVG has its own title and description; source links are available through
  the existing disclosure and were checked in the browser.
- The emitted static HTML contains the full illustration with `data-playing=false`.
  No new client boundary, observer, timer, per-frame work, font or dependency.
  Existing passing lifecycle tests cover reduced motion and document visibility;
  the local CSS explicitly disables motion for reduced motion and print.
- React best-practices review: server-only geometry, stable IDs/keys, existing
  lifecycle reuse, no new fetch or interaction state, local styles and bounded
  SVG precision. Other scenes' shared primitives were not edited.

## Performance and review limits

The final prerendered HTML is **1,433,568 bytes**, **306,171 bytes at gzip level 6**.
This is a local artifact measurement, not network/field Core Web Vitals. There
are five operator animations, the same count as the previous operator scene.
No low-end-device FPS, OS reduced-motion emulation, full axe pass or print export
was rerun in this focused pass. Print rules and the shared lifecycle are unchanged.

CUA supplied browser verification because the agent-browser CLI is unavailable.
A preview tab initially timed out, and a local preview process later terminated;
fresh tabs and a restarted production server completed the recorded checks.
Immediate post-navigation samples in the raw report can precede the intersection
observer; the settled resume/offscreen checks establish the resulting states.
