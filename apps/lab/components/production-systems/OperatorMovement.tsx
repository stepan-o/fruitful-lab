import type { CSSProperties } from "react";
import { operatorWheels } from "@/lib/production-systems/operator-movement";
import { wheelOutline, type MovementWheel } from "@/lib/production-systems/turk-movement";
import { operatorLamp } from "@/lib/production-systems/operator-light";
import { round } from "./engraving-primitives";
import styles from "./turk-operator.module.css";

const ink = "#3a3025", edge = "#dcc598";
function facingArc(x: number, y: number, radius: number, opposite = false) {
  const angle = Math.atan2(operatorLamp.y - y, operatorLamp.x - x) + (opposite ? Math.PI : 0), r = radius - .8;
  const point = (a: number) => `${round(r * Math.cos(a))} ${round(r * Math.sin(a))}`;
  return `M${point(angle - .8)}A${r} ${r} 0 0 1 ${point(angle + .8)}`;
}
function Wheel({ wheel, index }: { wheel: MovementWheel; index: number }) {
  const { name, x, y, radius: r, teeth, phase, direction, period, layer } = wheel;
  const steel = [1, 3, 5, 7].includes(index), metal = steel ? "#8d907b" : "#bea574";
  const inner = r - (r > 20 ? 3.8 : 2.7), spokes = r < 12 ? 3 : index === 0 ? 6 : index === 4 ? 5 : 4;
  return <g transform={`translate(${round(x)} ${round(y)})`} data-operator-wheel={name} data-plane={layer} data-teeth={teeth} data-period={period}>
    <g className={styles.wheel} style={{ "--wheel-period": `${period}s`, "--wheel-turn": `${direction * 360}deg` } as CSSProperties}>
      <g transform={`rotate(${phase})`}>
        <path d={`${wheelOutline(teeth)}M${inner} 0a${inner} ${inner} 0 1 0 ${-inner * 2} 0a${inner} ${inner} 0 1 0 ${inner * 2} 0Z`} fillRule="evenodd" fill={metal} stroke={ink} strokeWidth=".45" />
        <circle r={r - 1.7} fill="none" stroke={edge} strokeWidth=".5" />
        <circle r={inner + .6} fill="none" stroke={steel ? "#bcc2a6" : "#ead3a1"} strokeWidth=".45" />
        {Array.from({ length: spokes }, (_, i) => <g key={i} transform={`rotate(${i * 360 / spokes})`}>
          <path d={`M-1.2-2Q-.8 ${-r / 2} -1.8 ${-inner - .5}H1.8Q.8 ${-r / 2} 1.2-2Z`} fill={metal} stroke={ink} strokeWidth=".5" />
          <path d={`M-.7-3Q-.4 ${-r / 2} -1.2 ${-inner}`} fill="none" stroke={edge} strokeWidth=".45" opacity=".55" />
        </g>)}
        {r > 20 && <path d={Array.from({ length: teeth }, (_, i) => {
          const a = i * Math.PI * 2 / teeth;
          return `M${round(Math.cos(a) * (r - 2.7))} ${round(Math.sin(a) * (r - 2.7))}l${round(Math.cos(a) * .7)} ${round(Math.sin(a) * .7)}`;
        }).join("")} stroke={ink} strokeWidth=".35" opacity=".55" />}
        <circle r={r < 12 ? 2.6 : 3.6} fill={metal} stroke={ink} strokeWidth=".65" />
        <circle r={r < 12 ? 1.3 : 2.1} fill="#625a43" stroke={edge} strokeWidth=".55" />
        <path d="M-.8-.8H.8V.8H-.8Z" fill={ink} />
        {index === 3 && <circle cx="4" cy="-1.5" r="1" fill="#584438" stroke={edge} strokeWidth=".5" />}
      </g>
    </g>
    {/* Fixed bevel light faces the actual candle, not Figure 1's studio key. */}
    <path d={facingArc(x, y, r)} fill="none" stroke={steel ? "#d2d8bd" : "#f0dcad"} strokeWidth=".75" opacity=".75" />
    <path d={facingArc(x, y, r, true)} fill="none" stroke="#302d24" strokeWidth=".8" opacity=".6" />
  </g>;
}
export default function OperatorMovement() {
  return <g data-operator-part="display-movement" strokeLinejoin="round">
    <path d="M96 163H179V294H96Z" fill="#35362a" opacity=".35" />
    <path d="M99 165H177M99 289H177M100 165V288M176 164V289M101 223H176" fill="none" stroke="#756b4b" strokeWidth="1.2" opacity=".6" />
    {operatorWheels.filter(w => w.layer === 0).map(w => <g key={w.name} transform={`translate(${round(w.x)} ${round(w.y)})`}>
      <path d="M-5-2.5H5V2.5H-5Z" fill="#726247" stroke={ink} strokeWidth=".5" />
      <circle r="4" fill="#5f553f" stroke="#ad9667" strokeWidth=".6" />
    </g>)}
    {operatorWheels.map((wheel, index) => <Wheel key={wheel.name} wheel={wheel} index={index} />)}
    <path d="M104 291H158V296H104Z" fill="#816b48" stroke={ink} strokeWidth=".65" />
    <path d="M106 292H156" stroke={edge} strokeWidth=".55" />
  </g>;
}
