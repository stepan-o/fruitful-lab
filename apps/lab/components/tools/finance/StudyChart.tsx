"use client";

import { useId } from "react";
import styles from "./methodology.module.css";

export type StudyLine = { name: string; color: string; dash?: string; points: { x: number; y: number }[] };
export type StudyMark = { x: number; y: number; label: string; shape: "circle" | "square"; color: string };
export default function StudyChart({ title, unit, lines, xLabel, marks = [], zero = false, boundary, band }: {
  title: string; unit: string; lines: StudyLine[]; xLabel: (x: number) => string; marks?: StudyMark[]; zero?: boolean;
  boundary?: number; band?: { x: number; low: number; high: number }[];
}) {
  const id = useId();
  const points = lines.flatMap(l => l.points);
  if (!points.length) return <p>No observations in this window.</p>;
  const xs = [...points.map(p => p.x), ...(band?.map(p => p.x) ?? [])], ys = [...points.map(p => p.y), ...marks.map(p => p.y), ...(band?.flatMap(p => [p.low, p.high]) ?? [])];
  const xmin = Math.min(...xs), xmax = Math.max(...xs), low = Math.min(...ys, ...(zero ? [0] : [])), high = Math.max(...ys, ...(zero ? [0] : []));
  const pad = (high - low || Math.abs(high) || 1) * .08, ymin = low - pad, ymax = high + pad;
  const x = (v: number) => 66 + (v - xmin) / (xmax - xmin || 1) * 682;
  const y = (v: number) => 244 - (v - ymin) / (ymax - ymin) * 210;
  const path = (ps: { x: number; y: number }[]) => ps.map((p, i) => `${i ? "L" : "M"}${x(p.x).toFixed(2)},${y(p.y).toFixed(2)}`).join(" ");
  return <figure className={styles.figure}>
    <div className={styles.legend}>{lines.map(line => <span key={line.name}><svg width="25" height="12" aria-hidden="true"><line x1="0" x2="25" y1="6" y2="6" stroke={line.color} strokeWidth="2" strokeDasharray={line.dash} /></svg>{line.name}</span>)}{band && <span>Shaded: nominal 80% baseline interval</span>}</div>
    <div className={styles.chartScroll} tabIndex={0} role="region" aria-label={`${title}; scroll horizontally on small screens`}>
      <svg viewBox="0 0 780 290" role="img" aria-labelledby={`${id}-title ${id}-desc`} className={styles.chart}>
        <title id={`${id}-title`}>{title}</title><desc id={`${id}-desc`}>Vertical axis: {unit}. Horizontal axis from {xLabel(xmin)} to {xLabel(xmax)}. Each series uses the same axes. Focused vertical scale; exact values are available below the chart.</desc>
        <text x="66" y="17">{unit}</text>
        {[0, 1, 2, 3].map(i => { const value = ymin + (ymax - ymin) * i / 3; return <g key={i}><line x1="66" x2="748" y1={y(value)} y2={y(value)} stroke="#e2e8de" /><text x="57" y={y(value) + 4} textAnchor="end">{value.toFixed(Math.abs(value) < 1 ? 2 : 1)}</text></g>; })}
        <path d="M66,34V244H748" fill="none" stroke="#89998f" />
        {zero && <line x1="66" x2="748" y1={y(0)} y2={y(0)} stroke="#89998f" />}
        {band && <path d={`${path(band.map(p => ({ x: p.x, y: p.low })))} ${band.slice().reverse().map(p => `L${x(p.x)},${y(p.high)}`).join(" ")} Z`} fill="#dcebe4" />}
        {boundary !== undefined && <line x1={x(boundary)} x2={x(boundary)} y1="34" y2="244" stroke="#89998f" strokeDasharray="4 4" />}
        {lines.map(line => <path key={line.name} d={path(line.points)} fill="none" stroke={line.color} strokeWidth="2" strokeDasharray={line.dash} />)}
        {marks.map((m, i) => <g key={i}><title>{m.label}</title>{m.shape === "circle" ? <circle cx={x(m.x)} cy={y(m.y)} r="4" fill="#fffefa" stroke={m.color} strokeWidth="2" /> : <rect x={x(m.x) - 4} y={y(m.y) - 4} width="8" height="8" fill={m.color} />}</g>)}
        {[0, .5, 1].map((fraction, i) => <text key={i} x={66 + 682 * fraction} y="269" textAnchor={i === 0 ? "start" : i === 2 ? "end" : "middle"}>{xLabel(xmin + (xmax - xmin) * fraction)}</text>)}
      </svg>
    </div>
    <figcaption className={styles.mobileHint}>Swipe or scroll the chart horizontally. Exact values are available below.</figcaption>
  </figure>;
}
