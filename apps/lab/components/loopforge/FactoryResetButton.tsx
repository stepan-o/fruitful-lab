"use client";

import { useState } from "react";
import manifest from "@/lib/assets/generated/loopforge-controls.json";
import styles from "./factory-conveyor.module.css";

const atlas = manifest.assets.reset;
const largest = atlas.variants[atlas.variants.length - 1];
const srcSet = atlas.variants.map(file => `${file.src} ${file.width}w`).join(", ");
// Each image contains three square frames, so its rendered width is 3× the control.
const sizes = "(max-width: 640px) and (max-height: 480px) and (orientation: landscape) 150px, (max-width: 640px) 186px, (max-height: 480px) 168px, (max-width: 900px) 228px, 276px";
const frames = [styles.resetIdle, styles.resetHover, styles.resetPressed];

/** One preloaded bitmap contains every state: first hover/press needs no request.
 * Registered painted frames crossfade without moving the housing or hit target.
 */
export default function FactoryResetButton({ jammed, hintId, onReset }: {
  jammed: boolean; hintId: string; onReset: () => void;
}) {
  const [ready, setReady] = useState(false);
  return (
    <button type="button" className={styles.resetButton} aria-label="Restart conveyor"
      aria-disabled={!jammed} aria-describedby={hintId} data-art-ready={ready}
      onClick={() => { if (jammed) onReset(); }}>
      <span className={styles.resetArtwork} aria-hidden="true">
        <span className={styles.resetFallback}>RESET</span>
        {frames.map((frame, i) => (
          <span className={`${styles.resetFrame} ${frame}`} key={frame}>
            {/* Already optimized immutable atlas; native srcset keeps all frames on the same file. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={largest.src} srcSet={srcSet} sizes={sizes} width={atlas.width} height={atlas.height}
              alt="" draggable={false} loading="eager" decoding="async"
              onLoad={i === 0 ? () => setReady(true) : undefined}
              onError={i === 0 ? () => setReady(false) : undefined}/>
          </span>
        ))}
      </span>
      <span className={styles.resetLabel}>{jammed ? "PRESS TO RESET" : "MANUAL RESET"}</span>
    </button>
  );
}
