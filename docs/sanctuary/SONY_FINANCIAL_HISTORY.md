# PlayStation financial history exhibit

Placement: chapter 2, **From studio to screen**, after the PS5 opening and
FY2025 revenue-scale paragraph (zero-based `afterParagraph: 1`). The revenue
paragraph now introduces the chart. Added 8 October 2026; chapter 1 is unchanged.

## Editorial purpose

The opening describes Sony losing money on early PS5 hardware while its gaming
business reported higher profit. This exhibit expands the evidence from a
launch quarter to ten completed fiscal years. It lets the reader distinguish
console cycles, earnings from games and services, and segment operating profit.
It does not estimate a console owner's lifetime value or assign the whole
business's performance to a particular release.

The title is “PlayStation, beyond the console.” The opening observation is a
calculation: FY2025 hardware revenue / segment revenue = 944,425 / 4,685,651 =
20.1557%; roughly four fifths came from the remaining categories.

## Data and sources

Data: `apps/lab/lib/sanctuary/sony-history.ts`. Integers retain Sony's original
unit, **millions of nominal Japanese yen**. Graph scales are trillions for
revenue and billions for operating profit. Readouts use billions to one decimal.
No inflation adjustment, currency conversion, interpolation or forecast.
FY2025 means 1 April 2025–31 March 2026, the latest completed fiscal year at the
research date. Every annual row references one of these original Sony reports:

| Years used | Financial supplement | Printed pages |
| --- | --- | --- |
| FY2016–2018 | [FY2018 Q4](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/18q4_supplement.pdf) | 3: segment sales/OI; 8: category breakdown |
| FY2019 | [FY2020 Q4](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/20q4_supplement.pdf) | 4; 9 |
| FY2020 | [FY2021 Q4](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/21q4_supplement.pdf) | 4; 9, restated FY2020 |
| FY2021–2022 | [FY2022 Q4](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/22q4_supplement.pdf) | 4; 10 |
| FY2023 | [FY2024 Q4](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/24q4_supplement.pdf) | 4; 15 |
| FY2024–2025 | [FY2025 Q4](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q4_supplement.pdf) | 4; 12 |

Scope is **Game & Network Services segment sales and operating income**, not
Sony consolidated revenue, gross consumer spending, net income, free cash flow
or Sony Interactive Entertainment's standalone accounts. Segment sales include
intersegment sales. Segment operating income excludes unallocated corporate
expenses. Some revenue is product sales; physical third-party games generate
royalties. No common gross-spending basis or category profit margin is inferred.

### Accounting and category boundaries

- FY2016–2019 are US GAAP. FY2020–2025 are IFRS, with FY2020 sourced from the
  later restatement. Its operating income is **341,718**, not the earlier US
  GAAP **342,192**. The figure labels the boundary. No uninterrupted growth
  rate is calculated across it.
- FY2020 category amounts also use the FY2021 report's minor reclassifications,
  not the original FY2020 breakdown. Total sales remain 2,656,278.
- FY2016–2018 combine digital full games and add-ons. These values are retained
  as `digitalCombined`, never divided by an assumed proportion. The selected
  year's software detail explicitly explains the absent split.
- For the chart, Games & add-ons = reported Game Software minus any separately
  reported Other Software. Other = reported Others plus that Other Software.
  This keeps off-platform software in Other, matching earlier reports' scope.
  FY2023–2025 raw aggregates remain intact in the exact-values table. This is
  a broad harmonization, not a claim that every historical category is identical.
- Sony reclassified some bundled software from Hardware to Physical Software
  in FY2022. It described the pre-FY2022 effect as immaterial and did not restate
  those years. This boundary is noted publicly.
- Network Services currently includes PlayStation Plus and advertising. Earlier
  versions also included services such as PS Now, Video and Music. Neither
  subscriptions alone nor cloud revenue can be recovered from these totals.
- Preserve reported rounding. The FY2018 segment-results total is 2,310,872;
  its category table says 2,310,873. The chart uses the segment-results total.
  Component rounding produces differences of at most ¥2m in the retained rows.
- The later FY2025 report corrects quarterly PS5 unit numbers; the annual 16.0m
  is unchanged. This exhibit does not use the previously incorrect quarters.

## Historical annotations

Dates are context unless Sony explicitly identifies a business driver. No
release is given an invented numerical lift.

