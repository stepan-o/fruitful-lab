"use client";

import { useRef, useState, type CSSProperties } from "react";
import { sonyCategories, sonyHistory, sonyMilestones, sonyMix, sonySources, sonyYearNoteLinks, sonyYearNotes } from "@/lib/sanctuary/sony-history";
import s from "./sony-history.module.css";

const billions = (n: number) => (n / 1000).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const millions = (n: number) => n.toLocaleString("en-US");
const share = (n: number, total: number) => `${(100 * n / total).toFixed(1)}%`;
const revenueMax = 5_000_000;
const profitMax = 500_000;

export default function SonyHistory() {
  const [year, setYear] = useState(2020);
  const [category, setCategory] = useState<number | null>(null);
  const scroll = useRef<HTMLDivElement>(null);
  const row = sonyHistory.find(item => item.year === year)!;
  const values = sonyMix(row);
  const milestone = sonyMilestones.find(item => item.year === year);
  const source = sonySources[row.source];

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

    <div className={s.legend} role="group" aria-label="Highlight a revenue category">
      {sonyCategories.map((item, i) => <button key={item.label} type="button" aria-pressed={category === i} onClick={() => setCategory(category === i ? null : i)} style={{ "--series": item.color } as CSSProperties}><i/>{item.label}</button>)}
    </div>
    <p className={s.guide}>{category === null ? "Select a year to inspect its earnings and the events around it. Select a category to trace it across the decade." : sonyCategories[category].note}</p>
    <p className={s.mobileHint}>Swipe the charts to see all ten years →</p>

    <div className={s.chartFrame}>
    <div className={s.fixedAxes} aria-hidden="true">
      <div className={s.plotTitle}>Sales revenue <span>trillions of yen</span></div>
      {[5, 4, 3, 2, 1, 0].map(n => <b key={n} style={{ top: 34 + (1 - n / 5) * 202 }}>{n === 0 ? "0" : `¥${n}tn`}</b>)}
      <div className={s.profitTitle}>Operating profit <span>billions of yen · separate scale</span></div>
      {[500, 250, 0].map(n => <b key={`profit-${n}`} style={{ top: 293 + (1 - n / 500) * 65 }}>{n === 0 ? "0" : `¥${n}bn`}</b>)}
    </div>
    <div className={s.scroll} ref={scroll} tabIndex={0} role="group" aria-label="Ten years of PlayStation revenue and operating profit; horizontally scrollable on narrow screens">
      <div className={s.plot}>
        <div className={s.plotTitle}>Sales revenue <span>trillions of yen</span></div>
        <div className={s.revenueGrid} aria-hidden="true">{[5, 4, 3, 2, 1, 0].map(n => <span key={n} style={{ top: `${100 - n / 5 * 100}%` }}><b>{n === 0 ? "0" : `¥${n}tn`}</b></span>)}</div>
        <div className={s.profitTitle}>Operating profit <span>billions of yen · separate scale</span></div>
        <div className={s.profitGrid} aria-hidden="true">{[500, 250, 0].map(n => <span key={n} style={{ top: `${100 - n / 500 * 100}%` }}><b>{n === 0 ? "0" : `¥${n}bn`}</b></span>)}</div>
        <div className={s.columns}>
          {sonyHistory.map(item => <button type="button" key={item.year} data-year={item.year} aria-pressed={year === item.year} onClick={() => setYear(item.year)} className={s.column} aria-label={`FY${item.year}: revenue ${billions(item.revenue)} billion yen; operating profit ${billions(item.profit)} billion yen. Show year.`}>
            <span className={s.stackArea} aria-hidden="true"><span className={s.stack} style={{ height: `${item.revenue / revenueMax * 100}%` }}>{sonyMix(item).map((value, i) => <span key={sonyCategories[i].label} className={s.segment} data-muted={category !== null && category !== i} style={{ height: `${value / item.revenue * 100}%`, "--series": sonyCategories[i].color } as CSSProperties}/>)}</span></span>
            <span className={s.profitArea} aria-hidden="true"><span style={{ height: `${item.profit / profitMax * 100}%` }}/></span>
            <span className={s.year}>’{String(item.year).slice(2)}{sonyMilestones.some(event => event.year === item.year) ? <i aria-hidden="true"/> : null}</span>
          </button>)}
        </div>
        <div className={s.accounting} aria-hidden="true"><span>US GAAP</span><span>IFRS · FY2020 restated</span></div>
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
        <div className={s.totals}><div><small>Sales revenue</small><strong>¥{billions(row.revenue)}<span>bn</span></strong></div><div><small>Operating profit</small><strong>¥{billions(row.profit)}<span>bn</span></strong></div></div>
        <dl className={s.mix}>{sonyCategories.map((item, i) => <div key={item.label} style={{ "--series": item.color } as CSSProperties}><dt><i/>{item.label}</dt><dd>¥{billions(values[i])}bn <span>{share(values[i], row.revenue)}</span></dd></div>)}</dl>
        <p className={s.margin}>Operating margin: <strong>{share(row.profit, row.revenue)}</strong>. Profit is for the whole gaming segment; Sony does not provide a matching profit split by these categories.</p>
      </div>
      <div className={s.event}>
        <h3>{milestone?.title ?? `Inside FY${year}`}</h3>
        <p>{milestone?.text ?? sonyYearNotes[year]}</p>
        {(milestone?.links ?? [{ label: "Sony’s results and explanation", url: sonyYearNoteLinks[year] ?? source.url }]).map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
        <details className={s.software}><summary>Inside game revenue</summary><dl>
          <div><dt>Physical games / royalties</dt><dd>¥{billions(row.physical)}bn</dd></div>
          {row.digitalCombined !== undefined ? <><div><dt>Downloads + add-ons</dt><dd>¥{billions(row.digitalCombined)}bn</dd></div><p>The older report combines these. No separate add-on figure is inferred.</p></> : <><div><dt>Full-game downloads</dt><dd>¥{billions(row.digital!)}bn</dd></div><div><dt>Add-on content</dt><dd>¥{billions(row.addons!)}bn</dd></div></>}
          {row.otherSoftware !== undefined ? <div><dt>Off-platform software (in Other above)</dt><dd>¥{billions(row.otherSoftware)}bn</dd></div> : null}
        </dl></details>
      </div>
    </div>

    <p className={s.notes}>Fiscal years end the following March; FY2025 ended March 2026. Nominal yen, including exchange-rate effects. The accounting basis changes between FY2019 and the restated FY2020. Release markers provide context; they do not assign a sales lift to an individual product.</p>
    <details className={s.method}><summary>Sources, definitions & exact figures</summary>
      <p>Sony’s reported Game & Network Services segment, including intersegment sales. Revenue is not profit, net income or gross player spending. Disc royalties and product sales have different recognition bases. The chart preserves Sony’s published figures rather than estimating total checkout spending.</p>
      <p>FY2016–2019 use US GAAP; FY2020–2025 use IFRS, with FY2020 taken from the later restatement. From FY2022, some bundled software moved from hardware to physical software; Sony called the effect on earlier years immaterial. Network services has changed scope over time and includes advertising.</p>
      <p>For a consistent broad comparison, separately disclosed off-platform software in FY2023–2025 is regrouped into Other, where earlier reports included it. The table below retains the reported Game Software and Others categories. Minor rounding differences are preserved, including the ¥1m difference between FY2018’s segment-total and breakdown tables.</p>
      <div className={s.sources}>{Object.values(sonySources).map(item => <a key={item.url} href={item.url} target="_blank" rel="noreferrer">{item.label} ↗</a>)}</div>
      <div className={s.tableScroll} tabIndex={0} role="region" aria-label="Exact Sony financial figures; scroll to read all columns"><table><caption>Reported figures · millions of yen · table categories before regrouping</caption><thead><tr>{["Fiscal year", "Revenue", "Operating profit", "Hardware", "Game Software", "Network", "Others"].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{sonyHistory.map(item => <tr key={item.year}><th scope="row">FY{item.year}</th>{[item.revenue, item.profit, item.hardware, item.software, item.network, item.other].map((value, i) => <td key={i}>{millions(value)}</td>)}</tr>)}</tbody></table></div>
      <p>Data checked 8 October 2026. Completed fiscal years only; no forecasts. <a href={source.url} target="_blank" rel="noreferrer">Selected year’s financial source ↗</a></p>
    </details>
  </figure>;
}
