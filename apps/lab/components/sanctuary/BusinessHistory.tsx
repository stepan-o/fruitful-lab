"use client";

import { useId, useState } from "react";
import { businessHistory } from "@/lib/sanctuary/business-history";
import type { EvidenceSource } from "@/lib/sanctuary/types";
import { useLivingPlate } from "./plates/useLivingPlate";
import MilestoneObject from "./HistoryScenes";
import s from "./business-history.module.css";

const sourceLabels: Record<string, string> = {
  "pong-tavern": "Pong’s debut", "alcorn-oral": "Alcorn’s account",
  "home-cartridge-history": "Atari’s cartridge library", "sony-ps1-creators": "Sony’s 1997 report",
  "halo-bungie-acquisition": "Bungie acquisition", "halo-macworld-recollection": "Lehto’s recollection",
  "valve-deck-booklet": "Valve’s Steam history", "netflix-streaming-launch": "Netflix’s launch",
  "game-pass-release-history": "Game Pass expansion", "gfn-reach-2023": "GeForce NOW history",
  "gfn-membership-terms": "Computing & game rights", "halo-playstation-release": "Halo’s 2026 release",
};

export default function BusinessHistory({ sources }: { sources: EvidenceSource[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId().replace(/:/g, "");
  const ref = useLivingPlate<HTMLElement>();
  const era = businessHistory[selected];
  return <section id="business-history" ref={ref} data-playing="false" className={s.history} aria-labelledby={`${id}-title`}>
    <header className={s.header}><p className={s.kicker}>1972 → 2026 · Selected milestones</p><h2 id={`${id}-title`}>From the coin slot to the cloud.</h2><p>New ways to sell entertainment accumulate. The earlier ones keep earning.</p></header>
    <ol className={s.timeline} aria-label="Explore the business history">
      {businessHistory.map((item, index) => <li key={item.id}>
        <button type="button" aria-pressed={selected === index} aria-controls={`${id}-reading`} onClick={() => setSelected(index)}>
          <span className={s.date}>{item.date}</span>
          <div className={s.object}><MilestoneObject kind={item.id} prefix={`${id}-${item.id}`}/></div>
          <span className={s.label}>{item.label}</span><span className={s.artifact}>{item.example.split(" · ")[0]}</span><span className={s.index} aria-hidden="true">0{index+1} <span>↗</span></span>
        </button>
      </li>)}
    </ol>
    <div id={`${id}-reading`} className={s.reading} aria-live="polite" aria-atomic="true">
      <div><p className={s.kicker}>{era.date} · {era.example}</p><h3>{era.label}</h3><p>{era.body}</p></div>
      <div className={s.stake}><p>{era.stake}</p><div className={s.sources}>{era.sources.map(sourceId => {
        const source = sources.find(item => item.id === sourceId);
        return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer" title={source.title}>{sourceLabels[source.id] ?? source.title} ↗</a> : null;
      })}</div></div>
    </div>
    <p className={s.note}>Select a milestone to explore it. Dates mark these examples, not the invention or replacement of a business model.</p>
  </section>;
}
