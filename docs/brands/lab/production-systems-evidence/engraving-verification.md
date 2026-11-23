# Procedural profile scenes — verification

3 October 2026. Scope: Fruitful Lab professional profile only, plus its design
notes and the two current-memory files documenting the motion contract.

## What changed

Eight procedural SVG scenes share the Mechanical Turk's cabinet, board and
workshop language. The conveyor gains cabinet construction and moving rollers,
sheets and press. The remaining sections show a candlelit operator, an open
cabinet, chess geometry, comparison, controlled release, a folio and a worktable.
The historical source-derived figure linework is credited in the page and in
`../production-systems-design/DESIGN_GUIDELINES.md`; original apparatus geometry
and editorial motion are distinguished from those studies. No employer-specific
facts or quantitative results were added.

## Automated checks

- `API_BASE_URL=http://localhost:8000 npm run ci`: 38 Jest suites / 170 tests,
  asset release tests/checks, Next.js TypeScript validation and production build
  passed. A final production build passed after the attribution and no-JavaScript
  control refinement; the focused motion tests were rerun and passed (2/2).
- Scoped ESLint and `git diff --check` passed.
- The motion tests cover per-scene visibility, document visibility, changing OS
  reduced-motion preference, observer/listener cleanup, manual pause persistence
  and resume after remount.
- Standalone `tsc --noEmit` reported existing test-only type errors in
  `pinterestPotentialPage.test.tsx`, `sanctuary-exhibits.test.tsx` and the GrowthBook
  middleware tests. No changed profile file was reported. The required Next.js
  build's TypeScript stage and all Jest suites pass; those unrelated tests were
  not edited for this visual pass.

## Production browser review

Chromium 154 against `next start`, viewport heights 1000 CSS px. Desktop/phone
captures use reduced motion so the same complete still composition can be
reviewed. The separate motion checks run with animation enabled.

| Width | Horizontal overflow | Scene count | Duplicate SVG/HTML IDs | axe violations |
| --- | --- | --- | --- | --- |
| 1440 | None | 8 | None | 0 |
| 768 | None | 8 | None | 0 |
| 390 | None | 8 | None | 0 |
| 320 | None | 8 | None | 0 |

axe checked WCAG 2 A/AA, WCAG 2.1 AA and best-practice tags; this is automated
coverage, not a blanket accessibility certification. No browser page errors or
console errors were reported in this production run.

- At the opening only the conveyor runs. Scrolling to the board stops the
  offscreen conveyor and starts the board.
- Measured animation clocks advance when enabled and remain unchanged after a
  keyboard-activated pause. Reload preserves the paused preference.
- Reduced motion leaves no running scene animations. The motion control hides
  when that OS preference applies.
- Games selection, radio-keyboard navigation to Commerce, phone touch selection
  and the expandable art-source note work.
- With JavaScript disabled, all eight still scenes and the profile remain;
  the inactive motion button is hidden.
- A4 print output is still two pages. Artwork is excluded from the CV layout.
- Desktop and phone screenshots were visually inspected. The operator's fine
  strokes remain distinct from the structural contours; captions remain HTML.

## Loading observations

Unthrottled local production build, Chromium, 1440×1000, DPR 1; these are lab
observations only. Cold navigation: LCP 1772 ms, DOMContentLoaded 2056 ms, CLS 0.
Warm reload: LCP 404 ms, DOMContentLoaded 476 ms, CLS 0. Field LCP/INP/CLS remain
unmeasured; no field-performance claim is made.

Encoded document body: 182,961 bytes (includes server-rendered SVG and Flight
serialization). Encoded resource bodies: 295,419 bytes. Source raster-image
requests: zero. The 769 SVG paths batch repeated strokes; no raster reference,
new font, animation library, per-frame React state or continuous canvas is shipped.
The same vector content is used at every viewport; there is no responsive raster
candidate to select. Later scenes are static until visible.

## Evidence

- [Desktop](engraving-desktop.webp)
- [Phone](engraving-phone.webp)
- [Operator detail](engraving-operator.webp)
- [Raw browser report](engraving-browser-report.json)
- [Design guidelines](../production-systems-design/DESIGN_GUIDELINES.md)
- [Visual reference sheet](../production-systems-design/reference.html)

Latest master was fetched and inspected at `be7fa7a` (project-directory PR55).
Its changes do not overlap the profile route/components; memory edits occur in
different sections. Existing profile PR54 remains the scoped delivery vehicle.
Sanctuary's uncommitted work in the primary checkout and all other brand apps
were left untouched. Production promotion awaits owner review and merge.
