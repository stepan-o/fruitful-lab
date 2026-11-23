"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {initialWorld,transition,type ActorId,type Command} from "@/lib/agentic-systems/mini-world";
import WorldBoard from "./WorldBoard";
import s from "./world.module.css";
const choices=["Stay at the control","Leave before completion","Pass the card"] as const;
function sample(choice:number,beat:number){
 let state=initialWorld(),i=0;
 const act=(actor:ActorId,command:Command)=>{state=transition(state,{id:"demo-"+(++i),actor,command});};
 for(let n=0;n<3;n++)act("bob","right");act("bob","claim");
 act("ed","up");act("ed","right");act("ed","right");
 if(beat>=1)act("bob","start");
 if(beat>=2){act("bob","tick");if(choice===1)act("bob","down");if(choice===2)act("bob","give");}
 if(beat>=3)act("bob","tick");
 return state;
}
export default function CommitWindow(){
 const [choice,setChoice]=useState(0),[beat,setBeat]=useState(0);const ref=useLivingPlate<HTMLDivElement>();const state=sample(choice,beat);
 const headings=["The request has a place to act.","The press owes us nothing yet.","One beat later, inspect the world again.",state.made.bob?"The guarded change is committed.":"The unfinished cycle is discarded."];
 return <div ref={ref} className={s.world} data-playing="false"><div className={s.commitControls} role="group" aria-label="Choose a change during the cycle">{choices.map((label,i)=><button key={label} type="button" aria-pressed={i===choice} onClick={()=>{setChoice(i);setBeat(0);}}>{label}</button>)}</div><div className={s.commitSplit}><WorldBoard state={state} selected="bob" close/><div className={s.commitStory}><div className={s.beatTrack} aria-label={"Stage "+(beat+1)+" of 4"}>{[0,1,2,3].map(i=><i key={i} data-active={i<=beat}/>)}</div><h3>{headings[beat]}</h3><p aria-live="polite">{beat===0?"Bob holds the card and reservation; Ed waits beside the control.":state.receipts.at(-1)?.text}</p><button type="button" onClick={()=>setBeat((beat+1)%4)}>{beat===3?"Replay this sequence":"Advance the sequence"}</button></div></div></div>;
}
