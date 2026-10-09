"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { type SonyYear, sonyAccountingSource, sonyComposition, sonyGrowth, sonyGrowthView, sonyUsd, sonyChartAnnotations, sonyCategories, sonyHistory, sonyRevenueView, sonyMilestones, sonyMix, sonySources, sonyYearNoteLinks, sonyYearNotes } from "@/lib/sanctuary/sony-history";
import s from "./sony-history.module.css";

const billions = (n: number) => (n / 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const millions = (n: number) => n.toLocaleString("en-US");
const share = (n: number, total: number) => `${(100 * n / total).toFixed(1)}%`;
const growthLabel = (value: number | null) => value === null ? "Base year" : `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}%`;
const ppLabel = (value: number | null) => {
  if (value === null) return "—";
  const rounded = Number(value.toFixed(1));
  return `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${Math.abs(rounded).toFixed(1)} pp`;
};
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

  function selectYear(value: number) {
    setYear(value);
    // Move only this chart's viewport, never the surrounding reading position.
    const element = scroll.current?.querySelector<HTMLElement>(`[data-year="${value}"]`);
    if (element && scroll.current) {
      scroll.current.scrollLeft = element.offsetLeft - scroll.current.clientWidth / 2 + element.offsetWidth / 2;
    }
  }

  return <figure className={s.figure} aria-labelledby="sony-history-title">
    <figcaption>
      <p className={s.kicker}>Sony · Game & Network Services · FY2016–FY2025</p>
      <h2 id="sony-history-title">The console is<br/><em>only the first sale.</em></h2>
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
        <SonyRevenueMix key={year} row={row} category={category} growth={growth}/>
        <p className={s.fxNote}><a href={row.fxSource} target="_blank" rel="noreferrer">FY{year} average: ¥{row.yenPerUsd.toFixed(1)} per US$1 ↗</a>{growth && " · Change compares each year at its own average rate; this is not constant-currency growth."}</p>
        <p className={s.margin}>{category === null ? <>Operating margin: <strong>{share(row.profit, row.revenue)}</strong>. Profit is for the whole gaming segment; Sony does not provide a matching profit split by these categories.</> : <>Sony does not disclose operating profit for this category. Choose All revenue to see the whole gaming segment’s profit.</>}</p>
      </div>
      <div className={s.event}>
        <h3>{milestone?.title ?? `Inside FY${year}`}</h3>
        <p>{milestone?.text ?? sonyYearNotes[year]}</p>
        {(milestone?.links ?? [{ label: "Sony’s results and explanation", url: sonyYearNoteLinks[year] ?? source.url }]).map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}
        <details className={s.software}><summary>Inside game revenue</summary><p>Add-on content includes expansions, cosmetic items and virtual currency bought for a game, beyond the full-game purchase.</p><dl>
          <div><dt>Physical games / royalties</dt><dd>US${billions(sonyUsd(row.physical, row))}bn</dd></div>
          {row.digitalCombined !== undefined ? <><div><dt>Downloads + add-ons</dt><dd>US${billions(sonyUsd(row.digitalCombined, row))}bn</dd></div><p>The older report combines these. No separate add-on figure is inferred.</p></> : <><div><dt>Full-game downloads</dt><dd>US${billions(sonyUsd(row.digital!, row))}bn</dd></div><div><dt>Add-on content</dt><dd>US${billions(sonyUsd(row.addons!, row))}bn</dd></div></>}
          {row.otherSoftware !== undefined ? <div><dt>Off-platform software (in Other above)</dt><dd>US${billions(sonyUsd(row.otherSoftware, row))}bn</dd></div> : null}
        </dl></details>
      </div>
    </div>

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


function SonyRevenueMix({ row, category, growth }: { row: SonyYear; category: number | null; growth: boolean }) {
  const composition = sonyComposition(row);
  const values = sonyMix(row);
  const previous = sonyHistory.find(item => item.year === row.year - 1);
  const previousValues = previous ? sonyMix(previous) : null;
  const [active, setActive] = useState<{ index: number; anchor: DOMRect } | null>(null);
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
  const root = useRef<HTMLElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const delay = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pinned = useRef(false);
  const tooltipId = useId();

  function keepOpen() {
    if (delay.current) clearTimeout(delay.current);
  }
  function close() {
    keepOpen();
    pinned.current = false;
    setActive(null);
    setPosition(null);
  }
  function inspect(index: number, anchor: HTMLElement, pin = false) {
    keepOpen();
    if (pinned.current && !pin) return;
    pinned.current = pin;
    setPosition(null);
    setActive({ index, anchor: anchor.getBoundingClientRect() });
  }
  function leave() {
    keepOpen();
    if (!pinned.current) delay.current = setTimeout(close, 120);
  }
  function toggle(index: number, anchor: HTMLElement) {
    if (pinned.current && active?.index === index) close();
    else inspect(index, anchor, true);
  }

  useEffect(() => () => { if (delay.current) clearTimeout(delay.current); }, []);
  useEffect(() => {
    if (!active) return;
    const dismiss = () => {
      if (delay.current) clearTimeout(delay.current);
      pinned.current = false;
      setActive(null);
      setPosition(null);
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target) && !popup.current?.contains(event.target)) dismiss();
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    window.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", escape);
    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    return () => {
      window.removeEventListener("pointerdown", outside);
      window.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
    };
  }, [active]);
  useLayoutEffect(() => {
    if (!active || !popup.current) return;
    const rect = popup.current.getBoundingClientRect();
    const margin = 12;
    let left = active.anchor.right + margin;
    let top = active.anchor.top + active.anchor.height / 2 - rect.height / 2;
    if (left + rect.width > window.innerWidth - margin) {
      left = active.anchor.left - rect.width - margin;
      if (left < margin) {
        left = margin;
        top = active.anchor.bottom + margin;
        if (top + rect.height > window.innerHeight - margin) top = active.anchor.top - rect.height - margin;
      }
    }
    setPosition({ left: Math.max(margin, Math.min(left, window.innerWidth - rect.width - margin)), top: Math.max(margin, Math.min(top, window.innerHeight - rect.height - margin)) });
  }, [active]);

  const highlighted = active?.index ?? category;
  const detail = active ? composition[active.index] : null;
  return <section ref={root} className={s.composition} aria-label={`FY${row.year} revenue proportions`} onPointerLeave={leave}>
    <p className={s.mixHeading}>Share of total revenue</p>
    <div className={s.mixKey}>{previous && <span><i className={s.dashedKey}/>FY{previous.year}</span>}<span><i className={s.solidKey}/>FY{row.year}</span></div>
    <p className={s.mixHint}>Hover or tap a segment or category to inspect.</p>
    <div className={s.mixBody}>
      <div className={s.mixVisual} role="img" aria-label={`100% stacked revenue bar for FY${row.year}${previous ? `, with dashed FY${previous.year} proportions` : ""}. Read top to bottom, matching the category list.`}>
        {previous && <div className={s.shareTrack} data-period="previous" aria-hidden="true">
          {composition.map((item, i) => <span key={sonyCategories[i].label} className={s.shareGhost} data-category={i} data-active={highlighted === i}
            onPointerEnter={event => { if (event.pointerType !== "touch") inspect(i, event.currentTarget); }} onClick={event => toggle(i, event.currentTarget)}
            style={{ top: `${composition.slice(0, i).reduce((sum, entry) => sum + entry.previousPercent!, 0)}%`, height: `${item.previousPercent}%`, "--series": sonyCategories[i].color } as CSSProperties}/>)}
        </div>}
        <div className={s.shareTrack} data-period="current" aria-hidden="true">
          {composition.map((item, i) => <span key={sonyCategories[i].label} className={s.shareFill} data-category={i} data-active={highlighted === i} data-muted={highlighted !== null && highlighted !== i}
            onPointerEnter={event => { if (event.pointerType !== "touch") inspect(i, event.currentTarget); }} onClick={event => toggle(i, event.currentTarget)}
            style={{ top: `${composition.slice(0, i).reduce((sum, entry) => sum + entry.percent, 0)}%`, height: `${item.percent}%`, "--series": sonyCategories[i].color } as CSSProperties}><span>{item.percent.toFixed(1)}%</span></span>)}
        </div>
      </div>
      <ul className={s.mixBreakdown}>{sonyCategories.map((item, i) => <li key={item.label} style={{ "--series": item.color } as CSSProperties}>
        <button type="button" className={s.mixCategory} data-active={highlighted === i} aria-label={`Inspect ${item.label} revenue share`} aria-describedby={active?.index === i ? tooltipId : undefined}
          onPointerEnter={event => { if (event.pointerType !== "touch") inspect(i, event.currentTarget); }}
          onFocus={event => { pinned.current = false; inspect(i, event.currentTarget); }} onBlur={close} onClick={event => toggle(i, event.currentTarget)}>
          <span className={s.mixName}><i/>{item.label}</span>
          <span className={s.mixAmount}>US${billions(sonyUsd(values[i], row))}bn{growth && <small>Revenue YoY: {growthLabel(sonyGrowth(row, i))}</small>}</span>
          <span className={s.mixShare}><strong>{composition[i].percent.toFixed(1)}%</strong> <span className={s.mixShift}>({ppLabel(composition[i].shift)})</span>{previous && <small>was {composition[i].previousPercent!.toFixed(1)}%</small>}</span>
        </button>
      </li>)}</ul>
    </div>
    <p className={s.mixNote}>{previous ? `Solid: FY${row.year}. Dashed: FY${previous.year}. Brackets show the change in share, in percentage points (pp).` : "First year in this series; prior-year proportions and changes are unavailable."}</p>
    {active && detail && createPortal(<div ref={popup} id={tooltipId} role="tooltip" className={s.mixTooltip} onPointerEnter={keepOpen} onPointerLeave={leave}
      style={{ left: position?.left ?? 0, top: position?.top ?? 0, visibility: position ? "visible" : "hidden", "--series": sonyCategories[active.index].color } as CSSProperties}>
      <p className={s.tooltipKicker}>FY{row.year} · Revenue mix</p>
      <h4><i/>{sonyCategories[active.index].label}</h4>
      <div className={s.tooltipValue}><strong>{detail.percent.toFixed(1)}%</strong><span>of gaming revenue</span></div>
      <p className={s.tooltipAmount}>US${billions(sonyUsd(values[active.index], row))}bn <span>of US${billions(sonyUsd(row.revenue, row))}bn</span></p>
      {previous && previousValues ? <><div className={s.tooltipPrevious}><span><i/>FY{previous.year}</span><strong>{detail.previousPercent!.toFixed(1)}%</strong><span>US${billions(sonyUsd(previousValues[active.index], previous))}bn</span></div>
        <p className={s.tooltipChange}><strong>{ppLabel(detail.shift)}</strong><span>change in revenue share</span></p></> : <p className={s.tooltipFoot}>No previous year in this series.</p>}
      <p className={s.tooltipFoot}>Share changes use unrounded values. Esc or tap outside to close.</p>
    </div>, document.body)}
  </section>;
}
