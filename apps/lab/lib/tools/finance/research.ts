import type { Observation, Scenario } from "./types";
import { netPesos } from "./engine";

// Fixed study specifications, not selected by maximizing this sample's score.
export const STUDY_VERSION = "cad-mxn-study-1.0";
export const EVALUATION_START = "2024-01-01";
export const MODELS = [
  { id: "walk", name: "No change", color: "#263e37", dash: "" },
  { id: "drift", name: "Half drift · 63", color: "#9b651e", dash: "8 4" },
  { id: "ar", name: "Return AR(1)", color: "#326b9c", dash: "3 3" },
  { id: "revert", name: "Local mean reversion", color: "#82577d", dash: "10 3 2 3" },
] as const;
export type ModelId = typeof MODELS[number]["id"];
export const mean = (xs: number[]) => xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
export function sd(xs: number[]) { const m = mean(xs); return xs.length > 1 ? Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1)) : 0; }
export const logReturns = (rows: Observation[]) => rows.slice(1).map((r, i) => Math.log(r.mxnPerCad / rows[i].mxnPerCad));
export function acf(xs: number[], lag = 1) {
  const m = mean(xs), denominator = xs.reduce((a, x) => a + (x - m) ** 2, 0);
  return denominator ? xs.slice(lag).reduce((a, x, i) => a + (x - m) * (xs[i] - m), 0) / denominator : 0;
}
export function diagnostics(rows: Observation[]) {
  const rs = logReturns(rows), sigma = sd(rs), m = mean(rs);
  return { count: rs.length, sigma, acf: acf(rs), squaredAcf: acf(rs.map(x => x * x)),
    excessKurtosis: sigma ? mean(rs.map(x => ((x - m) / sigma) ** 4)) - 3 : 0,
    recentSigma: sd(rs.slice(-21)), longSigma: sd(rs.slice(-252)) };
}
export function forecast(rows: Observation[], horizon: number) {
  if (rows.length < 253 || !Number.isInteger(horizon) || horizon < 1 || horizon > 260) throw new Error("Study needs 253 observations and a horizon of 1–260 publications.");
  const rates = rows.slice(-253).map(r => r.mxnPerCad), logs = rates.map(Math.log);
  const rs = logReturns(rows.slice(-253)), last = rates.at(-1)!;
  const drift = mean(rs.slice(-63)) * .5;
  const arX = rs.slice(0, -1), arY = rs.slice(1);
  const mx = mean(arX), my = mean(arY);
  const denom = arX.reduce((a, x) => a + (x - mx) ** 2, 0);
  const rawPhi = denom ? arX.reduce((a, x, i) => a + (x - mx) * (arY[i] - my), 0) / denom : 0;
  const phi = Math.max(-.95, Math.min(.95, rawPhi)) * .5;
  const level = mean(logs); // An assumed local anchor, never a PPP/fair-value estimate.
  const sigma = sd(rs);
  let ewmaVariance = mean(rs.slice(0, 21).map(x => x * x));
  for (const r of rs.slice(21)) ewmaVariance = .94 * ewmaVariance + .06 * r * r;
  let arReturn = rs.at(-1)!, arLog = Math.log(last), revertLog = arLog;
  const paths: Record<ModelId, number[]> = { walk: [last], drift: [last], ar: [last], revert: [last] };
  const low = [last], high = [last], ewmaLow = [last], ewmaHigh = [last];
  for (let h = 1; h <= horizon; h++) {
    arReturn *= phi; arLog += arReturn;
    revertLog = level + Math.exp(-Math.log(2) / 63) * (revertLog - level);
    paths.walk.push(last); paths.drift.push(last * Math.exp(drift * h));
    paths.ar.push(Math.exp(arLog)); paths.revert.push(Math.exp(revertLog));
    const width = 1.281551565545 * sigma * Math.sqrt(h);
    const ew = 1.281551565545 * Math.sqrt(ewmaVariance * h);
    low.push(last * Math.exp(-width)); high.push(last * Math.exp(width));
    ewmaLow.push(last * Math.exp(-ew)); ewmaHigh.push(last * Math.exp(ew));
  }
  return { paths, low, high, ewmaLow, ewmaHigh, sigma, ewmaSigma: Math.sqrt(ewmaVariance), phi };
}

