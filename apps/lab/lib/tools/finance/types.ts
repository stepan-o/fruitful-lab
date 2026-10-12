export type Observation = { date: string; cadPerMxn: number; mxnPerCad: number };
export type RateSnapshot = {
  observations: Observation[];
  checkedAt: string;
  omitted: number;
  source: "Bank of Canada";
};
export type Scenario = {
  amount: number;
  deadline: string;
  spread: number;
  fee: number;
  lossBudget: number;
  target: number | null;
  eventRisk: boolean;
};
export const DEFAULT_SCENARIO: Scenario = {
  amount: 1000, deadline: "2027-01-01", spread: 1, fee: 0, lossBudget: 2, target: null, eventRisk: false,
};
export const SOURCE_URL = "https://www.bankofcanada.ca/valet/observations/FXMXNCAD/json?recent=800";
export const METHOD_VERSION = "cad-mxn-1.0";
