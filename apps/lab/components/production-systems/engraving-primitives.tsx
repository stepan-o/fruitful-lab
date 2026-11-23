import type { ReactNode } from "react";
import styles from "./engravings.module.css";

export const tones = { ink: "#443c31", paper: "#f4f2eb", ivory: "#e7dcc1", wood: "#94775b", edge: "#68483a", dark: "#352d27", brass: "#ac8c50", sage: "#8c9580" };
export const round = (n: number) => Math.round(n * 100) / 100;

/** Deterministic, batched strokes: detailed engraving without hundreds of DOM nodes. */
export function Hatch({ d, id, gap = 4, cross = false, light = false }: { d: string; id: string; gap?: number; cross?: boolean; light?: boolean }) {
  const lines = Array.from({ length: Math.ceil(1200 / gap) }, (_, i) => `M${i * gap - 600} 0l600 600`).join("");
  return <g><defs><clipPath id={id}><path d={d} /></clipPath></defs><g clipPath={`url(#${id})`} fill="none" stroke={light ? tones.ivory : tones.ink} strokeWidth=".65" opacity={light ? .3 : .35}><path d={lines} />{cross && <path d={lines} transform="translate(600 0) scale(-1 1)" />}</g></g>;
}

export function Grain({ x, y, w, h, light = false }: { x: number; y: number; w: number; h: number; light?: boolean }) {
  const path = Array.from({ length: Math.floor(h / 2) }, (_, i) => {
    const yy = y + i * 2 + 1, bow = ((i * 7) % 11) - 5;
    return `M${x} ${yy}q${w * .26} ${bow} ${w * .51} 0t${w * .49} 0`;
  }).join("");
  return <path d={path} stroke={light ? tones.ivory : tones.ink} strokeWidth=".55" opacity=".3" fill="none" />;
}

export function Screw({ x, y, r = 2.5 }: { x: number; y: number; r?: number }) {
  return <g transform={`translate(${x} ${y})`} stroke={tones.ink} strokeWidth=".8"><circle r={r} fill={tones.brass} /><path d={`M${-r * .65} ${r * .65}l${r * 1.3} ${-r * 1.3}`} /></g>;
}

export function Wheel({ x, y, r, reverse = false, spokes = 8 }: { x: number; y: number; r: number; reverse?: boolean; spokes?: number }) {
  const teeth = Array.from({ length: 32 }, (_, i) => {
    const a = i * Math.PI / 16, b = a + .08;
    return `M${round(Math.cos(a) * (r - 2))} ${round(Math.sin(a) * (r - 2))}L${round(Math.cos(a) * (r + 2))} ${round(Math.sin(a) * (r + 2))}L${round(Math.cos(b) * (r + 2))} ${round(Math.sin(b) * (r + 2))}`;
  }).join("");
  return <g transform={`translate(${x} ${y})`}>
    <circle cy="2" r={r + 3} fill={tones.dark} opacity=".22" />
    <g className={reverse ? styles.wheelReverse : styles.wheel} fill="none" stroke={tones.ink} strokeWidth="1">
      <circle r={r} fill={tones.brass} /><path d={teeth} /><circle r={r - 4} fill={tones.dark} /><circle r={r - 7} stroke={tones.ivory} strokeWidth=".6" />
      {Array.from({ length: spokes }, (_, i) => <path key={i} transform={`rotate(${i * 360 / spokes})`} d={`M-2 -6l-1 ${-r + 14}h6L2 -6Z`} fill={tones.wood} stroke={tones.brass} strokeWidth=".7" />)}
      <circle r="6" fill={tones.ivory} /><circle r="2" fill={tones.ink} />
    </g>
  </g>;
}

