"use client";
import { useEffect, useRef, useState } from "react";
import type { Frame } from "../../../lib/loopforge/engine/wire";
import type { Frame as Drawing } from "../../../lib/loopforge/intro/protocol";
import { paint, type Camera, type Bank } from "./paint";
import { loadIntroArt } from "./sprite-bank";
import styles from "./intro.module.css";

export default function CampaignIntro({
  frame,
  paused,
  intent,
}: {
  frame: Frame;
  paused: boolean;
  intent: (i: object) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    latest = useRef(frame),
    prior = useRef(frame),
    cam = useRef<Camera>({ x: 0, y: 0, scale: 0, time: -1 });
  const [ready, setReady] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    prior.current = latest.current;
    latest.current = frame;
  }, [frame]);
  useEffect(() => {
    let live = true,
      raf = 0,
      bank: Bank | undefined,
      last = 0,
      lastTick = -1,
      arrived = 0,
      wasResized = true;
    const c = canvas.current!,
      ctx = c.getContext("2d", { alpha: false });
    if (!ctx) {
      setError("Canvas unavailable");
      return;
    }
    const resize = new ResizeObserver(() => {
      wasResized = true;
    });
    resize.observe(c);
    function draw(now: number) {
      if (!live || !ctx) return;
      const f = latest.current;
      if (lastTick !== f.tick) {
        arrived = now;
        lastTick = f.tick;
      }
      if (bank && (wasResized || now - arrived < 180)) {
        const w = c.clientWidth,
          h = c.clientHeight;
        if (w && h) {
          if (wasResized) {
            const d = Math.min(devicePixelRatio, 1.5);
            c.width = Math.round(w * d);
            c.height = Math.round(h * d);
            wasResized = false;
          }
          ctx.setTransform(c.width / w, 0, 0, c.height / h, 0, 0);
          const drawing = (v: Frame): Drawing => ({
            ...v,
            tick: v.state.world.clock_tick,
          });
          const adjacent = prior.current.tick + 1 === f.tick;
          paint(
            ctx,
            w,
            h,
            drawing(f),
            f.state.world.edited_ms / 1000,
            bank,
            "sprites",
            cam.current,
            Math.min(0.12, (now - last) / 1000),
            adjacent ? drawing(prior.current) : undefined,
            Math.min(1, (now - arrived) / 50),
            true,
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            f.state.world.order ? f.state.world.confirmed : null,
          );
        }
      }
      last = now;
      raf = requestAnimationFrame(draw);
    }
    void loadIntroArt()
      .then((art) => {
        if (live) {
          bank = art;
          setReady(true);
          raf = requestAnimationFrame(draw);
        }
      })
      .catch((e) => {
        if (live) setError(String(e));
      });
    return () => {
      live = false;
      resize.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
  const w = frame.state.world,
    order = w.order,
    confirm = () => {
      if (order && !paused)
        intent({ action: "confirm", target: order.station });
    };
  return (
    <main className={styles.page} data-story="true">
      <header>
        <span>LOOPFORGE</span>
      </header>
      <section className={styles.console} aria-label="Day One live player">
        <div className={styles.title}>
          <div>
            <small>FACTORY FLOOR</small>
            <h1>Day One</h1>
          </div>
          <p>Rack {w.outputs}</p>
        </div>
        <canvas
          ref={canvas}
          className={styles.surface}
          aria-label="Live factory floor with character names and speech bubbles"
          onPointerUp={(e) => {
            const target = cam.current.station,
              r = e.currentTarget.getBoundingClientRect();
            if (
              target &&
              Math.hypot(
                e.clientX - r.left - target[0],
                e.clientY - r.top - target[1],
              ) <= 32
            )
              confirm();
          }}
        />
        <span className={styles.sr} aria-live="polite">
          {frame.state.events.map((e) => e.speaker + " · " + e.text).join("\n")}
        </span>
        {error && <p role="alert">{error}</p>}
        {order && (
          <div className={styles.order} key={w.confirmed}>
            <small>
              STILETTO · CORTEX {w.confirmed < 4 ? 1 : 2} / 2 · CLOCK HELD
            </small>
            <button autoFocus disabled={paused} onClick={confirm}>
              <b>{order.station}</b> · {order.text}
            </button>
          </div>
        )}
        <div className={styles.controls}>
          <button disabled={!ready} onClick={() => intent({ action: "skip" })}>
            Skip to Day 2
          </button>
        </div>
      </section>
    </main>
  );
}
