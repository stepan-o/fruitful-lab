"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import AuthorLink from "./AuthorLink";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import Atmosphere from "./Atmosphere";
import DevilMural from "./DevilMural";
import ChapterDiagram from "./ChapterDiagram";
import ChapterScene from "./ChapterScene";
import {historyIds, type HistoryId} from "@/lib/sanctuary/history-ids";
const HistoryScene=dynamic(()=>import("./DiabloHistory").then(m=>m.HistoryScene));
const HistoryComparison=dynamic(()=>import("./DiabloHistory").then(m=>m.HistoryComparison));
const WorldWorkshop=dynamic(()=>import("./WorldWorkshop"));
const CompanyEvolution=dynamic(()=>import("./CompanyEvolution"));
const EpicSpending=dynamic(()=>import("./CompanyEvolution").then(m=>m.EpicSpending));
import FundingDiagram from "./plates/FundingDiagram";
import InfernalTerm from "./InfernalTerm";
import AudienceEconomy from "./plates/AudienceEconomy";
import EveningPlace from "./plates/EveningPlace";
import EvidenceFigure from "./EvidenceFigure";
import VisualSources from "./VisualSources";
import type { VisualSourceLink } from "@/lib/sanctuary/visual-sources";
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
  visualSources?: VisualSourceLink[];
};

const BusinessMap = dynamic(() => import("./BusinessMap"));
const MarketMap = dynamic(() => import("./MarketMap"));
const BusinessLayers = dynamic(() => import("./BusinessMap").then(m=>m.BusinessLayers));
const CloudCircuit = dynamic(() => import("./BusinessCircuit"));
const PlatformRevenue = dynamic(() => import("./BusinessCharts").then(m=>m.PlatformRevenue));
const CloudFigures = dynamic(() => import("./BusinessCharts").then(m=>m.CloudFigures));
const BusinessChains = dynamic(() => import("./BusinessChains"));

const roman = (index:number) => {
  let n=index+1, result="";
  for(const [value,glyph] of [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]] as const) while(n>=value){result+=glyph;n-=value;}
  return result;
};

