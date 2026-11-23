import type { Metadata } from "next";
import Link from "next/link";
import AuthorLink from "@/components/sanctuary/AuthorLink";
import { coverReferences } from "@/lib/sanctuary/cover-references";
import { bg3Notice, rightsReviewDate, rightsSources } from "@/lib/sanctuary/rights-sources";
import { chapters } from "@/lib/sanctuary/content";
import { chapterHref } from "@/lib/sanctuary/types";
import { chapterVisualSources, visualSourceRecords } from "@/lib/sanctuary/visual-sources";
import styles from "./page.module.css";

const chapterRecords = chapters.map(chapter => ({ chapter, records: chapterVisualSources(chapter) }));

export const metadata: Metadata = { title: "Rights & visual credits — Sanctuary Economics", description: "Sources, ownership credits and the publication rationale for Sanctuary Economics’ visual citations." };
export default function CreditsPage() {
  return <main className={styles.page} lang="en">
    <nav className={styles.topnav} aria-label="Author and study"><AuthorLink/><Link className={styles.back} href={chapterHref()}>← Sanctuary Economics</Link></nav>
    <header><p className={styles.eyebrow}>THE EDITORIAL RECORD · 07 OCT 2026</p><h1>Rights &<br/><em>visual credits.</em></h1>
      <p className={styles.lede}>We show the games we study. Their creators’ work remains their own.</p></header>
    <section aria-labelledby="independence"><h2 id="independence">An independent study</h2>
      <p>Sanctuary Economics is written and designed by Stepan Oskin. It is free industry criticism and analysis, with no affiliation, sponsorship or endorsement from the game studios and licensors discussed. Original illustrations, models and commentary sit beside selected screenshots, promotional art and documentary extracts. A visual citation identifies its source and explains what it contributes to the argument.</p>
      <p>Diablo® and Blizzard® are trademarks or registered trademarks of Blizzard Entertainment, Inc. Call of Duty and the Activision, Infinity Ward, Treyarch and Raven marks belong to Activision Publishing, Inc. or its related entities. Candy Crush and the King marks belong to King.com Ltd or its related entities. Netflix and its wordmark belong to Netflix, Inc. Images, marks and interfaces remain the property of their respective owners. Our credits identify studios and licensors where no individual image creator is named; a publisher credit does not invent a photographer. This edition does not license these assets to readers or reuse them in Loopforge.</p>
      <aside className={styles.notice}><p>{bg3Notice}</p><p>The BG3 material includes intellectual property owned by Wizards of the Coast LLC, © Wizards of the Coast LLC, and game artwork from Larian Studios. Original legal notices remain inside the reproduced image.</p></aside>
    </section>
    <section aria-labelledby="basis"><h2 id="basis">The basis for this edition</h2>
      <p>We select images for criticism, comparison and explanation, rather than as a general decoration library. The register records our editorial rationale and the source available to us. It does not claim bespoke permission from every owner or a guarantee against a dispute. Canadian criticism/review fair dealing informs this assessment; other applicable laws and contracts can matter.</p>
      <p>The world-building chapter also introduces Loopforge, the author’s own project. Its original art is used with the owner’s permission. Third-party game images remain within the analysis of their respective works and do not imply endorsement of Loopforge. The invitation to explore that project uses original graphics.</p>
      <p>Reviewed {rightsReviewDate}. The excerpts below are fixed in this edition, with source dates. They are intentionally short extracts, not complete policy reproductions. Follow each source for its full scope and any later changes.</p>
      <div className={styles.sources}>{rightsSources.map(source=><article id={source.id} key={source.id}><p className={styles.eyebrow}>{source.kind}</p><h3><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></h3><small>{source.version}</small>{source.quote?<blockquote>{source.quote}</blockquote>:null}<p>{source.reading}</p></article>)}</div>
    </section>
    <section aria-labelledby="register"><h2 id="register">Visual source register</h2><p>Sources are attached to the argument, not offered as a downloadable asset collection. Supplied historical captures keep their provenance limits here; visible prices and interfaces are not silently presented as current.</p>
      <div className={styles.sources}>{Object.entries(visualSourceRecords).map(([id,entry])=><article key={id} id={id}><h3>{entry.title}</h3><p className={styles.credit}>© {entry.owner}</p><dl><dt>Analytical purpose</dt><dd>{entry.purpose}</dd><dt>Source</dt><dd>{entry.sourceUrl?<a href={entry.sourceUrl} target="_blank" rel="noreferrer">{entry.source} ↗</a>:entry.source}</dd>{"sourceCredit" in entry?<><dt>Named source credit</dt><dd>{entry.sourceCredit}</dd></>:null}{"licenseUrl" in entry ? <><dt>Photograph license</dt><dd><a href={entry.licenseUrl} target="_blank" rel="noreferrer">{entry.license} ↗</a></dd></> : null}<dt>Treatment</dt><dd>{entry.treatment}</dd><dt>Source date</dt><dd>{entry.sourceDate}</dd><dt>Use basis</dt><dd>{entry.basis}</dd><dt>Use reviewed</dt><dd>{entry.reviewed}</dd></dl>{"provenanceNote" in entry?<p className={styles.note}>{entry.provenanceNote}</p>:null}<nav aria-label={`Chapters using ${entry.title}`}>{chapterRecords.filter(({records})=>records.some(record=>record.id===id)).map(({chapter})=><Link key={chapter.id} prefetch={false} href={chapterHref(chapter.id)}>{chapter.title} ↗</Link>)}</nav></article>)}</div>
    </section>
    <section aria-labelledby="catalog-parodies"><h2 id="catalog-parodies">Referenced works in original illustrations</h2>
      <p>In <Link href={chapterHref("platform-business")}>The work behind a purchase</Link>, three invented catalog covers refer to existing series to examine how recognizable individual titles support a continuing subscription offer. The drawings use original geometry; official posters and production photographs are not embedded. The references below identify the works studied and their creators. This records an editorial purpose, not permission or endorsement from those creators.</p>
      <div className={styles.sources}>{coverReferences.map(cover=><article key={cover.id} id={cover.id}><h3>{cover.title}</h3><dl><dt>Reference work</dt><dd>{cover.original}</dd><dt>Reference creators</dt><dd>{cover.creator}</dd><dt>Source</dt><dd><a href={cover.source} target="_blank" rel="noreferrer">Netflix Tudum — production reference ↗</a></dd></dl></article>)}</div>
    </section>
    <footer><p>For a source correction or rights concern, identify the image and the chapter through <a href="https://github.com/stepan-o/fruitful-lab/issues">the project’s issue tracker</a>. No confidential material is needed.</p><Link href={chapterHref("insert-coin")}>Return to the study →</Link></footer>
  </main>;
}
