"use client";
import {useId,useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import s from "./composition.module.css";
function Actor({x,y,wide=false,lit=false,outline=false,active=false,touching=false}:{x:number;y:number;wide?:boolean;lit?:boolean;outline?:boolean;active?:boolean;touching?:boolean}){
 return <g transform={`translate(${x} ${y})`} className={s.actor} style={{color:outline?"#111f25":lit?wide?"#cc9b62":"#79a7a0":"#566863"}}>
 <ellipse cy="7" rx={wide?31:22} ry="8" fill="#122f35" opacity=".45"/>
 <g fill="currentColor" stroke={lit&&!outline?"#f2d99b":"none"} strokeWidth="2"><path d={wide?"M-29-68L-24-18H26L32-67 16-81H-13Z":"M-17-67L-13-18H16L21-66 10-78H-8Z"}/><path d="M-13-20L-18 5H-4L3-18M9-19L12 5H27L22-22"/><circle cy="-94" r={wide?18:13}/>{wide?<path d="M-21-98l5-17h27l13 16Z"/>:<path d="M-16-95l5-20h19l11 21Z"/>}<path d={wide?"M23-63l8 28-10 6-9-28Z":"M-14-62l-8 24 10 5 10-29Z"}/><path className={active&&!touching?(wide?s.directing:s.gesture):undefined} d={wide?(active?"M-27-64l-19 10-25-10-4 10 31 13 24-13Z":"M-27-64l-6 31 11 3 8-28Z"):touching?"M17-64l20 3 21-11 3 10-23 13-25-5Z":active?"M17-64l15 14 21-11 5 10-26 16-23-19Z":"M17-64l8 29-10 3-9-30Z"}/></g>
 {!outline&&<><path d={wide?"M20-74l12 8-6 46-11-5Z":"M10-75l11 9-5 46-8-5Z"} fill="#173e46" opacity=".3"/><path d="M-10-67h24v25h-24Z" fill={lit?"#c9cba5":"#65766a"}/><path d="M-8-58h18M-8-51H5" stroke="#4c7770" strokeWidth="2"/><circle cx="7" cy="-94" r="2" fill="#203b3d"/></>}
 </g>;
}
export default function CompositionStage(){
 const ref=useLivingPlate<HTMLDivElement>();
 const [close,setClose]=useState(false),[lit,setLit]=useState(false),[rail,setRail]=useState(false),[speech,setSpeech]=useState(true),[outline,setOutline]=useState(false),[phase,setPhase]=useState(0);
 return <div ref={ref} className={s.study} data-playing="false">
 <div className={s.controls}><div role="group" aria-label="Framing"><button type="button" aria-pressed={!close} onClick={()=>setClose(false)}>Whole room</button><button type="button" aria-pressed={close} onClick={()=>setClose(true)}>The exchange</button></div><label><input type="checkbox" checked={lit} onChange={e=>setLit(e.target.checked)}/> Separate figures from the room</label><label><input type="checkbox" checked={outline} onChange={e=>setOutline(e.target.checked)}/> Silhouettes only</label></div>
 <div className={s.beats} role="group" aria-label="Inspect a turn">{["Instruction","Reply","At the control"].map((label,i)=><button type="button" key={label} aria-pressed={phase===i} onClick={()=>setPhase(i)}>{label}</button>)}</div>
 <div className={s.frame}>
 <StagePicture close={close} lit={lit} rail={rail} speech={speech} outline={outline} phase={phase}/>
 </div>
 <div className={s.readingRail} data-visible={speech&&rail} aria-live="polite">{speech&&rail?<><span>{phase===0?"SUPERVISOR → OPERATOR":"OPERATOR → SUPERVISOR"}</span><p>{phase===0?"Use the brass control. I’ll watch the workpiece.":phase===1?"I can reach it from here.":"Ready."}</p></>:<span>{speech?"The words occupy the picture above.":"Speech is hidden. The picture keeps the same dimensions."}</span>}</div>
 <div className={s.bottom}><div role="group" aria-label="Place the words"><button type="button" aria-pressed={!rail} onClick={()=>setRail(false)}>Inside the picture</button><button type="button" aria-pressed={rail} onClick={()=>setRail(true)}>Separate reading rail</button></div><label><input type="checkbox" checked={speech} onChange={e=>setSpeech(e.target.checked)}/> Show the line</label></div>
 <p className={s.note}>{close?"The exchange fills the frame; the entrance and some machinery are now outside it.":"The wide shot preserves geography, at the cost of smaller people and gestures."} {rail?"The words now have their own reserved area.":"A spatial cue ties words to a person, while competing with that person’s body."}</p>
 </div>;
}

export function StagePicture({close,lit,rail,speech,outline,phase=0,label}:{close:boolean;lit:boolean;rail:boolean;speech:boolean;outline:boolean;phase?:number;label?:string}){
 const uid=useId().replace(/:/g,"");
 return ( <svg viewBox="0 0 800 450" role="img" aria-label={label??`Authored workshop scene. ${close?"Close framing of two workers and a control":"Wide framing includes the entrance and rear machinery"}. ${speech&&!rail?"The speech card overlaps the speaker’s upper body":"Both workers are unobstructed"}.`}>
 <defs><clipPath id={`${uid}-ground`}><path d="M0 290H800V450H0Z"/></clipPath><linearGradient id={`${uid}-wall`} x2="0" y2="1"><stop stopColor="#24454a"/><stop offset="1" stopColor="#527269"/></linearGradient><radialGradient id={`${uid}-pool`}><stop stopColor="#f5d696" stopOpacity=".35"/><stop offset="1" stopColor="#f5d696" stopOpacity="0"/></radialGradient><pattern id={`${uid}-floor`} width="65" height="45" patternUnits="userSpaceOnUse"><path d="M65 0H0V45" fill="none" stroke="#82947b" strokeOpacity=".22"/></pattern></defs>
 <rect width="800" height="450" fill="#15343c"/>
 <g className={s.camera} style={{transform:close?"translate(-172px,-111px) scale(1.52)":"translate(0px,0px) scale(1)"}}>
 <path d="M0 0H800V290L0 330Z" fill={`url(#${uid}-wall)`}/><path d="M0 290H800V450H0Z" fill="#617769"/><path d="M0 290H800V450H0Z" fill={`url(#${uid}-floor)`}/><path d="M0 0L160 58V290L0 330Z" fill="#1c3e44" opacity=".6"/><path d="M640 58L800 0V330L640 290Z" fill="#53786a" opacity=".4"/><g clipPath={`url(#${uid}-ground)`}>{[-80,65,210,355,500,645,790,935].map(x=><path key={x} d={`M400 245L${x} 450`} stroke="#94a58b" strokeOpacity=".22"/>)}</g>
 <path d="M0 292H800M160 0V290M640 0V290" stroke="#2b4a49" strokeWidth="14"/>
 {[70,270,470,670].map(x=><g key={x}><path d={`M${x} 42h92v78h-92Z`} fill="#9eb198" opacity=".4"/><path d={`M${x+46} 42v78M${x} 81h92`} stroke="#47655d" strokeWidth="8"/><path d={`M${x-12} 127h116`} stroke="#284b4b" strokeWidth="8"/></g>)}
 <path d="M54 184h104v151H54Z" fill="#1b3b41" stroke="#8b9877" strokeWidth="6"/><path d="M72 203h68v132H72Z" fill="#102d36"/><path d="M89 176h42" stroke="#d3bf82" strokeWidth="4"/>
 <path d="M606 208h141v88H606Z" fill="#365b58" stroke="#8d9f7f" strokeWidth="3"/>{[631,671,711].map(x=><circle key={x} cx={x} cy="242" r="19" fill="#244e52" stroke="#a0b18b" strokeWidth="3"/>)}<path d="M613 269h126" stroke="#5b8070" strokeWidth="10"/><path d="M747 208l30-17v87l-30 18M606 208l30-17h141" fill="#274c50" stroke="#849c80" strokeWidth="2"/><path d="M619 296v26M734 296v26" stroke="#23444a" strokeWidth="8"/><path d="M634 191v-27h42v27M692 191v-40h43v40" fill="none" stroke="#7e9983" strokeWidth="8"/>{[631,671,711].map(x=><g key={x}><path d={`M${x} 242l9-8`} stroke="#d9cd96" strokeWidth="2"/><circle cx={x} cy="242" r="3" fill="#d5c999"/></g>)}
 <path d="M230 24v150M573 24v150M213 175h34M556 175h34" stroke="#183d43" strokeWidth="5"/>
 <path d="M218 175L165 362H302L242 175M560 175L493 362H655L584 175" fill="#e3ce94" opacity={lit?.13:.025}/>
 <ellipse cx="401" cy="315" rx="193" ry="119" fill={`url(#${uid}-pool)`} opacity={lit?1:.12}/>
 <g fill="#395c5b" stroke="#91a78a" strokeWidth="2"><path d="M373 288l35-12 36 13-36 13Z"/><path d="M373 288v49l35 13v-48M444 289v49l-36 12"/></g><circle cx="408" cy="287" r="7" fill={lit?"#e8c989":"#718673"}/><path d="M399 287h18" stroke="#24434a" strokeWidth="2"/>
 <Actor x={350} y={354} lit={lit} outline={outline} active={phase!==0} touching={phase===2}/><Actor x={486} y={354} lit={lit} outline={outline} active={phase===0} wide/>
 <path d="M327 379l51-1M462 379l56-1" stroke="#c6c39b" opacity=".4" strokeWidth="2"/>
 {!outline&&<><text x="351" y="399" textAnchor="middle" fill="#dae0bc" fontFamily="Arial" fontSize="15">operator</text><text x="487" y="399" textAnchor="middle" fill="#dae0bc" fontFamily="Arial" fontSize="15">supervisor</text></>}
 {speech&&!rail&&<g className={s.speech}><g transform={phase===0?undefined:"translate(-139 0)"}><path d="M385 214h265v85H505l-19 22 3-22H385Z" fill="#eae0ba" stroke="#83927a" strokeWidth="2"/><text x="403" y="244" fill="#36584e" fontFamily="Arial" fontSize="17">{phase===0?"Use the brass control.":phase===1?"I can reach it from here.":"Ready."}</text>{phase===0&&<text x="403" y="270" fill="#36584e" fontFamily="Arial" fontSize="17">I’ll watch the workpiece.</text>}</g></g>}
 </g><path d="M18 37V18h26M756 18h26v19M18 413v19h26M756 432h26v-19" fill="none" stroke="#d9d2a4" strokeOpacity=".65" strokeWidth="2"/>
 </svg>);
}
