"use client";
import { useEffect, type RefObject } from "react";

function bolt(reverse=false) {
  const x=reverse?91:9, end=reverse?46:54, y=22+Math.random()*20, bottom=56+Math.random()*24;
  return `M ${x} ${y}`+Array.from({length:7},(_,i)=>{const p=(i+1)/7;return ` L ${(x+(end-x)*p+(Math.random()-.5)*7).toFixed(1)} ${(y+(bottom-y)*p+(Math.random()-.5)*11).toFixed(1)}`;}).join("");
}
/** Shared moderated signal tears: five bands, 1.5–4.5 s rests, sub-half-second bursts. */
export function useSignalGlitch(root:RefObject<HTMLElement|null>, burstClass:string, wrapClass:string, enabled=true) {
  useEffect(()=>{
    const element=root.current;
    if(!element||!enabled) return;
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer:number|undefined, end:number|undefined;
    let visible=true;
    function stop(){window.clearTimeout(timer);window.clearTimeout(end);element?.classList.remove(burstClass);element?.parentElement?.classList.remove(wrapClass);}
    function schedule(){if(!motion.matches&&!document.hidden&&visible)timer=window.setTimeout(run,1500+Math.random()*3000);}
    function run(){
      if(!element||motion.matches||document.hidden||!visible)return;
      element.querySelectorAll<HTMLElement|SVGElement>("[data-glitch-band]").forEach((band,i)=>{
        const top=5+Math.random()*77,height=3+Math.random()*10;
        band.style.clipPath=`polygon(0 ${top}%,100% ${top}%,100% ${top+height}%,0 ${top+height}%)`;
        band.style.setProperty("--band-shift",`${(Math.random()>.5?1:-1)*(7+Math.random()*(11+i*2))}px`);
      });
      element.querySelectorAll("[data-bolt]").forEach((path,i)=>path.setAttribute("d",bolt(i===1)));
      element.style.setProperty("--flash-x",`${24+Math.random()*52}%`);
      element.style.setProperty("--flash-y",`${22+Math.random()*48}%`);
      const duration=280+Math.random()*140;
      element.style.setProperty("--burst-duration",`${duration}ms`);
      element.parentElement?.style.setProperty("--burst-duration",`${duration}ms`);
      element.classList.add(burstClass);element.parentElement?.classList.add(wrapClass);
      end=window.setTimeout(()=>{stop();schedule();},duration+100);
    }
    function sync(){stop();schedule();}
    const observer=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}):null;
    observer?.observe(element.parentElement??element);
    motion.addEventListener("change",sync);document.addEventListener("visibilitychange",sync);schedule();
    return ()=>{stop();observer?.disconnect();motion.removeEventListener("change",sync);document.removeEventListener("visibilitychange",sync);};
  },[root,burstClass,wrapClass,enabled]);
}
