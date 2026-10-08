# Activision, Blizzard and King — mobile interlude, 8 October 2026

Chapter 2 now identifies the distinct businesses inside Microsoft's acquisition through an official-art triptych. Each card separates the original franchise studio from the pictured release's makers and publisher: Infinity Ward / Treyarch and Raven, Blizzard North / Blizzard Entertainment, and King. Gameplay mounts only when selected. Source and use links accompany every plate; embedded media are included in the chapter credit index and its server-filtered asset manifest.

The new third chapter follows Candy Crush from 65 Facebook levels in 2012 to continuing production, optional assistance, King's financial model, two parent acquisitions and its dependence on mobile/social platforms. King precedes Valve; the presentation now has 34 chapters. The approved first chapter is unchanged. Historical company/portfolio figures, the dated franchise milestone and the two different acquisition measures are distinguished explicitly. The comparison with Diablo is an editorial interpretation, not a claim of direct borrowing.

Verification:

- Required app CI passes before base synchronization (68 suites, 351 tests, 23 retained releases) and after it (74 suites, 387 tests, one snapshot, 45 retained releases and production build). The additional tests/releases come from the current main branch. Two shared-memory conflicts were resolved by preserving Sanctuary notes and the latest Loopforge record; no Loopforge implementation was edited.
- Focused checks cover chapter placement, cited asset completeness, original-studio credits, optional free-play route and on-demand gameplay. Scoped lint and whitespace checks pass.
- Desktop and 390px review verified the new opening, official art, gameplay selection and the free/purchase switch. Production checks at 320px verified stacked poster cards, 44px controls and no page overflow. The phone diagram uses larger text; closing gameplay restores keyboard focus to its trigger.
- Ten new source assets yield 23 WebP variants totaling 489,318 bytes across every size; the largest individual file is 86,254 bytes. Above-fold Candy art is prioritized; other images stay lazy. No external image request, added dependency or animation loop. Publisher art remains complete and unmodified apart from proportional optimization.
- Source snapshots, ownership, analytical purpose and use limits are in the asset register and public credits. Official availability is not represented as permission or a copyright guarantee. The existing bounded editorial-use decision is retained.
- The known standalone TypeScript errors in unrelated Pinterest/GrowthBook test mocks are unchanged; production TypeScript succeeds.

The previous checkpoints below document earlier iterations.

# Platform-history selector update — 8 October 2026

The financial exhibit now switches between PlayStation, Xbox and NVIDIA.
Microsoft and NVIDIA have source-backed total revenue/YoY histories and
milestones. Xbox adds hardware/content growth selection; earlier uncovered
category years are explicitly absent. No undisclosed category-dollar amounts,
cloud revenue or matching profit splits are inferred. Sony’s interactions and
composition calculations are retained. The publisher copy-count figure is a
separate exhibit after the two new comparison paragraphs. See
[financial case methodology](PLATFORM_FINANCIAL_CASES.md).

Verification for this update:

- Required app CI: 67 suites, 348 tests and one snapshot pass; 22 retained asset
  releases verify; Next.js production build passes. The focused financial tests
  cover company switching, missingness, negative/category growth, exact reported
  totals, fiscal dates, milestones and independent figure placement.
- Scoped React/TypeScript lint and whitespace checks pass. React review confirms
  native controls, static data, existing chapter-level dynamic loading, no new
  dependency or asset and no continuous animation or network request.
- Local production browser checks at 1280, 768, 390 and 320 pixels cover the
  selector, year selection, positive/negative bars, keyboard activation and the
  standalone publisher figure. No horizontal page overflow. NVIDIA correctly
  says its Gaming total is not cloud revenue; the publisher figure appears once,
  immediately after the NVIDIA comparison paragraph, outside the chart selector.
- A final visual correction replaces early Xbox category dashes with “No rate”
  labels at the foot of the plot, avoiding the appearance of a measured value.
- The broader standalone `tsc --noEmit` check still reports four existing test
  typing errors in Pinterest route tests (readonly NODE_ENV) and GrowthBook
  middleware mocks (incomplete FeatureResult). No errors remain in the edited
  files. The production build’s TypeScript check succeeds. Unrelated test files
  are preserved.

The earlier checkpoints below describe the preceding iterations of this PR.

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


## Financial prose, add-ons and original PlayStation context

The chapter now explains the FY2025 category totals in prose, defines add-on
content through expansions, cosmetics and virtual currency, and connects those
purchases to the later Diablo IV analysis. Revenue is distinguished from
operating profit and outside publishers’ share. Original PlayStation figures
reach FY1995; the category chart remains FY2016–FY2025 because earlier reporting
boundaries differ. The Valve bridge describes platform economics without
claiming Sony’s accounts explain Valve’s historical motives.

