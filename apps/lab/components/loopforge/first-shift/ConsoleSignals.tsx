"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { PlayerView } from "@/lib/loopforge/first-shift/contract";
import { LIGHTS, receiptLight, shadowPolygon, type Blocker, type LightKind } from "@/lib/loopforge/first-shift/console-light";
import { usePreference } from "@/lib/stepanoskin/preferences";
import AssetImage from "@/components/media/AssetImage";
import { imageAsset, parseManifest } from "@/lib/assets/types";
import manifest from "@/lib/assets/generated/loopforge-console-beacon.json";
import s from "./console-signals.module.css";

type Pulse = { serial: number; kind: LightKind; at: number };
const Signals = createContext<{ pulse: Pulse | null; publish: (view: PlayerView) => void; impulse: (kind: LightKind, preview?: boolean) => void } | null>(null);
export const useConsoleSignals = () => useContext(Signals);
export function ConsoleSignals({ children }: { children: ReactNode }) {
  const previous = useRef<PlayerView | null>(null), latest = useRef<Pulse | null>(null);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const impulse = useCallback((kind: LightKind, preview = false) => {
    if (document.hidden) return;
    const now = performance.now(), old = latest.current;
    if (!preview && old && now-old.at < LIGHTS[old.kind].duration + 1000 && LIGHTS[kind].priority <= LIGHTS[old.kind].priority) return;
    const next = { serial: (old?.serial ?? 0)+1, kind, at: now };
    latest.current=next;setPulse(next);
  }, []);
  const publish = useCallback((view: PlayerView) => {
    const kind = receiptLight(previous.current, view);
    previous.current=view;
    if (kind) impulse(kind);
  }, [impulse]);
  useEffect(() => {
    let lastInput=performance.now(), timer: ReturnType<typeof setTimeout>;
    const check = () => {
      if (performance.now()-lastInput >= 45000) { impulse("idle");lastInput=performance.now()+45000; }
      timer=setTimeout(check,15000);
    };
    const input = () => { lastInput=performance.now(); };
    window.addEventListener("pointerdown",input,{passive:true});window.addEventListener("keydown",input);window.addEventListener("pointermove",input,{passive:true});
    timer=setTimeout(check,15000);
    return () => { clearTimeout(timer);window.removeEventListener("pointerdown",input);window.removeEventListener("keydown",input);window.removeEventListener("pointermove",input); };
  }, [impulse]);
  return <Signals.Provider value={{ pulse, publish, impulse }}>{children}</Signals.Provider>;
}
const beacon = imageAsset(parseManifest(manifest,"loopforge-console-beacon"),"beacon");
const beamTextures = new Map<LightKind, HTMLCanvasElement>();
function beamTexture(kind: LightKind) {
  const previous=beamTextures.get(kind);if (previous) return previous;
  const texture=document.createElement("canvas");texture.width=768;texture.height=384;
  const context=texture.getContext("2d")!;
  const pixels=context.createImageData(texture.width,texture.height);
  const rgb=LIGHTS[kind].rgb.split(",").map(Number);
  for(let y=0;y<texture.height;y++) for(let x=0;x<texture.width;x++) {
    const angle=Math.atan2(y-texture.height/2,Math.max(1,x));
    const core=Math.exp(-.5*(angle/.085)**2), skirt=.14*Math.exp(-.5*(angle/.19)**2);
    const variation=.93+.045*Math.sin(x*.049+y*.07)+.025*Math.sin(x*.113-y*.17);
    const alpha=Math.min(1,core+skirt)*Math.pow(1-x/texture.width,.9)*variation;
    const index=(y*texture.width+x)*4;
    pixels.data[index]=rgb[0];pixels.data[index+1]=rgb[1];pixels.data[index+2]=rgb[2];pixels.data[index+3]=Math.round(255*alpha);
  }
  context.putImageData(pixels,0,0);beamTextures.set(kind,texture);return texture;
}
export function ConsoleBeacon({ active = true }: { active?: boolean }) {
  const signal = useConsoleSignals(), pulse=signal?.pulse;
  const [effects] = usePreference("loopforge-first-shift-effects");
  const mount=useRef<HTMLDivElement>(null), canvas=useRef<HTMLCanvasElement>(null), lens=useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const surface=canvas.current, lamp=mount.current, aperture=lens.current;
    if (!surface || !lamp || !aperture) return;
    const ctx=surface.getContext("2d");
    if (!ctx) return;
    let frame=0;
    const clear = () => { cancelAnimationFrame(frame);ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,surface.width,surface.height);ctx.restore();aperture.style.opacity="0"; };
    if (!active || !pulse || !effects || document.hidden) { clear();return; }
    const light=LIGHTS[pulse.kind], age=performance.now()-pulse.at;
    // A modal/menu opened later never replays a stale impulse.
    if (age >= light.duration) { clear();return; }
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const texture=reduced ? null : beamTexture(pulse.kind);
    const bounds=lamp.getBoundingClientRect(), source={ x:bounds.left+bounds.width*.5,y:bounds.top+bounds.height*.5 };
    const width=window.innerWidth,height=window.innerHeight,scale=Math.min(1,1280/width);
    surface.width=Math.ceil(width*scale);surface.height=Math.ceil(height*scale);
    ctx.scale(scale,scale);
    // Raised corner fittings, measured once per impulse. No per-frame layout reads.
    const blockers: Blocker[]=[];
    const scope=lamp.closest("main,dialog") ?? lamp.parentElement!;
    scope.querySelectorAll<HTMLElement>("[data-light-frame]").forEach(node => {
      const r=node.getBoundingClientRect();
      if (!r.width || r.bottom<0 || r.top>height) return;
      for(const x of [r.left+8,r.right-15]) for(const y of [r.top+8,r.bottom-15]) blockers.push({x,y,width:7,height:7});
    });
    const reach=Math.hypot(width,height)*1.4, shadows=blockers.slice(0,32).map(b=>shadowPolygon(source,b,reach));
    let drawn=0;
    const draw=(now:number) => {
      const progress=(now-pulse.at)/light.duration;
      if (progress>=1 || document.hidden) { clear();return; }
      frame=requestAnimationFrame(draw);
      if (now-drawn<32) return;drawn=now;
      ctx.clearRect(0,0,width,height);
      const envelope=Math.sin(Math.PI*Math.max(0,progress))**1.3;
      aperture.style.background=`conic-gradient(from -15deg,rgba(${light.rgb},1),rgba(${light.rgb},.35) 35deg,transparent 65deg,transparent 330deg,rgba(${light.rgb},1))`;
      aperture.style.opacity=String(envelope*.8);
      aperture.style.transform=`rotate(${reduced ? 0 : progress*360}deg)`;
      if (reduced) return;
      const angle=-Math.PI/2+progress*Math.PI*2;
      // Precomputed optical falloff: no hard fan edges or per-frame pixel loop.
      ctx.save();ctx.translate(source.x,source.y);ctx.rotate(angle);
      ctx.globalAlpha=light.power*envelope;
      ctx.drawImage(texture!,0,-reach/4,reach,reach/2);
      ctx.restore();
      ctx.globalAlpha=1;ctx.globalCompositeOperation="destination-out";
      for(const poly of shadows) { if (!poly.length) continue;ctx.beginPath();ctx.moveTo(poly[0].x,poly[0].y);poly.slice(1).forEach(p=>ctx.lineTo(p.x,p.y));ctx.closePath();ctx.fillStyle="#000";ctx.fill(); }
      ctx.globalCompositeOperation="source-over";
    };
    frame=requestAnimationFrame(draw);
    window.addEventListener("resize",clear);window.addEventListener("scroll",clear,{passive:true});document.addEventListener("visibilitychange",clear);
    return () => { clear();window.removeEventListener("resize",clear);window.removeEventListener("scroll",clear);document.removeEventListener("visibilitychange",clear); };
  }, [active,pulse,effects]);
  if (!signal) return null;
  return <div ref={mount} className={s.beacon} aria-hidden="true">
    <canvas ref={canvas} className={s.beam} />
    <AssetImage asset={beacon} alt="" sizes="70px" className={s.housing} />
    <span ref={lens} className={s.aperture} />
  </div>;
}
