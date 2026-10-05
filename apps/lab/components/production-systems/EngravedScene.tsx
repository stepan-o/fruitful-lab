import { Board, Candle, Floor, Frame, Grain, Hatch, Piece, Screw, Wheel, tones } from "./engraving-primitives";
import figureStudies from "@/lib/production-systems/figure-studies.json";
import styles from "./engravings.module.css";
import TurkOperator from "./TurkOperator";

export type SceneName = "operator" | "cabinet" | "board" | "inspection" | "release" | "folio" | "rest";
const descriptions: Record<SceneName, { number: string; title: string; caption: string; alt: string }> = {
  operator: { number: "II", title: "The judgment within", caption: "A system still needs someone to ask the right question.", alt: "A candlelit cabinet cutaway. Behind a sectioned wooden wall, the operator pulls the raised lever in front of him. A short link and roof rocker connect his forward grip to supported machinery on the far wall, then into the complete seated Turk above, with a wrapped turban, engraved face, waistcoat and green robe. His other hand and the Turk's articulated arm make the same pawn move, e2 to e4, on matching eight-by-eight boards: grip, lift, advance, place and release. The overhead position indicators follow the move. A clear candle on a brass bracket casts warm light and a gently dancing, aligned shadow. Nine meshing brass and dark steel wheels turn inside finely moulded walnut casework. Original interpretive machinery with credited figure studies after Racknitz; the repeating demonstration is not a complete game." },
  cabinet: { number: "III", title: "An architecture made visible", caption: "The surface, the mechanism and the decision belong together.", alt: "An open wooden chess automaton, reinterpreting Windisch's 1783 engraving. Doors reveal connected wheels, transmission rods and the working compartment beneath the board." },
  board: { number: "IV", title: "The position, not just the piece", caption: "Each local move changes the position of the whole board.", alt: "A precisely projected eight-by-eight chessboard with turned wooden pieces. A knight moves between two positions while the surrounding arrangement remains visible; an illustration of local decisions within a global objective, not a game analysis." },
  inspection: { number: "V", title: "The discipline of comparison", caption: "A reference makes an observation useful.", alt: "An engraved inspection table with two candidate chess pieces, a reference piece and a pivoting brass comparator. The instrument illustrates comparison without claiming measured results." },
  release: { number: "VI", title: "From candidate to edition", caption: "Creation becomes production through review and controlled release.", alt: "A small wooden production bench with a screw press, candidate sheets, an inspection surface and a drawer holding an approved edition." },
  folio: { number: "VII", title: "An inspectable record", caption: "Keep the reasoning close to the evidence.", alt: "An open engraved folio with ruled annotations, a diagram, dividers and a candle. The real sources are listed beside the illustration." },
  rest: { number: "VIII", title: "The next useful question", caption: "A place to continue the work.", alt: "A quiet workshop table, an empty chair, an open notebook and a candle: an invitation to continue the work." },
};

/** Offline scan-line geometry retains the source plate's anatomy and curved incisions. */
function FigureStudy({ study }: { study: "operator" | "automaton" }) {
  const data = figureStudies.studies[study];
  return <g strokeLinecap="round" strokeLinejoin="round">
    <path d={data.outline} fill="#dcc9a2" stroke={tones.ink} strokeWidth="1.1" />
    <path d={data.mid} stroke="#72614a" strokeWidth=".7" fill="none" />
    <path d={data.ink} stroke="#352e27" strokeWidth=".9" fill="none" />
  </g>;
}

