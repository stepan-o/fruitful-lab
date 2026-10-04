import { useState } from "react";
import { useLivingPlate } from "./useLivingPlate";
import { Readout } from "./Controls";
import ArcadeCabinet from "./ArcadeCabinet";
import styles from "./arcade-exchange.module.css";

export default function ArcadeExchange() {
  const livingRef=useLivingPlate<HTMLDivElement>();
  const [health, setHealth] = useState(600);
  return <>
    <div ref={livingRef} data-living-cabinet className={styles.cutaway}>
      <div className={styles.cabinet}><ArcadeCabinet health={health} operator label="An original arcade cabinet with its coin door open to show the health-per-coin setting"/></div>
      <div className={styles.ledger}>
        <p className={styles.eyebrow}>BEHIND THE COIN DOOR</p>
        <label className={styles.setting}>Health per coin
          <select value={health} onChange={event=>setHealth(Number(event.target.value))}>
            <option value={100}>100 · lowest setting</option>
            <option value={600}>600 · recommended setting</option>
            <option value={2000}>2,000 · highest setting</option>
          </select>
        </label>
        <div className={styles.gauge} aria-hidden="true"><span style={{width:`${health / 20}%`}}/></div>
        <p className={styles.note}>Three documented options. The cutaway shows the selected allowance; the game screen is an original illustration.</p>
      </div>
    </div>
    <Readout tag="PURCHASED HEALTH">{health.toLocaleString("en-US")} health per coin selected. This is a reserve, not a promise of minutes.</Readout>
  </>;
}
