import type { CSSProperties } from "react";
import { project } from "./venue-perspective";
import s from "./venue-screen.module.css";
type UV = readonly [number,number];
const rally: UV[]=[[.12,.25],[.88,.75],[.12,.75],[.88,.25]];
const patrol: UV[]=[[.16,.18],[.84,.18],[.84,.83],[.16,.83]];

/** All vertices and motion stops lie on the cabinet's sloping CRT plane. */
export default function VenueScreen({z,pong}:{z:number;pong:boolean}) {
 const at=([u,v]:UV)=>project([-3.04-.12*v,1.61-.37*v,z+.14+u]);
 const line=(points:UV[],close=false)=>points.map((p,i)=>`${i?"L":"M"}${at(p).join(" ")}`).join("")+(close?"Z":"");
 function motion(points:UV[],delay=0,rest=0):CSSProperties {
  const start=at(points[0]), still=at(points[rest]);
  return Object.fromEntries([...points.flatMap((p,i)=>{const q=at(p);return [[`--x${i}`,`${q[0]-start[0]}px`],[`--y${i}`,`${q[1]-start[1]}px`]];}),["animationDelay",`${delay}s`],["--rest-x",`${still[0]-start[0]}px`],["--rest-y",`${still[1]-start[1]}px`]]) as CSSProperties;
 }
 const ball=at(rally[0]);
 return <g data-arcade-screen={pong?"rally":"maze"}>
  <path d={line([[0,0],[1,0],[1,1],[0,1]],true)} fill="#173b36" stroke="#9daf90" strokeWidth=".7"/>
  <path d={line([[.035,.04],[.965,.04],[.965,.96],[.035,.96]],true)} fill="#18312e"/>
  {pong?<>
   <path d={line([[.5,.05],[.5,.95]])} stroke="#8baf93" strokeDasharray="2 3" strokeWidth=".8"/>
   <g className={s.rally} style={motion(rally)}><rect x={ball[0]-1.5} y={ball[1]-1.5} width="3" height="3" fill="#f6e8ba"/></g>
   <g className={s.paddle} style={motion([[.09,.25],[.09,.45],[.09,.75],[.09,.45]])}>
    <path d={line([[.09,.13],[.09,.37]])} stroke="#d5dfad" strokeWidth="2.4"/>
   </g>
   <g className={s.paddle} style={motion([[.91,.45],[.91,.75],[.91,.45],[.91,.25]])}>
    <path d={line([[.91,.33],[.91,.57]])} stroke="#d5dfad" strokeWidth="2.4"/>
   </g>
   <path d={line([[.36,.06],[.36,.11]])+line([[.62,.06],[.65,.06],[.65,.085],[.62,.085],[.62,.11],[.65,.11]])} stroke="#dae0b8" strokeWidth="1.1" fill="none"/>
  </>:<>
   <path d={line([[.28,.32],[.7,.32],[.7,.68],[.28,.68]],true)} fill="#455e43" stroke="#a5b180" strokeWidth="1.4"/>
   <path d={line([[.36,.42],[.6,.42],[.6,.57],[.43,.57]])} stroke="#c0b077" strokeWidth="1" fill="none"/>
   {[0,1].map(i=>{const p=at(patrol[0]);return <g key={i} className={s.patrol} style={motion(patrol,-i*4-z,i*2)}><path d={`M${p[0]-1.6} ${p[1]-2}h3.2v3h-3.2Z`} fill={i?"#d4b580":"#c5dcc2"}/></g>;})}
   <path d={line([[.1,.07],[.35,.07]])+line([[.6,.07],[.9,.07]])} stroke="#a9b38b" strokeWidth="1.2"/>
  </>}
  <path d={Array.from({length:12},(_,i)=>line([[.04,.07+i*.074],[.96,.07+i*.074]])).join("")} stroke="#071c22" strokeWidth=".5" opacity=".3"/>
  <path d={line([[.02,.02],[.6,.02],[.32,.95],[.12,.95]],true)} fill="#dae5c3" opacity=".035"/>
 </g>;
}