function CabinetScene({ id }: { id: string }) {
  return <>
    <Floor id={id} /><g transform="translate(225 8) scale(.47)"><FigureStudy study="automaton" /></g>
    <path d="M127 201 159 156H478V331L450 376H127Z" fill={tones.edge} stroke={tones.ink} strokeWidth="1.5" />
    <Board x={153} y={158} width={288} depth={41} skew={-23} />
    <Frame x={127} y={210} w={320} h={137} />
    <Hatch id={`${id}-interior`} d="M138 221H437V337H138Z" gap={4} light />
    <path d="M244 220V337M164 224V326M215 224V326" stroke={tones.brass} strokeWidth="3" />
    <Wheel x={184} y={256} r={25} /><Wheel x={217} y={291} r={21} reverse /><Wheel x={176} y={314} r={19} />
    <path d="M214 257 301 274 374 232 402 271 301 274 327 318M374 232V221M402 271V221" stroke={tones.brass} strokeWidth="1.8" fill="none" />
    {[[301,274],[374,232],[402,271],[327,318]].map(([x,y],i)=><Screw key={i} x={x} y={y} />)}
    <path d="M272 326 320 296H427V328Z" fill="#6a5b45" stroke={tones.wood} /><Hatch id={`${id}-floor-inset`} d="M272 326 320 296H427V328Z" gap={5} light />
    <path d="M127 214 83 242V354L127 340Z" fill={tones.wood} stroke={tones.ink} /><Hatch id={`${id}-leftdoor`} d="M119 229 91 247V339L119 331Z" gap={3} cross />
    <path d="M446 214 511 241V356L446 339Z" fill={tones.wood} stroke={tones.ink} /><Hatch id={`${id}-rightdoor`} d="M455 230 501 248V340L455 331Z" gap={3} cross />
    <path d="M127 351H448L425 382H107Z" fill="#675640" stroke={tones.ink} /><path d="M107 374H425V394H107Z" fill={tones.wood} stroke={tones.ink} /><Grain x={112} y={377} w={307} h={13} />
    <path d="M253 376V392M174 381q11 11 23 0m111 0q11 11 23 0" stroke={tones.ink} fill="none" strokeWidth="1.8" />
    {[0,1,2,3,4,5].map(i=><Piece key={i} x={139+i*16} y={371} scale={.2} />)}
    <path d="M129 395v9h17v-9m264 0v9h17v-9" fill={tones.edge} stroke={tones.ink} />
  </>;
}

function ChessScene({ id }: { id: string }) {
  return <>
    <Floor id={id} />
    <Board x={57} y={159} width={415} depth={159} skew={65} />
    <Hatch id={`${id}-edge`} d="M117 326H560V342H117Z" gap={3.2} />
    <path d="M63 141H475M43 160l64 160M40 156l8 2m55 162 8-1" stroke={tones.brass} strokeWidth=".8" fill="none" />
    {Array.from({length:9},(_,i)=><path key={i} d={`M${57+i*415/8} 137v7`} stroke={tones.brass} strokeWidth=".7" />)}
    <Piece x={292} y={172} kind="king" scale={1.1} dark />
    <Piece x={392} y={191} scale={.75} dark /><Piece x={184} y={191} scale={.75} dark />
    <Piece x={149} y={251} scale={.95} /><Piece x={468} y={250} scale={.95} dark />
    <path d="M231.38 268.31 335.13 268.31 327 248.44" stroke={tones.brass} strokeWidth="1.2" fill="none" strokeDasharray="3 5" opacity=".8" />
    <g className={styles.knight}><Piece x={231.38} y={268.31} kind="knight" scale={1.25} /></g>
    <Piece x={434} y={310} kind="king" scale={1.35} />
    <path d="M139 365H497M139 361v8m358-8v8" stroke={tones.brass} strokeWidth=".8" />
    <path d="M310 359l6 6-6 6-6-6Z" fill={tones.brass} />
  </>;
}

function Bench({ id }: { id: string }) {
  return <g stroke={tones.ink} strokeWidth="1.3">
    <Floor id={id} /><path d="M79 294 123 260H493L539 294V310H79Z" fill={tones.wood} /><path d="M80 294H538" stroke={tones.ivory} />
    <Grain x={86} y={297} w={445} h={10} />
    <path d="M98 312V369H118L124 312M487 312L493 366H514V312" fill={tones.edge} /><path d="M105 315V363M504 315V360" stroke={tones.wood} />
    <path d="M125 338H487V347H125Z" fill={tones.wood} /><Grain x={129} y={339} w={352} h={7} />
  </g>;
}

