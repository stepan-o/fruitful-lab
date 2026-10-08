import type { CSSProperties } from "react";
import { sonyPublisherContext } from "@/lib/sanctuary/sony-history";
import s from "./sony-history.module.css";

const share = (n: number, total: number) => `${(100 * n / total).toFixed(1)}%`;

export default function PublisherEcosystem() {
  const publisherUnits = [sonyPublisherContext.firstPartyUnits, Number((sonyPublisherContext.totalUnits - sonyPublisherContext.firstPartyUnits).toFixed(1))];
  return <figure className={s.figure} id="publisher-ecosystem" aria-labelledby="sony-publishers-title">
    <figcaption><p className={s.kicker}>PlayStation · full-game copies sold · FY{sonyPublisherContext.year}</p>
      <h2 id="sony-publishers-title">Whose games fill the ecosystem?</h2></figcaption>
    <div className={s.publishers}>
      <p>Sony reports first-party titles separately by copies sold. The financial reports used here combine their revenue with other publishers’ games, so these bars show copies—not a division of platform revenue.</p>
      <dl className={s.unitRows}>{publisherUnits.map((units, i) => <div key={i} style={{ "--series": i === 0 ? "#d2b377" : "#79b3b2" } as CSSProperties}>
        <dt>{i === 0 ? "Sony first-party titles" : "Other publishers’ titles"}</dt>
        <dd><strong>{units.toFixed(1)}m copies</strong><span>{share(units, sonyPublisherContext.totalUnits)} of full-game copies</span></dd>
        <div className={s.unitTrack} aria-hidden="true"><span style={{ width: `${units / sonyPublisherContext.totalUnits * 100}%` }}/></div>
      </div>)}</dl>
      <p className={s.unitScope}>{sonyPublisherContext.totalUnits}m PS4/PS5 full-game copies, including bundles. Other publishers = total minus Sony’s reported first-party units. Add-ons and subscriptions are outside this count; free-to-play spending cannot be inferred from it. First-party describes Sony’s title category, not just studios it owns or every game it helps fund. <a href={sonyPublisherContext.source} target="_blank" rel="noreferrer">Figures & scope · p. 12 ↗</a></p>
      <blockquote>“most of the value of our ecosystem is driven by third-party publishers”<cite><a href={sonyPublisherContext.discussion} target="_blank" rel="noreferrer">Sony Interactive Entertainment · June 2026 investor Q&A, pp. 3–4 ↗</a></cite></blockquote>
    </div>

    <p className={s.notes}>Microsoft and NVIDIA do not publish a directly comparable first-party/other-publisher copy split in the reports used here. Their bars are left out rather than estimated.</p>
  </figure>;
}
