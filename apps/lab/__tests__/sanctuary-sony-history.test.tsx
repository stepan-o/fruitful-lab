import { fireEvent, render, screen, within } from "@testing-library/react";
import SonyHistory from "@/components/sanctuary/SonyHistory";
import { sonyCategories, sonyUsd, sonyGrowth, sonyGrowthView, sonyHistory, sonyMix, sonyPublisherContext, sonyRevenueView } from "@/lib/sanctuary/sony-history";
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
  const annotations = screen.getByRole("group", { name: "Console transition annotations" });
  fireEvent.click(within(annotations).getByRole("button", { name: /News of PS5 weakens PS4 demand/ }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2019");
  expect(screen.getByRole("link", { name: /Sony’s demand explanation/ })).toHaveAttribute("href", expect.stringContaining("19q1_sonyspeech.pdf#page=9"));
  fireEvent.click(screen.getByRole("button", { name: "Console hardware", exact: true }));
  fireEvent.click(within(annotations).getByRole("button", { name: /PS5 launches/ }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2020");
  expect(screen.getByRole("button", { name: "Console hardware", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("link", { name: "PlayStation’s launch announcement ↗" })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "All revenue", exact: true }));
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
  expect(chapter.exhibits).toEqual([{ afterParagraph: 0, kind: "sony-history" }, { afterParagraph: 9, kind: "market-map" }]);
});


it("isolates each revenue series, rescales from zero and keeps the selected year", () => {
  const { container } = render(<SonyHistory/>);
  fireEvent.change(screen.getByRole("combobox", { name: "Fiscal year" }), { target: { value: "2025" } });
  const latestTotals = ["6.27", "16.86", "5.06", "2.90"];
  sonyCategories.forEach((category, index) => {
    fireEvent.click(screen.getByRole("button", { name: category.label, exact: true }));
    const chart = screen.getByRole("group", { name: new RegExp(`Ten years of ${category.label} revenue only`) });
    const columns = within(chart).getAllByRole("button").filter(button => button.hasAttribute("data-year"));
    expect(columns).toHaveLength(10);
    expect(within(chart).getByRole("button", { name: `FY2025: ${category.label} revenue US$${latestTotals[index]} billion. Show year.` })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelectorAll(".segment")).toHaveLength(10);
    expect(container.querySelector(".profitArea")).toBeNull();
    expect(screen.getByText(`${category.label} revenue`, { selector: "small" })).toBeVisible();
    expect(screen.getByText(`US$${latestTotals[index]}`, { exact: false, selector: ".totals strong" })).toBeVisible();
    const view = sonyRevenueView(index);
    expect(view.ticks.at(-1)?.label).toBe("0");
    expect(view.unit).toBe("billions of US dollars");
    const fy25 = columns[9].querySelector<HTMLElement>(".stack")!;
    expect(parseFloat(fy25.style.height)).toBeCloseTo(sonyUsd(sonyMix(sonyHistory[9])[index], sonyHistory[9]) / view.max * 100);
    expect(sonyHistory.every(row => sonyUsd(sonyMix(row)[index], row) <= view.max)).toBe(true);
    expect(fy25.querySelector<HTMLElement>(".segment")).toHaveStyle({ height: "100%" });
  });
  fireEvent.click(screen.getByRole("button", { name: "All revenue", exact: true }));
  expect(container.querySelectorAll(".segment")).toHaveLength(40);
  expect(container.querySelectorAll(".profitArea")).toHaveLength(10);
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2025");
  expect(screen.getByRole("button", { name: /^FY2025: revenue US\$31.09 billion; operating profit US\$3.07/ })).toHaveAttribute("aria-pressed", "true");
});

it("keeps the publisher comparison in copies and exposes the gross-revenue boundary", () => {
  render(<SonyHistory/>);
  expect(sonyPublisherContext.totalUnits).toBe(317.9);
  expect(sonyPublisherContext.firstPartyUnits).toBe(32.1);
  expect(screen.getByText("32.1m copies")).toBeVisible();
  expect(screen.getByText("285.8m copies")).toBeVisible();
  expect(screen.getByText("10.1% of full-game copies")).toBeVisible();
  expect(screen.getByText("89.9% of full-game copies")).toBeVisible();
  expect(screen.getByText(/not a division of the money above/)).toBeVisible();
  expect(screen.getByText(/Digital game and add-on revenue includes the amount paid to outside publishers/)).toBeVisible();
  expect(screen.getByRole("link", { name: /Figures & scope/ })).toHaveAttribute("href", sonyPublisherContext.source);
});


it("uses each year's own annual FX rate and keeps converted totals reconciled", () => {
  expect(sonyUsd(sonyHistory[0].revenue, sonyHistory[0])).toBeCloseTo(15219.54797, 4);
  expect(sonyUsd(sonyHistory[9].revenue, sonyHistory[9])).toBeCloseTo(31092.57465, 4);
  expect(sonyGrowth(sonyHistory[0], 0)).toBeNull();
  expect(sonyGrowth(sonyHistory[6], 0)).toBeCloseTo(58.0836, 3);
  for (const row of sonyHistory) {
    expect(Math.abs(sonyMix(row).reduce((sum, value) => sum + sonyUsd(value, row), 0) - sonyUsd(row.revenue, row))).toBeLessThan(0.02);
    expect(sonyUsd(row.revenue, row)).toBeLessThan(sonyRevenueView(null).max);
    for (let category = 0; category < 4; category++) {
      const growth = sonyGrowth(row, category);
      if (growth !== null) {
        expect(growth).toBeGreaterThan(sonyGrowthView.min);
        expect(growth).toBeLessThan(sonyGrowthView.max);
      }
    }
  }
});

it("groups annual changes around zero, preserves filters and links supply events", () => {
  const { container } = render(<SonyHistory/>);
  fireEvent.click(screen.getByRole("button", { name: "Year-over-year change", exact: true }));
  expect(container.querySelectorAll(".growthBar")).toHaveLength(36);
  expect(container.querySelector(".profitArea")).toBeNull();
  expect(container.querySelector(".stack")).toBeNull();
  expect(screen.getByRole("button", { name: /^FY2016: year-over-year/ })).toHaveAccessibleName(expect.stringContaining("Base year"));
  const bars2019 = screen.getByRole("button", { name: /^FY2019: year-over-year/ }).querySelectorAll<HTMLElement>(".growthBar");
  expect(bars2019[0]).toHaveAttribute("data-negative", "true");
  expect(parseFloat(bars2019[0].style.top)).toBeCloseTo(80 / 120 * 100);
  const bars2022 = screen.getByRole("button", { name: /^FY2022: year-over-year/ }).querySelectorAll<HTMLElement>(".growthBar");
  expect(parseFloat(bars2022[0].style.top)).toBeLessThan(80 / 120 * 100);
  expect(parseFloat(bars2022[0].style.height)).toBeCloseTo(58.0836 / 120 * 100, 3);
  fireEvent.click(screen.getByRole("button", { name: "Console hardware", exact: true }));
  expect(container.querySelectorAll(".growthBar")).toHaveLength(9);
  fireEvent.click(within(screen.getByRole("group", { name: "Console transition annotations" })).getByRole("button", { name: /Chip shortages/ }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2021");
  expect(screen.getByRole("heading", { name: "Demand outruns the supply of consoles" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Console hardware", exact: true })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: /2022 PS5 supply improves/ }));
  expect(screen.getByText("+58.1%", { selector: ".totals strong" })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Revenue", exact: true }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2022");
  expect(container.querySelectorAll(".segment")).toHaveLength(10);
  expect(screen.getByText("US$8.30", { exact: false, selector: ".totals strong" })).toBeVisible();
});
