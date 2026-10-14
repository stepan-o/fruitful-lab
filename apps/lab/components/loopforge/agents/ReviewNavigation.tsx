import Link from 'next/link';
import {productionReviewAssets} from '@/lib/loopforge/agents/review-catalog';
import styles from './review-navigation.module.css';
export default function ReviewNavigation({current}:{current?:string}){
 return <nav className={styles.nav} aria-label="Model reviews">
  <Link prefetch={false} href="/stepanoskin/loopforge/play/asset-review" aria-current={!current?'page':undefined}>All models<span>Review library</span></Link>
  {productionReviewAssets.map(asset=><Link prefetch={false} key={asset.id} href={asset.route} aria-current={current===asset.id?'page':undefined}>{asset.shortName}<span>{asset.navDetail}</span></Link>)}
 </nav>;
}
