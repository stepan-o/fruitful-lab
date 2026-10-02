"use client";
import { useId, useRef } from "react";
import { useSignalGlitch } from "@/components/stepanoskin/useSignalGlitch";
import styles from "./visuals.module.css";

type Point=[number,number];
const face:Point[]=[[220,157],[302,208],[308,300],[278,384],[220,457],[162,384],[132,300],[138,208]];
const horn:Point[]=[[149,227],[109,189],[84,131],[91,80],[129,38],[114,108],[133,151],[178,177]];
const mouth:Point[]=[[173,345],[220,365],[267,345],[250,390],[220,413],[190,390]];
function inside(x:number,y:number,poly:Point[]){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))hit=!hit;}return hit;}
function random(n:number){const v=Math.sin(n*127.1+31.7)*43758.5453;return v-Math.floor(v);}
const tiles=Array.from({length:29},(_,row)=>Array.from({length:22},(_,col)=>{
  const x=col*20,y=row*20,j=(row*22+col)*2;
  return [0,1].map(side=>{
    const points:Point[]=side?[[x+20,y],[x+20,y+20],[x,y+20]]:[[x,y],[x+20,y],[x,y+20]];
    const cx=points.reduce((s,p)=>s+p[0],0)/3,cy=points.reduce((s,p)=>s+p[1],0)/3;
    const head=inside(cx,cy,face),horned=inside(cx,cy,horn)||inside(440-cx,cy,horn),darkMouth=inside(cx,cy,mouth);
    const r=random(j+side),light=10+r*13+(head?Math.max(0,1-Math.abs(cx-220)/120)*10:0);
    const fill=darkMouth?'#130c0a':head?`hsl(${(8+r*18).toFixed(3)} 48% ${(light+5).toFixed(3)}%)`:horned?`hsl(37 28% ${(light+13).toFixed(3)}%)`:`hsl(${(155+r*28).toFixed(3)} 14% ${(4+r*7).toFixed(3)}%)`;
    return {points:points.map(p=>p.join(',')).join(' '),fill,key:j+side};
  });
})).flat(2);

export default function DevilMural({motion=true}:{motion?:boolean}) {
  const id=useId().replace(/:/g,'');const fx=useRef<HTMLDivElement>(null);
  useSignalGlitch(fx,styles.muralBurst,styles.muralGlitch,motion);
  return <div className={styles.mural} data-motion={motion?'on':'off'}>
    <svg className={styles.muralGlass} viewBox="0 0 440 580" role="img" aria-label="Original mosaic devil mural: branching horns, fractured amber glass and glowing eyes">
      <defs>
        <clipPath id={`${id}-arch`}><path d="M28 580V219Q28 79 220 12Q412 79 412 219V580Z"/></clipPath>
        <filter id={`${id}-glow`}><feGaussianBlur stdDeviation="6"/></filter>
        <filter id={`${id}-eye-halo`} x="-100%" y="-150%" width="300%" height="400%"><feGaussianBlur stdDeviation="12"/></filter>
      </defs>
        <g id={`${id}-window`} clipPath={`url(#${id}-arch)`}>
          <rect width="440" height="580" fill="#080b0b"/>
          <g stroke="#070909" strokeWidth="1.1">{tiles.map(t=><polygon key={t.key} points={t.points} fill={t.fill}/>)}</g>
          <g fill="none" stroke="#b49457" strokeOpacity=".27"><circle cx="220" cy="295" r="166"/><circle cx="220" cy="295" r="157"/><path d="M220 25V130M25 296H103M337 296H415M220 475V580M58 512L142 427M382 512L298 427"/></g>
          <path d="M148 243L206 266L178 268ZM292 243L234 266L262 268Z" fill="#1d0b08"/>
          <path d="M220 267L201 320L220 342L239 320Z" fill="#924728" stroke="#28150e" strokeWidth="2"/>
          <path d="M201 320L220 303L239 320L220 334Z" fill="#321810"/>
          <g fill="#cbb288" stroke="#261811" strokeWidth="1.5">{Array.from({length:7},(_,i)=><path key={i} d={`M${182+i*12} ${(359+Math.sin(i/6*Math.PI)*12).toFixed(3)}l10 3l-5 18Z`}/>)}</g>
          <path d="M175 421L220 456L265 421L248 503L220 545L192 503Z" fill="#241814" stroke="#58402c"/>
          <g className={styles.eyeFire}>
            <path className={styles.eyeHalo} d="M155 264L203 274L185 290L165 279Z" fill="#ff5814" filter={`url(#${id}-eye-halo)`}/>
            <path className={styles.eyeHalo} d="M285 264L237 274L255 290L275 279Z" fill="#ff5814" filter={`url(#${id}-eye-halo)`}/>
            <path d="M155 264L203 274L185 290L165 279ZM285 264L237 274L255 290L275 279Z" fill="#f43d0b" filter={`url(#${id}-glow)`}/>
            <g className={styles.eyeCore}>
            <path d="M158 267L200 275L184 285ZM282 267L240 275L256 285Z" fill="#ffb947"/>
            <path d="M166 271L196 276L183 282ZM274 271L244 276L257 282Z" fill="#fff3cd"/>
            </g>
          </g>
        </g>
      <path d="M28 580V219Q28 79 220 12Q412 79 412 219V580M41 580V223Q41 91 220 29Q399 91 399 223V580" fill="none" stroke="#a1834c" strokeWidth="2" strokeOpacity=".55"/>
    </svg>
    <div className={styles.muralFx} ref={fx} aria-hidden="true"><svg viewBox="0 0 440 580">{Array.from({length:5},(_,i)=><use key={i} href={`#${id}-window`} data-glitch-band className={styles.muralBand}/>)}</svg><svg className={styles.bolts} viewBox="0 0 100 100" preserveAspectRatio="none"><path data-bolt/><path data-bolt/></svg></div>
  </div>;
}
