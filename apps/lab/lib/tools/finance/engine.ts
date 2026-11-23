import { Observation, RateSnapshot, Scenario } from "./types";
import { torontoDate } from "./data";

const DAY = 86400000;
const Z80 = 1.281551565545;
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export const percentChange = (current: number, previous: number) => (current / previous - 1) * 100;
export function addDays(date: string, days: number) {
  return new Date(Date.parse(date) + days * DAY).toISOString().slice(0, 10);
}
export function weekdaysBetween(from: string, to: string) {
  let n = 0;
  for (let d = Date.parse(from) + DAY; d <= Date.parse(to); d += DAY) {
    const day = new Date(d).getUTCDay();
    if (day !== 0 && day !== 6) n++;
  }
  return n;
}
export function validateScenario(s: Scenario): string | null {
  if (!Number.isFinite(s.amount) || s.amount < 1 || s.amount > 10_000_000) return "Enter an amount from CAD 1 to CAD 10,000,000.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.deadline) || !Number.isFinite(Date.parse(s.deadline)) || new Date(s.deadline).toISOString().slice(0, 10) !== s.deadline) return "Choose a valid exchange deadline.";
  if (!Number.isFinite(s.spread) || s.spread < 0 || s.spread > 20) return "Enter a rate markup from 0% to 20%.";
  if (!Number.isFinite(s.fee) || s.fee < 0 || s.fee >= s.amount) return "The fee must be non-negative and smaller than the amount.";
  if (!Number.isFinite(s.lossBudget) || s.lossBudget < 0 || s.lossBudget > 20) return "Enter a downside tolerance from 0% to 20%.";
  if (s.target !== null && (!Number.isFinite(s.target) || s.target <= 0 || s.target > 1000)) return "Enter a positive target rate no greater than 1,000 MXN/CAD, or leave it blank.";
  if (typeof s.eventRisk !== "boolean") return "The event-risk setting is invalid.";
  return null;
}
function returns(rows: Observation[]) {
  return rows.slice(1).map((r, i) => Math.log(r.mxnPerCad / rows[i].mxnPerCad));
}
function volatility(rows: Observation[]) {
  const rs = returns(rows.slice(-253));
  const avg = mean(rs);
  return Math.sqrt(rs.reduce((a, b) => a + (b - avg) ** 2, 0) / (rs.length - 1));
}
// The challenger retains only half the previous 63-observation log drift.
function trend(rows: Observation[], h: number) {
  const last = rows[rows.length - 1].mxnPerCad;
  return last * Math.exp(Math.log(last / rows[rows.length - 64].mxnPerCad) / 63 * h * 0.5);
}
export function backtest(rows: Observation[], horizon: number) {
  const h = Math.max(1, horizon);
  const trials: { date: string; baseline: number; trend: number; covered: boolean }[] = [];
  // Non-overlapping outcome windows; each forecast uses past observations only.
  for (let origin = rows.length - 1 - h; origin >= 252; origin -= h) {
    const train = rows.slice(0, origin + 1);
    const start = rows[origin].mxnPerCad;
    const actual = rows[origin + h].mxnPerCad;
    const width = Z80 * volatility(train) * Math.sqrt(h);
    trials.push({ date: rows[origin].date, baseline: Math.abs(actual - start),
      trend: Math.abs(actual - trend(train, h)), covered: actual >= start * Math.exp(-width) && actual <= start * Math.exp(width) });
  }
  const baselineMae = trials.length ? mean(trials.map(t => t.baseline)) : null;
  const trendMae = trials.length ? mean(trials.map(t => t.trend)) : null;
  const skill = baselineMae && trendMae !== null ? (1 - trendMae / baselineMae) * 100 : 0;
  const coverage = trials.length ? mean(trials.map(t => Number(t.covered))) * 100 : null;
  return { count: trials.length, baselineMae, trendMae, skill, coverage,
    firstOrigin: trials[trials.length - 1]?.date, lastOrigin: trials[0]?.date };
}
export function netPesos(amount: number, rate: number, spread: number, fee: number) {
  return Math.max(0, amount - fee) * rate * (1 - spread / 100);
}
export function analyze(snapshot: RateSnapshot, s: Scenario, today = torontoDate(new Date(snapshot.checkedAt))) {
  const error = validateScenario(s);
  if (error) throw new Error(error);
  const rows = snapshot.observations;
  const last = rows[rows.length - 1];
  if (rows.length < 253 || !last) throw new Error("Insufficient history.");
  const deadline = s.deadline < today ? today : s.deadline;
  const days = Math.round((Date.parse(deadline) - Date.parse(today)) / DAY);
  if (days > 365) throw new Error("Choose a deadline within the next 365 days.");
  const horizon = weekdaysBetween(today, deadline);
  // Include unpublished weekdays since the last observation in forecast uncertainty.
  const sourceLag = weekdaysBetween(last.date, today);
  const modelHorizon = horizon + sourceLag;
  const ageDays = Math.floor((Date.parse(today) - Date.parse(last.date)) / DAY);
  const largeGap = rows.slice(-253).some((r, i, recent) => i > 0 && Date.parse(r.date) - Date.parse(recent[i - 1].date) > 7 * DAY);
  const blocked = ageDays > 4 || ageDays < 0 || largeGap;
  const sigma = volatility(rows);
  const width = Z80 * sigma * Math.sqrt(modelHorizon);
  const low = last.mxnPerCad * Math.exp(-width);
  const high = last.mxnPerCad * Math.exp(width);
  const audit = backtest(rows, modelHorizon);
  const challenger = trend(rows, modelHorizon);
  // Exploratory evidence gate, never a claim of a proven edge or statistical significance.
  const trendSupported = audit.count >= 12 && audit.skill >= 10;
  const now = netPesos(s.amount, last.mxnPerCad, s.spread, s.fee);
  const strategies = [0, .25, .5, .75, 1].map(fraction => {
    const first = fraction > 0 ? netPesos(s.amount * fraction, last.mxnPerCad, s.spread, s.fee) : 0;
    const future = (rate: number) => fraction < 1 ? netPesos(s.amount * (1 - fraction), rate, s.spread, s.fee) : 0;
    const feasible = (fraction === 0 || s.amount * fraction > s.fee) && (fraction === 1 || s.amount * (1 - fraction) > s.fee);
    return { fraction, feasible, low: first + future(low), middle: first + future(last.mxnPerCad), high: first + future(high),
      downside: now ? Math.max(0, (now - first - future(low)) / now * 100) : 0,
      feeCad: (fraction > 0 && fraction < 1 ? 2 : 1) * s.fee };
  });
  const targetMet = s.target !== null && last.mxnPerCad * (1 - s.spread / 100) >= s.target;
  let fraction = 1;
  let reason = "The exchange deadline is close. Allow time for your provider to deliver the money.";
  if (days > 3) {
    if (targetMet) reason = "Your target rate is met after the assumed markup. Exchanging now removes the risk of losing it.";
    else if (s.lossBudget === 0) reason = "You chose zero tolerance for receiving fewer pesos. Exchanging now removes future rate exposure.";
    else {
      const minimum = s.eventRisk ? .75 : .5;
      const chosen = strategies.find(row => row.fraction >= minimum && row.feasible && row.downside <= s.lossBudget);
      fraction = chosen?.fraction ?? 1;
      reason = s.eventRisk
        ? "Your event-risk flag raises the minimum exchange today to 75%. The model cannot price an unreviewed news shock."
        : "The planning policy starts with at least half now, then limits the remainder to your modeled downside tolerance. This is a risk preference, not a proven timing optimum.";
      if (fraction === 1) reason += " Fees and downside tolerance leave exchanging everything now as the feasible plan.";
    }
  }
  const selected = strategies.find(row => row.fraction === fraction)!;
  return { last, deadline, days, horizon, modelHorizon, ageDays, blocked, largeGap, sigma,
    low, high, middle: last.mxnPerCad, challenger, audit, trendSupported, now, strategies, selected, reason,
    action: blocked ? "Refresh data before deciding" : fraction === 1 ? "Exchange now" : fraction === 0 ? "Hold and review" : "Split the exchange",
    targetMet, monthChange: percentChange(last.mxnPerCad, rows[rows.length - 22].mxnPerCad),
    yearPercentile: rows.slice(-252).filter(r => r.mxnPerCad <= last.mxnPerCad).length / 252 * 100,
    yearLow: Math.min(...rows.slice(-252).map(r => r.mxnPerCad)), yearHigh: Math.max(...rows.slice(-252).map(r => r.mxnPerCad)),
  };
}
export type Analysis = ReturnType<typeof analyze>;
