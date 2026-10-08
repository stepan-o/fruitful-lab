"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import SonyHistory from "./SonyHistory";
import { financialCases, platformGrowth, platformHistorySources } from "@/lib/sanctuary/platform-history";
import s from "./sony-history.module.css";
import p from "./platform-history.module.css";

const usd = (value: number) => (value / 1000).toFixed(2);
const percent = (value: number | null) => value === null ? "Base year" : `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}%`;
const choices = [{ id: "sony", name: "PlayStation", detail: "Sony · console, games & services" }, { id: "xbox", name: "Xbox", detail: "Microsoft · hardware & publishing" }, { id: "nvidia", name: "NVIDIA", detail: "Graphics hardware & cloud play" }] as const;
type Company = typeof choices[number]["id"];

export default function PlatformHistory() {
  const [company, setCompany] = useState<Company>("sony");
  return <section id="playstation-history" className={p.exhibit} aria-label="Gaming business financial histories">
    <div className={p.selector} role="group" aria-label="Choose a financial case study">
      {choices.map(choice => <button key={choice.id} type="button" aria-pressed={company === choice.id} aria-controls="financial-case" onClick={() => setCompany(choice.id)}><strong>{choice.name}</strong><span>{choice.detail}</span></button>)}
    </div>
    <p className={p.comparison}>Three businesses around games. Compare their histories, not market shares: reporting scopes and fiscal calendars differ.</p>
    <div id="financial-case">{company === "sony" ? <SonyHistory/> : <FinancialCase key={company} company={company}/>}</div>
  </section>;
}

