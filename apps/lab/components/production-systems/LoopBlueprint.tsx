import type { CSSProperties } from "react";
import styles from "@/app/(stepanoskin)/stepanoskin/production-systems/profile.module.css";
import figureStudies from "@/lib/production-systems/figure-studies.json";

import { Grain, Screw, round } from "./engraving-primitives";
import motion from "./turk-conveyor.module.css";
import TurkConveyor from "./TurkConveyor";
import TurkMovement from "./TurkMovement";

const ink = "#463a30";
const paper = "#f4f2eb";
const brass = "#ae9365";
const wood = "#917456";
const figure = figureStudies.studies.automaton;
const trayPeriod = 2.4;
const outfeedLead = 58 / 88 * trayPeriod;

// Synthetic normal-model examples: estimate ± 1.96 SE and two-sided p-values.
// Most estimates sit near zero; one large gain and two losses punctuate the run.
// Cases 2 and 7 have fictional underlying effects of 0 and +61 respectively.
// Their hindsight labels are narrative facts, not inferences from p-values.
// These are editorial examples, never the owner's or an employer's results.
const outcomes = [
  { estimate: 2, low: -19.56, high: 23.56, p: ".856", kind: "neutral" },
  { estimate: -5, low: -24.60, high: 14.60, p: ".617", kind: "neutral" },
  { estimate: 14, low: 2.24, high: 25.76, p: ".020", kind: "neutral" },
  { estimate: -36, low: -49.72, high: -22.28, p: "<.001", kind: "loss" },
  { estimate: 1, low: -22.52, high: 24.52, p: ".934", kind: "neutral" },
  { estimate: -4, low: -19.68, high: 11.68, p: ".617", kind: "neutral" },
  { estimate: 61, low: 47.28, high: 74.72, p: "<.001", kind: "gain" },
  { estimate: 26, low: -17.12, high: 69.12, p: ".237", kind: "neutral" },
  { estimate: -29, low: -42.72, high: -15.28, p: "<.001", kind: "loss" },
  { estimate: -2, low: -21.60, high: 17.60, p: ".841", kind: "neutral" },
] as const;
const resultInk = { neutral: "#766c5c", loss: "#793c3c", gain: "#4d6b4d" };

function ResultTray({ x, index }: { x: number; index: number }) {
  const result = outcomes[index % outcomes.length];
  const xx = (n: number) => round(25 + n * .44);
  return <g transform={`translate(${x} 0)`} data-outcome={index % outcomes.length} stroke={ink} strokeWidth=".8">
    <path d="M0 6H68V60H0Z" fill="#584d3d" /><path d="M0 3H68V57H0Z" fill="#c4b38c" />
    <path d="M3 6H65V54H3Z" fill={paper} />
    <path d="M8 19H60M25 23V48" stroke="#b8ad97" strokeWidth=".6" />
    <path d="M12 13H28M38 13H56" stroke={brass} strokeWidth=".6" />
    <g stroke={resultInk[result.kind]} fill={resultInk[result.kind]}>
      <path d={`M${xx(result.low)} 36H${xx(result.high)}m0-3v6M${xx(result.low)} 33v6`} strokeWidth="1.1" />
      <circle cx={xx(result.estimate)} cy="36" r={result.kind === "gain" ? 2.6 : 1.8} />
    </g>
    <path d="M12 50H55" stroke={brass} strokeWidth=".5" />
  </g>;
}

