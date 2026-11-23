"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePreference } from "@/lib/stepanoskin/preferences";
import styles from "./engravings.module.css";

export const profileMotionKey = "production_systems_motion_v1";

/** Geometry stays server-rendered; one observer controls every scene's CSS motion. */
export default function ProfileMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);
  const [motion, setMotion] = usePreference(profileMotionKey);
  useEffect(() => {
    const main = root.current;
    const scenes = Array.from(main?.querySelectorAll<HTMLElement>("[data-engraving]") ?? []);
    if (!scenes.length || typeof IntersectionObserver === "undefined") return;
    main!.dataset.motionReady = "true";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visible = new Set<Element>();
    const sync = () => scenes.forEach(scene => {
      scene.dataset.playing = String(motion && !document.hidden && !preference.matches && visible.has(scene));
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      sync();
    }, { threshold: 0 });
    scenes.forEach(scene => observer.observe(scene));
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    sync();
    return () => {
      main!.dataset.motionReady = "false";
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      scenes.forEach(scene => { scene.dataset.playing = "false"; });
    };
  }, [motion]);
  return <main id="profile" tabIndex={-1} ref={root} data-motion-ready="false">
    <div className={styles.motionBar}><span>Studies in machinery & judgment</span><button type="button" aria-pressed={!motion} onClick={() => setMotion(!motion)}><span aria-hidden="true">{motion ? "Ⅱ" : "▷"}</span>{motion ? "Pause illustrations" : "Play illustrations"}</button></div>
    {children}
  </main>;
}
