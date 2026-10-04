import type { CSSProperties } from "react";
import { movementWheels, wheelOutline, type MovementWheel } from "@/lib/production-systems/turk-movement";
import { round } from "./engraving-primitives";
import motion from "./turk-conveyor.module.css";

const ink = "#403b30", gold = "#baa16d", light = "#ece2c8";

function WatchScrew({ x, y, angle = -28 }: { x: number; y: number; angle?: number }) {
  return <g transform={`translate(${round(x)} ${y}) rotate(${angle})`}>
    <circle r="3.1" fill="#514b3c" stroke={light} strokeWidth=".55" />
    <circle r="2.25" fill="#59676a" stroke={ink} strokeWidth=".6" />
    <path d="M-1.8 0H1.8" stroke="#222c2e" strokeWidth=".8" />
    <path d="M-1.8-.5H1.5" stroke="#bdc1ae" strokeWidth=".4" />
  </g>;
}

function Jewel({ x, y, large = false }: { x: number; y: number; large?: boolean }) {
  return <g transform={`translate(${round(x)} ${y})`} data-movement-part="bearing">
    <circle r={large ? 5.1 : 4} fill="#766449" stroke={light} strokeWidth=".8" />
    <circle r={large ? 3.5 : 2.65} fill="#754748" stroke="#b78675" strokeWidth=".7" />
    <circle r="1.25" fill="#352c2a" stroke="#bda58a" strokeWidth=".4" />
    <path d="M-2-1.7q1-1 2-.7" fill="none" stroke="#e5b9a3" strokeWidth=".65" />
  </g>;
}

/** Separate fixed bridges support the arbors above the moving wheel plane. */
function Bridge({ d }: { d: string }) {
  return <g data-movement-part="bridge" strokeLinejoin="round">
    <path d={d} transform="translate(0 1.7)" fill="#211f1b" stroke="#211f1b" strokeWidth="2.1" />
    <path d={d} fill="url(#turk-silver)" stroke={ink} strokeWidth="1.7" />
    <path d={d} fill="url(#turk-geneva)" stroke={light} strokeWidth=".65" />
  </g>;
}

function Wheel({ wheel, index }: { wheel: MovementWheel; index: number }) {
  const { x, y, radius: r, teeth, phase, direction, period, name } = wheel;
  const spokes = index === 0 ? 6 : index === 3 ? 7 : 5;
  return <g transform={`translate(${round(x)} ${y})`} data-movement-wheel={name}
    data-teeth={teeth} data-pitch-radius={r} data-phase={phase} data-direction={direction} data-period={period}>
    <g className={motion.gear} style={{ "--sweep": `${direction * 360}deg`, "--wheel-period": `${period}s` } as CSSProperties}>
      <g transform={`rotate(${phase})`} strokeLinejoin="round">
        <path d={wheelOutline(teeth)} fill={gold} stroke="#57472f" strokeWidth=".35" />
        <circle r={r - 2.2} fill="#4a4838" stroke={light} strokeWidth=".55" />
        <circle r={r - 4} fill="none" stroke="#958262" strokeWidth=".5" />
        {Array.from({ length: spokes }, (_, i) => <g key={i} transform={`rotate(${i * 360 / spokes})`}>
          <path d={`M-2.7-4Q-1 ${-r + 12}-3.5 ${-r + 3}H2.5Q.2 ${-r + 12} 3-4Z`} fill={gold} stroke="#564b37" strokeWidth=".5" />
          <path d={`M-1.7-6Q-.5 ${-r + 13}-2.4 ${-r + 4}`} fill="none" stroke={light} strokeWidth=".5" />
        </g>)}
        <circle r="6.2" fill={gold} stroke={light} strokeWidth=".6" />
        <circle r="3.9" fill="#7b6849" stroke={ink} strokeWidth=".6" />
        {index === 0 && <g>
          {/* The solid barrel lid has concentric turning marks; its winding
              arbor and ratchet sit in the fixed upper bridge, on another plane. */}
          <circle r="19.5" fill="url(#turk-barrel-satin)" stroke={light} strokeWidth=".65" />
          {[8, 11, 14, 17].map(ring => <circle key={ring} r={ring} fill="none" stroke="#897049" strokeWidth=".35" />)}
          {Array.from({ length: 12 }, (_, i) => <path key={i} transform={`rotate(${i * 30})`} d="M3-6Q15-9 17-5" fill="none" stroke={light} strokeWidth=".35" opacity=".5" />)}
        </g>}
      </g>
    </g>
  </g>;
}

/** A watch-finished, spring-barrel transmission, not a literal watch caliber.
 * Five meshing wheels carry power to the conveyor's existing (322,415) arbor.
 * Finishes follow the cited Patek reference; the layout and mechanism are original.
 */
