"use client";

import { useEffect, useRef } from "react";
import { createHearth } from "./hearth-renderer";
import styles from "./visuals.module.css";

/** Two independent fields: slow soot behind fast, emissive flame filaments. */
export default function Hearth({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const end = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !enabled) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: ReturnType<typeof createHearth> = null;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let lost = false;
    let atEnd = false;
    let fire = 0;

    // This marker is the reader's last in-flow element. A fully visible pixel
    // means the reader has reached the actual end, including expanded sources.
    // One pixel of root margin accommodates fractional scrollHeight rounding.
    const observer = typeof IntersectionObserver === "undefined" ? null :
      new IntersectionObserver(([entry]) => {
        atEnd = entry.isIntersecting && entry.intersectionRatio === 1;
        canvas.dataset.fireVisible = String(atEnd);
        if (!atEnd) fire = 0;
      }, { threshold: 1, rootMargin: "0px 0px 1px 0px" });
    if (end.current) observer?.observe(end.current);

    function resize() {
      if (!renderer || !canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      // A decorative strip needs neither a full-screen buffer nor retina density.
      const scale = Math.min(1, 960 / width, 256 / height);
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      renderer.resize(canvas.width, canvas.height);
    }
    function draw(now: number) {
      frame = requestAnimationFrame(draw);
      if (previous && now - previous < 33) return;
      const delta = previous ? Math.min(now - previous, 80) / 1000 : 0;
      elapsed += delta;
      previous = now;
      fire = atEnd ? Math.min(1, fire + delta / .7) : 0;
      renderer?.draw(elapsed, fire);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (motion.matches || document.hidden || lost) {
        renderer?.clear();
        return;
      }
      if (!renderer) {
        renderer = createHearth(canvas!);
        resize();
      }
      if (renderer) frame = requestAnimationFrame(draw);
    }
    function onLost(event: Event) {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      renderer = null;
    }
    function onRestored() {
      lost = false;
      sync();
    }
    sync();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      renderer?.dispose();
    };
  }, [enabled]);
  return enabled ? (
    <>
      <canvas
        ref={ref}
        className={styles.hearth}
        aria-hidden="true"
        data-effects="shadows flames"
        data-fire-visible="false"
      />
      <span ref={end} className={styles.hearthEnd} aria-hidden="true" />
    </>
  ) : null;
}