Required `API_BASE_URL=http://localhost:8000 npm run ci` exited 0: 66 suites,
341 tests, one snapshot, 22 retained asset releases and production build pass.
Scoped ESLint and `git diff --check` pass. Chapter 1 is unchanged. No new asset,
dependency, continuous animation or network request was introduced.

The local production page was inspected at the normal desktop viewport and
390×844. New paragraphs, citations and historical methodology render correctly;
there is no horizontal page overflow at the phone width. The source disclosure
opens and exposes the original-report links and the currency-conversion basis.
The browser error log is empty. Temporary viewport override was reset.

Evidence screenshots (local review artifacts):
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-prose-desktop.png`
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-prose-mobile.png`


## USD history, grouped YoY view and PS5 annotations

Required `API_BASE_URL=http://localhost:8000 npm run ci` exited 0: 66 suites,
343 tests, one snapshot, 22 retained asset releases and production build pass.
Scoped ESLint and `git diff --check` pass. Added checks cover per-year FX,
converted reconciliation, shared growth bounds, missing baseline, negative-bar
geometry, category isolation, retained selections and the supply annotations.

Local production browser checks at 1280×900, 768×1024, 390×844 and 320×760:
no horizontal page overflow; Revenue and Year-over-year change controls work;
four category bars per comparison year, no invented FY2016 growth; gains and
losses share the zero line; keyboard category selection and mode switching
retain FY2022; supply annotation/milestone selects its sourced explanation;
2022 hardware displays +58.1% / US$8.30bn. All mobile chart buttons meet 44px
height. Fixed axes remain legible while years scroll, and source disclosure
retains JPY values and each annual FX link. Browser error log is empty.
No new dependency, asset, network request or continuous animation was added.

Review captures:
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-usd-yoy-desktop.png`
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-usd-yoy-mobile.png`

Currency and source boundaries are documented in `SONY_FINANCIAL_HISTORY.md`.
FY2025 chapter prose and manuscript copies now match the USD display. The early
1990s source-currency historical figures remain explicitly identified as yen.


## Yearly composition and chart introduction

The detailed readout now shows a solid 100% revenue stack beside category
amounts, with dashed prior-year outlines/boundaries, previous shares, and signed
share changes in percentage points. The full-year denominator and all four
categories remain visible when the main chart is filtered; the selected category
is emphasized. The grouped-growth view separately labels revenue YoY. FY2016
omits a fabricated comparison. The revenue-scale paragraph now immediately
precedes the chart (`afterParagraph: 1`), confirmed in the rendered chapter;
its wording and the approved chapter 1 remain unchanged.

Required CI exited 0: 66 suites, 344 tests, one snapshot, 22 retained asset
releases and production build. Scoped lint and diff whitespace checks passed.
Added quantitative checks verify current/prior shares, pp shifts, reconciliation,
FX invariance, fixed proportions under filtering, and first-year missingness.

Production browser checks: desktop, 768×1024, 390×844 and 320×760. Solid/dashed
bars, signed pp labels and previous shares were inspected; no page or composition
region overflow. Keyboard category selection and mode/year changes keep the
comparison coherent; first-year missingness and FY2022/FY2025 details were
checked. Browser errors: none. Viewport override reset. The graphic is static,
so no additional motion, media or runtime dependency was introduced.

Review captures:
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-proportions-desktop.png`
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-proportions-mobile.png`


## Composition order and popup inspection

Corrected the selected-year stack to read top to bottom in the same order as its
category list. Direct percentage labels identify each solid segment. Hover,
keyboard focus and tap open a viewport-bounded tooltip; the current segment,
prior outline and matching category highlight together. The tooltip is outside
the readout's live region, and full-width category buttons provide accessible
alternatives to the small segments. Escape, loss of focus, another year, scrolling
and outside interaction dismiss stale detail.

Required CI passed: 66 suites, 345 tests, one snapshot, 22 retained asset releases
and production build. Scoped ESLint and whitespace checks passed. The new test
covers current/prior amounts and shares, pp shifts, matching highlights,
first-year missingness, keyboard focus, Escape, tap and stale-detail dismissal.
FY2025 measured solid heights on desktop were hardware 63.1875px and Other
29.28125px, consistent with 20.1557% / 9.3410% subject to subpixel rounding.
The earlier heights were also correct; opposite bar/list order caused ambiguity.

Browser verification at the normal desktop viewport, 768×1024, 390×844 and
320×760: no horizontal page overflow; popup remains inside the viewport;
category buttons exceed 44px in both dimensions; keyboard focus advances to the
next category, Escape closes, repeat tap unpins, changing year removes stale
content, and FY2016 shows no fabricated prior comparison. Browser errors: none.
Viewport override reset. No new asset, dependency or continuous animation.

