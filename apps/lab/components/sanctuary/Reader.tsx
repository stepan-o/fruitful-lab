"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AssetImage from "@/components/media/AssetImage";
import { assetUrl, imageAsset, type AssetManifest } from "@/lib/assets/types";
import { chapterHref, type Chapter, type EvidenceSource, type Figure } from "@/lib/sanctuary/types";
import { readerCopy } from "@/lib/sanctuary/ui";
import { isLocale, localeCookieName, localeNames, locales, type Locale } from "@/app/(stepanoskin)/stepanoskin/translations";
import { ProbabilityLab, PriceLab } from "./Experiments";
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

  return <main className={styles.reader} lang={locale}>
    <a href="#reading" className={styles.skip}>{copy.skip}</a>
    <header className={styles.header}>
      <Link className={styles.brand} href="/stepanoskin"><span aria-hidden="true">◇</span> STEPAN OSKIN</Link>
      <div className={styles.headerControls}>
        <button type="button" onClick={()=>contents.current?.showModal()} aria-haspopup="dialog" aria-label={copy.contents}>☰ <span>{copy.contents}</span></button>
        <label className={styles.locale}><span className={styles.srOnly}>{localeNames[locale]}</span><select aria-label={localeNames[locale]} value={locale} onChange={event=>switchLocale(event.target.value)}>{locales.map(l=><option key={l} value={l}>{localeNames[l]}</option>)}</select></label>
      </div>
    </header>

    <div className={styles.layout}>
      <aside className={styles.rail} aria-label={copy.contents}>
        <Link href={chapterHref()} className={styles.railTitle} aria-current={!current?"page":undefined}>SANCTUARY<br/><em>ECONOMICS</em></Link>
        {parts.map((part,p)=><div className={styles.railPart} key={part}><p lang="en"><span>0{p+1}</span> {part}</p>{navigation.map((chapter,i)=>chapter.part===p?<Link key={chapter.id} href={chapterHref(chapter.id)} prefetch={false} aria-current={current?.id===chapter.id?"page":undefined}><span>{roman(i)}</span><span lang="en">{chapter.title}</span></Link>:null)}</div>)}
        <span className={styles.railEdition}>{copy.edition}<br/>01 OCT 2026</span>
      </aside>

      <div className={styles.body} id="reading" tabIndex={-1}>
        {!current ? <>
          <section className={styles.cover} lang="en">
            <div className={styles.coverArt} aria-hidden="true"><AssetImage asset={imageAsset(assets,"legacy-d4-key")} alt="" sizes="(max-width:900px) 100vw, 900px" preload/></div>
            <div className={styles.arch} aria-hidden="true"><svg viewBox="0 0 600 600" fill="none"><path d="M30 600V290Q30 100 300 18Q570 100 570 290V600M55 600V295Q55 125 300 45Q545 125 545 295V600M300 18V70"/><circle cx="300" cy="108" r="16"/><path d="M284 108H316M300 92V124"/></svg></div>
            <p className={styles.eyebrow}>An illustrated study of game design & monetization</p>
            <h1>Sanctuary<br/><em>Economics</em></h1>
            <p className={styles.coverLede}>What does a business model reward a studio for asking of its players?</p>
            <div className={styles.coverMeta}><span>21 CHAPTERS</span><span>7 PARTS</span><span>DIABLO IV & BEYOND</span></div>
            <Link href={chapterHref(first.id)} className={styles.primary} lang={locale}>{copy.start} <span aria-hidden="true">↗</span></Link>
          </section>
          <div className={styles.editionNote}><strong>{copy.edition}</strong><p>{copy.editionNote}</p></div>
          <section className={styles.introduction} lang="en"><p>Play has value before it has a price. Learning a system, finding a place, making a character your own, or finishing a story can each justify the time spent.</p><p>This study follows what changes when access, identity, time and power become things a game can sell. Diablo IV provides the detailed case. Other games challenge the assumptions around it.</p><p>Each chapter stands on its own. Evidence notes separate documented rules, historical captures, hypothetical models and interpretation.</p></section>
          <section className={styles.partGrid} aria-label={copy.contents}>{parts.map((part,p)=><Link prefetch={false} href={chapterHref(navigation.find(c=>c.part===p)!.id)} key={part}><span>0{p+1}</span><h2 lang="en">{part}</h2><small>{roman(navigation.findIndex(c=>c.part===p))} — {roman(navigation.findLastIndex(c=>c.part===p))}</small><b aria-hidden="true">↗</b></Link>)}</section>
        </> : <>
          <article className={styles.article} lang="en">
            <div className={styles.chapterTop}><Link href={chapterHref()}>{copy.overview}</Link><span>{String(index+1).padStart(2,"0")} / 21</span></div>
            <p className={styles.eyebrow}>PART {roman(current.part)} · {parts[current.part]}</p>
            <div className={styles.titleRow}><span className={styles.chapterNumeral} aria-hidden="true">{roman(index)}</span><h1>{current.title}</h1></div>
            <p className={styles.lede}>{current.lede}</p>
            <div className={styles.prose}>{current.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
            {current.panel?<section className={styles.panel}><p className={styles.eyebrow}>{current.panel.title}</p><ol className={current.panel.flow?styles.flow:styles.cards}>{current.panel.items.map((item,i)=><li key={item.label}><span className={styles.node}>{String(i+1).padStart(2,"0")}</span><h2>{item.label}</h2><p>{item.text}</p></li>)}</ol></section>:null}
            {current.table?<div className={styles.tableWrap} tabIndex={0} aria-label={current.table.caption}><table><caption>{current.table.caption}</caption><thead><tr>{current.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{current.table.rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th scope="row" key={i}>{cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>:null}
            {current.interactive==="probability"?<ProbabilityLab/>:current.interactive==="price"?<PriceLab/>:null}
            {current.figures?.map((figure,i)=><figure className={styles.figure} key={figure.asset}>
              <button type="button" className={styles.figureButton} aria-label={`${copy.zoom}: ${figure.alt}`} onClick={()=>setZoom(figure)}><AssetImage asset={imageAsset(assets,figure.asset)} alt={figure.alt} sizes="(max-width:720px) 94vw, (max-width:1100px) 80vw, 900px"/><span className={styles.zoomLabel}>{copy.zoom} ↗</span></button>
              <figcaption><span className={styles.figureNumber}>FIG. {index+1}.{i+1}</span><p>{figure.caption}</p><small>{figure.credit}</small></figcaption>
            </figure>)}
            <blockquote className={styles.takeaway}><span aria-hidden="true">◇</span>{current.takeaway}</blockquote>
            <details className={styles.evidence}><summary lang={locale}>{copy.sourceNotes} <span aria-hidden="true">+</span></summary><p>{current.evidence}</p>{sources.length?<ol>{sources.map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.note}</p></li>)}</ol>:<p>Source: the stated mathematical model or owner-provided capture shown above.</p>}</details>
            {index===navigation.length-1?<>
              <section className={styles.coda}><p className={styles.eyebrow}>Coda</p><h2>The orchard</h2><p>A game leaves things outside its own accounting: knowledge, a practiced movement, a conversation, a place that can still be recalled after the save file is gone.</p><p>Those effects are harder to count. They remain part of what the work can give. A design can make room for someone to finish, leave, and carry something away.</p></section>
              <section className={styles.rules}><h2>Ten rules that travel</h2><ol>{rules.map(rule=><li key={rule}>{rule}</li>)}</ol></section>
            </>:null}
          </article>
          <nav className={styles.chapterNav} aria-label={copy.chapter}><Link prefetch={false} href={chapterHref(previous?.id)}><small>← {copy.previous}</small><strong lang="en">{previous?.title??copy.overview}</strong></Link><Link prefetch={false} href={chapterHref(next?.id)}><small>{next?copy.next:copy.overview} →</small><strong lang="en">{next?.title??"Sanctuary Economics"}</strong></Link></nav>
          <p className={styles.chapterEdition}>{copy.edition}</p>
        </>}
        <footer className={styles.footer}><span>SANCTUARY ECONOMICS · 2026</span><Link href="/stepanoskin">{copy.home} ↗</Link></footer>
      </div>
    </div>

    <dialog className={styles.contentsDialog} ref={contents} aria-labelledby="contents-title"><div className={styles.dialogHead}><h2 id="contents-title">{copy.contents}</h2><button type="button" onClick={()=>contents.current?.close()}>{copy.close} ×</button></div><Link onClick={()=>contents.current?.close()} href={chapterHref()}>{copy.overview}</Link>{parts.map((part,p)=><section key={part}><h3 lang="en">0{p+1} · {part}</h3>{navigation.map((chapter,i)=>chapter.part===p?<Link href={chapterHref(chapter.id)} prefetch={false} key={chapter.id} onClick={()=>contents.current?.close()} aria-current={current?.id===chapter.id?"page":undefined}><span>{roman(i)}</span><span lang="en">{chapter.title}</span></Link>:null)}</section>)}</dialog>
    <dialog className={styles.lightbox} ref={lightbox} aria-label={copy.zoom} onClose={()=>setZoom(null)}><div className={styles.dialogHead}><span>{copy.zoom}</span><button type="button" onClick={()=>lightbox.current?.close()}>{copy.close} ×</button></div>{zoom && assets.assets[zoom.asset]?<figure>
      {/* Full-sized image is mounted only when opened; native scrolling preserves readable UI text. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetUrl(assets,zoom.asset)} width={imageAsset(assets,zoom.asset).width} height={imageAsset(assets,zoom.asset).height} alt={zoom.alt}/><figcaption lang="en">{zoom.caption}<br/>{zoom.credit}</figcaption></figure>:null}</dialog>
  </main>;
}
