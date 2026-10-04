import type { Metadata } from "next";
import Link from "next/link";
import media from "@/lib/sanctuary/editorial-media.json";
import { coverReferences } from "@/lib/sanctuary/cover-references";
import contextMedia from "@/lib/sanctuary/context-media.json";
import arcadeMedia from "@/lib/sanctuary/arcade-media.json";
import { bg3Notice, rightsReviewDate, rightsSources } from "@/lib/sanctuary/rights-sources";
import { chapters } from "@/lib/sanctuary/content";
import { chapterHref } from "@/lib/sanctuary/types";
import styles from "./page.module.css";

export const metadata: Metadata = { title: "Rights & visual credits — Sanctuary Economics", description: "Sources, ownership credits and the publication rationale for Sanctuary Economics’ visual citations." };
export default function CreditsPage() {
  return <main className={styles.page} lang="en">
    <Link className={styles.back} href={chapterHref()}>← Sanctuary Economics</Link>
    <header><p className={styles.eyebrow}>THE EDITORIAL RECORD · 04 OCT 2026</p><h1>Rights &<br/><em>visual credits.</em></h1>
      <p className={styles.lede}>We show the games we study. Their creators’ work remains their own.</p></header>
    <section aria-labelledby="independence"><h2 id="independence">An independent study</h2>
      <p>Sanctuary Economics is written and designed by Stepan Oskin. It is free industry criticism and analysis, with no affiliation, sponsorship or endorsement from the game studios and licensors discussed. Original illustrations, models and commentary sit beside selected screenshots, promotional art and documentary extracts. A visual citation identifies its source and explains what it contributes to the argument.</p>
      <p>Diablo® and Blizzard® are trademarks or registered trademarks of Blizzard Entertainment, Inc. Netflix and its wordmark belong to Netflix, Inc. Images, marks and interfaces remain the property of their respective owners. Our credits identify studios and licensors where no individual image creator is named; a publisher credit does not invent a photographer. This edition does not license these assets to readers or reuse them in Loopforge.</p>
      <aside className={styles.notice}><p>{bg3Notice}</p><p>The BG3 material includes intellectual property owned by Wizards of the Coast LLC, © Wizards of the Coast LLC, and game artwork from Larian Studios. Original legal notices remain inside the reproduced image.</p></aside>
    </section>
    <section aria-labelledby="basis"><h2 id="basis">The basis for this edition</h2>
      <p>We select images for criticism, comparison and explanation, rather than as a general decoration library. The register records our editorial rationale and the source available to us. It does not claim bespoke permission from every owner or a guarantee against a dispute. Canadian criticism/review fair dealing informs this assessment; other applicable laws and contracts can matter.</p>
      <p>Reviewed {rightsReviewDate}. The excerpts below are fixed in this edition, with source dates. They are intentionally short extracts, not complete policy reproductions. Follow each source for its full scope and any later changes.</p>
      <div className={styles.sources}>{rightsSources.map(source=><article id={source.id} key={source.id}><p className={styles.eyebrow}>{source.kind}</p><h3><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a></h3><small>{source.version}</small>{source.quote?<blockquote>{source.quote}</blockquote>:null}<p>{source.reading}</p></article>)}</div>
    </section>
    <section aria-labelledby="register"><h2 id="register">Visual source register</h2><p>Sources are attached to the argument, not offered as a downloadable asset collection. Supplied historical captures keep their provenance limits here; visible prices and interfaces are not silently presented as current.</p>
      <div className={styles.sources}>{Object.entries({...media.assets, ...contextMedia.assets, ...arcadeMedia.assets}).map(([id,entry])=><article key={id} id={id}><h3>{entry.title}</h3><p className={styles.credit}>© {entry.owner}</p><p>{entry.purpose}</p><dl><dt>Source</dt><dd>{entry.sourceUrl?<a href={entry.sourceUrl} target="_blank" rel="noreferrer">{entry.source} ↗</a>:entry.source}</dd>{"sourceCredit" in entry?<><dt>Named source credit</dt><dd>{entry.sourceCredit}</dd></>:null}{"licenseUrl" in entry ? <><dt>Photograph license</dt><dd><a href={entry.licenseUrl} target="_blank" rel="noreferrer">{entry.license} ↗</a></dd></> : null}<dt>Treatment</dt><dd>{entry.treatment}</dd><dt>Source date</dt><dd>{entry.sourceDate}</dd><dt>Editorial use</dt><dd>{entry.basis}</dd></dl>{"provenanceNote" in entry?<p className={styles.note}>{entry.provenanceNote}</p>:null}<nav aria-label={`Chapters using ${entry.title}`}>{chapters.filter(chapter=>chapter.figures?.some(figure=>figure.asset===id) || ("chapters" in entry && entry.chapters.includes(chapter.id))).map(chapter=><Link key={chapter.id} prefetch={false} href={chapterHref(chapter.id)}>{chapter.title} ↗</Link>)}</nav></article>)}</div>
    </section>
    <section aria-labelledby="catalog-parodies"><h2 id="catalog-parodies">Original catalog parodies</h2><p>The opening chapter reinterprets three recognizable screen worlds to examine the invitation to keep watching. These are original procedural illustrations and invented titles, not official Netflix posters or actual catalog listings. Their reference works and creators are credited below; the original production images were studied, not embedded in these drawings.</p>
      <div className={styles.sources}>{coverReferences.map(cover=><article key={cover.id} id={cover.id}><h3>{cover.title}</h3><p>{cover.detail}</p><p className={styles.credit}>Reference work: {cover.original} · {cover.creator}</p><p><a href={cover.source} target="_blank" rel="noreferrer">Netflix Tudum — original production reference ↗</a></p></article>)}</div>
    </section>
    <footer><p>For a source correction or rights concern, identify the image and the chapter through <a href="https://github.com/stepan-o/fruitful-lab/issues">the project’s issue tracker</a>. No confidential material is needed.</p><Link href={chapterHref("insert-coin")}>Return to the study →</Link></footer>
  </main>;
}
