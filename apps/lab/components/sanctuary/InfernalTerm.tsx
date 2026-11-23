import { useId } from "react";
import { useLivingPlate } from "./plates/useLivingPlate";
import styles from "./infernal-term.module.css";

/** Three bounded inscriptions; visibility and motion preferences gate every cycle. */
export default function InfernalTerm({ children, tone = "subscription" }: { children: string; tone?: "subscription" | "spectral" | "abyss" }) {
  const id=useId().replace(/:/g,"");
  const ref=useLivingPlate<HTMLElement>();
  if (tone === "abyss") return <strong ref={ref} className={`${styles.term} ${styles.abyss}`} data-inscription={children}>
    <svg className={styles.mount} viewBox="0 0 240 66" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-depth`}><stop stopColor="#02040b"/><stop offset=".55" stopColor="#03080e"/><stop offset=".84" stopColor="#28344b"/><stop offset="1" stopColor="#c9a277"/></radialGradient>
        <radialGradient id={`${id}-rim`}><stop offset=".4" stopColor="#638599" stopOpacity="0"/><stop offset=".78" stopColor="#7fb8b5" stopOpacity=".4"/><stop offset="1" stopColor="#df9965" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse className={styles.abyssGlow} cx="120" cy="34" rx="120" ry="31" fill={`url(#${id}-rim)`}/>
      <path d="M4 32L24 18L54 21L78 10L108 16L124 7L151 17L180 11L200 22L233 28L221 45L195 44L169 57L142 50L117 61L91 50L66 55L46 43L19 46Z" fill={`url(#${id}-depth)`} stroke="#c39c70" strokeWidth=".8"/>
      <path d="M22 32L52 26L83 22L108 24L128 17L150 25L177 24L216 32L196 39L172 45L141 41L120 49L93 41L64 44L42 37Z" fill="#02060c" stroke="#698d9b" strokeOpacity=".55"/>
      <path d="M26 18L45 25M77 11L85 22M124 8L128 17M181 12L177 24M220 44L198 39M169 56L170 45M117 60L120 49M66 54L65 44M20 45L43 37" stroke="#d8b392" strokeWidth=".7" opacity=".5"/>
      <path className={styles.abyssTrace} d="M4 32L24 18L54 21L78 10L108 16L124 7L151 17L180 11L200 22L233 28M19 46L46 43L66 55L91 50L117 61L142 50L169 57L195 44L221 45" fill="none" stroke="#d7c6ac" strokeWidth="1.4"/>
    </svg>
    <span className={styles.letters}>{children}</span>
  </strong>;
  if (tone === "spectral") return <strong ref={ref} className={`${styles.term} ${styles.spectral}`} data-inscription={children}>
    <svg className={styles.mount} viewBox="0 0 240 66" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-soul`}><stop stopColor="#bddbd0" stopOpacity=".33"/><stop offset=".55" stopColor="#628c91" stopOpacity=".13"/><stop offset="1" stopColor="#446e79" stopOpacity="0"/></radialGradient>
        <linearGradient id={`${id}-veil`} x2="0" y2="1"><stop stopColor="#a7c3b6" stopOpacity=".65"/><stop offset=".45" stopColor="#344d50" stopOpacity=".25"/><stop offset="1" stopColor="#081418" stopOpacity=".8"/></linearGradient>
      </defs>
      <ellipse className={styles.soulGlow} cx="120" cy="34" rx="119" ry="31" fill={`url(#${id}-soul)`}/>
      <path d="M9 39Q20 11 83 19L105 9Q120 -8 135 9L157 19Q220 11 231 39L211 48L153 51L120 59L87 51L29 48Z" fill="#0c171b" stroke="#718b85" strokeOpacity=".6"/>
      <path d="M89 23Q104 15 108 5Q120 -6 132 5Q136 15 151 23L137 19L145 31L127 24L120 33L113 24L95 31L103 19Z" fill={`url(#${id}-veil)`}/>
      <path d="M112 9l5 2-2 3-4-2M128 9l-5 2 2 3 4-2" fill="#c8e3cb"/>
      <path d="M118 16Q120 12 122 16L121 22H119Z" fill="#050c11"/>
      <g className={styles.soulStreams} fill="none" stroke="#adc9bc" strokeWidth=".9" strokeLinecap="round">
        <path d="M-5 42C29 64 47 3 80 16S101 46 118 18"/>
        <path d="M245 43C217 66 195 5 159 16S143 47 122 18"/>
        <path d="M27 56C53 41 84 63 102 43S107 20 118 18"/>
        <path d="M213 56C187 41 156 63 138 43S133 20 122 18"/>
      </g>
      <path className={styles.soulSeam} d="M22 45Q69 52 99 44L120 51L141 44Q174 52 218 45" fill="none" stroke="#9bc0b2" strokeWidth="1.1"/>
    </svg>
    <span className={styles.letters}>{children}</span>
  </strong>;
  return <strong ref={ref} className={`${styles.term} ${styles.subscription}`} data-inscription={children}>
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
      <g className={styles.renewalWheel} transform="translate(220 34)" fill="none" stroke="#cd9154" strokeWidth=".8">
        <circle r="9"/><circle r="5"/>
        <path d="M0-11V-7M0 7V11M-11 0H-7M7 0H11M-8-8L-5-5M5 5L8 8M-8 8L-5 5M5-5L8-8"/>
      </g>
      <path className={styles.pactCircuit} pathLength="100" d="M18 18H101L120 10L139 18H222V46H139L120 54L101 46H18Z" fill="none" stroke="#ffc784" strokeWidth="1.5"/>
      <g fill="none" stroke="#d69b60" strokeWidth="1.1">
        <path d="M102 11Q94 -2 102 -5Q102 3 111 7M138 11Q146 -2 138 -5Q138 3 129 7"/>
        <path d="M111 55L115 63L120 58L125 63L129 55"/>
        <path d="M51 17l5 -3v6ZM189 47l-5 -3v6Z" fill="#edba7c"/>
      </g>
      <path className={styles.smile} d="M88 49Q120 64 152 49Q139 61 120 62Q101 61 88 49Z" fill="#f4bc78"/>
      <path className={styles.seam} d="M32 52h51l37 7 37-7h51" fill="none" stroke="#e59950" strokeWidth="1"/>
      <g className={styles.sparks} fill="#e7b677"><circle cx="42" cy="18" r=".9"/><circle cx="194" cy="15" r=".8"/><circle cx="157" cy="9" r=".55"/></g>
    </svg>
    <span className={styles.letters}>{children}</span>
    <span className={styles.renewal} aria-hidden="true"><span>JOIN</span><span>→</span><span className={styles.repeat}>RENEW</span><span>↻</span></span>
    <span className={styles.srOnly}>: an invitation to join, followed by recurring payments until cancellation</span>
  </strong>;
}
