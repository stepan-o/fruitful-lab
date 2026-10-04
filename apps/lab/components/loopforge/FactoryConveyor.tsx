"use client";

import { useEffect, useRef, useState, useId, type PointerEvent, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { playClang } from "@/lib/stepanoskin/audio";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";
import { createDrive, restartDrive, stepDrive, type Drive } from "./factory-drive";
import { createFactoryRenderer } from "./factory-renderer";
import { factoryArt } from "./factory-art";
import styles from "./factory-conveyor.module.css";

/** A decorative factory line. It has no connection to simulation state or model calls. */
export default function FactoryConveyor({ controlTarget }: { controlTarget?: HTMLElement | null }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const drive = useRef<Drive>(createDrive());
  const reset = useRef<() => void>(() => {});
  const drag = useRef<{ y: number; pulled: boolean } | null>(null);
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
      playClang();
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

  function pull(event: PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    const travel = Math.max(0, Math.min(56, event.clientY - drag.current.y));
    event.currentTarget.style.setProperty("--pull", `${travel}deg`);
    if (travel >= 27 && !drag.current.pulled) {
      drag.current.pulled = true;
      reset.current();
    }
  }
  function release(event: PointerEvent<HTMLButtonElement>) {
    drag.current = null;
    event.currentTarget.style.removeProperty("--pull");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  const stoppedMotion = reduced || !motion;
  const controls = (
      <div ref={controlsRef} className={styles.controlRail} data-state={status} lang="en">
        <div className={styles.readout}>
          <span className={styles.micro}>LINE 01 · MANUAL OVERRIDE</span>
          <p role="status" aria-live="polite" aria-atomic="true"><i aria-hidden="true"/>{status === "jammed" ? "LINE JAMMED" : status === "restarting" ? "DRIVE ENGAGING" : stoppedMotion || !ready ? "LINE AT REST" : "PRODUCTION IN PROGRESS"}</p>
          <span className={styles.hint} id={hintId}>{status === "jammed" ? "Pull down to restart." : status === "restarting" ? "Taking up the slack. Stand clear." : "If it jams, pull the lever down."}</span>
        </div>
        <div className={styles.station}>
          <button className={styles.motion} onClick={() => setMotion(!motion)} aria-label={motion ? "Pause factory motion" : "Resume factory motion"} aria-pressed={motion} disabled={reduced}>
            <span aria-hidden="true">{stoppedMotion ? "▷" : "Ⅱ"}</span>{reduced ? "REDUCED MOTION" : motion ? "PAUSE" : "RESUME"}
          </button>
          <button className={styles.lever} aria-label="Pull lever to restart conveyor" aria-disabled={status !== "jammed"} aria-describedby={status === "jammed" ? hintId : undefined} onClick={() => reset.current()}
            onPointerDown={(e) => { if (status !== "jammed") return; drag.current={y:e.clientY,pulled:false}; e.currentTarget.setPointerCapture(e.pointerId); }}
            onPointerMove={pull} onPointerUp={release} onPointerCancel={release}>
            <svg viewBox="0 0 92 110" aria-hidden="true">
              <defs><linearGradient id="lf-lever-steel"><stop stopColor="#17291e"/><stop offset=".45" stopColor="#c4ba85"/><stop offset=".62" stopColor="#67714e"/><stop offset="1" stopColor="#182b20"/></linearGradient></defs>
              <path d="M10 38l8-8h56l8 8v63H10z" fill="#15251b" stroke="#8b8253"/>
              <path d="M15 91h62v5H15z" fill="#a7974d"/><path d="M20 91l6 5m7-5l6 5m7-5l6 5m7-5l6 5" stroke="#202f23" strokeWidth="5"/>
              <circle cx="46" cy="73" r="18" fill="#0a160f" stroke="#6e7350" strokeWidth="3"/><circle cx="46" cy="73" r="11" fill="url(#lf-lever-steel)"/>
              <g className={styles.arm}><path d="M41 74l-3-55h16l-3 55z" fill="url(#lf-lever-steel)" stroke="#111d15"/><rect x="25" y="10" width="42" height="22" rx="5" fill="#aa5030" stroke="#df9c61"/>{[32,39,46,53,60].map(x=><path key={x} d={`M${x} 12v18`} stroke="#542b21" strokeWidth="2"/>)}</g>
              {[[19,39],[73,39],[19,83],[73,83]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#9a9568"/>)}
            </svg>
            <span>{status === "jammed" ? "PULL TO RESTART ↓" : "MANUAL RESET"}</span>
          </button>
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
