/** Sony G&NS segment figures, nominal millions of yen. No forecasts or estimates.
 * Source pages and reconciliation decisions: docs/sanctuary/SONY_FINANCIAL_HISTORY.md.
 */
const ir = "https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/";
export const sonySources = {
  fy18: { label: "FY2016–2018 · pp. 3, 8", url: `${ir}18q4_supplement.pdf` },
  fy20: { label: "FY2019 · pp. 4, 9", url: `${ir}20q4_supplement.pdf` },
  fy21: { label: "FY2020 · pp. 4, 9", url: `${ir}21q4_supplement.pdf` },
  fy22: { label: "FY2021–2022 · pp. 4, 10", url: `${ir}22q4_supplement.pdf` },
  fy24: { label: "FY2023 · pp. 4, 15", url: `${ir}24q4_supplement.pdf` },
  fy25: { label: "FY2024–2025 · pp. 4, 12", url: `${ir}25q4_supplement.pdf` },
} as const;

export type SonyYear = {
  year: number;
  yenPerUsd: number;
  fxSource: string;
  revenue: number;
  profit: number;
  hardware: number;
  software: number;
  physical: number;
  digital?: number;
  addons?: number;
  digitalCombined?: number;
  network: number;
  other: number;
  otherSoftware?: number;
  source: keyof typeof sonySources;
};

// `software` is Sony's published Game Software aggregate; `other` its Others.
// Off-platform software moves from Others to Game Software in the later reports.
export const sonyHistory: SonyYear[] = [
  { year: 2016, yenPerUsd: 108.4, fxSource: `${ir}18q4_supplement.pdf#page=2`, revenue: 1649799, profit: 135553, hardware: 598373, software: 710970, physical: 185287, digitalCombined: 525683, network: 189241, other: 151215, source: "fy18" },
  { year: 2017, yenPerUsd: 110.9, fxSource: `${ir}18q4_supplement.pdf#page=2`, revenue: 1943812, profit: 177478, hardware: 590624, software: 920117, physical: 157897, digitalCombined: 762220, network: 270972, other: 162099, source: "fy18" },
  { year: 2018, yenPerUsd: 110.9, fxSource: `${ir}18q4_supplement.pdf#page=2`, revenue: 2310872, profit: 311092, hardware: 527701, software: 1293744, physical: 191513, digitalCombined: 1102231, network: 326525, other: 162903, source: "fy18" },
  { year: 2019, yenPerUsd: 108.7, fxSource: `${ir}20q4_supplement.pdf#page=3`, revenue: 1977551, profit: 238400, hardware: 371910, software: 1126769, physical: 116473, digital: 376420, addons: 633876, network: 337265, other: 141607, source: "fy20" },
  { year: 2020, yenPerUsd: 106.1, fxSource: `${ir}20q4_supplement.pdf#page=3`, revenue: 2656278, profit: 341718, hardware: 515636, software: 1594710, physical: 140117, digital: 542484, addons: 912108, network: 383012, other: 162921, source: "fy21" },
  { year: 2021, yenPerUsd: 112.3, fxSource: `${ir}22q4_supplement.pdf#page=3`, revenue: 2739763, profit: 346089, hardware: 589462, software: 1553377, physical: 128917, digital: 570842, addons: 853617, network: 409355, other: 187569, source: "fy22" },
  { year: 2022, yenPerUsd: 135.4, fxSource: `${ir}22q4_supplement.pdf#page=3`, revenue: 3644598, profit: 250006, hardware: 1123522, software: 1716484, physical: 193439, digital: 660932, addons: 862113, network: 464676, other: 339915, source: "fy22" },
  { year: 2023, yenPerUsd: 144.4, fxSource: `${ir}24q4_supplement.pdf#page=3`, revenue: 4267734, profit: 290184, hardware: 1211451, software: 2220193, physical: 180250, digital: 851619, addons: 1082967, otherSoftware: 105358, network: 545537, other: 290554, source: "fy24" },
  { year: 2024, yenPerUsd: 152.5, fxSource: `${ir}25q4_supplement.pdf#page=3`, revenue: 4670044, profit: 414819, hardware: 1132687, software: 2508083, physical: 121159, digital: 949799, addons: 1340699, otherSoftware: 96425, network: 669873, other: 359402, source: "fy25" },
  { year: 2025, yenPerUsd: 150.7, fxSource: `${ir}25q4_supplement.pdf#page=3`, revenue: 4685651, profit: 463258, hardware: 944425, software: 2641023, physical: 125106, digital: 1055688, addons: 1359617, otherSoftware: 100612, network: 763126, other: 337076, source: "fy25" },
];

// Keep off-platform games in Other throughout the chart; do not manufacture
// pre-disclosure values. Preserve raw reported categories above for the table.
export function sonyMix(row: SonyYear) {
  return [row.hardware, row.software - (row.otherSoftware ?? 0), row.network, row.other + (row.otherSoftware ?? 0)];
}

