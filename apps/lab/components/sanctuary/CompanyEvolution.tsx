"use client";
import {useId,useState} from "react";
import {CircuitVignette} from "./BusinessCircuitScene";
import type {CircuitScene} from "@/lib/sanctuary/business-circuit";
import {useLivingPlate} from "./plates/useLivingPlate";
import circuit from "./business-circuit.module.css";
import s from "./company-evolution.module.css";
import ValveHardwareScene from "./ValveHardwareScene";
import {valveGames,valveCollaborations,valveInDevelopment,type ValveGame} from "@/lib/sanctuary/valve-catalog";
export type CompanyChapter = "valve-platform"|"epic-infrastructure"|"rockstar-world";
type Role={name:string;scene:CircuitScene;customer:string;payment:string;obligation:string;date:string};
const stories:Record<CompanyChapter,{title:string;note:string;roles:Role[]}>= {
 "valve-platform":{title:"The game. The store. The machine.",note:"These businesses coexist. The dates identify milestones, not a claim that Valve stopped making games.",roles:[
 {name:"Game developer",scene:"studio",date:"Half-Life · 1998",customer:"The person who wants to play Valve’s game.",payment:"A game sale pays for a particular creative work.",obligation:"Build and support an experience that makes its own promise worth buying."},
 {name:"Store operator",scene:"store",date:"Steam · 2003 / third-party games · 2005",customer:"Players choosing games, and developers seeking an audience.",payment:"The distribution agreement determines the store’s share and its partner’s settlement.",obligation:"Keep discovery, purchases, delivery and the library useful across other studios’ releases."},
 {name:"Equipment supplier",scene:"hardware",date:"Steam Deck · a further hardware role",customer:"The person buying a handheld PC.",payment:"An equipment sale is separate from a game purchase.",obligation:"Supply and support a device through which the catalog can be played."},
 ]},
 "epic-infrastructure":{title:"Four roles behind one name.",note:"A developer can use an Epic product without accepting every other Epic relationship. The contracts are distinct.",roles:[
 {name:"Engine supplier",scene:"engine",date:"Unreal Engine",customer:"A team building a game or interactive work.",payment:"Licensing terms can require royalties or seats, depending on the product and use.",obligation:"Maintain production tools and technology on which somebody else’s work depends."},
 {name:"Game maker",scene:"pc-home",date:"Fortnite",customer:"People playing Epic’s own game.",payment:"The game’s own paid offers fund a different business from engine licensing.",obligation:"Keep the experience and its services working for players."},
 {name:"Publishing partner",scene:"publisher",date:"Publishing offer · 2020",customer:"A selected developer seeking funding and release support.",payment:"Investment is recovered and profits shared under the publishing agreement.",obligation:"Finance and help release the work. Ownership need not transfer to Epic."},
 {name:"Store operator",scene:"epic-store",date:"Epic Games Store · 2018",customer:"Buyers and the developers or publishers selling to them.",payment:"The store agreement governs payment processing and distribution proceeds.",obligation:"Bring products and buyers together, then deliver and support the transaction."},
 ]},
 "rockstar-world":{title:"Build the city. Release it. Keep it running.",note:"Development and publishing belong to the same group. The arrangement is conceptual; no internal invoice or spending total is shown.",roles:[
 {name:"Rockstar North · studio",scene:"studio",date:"Development",customer:"The publishing organization commissioning the work.",payment:"Production receives a budget within the group.",obligation:"Turn the city, story, performances and rules into a working game."},
 {name:"Rockstar Games · publisher",scene:"publisher",date:"Release",customer:"Players reached through stores and other distribution partners.",payment:"Game sales arrive through those commercial agreements.",obligation:"Coordinate the release, its publicity and the commitments made to the audience."},
 {name:"An ongoing world",scene:"pc-home",date:"GTA Online · launched October 2013",customer:"Players who continue in the online setting.",payment:"Later offers can create further revenue; returning to play does not itself prove another payment.",obligation:"Keep services operating and give people reasons to gather again."},
 ]},
};
export default function CompanyEvolution({chapter}:{chapter:CompanyChapter}){
 const model=stories[chapter];const [active,setActive]=useState(0);const role=model.roles[active];const id=useId();const ref=useLivingPlate<HTMLElement>();
 return <section ref={ref} className={`${circuit.circuit} ${s.evolution}`} data-playing="false" aria-labelledby={`${id}-title`}>
  <header><p className={s.kicker}>One company · several relationships</p><h2 id={`${id}-title`}>{model.title}</h2></header>
  <div className={s.roles} role="group" aria-label="Inspect the company’s business roles">
   {model.roles.map((item,i)=><button key={item.name} type="button" aria-pressed={i===active} onClick={()=>setActive(i)} aria-controls={`${id}-detail`}>
    <svg viewBox="-6 0 224 214" aria-hidden="true"><g className={circuit.room} data-highlighted={i===active}><ellipse cx="105" cy="180" rx="100" ry="25" fill="#040d12"/>{chapter==="valve-platform"&&item.scene==="hardware"?<ValveHardwareScene/>:<CircuitVignette kind={item.scene} gameTitle={chapter==="rockstar-world"?"GRAND THEFT AUTO V":undefined}/>}</g></svg>
    <strong>{item.name}</strong><span>{item.date}</span>
   </button>)}
  </div>
  <div id={`${id}-detail`} className={s.detail} aria-live="polite"><h3>{role.name}</h3><dl><div><dt>Who is the customer?</dt><dd>{role.customer}</dd></div><div><dt>Where does payment enter?</dt><dd>{role.payment}</dd></div><div><dt>What work remains?</dt><dd>{role.obligation}</dd></div></dl></div>
  {chapter==="valve-platform"&&active===0?<ValveCatalog/>:null}
  {chapter==="valve-platform"&&active===2?<p className={s.hardwareCaption}>Steam Deck · a handheld PC built around an existing game library. <a href="https://www.steamdeck.com/en/" target="_blank" rel="noreferrer">Valve’s device ↗</a></p>:null}
  <p className={s.note}>{model.note}</p>
 </section>;
}
function CatalogEntry({game}:{game:ValveGame}){return <li><span className={s.gameYear}>{game.year}</span><div><a href={game.url} target="_blank" rel="noreferrer">{game.title}<span aria-hidden="true"> ↗</span></a>{game.note?<small>{game.note}</small>:null}</div></li>;}
function ValveCatalog(){return <section className={s.catalog} aria-label="Valve game catalog">
 <details><summary>Explore games bearing Valve’s developer credit</summary>
 <p>Games, episodes, remakes and playable shorts. Years identify these releases; a series may have begun earlier as a community project.</p>
 <ol className={s.gameList}>{valveGames.map(game=><CatalogEntry key={game.title} game={game}/>)}</ol>
 <details><summary>Collaborations and community work</summary><ul className={s.gameList}>{valveCollaborations.map(game=><CatalogEntry key={game.title} game={game}/>)}</ul></details>
 <div className={s.development}><span className={s.kicker}>Still being made</span><ul className={s.gameList}><CatalogEntry game={valveInDevelopment}/></ul></div>
 <p className={s.catalogScope}>Bundles and ports without distinct new content are grouped with their games. Published-only titles, soundtracks, tools and cancelled projects are excluded. Condition Zero’s two campaigns share an entry; Valve’s credit does not erase its partners’ work. <a href="https://store.steampowered.com/search/?developer=Valve" target="_blank" rel="noreferrer">Developer catalog ↗</a> · Checked 8 October 2026.</p></details>
 </section>;}
export function EpicSpending(){return <figure className={s.chart} aria-labelledby="epic-spend-title"><p className={s.kicker}>Reported PC consumer spending · calendar 2025 · USD</p><h2 id="epic-spend-title">The store’s sales are not its income.</h2><div className={s.barRow}><span>All PC games on the store</span><b>$1.16 billion</b><div><i style={{width:"100%"}}/></div></div><div className={s.barRow}><span>Third-party games within that total</span><b>$400 million</b><div><i style={{width:`${400/1160*100}%`}}/></div></div><figcaption>The second bar is part of the first, not an additional amount. Consumer retail spending includes taxes and excludes developer-processed in-game purchases. Neither bar measures Epic’s revenue or profit. <a href="https://store.epicgames.com/news/epic-games-store-2025-year-in-review?lang=en-US" target="_blank" rel="noreferrer">Epic’s 2025 review ↗</a></figcaption></figure>;}
