"use client";
import { useState } from "react";
import type { PlayerView, SupervisorId } from "@/lib/loopforge/first-shift/contract";
import { Control, Kicker, Speech, Token, type Media } from "./ConsoleParts";
import s from "./first-shift.module.css";
import l from "./living-console.module.css";

/** Read-only presentation rows; roster length and character details do not dictate engine storage. */
export type AdviserCandidate = {
  id: string; name: string; available: boolean; portrait?: SupervisorId; sheet?: "cathexis" | "witch" | "thrum";
  pitch: string; priority: string; gain: string; cost: string;
};
export function firstDayCandidates(view: PlayerView): AdviserCandidate[] {
  return [
    ...view.people.map(p => ({
      id:p.id, name:p.id.toUpperCase(), portrait:p.id, available:true, pitch:p.remark,
      priority:p.id === "limen" ? "Keep the line within protocol." : "Build the production lead.",
      gain:p.id === "limen" ? "Less equipment wear. Lower accident risk." : "More robots completed. A stronger lead on the quota.",
      cost:p.id === "limen" ? "Less output to deliver or keep. Slower growth." : "More equipment wear. Higher accident risk.",
    })),
    ...[{id:"cathexis", name:"CATHEXIS"}, {id:"witch",name:"RIVET WITCH"}, {id:"thrum",name:"THRUM"}].map(p=>({...p,available:false,pitch:"",priority:"",gain:"",cost:""})),
  ];
}
export default function AdviserSelection({media,candidates,busy=false,onAppoint,onHelp,study=false,selectedId,onInspect}: {
  media:Media; candidates:readonly AdviserCandidate[]; busy?:boolean; study?:boolean;
  selectedId?:string|null; onInspect?:(id:string)=>void;
  onAppoint:(id:string)=>void; onHelp:()=>void;
}) {
  const [localSelected,setSelected]=useState<string|null>(null);
  const selected=selectedId === undefined ? localSelected : selectedId;
  const person=candidates.find(p=>p.id===selected && p.available);
  return <section className={l.selection} aria-label="Adviser selection">
    <header className={l.selectionHeading}>
      <div><Kicker>{study ? "Author study / sample future pitches" : "Day 01 / daily appointment"}</Kicker><h1>Choose whose judgment you want.</h1></div>
      <button className={s.helpLink} onClick={onHelp}>About this choice ?</button>
    </header>
    <div className={l.selectionBody}>
      <div className={l.rosterPanel}>
        <span className={l.rosterCount}>{candidates.filter(p=>p.available).length} AVAILABLE / {candidates.length} CHANNELS</span>
        <div className={l.roster} role="group" aria-label="Supervisor roster">
        {candidates.map(p=><button className={l.candidate} key={p.id} disabled={!p.available || busy} aria-pressed={p.id===selected} aria-label={p.available ? `Inspect ${p.name}` : `${p.name} — not arrived`} onClick={()=>{setSelected(p.id);onInspect?.(p.id);}}>
          <Token media={media} person={p.portrait} sheet={p.sheet} active={p.id===selected} empty={!p.available} />
          <span><b>{p.name}</b>{p.available ? <Speech>{p.pitch}</Speech> : <small>NOT ARRIVED</small>}</span>
        </button>)}
        </div>
      </div>
      <div className={l.candidateDetail} aria-live="polite" aria-atomic="false">
        {person ? <div key={person.id} className={l.candidateFocus}>
          <div className={l.candidateIdentity}><Token media={media} person={person.portrait} sheet={person.sheet} large active /><div><Kicker>Under consideration</Kicker><h2>{person.name}</h2></div></div>
          <div className={l.candidateCase}>
            <Kicker>The priority they bring</Kicker><h2>{person.priority}</h2>
            <dl className={l.tradeoffs}><div><dt>You gain</dt><dd>{person.gain}</dd></div><div><dt>You accept</dt><dd>{person.cost}</dd></div></dl>
            <p className={l.authorityNote}>Their judgment guides today’s assignments and event responses. In their own room, they act without asking.</p>
            <Control tone="primary" disabled={busy || study} onClick={()=>onAppoint(person.id)}>Appoint {person.name} for today</Control>
            <small className={l.commitNote}>{study ? "Layout study only · no appointment is sent" : "One adviser for this shift. Review their proposed placements next."}</small>
          </div>
        </div> : <div className={l.selectionEmpty}>
          <Token media={media} large empty />
          <Kicker>Appointment channel open</Kicker><h2>Whom will you listen to?</h2>
          <p>Inspect a supervisor’s pitch, priority and tradeoff. Then appoint one to advise you through the shift.</p>
          <span aria-hidden="true" className={l.callLamp} />
        </div>}
      </div>
    </div>
  </section>;
}
