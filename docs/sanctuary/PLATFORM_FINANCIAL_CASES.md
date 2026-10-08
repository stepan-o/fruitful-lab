# Platform financial cases

Checked 8 October 2026. Chapter 2’s second diagram retains the `sony-history`
exhibit key and `#playstation-history` link, now wrapping a PlayStation / Xbox /
NVIDIA selector. The opening business-chain diagram remains first. Only the
selected financial case mounts; there is no remote data request, animation loop,
new dependency or image asset. Switching cases resets their year/measure controls.

## Reading the comparison

These are three histories of differently scoped businesses, not market shares.
Their revenue cannot be added into an industry total: companies sell at different
points of the supply chain, and some economic activity would be counted twice.
All totals use a zero-based US$35bn scale. Annual changes compare the same issuer’s
adjacent reported years, without inflation adjustment. Sony is converted at each
year’s disclosed average yen/dollar rate; Microsoft and NVIDIA report dollars.
Fiscal labels follow each issuer: Sony FY2025 ends March 2026, Microsoft FY2026
ends June 2026, NVIDIA FY2026 ends January 2026. They are not identical periods.

Sony’s category, accounting, FX, profit and composition controls remain intact.
See [the Sony source ledger](SONY_FINANCIAL_HISTORY.md). Its publisher-copy figure
is now a separate `publisher-ecosystem` exhibit after the comparison prose. It
retains the unit/financial distinction, source links and attributed Sony quote.
Microsoft/NVIDIA do not provide a corresponding copy split in these reports.

## Microsoft / Xbox

Reported Gaming (renamed Xbox in FY2026) revenue, US$ millions:

| FY, June end | Revenue | Primary source |
| --- | ---: | --- |
| 2017 | 9,051 | [2019 annual report](https://www.microsoft.com/investor/reports/ar19/) |
| 2018 | 10,353 | 2019 annual report |
| 2019 | 11,386 | 2019 annual report |
| 2020 | 11,575 | [2022 annual report](https://www.microsoft.com/investor/reports/ar22/) |
| 2021 | 15,370 | 2022 annual report |
| 2022 | 16,230 | 2022 annual report |
| 2023 | 15,466 | [2025 annual report](https://www.microsoft.com/investor/reports/ar25/index.html) |
| 2024 | 21,503 | 2025 annual report |
| 2025 | 23,455 | 2025 annual report |
| 2026 | 21,790 | [FY2026 Form 10-K](https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/msft-20260630.htm), product/service revenue table |

Annual hardware / content-and-services growth rates:
FY2021 +92% / +23% ([2021 report](https://www.microsoft.com/investor/reports/ar21/));
FY2022 +16% / +3% (2022 report);
FY2023 −11% / −3% ([2023 report](https://www.microsoft.com/investor/reports/ar23/));
FY2024 −13% / +50% ([2024 report](https://www.microsoft.com/investor/reports/ar24/));
FY2025 −25% / +16% (2025 report);
FY2026 −29% / −5% (2026 10-K). These are reported rounded annual rates, not
quarterly changes or category shares. Earlier category rates are outside this
exhibit’s collected series and render as missing, never zero. Their common plot
range is −40% to +100%, including the launch-year hardware increase.

No category dollar amounts are reverse-engineered from rounded growth. No
Game Pass/cloud revenue or separate Xbox profit is fabricated. More Personal
Computing includes other businesses and its profit is not Xbox profit.

The October 2023 Activision Blizzard acquisition enters FY2024. Microsoft reports
US$75.4bn as its completed purchase price (2024 annual report, Note 8), not the
earlier announcement’s enterprise value. Microsoft attributes 44 percentage
points of FY2024’s 50% content/services growth to the deal’s net effect. The
series includes acquired revenue, rather than showing organic growth at a
constant corporate perimeter. The prose connects the acquisition to ownership
of creative work without attributing a measured return to one game or catalog.

## NVIDIA / Gaming end market

Reported revenue, US$ millions:

| FY | Year ended | Revenue | Primary source |
| --- | --- | ---: | --- |
| 2020 | 26 Jan 2020 | 5,518 | [FY2021 CFO commentary](https://investor.nvidia.com/files/doc_financials/annual/2021/Q4FY21-CFO-Commentary.pdf), pp. 1–2 |
| 2021 | 31 Jan 2021 | 7,759 | FY2021 CFO commentary |
| 2022 | 30 Jan 2022 | 12,462 | [FY2023 CFO commentary](https://s201.q4cdn.com/141608511/files/doc_financials/2023/Q423/Q4FY23-CFO-Commentary.pdf), pp. 1–3 |
| 2023 | 29 Jan 2023 | 9,067 | FY2023 CFO commentary |
| 2024 | 28 Jan 2024 | 10,447 | [FY2026 Form 10-K](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm), revenue by specialized market |
| 2025 | 26 Jan 2025 | 11,350 | FY2026 Form 10-K |
| 2026 | 25 Jan 2026 | 16,042 | FY2026 Form 10-K |

Gaming includes GeForce GPUs, GeForce NOW, and console chips/development
services. It excludes separately reported Data Center revenue and is narrower
than the Graphics reporting segment. Consequently Graphics profit cannot be
substituted for Gaming profit. No cloud revenue/share/profit is disclosed here.
The three product families are a list, never an equal-area revenue breakdown.

Milestones use management’s explanations: RTX 30 / Ampere ramp in FY2021;
reduced shipments to clear partner inventory amid weaker demand and China
COVID disruption in FY2023; Blackwell demand in FY2026. Product generations are
context, not estimates of individual products’ causal revenue contributions.

## Narrative and interaction placement

The financial selector follows paragraph 1. Sony’s historical prose is followed
by the new Microsoft and NVIDIA comparison (paragraphs 5–6). The independent
publisher figure follows paragraph 6; the Cyberpunk promotion follows paragraph
10; the existing market map follows paragraph 11. Sections/citations shifted with
the content. Both manuscripts mirror the runtime order. Chapter 1 is unchanged.

Year bars, year selectors and milestone buttons update the same readout.
Arrow/year controls move only the chart’s horizontal viewport. Small screens
keep the axis visible while the bars scroll. Native buttons/selects provide
keyboard and touch controls; absent data and base years do not draw zero bars.
