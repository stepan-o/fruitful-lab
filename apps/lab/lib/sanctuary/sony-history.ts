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
  { year: 2016, revenue: 1649799, profit: 135553, hardware: 598373, software: 710970, physical: 185287, digitalCombined: 525683, network: 189241, other: 151215, source: "fy18" },
  { year: 2017, revenue: 1943812, profit: 177478, hardware: 590624, software: 920117, physical: 157897, digitalCombined: 762220, network: 270972, other: 162099, source: "fy18" },
  { year: 2018, revenue: 2310872, profit: 311092, hardware: 527701, software: 1293744, physical: 191513, digitalCombined: 1102231, network: 326525, other: 162903, source: "fy18" },
  { year: 2019, revenue: 1977551, profit: 238400, hardware: 371910, software: 1126769, physical: 116473, digital: 376420, addons: 633876, network: 337265, other: 141607, source: "fy20" },
  { year: 2020, revenue: 2656278, profit: 341718, hardware: 515636, software: 1594710, physical: 140117, digital: 542484, addons: 912108, network: 383012, other: 162921, source: "fy21" },
  { year: 2021, revenue: 2739763, profit: 346089, hardware: 589462, software: 1553377, physical: 128917, digital: 570842, addons: 853617, network: 409355, other: 187569, source: "fy22" },
  { year: 2022, revenue: 3644598, profit: 250006, hardware: 1123522, software: 1716484, physical: 193439, digital: 660932, addons: 862113, network: 464676, other: 339915, source: "fy22" },
  { year: 2023, revenue: 4267734, profit: 290184, hardware: 1211451, software: 2220193, physical: 180250, digital: 851619, addons: 1082967, otherSoftware: 105358, network: 545537, other: 290554, source: "fy24" },
  { year: 2024, revenue: 4670044, profit: 414819, hardware: 1132687, software: 2508083, physical: 121159, digital: 949799, addons: 1340699, otherSoftware: 96425, network: 669873, other: 359402, source: "fy25" },
  { year: 2025, revenue: 4685651, profit: 463258, hardware: 944425, software: 2641023, physical: 125106, digital: 1055688, addons: 1359617, otherSoftware: 100612, network: 763126, other: 337076, source: "fy25" },
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

export const sonyMilestones = [
  { year: 2016, label: "PS4 Pro", title: "A new model within the same generation", text: "PS4 Pro arrived in November 2016, offering upgraded graphics while sharing the PS4 game library. The chart starts three years into that console generation; this release is a timeline marker, not an estimate of what the Pro contributed to sales.", links: [{ label: "Sony’s release announcement", url: "https://blog.playstation.com/2016/11/10/playstation-4-pro-launches-today/" }] },
  { year: 2018, label: "Games lift earnings", title: "Fewer consoles, more business", text: "Sony reported lower PS4 hardware sales but higher revenue and profit, helped by game sales and PlayStation Plus. God of War and Marvel’s Spider-Man arrived that year. Their releases locate the period; Sony does not isolate their contribution in these segment totals.", links: [{ label: "Sony’s FY2018 explanation · p. 11", url: `${ir}18q4_sonyspeech.pdf` }, { label: "Game release dates · p. 13", url: `${ir}25q4_supplement.pdf` }] },
  { year: 2020, label: "PS5 launches", title: "A launch inside a stay-at-home boom", text: "PS5 arrived in November 2020. Sony attributed the year’s higher profit mainly to games and network services, despite launch costs and consoles priced below manufacturing cost. Pandemic lockdowns also lifted play and subscriptions: this rise cannot be credited to new hardware alone.", links: [{ label: "Sony’s FY2020 explanation · pp. 8–9", url: `${ir}20q4_sonyspeech.pdf` }] },
  { year: 2022, label: "Supply & subscriptions", title: "More machines; a larger subscription offer", text: "Sony shipped 19.1 million PS5s, up from 11.5 million, and reported normalized distribution inventories by year-end. Hardware sales and exchange rates lifted revenue; development and acquisition costs helped pull profit down. Meanwhile, PlayStation Plus absorbed PlayStation Now and added catalog tiers during May–June 2022.", links: [{ label: "Sony’s FY2022 explanation · pp. 8–9", url: `${ir}22q4_sonyspeech.pdf` }, { label: "PlayStation Plus launch", url: "https://sonyinteractive.com/en/press-releases/2022/all-new-playstation-plus-game-subscription-service-from-sony-interactive-entertainment-launches-in-north-and-south-america-today/" }] },
  { year: 2024, label: "Beyond hardware", title: "The audience keeps buying after the console", text: "PS5 shipments fell from 20.8 million to 18.5 million. Yet games, add-ons and network services brought in more revenue, and the gaming segment’s operating profit rose. These totals include exchange-rate effects; they do not measure the spending of an unchanged group of players.", links: [{ label: "Sony’s FY2024 results · pp. 4, 15", url: `${ir}24q4_supplement.pdf` }] },
  { year: 2025, label: "Latest full year", title: "Hardware falls; the total holds", text: "Console revenue fell while total gaming revenue stayed almost level. Sony names network services, third-party games and exchange rates as offsets. Profit rose despite ¥120.1bn of Bungie asset impairment losses; it reflects the costs of the wider business as well as what players bought.", links: [{ label: "Sony’s FY2025 explanation · p. 8", url: `${ir}25q4_sonyspeech.pdf` }] },
];

export const sonyYearNotes: Record<number, string> = {
  2017: "Console revenue was almost unchanged from FY2016. Most of the increase came from games, add-ons and network services; the platform could grow without a similar rise in hardware revenue.",
  2019: "Hardware and game revenue both fell from FY2018, while network services increased. Sony also cited exchange rates in the decline. The PS5 launch was still ahead.",
  2021: "Sony shipped 11.5 million PS5s during the second fiscal year of its launch. Games and add-ons remained the largest part of the business, with network services adding another ¥409.4bn.",
  2023: "Sony shipped 20.8 million PS5s. Hardware brought in ¥1,211.5bn; PlayStation games and add-ons contributed ¥2,114.8bn, with network services and other sales alongside them.",
};
export const sonyYearNoteLinks: Record<number, string> = { 2019: `${ir}19q4_sonyspeech.pdf` };
