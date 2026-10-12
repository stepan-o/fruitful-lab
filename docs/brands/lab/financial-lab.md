# Financial Lab — exchange timing prototype

Status: implementation on `codex/finance-exchange-lab`, 12 October 2026. Public
route `/tools/finance` in `apps/lab` for `https://www.fruitfulab.net`. This is a
new Lab tool, not a separate brand or deployment. Other apps are out of scope.

## Product question

Should a Canadian-dollar holder acquire Mexican pesos now, wait, or exchange a
portion now and the remainder later? Initial cases are CAD 1,000, 5,000 and
10,000. The owner specified a horizon until January with possible extensions.
The explicit starting assumption is **1 January 2027**, editable in the UI.
Deadline extensions of 30, 60 and 90 days are compared, not presumed beneficial.
The deadline is absolute and persists when a saved plan is loaded later.

The first screen is a dashboard: proposed allocation and reason, observed rate,
net pesos now, historical position, history/scenario chart, strategy comparison,
three-budget comparison, extension comparison and model diagnostics. The report
view provides the same evidence plus inputs, policy rules, methodology,
limitations and sources; browser print supports PDF. Source-history CSV contains
all fetched observations and exact source/derived units, independent of the
chart's display-only history filter.

## Source and ingestion

- Primary source: [Bank of Canada Valet API](https://www.bankofcanada.ca/valet-api-how-to/).
- Exact query: `https://www.bankofcanada.ca/valet/observations/FXMXNCAD/json?recent=800`.
- Source series `FXMXNCAD`: daily average Mexican peso in Canadian dollars.
- Display: reciprocal, **MXN per CAD**. Increasing means more pesos for CAD.
- [Publication methodology](https://www.bankofcanada.ca/rates/exchange/background-information-on-foreign-exchange-rates/)
  explains indicative reference rates, not executable transaction prices.
- [Terms](https://www.bankofcanada.ca/terms/) linked in every view's source footer.
- Official source verified on 12 October 2026: 800 observations, 25 July 2023
  through 9 October 2026; final CAD/MXN observation 0.07767. This is evidence of
  ingestion, not a pinned live-data fallback or a permanent current quote.
- Sort ascending (source currently returns descending). Validate dates, reject
  duplicates, future dates and invalid/nonpositive rates. Omit missing quotes;
  never forward fill. Require 253 observations. Reject recommendations when the
  latest date is more than four calendar days old or the latest 253 points
  contain an internal gap longer than seven days. These are conservative
  prototype quality thresholds, not a complete holiday calendar.
- Fixed server query, 12-second timeout, one-hour Next fetch caching and bounded
  response parsing. `GET /api/tools/finance/rates` returns public observations,
  source, omitted count and `checkedAt`; failure returns 503. There are no user
  query URLs, API keys, credentials, personalized caches or database writes.
- `checkedAt` means the app checked the possibly cached series. Source date is
  always prominent. A failed browser refresh retains the prior chart with advice
  paused. No synthetic data is substituted for a failed source.

## Forecast and decision method (`cad-mxn-1.0`)

1. Transform observations to log returns; use sample standard deviation of the
   most recent 252 returns as daily volatility.
2. Baseline is zero log drift: no-change median at the latest reference.
   Nominal 10th/90th bounds: `rate * exp(+-1.281551565545 * sigma * sqrt(h))`.
   `h` counts weekdays from last observation to decision deadline, including
   unpublished weekdays before the analysis date. Holidays are not individual
   exclusions. Stable independent Gaussian returns are an assumption, not a fact.
3. Challenger: half the previous 63-observation average log return projected
   over `h`. Never present its trend as established causal knowledge.
4. Walk-forward checks: training starts with 253 points; successive forecast
   windows do not overlap. Compare mean absolute rate errors and baseline
   interval coverage. Each forecast only uses its own available history. The
   full-sample comparison is exploratory, without an independent model-selection
   holdout or significance test. Few windows at longer horizons are explicit.
5. A challenger qualifies with at least 12 windows and at least 10% lower error.
   These are predeclared prototype thresholds, not optimized profitable rules.
6. Convert net pesos as `(CAD principal - fixed CAD fee) * rate * (1-markup/100)`.
   A partial plan pays two fees; a single transfer pays one. Amounts too small
   to pay a fee are infeasible. Assume same markup/fee for future transfers.
7. Quality gate precedes advice. A deadline within three days, a reached target
   after markup, or zero downside tolerance suggests all-now. Otherwise search
   allocations `[0,.25,.5,.75,1]` for the least upfront fraction whose lower
   modeled net scenario fits the loss tolerance relative to all-now.
8. Default minimum upfront fraction is 50%; manual event caution raises it to
   75%. Qualifying positive challenger gain above 0.5% allows an all-wait
   candidate, only if its lower baseline scenario fits tolerance. Actual loss
   can exceed the modeled tolerance. All-now is the feasible fallback.
9. Payout comparisons and uncertainty always use the baseline, even if the
   exploratory challenger influences the policy. The report discloses this.
10. Longer deadlines widen baseline uncertainty rather than creating a forecast
    gain. The tool does not infer that extending until spring is worthwhile.

Target rates, historical percentiles and trend are distinct: a percentile is
past context, a target is a user preference, and trend is an uncertain model.
Reference exchange-now payouts are estimates too: a daily average is not the
live rate a provider will execute. No borrowed/leverage position, speculative
trading, automatic transfer or funds movement occurs.

## Qualitative evidence and monitoring

Official Bank of Canada and Banco de México decision pages are linked. The user
can activate extra caution for news/policy risk; it raises the allocation floor
without manufacturing a directional price prediction. No automatic news,
sentiment, macro release ingestion or calibrated event probability is claimed.

Visible pages check for an hourly refresh and recheck on returning after an
hour. Hidden pages do not fetch. Local save/load uses
`fruitful_finance_plan_v1`; no personal values go into analytics or URLs.
No recurring background job or notification exists in this prototype.
Analytics use existing GTM helpers: `tool_view`, `tool_start`, and
`finance_interaction` with `tool_name=finance_exchange` plus an action enum only
(`scenario_apply`, `view_report`, `refresh`, `export_csv`, `print_report`, `save_plan`).

## Architecture and growth path

`lib/tools/finance/` owns source contracts, pure calculation, validation and
tracking. `components/tools/finance/` owns UI, original SVG charts and scoped CSS.
The server page and public API share the source adapter. No dependency, auth,
backend or cross-app contract change. Dedicated chart/report views share one
calculation engine and evidence snapshot.

Subsequent work can add a durable daily snapshot store, provider quotes and
settlement calendars, scheduled rate/target notifications, multiple currency
pairs and richer time series. Before directional model expansion, define a
separate time holdout, regime diagnostics, proper interval calibration and
fee-aware strategy backtests. For macro/news models, record source, publication
and availability timestamps (avoid revision/look-ahead leakage), extract
explicit scenarios and evaluate incremental value against this baseline.
Automatic model-driven financial decisions are outside this prototype.

## Verification

See `financial-lab-verification.md` for checks, evidence and outstanding limits.
