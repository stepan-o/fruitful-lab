"use client";
import { memo, useEffect, useRef, useState } from "react";
import type { Frame } from "../../../lib/loopforge/engine/wire";
import { campaignScene, floorView } from "../../../lib/loopforge/engine/floor-view";
import art from "../../../public/loopforge-design/day-two-ui/art.json";
import ShiftFloor from "./ShiftFloor";
import RoomCamera from "./RoomCamera";
import c from "./day-two.module.css";

import type { Room } from "../../../lib/loopforge/shifts/contract";

type Props={room:Room;chooseRoom:(room:Room)=>void;frame:Frame;paused:boolean;pending:boolean;onIntent:(data:object)=>void;onFinish:()=>void};
const DeskFeeds=memo(function DeskFeeds({frame}:{frame:Frame}){
  const scene=campaignScene(frame.state);
  return <>{(["conveyor","security"] as const).map((room,i)=><div key={room} data-room={room} className={c["mini-feed"]}>
    <RoomCamera room={room} scene={scene} tick={frame.state.world.clock_tick}/>
    <span>0{i+1} / {room}</span></div>)}</>;
},(a,b)=>a.frame.state.world.clock_tick===b.frame.state.world.clock_tick);
function Plate({id,skin}:{id:keyof typeof art;skin:string}){
  return <div className={c.illustration+" "+c[skin]} style={{backgroundImage:"url("+art[id]+")"}}/>;
}
export default function DayTwo({frame,paused,pending,onIntent,onFinish,room,chooseRoom}:Props){
  const w=frame.state.world,f=w.floor,blocked=paused||pending;
  const [bid,setBid]=useState<"LIMEN"|"STILETTO">("LIMEN"), root=useRef<HTMLElement>(null);
  const screen=f?.closed?"bell":f?.stage==="briefing"?"appointment":w.phase;
  useEffect(()=>{root.current?.focus({preventScroll:true});},[screen,w.topic]);
  if(screen==="floor")return <ShiftFloor room={room} chooseRoom={chooseRoom} frame={frame} floor={floorView(frame.state)} paused={paused} pending={pending} onIntent={onIntent}/>;
  return <main className={c.screen} data-screen={screen} tabIndex={-1} ref={root} aria-label="Day 2">
    {screen==="console"&&<>
      <picture className={c.illustration+" "+c.desk}><source media="(max-aspect-ratio:10/11)" srcSet={art["foundry-desk-mobile"]}/><img src={art["foundry-desk"]} alt=""/></picture>
      <DeskFeeds frame={frame}/><div className={c["desk-title"]}><small className={c.eyeline}>Day 02 · Before shift</small><h1>Operator’s console</h1></div>
      <div className={c["receiver-action"]}><small className={c.eyeline}>Incoming · Leadership</small><button className={c.lightkey} disabled={blocked} aria-label="Answer leadership" onClick={()=>onIntent({action:"answer"})}>Answer receiver ↗</button></div>
    </>}
    {screen==="call"&&<>
      <Plate id="leadership-call" skin="leadership-art"/><div className={c["cinema-fade"]}/>
      <header className={c["cinema-head"]}><span className={c.code}>Week 01 / Leadership</span><button className={c.backlink} disabled={blocked} onClick={()=>onIntent({action:"close"})}>↶ Console</button></header>
      <div className={c["cinema-foot"]}><div><small className={c.eyeline}>{w.topic?"Weekly quota · Due Day 07":"Opening mandate"}</small>
        <h1>{w.topic?w.quota+" cortexes":"The handover"}</h1><p className={c["ledger-line"]}>{w.day_one_count} on the rack · {w.topic?"Due at week’s end":frame.state.agents.filter(a=>a.agent_id!=="LIMEN"&&a.agent_id!=="STILETTO").length+" workers"}</p></div>
        <div className={c["cinema-action"]}><p>{w.topic?"“"+w.quota+" finished cortexes. End of the week. How you get there is your responsibility.”":"“Two departments operational. The rest waiting for a director who can make this place produce.”"}</p>
        <button className={c.key} disabled={blocked} onClick={()=>onIntent(w.topic?{action:"acknowledge"}:{action:"topic",target:"1"})}>{w.topic?"Acknowledge quota":"Receive the quota"}</button></div></div>
    </>}
    {screen==="appointment"&&f&&<>
      <Plate id="dispatch-room" skin="dispatch"/><div className={c["posting-shade"]}/>
      <header className={c["posting-title"]}><small className={c.eyeline}>Day 02 / Morning appointment</small><h1>Post the supervisors</h1></header>
      <div className={c.proposals}>{(["LIMEN","STILETTO"] as const).map(id=><button key={id} aria-label={id+" at Security, "+(id==="LIMEN"?"STILETTO":"LIMEN")+" on Conveyor"} aria-pressed={bid===id} className={c.bid+" "+(bid===id?c.selected:"")} onClick={()=>setBid(id)}>
        <img src={id==="LIMEN"?art["limen-portrait"]:art["stiletto-portrait"]} alt=""/><span className={c["bid-copy"]}><small className={c.eyeline}>Security</small><strong>{id}</strong><span>Conveyor · {id==="LIMEN"?"STILETTO":"LIMEN"}</span></span></button>)}</div>
      <div className={c["bid-footer"]}><p><b>{bid}</b> “{f.bids[bid]}”</p><button className={c.key} disabled={blocked} onClick={()=>onIntent({action:"appoint",target:bid,room:"security",incident:"morning"})}>Commit assignment</button></div>
    </>}
    {f?.closed&&<>
      <Plate id="logistics-room" skin="receipt-art"/><div className={c["paper-shade"]}/>
      <div className={c["close-slip"]}><small className={c.eyeline}>Loopforge / Rack register</small><h1>Shift closed</h1><p className={c["slip-sub"]}>Day 02 · {f.manual?"LIMEN":"STILETTO"} on Conveyor</p>
        <div className={c.tally}><strong>+{f.dayCount}</strong><span>new rack arrivals</span></div><div className={c.weekcount}><b>{w.rack.length} / {w.quota}</b><div><i style={{width:Math.min(100,100*w.rack.length/w.quota)+"%"}}/></div><small>Week 01 · Due Day 07</small></div>
        <p>Day 1 carried in {w.day_one_count}. {f.status==="pass"?"bob’s daily pass has expired.":f.status==="detention"?"bob is released from custody.":"The crew passed Security."}</p>
        <button className={c["thin-key"]} onClick={onFinish}>Return to main menu ↗</button></div>
    </>}
    {pending&&<span className={c["order-status"]} role="status">Sending order…</span>}
  </main>;
}
