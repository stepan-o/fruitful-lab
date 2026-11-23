"use client";
import { useEffect, useRef } from "react";
import styles from "./visuals.module.css";
import Hearth from "./Hearth";

export default function Atmosphere({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      last = 0,
      w = 0,
      h = 0;
    let sparks: {
      x: number;
      y: number;
      r: number;
      speed: number;
      phase: number;
    }[] = [];
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.ceil(w * scale);
      canvas!.height = Math.ceil(h * scale);
      ctx!.setTransform(scale, 0, 0, scale, 0, 0);
      sparks = Array.from({ length: Math.min(64, Math.round(w / 20)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.5 + Math.random() * 1.6,
        speed: 12 + Math.random() * 28,
        phase: Math.random() * 6.28,
      }));
    }
    function draw(time: number) {
      frame = 0;
      if (!enabled || motion.matches || document.hidden) {
        ctx!.clearRect(0, 0, w, h);
        return;
      }
      const elapsed = last ? Math.min((time - last) / 1000, 0.07) : 0;
      if (last && time - last < 32) {
        frame = requestAnimationFrame(draw);
        return;
      }
      last = time;
      const t = time / 1000;
      ctx!.clearRect(0, 0, w, h);
      for (const p of sparks) {
        p.y -= p.speed * elapsed;
        p.x += Math.sin(t * 0.4 + p.phase) * elapsed * 7;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        const a = 0.25 + Math.sin(t + p.phase) * 0.12;
        ctx!.fillStyle = `rgba(247,133,51,${a})`;
        ctx!.beginPath();
        ctx!.ellipse(p.x, p.y, p.r, p.r * 1.8, 0.35, 0, Math.PI * 2);
        ctx!.fill();
        if (p.r > 1.6) {
          ctx!.fillStyle = "rgba(249,87,23,.035)";
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      frame = requestAnimationFrame(draw);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (enabled && !motion.matches && !document.hidden)
        frame = requestAnimationFrame(draw);
      else ctx!.clearRect(0, 0, w, h);
    }
    function onResize() {
      resize();
      sync();
    }
    resize();
    sync();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [enabled]);
  return (
    <>
      <Hearth enabled={enabled} />
      <canvas ref={ref} className={styles.atmosphere} aria-hidden="true" />
    </>
  );
}
