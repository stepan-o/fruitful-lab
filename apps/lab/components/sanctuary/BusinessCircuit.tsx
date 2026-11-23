"use client";
import { useId, useState, type CSSProperties } from "react";
import { businessCircuits, localCloudCircuits, circuitAccessOptions, partyTitle, type CircuitScene, type BusinessCircuit as CircuitModel } from "@/lib/sanctuary/business-circuit";
import { CircuitVignette } from "./BusinessCircuitScene";
import { useLivingPlate } from "./plates/useLivingPlate";
import s from "./business-circuit.module.css";

type CircuitSelection = {kind:"party"|"supply"|"payment";index:number};
function paymentForSelection(selection:CircuitSelection,model:CircuitModel){
 if(selection.kind==="payment")return selection.index;
 if(selection.kind==="supply")return model.supplies[selection.index].payment;
 const incoming=model.payments.findIndex(item=>item.to===selection.index);
 return incoming>=0?incoming:model.payments.findIndex(item=>item.from===selection.index);
}
function participantsForSelection(selection:CircuitSelection,model:CircuitModel){
 if(selection.kind==="party")return [selection.index];
 const connection=selection.kind==="supply"?model.supplies[selection.index]:model.payments[selection.index];
 return [connection.from,connection.to];
}
function FlowArrow({id,color}:{id:string;color:string}){
 return <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M1 1 7 4 1 7" fill="none" stroke={color} strokeWidth="1.5"/></marker>;
}
function FlowTrace({d,active,marker}:{d:string;active:boolean;marker:string}){
 return <>
  <path d={d} fill="none" stroke="#070f12" strokeWidth="6" vectorEffect="non-scaling-stroke"/>
  <path d={d} className={s.track} fill="none" strokeWidth={active?2:1} vectorEffect="non-scaling-stroke" markerEnd={`url(#${marker})`}/>
  {active?<path d={d} className={s.flowPulse} fill="none" strokeWidth="2.5" strokeDasharray="2 28" vectorEffect="non-scaling-stroke"/>:null}
 </>;
}
function RoomScene({kind,highlighted,id,gameTitle,catalogAccess}:{kind:CircuitScene;highlighted:boolean;id:string;gameTitle?:string;catalogAccess?:boolean}){
 return <g className={s.room} data-highlighted={highlighted}>
  <defs><radialGradient id={id}><stop stopColor="#f6d59a" stopOpacity=".08"/><stop offset=".64" stopColor="#ebc585" stopOpacity=".38"/><stop offset=".84" stopColor="#deb574" stopOpacity=".18"/><stop offset="1" stopColor="#deb574" stopOpacity="0"/></radialGradient></defs>
  <ellipse className={s.sceneHalo} cx="105" cy="110" rx="130" ry="120" fill={`url(#${id})`}/>
  <CircuitVignette kind={kind} gameTitle={gameTitle} catalogAccess={catalogAccess}/>
  <path className={s.sceneOutline} d="M8 51 105 12 202 51v108l-97 39-97-39Z" fill="none" stroke="#f0ce8e" strokeWidth="1.4"/>
 </g>;
}
export default function BusinessCircuit({cloudOnly=false}:{cloudOnly?:boolean}){
 const routes=cloudOnly?localCloudCircuits:businessCircuits;
 const [route,setRoute]=useState(cloudOnly?1:0);
 const [accessMode,setAccessMode]=useState<"purchase"|"catalog"|null>(null);
 const [selection,setSelection]=useState<CircuitSelection>({kind:"payment",index:routes[cloudOnly?1:0].defaultPayment??1});
 const [hoverSelection,setHoverSelection]=useState<CircuitSelection|null>(null);
 const [focusSelection,setFocusSelection]=useState<CircuitSelection|null>(null);
 function preview(target:CircuitSelection){return {onPointerEnter:()=>setHoverSelection(target),onPointerLeave:()=>setHoverSelection(null),onFocus:()=>{setHoverSelection(null);setFocusSelection(target);},onBlur:()=>setFocusSelection(null)};}
 function select(target:CircuitSelection){setHoverSelection(null);setFocusSelection(null);setSelection(target);}
 const ref=useLivingPlate<HTMLElement>();
 const id=useId().replace(/:/g,"");
 const accessOptions=cloudOnly?undefined:circuitAccessOptions[routes[route].id];
 const model=accessOptions&&accessMode?accessOptions[accessMode]:routes[route];
 const width=model.parties.length*230,centers=model.parties.map((_,i)=>115+i*230);

 const payment=paymentForSelection(selection,model),transfer=model.payments[payment];
 const party=selection.kind==="party"?selection.index:transfer.to,selected=model.parties[party];
 const participants=participantsForSelection(selection,model);
 const previewSelection=hoverSelection??focusSelection;
 const spotlight=previewSelection?participantsForSelection(previewSelection,model):participants;
 const isHighlighted=(index:number)=>spotlight.includes(index);
 // Display receipts in spatial order; state still refers to the original transaction.
 const numberedPayments=model.payments.map((item,i)=>({item,i})).sort((a,b)=>(a.item.from+a.item.to)-(b.item.from+b.item.to)).map((entry,index)=>({...entry,number:index+1}));
 const paymentHeight=model.payments.some(item=>Math.abs(item.from-item.to)>1)?140:90;
 const branched=model.supplies.some(item=>Math.abs(item.to-item.from)>1);
 const supplyHeight=branched?262:142;
 const supplyLane=(index:number)=>branched?(Math.abs(model.supplies[index].to-model.supplies[index].from)>1?64:184):78;
 function changeRoute(index:number){setAccessMode(null);setRoute(index);select({kind:"payment",index:routes[index].defaultPayment??(routes[index].id==="arcade"?1:routes[index].id==="netflix"?0:2)});}
 return <section ref={ref} className={s.circuit} data-party-count={model.parties.length} style={{"--party-count":model.parties.length,"--payment-count":model.payments.length} as CSSProperties} data-playing="false" aria-labelledby={`${id}-title`}>
  <header className={s.heading}><p className={s.kicker}>The arrangement behind the screen</p><h2 id={`${id}-title`}>What has to keep selling?</h2></header>
  {!cloudOnly?<p className={s.guide}>Compare the arcade with PC, console and cloud routes for Cyberpunk 2077, or with Netflix. Select a scene or exchange to inspect the work and payments. More combinations appear in the <a href="#market-map">market map</a> below.</p>:null}
  <div className={s.routes} role="group" aria-label="Compare business arrangements">{routes.map((item,i)=><button key={item.id} type="button" aria-pressed={route===i} onClick={()=>changeRoute(i)}>{item.label}</button>)}</div>
  {accessOptions?<div className={s.accessOptions} role="group" aria-label="Choose how to access the game"><span>Game access</span>{(["purchase","catalog"] as const).map(access=><button key={access} type="button" aria-pressed={model.accessMode===access} onClick={()=>{setAccessMode(access);select({kind:"payment",index:accessOptions[access].defaultPayment??2});}}>{access==="catalog"?"Catalog membership":"Purchased game"}</button>)}</div>:null}
  <p className={s.context}>{model.context}</p>
  {model.play?<dl className={s.playTerms}><div><dt>Access to the game</dt><dd>{model.play.access}</dd></div><div><dt>Where it runs</dt><dd>{model.play.compute}</dd></div></dl>:null}
  {model.alternative?<p className={s.alternative}>{model.alternative.text} <a href={model.alternative.url} target="_blank" rel="noreferrer">{model.alternative.label} ↗</a></p>:null}
  <div className={s.stage}>
   <div className={s.legend}><span><i aria-hidden="true"/>What they supply</span></div><p id={`${id}-supply-note`} className={s.legendNote}>Products & services · supplier → recipient. Select a box to trace both sides of the exchange.</p>
   <div className={`${s.supplyMap} ${branched?s.branched:""}`}>
    <svg viewBox={`0 0 ${width} ${supplyHeight}`} preserveAspectRatio="none" aria-hidden="true">
     <defs><FlowArrow id={`${id}-work-arrow`} color="#9ed8c2"/></defs>
     {model.supplies.map(({from,to,payment:linkedPayment},i)=>{const a=centers[from]+(i-1)*12,b=centers[to]+(i-1)*12,y=supplyLane(i);const d=`M${a} ${supplyHeight-5}V${y+9}q0-9 9-9H${b-9}q9 0 9 9V${supplyHeight-6}`;return <g key={i} data-active={payment===linkedPayment} className={`${s.flowRoute} ${s.supplyRoute}`}>
      <FlowTrace d={d} active={payment===linkedPayment} marker={`${id}-work-arrow`}/>
     </g>;})}
    </svg>
    <ul className={s.supplyLabels} aria-label="What each participant supplies" aria-describedby={`${id}-supply-note`}>{model.supplies.map((item,i)=><li key={`${model.id}-${i}`} style={{left:`${(centers[item.from]+centers[item.to])/2/width*100}%`,top:supplyLane(i)}}>
     <button type="button" aria-pressed={payment===item.payment} {...preview({kind:"supply",index:i})} aria-controls={`${id}-transfer ${id}-party`} onClick={()=>select({kind:"supply",index:i})}><strong>{item.name}</strong><span>{partyTitle(model.parties[item.from])} <b aria-hidden="true">→</b><span className={s.srOnly}> to </span> {partyTitle(model.parties[item.to])}</span></button>
    </li>)}</ul>
   </div>
   <div className={s.panoramaWrap}><svg className={s.panorama} viewBox={`0 58 ${width} 226`} aria-hidden="true">
    <defs><radialGradient id={`${id}-light`}><stop stopColor="#5c6549" stopOpacity=".22"/><stop offset="1" stopColor="#172b2b" stopOpacity="0"/></radialGradient><pattern id={`${id}-engrave`} width="7" height="7" patternUnits="userSpaceOnUse"><path d="m-1 1 9 9M5-1l3 3" stroke="#bb996a" strokeWidth=".4" opacity=".12"/></pattern></defs>
    <ellipse cx={width/2} cy="188" rx={width/2-5} ry="118" fill={`url(#${id}-light)`}/>
    <path d={`M4 254h${width-8}v17l-16 9H20L4 271Z`} fill="#132226" stroke="#6c7257"/><path d={`M8 259h${width-16}v8H8Z`} fill={`url(#${id}-engrave)`}/><path d={`M20 276h${width-41}`} stroke="#b2a173" strokeOpacity=".4"/>

    {model.parties.map((item,i)=><g key={`${i}-${item.scene}`} transform={`translate(${12+i*230} 58)`}><ellipse cx="104" cy="186" rx="103" ry="26" fill="#030c10" opacity=".7"/><RoomScene kind={item.scene} gameTitle={item.gameTitle} catalogAccess={item.catalogAccess} highlighted={isHighlighted(i)} id={`${id}-desktop-glow-${i}`}/><path d="M17 208h176" stroke={isHighlighted(i)?"#f4d69b":"#696950"} strokeWidth={isHighlighted(i)?2.5:1}/></g>)}
   </svg><div className={s.sceneTargets} role="group" aria-label="Inspect an illustrated room">{model.parties.map((item,i)=><button key={i} type="button" aria-label={`Inspect ${partyTitle(item)} scene`} aria-pressed={participants.includes(i)} onClick={()=>select({kind:"party",index:i})} {...preview({kind:"party",index:i})} aria-controls={`${id}-party`}/>)}</div></div>
   <div className={s.parties} role="group" aria-label="Inspect a business or its customer">{model.parties.map((item,i)=><button key={i} type="button" aria-pressed={participants.includes(i)} data-highlighted={isHighlighted(i)} onClick={()=>select({kind:"party",index:i})} {...preview({kind:"party",index:i})} aria-controls={`${id}-party`}><svg className={s.mobileScene} viewBox="0 0 210 212" aria-hidden="true"><RoomScene kind={item.scene} gameTitle={item.gameTitle} catalogAccess={item.catalogAccess} highlighted={isHighlighted(i)} id={`${id}-mobile-glow-${i}`}/></svg><span className={s.partyNumber}>0{i+1}</span><strong>{item.name} <span className={s.partyCategory}>({item.category})</span></strong><small>{item.role}</small></button>)}</div>
   <div className={`${s.legend} ${s.paymentLegend}`}><span><i aria-hidden="true"/>Who pays whom</span></div><p id={`${id}-payment-note`} className={`${s.legendNote} ${s.paymentNote}`}>Purchases, fees & revenue shares · payer → recipient. Each box is a separate transaction.</p>
   <svg viewBox={`0 0 ${width} ${paymentHeight}`} className={s.returnPaths} role="img" aria-label={`Payment routes: ${model.payments.map(p=>`${partyTitle(model.parties[p.from])} to ${partyTitle(model.parties[p.to])}, ${p.name}`).join('; ')}. Lines show relationships, not amounts or payment dates.`}>
    <defs><FlowArrow id={`${id}-money-arrow`} color="#deb37c"/></defs>
    {[...numberedPayments].sort((a,b)=>Number(a.i===payment)-Number(b.i===payment)).map(({item,i,number})=>{const a=centers[item.from],b=centers[item.to],y=Math.abs(item.from-item.to)===1?55:106,d=`M${a} 3V${y-9}q0 9-9 9H${b+9}q-9 0-9-9V7`;return <g key={`${model.id}-${i}`} data-active={payment===i} className={s.flowRoute}>
     <FlowTrace d={d} active={payment===i} marker={`${id}-money-arrow`}/>
     <circle cx={(a+b)/2} cy={y} r="11" fill="#182528" stroke={payment===i?"#deb37c":"#76664c"}/><text x={(a+b)/2} y={y+4} textAnchor="middle" fill={payment===i?"#f7ddad":"#b0a385"} fontSize="12" fontFamily="monospace">{number}</text>
    </g>})}
   </svg>
  </div>
  <div className={s.receipts} role="group" aria-label="Follow a payment" aria-describedby={`${id}-payment-note`}>{numberedPayments.map(({item,i,number})=><button key={i} type="button" aria-pressed={payment===i} {...preview({kind:"payment",index:i})} onClick={()=>select({kind:"payment",index:i})} aria-controls={`${id}-transfer ${id}-party`}><span aria-hidden="true">{number}</span><strong>{item.name}</strong><small>{partyTitle(model.parties[item.from])} → {partyTitle(model.parties[item.to])}</small></button>)}</div>
  <p id={`${id}-transfer`} className={s.transfer} aria-live="polite">{transfer.explanation}</p>
  <div id={`${id}-party`} className={s.readout} aria-live="polite">
   <div className={s.readoutTitle}><span aria-hidden="true">0{party+1}</span><h3>{selected.name} <span className={s.partyCategory}>({selected.category})</span></h3><p>{selected.role}</p></div>
   <dl><div><dt>Pays for</dt><dd>{selected.pays}</dd></div><div><dt>{party===model.parties.length-1?"Receives":"Earns from"}</dt><dd>{selected.earns}</dd></div></dl>
   <div className={s.next}><p className={s.kicker}>{party===model.parties.length-1?"What brings them back":"What it needs next"}</p><p>{selected.next}</p></div>
  </div>
  <details className={s.sources}><summary>Sources & limits of this comparison</summary><p>{model.note}</p><p>The arrangements create different commercial incentives. They do not prescribe one game design, and the lines do not measure revenue, profit or payment timing.</p><ul>{model.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></details>
 </section>;
}
