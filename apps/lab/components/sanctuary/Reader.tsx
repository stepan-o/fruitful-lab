"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import Atmosphere from "./Atmosphere";
import DevilMural from "./DevilMural";
import ChapterDiagram from "./ChapterDiagram";
import ChapterScene from "./ChapterScene";
import FundingDiagram from "./plates/FundingDiagram";
import InfernalTerm from "./InfernalTerm";
import AudienceEconomy from "./plates/AudienceEconomy";
import { playClang } from "@/lib/stepanoskin/audio";
import { motionKey,soundKey,usePreference } from "@/lib/stepanoskin/preferences";
import AssetImage from "@/components/media/AssetImage";
import { assetUrl, imageAsset, type AssetManifest } from "@/lib/assets/types";
import { chapterHref, type Chapter, type EvidenceSource, type Figure } from "@/lib/sanctuary/types";
import { readerCopy } from "@/lib/sanctuary/ui";
import { isLocale, localeCookieName, localeNames, locales, translations, type Locale } from "@/app/(stepanoskin)/stepanoskin/translations";
import styles from "./reader.module.css";

export type ReaderProps = {
  locale: Locale;
  current: Chapter | null;
  index: number;
  navigation: {id:string;title:string;part:number}[];
  parts: string[];
  assets: AssetManifest;
  sources: EvidenceSource[];
  rules: string[];
};

const roman = (n:number) => ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"][n];

