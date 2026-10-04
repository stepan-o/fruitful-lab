import { useState } from "react";
import { Choices, Readout } from "./Controls";
import ArcadeCabinet from "./ArcadeCabinet";
import styles from "./arcade-exchange.module.css";

export default function ArcadeExchange() {
  const [view, setView] = useState(0);
  const [health, setHealth] = useState(600);
  return <>
    <Choices label="Which side of the cabinet?" items={["The player", "The operator"]} value={view} onChange={setView}/>
    <div className={styles.cutaway}>
      <div className={styles.cabinet}><ArcadeCabinet health={health} operator={view === 1} label={view === 0 ? "An original arcade cabinet: four adventurers share a maze above a coin slot" : "The same cabinet with its coin door open to reveal the health-per-coin setting"}/></div>
      <div className={styles.ledger}>
        <p className={styles.eyebrow}>{view === 0 ? "INSIDE THE MAZE" : "BEHIND THE COIN DOOR"}</p>
        <h3>{view === 0 ? "How much farther can we get?" : "What does one coin buy?"}</h3>
        {view === 0 ? <ol className={styles.chain}>
          <li><span>01</span><div><strong>Put in a coin</strong><p>Join the activity already happening at the cabinet.</p></div></li>
          <li><span>02</span><div><strong>Make it last</strong><p>The clock, encounters and food shape how far this run can go.</p></div></li>
          <li><span>03</span><div><strong>Keep this run going</strong><p>Another coin can keep this character in the adventure.</p></div></li>
        </ol> : <>
          <label className={styles.setting}>Health per coin
            <select value={health} onChange={event=>setHealth(Number(event.target.value))}>
              <option value={100}>100 · lowest setting</option>
              <option value={600}>600 · recommended setting</option>
              <option value={2000}>2,000 · highest setting</option>
            </select>
          </label>
          <div className={styles.gauge} aria-hidden="true"><span style={{width:`${health / 20}%`}}/></div>
          <p className={styles.note}>Three of the options printed in Atari’s manual. This changes the reserve purchased, not a guaranteed number of minutes.</p>
          <div className={styles.rule}><strong>Difficulty is another lever</strong><p>The operator can also change the pace at which monsters appear. The encounter and the offer share a setting.</p></div>
        </>}
      </div>
    </div>
    <Readout tag="ONE MACHINE · TWO PERSPECTIVES">{view === 0 ? "The next coin can continue a run already shared with other people. Its value depends on what the player wants to carry on." : `${health.toLocaleString("en-US")} health per coin selected. The reserve changes; skill, food and difficulty still affect how long it lasts.`}</Readout>
  </>;
}
