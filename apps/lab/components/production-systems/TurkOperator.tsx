import figureStudies from "@/lib/production-systems/figure-studies.json";
import { Grain, Screw } from "./engraving-primitives";
import OperatorMovement from "./OperatorMovement";
import OperatorTurk from "./OperatorTurk";
import { CabinetFinish, CabinetWoodDefs, CutawayFinish, SidePanel } from "./OperatorCabinet";
import { operatorLamp, operatorShadowTransform, operatorLightKeyframes } from "@/lib/production-systems/operator-light";
import { chessKeyframes, mainBoard, move, position, squareCenter } from "@/lib/production-systems/operator-chess";
import { moveStyle, OperatorControl, TurkArm, WorkingBoard } from "./OperatorChess";
import styles from "./turk-operator.module.css";

const ink = "#463a30", brass = "#ae9365", edge = "#c9aa78";
const person = figureStudies.studies.operator;
const bodyTransform = "translate(294 122) scale(.67)";
// The source ends at the forearms. Continue only the coat into the concealed
// seating bay; the retained wall deliberately occludes the lower anatomy.
const coat = "M382 250Q400 258 400 280L405 332H358L365 284Z";
function HumanSilhouette({ id }: { id: string }) {
  return <><path d={coat} /><use href={`#${id}-moving-silhouette`} /></>;
}

function PersonLayer({id,silhouette=false}:{id:string;silhouette?:boolean}) {
  const study=<use href={`#${id}-${silhouette?"person":"person-engraving"}`} transform={bodyTransform}/>;
  return <g data-operator-part={silhouette?undefined:"engraved-character"}>
    <g clipPath={`url(#${id}-body-still)`}>{study}</g>
    <g className={styles.chess} style={{...moveStyle(id,"lever"),transformOrigin:"340px 244px"}}><g clipPath={`url(#${id}-lever-hand)`}>{study}</g></g>
    <g className={styles.chess} style={moveStyle(id,"operatorHand")}><g clipPath={`url(#${id}-board-hand)`}>{study}</g></g>
  </g>;
}

/** The exposed bay is a side cutaway, not a collection of front-facing boxes. */
function Casework({ id }: { id: string }) {
  return <g stroke={ink} strokeLinejoin="round">
    <path d="M54 97 88.64 37H565.64L531 97Z" fill="#ad8b5d" strokeWidth="1" />
    <path d="M61 95 92 42H558L527 95Z" fill={`url(#${id}-walnut)`} strokeWidth=".6" />
    <path d="M75 90 99 48H547M90 58H546M86 65H542" fill="none" stroke={edge} strokeWidth=".5" />
    <OperatorTurk id={id} />
    <WorkingBoard id={id}/>
    <TurkArm id={id}/>
    <SidePanel id={id} />
    <path d="M54 97H531V378H54Z" fill={`url(#${id}-walnut)`} strokeWidth="1.3" />
    <path d="M71 112H514V360H71Z" fill="#b99460" strokeWidth=".6" />
    <path d="M76 116H510V357H76Z" fill="#29332b" />
    <path d="M62 105V370H523M73 359H513V113" fill="none" stroke={edge} strokeWidth=".75" />
    <path d="M76 116 71 112M510 116 514 112M76 357 71 360M510 357 514 360" strokeWidth=".7" />
    <g clipPath={`url(#${id}-inside)`} stroke="none">
      <path d="M76 116H510V357H76Z" fill="#2e352b" />
      <path d="M96.78 80H531V322H96.78Z" fill="#293a2e" />
      <g className={styles.illumination} style={{ animationName: `${id}-candle` }}>
        <path d="M96.78 80H531V322H96.78Z" fill={`url(#${id}-wall-light)`} />
      </g>
      <path d="M76 116 96.78 80V322L76 358Z" fill="#302b23" />
      <path d="M76 358 96.78 322H531L510 358Z" fill="#6b5940" />
      <path d="M76 358 96.78 322H531L510 358Z" fill={`url(#${id}-floor-grain)`} />
      <path d="M97 119V322H532" fill="none" stroke="#aa8654" strokeWidth=".65" opacity=".5" />
      <path d="M98 121H510V322H98Z" fill={`url(#${id}-hatch)`} opacity=".12" />
      <path d="M100 159H181M100 161H181M194 313H466M194 315H466M427 124V309M430 124V309" fill="none" stroke="#9b8459" strokeWidth=".5" opacity=".28" />
      {/* Fixed receiver clip; only the source-derived shadow offset dances.
          Three close source samples soften the edge without a blur/filter. */}
      <g className={styles.shadow} style={{ animationName: `${id}-shadow` }} fill="#111e17" data-operator-part="projected-person-shadow">
        {[{x:0,y:0},{x:.6,y:-.3},{x:-.6,y:.3}].map((p,i)=><g key={i} transform={`translate(${p.x} ${p.y})`} opacity=".42"><g transform={operatorShadowTransform}><HumanSilhouette id={id} /></g></g>)}
      </g>
      <path d="M185 116H192V329L185 340Z" fill="#453827" />
      <path d="M188 121V331" stroke="#b18c57" strokeWidth=".65" />
      <path d="M204 324H490M230 333H479M250 343H466M283 353H453" stroke="#362e23" strokeWidth=".65" opacity=".55" />
    </g>
    <CabinetFinish id={id} />
  </g>;
}

