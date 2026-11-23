"use client";
import {useRef,useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {initialWorld,transition,type ActorId,type Command} from "@/lib/agentic-systems/mini-world";
import WorldBoard from "./WorldBoard";
import s from "./world.module.css";
const commands:{command:Command;label:string}[]=[{command:"claim",label:"Claim press"},{command:"start",label:"Begin cycle"},{command:"tick",label:"Advance beat"},{command:"give",label:"Pass card"},{command:"release",label:"Release press"},{command:"cancel",label:"Cancel cycle"}];
export default function SmallWorld(){
 const ref=useLivingPlate<HTMLDivElement>();const sequence=useRef(0),last=useRef<{id:string;actor:ActorId;command:Command}|null>(null);
 const [state,setState]=useState(initialWorld),[selected,select]=useState<ActorId>("bob");
 const issue=(command:Command)=>{const intent={id:"request-"+(++sequence.current),actor:selected,command};last.current=intent;setState(current=>transition(current,intent));};
 return <div ref={ref} className={s.world} data-playing="false"><header><p>Make one workpiece with each worker.</p><div className={s.people} role="group" aria-label="Select worker">{(["bob","ed"] as const).map(actor=><button key={actor} type="button" aria-pressed={actor===selected} onClick={()=>select(actor)}>{actor==="bob"?"Bob":"Ed"}<small>{state.made[actor]?"Workpiece complete":"Workpiece to make"}</small></button>)}</div></header>
 <WorldBoard state={state} selected={selected}/>
 <div className={s.facts}><span>Card <strong>{state.card}</strong></span><span>Reservation <strong>{state.reserved??"free"}</strong></span><span>Press <strong>{state.active?state.active.remaining+(state.active.remaining===1?" beat left":" beats left"):"idle"}</strong></span></div>
 <div className={s.commandArea}><div className={s.move} role="group" aria-label="Move the selected worker"><button type="button" onClick={()=>issue("left")}>↖ Northwest</button><button type="button" onClick={()=>issue("up")}>↗ Northeast</button><button type="button" onClick={()=>issue("down")}>↙ Southwest</button><button type="button" onClick={()=>issue("right")}>↘ Southeast</button></div><div className={s.commands}>{commands.map(item=><button type="button" key={item.command} onClick={()=>issue(item.command)}>{item.label}</button>)}</div></div>
 <div className={s.receipt} aria-live="polite"><span>{state.receipts.at(-1)?state.receipts.at(-1)?.accepted?"ACCEPTED":"REFUSED":"READY"}</span><p>{state.receipts.at(-1)?.text??"Bob has the access card. The brass tile beside the press is its control. Move, claim it, begin a cycle, then advance two beats."}</p>{state.made.bob===1&&state.made.ed===1&&<p className={s.completed}>Both workpieces are on the tray.</p>}</div>
 <details className={s.inspector}><summary>Inspect requests and the current state</summary><div className={s.utility}><button type="button" disabled={state.receipts.length===0} onClick={()=>{if(last.current)setState(current=>transition(current,last.current!));}}>Repeat the last request ID</button><button type="button" onClick={()=>{setState(initialWorld());select("bob");sequence.current=0;last.current=null;}}>Reset the world</button></div><ol>{state.receipts.map(r=><li key={r.id}><code>{r.id}</code> · {r.accepted?"accepted":"refused"} — {r.text}</li>)}</ol><pre>{JSON.stringify({positions:state.positions,card:state.card,reserved:state.reserved,active:state.active,made:state.made,tick:state.tick},null,2)}</pre></details>
 </div>;
}
