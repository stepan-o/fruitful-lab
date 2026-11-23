import {reviewReadiness,reviewSections} from '@/lib/loopforge/agents/review-contract';
import styles from './review-navigation.module.css';
export default function ReviewChecklist({subject}:{subject:string}){
 const gates=reviewReadiness[subject];
 if(!gates)return null;
 return <details className={styles.checklist}><summary>Review coverage · six shared checks</summary><p>Acceptance applies only to the described slice. It does not approve the character for every gameplay interaction.</p><div className={styles.gates}>{reviewSections.map(section=>{
  const gate=gates[section.id];
  return <article key={section.id}><h2>{section.title}</h2><strong data-status={gate.status}>{gate.status}</strong><p>{gate.detail}</p></article>;
 })}</div><a href='/loopforge-design/production/CHARACTER_REVIEW_STRUCTURE.md'>Shared intake and acceptance contract ↗</a></details>;
}