function IndicatorBoard({id}:{id:string}) {
  const underside={...mainBoard,y:mainBoard.y+69};
  return <g data-operator-part="underside-indicators" stroke={ink} strokeWidth=".6">
    <path d="M138 109H375L347 156H113Z" fill="#292a22"/>
    <path d="M145 109H371L346.75 151H120.75Z" fill="#8f815a"/>
    <path d={Array.from({length:9},(_,i)=>`M${145+i*226/8} 109l${mainBoard.skew} 42M${145+i*mainBoard.skew/8} ${109+i*42/8}h226`).join("")} fill="none" stroke="#423e2b" strokeWidth=".4"/>
    {Array.from({length:64},(_,i)=>{ const p=squareCenter(i,underside),active=position.some(piece=>piece.square===i), moving=i===move.from||i===move.to;
      return <g key={i}><path d={`M${p.x} ${p.y}v3l-1.5 1.2h3l-1.5-1.2`} fill="none" stroke={active?"#d2b572":"#746e4e"} strokeWidth=".7"/>{moving&&<circle className={styles.chess} style={{animationName:`${id}-${i===move.from?"origin":"destination"}`,opacity:i===move.from?1:.18}} cx={p.x} cy={p.y+2} r="1.8" fill="#e0c78a" stroke="none"/>}</g>;
    })}
    <path d="M123 154H346M143 112V106M369 112V106" fill="none" stroke={brass} strokeWidth="1.1"/>
  </g>;
}

function SeatedCoat({ id }: { id: string }) {
  return <g stroke={ink} data-operator-part="concealed-seat">
    <path d="M360 299Q388 293 420 299L434 304V319H360Z" fill="#6a4638" strokeWidth=".8" />
    <path d="M402 306H432M404 310H430" stroke="#b28561" strokeWidth=".7" />
    <path d={coat} fill="#837051" strokeWidth="1" />
    <path d="M375 284q-8 17-7 35m11-32 3 34m6-36q8 15 8 35" fill="none" stroke="#44382b" strokeWidth=".75" />
    <path d={coat} fill={`url(#${id}-hatch)`} opacity=".35" stroke="none" />
  </g>;
}

