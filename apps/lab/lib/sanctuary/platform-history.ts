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
  ms25call: { label: "Microsoft FY2025 Q4 earnings call · Satya Nadella", url: "https://www.microsoft.com/en-us/investor/events/fy-2025/earnings-fy-2025-q4" },
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
    title: "Xbox’s expansion,", emphasis: "built and bought.",
    intro: "Buying the publisher behind Call of Duty and Diablo changed the scale of Microsoft’s gaming business. The chart grows when the company acquires revenue as well as when it wins another sale.",
    scope: "Xbox here includes games and services across devices, alongside console hardware. It is not revenue from Xbox consoles alone. Activision Blizzard enters the accounts in October 2023, within FY2024.",
    period: "Fiscal years end in June · FY2026 ended 30 June 2026.",
    missing: "Microsoft does not provide Sony’s four-category revenue breakdown or a separate Xbox operating-profit figure in these annual reports. Selected-year disclosures below identify Game Pass revenue or the acquisition’s net effect where reported; cloud revenue is not isolated.",
    milestones: [
      { year: 2021, label: "New consoles", title: "New consoles, more games and subscriptions", text: "Gaming revenue rose 33% to US$15.37bn. Xbox Series X and S launched in November 2020, within this fiscal year; Microsoft attributed the 92% hardware revenue increase to the higher prices of the new consoles. Content and services also grew 23%, helped by other publishers’ games, Game Pass subscriptions and Microsoft’s own titles. The jump came from both sides of the business.", source: "ms21" },
      { year: 2024, label: "Activision Blizzard joins", title: "Growth bought as well as earned", text: "The October 2023 acquisition put Activision Blizzard into Microsoft’s accounts. Content and services grew 50%; Microsoft attributed 44 percentage points to the deal’s net effect. This is a change in the business being measured, not a 50% rise in spending by an unchanged audience.", source: "ms24" },
      { year: 2025, label: "Games grow, consoles fall", title: "The games business grows while consoles retreat", text: "Gaming revenue rose 9% to US$23.46bn, even as hardware revenue fell 25% because fewer consoles were sold. Content and services grew 16%; Microsoft named Activision Blizzard and Game Pass as drivers. This was the first full fiscal year including Activision Blizzard, compared with a partial year in FY2024. A larger publishing and subscription business could lift the total while console sales shrank.", source: "ms25" },
      { year: 2026, label: "Revenue falls", title: "Game Pass growth cannot offset both declines", text: "Xbox revenue fell 7% to US$21.79bn. Hardware revenue dropped another 29% as fewer consoles sold. Content and services fell 5% against strong performance by Microsoft’s own games in the previous year, with Game Pass growth cushioning the decline. In FY2025, games and services had outweighed falling hardware sales; this year, both categories fell.", source: "ms26" },
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


/** Captions identify events, not estimates of their individual causal effects. */
export const platformAnnotations = {
  xbox: [
    { years: [2021], date: "November 2020 · FY2021", title: "Xbox Series X/S launches", detail: "A new console generation", context: "Hardware +92% · games & services +23%" },
    { years: [2024], date: "13 October 2023 · FY2024", title: "Microsoft buys Activision Blizzard", detail: "Call of Duty · Diablo", context: "Acquired revenue enters the accounts" },
    { years: [2025, 2026], date: "FY2025 → FY2026", title: "Games lift the total, then fall", detail: "Console sales fall in both years", context: "Total revenue: +9% → −7%" },
  ],
  nvidia: [
    { years: [2021], date: "FY2021", title: "RTX 30 arrives", detail: "Ampere graphics-card upgrade cycle", context: "Gaming revenue +41%" },
    { years: [2023], date: "FY2023", title: "Inventory builds up", detail: "Fewer shipments to clear partner stock", context: "Gaming revenue −27%" },
    { years: [2026], date: "FY2026", title: "Blackwell lifts demand", detail: "Another graphics-card generation", context: "Gaming revenue +41%" },
  ],
} as const;

export type RevenueSnapshot = {
  title: string; part: string; amount: number; remainder: string;
  approximate: boolean; note: string; source: keyof typeof platformHistorySources;
};
/** Isolated disclosures: never interpolated into a category history. USD millions. */
export const xboxRevenueSnapshots: Partial<Record<number, RevenueSnapshot>> = {
  2024: {
    title: "The acquisition inside this year’s revenue", part: "Activision Blizzard: net acquisition effect", amount: 5729,
    remainder: "Gaming revenue excluding that net effect", approximate: false,
    note: "Microsoft reports a US$5.729bn net revenue effect from 13 October 2023 to 30 June 2024, including the change from selling Activision Blizzard games as a third party to owning them. The remainder is total Gaming revenue minus that reported effect. This is an acquisition bridge, not Activision Blizzard’s standalone sales or a hardware/software split.", source: "ms24",
  },
  2025: {
    title: "Game Pass inside the annual total", part: "Game Pass", amount: 5000,
    remainder: "All other Gaming revenue", approximate: true,
    note: "Microsoft said Game Pass annual revenue was “nearly $5 billion.” This rounded snapshot places it at about one fifth of FY2025 Gaming revenue; the remainder is approximate too. Game Pass is already included in content and services. It is not an additional revenue category or a separate measure of cloud gaming.", source: "ms25call",
  },
};
