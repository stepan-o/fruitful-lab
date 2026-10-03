import { useId } from "react";
import { useLivingPlate } from "./plates/useLivingPlate";
import styles from "./infernal-term.module.css";

/** A small hot-metal inscription, with a quiet cycle rather than a flashing word. */
export default function InfernalTerm({ children }: { children: string }) {
  const id=useId().replace(/:/g,"");
  const ref=useLivingPlate<HTMLElement>();
  return <strong ref={ref} className={styles.term} data-inscription="subscription">
    <svg className={styles.mount} viewBox="0 0 240 66" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-iron`} x2="0" y2="1"><stop stopColor="#302826"/><stop offset=".4" stopColor="#111a1b"/><stop offset="1" stopColor="#291c1c"/></linearGradient>
        <linearGradient id={`${id}-metal`} x2=".8" y2="1"><stop stopColor="#d9b589"/><stop offset=".3" stopColor="#695c49"/><stop offset=".65" stopColor="#a46642"/><stop offset="1" stopColor="#392929"/></linearGradient>
        <radialGradient id={`${id}-heat`}><stop stopColor="#e25a2c" stopOpacity=".6"/><stop offset=".55" stopColor="#9e3120" stopOpacity=".17"/><stop offset="1" stopColor="#ac3720" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse className={styles.heat} cx="120" cy="40" rx="118" ry="30" fill={`url(#${id}-heat)`}/>
      <path d="m5 20 10-10h90l15-5 15 5h90l10 10v25l-10 10h-90l-15 5-15-5H15L5 45Z" fill={`url(#${id}-iron)`} stroke={`url(#${id}-metal)`}/>
      <path d="m10 22 8-8h86l16-5 16 5h86l8 8v21l-8 8h-86l-16 5-16-5H18l-8-8Z" fill="none" stroke="#c08e64" strokeOpacity=".25" strokeWidth=".6"/>
      <path d="M29 19h50m82 0h50M29 47h45m92 0h45" stroke="#9a7854" strokeWidth=".6" strokeOpacity=".5"/>
      <path d="m101 16 19-6 19 6m-35 0 16 5 16-5m-35 34 19 6 19-6m-35 0 16-5 16 5" fill="none" stroke="#bd9870" strokeWidth=".65" opacity=".65"/>
      <path d="m17 27 4 5-4 6-4-6Zm206 0 4 5-4 6-4-6Z" fill="#9d4b30" stroke="#d5a571" strokeWidth=".6"/>
      {[22,218].map(x=><g key={x} fill="#bea077"><circle cx={x} cy="20" r="1"/><circle cx={x} cy="44" r="1"/></g>)}
      <path className={styles.seam} d="M32 52h51l37 7 37-7h51" fill="none" stroke="#e59950" strokeWidth="1"/>
      <g className={styles.sparks} fill="#e7b677"><circle cx="42" cy="18" r=".9"/><circle cx="194" cy="15" r=".8"/><circle cx="157" cy="9" r=".55"/></g>
    </svg>
    <span className={styles.letters}>{children}</span>
  </strong>;
}
