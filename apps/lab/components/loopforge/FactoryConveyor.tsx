"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { playClang } from "@/lib/stepanoskin/audio";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";
import {
  createDrive,
  restartDrive,
  stepDrive,
  type Drive,
} from "./factory-drive";
import { createFactoryRenderer } from "./factory-renderer";
import styles from "./factory-conveyor.module.css";

/** A decorative factory line. It has no connection to simulation state or model calls. */
export default function FactoryConveyor({
  controlTarget,
}: {
  controlTarget?: HTMLElement | null;
}) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drive = useRef<Drive>(createDrive());
  const reset = useRef<() => void>(() => {});
  const drag = useRef<{ y: number; pulled: boolean } | null>(null);
  const [status, setStatus] = useState<Drive["status"]>("running");
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [motion, setMotion] = usePreference(motionKey);

  const wantsMotion = useRef(motion);
  const syncMotion = useRef<() => void>(() => {});
  useEffect(() => {
    wantsMotion.current = motion;
    syncMotion.current();
  }, [motion]);

  useEffect(() => {
    const element = root.current,
      target = canvas.current;
    if (!element || !target) return;
    const renderer = createFactoryRenderer(target);
    if (!renderer) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      last = 0,
      visible = false,
      active = false,
      prepared = false,
      contextAvailable = true,
      mounted = true;
    function drawStill() {
      renderer!.draw(drive.current, true);
    }
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
      cancelAnimationFrame(frame);
      last = 0;
      active =
        prepared &&
        contextAvailable &&
        wantsMotion.current &&
        !media.matches &&
        visible &&
        !document.hidden;
      element!.dataset.animating = String(active);
      if (active) frame = requestAnimationFrame(tick);
      else if (prepared && contextAvailable) drawStill();
    }
    syncMotion.current = sync;
    function resize() {
      const box = target!.getBoundingClientRect();
      if (!box.width || !box.height) return;
      renderer!.resize(box.width, box.height);
      if (prepared && contextAvailable) renderer!.draw(drive.current, !active);
    }
    reset.current = () => {
      if (!restartDrive(drive.current)) return;
      if (!active) {
        drive.current.status = "running";
        drive.current.stateAge = 0;
      }
      setStatus(drive.current.status);
      renderer.draw(drive.current, !active);
      playClang();
    };
    const mediaChanged = () => {
      setReduced(media.matches);
      sync();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        setReduced(media.matches);
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 },
    );
    observer.observe(target);
    const sizing = new ResizeObserver(resize);
    sizing.observe(target);
    media.addEventListener("change", mediaChanged);
    document.addEventListener("visibilitychange", sync);
    function contextLost(event: Event) {
      event.preventDefault();
      contextAvailable = false;
      element!.dataset.animating = "false";
      active = false;
      cancelAnimationFrame(frame);
      setReady(false);
    }
    function contextRestored() {
      contextAvailable = true;
      resize();
      setReady(true);
      sync();
    }
    target.addEventListener("webglcontextlost", contextLost);
    target.addEventListener("webglcontextrestored", contextRestored);
    resize();
    const preparedScene = () => {
      if (!mounted) return;
      prepared = true;
      setReady(contextAvailable);
      sync();
    };
    if (renderer.prepare)
      renderer
        .prepare()
        .then(preparedScene)
        .catch(() => {
          if (mounted) setReady(false);
        });
    else preparedScene();
    return () => {
      mounted = false;
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizing.disconnect();
      media.removeEventListener("change", mediaChanged);
      document.removeEventListener("visibilitychange", sync);
      reset.current = () => {};
      syncMotion.current = () => {};
      target.removeEventListener("webglcontextlost", contextLost);
      target.removeEventListener("webglcontextrestored", contextRestored);
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
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  const stoppedMotion = reduced || !motion;
  const controls = (
    <div className={styles.controlRail} data-state={status}>
      <div className={styles.readout}>
        <span className={styles.micro}>LOOPFORGE / NEURAL FABRICATION</span>
        <p role="status" aria-live="polite" aria-atomic="true">
          <i aria-hidden="true" />
          {status === "jammed"
            ? "LINE JAMMED"
            : status === "restarting"
              ? "DRIVE ENGAGING"
              : stoppedMotion || !ready
                ? "LINE AT REST"
                : "PRODUCTION IN PROGRESS"}
        </p>
        <span id="lf-reset-hint" className={styles.hint}>
          {status === "jammed"
            ? "Pull the lever. Someone has to keep this place running."
            : status === "restarting"
              ? "Taking up the slack. Stand clear."
              : "*Continuity not guaranteed. Neither is consciousness."}
        </span>
      </div>
      <div className={styles.station}>
        <button
          className={styles.motion}
          onClick={() => setMotion(!motion)}
          aria-label={motion ? "Pause factory motion" : "Resume factory motion"}
          aria-pressed={motion}
          disabled={reduced}
        >
          <span aria-hidden="true">{stoppedMotion ? "▷" : "Ⅱ"}</span>
          {reduced ? "REDUCED MOTION" : motion ? "PAUSE" : "RESUME"}
        </button>
        <button
          className={styles.lever}
          aria-label="Pull lever to restart conveyor"
          aria-disabled={status !== "jammed"}
          onClick={() => reset.current()}
          onPointerDown={(e) => {
            if (status !== "jammed") return;
            drag.current = { y: e.clientY, pulled: false };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          aria-describedby={status === "jammed" ? "lf-reset-hint" : undefined}
          onPointerMove={pull}
          onPointerUp={release}
          onPointerCancel={release}
        >
          <svg viewBox="0 0 92 110" aria-hidden="true">
            <defs>
              <linearGradient id="lf-lever-steel">
                <stop stopColor="#17291e" />
                <stop offset=".45" stopColor="#c4ba85" />
                <stop offset=".62" stopColor="#67714e" />
                <stop offset="1" stopColor="#182b20" />
              </linearGradient>
            </defs>
            <path
              d="M10 38l8-8h56l8 8v63H10z"
              fill="#15251b"
              stroke="#8b8253"
            />
            <path d="M15 91h62v5H15z" fill="#a7974d" />
            <path
              d="M20 91l6 5m7-5l6 5m7-5l6 5m7-5l6 5"
              stroke="#202f23"
              strokeWidth="5"
            />
            <circle
              cx="46"
              cy="73"
              r="18"
              fill="#0a160f"
              stroke="#6e7350"
              strokeWidth="3"
            />
            <circle cx="46" cy="73" r="11" fill="url(#lf-lever-steel)" />
            <g className={styles.arm}>
              <path
                d="M41 74l-3-55h16l-3 55z"
                fill="url(#lf-lever-steel)"
                stroke="#111d15"
              />
              <rect
                x="25"
                y="10"
                width="42"
                height="22"
                rx="5"
                fill="#aa5030"
                stroke="#df9c61"
              />
              {[32, 39, 46, 53, 60].map((x) => (
                <path
                  key={x}
                  d={`M${x} 12v18`}
                  stroke="#542b21"
                  strokeWidth="2"
                />
              ))}
            </g>
            {[
              [19, 39],
              [73, 39],
              [19, 83],
              [73, 83],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#9a9568" />
            ))}
          </svg>
          <span>
            {status === "jammed" ? "PULL TO RESTART ↓" : "MANUAL RESET"}
          </span>
        </button>
      </div>
    </div>
  );
  return (
    <section
      ref={root}
      className={styles.factory}
      data-state={status}
      data-ready={ready}
      data-animating="false"
      lang="en"
      aria-label="Loopforge cortex assembly line"
    >
      <div className={styles.identifier} aria-hidden="true">
        <span>CORTEX ASSEMBLY</span>
        <span>LINE 01 / CONTINUOUS IMPROVEMENT*</span>
      </div>
      <div className={styles.scene}>
        <svg
          className={styles.fallback}
          viewBox="0 0 1200 340"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="lf-still-metal" x2="0" y2="1">
              <stop stopColor="#8b8460" />
              <stop offset=".3" stopColor="#243b2d" />
              <stop offset="1" stopColor="#0d1914" />
            </linearGradient>
          </defs>
          <path
            d="M0 177H1200V249H0z"
            fill="url(#lf-still-metal)"
            stroke="#706a45"
          />
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`translate(${i * 180 - 35} 174)`}>
              <path
                d="M-68 0l14-12H57L70 0v13H-68z"
                fill="#465140"
                stroke="#a09467"
              />
              <path
                d="M-48-14C-75-42-40-78-18-76C5-103 50-80 55-62C82-39 56-9 34-11C8 0-25-2-48-14Z"
                fill="#a57a4d"
                stroke="#493c25"
                strokeWidth="4"
              />
              <path
                d="M0-77C-16-58 15-47-2-25M-33-63q-22 15 3 23t-4 20M23-64q23 5 10 21t10 17"
                fill="none"
                stroke="#4b3e2b"
                strokeWidth="5"
              />
              <path
                d="M-21-72C-58-67-60-24-29-11M11-73C-10-48 45-48 35-16M-35-37C-7-35-7-3 27-9"
                fill="none"
                stroke="#1b5048"
                strokeWidth="5"
              />
              <path
                d="M-21-72C-58-67-60-24-29-11M11-73C-10-48 45-48 35-16M-35-37C-7-35-7-3 27-9"
                fill="none"
                stroke="#5bc9bd"
                strokeWidth="2"
              />
            </g>
          ))}
          {Array.from({ length: 15 }, (_, i) => (
            <circle
              key={i}
              cx={i * 86}
              cy="264"
              r="23"
              fill="#15271e"
              stroke="#797955"
              strokeWidth="4"
            />
          ))}
          <path d="M584 317v-22a16 16 0 0132 0v22z" fill="#b78433" />
          <path d="M577 317h46v12h-46z" fill="#6b674b" />
        </svg>
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      </div>
      {controlTarget ? createPortal(controls, controlTarget) : controls}
    </section>
  );
}
