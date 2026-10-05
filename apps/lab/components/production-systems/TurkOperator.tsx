import figureStudies from "@/lib/production-systems/figure-studies.json";
import { Board, Grain, Piece, Screw, round } from "./engraving-primitives";
import { wheelOutline } from "@/lib/production-systems/turk-movement";
import styles from "./turk-operator.module.css";

const ink = "#463a30", brass = "#ae9365", edge = "#c9aa78";
const person = figureStudies.studies.operator;
// One position is repeated above, in the indicators and on the private board.
const position = [3, 14, 35, 57];
const publicBoard = { x: 140, y: 48, width: 190, depth: 37, skew: -21.36 };
const privateBoard = { x: 237, y: 269, width: 105, depth: 22, skew: -12.7 };
function squareCenter(index: number, board: typeof publicBoard) {
  const col = index % 8 + .5, row = Math.floor(index / 8) + .5;
  return { x: round(board.x + col * board.width / 8 + row * board.skew / 8), y: round(board.y + row * board.depth / 8) };
}
const bodyTransform = "translate(294 122) scale(.67)";
// Source anatomy stops at the arms. Original coat, bent legs and seated support
// complete the posture; Racknitz is not treated as a reliable cabinet plan.
const coat = "M382 250Q400 258 400 277L410 306Q389 317 359 307L365 284Z";
const farLeg = "M389 302Q374 298 351 309L338 322 340 342 332 353 348 356 359 338 361 327 407 320 411 307Z";
const nearLeg = "M381 300Q351 286 321 296Q299 301 299 315L311 333 299 349 313 355 330 332Q335 324 326 315L374 322 396 314Z";
const nearBoot = "M299 345 315 351 312 359Q299 363 273 361L270 357 284 352Z";
const farBoot = "M335 348 349 352 346 360H318L315 357 326 353Z";

function HumanSilhouette({ id }: { id: string }) {
  return <><path d={coat + farLeg + nearLeg + farBoot + nearBoot} /><use href={`#${id}-person`} transform={bodyTransform} /></>;
}

