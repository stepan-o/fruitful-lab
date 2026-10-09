"use client";

import { useId, useState, type CSSProperties } from "react";
import { businessHistory, businessHistoryLanes } from "@/lib/sanctuary/business-history";
import type { EvidenceSource } from "@/lib/sanctuary/types";
import { useLivingPlate } from "./plates/useLivingPlate";
import MilestoneObject from "./HistoryScenes";
import s from "./business-history.module.css";

const sourceLabels: Record<string, string> = {
  "pong-tavern": "Pong’s debut", "alcorn-oral": "Alcorn’s account",
  "home-cartridge-history": "Atari’s cartridge library", "sony-ps1-creators": "Sony’s 1997 report",
  "halo-bungie-acquisition": "Bungie acquisition", "valve-deck-booklet": "Valve’s Steam history",
  "game-pass-release-history": "Game Pass expansion", "gfn-reach-2023": "GeForce NOW history",
  "gfn-membership-terms": "Computing & game rights", "steam-cloud": "Steam Cloud Play",
  "pc-software-history": "The software market", "pc-compatible-history": "Compatible PCs",
  "windows-games-1996": "PC gaming in 1996", "ps-network-history": "PlayStation Network",
  "ps-plus-collection-2012": "2012 game collection", "pc-game-pass-2019": "PC Game Pass launch",
  "ps-now-2014": "PS Now launch", "ps-now-pc-2016": "Windows app launch", "xbox-cloud-2020": "Xbox cloud launch",
  "gfn-hardware-upgrades": "Hardware upgrades in the cloud", "gfn-device-requirements": "Devices & connection",
  "arcade-card-readers": "Today’s arcade payments",
  "onlive-launch-2010": "OnLive’s 2010 launch", "xbox-cloud-pc-2021": "Xbox in PC browsers",
};

export default function BusinessHistory({ sources, steamSrc }: { sources: EvidenceSource[]; steamSrc?: string }) {
  const [selected, setSelected] = useState(businessHistory[0].id);
  const id = useId().replace(/:/g, "");
  const ref = useLivingPlate<HTMLElement>();
  const era = businessHistory.find(item => item.id === selected) ?? businessHistory[0];
  return <section id="business-history" ref={ref} data-playing="false" className={s.history} aria-labelledby={`${id}-title`}>
    <header className={s.header}>
      <p className={s.kicker}>1972 → Today · Three continuing histories</p>
      <h2 id={`${id}-title`}>From the coin slot to the cloud.</h2>
      <p>Arcades keep selling turns. PC and console markets add new ways to buy games—and new places to run them.</p>
    </header>
    <p id={`${id}-instruction`} className={s.instruction}>Select a milestone to explore it.</p>
    <div className={s.laneSwitch} role="group" aria-label="Choose a history lane">
      {businessHistoryLanes.map(lane => <button key={lane.id} type="button" aria-pressed={era.lane === lane.id} aria-controls={`${id}-${lane.id}`} onClick={() => setSelected(businessHistory.find(item => item.lane === lane.id)!.id)}>{lane.title}</button>)}
    </div>
    <div className={s.lanes} role="group" aria-label="Explore the business history" aria-describedby={`${id}-instruction`}>
      {businessHistoryLanes.map(lane => {
        const milestones = businessHistory.filter(item => item.lane === lane.id);
        return <section key={lane.id} id={`${id}-${lane.id}`} className={s.lane} data-lane={lane.id} data-active={era.lane === lane.id} aria-labelledby={`${id}-${lane.id}-title`}>
          <header className={s.laneHeader}><h3 id={`${id}-${lane.id}-title`}>{lane.title}</h3><p>{lane.caption}</p></header>
          <ol className={s.timeline} aria-label={`${lane.title} milestones`} style={{ "--steps": milestones.length } as CSSProperties}>
            {milestones.map((item, index) => <li key={item.id}>
              <button type="button" aria-pressed={selected === item.id} aria-controls={`${id}-reading`} onClick={() => setSelected(item.id)}>
                <span className={s.date}>{item.date}</span>
                <div className={s.object}><MilestoneObject kind={item.kind} prefix={`${id}-${item.id}`} steamSrc={item.kind === "online" ? steamSrc : undefined}/></div>
                <span className={s.label}>{item.label}</span>
                <span className={s.artifact}>{item.example.split(" · ")[0]}</span>
                <span className={s.index} aria-hidden="true">0{index + 1}<span>↗</span></span>
              </button>
            </li>)}
          </ol>
          {lane.id === "arcade" ? <p className={s.continuation}>The venue provides the equipment. <br/>The player pays to play.<span aria-hidden="true">→</span></p> : null}
        </section>;
      })}
    </div>
    <div id={`${id}-reading`} className={s.reading} aria-live="polite" aria-atomic="true">
      <div><p className={s.kicker}>{era.date} · {era.example}</p><h3>{era.label}</h3><p>{era.body}</p></div>
      <div className={s.stake}><p>{era.stake}</p><div className={s.sources}>{era.sources.map(sourceId => {
        const source = sources.find(item => item.id === sourceId);
        return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer" title={source.title}>{sourceLabels[source.id] ?? source.title} ↗</a> : null;
      })}</div></div>
    </div>
    <p className={s.note}>Selected milestones within each lane, not a shared time scale. New offers coexist with the older ones. Steam® mark: Valve Corporation · <a href="/stepanoskin/game-monetization/credits#steam-symbol">Source & use</a>.</p>
  </section>;
}
