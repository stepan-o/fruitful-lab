"use client";
import notes from "./figure-notes.json";
import TermNote from "./TermNote";
import s from "./term-note.module.css";
export default function FigureNotes({id}:{id:string}){
 const entries=(notes as Record<string,string[][]>)[id];
 return entries?<div className={s.notes} aria-label="Closer inspection">{entries.map(([term,text])=><TermNote term={term} key={term}>{text}</TermNote>)}</div>:null;
}
