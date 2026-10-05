import figureStudies from "@/lib/production-systems/figure-studies.json";
import { round } from "./engraving-primitives";

const ink = "#463a30", edge = "#c9aa78";
const turk = figureStudies.studies.automaton;

/** Retain the source's engraved face and cloth, excluding its static playing arm.
 * These scan lines are selected at build time; no image or tracing runs in the browser.
 */
function studyRegion(path: string, left: number, top: number, right: number, bottom: number) {
  return [...path.matchAll(/M([\d.]+) ([\d.]+)h([\d.]+)/g)].flatMap(([, xx, yy, ww]) => {
    const x = +xx, y = +yy, end = x + +ww;
    return y >= top && y <= bottom && end > left && x < right
      ? [`M${Math.max(left, x)} ${y}h${round(Math.min(right, end) - Math.max(left, x))}`] : [];
  }).join("");
}
const regions = {
  head: { left: 207, top: 0, right: 321, bottom: 137 },
  coat: { left: 174, top: 126, right: 381, bottom: 324 },
  resting: { left: 345, top: 140, right: 467, bottom: 352 },
};
const strokes = Object.fromEntries(Object.entries(regions).map(([key, r]) => [key, {
  mid: studyRegion(turk.mid, r.left, r.top, r.right, r.bottom),
  ink: studyRegion(turk.ink, r.left, r.top, r.right, r.bottom),
}]));
const robe = "M429-75Q440-82 459-79L474-76 492-69 504-54 509-30 506-5 522 53Q459 65 400 54L414 15 404-18 407-47Q412-64 429-75Z";
const head = "M238 134 238 127 234 115 221 112 213 102 208 87 209 69 215 58 218 48 218 20 252 10 272 6 289 17 292 40 310 52 318 75 316 98 306 110 307 125 319 132 289 137 260 136Z";
const restingArm = "M347 145 373 177 398 200 426 210 447 222 455 245 460 269 460 289 455 308 455 326 449 342 445 349 440 344 440 329 436 345 431 348 430 334 425 346 420 346 422 326 422 313 428 301 428 288 422 271 416 258 410 252 400 250 389 243 372 234 355 224 348 235 338 202Z";
function Incisions({ region }: { region: keyof typeof regions }) {
  return <g fill="none" strokeLinecap="round">
    <path d={strokes[region].mid} stroke="#776751" strokeWidth=".65" />
    <path d={strokes[region].ink} stroke="#3b3028" strokeWidth=".85" />
  </g>;
}

/** Racknitz's likeness, HNF's seated exterior: a complete automaton supported
 * by a chair, with its playing shoulder kept at the existing linkage origin.
 */
export default function OperatorTurk({ id }: { id: string }) {
  return <g data-operator-part="complete-turk" stroke={ink} strokeLinejoin="round">
    <defs>
      <clipPath id={`${id}-robe`}><path d={robe} /></clipPath>
      <clipPath id={`${id}-turk-head`}><path d={head} /></clipPath>
      <clipPath id={`${id}-resting-arm`}><path d={restingArm} /></clipPath>
    </defs>
    {/* The chair back has its own silhouette and stops below the shoulders. */}
    <path d="M404 49V-46Q404-55 414-55H511Q521-55 521-45V48" fill="none" strokeWidth="5" />
    <path d="M404 49V-46Q404-55 414-55H511Q521-55 521-45V48" fill="none" stroke="#9a7951" strokeWidth="2.3" />
    <path d="M410-43H515V47H410Z" fill="#63503a" strokeWidth=".7" />
    <path d="M412-40H513M413-35V45M509-35V45" fill="none" stroke={edge} strokeWidth=".6" />
    <path d="M400 47H523L530 57H399Z" fill="#594330" strokeWidth="1" />
    <path d="M397 55Q457 61 529 54L524 64Q459 72 398 64Z" fill="#69573d" strokeWidth="1" />
    <path d={robe} fill="#7e8b71" strokeWidth="1.1" />
    <g clipPath={`url(#${id}-robe)`}>
      <path d="M428-70 444-64 457-39 476-73 488-67 472-12 493 55H423L444-15Z" fill="#c0b08c" strokeWidth=".7" />
      <path d="M429-71 442-67 453-36 443-11 416 52M482-72 470-28 472-11 502 53" fill="none" stroke="#4b5944" strokeWidth="2.2" />
      <path d="M431-70 444-67 455-35 445-10 419 54M484-71 473-29 475-11 505 53" fill="none" stroke="#c1b485" strokeWidth=".75" />
      <g transform="translate(274 -157) scale(.65)"><Incisions region="coat" /></g>
      <path d="M411 10Q456 18 508 6L509 18Q459 29 408 22Z" fill="#927b50" strokeWidth=".8" />
      <path d="M412 13Q456 22 508 10M410 20Q456 28 509 17" fill="none" stroke="#d9c193" strokeWidth=".65" />
      <path d="M447-36 451-27 450-19M456-32l5-1m-6 9 5-1m-5 9 5-1" fill="none" strokeWidth="1" />
    </g>
    <g transform="translate(274 -157) scale(.65)" data-operator-part="turk-resting-arm">
      <path d={restingArm} fill="#7d896f" strokeWidth="1.4" />
      <g clipPath={`url(#${id}-resting-arm)`}>
        <path d="M418 297H466V355H415Z" fill="#dac9a5" stroke="none" />
        <path d="M420 286 463 291 461 307 425 301Z" fill="#b9a176" strokeWidth=".8" />
        <Incisions region="resting" />
      </g>
    </g>
    <g transform="translate(274 -157) scale(.65)" data-operator-part="turk-head">
      <path d={head} fill="#e0d0af" strokeWidth="1.2" />
      <g clipPath={`url(#${id}-turk-head)`}>
        {/* The ivory wrap and muted cap follow the historical engraving. */}
        <path d="M212 50 218 20 252 10 272 6 289 17 297 49 277 55Z" fill="#96745e" strokeWidth=".6" />
        <path d="M207 63Q249 33 302 46L315 66Q267 52 210 87Z" fill="#eadfc5" strokeWidth=".75" />
        <path d="M297 72Q310 105 306 127L286 132 272 120 285 106Z" fill="#aa926f" stroke="none" opacity=".35" />
        <Incisions region="head" />
      </g>
    </g>
    <path d="M396 58Q452 66 523 58M399 62Q460 70 523 62" fill="none" stroke={edge} strokeWidth=".7" />
    <path d="M422 67V73M507 66V72M421 74H508" stroke="#504130" strokeWidth="2" />
    <path d="M465 76H486V89H465Z" fill="#5f644b" strokeWidth=".8" />
    <path d="M469 77V87M475 77V87M481 77V87" stroke="#ae9365" strokeWidth=".7" />
  </g>;
}
