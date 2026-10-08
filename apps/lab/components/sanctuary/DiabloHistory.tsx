"use client";
import {useId,useState} from "react";
import {useLivingPlate} from "./plates/useLivingPlate";
import s from "./diablo-history.module.css";

import {historyIds,type HistoryId} from "@/lib/sanctuary/history-ids";
type Lens="play"|"work"|"sale";
const eras=[
 {year:"1996 / 1997",name:"Diablo",title:"A dungeon within reach",detail:"An immediate action game carried the uncertainty, equipment and character growth of a role-playing adventure.",play:["Enter. Fight. Discover.","A click moves the character or attacks a creature. Different dungeon layouts and equipment give another attempt new possibilities."],work:["Build the adventure", "Condor, renamed Blizzard North, made the game with Blizzard’s support. The dungeon, its rules, interface and online meeting place had to work together."],sale:["Sell the release", "The purchased game contains repeated adventures. Battle.net connects players without selling a fresh admission for each dungeon run."]},
 {year:"2000 → 2003",name:"Diablo II",title:"The road can be travelled again",detail:"A larger authored journey coexists with different builds, harder difficulties, trading and a fresh competitive start.",play:["An ending is not exhaustion", "Five original classes, branching skills and changing equipment support new approaches. Completing the story does not use up those possibilities."],work:["Enlarge. Expand. Maintain.", "New acts and cinematics give the journey a shape. Lord of Destruction adds a paid expansion; patches and Battle.net continue around the release."],sale:["A box, then an expansion", "A repeat run is already included. Patch 1.10’s 2003 ladder season changes the shared competition without introducing a season purchase."]},
 {year:"2012 → 2014",name:"Diablo III",title:"Two routes to the same equipment",detail:"A market can make an item easier to obtain while weakening the activity that made obtaining it satisfying.",play:["Find it—or shop for it", "Monster drops and auction-house listings could both improve a character. Their coexistence changed the place of the loot hunt."],work:["Redesign the reward", "Blizzard removed both auction houses and introduced Loot 2.0. The intervention changed access to equipment and the rewards of combat together."],sale:["A commercial route can close", "The gold and real-money markets closed in March 2014. Reaper of Souls remained a separately sold expansion. Removing a transaction system did not end the business."]},
 {year:"2023 onward",name:"Diablo IV",title:"An adventure, and a production calendar",detail:"The campaign belongs to a larger program of seasons, expansions, services and optional offers.",play:["Choose what continues", "Campaign progress, a seasonal character, account unlocks and the player’s own knowledge follow different rules. A new season does not erase everything."],work:["Keep making occasions", "Operating the services, revising systems and producing the next season are recurring commitments alongside larger expansion projects."],sale:["Several offers coexist", "Game access, expansions, cosmetic offers and paid reward catalogs buy different things. Returning to the world is not, by itself, another payment."]},
] as const;
function Hero({x,y,scale=1}:{x:number;y:number;scale?:number}){return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinecap="round"><ellipse cy="3" rx="15" ry="5" fill="#060f13"/><path d="m-7-28-9 23 14-3 12 7-4-29Z" fill="#973e30" stroke="#d0a36c"/><path d="M-4-27-3-10-8 3m12-30 2 18L12 1M-6-22l-10 11m20-11 12 9" stroke="#968d70" strokeWidth="4"/><circle cy="-35" r="6" fill="#dbc59b"/><path d="M-6-36q5-10 12 0" fill="#352e2c"/><path d="M17-11 26-40" stroke="#d2ded0" strokeWidth="2"/></g>}
function Treasure({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`}><path d="m-20-4 21-10 21 9L0 5Z" fill="#b9894c" stroke="#dec68f"/><path d="M-20-4v18L0 24V5Zm20 9 22-10v18L0 24Z" fill="#674c36" stroke="#b29465"/><path d="M-9 1v17M10 0v17" stroke="#e3b568" strokeWidth="3"/><rect x="-3" y="9" width="6" height="6" fill="#fff0ac"/></g>}
function Tower({x,y,tall=115}:{x:number;y:number;tall?:number}){return <g transform={`translate(${x} ${y})`}><path d={`m-32 0 32 14 32-14V${-tall}l-32-17-32 17Z`} fill="#344448" stroke="#758175"/><path d={`M0 14V${-tall+1}l32-16V0Z`} fill="#1c3139"/><path d={`m-42 ${-tall} 42-46 42 46-42 20Z`} fill="#24353a" stroke="#a29772"/>{[0,1,2].map(i=><g key={i}><path d={`m-25 ${-tall+22+i*28} 21 10m7 1 22-11`} stroke="#aab293" opacity=".35"/>{i===1?<path d={`M-19 ${-tall+36}v18l7 3v-18Z`} fill="#e2a965" className={s.lamp}/>:null}</g>)}</g>}
function EraScene({era,id}:{era:number;id:string}){
 return <svg viewBox="0 0 900 420" role="img" aria-label={eras[era].title}>
  <defs><radialGradient id={`${id}-sky`}><stop stopColor="#304345"/><stop offset="1" stopColor="#08151c"/></radialGradient><linearGradient id={`${id}-stone`} x2="0" y2="1"><stop stopColor="#58615a"/><stop offset="1" stopColor="#182d34"/></linearGradient><radialGradient id={`${id}-fire`}><stop stopColor="#ffe6a0"/><stop offset=".15" stopColor="#d48846" stopOpacity=".6"/><stop offset="1" stopColor="#c04d26" stopOpacity="0"/></radialGradient></defs>
  <rect width="900" height="420" fill={`url(#${id}-sky)`}/>
  {[0,1,2,3].map(i=><path key={i} d={`M${20+i*240} 220l70-100 80 55 80-35 60 80v95H0Z`} fill={i%2?"#182e36":"#21383b"} opacity=".45"/>)}
  <ellipse cx="450" cy="327" rx="350" ry="36" fill="#040d13" opacity=".8"/>
  <path d="m101 254 340-151 365 145-338 146Z" fill={`url(#${id}-stone)`} stroke="#8b8c6e"/>
  <path d="m101 254 367 140v15L101 270Zm367 140 338-146v17L468 409Z" fill="#152a30" stroke="#526361"/>
  <g stroke="#a4aa8a" opacity=".18">{Array.from({length:10},(_,i)=><path key={i} d={`m${119+i*33} ${246-i*14} 365 145m${130+i*34} ${265+i*13} 320-143`}/>)}</g>
  {era===0?<>
   <Tower x={330} y={235} tall={124}/><Tower x={482} y={212} tall={146}/>
   <path d="m354 246 58-89 49 21v71l-66 30Z" fill="#324349" stroke="#8b947e"/>
   <path d="M387 252v-40q13-39 27-29v78Z" fill="#06111a" stroke="#b5976b" strokeWidth="3"/>
   <path d="m388 259 27 11-114 54-32-14Z" fill="#776f57" stroke="#b4a67c"/>
   {[0,1,2,3,4].map(i=><path key={i} d={`m${292+i*19} ${315-i*9} 27 11`} stroke="#253d43" strokeWidth="4"/>)}
   <Hero x={322} y={303} scale={1.4}/><Treasure x={563} y={290}/>
   <circle cx="414" cy="238" r="87" fill={`url(#${id}-fire)`} className={s.lamp}/>
  </>:era===1?<>
   <path d="M210 310q60-85 182-68t173-67q20-25 66-23" fill="none" stroke="#172b31" strokeWidth="34"/>
   <path d="M210 304q60-85 182-68t173-67q20-25 66-23" fill="none" stroke="#baac7c" strokeWidth="19"/>
   <path d="M210 304q60-85 182-68t173-67q20-25 66-23" fill="none" stroke="#d7c593" strokeWidth="2" strokeDasharray="3 9"/>
   <Tower x={604} y={201} tall={135}/><Tower x={288} y={229} tall={87}/>
   <Hero x={381} y={265} scale={1.5}/><Hero x={458} y={254} scale={1.1}/><Treasure x={558} y={313}/>
   <path d="M257 296c-62-20-86 27-44 52 44 26 111 4 115-28" fill="none" stroke="#77b2a5" strokeWidth="3" strokeDasharray="6 6" className={s.path}/><path d="m316 322 13-8 5 17" fill="none" stroke="#b4d5bb" strokeWidth="3"/>
  </>:era===2?<>
   <Tower x={272} y={240} tall={112}/>
   <path d="m361 257 87-40 104 42-91 41Z" fill="#928765" stroke="#e1c48a"/>
   <path d="m380 267 2 49 11 4v-48m143-3-2 48-12 5v-48" stroke="#ad9566" strokeWidth="7"/>
   <path d="M448 261V139m-79 26 79-19 81 21m-151 8v45m140-44v45" fill="none" stroke="#c6a46a" strokeWidth="6"/>
   <path d="m350 219 57 1q-27 41-57-1m139 1h57q-29 42-57 0" fill="#647e77" stroke="#ddc18a" strokeWidth="2"/>
   <Treasure x={371} y={212}/><g fill="#d9ae61" stroke="#755a36">{[0,1,2,3].map(i=><ellipse key={i} cx={513} cy={213-i*4} rx="18" ry="5"/>)}</g>
   <Hero x={610} y={305} scale={1.4}/><path d="m570 325-85 25-100-40" fill="none" stroke="#8bb6a3" strokeWidth="3" strokeDasharray="4 8" className={s.path}/>
   <path d="M581 156h112v85H581Z" fill="#182f38" stroke="#8c9d89"/><path d="m593 177 30 10 53-9m-83 20 65 21" stroke="#cf7954" strokeWidth="3"/>
  </>:<>
   <Tower x={411} y={233} tall={146}/><Tower x={586} y={207} tall={90}/>
   <ellipse cx="451" cy="277" rx="220" ry="74" fill="none" stroke="#8eb5a1" strokeWidth="3" strokeDasharray="8 6" className={s.path}/>
   {[0,1,2].map(i=><g key={i} transform={`translate(${259+i*126} ${258+i*25})`}><path d="m0 0 56-24 45 18v53L46 72 0 51Z" fill="#314a48" stroke="#b2a67c"/><path d="m0 0 46 18 55-24M46 18v54" fill="none" stroke="#b2a67c"/><path d="M13 17v18m15-12v18" stroke={i===1?"#dc8a51":"#8fc0ad"} strokeWidth="4"/><circle cx="72" cy="26" r="8" fill="#d9b674" className={s.lamp}/></g>)}
   <Hero x={648} y={312} scale={1.4}/><Hero x={696} y={280} scale={1.1}/>
  </>}
  <g fill="#d4b16c" opacity=".7">{Array.from({length:11},(_,i)=><circle key={i} cx={210+(i*59)%470} cy={140+(i*43)%151} r={i%3===0?1.8:1} className={s.mote} style={{animationDelay:`-${i*.63}s`}}/>)}</g>
  <path d="M20 57V20h48M832 20h48v37M20 363v37h48m764 0h48v-37" fill="none" stroke="#9c8b67" opacity=".65"/>
 </svg>;
}
export function HistoryScene({chapter}:{chapter:HistoryId}){
 const era=historyIds.indexOf(chapter),model=eras[era],id=useId();const ref=useLivingPlate<HTMLElement>();
 return <figure ref={ref} className={s.scene} data-playing="false"><div className={s.kicker}><span>Sanctuary through time</span><span>{model.year}</span></div><EraScene era={era} id={id}/><figcaption><h2>{model.title}</h2><p>{model.detail}</p><small>Original illustration · historical mechanisms, not a reconstructed game scene</small></figcaption></figure>;
}
export function HistoryComparison({chapter}:{chapter:HistoryId}){
 const [lens,setLens]=useState<Lens>("play");const active=historyIds.indexOf(chapter);const id=useId();
 return <section className={s.comparison} aria-labelledby={`${id}-title`}><p className={s.kicker}>The same series · different commitments</p><h2 id={`${id}-title`}>What changed around the adventure?</h2><div className={s.lenses} role="group" aria-label="Compare Diablo history"><button type="button" aria-pressed={lens==="play"} onClick={()=>setLens("play")}>The player’s evening</button><button type="button" aria-pressed={lens==="work"} onClick={()=>setLens("work")}>The studio’s work</button><button type="button" aria-pressed={lens==="sale"} onClick={()=>setLens("sale")}>The next payment</button></div><ol className={s.eras} aria-live="polite">{eras.map((era,i)=><li key={era.name} data-current={i===active}><span className={s.date}>{era.year}</span><h3>{era.name}</h3><strong>{era[lens][0]}</strong><p>{era[lens][1]}</p>{i===active?<span className={s.here}>This chapter</span>:null}</li>)}</ol><p className={s.note}>Selected historical arrangements. The columns compare responsibilities and rules; their widths do not represent audience size or revenue. Paid editions, regions and later changes can differ.</p></section>;
}