/** The exposed bay is a side cutaway, not a collection of front-facing boxes. */
function Casework({ id }: { id: string }) {
  return <g stroke={ink} strokeLinejoin="round">
    <path d="M54 97 88.64 37H565.64L531 97Z" fill="#ad8b5d" strokeWidth="1" />
    <path d="M61 95 92 42H558L527 95Z" fill={`url(#${id}-walnut)`} strokeWidth=".6" />
    <path d="M75 90 99 48H547M90 58H546M86 65H542" fill="none" stroke={edge} strokeWidth=".5" />
    <Board {...publicBoard} />
    {position.map((index, i) => <Piece key={index} {...squareCenter(index, publicBoard)} scale={.23} dark={i % 2 === 0} />)}
    <path d="M531 97 565.64 37V318L531 378Z" fill="#503d2d" strokeWidth="1.2" />
    <path d="M538 113 558.64 77V311L538 347Z" fill="#755437" strokeWidth=".8" />
    <path d="M541 122 555.64 97V306L541 331Z" fill="#392f25" />
    <path d="M543 126 553.64 108V303L543 321Z" fill="#614a34" />
    <path d="M540 116 559 83M538 348 559 312M533 101V370" fill="none" stroke={edge} strokeWidth=".6" />
    <path d="M54 97H531V378H54Z" fill={`url(#${id}-walnut)`} strokeWidth="1.3" />
    <path d="M71 112H514V360H71Z" fill="#b99460" strokeWidth=".6" />
    <path d="M76 116H510V357H76Z" fill="#29332b" />
    <path d="M62 105V370H523M73 359H513V113" fill="none" stroke={edge} strokeWidth=".75" />
    <path d="M76 116 71 112M510 116 514 112M76 357 71 360M510 357 514 360" strokeWidth=".7" />
    <g clipPath={`url(#${id}-inside)`} stroke="none">
      <path d="M76 116H510V357H76Z" fill="#2e352b" />
      <path d="M96.78 80H531V322H96.78Z" fill={`url(#${id}-wall-light)`} />
      <path d="M76 116 96.78 80V322L76 358Z" fill="#302b23" />
      <path d="M76 358 96.78 322H531L510 358Z" fill="#6b5940" />
      <path d="M76 358 96.78 322H531L510 358Z" fill={`url(#${id}-floor-grain)`} />
      <path d="M97 119V322H532" fill="none" stroke="#aa8654" strokeWidth=".65" opacity=".5" />
      <path d="M98 121H510V322H98Z" fill={`url(#${id}-hatch)`} opacity=".12" />
      <path d="M100 159H181M100 161H181M194 313H466M194 315H466M427 124V309M430 124V309" fill="none" stroke="#9b8459" strokeWidth=".5" opacity=".28" />
      {/* One point source, a caster plane at depth 55 and receiver at 70.
          In an orthographic view, projection is a homothety about the flame. */}
      <g transform="translate(-51.82 -58.91) scale(1.272727)" fill="#141e18" opacity=".37" data-operator-part="projected-person-shadow">
        <HumanSilhouette id={id} />
      </g>
      <path d="M185 116H192V329L185 340Z" fill="#453827" />
      <path d="M188 121V331" stroke="#b18c57" strokeWidth=".65" />
      <path d="M204 324H490M230 333H479M250 343H466M283 353H453" stroke="#362e23" strokeWidth=".65" opacity=".55" />
    </g>
    {/* Quiet border grain follows the actual rails, leaving the cavity clear. */}
    <Grain x={60} y={99} w={467} h={12} /><Grain x={59} y={361} w={469} h={15} />
    <g transform="translate(56 353) rotate(-90)"><Grain x={0} y={0} w={235} h={12} /></g>
    <g transform="translate(516 353) rotate(-90)"><Grain x={0} y={0} w={235} h={12} /></g>
    <path d="M50 93H534V102H50ZM50 371H535V381H50Z" fill="#96714c" strokeWidth=".9" />
    <path d="M51 94H532M52 374H533" stroke="#d4b17b" strokeWidth=".7" />
    <path d="M50 381H535V386H50Z" fill="#493629" />
    <path d="M535 371 569.64 311V326L535 386Z" fill="#62452f" strokeWidth=".8" />
    <path d="M535 374 569.64 314" stroke={edge} strokeWidth=".65" />
    {[84,496].map(x => <g key={x} transform={`translate(${x} 385)`} strokeWidth=".7">
      <path d="M-9 0H9V5L6 8V13Q0 18-6 13V8L-9 5Z" fill={`url(#${id}-walnut)`} />
      <path d="M-8 3H8M-6 8H6M-5 13H5" stroke={edge} strokeWidth=".55" />
    </g>)}
    {[64,521].flatMap(x=>[106,365].map(y=><Screw key={`${x}-${y}`} x={x} y={y} r={1.9} />))}
  </g>;
}

function candleFacingArc(x: number, y: number, radius: number) {
  const angle = Math.atan2(216 - y, 190 - x), r = radius - 1;
  const point = (a: number) => `${round(r * Math.cos(a))} ${round(r * Math.sin(a))}`;
  return `M${point(angle - .7)}A${r} ${r} 0 0 1 ${point(angle + .7)}`;
}

