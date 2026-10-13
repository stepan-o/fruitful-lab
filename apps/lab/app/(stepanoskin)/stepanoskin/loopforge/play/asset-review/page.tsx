import type {Metadata} from 'next';
import Link from 'next/link';
import {productionReviewAssets} from '@/lib/loopforge/agents/review-catalog';
import styles from '@/components/loopforge/agents/agent-test.module.css';
export const metadata:Metadata={title:'Asset review library — Loopforge',description:'Production review of Loopforge characters, motion and equipment under factory lighting.'};
export default function AssetReviewPage(){return <main className={styles.page}><div className={styles.catalog}>
 <header className={styles.header}><div><Link href='/stepanoskin/loopforge/design#agents'>← Game design · Agents</Link><h1>Asset review library<span>Loopforge / production player</span></h1></div></header>
 <p className={styles.catalogIntro}>Inspect each character with its equipment and motion in the actual factory renderer. Compare concept art, pause and scrub, switch camera angles and save the review state. Open one subject at a time.</p>
 <div className={styles.assetCards}>{productionReviewAssets.map(asset=><article key={asset.id} className={styles.assetCard}><span className={styles.kicker}>{asset.status}</span><h2>{asset.title}</h2><small>{asset.revision}</small><p>{asset.description}</p><ul>{asset.checks.map(check=><li key={check}>{check}</li>)}</ul><Link href={asset.route}>Open production player →</Link><Link href={asset.conceptRoute}>Character direction ↗</Link></article>)}</div>
 <p className={styles.catalogFooter}>LIMEN and Worker 01 are registered review subjects. Add future approved candidates here with their versioned assets, motion and review adapter. The <Link href='/stepanoskin/loopforge/play/agent-test'>agent engineering fixture</Link> separately tests contacts and crowds with placeholder bodies. These reviews do not change a game run.</p>
 </div></main>;}
