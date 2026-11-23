"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import media from "@/lib/sanctuary/rivals-media.json";
import styles from "./rivals-studies.module.css";

type ImageId = keyof typeof media;

function Frame({ id, opening = false }: { id: ImageId; opening?: boolean }) {
  const record = media[id];
  const [unavailable, setUnavailable] = useState(false);
  return <div className={styles.frame}>
    {unavailable ? <a className={styles.fallback} href={record.sourceUrl}>View {record.title.toLowerCase()} at the source ↗</a> :
      <Image fill src={record.image} alt={record.alt} preload={opening}
        sizes={opening ? "(min-width: 1100px) 650px, (min-width: 760px) 60vw, 92vw" : "(min-width: 1100px) 830px, 92vw"}
        onError={() => setUnavailable(true)} />}
  </div>;
}

function Credit({ id }: { id: ImageId }) {
  const record = media[id];
  return <small className={styles.credit}><a href={record.sourceUrl}>{record.credit} ↗</a>
    <a href={`/stepanoskin/game-monetization/credits#${id}`}>Source &amp; use</a></small>;
}

export function RivalsOpening() {
  return <section className={styles.opening} aria-label="Incognito Dolphin and the launch roster">
    <figure className={styles.leadPlate}>
      <Frame id="rivals-dolphin" opening />
      <figcaption className={styles.leadCaption}>
        <span className={styles.kicker}>Dooms’ Rise · December 2024</span>
        <strong>One shark, <br/>two animals.</strong>
        <p>The blue face still has to read as Jeff for the pink disguise to land.</p>
        <Credit id="rivals-dolphin" />
      </figcaption>
    </figure>
    <dl className={styles.stats}>
      <div><dt>Heroes at launch</dt><dd>33</dd></div>
      <div><dt>Players per side</dt><dd>6</dd></div>
      <div><dt>Quick Match &amp; Competitive maps</dt><dd>8</dd></div>
    </dl>
  </section>;
}

const screens = [
  {
    id: "rivals-wheel", label: "Early wheel", title: "Showcase one hero",
    principle: "Visual hierarchy and scale",
    detail: "Compare the size of Hulk’s illustration with the small portraits around it. The featured character gets most of the attention and space.",
  },
  {
    id: "rivals-gallery", label: "Released gallery", title: "Browse the cast",
    principle: "Gestalt similarity · recognition rather than recall",
    detail: "Matching cards give faces and names a repeated position. Notice that this view also has a scrollbar and a class filter. The full cast extends beyond the visible rows.",
  },
  {
    id: "rivals-selection", label: "Match selection", title: "Choose while the team forms",
    principle: "Visibility of system status",
    detail: "The 27-second countdown and six team slots carry information the gallery does not need. The arc at the right holds the character choices for this timed decision.",
  },
] as const;

export function RivalsInterface() {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const [inspecting, setInspecting] = useState(false);
  const current = screens[selected];
  return <section id="rivals-interface" className={styles.study} aria-labelledby="rivals-ui-title">
    <div className={styles.studyHead}><span className={styles.kicker}>Interface study · 2024–25</span>
      <h3 id="rivals-ui-title">Three ways to find a hero</h3></div>
    <div className={styles.tabs} role="group" aria-label="Choose a hero interface">
      {screens.map((item, i) => <button type="button" key={item.id} aria-pressed={selected === i}
        onClick={() => setSelected(i)}>{item.label}</button>)}
    </div>
    <figure className={styles.inspection} aria-live="polite">
      <Frame key={current.id} id={current.id} />
      <figcaption><div><strong>{current.title}</strong><p className={styles.principle}>{current.principle}</p><p>{current.detail}</p><Credit id={current.id}/></div>
        <button className={styles.enlarge} type="button" aria-haspopup="dialog"
          onClick={() => { setInspecting(true); dialog.current?.showModal(); }}>Enlarge screen ↗</button></figcaption>
    </figure>
    <dialog ref={dialog} className={styles.dialog} aria-label={media[current.id].title} onClose={() => setInspecting(false)}>
      <div><span>{media[current.id].title}</span><button type="button" onClick={() => dialog.current?.close()}>Close ×</button></div>
      {inspecting && <Image width={1920} height={1080} sizes="(max-width: 960px) 960px, 95vw" src={media[current.id].image} alt={media[current.id].alt}/>}
    </dialog>
    <section className={styles.voices} aria-labelledby="rivals-voices-title">
      <h4 id="rivals-voices-title">What the designer wanted, what players asked for</h4>
      <figure className={styles.designerVoice}>
        <blockquote cite={media["rivals-wheel"].sourceUrl}>
          <p>“presents an artistic immersive experience”</p>
        </blockquote>
        <figcaption>Dino, art director, describing the hero selector in Art Vision.<br/>
          <a href={media["rivals-wheel"].sourceUrl}>Excerpt quoted by Justin Wagner, PC Gamer · 21 April 2025 ↗</a>
        </figcaption>
      </figure>
      <div className={styles.playerVoices}>
        <figure>
          <blockquote cite="https://www.reddit.com/r/marvelrivals/comments/1m2ltae/its_time_to_remove_the_hero_select_wheel/">
            <p>“as we get more and more characters it’s gonna be annoying to scroll and find the one you’re looking for.”</p>
          </blockquote>
          <figcaption><a href="https://www.reddit.com/r/marvelrivals/comments/1m2ltae/its_time_to_remove_the_hero_select_wheel/">u/imjokeslol · r/marvelrivals · 17 July 2025 ↗</a></figcaption>
        </figure>
        <figure>
          <blockquote cite="https://www.reddit.com/r/marvelrivals/comments/1m2ltae/comment/n3pxrlm/">
            <p>“the change they really need is a favorite section, that you can customize, as the default so you can quickly get to characters you know you will likely play.”</p>
          </blockquote>
          <figcaption><a href="https://www.reddit.com/r/marvelrivals/comments/1m2ltae/comment/n3pxrlm/">u/datguy078 · reply in the same discussion ↗</a></figcaption>
        </figure>
      </div>
    </section>
    <div className={styles.film}>
      <div><span className={styles.kicker}>From the studio</span><strong>Art Vision · GUI &amp; Video</strong>
        <p>Art director Dino and the visual team show the design in motion.</p></div>
      <button type="button" aria-expanded={playing} onClick={() => setPlaying(!playing)}>{playing ? "Close film" : "▷  Load film"}</button>
      {playing && <iframe title="Art Vision Vol. 01 — the official Marvel Rivals interface design film"
        src="https://www.youtube-nocookie.com/embed/JaNAqe180Hc" referrerPolicy="strict-origin-when-cross-origin" allow="encrypted-media; picture-in-picture" allowFullScreen/>}
      <a className={styles.filmLink} href="https://www.youtube.com/watch?v=JaNAqe180Hc">Watch on the official channel ↗</a>
    </div>
  </section>;
}