export function Frame({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return <g>
    <rect x={x} y={y} width={w} height={h} fill={tones.wood} stroke={tones.ink} strokeWidth="1.6" />
    <Grain x={x + 3} y={y + 2} w={w - 6} h={h - 4} />
    <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill={tones.dark} stroke={tones.ink} strokeWidth="1.4" />
    <path d={`M${x + 5} ${y + h - 4}V${y + 5}H${x + w - 5}M${x + 12} ${y + h - 12}H${x + w - 12}V${y + 12}`} stroke={tones.ivory} opacity=".5" fill="none" />
    {children}
    {[[x + 5,y + 5],[x + w - 5,y + 5],[x + 5,y + h - 5],[x + w - 5,y + h - 5]].map(([a,b],i)=><Screw key={i} x={a} y={b} r={1.8} />)}
  </g>;
}

export function Candle({ x, y, id, scale = 1 }: { x: number; y: number; id: string; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <defs><radialGradient id={id}><stop stopColor="#ebc879" stopOpacity=".27" /><stop offset="1" stopColor="#ebc879" stopOpacity="0" /></radialGradient></defs>
    <ellipse className={styles.glow} cy="-53" rx="128" ry="148" fill={`url(#${id})`} />
    <g stroke={tones.ink} strokeWidth="1.2"><ellipse cy="2" rx="20" ry="5" fill={tones.brass} /><path d="M-14 0Q-4-4-4-14V-19H4V-14Q4-4 14 0Z" fill={tones.brass} /><ellipse cy="-20" rx="11" ry="3" fill={tones.ivory} /><path d="M-5-20V-57Q0-61 5-57V-20Z" fill={tones.ivory} /><path d="M-3-53v15q3 5 3-1v-14M3-50v19" fill="none" stroke="#b09a68" /><path d="M0-57v-6" /></g>
    <g className={styles.flame}><path d="M0-62C-10-70-2-78 1-84C0-74 10-69 0-62Z" fill="#dca04d" /><path d="M0-63C-4-67-1-71 1-75C5-68 3-65 0-63Z" fill="#fff4c8" /></g>
  </g>;
}

export function Floor({ id }: { id: string }) {
  const d = "M45 346 424 306 577 351 195 402Z";
  return <g><path d={d} fill="#c5b796" opacity=".16" /><Hatch d={d} id={`${id}-floor`} gap={7} /><path d="M51 348 195 392 562 351" stroke={tones.wood} strokeWidth=".6" fill="none" opacity=".6" /></g>;
}

export function Piece({ x, y, scale = 1, kind = "pawn", dark = false }: { x: number; y: number; scale?: number; kind?: "pawn" | "knight" | "king"; dark?: boolean }) {
  const fill = dark ? "#71604b" : tones.ivory, stroke = tones.ink;
  return <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={stroke} strokeWidth="1.15" strokeLinejoin="round">
    <ellipse cy="2" rx="19" ry="6" fill={tones.dark} opacity=".18" stroke="none" />
    <path d="M-18 0V-5Q-17-9-11-10L-7-19H7L11-10Q17-9 18-5V0Q0 6-18 0Z" fill={fill} />
    {kind === "knight" ? <><path d="M-10-17Q-3-26-7-34L-18-33L-21-40L-13-52L-13-64L-5-59L2-63Q21-49 13-19Z" fill={fill} /><path d="M-4-55Q10-47 7-30M-15-44l5-4M-18-38h7M-9-29l12-8" fill="none" /><circle cx="-7" cy="-50" r="1.6" fill={stroke} /><path d="M2-57l7 4m-6 1 8 4m-7 1 8 4m-7 1 7 4m-7 1 7 3" strokeWidth=".6" /></> : kind === "king" ? <><path d="M-7-19Q-2-31-9-41L-12-50H12L9-41Q2-31 7-19Z" fill={fill} /><path d="M-2-50V-63H-7V-67H-2V-74H2V-67H7V-63H2V-50Z" fill={fill} /><ellipse cy="-47" rx="12" ry="3" fill={fill} /><path d="M-6-39H6M-5-34H5" /></> : <><path d="M-6-19Q-2-26-7-32H7Q2-26 6-19Z" fill={fill} /><circle cy="-39" r="9" fill={fill} /><ellipse cy="-30" rx="9" ry="2.6" fill={fill} /><path d="M-4-43q-4 7 2 10" strokeWidth=".6" fill="none" /></>}
    <path d={Array.from({length: 9}, (_, i) => `M${-15+i*3.2} -5q-1 2 0 6`).join("")} strokeWidth=".45" opacity=".6" fill="none" />
    {kind === "knight" ? <path d={Array.from({length: 14}, (_, i) => `M${2+i*.48} ${-55+i*2.4}q6 7 0 13`).join("")} strokeWidth=".5" opacity=".75" fill="none" /> : <path d={Array.from({length: 7}, (_, i) => `M${-6+i*1.5} -29q3 5 ${i*.32} 10`).join("")} strokeWidth=".45" opacity=".65" fill="none" />}
    <path d="M-14-6Q0-1 14-6M-9-12H9M-4-18L-8-9M-12-4v4m4-3v4m4-3v4" strokeWidth=".6" fill="none" />
  </g>;
}

/** A true 8×8 projected board, shared by the wide plate and operator's desk. */
export function Board({ x = 80, y = 160, width = 430, depth = 135, skew = 65 }: { x?: number; y?: number; width?: number; depth?: number; skew?: number }) {
  return <g stroke={tones.ink} strokeWidth=".65">
    <path d={`M${x - 10} ${y - 8}h${width + 20}l${skew + 9} ${depth + 15}v14H${x + skew - 5}Z`} fill={tones.edge} />
    <path d={`M${x - 10} ${y - 8}h${width + 20}l${skew + 9} ${depth + 15}H${x + skew - 5}Z`} fill={tones.wood} />
    {Array.from({ length: 64 }, (_, i) => {const col=i%8,row=Math.floor(i/8), xx=x+col*width/8+row*skew/8, yy=y+row*depth/8;return <path key={i} d={`M${xx} ${yy}h${width/8}l${skew/8} ${depth/8}h${-width/8}Z`} fill={(col+row)%2 ? "#776c55" : tones.ivory} />;})}
    <path d={Array.from({length:64},(_,i)=>{
      const col=i%8,row=Math.floor(i/8), xx=x+col*width/8+row*skew/8, yy=y+row*depth/8;
      return Array.from({length:6},(_,j)=>`M${round(xx+(j+1)*width/56)} ${round(yy)}l${round(skew/8)} ${round(depth/8)}`).join("");
    }).join("")} stroke={tones.ink} strokeWidth=".4" opacity=".3" />
    <path d={`M${x + skew - 2} ${y + depth + 9}h${width + 18}m${-width - 14} 5h${width + 10}`} fill="none" stroke={tones.brass} />
  </g>;
}
