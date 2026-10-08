"use client";

import { useEffect, useRef, useState, useId, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { playLandingSound } from "@/lib/loopforge/landing-audio";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";
import { createDrive, restartDrive, stepDrive, type Drive } from "./factory-drive";
import { createFactoryRenderer } from "./factory-renderer";
import { factoryArt } from "./factory-art";
import FactoryResetButton from "./FactoryResetButton";
import styles from "./factory-conveyor.module.css";

/** A decorative factory line. It has no connection to simulation state or model calls. */
export default function FactoryConveyor({ controlTarget }: { controlTarget?: HTMLElement | null }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const drive = useRef<Drive>(createDrive());
  const reset = useRef<() => void>(() => {});
  const [status, setStatus] = useState<Drive["status"]>("running");
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [motion, setMotion] = usePreference(motionKey);
  const motionRef = useRef(motion);
  const syncRef = useRef<() => void>(() => {});
  const hintId = useId();

  useEffect(() => { motionRef.current = motion; syncRef.current(); }, [motion]);
  useEffect(() => { syncRef.current(); }, [controlTarget]);

  useEffect(() => {
    const element = root.current, target = canvas.current;
    if (!element || !target) return;
    const renderer = createFactoryRenderer(target);
    if (!renderer) return;
    // Sample once per mounted machine, outside render. Later fault intervals
    // differ between visits; the first fault is always three active seconds.
    drive.current.jamSeed = Math.floor(Math.random() * 0x100000000);
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, last = 0, visible = false, active = false, loaded = false, disposed = false;
    function drawStill() { renderer!.draw(drive.current, true); }
    function tick(now: number) {
      if (!active) return;
      if (!last) last = now;
      const elapsed = now - last;
      if (elapsed >= 1000 / 30) {
        const before = drive.current.status;
        stepDrive(drive.current, elapsed / 1000);
        if (before !== drive.current.status) setStatus(drive.current.status);
        renderer!.draw(drive.current);
        last = now;
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); last = 0;
      active = loaded && motionRef.current && !media.matches && visible && !document.hidden;
      element!.dataset.animating = String(active);
      if (controlsRef.current) controlsRef.current.dataset.animating = String(active);
      if (active) frame = requestAnimationFrame(tick);
      else drawStill();
    }
    function resize() {
      const box = target!.getBoundingClientRect();
      if (!box.width || !box.height) return;
      renderer!.resize(box.width, box.height);
      renderer!.draw(drive.current, !active);
    }
    syncRef.current = sync;
    reset.current = () => {
      if (!restartDrive(drive.current)) return;
      if (!active) { drive.current.status = "running"; drive.current.stateAge = 0; }
      setStatus(drive.current.status);
      renderer.draw(drive.current, !active);
      playLandingSound("contactor");
    };
    const mediaChanged = () => { setReduced(media.matches); sync(); };
    const observer = new IntersectionObserver(([entry]) => {
      setReduced(media.matches);
      visible = entry.isIntersecting; sync();
    }, { threshold: .12 });
    observer.observe(target);
    const sizing = new ResizeObserver(resize);
    sizing.observe(target);
    media.addEventListener("change", mediaChanged);
    document.addEventListener("visibilitychange", sync);
    resize(); sync();
    renderer.ready.then(ok => { if (disposed) return; loaded=ok; setReady(ok); resize(); sync(); });
    return () => {
      disposed = true; active = false; cancelAnimationFrame(frame);
      observer.disconnect(); sizing.disconnect();
      media.removeEventListener("change", mediaChanged);
      document.removeEventListener("visibilitychange", sync);
      syncRef.current = () => {};
      reset.current = () => {};
      renderer.dispose();
    };
  }, []);

  const stoppedMotion = reduced || !motion;
  const controls = (
      <div ref={controlsRef} className={styles.controlRail} data-state={status} lang="en">
        <div className={styles.readout}>
          <span className={styles.micro}>LINE 01 · MANUAL OVERRIDE</span>
          <p role="status" aria-live="polite" aria-atomic="true"><i aria-hidden="true"/>{status === "jammed" ? "LINE JAMMED" : status === "restarting" ? "DRIVE ENGAGING" : stoppedMotion || !ready ? "LINE AT REST" : "PRODUCTION IN PROGRESS"}</p>
          <span className={styles.hint} id={hintId}>{status === "jammed" ? "Press RESET to restart." : status === "restarting" ? "Restarting. Stand clear." : "If it jams, press RESET."}</span>
        </div>
        <div className={styles.station}>
          <button className={styles.motion} onClick={() => setMotion(!motion)} aria-label={motion ? "Pause factory motion" : "Resume factory motion"} aria-pressed={motion} disabled={reduced}>
            <span aria-hidden="true">{stoppedMotion ? "▷" : "Ⅱ"}</span>{reduced ? "REDUCED MOTION" : motion ? "PAUSE" : "RESUME"}
          </button>
          <FactoryResetButton jammed={status === "jammed"} hintId={hintId} onReset={() => reset.current()}/>
        </div>
      </div>
  );
  return (
    <section ref={root} className={styles.factory} data-state={status} data-ready={ready} data-animating="false" lang="en" aria-label="Loopforge cortex assembly line">
      <div className={styles.identifier} aria-hidden="true"><span>CORTEX ASSEMBLY</span><span>LINE 01 / CONTINUOUS IMPROVEMENT*</span></div>
      <div className={styles.scene}>
        <div className={styles.fallback} aria-hidden="true" style={{
          "--forge-small": `url("${factoryArt.lattice.variants[0].src}")`,
          "--forge-large": `url("${factoryArt.lattice.variants[1].src}")`,
          "--brain-small": `url("${factoryArt.specimens.variants[0].src}")`,
          "--brain-large": `url("${factoryArt.specimens.variants[1].src}")`,
        } as CSSProperties}>
          <div className={styles.stillForge}/>
          <div className={styles.stillBrains}>{[0,1,2,3,4,5].map(i=><i key={i} style={{backgroundPosition:`${(i%3)*50}% ${Math.floor(i/3)*100}%`}}/>)}</div>
        </div>
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      </div>
      {controlTarget ? createPortal(controls, controlTarget) : controlTarget === undefined ? controls : null}
    </section>
  );
}
