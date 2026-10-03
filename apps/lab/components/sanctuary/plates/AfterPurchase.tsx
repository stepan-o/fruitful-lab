import { useState } from "react";
import { Choices, Readout } from "./Controls";
import s from "../exhibits.module.css";
import styles from "./after-purchase.module.css";

const possibilities = [
  {
    choice: "Explore what is there",
    playing: ["Another way through", "Discover a different route, practice a skill or play with someone new."],
    making: ["The next project", "The studio can move to another work while supporting the existing release."],
    paying: ["Another customer", "New players can buy the game. This player’s replay creates no additional sale."],
    point: "A game can keep giving its owner something worthwhile to do without selling that owner something else.",
  },
  {
    choice: "Add another adventure",
    playing: ["More to explore", "A separately purchased expansion adds places, characters or new possibilities."],
    making: ["A substantial addition", "The studio makes a new package within the existing game."],
    paying: ["The expansion purchase", "An existing player buys the addition. Replaying it does not require buying it again."],
    point: "The next sale pays for an additional work. A new purchase and another playthrough remain different events.",
  },
  {
    choice: "Run an ongoing program",
    playing: ["New occasions to play", "Updates and shared events offer further goals, whether or not the player buys an extra."],
    making: ["Continuing production", "Teams keep supplying activities, maintaining the service and making additional offers."],
    paying: ["Further optional offers", "Some existing players buy extras. New game sales and expansions can also contribute."],
    point: "Continuing play and further purchases now share a setting. They are still separate choices for the player.",
  },
];

/** A qualitative comparison. No revenue quantities or implied time scale. */
export default function AfterPurchase() {
  const [selected, setSelected] = useState(0);
  const view = possibilities[selected];
  const tracks = [
    { key: "play", name: "The player", start: "Starts playing", value: view.playing },
    { key: "work", name: "The studio", start: "Delivers the game", value: view.making },
    { key: "sale", name: "Payment", start: "The initial sale", value: view.paying },
  ];
  return <>
    <p className={s.instruction}>Follow the same purchase forward. Change what the studio makes next, then compare play, production and payment.</p>
    <div className={styles.actions}><Choices label="What happens after purchase?" items={possibilities.map(option => option.choice)} value={selected} onChange={setSelected}/></div>
    <div className={styles.tracks}>
      <div className={styles.axis} aria-hidden="true"><span>At purchase</span><span>Afterward →</span></div>
      {tracks.map(track => <section className={styles.track} data-track={track.key} key={track.key} aria-label={track.name}>
        <div className={styles.origin}><span className={styles.seal} aria-hidden="true">{track.key === "play" ? "◇" : track.key === "work" ? "✧" : "◎"}</span><h3>{track.name}</h3><p>{track.start}</p></div>
        <div className={styles.rail} aria-hidden="true"><span/></div>
        <div className={styles.destination}><h4>{track.value[0]}</h4><p>{track.value[1]}</p></div>
      </section>)}
    </div>
    <Readout tag="FOLLOW THE RELATIONSHIP">{view.point}</Readout>
  </>;
}
