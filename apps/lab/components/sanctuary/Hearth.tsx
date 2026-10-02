"use client";

import { useEffect, useRef } from "react";
import { createHearth } from "./hearth-renderer";
import styles from "./visuals.module.css";

/** Two independent fields: slow soot behind fast, emissive flame filaments. */
export default function Hearth({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !enabled) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: ReturnType<typeof createHearth> = null;
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let lost = false;

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
      elapsed += previous ? Math.min(now - previous, 80) / 1000 : 0;
      previous = now;
      renderer?.draw(elapsed);
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
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      renderer?.dispose();
    };
  }, [enabled]);
  return enabled ? (
    <canvas
      ref={ref}
      className={styles.hearth}
      aria-hidden="true"
      data-effects="shadows flames"
    />
  ) : null;
}
