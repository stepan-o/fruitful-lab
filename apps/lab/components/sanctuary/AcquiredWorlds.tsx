"use client";
import {useRef,useState} from "react";
import Link from "next/link";
import AssetImage from "@/components/media/AssetImage";
import {imageAsset,type AssetManifest} from "@/lib/assets/types";
import {portfolio} from "@/lib/sanctuary/acquired-portfolio";
import s from "./acquired-worlds.module.css";
const names:Record<string,string>={"infinity-ward-logo":"Infinity Ward","treyarch-logo":"Treyarch","raven-logo":"Raven Software","blizzard-logo":"Blizzard Entertainment","king-logo":"King"};
function Picture({assets,id,alt,hero=false,preload=false}:{assets:AssetManifest;id:string;alt:string;hero?:boolean;preload?:boolean}) {
 return <AssetImage asset={imageAsset(assets,id)} alt={alt} preload={preload} sizes={hero?"(max-width:720px) 92vw, 640px":"(max-width:720px) 92vw, 320px"}/>;
}
function Source({id}:{id:string}){return <Link prefetch={false} href={`/stepanoskin/game-monetization/credits#${id}`}>Source & use ↗</Link>;}
export default function AcquiredWorlds({assets}:{assets:AssetManifest}) {
 const [selected,setSelected]=useState<string|null>(null);
 const triggers=useRef<Record<string,HTMLButtonElement|null>>({});
 const game=portfolio.find(item=>item.id===selected);
 return <section className={s.portfolio} aria-labelledby="acquired-worlds-title" id="acquired-worlds">
  <header><span className={s.eyebrow}>Activision · Blizzard · King / acquired by Microsoft, 2023</span><h3 id="acquired-worlds-title">Three invitations to play.</h3><p>A blockbuster, a dark adventure, a pocket-sized puzzle. The same acquisition reached all three.</p></header>
  <div className={s.posters}>{portfolio.map(item=><article key={item.id} data-tone={item.tone}>
    <div className={s.poster}><Picture assets={assets} id={item.poster} alt={item.alt}/></div>
    <div className={s.cardText}><span className={s.eyebrow}>{item.subtitle}</span><h4>{item.title}</h4><p>{item.claim}</p>
    <button type="button" ref={node=>{triggers.current[item.id]=node;}} aria-expanded={selected===item.id} aria-controls="portfolio-gameplay" onClick={()=>setSelected(selected===item.id?null:item.id)}>{selected===item.id?"Close gameplay":"See how it plays"} <span aria-hidden="true">↗</span></button>
    <div className={s.marks}>{item.marks.map(id=><div className={id==="blizzard-logo"?s.paperMark:undefined} key={id}><Picture assets={assets} id={id} alt={names[id]}/></div>)}</div>
    <p className={s.origin}>{item.origin}</p><small>{item.credit} <Source id={item.poster}/></small></div>
  </article>)}</div>
  <div id="portfolio-gameplay" aria-live="polite">{game?<figure className={s.playView} data-phone={game.id==="candy"}>
   <Picture assets={assets} id={game.play} alt={game.playAlt} hero/>
   <figcaption><span className={s.eyebrow}>Inside the game</span><h4>{game.title}</h4><p>{game.reading}</p><small>{game.credit} <Source id={game.play}/></small><button type="button" onClick={()=>{setSelected(null);triggers.current[game.id]?.focus();}}>Close gameplay</button></figcaption>
  </figure>:null}</div>
 </section>;
}
export function CandyOpening({assets}:{assets:AssetManifest}){
 return <figure className={s.candyOpening}>
  <Picture assets={assets} id="candy-poster" alt={portfolio[2].alt} hero preload/>
  <figcaption><div className={s.kingSignature}><Picture assets={assets} id="king-logo" alt="King"/><span>Created by King<br/>Facebook & mobile · 2012</span></div><h2>A little game.<br/>A very long life.</h2><small>© King.com Ltd. Official artwork. <Source id="candy-poster"/></small></figcaption>
 </figure>;
}
export function FreemiumOffer({assets}:{assets:AssetManifest}) {
 const [route,setRoute]=useState<"play"|"purchase">("play");
 return <figure className={s.offer} aria-labelledby="freemium-offer-title">
  <div className={s.phone}><Picture assets={assets} id="candy-phone" alt={portfolio[2].playAlt}/><small>King’s App Store promotion · © King.com Ltd.<br/><Source id="candy-phone"/></small></div>
  <figcaption><span className={s.eyebrow}>Where the sale happens</span><h3 id="freemium-offer-title">You are already playing.</h3><p>The purchase appears inside an experience the player has already tried.</p>
   <div className={s.routeButtons} role="group" aria-label="Compare free play and an optional purchase"><button type="button" aria-pressed={route==="play"} onClick={()=>setRoute("play")}>Keep playing free</button><button type="button" aria-pressed={route==="purchase"} onClick={()=>setRoute("purchase")}>Buy assistance</button></div>
   <svg className={s.offerDiagram} viewBox="0 0 480 260" role="img" aria-label={route==="play"?"Free entry leads to play, with another attempt or a wait; a purchase is optional.":"An optional purchase supplies assistance within play. It does not purchase the whole game."}>
    <path d="M50 100H430M235 105V216H415" fill="none" stroke="#5b5a4e" strokeWidth="2"/>
    <path d={route==="play"?"M50 100H430":"M50 100H235V216H415"} fill="none" stroke={route==="play"?"#9dbba8":"#dfb880"} strokeWidth="3"/>
    <path d="m421 94 9 6-9 6M406 210l9 6-9 6" fill="none" stroke="#dfb880" strokeWidth="2"/>
    <g fill="#102125" stroke="#9dbba8" strokeWidth="2"><rect x="22" y="67" width="100" height="66" rx="10"/><rect x="182" y="67" width="106" height="66" rx="10"/><circle cx="405" cy="100" r="26"/></g>
    <g fill="#eee5cf" textAnchor="middle" fontSize="17" fontFamily="Georgia,serif"><text x="72" y="95">Enter</text><text x="72" y="116" fontSize="13">No box price</text><text x="235" y="106">Play</text><text x="405" y="106">↻</text><text x="401" y="156" fontSize="14">Try again / wait</text></g>
    <rect x="278" y="190" width="137" height="53" rx="8" fill="#352820" stroke="#cfa271"/><text x="346" y="221" textAnchor="middle" fill="#f3d9a8" fontSize="17" fontFamily="Georgia,serif">Optional help</text>
   </svg>
   <p className={s.routeReading}>{route==="play"?"An unpaid player can progress. Earned assistance, another attempt or a break can keep the relationship going without a transaction.":"Extra moves or a booster change a particular attempt. A consumable can be used up, so another occasion may create another offer."}</p>
   <small>Illustrative routes; no conversion rate implied. Offer details vary. Source: <a href="https://apps.apple.com/us/app/candy-crush-saga/id553834731" target="_blank" rel="noreferrer">King’s description ↗</a></small>
  </figcaption>
 </figure>;
}
export function KingOwnership({assets}:{assets:AssetManifest}){
 return <figure className={s.ownership} aria-labelledby="king-ownership-title"><figcaption><span className={s.eyebrow}>Follow the maker, then the owners</span><h3 id="king-ownership-title">King made the game. Two deals changed its parent.</h3></figcaption><ol>
  <li><time>2003 → 2012</time><div className={s.timelineMark}><Picture assets={assets} id="king-logo" alt="King"/></div><strong>King builds the business</strong><p>Browser games, then Candy Crush Saga on Facebook and phones.</p></li>
  <li><time>2016</time><div className={s.timelineMark}><Picture assets={assets} id="activision-logo" alt="Activision"/><span>+ Blizzard</span></div><strong>Activision Blizzard buys King</strong><p>US$5.9bn announced equity value. King joins the group as its mobile business.</p></li>
  <li><time>2023</time><div className={s.timelineMark}><span className={s.microsoftName}>Microsoft</span></div><strong>Microsoft buys the parent</strong><p>US$75.4bn reported purchase price for Activision Blizzard, including King.</p></li>
 </ol><small>Different transaction measures; not prices assigned to Candy Crush alone. <a href="https://investor.activision.com/node/22586" target="_blank" rel="noreferrer">2016 deal ↗</a> · <a href="https://www.microsoft.com/investor/reports/ar24/" target="_blank" rel="noreferrer">2023 deal ↗</a> · <Source id="king-logo"/> · <Source id="activision-logo"/></small></figure>;
}
