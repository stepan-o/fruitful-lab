import { fireEvent, render, screen, within } from "@testing-library/react";
import PlatformHistory from "@/components/sanctuary/PlatformHistory";
import PublisherEcosystem from "@/components/sanctuary/PublisherEcosystem";
import { platformGrowth, xboxHistory, nvidiaHistory } from "@/lib/sanctuary/platform-history";
import { chapters, sources } from "@/lib/sanctuary/content";

it("preserves reported totals, fiscal boundaries and unavailable category data", () => {
  expect(xboxHistory.map(row => row.revenue)).toEqual([9051, 10353, 11386, 11575, 15370, 16230, 15466, 21503, 23455, 21790]);
  expect(nvidiaHistory.map(row => row.revenue)).toEqual([5518, 7759, 12462, 9067, 10447, 11350, 16042]);
  expect(xboxHistory.at(-1)?.end).toBe("30 Jun 2026");
  expect(nvidiaHistory.at(-1)?.end).toBe("25 Jan 2026");
  expect(platformGrowth(nvidiaHistory, 2020)).toBeNull();
  expect(platformGrowth(nvidiaHistory, 2023)).toBeCloseTo(-27.2428, 3);
  expect(platformGrowth(xboxHistory, 2024)).toBeCloseTo(39.034, 2);
  expect(xboxHistory[4].hardwareGrowth).toBe(92);
  expect(nvidiaHistory.every(row => row.hardwareGrowth === undefined)).toBe(true);
});

it("switches company, measure and category without fabricating a dollar split", () => {
  const { container } = render(<PlatformHistory/>);
  const choices = screen.getByRole("group", { name: "Choose a financial case study" });
  expect(screen.getByRole("heading", { name: /PlayStation, beyond/ })).toBeVisible();
  expect(screen.queryByRole("heading", { name: "Whose games fill the ecosystem?" })).not.toBeInTheDocument();
  fireEvent.click(within(choices).getByRole("button", { name: /^Xbox/ }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2026");
  expect(screen.getByText(/not revenue from Xbox consoles alone/)).toBeVisible();
  expect(screen.getByText(/separate Xbox operating-profit figure/)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Year-over-year change" }));
  fireEvent.click(screen.getByRole("button", { name: "Xbox hardware" }));
  const chart = screen.getByRole("group", { name: /Xbox Xbox hardware annual change/ });
  expect(within(chart).getByRole("button", { name: /FY2021.*\+92.0%/ })).toBeVisible();
  expect(within(chart).getByRole("button", { name: /FY2017.*not included/ }).querySelector(".bar")).toBeNull();
  const decline = within(chart).getByRole("button", { name: /FY2026.*−29.0%/ });
  expect(decline.querySelector(".bar")).toHaveAttribute("data-negative", "true");
  expect(parseFloat((decline.querySelector(".bar") as HTMLElement).style.height)).toBeCloseTo(29 / 140 * 100);
  fireEvent.click(screen.getByRole("button", { name: /FY2024 Activision/ }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2024");
  expect(screen.getByText(/44 percentage points/)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Revenue" }));
  expect(screen.queryByRole("group", { name: "Choose an Xbox growth series" })).not.toBeInTheDocument();
  expect(container.querySelectorAll(".bar")).toHaveLength(10);
  expect(screen.getByRole("button", { name: /FY2024.*US\$21.50bn/ })).toBeVisible();
  fireEvent.click(within(choices).getByRole("button", { name: /^NVIDIA/ }));
  expect(screen.getByText(/These bars are not cloud-gaming revenue/)).toBeVisible();
  expect(screen.getByText(/GeForce NOW revenue, its share of Gaming and its profit are not separately disclosed/)).toBeVisible();
  expect(screen.queryByText(/44 percentage points/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /FY2023 Inventory/ }));
  expect(screen.getByRole("heading", { name: /Games still need machines/ })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Year-over-year change" }));
  expect(screen.getByRole("button", { name: /FY2023.*−27.2%/ })).toBeVisible();
  fireEvent.click(screen.getByText("Sources, definitions & exact figures"));
  expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(8);
  fireEvent.click(within(choices).getByRole("button", { name: /^PlayStation/ }));
  expect(screen.getByRole("combobox", { name: "Fiscal year" })).toHaveValue("2020");
});

it("positions the independent publisher figure after sourced Xbox/NVIDIA prose", () => {
  const chapter = chapters.find(item => item.id === "studio-to-screen")!;
  const publisher = chapter.exhibits!.find(item => item.kind === "publisher-ecosystem")!;
  expect(chapter.paragraphs[publisher.afterParagraph - 1]).toMatch(/^Microsoft also/);
  expect(chapter.paragraphs[publisher.afterParagraph]).toMatch(/^NVIDIA earns/);
  for (const paragraph of [5, 6]) {
    for (const id of chapter.paragraphCitations![paragraph]) expect(sources.some(source => source.id === id)).toBe(true);
  }
  const { container } = render(<PublisherEcosystem/>);
  expect(container.querySelector("figure > figcaption")).toBeInTheDocument();
  expect(screen.getByText("89.9% of full-game copies")).toBeVisible();
  expect(screen.getByText(/not a division of platform revenue/)).toBeVisible();
});