export default function Reader({locale,current,index,navigation,parts,assets,sources,rules}:ReaderProps) {
  const copy = readerCopy[locale];
  const soundCopy = translations[locale];
  const [sound,setSound] = usePreference(soundKey);
  const [motion,setMotion] = usePreference(motionKey);
  const router = useRouter();
  const contents = useRef<HTMLDialogElement>(null);
  const lightbox = useRef<HTMLDialogElement>(null);
  const [zoom,setZoom] = useState<Figure|null>(null);
  const first = navigation[0];
  const previous = navigation[index-1];
  const next = navigation[index+1];

  useEffect(()=>{document.documentElement.lang=locale;},[locale]);
  useEffect(()=>{
    contents.current?.close();
    lightbox.current?.close();
  },[current?.id]);
  useEffect(()=>{if(zoom)lightbox.current?.showModal();},[zoom]);

  function switchLocale(value:string) {
    if (!isLocale(value)) return;
    document.cookie=`${localeCookieName}=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.refresh();
  }

  function transitionSound(event:React.MouseEvent<HTMLElement>) {
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const anchor=(event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if(!anchor||anchor.origin!==window.location.origin||anchor.pathname!=="/stepanoskin/game-monetization"||anchor.href===window.location.href)return;
    playClang();
  }

  return <main className={styles.reader} lang={locale} data-motion={motion?"on":"off"} data-media-mode="editorial" onClickCapture={transitionSound}>
    <a href="#reading" className={styles.skip}>{copy.skip}</a>
    <header className={styles.header}>
      <Link className={styles.brand} href="/stepanoskin"><span aria-hidden="true">◇</span> STEPAN OSKIN</Link>
      <div className={styles.headerControls}>
        <button className={styles.contentsButton} type="button" onClick={()=>contents.current?.showModal()} aria-haspopup="dialog" aria-label={copy.contents}>☰ <span>{copy.contents}</span></button>
        <button className={styles.preferenceButton} type="button" aria-label={sound?soundCopy.soundOn:soundCopy.soundOff} title={sound?soundCopy.soundOn:soundCopy.soundOff} aria-pressed={sound} onClick={()=>setSound(!sound)}>{sound?"◖))":"◖×"}</button>
        <button className={styles.preferenceButton} type="button" aria-label={motion?copy.motionOn:copy.motionOff} title={motion?copy.motionOn:copy.motionOff} aria-pressed={motion} onClick={()=>setMotion(!motion)}>{motion?"✧":"◇"}</button>
        <label className={styles.locale}><span className={styles.srOnly}>{localeNames[locale]}</span><select aria-label={localeNames[locale]} value={locale} onChange={event=>switchLocale(event.target.value)}>{locales.map(l=><option key={l} value={l}>{localeNames[l]}</option>)}</select></label>
      </div>
    </header>

    <div className={styles.layout}>
      <aside className={styles.rail} aria-label={copy.contents}>
        <Link href={chapterHref()} className={styles.railTitle} aria-current={!current?"page":undefined}>SANCTUARY<br/><em>ECONOMICS</em></Link>
        {parts.map((part,p)=><div className={styles.railPart} key={part}><p lang="en"><span>0{p+1}</span> {part}</p>{navigation.map((chapter,i)=>chapter.part===p?<Link key={chapter.id} href={chapterHref(chapter.id)} prefetch={false} aria-current={current?.id===chapter.id?"page":undefined}><span>{roman(i)}</span><span lang="en">{chapter.title}</span></Link>:null)}</div>)}
        <span className={styles.railEdition}>{copy.edition}<br/>03 OCT 2026</span>
      </aside>

      <div className={styles.body} id="reading" tabIndex={-1}>
        {!current ? <>
          <section className={styles.cover} lang="en">
            <div className={styles.coverMural}><DevilMural motion={motion}/></div>
            <p className={styles.eyebrow}>An illustrated study of game design & monetization</p>
            <h1>Sanctuary<br/><em>Economics</em></h1>
            <p className={styles.coverLede}>How the games we love are built, sold and kept alive.</p>
            <div className={styles.coverMeta}><span>21 CHAPTERS</span><span>7 PARTS</span><span>BALDUR’S GATE · DIABLO · BEYOND</span></div>
            <Link href={chapterHref(first.id)} className={styles.primary} lang={locale}>{copy.start} <span aria-hidden="true">↗</span></Link>
          </section>
          <div className={styles.editionNote}><strong>{copy.edition}</strong><p>{copy.editionNote}</p></div>
          <section className={styles.introduction} lang="en">
            <p>
              The word “purchase” conceals several different relationships
              with a game. We can buy an adventure and spend years exploring
              its possibilities. We can buy another chapter of that adventure.
              We can also enter a world whose creators keep adding activities,
              setting new dates and offering things for sale. What we enjoy
              doing may remain familiar while the terms around it change.
            </p>
            <p>
              Baldur’s Gate 3 and Diablo IV give us a starting point: two
              fantasy role-playing games with different ways of sustaining
              both play and a business. Diablo IV contains the tension within
              itself—an adventure with an ending, inside an ongoing program
              of seasons and offers. The comparison opens into a history of
              games, digital commerce and the social life that grows around them.
            </p>
            <p>
              We follow the work behind these worlds, the reasons people play
              and the different things a purchase can provide. Books, sports
              and other familiar products offer points of comparison along
              the way. The illustrations and interactive diagrams make the
              relationships visible; linked research and developer accounts
              let you examine the evidence.
            </p>
          </section>
          <section className={styles.partGrid} aria-label={copy.contents}>{parts.map((part,p)=><Link prefetch={false} href={chapterHref(navigation.find(c=>c.part===p)!.id)} key={part}><span>0{p+1}</span><h2 lang="en">{part}</h2><small>{roman(navigation.findIndex(c=>c.part===p))} — {roman(navigation.findLastIndex(c=>c.part===p))}</small><b aria-hidden="true">↗</b></Link>)}</section>
        </> : <>
          <article className={styles.article} lang="en" data-opening={current.id === "the-fork" || undefined}>
            <div className={styles.chapterTop}><Link href={chapterHref()}>{copy.overview}</Link><span>{String(index+1).padStart(2,"0")} / 21</span></div>
            <p className={styles.eyebrow}>PART {roman(current.part)} · {parts[current.part]}</p>
            <div className={current.id === "the-fork" ? styles.openingHeading : undefined}>
              <div className={styles.titleRow}><span className={styles.chapterNumeral} aria-hidden="true">{roman(index)}</span><h1>{current.title}</h1></div>
              <p className={styles.lede}>{current.lede}</p>
            </div>
            {current.figures?.some(figure=>figure.placement === "opening") ? <section className={styles.referenceComparison} aria-label="The two games in view">
              <div className={styles.referencePair}>{current.figures.filter(figure=>figure.placement === "opening").map(figure=><figure key={figure.asset}>
                <button type="button" className={styles.figureButton} aria-label={`${copy.zoom}: ${figure.alt}`} onClick={()=>setZoom(figure)}><AssetImage asset={imageAsset(assets,figure.asset)} alt={figure.alt} sizes="(max-width:720px) 94vw, (max-width:1100px) 40vw, 450px" preload/><span className={styles.zoomLabel}>{copy.zoom} ↗</span></button>
                <figcaption><p>{figure.caption}</p><small>{figure.credit} · <Link prefetch={false} href={`/stepanoskin/game-monetization/credits#${figure.asset}`}>Source & use ↗</Link></small></figcaption>
              </figure>)}</div>
              <p className={styles.referenceReading}>Two contemporary worlds. To understand why their creators plan such different futures for them, we begin with the business around the game.</p>
            </section>:null}
            {current.id !== "the-fork" ? <ChapterScene key={`scene-${current.id}`} chapter={current.id} index={index}/> : null}
            <div className={styles.prose}>
              {current.paragraphs.map((paragraph, paragraphIndex) => (
                <Fragment key={`${current.id}-${paragraphIndex}`}>
                  {current.sections
                    ?.filter((section) => section.at === paragraphIndex)
                    .map((section) => (
                      <h2 key={section.title}>{section.title}</h2>
                    ))}
                  <p>
                    {current.id === "the-fork" && paragraphIndex === 2
                      ? paragraph.split(/\b(subscription)\b/).map((text, segment) => text === "subscription"
                        ? <InfernalTerm key={segment}>{text}</InfernalTerm>
                        : text)
                      : paragraph}
                    {current.paragraphCitations?.[paragraphIndex]?.map(
                      (id) => {
                        const sourceIndex = sources.findIndex(
                          (source) => source.id === id,
                        );
                        const source = sources[sourceIndex];
                        return source ? (
                          <sup className={styles.citation} key={id}>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Source ${sourceIndex + 1}: ${source.title}`}
                              title={source.title}
                            >
                              {sourceIndex + 1}
                            </a>
                          </sup>
                        ) : null;
                      },
                    )}
                  </p>
                  {current.id === "the-fork" && paragraphIndex === 2 ? <AudienceEconomy/> : null}
                  {current.id === "the-fork" && paragraphIndex === 6 ? <ChapterDiagram key={`diagram-${current.id}`} chapter={current.id} diagram={current.visual.diagram} index={index}/> : null}
                  {current.id === "shape-of-money" && paragraphIndex === 1 ? <FundingDiagram/> : null}
                </Fragment>
              ))}
            </div>
            {current.id !== "the-fork" ? <ChapterDiagram key={`diagram-${current.id}`} chapter={current.id} diagram={current.visual.diagram} index={index}/> : null}
            {current.table?<div className={styles.tableWrap} tabIndex={0} aria-label={current.table.caption}><table><caption>{current.table.caption}</caption><thead><tr>{current.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{current.table.rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th scope="row" key={i}>{cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>:null}
            {current.figures?.filter(figure=>figure.placement !== "opening").map((figure,i)=><figure className={styles.figure} key={figure.asset}>
              <button type="button" className={styles.figureButton} aria-label={`${copy.zoom}: ${figure.alt}`} onClick={()=>setZoom(figure)}><AssetImage asset={imageAsset(assets,figure.asset)} alt={figure.alt} sizes="(max-width:720px) 94vw, (max-width:1100px) 80vw, 900px"/><span className={styles.zoomLabel}>{copy.zoom} ↗</span></button>
              <figcaption><span className={styles.figureNumber}>FIG. {index+1}.{i+1}</span><p>{figure.caption}</p><small>{figure.credit} · <Link prefetch={false} href={`/stepanoskin/game-monetization/credits#${figure.asset}`}>Source & use ↗</Link></small></figcaption>
            </figure>)}
            <blockquote className={styles.takeaway}><span aria-hidden="true">◇</span>{current.takeaway}</blockquote>
            <details className={styles.evidence}><summary lang={locale}>{copy.sourceNotes} <span aria-hidden="true">+</span></summary><p>{current.evidence}</p>{sources.length?<ol>{sources.map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.note}</p></li>)}</ol>:<p>Source: the stated mathematical model or owner-provided research capture. Original scene studies accompany selected visual citations.</p>}</details>
            {index===navigation.length-1?<>
              <section className={styles.coda}>
                <p className={styles.eyebrow}>Coda</p>
                <h2>The orchard</h2>
                <p>
                  An orchard takes work before it bears fruit, and care
                  after the first harvest. The work needs to be paid for.
                  It also needs to leave the trees capable of another
                  season. For a game, the lasting resource is people’s
                  willingness to spend part of their lives there.
                </p>
                <p>
                  Sometimes the right next step is another adventure.
                  Sometimes it is another evening in a familiar world.
                  A business can support either. Its model deserves to be
                  judged by the experience it makes possible, including
                  whether someone can finish, take a break or return on
                  terms they understand.
                </p>
              </section>
              <section className={styles.rules}><h2>Ten rules that travel</h2><ol>{rules.map(rule=><li key={rule}>{rule}</li>)}</ol></section>
            </>:null}
          </article>
          <nav className={styles.chapterNav} aria-label={copy.chapter}><Link prefetch={false} href={chapterHref(previous?.id)}><small>← {copy.previous}</small><strong lang="en">{previous?.title??copy.overview}</strong></Link><Link prefetch={false} href={chapterHref(next?.id)}><small>{next?copy.next:copy.overview} →</small><strong lang="en">{next?.title??"Sanctuary Economics"}</strong></Link></nav>
          <p className={styles.chapterEdition}>{copy.edition}</p>
        </>}
        <footer className={styles.footer}><span>SANCTUARY ECONOMICS · 2026</span><Link prefetch={false} href="/stepanoskin/game-monetization/credits">{copy.credits} ↗</Link><Link href="/stepanoskin">{copy.home} ↗</Link></footer>
      </div>
    </div>

    <dialog className={styles.contentsDialog} ref={contents} aria-labelledby="contents-title"><div className={styles.dialogHead}><h2 id="contents-title">{copy.contents}</h2><button type="button" onClick={()=>contents.current?.close()}>{copy.close} ×</button></div><Link onClick={()=>contents.current?.close()} href={chapterHref()}>{copy.overview}</Link>{parts.map((part,p)=><section key={part}><h3 lang="en">0{p+1} · {part}</h3>{navigation.map((chapter,i)=>chapter.part===p?<Link href={chapterHref(chapter.id)} prefetch={false} key={chapter.id} onClick={()=>contents.current?.close()} aria-current={current?.id===chapter.id?"page":undefined}><span>{roman(i)}</span><span lang="en">{chapter.title}</span></Link>:null)}</section>)}</dialog>
    <dialog className={styles.lightbox} ref={lightbox} aria-label={copy.zoom} onClose={()=>setZoom(null)}><div className={styles.dialogHead}><span>{copy.zoom}</span><button type="button" onClick={()=>lightbox.current?.close()}>{copy.close} ×</button></div>{zoom && assets.assets[zoom.asset]?<figure>
      {/* Full-sized image is mounted only when opened; native scrolling preserves readable UI text. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetUrl(assets,zoom.asset)} width={imageAsset(assets,zoom.asset).width} height={imageAsset(assets,zoom.asset).height} alt={zoom.alt}/><figcaption lang="en">{zoom.caption}<br/>{zoom.credit}</figcaption></figure>:null}</dialog>
    <Atmosphere enabled={motion}/>
  </main>;
}
