import type { VisualNote } from "@/lib/sanctuary/visual-notes";
import s from "./visual-notes.module.css";

export function VisualNoteEntries({notes}:{notes:VisualNote[]}) {
 return <div className={s.entries}>{notes.map(note=><section key={note.id} id={`visual-${note.id}`} className={s.entry}>
  <p className={s.kind}>{note.kind}</p><h3>{note.title}</h3>
  <p>{note.description}</p><p>{note.reading}</p>
  {note.behavior?<p><strong>Motion & interaction. </strong>{note.behavior}</p>:null}
  {note.boundary?<p className={s.boundary}>{note.boundary}</p>:null}
  {note.references.length?<ul aria-label={`References for ${note.title}`}>{note.references.map(ref=><li key={ref.url}><a href={ref.url} target={ref.url.startsWith("https:")?"_blank":undefined} rel={ref.url.startsWith("https:")?"noreferrer":undefined}>{ref.title} ↗︎</a></li>)}</ul>:<p className={s.boundary}>Original Sanctuary art direction; no external image used as a template.</p>}
 </section>)}</div>;
}
export default function VisualNotes({notes}:{notes:VisualNote[]}) {
 if(!notes.length) return null;
 return <details className={s.notes} id="visual-notes"><summary><span>About the visuals</span><small>{notes.length} studies · descriptions & references</small></summary>
  <p className={s.intro}>How these images were made, what to look for and where their references come from.</p>
  <VisualNoteEntries notes={notes}/>
 </details>;
}
