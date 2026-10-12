# Financial Lab methodology study

Study `cad-mxn-study-1.0`; operational policy `cad-mxn-1.1`. Authored 12 October
2026. This record accompanies the interactive Methodology tab at
`/tools/finance#methodology`. It is a research study, not a claim of validated
currency timing. Exact implementations: `lib/tools/finance/research.ts` and
`engine.ts`; explanatory interface: `components/tools/finance/Methodology.tsx`.

## Problem and objective

One-way CAD purchases of MXN, with CAD 1,000 / 5,000 / 10,000 budgets, initially
due January 1, 2027 (editable). Maximize net pesos subject to an explicit downside
preference and cash deadline. Staging is allowed; no borrowing or round trips.
Net pesos sum `(tranche CAD - fixed fee CAD) × MXN/CAD × (1 - markup)` over used
transfers. Treat provider execution, settlement, interest on balances, fee tiers
and spending-delay costs as separate missing inputs rather than silently assuming
they support postponement. A perfect historical maximum is an oracle comparator.

The reciprocal quote reverses extrema: high MXN per CAD is favorable; low CAD
per MXN represents the same opportunity. Inverting the source daily average is
not identical to averaging inverted intraday quotes.

## Evidence and time

Bank of Canada Valet `FXMXNCAD`, starting 2017-05-01 to avoid mixing publication
methodologies. Verified 2,356 observations through 2026-10-09; fetched 2026-10-12.
Final source rate 0.07767 CAD/MXN, reciprocal 12.874983906270117 MXN/CAD. The
application fetches the source, not a committed numerical fallback. CSV exports
all observations; local study JSON includes the full snapshot, version, selected
horizon/period/threshold, applied scenario, model metrics and policy outcomes.

Four clocks: history window, forecast horizon, event information time and cash
deadline. Model studies use observation/publication steps; the operational
deadline uses weekdays, with publication lag included and holidays not individually
modeled. Daily averages cannot establish intraday extrema or executable prices.

- Long (1–5 years): inflation, real exchange rate, productivity, fiscal credibility,
  trade structure and terms of trade inform regimes and plausible ranges. PPP is
  not an automatic January target.
- Mid (1–6 months): relative expected policy paths, carry positioning, inflation
  surprises and risk sentiment inform remaining allocation and extension scenarios.
- Short (1–20 publications): event information, volatility, causal reversals and
  actual provider quotes inform execution and settlement buffers.

The cross obeys `log(MXN/CAD) = log(MXN/USD) - log(CAD/USD)`. Common USD factors
can cancel partly, not necessarily fully; covariance matters. Studies of either
USD leg motivate features, not automatic CAD/MXN coefficients or sign predictions.

## Implemented experiments

1. Series laboratory: source quote, inverse quote, log returns, 21-return daily
   volatility, all/252/63-history windows, calendar spacing and exact-value slider.
   Lag-1 return and squared-return correlations, sample volatility and excess
   kurtosis are descriptive; ADF/KPSS and formal significance are not computed.
2. Online extrema: running high confirmed by a δ% decline; running low by a δ%
   rise. δ options 0.5%, 1%, 2%, 3%. Events retain extreme and confirmation dates;
   replay truncates available information. Optional strict ±5-observation extrema
   deliberately use future data and are identified as hindsight. Confirmed causal
   events cannot repaint when future observations arrive.
3. Point forecasts: zero-drift log random walk; half the preceding 63-return
   drift; lag-one return regression with slope clipped to ±0.95 then halved and
   zero long-run return; local log-level mean reversion toward the preceding
   253-level mean with assumed 63-publication half-life. All fit from history at
   their origin. Reversion anchor is not a fair-value estimate. No automatic
   parameter optimization or model promotion occurs.
4. Uncertainty: random-walk 80% interval using sample SD of 252 returns versus
   zero-mean EWMA (λ .94, initialized with the first 21 squared returns in that
   252-return window). Forward variance held constant at the fitted value times h.
   Coverage, average width and Winkler score are shown; challenger point paths do
   not claim calibrated bands. Gaussian tails omit jumps and parameter uncertainty.
5. Forecast origins advance by h = 5, 21, 63 publications, starting after 253
   observations. Earlier outcomes must end before 2024-01-01; later origins must
   start on/after that date. No label crosses the split. Refit each origin using
   past data, including earlier later-period observations when available. Skip
   windows with >7-calendar-day source gaps in training or outcome. Display MAE,
   RMSE, signed bias and directional hit rate with explicit abstentions.
6. Policy experiment: next-observation all-now, all-at-deadline, 50/50 now/deadline,
   and 50% now with remainder at the publication after first confirmed peak or
   deadline. Execution is always after the information cutoff, never at the
   historical peak or same-day average. Same-publication tranches combine fees;
   fee-infeasible cases are excluded and counted. Display net gains, wins (ties
   excluded), worst gain and regret versus best future reference. These are
   hypothetical reference-price executions, not provider-quote backtests.
7. Mixed-evidence sensitivity: user-elicited three-scenario weights and conditional
   moves, with net payouts and downside after dashboard costs. Explicitly not
   learned probabilities, ingested news, a continuous predictive distribution or
   an input to the current recommendation.

