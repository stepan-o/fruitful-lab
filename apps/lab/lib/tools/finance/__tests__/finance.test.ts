import { analyze, backtest, netPesos, validateScenario, weekdaysBetween } from "../engine";
import { parseObservations } from "../data";
import { DEFAULT_SCENARIO, type RateSnapshot } from "../types";

function fixture(count = 800, moving = true): RateSnapshot {
  const dates: string[] = [];
  for (let d = Date.parse("2026-10-09"); dates.length < count; d -= 86400000) {
    if (![0,6].includes(new Date(d).getUTCDay())) dates.unshift(new Date(d).toISOString().slice(0, 10));
  }
  return { source: "Bank of Canada", checkedAt: "2026-10-12T16:00:00Z", omitted: 0,
    observations: dates.map((date, i) => { const rate = moving ? 13 * Math.exp(.00015 * i + .035 * Math.sin(i / 12)) : 13; return { date, mxnPerCad: rate, cadPerMxn: 1 / rate }; }) };
}
const source = () => ({ observations: fixture().observations.slice().reverse().map(r => ({ d: r.date, FXMXNCAD: { v: String(r.cadPerMxn) } })) });

test("Bank of Canada descending data is sorted and inverted correctly", () => {
  const parsed = parseObservations(source(), new Date("2026-10-12T16:00:00Z"));
  expect(parsed.observations).toHaveLength(800);
  expect(parsed.observations[0].date < parsed.observations[799].date).toBe(true);
  expect(parsed.observations[799].mxnPerCad * parsed.observations[799].cadPerMxn).toBeCloseTo(1, 12);
});
test("missing publications are omitted, while invalid, duplicate and future data fail closed", () => {
  const payload = source(); payload.observations[3].FXMXNCAD.v = "";
  expect(parseObservations(payload, new Date("2026-10-12"))).toMatchObject({ omitted: 1 });
  for (const invalid of ["0", "-1", "NaN", "Infinity"]) {
    const p = source(); p.observations[0].FXMXNCAD.v = invalid;
    expect(() => parseObservations(p, new Date("2026-10-12"))).toThrow();
  }
  const duplicate = source(); duplicate.observations.push(duplicate.observations[0]);
  expect(() => parseObservations(duplicate, new Date("2026-10-12"))).toThrow("duplicate");
  const future = source(); future.observations[0].d = "2027-01-01";
  expect(() => parseObservations(future, new Date("2026-10-12"))).toThrow("future");
  expect(() => parseObservations({ observations: [] })).toThrow("253");
});
test("conversion costs and staged fees reconcile", () => {
  expect(netPesos(1000, 13, 1, 5)).toBeCloseTo(12805.65);
  const a = analyze(fixture(), { ...DEFAULT_SCENARIO, fee: 5 });
  const half = a.strategies.find(row => row.fraction === .5)!;
  expect(half.feeCad).toBe(10);
  expect(a.now - half.middle).toBeCloseTo(5 * a.middle * .99);
  expect(a.strategies[4].low).toBe(a.now);
  expect(a.strategies[4].high).toBe(a.now);
  expect(a.low).toBeLessThan(a.middle); expect(a.high).toBeGreaterThan(a.middle);
});
test("January deadline and horizon use actual dates and include source lag", () => {
  const a = analyze(fixture(), DEFAULT_SCENARIO);
  expect(a.deadline).toBe("2027-01-01"); expect(a.days).toBe(81);
  expect(a.modelHorizon).toBe(weekdaysBetween("2026-10-09", "2027-01-01"));
  expect(weekdaysBetween("2026-10-09", "2026-10-12")).toBe(1);
  expect(analyze(fixture(), DEFAULT_SCENARIO, "2026-10-13").deadline).toBe(a.deadline);
});
test("expired deadlines, reached targets and zero downside tolerance exchange now", () => {
  for (const edit of [{ deadline: "2026-10-01" }, { target: 1 }, { lossBudget: 0 }]) {
    expect(analyze(fixture(), { ...DEFAULT_SCENARIO, ...edit }).selected.fraction).toBe(1);
  }
});
test("stale and gapped histories suppress timing advice", () => {
  expect(analyze(fixture(), DEFAULT_SCENARIO, "2026-10-20").action).toBe("Refresh data before deciding");
  const gap = fixture(); gap.observations.splice(-30, 10);
  expect(analyze(gap, DEFAULT_SCENARIO).blocked).toBe(true);
});
test("event caution, fees and the downside budget constrain the allocation", () => {
  const a = analyze(fixture(), { ...DEFAULT_SCENARIO, eventRisk: true, lossBudget: 20 });
  expect(a.selected.fraction).toBeGreaterThanOrEqual(.75);
  expect(a.selected.downside).toBeLessThanOrEqual(20);
  const costly = analyze(fixture(), { ...DEFAULT_SCENARIO, fee: 600 });
  expect(costly.strategies.find(s => s.fraction === .5)?.feasible).toBe(false);
  expect(costly.selected.fraction).toBe(1);
});
test("baseline is unchanged and interval widens with an extension", () => {
  const jan = analyze(fixture(), DEFAULT_SCENARIO);
  const april = analyze(fixture(), { ...DEFAULT_SCENARIO, deadline: "2027-04-01" });
  expect(jan.middle).toBe(april.middle);
  expect(april.low).toBeLessThan(jan.low);
  expect(april.high).toBeGreaterThan(jan.high);
  expect(april.audit.count).toBeLessThan(12);
  expect(april.trendSupported).toBe(false);
});
test("flat-series walk-forward baseline has zero error and exact coverage", () => {
  const audit = backtest(fixture(800, false).observations, 21);
  expect(audit.baselineMae).toBe(0); expect(audit.trendMae).toBe(0);
  expect(audit.coverage).toBe(100); expect(audit.count).toBe(Math.floor((799 - 252) / 21));
});
test("walk-forward forecast never fits the outcome window", () => {
  const data = fixture(274, false).observations;
  data[data.length - 1] = { ...data[data.length - 1], mxnPerCad: 26, cadPerMxn: 1 / 26 };
  const result = backtest(data, 21);
  expect(result.count).toBe(1);
  expect(result.baselineMae).toBe(13); expect(result.trendMae).toBe(13);
  expect(result.coverage).toBe(0);
});
test("bad user inputs cannot produce numerical recommendations", () => {
  for (const edit of [{ amount: NaN }, { spread: 100 }, { fee: -1 }, { target: Infinity }, { deadline: "2027-02-30" }, { lossBudget: -1 }]) {
    expect(validateScenario({ ...DEFAULT_SCENARIO, ...edit })).toBeTruthy();
  }
  expect(() => analyze(fixture(), { ...DEFAULT_SCENARIO, deadline: "2030-01-01" })).toThrow("365");
});
test("1k, 5k and 10k scale linearly when no fixed fee applies", () => {
  const a = analyze(fixture(), DEFAULT_SCENARIO);
  for (const amount of [5000, 10000]) {
    const b = analyze(fixture(), { ...DEFAULT_SCENARIO, amount });
    expect(b.selected.fraction).toBe(a.selected.fraction);
    expect(b.selected.low).toBeCloseTo(a.selected.low * amount / 1000);
  }
});
