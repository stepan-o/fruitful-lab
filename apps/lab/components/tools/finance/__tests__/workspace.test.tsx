import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import FinanceWorkspace from "../FinanceWorkspace";
import type { RateSnapshot } from "@/lib/tools/finance/types";
jest.mock("@/lib/hooks/useToolAnalytics", () => ({ useToolAnalytics: () => ({ trackToolStart: jest.fn() }) }));
jest.mock("@/lib/tools/finance/tracking", () => ({ trackFinance: jest.fn() }));
const dates: string[] = [];
for (let d = Date.parse("2026-10-09"); dates.length < 800; d -= 86400000) {
  if (![0,6].includes(new Date(d).getUTCDay())) dates.unshift(new Date(d).toISOString().slice(0, 10));
}
const snapshot: RateSnapshot = { source: "Bank of Canada", checkedAt: "2026-10-12T16:00:00Z", omitted: 0, observations: dates.map((date, i) => ({ date, cadPerMxn: 1 / (13 + .2 * Math.sin(i / 10)), mxnPerCad: 13 + .2 * Math.sin(i / 10) })) };
beforeEach(() => { localStorage.clear(); window.history.replaceState(null, "", "/"); });
test("renders all three budgets, January deadline and extension comparison", () => {
  render(<FinanceWorkspace initialSnapshot={snapshot} />);
  expect(screen.getByRole("heading", { name: "One decision, three budgets" })).toBeInTheDocument();
  expect(screen.getByLabelText("Exchange by")).toHaveValue("2027-01-01");
  expect(screen.getByRole("heading", { name: "Would more time help?" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "CAD 10,000" })).toBeInTheDocument();
});
test("draft changes require apply and report preserves assumptions", () => {
  render(<FinanceWorkspace initialSnapshot={snapshot} />);
  fireEvent.click(screen.getByRole("button", { name: "CAD 5,000" }));
  expect(screen.getByText("Results still use the previous assumptions.")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Update analysis" }));
  fireEvent.click(screen.getByRole("button", { name: "Analysis report" }));
  expect(screen.getByText(/Budget: CAD 5,000.00/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Print / save PDF" })).toBeInTheDocument();
});
test("saved plan retains the absolute deadline", () => {
  render(<FinanceWorkspace initialSnapshot={snapshot} />);
  fireEvent.click(screen.getByRole("button", { name: "Save plan" }));
  expect(JSON.parse(localStorage.getItem("fruitful_finance_plan_v1")!).scenario.deadline).toBe("2027-01-01");
});
test("source outage has a retry and does not fabricate numbers", () => {
  render(<FinanceWorkspace initialSnapshot={null} />);
  expect(screen.getByRole("heading", { name: "Reliable data comes first." })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Exchange now" })).not.toBeInTheDocument();
});
test("refresh failure preserves history but pauses advice", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
  render(<FinanceWorkspace initialSnapshot={snapshot} />);
  fireEvent.click(screen.getByRole("button", { name: "Refresh rates" }));
  await waitFor(() => expect(screen.getByRole("heading", { name: "Refresh data before deciding" })).toBeInTheDocument());
  expect(screen.getByRole("heading", { name: "The rate, and the room to move" })).toBeInTheDocument();
});

test("methodology opens as a separate view and preserves dashboard assumptions", async () => {
  render(<FinanceWorkspace initialSnapshot={snapshot} />);
  fireEvent.click(screen.getByRole("button", { name: "Methodology" }));
  await waitFor(() => expect(screen.getByRole("article", { name: "Exchange timing methodology study" })).toBeInTheDocument());
  expect(window.location.hash).toBe("#methodology");
  fireEvent.click(screen.getByRole("button", { name: "Dashboard" }));
  expect(screen.getByLabelText("Exchange by")).toHaveValue("2027-01-01");
});
