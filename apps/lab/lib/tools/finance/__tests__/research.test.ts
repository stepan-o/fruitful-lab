import { centeredExtrema, directionalChanges, evaluateModels, evaluatePolicies, evaluationOrigins, forecast, scenarioMixture } from "../research";
import { DEFAULT_SCENARIO, type Observation } from "../types";

function rows(values: number[]): Observation[] {
  return values.map((mxnPerCad, i) => ({ date: new Date(Date.parse("2022-01-03") + i * 86400000).toISOString().slice(0, 10), mxnPerCad, cadPerMxn: 1 / mxnPerCad }));
}
const history = () => rows(Array.from({ length: 1400 }, (_, i) => 13 * Math.exp(.02 * Math.sin(i / 17) + .00001 * i)));

test("a peak is available only after its reversal and confirmations never repaint", () => {
  const data = rows([10, 11, 12, 11.9, 11.7, 11, 11.3, 12, 11.5]);
  const full = directionalChanges(data, 2);
  expect(full.find(t => t.kind === "peak")).toMatchObject({ extreme: 2, confirmed: 4, extremeRate: 12, confirmedRate: 11.7 });
  for (let end = 1; end <= data.length; end++) {
    expect(directionalChanges(data.slice(0, end), 2)).toEqual(full.filter(t => t.confirmed < end));
  }
  expect(directionalChanges(data.slice(0, 4), 2).some(t => t.kind === "peak")).toBe(false);
});
test("flat data has no turns and centered extrema need future observations", () => {
  expect(directionalChanges(rows(Array(50).fill(13)), 1)).toEqual([]);
  const data = rows([10, 11, 13, 11, 10]);
  expect(centeredExtrema(data, 2)).toEqual([{ index: 2, kind: "peak" }]);
  expect(centeredExtrema(data.slice(0, 3), 2)).toEqual([]);
  expect(centeredExtrema(data.map(r => ({ ...r, mxnPerCad: r.cadPerMxn })), 2)).toEqual([{ index: 2, kind: "trough" }]);
});
test("all forecasts coincide on flat data and a late shock cannot alter earlier forecasts", () => {
  const flat = rows(Array(600).fill(13));
  const f = forecast(flat.slice(0, 300), 21);
  Object.values(f.paths).forEach(path => path.forEach(value => expect(value).toBeCloseTo(13, 10)));
  expect(f.low[21]).toBe(13); expect(f.high[21]).toBe(13);
  flat[320].mxnPerCad = 100;
  expect(forecast(flat.slice(0, 300), 21)).toEqual(f);
  expect(() => forecast(flat.slice(0, 20), 21)).toThrow();
});
test("fixed temporal split excludes crossing labels and produces disjoint outcome windows", () => {
  const data = history();
  const early = evaluationOrigins(data, 63, "early").origins;
  const late = evaluationOrigins(data, 63, "late").origins;
  expect(early.length).toBeGreaterThan(0); expect(late.length).toBeGreaterThan(0);
  early.forEach(i => expect(data[i + 63].date < "2024-01-01").toBe(true));
  late.forEach(i => expect(data[i].date >= "2024-01-01").toBe(true));
  late.slice(1).forEach((i, j) => expect(i - late[j]).toBe(63));
});
test("changing later-period outcomes leaves earlier-period scores unchanged", () => {
  const data = history(), before = evaluateModels(data, 21, "early");
  const shocked = data.map(r => r.date >= "2024-01-01" ? { ...r, mxnPerCad: r.mxnPerCad * 2 } : r);
  expect(evaluateModels(shocked, 21, "early")).toEqual(before);
});
test("long source gaps exclude affected windows instead of filling prices", () => {
  const data = history(); data.splice(400, 20);
  expect(evaluationOrigins(data, 21, "early").skipped).toBeGreaterThan(0);
});
test("interval scoring matches a manually calculated one-window miss", () => {
  const data = rows(Array(274).fill(13)); data[273].mxnPerCad = 14;
  const result = evaluateModels(data, 21, "early");
  expect(result.count).toBe(1);
  expect(result.scores[0]).toMatchObject({ mae: 1, rmse: 1, bias: -1, direction: null });
  expect(result.intervals[0]).toMatchObject({ coverage: 0, width: 0, score: 10 });
});
test("policy execution happens after publication, not at the hidden peak or origin rate", () => {
  const data = rows(Array(258).fill(10));
  [10, 12, 11, 9, 10, 10].forEach((v, i) => { data[252 + i].mxnPerCad = v; });
  const result = evaluatePolicies(data, 5, "early", 5, { ...DEFAULT_SCENARIO, amount: 1000, spread: 0, fee: 0 });
  expect(result.count).toBe(1);
  // All-now uses 12 at index 253. Peak confirmed at 254 -> remaining half gets 9 at 255.
  expect(result.scores[3].meanGain).toBe(-1500);
  expect(result.scores[1].meanGain).toBe(-2000);
  expect(result.scores[0].regret).toBe(0);
});
test("splitting pays an extra fee; unaffordable tranches are excluded and counted", () => {
  const data = rows(Array(600).fill(13));
  const s = { ...DEFAULT_SCENARIO, spread: 1, fee: 5 };
  const result = evaluatePolicies(data, 21, "early", 1, s);
  expect(result.scores[2].meanGain).toBeCloseTo(-5 * 13 * .99);
  expect(result.scores[3].meanGain).toBeCloseTo(result.scores[2].meanGain!);
  expect(evaluatePolicies(data, 21, "early", 1, { ...s, fee: 600 }).scores[2]).toMatchObject({ count: 0, meanGain: null });
});
test("same-publication tranches combine into one transfer fee", () => {
  const data = rows(Array(600).fill(13));
  const result = evaluatePolicies(data, 1, "early", 1, { ...DEFAULT_SCENARIO, fee: 5 });
  expect(result.scores[2].meanGain).toBe(0);
});
test("conditional mixture honors weights and fees without changing the underlying forecast", () => {
  const mix = scenarioMixture(13, 3, 30, 30, 1000, 1, 5, .5);
  expect(mix.states.reduce((sum, s) => sum + s.weight, 0)).toBeCloseTo(1);
  expect(mix.expected - mix.now).toBeCloseTo(-5 * 13 * .99);
  expect(scenarioMixture(13, 3, 100, 0, 1000, 1, 5, 1).expected).toBe(mix.now);
  expect(() => scenarioMixture(13, 3, 80, 30, 1000, 1, 5, .5)).toThrow();
});