export const sonyCategories = [
  { label: "Console hardware", color: "#79b3b2", note: "PlayStation consoles; peripherals are in Other." },
  { label: "Games & add-ons", color: "#d2b377", note: "PlayStation game sales, disc royalties and digital add-ons. Off-platform releases stay in Other for this historical comparison." },
  { label: "Network services", color: "#c07964", note: "PlayStation Plus and advertising today; earlier reports also include services such as PlayStation Now, Video and Music. Not a pure subscription or cloud measure." },
  { label: "Other", color: "#8291a9", note: "Peripherals and other revenue, including Sony-published games on other platforms. Later Other Software disclosures are regrouped here." },
] as const;

// Convert the original JPY millions to nominal USD millions with each year's
// reported annual average rate. Never apply today's rate across history.
export function sonyUsd(value: number, row: SonyYear) {
  return value / row.yenPerUsd;
}

export function sonyGrowth(row: SonyYear, category: number | null) {
  const previous = sonyHistory.find(item => item.year === row.year - 1);
  if (!previous) return null;
  const value = category === null ? row.revenue : sonyMix(row)[category];
  const prior = category === null ? previous.revenue : sonyMix(previous)[category];
  return (sonyUsd(value, row) / sonyUsd(prior, previous) - 1) * 100;
}

// Revenue composition uses the full segment total, never the filtered category.
// A common annual FX rate cancels in this ratio. Keep precision until display.
export function sonyComposition(row: SonyYear) {
  const previous = sonyHistory.find(item => item.year === row.year - 1);
  const priorValues = previous ? sonyMix(previous) : null;
  return sonyMix(row).map((value, i) => {
    const percent = value / row.revenue * 100;
    const previousPercent = previous && priorValues ? priorValues[i] / previous.revenue * 100 : null;
    return { percent, previousPercent, shift: previousPercent === null ? null : percent - previousPercent };
  });
}

// One domain for all categories and years, so filtering never exaggerates a lift.
export const sonyGrowthView = {
  min: -40, max: 80, unit: "year-over-year change · USD basis",
  ticks: [80, 60, 40, 20, 0, -20, -40].map(value => ({
    fraction: (80 - value) / 120,
    label: `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)}%`,
  })),
};

export const sonyChartAnnotations = [
  { year: 2019, date: "July 2019 · Sony’s report", label: "News of PS5 weakens PS4 demand" },
  { year: 2020, date: "November 2020", label: "PS5 launches · 12 & 19 Nov" },
  { year: 2021, date: "2021–22 · supply constraints", label: "Chip shortages & disrupted shipping" },
] as const;

