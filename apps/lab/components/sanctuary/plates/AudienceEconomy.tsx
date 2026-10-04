import Link from "next/link";
import CatalogCovers from "./CatalogCovers";
import CinemaPlate from "./CinemaPlate";
import AssetImage from "@/components/media/AssetImage";
import rawManifest from "@/lib/assets/generated/sanctuary-context.json";
import { imageAsset, parseManifest } from "@/lib/assets/types";
import styles from "./audience-economy.module.css";

const netflix = imageAsset(parseManifest(rawManifest, "sanctuary-context"), "netflix-wordmark");
const netflixLetter = "https://ir.netflix.net/files/doc_financials/2024/q2/FINAL-Q2-24-Shareholder-Letter.pdf";

/** Original cinema and catalog illustrations give the payment comparison a human setting. */
export default function AudienceEconomy() {
  return <figure className={styles.figure} aria-labelledby="audience-economy-title">
    <header className={styles.header}>
      <span>BEYOND GAMES · FILM & TELEVISION</span>
      <h2 id="audience-economy-title">What makes a film worth funding?</h2>
    </header>
    <div className={styles.pair}>
      <section className={styles.cinema} aria-label="Theatrical admission">
        <div className={styles.identity}><span className={styles.marquee}>CINEMA</span><small>A ticket for a showing</small></div>
        <CinemaPlate/>
        <div className={styles.argument}><h3>Bring people to this film.</h3><p>Admissions earn revenue for a particular showing. Another ticket is another sale.</p></div>
        <div className={styles.payment} aria-label="Payment: one ticket, one showing"><span className={styles.ticket}>ADMIT ONE</span><span aria-hidden="true">→</span><span>A showing</span></div>
      </section>
      <section className={styles.streaming} aria-label="Netflix subscription catalog">
        <div className={`${styles.identity} ${styles.catalogIdentity}`}><AssetImage asset={netflix} alt="Netflix" sizes="154px" className={styles.wordmark}/><small>A membership to a catalog</small><span className={styles.viewerAvatar} aria-hidden="true"><i/><i/></span></div>
        <CatalogCovers/>
        <div className={styles.argument}><h3>Give people a reason to stay.</h3><p>A film contributes to the value of a library. The invitation is to join; the ongoing task is to make the next payment feel worthwhile.</p></div>
        <div className={styles.payment} aria-label="Payment: joining begins recurring billing for catalog access, until cancellation"><span className={styles.month}>JOIN</span><span aria-hidden="true">→</span><span className={styles.month}>RENEW</span><span aria-hidden="true">↻</span><span>Until cancelled</span></div>
      </section>
    </div>
    <figcaption className={styles.caption}>
      <blockquote><p>“It’s the best proxy we have for member happiness”</p><cite>Netflix on viewing · <a href={netflixLetter} target="_blank" rel="noreferrer">Shareholder letter, July 2024 ↗</a></cite></blockquote>
      <p>Netflix can measure viewing more readily than what a film means to someone. Which signals count as success can influence what gets funded next.</p>
      <small>Two payment relationships; films can travel through both. Original cinema illustration and cover parodies. Netflix wordmark © Netflix, Inc. · <Link prefetch={false} href="/stepanoskin/game-monetization/credits#netflix-wordmark">Source & use ↗</Link></small>
    </figcaption>
  </figure>;
}