const offers = [
  { name: "Play Jeff", price: 0, detail: "His healing and movement abilities are available to everyone.", items: ["Playable hero"] },
  { name: "Costume", price: 1400, detail: "The pink dolphin disguise appears on your Jeff in play.", items: ["Costume"] },
  { name: "Bundle", price: 1600, detail: "The extra 200 Units carry the disguise beyond the character model.", items: ["Costume", "Emote", "Spray", "Nameplate", "MVP animation"] },
];
const formatUnits = (value: number) => value.toLocaleString("en-US");

export function RivalsWallet() {
  const [index, setIndex] = useState(2);
  const [balance, setBalance] = useState(0);
  const offer = offers[index];
  const fromBalance = Math.min(balance, offer.price);
  return <section className={styles.wallet} aria-labelledby="rivals-wallet-title">
    <div className={styles.studyHead}><span className={styles.kicker}>Jeff’s launch offers · Units</span>
      <h3 id="rivals-wallet-title">What does the extra 200 buy?</h3></div>
    <div className={styles.tabs} role="group" aria-label="Choose a Jeff offer">
      {offers.map((item, i) => <button type="button" key={item.name} aria-pressed={index === i}
        onClick={() => setIndex(i)}>{item.name}</button>)}
    </div>
    <div className={styles.receipt}>
      <div aria-live="polite" className={styles.ticket}>
        <span className={styles.kicker}>{offer.name}</span><strong>{formatUnits(offer.price)} <small>Units</small></strong>
        <ul>{offer.items.map(item => <li key={item}>{item}</li>)}</ul>
        <p>{offer.detail}</p>
      </div>
      <div className={styles.walletMath}>
        <label htmlFor="jeff-balance">Units already earned</label>
        <select id="jeff-balance" value={balance} onChange={event => setBalance(Number(event.target.value))}>
          {[0, 800, 1400, 1600].map(value => <option key={value} value={value}>{formatUnits(value)} Units</option>)}
        </select>
        <dl aria-live="polite"><div><dt>From your balance</dt><dd>{formatUnits(fromBalance)} Units</dd></div>
          <div><dt>Still to cover</dt><dd>{formatUnits(offer.price - fromBalance)} Units</dd></div></dl>
        <p>You could earn more Units or exchange Lattice one for one. A cash total depends on your wallet, region and currency pack.</p>
      </div>
    </div>
  </section>;
}

export function RivalsSeasonFigure({ anniversary = false }: { anniversary?: boolean }) {
  const id = anniversary ? "rivals-van-dyne" : "rivals-incursion";
  return <figure className={styles.season}>
    <Frame id={id}/>
    <figcaption><span className={styles.kicker}>{anniversary ? "Van Dyne’s · 4–18 December 2025" : "The Incursion · 13 November 2026"}</span>
      <strong>{anniversary ? "100 to 2,400 Units" : "Ten costume sets, one season pass"}</strong>
      <p>{anniversary ? "The lowest possible bill and the most anyone had to spend for the set. Neither figure tells us what the average buyer paid." :
        "The pass groups costumes into one purchase. Nightcrawler’s release and his Gold-rank outfit gave players two more reasons to show up that season."}</p>
      <Credit id={id}/>
    </figcaption>
  </figure>;
}
