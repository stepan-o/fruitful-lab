import { useEffect, useRef } from "react";
import { motionKey, usePreference } from "@/lib/stepanoskin/preferences";

/** CSS owns the frames. React only gates motion when visibility/preferences change. */
export function useLivingPlate<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [motion] = usePreference(motionKey);
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => { element.dataset.playing = String(visible && motion && !document.hidden && !media.matches); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .01 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
      element.dataset.playing = "false";
    };
  }, [motion]);
  return ref;
}
