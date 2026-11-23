"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { conveyorPaces, type ConveyorPaceName } from "@/lib/production-systems/conveyor-pace";
import styles from "./conveyor-pace.module.css";

const query = "(prefers-reduced-motion: reduce)";
const reducedSnapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;
function subscribeReducedMotion(notify: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

/** Change the whole machine's playback rate without seeking or restarting it.
 * CSS and ProfileMotion remain responsible for pause/visibility preferences.
 * Reapply after reduced-motion or print changes, which recreate CSS animations.
 */
export default function ConveyorPace() {
  const root = useRef<HTMLDivElement>(null);
  const [pace, setPace] = useState<ConveyorPaceName>("medium");
  const reduced = useSyncExternalStore(subscribeReducedMotion, reducedSnapshot, serverSnapshot);
  useEffect(() => {
    let frame = 0;
    const applyRate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scene = root.current?.closest("[data-engraving]");
        scene?.getAnimations({ subtree: true }).forEach(animation => {
          animation.updatePlaybackRate(conveyorPaces[pace].rate);
        });
      });
    };
    const print = window.matchMedia("print");
    print.addEventListener("change", applyRate);
    applyRate();
    return () => {
      cancelAnimationFrame(frame);
      print.removeEventListener("change", applyRate);
    };
  }, [pace, reduced]);

  return <div ref={root} className={styles.pace} data-conveyor-pace={pace}>
    <fieldset disabled={reduced} aria-describedby="conveyor-pace-hint">
      <legend>Experiment pace</legend>
      <div className={styles.selector}>
        <span className={styles.rail} aria-hidden="true" />
        {(Object.keys(conveyorPaces) as ConveyorPaceName[]).map(value => <label key={value}>
          <input type="radio" name="conveyor-pace" value={value} checked={pace === value} onChange={() => setPace(value)} />
          <span><i aria-hidden="true" />{conveyorPaces[value].label}</span>
        </label>)}
      </div>
    </fieldset>
    <details className={styles.explanation}>
      <summary aria-label="About experiment pace">i</summary>
      <div>
        <strong>Velocity &amp; evidence</strong>
        <p id="conveyor-pace-hint">At fixed traffic, shorter tests gather less evidence per decision. More comparisons call for false discovery rate (FDR) control.</p>
        <p>{reduced ? "Motion follows your reduced-motion preference." : conveyorPaces[pace].hint} This switch changes the illustration’s pace; the example results stay fixed.</p>
        <a href="#source-pace">Sample size &amp; precision ↗</a>
        <a href="#source-fdr">False-discovery control ↗</a>
      </div>
    </details>
  </div>;
}
