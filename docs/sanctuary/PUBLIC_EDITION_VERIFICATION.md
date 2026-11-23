# Public editorial edition — verification

3 October 2026. Production build served at loopback port 3103, without the
research environment flag. This is a local laboratory check, not field Web Vitals.

- Full Lab CI: 34 Jest suites / 149 tests passed, asset release test passed,
  public/optional-archive integrity checks passed, Next production build and
  TypeScript passed. Final CSS/credit changes were followed by another successful
  production build. Scoped ESLint and `git diff --check` passed.
- Public selection: 24 images, 76 WebP variants, 6,964,936 bytes across the entire
  library. That is storage, not the amount fetched by a reader on one page.
- Opening at a 390px viewport: the browser chose the two 480px variants, 31,478
  and 10,566 bytes (42,044 combined). The below-fold campaign screenshot had no
  `currentSrc` and remained unloaded. At the observed 1280px viewport the same
  two variants covered the approximately 433px-wide image panels. Larger DPRs
  can select larger variants; all sizes remain available for inspection.
- Initial chapter HTML measured 26,228 gzip bytes in one local response.
  Local response latency is not evidence of internet LCP or INP.
- All 21 chapter routes rendered in editorial mode at 390px with at least one
  sourced image and no horizontal page overflow. Opening checked at 320, 390,
  768 and 1280px. The credits page exposed all 24 source records and fit mobile.
- Contents navigation, comparison tabs and image inspection were exercised.
  Escape closed the image dialog and returned focus to its opener. Inspection
  mounts the larger source only when opened.
- Mobile audit identified 27px inspection buttons and 16px range hit areas.
  These now measure at least 44px, matching the header controls. The final build
  was rechecked on the loot-model chapter and opening.
- Existing motion lifecycle tests cover offscreen/hidden-page suspension,
  reduced motion, manual pause and the covered opening plate. Browser error log
  on the final opening was empty.
- Actual headers: image and manifest `max-age=31536000, immutable`; pointer
  browser `max-age=30, must-revalidate`; edge `max-age=60, stale-while-revalidate=30`.
- Field LCP, INP and CLS remain unmeasured for this release. Follow the inherited
  [design/performance standard](../DESIGN_AND_PERFORMANCE_STANDARDS.md) and use
  production observations after release before claiming those targets achieved.
