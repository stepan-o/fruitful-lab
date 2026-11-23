"use client";
import { useSyncExternalStore } from "react";

const changed = "stepanoskin:preferences";
const memory: Record<string,boolean> = {};
export const soundKey = "stepanoskin_sound_v1";
export const motionKey = "stepanoskin_motion_v1";
export function readPreference(key:string) {
  try { return window.localStorage.getItem(key) !== "off"; }
  catch { return memory[key] ?? true; }
}
function subscribe(listener:()=>void) {
  window.addEventListener("storage",listener);
  window.addEventListener(changed,listener);
  return ()=>{window.removeEventListener("storage",listener);window.removeEventListener(changed,listener);};
}
export function writePreference(key:string,enabled:boolean) {
  memory[key]=enabled;
  try { window.localStorage.setItem(key,enabled?"on":"off"); } catch { /* Session preference still works when storage is blocked. */ }
  window.dispatchEvent(new Event(changed));
}
export function usePreference(key:string) {
  const enabled=useSyncExternalStore(subscribe,()=>readPreference(key),()=>true);
  return [enabled,(value:boolean)=>writePreference(key,value)] as const;
}
