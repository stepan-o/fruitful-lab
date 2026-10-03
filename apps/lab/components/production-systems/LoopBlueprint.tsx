import styles from "@/app/(stepanoskin)/stepanoskin/production-systems/profile.module.css";

export default function LoopBlueprint() {
  return <figure className={styles.blueprint} aria-labelledby="loop-caption">
    <div className={styles.plateHeader}><span>System study / 01</span><span>Closed loop</span></div>
    <svg className={styles.loopSvg} viewBox="0 0 440 380" role="img" aria-labelledby="loop-title loop-description">
      <title id="loop-title">A production system with a feedback loop</title>
      <desc id="loop-description">Specify, produce, deliver, and evaluate surround a shared objective. Evidence from use informs the next specification. Quality gates and human judgment govern release.</desc>
      <defs><marker id="loop-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M1 1 7 4 1 7" fill="none" stroke="currentColor" /></marker></defs>
      <g className={styles.guideLines} fill="none"><circle cx="220" cy="190" r="133" /><circle cx="220" cy="190" r="91" /><path d="M220 20V360M35 190H405" /></g>
      <g className={styles.loopPaths} fill="none" markerEnd="url(#loop-arrow)"><path d="M249 58Q350 70 356 151" /><path d="M356 226Q349 309 257 323" /><path d="M181 323Q87 310 84 228" /><path d="M84 153Q90 72 181 58" /></g>
      <g className={styles.centerLines} fill="none"><path d="M220 104V139M306 190H269M220 239V276M171 190H134" /><rect x="171" y="141" width="98" height="98" rx="2" transform="rotate(45 220 190)" /></g>
      <text x="220" y="181" textAnchor="middle" className={styles.diagramSmall}>SHARED OBJECTIVE</text>
      <text x="220" y="204" textAnchor="middle" className={styles.diagramCenter}>Useful outcomes</text>
      <g className={styles.diagramNode}><rect x="163" y="37" width="114" height="46" rx="2" /><text x="220" y="56" textAnchor="middle" className={styles.diagramSmall}>01 / DECISION</text><text x="220" y="74" textAnchor="middle">Specify</text></g>
      <g className={styles.diagramNode}><rect x="298" y="165" width="114" height="50" rx="2" /><text x="355" y="185" textAnchor="middle" className={styles.diagramSmall}>02 / CANDIDATES</text><text x="355" y="204" textAnchor="middle">Produce</text></g>
      <g className={styles.diagramNode}><rect x="163" y="297" width="114" height="50" rx="2" /><text x="220" y="317" textAnchor="middle" className={styles.diagramSmall}>03 / EXPERIENCE</text><text x="220" y="336" textAnchor="middle">Deliver</text></g>
      <g className={styles.diagramNode}><rect x="28" y="165" width="114" height="50" rx="2" /><text x="85" y="185" textAnchor="middle" className={styles.diagramSmall}>04 / EVIDENCE</text><text x="85" y="204" textAnchor="middle">Evaluate</text></g>
      <g className={styles.diagramTick}><path d="M28 28h12M28 28v12M412 28h-12M412 28v12M28 352h12M28 352v-12M412 352h-12M412 352v-12" /></g>
    </svg>
    <figcaption id="loop-caption"><span className={styles.smallLabel}>The design principle</span><p>Local evidence.<br /><strong>System-level decisions.</strong></p><span className={styles.plateFootnote}>Quality gates + human judgment at release</span></figcaption>
  </figure>;
}