function DisplayMovement() {
  // Two meshing wheels occupy a shallow side bay; they never cross the player.
  return <g data-operator-part="display-movement" stroke={ink}>
    <path d="M104 166H166V293H104Z" fill="none" stroke="#7f6c48" strokeWidth="1.5" />
    <path d="M108 190H163M108 256H163" stroke="#9c8458" strokeWidth="1.2" />
    {[{ x: 132, y: 223, teeth: 32, r: 24, phase: 0, cls: styles.wheel }, { x: 151, y: 188.941, teeth: 20, r: 15, phase: 12.80395, cls: styles.pinion }].map(({x,y,teeth,r,phase,cls})=><g key={r} transform={`translate(${x} ${y})`}>
      <circle r={r+1} fill="#18221b" opacity=".3" />
      <g className={cls}><g transform={`rotate(${phase})`}>
        <path transform="scale(1.5)" d={`${wheelOutline(teeth)}M${teeth/2-3} 0a${teeth/2-3} ${teeth/2-3} 0 1 0 ${-(teeth-6)} 0a${teeth/2-3} ${teeth/2-3} 0 1 0 ${teeth-6} 0Z`} fillRule="evenodd" fill="#a08b5e" strokeWidth=".5" />
        {[0,60,120,180,240,300].map(a=><path key={a} transform={`rotate(${a})`} d={`M-1.4-2 -2 ${-r+3}H2L1.4-2Z`} fill="#a99365" strokeWidth=".45" />)}
        <circle r="4" fill={brass} strokeWidth=".7" /><path d="M-2 0H2" stroke="#d3b984" strokeWidth=".6" />
      </g></g>
      <path d={candleFacingArc(x, y, r)} fill="none" stroke="#d1b780" strokeWidth=".6" />
    </g>)}
    <path d="M118 277H161V295H118Z" fill="#726046" strokeWidth=".8" />
    <path d="M121 279V293M126 279V293M131 279V293M136 279V293M141 279V293M146 279V293M151 279V293M156 279V293" stroke="#c0a474" strokeWidth=".5" />
    <path d="M113 286H166M132 247V271" stroke={brass} strokeWidth="1.5" />
  </g>;
}

function IndicatorBoard() {
  // The underside is directly below the public board in the same projection.
  const underside = { ...publicBoard, y: publicBoard.y + 69 };
  return <g data-operator-part="underside-indicators" stroke={ink} strokeWidth=".6">
    <path d="M135 112H335L311 158H111Z" fill="#292a22" />
    <path d="M140 117H330L308.64 154H118.64Z" fill="#8f815a" />
    <path d={Array.from({ length: 9 }, (_, i) => {
      const x = round(140 + i * 190 / 8), y = round(117 + i * 37 / 8), skew = round(i * -21.36 / 8);
      return `M${x} 117l-21.36 37M${140 + skew} ${y}h190`;
    }).join("")} fill="none" stroke="#423e2b" strokeWidth=".4" />
    {Array.from({length:64},(_,i)=>{
      const {x,y} = squareCenter(i, underside), occupied = position.includes(i);
      return <path key={i} d={`M${x} ${y}v${occupied?1:3}l-1.5 1.2h3l-1.5-1.2`} fill="none" stroke={occupied?"#d2b572":"#746e4e"} strokeWidth=".7" />;
    })}
    <path d="M121 157H309M139 115V107M333 115V106" fill="none" stroke={brass} strokeWidth="1.1" />
  </g>;
}

function SeatAndLegs({ id }: { id: string }) {
  return <g stroke={ink} strokeLinejoin="round" data-operator-part="seated-clearance">
    <path d="M287 348H461L458.7 352H284.7ZM301 337H475L472.7 341H298.7Z" fill="#635c43" strokeWidth=".7" />
    <path d="M286 350H459M300 339H473" stroke="#bba577" strokeWidth=".6" />
    <path d="M378 308V337H425V308M383 310V334M420 310V334" fill="#755638" strokeWidth="1" />
    {[382,422].map(x=><g key={x}><circle cx={x} cy="337" r="5" fill="#a98f5e" strokeWidth=".8" /><circle cx={x} cy="337" r="1.5" fill={ink} /></g>)}
    <path d="M361 300H421L435 306V314H361Z" fill="#765239" strokeWidth=".8" />
    <path d="M360 299Q388 293 420 299L434 304Q395 311 361 305Z" fill="#6a4638" strokeWidth=".8" />
    <path d="M365 303Q393 307 428 303" fill="none" stroke="#b28561" strokeWidth=".7" />
    <path d={farLeg} fill="#777460" strokeWidth=".9" />
    <path d={farBoot} fill="#4c3c30" strokeWidth="1" />
    <path d={nearLeg} fill="#a59777" strokeWidth="1.1" />
    <path d={coat} fill="#837051" strokeWidth="1" />
    <path d={nearBoot} fill="#503c2e" strokeWidth=".9" />
    <path d="M309 308q25-12 51-3m-48 9 12 15-16 21m46-35-7 15-1 14M374 287l-8 16m13-13 4 16m7-21 6 21m-113 51q12 2 27-1m12 1h23" fill="none" stroke="#44382b" strokeWidth=".75" />
    <path d="M305 310q26-13 51-4M310 347l7-15M278 357l17-3M323 358h21" fill="none" stroke="#cbbb91" strokeWidth=".7" />
    <path d={nearLeg+farLeg+coat} fill={`url(#${id}-hatch)`} opacity=".48" stroke="none" />
    <path d="M403 286H419V299M417 276V299" fill="none" stroke="#aa8a56" strokeWidth="1.2" />
  </g>;
}