function InspectionScene({ id }: { id: string }) {
  return <><Bench id={id} />
    <path d="M160 265H419V275H160ZM277 263V116H294V263Z" fill={tones.brass} stroke={tones.ink} strokeWidth="1.3" />
    <path d="M281 125V254M289 125V254" stroke={tones.ivory} strokeWidth=".8" />
    <g transform="translate(286 131)"><g className={styles.comparator} stroke={tones.ink} strokeWidth="1.1" fill={tones.brass}>
      <path d="M-100-4H100V4H-100Z" /><path d="M-92 4v80m184-80v80" fill="none" /><path d="M-120 87Q-92 100-64 87L-68 83H-116Zm184 0Q92 100 120 87L116 83H68Z" fill={tones.ivory} />
      <Piece x={-92} y={82} scale={.8} /><Piece x={92} y={82} scale={.8} dark />
      <path d="M0-7V-48L-3-53L-4-9" fill={tones.edge} /><circle r="7" fill={tones.ivory} /><circle r="2" fill={tones.ink} />
    </g></g>
    <path d="M253 91Q287 64 320 91M259 94Q287 73 313 94" stroke={tones.brass} fill="none" />
    <Piece x={466} y={276} scale={.65} />
    <path d="M131 283H214m-83 5h64m192-4h46" stroke={tones.ink} opacity=".5" strokeWidth=".6" />
  </>;
}

function ReleaseScene({ id }: { id: string }) {
  return <><Bench id={id} />
    <Frame x={214} y={130} w={179} h={149} />
    <path d="M241 146H365V257H241Z" fill={tones.paper} /><Hatch id={`${id}-press`} d="M365 146H384V264H365Z" gap={3} />
    <path d="M294 144V77H308V144Z" fill={tones.brass} stroke={tones.ink} />
    <path d={Array.from({length:14},(_,i)=>`M293 ${81+i*4}l16 -3`).join("")} stroke={tones.ink} strokeWidth=".7" />
    <ellipse cx="301" cy="76" rx="37" ry="9" fill={tones.ivory} stroke={tones.ink} /><path d="M265 76H337m-57-6 43 12m-43 0 43-12" stroke={tones.ink} />
    <g className={styles.press}><path d="M296 143H307V206H296Z" fill={tones.brass} stroke={tones.ink} /><path d="M263 202H340V216H263Z" fill={tones.edge} stroke={tones.ink} /><Grain x={268} y={204} w={66} h={8} /></g>
    <path d="M260 249H349V258H260Z" fill={tones.ivory} stroke={tones.ink} />
    {Array.from({length:5},(_,i)=><path key={i} d={`M${120+i*3} ${247-i*5}l48 -5 22 31-53 7Z`} fill={tones.paper} stroke={tones.ink} strokeWidth=".7" />)}
    <path d="M402 237H484L504 266H414Z" fill={tones.ivory} stroke={tones.ink} /><path d="M418 246h47m-44 6h29m-24 6h42" stroke={tones.wood} strokeWidth=".7" />
    <path d="M389 303H516L533 325V346H390Z" fill={tones.edge} stroke={tones.ink} /><path d="M398 304H509L523 323H400Z" fill={tones.ivory} /><path d="M390 325H533V350H390Z" fill={tones.wood} stroke={tones.ink} /><Grain x={395} y={328} w={132} h={18} /><path d="M448 333q12 12 25 0" stroke={tones.ink} fill="none" strokeWidth="2" />
  </>;
}

