import { memo, useId } from "react";
import { Screw, WoodGrain } from "./ArcadeMaterials";
import s from "./arcade-craft.module.css";

function Control({x,color,n}:{x:number;color:string;n:number}) {
 return <g transform={`translate(${x} 0)`}>
  <path d="M-22 307h44l6 32h-57Z" fill="#22342f" stroke="#ab986b" strokeWidth=".7"/>
  <path d="M-17 311h34M-22 335h44" stroke={color} strokeWidth="2" opacity=".7"/>
  <ellipse cy="327" rx="11" ry="4.4" fill="#081317" stroke="#9a8d68" strokeWidth=".8"/><ellipse cy="326" rx="6" ry="2.8" fill="#52615a"/>
  <path d="M-1 325V307H2V325" fill="#d2c5a3" stroke="#263636" strokeWidth=".6"/>
  <circle cy="304" r="6.7" fill={color} stroke="#15262a"/><path d="M-4 302q2-4 6-2" fill="none" stroke="#eedab1" strokeWidth="1.2" opacity=".7"/>
  <ellipse cx="17" cy="326" rx="6.5" ry="3.9" fill="#0c171a" stroke="#a28d5d" strokeWidth=".6"/><ellipse cx="17" cy="324" rx="5.5" ry="3" fill={color}/>
  <text x="-14" y="320" fill="#d3c098" fontSize="6" fontFamily="monospace">{n}</text>
 </g>;
}
function Dungeon({id}:{id:string}) {
 return <g clipPath={`url(#${id}-screen)`} data-art-element="crt-dungeon">
  <path d="M132 123H348V279H132Z" fill="#142c2b"/>
  <path d="M132 123H348V279H132Z" fill={`url(#${id}-tiles)`}/>
  <path d="M154 150H280V186H192V245H316V215H245M290 149H326V192M159 196V226M218 146V165" fill="none" stroke="#06171b" strokeWidth="16"/>
  <path d="M154 146H280V182H192V241H316V211H245M290 145H326V188M159 192V222M218 142V161" fill="none" stroke="#627c68" strokeWidth="9"/>
  <path d="M154 142H284M188 182V245H319M290 141H330V188M159 190V222" fill="none" stroke="#bac394" strokeWidth="1.2"/>
  <path d="M166 142v9m15-9v9m15-9v9m15-9v9m16-9v9m15-9v9m15-9v9m16-9v9M188 193h9m-9 16h9m-9 16h9m7 12v8m17-8v8m17-8v8m17-8v8m17-8v8m17-8v8m17-8v8" stroke="#142e2b" strokeWidth="1.4"/>
  {([[224,202,"#d6b477"],[247,199,"#83bdba"],[260,229,"#b48a6b"],[281,223,"#99ad78"]] as const).map(([x,y,tone],i)=><g key={i} transform={`translate(${x} ${y})`}>
   <ellipse cy="6" rx="5" ry="2" fill="#05171a"/>
   <path d="M-2-7h4v4H5V3H2V7H0V3H-2V7H-4V-2H-2Z" fill={tone}/><path d="M5-6V4M3-2H7" stroke="#e1dbad" strokeWidth="1"/>
  </g>)}
  <g fill="#b17256"><path d="M304 161h5v-4h3v5h4v7h-3v-3h-6v4h-3ZM165 245h6v-3h3v5h3v8h-4v-5h-5v5h-3Z"/><path d="M306 163h3m3 0h2M167 248h2m3 0h2" stroke="#f0d1a1" strokeWidth="1"/></g>
  <g className={s.screenGlint}><path d="M283 198v7m-3-3h6M174 171v7m-3-3h6" stroke="#e5d7a3" strokeWidth="1.3"/></g>
  <path d="M131 124H348V136H131Z" fill="#08181b"/><path d="M142 129h26m7 0h12m9 0h30m10 0h9m10 0h31m8 0h31" stroke="#a7b18b" strokeWidth="2"/>
  <path d="M131 262H348V280H131Z" fill="#09181b"/><text x="241" y="274" textAnchor="middle" fontSize="7" letterSpacing="1.3" fontFamily="monospace" fill="#c9c59d">A PLACE FOR FOUR</text>
  <path d="M141 126Q237 110 335 130L301 252L266 259Z" fill="#bee2c5" opacity=".025"/>
  <path d="M141 148Q236 132 339 145M137 258Q237 271 337 258" stroke="#9bc6b0" opacity=".12" fill="none"/>
  <path className={s.screenBreath} d="M130 120H350V280H130Z" fill={`url(#${id}-phosphor)`}/>
  <path d="M130 120H350V280H130Z" fill={`url(#${id}-scan)`}/>
 </g>;
}
function CoinDoor({id,health,operator}:{id:string;health:number;operator:boolean}) {
 return <g data-art-element="coin-door">
  <path d="M134 369H333V520H134Z" fill="#080f13" stroke="#aa8e5c" strokeWidth="1.5"/>
  <path d="M141 376H326V514H141Z" fill="#182b29" stroke="#4b5a46"/>
  {operator?<>
   {/* A deliberately explanatory cutaway, not a reconstruction of Atari's electronics. */}
   <path d="M152 386H307V482H152Z" fill="#304a36" stroke="#a6a16d" strokeWidth=".8"/>
   <path d="M160 393h20v13h19v21h16m-55-5h16v24h24v18h14m91-62h-26v10h-24m42 25h-30v30h-22m-72 1v-9h-9m125 6h-12v-17h-12" stroke="#a3a474" strokeWidth="1" fill="none" opacity=".65"/>
   {[158,301].map(x=><g key={x}><Screw x={x} y={391} r={1.8}/><Screw x={x} y={476} r={1.8}/></g>)}
   <path d="M168 409H291V452H168Z" fill="#111f21" stroke="#b39c66"/>
   <text x="230" y="421" textAnchor="middle" fill="#b8c1a5" fontSize="7" letterSpacing="1">HEALTH PER COIN</text>
   <text x="230" y="444" textAnchor="middle" fill="#efcd8b" fontFamily="monospace" fontSize="24">{health.toLocaleString("en-US")}</text>
   {[183,229,275].map((x,i)=><g key={x}>
    <path d={`M${x-10} 459h20v10h-20Z`} fill="#0e201f" stroke="#8d9a75" strokeWidth=".5"/>
    <path d={`M${x-6} 461v6m4-6v6m4-6v6m4-6v6`} stroke="#7c946d" strokeWidth="1"/>
    <path d={`M${x-6} ${health===[100,600,2000][i]?460:464}h11v3h-11Z`} fill={health===[100,600,2000][i]?"#e1bc75":"#75806b"}/>
   </g>)}
   <path d="M305 387Q323 384 320 422V483H302M152 443Q139 456 147 491H193" stroke="#8b7150" strokeWidth="3" fill="none"/>
   <path d="M304 389Q319 389 317 425V487H304M153 445Q143 458 151 488H191" stroke="#b8ac75" strokeWidth=".7" fill="none"/>
   <path d="M190 486H284V504H190Z" fill="#453f2c" stroke="#b39563" strokeWidth=".8"/><path d="M199 490H275V500H199Z" fill="#122224"/>
   <path d="M205 491v8m8-8v8m8-8v8m8-8v8m8-8v8m8-8v8m8-8v8m8-8v8" stroke="#d8c08b" strokeWidth="1"/>
   <path d="M138 377L63 399V534L138 510Z" fill="#283331" stroke="#c5a675" strokeWidth="1.1"/>
   <path d="M129 389L72 406V523L129 506Z" fill="#101e21" stroke="#7e8264"/>
   <path d="M123 397L79 410V487L123 474Z" fill="#435042" stroke="#a29365" strokeWidth=".7"/>
   <path d="M101 412v27l-10 9v26M117 409v24l-9 7v29" stroke="#c8b27b" strokeWidth="2" fill="none"/>
   <path d="M89 486l25-7v13l-25 7Z" fill="#050f12" stroke="#bd9a61" strokeWidth=".8"/>
   <path d="M133 395h9v18h-9ZM133 480h9v18h-9Z" fill="#b29965" stroke="#162629"/>
   <path d="M137 396v17m0 68v16" stroke="#e3c58c" strokeWidth="1"/>
   <path d="M139 498Q124 506 103 504" stroke="#987c52" fill="none" strokeWidth="1.1"/>
  </>:<>
   <path d="M141 377H325V512H141Z" fill={`url(#${id}-laminate)`}/>
   {[178,263].map(x=><g key={x} transform={`translate(${x} 397)`}>
    <path d="M-24-9H24V77H-24Z" fill="#0e1b1f" stroke="#9c865e"/>
    <path d="M-20-5H20V37H-20Z" fill="#70745a" stroke="#c1ad7a" strokeWidth=".7"/>
    <path d="M-4 0H4V24H-4Z" fill="#050e12" stroke="#d5c497" strokeWidth=".8"/>
    <path d="M-12 44H12V66H-12Z" fill="#080f14" stroke="#a98c60"/>
    <path d="M-9 63H9L5 58H-5Z" fill="#646b53"/>
    <Screw x={-17} y={0} r={1.5}/><Screw x={17} y={0} r={1.5}/>
   </g>)}
   <circle cx="318" cy="449" r="4" fill="#b99b64"/><path d="M318 447v5" stroke="#17242a"/>
  </>}
 </g>;
}

