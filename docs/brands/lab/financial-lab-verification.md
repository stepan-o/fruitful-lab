# Financial Lab verification — 12 October 2026

Scope: `apps/lab` financial tool plus the shared memory entries for its new route,
API and analytics contracts. Branch `codex/finance-exchange-lab`, isolated worktree
`/home/stpn/.codex/worktrees/finance-exchange-lab/fruitful-lab`, base `2079cac`.
The existing Sanctuary checkout and untracked `docs/loopforge/` were preserved.
Other brand apps and the backend were not edited.

## Passed

- Locked dependencies installed with `npm ci`; no dependency or lockfile change.
- Asset-pipeline test passed; all 54 retained asset releases and the existing
  factory-floor geometry checks passed during the production build.
- `API_BASE_URL=http://localhost:8000 npm run ci:test -- --runInBand`:
  **91 suites, 474 tests, one snapshot passed**. Includes 17 new finance checks.
- Focused financial checks cover inversion/sorting, missing vs invalid data,
  duplicates/future dates, fresh/stale/gapped histories, fees including two-transfer
  costs, January and expired deadlines, target and event policy, zero risk,
  long-horizon insufficiency, increasing interval width, known walk-forward
  outcomes without future leakage, three-budget scaling, pending input changes,
  report assumptions, local deadline storage, unavailable feed and refresh failure.
- Targeted ESLint and `git diff --check` passed.
- Standard production build passed with `API_BASE_URL=http://localhost:8000
  LOOPFORGE_LOW_MEMORY=1 NODE_OPTIONS=--max-old-space-size=2048 npm run build`.
  Next.js compiled and completed its TypeScript check; `/tools/finance` and
  `/api/tools/finance/rates` are dynamic public routes.
- Production preview started at `http://127.0.0.1:3195/tools/finance`.
- Real upstream feed and production API both returned 800 observations through
  9 October 2026: source 0.07767 CAD/MXN, reciprocal 12.874983906270117 MXN/CAD.
- Production-rendered HTML contains the split result, January date, 1k/5k/10k
  comparison and extension section. Compressed local HTML response was 22,101
  bytes; one observed warm TTFB 0.424 s and total 0.469 s. This is not a cold-load
  benchmark or field performance claim.
- Independent real-source run: default 1% markup, zero fixed fee, 2% downside
  tolerance and 1 January deadline choose 75% now / 25% later. The 60-observation
  audit has nine non-overlapping windows, insufficient for the challenger gate.
  No conclusion that extending the deadline will pay off is claimed.

## Qualifications and remaining review

- The first unbounded `npm run ci` attempt hit timeouts in existing Sanctuary and
  Mexico City tests. The bounded sequential full-suite retry above passed.
- A separate raw `tsc --noEmit --incremental false` run reports existing test-file
  type issues in Loopforge, Sanctuary, Mexico City, Pinterest and GrowthBook.
  No finance-file errors were reported; the standard Next production type/build
  step passed. These unrelated test types were left out of this feature change.
- Connected browser inventory returned no browsers; creating the in-app browser
  returned “Browser is not available: iab.” App-side open did not complete.
  **Desktop/mobile screenshots, real keyboard/touch navigation, print pagination,
  downloaded-file browser flow, cold/warm browser performance, and 320/390/768px
  overflow checks are not yet visually verified.** Component tests and HTML
  checks are not substitutes. Keep the PR a draft pending this visual pass.
- The interface has no continuous animation or new images/dependencies. Reduced
  motion does not need a separate animation path; device verification remains
  pending. Original SVG charts include accessible descriptions and a keyboard
  history inspector; numeric tables retain horizontal scrolling in narrow panels.
- The model’s nominal interval, exploratory thresholds and qualitative caution
  policy require further empirical validation before claiming reliable timing
  skill. Provider execution rates, settlement holidays, interest, taxes, live
  news and background notifications remain outside this first prototype.
- Field LCP, INP and CLS are unmeasured. No production release or merge is implied.

## Methodology follow-up — 12 October 2026

This section supersedes the earlier source-window and browser-unavailable notes
above for the methodology follow-up. The earlier figures remain a record of the
initial dashboard delivery.

- Expanded real BoC history: 2,356 observations, 2017-05-01–2026-10-09. Final
  source 0.07767 CAD/MXN, reciprocal 12.874983906270117 MXN/CAD. No fixture fallback.
- Full sequential suite: 93 suites / 489 tests / one snapshot passed. After final
  browser refinements and the minimum-history edge-case addition, all 33 finance
  tests passed. Existing full-suite tests were not rerun after those narrow edits.
- Final production build, TypeScript, asset check, asset test, scoped ESLint and
  diff check passed. A CSS-module print-selector error was repaired before passing.
- Causal prefix invariance, hindsight labels, quote inversion, temporal split,
  future-outcome isolation, gaps, known-error interval scores, delayed execution,
  fixed fees, infeasible splits, combined same-day fees and mixture math tested.
- Independent Python check reproduced the 32-window 21-publication baseline MAE
  and wait-policy mean gain to within 1e-9 of the TypeScript result.
- In-app browser walkthrough on the production build at local port 3295: direct
  methodology view, source dates, real charts, 21/63-publication forecasts,
  historical replay, reversal threshold, exact-publication replay and mixed weights.
  Keyboard ArrowLeft changed the projection from step 21 to 20; replay and mixture
  keyboard changes produced corresponding dated/numerical readouts. No console
  warnings/errors during the inspected study interactions.
- Visually reviewed desktop and 320/390/768px layouts. Page widths remained within
  the viewport; wide charts/tables intentionally scroll inside their containers.
  Added visible mobile scrolling guidance, exact observation sliders, numbered
  sources and suppression of rounded negative zero after review.
- Screenshots saved as local task artifacts: finance-methodology.jpg and
  finance-methodology-phone.jpg (task visualization directory). They are review
  evidence, not runtime app assets. No physical-device touch test is claimed.
- Browser download observation timed out twice, including after retaining the Blob
  URL for a second and attaching the temporary link. Component checks confirm Blob
  creation and click dispatch; **actual saved browser JSON remains unverified**.
  Print/PDF pagination and physical-device touch remain unverified.
- Final local API and HTML returned 200. Single local request samples: API 171,153
  bytes / 0.832 s; compressed HTML 41,816 bytes / 1.138 s. These are not field web
  vitals or a controlled cold/warm benchmark. Field performance remains unmeasured.
- No new dependencies, backend work, news ingestion, notifications or transfers.
  Primary research sources and the numerical study are documented in
  financial-lab-methodology.md. Prospective predictive validation remains required.