export default function TurkMovement() {
  const [barrel, intermediate, centre, transfer, takeoff] = movementWheels;
  return <g clipPath="url(#turk-chamber)" data-movement="five-wheel" strokeLinejoin="round">
    <defs>
      <linearGradient id="turk-silver" x1="0" y1="0" x2=".6" y2="1">
        <stop stopColor="#d7d2ba" /><stop offset=".5" stopColor="#b3b09a" /><stop offset="1" stopColor="#96967f" />
      </linearGradient>
      <linearGradient id="turk-barrel-satin" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#dbc48b" /><stop offset=".48" stopColor="#af9158" /><stop offset=".52" stopColor="#c6ab72" /><stop offset="1" stopColor="#8e774e" />
      </linearGradient>
      <pattern id="turk-perlage" width="12" height="10" patternUnits="userSpaceOnUse">
        {[[3,-2.5],[9,-2.5],[0,2.5],[6,2.5],[12,2.5],[3,7.5],[9,7.5],[0,12.5],[6,12.5],[12,12.5]].map(([x,y], i) => <g key={i}>
          <circle cx={x} cy={y} r="4" fill="none" stroke="#d2c9aa" strokeWidth=".35" opacity=".27" />
          <circle cx={x} cy={y} r="3.1" fill="none" stroke="#3e4236" strokeWidth=".3" opacity=".23" />
        </g>)}
      </pattern>
      <pattern id="turk-geneva" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
        <path d="M0 0H4.5V9H0Z" fill="#f5ebd0" opacity=".12" />
        <path d="M.5 0V9M2 0V9M3.5 0V9M5 0V9M6.5 0V9M8 0V9" stroke="#4d5346" strokeWidth=".25" opacity=".24" />
        <path d="M.2 0V9" stroke={light} strokeWidth=".55" opacity=".7" />
      </pattern>
    </defs>

    {/* Perlage belongs to the recessed mainplate, with distinct bearing seats. */}
    <path d="M172 357H355Q366 357 366 369V457Q366 469 354 469H174Q161 469 161 456V370Q161 357 172 357Z" fill="#777c69" stroke="#211f19" strokeWidth="3" />
    <path d="M172 359H355Q364 359 364 370V456Q364 467 354 467H174Q163 467 163 456V370Q163 359 172 359Z" fill="url(#turk-perlage)" stroke={gold} strokeWidth=".9" />
    <path d="M173 361H352M166 372V451" fill="none" stroke={light} strokeWidth=".5" />
    {movementWheels.map(wheel => <circle key={wheel.name} cx={round(wheel.x)} cy={wheel.y + .8} r={wheel.radius + 1.6} fill="#211f19" />)}
    {movementWheels.map((wheel, index) => <Wheel key={wheel.name} wheel={wheel} index={index} />)}

    {/* Each cock has a broad foot fixed to the mainplate and a small jeweled
        head. Windows between the bridges expose all four gear contacts. */}
    <Bridge d={`M168 447Q171 444 177 446L${round(barrel.x - 6)} 425Q${round(barrel.x)} 418 ${round(barrel.x + 7)} 425Q${round(barrel.x + 11)} 431 ${round(barrel.x + 4)} 438L187 457Q186 464 179 464H169Z`} />
    <Bridge d={`M196 359H236L235 367Q226 370 227 379L${round(intermediate.x + 6)} 387Q${round(intermediate.x + 7)} 397 ${round(intermediate.x)} 398Q${round(intermediate.x - 8)} 397 ${round(intermediate.x - 7)} 388L211 375Q208 370 198 370Z`} />
    <Bridge d={`M259 359H290L289 369Q276 372 271 384L${round(centre.x + 7)} 398Q${round(centre.x + 1)} 405 ${round(centre.x - 6)} 399Q${round(centre.x - 11)} 393 ${round(centre.x - 4)} 387L266 371Z`} />
    <Bridge d={`M239 459Q243 453 252 456L${round(transfer.x - 6)} 435Q${round(transfer.x)} 429 ${round(transfer.x + 7)} 436Q${round(transfer.x + 12)} 444 ${round(transfer.x + 4)} 449L269 459Q269 466 262 467H239Z`} />
    <Bridge d="M351 359H363V460H342L340 452Q353 440 338 429L317 422Q310 416 316 410Q320 405 329 409L342 414Q353 413 351 398L347 376Z" />

    <Jewel x={barrel.x} y={barrel.y} large /><Jewel x={intermediate.x} y={intermediate.y} />
    <Jewel x={centre.x} y={centre.y} /><Jewel x={transfer.x} y={transfer.y} />
    {/* The output's larger steel bearing and brass collar remain visible around
        the conveyor's front sprocket. Its screws fix the bridge, not the gear. */}
    <g data-movement-part="output-bearing">
      <circle cx={takeoff.x} cy={takeoff.y} r="15.5" fill="#656c60" stroke={light} strokeWidth="1" />
      <circle cx={takeoff.x} cy={takeoff.y} r="13.5" fill="#b8a474" stroke={ink} strokeWidth=".8" />
      <circle cx="307.8" cy="415" r="1" fill={ink} /><circle cx="336.2" cy="415" r="1" fill={ink} />
      <path d="M309 420a13.5 13.5 0 0 0 26 0" fill="none" stroke={light} strokeWidth=".7" />
    </g>
    {[[173,453],[178,461],[202,364],[231,364],[280,364],[245,461],[259,462],[357,367],[357,453]].map(([x,y],i) => <WatchScrew key={i} x={x} y={y} angle={i % 2 ? 32 : -28} />)}

    {/* Stationary winding ratchet and sprung click above the barrel arbor. */}
    <g transform={`translate(${round(barrel.x)} ${barrel.y})`}>
      <circle r="8" fill="none" stroke="#5e523f" strokeWidth="1.7" strokeDasharray=".8 1.294" />
      <path d="M-14 18Q-10 6-7 4L-6 7M-13 18Q-16 7-9 1" fill="none" stroke={light} strokeWidth="1" />
      <circle cx="-14" cy="18" r="1.5" fill={gold} stroke={ink} strokeWidth=".5" />
    </g>
    {/* Fine engraved case rails finish the movement without covering the train. */}
    <path d="M165 363V461M364 362V461" stroke={gold} strokeWidth=".75" />
  </g>;
}
