import type {Metadata} from 'next';
import Link from 'next/link';
import ReviewNavigation from '@/components/loopforge/agents/ReviewNavigation';
import {reviewSections,upcomingReviewSubjects} from '@/lib/loopforge/agents/review-contract';
import reviewStyles from '@/components/loopforge/agents/review-navigation.module.css';
import {productionReviewAssets} from '@/lib/loopforge/agents/review-catalog';
import styles from '@/components/loopforge/agents/agent-test.module.css';
export const metadata:Metadata={title:'Asset review library — Loopforge',description:'Production review of Loopforge characters, motion and equipment under factory lighting.'};
export default function AssetReviewPage(){return <main className={styles.page}><div className={styles.catalog}>
 <header className={styles.header}><div><Link href='/stepanoskin/loopforge/design#agents'>← Game design · Agents</Link><h1>Asset review library<span>Loopforge / production player</span></h1></div></header>
 <ReviewNavigation/><p className={styles.catalogIntro}>Inspect each character with its equipment and motion in the actual factory renderer. Compare concept art, pause and scrub, switch camera angles and save the review state. Open one subject at a time.</p>
 <div className={styles.assetCards}>{productionReviewAssets.map(asset=><article key={asset.id} className={styles.assetCard}><span className={styles.kicker}>{asset.status}</span><h2>{asset.title}</h2><small>{asset.revision}</small><p>{asset.description}</p><ul>{asset.checks.map(check=><li key={check}>{check}</li>)}</ul><Link prefetch={false} href={asset.route}>Open production player →</Link><Link href={asset.conceptRoute}>Character direction ↗</Link></article>)}</div>
 <section className={reviewStyles.planned} aria-labelledby='shared-review'><h2 id='shared-review'>One review structure for the whole cast</h2><div className={reviewStyles.gates}>{reviewSections.map((section,i)=><article key={section.id}><small>0{i+1}</small><h3>{section.title}</h3><p>{section.question}</p></article>)}</div><p>Every player exposes these checks with an explicit status and the remaining work. Character-specific effects and comparison tools sit inside the same review process. <a href='/loopforge-design/production/CHARACTER_REVIEW_STRUCTURE.md'>Read the intake and acceptance contract ↗</a></p></section>
 <section className={reviewStyles.planned} aria-labelledby='next-cast'><h2 id='next-cast'>Next supervisors</h2><div className={reviewStyles.gates}>{upcomingReviewSubjects.map(subject=><article key={subject.id}><small>Awaiting model · no player yet</small><h3>{subject.name}</h3><strong>{subject.focus}</strong><p>{subject.direction}</p></article>)}</div></section>
 <p className={styles.catalogFooter}>LIMEN, Worker 01 and STILETTO are registered review subjects. Add future approved candidates here with their versioned assets, motion and review adapter. Paired acting and crowd testing with these models remain to build. These reviews do not change a game run.</p>
 </div></main>;}
