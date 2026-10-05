# Figure 3 — the open cabinet

5 October 2026. Fruitful Lab production profile only.
Branch `codex/profile-open-cabinet`, based on master `0408c15` in the dedicated
`professional-systems-profile` worktree. PR #83's preceding chessboard pass was
confirmed merged; production deployment `dpl_BTPs6virAYDQvyosPb2X5ycm99Zf` was
READY for merge commit `ab93547`.

## Composition

The owner requested an unoccupied cabinet, inheriting the finish of Figures 1–2.
The earlier automaton study is removed. `OpenCabinet.tsx` now draws the whole
case, two opened panelled leaves, mitred mouldings, directional grain, fitted
hardware, shallow drawers and turned feet. An empty chessboard remains above.
Walnut, subdued brass/steel and deep-green recesses carry the shared palette.

Both 151-unit door leaves project from fixed hinges and together close the
302-unit opening. The side return and board use the same orthographic depth
slope as the previous figures. Ten pierced wheels form an original compound
transmission with correct pitch spacing and opposing tooth phases. An output
crank, rigid connecting rod and guided slider complete the visible motion.
Rear mounts stay narrow; the right service frame is quiet. The studio key,
recessed receivers and door/case floor silhouettes share the existing lighting
math. This is an editorial interpretation of Windisch's open case, not a
historical reconstruction of its drive.

The first and second figures, their palettes/geometry and their interactions
are unchanged. `CabinetWoodDefs` and `BoardSurface` are reused without modifying
their output in Figure 2. Design Guidelines v2.7 record the new scene contract.

## Checks and evidence

`API_BASE_URL=http://localhost:8000 npm run ci` passed: assets, 56 suites / 253
tests, TypeScript and optimized Next.js build. Existing middleware deprecation
notice remains unrelated. `git diff --check` passed.

New geometry checks cover unmeshed-wheel clearance, spacing/phase/speed across
both gear planes, the compound arbor, rigid crank/rod connection throughout 121
samples, the guided stroke, board containment and full-width door projection.

The production page was visually reviewed at 1440×1000, 768×1024, 390×844 and
320×760. All fit without horizontal overflow; the whole cabinet, open doors,
caption and accompanying capabilities remain readable. Browser observations:

- 570 SVG descendants and 23 animated groups in Figure 3.
- All 23 run when visible; all stop during manual pause and offscreen.
- Keyboard Enter resumes the Play control correctly.
- No duplicate figure IDs, broken SVG uses, or browser errors during review.
- The first fresh local load rendered normally. The temporary local server
  later ended with SIGTERM, before a repeat-load check; hosted initial/reload
  verification is recorded in the PR after deployment.
- Reduced-motion and hidden-document behavior retain the existing tested
  lifecycle. New CSS explicitly disables its animations for reduced motion and
  print; initial transforms preserve the connected still pose. No OS preference
  was changed during this pass. Physical-phone/field CWV remain unmeasured.

Screenshots: `cabinet-study-desktop.webp`, `cabinet-study-detail.webp`,
`cabinet-study-390.webp`. DOM/motion observations:
`cabinet-study-browser-report.json`. Captured from the final production build.
Publication is a reviewable pass, not automatic owner acceptance.

## Performance and scope

No new client component, per-frame JavaScript, runtime raster, SVG blur/filter,
font or dependency. Wheel geometry is defined once for the visible wheel and
its synchronized pierced shadow. Only CSS transforms animate; linkage samples
are computed on the server. Scoped CSS adds no new state or event listeners.

Production HTML: 1,844,245 bytes; gzip level 6: 392,235 bytes. The prior pass was
1,944,317 / 428,709 bytes: this removes 100,072 uncompressed / 36,474 compressed
bytes while adding finished cabinet detail. These are document delivery
measurements, not field speed or frame-rate claims.

Scope is `apps/lab` profile art/geometry/tests and `docs/brands/lab`. Other apps,
Sanctuary, Loopforge, shared platform contracts, APIs and professional claims
are outside this pass. Local preview is temporary; hosted deployment is checked
against the published commit before handoff.