function PrivateBoard() {
  return <g data-operator-part="private-pegboard" stroke={ink}>
    {/* A cantilevered shelf ends at the player's hand; it never bisects the legs. */}
    <path d="M226 294V318L244 286M317 294V320L332 285" fill="none" stroke="#816444" strokeWidth="3" />
    <Board {...privateBoard} />
    {Array.from({length:64},(_,i)=>{
      const {x,y} = squareCenter(i, privateBoard);
      return <ellipse key={i} cx={x} cy={y} rx=".8" ry=".48" fill="#413c2e" stroke="none" />;
    })}
    {position.map((index,i)=>{ const {x,y} = squareCenter(index, privateBoard); return <g key={index} strokeWidth=".6">
      <path d={`M${x-2} ${y}v-6h4v6Z`} fill={i%2?"#d9c9a0":"#53634e"} /><ellipse cx={x} cy={y-6} rx="2.4" ry="1.1" fill={i%2?"#ede0be":"#7c8765"} />
    </g>; })}
    <path d="M226 302H343" stroke={edge} strokeWidth=".65" />
    <path d="M332 298h11" stroke="#b89c67" strokeWidth="1" />
  </g>;
}

function ControlLinkage() {
  return <g data-operator-part="pantograph" fill="none" strokeLinejoin="round">
    {/* A compact four-bar control stays in front of the working hand; the
        transmission follows the roof and rear upright, clear of the face. */}
    <path d="M300 160 319 136 353 158 334 182Z" stroke="#302c22" strokeWidth="4.2" />
    <path d="M300 160 319 136 353 158 334 182Z" stroke={brass} strokeWidth="2.4" />
    <path d="M319 136V121H476V96M476 121V268" stroke="#302c22" strokeWidth="5" />
    <path d="M319 136V121H476V96M476 121V268" stroke="#9d8a60" strokeWidth="2.8" />
    <path d="M321 119H474M474 126V267" stroke="#d1b985" strokeWidth=".65" />
    <path d="M331 181 327 199M336 183 332 201" stroke="#b39a67" strokeWidth="1" />
    {[[300,160],[319,136],[353,158],[334,182],[476,121]].map(([x,y])=><Screw key={`${x}-${y}`} x={x} y={y} r={2.4} />)}
    <path d="M469 141H483V150H469ZM469 249H483V259H469Z" fill="#78664a" stroke={ink} strokeWidth=".8" />
    <path d="M470 89V46H482V89" fill="#6b6d56" stroke={ink} strokeWidth="1" />
    <ellipse cx="476" cy="45" rx="8" ry="3" fill={brass} stroke={ink} strokeWidth=".8" />
    <path d="M472 45V22M480 45V22" stroke="#73745b" strokeWidth="2.5" />
    {/* Section break: the cropped output continues to the automaton above. */}
    <path d="M471 17H481V27H471Z" stroke={ink} fill={brass} strokeWidth=".8" />
    <path d="M468 19 484 15M468 23 484 19" stroke={ink} strokeWidth=".85" />
    <path d="M470 24H482M471 33H481" stroke={edge} strokeWidth=".6" />
    <path d="M467 94H485V99H467Z" fill={brass} stroke={ink} strokeWidth=".8" />
  </g>;
}