export type Turn = { kind: "peak" | "trough"; extreme: number; confirmed: number; extremeRate: number; confirmedRate: number };
// Online directional changes. A confirmed event never changes when future rows arrive.
export function directionalChanges(rows: Observation[], threshold: number): Turn[] {
  if (!(threshold > 0 && threshold < 100)) throw new Error("Reversal threshold must be between 0 and 100%.");
  if (!rows.length) return [];
  const d = threshold / 100, events: Turn[] = [];
  let mode: "unknown" | "up" | "down" = "unknown", high = 0, low = 0;
  for (let i = 1; i < rows.length; i++) {
    const p = rows[i].mxnPerCad;
    if (mode !== "down" && p > rows[high].mxnPerCad) high = i;
    if (mode !== "up" && p < rows[low].mxnPerCad) low = i;
    if (mode !== "down" && p <= rows[high].mxnPerCad * (1 - d)) {
      events.push({ kind: "peak", extreme: high, confirmed: i, extremeRate: rows[high].mxnPerCad, confirmedRate: p });
      mode = "down"; low = i;
    } else if (mode !== "up" && p >= rows[low].mxnPerCad * (1 + d)) {
      events.push({ kind: "trough", extreme: low, confirmed: i, extremeRate: rows[low].mxnPerCad, confirmedRate: p });
      mode = "up"; high = i;
    }
  }
  return events;
}
export function centeredExtrema(rows: Observation[], radius = 5) {
  const turns: { index: number; kind: "peak" | "trough" }[] = [];
  for (let i = radius; i < rows.length - radius; i++) {
    const p = rows[i].mxnPerCad, neighbors = rows.slice(i - radius, i + radius + 1).filter((_, j) => j !== radius);
    if (neighbors.every(r => p > r.mxnPerCad)) turns.push({ index: i, kind: "peak" });
    if (neighbors.every(r => p < r.mxnPerCad)) turns.push({ index: i, kind: "trough" });
  }
  return turns;
}
const hasGap = (rows: Observation[], start: number, end: number) => rows.slice(start + 1, end + 1).some((r, i) => Date.parse(r.date) - Date.parse(rows[start + i].date) > 7 * 86400000);
export function evaluationOrigins(rows: Observation[], horizon: number, period: "early" | "late") {
  if (!Number.isInteger(horizon) || horizon < 1 || horizon > 260) throw new Error("Evaluation horizon must be 1–260 publications.");
  const splitFound = rows.findIndex(r => r.date >= EVALUATION_START);
  const split = splitFound < 0 ? rows.length : splitFound;
  const start = period === "early" ? 252 : Math.max(252, split);
  const end = period === "early" ? split - 1 : rows.length - 1;
  const origins: number[] = [];
  let skipped = 0;
  for (let i = start; i + horizon <= end; i += horizon) {
    if (hasGap(rows, i - 252, i + horizon)) skipped++; else origins.push(i);
  }
  return { origins, skipped };
}
const winkler = (lo: number, hi: number, y: number) => hi - lo + (y < lo ? 10 * (lo - y) : y > hi ? 10 * (y - hi) : 0);
export function evaluateModels(rows: Observation[], horizon: number, period: "early" | "late") {
  const { origins, skipped } = evaluationOrigins(rows, horizon, period);
  const trials = origins.map(origin => {
    const f = forecast(rows.slice(0, origin + 1), horizon), actual = rows[origin + horizon].mxnPerCad;
    return { f, actual, start: rows[origin].mxnPerCad };
  });
  const scores = MODELS.map(model => {
    const errors = trials.map(t => t.f.paths[model.id][horizon] - t.actual);
    const directional = trials.filter(t => Math.abs(t.f.paths[model.id][horizon] / t.start - 1) > 1e-8);
    return { ...model, count: trials.length, mae: trials.length ? mean(errors.map(Math.abs)) : null,
      rmse: trials.length ? Math.sqrt(mean(errors.map(x => x * x))) : null,
      bias: trials.length ? mean(errors) : null,
      direction: directional.length ? 100 * mean(directional.map(t => Number(Math.sign(t.f.paths[model.id][horizon] - t.start) === Math.sign(t.actual - t.start)))) : null,
      directionCount: directional.length };
  });
  const intervals = ["constant", "ewma"].map(method => {
    const values = trials.map(({ f, actual }) => {
      const lo = (method === "constant" ? f.low : f.ewmaLow)[horizon], hi = (method === "constant" ? f.high : f.ewmaHigh)[horizon];
      return { covered: Number(actual >= lo && actual <= hi), width: hi - lo, score: winkler(lo, hi, actual) };
    });
    return { method, count: values.length, coverage: values.length ? 100 * mean(values.map(v => v.covered)) : null,
      width: values.length ? mean(values.map(v => v.width)) : null, score: values.length ? mean(values.map(v => v.score)) : null };
  });
  return { scores, intervals, count: trials.length, skipped, first: rows[origins[0]]?.date, last: rows[origins.at(-1) ?? -1]?.date };
}

