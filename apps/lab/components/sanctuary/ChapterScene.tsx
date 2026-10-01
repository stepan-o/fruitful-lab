import { useId } from "react";
import type { VisualSpec } from "@/lib/sanctuary/visual-content";
import styles from "./visuals.module.css";
function random(n:number){const x=Math.sin(n*91.73+5)*42381.4;return x-Math.floor(x);}

/** Original geometric scene studies, not representations of any game's captured UI. */
export default function ChapterScene({visual,index}:{visual:VisualSpec;index:number}){
  const id=useId().replace(/:/g,'');const seed=index*97;
  const gold=index%3===0?'#dfa36c':index%3===1?'#a7bdba':'#c5b078';
  return <figure className={styles.scene}>
    <div className={styles.visualLabel}><span>SCENE {String(index+1).padStart(2,'0')}</span><span>ORIGINAL ILLUSTRATION</span></div>
    <svg viewBox="0 0 1000 560" role="img" aria-label={`${visual.sceneTitle}: ${visual.sceneCaption}`}>
      <defs>
        <radialGradient id={`${id}-sky`}><stop stopColor={gold} stopOpacity=".27"/><stop offset="1" stopColor="#080b0e"/></radialGradient>
        <linearGradient id={`${id}-floor`} x2="0" y2="1"><stop stopColor="#273033"/><stop offset="1" stopColor="#080b0e"/></linearGradient>
        <linearGradient id={`${id}-light`} x2="0" y2="1"><stop stopColor={gold}/><stop offset="1" stopColor="#c6622e" stopOpacity=".03"/></linearGradient>
        <linearGradient id={`${id}-fog`} x2="1" y2="0"><stop stopColor="#758b87" stopOpacity="0"/><stop offset=".5" stopColor="#758b87" stopOpacity=".13"/><stop offset="1" stopColor="#758b87" stopOpacity="0"/></linearGradient>
        <pattern id={`${id}-stone`} width="76" height="34" patternUnits="userSpaceOnUse"><path d="M0 0H76V34H0ZM38 0V34" fill="none" stroke="#758176" strokeOpacity=".08"/></pattern>
        <filter id={`${id}-glow`}><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <rect width="1000" height="560" fill="#0a0e11"/><rect width="1000" height="470" fill={`url(#${id}-sky)`}/>
      <circle cx={500+(index%3-1)*110} cy="180" r="95" fill="none" stroke={gold} strokeOpacity=".1"/>
      <circle cx={500+(index%3-1)*110} cy="180" r="84" fill="none" stroke={gold} strokeOpacity=".12"/>
      <g fill="#0b1217" stroke="#8b9381" strokeOpacity=".13">{Array.from({length:13},(_,i)=>{const h=70+random(seed+i)*160;return <path key={i} d={`M${i*83-15} 370V${370-h}l27 -35l27 35V370Z`}/>;})}</g>
      <path d="M0 352L500 276L1000 352V560H0Z" fill={`url(#${id}-floor)`}/>
      <g stroke="#7c887c" strokeOpacity=".14" fill="none">{Array.from({length:19},(_,i)=><path key={i} d={`M500 276L${(i-4)*95} 560`}/>)}{[355,385,425,482,558].map(y=><path key={y} d={`M0 ${y}H1000`}/>)}</g>
      {/* Columns and cut stone are generated, with no imported meshes or textures. */}
      {[80,180,820,920].map((x,i)=><g key={x} transform={`translate(${x} ${i%2?54:0})`}><path d="M-37 465V85L0 38L37 85V465Z" fill="#141c20" stroke="#727c6b" strokeOpacity=".25"/><path d="M-24 440V110L0 74L24 110V440" fill="none" stroke="#687266" strokeOpacity=".24"/><path d="M-38 140H38M-38 350H38M0 83V432" stroke="#070c0e" strokeWidth="7"/><rect x="-36" y="105" width="72" height="350" fill={`url(#${id}-stone)`}/></g>)}
      {visual.scene==='gate'?<g>{[355,645].map((x,i)=><g key={x}><path d={`M${x-84} 372V184Q${x-84} 100 ${x} 65Q${x+84} 100 ${x+84} 184V372Z`} fill="#10191d" stroke={gold} strokeOpacity=".48" strokeWidth="4"/><path d={`M${x-62} 372V191Q${x-62} 123 ${x} 96Q${x+62} 123 ${x+62} 191V372`} fill={`url(#${id}-light)`} opacity={i?.19:.48}/>{Array.from({length:i?5:1},(_,j)=><path key={j} d={`M${x-45+j*22} 155V365`} stroke="#0c1519" strokeWidth="8"/>)}</g>)}</g>:null}
      {visual.scene==='relic'?<g><ellipse cx="500" cy="375" rx="158" ry="51" fill="#0a1015" stroke={gold} strokeOpacity=".25"/><path d="M394 367L500 332L606 367L606 406L500 450L394 406Z" fill="#162126" stroke="#68766a"/><path d="M434 324L500 289L566 324V367L500 399L434 367Z" fill="#38291e" stroke={gold}/><path d="M434 324L500 357L566 324M500 357V399" fill="none" stroke={gold}/><path d="M500 172L530 237L500 303L470 237Z" fill={gold} opacity=".72"/><path d="M500 172V303L470 237Z" fill="#a95b30"/><path d="M495 230L503 244L519 236" fill="none" stroke="#fff0c3" strokeWidth="3"/><ellipse className={styles.sceneHalo} cx="500" cy="378" rx="125" ry="40" fill="none" stroke={gold} strokeOpacity=".45"/></g>:null}
      {visual.scene==='observatory'?<g><path d="M400 415L450 346H550L600 415Z" fill="#1b262a" stroke="#64756d"/><circle cx="500" cy="232" r="102" fill="#0c171e" stroke={gold} strokeOpacity=".6" strokeWidth="4"/><circle cx="500" cy="232" r="77" fill="none" stroke={gold} strokeOpacity=".35"/><ellipse cx="500" cy="232" rx="102" ry="31" fill="none" stroke={gold} strokeOpacity=".5" transform="rotate(-32 500 232)"/><path d="M500 114V350M382 232H618" stroke={gold} strokeOpacity=".5"/><path d="M500 190L535 232L500 274L465 232Z" fill={`url(#${id}-light)`}/><circle cx="500" cy="232" r="6" fill="#fff0c5"/></g>:null}
      {visual.scene==='market'?<g>{[320,500,680].map((x,i)=><g key={x}><path d={`M${x-59} 410V264L${x} 226L${x+59} 264V410Z`} fill="#141e23" stroke={gold} strokeOpacity=".28"/><path d={`M${x-72} 266L${x} 196L${x+72} 266Z`} fill={i===1?'#6b3825':'#273b3f'} stroke={gold} strokeOpacity=".35"/><path d={`M${x-46} 284H${x+46}V333H${x-46}Z`} fill="#071115"/>{Array.from({length:5},(_,j)=><ellipse key={j} cx={x-29+j*14} cy={356+Math.sin(j)*7} rx="7" ry="4" fill={gold} opacity={.3+j*.12}/>)}<path d={`M${x-62} 370H${x+62}V400H${x-62}Z`} fill="#273333"/></g>)}</g>:null}
      {visual.scene==='arena'?<g><ellipse cx="510" cy="374" rx="210" ry="80" fill="none" stroke={gold} strokeOpacity=".3"/>{Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,x=510+Math.cos(a)*220,y=374+Math.sin(a)*82;return <path key={i} d={`M${x-13} ${y}v-48l13 -16l13 16v48Z`} fill="#1c2a2f" stroke={gold} strokeOpacity=".3"/>;})}<path d="M581 331L599 254L625 233L650 263L663 331L620 347Z" fill="#39201f" stroke="#9a4e35"/><path d="M598 268L572 219L610 247M639 259L665 213L653 280" fill="#64412a"/><path d="M612 271H624" stroke="#ff9a56" strokeWidth="3"/></g>:null}
      {visual.scene==='citadel'?<g><path d="M317 378V163L360 117L402 163V217H598V163L640 117L683 163V378Z" fill="#17252a" stroke={gold} strokeOpacity=".35"/><path d="M435 378V253Q435 207 500 169Q565 207 565 253V378" fill="#08131a" stroke={gold} strokeOpacity=".5"/><path d="M463 378V266L500 225L537 266V378" fill={`url(#${id}-light)`} opacity=".25"/>{[350,640].map(x=><path key={x} d={`M${x} 211V246`} stroke={gold} strokeWidth="5"/>)}</g>:null}
      {/* An original traveler silhouette provides scale, not a borrowed character. */}
      <ellipse cx="473" cy="456" rx="33" ry="9" fill="#02070b"/><path d="M452 449L458 402L469 385L480 403L493 449L477 444L468 457L460 446Z" fill="#10151a" stroke="#a08059" strokeOpacity=".55"/><circle cx="469" cy="382" r="9" fill="#263236"/><path d="M487 409L501 375M500 382L506 369" stroke={gold} strokeWidth="3"/>
      <g fill="#df9d5c">{Array.from({length:26},(_,i)=><circle key={i} cx={random(seed+i+81)*1000} cy={70+random(seed+i+33)*430} r={.5+random(i)*1.1} opacity={.15+random(seed+i)*.4}/>)}</g>
      <path className={styles.sceneMist} d="M0 447Q180 397 360 450T700 448T1050 463V510H0Z" fill={`url(#${id}-fog)`}/>
      <path d="M32 32H133M32 32V70M968 32H867M968 32V70M32 528H133M32 528V490M968 528H867M968 528V490" fill="none" stroke={gold} strokeOpacity=".4"/>
    </svg>
    <figcaption><h2>{visual.sceneTitle}</h2><p>{visual.sceneCaption}</p><small>Original procedural scene · illustrative, not a game capture</small></figcaption>
  </figure>;
}