Review captures:
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-tooltip-desktop.png`
- `/home/stpn/Documents/Codex/outputs/sanctuary-editorial/sony-tooltip-mobile.png`

## Platform captions and isolated revenue disclosures

Added actionable Xbox/NVIDIA timeline captions, the dated Activision Blizzard
callout naming Call of Duty and Diablo, and distinct PlayStation/Xbox headings.
Xbox year details now explain FY2021, FY2025 and FY2026. FY2024 displays the
reported US$5.729bn net acquisition effect; FY2025 displays Microsoft’s nearly
US$5bn Game Pass disclosure with approximate shares. Source definitions and
calculation limits are in PLATFORM_FINANCIAL_CASES.md.

Required app CI passes: 67 suites, 348 tests, one snapshot, asset checks and
production build. Scoped lint and whitespace checks pass. Existing interaction
tests now exercise captions in revenue/growth views, exact and approximate
disclosures, and their absence from NVIDIA. React review: no new hooks, network
requests, dependencies or animation loops; controls retain native keyboard
behavior and share existing selection state.

Local production checks covered desktop, 768px, 390px and 320px layouts. Captions
select the correct fiscal year; FY2024 persists across hardware growth mode;
Game Pass is about 21% of its total and the displayed bar matches that share.
No page overflow or clipped caption text. Tablet checking exposed leader
misalignment when the plot was wider than its scroll viewport: a container query
now removes fixed-caption connectors below the plot’s minimum width while the
year guides remain attached to their columns.

## Xbox: production decisions behind the chart

The chapter now follows the acquisition with Call of Duty’s release cadence,
Obsidian’s production choices and the changed timing of Call of Duty in Game
Pass. Chapter 1 supplies the editorial benchmark: a concrete event, enough
context to understand it, then its business consequence. The chart carries the
annual percentages; the reading passage omits the extended list of reported
misses, rankings and speculative attribution of revenue loss to individual games.

Checked the original Call of Duty and Xbox announcements, Circana’s sales post,
and PC Gamer’s account of Bloomberg’s Obsidian interview. The inventory-screen
quotation retains the complete 20-word sentence. Source notes distinguish US
full-game spending, missed forecasts and fiscal reporting periods. The production
examples are not presented as a decomposition of Microsoft’s annual decline.

Required app CI passed: 67 suites, 348 tests, one snapshot, all 22 retained asset
releases and production build. Scoped ESLint and whitespace checks passed.
Existing figure-placement and citation checks were updated for the added prose.
Both manuscript copies match every runtime chapter-2 paragraph; a comparison
against the previous commit confirms all other chapter data, including the
approved chapter 1, are unchanged. No chart behavior, media, dependency or
animation changed. Deployment verification is recorded on PR #98.

## Direct ecosystem comparison

Removed the three-paragraph Sony add-on/accounting/1990s detour. PlayStation’s
scale now leads straight into Xbox’s acquisition and NVIDIA’s computing
business. The publisher figure follows that comparison; the bridge names all
three ecosystems and connects them to later monetization decisions. The Xbox
production stories then follow under “Making the next release pay.” Body copy
is 179 words shorter. The chart retains revenue/profit boundaries, with the
add-on definition inside its game-revenue disclosure. Shared memory summaries
were corrected only to describe this reading order.

Required CI passed: 67 suites, 348 tests, one snapshot, all 22 asset releases and
production build. Scoped lint and whitespace checks passed. Figure/citation
indices match the new order; both manuscripts match every runtime paragraph.
Other chapters remain unchanged. No media, chart data, calculations, selection
behavior, dependency or animation changed. Preview verification is recorded on
PR #98.

## Microsoft: one work, competing offers

Replaced the disconnected acquisition/underperformance/production sequence with
one sourced story: Microsoft earning as publisher on Sony’s console, Black Ops
6 attracting Game Pass subscribers while selling through PlayStation and Steam,
and the later decision to delay future Call of Duty catalog entry. The link to
Sony is cross-company income from the same purchase; the link to NVIDIA is the
equipment business benefiting without owning the creative work. The narrative
distinguishes our sales/subscription interpretation from Microsoft’s published
announcements. Obsidian and subseries-cadence research remain in the source notes.

All Microsoft paragraphs now precede NVIDIA and the standalone publisher figure.
Both manuscripts, source IDs, evidence boundaries and figure indices are aligned.
No chart values, controls, assets, animation, dependency or other chapter changes.
Validation results and deployed revision are recorded in PR #98.

Validation for this revision: required app CI passes (67 suites, 348 tests, one snapshot, 22 asset releases and production build). Scoped lint and whitespace checks pass. The prior figure-position assertion was updated to the new paragraph indices before the successful CI run. Both manuscript copies match the runtime chapter, and all other manuscript chapter objects are unchanged. Preview verification is recorded in PR #98.
