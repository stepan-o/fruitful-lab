import { fireEvent, render, screen, within } from "@testing-library/react";
import SonyHistory from "@/components/sanctuary/SonyHistory";
import { sonyHistory, sonyMix } from "@/lib/sanctuary/sony-history";
import { platformRows, platformTotals } from "@/lib/sanctuary/industry-data";
import { chapters } from "@/lib/sanctuary/content";

it("reconciles the historical categories and preserves the existing latest-year exhibit", () => {
  for (const row of sonyHistory) {
    expect(Math.abs(sonyMix(row).reduce((a, b) => a + b, 0) - row.revenue)).toBeLessThanOrEqual(2);
    const detail = row.physical + (row.digitalCombined ?? (row.digital! + row.addons!)) + (row.otherSoftware ?? 0);
    expect(Math.abs(detail - row.software)).toBeLessThanOrEqual(1);
  }
  for (const [i, row] of sonyHistory.slice(-2).entries()) {
    expect(row.revenue).toBe(platformTotals[i]);
    expect([row.hardware, row.physical, row.digital, row.addons, row.otherSoftware, row.network, row.other]).toEqual(platformRows.map(category => category.values[i]));
  }
});

it("keeps accounting changes and missing category detail explicit", () => {
  const old = sonyHistory.find(row => row.year === 2018)!;
  expect(old.digital).toBeUndefined();
  expect(old.addons).toBeUndefined();
  expect(old.digitalCombined).toBe(1102231);
  expect(sonyHistory.find(row => row.year === 2020)?.profit).toBe(341718); // IFRS restatement, not 342192 US GAAP.
  const current = sonyHistory.at(-1)!;
  expect(sonyMix(current)[1]).toBe(2540411);
  expect(sonyMix(current)[3]).toBe(437688);
});

it("connects milestone, year picker, exact figures and category readout", () => {
  render(<SonyHistory/>);
  expect(screen.getByRole("heading", { name: "A launch inside a stay-at-home boom" })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: /2025 Latest full year/ }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2025");
  expect(screen.getByRole("button", { name: "Next fiscal year" })).toBeDisabled();
  expect(screen.getByRole("button", { name: /^FY2025:/ })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByText(/Hardware falls; the total holds/)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Network services" }));
  expect(screen.getByText(/Not a pure subscription or cloud measure/)).toBeVisible();
  fireEvent.change(screen.getByRole("combobox", { name: "Fiscal year" }), { target: { value: "2016" } });
  expect(screen.getByRole("button", { name: "Previous fiscal year" })).toBeDisabled();
  fireEvent.click(screen.getByText("Inside game revenue"));
  expect(screen.getByText(/No separate add-on figure is inferred/)).toBeVisible();
  fireEvent.click(screen.getByText("Sources, definitions & exact figures"));
  const table = screen.getByRole("table");
  expect(within(table).getAllByRole("row")).toHaveLength(11);
  expect(within(table).getByText("463,258")).toBeVisible();
});

it("places the Sony exhibit immediately after chapter two's first paragraph", () => {
  const chapter = chapters.find(item => item.id === "studio-to-screen")!;
  expect(chapter.exhibits).toEqual([{ afterParagraph: 0, kind: "sony-history" }, { afterParagraph: 5, kind: "market-map" }]);
});