function CutawayWall({ id }: { id: string }) {
  const face = "M76 294H186V315H434V294H510V357H76Z";
  const section = "M76 294H186V315H434V294H510L513.46 288H437.46V309H189.46V288H79.46Z";
  return <g data-operator-part="cutaway-wall" stroke={ink} strokeLinejoin="round">
    <defs><clipPath id={`${id}-retained-wall`}><path d={face} /></clipPath></defs>
    <path d={face} fill={`url(#${id}-walnut)`} strokeWidth="1.1" />
    <g clipPath={`url(#${id}-retained-wall)`}><Grain x={79} y={296} w={430} h={61} /></g>
    <path d={section} fill="#b69b6d" strokeWidth=".8" />
    <path d={section} fill={`url(#${id}-hatch)`} opacity=".22" stroke="none" />
    <path d="M78 293H187V314H435V293H509" fill="none" stroke="#e0c391" strokeWidth=".8" />
    <CutawayFinish />
  </g>;
}

function PrivateBoard({id}:{id:string}) {
  return <g stroke={ink}>
    <path d="M226 299V318L244 288M348 304V319L362 292" fill="none" stroke="#816444" strokeWidth="3"/>
    <WorkingBoard id={id} inside/>
    <path d="M216 313H367" stroke={edge} strokeWidth=".65"/>
  </g>;
}

function Candle({ id }: { id: string }) {
  return <g data-operator-part="candle" stroke={ink} strokeWidth=".85">
    {/* The wall-mounted arm leaves a clear silhouette around wax and flame. */}
    <path d="M184 244H193V267H184Z" fill="#806844" />
    <Screw x={188.5} y={248} r={1.6} /><Screw x={188.5} y={263} r={1.6} />
    <path d="M193 258Q220 274 222 244" fill="none" stroke="#392f22" strokeWidth="5" />
    <path d="M193 257Q218 272 221 244" fill="none" stroke={brass} strokeWidth="3" />
    <path d="M194 256Q217 268 220 246" fill="none" stroke="#dec08a" strokeWidth=".65" />
    <path d="M210 244Q211 251 222 251Q233 251 234 244Z" fill="#a68b55" />
    <ellipse cx="222" cy="243" rx="13" ry="3.1" fill="#d5b679" />
    <ellipse cx="222" cy="242" rx="9" ry="1.8" fill="#f3ddb0" strokeWidth=".55" />
    <path d="M218 241V215Q222 212 226 215V241Z" fill="#eee1ba" />
    <path d="M219 218v12q2 3 2-1v-12m4 4v15" stroke="#b49a69" fill="none" strokeWidth=".65" />
    <path d="M219 215Q222 218 226 215" fill="none" stroke="#fff1cb" strokeWidth="1.2" />
    <path d="M222 215v-7" stroke="#574128" strokeWidth="1.2" />
    <g className={styles.illumination} style={{ animationName: `${id}-candle` }} stroke="none">
      <ellipse cx="222" cy="200" rx="62" ry="76" fill={`url(#${id}-flame-halo)`} />
      <ellipse cx="222" cy="200" rx="18" ry="25" fill={`url(#${id}-flame-core)`} />
    </g>
    <g className={styles.flame} style={{ animationName: `${id}-candle` }} stroke="none">
      <path d="M222 210Q212 205 217 195L224 184Q221 193 227 198Q231 207 222 210Z" fill="#d8a34f" />
      <path d="M222 208Q217 203 222 195Q229 203 222 208Z" fill="#ffe4a2" />
      <path d="M222 206Q219 202 222 199Q225 203 222 206Z" fill="#fff7da" />
    </g>
  </g>;
}

