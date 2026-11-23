import { fireEvent, render, screen } from "@testing-library/react";
import Methodology from "../Methodology";
import { analyze } from "@/lib/tools/finance/engine";
import { DEFAULT_SCENARIO, type RateSnapshot } from "@/lib/tools/finance/types";

const dates: string[] = [];
for (let d = Date.parse("2026-10-09"); dates.length < 800; d -= 86400000) if (![0, 6].includes(new Date(d).getUTCDay())) dates.unshift(new Date(d).toISOString().slice(0, 10));
const snapshot: RateSnapshot = { source: "Bank of Canada", checkedAt: "2026-10-12T16:00:00Z", omitted: 0, observations: dates.map((date, i) => ({ date, mxnPerCad: 13 + .2 * Math.sin(i / 10), cadPerMxn: 1 / (13 + .2 * Math.sin(i / 10)) })) };
function setup(blocked = false) { render(<Methodology snapshot={snapshot} scenario={DEFAULT_SCENARIO} analysis={analyze(snapshot, DEFAULT_SCENARIO)} blocked={blocked} />); }
test("methodology controls change the series, horizon, replay and conditional mixture", () => {
  setup();
  fireEvent.change(screen.getByLabelText("Series representation"), { target: { value: "returns" } });
  expect(screen.getAllByText("Log change per publication (%)").length).toBeGreaterThan(0);
  fireEvent.change(screen.getByLabelText("Forecast horizon"), { target: { value: "63" } });
  expect(screen.getByText(/Same origins, same 63-publication horizon/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Forecast origin"), { target: { value: "past" } });
  expect(screen.getByLabelText("Forecast replay origin")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Reversal threshold"), { target: { value: "2" } });
  expect(screen.getByText(/first confirmed 2% peak reversal/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("More-pesos scenario weight"), { target: { value: "50" } });
  expect(screen.getByRole("img", { name: "Scenario weights: more pesos 50%, little change 20%, fewer pesos 30%" })).toBeInTheDocument();
});
test("hindsight is explicitly opt-in and blocked live advice does not hide research", () => {
  setup(true);
  expect(screen.getByLabelText("Show hindsight extrema (uses future data)")).not.toBeChecked();
  fireEvent.click(screen.getByLabelText("Show hindsight extrema (uses future data)"));
  expect(screen.getByLabelText("Show hindsight extrema (uses future data)")).toBeChecked();
  expect(screen.getByText(/The live decision is paused/)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Words can change the forecast, too." })).toBeInTheDocument();
});
test("study export contains the observed snapshot and settings rather than a fabricated forecast record", () => {
  setup();
  URL.createObjectURL = jest.fn(() => "blob:study"); URL.revokeObjectURL = jest.fn();
  const click = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  fireEvent.click(screen.getByRole("button", { name: "Download reproducible study data" }));
  expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  expect(click).toHaveBeenCalled();
  click.mockRestore();
});

test("minimum source history supports latest forecasts without offering impossible historical replay", () => {
  const short = { ...snapshot, observations: snapshot.observations.slice(-253) };
  render(<Methodology snapshot={short} scenario={DEFAULT_SCENARIO} analysis={analyze(short, DEFAULT_SCENARIO)} blocked={false} />);
  expect(screen.getByRole("option", { name: "Historical replay + realized outcome" })).toBeDisabled();
});
