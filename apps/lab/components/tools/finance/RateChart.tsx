"use client";
import { useId, useState } from "react";
import type { Analysis } from "@/lib/tools/finance/engine";
import type { Observation } from "@/lib/tools/finance/types";
import styles from "./finance.module.css";

export function RateChart({ observations, analysis, count = 252 }: { observations: Observation[]; analysis: Analysis; count?: number }) {
  const id = useId();
  const [inspected, setInspected] = useState(100);
  const rows = observations.slice(-count);
  const point = rows[Math.round((rows.length - 1) * inspected / 100)];
  const start = Date.parse(rows[0].date);
  const end = Math.max(Date.parse(analysis.deadline), Date.parse(analysis.last.date) + 86400000);
  const min = Math.min(...rows.map(r => r.mxnPerCad), analysis.low) * .99;
  const max = Math.max(...rows.map(r => r.mxnPerCad), analysis.high, analysis.challenger) * 1.01;
  const x = (date: string) => 55 + (Date.parse(date) - start) / (end - start) * 725;
  const y = (rate: number) => 230 - (rate - min) / (max - min) * 210;
  const path = rows.map((r, i) => `${i ? "L" : "M"}${x(r.date).toFixed(2)},${y(r.mxnPerCad).toFixed(2)}`).join(" ");
  const lastX = x(analysis.last.date);
  const endX = x(analysis.deadline);
  const fan = Array.from({ length: 21 }, (_, i) => {
    const t = i / 20;
    const width = Math.log(analysis.high / analysis.middle) * Math.sqrt(t);
    return { x: lastX + (endX - lastX) * t, low: y(analysis.middle * Math.exp(-width)), high: y(analysis.middle * Math.exp(width)) };
  });
  const band = [...fan.map(p => `${p.x},${p.high}`), ...fan.slice().reverse().map(p => `${p.x},${p.low}`)].join(" ");
  return <figure className={styles.figure}>
    <div className={styles.legend}><span><i className={styles.historyKey} />Observed daily rate</span><span><i className={styles.bandKey} />Model’s central 80% range</span><span><i className={styles.trendKey} />Trend challenger</span></div>
    <svg viewBox="0 0 810 272" role="img" aria-labelledby={`${id}-title ${id}-desc`} className={styles.chart}>
      <title id={`${id}-title`}>CAD to MXN exchange-rate history and forecast scenarios</title>
      <desc id={`${id}-desc`}>More pesos per Canadian dollar is better for this exchange. Latest reference {analysis.middle.toFixed(4)}. Modeled range at the horizon {analysis.low.toFixed(4)} to {analysis.high.toFixed(4)}. The no-change forecast stays at the latest rate.</desc>
      {[0, 1, 2, 3, 4].map(i => { const rate = min + (max - min) * i / 4; return <g key={i}><line x1="55" x2="780" y1={y(rate)} y2={y(rate)} stroke="#e4e9e4" /><text x="44" y={y(rate) + 4} textAnchor="end">{rate.toFixed(2)}</text></g>; })}
      <polygon points={band} fill="#dcebe4" />
      <path d={path} fill="none" stroke="#226a5a" strokeWidth="2.4" strokeLinejoin="round" />
      <line x1={lastX} x2={endX} y1={y(analysis.middle)} y2={y(analysis.middle)} stroke="#226a5a" strokeWidth="2" strokeDasharray="5 5" />
      <line x1={lastX} x2={endX} y1={y(analysis.middle)} y2={y(analysis.challenger)} stroke="#a37630" strokeWidth="1.7" strokeDasharray="3 5" />
      <line x1={lastX} x2={lastX} y1="20" y2="232" stroke="#889b91" strokeDasharray="3 6" />
      <circle cx={x(point.date)} cy={y(point.mxnPerCad)} r="4.5" fill="#163b32" stroke="white" strokeWidth="2" />
      <text x="55" y="256">{rows[0].date}</text><text x="780" y="256" textAnchor="end">{analysis.deadline}</text>
    </svg>
    <div className={styles.inspector}><label htmlFor={`${id}-range`}>Inspect history</label><input id={`${id}-range`} type="range" min="0" max="100" value={inspected} onChange={e => setInspected(Number(e.target.value))} /><output>{point.date} · <b>{point.mxnPerCad.toFixed(4)}</b> MXN/CAD</output></div>
    <figcaption>Bank of Canada daily reference rates. Calendar spacing preserves weekends. Shading is a model estimate, not a guaranteed range; 10% of modeled outcomes lie below it and 10% above. Holidays are approximated as weekdays.</figcaption>
  </figure>;
}