export default function Reader({locale,current,index,navigation,parts,assets,sources,rules,visualSources=[]}:ReaderProps) {
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
  const isHistory = !!current && historyIds.includes(current.id as HistoryId);

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

  function renderFigure(figure: Figure, i: number, paired = false) {
    return <EvidenceFigure key={figure.asset} figure={figure} asset={imageAsset(assets,figure.asset)} number={`${index+1}.${i+1}`} zoomLabel={copy.zoom} paired={paired} onInspect={()=>setZoom(figure)}/>;
  }

  function renderInlineFigures(paragraphIndex: number) {
    const figures = current?.figures?.map((figure,i)=>({figure,i})).filter(({figure})=>figure.afterParagraph === paragraphIndex) ?? [];
    if (!figures.length) return null;
    return figures.length > 1
      ? <div className={styles.archivePair}>{figures.map(({figure,i})=>renderFigure(figure,i,true))}</div>
      : renderFigure(figures[0].figure,figures[0].i);
  }

  return <main className={styles.reader} lang={locale} data-motion={motion?"on":"off"} data-media-mode="editorial" onClickCapture={transitionSound}>
    {current ? <a href="#reading" className={styles.skip}>{copy.skip}</a> : null}
    <header className={styles.header}>
      <AuthorLink backLabel={soundCopy.backToMenu}/>
      {current ? <div className={styles.headerControls}>
        <button className={styles.contentsButton} type="button" onClick={()=>contents.current?.showModal()} aria-haspopup="dialog" aria-label={copy.contents}>☰ <span>{copy.contents}</span></button>
        <button className={styles.preferenceButton} type="button" aria-label={sound?soundCopy.soundOn:soundCopy.soundOff} title={sound?soundCopy.soundOn:soundCopy.soundOff} aria-pressed={sound} onClick={()=>setSound(!sound)}>{sound?"◖))":"◖×"}</button>
        <button className={styles.preferenceButton} type="button" aria-label={motion?copy.motionOn:copy.motionOff} title={motion?copy.motionOn:copy.motionOff} aria-pressed={motion} onClick={()=>setMotion(!motion)}>{motion?"✧":"◇"}</button>
        <label className={styles.locale}><span className={styles.srOnly}>{localeNames[locale]}</span><select aria-label={localeNames[locale]} value={locale} onChange={event=>switchLocale(event.target.value)}>{locales.map(l=><option key={l} value={l}>{localeNames[l]}</option>)}</select></label>
      </div> : null}
    </header>

    <div className={`${styles.layout} ${!current ? styles.landingLayout : ""}`}>
      {current ? <aside className={styles.rail} aria-label={copy.contents}>
        <Link href={chapterHref()} className={styles.railTitle} aria-current={!current?"page":undefined}>SANCTUARY<br/><em>ECONOMICS</em></Link>
        {parts.map((part,p)=><div className={styles.railPart} key={part}><p lang="en"><span>0{p+1}</span> {part}</p>{navigation.map((chapter,i)=>chapter.part===p?<Link key={chapter.id} href={chapterHref(chapter.id)} prefetch={false} aria-current={current?.id===chapter.id?"page":undefined}><span>{roman(i)}</span><span lang="en">{chapter.title}</span></Link>:null)}</div>)}
        <span className={styles.railEdition}>{copy.edition}<br/>08 OCT 2026</span>
      </aside> : null}

      <div className={styles.body} id="reading" tabIndex={-1}>
        {!current ? <>
          <section className={styles.cover} lang="en">
            <div className={styles.coverMural}><DevilMural motion={motion}/></div>
            <p className={styles.eyebrow}>An illustrated study of game design & monetization</p>
            <h1>Sanctuary<br/><em>Economics</em></h1>
            <p className={styles.coverLede}>How the games we love are built, sold and kept alive.</p>
            <Link href={chapterHref(first.id)} className={styles.primary} lang={locale}>{copy.start} <span aria-hidden="true">↗︎</span></Link>
          </section>
        </> : <>
          <article className={styles.article} lang="en" data-opening={index === 0 || current.id === "the-fork" || undefined}>
            <div className={styles.chapterTop}><Link href={chapterHref()}>{copy.overview}</Link><span>{String(index+1).padStart(2,"0")} / {navigation.length}</span></div>
            <p className={styles.eyebrow}>PART {roman(current.part)} · {parts[current.part]}</p>
            <div className={index === 0 || current.id === "the-fork" ? styles.openingHeading : undefined}>
              <div className={styles.titleRow}><span className={styles.chapterNumeral} aria-hidden="true">{roman(index)}</span><h1>{current.title}</h1></div>
              <p className={styles.lede}>{current.lede}</p>
            </div>
            {current.figures?.some(figure=>figure.placement === "identity") ? <div className={styles.archivePair}>{current.figures.map((figure,i)=>figure.placement === "identity" ? renderFigure(figure,i,true) : null)}</div> : null}
            {current.figures?.some(figure=>figure.placement === "opening") ? <section className={styles.referenceComparison} aria-label={current.id === "making-worlds" ? "Two worlds to inhabit" : "The two games in view"}>
              <div className={styles.referencePair}>{current.figures.filter(figure=>figure.placement === "opening").map(figure=><figure key={figure.asset}>
                <button type="button" className={styles.figureButton} aria-label={`${copy.zoom}: ${figure.alt}`} onClick={()=>setZoom(figure)}><AssetImage asset={imageAsset(assets,figure.asset)} alt={figure.alt} sizes="(max-width:720px) 94vw, (max-width:1100px) 40vw, 450px" preload/><span className={styles.zoomLabel}>{copy.zoom} ↗</span></button>
                <figcaption><p>{figure.caption}</p><small>{figure.credit} · <Link prefetch={false} href={`/stepanoskin/game-monetization/credits#${figure.asset}`}>Source & use ↗</Link></small></figcaption>
              </figure>)}</div>
              <p className={styles.referenceReading}>{current.id === "making-worlds" ? "Both worlds combine authored scenes and interacting systems. Their production choices are the subject of this chapter." : "Two role-playing traditions, with different plans for what comes after release."}</p>
            </section>:null}
            {!isHistory && !["the-fork","insert-coin","studio-to-screen","how-many-lives","platform-business","cloud-gaming","valve-platform","epic-infrastructure","rockstar-world","making-worlds"].includes(current.id) ? <ChapterScene key={`scene-${current.id}`} chapter={current.id} index={index}/> : null}
            {isHistory ? <HistoryScene key={current.id} chapter={current.id as HistoryId}/> : null}
            {current.id === "insert-coin" ? <EveningPlace opening/> : null}
            {current.id === "studio-to-screen" ? <BusinessMap/> : null}
            {current.id === "platform-business" ? <BusinessChains/> : null}
            {current.id === "cloud-gaming" ? <CloudCircuit key="cloud" cloudOnly/> : null}
            {current.id === "valve-platform" || current.id === "epic-infrastructure" || current.id === "rockstar-world" ? <CompanyEvolution key={current.id} chapter={current.id}/> : null}
            {current.id === "how-many-lives" ? <ChapterDiagram chapter={current.id} diagram={current.visual.diagram} index={index}/> : null}
            <div className={styles.prose}>
              {current.paragraphs.map((paragraph, paragraphIndex) => (
                <Fragment key={`${current.id}-${paragraphIndex}`}>
                  {current.sections
                    ?.filter((section) => section.at === paragraphIndex)
                    .map((section) => (
                      <h2 key={section.title}>{section.title}</h2>
                    ))}
                  <p>
                    {["the-fork","platform-business"].includes(current.id)
                      ? paragraph.split(/\b(subscription|future sales|the gap)\b/).map((text, segment) => text === "subscription" || text === "future sales" || text === "the gap"
                        ? <InfernalTerm key={segment} tone={text === "the gap" ? "abyss" : text === "future sales" ? "spectral" : "subscription"}>{text}</InfernalTerm>
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
                  {renderInlineFigures(paragraphIndex)}
                  {current.exhibits?.filter(exhibit=>exhibit.afterParagraph === paragraphIndex).map(exhibit=>{
                    switch(exhibit.kind){
                      case "market-map": return <MarketMap key={exhibit.kind}/>;
                      case "world-workshop": return <WorldWorkshop key={exhibit.kind}/>;
                      case "epic-spending": return <EpicSpending key={exhibit.kind}/>;
                      case "gathering-place": return <EveningPlace key={exhibit.kind} initialWorld/>;
                      case "business-layers": return <BusinessLayers key={exhibit.kind}/>;
                      case "platform-revenue": return <PlatformRevenue key={exhibit.kind}/>;
                      case "cloud-figures": return <CloudFigures key={exhibit.kind}/>;
                      case "audience-economy": return <AudienceEconomy key={exhibit.kind}/>;
                      case "chapter-diagram": return <ChapterDiagram key={exhibit.kind} chapter={current.id} diagram={current.visual.diagram} index={index}/>;
                      case "funding": return <FundingDiagram key={exhibit.kind}/>;
                    }
                  })}
                </Fragment>
              ))}
            </div>
            {!isHistory && !["the-fork","insert-coin","studio-to-screen","how-many-lives","platform-business","cloud-gaming","valve-platform","epic-infrastructure","rockstar-world","making-worlds"].includes(current.id) ? <ChapterDiagram key={`diagram-${current.id}`} chapter={current.id} diagram={current.visual.diagram} index={index}/> : null}
            {isHistory ? <HistoryComparison key={current.id} chapter={current.id as HistoryId}/> : null}
            {current.table?<div className={styles.tableWrap} tabIndex={0} aria-label={current.table.caption}><table><caption>{current.table.caption}</caption><thead><tr>{current.table.headers.map(h=><th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{current.table.rows.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th scope="row" key={i}>{cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>:null}
            {current.figures?.map((figure,i)=>figure.placement === undefined && figure.afterParagraph === undefined ? renderFigure(figure,i) : null)}
            {current.takeaway ? <blockquote className={styles.takeaway}><span aria-hidden="true">◇</span>{current.takeaway}</blockquote> : null}
            <VisualSources records={visualSources}/>
            <details className={styles.evidence}><summary lang={locale}>{copy.sourceNotes} <span aria-hidden="true">+</span></summary><p>{current.evidence}</p>{sources.length?<ol>{sources.map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><p>{source.note}</p></li>)}</ol>:<p>Source: the stated mathematical model or owner-provided research capture. Original scene studies accompany selected visual citations.</p>}</details>
            {index===navigation.length-1?<>
              <section className={styles.rules}><h2>Ten rules that travel</h2><ol>{rules.map(rule=><li key={rule}>{rule}</li>)}</ol></section>
            </>:null}
          </article>
          <nav className={styles.chapterNav} aria-label={copy.chapter}><Link prefetch={false} href={chapterHref(previous?.id)}><small>← {copy.previous}</small><strong lang="en">{previous?.title??copy.overview}</strong></Link><Link prefetch={false} href={chapterHref(next?.id)}><small>{next?copy.next:copy.overview} →</small><strong lang="en">{next?.title??"Sanctuary Economics"}</strong></Link></nav>
          <p className={styles.chapterEdition}>{copy.edition}</p>
        </>}
        {current ? <footer className={styles.footer}><span>SANCTUARY ECONOMICS · 2026</span><Link prefetch={false} href="/stepanoskin/game-monetization/credits">{copy.credits} ↗</Link><Link href="/stepanoskin">{copy.home} ↗</Link></footer> : null}
      </div>
    </div>

    {current ? <><dialog className={styles.contentsDialog} ref={contents} aria-labelledby="contents-title"><div className={styles.dialogHead}><h2 id="contents-title">{copy.contents}</h2><button type="button" onClick={()=>contents.current?.close()}>{copy.close} ×</button></div><Link onClick={()=>contents.current?.close()} href={chapterHref()}>{copy.overview}</Link>{parts.map((part,p)=><section key={part}><h3 lang="en">0{p+1} · {part}</h3>{navigation.map((chapter,i)=>chapter.part===p?<Link href={chapterHref(chapter.id)} prefetch={false} key={chapter.id} onClick={()=>contents.current?.close()} aria-current={current?.id===chapter.id?"page":undefined}><span>{roman(i)}</span><span lang="en">{chapter.title}</span></Link>:null)}</section>)}</dialog>
    <dialog className={styles.lightbox} ref={lightbox} aria-label={copy.zoom} onClose={()=>setZoom(null)}><div className={styles.dialogHead}><span>{copy.zoom}</span><button type="button" onClick={()=>lightbox.current?.close()}>{copy.close} ×</button></div>{zoom && assets.assets[zoom.asset]?<figure>
      {/* Full-sized image is mounted only when opened; native scrolling preserves readable UI text. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={zoom.presentation === "pixels" ? styles.pixelInspection : undefined} src={assetUrl(assets,zoom.asset)} width={imageAsset(assets,zoom.asset).width} height={imageAsset(assets,zoom.asset).height} alt={zoom.alt}/><figcaption lang="en">{zoom.caption}<br/>{zoom.credit}</figcaption></figure>:null}</dialog></> : null}
    <Atmosphere enabled={motion}/>
  </main>;
}
