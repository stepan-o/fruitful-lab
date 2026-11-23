"use client";

import { readPreference, soundKey } from "@/lib/stepanoskin/preferences";
import { soundUrl } from "./sound-assets";

let stopActive: (() => void) | undefined;

/** One user-activated voice. Let the menu's decay survive client navigation. */
export function playLandingSound(cue: "menu-clang" | "contactor") {
  if (typeof window === "undefined" || document.hidden || !readPreference(soundKey)) return;
  stopActive?.();
  const audio = new Audio(soundUrl(cue));
  audio.volume = cue === "menu-clang" ? 0.48 : 0.66;
  // Source is already cut to its onset; no playback offset or delayed release.
  const stop = () => {
    audio.pause();
    audio.removeEventListener("ended", stop);
    audio.removeEventListener("error", stop);
    document.removeEventListener("visibilitychange", check);
    window.removeEventListener("stepanoskin:preferences", check);
    window.removeEventListener("storage", check);
    if (stopActive === stop) stopActive = undefined;
  };
  const check = () => {
    if (document.hidden || !readPreference(soundKey)) stop();
  };
  stopActive = stop;
  audio.addEventListener("ended", stop);
  audio.addEventListener("error", stop);
  document.addEventListener("visibilitychange", check);
  window.addEventListener("stepanoskin:preferences", check);
  window.addEventListener("storage", check);
  void audio.play().catch(stop);
}