/** Sanctuary original cabinet and analytical cutaway; no publisher cabinet art or wiring is reproduced. */
function ArcadeCabinet({health=600,operator=false,label,decorative=false}:{health?:number;operator?:boolean;label:string;decorative?:boolean}) {
 const id=useId().replaceAll(":","");
 return <svg viewBox="0 0 500 590" role={decorative?undefined:"img"} aria-hidden={decorative||undefined} aria-label={decorative?undefined:label} className={s.machine}>
  <defs>
   <linearGradient id={`${id}-laminate`} x2="1" y2=".4"><stop stopColor="#465044"/><stop offset=".4" stopColor="#263634"/><stop offset="1" stopColor="#14262c"/></linearGradient>
   <linearGradient id={`${id}-metal`} x2=".8" y2="1"><stop stopColor="#e1c791"/><stop offset=".24" stopColor="#776846"/><stop offset=".7" stopColor="#b79a60"/><stop offset="1" stopColor="#433e2e"/></linearGradient>
   <linearGradient id={`${id}-glass`} x2=".4" y2="1"><stop stopColor="#355148"/><stop offset=".55" stopColor="#10272b"/><stop offset="1" stopColor="#08141c"/></linearGradient>
   <radialGradient id={`${id}-phosphor`}><stop stopColor="#a0e1b5" stopOpacity=".12"/><stop offset="1" stopColor="#76c7ad" stopOpacity="0"/></radialGradient>
   <pattern id={`${id}-tiles`} width="14" height="12" patternUnits="userSpaceOnUse"><path d="M0 0H14V12H0Z" fill="none" stroke="#9cac80" strokeWidth=".5" opacity=".19"/><path d="M2 2h8M2 4h4" stroke="#afae7b" strokeWidth=".4" opacity=".14"/></pattern>
   <pattern id={`${id}-scan`} width="4" height="3" patternUnits="userSpaceOnUse"><path d="M0 1H4" stroke="#000" opacity=".12" strokeWidth=".6"/></pattern>
   <clipPath id={`${id}-screen`}><path d="M139 128Q239 115 340 129L331 262Q236 279 148 263Z"/></clipPath>
   <clipPath id={`${id}-side`}><path d="M365 49L419 83L451 136L428 298L459 340L424 538L376 556L392 342L367 293L386 103Z"/></clipPath>
  </defs>
  <ellipse cx="257" cy="564" rx="205" ry="17" fill="#020b10" opacity=".65"/>
  <path d="M128 539v22h28v-19M333 540v21h27v-23M410 523v19h12v-21" fill="#0c171b" stroke="#8b7a52" strokeWidth="1"/>
  <path d="M113 40H356L389 102L369 285L398 340L376 553H110L87 338L113 283L85 101Z" fill={`url(#${id}-laminate)`} stroke="#b49967" strokeWidth="2"/>
  <path d="M356 40L418 74L451 134L431 289L460 338L427 533L376 553L398 340L369 285L389 102Z" fill="#172b2e" stroke="#8d885f" strokeWidth="1.5"/>
  <g clipPath={`url(#${id}-side)`} data-art-element="cabinet-side">
   <path d="M372 72l37 21 25 43-17 158 26 48-30 183-23 9 14-197-27-50 18-181Z" fill="#31433a" stroke="#998e5c"/>
   <path d="M397 151q26 27 13 85l-13 48-8-37 9-32-5-39Z" fill="#0e252b" stroke="#b4a16b" strokeWidth="1"/>
   <path d="M399 165q12 18 2 57l-4 27M398 176l-11 23 6 23m13-27 9 23-12 29" fill="none" stroke="#d2b87c" strokeWidth=".8"/>
   <path d="M400 287l14-23 7 20-12 33Z" fill="#9a8050"/><path d="M406 283l3 22" stroke="#ead09b"/>
   <path d={Array.from({length:26},(_,i)=>`M${378+i*.7} ${94+i*15}l32 18`).join("")} stroke="#0a1c22" strokeWidth=".75" opacity=".6"/>
   <path d="M409 384l23-8-6 38-22 8Z" fill="#0a1a20" stroke="#818668"/>
   <path d={Array.from({length:7},(_,i)=>`M${410-i*.8} ${389+i*4}l17-6`).join("")} stroke="#899479" strokeWidth="1"/>
  </g>
  <path d="M112 41L84 101L112 281L86 339L110 551M357 41L389 102L369 285L398 340L376 551" stroke="#cfba89" strokeWidth="3" fill="none"/>
  <path d="M117 45L91 102L117 281M361 49L383 103L364 281M116 545H371" stroke="#0b2026" strokeWidth="2" fill="none"/>
  {/* Marquee, speaker and curved screen glass remain separate manufactured layers. */}
  <path d="M119 51H349L369 90H101Z" fill="#0c1e23" stroke="#bba06b" strokeWidth="1.1"/>
  <path d="M124 57H344L358 82H111Z" fill="#47543d" stroke="#807c54" strokeWidth=".7"/>
  <path d="M128 61H338M122 79H351" stroke="#d5bf87" opacity=".6" strokeWidth=".6"/>
  <text x="236" y="76" textAnchor="middle" fill="#eee0b4" fontFamily="Georgia,serif" fontSize="16" letterSpacing="3.5">INSERT COIN</text>
  <path d="M112 95H366V107H113Z" fill="#0b1b20"/>
  <path d={Array.from({length:38},(_,i)=>`M${124+i*6} 99v5`).join("")} stroke="#7f8364" strokeWidth="1.6"/>
  <path d="M114 115H367L348 286H130Z" fill="#07161c" stroke="#a68c5d" strokeWidth="1.5"/>
  <path d="M130 122Q240 106 352 123L342 274Q240 293 139 274Z" fill={`url(#${id}-glass)`} stroke="#809883" strokeWidth="1.2"/>
  <Dungeon id={id}/>
  <path d="M141 126Q236 114 341 127M137 135L146 259M151 270Q239 282 329 270" stroke="#b4c9a0" strokeWidth=".8" opacity=".48" fill="none"/>
  <path d="M118 285H367L395 342H89Z" fill="#465044" stroke="#c0a571"/>
  <path d="M130 294H359L377 335H105Z" fill="#233733" stroke="#797d59"/>
  <path d="M134 299H355M108 336H379" stroke="#d5bb81" strokeWidth=".7"/>
  {["#b67754","#bcb383","#679b9b","#8e9b69"].map((tone,i)=><Control key={tone} x={148+i*59} color={tone} n={i+1}/>)}
  <path d="M90 343H395L393 353H92Z" fill={`url(#${id}-metal)`} stroke="#0d2025"/>
  <path d="M100 354H384L369 541H116Z" fill="#253632" stroke="#7d7654"/>
  <WoodGrain x={119} y={359} w={10} h={175} vertical/><WoodGrain x={340} y={359} w={16} h={173} vertical/>
  <CoinDoor id={id} health={health} operator={operator}/>
  <path d="M120 528H367V541H120Z" fill="#101f23" stroke="#9a8359" strokeWidth=".8"/>
  <path d="M126 532H360M129 536H357" stroke="#6a755a" strokeWidth=".65"/>
  <path d="M112 548H376V555H112Z" fill="#413f2e" stroke="#b69a67"/>
  {[[117,55],[349,55],[116,115],[359,115],[104,344],[381,344],[124,361],[365,361],[124,524],[355,524]].map(([x,y])=><Screw key={`${x}-${y}`} x={x} y={y} r={1.8}/>)}
 </svg>;
}
export default memo(ArcadeCabinet);