/** A moving paper log shares the conveyor's exact outcome order and speed. */
function ResultRegister() {
  // At the instant a specimen leaves the conveyor, its estimate reaches the
  // top of the register. Older rows descend; the 10-row repeat is seamless.
  const firstRow = 378 + 8.5 - outfeedLead / trayPeriod * 8.5;
  return <g>
    <defs><clipPath id="turk-register-window"><path d="M402 378H570V468H402Z" /></clipPath></defs>
    <path d="M392 350H582V360H392Z" fill="#302b24" stroke={ink} />
    <path d="M403 353H574V472Q574 486 564 486H404Z" fill="#4b382b" opacity=".35" />
    <path d="M399 352H575V472Q574 481 567 483H392Q402 478 399 466Z" fill="#f0e7d0" stroke={ink} strokeWidth="1" />
    <path d="M400 356H574M404 478H567" stroke="#cbbb96" strokeWidth=".7" />
    <path d="M406 374H565M456 371V468" stroke="#8f826b" strokeWidth=".8" />
    <text x="408" y="365" fill={ink} fontFamily="Georgia, serif" fontSize="9" fontStyle="italic">Effect B − A</text>
    <text x="561" y="370" fill="#766c5c" fontFamily="Georgia, serif" fontSize="9" textAnchor="end">p</text>
    <text x="456" y="373" fill={ink} fontFamily="Georgia, serif" fontSize="9" textAnchor="middle">0</text>
    <path d="M406 376v90M535 376v90" stroke="#b6a98c" strokeWidth=".5" strokeDasharray="1 3" />
    <g clipPath="url(#turk-register-window)">
      <g className={motion.registerTrack}>
        {Array.from({ length: 22 }, (_, i) => {
          const row = i - 11, index = (row + 27) % outcomes.length;
          const r = outcomes[index], y = round(firstRow + row * 8.5);
          return <g key={i} data-outcome={index} data-register-row={row} transform={`translate(0 ${y})`}>
            <path d="M403-4H569V4.5H403Z" fill={resultInk[r.kind]} opacity={r.kind === "neutral" ? .025 : .095} />
            <path d="M406 4H565" stroke="#d7ccb1" strokeWidth=".45" />
            <path d={Array.from({ length: 7 }, (_, j) => {
              const x = 456 + r.estimate + (((index * 13 + j * 17) % 37) - 18);
              return `M${x} -1.3v2.6`;
            }).join("")} stroke={resultInk[r.kind]} strokeWidth=".6" opacity=".25" />
            <path d={`M${456 + r.low} 0H${456 + r.high}m0-2v4M${456 + r.low} -2v4`} stroke={resultInk[r.kind]} strokeWidth={r.kind === "neutral" ? .85 : 1.2} fill="none" />
            <circle cx={456 + r.estimate} cy="0" r={r.kind === "gain" ? 2.8 : r.kind === "loss" ? 2.1 : 1.5} fill={resultInk[r.kind]} />
            <text x="565" y="2.5" fill="#766c5c" fontFamily="Georgia, serif" fontSize="8" textAnchor="end">{r.p}</text>
          </g>;
        })}
      </g>
    </g>
    <path d="M392 483q8-3 7-10h176q0 8-8 10Z" fill="#cfbf99" stroke={ink} strokeWidth=".7" />
    <path d="M401 475H569" stroke="#f2e7c9" strokeWidth=".8" />
    <path d="M390 351H581" stroke={brass} strokeWidth="4" />
    <Screw x={391} y={351} r={3} /><Screw x={581} y={351} r={3} />
  </g>;
}

/** Verdicts are carried by the exhaust itself, not by a caption or dashboard.
 * The sequence follows the outfeed's reversed order as trays move to the right.
 * Each ten-result period takes 24 seconds, with one emission per 2.4-second tray.
 */
function ResultExhalation() {
  const verdicts = [
    ["no clear lift"], ["inconclusive"], ["later: false positive"], ["negative"],
    ["noise"], ["no clear lift"], ["large gain"], ["later: great thing", "we dropped"],
    ["negative"], ["inconclusive"],
  ];
  return <g transform="translate(620 251)" aria-hidden="true">
    {outcomes.map((result, index) => <g key={index} className={motion.smoke} data-outcome={index} style={{
      "--delay": `${round(outfeedLead + ((6 - index + outcomes.length) % outcomes.length) * trayPeriod - outcomes.length * trayPeriod)}s`,
      "--still-x": index === 0 ? "-14px" : index === 3 ? "-39px" : "-60px",
      "--still-y": index === 0 ? "-29px" : index === 3 ? "-92px" : "-154px",
      "--still-opacity": [0, 3, 6].includes(index) ? .88 : 0,
    } as CSSProperties}>
      <g fill="none" stroke="#90928a" strokeWidth=".7" opacity=".2">
        <path d="M-14 17C-43 7-22-5-34-17S-63-32-45-46M17 22C44 9 14-8 32-20S58-39 45-53" />
        <path d="M-1 23C-18 12 7 2-5-10M23-26c-10-14 5-18 13-24" strokeWidth=".45" />
      </g>
      <text className={motion.smokeValue} textAnchor="middle" y="-7">p {result.p.startsWith("<") ? result.p : `= ${result.p}`}</text>
      <text className={motion.smokeVerdict} textAnchor="middle" y="11">
        {verdicts[index].map((line, row) => <tspan key={line} x="0" dy={row === 0 ? 0 : 16}>{line}</tspan>)}
      </text>
    </g>)}
  </g>;
}

