import type { ReactNode } from "react";
import { Grain, round } from "./engraving-primitives";

const ink = "#49382b", walnut = "#79573e", edge = "#c0a076", brass = "#ab8b59";

// Long fibres and nested cathedral cuts are separate, batched engraving paths.
// The pattern follows the individual board's local axis, including on the door
// and side return. It is never laid across an assembled face or an open chamber.
const fibres = Array.from({ length: 19 }, (_, i) => {
  const x = round(i * 2.8), bend = round(((i * 7) % 5 - 2) * .6);
  return `M${x} -5C${round(x + bend)} 29 ${round(x - bend)} 47 ${x} 78S${round(x + bend)} 128 ${x} 165`;
}).join("");
const cathedral = Array.from({ length: 9 }, (_, i) => {
  const spread = round(2 + i * 1.7), crown = 32 - i * 4;
  const left = round(26 - spread), right = round(26 + spread);
  return `M${left} 130C${round(left + 2)} 95 ${round(left - 3)} 71 ${left} 56Q26 ${crown} ${right} 56C${round(right + 3)} 71 ${round(right - 2)} 95 ${right} 130`;
}).join("");

/** Short turned feet sit below the case's load-bearing corner blocks. */
function Foot({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`} data-cabinet-part="foot" stroke={ink} strokeWidth=".8">
    <path d="M-11-5H11V3L8 6V12Q11 18 6 22Q0 25-6 22Q-11 18-8 12V6L-11 3Z" fill="url(#turk-walnut)" />
    <path d="M-10 2H10M-8 6H8M-8 10H8M-8 13H8" fill="none" />
    <path d="M-9 0H9M-7 7H7M-7 12H7M-6 20Q0 23 6 20" fill="none" stroke={edge} strokeWidth=".65" />
    <path d="M-6 14q-2 4 0 6m3-6q-1 4 0 7m4-7v8m3-8q2 4 0 7" fill="none" stroke={ink} strokeWidth=".5" />
    <path d="M-6 22q6 3 12 0v2q-6 3-12 0Z" fill="#776043" />
  </g>;
}

/** All side rails are projected with the conveyor's (+36.95, −64) depth. */
function SideReturn() {
  return <g data-cabinet-part="side-panel" stroke={ink} strokeWidth="1">
    <g transform="matrix(.57735 -1 0 1 589 327)">
    <path d="M0 0H64V165H0Z" fill="#654a36" />
    <path d="M0 0H64V165H0Z" fill="url(#turk-long-grain)" />
    <path d="M7 15H57V148H7Z" fill="#493a2d" />
    <path d="M10 18H54V145H10Z" fill="#94714d" />
    <path d="M14 23H50V140H14Z" fill="#574030" />
    <path d="M18 28H46V135H18Z" fill="url(#turk-walnut)" />
    <path d="M18 28H46V135H18Z" fill="url(#turk-long-grain)" stroke="none" />
    <path d="M9 146V17H55M17 136V27H47M2 2V162" fill="none" stroke={edge} strokeWidth=".8" />
    <path d="M7 15 18 28M57 15 46 28M7 148 18 135M57 148 46 135" fill="none" strokeWidth=".6" />
    <path d="M0 7H64M0 11H64" stroke="#b19165" strokeWidth=".65" />
    </g>
    {/* Each molding returns to the same front corner and depth as its apron. */}
    <g data-cabinet-part="base-return" strokeWidth=".7">
      <path d="M589 479 625.95 415V429L589 493Z" fill="#61462f" />
      <path d="M590 479 626.95 415V419L590 483Z" fill="#98764f" />
      <path d="M589 484 625.95 420M589 491 625.95 427" stroke={edge} strokeWidth=".6" />
      <path d="M591 493 627.95 429 631.95 432 595 496Z" fill="#a68458" />
      <path d="M595 496 631.95 432V437L595 501Z" fill="#674b35" />
      <path d="M593 501 629.95 437V440L593 504Z" fill="#493629" />
      <path d="M595 497 631.95 433M590 480 626.95 416" stroke={edge} strokeWidth=".65" />
    </g>
  </g>;
}

/** The bevels stop at the existing wheel envelope, leaving every gear exposed. */
function MechanismOpening() {
  return <g data-cabinet-part="rebated-opening" stroke={ink} strokeWidth=".7">
    <path d="M145 344H382V480H145Z" fill="#4c372a" />
    <path d="M149 347H378V476H149Z" fill="#a17e54" />
    <path d="M152 350H374V473H152Z" fill="#65482f" />
    <path d="M158 354H369V469H158Z" fill="#302b24" />
    <path d="M152 350 158 354H369L374 350ZM152 350V473L158 469V354Z" fill="#352b23" stroke="none" />
    <path d="M148 477V346H379M158 470H370V354" fill="none" stroke={edge} strokeWidth=".65" />
    <path d="M146 344 158 354M382 344 369 354M382 480 369 469M145 480 158 469" fill="none" strokeWidth=".6" />
    <path d="M154 474H373M155 352H371" fill="none" stroke="#896947" strokeWidth=".6" />
  </g>;
}

function CentreStile() {
  return <g data-cabinet-part="centre-stile" stroke={ink} strokeWidth=".65">
    <path d="M379 343H393V479H379Z" fill="url(#turk-walnut)" />
    <path d="M381 351H391V471H381Z" fill="url(#turk-long-grain)" stroke="none" />
    <path d="M379 345H393V350H379ZM379 470H393V476H379Z" fill="#98744e" />
    <path d="M380 346H392M380 473H392M380 350V470M392 350V470" stroke={edge} strokeWidth=".55" />
    <path d="M383 358v102m3-102v102m3-102v102" stroke="#4e3828" strokeLinecap="round" strokeWidth="1.3" />
    <path d="M383.7 359v100m3-100v100m3-100v100" stroke="#bc996a" strokeWidth=".55" />
    <path d="m382 353 4 3 4-3m-8 113 4-3 4 3" fill="none" strokeWidth=".6" />
  </g>;
}

function Plinth() {
  return <g data-cabinet-part="plinth" stroke={ink} strokeWidth=".8">
    {/* A continuous structural apron, fine stringing, then a stepped base. */}
    <path d="M128 479H590V497H128Z" fill="url(#turk-walnut)" />
    <g transform="translate(130 479)"><Grain x={0} y={0} w={457} h={18} /></g>
    <path d="M131 484H587V492H131Z" fill="#64482f" />
    <path d="M134 486H584V490H134Z" fill="#98764f" strokeWidth=".55" />
    <path d="M135 487H583" stroke="#c7a97a" strokeWidth=".55" />
    <path d="M128 479H590V483H128Z" fill="#ab895d" />
    <path d="M128 483H590L587 485H131Z" fill="#4b3627" stroke="none" />
    <path d="M127 493H591L595 496V501H123V496Z" fill="#735139" />
    <path d="M123 497H595M126 494H592" stroke={edge} strokeWidth=".7" />
    <path d="M125 501H593V504H125Z" fill="#493629" />
    <path d="M129 479 135 486M590 479 584 486M128 497 134 490M590 497 584 490" strokeWidth=".6" />
    {/* Flush wooden pegs express joints without adding metal decoration. */}
    {[140, 379, 583].map(x => <g key={x}><circle cx={x} cy="488" r="1.3" fill="#785435" strokeWidth=".45" /><path d={`M${x - .5} 487.4l1 1.2`} stroke={edge} strokeWidth=".4" /></g>)}
  </g>;
}

function Hinge({ y }: { y: number }) {
  return <g transform={`translate(146 ${y})`} data-cabinet-part="hinge" stroke={ink} strokeWidth=".55">
    <path d="M-8 2-1 0V16L-8 18ZM1 0H8V16H1Z" fill={brass} />
    <path d="M-7 3-2 1.5M2 1.5H7M-7 16-2 14.5M2 14.5H7" fill="none" stroke="#d2b781" strokeWidth=".45" />
    <path d="M-1.5-1Q0-2 1.5-1V17Q0 18-1.5 17Z" fill="#a38555" />
    <path d="M-.6 0V16M-1.5 4H1.5M-1.5 8H1.5M-1.5 12H1.5" stroke="#e0c58d" strokeWidth=".45" />
    {[[-4.5,5],[-4.5,13],[4.5,4],[4.5,12]].map(([x, yy]) => <g key={`${x}-${yy}`}>
      <circle cx={x} cy={yy} r="1.05" fill="#c2a371" /><path d={`M${x - .55} ${yy + .5}l1.1-1`} strokeWidth=".45" />
    </g>)}
  </g>;
}

/** The door is in front of the base, hinged to the fixed case, never the belt. */
function OpenDoor() {
  return <g data-cabinet-part="open-door" stroke={ink} strokeWidth=".8">
    <g transform="matrix(1 -.339286 0 1 89 363)">
      <path d="M-3 1 0 0V136L-3 137Z" fill="#4c3627" />
      <path d="M0 0H56V136H0Z" fill="url(#turk-walnut)" strokeWidth="1.1" />
      <path d="M0 0H56V136H0Z" fill="url(#turk-long-grain)" stroke="none" />
      <path d="M7 10H48V125H7Z" fill="#483427" />
      <path d="M9 12H46V123H9Z" fill="#b18d5e" />
      <path d="M12 16H43V119H12Z" fill="#64472f" />
      <path d="M16 22H39V113H16Z" fill="#896442" />
      <path d="M16 22H39V113H16Z" fill="url(#turk-figured-grain)" stroke="none" />
      <path d="M12 16 16 22H39L43 16ZM12 16V119L16 113V22Z" fill="#493326" stroke="none" opacity=".75" />
      <path d="M2 134V2H54M8 124V11H47M16 114H40V22" fill="none" stroke={edge} strokeWidth=".65" />
      <path d="M1 11H7M48 11H55M1 125H7M48 125H55M7 10 16 22M48 10 39 22M7 125 16 113M48 125 39 113" fill="none" strokeWidth=".6" />
      <path d="M5 5H51M5 130H51" stroke="#b59669" strokeWidth=".5" />
      <path d="M0 136H56V138H0Z" fill="#493526" />
      {/* A small escutcheon and hanging pull, in the free stile. */}
      <path d="M4 64q-3 3 0 6q3 3 5 0q3-3 0-6q-2-3-5 0Z" fill={brass} />
      <ellipse cx="6.5" cy="66.5" rx="1.4" ry="1.7" fill="#423728" strokeWidth=".5" />
      <path d="M5.7 67.5h1.6l.5 2.4H5.2Z" fill="#423728" stroke="none" />
      <path d="M5 73q-5 3-2 9q3 4 6 0q3-6-2-9" fill="none" stroke="#3e3025" strokeWidth="2.1" />
      <path d="M5 73q-4 3-2 8q3 4 6 0q2-5-2-8" fill="none" stroke="#c3a06a" strokeWidth="1" />
      <circle cx="6" cy="73" r="1.7" fill={brass} />
    </g>
    <Hinge y={389} /><Hinge y={446} />
  </g>;
}

/** Original period-inspired casework around the accepted mechanical envelope. */
export default function TurkCabinet({ children }: { children: ReactNode }) {
  return <g data-cabinet="finished-walnut" strokeLinejoin="round">
    <defs>
      <linearGradient id="turk-walnut" x1="0" y1="0" x2="1" y2="0">
        <stop stopColor="#674631" /><stop offset=".28" stopColor="#93704c" />
        <stop offset=".65" stopColor="#805b3e" /><stop offset="1" stopColor="#634631" />
      </linearGradient>
      <pattern id="turk-long-grain" width="54" height="160" patternUnits="userSpaceOnUse">
        <path d={fibres} stroke="#362a22" strokeWidth=".48" opacity=".3" fill="none" />
        <path d="M8 0C11 51 6 95 9 160M35 0C33 56 37 103 34 160" stroke="#d4b489" strokeWidth=".5" opacity=".24" fill="none" />
      </pattern>
      <pattern id="turk-figured-grain" width="54" height="160" patternUnits="userSpaceOnUse">
        <path d={fibres} stroke="#453024" strokeWidth=".45" opacity=".22" fill="none" />
        <path d={cathedral} stroke="#38291f" strokeWidth=".6" opacity=".42" fill="none" />
        <path d="M22 123C24 90 17 68 26 44C35 68 28 90 30 123" stroke="#c2a072" strokeWidth=".7" opacity=".36" fill="none" />
      </pattern>
    </defs>
    <path d="M94 510 169 537 622 468 556 478Z" fill="#b7ad94" opacity=".13" />
    <path d="M118 520 177 530 606 469M138 516 180 524 591 470M181 518 576 475" fill="none" stroke="#938775" strokeWidth=".65" opacity=".25" />
    <g transform="translate(36.95 -64)"><Foot x={559} y={499} /></g>
    <Foot x={158} y={499} /><Foot x={559} y={499} />
    <SideReturn />
    <path d="M129 327H589V492H129Z" fill={walnut} stroke={ink} strokeWidth="1.3" />
    <path d="M129 327H589V492H129Z" fill="url(#turk-long-grain)" />
    {/* A restrained cornice sits below, and is occluded by, the conveyor frame. */}
    <path d="M125 331H592V338H125ZM129 338H589V344H129Z" fill="#96734e" stroke={ink} strokeWidth=".8" />
    <path d="M125 332H592M129 340H589" stroke={edge} strokeWidth=".75" />
    <path d="M128 337H590M132 343H586" stroke="#3f3025" strokeWidth="1.4" />
    <MechanismOpening />
    <path d="M394 346H579V478H394Z" fill="#4b3728" stroke={ink} />
    <path d="M395 347H579M397 477H578V350" fill="none" stroke={edge} strokeWidth=".6" />
    <CentreStile />
    <path d="M581 344V480M586 344V480M133 346V478" stroke={edge} strokeWidth=".6" />
    <path d="M584 346V477M135 346V478" stroke="#402f24" strokeWidth="1" />
    <Plinth />
    {children}
    <OpenDoor />
  </g>;
}