export const POLICIES = ["Next observation", "Wait to deadline", "50% now / 50% deadline", "50% now / peak-confirmed remainder"] as const;
export function evaluatePolicies(rows: Observation[], horizon: number, period: "early" | "late", threshold: number, s: Scenario) {
  const { origins, skipped } = evaluationOrigins(rows, horizon, period);
  const events = directionalChanges(rows, threshold);
  const runs = origins.map(origin => {
    const end = origin + horizon;
    // Origin is after publication. Every action uses a later publication, never the signal's average.
    const entry = origin + 1;
    const signal = events.find(e => e.kind === "peak" && e.confirmed >= origin && e.confirmed < end);
    const exit = signal ? signal.confirmed + 1 : end;
    const payout = (parts: [number, number][]) => {
      const combined = new Map<number, number>();
      for (const [index, amount] of parts) combined.set(index, (combined.get(index) ?? 0) + amount);
      if ([...combined.values()].some(amount => amount <= s.fee)) return null;
      return [...combined].reduce((total, [index, amount]) => total + netPesos(amount, rows[index].mxnPerCad, s.spread, s.fee), 0);
    };
    const baseline = payout([[entry, s.amount]])!;
    const oracle = Math.max(...rows.slice(entry, end + 1).map(r => netPesos(s.amount, r.mxnPerCad, s.spread, s.fee)));
    return { baseline, oracle, payouts: [baseline, payout([[end, s.amount]]), payout([[entry, s.amount / 2], [end, s.amount / 2]]), payout([[entry, s.amount / 2], [exit, s.amount / 2]])] };
  });
  return { skipped, count: runs.length, scores: POLICIES.map((name, p) => {
    const valid = runs.filter(r => r.payouts[p] !== null);
    const gains = valid.map(r => r.payouts[p]! - r.baseline);
    const regret = valid.map(r => r.oracle - r.payouts[p]!);
    return { name, count: valid.length, meanGain: valid.length ? mean(gains) : null,
      winRate: valid.length ? 100 * mean(gains.map(g => Number(g > 1e-8))) : null,
      worst: valid.length ? Math.min(...gains) : null, regret: valid.length ? mean(regret) : null };
  }) };
}

// Sensitivity analysis only: inputs are elicited assumptions, never inferred news probabilities.
export function scenarioMixture(base: number, shiftPercent: number, upWeight: number, downWeight: number, amount: number, spread: number, fee: number, fraction: number) {
  if (![upWeight, downWeight].every(x => Number.isFinite(x) && x >= 0 && x <= 100) || upWeight + downWeight > 100) throw new Error("Scenario weights must sum to at most 100%.");
  const states = [
    { label: "More pesos per CAD", weight: upWeight / 100, rate: base * (1 + shiftPercent / 100) },
    { label: "Little net change", weight: (100 - upWeight - downWeight) / 100, rate: base },
    { label: "Fewer pesos per CAD", weight: downWeight / 100, rate: base * (1 - shiftPercent / 100) },
  ].map(state => ({ ...state, pesos: (fraction ? netPesos(amount * fraction, base, spread, fee) : 0) + (fraction < 1 ? netPesos(amount * (1 - fraction), state.rate, spread, fee) : 0) }));
  const now = netPesos(amount, base, spread, fee);
  return { states, now, expected: states.reduce((sum, s) => sum + s.weight * s.pesos, 0),
    downside: Math.min(...states.filter(s => s.weight > 0).map(s => s.pesos)) - now,
    feasible: (fraction === 0 || amount * fraction > fee) && (fraction === 1 || amount * (1 - fraction) > fee) };
}
