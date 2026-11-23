"use client";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { CampaignFloor } from "../../../lib/loopforge/engine/floor-view";
import type { Room } from "../../../lib/loopforge/shifts/contract";
import { loadArt, paint } from "../../../lib/loopforge/shifts/painter";
import { loadSkin, select } from "../../../lib/loopforge/shifts/skin";
import geometry from "../../../lib/loopforge/intro/geometry.json";
import css from "./day-two.module.css";

const loadBank=()=>Promise.all([loadArt(""),loadSkin("/loopforge-design/days-2-4-art/v1/")]);
let bank:ReturnType<typeof loadBank>|undefined;
type Props={room:Room;scene:CampaignFloor["scene"];tick:number;stroke?:number;paused?:boolean;children?:ReactNode};
export default function RoomCamera({room,scene,tick,stroke=0,paused,children}:Props){
  const surface=useRef<HTMLCanvasElement>(null), overlays=useRef<HTMLDivElement>(null);
  const camera=useRef({x:0,y:0,scale:0,last:0});
  const [assets,setAssets]=useState<Awaited<ReturnType<typeof loadBank>>>();
  const [size,setSize]=useState({w:0,h:0}),[error,setError]=useState("");
  useEffect(()=>{
    let active=true;
    bank??=loadBank().catch(e=>{bank=undefined;throw e;});
    bank.then(a=>{if(active)setAssets(a);}).catch(e=>{if(active)setError(String(e));});
    const resize=new ResizeObserver(([entry])=>setSize({w:Math.round(entry.contentRect.width),h:Math.round(entry.contentRect.height)}));
    resize.observe(surface.current!);
    return ()=>{active=false;resize.disconnect();};
  },[]);
  useLayoutEffect(()=>{camera.current.scale=0;},[size,room]);
  useLayoutEffect(()=>{
    const {w,h}=size,c=surface.current,ctx=c?.getContext("2d",{alpha:false});
    if(!c||!ctx||!w||!h||!assets)return;
    const d=Math.min(devicePixelRatio||1,1.5);
    if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d);}
    ctx.setTransform(c.width/w,0,0,c.height/h,0,0);
    const view=select({scene,tick,hash:""},room,"","");
    view.speeches=[];
    const xy=paint(ctx,w,h,scene,room,tick,assets[0],assets[1],view,{stroke,deskCut:false,camera:camera.current,paused,still:matchMedia("(prefers-reduced-motion: reduce)").matches});
    for(const node of Array.from(overlays.current?.querySelectorAll<HTMLElement>("[data-actor],[data-station]")??[])){
      const actor=scene.agents.find(a=>a.id===node.dataset.actor),station=geometry.stations[Number(node.dataset.station)];
      if(!actor&&!station)continue;
      const [x,y]=actor?xy(actor.x/1000,actor.y/1000):xy(station.x,station.y);
      const half=node.offsetWidth/2+4, left=Math.max(half,Math.min(w-half,x));
      const speech=node.dataset.speech==="true";
      const top=speech?Math.max(node.offsetHeight+55,Math.min(h-80,y-camera.current.scale*1.28)):y+(actor?0:camera.current.scale*.13);
      node.style.left=left+"px";node.style.top=top+"px";node.dataset.placed="true";
      node.dataset.side=left>w/2?"left":"right";
      node.style.setProperty("--tail",Math.max(4,Math.min(node.offsetWidth-4,x-left+node.offsetWidth/2))+"px");
    }
  },[size,assets,room,scene,tick,paused,stroke,children]);
  return <div className={css.camera}><canvas ref={surface} aria-label={"Live "+room+" camera"}/><div ref={overlays} className={css.anchors}>{children}</div>{error&&<p role="alert">{error}</p>}</div>;
}
