# Figure 2 — chessboard alignment and readability

5 October 2026. Scope: Fruitful Lab production profile, Figure 2 only.
Branch: `codex/profile-chessboard-clarity`, based on master `a1a0b2d`.
The previous operator restoration was merged in PR #79; its production deployment
`dpl_7YobjFwPdyBGyQVy4pebg1524pxa` was verified READY for `e52e660`.

## Construction and visual review

- Public board: 180 × 42 at (246, 42); private board: 150 × 35 at (232, 269).
  Both use the same depth/width ratio and the cabinet return slope −1/√3.
  Cells, mitred rails, side/front thickness, indicators and supports derive from
  board coordinates. The upper rear rail stays within the tabletop; the private
  front lip clears the retained cutaway wall.
- Scoped chessmen replace the shared tiny pieces in this scene. Scales increase
  from .36 to .52 and .27 to .44. Ivory/dark-contour and deep-green/light-edge
  silhouettes remain separate from muted maple/olive inlays. Turned collars,
  flared bases, crosses and crenellations supply legible detail.
- One sparse legal position on both boards: White Ka1, Rg1, Pe2; Black Kd8, Rb8,
  Pc7. Moving the black king away from the sleeve makes it visible. The same e2–e4
  move lifts 24/13 units; both hands meet the pawn crown, and shadows remain on
  the board. The original operator pose, forward lever and full Turk proportions
  are preserved.
- Visually inspected the full route at 1440×1000, 768×1024, 390×844 and 320×760,
  including different phases of the move. This is a proposed polish pass;
  publication does not imply owner acceptance.

## Validation

`API_BASE_URL=http://localhost:8000 npm run ci` passed on the final source:
asset checks, 54 suites / 245 tests, optimized Next.js build and TypeScript.
Existing middleware deprecation notice remains unrelated.
Geometry checks cover all 101 sampled poses: fixed arm lengths, elbow/reach
clearance, identical move progress, pawn/hand contact, rigid input linkage and
continuous reset. Added board-plane/frame containment and supporting-rook
position checks. `git diff --check` passed.

Browser evidence is in `operator-boards-browser-report.json`:

- No horizontal overflow at all four tested widths; complete illustration fits.
- 32 animated groups: all run when visible, all stop when manually paused and
  offscreen, all resume through the keyboard-operated Play control.
- No duplicate figure IDs, broken SVG uses or browser errors.
- Reduced-motion/hidden-document behavior is covered by the existing lifecycle
  tests and CSS review; this pass did not change OS settings to emulate reduced
  motion in the browser. Physical-device and field CWV remain unmeasured.

## Delivery cost

Server-generated procedural SVG; no new client boundary, frame callback, raster,
filter, dependency or network request. Figure 2 has 1,101 SVG descendants
(previous 1,050) and unchanged 32 animated groups. Production HTML is 1,944,317
bytes / 428,709 bytes gzip level 6 (previous pass: 1,937,810 / 429,852). The
compressed document is 1,143 bytes smaller despite the stronger pieces.
React review: pure server components, bounded geometry, stable keys and existing
CSS/visibility lifecycle. No data fetching or hydration changes.

Screenshots: `operator-boards-desktop.webp`, `operator-boards-detail.webp`, and
`operator-boards-390.webp`. Captured from the final local production build;
web screenshots are lab evidence, not measured physical-phone performance.
