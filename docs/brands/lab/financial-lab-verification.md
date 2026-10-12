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
