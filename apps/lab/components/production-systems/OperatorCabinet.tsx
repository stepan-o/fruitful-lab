import { Grain, Screw, round } from "./engraving-primitives";

const ink = "#49382b", edge = "#c0a076";
// Figure 1's material vocabulary, sized for this taller, narrower cutaway case.
// Grain follows each board; it never crosses a joint or the working compartment.
const fibres = Array.from({ length: 19 }, (_, i) => {
  const x = round(i * 2.8), bend = round(((i * 7) % 5 - 2) * .6);
  return `M${x}-5C${round(x + bend)} 29 ${round(x - bend)} 47 ${x} 78S${round(x + bend)} 128 ${x} 165`;
}).join("");
const cathedral = Array.from({ length: 9 }, (_, i) => {
  const spread = round(2 + i * 1.7), left = round(26 - spread), right = round(26 + spread);
  return `M${left} 130C${round(left + 2)} 95 ${round(left - 3)} 71 ${left} 56Q26 ${32 - i * 4} ${right} 56C${round(right + 3)} 71 ${round(right - 2)} 95 ${right} 130`;
}).join("");
export function CabinetWoodDefs({ id }: { id: string }) {
  return <>
    <pattern id={`${id}-long-grain`} width="54" height="160" patternUnits="userSpaceOnUse">
      <path d={fibres} stroke="#362a22" strokeWidth=".48" opacity=".3" fill="none" />
      <path d="M8 0C11 51 6 95 9 160M35 0C33 56 37 103 34 160" stroke="#d4b489" strokeWidth=".5" opacity=".24" fill="none" />
    </pattern>
    <pattern id={`${id}-figured-grain`} width="54" height="160" patternUnits="userSpaceOnUse">
      <path d={fibres} stroke="#453024" strokeWidth=".45" opacity=".22" fill="none" />
      <path d={cathedral} stroke="#38291f" strokeWidth=".6" opacity=".42" fill="none" />
      <path d="M22 123C24 90 17 68 26 44C35 68 28 90 30 123" stroke="#c2a072" strokeWidth=".7" opacity=".36" fill="none" />
    </pattern>
  </>;
}
export function SidePanel({ id }: { id: string }) {
  return <g data-operator-case="side-return" stroke={ink} strokeWidth=".8">
    {/* A single projection owns panel, mitres, cornice and plinth returns. */}
    <g transform="matrix(.57735 -1 0 1 531 97)">
      <path d="M0 0H60V281H0Z" fill="#654a36" />
      <path d="M0 0H60V281H0Z" fill={`url(#${id}-long-grain)`} />
      <path d="M7 19H53V262H7Z" fill="#493a2d" />
      <path d="M10 22H50V259H10Z" fill="#98734d" />
      <path d="M13 27H47V254H13Z" fill="#574030" />
      <path d="M17 34H43V247H17Z" fill={`url(#${id}-walnut)`} />
      <path d="M17 34H43V247H17Z" fill={`url(#${id}-figured-grain)`} stroke="none" />
      <path d="M9 260V21H51M17 248H44V34M2 4V278" fill="none" stroke={edge} strokeWidth=".65" />
      <path d="M7 19 17 34M53 19 43 34M7 262 17 247M53 262 43 247" fill="none" strokeWidth=".6" />
      <path d="M0 2H60V7H0ZM0 10H60V16H0Z" fill="#98754f" />
      <path d="M0 3H60M0 12H60M0 268H60" fill="none" stroke={edge} strokeWidth=".6" />
      <path d="M0 0H60V281H0Z" fill="#273b32" opacity=".13" stroke="none" />
    </g>
    <path d="M534 93 568.64 33V42L534 102ZM531 102 565.64 42V49L531 109Z" fill="#7c593b" />
    <path d="M534 95 568.64 35M532 105 566.64 45" fill="none" stroke={edge} strokeWidth=".65" />
    <path d="M531 368 565.64 308V321L531 381Z" fill="#62452f" />
    <path d="M531 368 565.64 308V312L531 372Z" fill="#98764f" />
    <path d="M531 379 565.64 319 571.64 321 537 381Z" fill="#a68458" />
    <path d="M537 381 571.64 321V326L537 386Z" fill="#674b35" />
    <path d="M535 386 569.64 326V331L535 391Z" fill="#493629" />
    <path d="M531 371 565.64 311M537 382 571.64 322M535 388 569.64 328" stroke={edge} strokeWidth=".65" />
  </g>;
}
function Stile({ id, x }: { id: string; x: number }) {
  return <g transform={`translate(${x} 109)`} data-operator-case="fluted-stile" stroke={ink} strokeWidth=".55">
    <path d="M0 0H19V251H0Z" fill={`url(#${id}-walnut)`} />
    <path d="M0 0H19V251H0Z" fill={`url(#${id}-long-grain)`} stroke="none" />
    <path d="M1 1H18V12H1ZM1 237H18V249H1Z" fill="#9a764e" />
    <path d="M2 3H17M2 9H17M2 240H17M2 246H17M1 13V237M18 13V237" stroke={edge} strokeWidth=".6" />
    <path d="M5 22V227M9 22V227M13 22V227" stroke="#4e3828" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M5.7 23V226M9.7 23V226M13.7 23V226" stroke="#bc996a" strokeWidth=".6" />
    <path d="m4 17 5 3 5-3m-10 215 5-3 5 3" fill="none" strokeWidth=".6" />
    {[6,243].map(y => <g key={y}><circle cx="9.5" cy={y} r="1.4" fill="#785435" /><path d={`M9 ${y-.5}l1 1`} stroke={edge} strokeWidth=".4" /></g>)}
  </g>;
}
function Foot({ id, x }: { id: string; x: number }) {
  return <g transform={`translate(${x} 386)`} stroke={ink} strokeWidth=".65">
    <path d="M-10-1H10V4L7 7V11Q10 16 5 19Q0 21-5 19Q-10 16-7 11V7L-10 4Z" fill={`url(#${id}-walnut)`} />
    <path d="M-9 2H9M-7 7H7M-7 10H7M-6 13H6" fill="none" />
    <path d="M-9 1H9M-6 8H6M-5 17Q0 20 5 17" fill="none" stroke={edge} strokeWidth=".6" />
    <path d="M-4 12q-2 3 0 5m3-5v6m3-6v6m2-6q2 3 1 5" fill="none" strokeWidth=".4" />
  </g>;
}
export function CabinetFinish({ id }: { id: string }) {
  return <g data-operator-case="finished-walnut" stroke={ink} strokeWidth=".75">
    <Stile id={id} x={54} /><Stile id={id} x={513} />
    {/* Rebated aperture retains the accepted clear opening at 76..510. */}
    <path d="M71 112H514V360H71ZM76 116V357H510V116Z" fill="#95724d" fillRule="evenodd" />
    <path d="M73 359V113H512M76 357H510V116" fill="none" stroke={edge} strokeWidth=".65" />
    <path d="M71 112 76 116M514 112 510 116M71 360 76 357M514 360 510 357" fill="none" strokeWidth=".6" />
    <path d="M50 93H534V102H50ZM54 102H531V109H54Z" fill="#96734e" />
    <Grain x={55} y={95} w={474} h={6} />
    <path d="M51 94H533M54 104H531" stroke={edge} strokeWidth=".75" />
    <path d="M52 101H532M55 108H530" stroke="#3f3025" strokeWidth="1.1" />
    <path d="M54 360H531V379H54Z" fill={`url(#${id}-walnut)`} />
    <Grain x={56} y={361} w={471} h={16} />
    <path d="M56 364H529V375H56Z" fill="#64482f" />
    <path d="M59 367H526V372H59Z" fill="#98764f" strokeWidth=".55" />
    <path d="M60 368H525M54 361H531" stroke={edge} strokeWidth=".65" />
    <path d="M54 379H531L537 381V386H48V381Z" fill="#735139" />
    <path d="M49 382H536M52 379H532" stroke={edge} strokeWidth=".7" />
    <path d="M50 386H535V391H50Z" fill="#493629" />
    <path d="M54 361 59 367M531 361 526 367M54 375 59 372M531 375 526 372" fill="none" strokeWidth=".5" />
    {[65,185,434,519].map(x => <circle key={x} cx={x} cy="370" r="1.1" fill="#785435" strokeWidth=".4" />)}
    <Foot id={id} x={84} /><Foot id={id} x={496} />
  </g>;
}
export function CutawayFinish() {
  return <g data-operator-case="retained-panels" stroke={ink} strokeWidth=".6">
    {/* Two drawers establish real joinery without decorating the cut surface. */}
    {[{x:85,w:195},{x:293,w:208}].map(({x,w}) => <g key={x}>
      <path d={`M${x} 328h${w}v23H${x}Z`} fill="#483427" />
      <path d={`M${x+2} 330h${w-4}v19H${x+2}Z`} fill="#b18d5e" />
      <path d={`M${x+5} 333h${w-10}v13H${x+5}Z`} fill="#725237" />
      <Grain x={x+7} y={335} w={w-14} h={9} />
      <path d={`M${x+2} 350V330h${w-4}M${x+5} 347h${w-10}`} stroke={edge} fill="none" strokeWidth=".55" />
      <path d={`M${x} 328l5 5m${w-5}-5-5 5M${x} 351l5-5m${w-5} 5-5-5`} fill="none" strokeWidth=".5" />
      <g transform={`translate(${x+w/2} 338)`}>
        <path d="M-4-2Q0-5 4-2V2Q0 5-4 2Z" fill="#ad8b59" />
        <path d="M-2 1q-5 2-2 6q4 3 8 0q3-4-2-6" fill="none" stroke="#382e23" strokeWidth="1.8" />
        <path d="M-2 1q-4 2-2 5q4 3 8 0q2-3-2-5" fill="none" stroke="#c5a473" strokeWidth=".8" />
        <Screw x={0} y={0} r={1.2} />
      </g>
    </g>)}
    <path d="M81 297H179V319H81ZM441 297H505V319H441Z" fill="none" stroke="#503926" strokeWidth=".65" />
    <path d="M83 317V299H177M443 317V299H503" fill="none" stroke={edge} strokeWidth=".55" />
    <path d="M82 321H181M440 321H506M191 317H430" stroke="#c6a475" strokeWidth=".5" />
  </g>;
}