function Candle({ id }: { id: string }) {
  return <g data-operator-part="candle" stroke={ink} strokeWidth=".85">
    <path d="M175 276H209V282H175ZM199 282V308L181 282" fill="#8b704c" />
    <path d="M177 277H207" stroke={edge} strokeWidth=".65" />
    <ellipse cx="190" cy="272" rx="11" ry="3.2" fill="#a68956" />
    <path d="M182 271q7-3 6-13h4q-1 10 6 13Z" fill={brass} />
    <ellipse cx="190" cy="257" rx="7" ry="2" fill="#cab185" />
    <path d="M187 257V230q3-2 6 0v27Z" fill="#e0d1ae" />
    <path d="M188 233v12q2 2 2-1v-10m2 3v15" stroke="#b1986c" fill="none" strokeWidth=".55" />
    <path d="M190 230v-5" strokeWidth=".7" />
    <g className={styles.flame} stroke="none"><path d="M190 226q-6-5-2-11l3-6q-1 7 3 10q2 5-4 7Z" fill="#d2a45e" /><path d="M190 224q-3-4 1-8q3 5-1 8Z" fill="#fff0bd" /></g>
    <g className={styles.light} clipPath={`url(#${id}-inside)`} stroke="none"><ellipse cx="190" cy="216" rx="35" ry="47" fill={`url(#${id}-flame-halo)`} /></g>
  </g>;
}

export default function TurkOperator({ id }: { id: string }) {
  return <g data-operator="candlelit-cutaway">
    <defs>
      <clipPath id={`${id}-inside`}><path d="M76 116H510V357H76Z" /></clipPath>
      <path id={`${id}-person`} d={person.outline} />
      <linearGradient id={`${id}-walnut`} x1="0" y1="0" x2="1" y2=".3"><stop stopColor="#7b583d" /><stop offset=".35" stopColor="#97734d" /><stop offset="1" stopColor="#60432f" /></linearGradient>
      <radialGradient id={`${id}-wall-light`} gradientUnits="userSpaceOnUse" cx="190" cy="216" r="330"><stop stopColor="#9a7c48" /><stop offset=".45" stopColor="#565740" /><stop offset="1" stopColor="#29382f" /></radialGradient>
      <radialGradient id={`${id}-flame-halo`}><stop stopColor="#ffe3a0" stopOpacity=".24" /><stop offset="1" stopColor="#ebc879" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-skin-light`} gradientUnits="userSpaceOnUse" cx="190" cy="216" r="280"><stop stopColor="#f5d798" stopOpacity=".34" /><stop offset="1" stopColor="#ead29e" stopOpacity="0" /></radialGradient>
      <clipPath id={`${id}-person-clip`}><HumanSilhouette id={id} /></clipPath>
      <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1 4 6M1-1 6 4" stroke="#141d17" strokeWidth=".6" /><path d="M0 5 5 0" stroke="#bba476" strokeWidth=".35" opacity=".45" /></pattern>
      <pattern id={`${id}-floor-grain`} width="43" height="8" patternUnits="userSpaceOnUse"><path d="M0 2q11-2 22 0t21 0M3 5h31" stroke="#b08b59" strokeWidth=".5" fill="none" opacity=".5" /></pattern>
    </defs>
    <path d="M67 398 519 400 557 337 545 332 501 386H77Z" fill="#666048" opacity=".12" />
    <ellipse cx="84" cy="400" rx="10" ry="2.5" fill="#453c2d" opacity=".2" /><ellipse cx="496" cy="400" rx="10" ry="2.5" fill="#453c2d" opacity=".2" />
    <Casework id={id} />
    <g clipPath={`url(#${id}-inside)`}>
      <DisplayMovement />
      <IndicatorBoard />
      <SeatAndLegs id={id} />
      <PrivateBoard />
      <g transform={bodyTransform} data-operator-part="engraved-character" strokeLinecap="round" strokeLinejoin="round">
        <use href={`#${id}-person`} fill="#bfae86" stroke={ink} strokeWidth="1.1" />
        <path d={person.mid} stroke="#6e5c43" strokeWidth=".7" fill="none" />
        <path d={person.ink} stroke="#342d25" strokeWidth=".9" fill="none" />
      </g>
      <g className={styles.light} clipPath={`url(#${id}-person-clip)`}><path d="M200 117H460V361H200Z" fill={`url(#${id}-skin-light)`} /></g>
      <Candle id={id} />
    </g>
    <ControlLinkage />
  </g>;
}