function Folio({ id }: { id: string }) {
  return <g stroke={tones.ink} strokeWidth="1">
    <path d="M131 179Q209 154 283 185Q346 153 449 171L470 321Q365 302 289 336Q218 307 112 324Z" fill={tones.edge} />
    <path d="M131 169Q209 144 283 175Q346 143 449 161L466 311Q365 292 289 326Q218 297 112 314Z" fill={tones.ivory} />
    <path d="M139 166Q211 146 283 175Q354 148 441 158L456 300Q363 285 289 316Q210 289 122 304Z" fill={tones.paper} />
    <Hatch id={`${id}-pages`} d="M112 306Q216 290 289 319Q363 289 466 304V318Q365 300 289 330Q218 301 112 322Z" gap={3} />
    <path d="M283 175 289 316M277 181 282 306M292 181 297 306" stroke={tones.wood} fill="none" />
    <path d={Array.from({length:13},(_,i)=>`M${146-i*.65} ${191+i*7.5}q55 -9 116 7m52 -5q48 -18 116 -12`).join("")} fill="none" stroke={tones.wood} strokeWidth=".65" />
    <path d="M179 207H227V249H179Z" fill={tones.ivory} /><circle cx="203" cy="229" r="13" fill="none" /><path d="M203 216v26m-13-13h26" />
    <path d="M326 203h77v56h-77Z" fill={tones.paper} /><path d="M339 249v-21h19v21m10 0v-32h19v32M334 250H396" stroke={tones.wood} />
    <path d="M302 312 320 309 315 351 307 341 298 348Z" fill="#793c3c" />
  </g>;
}

function FolioScene({ id }: { id: string }) {
  return <><Floor id={id} /><Folio id={id} /><Candle x={484} y={226} id={`${id}-light`} scale={.95} />
    <g transform="translate(128 337) rotate(-26)" stroke={tones.ink} strokeWidth="1"><path d="M0 0 116-10 118-4 4 7Z" fill={tones.wood} /><path d="M10 1H104" stroke={tones.ivory} /><path d="M116-10 132-8 118-4" fill={tones.ink} /></g>
    <g transform="translate(413 353)" stroke={tones.ink}><path d="M0 0 43-81 29-6M43-81 45-92 51-90 49-79 65-9" fill={tones.brass} /><circle cx="46" cy="-80" r="4" fill={tones.ivory} /></g>
  </>;
}

function RestScene({ id }: { id: string }) {
  return <>
    <Floor id={id} />
    <g stroke={tones.ink} strokeWidth="1.4"><path d="M128 141H221V251H207V157H143V251H128Z" fill={tones.wood} /><Grain x={132} y={142} w={85} h={11} /><path d="M149 163V239M167 163V239M186 163V239M204 163V239" stroke={tones.wood} strokeWidth="5" /><path d="M124 247H224L244 269H139Z" fill={tones.wood} /><path d="M141 269V365H154L160 270m56-10 17 83h13l-10-76" fill={tones.edge} /></g>
    <path d="M243 228H504L538 260H226Z" fill={tones.wood} stroke={tones.ink} /><path d="M226 260H538V273H226Z" fill={tones.edge} stroke={tones.ink} /><Grain x={230} y={262} w={304} h={9} /><path d="M247 273V363H261L269 273M499 273L507 363H523V273" fill={tones.wood} stroke={tones.ink} />
    <g transform="translate(197 138) scale(.48)"><Folio id={id} /></g>
    <Candle x={475} y={242} id={`${id}-light`} scale={.9} />
    <path d="M410 250l24-38 3 3-23 37Z" fill={tones.brass} stroke={tones.ink} />
  </>;
}

export default function EngravedScene({ scene, compact = false }: { scene: SceneName; compact?: boolean }) {
  const id = `profile-${scene}`, data = descriptions[scene];
  return <figure className={`${styles.scene} ${compact ? styles.compact : ""}`} data-engraving={scene} data-playing="false">
    <svg viewBox={scene === "operator" ? "0 -172 600 592" : "0 0 600 420"} role="img" aria-labelledby={`${id}-title ${id}-desc`} className={styles.art}>
      <title id={`${id}-title`}>{data.title}</title><desc id={`${id}-desc`}>{data.alt}</desc>
      {scene === "operator" ? <TurkOperator id={id} /> : scene === "cabinet" ? <CabinetScene id={id} /> : scene === "board" ? <ChessScene id={id} /> : scene === "inspection" ? <InspectionScene id={id} /> : scene === "release" ? <ReleaseScene id={id} /> : scene === "folio" ? <FolioScene id={id} /> : <RestScene id={id} />}
    </svg>
    <figcaption><span className={styles.figureNumber}>{data.number}</span><span>{data.caption}</span></figcaption>
  </figure>;
}