/** The chair and coat are behind the work surface; only the hands cross it. */
function SeatedTurk() {
  return <g>
    <path d="M302 289V184Q302 175 312 175H447Q458 175 458 188V290" fill="none" stroke={ink} strokeWidth="7" />
    <path d="M302 289V184Q302 175 312 175H447Q458 175 458 188V290" fill="none" stroke={wood} strokeWidth="4" />
    <path d="M305 191H455V275H305Z" fill="#6d5842" stroke={ink} />
    <Grain x={310} y={195} w={140} h={73} />
    <path d="M301 273H458V284H301Z" fill="#70513c" stroke={ink} />
    <path d="M315 248Q326 278 321 303H448Q447 277 437 248Z" fill="#8a6f58" stroke={ink} />
    <path d="M326 251q16 31 9 48m10-48q12 29 7 48m10-48q7 28 5 48m11-48q1 24 7 48m12-48q-2 27 9 48m9-48q-1 23 13 48" fill="none" stroke="#514237" strokeWidth=".75" />
    <g transform="translate(168 21) scale(.75)">
      <g clipPath="url(#turk-still-figure)"><use href="#turk-engraved-figure" /></g>
    </g>
  </g>;
}

/** One experiment travels as a paired specimen, never as a declared winner. */
function ExperimentTray({ x }: { x: number }) {
  return <g transform={`translate(${x} 0)`} stroke={ink} strokeWidth=".8">
    <path d="M0 6H68V60H0Z" fill="#584d3d" />
    <path d="M0 3H68V57H0Z" fill="#c4b38c" />
    <path d="M3 6H65V54H3Z" fill="#e7dcc1" />
    {[{ letter: "A", y: 9, color: "#746c55" }, { letter: "B", y: 33, color: "#793c3c" }].map(({ letter, y, color }) => <g key={letter} transform={`translate(7 ${y})`}>
      <path d="M0 0H54V17H0Z" fill={paper} />
      <path d="M19 3V14M25 5H47M25 9H43M25 13H47" stroke={color} strokeWidth=".65" />
      <text x="9" y="12.5" textAnchor="middle" fill={color} stroke="none" fontFamily="Georgia, serif" fontSize="14">{letter}</text>
    </g>)}
    <path d="M4 28H64M4 30H64" stroke={brass} strokeWidth=".6" />
    <path d="M2 4H66M2 4V56" stroke="#f2e8cb" strokeWidth=".6" fill="none" />
  </g>;
}

/** Racknitz's figure is three batched vector paths, reused by the cabinet study. */
function TurkFigure() {
  return <g strokeLinecap="round" strokeLinejoin="round">
    <path d={figure.outline} fill="#e4d8bf" stroke={ink} strokeWidth="1.2" />
    <g clipPath="url(#turk-figure-silhouette)" fill="#793c3c" opacity=".24">
      <path d="M207 49 216 17 275 4 296 43 281 55Z" />
      <path d="M150 189 181 156 224 144 220 209 193 245 174 323 209 323 245 164 281 166 307 324 379 326 347 230 387 249 411 253 440 296 463 292 462 240 427 211 391 202 350 145 316 132 282 126 237 128 184 147Z" />
    </g>
    <path d={figure.mid} stroke="#776751" strokeWidth=".65" fill="none" />
    <path d={figure.ink} stroke="#3b3028" strokeWidth=".85" fill="none" />
  </g>;
}