export default function TurkOperator({ id }: { id: string }) {
  return <g data-operator="candlelit-cutaway">
    <style>{operatorLightKeyframes(id)+chessKeyframes(id)}</style>
    <defs>
      <clipPath id={`${id}-inside`}><path d="M76 116H510V357H76Z" /></clipPath>
      <CabinetWoodDefs id={id} />
      <path id={`${id}-person`} d={person.outline} />
      <g id={`${id}-person-engraving`} strokeLinecap="round" strokeLinejoin="round">
        <use href={`#${id}-person`} fill="#bfae86" stroke={ink} strokeWidth="1.1"/>
        <path d={person.mid} stroke="#6e5c43" strokeWidth=".7" fill="none"/>
        <path d={person.ink} stroke="#342d25" strokeWidth=".9" fill="none"/>
      </g>
      <clipPath id={`${id}-lever-hand`}><path d="M310 163H348L356 249H310Z"/></clipPath>
      <clipPath id={`${id}-board-hand`}><path d="M286 263 389 252 394 283 335 307H286Z"/></clipPath>
      <clipPath id={`${id}-body-still`}><path clipRule="evenodd" d="M280 115H430V310H280ZM310 163H348L356 249H310ZM286 263 389 252 394 283 335 307H286Z"/></clipPath>
      <g id={`${id}-moving-silhouette`}><PersonLayer id={id} silhouette/></g>
      <linearGradient id={`${id}-walnut`} x1="0" y1="0" x2="1" y2=".3"><stop stopColor="#7b583d" /><stop offset=".35" stopColor="#97734d" /><stop offset="1" stopColor="#60432f" /></linearGradient>
      <radialGradient id={`${id}-wall-light`} gradientUnits="userSpaceOnUse" cx={operatorLamp.x} cy={operatorLamp.y} r="265"><stop stopColor="#d1ab68" stopOpacity=".88" /><stop offset=".3" stopColor="#b29556" stopOpacity=".6" /><stop offset=".7" stopColor="#87905c" stopOpacity=".18" /><stop offset="1" stopColor="#71825a" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-flame-halo`}><stop stopColor="#ffdc8c" stopOpacity=".45" /><stop offset=".35" stopColor="#f4cc72" stopOpacity=".15" /><stop offset="1" stopColor="#edbb66" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-flame-core`}><stop stopColor="#fff1b9" stopOpacity=".48" /><stop offset="1" stopColor="#ffe0a0" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${id}-skin-light`} gradientUnits="userSpaceOnUse" cx={operatorLamp.x} cy={operatorLamp.y} r="295"><stop stopColor="#ffe0a0" stopOpacity=".58" /><stop offset="1" stopColor="#ead29e" stopOpacity="0" /></radialGradient>
      <clipPath id={`${id}-person-clip`}><HumanSilhouette id={id} /></clipPath>
      <pattern id={`${id}-hatch`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1 4 6M1-1 6 4" stroke="#141d17" strokeWidth=".6" /><path d="M0 5 5 0" stroke="#bba476" strokeWidth=".35" opacity=".45" /></pattern>
      <pattern id={`${id}-floor-grain`} width="43" height="8" patternUnits="userSpaceOnUse"><path d="M0 2q11-2 22 0t21 0M3 5h31" stroke="#b08b59" strokeWidth=".5" fill="none" opacity=".5" /></pattern>
    </defs>
    <path d="M67 405 519 407 557 344 545 339 501 393H77Z" fill="#666048" opacity=".12" />
    <ellipse cx="84" cy="407" rx="10" ry="2.5" fill="#453c2d" opacity=".2" /><ellipse cx="496" cy="407" rx="10" ry="2.5" fill="#453c2d" opacity=".2" />
    <Casework id={id} />
    <g clipPath={`url(#${id}-inside)`}>
      <OperatorMovement />
      <IndicatorBoard id={id}/>
      <SeatedCoat id={id} />
      <PrivateBoard id={id}/>
      <OperatorControl id={id}/>
      <PersonLayer id={id}/>
      <g clipPath={`url(#${id}-person-clip)`}><g className={styles.illumination} style={{ animationName: `${id}-candle` }}><path d="M200 117H460V361H200Z" fill={`url(#${id}-skin-light)`} /></g></g>
      <Candle id={id} />
    </g>
    <CutawayWall id={id} />
  </g>;
}