function FinancialCase({ company }: { company: "xbox" | "nvidia" }) {
  const data = financialCases[company];
  const [year, setYear] = useState(2026);
  const [mode, setMode] = useState<"revenue" | "growth">("revenue");
  const [category, setCategory] = useState<"total" | "hardware" | "content">("total");
  const scroll = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth; }, []);
  const row = data.rows.find(item => item.year === year)!;
  const growth = mode === "growth";
  const selectedGrowth = platformGrowth(data.rows, year);
  const milestone = data.milestones.find(event => event.year === year);
  const source = platformHistorySources[row.source];
  // Fixed dollar range matches Sony's all-revenue chart. Growth fits the 92% hardware launch.
  const max = growth ? 100 : 35;
  const min = growth ? -40 : 0;
  const ticks = growth ? [100, 80, 60, 40, 20, 0, -20, -40] : [35, 28, 21, 14, 7, 0];
  const y = (value: number) => (max - value) / (max - min) * 100;
  const colors = [data.color, "#79b3b2", "#d2b377"];
  const label = category === "total" ? "Total Gaming revenue" : category === "hardware" ? "Xbox hardware" : "Xbox content & services";
  const amount = (entry: typeof row) => !growth ? entry.revenue / 1000 : category === "hardware" ? entry.hardwareGrowth ?? null : category === "content" ? entry.contentGrowth ?? null : platformGrowth(data.rows, entry.year);

  function selectYear(next: number) {
    setYear(next);
    const bar = scroll.current?.querySelector<HTMLElement>(`[data-year="${next}"]`);
    if (bar && scroll.current) scroll.current.scrollLeft = bar.offsetLeft - scroll.current.clientWidth / 2 + bar.offsetWidth / 2;
  }
  return <figure className={`${s.figure} ${p.case}`} aria-labelledby={`${company}-history-title`} style={{ "--case-color": data.color } as CSSProperties}>
    <figcaption><p className={s.kicker}>{data.owner} · FY{data.rows[0].year}–FY2026</p><h2 id={`${company}-history-title`}>{data.title}<br/><em>{data.emphasis}</em></h2><p>{data.intro}</p></figcaption>
    <p className={s.accountingNote}>{data.scope}</p>
    <div className={s.views} role="group" aria-label="Chart measure">
      <button type="button" aria-pressed={!growth} onClick={() => { setMode("revenue"); setCategory("total"); }}>Revenue</button>
      <button type="button" aria-pressed={growth} onClick={() => setMode("growth")}>Year-over-year change</button>
    </div>
    <p className={s.currencyNote}>Reported US dollars · {data.period}</p>
    {growth && company === "xbox" && <div className={s.legend} role="group" aria-label="Choose an Xbox growth series">
      {(["total", "hardware", "content"] as const).map((id, i) => <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)} style={{ "--series": colors[i] } as CSSProperties}><i/>{["Total Gaming revenue", "Xbox hardware", "Xbox content & services"][i]}</button>)}
    </div>}
    <p className={s.guide}>{growth ? category === "total" ? "Change from the preceding fiscal year. The first bar is a base year; it is not zero growth." : "Reported annual category growth, available here from FY2021. Blank earlier years are not zero. These percentages describe change, not the share of revenue." : "Select a year for the figures and context. The zero-based US$35bn scale matches PlayStation’s total-revenue view."}</p>
    <div className={p.chart}>
      <div className={p.axis} aria-hidden="true">{ticks.map(tick => <span key={tick} style={{ top: `${y(tick)}%` }}>{growth ? `${tick > 0 ? "+" : ""}${tick}%` : tick ? `$${tick}bn` : "0"}</span>)}</div>
      <div className={p.scroll} ref={scroll} tabIndex={0} role="group" aria-label={`${data.name} ${growth ? label + " annual change" : "Gaming revenue history"}; scroll for all years`}>
        <div className={p.plot} style={{ "--count": data.rows.length } as CSSProperties}>
          <div className={p.grid} aria-hidden="true">{ticks.map(tick => <span key={tick} data-zero={tick === 0} style={{ top: `${y(tick)}%` }}/>)}</div>
          <div className={p.columns}>{data.rows.map(entry => {
            const value = amount(entry);
            const detail = growth ? percent(value) : `US$${usd(entry.revenue)}bn`;
            return <button key={entry.year} type="button" className={p.column} data-year={entry.year} aria-pressed={year === entry.year} aria-label={`FY${entry.year}, ended ${entry.end}: ${label} ${value === null && category !== "total" ? "not included in this series" : detail}. Show year.`} onClick={() => setYear(entry.year)}>
              <span className={p.barArea} aria-hidden="true">{value === null ? <span className={p.unavailable}>{category === "total" ? "Base year" : "No rate"}</span> : <span className={p.bar} data-negative={value < 0} style={{ top: `${y(Math.max(value, 0))}%`, height: `${Math.abs(value) / (max - min) * 100}%`, "--case-color": colors[category === "hardware" ? 1 : category === "content" ? 2 : 0] } as CSSProperties}><span className={p.barNumber} data-negative={value < 0}>{growth ? percent(value) : usd(entry.revenue)}</span></span>}</span>
              <span className={p.year}>’{String(entry.year).slice(2)}{data.milestones.some(event => event.year === entry.year) && <i/>}</span>
            </button>;
          })}</div>
        </div>
      </div>
    </div>
    <div className={s.yearControls}>
      <button type="button" aria-label="Previous fiscal year" disabled={year === data.rows[0].year} onClick={() => selectYear(year - 1)}>←</button>
      <label>Inspect <select aria-label="Fiscal year" value={year} onChange={event => selectYear(Number(event.target.value))}>{data.rows.map(entry => <option key={entry.year} value={entry.year}>FY{entry.year} · {entry.end}</option>)}</select></label>
      <button type="button" aria-label="Next fiscal year" disabled={year === 2026} onClick={() => selectYear(year + 1)}>→</button>
    </div>
    <div className={s.milestones} role="group" aria-label={`Explore ${data.name} milestones`}>{data.milestones.map(event => <button key={event.year} type="button" aria-pressed={year === event.year} onClick={() => selectYear(event.year)}><small>FY{event.year}</small>{event.label}</button>)}</div>
    <div className={s.readout} aria-live="polite" aria-atomic="true">
      <div><p className={s.kicker}>FY{year} · ended {row.end}</p><div className={s.totals}><div><small>Gaming revenue</small><strong>US${usd(row.revenue)}<span>bn</span></strong></div><div><small>Total revenue YoY</small><strong>{percent(selectedGrowth)}</strong></div></div>
        {company === "xbox" ? <><h3 className={p.subhead}>Hardware and content can move apart</h3><dl className={p.rates}><div><dt>Hardware revenue YoY</dt><dd>{row.hardwareGrowth === undefined ? "Not included" : percent(row.hardwareGrowth)}</dd></div><div><dt>Content & services revenue YoY</dt><dd>{row.contentGrowth === undefined ? "Not included" : percent(row.contentGrowth)}</dd></div></dl><p className={s.margin}>{row.hardwareGrowth === undefined ? "Category growth coverage starts in FY2021 in this exhibit." : <>Company-reported rates, rounded to whole percentages. <a href={platformHistorySources[row.growthSource ?? row.source].url} target="_blank" rel="noreferrer">Annual report ↗</a></>}</p></> : <><h3 className={p.subhead}>Inside this reported total</h3><ul className={p.products}><li>GeForce graphics processors for PCs</li><li>GeForce NOW cloud gaming</li><li>Console chips and development services</li></ul><p className={s.margin}>Product families, not proportional shares. The report does not split their revenue.</p></>}
        <p className={p.disclosure}>{data.missing}</p>
      </div>
      <div className={s.event}><h3>{milestone?.title ?? `Inside FY${year}`}</h3><p>{milestone?.text ?? `Reported Gaming revenue ${selectedGrowth === null ? "provides the starting point for this series" : `${selectedGrowth >= 0 ? "rose" : "fell"} ${Math.abs(selectedGrowth).toFixed(1)}% from the previous year`}. The annual report below records the company's explanation and the wider business context.`}</p><a href={platformHistorySources[milestone?.source ?? row.source].url} target="_blank" rel="noreferrer">{milestone ? "Results and explanation" : source.label} ↗</a></div>
    </div>
    <p className={s.notes}>Revenue is not profit or total player spending. These companies sell at different points in the supply chain; adding their totals would double-count some economic activity. Nominal USD, not adjusted for inflation. {company === "xbox" ? "Acquisitions change the scope of the series; growth is not adjusted to remove them." : "Gaming is an end-market disclosure, not NVIDIA’s Graphics reporting segment or its total company revenue."}</p>
    <details className={s.method}><summary>Sources, definitions & exact figures</summary>
      <p>{company === "xbox" ? "Annual Gaming revenue (renamed Xbox in FY2026), reported under More Personal Computing. Content and services combine first- and third-party games, in-game content, subscriptions, cloud gaming, advertising and royalties. The wider segment’s operating profit is not Xbox profit. No category revenue amounts are reverse-engineered from rounded growth rates." : "Annual Gaming end-market revenue, reported in US dollars. GeForce NOW is included but has no separate revenue series. Graphics-segment profit covers a broader collection of products and is intentionally omitted."}</p>
      <div className={s.tableScroll} tabIndex={0} role="region" aria-label={`Exact ${data.name} financial figures`}><table><caption>Reported US$ millions · total Gaming revenue</caption><thead><tr><th scope="col">Fiscal year</th><th scope="col">Year ended</th><th scope="col">Revenue</th><th scope="col">Source</th></tr></thead><tbody>{data.rows.map(entry => <tr key={entry.year}><th scope="row">FY{entry.year}</th><td>{entry.end}</td><td>{entry.revenue.toLocaleString("en-US")}</td><td><a href={platformHistorySources[entry.source].url} target="_blank" rel="noreferrer">Report ↗</a></td></tr>)}</tbody></table></div>
      <p>Checked 8 October 2026. Completed fiscal years only. Total growth is calculated from the exact revenue figures; category growth uses Microsoft’s reported percentages.</p>
    </details>
  </figure>;
}
