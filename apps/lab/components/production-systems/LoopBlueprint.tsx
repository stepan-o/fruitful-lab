import styles from "@/app/(stepanoskin)/stepanoskin/production-systems/profile.module.css";

import { Grain, Hatch } from "./engraving-primitives";
import motion from "./engravings.module.css";

const ink = "#493f31";
const paper = "#f4f2eb";
const brass = "#9a8050";

function CatalogLeaf({ x, y, variant = 0 }: { x: number; y: number; variant?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 8-5H43V43L35 48H0Z" fill="#deded0" stroke={ink} />
      <path d="M0 0H35V48H0Z" fill={paper} stroke={ink} />
      <path d="M35 0 43-5M35 48 43 43" fill="none" stroke={ink} />
      <path d="M6 7H29M6 39H21" stroke={brass} />
      {variant === 0 ? <path d="m7 29 7-11 6 6 8-10M7 33H28" fill="none" stroke={ink} /> :
        variant === 1 ? <g fill="none" stroke={ink}><path d="m14 17-6 7 6 7m8-14 6 7-6 7M20 15 16 33" /></g> :
          <g fill="#82988a" stroke={ink}><circle cx="18" cy="23" r="7" /><path d="M7 33 13 27M25 28 29 33" fill="none" /></g>}
    </g>
  );
}

