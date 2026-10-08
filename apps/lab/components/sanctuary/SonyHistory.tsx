"use client";

import { useRef, useState, type CSSProperties } from "react";
import { sonyAccountingSource, sonyGrowth, sonyGrowthView, sonyUsd, sonyChartAnnotations, sonyCategories, sonyHistory, sonyPublisherContext, sonyRevenueView, sonyMilestones, sonyMix, sonySources, sonyYearNoteLinks, sonyYearNotes } from "@/lib/sanctuary/sony-history";
import s from "./sony-history.module.css";

const billions = (n: number) => (n / 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const millions = (n: number) => n.toLocaleString("en-US");
const share = (n: number, total: number) => `${(100 * n / total).toFixed(1)}%`;
const growthLabel = (value: number | null) => value === null ? "Base year" : `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}%`;
const profitMax = 4_000; // USD millions, independent from revenue and growth.
const growthRange = sonyGrowthView.max - sonyGrowthView.min;
const growthZero = sonyGrowthView.max / growthRange * 100;

export default function SonyHistory() {
  const [mode, setMode] = useState<"revenue" | "growth">("revenue");
  const [year, setYear] = useState(2020);
  const [category, setCategory] = useState<number | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const row = sonyHistory.find(item => item.year === year)!;
  const values = sonyMix(row);
  const milestone = sonyMilestones.find(item => item.year === year);
  const source = sonySources[row.source];
  const revenueView = sonyRevenueView(category);
  const growth = mode === "growth";
  const showProfit = !growth && category === null;
  const axis = growth ? sonyGrowthView : revenueView;
  const selectedRevenue = category === null ? row.revenue : values[category];
  const publisherUnits = [sonyPublisherContext.firstPartyUnits, Number((sonyPublisherContext.totalUnits - sonyPublisherContext.firstPartyUnits).toFixed(1))];

  function selectYear(value: number) {
    setYear(value);
    // Move only this chart's viewport, never the surrounding reading position.
    const element = scroll.current?.querySelector<HTMLElement>(`[data-year="${value}"]`);
    if (element && scroll.current) {
      scroll.current.scrollLeft = element.offsetLeft - scroll.current.clientWidth / 2 + element.offsetWidth / 2;
    }
  }

  return <figure className={s.figure} id="playstation-history" aria-labelledby="sony-history-title">
    <figcaption>
      <p className={s.kicker}>Sony · Game & Network Services · FY2016–FY2025</p>
      <h2 id="sony-history-title">PlayStation,<br/><em>beyond the console.</em></h2>
      <p>In FY2025, about four fifths of Sony’s gaming revenue came from something other than the consoles themselves.</p>
    </figcaption>

    <p className={s.accountingNote}>Digital game and add-on revenue includes the amount paid to outside publishers. It is recorded before those payments and Sony’s other costs. <a href={sonyAccountingSource} target="_blank" rel="noreferrer">Sony’s accounting basis ↗</a></p>
    <div className={s.views} role="group" aria-label="Chart measure">
      <button type="button" aria-pressed={!growth} onClick={() => setMode("revenue")}>Revenue</button>
      <button type="button" aria-pressed={growth} onClick={() => setMode("growth")}>Year-over-year change</button>
    </div>
    <p className={s.currencyNote}>US dollars · converted at each fiscal year’s average exchange rate. Currency movements affect the trends.</p>
    <div className={s.legend} role="group" aria-label="Choose a revenue view">
      <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>All revenue</button>
      {sonyCategories.map((item, i) => <button key={item.label} type="button" aria-pressed={category === i} onClick={() => setCategory(category === i ? null : i)} style={{ "--series": item.color } as CSSProperties}><i/>{item.label}</button>)}
    </div>
    <p className={s.guide}>{growth ? "Compare each category with its previous year: adjacent bars show gains above zero and declines below. FY2016 is the starting point, not zero growth. Select a year for the percentages." : category === null ? "Select a category to see it on its own, or a year for the figures and events behind it." : `${sonyCategories[category].note} Bars start at zero; the scale is fitted to this category across all ten years.`}</p>
    <p className={s.mobileHint}>Swipe the charts to see all ten years →</p>

    <div className={s.chartFrame} data-focused={!showProfit} data-mode={mode}>
      <div className={s.fixedAxes} aria-hidden="true">
        <div className={s.plotTitle}>{growth ? "Annual change" : "Sales revenue"} <span>{axis.unit}</span></div>
        {axis.ticks.map(tick => <b key={tick.label} style={{ top: 54 + tick.fraction * 202 }}>{tick.label}</b>)}
        {showProfit && <><div className={s.profitTitle}>Operating profit <span>US$ billions · separate scale</span></div>
          {[4, 2, 0].map(n => <b key={`profit-${n}`} style={{ top: 313 + (1 - n / 4) * 65 }}>{n === 0 ? "0" : `$${n}bn`}</b>)}
        </>}
      </div>
      <div className={s.scroll} ref={scroll} tabIndex={0} role="group" aria-label={`${growth ? "Year-over-year revenue change by category" : category === null ? "Ten years of PlayStation revenue and operating profit" : `Ten years of ${sonyCategories[category].label} revenue only`}; horizontally scrollable on narrow screens`}>
        <div className={s.chartInner}>
          <div className={s.annotations} role="group" aria-label="Console transition annotations">
            {sonyChartAnnotations.map((event, i) => <button type="button" key={event.year} aria-pressed={year === event.year} onClick={() => setYear(event.year)} className={s.annotation} data-event={i}>
              <small>{event.date}</small><strong>{event.label}</strong><span>{i === 2 ? "Supply improves during 2022 · inspect ↘" : `FY${event.year} · inspect ↘`}</span>
            </button>)}
          </div>
          <div className={s.plot}>
            <div className={s.plotTitle}>{growth ? "Annual change" : "Sales revenue"} <span>{axis.unit}</span></div>
            <div className={s.revenueGrid} aria-hidden="true">{axis.ticks.map(tick => <span key={tick.label} data-zero={tick.label === "0%"} style={{ top: `${tick.fraction * 100}%` }}><b>{tick.label}</b></span>)}</div>
            {showProfit && <><div className={s.profitTitle}>Operating profit <span>US$ billions · separate scale</span></div>
              <div className={s.profitGrid} aria-hidden="true">{[4, 2, 0].map(n => <span key={n} style={{ top: `${100 - n / 4 * 100}%` }}><b>{n === 0 ? "0" : `$${n}bn`}</b></span>)}</div>
            </>}
            <div className={s.columns}>
              {sonyHistory.map(item => {
                const mix = sonyMix(item);
                const total = category === null ? item.revenue : mix[category];
                const usdTotal = sonyUsd(total, item);
                const growthValues = sonyCategories.map((_, i) => sonyGrowth(item, i));
                const growthDescription = sonyCategories.flatMap((entry, i) => category === null || category === i ? [`${entry.label} ${growthLabel(growthValues[i])}`] : []).join("; ");
                return <button type="button" key={item.year} data-year={item.year} aria-pressed={year === item.year} onClick={() => setYear(item.year)} className={s.column} aria-label={`FY${item.year}: ${growth ? `year-over-year USD revenue change; ${growthDescription}` : `${category === null ? "revenue" : `${sonyCategories[category].label} revenue`} US$${billions(usdTotal)} billion${showProfit ? `; operating profit US$${billions(sonyUsd(item.profit, item))} billion` : ""}`}. Show year.`}>
                  {sonyChartAnnotations.some(event => event.year === item.year) && <span className={s.eventGuide} aria-hidden="true"/>}
                  {growth ? <span className={s.growthArea} aria-hidden="true">
                    {item.year === 2016 ? <span className={s.baseYear}>Base<br/>year</span> : growthValues.map((value, i) => (category === null || category === i) && value !== null ? <span className={s.growthLane} key={sonyCategories[i].label}>
                      <span className={s.growthBar} data-negative={value < 0} title={`${sonyCategories[i].label}: ${growthLabel(value)}`} style={{ top: `${value >= 0 ? growthZero - value / growthRange * 100 : growthZero}%`, height: `${Math.abs(value) / growthRange * 100}%`, "--series": sonyCategories[i].color } as CSSProperties}/>
                    </span> : null)}
                  </span> : <span className={s.stackArea} aria-hidden="true"><span className={s.stack} style={{ height: `${usdTotal / revenueView.max * 100}%` }}>
                    <span className={s.barValue}>{billions(usdTotal)}</span>
                    {mix.map((value, i) => category === null || category === i ? <span key={sonyCategories[i].label} className={s.segment} style={{ height: `${value / total * 100}%`, "--series": sonyCategories[i].color } as CSSProperties}/> : null)}
                  </span></span>}
                  {showProfit && <span className={s.profitArea} aria-hidden="true"><span style={{ height: `${sonyUsd(item.profit, item) / profitMax * 100}%` }}/></span>}
                  <span className={s.year}>’{String(item.year).slice(2)}{sonyMilestones.some(event => event.year === item.year) ? <i aria-hidden="true"/> : null}</span>
                </button>;
              })}
            </div>
            <div className={s.accounting} aria-hidden="true"><span>US GAAP</span><span>IFRS · FY2020 restated</span></div>
          </div>
        </div>
      </div>
    </div>

    <div className={s.yearControls}>
      <button type="button" aria-label="Previous fiscal year" disabled={year === 2016} onClick={() => selectYear(year - 1)}>←</button>
      <label>Inspect <select aria-label="Fiscal year" value={year} onChange={event => selectYear(Number(event.target.value))}>{sonyHistory.map(item => <option key={item.year} value={item.year}>FY{item.year} · to Mar {item.year + 1}</option>)}</select></label>
      <button type="button" aria-label="Next fiscal year" disabled={year === 2025} onClick={() => selectYear(year + 1)}>→</button>
    </div>
    <div className={s.milestones} role="group" aria-label="Explore PlayStation milestones">{sonyMilestones.map(event => <button key={event.year} type="button" aria-pressed={year === event.year} onClick={() => selectYear(event.year)}><small>{event.year}</small>{event.label}</button>)}</div>

    <div className={s.readout} aria-live="polite" aria-atomic="true">
      <div>
        <p className={s.kicker}>FY{year} · April {year} to March {year + 1}</p>
        <div className={s.totals}>
          <div><small>{category === null ? growth ? "Total revenue YoY" : "Sales revenue" : `${sonyCategories[category].label} ${growth ? "YoY" : "revenue"}`}</small><strong>{growth ? growthLabel(sonyGrowth(row, category)) : <>US${billions(sonyUsd(selectedRevenue, row))}<span>bn</span></>}</strong></div>
          {showProfit ? <div><small>Operating profit</small><strong>US${billions(sonyUsd(row.profit, row))}<span>bn</span></strong></div> : growth ? <div><small>{category === null ? "Sales revenue" : "Category revenue"}</small><strong>US${billions(sonyUsd(selectedRevenue, row))}<span>bn</span></strong></div> : <div><small>Share of gaming revenue</small><strong>{share(selectedRevenue, row.revenue)}</strong></div>}
        </div>
        {category === null && <dl className={s.mix}>{sonyCategories.map((item, i) => <div key={item.label} style={{ "--series": item.color } as CSSProperties}><dt><i/>{item.label}</dt><dd>{growth ? growthLabel(sonyGrowth(row, i)) : `US$${billions(sonyUsd(values[i], row))}bn`} <span>{growth ? `US$${billions(sonyUsd(values[i], row))}bn` : share(values[i], row.revenue)}</span></dd></div>)}</dl>}
        <p className={s.fxNote}><a href={row.fxSource} target="_blank" rel="noreferrer">FY{year} average: ¥{row.yenPerUsd.toFixed(1)} per US$1 ↗</a>{growth && " · Change compares each year at its own average rate; this is not constant-currency growth."}</p>
        <p className={s.margin}>{category === null ? <>Operating margin: <strong>{share(row.profit, row.revenue)}</strong>. Profit is for the whole gaming segment; Sony does not provide a matching profit split by these categories.</> : <>Sony does not disclose operating profit for this category. Choose All revenue to see the whole gaming segment’s profit.</>}</p>
      </div>
      <div className={s.event}>
        <h3>{milestone?.title ?? `Inside FY${year}`}</h3>
        <p>{milestone?.text ?? sonyYearNotes[year]}</p>
        {(milestone?.links ?? [{ label: "Sony’s results and explanation", url: sonyYearNoteLinks[year] ?? source.url }]).map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
        <details className={s.software}><summary>Inside game revenue</summary><dl>
          <div><dt>Physical games / royalties</dt><dd>US${billions(sonyUsd(row.physical, row))}bn</dd></div>
          {row.digitalCombined !== undefined ? <><div><dt>Downloads + add-ons</dt><dd>US${billions(sonyUsd(row.digitalCombined, row))}bn</dd></div><p>The older report combines these. No separate add-on figure is inferred.</p></> : <><div><dt>Full-game downloads</dt><dd>US${billions(sonyUsd(row.digital!, row))}bn</dd></div><div><dt>Add-on content</dt><dd>US${billions(sonyUsd(row.addons!, row))}bn</dd></div></>}
          {row.otherSoftware !== undefined ? <div><dt>Off-platform software (in Other above)</dt><dd>US${billions(sonyUsd(row.otherSoftware, row))}bn</dd></div> : null}
        </dl></details>
      </div>
    </div>

    <section className={s.publishers} aria-labelledby="sony-publishers-title">
      <p className={s.kicker}>A separate measure · full-game copies sold · FY{sonyPublisherContext.year}</p>
      <h3 id="sony-publishers-title">Whose games fill the ecosystem?</h3>
      <p>Sony reports first-party titles separately by copies sold. The financial reports used here combine their revenue with other publishers’ games, so these bars show copies—not a division of the money above.</p>
      <dl className={s.unitRows}>{publisherUnits.map((units, i) => <div key={i} style={{ "--series": i === 0 ? "#d2b377" : "#79b3b2" } as CSSProperties}>
        <dt>{i === 0 ? "Sony first-party titles" : "Other publishers’ titles"}</dt>
        <dd><strong>{units.toFixed(1)}m copies</strong><span>{share(units, sonyPublisherContext.totalUnits)} of full-game copies</span></dd>
        <div className={s.unitTrack} aria-hidden="true"><span style={{ width: `${units / sonyPublisherContext.totalUnits * 100}%` }}/></div>
      </div>)}</dl>
      <p className={s.unitScope}>{sonyPublisherContext.totalUnits}m PS4/PS5 full-game copies, including bundles. Other publishers = total minus Sony’s reported first-party units. Add-ons and subscriptions are outside this count; free-to-play spending cannot be inferred from it. First-party describes Sony’s title category, not just studios it owns or every game it helps fund. <a href={sonyPublisherContext.source} target="_blank" rel="noreferrer">Figures & scope · p. 12 ↗</a></p>
      <blockquote>“most of the value of our ecosystem is driven by third-party publishers”<cite><a href={sonyPublisherContext.discussion} target="_blank" rel="noreferrer">Sony Interactive Entertainment · June 2026 investor Q&A, pp. 3–4 ↗</a></cite></blockquote>
    </section>

    <p className={s.notes}>Fiscal years end the following March; FY2025 ended March 2026. Nominal US dollars, converted from yen at each year’s average rate; not inflation-adjusted or constant currency. YoY compares those converted values. FY2016 has no preceding year in this series. The accounting basis changes between FY2019 and the restated FY2020. Release markers provide context; they do not assign a sales lift to an individual product.</p>
    <details className={s.method}><summary>Sources, definitions & exact figures</summary>
      <p>Sony’s reported Game & Network Services segment, including intersegment sales. Digital games and add-ons are recognized at the full retail transaction price, including the share paid to outside publishers. Revenue is not profit, net income or a uniform measure of gross player spending across categories. Disc royalties and product sales have different recognition bases. The chart converts Sony’s published figures to USD rather than estimating total checkout spending. Every amount within a fiscal year uses the same annual average exchange rate, including operating profit. These are our conversions, not Sony-reported USD segment results.</p>
      <p>FY2016–2019 use US GAAP; FY2020–2025 use IFRS, with FY2020 taken from the later restatement. From FY2022, some bundled software moved from hardware to physical software; Sony called the effect on earlier years immaterial. Network services has changed scope over time and includes advertising.</p>
      <p>For a consistent broad comparison, separately disclosed off-platform software in FY2023–2025 is regrouped into Other, where earlier reports included it. The table below retains the reported Game Software and Others categories. Minor rounding differences are preserved, including the ¥1m difference between FY2018’s segment-total and breakdown tables.</p>
      <p>How far back can we look? Sony’s <a href="https://www.sony.com/en/SonyInfo/IR/library/historical/" target="_blank" rel="noreferrer">company archive reaches FY1960</a>. Its <a href="https://www.sony.com/en/SonyInfo/IR/library/ar/ar_sony_1998.pdf#page=72" target="_blank" rel="noreferrer">1998 report separately identifies Game results back to FY1995</a>, the year ending March 1996. Those early totals inform the prose below. This category chart starts in FY2016: older reporting groups changed, and today’s categories cannot simply be carried backward. The historical prose retains the early totals in their original yen. All chart years use their own average JPY/USD rates, disclosed in Sony’s supplements; the table retains both the original figures and those rates. No current exchange rate is applied to earlier years.</p>
      <div className={s.sources}>{Object.values(sonySources).map(item => <a key={item.url} href={item.url} target="_blank" rel="noreferrer">{item.label} ↗</a>)}</div>
      <div className={s.tableScroll} tabIndex={0} role="region" aria-label="Exact Sony financial figures; scroll to read all columns"><table><caption>Reported figures · millions of yen · table categories before regrouping</caption><thead><tr>{["Fiscal year", "Revenue", "Operating profit", "Hardware", "Game Software", "Network", "Others", "JPY per US$1"].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{sonyHistory.map(item => <tr key={item.year}><th scope="row">FY{item.year}</th>{[item.revenue, item.profit, item.hardware, item.software, item.network, item.other].map((value, i) => <td key={i}>{millions(value)}</td>)}<td><a href={item.fxSource} target="_blank" rel="noreferrer">{item.yenPerUsd.toFixed(1)}</a></td></tr>)}</tbody></table></div>
      <p>Data checked 8 October 2026. Completed fiscal years only; no forecasts. <a href={source.url} target="_blank" rel="noreferrer">Selected year’s financial source ↗</a></p>
    </details>
  </figure>;
}
