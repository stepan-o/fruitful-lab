import type { ReactNode } from "react";
import { Screw, round } from "./engraving-primitives";
import motion from "./turk-conveyor.module.css";

const ink = "#463a30", brass = "#ae9365", edge = "#d9c396", iron = "#656451";
const depthX = 64 / Math.sqrt(3);
const head = 628 - depthX;
const shaftY = 332;

/** Equal sprockets keep the cabinet takeoff, jackshaft and head drum in phase.
 * The cabinet output wheel turns 4/5 revolution per tray. A drum
 * pitch radius of 88 / (2π × .8) = 17.507 carries one 88-unit tray per stroke.
 * Ten-tooth, radius-seven chain sprockets advance eight links in that interval.
 */
function Chain({ d }: { d: string }) {
  return <g fill="none" strokeLinejoin="round">
    <path d={d} stroke={ink} strokeWidth="4.5" />
    <path d={d} className={motion.driveChain} stroke="#c4ad7c" strokeWidth="2.3" />
  </g>;
}

function Sprocket({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${round(x)} ${y})`}>
    <g className={motion.roller} stroke={ink} strokeWidth=".7">
      <circle r="8" fill={brass} /><circle r="5.2" fill="#65553d" />
      <path d={Array.from({ length: 10 }, (_, i) => {
        const a = i * Math.PI / 5;
        return `M${round(Math.cos(a) * 5.5)} ${round(Math.sin(a) * 5.5)}l${round(Math.cos(a) * 3.4)} ${round(Math.sin(a) * 3.4)}`;
      }).join("")} stroke={edge} strokeWidth="1" />
      <circle r="3" fill={brass} />
    </g>
    <circle r="1.2" fill={ink} />
  </g>;
}

function Drum({ x }: { x: number }) {
  return <g transform={`translate(${round(x)} ${shaftY})`} data-conveyor-part="drum">
    <circle r="18" fill="#3c3c31" stroke={ink} strokeWidth="1.1" />
    <g className={motion.roller}>
      <circle r="16.5" fill={iron} stroke={brass} strokeWidth="1.1" />
      <circle r="12" fill="#3f4035" stroke={edge} strokeWidth=".65" />
      {Array.from({ length: 5 }, (_, i) => <path key={i} transform={`rotate(${i * 72})`} d="M-2-5 -3-12H3L2-5Z" fill={brass} stroke={ink} strokeWidth=".6" />)}
      <path d={Array.from({ length: 20 }, (_, i) => {
        const a = i * Math.PI / 10;
        return `M${round(Math.cos(a) * 15)} ${round(Math.sin(a) * 15)}l${round(Math.cos(a) * 2.5)} ${round(Math.sin(a) * 2.5)}`;
      }).join("")} stroke={edge} strokeWidth=".75" />
    </g>
    {/* A fixed split bearing carries the rotating shaft; it is bolted to the rail. */}
    <path d="M-12 7V0a12 12 0 0 1 24 0v7l4 3v4H-16v-4Z" fill={brass} stroke={ink} strokeWidth=".9" />
    <path d="M-11 5H11M-9 2a9 9 0 0 1 18 0" fill="none" stroke={edge} strokeWidth=".7" />
    <circle r="7.5" fill="#413f33" stroke={ink} /><circle r="4.8" fill={brass} stroke={edge} strokeWidth=".75" />
    <path d="M-2-2H2V2H-2Z" fill={ink} />
    <Screw x={-12} y={10} r={1.6} /><Screw x={12} y={10} r={1.6} />
  </g>;
}

/** An original, period-material end-drive conveyor, built around a complete
 * belt loop. The two chain planes share a compound jackshaft at (322, 332).
 * The lower sprocket shares the movement’s output arbor at (322, 415).
 */
export default function TurkConveyor({ children }: { children: ReactNode }) {
  return <g data-conveyor-assembly="end-drive" strokeLinejoin="round">
    <defs>
      <linearGradient id="turk-drum-shade" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#d0bb8f" /><stop offset=".38" stopColor="#938466" /><stop offset="1" stopColor="#4e4a3b" />
      </linearGradient>
      <clipPath id="turk-slat-edge-window"><path d="M32 314H591.05V319H32Z" /></clipPath>
      <clipPath id="turk-return-window"><path d="M32 345H591.05V351H32Z" /></clipPath>
      <clipPath id="turk-chain-inspection"><path d="M340 324H404V340H340ZM419 324H483V340H419ZM498 324H562V340H498Z" /></clipPath>
    </defs>

    {/* The inboard knee is bolted to the fixed centre stile, clear of the open door.
        The continuous frame and crown pads carry the left overhang. */}
    <g fill={iron} stroke={ink} strokeWidth="1.1" data-conveyor-part="mounts">
      <g data-conveyor-part="frame-brace" data-support-base="centre-stile">
        <path d="M352 344H392V354H386V383H379V363L352 352Z" />
        <path d="M358 352 379 377V364L368 352Z" fill={brass} />
        <path d="M381 353H391V385H381Z" fill={brass} />
        <path d="M382 354H390M382 354V383M358 353 379 375" fill="none" stroke={edge} strokeWidth=".65" />
        <Screw x={357} y={351} r={2} />
        <Screw x={386} y={359} r={2} /><Screw x={386} y={379} r={2} />
      </g>
      <path d="M577 340H600V355L589 373H577V360L591 348H577Z" />
      <path d="M579 352H589V377H579Z" fill={brass} />
      <path d="M190 341H214V354H190Z" fill={brass} />
      <path d="M116 342H594V349H116Z" fill="#635239" />
      <path d="M122 344H588" stroke={edge} strokeWidth=".6" />
      {[[584,357],[584,371],[592,345],[197,348]].map(([x,y]) => <Screw key={`${x}-${y}`} x={x} y={y} r={2.2} />)}
    </g>

    {/* Rear drive plane: the existing cabinet shaft passes through a real collar.
        The chain crosses the crown in a narrow inspection channel. */}
    <g data-conveyor-part="cabinet-takeoff">
      <path d="M309 331a13 13 0 0 1 26 0v84a13 13 0 0 1-26 0Z" fill="#403b2f" stroke={ink} strokeWidth="1.2" />
      <path d="M310 349H334V372H310Z" fill={iron} stroke={brass} strokeWidth=".8" />
      <path d="M312 375V414a10 10 0 0 0 20 0V375M312 345V331a10 10 0 0 1 20 0v14" fill="none" stroke={brass} strokeWidth="1" />
      <Chain d="M315 415V332a7 7 0 0 1 14 0v83a7 7 0 0 1-14 0Z" />
      <Sprocket x={322} y={415} />
      <path d="M312 350H332M312 370H332" stroke={edge} strokeWidth=".7" />
      <Screw x={311} y={359} r={1.7} /><Screw x={333} y={359} r={1.7} />
    </g>

    {/* Both drums extend over the same depth vector as the upper carrying bed. */}
    {[32, head].map((x, i) => <g key={i} data-conveyor-part="drum-shell">
      <path d={`M${round(x)} 314l${round(depthX)}-64a18 18 0 0 ${i ? 1 : 0} 0 36l${round(-depthX)} 64a18 18 0 0 ${i ? 0 : 1} 0-36Z`} fill="url(#turk-drum-shade)" stroke={ink} strokeWidth="1" />
      {[.15,.32,.53,.74,.9].map((f,j) => <path key={j} d={`M${round(x + (i ? 1 : -1) * Math.sin(f * Math.PI) * 18)} ${round(314 + f * 36)}l${round(depthX)}-64`} fill="none" stroke={j%2 ? edge : ink} strokeWidth=".6" opacity=".45" />)}
    </g>)}
    <g data-conveyor-part="rear-bearings" stroke={ink}>
      {[32 + depthX, 628].map(x => <g key={x} transform={`translate(${round(x)} 268)`}>
        <circle r="12" fill={iron} strokeWidth=".9" /><circle r="8.2" fill="#a28b62" stroke={edge} strokeWidth=".65" />
        <circle r="4.3" fill="#474738" /><path d="M-2 0H2M0-2V2" stroke={brass} strokeWidth="1" />
      </g>)}
    </g>
    <path d="M68.95 249H628L591.05 313H32Z" fill="#5b5948" stroke={ink} />
    <path d="M58 242 61 239H632L629 242Z" fill={brass} stroke={ink} strokeWidth=".8" />
    <path d="M58 242H629V249H58Z" fill={iron} stroke={ink} strokeWidth="1.1" />
    <path d="M60 243H627M61 247H625" stroke={edge} strokeWidth=".7" />
    {[78,180,282,384,486,613].map(x=><Screw key={x} x={x} y={245.5} r={1.6} />)}

    {children}
    <path d="M68.95 250H628L626.85 252H67.8Z" fill="#302f26" opacity=".2" />

    {/* The lower run moves back under the frame. Straight rails stay stationary. */}
    <path d="M32 314H591.05a18 18 0 0 1 0 36H32a18 18 0 0 1 0-36Z" fill="#484637" stroke={ink} strokeWidth="1.2" />
    <path d="M32 315H591.05M32 349H591.05" stroke={edge} strokeWidth="1" />
    <g clipPath="url(#turk-slat-edge-window)" data-conveyor-part="slat-edge">
      <g className={motion.belt}>
        <path d="M-60 314H710V319H-60Z" fill="#977f58" />
        <path d={Array.from({ length: 36 }, (_, i) => `M${round(-44 - depthX + i * 22)} 314v5`).join("")} stroke="#463d2d" strokeWidth="1.4" />
        <path d={Array.from({ length: 36 }, (_, i) => `M${round(-42.5 - depthX + i * 22)} 314v4`).join("")} stroke={edge} strokeWidth=".6" />
        <path d="M-60 314.5H710" stroke="#d8c394" strokeWidth=".6" />
      </g>
    </g>
    <g clipPath="url(#turk-return-window)" data-conveyor-part="return-run">
      <g className={motion.returnBelt}>
        <path d="M-66 346H708V350H-66Z" fill="#897252" />
        <path d={Array.from({length:36},(_,i)=>`M${-56+i*22} 345v6m2-6v6`).join("")} stroke="#3e3a2d" strokeWidth="1.5" />
        <path d={Array.from({length:36},(_,i)=>`M${-47+i*22} 347h6`).join("")} stroke={edge} strokeWidth=".65" />
      </g>
    </g>

    {/* A thin section through the frame reveals the head-drive chain. */}
    <path d="M32 320H591.05V344H32Z" fill={iron} stroke={ink} strokeWidth="1" />
    <path d="M44 321H578M46 342H578" stroke={edge} strokeWidth=".8" />
    {[63,146,229,340,419,498].map(x=><g key={x}>
      <path d={`M${x} 324h64v16h-64Z`} fill="#35392f" stroke={brass} strokeWidth=".7" />
      {x<300 && <path d={`M${x+5} 336h54M${x+5} 328l54 8`} stroke="#a9946e" strokeWidth=".65" opacity=".65" />}
    </g>)}
    <g clipPath="url(#turk-chain-inspection)">
      <Chain d={`M322 325H${round(head)}a7 7 0 0 1 0 14H322a7 7 0 0 1 0-14Z`} />
    </g>
    {[54,135,218,302,331,408,487,572].map(x=><g key={x}>
      <path d={`M${x-3} 320h6v24h-6Z`} fill={brass} stroke={ink} strokeWidth=".55" />
      <Screw x={x} y={324} r={1.5} /><Screw x={x} y={340} r={1.5} />
    </g>)}
    {/* Slotted tail bearing and its adjustment screw make belt tension legible. */}
    <path d="M15 325H55V338H15Z" fill="#4b493a" stroke={brass} strokeWidth=".8" />
    <path d="M7 332H30" stroke={ink} strokeWidth="3" />
    <path d="M8 330v4m3-4v4m3-4v4m3-4v4m3-4v4" stroke={edge} strokeWidth=".7" />
    <path d="M8 328v8M13 328v8" stroke={brass} strokeWidth="2" />
    <Drum x={32} /><Drum x={head} />
    {/* Coaxial front sprockets and collars expose both ends of the guarded drive. */}
    <path d="M307 323H337V341H307Z" fill={brass} stroke={ink} />
    <path d="M309 325H335M309 339H335" stroke={edge} strokeWidth=".7" />
    <Sprocket x={322} y={shaftY} /><Sprocket x={head} y={shaftY} />
    <Screw x={309} y={332} r={1.6} /><Screw x={335} y={332} r={1.6} />
    <path d="M31 313H591.05" stroke={edge} strokeWidth="1" />
  </g>;
}
