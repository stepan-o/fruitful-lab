"use client";
import {useEffect,useRef,useState} from "react";
import type {Frame} from "../../../lib/loopforge/engine/wire";
import type {CampaignFloor} from "../../../lib/loopforge/engine/floor-view";
import { visibleFloorSpeech } from "../../../lib/loopforge/engine/music-score";
import {type Room} from "../../../lib/loopforge/shifts/contract";
import art from "../../../public/loopforge-design/day-two-ui/art.json";
import RoomCamera from "./RoomCamera";
import c from "./day-two.module.css";

function Ratings({title,values}:{title:string;values:number[]}) {
  return <div className={c.statset}><strong>{title}</strong>{["Force","Precision","Timing"].map((stat,i)=><span className={c.stat+" "+c["s"+i]} key={stat}><span>{stat}</span><meter min={0} max={5} value={values[i]} aria-label={title+" "+stat}/><em>{values[i]}/5</em></span>)}</div>;
}
type Props={room:Room;chooseRoom:(room:Room)=>void;frame:Frame;floor:CampaignFloor;paused:boolean;pending:boolean;onIntent:(i:object)=>void};
export default function ShiftFloor({frame,floor,paused,pending,onIntent,room,chooseRoom}:Props){
  const w=frame.state.world,f=w.floor!, held=f.held,live=f.lesson==="live",blocked=paused||pending;
  const [incident,setIncident]=useState<number|null>(null),[exchange,setExchange]=useState(false);
  const [orders,setOrders]=useState(false),[worker,setWorker]=useState(""),[station,setStation]=useState(0);
  const previousTick=useRef(frame.tick),heading=useRef<HTMLHeadingElement>(null);
  const back=useRef<HTMLButtonElement>(null),marker=useRef<HTMLButtonElement>(null),returning=useRef(false);
  const open=f.status==="open"&&floor.tick<f.deadline, reading=incident!==null&&incident===f.deadline&&f.status!=="none";
  const seconds=Math.ceil(Math.max(0,f.deadline-floor.tick)/20);
  const crew=floor.workers.filter(a=>held?f.crew.includes(a.id):a.available);
  const selected=crew.find(a=>a.id===worker),machine=floor.machines[station];
  const speech=visibleFloorSpeech(frame.state,room);
  const desk=frame.state.events.filter(e=>e.kind==="speech.delivered"&&e.room==="security"&&(e.speaker==="bob"||e.speaker==="LIMEN"));
  const hold=desk.findLastIndex(e=>e.text==="No ID. Hold both desks.");
  const caseLines=hold<0?[]:desk.slice(Math.max(0,hold-2),hold+1);
  useEffect(()=>{
    if(frame.tick<previousTick.current){setIncident(null);setExchange(false);setWorker("");setStation(0);setOrders(false);}
    previousTick.current=frame.tick;
  },[frame.tick]);
  useEffect(()=>{setWorker("");setOrders(false);setStation(0);},[f.shotSeq,f.lesson]);
  useEffect(()=>{
    if(reading)back.current?.focus({preventScroll:true});
    else if(returning.current){(marker.current??heading.current)?.focus({preventScroll:true});returning.current=false;}
    else heading.current?.focus({preventScroll:true});
  },[reading,room]);
  useEffect(()=>{if(reading&&f.status==="pass"){returning.current=true;setIncident(null);}},[reading,f.status]);
  function inspect(){chooseRoom("security");setExchange(false);setIncident(f.deadline);}
  function leave(){returning.current=true;setIncident(null);}
  function send(action:string,target:string,id:string,at:Room){if(!blocked)onIntent({action,target,incident:id,room:at});}
  function post(i:number){if(selected)send(held?"post":"assign",floor.machines[i].name,selected.id,"conveyor");}
  if(reading)return <main className={c.screen} data-screen="incident" onKeyDown={e=>{if(e.key==="Escape")leave();}}>
    <picture className={c.painting}><source media="(max-aspect-ratio:10/11)" srcSet={"/loopforge-design/day-two-ui/"+art["event-tall"]}/><img src={"/loopforge-design/day-two-ui/"+art["event-wide"]} alt="bob holds out an empty palm across the counter from LIMEN."/></picture>
    <header className={c["cinema-head"]}><span className={c.code}>CAM 02 / Security</span><button ref={back} className={c.backlink} onClick={leave}>↶ Security</button></header>
    <div className={c["cinema-foot"]+" "+c.incidentFoot}><div><small className={c.eyeline}>Checkpoint incident</small><h1>Missing ID</h1><button className={c.exchange} aria-expanded={exchange} onClick={()=>setExchange(!exchange)}>≋ Desk exchange</button></div>
      <div className={c["cinema-action"]}>{open?<><p>Admit bob until the bell. Uses today’s one intervention. <b>{seconds}s</b></p>
        <button className={c.key} disabled={blocked} onClick={()=>send("issue-pass","bob","D2-bob-id","security")}>Issue daily pass</button>
        <button className={c.quiet} disabled={blocked} onClick={()=>send("reject-pass","bob","D2-bob-id","security")}>Reject pass · detain bob</button></>:
        <><p role="status">{f.status==="pass"?"Daily pass granted.":"The decision window has closed. bob is held until the bell."}</p><button className={c.key} onClick={leave}>Return to camera</button></>}</div></div>
    {exchange&&<aside className={c.transcript} aria-label="Desk exchange">{caseLines.map(e=><p key={e.event_id}><b>{e.speaker}</b> {e.text}</p>)}</aside>}
    {pending&&<span className={c["order-status"]} role="status">Sending order…</span>}
  </main>;
  const remaining=Math.ceil(Math.max(0,f.bell-floor.tick)/20);
  const roomName=room==="security"?"Security":"Conveyor";
  const inspected=floor.workers.find(a=>a.id===worker);
  return <main className={c.screen} data-room={room} data-screen={room}>
    <RoomCamera room={room} scene={floor.scene} tick={floor.tick} stroke={floor.stroke} paused={paused}>
      {speech.filter((e,i,all)=>all.findLastIndex(other=>other.speaker===e.speaker)===i).map(e=>
        <div className={c.speech} key={e.event_id} role="status" data-actor={e.speaker} data-speech="true"><b>{e.speaker}</b>{e.text}</div>)}
      {room==="security"&&open&&<button ref={marker} data-actor="bob" className={c["case-target"]} aria-label="Missing ID · Inspect bob at the desk" onClick={inspect}><i/><b>Missing ID<em>bob · {seconds}s</em></b></button>}
      {room==="conveyor"&&f.stage==="work"&&(held||live)&&floor.machines.map((m,i)=>{
        if(f.manual&&!m.carrier)return null;
        const limit=held&&selected&&f.posts[i]!==selected.id&&f.posts.filter(id=>id===selected.id).length>=(f.lesson==="pairs"?2:1);
        const name=held&&selected?"Send "+selected.id+" to "+m.title:f.manual?"Clear "+m.title:"Inspect "+m.title;
        return <button key={m.name} data-station={i} aria-label={name} className={c.socket+" "+(m.canClear||held&&selected&&!limit?c.armed:"")}
          disabled={f.manual?blocked||!m.canClear:held?blocked||!selected||!!limit:false} onClick={()=>{
            if(f.manual)send("clear",m.name,m.carrier+"/"+m.caller,"conveyor");else if(held)post(i);else{setStation(i);setOrders(true);}
          }}><small>{m.title}</small><strong>{held?f.posts[i]||"Post":f.manual?m.carrier.replace(/^D2-/,"")+" · "+m.caller:m.crew.join(" + ")||"Unstaffed"}</strong>
          {f.manual&&<b>{m.canClear?"Clear ↗":m.hold}</b>}</button>;
      })}
    </RoomCamera>
    <div className={c["glass-tone"]}/>
    <header className={c["room-head"]}><div><small>{room==="security"?"CAM 02":"CAM 01"}</small><h1 tabIndex={-1} ref={heading}>{roomName}</h1><span>{room==="security"?f.lead:f.manual?"LIMEN":"STILETTO"}</span></div>
      <div className={c["floor-time"]}><b>{f.bell?Math.floor(remaining/60)+":"+String(remaining%60).padStart(2,"0")+" to bell":"Walk-in"}</b><span>Rack +{f.dayCount} · Week {w.rack.length}/{w.quota}</span></div></header>
    {room==="conveyor"&&!f.manual&&(held||live&&orders)&&<section className={held?c.orders:c["crew-order"]} aria-label="Crew orders">
      <small className={c.eyeline}>{held?f.lesson==="pairs"?"Two workers · Two posts each":"One worker per station":"Assign crew"}</small><p>{floor.tutorial?.hint}</p>
      <div className={c.roster}>{crew.map(a=><button key={a.id} className={c.worker} aria-label={a.id+" · "+a.label} aria-pressed={a.id===worker} onClick={()=>setWorker(a.id)}>{a.id}</button>)}</div>
      {!held&&selected&&<><label className={c["crew-picker"]}>Station <select aria-label="Station" value={station} onChange={e=>setStation(Number(e.target.value))}>{floor.machines.map((m,i)=><option value={i} key={m.name}>{m.title}</option>)}</select></label>
        <div className={c.ratings}><Ratings title={selected.id} values={f.ratings[selected.id]}/><Ratings title={machine.title+" needs"} values={f.needs[station]}/></div>
        <button className={c.key} disabled={blocked} onClick={()=>post(station)}>Send {selected.id} to {machine.title}</button></>}
    </section>}
    {room==="conveyor"&&live&&!f.manual&&!orders&&<div className={c["order-receipt"]}>{floor.tutorial?.hint}</div>}
    <footer className={c["floor-foot"]}><span role="status">{pending?"Sending order…":selected&&live&&inspected?inspected.id+" · "+inspected.label:
      f.status==="pass"?"Daily pass granted · bob cleared":f.status==="detention"?"bob in custody until bell":held?"Clock held · Post the crew":floor.inspecting?"LIMEN inspecting":"1 intervention available"}</span>
      <nav aria-label="Camera and orders">{room!=="security"&&open&&<button className={c.switchcam} onClick={inspect}>Missing ID · {seconds}s</button>}
        {!held&&<button className={c.switchcam} onClick={()=>{chooseRoom(room==="security"?"conveyor":"security");setOrders(false);}}>↗ {room==="security"?"Conveyor":"Security"}</button>}
        {room==="conveyor"&&live&&!f.manual&&<button className={c.switchcam} aria-expanded={orders} onClick={()=>setOrders(!orders)}>{orders?"Close assignments":"Assign crew"}</button>}</nav></footer>
  </main>;
}