export default function LoopBlueprint() {
  return (
    <figure className={styles.blueprint} aria-labelledby="loop-title" data-engraving="conveyor" data-playing="false" style={{ "--tray-period": `${trayPeriod}s`, "--cycle-period": `${outcomes.length * trayPeriod}s` } as CSSProperties}>
      <div className={styles.plateHeader}><span>Fig. 01 / The experiment engine</span><span>Illustrative experiments</span></div>
      <svg className={styles.loopSvg} viewBox="0 0 680 550" role="img" aria-labelledby="loop-title loop-description">
        <title id="loop-title">The Mechanical Turk operating an A/B experiment conveyor</title>
        <desc id="loop-description">An engraved Mechanical Turk sits in a chair behind a walnut cabinet. Its forearms reach over a continuously moving conveyor of jointed chessboard slats, supported by bolted brackets and end bearings. Inside the cabinet, five finely toothed brass wheels mesh beneath striped silver bridges and jewel bearings. The last wheel shares an axle with a guarded chain that drives the conveyor’s head drum; a return run travels beneath the fixed frame. The Turk stamps paired A/B specimens into effect estimates. P-values and verdicts exhale from the outfeed in clear lettering that rises and gradually dissolves into smoke: mostly uncertain or near-zero outcomes, some negatives and a rare large gain. The paper register advances with each test, with mild gray, red and green highlights matching uncertain, negative and positive effects. Occasional hindsight reads “false positive” or “great thing we dropped.” These are synthetic normal-model examples and fictional hindsight, not employer results or conclusions inferred from p-values.</desc>
        <defs>
          <pattern id="turk-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0V4" stroke={ink} strokeWidth=".55" opacity=".45" /></pattern>
          <pattern id="turk-crosshatch" width="5" height="5" patternUnits="userSpaceOnUse"><path d="m0 0 5 5M0 5 5 0" stroke={ink} strokeWidth=".5" opacity=".45" /></pattern>
          <pattern id="turk-checker" width="44" height="32" patternUnits="userSpaceOnUse"><rect width="44" height="32" fill="#c4b08b" /><path d="M0 0H22V16H0ZM22 16H44V32H22Z" fill="#827b60" /><path d="M4 0V32M9 0V32M15 0V32M26 0V32M31 0V32M37 0V32" stroke={ink} strokeWidth=".45" opacity=".25" /><path d="M0 0V32M22 0V32M44 0V32" stroke="#504737" strokeWidth="1.3" /><path d="M1.5 0V32M23.5 0V32" stroke="#e2cca1" strokeWidth=".6" /></pattern>
          <clipPath id="turk-belt-window"><path d="M63 0H463V64H63Z" /></clipPath>
          <clipPath id="turk-results-window"><path d="M463 0H628V64H463Z" /></clipPath>
          <g id="turk-engraved-figure"><TurkFigure /></g>
          <clipPath id="turk-figure-silhouette"><path d={figure.outline} /></clipPath>
          <clipPath id="turk-still-figure"><path d="M0 0H470V238H411V355H0Z" /></clipPath>
          <clipPath id="turk-left-hand"><path d="M0 250H166V355H0Z" /></clipPath>
          <clipPath id="turk-working-hand"><path d="M411 222H470V355H411Z" /></clipPath>
          <clipPath id="turk-chamber"><path d="M158 354H369V469H158Z" /></clipPath>
        </defs>

        <SeatedTurk />

        {/* One ground plane and one case: everything has a physical support. */}
        <path d="M94 510 169 537 611 504 556 478Z" fill="#b7ad94" opacity=".16" />
        <path d="M116 516 175 530 598 503M138 514 180 523 581 500M183 517 557 497" fill="none" stroke="#938775" strokeWidth=".65" opacity=".35" />
        <path d="M146 483V517Q155 526 166 516L172 483M548 483V517Q558 524 567 516L573 483" fill="#70513c" stroke={ink} strokeWidth="1.3" />
        <path d="M152 491v24m7-24v26m395-26v25m7-25v26" stroke="#c1a278" strokeWidth=".7" />
        <path d="M589 323 625 264V444L589 496Z" fill="#6d5842" stroke={ink} strokeWidth="1.5" />
        <path d="M598 342 617 310V441L598 469Z" fill="#4f4032" stroke={ink} />
        <path d="M589 323 625 264V444L589 496Z" fill="url(#turk-hatch)" />
        <path d="M129 327H589V492H129Z" fill={wood} stroke={ink} strokeWidth="1.6" />
        <Grain x={133} y={333} w={452} h={154} />
        <path d="M136 337H582V478H136Z" fill="none" stroke="#c4ab81" strokeWidth="1" />
        <path d="M145 344H382V480H145Z" fill="#503e2f" stroke={ink} />
        <path d="M158 354H369V469H158Z" fill="#302b24" stroke={ink} />
        <path d="M158 354H369V469H158Z" fill="url(#turk-crosshatch)" />
        <path d="M160 356 179 370H369M179 370V468" fill="none" stroke="#79664a" strokeWidth="1" />

        <TurkMovement />
        {/* The left door opens toward the reader, with real hinges and a recessed panel. */}
        <path d="M145 344 89 363V493L145 480Z" fill="#73533d" stroke={ink} strokeWidth="1.4" />
        <path d="M136 355 99 369V481L136 471Z" fill="#a08058" stroke={ink} />
        <path d="M131 362 104 372V475L131 466Z" fill="#6c503b" stroke={ink} strokeWidth=".8" />
        <path d="M145 344 89 363V493L145 480Z" fill="url(#turk-hatch)" />
        <path d="M92 366V489M139 351V475" fill="none" stroke="#c2a67b" strokeWidth=".7" />
        <path d="M141 364H150V377H141ZM141 447H150V460H141Z" fill={brass} stroke={ink} strokeWidth=".7" />
        <ellipse cx="102" cy="425" rx="3" ry="5" fill={brass} stroke={ink} />

        {/* The moving register remains a physical paper roll inside the cabinet. */}
        <path d="M388 344H579V478H388Z" fill="#6d503c" stroke={ink} />
        <path d="M128 479H590V488H128ZM124 490H594V499H124Z" fill="#73523a" stroke={ink} />
        <path d="M130 482H587M127 494H591" stroke="#cfb88a" strokeWidth="1" />
        <ResultRegister />

        <TurkConveyor>
          <g transform="translate(0 250) skewX(-30)">
            <g clipPath="url(#turk-belt-window)">
              <g className={motion.belt}>
                <path d="M-44 0H748V64H-44Z" fill="url(#turk-checker)" stroke={ink} />
                {Array.from({ length: 9 }, (_, i) => <ExperimentTray key={i} x={-26 + i * 88} />)}
              </g>
            </g>
            <g clipPath="url(#turk-results-window)">
              <g className={motion.results}>
                <path d="M-924 0H748V64H-924Z" fill="url(#turk-checker)" stroke={ink} />
                {Array.from({ length: 19 }, (_, i) => <ResultTray key={i} x={-906 + i * 88} index={i} />)}
              </g>
            </g>
          </g>
        </TurkConveyor>

        {/* The tabletop occludes the seated torso. Only the left forearm and the
            working right hand are redrawn in front of the moving specimens. */}
        <g transform="translate(168 21) scale(.75)">
          <g clipPath="url(#turk-left-hand)"><use href="#turk-engraved-figure" /></g>
        </g>
        <path d="M505 305V328H517V305Z" fill={brass} stroke={ink} />
        <path d="M509 307V326M514 307V326" stroke="#dfc99b" strokeWidth=".7" />
        <g className={motion.feedHandle}>
          <path d="M510 309 497 285" stroke={ink} strokeWidth="5" />
          <path d="M510 308 497 285" stroke={brass} strokeWidth="2.8" />
          <path d="M484 285H507" stroke={ink} strokeWidth="6" strokeLinecap="round" />
          <path d="M485 283H506" stroke="#b29262" strokeWidth="2" strokeLinecap="round" />
        </g>
        <Screw x={510} y={309} r={4} />
        <g transform="translate(168 21) scale(.75)">
          <g className={motion.hand} clipPath="url(#turk-working-hand)"><use href="#turk-engraved-figure" /></g>
        </g>
        <path d="M610 249q10-5 20 0v6q-10 5-20 0Z" fill={brass} stroke={ink} strokeWidth=".8" />
        <ellipse cx="620" cy="249" rx="10" ry="3" fill="#554b3a" stroke={ink} strokeWidth=".7" />
        <ResultExhalation />
        <path d="M149 507H474" stroke="#a99b7d" strokeWidth=".6" opacity=".45" />
      </svg>
    </figure>
  );
}