function Bolt({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><circle r="2.2" fill={paper} stroke={ink} strokeWidth=".8" /><path d="m-1.2 1.2 2.4-2.4" stroke={ink} strokeWidth=".7" /></g>;
}

export default function LoopBlueprint() {
  return (
    <figure className={styles.blueprint} aria-labelledby="loop-caption" data-engraving="conveyor" data-playing="false">
      <div className={styles.plateHeader}><span>Fig. 01 / The working method</span><span>Production ↔ evidence</span></div>
      <svg className={styles.loopSvg} viewBox="0 0 600 420" role="img" aria-labelledby="loop-title loop-description">
        <title id="loop-title">An illustrated production and learning apparatus</title>
        <desc id="loop-description">A printmaking-style machine carries individual content cards through production and review. An observation instrument records what happens after release; a brass return path carries that evidence back to the next specification. A conceptual metaphor, not a system architecture or a live result.</desc>
        <defs>
          <pattern id="profile-etch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V5" stroke={ink} strokeWidth=".55" opacity=".3" /></pattern>
          <clipPath id="profile-belt-clip"><path d="M78 196H505V257H78Z" /></clipPath>
          <pattern id="profile-rib" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M1 0V6" stroke={ink} strokeWidth=".8" opacity=".5" /></pattern>
        </defs>

        {/* Ground and the rear return line establish a single, supported apparatus. */}
        <path d="M52 351 183 387 553 333 421 302Z" fill="#e3e3d7" opacity=".65" />
        <path d="M67 351 185 379 538 329M85 355 185 374 518 326M114 354 184 368" fill="none" stroke="#c3c8bb" strokeWidth=".7" />
        <g fill="none" stroke={brass} strokeWidth="2">
          <path d="M454 228V188Q454 178 444 178H205Q188 178 188 195V223" />
          <path d="M461 229V187Q461 171 444 171H205Q181 171 181 195V222" />
        </g>
        <path d="M114 303H474L491 295V357L474 371H114Z" fill="#94775b" stroke={ink} strokeWidth="1.4" />
        <Grain x={118} y={309} w={352} h={56} />
        <Hatch id="profile-conveyor-side" d="M474 305 491 295V357L474 371Z" gap={3} cross />
        <path d="M130 317H274V359H130ZM289 317H459V359H289Z" fill="#685441" stroke={ink} />
        <path d="M135 322H269V354H135ZM294 322H454V354H294Z" fill="none" stroke="#b69c72" strokeWidth=".7" />
        <path d="M187 332q12 11 24 0m142 0q12 11 24 0" fill="none" stroke="#ccb07a" strokeWidth="2" />
        <path d="M114 369H474V377H114ZM124 377V390H141V377M446 377V389H463V377" fill="#68483a" stroke={ink} />
        <path d="M117 372H471M128 380v7m322-7v7" stroke="#b29a72" strokeWidth=".7" />

        {/* Rear column, screw and flywheel: the press is a built object, not a node. */}
        <path d="m343 259 20-9V112l-20 9Z" fill="#887858" stroke={ink} strokeWidth="1.2" />
        <path d="m343 259 20-9V112l-20 9Z" fill="url(#profile-etch)" />
        <path d="M282 117V73l17-8v44" fill="#b6bba5" stroke={ink} />
        <path d="M282 84H299M282 89H299M282 94H299M282 99H299M282 104H299" stroke={ink} strokeWidth=".8" />
        <path d="m260 67 40-12 35 10-40 12Z" fill="#d9c99d" stroke={ink} />
        <path d="M260 67V73L295 83V77M295 83 335 71V65" fill="#ad9566" stroke={ink} />
        <path d="M296 60V43" stroke={ink} strokeWidth="3" />
        <ellipse cx="296" cy="43" rx="26" ry="8" fill={paper} stroke={ink} strokeWidth="1.5" />
        <ellipse cx="296" cy="43" rx="19" ry="5" fill="none" stroke={brass} />
        <path d="m271 43 49 0M280 38 312 48M280 48 312 38" stroke={ink} />
        <circle cx="296" cy="43" r="3" fill={brass} />
        <g transform="translate(364 164)">
          <ellipse rx="32" ry="39" fill="#b6a078" stroke={ink} strokeWidth="1.5" />
          <ellipse rx="26" ry="33" fill={paper} stroke={ink} />
          <ellipse rx="22" ry="29" fill="none" stroke={brass} />
          <g className={motion.wheel}><path d="M0-30V30M-24 0H24M-17-22 17 22M-17 22 17-22" stroke={ink} strokeWidth="3" /></g>
          <ellipse rx="7" ry="9" fill="#b49c65" stroke={ink} />
          <path d="M0 0 21 16" stroke={ink} strokeWidth="3" /><circle cx="21" cy="16" r="4" fill={paper} stroke={ink} />
        </g>

        {/* Conveyor bed, its return run and rollers share the same geometry. */}
        <path d="m77 260 23-12h391q23 0 23 18v18l-23 14H77Z" fill="#b8bfab" stroke={ink} strokeWidth="1.3" />
        <path d="M86 258H478a23 23 0 0 1 0 46H86a23 23 0 0 1 0-46Z" fill="#d9decd" stroke={ink} strokeWidth="1.5" />
        <path d="M86 265H478a16 16 0 0 1 0 32H86a16 16 0 0 1 0-32Z" fill="#63796d" stroke={ink} />
        {Array.from({ length: 14 }, (_, i) => <g key={i} transform={`translate(${87 + i * 30} 281)`}>
          <circle r="11.5" fill="#bcc5ad" stroke={ink} /><circle r="7.5" fill="none" stroke={ink} strokeWidth=".7" />
          <g className={motion.roller}><path d="M-8 0H8M0-8V8" stroke={ink} strokeWidth=".7" /></g><circle r="2.5" fill={brass} stroke={ink} strokeWidth=".6" />
        </g>)}
        <path d="M88 258H476M88 304H476" stroke={brass} strokeWidth="2.5" />
        <path d="M90 253H485M91 307H474" stroke={ink} strokeWidth=".65" />
        {Array.from({ length: 38 }, (_, i) => <path key={i} d={`M${90 + i * 10} 254v4m0 46v3`} stroke={ink} strokeWidth=".6" />)}

        {/* A specification becomes a family of versioned production units. */}
        <g fill={paper} stroke={ink}>
          <path d="m92 245 10-49 51 9-10 49Z" fill="#c4c9b4" />
          <path d="m99 242 7-54 52 7-7 54Z" fill="#e6e4d5" />
          <path d="m108 238 3-56 50 3-3 56Z" />
          <path d="m119 193 29 2m-29 5 24 2m-25 5 29 2m-29 5 19 1" stroke={brass} />
          <path d="m118 226 11-7 7 4 13-7" fill="none" />
        </g>
        <g clipPath="url(#profile-belt-clip)"><g className={motion.conveyorCard}>
          {Array.from({ length: 6 }, (_, i) => <CatalogLeaf key={i} x={92 + i * 86} y={208} variant={i % 3} />)}
        </g></g>

        {/* The open review gate keeps both the work and its quality boundary visible. */}
        <path d="m232 115 22-12h97l-20 12Z" fill="#dac9a5" stroke={ink} strokeWidth="1.3" />
        <path d="M232 115H331V264H314V148H249V264H232Z" fill="#b39b72" stroke={ink} strokeWidth="1.5" />
        <path d="m331 115 20-12v149l-20 12Z" fill="#806a4d" stroke={ink} strokeWidth="1.3" />
        <path d="m331 115 20-12v149l-20 12Z" fill="url(#profile-etch)" />
        <Hatch id="profile-press-hatch" d="M232 115H331V264H314V148H249V264H232Z" gap={3} />
        <path d="M237 151V257M244 151V257M319 152V255M325 151V257" stroke={ink} strokeWidth=".7" />
        <path d="M251 119H313V142H251Z" fill="#e0d2ad" stroke={ink} />
        <path d="M256 124H308V137H256Z" fill="none" stroke={brass} strokeWidth=".7" />
        <path d="M267 130H277m10 0h10M282 125v10" stroke={ink} strokeWidth="1.3" />
        <g className={motion.press}><path d="M275 149H290V180H275Z" fill="#bca473" stroke={ink} />
        <path d="M278 150V178M284 150V178" stroke={paper} strokeWidth=".8" />
        <path d="m263 180 12-6h24l-12 6Z" fill="#e1d4b2" stroke={ink} />
        <path d="M263 180H287V191H263Z" fill="#b39c6e" stroke={ink} />
        <path d="m287 180 12-6v11l-12 6Z" fill="#8c784f" stroke={ink} /></g>

        <path d="M227 257H253V266H227Zm82 0h27v9h-27Z" fill="#c6cbb7" stroke={ink} />
        {[{x:239,y:124},{x:239,y:142},{x:322,y:124},{x:322,y:142},{x:238,y:250},{x:322,y:250}].map((point, i) => <Bolt key={i} {...point} />)}

        {/* A measuring lens observes released units; its trace returns to the brief. */}
        <path d="M504 251V161Q504 149 492 149H454" fill="none" stroke={ink} strokeWidth="6" />
        <path d="M504 251V161Q504 149 492 149H454" fill="none" stroke="#aebbab" strokeWidth="3" />
        <path d="M496 247H512V255H496Z" fill="#bac3b1" stroke={ink} />
        <g transform="translate(451 149)">
          <circle r="28" fill="#d1be8c" stroke={ink} strokeWidth="1.4" />
          <circle r="23" fill={paper} stroke={ink} />
          <path d="M-16 12V-12H16M-11 12V-7M-5 12V-10M1 12V-3M7 12V-7M13 12V-14" fill="none" stroke="#8c9e8f" strokeWidth="1.2" />
          <path d="M-13 4-6 0 1 3 8-5 14-2" fill="none" stroke={ink} strokeWidth="1.5" />
          <circle r="1.5" cx="14" cy="-2" fill={brass} />
        </g>
        <path d="m447 180-12 22m19-21 10 18" fill="none" stroke={brass} strokeDasharray="2 4" />
        <g fill="none" stroke={brass}>
          <path d="M511 281h19q15 0 15 15v25q0 15-15 15H181q-15 0-15-15v-4" strokeWidth="2" />
          <path d="M511 288h16q11 0 11 11v19q0 11-11 11H185q-12 0-12-12" strokeWidth="1" />
          <path d="m171 321-5-7-5 7M337 332l-6 4 6 4" strokeWidth="1.5" />
        </g>
        <path d="M170 309V289" stroke={brass} strokeWidth="2" />
        <circle cx="170" cy="289" r="3" fill={brass} stroke={ink} />
        <g fill={paper} stroke={brass} strokeWidth="1.2">
          <circle cx="109" cy="161" r="11" /><circle cx="243" cy="91" r="11" /><circle cx="472" cy="229" r="10" /><circle cx="392" cy="336" r="11" />
        </g>
        <g className={styles.plateNumbers} textAnchor="middle">
          <text x="109" y="165">1</text><text x="243" y="95">2</text><text x="472" y="233">3</text><text x="392" y="340">4</text>
        </g>
        <path d="M109 173V179M244 103V110M392 348V361" stroke={brass} strokeWidth=".8" />
        <path d="M188 397H410" stroke="#c7c8b9" strokeWidth=".8" />
        <path d="m294 394 5 3-5 3m10-6 5 3-5 3" fill="none" stroke={brass} strokeWidth=".8" />
      </svg>
      <ol className={styles.plateLegend} aria-label="The learning loop">
        <li><span>1</span>Specify</li><li><span>2</span>Produce</li><li><span>3</span>Release</li><li><span>4</span>Learn</li>
      </ol>
      <figcaption id="loop-caption">
        <p>Local evidence.<br /><strong>System-level decisions.</strong></p>
        <span className={styles.plateFootnote}>A working loop, guided by quality and human judgment.</span>
      </figcaption>
    </figure>
  );
}
