import type { CSSProperties } from "react";
import { movementWheels, wheelOutline, type MovementWheel } from "@/lib/production-systems/turk-movement";
import { round } from "./engraving-primitives";
import motion from "./turk-conveyor.module.css";

const ink = "#3a3025", edge = "#dcc598";

function Wheel({ wheel, index }: { wheel: MovementWheel; index: number }) {
  const { x, y, radius: r, teeth, phase, direction, period, name, layer } = wheel;
  const steel = [1, 3, 6, 7, 9].includes(index);
  const metal = steel ? "#8d907b" : index === 0 ? "#b29a68" : "#bea574";
  const spokes = index === 0 ? 8 : r < 12 ? 3 : index === 2 ? 6 : index === 3 ? 4 : 5;
  const inner = r - (r > 30 ? 6 : 3.4);
  return <g transform={`translate(${round(x)} ${round(y)})`} data-movement-wheel={name}
    data-teeth={teeth} data-pitch-radius={r} data-phase={phase} data-direction={direction} data-period={period} data-plane={layer}>
    <g className={motion.gear} style={{ "--sweep": `${direction * 360}deg`, "--wheel-period": `${period}s` } as CSSProperties}>
      <g transform={`rotate(${phase})`} strokeLinejoin="round">
        {/* The wheel is pierced: its centre reveals the shafts and deeper train.
            Only the toothed rim, spokes and boss cover the mechanism beneath. */}
        <path d={`${wheelOutline(teeth)}M${inner} 0a${inner} ${inner} 0 1 0 ${-inner * 2} 0a${inner} ${inner} 0 1 0 ${inner * 2} 0Z`} fillRule="evenodd" fill={metal} stroke={ink} strokeWidth=".45" />
        <circle r={r - 1.8} fill="none" stroke={edge} strokeWidth=".55" />
        <circle r={inner + .7} fill="none" stroke={steel ? "#bcc2a6" : "#ead3a1"} strokeWidth=".5" />
        {Array.from({ length: spokes }, (_, i) => <g key={i} transform={`rotate(${i * 360 / spokes})`}>
          <path d={`M-1.5 -3Q-1 ${-r / 2} -2.3 ${-inner - .7}H2.3Q1 ${-r / 2} 1.5 -3Z`} fill={metal} stroke={ink} strokeWidth=".5" />
          <path d={`M-1 -4Q-.6 ${-r / 2} -1.6 ${-inner}`} fill="none" stroke={edge} strokeWidth=".45" />
        </g>)}
        {r > 20 && <path d={Array.from({ length: teeth }, (_, i) => {
          const a = i * Math.PI * 2 / teeth;
          return `M${round(Math.cos(a) * (r - 3))} ${round(Math.sin(a) * (r - 3))}l${round(Math.cos(a) * .9)} ${round(Math.sin(a) * .9)}`;
        }).join("")} stroke={ink} strokeWidth=".35" opacity=".5" />}
        {index === 0 && <g>
          <circle r="9" fill="none" stroke={metal} strokeWidth="2.2" />
          <circle r="10.7" fill="none" stroke={edge} strokeWidth=".5" />
          {[0,90,180,270].map(a => <g key={a} transform={`rotate(${a})`}>
            <circle cy={-r + 4.2} r="1.2" fill={ink} /><path d={`M-.7 ${-r + 3.9}h1.4`} stroke={edge} strokeWidth=".45" />
          </g>)}
        </g>}
        <circle r={r < 12 ? 3 : 4.2} fill={metal} stroke={ink} strokeWidth=".65" />
        <circle r={r < 12 ? 1.5 : 2.5} fill="#625a43" stroke={edge} strokeWidth=".55" />
        <path d="M-1-1H1V1H-1Z" fill={ink} />
        {/* A small eccentric makes the fast pinion's rotation easy to read. */}
        {index === 5 && <circle cx="5" cy="-2" r="1.5" fill="#584438" stroke={edge} strokeWidth=".6" />}
      </g>
    </g>
  </g>;
}

/** Open clockwork: narrow rear supports, a large flywheel, quick pinions and a
 * compound foreground reduction. The unchanged right arbor drives the belt.
 */
export default function TurkMovement() {
  return <g clipPath="url(#turk-chamber)" data-movement="open-clockwork" strokeLinejoin="round">
    {/* Supports recede into the back of the cabinet, behind the moving wheels. */}
    <path d="M160 357H368V469H160Z" fill="#302c24" />
    <path d="M160 357H368V469H160Z" fill="url(#turk-crosshatch)" opacity=".6" />
    <path d="M166 364H361M166 463H361" fill="none" stroke="#776348" strokeWidth="1.1" />
    <g stroke="#625940" strokeWidth="2" opacity=".6" data-movement-part="rear-supports">
      <path d="M171 366V460M357 367V460M166 420H364M245 363 279 464" />
    </g>
    {movementWheels.filter(w => w.layer === 0).map(w => <g key={w.name} transform={`translate(${round(w.x)} ${round(w.y)})`} data-movement-part="rear-bearing">
      <path d="M-6-3H6V3H-6Z" fill="#736249" stroke={ink} strokeWidth=".6" />
      <circle r="4.3" fill="#86744f" stroke="#b69d70" strokeWidth=".6" />
    </g>)}
    {/* Cast depth stays behind every wheel in its plane; it cannot mask a mesh. */}
    {movementWheels.filter(w => w.layer === 0).map(w => <circle key={w.name} cx={round(w.x)} cy={round(w.y + 1)} r={w.radius - 1.2} fill="none" stroke="#181915" strokeWidth="2.7" />)}
    {movementWheels.filter(w => w.layer === 0).map((wheel, index) => <Wheel key={wheel.name} wheel={wheel} index={index} />)}

    {/* A short spacer makes the second plane readable, without a cover plate. */}
    <g data-movement-part="compound-arbor" transform={`translate(${round(movementWheels[2].x)} ${movementWheels[2].y})`}>
      <circle r="6.4" fill="#413a2c" stroke={edge} strokeWidth=".65" /><circle r="4.7" fill="#b59b69" stroke={ink} strokeWidth=".7" />
    </g>
    {movementWheels.filter(w => w.layer === 1).map(w => <circle key={w.name} cx={round(w.x)} cy={round(w.y + 1.7)} r={w.radius - 1} fill="none" stroke="#171b16" strokeWidth="2.5" />)}
    {movementWheels.filter(w => w.layer === 1).map((wheel, i) => <Wheel key={wheel.name} wheel={wheel} index={i + 9} />)}

    {/* The only prominent front bearing is the conveyor's load-bearing takeoff. */}
    <g data-movement-part="output-bearing">
      <circle cx="322" cy="415" r="13.8" fill="none" stroke="#a99165" strokeWidth="1.1" />
      <path d="M309 420a13.5 13.5 0 0 0 26 0" fill="none" stroke={edge} strokeWidth=".65" />
    </g>
  </g>;
}
