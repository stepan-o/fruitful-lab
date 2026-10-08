# Business chapters — editorial revision, 8 October 2026

PR #98 contains chapters 2 and 3, their manuscript/source records, and the
Half-Life identification image. The latest revision rebuilds chapter 2 and its
diagram examples around one creative work supporting several connected
businesses. The approved chapter 1 is unchanged. All other 32 chapter records
are unchanged from the preceding PR head, 25619d3.

## Current chapter 2

Eight paragraphs, 574 words. Sony’s PS5 launch-quarter economics opens the
argument: hardware priced below manufacturing cost alongside higher gaming
division profit. The February 2021 earnings presentation supports that bounded
historical account; no current hardware margin or contribution from Cyberpunk
is inferred.

Cyberpunk then holds the work constant through publishing, stores, Sony’s
catalog agreement and NVIDIA’s separate computing service. CD PROJEKT’s
Nowakowski supplies an exact, attributed 18-word sentence from question 5 of
the Q3 2025 earnings transcript (PDF page 6). The deal’s return and expansion
opportunity are management’s assessment. No private rate, contract amount,
per-play payment or measured causal sales effect is invented.

The Sony FY2016–FY2025 history exhibit follows paragraph 0. Its original charts
separate revenue by category from operating profit, with interactive years,
release/business milestones, source links and reporting boundaries. The promotional image follows paragraph 4; the market map follows paragraph 5
(zero-based). Both manuscripts match every runtime paragraph and all citation
IDs resolve. The close leads into Valve’s expansion from making games into
distribution and hardware.

The four modern opening-diagram routes now use Cyberpunk and CD PROJEKT RED.
Sony/Microsoft catalog agreements are external publisher agreements. The
NVIDIA route requires a purchased supported PC edition; the console catalog
licence does not grant it. The wider market map also opens on Cyberpunk. The
first diagram retains its arcade opening as the continuation from chapter 1.

## Verification

- Required app checks pass: 66 suites, 341 tests, one snapshot, asset checks and the
  Next.js production build. All 22 retained asset releases verify.
- Scoped ESLint and whitespace checks pass. Updated interaction regressions
  verify fixed game/studio/publisher identity, store settlements, separate game
  and computing payments, console catalog switching, paired highlights and
  state reset. Reader coverage verifies figure order and the map’s initial game.
- Local production preview reviewed at 1280px and 390px. Purchase/catalog and
  cloud selections render the correct product and payment relationship. Prose,
  quotation, attribution, promotional image and figure order are readable;
  no horizontal page overflow or browser errors were found. Viewport overrides
  were reset after review.
- React review: static route data, lazy initial selection, memoized procedural
  art and existing motion lifecycle gates retained. No new animation scheduler,
  network request, image payload or dependency in this revision.

## Earlier changes retained in this PR

Valve’s chapter follows update distribution, third-party sales, libraries,
discovery, measurement and compatible hardware. Official Half-Life promotional
art replaces the gameplay screenshot: complete composition, responsive WebP
derivatives at 320px / 21,646 bytes and 616px / 54,838 bytes, immutable manifest
release and a specific source/use record. The Counter-Strike menu remains.

The established bounded editorial-use decision remains. Attribution and source
availability are not represented as a blanket licence. No new third-party art
was introduced by the latest chapter 2 revision. The retired Half-Life gameplay
record remains for provenance and is omitted from the chapter’s visual index.

## Sony history exhibit verification

`sony-history` is a typed inline exhibit; only chapter 2 requests it, after its
first paragraph. The prose and approved first chapter are unchanged. Financial
sources, transformations and event annotations are recorded in
[Sony financial history](SONY_FINANCIAL_HISTORY.md).

- Final suite: 66 suites / 341 tests / one snapshot; all pass. Asset validation
  verifies all 22 retained releases. Scoped lint and whitespace checks pass.
- Both revenue and profit have zero-based, separately labeled scales. Selecting
  a year highlights both; category selection now isolates its revenue and rescales from zero (see the follow-up below).
  Source figures reconcile within published rounding and match the existing
  latest-year exhibit. No early add-on split is invented. FY2020 uses the IFRS
  restatement; off-platform software is harmonized explicitly.
- Local production browser checks at 1280, 768, 390 and 320 CSS pixels: no page
  overflow; native keyboard controls, year picker, category highlight, milestone
  selection and disclosure work. Every chart button meets the 44px target.
  Mobile axes remain fixed while the year columns scroll inside the panel.
- The exact-source table and accounting/category notes remain accessible in a
  disclosure. Source links stay with the historical interpretation they support.
- React review: static ten-row dataset, event-driven state, scoped DOM scroll,
  dynamically imported component. No new dependency, image/audio asset,
  continuous animation, observer or external data request. Field performance
  has not been measured; no Core Web Vitals claim is made.

Final standalone production build exited successfully after the mobile axis-label spacing refinement.


## Category isolation / publisher comparison follow-up

Required `API_BASE_URL=http://localhost:8000 npm run ci` exited 0: 66 suites,
341 tests, one snapshot, all asset checks and production build pass. Scoped
ESLint and whitespace checks pass. Targeted regressions verify all four isolated
series, own totals and units, domain coverage and zero baseline, removal of
whole-segment profit in isolated views, year preservation, restoration of the
full stack, and first-party/other-publisher copy counts and scope.

Production browser checks at 1280×900, 768×1024, 390×844 and 320×760 showed no
horizontal page overflow. Hardware selection works with keyboard Enter; year
selection stays consistent when the category changes. Category-only bars,
value labels, fixed narrow-screen axes, category totals and All revenue restore
were inspected. All chart buttons meet the 44px target at 320px. The separate
publisher comparison was inspected at 1280px and 320px. Console error log was
empty. Temporary viewport override reset. No animation or external request added.

Evidence screenshots (local review artifacts):
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-category-desktop.png`
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-category-mobile.png`
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-publisher-comparison.png`

The financial evidence does not support dividing the money bars by publisher
ownership/funding. Public notes distinguish gross digital revenue from retained
income, and first-party copy share from revenue, profit and publisher payouts.
Reviewed definitions and source boundaries are in `SONY_FINANCIAL_HISTORY.md`.
