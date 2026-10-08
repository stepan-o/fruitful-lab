/** Reported USD millions. Fiscal year labels follow each issuer, not calendar years.
 * Reviewed evidence and boundaries: docs/sanctuary/PLATFORM_FINANCIAL_CASES.md.
 */
export const platformHistorySources = {
  ms19: { label: "Microsoft 2019 annual report", url: "https://www.microsoft.com/investor/reports/ar19/" },
  ms21: { label: "Microsoft 2021 annual report", url: "https://www.microsoft.com/investor/reports/ar21/" },
  ms22: { label: "Microsoft 2022 annual report", url: "https://www.microsoft.com/investor/reports/ar22/" },
  ms23: { label: "Microsoft 2023 annual report", url: "https://www.microsoft.com/investor/reports/ar23/" },
  ms24: { label: "Microsoft 2024 annual report", url: "https://www.microsoft.com/investor/reports/ar24/" },
  ms25: { label: "Microsoft 2025 annual report", url: "https://www.microsoft.com/investor/reports/ar25/index.html" },
  ms26: { label: "Microsoft FY2026 Form 10-K", url: "https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/msft-20260630.htm" },
  nv21: { label: "NVIDIA FY2021 CFO commentary · pp. 1–2", url: "https://investor.nvidia.com/files/doc_financials/annual/2021/Q4FY21-CFO-Commentary.pdf" },
  nv23: { label: "NVIDIA FY2023 CFO commentary · pp. 1–3", url: "https://s201.q4cdn.com/141608511/files/doc_financials/2023/Q423/Q4FY23-CFO-Commentary.pdf" },
  nv26: { label: "NVIDIA FY2026 Form 10-K", url: "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm" },
} as const;
export type PlatformYear = {
  year: number; end: string; revenue: number; source: keyof typeof platformHistorySources;
  // Published annual percentage changes, NOT shares or inferred dollar amounts.
  hardwareGrowth?: number; contentGrowth?: number; growthSource?: keyof typeof platformHistorySources;
};
export const xboxHistory: PlatformYear[] = [
  { year: 2017, end: "30 Jun 2017", revenue: 9051, source: "ms19" },
  { year: 2018, end: "30 Jun 2018", revenue: 10353, source: "ms19" },
  { year: 2019, end: "30 Jun 2019", revenue: 11386, source: "ms19" },
  { year: 2020, end: "30 Jun 2020", revenue: 11575, source: "ms22" },
  { year: 2021, end: "30 Jun 2021", revenue: 15370, source: "ms22", hardwareGrowth: 92, contentGrowth: 23, growthSource: "ms21" },
  { year: 2022, end: "30 Jun 2022", revenue: 16230, source: "ms22", hardwareGrowth: 16, contentGrowth: 3 },
  { year: 2023, end: "30 Jun 2023", revenue: 15466, source: "ms25", hardwareGrowth: -11, contentGrowth: -3, growthSource: "ms23" },
  { year: 2024, end: "30 Jun 2024", revenue: 21503, source: "ms25", hardwareGrowth: -13, contentGrowth: 50, growthSource: "ms24" },
  { year: 2025, end: "30 Jun 2025", revenue: 23455, source: "ms25", hardwareGrowth: -25, contentGrowth: 16 },
  { year: 2026, end: "30 Jun 2026", revenue: 21790, source: "ms26", hardwareGrowth: -29, contentGrowth: -5 },
];
export const nvidiaHistory: PlatformYear[] = [
  { year: 2020, end: "26 Jan 2020", revenue: 5518, source: "nv21" },
  { year: 2021, end: "31 Jan 2021", revenue: 7759, source: "nv21" },
  { year: 2022, end: "30 Jan 2022", revenue: 12462, source: "nv23" },
  { year: 2023, end: "29 Jan 2023", revenue: 9067, source: "nv23" },
  { year: 2024, end: "28 Jan 2024", revenue: 10447, source: "nv26" },
  { year: 2025, end: "26 Jan 2025", revenue: 11350, source: "nv26" },
  { year: 2026, end: "25 Jan 2026", revenue: 16042, source: "nv26" },
];
export function platformGrowth(rows: PlatformYear[], year: number) {
  const i = rows.findIndex(row => row.year === year);
  return i > 0 ? (rows[i].revenue / rows[i - 1].revenue - 1) * 100 : null;
}
export const financialCases = {
  xbox: {
    name: "Xbox", owner: "Microsoft · Gaming / Xbox", rows: xboxHistory, color: "#a4bc86",
    title: "A bigger business,", emphasis: "beyond the Xbox itself.",
    intro: "Buying the publisher behind Call of Duty and Diablo changed the scale of Microsoft’s gaming business. The chart grows when the company acquires revenue as well as when it wins another sale.",
    scope: "Xbox here includes games and services across devices, alongside console hardware. It is not revenue from Xbox consoles alone. Activision Blizzard enters the accounts in October 2023, within FY2024.",
    period: "Fiscal years end in June · FY2026 ended 30 June 2026.",
    missing: "Microsoft does not provide Sony’s four-category revenue breakdown or a separate Xbox operating-profit figure in these annual reports. Game Pass and cloud revenue are not isolated here.",
    milestones: [
      { year: 2021, label: "New consoles", title: "A hardware launch lifts the year", text: "Xbox Series X and S arrived during FY2021. Hardware revenue rose 92%; content and services rose 23%. The latter includes games and subscriptions, so its rise cannot be assigned to Game Pass alone.", source: "ms21" },
      { year: 2024, label: "Activision Blizzard joins", title: "Growth bought as well as earned", text: "The October 2023 acquisition put Activision Blizzard into Microsoft’s accounts. Content and services grew 50%; Microsoft attributed 44 percentage points to the deal’s net effect. This is a change in the business being measured, not a 50% rise in spending by an unchanged audience.", source: "ms24" },
      { year: 2026, label: "Latest full year", title: "More games do not guarantee growth", text: "Xbox revenue fell about 7%. Hardware declined 29%; content and services fell 5% against a year of strong first-party releases, partly cushioned by Game Pass growth. Microsoft’s acquisitions made the business larger, but did not remove its dependence on the next successful offer.", source: "ms26" },
    ],
  },
  nvidia: {
    name: "NVIDIA", owner: "NVIDIA · Gaming end market", rows: nvidiaHistory, color: "#79b3b2",
    title: "The machinery", emphasis: "behind the worlds.",
    intro: "NVIDIA can earn when a player upgrades the computer that runs a game, or pays to use one remotely. Its Gaming accounts combine these businesses; they do not reveal what GeForce NOW earns on its own.",
    scope: "Gaming includes GeForce GPUs for PCs, GeForce NOW, and console chips and development services. It excludes NVIDIA’s separately reported Data Center business. These bars are not cloud-gaming revenue.",
    period: "Fiscal years end in late January · FY2026 ended 25 January 2026.",
    missing: "GeForce NOW revenue, its share of Gaming and its profit are not separately disclosed. NVIDIA’s Graphics segment also contains other businesses, so its profit cannot be used as Gaming profit.",
    milestones: [
      { year: 2021, label: "RTX 30 upgrade cycle", title: "A new generation of equipment", text: "Gaming revenue rose about 41%. NVIDIA cited the ramp of its Ampere-based GeForce RTX 30 graphics cards. A hardware upgrade is another way a game’s appeal can create a sale outside the studio that made it.", source: "nv21" },
      { year: 2023, label: "Inventory correction", title: "Games still need machines; orders still fall", text: "Gaming revenue fell 27%. NVIDIA reduced shipments to help partners clear inventory as weaker demand and disruption in China weighed on sales. These are sales into the supply chain; they are not a count of players or hours played.", source: "nv23" },
      { year: 2026, label: "Blackwell demand", title: "Another upgrade cycle", text: "NVIDIA attributed the year’s 41% Gaming revenue increase to strong demand for Blackwell. GeForce NOW is included in the same reported total, but this figure does not tell us how much cloud play grew.", source: "nv26" },
    ],
  },
} as const;