export const sonyMilestones = [
  { year: 2016, label: "PS4 Pro", title: "A new model within the same generation", text: "PS4 Pro arrived in November 2016, offering upgraded graphics while sharing the PS4 game library. The chart starts three years into that console generation; this release is a timeline marker, not an estimate of what the Pro contributed to sales.", links: [{ label: "Sony’s release announcement", url: "https://blog.playstation.com/2016/11/10/playstation-4-pro-launches-today/" }] },
  { year: 2018, label: "Games lift earnings", title: "Fewer consoles, more business", text: "Sony reported lower PS4 hardware sales but higher revenue and profit, helped by game sales and PlayStation Plus. God of War and Marvel’s Spider-Man arrived that year. Their releases locate the period; Sony does not isolate their contribution in these segment totals.", links: [{ label: "Sony’s FY2018 explanation · p. 11", url: `${ir}18q4_sonyspeech.pdf` }, { label: "Game release dates · p. 13", url: `${ir}25q4_supplement.pdf` }] },
  { year: 2019, label: "PS5 news / PS4 demand", title: "News of PS5 weakens PS4 demand", text: "In July 2019, Sony said news of its next console was the main reason PS4 sales had fallen below its first-quarter expectations. PS4 was entering its seventh year. Full-year shipments fell from 17.8 million to 13.6 million; console revenue fell about 28% in US dollars. Sony’s statement explains the early demand signal, not the exact share of the annual decline caused by PS5 news.", links: [{ label: "Sony’s demand explanation · p. 9", url: `${ir}19q1_sonyspeech.pdf#page=9` }, { label: "Full-year figures · p. 9", url: `${ir}19q4_supplement.pdf#page=9` }] },
  { year: 2020, label: "PS5 launches", title: "A launch inside a stay-at-home boom", text: "PS5 launched on 12 November 2020 in its first seven markets, including Canada, the US and Japan; the wider rollout followed on 19 November. Sony attributed the year’s higher profit mainly to games and network services, despite launch costs and consoles priced below manufacturing cost. Pandemic lockdowns also lifted play and subscriptions: this rise cannot be credited to new hardware alone.", links: [{ label: "PlayStation’s launch announcement", url: "https://blog.playstation.com/2020/09/16/playstation-5-launches-in-november-starting-at-399-for-ps5-digital-edition-and-499-for-ps5-with-ultra-hd-blu-ray-disc-drive/" }, { label: "Sony’s FY2020 explanation · pp. 8–9", url: `${ir}20q4_sonyspeech.pdf` }] },
  { year: 2021, label: "Chips & shipping", title: "Demand outruns the supply of consoles", text: "Sony could not secure enough semiconductors and other components, while disrupted logistics made consoles harder to deliver. It shipped 11.5 million PS5s in FY2021. In May 2022, Sony identified Shanghai’s COVID lockdown as a risk to parts inventories, and described adding suppliers and negotiating delivery routes. These reports do not identify one chip or factory as the decisive bottleneck. Supply began improving during 2022.", links: [{ label: "Sony’s supply constraints · p. 12", url: "https://www.sony.com/en/SonyInfo/IR/library/presen/irday/pdf/2022/GNS_E.pdf#page=12" }, { label: "Components & logistics · annual filing", url: "https://www.sec.gov/Archives/edgar/data/313838/000119312522183263/d207380d20f.htm" }, { label: "Supply recovery · July 2022, p. 9", url: `${ir}22q1_sonyspeech.pdf#page=9` }] },
  { year: 2022, label: "PS5 supply improves", title: "PS5 supply catches up", text: "Sony had struggled to secure semiconductors and other parts and move consoles through disrupted supply routes. In July 2022 it reported recovery from Shanghai’s lockdown and better component availability; by autumn, materials and logistics constraints had eased substantially. PS5 shipments rose from 11.5 million to 19.1 million. Hardware revenue rose about 58% in US dollars, compared with 91% in Sony’s reported yen. PS5 unit shipments rose 66%; currency, prices and the mix of hardware affect revenue as well as volume.", links: [{ label: "Sony’s FY2022 explanation · pp. 8–9", url: `${ir}22q4_sonyspeech.pdf` }, { label: "Supply recovery · July 2022, p. 9", url: `${ir}22q1_sonyspeech.pdf#page=9` }, { label: "Materials & logistics · November 2022, p. 9", url: `${ir}22q2_sonyspeech.pdf#page=9` }] },
  { year: 2024, label: "Beyond hardware", title: "The audience keeps buying after the console", text: "PS5 shipments fell from 20.8 million to 18.5 million. Yet games, add-ons and network services brought in more revenue, and the gaming segment’s operating profit rose. These totals include exchange-rate effects; they do not measure the spending of an unchanged group of players.", links: [{ label: "Sony’s FY2024 results · pp. 4, 15", url: `${ir}24q4_supplement.pdf` }] },
  { year: 2025, label: "Latest full year", title: "Hardware falls; the total holds", text: "Console revenue fell while total gaming revenue stayed almost level. Sony names network services, third-party games and exchange rates as offsets. Profit rose despite roughly US$0.80bn of Bungie asset impairment losses; it reflects the costs of the wider business as well as what players bought.", links: [{ label: "Sony’s FY2025 explanation · p. 8", url: `${ir}25q4_sonyspeech.pdf` }] },
];

export const sonyYearNotes: Record<number, string> = {
  2017: "Console revenue was almost unchanged from FY2016. Most of the increase came from games, add-ons and network services; the platform could grow without a similar rise in hardware revenue.",
  2021: "Sony shipped 11.5 million PS5s during the second fiscal year of its launch. Games and add-ons remained the largest part of the business, with network services adding another US$3.65bn.",
  2023: "Sony shipped 20.8 million PS5s. Hardware brought in US$8.39bn; PlayStation games and add-ons contributed US$14.65bn, with network services and other sales alongside them.",
};
export const sonyYearNoteLinks: Record<number, string> = { 2019: `${ir}19q4_sonyspeech.pdf` };


// USD millions; fixed domains include every reviewed year and start at zero.
export function sonyRevenueView(category: number | null) {
  const max = category === null ? 35_000 : [10_000, 20_000, 6_000, 3_000][category];
  return {
    max,
    unit: "billions of US dollars",
    ticks: Array.from({ length: 6 }, (_, i) => ({
      fraction: i / 5,
      label: i === 5 ? "0" : `$${Number((max * (5 - i) / 5 / 1000).toFixed(2))}bn`,
    })),
  };
}

export const sonyAccountingSource = `${ir}26q1_supplement.pdf#page=11`;
export const sonyPublisherContext = {
  year: 2025,
  totalUnits: 317.9,
  firstPartyUnits: 32.1,
  source: `${ir}25q4_supplement.pdf#page=12`,
  discussion: "https://www.sony.com/en/SonyInfo/IR/library/presen/business_segment_meeting/pdf/2026/GNS_QA_E.pdf#page=3",
} as const;
