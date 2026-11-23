import { atFloor, project, roomPath as d, roomScale, segment, wallRect } from "./venue-perspective";
import s from "./arcade-craft.module.css";

export function Glass({x,y,scale=1}:{x:number;y:number;scale?:number}) {
 return <g transform={`translate(${x} ${y}) scale(${scale})`}><ellipse cy="1" rx="5" ry="1.6" fill="#111c20"/><path d="M-5-17H5L3.6 0H-3.6Z" fill="#a78545" fillOpacity=".7" stroke="#dbc79a" strokeWidth=".7"/><path d="M-4-13H4M-3-11V-3" stroke="#e5d4a6" strokeWidth=".85"/><ellipse cy="-17" rx="5" ry="1.5" fill="#dbd4b0"/></g>;
}
function Bottle({z,y,i}:{z:number;y:number;i:number}) {
 const [x,py]=project([4.05,y,z]), k=roomScale(z)/100, h=24+(i*7)%12;
 return <g transform={`translate(${x} ${py}) scale(${k})`}>
  <path d={`M-5 0V${-h+10}L-2 ${-h+13}V${-h}H2V${-h+13}L5 ${-h+10}V0Z`} fill={["#446753","#8a724c","#698174"][i%3]} stroke="#c2b382" strokeWidth=".65"/>
  <path d={`M-2 ${-h+2}V${-h+9}M-3 ${-h+17}V-3`} stroke="#e2d8a8" strokeWidth=".7" opacity=".6"/><path d="M-4-14H4v7H-4Z" fill="#c4b98e" opacity=".72"/>
 </g>;
}
/** Bottle shelves and chalkboard belong to the long wall behind the counter. */
export function VenueBackBar() {
 return <g data-art-element="back-bar" strokeLinejoin="round">
  <path d={wallRect(4.14,1.27,.3,6.8,1.14,true)} fill="#0f2226" stroke="#8d7e58"/>
  {[1.33,1.82].map((y,row)=><g key={y}>
   <path d={wallRect(4.11,y-.055,.22,6.98,.055,true)} fill="#a18b5c" stroke="#c1a576" strokeWidth=".6"/>
   {Array.from({length:24},(_,i)=><Bottle key={i} z={.4+i*.275} y={y} i={i+row*3}/>)}
  </g>)}
  <path d={wallRect(4.13,2.12,.48,5.3,.91,true)} fill="#5c5840" stroke="#b19a6c"/>
  <path d={wallRect(4.11,2.17,.55,5.16,.81,true)} fill="#152628"/>
  <path d={Array.from({length:7},(_,i)=>segment([4.09,2.23+i*.095,.69],[4.09,2.23+i*.095,1.2+(i%3)*.34])+segment([4.09,2.23+i*.095,2.21],[4.09,2.23+i*.095,2.5])+segment([4.09,2.23+i*.095,2.91],[4.09,2.23+i*.095,3.6+(i%4)*.31])+segment([4.09,2.23+i*.095,5.06],[4.09,2.23+i*.095,5.38])).join("")} stroke="#c5c0a0" strokeWidth=".75" opacity=".52"/>
  <path d={segment([4.08,2.9,.75],[4.08,2.9,5.42])} stroke="#c6af73" strokeWidth="1.7"/>
  {/* Brass taps rise from a supported rail on the back counter. */}
  <path d={segment([3.1,1.13,3.2],[3.1,1.13,5.7])} stroke="#bfa571" strokeWidth="3.2"/>
  {[3.28,3.69,4.1,4.51,4.92,5.33].map((z,i)=><g key={z}>
   <path d={d([[3.1,1.13,z],[3.1,1.43,z],[2.91,1.43,z],[2.91,1.34,z]],false)} fill="none" stroke="#cfb886" strokeWidth="2"/>
   <path d={segment([3.02,1.42,z],[3.02,1.6,z])} stroke={i%2?"#708a75":"#bba476"} strokeWidth="3.8"/>
  </g>)}
 </g>;
}
export function Stool({x,z}:{x:number;z:number}) {
 return <g transform={atFloor(x,z)} strokeLinejoin="round">
  <ellipse cy="2" rx="22" ry="6" fill="#07161b" opacity=".7"/>
  <path d="M-13-69L-19 0M11-69L18 0M-2-66L-4-3" stroke="#1a282a" strokeWidth="4"/>
  <path d="M-13-69L-19 0M11-69L18 0M-2-66L-4-3" stroke="#a29168" strokeWidth="1.2"/>
  <path d="M-16-24Q0-15 16-24M-16-27Q0-18 16-27" fill="none" stroke="#90896a" strokeWidth="1.2"/>
  <ellipse cy="-69" rx="22" ry="7" fill="#25312b" stroke="#b59b6d"/>
  <ellipse cy="-72" rx="22" ry="6" fill="#735c41" stroke="#bda477" strokeWidth=".8"/>
  <path d="M-17-73q17-4 34 0" fill="none" stroke="#d8bc8a" opacity=".6"/>
 </g>;
}
function Pendant({x,z,id}:{x:number;z:number;id:string}) {
 const [px,py]=project([x,2.47,z]),k=roomScale(z)/100;
 return <g transform={`translate(${px} ${py}) scale(${k})`} data-art-element="pendant">
  <path d="M0-90V-20" stroke="#142124" strokeWidth="2.5"/><path d="M.8-90V-20" stroke="#b19a6c" strokeWidth=".6"/>
  <ellipse className={s.lampHalo} cy="38" rx="75" ry="112" fill={`url(#${id}-lamplight)`}/>
  <path d="M-9-24H9L12-17V18L8 22H-8L-12 18V-17Z" fill="#ab8954" stroke="#d2b880" strokeWidth=".8"/>
  <path className={s.lampCore} d="M-8-17H8V16H-8Z" fill="#efd29a"/>
  <path d="M-8-11H8M-8-5H8M-8 1H8M-8 7H8M-8 13H8" stroke="#ae8d58" strokeWidth=".6" opacity=".58"/>
  <ellipse cy="19" rx="9" ry="2.4" fill="#ecc994"/><path d="M-11-18H11M-10 20H10" stroke="#665439" strokeWidth="1.6"/>
 </g>;
}
export default function VenueFurnishings({id}:{id:string}) {
 return <g data-art-element="bar-furniture" strokeLinejoin="round">
  {/* This single counter runs along the right wall, leaving an uninterrupted aisle. */}
  <path d={wallRect(1.68,0,-2.1,8.75,1.04,true)} fill="#3c3b2b" stroke="#9a8256"/>
  <path d={Array.from({length:37},(_,i)=>segment([1.665,.1,-2.08+i*.24],[1.665,.98,-2.08+i*.24])).join("")} stroke="#131f22" strokeWidth="2.2"/>
  <path d={Array.from({length:73},(_,i)=>segment([1.66,.13,-2.06+i*.121],[1.66,.94,-2.06+i*.121])).join("")} stroke="#c0a06b" strokeWidth=".6" opacity=".36"/>
  <path d={segment([1.65,.12,-2.1],[1.65,.12,6.65])+segment([1.65,.94,-2.1],[1.65,.94,6.65])} stroke="#ac8d5a" strokeWidth="1.4"/>
  <path d={d([[1.53,1.055,-2.2],[2.92,1.055,-2.2],[2.92,1.055,6.75],[1.53,1.055,6.75]])} fill="#7a6948" stroke="#d5b680" strokeWidth="1.2"/>
  <path d={Array.from({length:8},(_,i)=>segment([1.6+i*.16,1.062,-2.12],[1.6+i*.16,1.062,6.6])).join("")} stroke="#e1c18a" strokeWidth=".6" opacity=".28"/>
  <path d={d([[1.53,1.055,-2.2],[1.53,.992,-2.2],[1.53,.992,6.75],[1.53,1.055,6.75]])} fill="#473c2b" stroke="#b79a64" strokeWidth=".7"/>
  <path d={segment([1.32,.23,-1.7],[1.32,.23,6.5])} stroke="#b89e67" strokeWidth="3"/>
  {[.1,2.4,4.8,6.2].map(z=><path key={z} d={segment([1.67,.15,z],[1.32,.23,z])} stroke="#947c50" strokeWidth="2"/>)}
  {[1.5,3.9,5.6].map(z=>{const [x,y]=project([1.88,1.08,z]);return <Glass key={z} x={x} y={y} scale={roomScale(z)/100}/>;})}
  <Stool x={1.03} z={5.55}/><Stool x={1.03} z={3.85}/><Stool x={1.03} z={2.15}/><Stool x={1.03} z={.42}/>
  <Pendant x={2.3} z={6.5} id={id}/><Pendant x={2.3} z={3.5} id={id}/><Pendant x={2.3} z={.8} id={id}/>
 </g>;
}
export function ForegroundTable() {
 return <g data-art-element="foreground-table">
  <path d={segment([-1.93,.68,-1.79],[-1.93,0,-1.79])+segment([-.16,.68,-1.79],[-.16,0,-1.79])} stroke="#0d1d23" strokeWidth="15"/>

  <path d={d([[-1.7,.73,-2.75],[.16,.73,-2.75],[.16,.73,-1.39],[-1.7,.73,-1.39]])} fill="#394137" stroke="#a38a5e" strokeWidth="1.4"/>
  <path d={d([[-1.7,.73,-2.75],[.16,.73,-2.75],[.16,.66,-2.75],[-1.7,.66,-2.75]])} fill="#18282a" stroke="#867650"/>
  <path d={Array.from({length:19},(_,i)=>segment([-1.68,.735,-2.7+i*.07],[.13,.735,-2.7+i*.07])).join("")} stroke="#baa172" strokeWidth=".7" opacity=".45"/>
  <path d={segment([-1.68,.736,-1.82],[.13,.736,-1.82])+segment([-1.68,.736,-1.55],[.13,.736,-1.55])} stroke="#071920" strokeWidth="1.5"/>
 </g>;
}
