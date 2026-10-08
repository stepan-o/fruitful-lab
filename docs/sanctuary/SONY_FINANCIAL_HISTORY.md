# PlayStation financial history exhibit

Placement: chapter 2, **From studio to screen**, immediately after the first
paragraph (zero-based `afterParagraph: 0`). Added 8 October 2026. The accepted
prose and chapter 1 are unchanged.

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
of inspection. No quoted prose from Sony is used in this exhibit.

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
category selection, exact-data disclosure, and paragraph-0 placement. Browser
and final CI results are recorded in the editorial validation log after review.