## Initial empirical readout

Source cutoff 2026-10-09; later evaluation from 2024; these results are not fixed
UI claims and update with the source. The sample was inspected during development,
so the later period is **not** a never-seen prospective holdout.

| Horizon (publications) | Windows | No-change MAE | Half-drift MAE | Return-AR MAE | Reversion MAE |
| --- | ---: | ---: | ---: | ---: | ---: |
| 5 | 138 | 0.12522 | 0.12447 | 0.12520 | 0.13227 |
| 21 | 32 | 0.21249 | 0.22662 | 0.21343 | 0.27821 |
| 63 | 10 | 0.52477 | 0.48181 | 0.52559 | 0.72287 |

Units MXN/CAD. At h=63 drift improves MAE but worsens RMSE (0.62647 versus
0.62077); the 10-window sample does not establish robustness. At h=21 the EWMA
interval has 78.125% observed coverage and Winkler score 1.25972, versus 87.5%
and 1.31361 for constant volatility. At h=63 EWMA undercovers (70%) and has a
slightly worse Winkler score. No universal volatility-model winner is inferred.

For CAD 1,000, 1% markup, no fixed fee, h=21 and δ=1%:

| Policy | Mean gain vs next-reference now (MXN) | Worst gain (MXN) | Wins |
| --- | ---: | ---: | ---: |
| Wait | -26.10 | -560.99 | 46.875% |
| 50/50 deadline | -13.05 | -280.49 | 46.875% |
| 50/50 peak-confirmed | -25.83 | -144.53 | 28.125% |

Confirmation reduced worst observed giveback but did not improve average proceeds.
Worst observed loss is not a future tail bound. A Python calculation independently
reconciled h=21 no-change MAE and all-wait mean gain with the TypeScript experiment
within 1e-9. Other metrics are covered by known-answer and causal-invariance tests.

## Mixed methods and qualification

Qualitative evidence may change central direction, regime weights or uncertainty;
it is not confined to a generic caution flag. Proposed evidence records retain
original document/excerpt, author, language, publication/retrieval/available time,
revision, prior expectations, surprise, causal channel, horizon, competing
explanation, expiry and falsifier. Freeze extraction taxonomy/model; human-check
coding and disagreements; deduplicate reports. Model extraction confidence is not
an outcome probability. Historical extraction must avoid later-fact contamination.

Compare rates-only, evidence-only and combined models with identical chronological
outcomes and execution lags. Calibrate scenario weights with proper scores and
inspect ablations. Conditional mixture is `p(R|I) = sum_s w_s p(R|s,I)`. The current
three-point sandbox omits within-scenario distributions and tails. No archival
text feed, LLM extractor, fitted mixed forecast or validation result is claimed.

Qualification requires prospective frozen versions, point-in-time macro/news
vintages and executable quotes. Use nested rolling validation for tuning; purge
cross-boundary outcome labels and separate folds for overlapping event horizons.
Report paired loss uncertainty using time blocks, regime stability, calibration,
cost sensitivity, transfer counts and deadline attainment; account for model/
threshold search. Shared training windows are not independent replicates. Neither
a small MAE lead nor a fixed minimum sample count proves an economic edge.

## Selected operational method

Keep the no-change reference distribution and a disclosed 50% minimum upfront
policy preference (75% for manual caution); choose the least feasible grid fraction
that meets modeled downside tolerance. Deadline/target/zero-risk overrides remain.
This is a heuristic, not expected-utility optimization or a guaranteed loss cap.
Version 1.1 **removes** the prior trend-screen authority to allow all-wait. Scores,
causal turning signals and scenario sliders are research evidence, not hidden
overrides. Extension needs a documented thesis and costs of waiting, not simply a
larger future range. Candidate combination: risk model + causal execution signal
+ source-timed evidence, promoted only after prospective economic validation.

## Primary references reviewed

- [BoC rate methodology](https://www.bankofcanada.ca/rates/exchange/background-information-on-foreign-exchange-rates/)
- [Forecasting toolbox](https://otexts.com/fpp3/toolbox.html), [ARIMA](https://otexts.com/fpp3/arima.html), [judgment](https://otexts.com/fpp3/judgmental.html)
- [Glattfelder & Olsen, intrinsic time](https://arxiv.org/abs/2406.07354)
- [BoC Canadian-dollar predictors](https://www.bankofcanada.ca/2016/03/staff-analytical-note-2016-2/)
- [Banxico peso risk premium](https://www.banxico.org.mx/DIBM/web/documento/visor.html?clave=2016-11&locale=en)
- [BoC Money Talks](https://www.bankofcanada.ca/2025/11/staff-working-paper-2025-33/)
- [NBER macro-announcement surprises](https://www.nber.org/papers/w8959)
- [Engle Nobel lecture](https://www.nobelprize.org/uploads/2018/06/engle-lecture.pdf)
- [BIS commodities and exchange rates](https://www.bis.org/publications/working-paper-551-when-walk-not-random-commodity-prices-and-exchange-rates)

These motivate hypotheses and evaluation design, not a current CAD/MXN call.
