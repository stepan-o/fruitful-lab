import Link from 'next/link';
import {openingWorkers,type OpeningWorkerId} from '@/lib/loopforge/agents/opening-workers';
import styles from './worker-navigation.module.css';
export default function WorkerNavigation({current}:{current:OpeningWorkerId|'reference'}){
 return <nav className={styles.workers} aria-label='Workers'>
  {openingWorkers.map(worker=><Link prefetch={false} key={worker.id} href={`/stepanoskin/loopforge/play/asset-review/worker?worker=${worker.id}`} aria-current={current===worker.id?'page':undefined}>{worker.id}</Link>)}
  <Link prefetch={false} href='/stepanoskin/loopforge/play/asset-review/worker?worker=reference' aria-current={current==='reference'?'page':undefined}>Worker 01 · reference</Link>
 </nav>;
}
