"use client";
import manifest from "@/lib/assets/generated/stepanoskin.json";
import { assetUrl, parseManifest } from "@/lib/assets/types";
import { readPreference, soundKey } from "./preferences";
let clang: HTMLAudioElement | undefined;
/** Owner-supplied Pixabay clang; created only during an enabled user activation. */
export function playClang() {
  if (typeof window === "undefined" || !readPreference(soundKey)) return;
  clang ??= new Audio(assetUrl(parseManifest(manifest,"stepanoskin"),"click"));
  clang.volume=0.78;
  clang.currentTime=0.18;
  void clang.play().catch(()=>undefined);
}
