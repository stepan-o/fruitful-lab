"use client";

import {useId, useState} from "react";
import {marketGames, companyRoutes, gameById, marketReviewDate, marketRoles, computeOptions, computeById, initialSelection, selectAccess, selectCompute, selectGame, computingPayment, routeSources, type MarketRole, type ComputeId} from "@/lib/sanctuary/market-map";
import {RoleEngraving, ComputingGlyph} from "./MarketIconography";
import {useLivingPlate} from "./plates/useLivingPlate";
import s from "./market-map.module.css";

export default function MarketMap({initialGameId}:{initialGameId?:string}){
 const [selection,setSelection]=useState(()=>initialGameId?selectGame(initialSelection,initialGameId):initialSelection);
 const [role,setRole]=useState<MarketRole | "route">("route");
 const [notice,setNotice]=useState("");
 const [presetId,setPresetId]=useState("");
 const preset=companyRoutes.find(item=>item.id===presetId);
 const game=gameById(selection.gameId);
 const access=game.access.find(item=>item.id===selection.accessId)!;
 const computer=computeById(selection.computeId);
 const payment=preset?.hardwarePayment?{title:`Console purchase · ${preset.company}`,detail:preset.hardwarePayment}:computingPayment(game,access,computer.id);
 const ref=useLivingPlate<HTMLElement>();
 const id=useId().replace(/:/g,"");
 const sources=[...new Map([...routeSources(game,access,computer.id),...(preset?.sources??[])].map(source=>[source.url,source])).values()];
 const titles={make:access.developer??game.developer,publish:access.publisher??game.publisher,access:access.name,compute:computer.name};
 const descriptions={make:`${titles.make} develops ${game.name}. Choosing another shop or machine does not change who made the game.`,publish:`${titles.publish} brings this release to market. Stores distribute it under their commercial agreements; selling the game does not make every store its publisher.`,access:access.detail,compute:computer.detail};
 function changeAccess(next:string){
  setPresetId("");
  const updated=selectAccess(selection,next);
  setSelection(updated);setRole("access");
  setNotice(updated.computeId!==selection.computeId?`Computing changed to ${computeById(updated.computeId).name}: ${computer.name} is not mapped for this access option.`:`${computer.name} stays selected.`);
 }
 function changeGame(next:string){
  setPresetId("");
  const updated=selectGame(selection,next);
  setSelection(updated);setRole("route");
  setNotice(`Showing ${gameById(updated.gameId).name} via ${gameById(updated.gameId).access.find(item=>item.id===updated.accessId)!.name} on ${computeById(updated.computeId).name}.`);
 }
 function chooseRoute(accessId:string,computeId:ComputeId){
  setPresetId("");
  setSelection(selectCompute(selectAccess(selection,accessId),computeId));setRole("route");
  setNotice(`Selected ${game.access.find(item=>item.id===accessId)!.name} with ${computeById(computeId).name}.`);
 }
 return <section id="market-map" className={s.map} ref={ref} data-playing="false" aria-labelledby={`${id}-title`}>
  <header className={s.header}><div><p className={s.eyebrow}>The market today · follow a game</p><h2 id={`${id}-title`}>One game. Many routes to the player.</h2></div><span className={s.date}>OCT / 2026</span></header>
  <p className={s.instruction}>Choose a game. Then change where you get it and whose machine runs it.</p>
  <div className={s.companies} role="group" aria-label="Choose a game">{marketGames.map(item=><button key={item.id} type="button" aria-pressed={item.id===game.id} onClick={()=>changeGame(item.id)} aria-controls={`${id}-chain ${id}-routes`}><strong>{item.name}</strong><span>{item.genre}</span></button>)}</div>
  <div className={s.presets}><label htmlFor={`${id}-preset`}>Or follow a company through the chain</label><select id={`${id}-preset`} value={presetId} onChange={e=>{const chosen=companyRoutes.find(item=>item.id===e.target.value);if(!chosen)return;setPresetId(chosen.id);setSelection({gameId:chosen.gameId,accessId:chosen.accessId,computeId:chosen.computeId});setRole("route");setNotice(`Following ${chosen.name} with ${gameById(chosen.gameId).name}.`);}}><option value="" disabled>Explore a company-led route…</option>{companyRoutes.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
  <div className={s.observation}><span className={s.seal} aria-hidden="true">{game.name.slice(0,1)}</span><p>{preset?.context??game.observation}</p></div>
  <div id={`${id}-chain`} className={s.chain}>
   <div className={s.flowHeading}><span>Work & access <b aria-hidden="true">→</b></span><small>Game access and computing meet at the player.</small></div>
   <div className={s.topFlow}><svg className={s.topPaths} viewBox="0 0 1000 74" preserveAspectRatio="none" aria-hidden="true"><defs><marker id={`${id}-supply`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="m1 1 6 3-6 3" fill="none" stroke="#94bfa8" strokeWidth="1.2"/></marker></defs><g stroke="#7caa97" fill="none" strokeWidth="1.2" markerEnd={`url(#${id}-supply)`}><path d="M100 68V45h200v23M300 45h200v23"/><path d="M500 45V15h400v53"/><path d="M700 68V45h176v23"/></g></svg><div className={s.topLabels} aria-hidden="true"><span>Production</span><span>Release</span><span>Game access</span><span>Computing</span></div></div>
   <div className={s.stations}>
    {marketRoles.map((stage,index)=><article key={stage.id} className={s.station} data-supplied="true" data-selected={!!preset||role===stage.id||(role==="route"&&(stage.id==="access"||stage.id==="compute"))} aria-label={stage.title}>
      <span className={s.number}>0{index+1}{preset?` · ${preset.company}`:""}</span>
      <button className={s.sceneButton} type="button" onClick={()=>setRole(stage.id)} aria-label={`Inspect ${stage.title}`} aria-pressed={role===stage.id} aria-controls={`${id}-reading`}><RoleEngraving role={stage.id} computer={computer.id} accessId={access.id}/></button>
      <div className={s.stationCopy}><h3>{stage.title}</h3><p>{stage.job}</p>
       {stage.id==="access"?<><label className={s.srOnly} htmlFor={`${id}-access`}>Game access</label><select id={`${id}-access`} value={access.id} onChange={e=>changeAccess(e.target.value)}>{game.access.map(item=><option key={item.id} value={item.id}>{item.name} · {item.kind==="purchase"?"buy":item.kind==="catalog"?"subscribe":"free"}</option>)}</select></>:stage.id==="compute"?<><label className={s.srOnly} htmlFor={`${id}-compute`}>Computing provider</label><select id={`${id}-compute`} value={computer.id} onChange={e=>{setPresetId("");setSelection(selectCompute(selection,e.target.value as ComputeId));setRole("compute");setNotice("Game access stays with "+access.name+".");}}>{computeOptions.map(item=><option key={item.id} value={item.id} disabled={!access.compute.includes(item.id)}>{item.name}{!access.compute.includes(item.id)?" — not in this route":""}</option>)}</select></>:<div className={s.fixedLabel}>Set by the game</div>}
       <button className={s.offerButton} type="button" onClick={()=>setRole(stage.id)} aria-pressed={role===stage.id} aria-controls={`${id}-reading`}>{titles[stage.id]}<span aria-hidden="true">↗</span></button>
      </div>
    </article>)}
    <article className={`${s.station} ${s.player}`} data-selected={!!preset||role==="route"||role==="access"||role==="compute"} aria-label="The player"><span className={s.number}>05</span><RoleEngraving role="player" computer={computer.id} accessId={access.id}/><div className={s.stationCopy}><h3>The player</h3><p>{computer.cloud?"A receiving device, controls and an internet connection.":"A local machine, controls and the time to play."}</p><div className={s.playerReceipt}><span>{game.name}</span><b>+</b><span>{computer.cloud?"Streamed play":"Local play"}</span></div></div></article>
   </div>
   <div className={s.bottomFlow}><svg className={s.bottomPaths} viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id={`${id}-payment`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="m1 1 6 3-6 3" fill="none" stroke="#d3b079" strokeWidth="1.2"/></marker></defs>{["access","compute"].map((part,i)=><g key={part} className={s.paymentPath} data-active={role===part||role==="route"} stroke="#bb9f6d" fill="none" markerEnd={`url(#${id}-payment)`}><path d={`M${i?908:892} 0V${i?42:90}H${i?700:500}V3`}/></g>)}</svg><div className={s.bottomLabels} aria-hidden="true"><span>{computer.cloud?(access.kind==="free"&&computer.id==="xbox-cloud"?"Free cloud access":"Computing access"):"Equipment purchase"}</span><span>{access.kind==="purchase"?"Game purchase":access.kind==="catalog"?"Catalog membership":"Optional purchases"}</span></div></div>
   <p className={s.paymentLegend}>← Payments follow the selected offers. A single membership can cover both access and computing.</p>
  </div>
  <div className={s.routeStatus} role="status">{notice||`${game.name} · ${access.name} → ${computer.name}`}</div>
  <div id={`${id}-reading`} className={s.readout}>
   <div><p className={s.eyebrow}>{role==="route"?"The selected arrangement":marketRoles.find(item=>item.id===role)!.title}</p><h3>{role==="route"?`${access.name} + ${computer.name}`:titles[role]}</h3><p>{role==="route"?access.detail:descriptions[role]}</p></div>
   <dl><div><dt>{access.kind==="purchase"?"Game purchase":access.kind==="catalog"?"Game membership":"Free entry"} · {access.company}</dt><dd>{access.payment}</dd></div><div><dt>{payment.title}</dt><dd>{payment.detail}</dd></div></dl>
  </div>
  <div id={`${id}-routes`} className={s.routes}>
   <div className={s.routesHeading}><h3>Other routes for {game.name}</h3><p>Each lit connection is selectable. The game’s makers stay in place.</p></div>
   <div className={s.routeList}>{game.access.map(path=><div key={path.id} className={s.routeRow} data-selected={path.id===access.id}><div><strong>{path.name}</strong><span>{path.kind==="purchase"?"Buy the game":path.kind==="catalog"?"Subscribe to a catalog":"Free to enter"}</span></div><span className={s.branchArrow} aria-hidden="true">→</span><div role="group" aria-label={`${path.name} computing routes`} className={s.routeChoices}>{path.compute.map(computeId=>{const choice=computeById(computeId);return <button key={computeId} type="button" onClick={()=>chooseRoute(path.id,computeId)} aria-label={`${path.name} with ${choice.name}`} aria-pressed={path.id===access.id&&computeId===computer.id} data-cloud={choice.cloud}><ComputingGlyph kind={choice.id}/>{choice.short}<small>{choice.cloud?"cloud":"local"}</small></button>;})}</div></div>)}</div>
   <p className={s.boundary}>{game.boundary}</p>
  </div>
  <details className={s.sources}><summary>Sources & scope · checked {marketReviewDate}</summary><p>Selected digital routes across PC, PlayStation and Xbox, showing how different businesses can supply the same game. These are evidenced combinations, not every edition, membership tier, device or regional offer. A missing connection means it is not mapped here. Catalog inclusion and cloud eligibility can change; one store’s license is not automatically valid in another.</p><p>Cloud play still needs a receiving device and connection. Local equipment purchases are separate from game purchases. Teal paths show provision; gold paths identify payment categories, including bundled fees and free-entry exceptions. Publisher settlement and production funding are simplified. Physical retail, mobile stores, Nintendo and other cloud services are outside this view.</p><ul>{sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></details>
 </section>;
}
