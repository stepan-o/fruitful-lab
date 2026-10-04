import { roomPath as d, segment, wallRect } from "./venue-perspective";

const leftBricks=Array.from({length:16},(_,row)=> {
 const y=.95+row*.15;
 return segment([-4.19,y,-1.3],[-4.19,y,9])+Array.from({length:25},(_,col)=>{
  const z=-1.3+col*.44+(row%2)*.22;
  return segment([-4.18,y,z],[-4.18,y+.15,z]);
 }).join("");
}).join("");
const backBricks=Array.from({length:17},(_,row)=> {
 const y=.8+row*.15;
 return segment([-4.2,y,9],[4.2,y,9])+Array.from({length:27},(_,col)=>{
  const x=-4.2+col*.33+(row%2)*.165;
  return segment([x,y,8.99],[x,y+.15,8.99]);
 }).join("");
}).join("");
const floorGrain=Array.from({length:67},(_,i)=> {
 const x=-4.1+i*.126;
 return segment([x,0,-1.3],[x+.016,0,9]);
}).join("");

/** A modest brick-and-timber room, projected from one camera, with a clear central aisle. */
export default function VenueArchitecture({id}:{id:string}) {
 return <g data-art-element="room-architecture" strokeLinejoin="round">
  <defs>
   <linearGradient id={`${id}-leftwall`} x2="1" y2=".5"><stop stopColor="#514331"/><stop offset="1" stopColor="#273c39"/></linearGradient>
   <linearGradient id={`${id}-floor`} x2="0" y2="1"><stop stopColor="#36433b"/><stop offset="1" stopColor="#101f25"/></linearGradient>
   <radialGradient id={`${id}-bricklight`}><stop stopColor="#d7a665" stopOpacity=".29"/><stop offset=".45" stopColor="#c29454" stopOpacity=".09"/><stop offset="1" stopColor="#c29454" stopOpacity="0"/></radialGradient>
   <clipPath id={`${id}-left-clip`}><path d={d([[-4.2,0,-1.3],[-4.2,3.35,-1.3],[-4.2,3.35,9],[-4.2,0,9]])}/></clipPath>
   <clipPath id={`${id}-floor-clip`}><path d={d([[-4.2,0,-1.3],[-4.2,0,9],[4.2,0,9],[4.2,0,-1.3]])}/></clipPath>
  </defs>
  <path d="M0 0H1000V590H0Z" fill="#0d1d23"/>
  <path d={d([[-4.2,3.35,-1.3],[-4.2,3.35,9],[4.2,3.35,9],[4.2,3.35,-1.3]])} fill="#19272a"/>
  <path d={wallRect(-4.2,0,9,8.4,3.35)} fill="#223136"/>
  <path d={d([[-4.2,0,-1.3],[-4.2,3.35,-1.3],[-4.2,3.35,9],[-4.2,0,9]])} fill={`url(#${id}-leftwall)`}/>
  <path d={d([[4.2,0,-1.3],[4.2,3.35,-1.3],[4.2,3.35,9],[4.2,0,9]])} fill="#23312e"/>
  <path d={leftBricks} stroke="#ae9470" strokeWidth=".65" opacity=".26" fill="none"/>
  <g clipPath={`url(#${id}-left-clip)`}><ellipse cx="185" cy="132" rx="260" ry="156" fill={`url(#${id}-bricklight)`}/></g>
  <path d={Array.from({length:38},(_,i)=>{const z=(i*1.37)%9, y=1.12+(i*.31)%1.84;return segment([-4.175,y,z],[-4.175,y,z+.2]);}).join("")} stroke="#ccb182" strokeWidth="1" opacity=".18"/>
  <path d={backBricks} stroke="#859080" strokeWidth=".55" opacity=".16" fill="none"/>
  {/* Ordinary dado boards, lintels and exposed joists, without ornamental portals. */}
  {[-4.17,4.17].map(x=><g key={x}>
   <path d={wallRect(x,0,-1.3,10.3,.77,true)} fill="#17282a" stroke="#6d7158"/>
   <path d={segment([x,.81,-1.3],[x,.81,9])+segment([x,3.2,-1.3],[x,3.2,9])} stroke="#a99368" strokeWidth="2"/>
   <path d={Array.from({length:30},(_,i)=>segment([x,.04,-1.3+i*.35],[x,.75,-1.3+i*.35])).join("")} stroke="#9e8b66" strokeWidth=".65" opacity=".3"/>
  </g>)}
  {[1.2,4.4,7.8].map(z=><g key={z}>
   <path d={d([[-4.2,3.2,z],[4.2,3.2,z],[4.2,3.02,z],[-4.2,3.02,z]])} fill="#3b3930" stroke="#887856" strokeWidth="1.1"/>
   <path d={d([[-4.2,3.02,z],[4.2,3.02,z],[4.2,3.02,z+.2],[-4.2,3.02,z+.2]])} fill="#0a1b20" stroke="#61634e" strokeWidth=".6"/>
   <path d={segment([-4,3.17,z],[4,3.17,z])} stroke="#b19769" strokeWidth=".6" opacity=".45"/>
  </g>)}
  <path d={d([[-4.2,0,-1.3],[-4.2,0,9],[4.2,0,9],[4.2,0,-1.3]])} fill={`url(#${id}-floor)`}/>
  <g clipPath={`url(#${id}-floor-clip)`} fill="none">
   <path d={floorGrain} stroke="#8c997d" strokeWidth=".55" opacity=".16"/>
   <path d={Array.from({length:25},(_,i)=>segment([-4.2+i*.35,0,-1.3],[-4.2+i*.35,0,9])).join("")} stroke="#07171b" strokeWidth=".85" opacity=".45"/>
   <path d={Array.from({length:25},(_,i)=>{const x=-4.2+i*.35;return [0,1,2,3].map(j=>segment([x,0,(i%3)*.9+j*2.8],[x+.35,0,(i%3)*.9+j*2.8])).join("");}).join("")} stroke="#a09570" strokeWidth=".55" opacity=".21"/>
  </g>
  {/* A glazed street door at the rear: rectangular panes and an ordinary push bar. */}
  <path d={wallRect(-1.4,0,8.98,2.45,2.67)} fill="#111f24" stroke="#877856" strokeWidth="3"/>
  <path d={wallRect(-1.29,.09,8.96,2.22,2.47)} fill="#4b605c" stroke="#b2a47c" strokeWidth=".8"/>
  <path d={wallRect(-1.22,.12,8.94,2.08,2.33)} fill="#31484b"/>
  <path d={d([[-1.21,.15,8.93],[-1.21,1.6,8.93],[-.6,1.5,8.93],[-.6,.8,8.93],[.04,.8,8.93],[.04,1.9,8.93],[.8,1.9,8.93],[.8,.15,8.93]])} fill="#1c3139"/>
  <path d={segment([-.16,.12,8.9],[-.16,2.48,8.9])+[.77,1.47,2.12].map(y=>segment([-1.24,y,8.9],[.9,y,8.9])).join("")} stroke="#a99d77" strokeWidth="2.3"/>
  <path d={segment([-.9,.97,8.87],[.55,.97,8.87])} stroke="#d5be8d" strokeWidth="2"/>
  <path d={segment([-.95,2.34,8.86],[-.68,1.7,8.86])+segment([.12,2.02,8.86],[.42,1.61,8.86])} stroke="#b5c9af" opacity=".24"/>
  {[-3.45,-2.6,1.6,2.5,3.4].map((x,i)=><g key={x}>
   <path d={wallRect(x,1.76,8.91,.58,.75)} fill="#696344" stroke="#bba279" strokeWidth=".8"/>
   <path d={wallRect(x+.06,1.83,8.89,.46,.61)} fill={i%2?"#324c4e":"#3f4940"}/>
   <path d={d([[x+.1,1.86,8.87],[x+.22,2.14,8.87],[x+.34,1.96,8.87],[x+.45,2.3,8.87],[x+.48,1.86,8.87]])} fill="#b1a27a" opacity=".55"/>
  </g>)}
 </g>;
}