- **FY2016:** [PS4 Pro launch, 10 November 2016](https://blog.playstation.com/2016/11/10/playstation-4-pro-launches-today/).
  The series begins during PS4's life; it does not pretend to cover PlayStation's
  whole history or plot missing pre-2016 categories.
- **FY2018:** [Sony's FY2018 speech, printed p. 11](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/18q4_sonyspeech.pdf)
  identifies software and PS Plus gains despite lower hardware sales. The
  FY2025 supplement p. 13 supplies God of War / Spider-Man release dates.
- **FY2019:** [Sony's FY2019 speech, p. 9](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/19q4_sonyspeech.pdf)
  identifies falling PS4/software sales and currency effects.
- **FY2020:** [Sony's FY2020 speech, pp. 8–9](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/20q4_sonyspeech.pdf)
  explains game/network profit, loss-making PS5 launch prices, component
  constraints and stay-at-home demand. Narrative uses the reported direction,
  while chart values use the subsequent IFRS restatement.
- **FY2022:** [Sony's FY2022 speech, pp. 8–9](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/22q4_sonyspeech.pdf)
  identifies hardware/currency-led revenue growth, development/acquisition costs,
  19.1m PS5 shipments and normalized distribution inventories. The [official
  PS Plus launch announcement](https://sonyinteractive.com/en/press-releases/2022/all-new-playstation-plus-game-subscription-service-from-sony-interactive-entertainment-launches-in-north-and-south-america-today/)
  records the May–June regional rollout and new tiers. Do not credit the entire
  revenue increase to the new subscription offer.
- **FY2024:** FY2024 supplement pp. 4 and 15 supplies the profit, category sales
  and 20.8m → 18.5m PS5 shipment comparison. No constant-currency claim.
- **FY2025:** [Sony's FY2025 speech, p. 8](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q4_sonyspeech.pdf)
  identifies weaker hardware, network/third-party/currency offsets and ¥120.1bn
  Bungie impairment losses. Those costs stay in operating income.

## Visual and implementation treatment

Original HTML/CSS statistical drawing, Sanctuary's dark mineral panel, mint
hardware, gold game revenue, clay network services, slate other. Two aligned
zero-based bar charts have separate, explicit scales. A selected column is
highlighted in both. No publisher artwork, logo or screenshot is reproduced;
Sony is credited for the factual data, with original-source links at the point
of inspection. A short excerpt from Sony’s June 2026 investor Q&A is attributed in the publisher comparison below.

Native buttons and a year selector work with keyboard/touch. On narrow screens,
the charts scroll inside their panel to preserve readable axes and 44px column
targets; milestone controls and the readout reflow. The source table scrolls
inside its own named region. Selection does not scroll the surrounding page.
No animation loop, added dependency, image asset, third-party request or live
financial API. The component is dynamically imported through Reader only for
chapters selecting the typed `sony-history` exhibit.

## Checks

Automated checks cover category reconciliation, software-detail reconciliation,
agreement with the existing FY2024–2025 exhibit, missing early add-on values,
the IFRS restatement, off-platform regrouping, year controls, milestone and
category selection, exact-data disclosure, and placement after the revenue-scale paragraph. Browser
and final CI results are recorded in the editorial validation log after review.


## Category-only views and publisher boundaries — 8 October 2026

Selecting a category removes the other stacks and the whole-segment profit plot.
Each annual bar starts at zero and labels its own value. The selected-year
readout gives category revenue and its share of segment revenue. `All revenue`
restores the stacked composition and profit plot without changing the year.
The scale is fixed across all ten years within each selected category: hardware
¥1,500bn, PlayStation games/add-ons ¥3,000bn, network ¥800bn, other ¥500bn.
Overall revenue retains ¥5tn. The chart states that the scale changes, uses
billions in isolated views, and never labels segment profit as category profit.
No financial values in the historical dataset have changed.

### What the publisher evidence can establish

The [FY2025 Q4 supplement, p. 12](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q4_supplement.pdf#page=12)
reports **317.9m PS4/PS5 full-game units**, of which **32.1m are first-party**.
The remainder is derived, **285.8m**. Shares of the same denominator are
**10.1% and 89.9%**. These include bundled copies, not add-ons or subscription
revenue, and do not measure free-to-play spending. The two original horizontal
bars have a common 0–317.9m baseline; they are a fixed FY2025 comparison,
explicitly separate from the year/category revenue controls above.

Reviewed the regular financial supplements, FY2025 annual-report G&NS section,
[2025 segment presentation](https://www.sony.com/en/SonyInfo/IR/library/presen/business_segment_meeting/pdf/2025/GNS_E.pdf)
and [June 2026 investor Q&A](https://www.sony.com/en/SonyInfo/IR/library/presen/business_segment_meeting/pdf/2026/GNS_QA_E.pdf).
These sources do not provide the consistent annual first-party/third-party
revenue or publisher-payout series needed to split the existing money bars.
A split by units cannot estimate that: prices, discounts, add-ons, subscriptions,
free-to-play games and contract terms differ. First-party is Sony’s title
classification, not a complete studio-ownership or funding classification.
The Q&A describes both internal teams and external partners in its first-party
portfolio (question 8, p. 6). It does not disclose their financial split.

Question 3 (pp. 3–4) supplies the exact 13-word excerpt used publicly:
“most of the value of our ecosystem is driven by third-party publishers”.
This is Sony management’s assessment, not a measured share of profit. The
surrounding answer describes first-party titles as an attraction to the platform
even while a minority of SIE sales; the quote supports the chapter’s argument
without turning the unit share into an earnings estimate.

The [FY2026 Q1 supplement, p. 11, notes 3–4](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/26q1_supplement.pdf#page=11)
explicitly states gross retail recognition for digital software and add-ons.
A prominent note now explains that outside publishers’ share is included in
those revenues before costs. Physical third-party software continues to be
royalty-based; the total is not a uniform gross transaction value or Sony’s
retained commission.

## Scale, original PlayStation context and add-ons — 8 October 2026

Chapter prose now follows the figure with four paragraphs explaining the money:

- FY2025 G&NS sales: ¥4,685,651m. The roughly **US$31bn** illustration is our
  conversion at Sony’s FY2025 average **¥150.7/USD** (supplement p. 3):
  4,685,651 / 150.7 / 1,000 = **US$31.0926bn**. This is not a reported USD
  segment result. The subsequent chart update below applies annual USD conversion throughout.
- Same-period Music sales ¥2,120,110m + Pictures ¥1,499,290m = ¥3,619,400m,
  below gaming revenue. All three use the segment table (p. 4), including
  intersegment sales. This compares Sony businesses, not entire entertainment
  industries or their profit. Pictures includes more than theatrical films.
- Chart-aligned components: hardware ¥944.425bn; PlayStation games/add-ons
  ¥2,540.411bn; network services ¥763.126bn; regrouped Other ¥437.688bn.
  Current prose converts these to US$6.3bn, US$16.9bn, US$5.1bn and US$2.9bn.
- Add-ons **¥1,359.617bn** are included within games/add-ons, never added a
  second time to the total. Sony’s p. 12 definition covers digital content
  other than full games, including currency, items and expansion packages.
  An expansion, cosmetic outfit and virtual shop currency make this legible;
  PlayStation Plus and free updates are not purchases in that category.
- Gross digital receipts include publishers’ shares. Segment operating income
  is ¥463.258bn after its costs, not net income, the Sony commission, cash flow
  or a studio-payout estimate. Diablo IV is an illustrative connection to the
  later analysis; its contribution to Sony’s category is not disclosed.

### How far the history goes

[Sony’s historical archive](https://www.sony.com/en/SonyInfo/IR/library/historical/)
goes back to FY1960 at company level. [Annual Report 1998, PDF pp. 72–73](https://www.sony.com/en/SonyInfo/IR/library/ar/ar_sony_1998.pdf#page=72)
separates Game from Electronics and retrospectively presents:

| Fiscal year | Year ended March | Segment sales, ¥m | Operating income, ¥m |
| --- | --- | --- | --- |
| FY1995 | 1996 | 203,911 | −8,938 |
| FY1996 | 1997 | 419,278 | 57,045 |
| FY1997 | 1998 | 722,551 | 116,936 |

These establish available separate Game figures **at least back to FY1995**;
not the earliest possible source or a claim that PlayStation began that year.
The prose rounds the first and last sales figures to ¥204bn and ¥723bn.
[Annual Report 1997, PDF p. 25](https://www.sony.com/en/SonyInfo/IR/library/ar/ar_sony_1997.pdf#page=25)
attributes growth to affordable console pricing and hit releases, including
Square’s Final Fantasy VII and Namco’s Tekken alongside Sony’s releases.
This supports the platform’s dependence on other creators before downloads.

The older totals extend historical context, **not the chart’s plotted range**.
No CAGR, inflation-adjusted multiple or invented historical category split is
published. In FY2009, for example, Game moved into Networked Products & Services
alongside other operations; the [quarterly securities report](https://www.sony.com/en/SonyInfo/IR/library/Sony_Quarterly_Securities_Report_2009Q1.pdf)
separates Game sales as a product category, while segment profit has wider scope.
Building a full early revenue/profit series would require explicit bridges or
gaps at these reorganizations, as well as the later GAAP/IFRS boundary.

Sony illustrates the economic attraction of distribution; these accounts are
not evidence of Valve’s motives. The revised closing preserves Valve’s own
update-delivery origin and continued game development. Chapter 3 retains the
primary-source account. No new image, animation, dependency or asset release.


## PS5 transition annotations (8 October 2026)

Three persistent, selectable labels share the bars’ year grid and mobile scroll:
FY2019 “News of PS5 weakens PS4 demand”, FY2020 “PS5 launches · 12 & 19 Nov”,
and 2021–22 “Chip shortages & disrupted shipping”, noting recovery during 2022.
They select the same sourced year readout as the bars and year picker and remain
visible in the revenue and YoY views. FY2022 has a separate recovery milestone.

- Sony’s [July 2019 presentation, p. 9](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/19q1_sonyspeech.pdf#page=9)
  attributes below-expectation Q1 PS4 sales primarily to news of its next console.
  This is not a quantified explanation of the entire full-year decline.
- The [official launch announcement](https://blog.playstation.com/2020/09/16/playstation-5-launches-in-november-starting-at-399-for-ps5-digital-edition-and-499-for-ps5-with-ultra-hd-blu-ray-disc-drive/)
  gives 12 November 2020 for the first seven markets and 19 November for the
  wider rollout. This is the release date, not the announcement date.
- The FY2022 readout now explains supply recovery. Sony’s
  [July 2022 report, p. 9](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/22q1_sonyspeech.pdf#page=9)
  connects recovery from Shanghai lockdown and component availability with
  improved production; its [November report, p. 9](https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/22q2_sonyspeech.pdf#page=9)
  says restrictions on materials and logistics eased significantly.
- Sony’s [FY2021 annual filing](https://www.sec.gov/Archives/edgar/data/313838/000119312522183263/d207380d20f.htm)
  identifies semiconductor/other-component constraints and logistics disruption.
  Its [2022 business briefing, p. 12](https://www.sony.com/en/SonyInfo/IR/library/presen/irday/pdf/2022/GNS_E.pdf#page=12)
  names Shanghai parts-inventory risk, Russia-related logistics risk, multiple
  suppliers and delivery-route negotiations. It does not identify a single
  chip model, supplier or port as the decisive PS5 bottleneck, or quantify each
  factor’s contribution. Do not substitute speculation about AMD chips for
  this disclosure.
- Hardware revenue growth FY2021→FY2022: 1,123,522 / 589,462 − 1 = 90.60%.
  PS5 unit growth: 19.1 / 11.5 − 1 = 66.09%. These are different measures;
  currency, price and mix affect revenue, and hardware includes PS4 too.


## USD display and grouped annual change — 8 October 2026

Both revenue and operating profit now display **nominal US dollars**. Divide
original JPY millions by the corresponding fiscal year's annual-average JPY/USD
rate to obtain USD millions; divide by 1,000 for the displayed USD billions.
These are derived conversions, not USD segment totals published by Sony. No
inflation adjustment, today's exchange rate or constant-currency claim is made.
The original JPY table remains available with clickable FX sources for audit.

| FY | JPY per USD | Sony supplement, printed page |
| --- | ---: | --- |
| 2016 | 108.4 | 18q4, 2 |
| 2017 | 110.9 | 18q4, 2 |
| 2018 | 110.9 | 18q4, 2 |
| 2019 | 108.7 | 20q4, 3 |
| 2020 | 106.1 | 20q4, 3 |
| 2021 | 112.3 | 22q4, 3 |
| 2022 | 135.4 | 22q4, 3 |
| 2023 | 144.4 | 24q4, 3 |
| 2024 | 152.5 | 25q4, 3 |
| 2025 | 150.7 | 25q4, 3 |

Documents are under Sony's [quarterly results archive](https://www.sony.com/en/SonyInfo/IR/library/presen/er/).
The source data links directly to each PDF and page. FY2024 **152.5** is the full
year rate, not the fourth quarter's 152.6. FY2020's monetary totals retain the
later IFRS restatement; its conversion uses that year's 106.1 average.

The second chart view groups the four category bars within each year and plots
`100 × (current converted USD / prior converted USD − 1)`. It is percentage
change, not percentage-point change or change in revenue share. Negative bars
extend below a visible zero line. All categories use the same −40% to +80% scale,
including when isolated. FY2016 is marked **Base year**, with no invented zero
or previous-year estimate. Operating profit is excluded from this view. Year,
category and annotation selections persist when switching views; exact growth
and revenue are in the selected-year readout and accessible year descriptions.

FY2021→FY2022 hardware: (1,123,522 / 135.4) / (589,462 / 112.3) − 1 ≈ **58.1%**.
Its 90.6% original JPY growth is not the USD chart's growth. FY2018→FY2019
hardware declines about **28.1% in USD**. Exchange rates, accounting changes and
category regrouping remain disclosed; this view is not organic growth or a
causal estimate of the console announcements and shortages.

FY2025 chapter prose is synchronized to USD, including the US$9.0bn add-on total
and US$3.1bn operating profit. The 1990s historical paragraph explicitly retains
its original yen figures; no unsupported historical FX is inferred.


## Selected-year composition — 8 October 2026

The detailed year readout pairs its category amounts with a slim vertical 100%
stack. Solid segments show the selected year; dashed outlines show the preceding
year on the same scale. The detail stack now reads top to bottom in the same
order as its category list, with percentages printed inside the solid segments.
Dashed guides cross the solid bar at the prior year's cumulative boundaries;
each outlined segment's height, not its cumulative endpoint, is that category's
share. The list gives current shares, previous shares, and bracketed YoY shifts
in **percentage points**. In growth mode, dollar-revenue YoY is separately named.

`share = 100 × category / full segment revenue`; `pp shift = share − prior share`.
Calculations use unrounded figures. Annual FX cancels within each year's share.
The full four-category composition remains visible and uses the full segment
denominator when the main chart isolates a category; that category is highlighted.
FY2016 has no previous-year comparison: no dashed outline or invented zero shift.
Reporting-rounding discrepancies remain at sub-pixel size; original data is not
changed to force an exact sum. No new assets, animation or dependency.

Worked verification: FY2022 hardware 30.8270%, FY2021 hardware 21.5151%, shift
+9.3120 pp (displayed 30.8%, 21.5%, +9.3 pp). This is distinct from the 58.1%
USD hardware-revenue growth shown in the annual-growth chart.


## Composition identification and inspection — 8 October 2026

The former bottom-to-top stack opposed the adjacent top-to-bottom legend. Its
heights were numerically correct, but the ordering made categories easy to
misidentify. The detail now starts with hardware at the top, matching the list.
The prior-year key and narrow dashed bar sit left of the current solid bar.
Dashed guides mark prior cumulative boundaries, not current category separators.

Hovering a segment or category opens a styled tooltip with fiscal year, category,
USD revenue, share of full gaming revenue, prior share and revenue, and the
percentage-point shift. Both bars and the matching category highlight together.
Click or tap pins the detail; Escape, outside click, scrolling, changing year or
leaving keyboard focus dismisses it. Full-width category buttons provide larger
keyboard and touch targets than the small proportional segments. Popup placement
is bounded to the viewport and does not change the page layout. No motion loop,
new dependency, asset or data request is introduced.

FY2025 verification: hardware is 944,425 / 4,685,651 = **20.1557%**, displayed
**20.2%**; Other is 437,688 / 4,685,651 = **9.3410%**, displayed **9.3%**.
Hardware must therefore render **2.1578 times** as tall as Other. Prior hardware
share is 24.2543%; the change is **−4.1 pp**, using unrounded values.
