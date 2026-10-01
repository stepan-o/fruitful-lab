import { useId } from "react";
import type { VisualSpec } from "@/lib/sanctuary/visual-content";
import styles from "./visuals.module.css";

export default function ChapterDiagram({diagram,index}:{diagram:VisualSpec['diagram'];index:number}) {
  const id=useId().replace(/:/g,'');
  const positions=diagram.kind==='balance'?[[23,22],[23,78],[77,22],[77,78]]:[[23,22],[77,22],[77,78],[23,78]];
  const points=positions.map(p=>p.join(' '));
  const path=diagram.kind==='branch'?positions.map(([x,y])=>`M50 50L${x} ${y}`).join(' '):diagram.kind==='balance'?'M23 22V78L50 50M77 22V78L50 50':`M${points.join(' L')}${diagram.kind==='cycle'?' Z':''}`;
  return <figure className={styles.diagram} aria-label={`Diagram: ${diagram.title}`}>
    <div className={styles.visualLabel}><span>DIAGRAM {String(index+1).padStart(2,'0')}</span><span>CONCEPTUAL MAP</span></div>
    <h2>{diagram.title}</h2>
    <div className={styles.diagramStage}>
      <svg className={styles.connections} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id={id}><stop stopColor="#bf713c"/><stop offset="1" stopColor="#b3c9ad"/></linearGradient></defs><path d={path} stroke={`url(#${id})`}/><path className={styles.tracer} d={path} stroke="#ffd599"/></svg>
      <div className={styles.diagramSeal}><span aria-hidden="true">◇</span><strong>{diagram.center}</strong></div>
      <ol className={styles.diagramNodes}>{diagram.nodes.map((node,i)=><li key={node} style={{left:`${positions[i][0]}%`,top:`${positions[i][1]}%`}}><span className={styles.nodeIndex}>0{i+1}</span><h3>{node}</h3><p>{diagram.notes[i]}</p></li>)}</ol>
    </div>
    <figcaption>{diagram.caption}</figcaption>
  </figure>;
}
