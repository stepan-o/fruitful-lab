"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PlayerView, RoomId } from "@/lib/loopforge/first-shift/contract";
import { LIGHTS, shadowPolygon } from "@/lib/loopforge/first-shift/console-light";
import { producerPlate, producerMobilePlate, PRODUCER_GEOMETRY, PRODUCER_MOBILE, type PlateRect } from "@/lib/loopforge/first-shift/producer-art";
import type { ProducerSkinId } from "@/lib/loopforge/first-shift/themes";
import { consoleLayout, type ConsoleLayout } from "@/lib/loopforge/first-shift/console-layout";
import { Art, ROOMS, Tape, name, time, type Media } from "./ConsoleParts";
import { feedbackFor, type FeedbackId } from "@/lib/loopforge/first-shift/feedback";
import { StatusToken, SupervisorSignal } from "./StatusFeedback";
import { useConsoleSignals } from "./ConsoleSignals";
import s from "./producer-console.module.css";

const rectStyle = ([x,y,w,h]:PlateRect):CSSProperties => ({left:`${x}%`,top:`${y}%`,width:`${w}%`,height:`${h}%`});

/** A calibrated piece of the same plate, with no separately generated perspective. */
function Hardware({ rect }: {rect:PlateRect}) {
  const [x,y,w,h]=rect;
  return <span className={s.hardware} aria-hidden="true"><span style={{width:`${10000/w}%`,height:`${10000/h}%`,left:`${-100*x/w}%`,top:`${-100*y/h}%`}} /></span>;
}

/** Local optical pass. Source, aperture and obstacle rays share plate coordinates. */
function ProducerLight({ skin, active, effects }: {skin:ProducerSkinId;active:boolean;effects:boolean}) {
  const {pulse}=useConsoleSignals() ?? {pulse:null};
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const surface=canvas.current, ctx=surface?.getContext("2d");
    if(!surface || !ctx) return;
    let frame=0;
    const clear=()=>{cancelAnimationFrame(frame);ctx.clearRect(0,0,surface.width,surface.height);};
    if(!pulse || !active || !effects || document.hidden){clear();return;}
    const signal=LIGHTS[pulse.kind], age=performance.now()-pulse.at;
    if(age>=signal.duration){clear();return;}
    const bounds=surface.getBoundingClientRect(), scale=Math.min(1,1280/bounds.width);
    surface.width=Math.ceil(bounds.width*scale);surface.height=Math.ceil(bounds.height*scale);
    const w=surface.width,h=surface.height, mobile=window.matchMedia("(max-width:700px), (max-height:510px)").matches;
    const g=PRODUCER_GEOMETRY[skin], source={x:w*(mobile ? .9 : g.light[0]/100),y:h*(mobile ? .047 : g.light[1]/100)};
    const lens=mobile?12:g.lens*w/100, reach=Math.min(w*.29,h*.55);
    // Raised collar screws use the same source and local stage coordinate system.
    const bolts=[{x:source.x-lens*2,y:source.y+lens*1.1,width:4,height:4},{x:source.x+lens*1.8,y:source.y+lens*.9,width:4,height:4}];
    const shadows=bolts.map(b=>shadowPolygon(source,b,reach));
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let drawn=0;
    const draw=(now:number)=>{
      const p=(now-pulse.at)/signal.duration;
      if(p>=1||document.hidden){clear();return;}
      frame=requestAnimationFrame(draw);if(now-drawn<32)return;drawn=now;
      ctx.clearRect(0,0,w,h);
      const envelope=Math.sin(Math.PI*Math.max(0,p))**1.1;
      const angle=reduced?Math.PI/2:p*Math.PI*2;
      if(!reduced){
        ctx.save();ctx.translate(source.x,source.y);ctx.rotate(angle);
        const beam=ctx.createLinearGradient(0,0,reach,0);beam.addColorStop(0,`rgba(${signal.rgb},${.64*envelope})`);beam.addColorStop(.3,`rgba(${signal.rgb},${.2*envelope})`);beam.addColorStop(1,`rgba(${signal.rgb},0)`);
        ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(reach,-reach*.14);ctx.quadraticCurveTo(reach*1.05,0,reach,reach*.14);ctx.closePath();ctx.fill();ctx.restore();
        ctx.globalCompositeOperation="destination-out";
        for(const poly of shadows){if(!poly.length)continue;ctx.beginPath();ctx.moveTo(poly[0].x,poly[0].y);poly.slice(1).forEach(point=>ctx.lineTo(point.x,point.y));ctx.closePath();ctx.fill();}
        ctx.globalCompositeOperation="source-over";
      }
      const glow=ctx.createRadialGradient(source.x,source.y,0,source.x,source.y,lens*3.5);
      glow.addColorStop(0,`rgba(255,244,211,${envelope})`);glow.addColorStop(.16,`rgba(${signal.rgb},${.95*envelope})`);glow.addColorStop(.44,`rgba(${signal.rgb},${.24*envelope})`);glow.addColorStop(1,`rgba(${signal.rgb},0)`);
      ctx.fillStyle=glow;ctx.fillRect(source.x-lens*4,source.y-lens*4,lens*8,lens*8);
      ctx.save();ctx.translate(source.x,source.y);ctx.rotate(angle);ctx.fillStyle=`rgba(255,250,227,${envelope*.95})`;ctx.fillRect(lens*.2,-lens*.12,lens*.7,lens*.24);ctx.restore();
    };
    frame=requestAnimationFrame(draw);
    document.addEventListener("visibilitychange",clear);window.addEventListener("resize",clear);
    return()=>{clear();document.removeEventListener("visibilitychange",clear);window.removeEventListener("resize",clear);};
  },[pulse,skin,active,effects]);
  return <canvas ref={canvas} className={s.localLight} aria-hidden="true" />;
}

export default function ProducerConsole({media,view,skin,incoming,busy,effects,active,ticking,
  onLeadership,onAdviser,onPrimary,onRoom,onInspect,onFeedback,onNavigate,onSpeed,speed,primaryLabel,
}:{media:Media;view:PlayerView;skin:ProducerSkinId;incoming:boolean;busy:boolean;effects:boolean;active:boolean;ticking:boolean;
  onLeadership:()=>void;onAdviser:()=>void;onPrimary:()=>void;onRoom:(id:RoomId)=>void;onInspect:(id:string)=>void;
  onFeedback:(id:FeedbackId)=>void;
  onNavigate:(id:"development"|"records")=>void;onSpeed:()=>void;speed:number;primaryLabel:string;}) {
  const [selected,setSelected]=useState<string>("conveyor");
  const [layout,setLayout]=useState<ConsoleLayout>("wall");
  const surface=useRef<HTMLElement>(null);
  useEffect(()=>{
    const element=surface.current;
    if(!element)return;
    const measure=()=>{const rect=element.getBoundingClientRect();if(rect.width&&rect.height)setLayout(consoleLayout(rect.width,rect.height));};
    measure();
    if(typeof ResizeObserver==='undefined'){window.addEventListener('resize',measure);return()=>window.removeEventListener('resize',measure);}
    const observer=new ResizeObserver(measure);observer.observe(element);
    return()=>observer.disconnect();
  },[]);
  const single=layout==='channel'||layout==='compact';
  const g=PRODUCER_GEOMETRY[skin], mobile=PRODUCER_MOBILE[skin], adapted=layout!=='wall';
  const src=(adapted?producerMobilePlate(skin):producerPlate(skin)).variants.at(-1)!.src;
  const signals=useConsoleSignals(), impulse=signals?.impulse;
  useEffect(()=>{
    if(!incoming||!active||!effects)return;
    impulse?.("attention");
    const interval=setInterval(()=>impulse?.("attention"),8000);
    return()=>clearInterval(interval);
  },[incoming,active,effects,impulse]);
  const cameras=skin==="dispatch-office"&&layout==='wall'?[ROOMS.find(r=>r.id===selected)!,...ROOMS.filter(r=>r.id!==selected)]:ROOMS;
  const primaryHeld=incoming||view.phase==="choose"||view.phase==="briefing"||busy;
  return <section ref={surface} className={s.producer} data-layout={layout} data-skin={skin} data-incoming={incoming} data-effects={effects} data-active={active} aria-label="Producer console">
    <div className={s.stage} style={{"--plate":`url("${src}")`} as CSSProperties}>
      <div className={s.plate} aria-hidden="true" />
      <div className={s.mobileBeacon} aria-hidden="true"><Hardware rect={[mobile.light[0]-6,mobile.light[1]-4,12,8]} /></div>
      <div className={s.cameras} aria-label="Six factory cameras">
        {adapted&&<div className={s.mobileGlass} aria-hidden="true"><Hardware rect={single?[mobile.glass[0],mobile.glass[1],mobile.glass[2]/2,mobile.glass[3]/3]:mobile.glass}/></div>}
        {cameras.map((room,i)=>{
          const powered=room.id==="conveyor"||room.id==="security";
          const operator=powered?view.assignments?.[room.id as RoomId]:undefined;
          const incident=view.pending?.room===room.id;
          const signal=powered?feedbackFor(view,`room:${room.id as RoomId}`):null;
          const content=<><div className={s.feedGlass}>
            {powered&&<Art media={media} id={room.art} sizes={skin==="dispatch-office"&&i===0?"65vw":"(max-width:700px) 44vw, 32vw"} priority={i<2} />}
            <span className={s.reflection}/>
            {powered&&<><span className={s.scan}/><span className={s.rec}><i/>{ticking?"REC":"LIVE"} · 0{ROOMS.indexOf(room)+1}</span>{!operator&&<span className={s.operator}>No supervisor assigned</span>}</>}
          </div><Tape className={`${s.cameraTape} ${!powered&&(skin==='foundry-desk'||skin==='obedience-organ')?s.nativeTape:''}`}>{room.title}</Tape></>;
          const position={...rectStyle(g.panes[i]),...Object.fromEntries(["x","y","w","h"].map((key,index)=>[`--feed-${key}`,`${mobile.panes[ROOMS.indexOf(room)][index]}%`]))} as CSSProperties;
          return powered?<div key={room.id} className={s.camera} style={position} data-selected={room.id===selected} data-live data-incident={incident}>
            <button className={s.openCamera} data-selected={room.id===selected} disabled={incoming} onClick={()=>{
              if(skin==="dispatch-office"&&layout==='wall'&&i!==0)setSelected(room.id);else onRoom(room.id as RoomId);
            }} aria-label={`Inspect ${room.title}`}>{content}</button>
            {!incoming&&signal&&<div className={s.cameraStatus}><StatusToken signal={signal} compact onOpen={onFeedback}/></div>}
            {!incoming&&operator&&<div className={s.cameraVoice}><SupervisorSignal media={media} view={view} person={operator} compact onOpen={onFeedback}/></div>}
          </div>:<div key={room.id} className={s.camera} style={position} data-selected={room.id===selected} role="img" aria-label={`${room.title} — unpowered camera`}>{content}</div>;
        })}
      </div>
      {single&&<nav className={s.channels} aria-label="Camera channels">{ROOMS.map((room,i)=><button key={room.id} disabled={incoming} aria-pressed={selected===room.id} data-pending={view.pending?.room===room.id} onClick={()=>setSelected(room.id)}><small>0{i+1}{i>1?' · OFF':''}</small><span>{room.title}</span></button>)}</nav>}
      <div className={s.instruments} style={rectStyle(g.facts)} aria-label="Factory facts">
        {[['funds','Funds',`¤ ${view.cash}`],['workers','Workers',String(view.workers)],['condition','Line',`${view.condition}%`],['quota','Week 01',`${view.committed} / ${view.quota}`]].map(([id,label,value])=><button key={id} disabled={incoming} onClick={()=>onInspect(id)} aria-label={id==='quota'?`Weekly quota: ${view.committed} / ${view.quota}. Inspect`:`${label}: ${value}. Inspect`}><small>{label}</small><b>{value}</b></button>)}
      </div>
      <button className={`${s.machineControl} ${s.receiver}`} style={rectStyle(g.receiver)} data-attention={incoming} disabled={busy} onClick={onLeadership} aria-label={incoming?"Answer leadership":"Leadership call"}>
        <Hardware rect={adapted?mobile.receiver:g.receiver}/><span className={s.callGlint} aria-hidden="true"/><span className={s.controlLabel}><small>{incoming?"INCOMING / LEADERSHIP":"WEEKLY MANDATE"}</small><b>{incoming?"Answer leadership":"Leadership call"}</b></span>
      </button>
      <button className={`${s.machineControl} ${s.selector}`} style={rectStyle(g.selector)} disabled={incoming||busy} data-attention={!incoming&&view.phase==='choose'} onClick={onAdviser} aria-label={view.adviser?`${name(view.adviser)} adviser channel`:"Choose adviser"}>
        <Hardware rect={adapted?mobile.selector:g.selector}/><span className={s.controlLabel}><small>{incoming?"CHANNELS HELD":"INTERNAL / 5 CHANNELS"}</small><b>{view.adviser?`${name(view.adviser)} · adviser`:"Choose adviser"}</b></span>
      </button>
      <button className={`${s.machineControl} ${s.production}`} style={rectStyle(g.lever)} disabled={primaryHeld} data-attention={view.phase==='ready'||view.phase==='decision'||view.phase==='allocation'} onClick={onPrimary} aria-label={primaryLabel}>
        <Hardware rect={adapted?mobile.lever:g.lever}/><span className={s.controlLabel}><small>{primaryHeld?"PRODUCTION HELD":`${view.produced} COMPLETED`}</small><b>{primaryLabel}</b></span>
      </button>
      <ProducerLight skin={skin} effects={effects} active={active}/>
    </div>
    <footer className={s.bottomRail}><span>{time(view.shiftTick)} <small>{incoming?"INCOMING CALL":ticking?"LINE RUNNING":view.phase==='decision'?"DECISION PENDING":"LINE HELD"}</small></span>
      <nav aria-label="Director console"><button disabled={incoming} onClick={()=>onNavigate("development")}>Development</button><button disabled={incoming} onClick={()=>onNavigate("records")}>Records</button>{view.phase==='running'&&<button onClick={onSpeed} aria-label={`Playback speed ${speed} times`}>{speed}×</button>}</nav>
    </footer>
  </section>;
}
