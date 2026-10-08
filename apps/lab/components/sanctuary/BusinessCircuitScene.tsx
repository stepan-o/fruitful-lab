import { memo, type CSSProperties, type ReactNode } from "react";
import type { CircuitScene } from "@/lib/sanctuary/business-circuit";
import s from "./business-circuit.module.css";

const brass = "#b99a65", teal = "#79b5ac";
type Point = readonly [number, number, number];
// One dimetric grid for all floors, furniture footprints and contact points.
// u/v follow the walls; z is height above the floor.
function p(u: number, v: number, z = 0) { return [105 + .88 * (u - v), 120 + .35 * (u + v) - z]; }
function outline(points: Point[]) { return points.map(([u,v,z])=>p(u,v,z).join(",")).join(" "); }
function Quad({points,fill,stroke=brass}:{points:Point[];fill:string;stroke?:string}){return <polygon points={outline(points)} fill={fill} stroke={stroke} strokeWidth=".65"/>;}
function Line({a,b,stroke=brass,width=.7,opacity=1}:{a:Point;b:Point;stroke?:string;width?:number;opacity?:number}){const [x1,y1]=p(...a),[x2,y2]=p(...b);return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} opacity={opacity}/>;}
function Top({u,v,w,d,z=0,fill="#405044",stroke=brass}:{u:number;v:number;w:number;d:number;z?:number;fill?:string;stroke?:string}){return <Quad points={[[u,v,z],[u+w,v,z],[u+w,v+d,z],[u,v+d,z]]} fill={fill} stroke={stroke}/>;}
function Box({u,v,w,d,z=0,h,top="#596044",front="#283d37",side="#192e30"}:{u:number;v:number;w:number;d:number;z?:number;h:number;top?:string;front?:string;side?:string}){return <g><Quad points={[[u,v+d,z],[u+w,v+d,z],[u+w,v+d,z+h],[u,v+d,z+h]]} fill={front}/><Quad points={[[u+w,v,z],[u+w,v+d,z],[u+w,v+d,z+h],[u+w,v,z+h]]} fill={side}/><Top u={u} v={v} w={w} d={d} z={z+h} fill={top}/></g>;}
function Front({u,v,z,children}:{u:number;v:number;z:number;children:ReactNode}){const [x,y]=p(u,v,z);return <g transform={`matrix(.88 .35 0 1 ${x} ${y})`}>{children}</g>;}
// Left-wall art uses the same wall plane as the room, not screen-space rectangles.
function Side({v,z,children}:{v:number;z:number;children:ReactNode}){const [x,y]=p(.8,v,z);return <g transform={`matrix(.88 -.35 0 1 ${x} ${y})`}>{children}</g>;}
function Floor(){return <g><Box u={0} v={0} w={110} d={110} h={7} z={-7} top="#2d3c36" front="#14262a" side="#0d2025"/>{Array.from({length:10},(_,i)=><g key={i}><Line a={[0,(i+1)*10,0]} b={[110,(i+1)*10,0]} stroke="#9ca184" opacity={.24}/>{[0,1,2].map(j=><Line key={j} a={[20+j*35+i%2*15,i*10,0]} b={[20+j*35+i%2*15,(i+1)*10,0]} stroke="#657b65" opacity={.3}/>)}</g>)}<Line a={[0,110,-2]} b={[110,110,-2]} stroke="#d1b581" opacity={.55}/><Line a={[110,0,-2]} b={[110,110,-2]} stroke="#d1b581" opacity={.35}/>{[20,90].map(n=><g key={n}>{[[n,110,-4],[110,n,-4]].map(([u,v,z],i)=>{const [cx,cy]=p(u,v,z);return <circle key={i} cx={cx} cy={cy} r="1" fill="#131f20" stroke={brass} strokeWidth=".5"/>;})}</g>)}</g>;}
function Wall({brick=false}:{brick?:boolean}){return <g><Quad points={[[0,110,0],[0,0,0],[0,0,108],[0,110,108]]} fill="#1c2d2e" stroke="#697468"/><Quad points={[[0,0,0],[110,0,0],[110,0,108],[0,0,108]]} fill="#10232a" stroke="#54645e"/>{brick?Array.from({length:7},(_,i)=><g key={i}><Line a={[0,0,12+i*14]} b={[0,110,12+i*14]} stroke="#9a9876" opacity={.23}/><Line a={[0,0,12+i*14]} b={[110,0,12+i*14]} stroke="#7b8970" opacity={.24}/>{[0,1,2,3].map(j=>{const t=12+j*27+i%2*12;return <g key={j}><Line a={[0,t,12+i*14]} b={[0,t,26+i*14]} opacity={.2}/><Line a={[t,0,12+i*14]} b={[t,0,26+i*14]} opacity={.15}/></g>;})}</g>):[20,40,60,80,100].map(t=><g key={t}><Line a={[0,t,5]} b={[0,t,106]} stroke="#657c70" opacity={.22}/><Line a={[t,0,5]} b={[t,0,106]} stroke="#657c70" opacity={.2}/></g>)}<Line a={[0,110,4]} b={[0,0,4]} width={2} stroke="#646b52"/><Line a={[0,0,4]} b={[110,0,4]} width={2} stroke="#535e4b"/><Line a={[0,110,107]} b={[0,0,107]} stroke="#c4a56d"/><Line a={[0,0,107]} b={[110,0,107]} stroke="#c4a56d"/><Line a={[0,0,0]} b={[0,0,108]} stroke="#718573" width={2}/></g>;}
function Lamp({u=30,v=40,flicker=false}:{u?:number;v?:number;flicker?:boolean}){
 const [x,y]=p(u,v,108);
 return <g transform={`translate(${x} ${y})`}>
  <path d="M0-6v18" stroke="#bd9560"/><path d="M-12 22 0 12 12 22Z" fill="#40544b" stroke={brass}/>
  <g className={flicker?s.workshopFlicker:undefined}>
   {flicker?<ellipse cy="22" rx="12" ry="3.5" fill="#f9d99b" opacity=".18"/>:null}
   <ellipse cy="22" rx="10" ry="2.4" fill="#f9d99b"/>
   <path d="M-9 25-30 91h60L9 25Z" fill="#eab967" opacity=".055" className={flicker?s.faultCone:s.lamplight}/>
   {flicker?<ellipse cy="89" rx="25" ry="7" fill="#f5ca85" className={s.faultFootprint}/>:null}
  </g>
 </g>;
}
function Figure({u,v,scale=1,back=false,arms=true}:{u:number;v:number;scale?:number;back?:boolean;arms?:boolean}){const [x,y]=p(u,v);return <g transform={`translate(${x} ${y-50*scale}) scale(${scale})`}><ellipse cy="50" rx="12" ry="3.5" fill="#030d11" opacity=".5"/><path d="m-7 22-3 25 6 3 5-24 2 24 7-1-2-28" fill="#19282f" stroke="#627068" strokeWidth=".8"/><path d="M-10 1Q0-4 10 2l3 23-22 2Z" fill={back?"#5e6554":"#354e50"} stroke="#a2936b" strokeWidth=".8"/>{arms?<path d="m-9 5-7 13 15 3m10-17 6 13-10 4" fill="none" stroke={back?"#8b8464":"#738579"} strokeWidth="4" strokeLinecap="round"/>:null}<path d="M-5-2v-5h8v6" fill="#a88159"/><path d="M-7-16q6-7 13 0l-1 10-7 2-5-5Z" fill="#c2a37b"/><path d="M-8-13q-2-11 8-11 10 0 8 11l-5-5-9 2v8Z" fill="#283534"/>{!back?<path d="M4-14h3m-2 6-4 1" stroke="#664b39" strokeWidth=".7"/>:null}</g>;}
// Three unequal packets, with a fixed seed/specification to keep server and client identical.
// dx/vy/gravity are illustration coordinates, not measurements of a real electrical fault.
const repairParticles = [
 [32,-27,74,.012,6.5], [17,-37,86,.017,5], [-19,-20,76,.023,4], [27,2,58,.031,6],
 [7,-15,98,.034,3.5], [-11,-32,88,.039,4.5], [38,-10,62,.042,7], [21,-21,80,.047,4],
 [23,-31,82,.421,5.5], [-15,-16,66,.427,4], [34,-3,62,.435,6.5], [10,-26,102,.442,3.5], [28,9,48,.449,4.5],
 [19,-28,88,.773,5], [30,-8,70,.781,6], [-12,-14,92,.791,3.5],
].map(([dx,vy,gravity,launch,tail])=>{
 const frame=(t:number)=>{
  let angle=Math.atan2(vy+gravity*t,dx)*180/Math.PI;
  // Keep left-moving streaks continuous across the -180/180-degree boundary.
  if(dx<0&&angle>0)angle-=360;
  return `translate(${(dx*t).toFixed(2)}px, ${(vy*t+gravity*t*t/2).toFixed(2)}px) rotate(${angle.toFixed(1)}deg)`;
 };
 return {tail,style:{"--launch":launch,"--flight-0":frame(0),"--flight-1":frame(.12),"--flight-2":frame(.35),"--flight-3":frame(.65),"--flight-4":frame(1)} as CSSProperties};
});
function RepairDischarge({x,y}:{x:number;y:number}){
 return <g transform={`translate(${x} ${y})`}>
  <path d="m-8 2 4-3h2m4 0h3l3-4" fill="none" stroke="#b29158" strokeWidth=".9"/>
  <g className={s.repairField}>
   <g className={s.repairFlash}><ellipse rx="13" ry="8" fill="#edb45e" opacity=".13"/><ellipse rx="6" ry="4" fill="#ffd18b" opacity=".3"/><circle r="1.5" fill="#fff5d8"/></g>
   <path className={s.repairArc} d="m-3 0 1.7-2 1.4 2.8L3-.4M.1.8 2 3.3" fill="none" stroke="#fff0bd" strokeWidth=".8"/>
   {repairParticles.map(({tail,style},i)=><g key={i} className={s.repairSpark} style={style}>
    <path d={`M-${tail} 0-.6-.65.8 0-.6.65Z`} fill="#d9a050" opacity=".78"/>
    <g className={s.sparkCore}><path d={`M-${(tail*.52).toFixed(2)} 0-.3-.32.8 0-.3.32Z`} fill="#ffe2a0"/><circle r=".6" fill="#fff8e0"/></g>
   </g>)}
  </g>
 </g>;
}
function Cabinet({u,v,w=34,open=false,repair=false,playing=false}:{u:number;v:number;w?:number;open?:boolean;repair?:boolean;playing?:boolean}){const d=29;return <g><Top u={u-2} v={v-1} w={w+4} d={d+5} fill="#071317" stroke="#071317"/><Box u={u} v={v} w={w} d={d} h={3} top="#14282a" front="#0b1b21" side="#0a1b20"/><Box u={u} v={v} w={w} d={d} z={3} h={40} top="#82704c" front="#233936" side="#1e3032"/><Box u={u} v={v} w={w} d={d-6} h={57} z={43} top="#7d6d48" front="#715d3d" side="#2c4138"/><Front u={u+3} v={v+d-6} z={96}><rect width={w-6} height="10" fill="#101e22" stroke="#c3a16b"/><path d={`M4 5h${w-14}`} stroke="#e3d79b" strokeWidth="1.8" className={s.screenGlow}/><rect y="16" width={w-6} height="28" fill="#09151c" stroke="#a38d60"/><rect x="3" y="20" width={w-12} height="20" fill="#244744"/><path d={`M7 23v12m${w-20}-12v12M${w/2-3} 21v17`} stroke="#d8dabb" fill="none" strokeWidth="1"/><circle cx={w/2-6} cy="30" r="1.4" fill="#efe9b9" className={s.pong}/></Front><Box u={u-1} v={v+21} w={w+2} d={12} h={3} z={42} top="#91784e" front="#564d37"/>{playing?<ArcadeControls u={u} v={v} w={w}/>: [w*.28,w*.72].map((n,i)=>{const [x,y]=p(u+n,v+28,46);return <g key={i}><ellipse cx={x+3} cy={y+1} rx="1.7" ry=".8" fill="#e0c48a"/><g transform={`translate(${x} ${y})`}><g ><path d="M0 0v-4" stroke="#14282b" strokeWidth="2"/><circle cy="-4" r="2" fill="#b66b43"/></g></g></g>;})}<Front u={u+5} v={v+d} z={36}>{open?<><rect width={w-10} height="28" fill="#081b20" stroke="#a59463"/><rect x="3" y="3" width={w-16} height="17" fill="#3d684f"/>{[0,1,2].map(i=><path key={i} d={`M5 ${7+i*5}h${w-21}`} stroke="#b3b683"/>)}<path d="M8 22q12-4 9 5" stroke="#b67546" fill="none"/></>:<><rect x="4" width={w-18} height="24" fill="#17272b" stroke="#859376"/><path d={`M7 5h${w-24}M7 10h${w-24}`} stroke="#c5b78c"/><circle cx={w/2-5} cy="17" r="2" fill="#0d1c21" stroke="#9c8a5e"/></>}</Front>{repair?<RepairDischarge x={p(u+w/2,v+d,21)[0]} y={p(u+w/2,v+d,21)[1]}/>:null}</g>;}
function Desk({u=20,v=40,w=70,d=30,h=43}:{u?:number;v?:number;w?:number;d?:number;h?:number}){return <g><Top u={u-2} v={v-2} w={w+4} d={d+4} fill="#122823" stroke="#122823"/>{[[u+3,v+3],[u+w-3,v+3],[u+3,v+d-3],[u+w-3,v+d-3]].map(([a,b],i)=><Line key={i} a={[a,b,0]} b={[a,b,h]} stroke="#8c9478" width={2.5}/>)}<Box u={u} v={v} w={w} d={d} h={4} z={h-4} top="#746747" front="#454c38" side="#354737"/><Line a={[u+2,v+d,h-7]} b={[u+w-2,v+d,h-7]} stroke="#857953" width={2}/></g>;}
function ScreenArt(){return <><rect width="48" height="29" fill="#234947"/><circle cx="10" cy="8" r="3.3" fill="#dcc790"/><path d="M0 28 12 13l7 9L31 4l17 21v4Z" fill="#101f2a"/><path d="m23 18 8-14 7 15-7-3Z" fill="#7d9a7e"/><path d="M29 16v10m-5-5 5-2 5 3" stroke="#e1b57e"/><path d="M2 28h44" stroke={teal} className={s.screenGlow}/></>;}
function Monitor({u=38,v=48,z=43,game=false}:{u?:number;v?:number;z?:number;game?:boolean}){return <g><Top u={u+17} v={v-2} w={20} d={11} z={z+.5} fill="#43584b"/><Front u={u} v={v} z={z+43}><path d="M0 0h56v37H0Z" fill="#0c1a20" stroke="#bba47a"/><g transform="translate(4 4)">{game?<g transform="scale(.92 .96)"><AdventureArt/></g>:<ScreenArt/>}</g><path d="M23 37v7h10v-7" fill="#4a5b4b" stroke="#8d9574"/></Front></g>;}
function Keyboard({u=37,v=61,z=44}:{u?:number;v?:number;z?:number}){return <g><Top u={u} v={v} w={31} d={8} z={z} fill="#9ba38a"/>{[0,1].map(i=><Line key={i} a={[u+3,v+2+i*3,z+.1]} b={[u+27,v+2+i*3,z+.1]} stroke="#4b6a60" width={1}/>)}<Top u={u+38} v={v} w={5} d={6} z={z} fill="#b5ae8a"/></g>;}
function Shelves(){return <g>{[41,60,79].map((z,i)=><g key={i}><Top u={0} v={21} w={9} d={75} z={z} fill="#716044"/>{[0,1,2,3,4,5].map(j=><Box key={j} u={1} v={25+j*11} w={5} d={6} h={12+j%2*3} z={z+.5} top="#a39465" front={j%2?"#7b6849":"#385548"}/>)}</g>)}</g>;}
function WallPrint({window=false}:{window?:boolean}){return <g><Quad points={[[.5,40,91],[.5,94,91],[.5,94,54],[.5,40,54]]} fill={window?"#354f56":"#294540"}/><Line a={[1,45,62]} b={[1,62,81]} stroke="#a2bba3"/><Line a={[1,62,81]} b={[1,75,64]} stroke="#a2bba3"/><Line a={[1,75,64]} b={[1,89,77]} stroke="#a2bba3"/>{window?<><Line a={[1,67,55]} b={[1,67,90]} stroke="#9aa184" width={2}/><Line a={[1,41,72]} b={[1,93,72]} stroke="#9aa184" width={2}/></>:null}</g>;}
function DesignPlans(){return <>
 <Side v={102} z={99}>
  <rect x="-2" y="-2" width="83" height="48" fill="#554e38" stroke="#b39b68"/>
  <rect width="79" height="44" fill="#244542" stroke="#93b1a0" strokeWidth=".6"/>
  {[12,24,36,48,60,72].map(x=><path key={x} d={`M${x} 1v42`} stroke="#7aaf9f" strokeWidth=".35" opacity=".3"/>)}
  {[10,20,30,40].map(y=><path key={y} d={`M1 ${y}h77`} stroke="#7aaf9f" strokeWidth=".35" opacity=".3"/>)}
  <g fill="none" stroke="#d0d9b5" strokeWidth=".75">
   <path d="M10 7h19v12l-3 8 3 3v9H10V27l3-5V7Zm3 4h13v10H13Zm-1 17h15M16 33h8v4h-8Z"/>
   <path d="M6 7v32m-2-32h4m-4 32h4M10 3h19m-19-2v4m19-4v4" stroke="#8eb7a1"/>
   <rect x="44" y="7" width="25" height="18"/><path d="M48 11v9m17-9v9m-9-10v13M50 17h8l3-4 4 3"/>
   <circle cx="59" cy="16" r="1" fill="#e4d6a8"/>
   <path d="M43 32h8v6h-8Zm12-2h10v9H55Zm-4 5h4m10-3h7v7h-4m-25-4h-4v-6h5"/>
  </g>
  {[3,76].map(x=><circle key={x} cx={x} cy="3" r="1" fill="#d1b782"/>)}
 </Side>
 <Front u={8} v={.8} z={99}><rect width="39" height="22" fill="#b9b58e" stroke="#877d59"/><g stroke="#456a62" fill="none" strokeWidth=".7"><path d="M4 6h8v5H4Zm15-2h13v8H19Zm-7 4h7M8 11v6h17v-5M3 20h31"/><circle cx="8" cy="17" r="1.2"/><circle cx="25" cy="17" r="1.2"/></g></Front>
 </>;}
function DraftingTable(){
 const u=12,v=44,w=60,d=32,front=39,rise=12;
 const height=(depth:number)=>front+rise*(1-depth/d);
 const [x,y]=p(u,v,height(0));
 return <g>
  {[[u+4,v+3],[u+w-4,v+3],[u+4,v+d-3],[u+w-4,v+d-3]].map(([a,b],i)=><Line key={i} a={[a,b,0]} b={[a,b,height(b-v)-2]} stroke="#7b8a73" width={2}/>)}
  <Line a={[u+4,v+3,13]} b={[u+4,v+d-3,13]} width={1.8}/><Line a={[u+w-4,v+3,13]} b={[u+w-4,v+d-3,13]} width={1.8}/>
  <Quad points={[[u,v,51],[u+w,v,51],[u+w,v+d,39],[u,v+d,39]]} fill="#776343"/>
  <Quad points={[[u,v+d,39],[u+w,v+d,39],[u+w,v+d,36],[u,v+d,36]]} fill="#443f2d"/>
  <g transform={`matrix(.88 .35 -.88 ${.35+rise/d} ${x} ${y})`}>
   <rect x="5" y="4" width="46" height="23" fill="#c6c19a" stroke="#e2d3a2" strokeWidth=".6"/>
   <g stroke="#3f6b61" strokeWidth=".65" fill="none"><rect x="10" y="8" width="22" height="15"/><path d="M13 11v9m16-9v9m-8-12v13m-8-3 8-5 8 4M37 9h9m-9 3h6m-6 5h10m-10 3h7"/><circle cx="22" cy="13" r="1"/></g>
   <path d="M3 29h53" stroke="#d6b479" strokeWidth="1.6"/>{[8,16,24,32,40,48].map(a=><path key={a} d={`M${a} 28v2`} stroke="#715b39" strokeWidth=".6"/>)}
   <path d="m55 7-2 17" stroke="#d2a76f" strokeWidth="1.7"/><path d="m55 7 .5-3" stroke="#243836"/>
  </g>
 </g>;
}
function Factory(){const [x,y]=p(36,94),[hx,hy]=p(35,67,44);return <><Wall/><DesignPlans/><Lamp u={25} v={54} flicker/><Cabinet u={69} v={9} open/><DraftingTable/><Figure u={36} v={94} scale={1.02} back arms={false}/><path d={`M${x+8} ${y-45}Q${x+16} ${y-28} ${hx+2} ${hy}M${x-8} ${y-45}Q${x-10} ${y-28} ${hx-14} ${hy+4}`} fill="none" stroke="#8b8464" strokeWidth="3.5"/><circle cx={hx+2} cy={hy} r="2" fill="#ceb283"/></>;}

function Operator(){return <><Wall/><Shelves/><Lamp u={70} v={38}/><Cabinet u={70} v={13} open repair/><Desk u={10} v={49} w={47} d={23} h={39}/><Line a={[19,55,40]} b={[40,64,40]} stroke="#ddd1a5" width={2}/><Line a={[40,54,40]} b={[25,66,40]} stroke="#90a698" width={2}/><Box u={48} v={83} w={25} d={17} h={15} top="#716645"/><Line a={[54,90,16]} b={[68,90,16]} stroke="#b2a572" width={2}/><Figure u={78} v={70} scale={1.02}/></>;}
function Stool({u,v}:{u:number;v:number}){return <g>{[[u-5,v-5],[u+5,v-5],[u-5,v+5],[u+5,v+5]].map(([a,b],i)=><Line key={i} a={[a,b,0]} b={[a,b,20]} stroke="#829180" width={1.7}/>)}<Top u={u-8} v={v-8} w={16} d={16} z={20} fill="#9c6840"/><Line a={[u-5,v+5,7]} b={[u+5,v+5,7]} stroke="#ada07a"/></g>;}
function BarBackdrop(){return <>
 <Side v={101} z={97}>
  <rect x="-3" y="-3" width="82" height="52" fill="#50402e" stroke="#bd945d"/>
  <rect width="76" height="46" fill="#254143" stroke="#c5ac77"/>
  <rect x="3" y="3" width="70" height="40" fill="#314f4d" stroke="#8a997a" strokeWidth=".6"/>
  <path d="m7 39 31-31H27L7 28Zm31 0L68 9v10L48 39Z" fill="#9ba889" opacity=".16"/>
  <path d="M6 33h64M13 13h9m38 0h9" stroke="#758974" strokeWidth=".8"/>
  <path d="M17 7v14l-5 3h16l-5-3V7m34 0v14l-5 3h16l-5-3V7" fill="#64745b" opacity=".45"/>
  <path d="M-5-4h86v4H-5Zm0 51h86v-4H-5Z" fill="#9c784a" stroke="#c9a86b" strokeWidth=".6"/>
 </Side>
 <Box u={1} v={27} w={12} d={72} h={32} top="#766043" front="#423d2c" side="#253b35"/>
 <Top u={0} v={25} w={15} d={76} z={33} fill="#ac8550"/>
 {[39,67,88].map((v,i)=>{const [x,y]=p(7,v,34);return <g key={v} transform={`translate(${x} ${y})`}><path d="M-2-15h4v5l2 3v7h-8v-7l2-3Z" fill={i===1?"#94603d":"#2e5948"} stroke="#a5a57a" strokeWidth=".6"/><path d="M-3-6h6v4h-6Z" fill="#cfba85" opacity=".7"/></g>;})}
 <Front u={11} v={.8} z={96}><rect width="31" height="25" fill="#152c2b" stroke="#ad8c59"/><path d="M5 6h21M7 11h12m4 0h3M7 16h10m6 0h3M7 21h16" stroke="#b3b99a" strokeWidth=".8"/></Front>
 </>;}
function Mug(){return <><path d="M-3-7h6v7h-6Z" fill="#bf9058" stroke="#d8c393"/><path d="M-3-7h6" stroke="#ede0ae" strokeWidth="1.5"/><path d="M3-5q5 0 3 4H3" fill="none" stroke="#d8c393"/></>;}
function Bar(){const [x,y]=p(19,33),[ex,ey]=p(39,58,48),[gx,gy]=p(15,58,45),[mx,my]=p(48,58,45);return <>
 <Wall brick/><BarBackdrop/><Lamp u={23} v={64}/><Cabinet u={74} v={8}/><Figure u={19} v={33} scale={1.03} arms={false}/>
 <Box u={8} v={48} w={57} d={21} h={41} top="#3b4b37" front="#354432"/><Box u={5} v={45} w={63} d={26} z={41} h={3} top="#927344" front="#655a3d"/>
 {[24,46].map(u=><Line key={u} a={[u,69,5]} b={[u,69,36]} stroke="#9d8959"/>)}<Line a={[10,69,9]} b={[63,69,9]} stroke="#ac9259"/>
 <Front u={38} v={49} z={65}><path d="M2 21V7q0-5 5-5h8q5 0 5 5v4M7 2v-5m8 5v-5" fill="none" stroke="#ceb079" strokeWidth="2.5"/><path d="M5-4h4m4 0h4M-1 22h7" stroke="#f0d098" strokeWidth="2"/></Front>
 <path d={`M${x-8} ${y-45}Q${x-15} ${ey-2} ${ex} ${ey}`} fill="none" stroke="#738579" strokeWidth="4"/>
 <Front u={39} v={58} z={48}><g className={s.bartenderArm}><path d="M0 0h-24" stroke="#a5a17f" strokeWidth="3.7"/></g></Front>
 <g transform={`translate(${gx} ${gy})`}><g className={s.glassSlide}><Mug/><circle cy="-3" r="2" fill="#ceb283"/></g></g>
 <g transform={`translate(${mx} ${my})`}><Mug/></g><Stool u={20} v={88}/><Stool u={54} v={88}/>
 </>;}
function MusicPoster(){return <Side v={98} z={99}>
 <rect x="-2" y="-2" width="71" height="57" fill="#6a5038" stroke="#bf9b65"/>
 <rect width="67" height="53" fill="#9b6748" stroke="#d1b080" strokeWidth=".6"/>
 <rect x="3" y="3" width="61" height="47" fill="#253b3b" stroke="#b89160" strokeWidth=".5"/>
 <circle cx="34" cy="22" r="15" fill="#ca9d60"/>
 {[0,1,2,3,4,5,6].map(i=><path key={i} d="M34 4v5" stroke="#e4c88d" strokeWidth="1" transform={`rotate(${i*30-90} 34 22)`}/>)}
 <path d="M39 10v21q0 10-10 10-8 0-8-7 0-5 5-7l3 7q3 2 4-3V15h-5v-5Z" fill="#17292c" stroke="#17292c" strokeWidth="1.5"/><path d="m20 25 9-4 2 6-8 4Z" fill="#17292c"/><path d="M37 20h3m-3 5h3m-3 5h3" stroke="#d8b270" strokeWidth=".8"/>
 <path d="M9 45h49M10 47h47" stroke="#d5af74" strokeWidth=".7"/>
 <text x="34" y="48" textAnchor="middle" fontFamily="Georgia,serif" fontSize="4.5" letterSpacing="2" fill="#ebd29c" stroke="#253b3b" strokeWidth="2" paintOrder="stroke">LIVE MUSIC</text>
 </Side>;}
// Foreshortened arms read as simple strokes from this rear angle. The upper
// reach is hidden by the torso; the visible hand stays on its control.
// All poses are precomputed; CSS only interpolates transforms.
type FlatPoint = readonly [number,number];
const playerPoses = [
 {name:"rest",lean:0,stick:0},
 {name:"idle-a",lean:1,stick:-4}, {name:"idle-b",lean:-.7,stick:4},
 {name:"focus-a",lean:6,stick:-26}, {name:"focus-b",lean:-4.5,stick:26},
 ...[
  {name:"in",from:[0,0],to:[6,-26]},
  {name:"cross",from:[6,-26],to:[-4.5,26]},
  {name:"out",from:[-4.5,26],to:[0,0]},
 ].flatMap(({name,from,to})=>[.15625,.5,.84375].map((t,i)=>({
  name:`focus-${name}-${i+1}`,lean:from[0]+(to[0]-from[0])*t,stick:from[1]+(to[1]-from[1])*t,
 }))),
];
const playerPhase=(i:number)=>({"--player-phase":i?-.18:0} as CSSProperties);
function poseStyles(transforms:string[]){return Object.fromEntries(playerPoses.map(({name},i)=>[`--pose-${name}`,transforms[i]])) as CSSProperties;}
function rotatePoint([x,y]:FlatPoint,degrees:number):FlatPoint{const a=degrees*Math.PI/180;return [x*Math.cos(a)-y*Math.sin(a),x*Math.sin(a)+y*Math.cos(a)];}
function limbTransform([x,y]:FlatPoint,[tx,ty]:FlatPoint){return `translate(${x.toFixed(3)}px, ${y.toFixed(3)}px) rotate(${(Math.atan2(ty-y,tx-x)*180/Math.PI).toFixed(3)}deg)`;}
const joystickHeight=4.5;
const joystickPose=poseStyles(playerPoses.map(({stick})=>`rotate(${stick}deg)`));
// The control panel top is z=45. Both the mounted hardware and the hand rig use
// these projected positions, including the button height above its escutcheon.
function controlStation(u:number,v:number,w:number,index:number){
 const stationU=u+w*(index ? .72 : .28),stationV=v+28;
 return {u:stationU,v:stationV,pivot:p(stationU,stationV,45.25),button:p(stationU+7,stationV,46)};
}
function ArcadeControls({u,v,w}:{u:number;v:number;w:number}){
 return <g>{[0,1].map(i=>{
  const station=controlStation(u,v,w,i),[x,y]=station.pivot,[bx,by]=station.button;
  return <g key={i}>
   <Top u={station.u-4} v={station.v-4} w={15} d={8} z={45.15} fill="#394b43" stroke="#c2a572"/>
   {[[-2.5,-2.5],[9.5,2.5]].map(([du,dv],j)=>{
    const [sx,sy]=p(station.u+du,station.v+dv,45.3);
    return <circle key={j} cx={sx} cy={sy} r=".55" fill="#d0bd8c"/>;
   })}
   <ellipse cx={bx} cy={by+.75} rx="2.5" ry="1.15" fill="#17282b" stroke="#95865e" strokeWidth=".45"/>
   <ellipse cx={bx} cy={by} rx="2" ry=".85" fill="#d6b277" stroke="#f0d4a0" strokeWidth=".4"/>
   <g transform={`translate(${x} ${y})`}>
    <ellipse rx="3.1" ry="1.35" fill="#11272a" stroke="#b2a176" strokeWidth=".55"/>
    <g className={`${s.playerPose} ${s.controlPull}`} style={{...joystickPose,...playerPhase(i)}}>
     <path d={`M0 0v-${joystickHeight}`} stroke="#758a80" strokeWidth="1.55"/>
     <circle cy={-joystickHeight} r="2" fill="#b96f45" stroke="#e2b377" strokeWidth=".5"/>
    </g>
    <path d="M-2 .2Q0-1.5 2 .2L1.7 1H-1.7Z" fill="#233935" stroke="#879177" strokeWidth=".5"/>
   </g>
  </g>;
 })}</g>;
}
const playerDepth=70;
const arcadePlayers=[51,81].map((u,i)=>{
 const scale=1.03,[x,y]=p(u,playerDepth),station=controlStation(40,24,51,i);
 const [hx,hy]=station.pivot;
 const hip:FlatPoint=[x,y-25*scale];
 const arms=[1,-1].map(side=>{
  const poses=playerPoses.map(({lean,stick})=>{
   const shoulderOffset=rotatePoint([side*9*scale,-20*scale],lean);
   const shoulder:FlatPoint=[hip[0]+shoulderOffset[0],hip[1]+shoulderOffset[1]];
   const gripOffset=rotatePoint([0,-joystickHeight],stick);
   const grip:FlatPoint=side===1?[hx+gripOffset[0],hy+gripOffset[1]]:[station.button[0],station.button[1]];
   return {shoulder,grip};
  });
  // One straight sleeve stroke, partly occluded by the back-facing body.
  // Scale only its length; keep the small hand marker separate and unscaled.
  return {
   stroke:poseStyles(poses.map(({shoulder,grip})=>`${limbTransform(grip,shoulder)} scaleX(${(Math.hypot(shoulder[0]-grip[0],shoulder[1]-grip[1])/16).toFixed(4)})`)),
   hand:poseStyles(poses.map(({grip})=>`translate(${grip[0].toFixed(3)}px, ${grip[1].toFixed(3)}px)`)),
  };
 });
 return {u,phase:playerPhase(i),torso:poseStyles(playerPoses.map(({lean})=>`rotate(${lean}deg)`)),arms};
});
function PlayerArm({arm}:{arm:(typeof arcadePlayers)[number]["arms"][number]}){
 return <g>
  <g className={s.playerPose} style={arm.stroke}><path d="M0 0H16" fill="none" stroke="#9b9876" strokeWidth="3" strokeLinecap="butt"/></g>
  <g className={s.playerPose} style={arm.hand}><circle r="1.45" fill="#ceb283"/></g>
 </g>;
}
function PlayerBack({u,torso}:{u:number;torso:CSSProperties}){
 const [x,y]=p(u,playerDepth);
 return <g transform={`translate(${x} ${y-51.5}) scale(1.03)`}>
  <ellipse cy="50" rx="12" ry="3.5" fill="#030d11" opacity=".5"/>
  <path d="m-7 22-3 25 6 3 5-24 2 24 7-1-2-28" fill="#19282f" stroke="#627068" strokeWidth=".8"/>
  <path d="m-10 47 6-2 2 4-8 1m13-2 6-3 2 3-8 2" fill="#11232a" stroke="#81907b" strokeWidth=".65"/>
  <g className={`${s.playerPose} ${s.playerTorso}`} style={torso}>
   <path d="M-10 1Q0-4 10 2l3 23-22 2Z" fill="#5e6554" stroke="#a2936b" strokeWidth=".8"/>
   <path d="m-8 5 8 3 9-2M0 8l1 16m-8 1 17-1" fill="none" stroke="#879076" strokeWidth=".75"/>
   <path d="M-4 0v-7h8v7l-4 2Z" fill="#ad8d65"/>
   <path d="m-5-1 5 3 5-3 2 3-7 3-7-3Z" fill="#394d45" stroke="#a1a184" strokeWidth=".6"/>
   <ellipse cx="-7" cy="-10" rx="1.4" ry="2.7" fill="#b59870"/>
   <ellipse cx="7" cy="-10" rx="1.4" ry="2.7" fill="#b59870"/>
   <path d="M-7-10v-6q0-8 8-8 8 1 7 9l-1 8-6 2-6-2Z" fill="#253534" stroke="#a09b79" strokeWidth=".6"/>
   <path d="M-6-17q5-8 12-3l1 5q-4-4-11-1Zm0 6 1 4 6 2 4-2v-2l-5 1Z" fill="#3c4e43"/>
  </g>
 </g>;
}
function ArcadePlayers(){
 return <><Wall brick/><MusicPoster/><Lamp u={68} v={42}/><Cabinet u={40} v={24} w={51} playing/>
  {arcadePlayers.map(({u,phase,torso,arms})=><g key={u} style={phase}>
   <PlayerArm arm={arms[1]}/>
   <PlayerBack u={u} torso={torso}/>
   <PlayerArm arm={arms[0]}/>
  </g>)}
 </>;
}

function Chair({u,v}:{u:number;v:number}){return <g><Box u={u} v={v} w={27} d={24} z={21} h={4} top="#485b4e"/><Line a={[u+13,v+13,0]} b={[u+13,v+13,22]} stroke="#889a83" width={2}/><Line a={[u+3,v+3,1]} b={[u+24,v+24,1]} stroke="#889a83" width={2}/><Line a={[u+3,v+24,1]} b={[u+24,v+3,1]} stroke="#889a83" width={2}/><Box u={u} v={v+22} w={27} d={4} z={23} h={26} top="#637762" front="#294548" side="#213839"/></g>;}
// PC scenes share the room projection and material palette, but each has a
// distinct job. These are invented interiors and original screens, not offices
// or interfaces attributed to the named companies.
function Plane({u,v,z,children}:{u:number;v:number;z:number;children:ReactNode}){const [x,y]=p(u,v,z);return <g transform={`matrix(.88 .35 -.88 .35 ${x} ${y})`}>{children}</g>;}
function SidePanel({u,v,z,children}:{u:number;v:number;z:number;children:ReactNode}){const [x,y]=p(u,v,z);return <g transform={`matrix(.88 -.35 0 1 ${x} ${y})`}>{children}</g>;}
function FanWheel({r=9}:{r?:number}){return <><circle r={r} fill="#101f27" stroke="#8b9c83" strokeWidth=".7"/><g className={s.pcFan}>{[0,1,2,3,4,5].map(i=><path key={i} d={`M-1-2Q${-r} ${-r} -2 ${-r+1}L2-3Z`} fill="#5b887b" stroke="#9ab8a0" strokeWidth=".25" transform={`rotate(${i*60})`}/>)}</g><circle r="2" fill="#c4ab78"/></>;}
function ScreenBurst({x,y,delay=0}:{x:number;y:number;delay?:number}){return <g transform={`translate(${x} ${y})`} style={{"--burst-offset":delay} as CSSProperties}>
 <g className={s.screenBurst}>
  <ellipse rx="10" ry="7" fill="#d57945" opacity=".22"/>
  <path d="M-7 2q-4-6 1-7 0-5 5-3 4-5 6 0 6 0 3 5 4 4-1 6l-5-1-5 1Z" fill="#d68d4c"/>
  <path d="M-4 2q-3-5 1-5 2-4 4-1 4 1 2 4l-3 3Z" fill="#f9ce79"/>
  <path d="m-2 1 1-4 3 3-2 2Z" fill="#fff0bb"/>
 </g>
 <g className={s.screenDebris} fill="#eec88a"><path d="m-9-5 2 1m12-5-1 2m5 5 3-1m-14 9-2 2" stroke="#eec88a" strokeWidth=".7"/><circle cx="5" cy="6" r=".7"/></g>
</g>;}
// A West Coast driving scene, composed from original geometry rather than a traced game frame.
function CoastalArt({editor=false}:{editor?:boolean}){return <svg width="52" height="30" viewBox="0 0 52 30" overflow="hidden">
 <rect width="52" height="30" fill="#9b9c7a"/><circle cx="41" cy="7" r="5" fill="#e3c087"/>
 <path d="M0 15 8 10l6 2 8-6 9 5 8-2 13 5v9H0Z" fill="#657f72"/><path d="M0 19V12h6v7h4V8h5v11h4V5h4v14h3V10h5v10h5v-6h6v8h10v8H0Z" fill="#345b58"/>
 <path d="M11 10h3m6-3h2m-2 3h2m-2 3h2m6-1h2" stroke="#bfc5a1" strokeWidth=".55"/>
 <path d="M0 30 21 19h11l20 11Z" fill="#415250"/><path d="m5 30 17-11m25 11L31 19" stroke="#b7b297" strokeWidth=".6"/>
 {editor?<path d="m25 29 1-3m1-2 .5-2" stroke="#ddcb93" strokeWidth=".75"/>:<g transform="translate(27 19)">{[0,1,2].map(i=><path key={i} className={s.roadMark} d="m-2 10 1-3" stroke="#eddaa4" strokeWidth=".8" style={{"--motion-phase":`${-i*.6}s`} as CSSProperties}/>)}</g>}
 {[{x:5,y:21,h:12},{x:44,y:23,h:13}].map(({x,y,h})=><g key={x}><path d={`M${x} ${y}q2 ${-h/2} 1 ${-h}`} fill="none" stroke="#676e4c" strokeWidth="1.3"/><path d={`M${x+1} ${y-h}q-5-4-7 1 4-2 7-1-2-6 3-5-2 1-3 5 5-4 8 1-4-2-8-1 4 1 4 5-1-3-4-5-4 2-5 5 0-4 5-5`} fill="#284d45"/></g>)}
 <g className={editor?undefined:s.trafficCar}><path d="m30 27 1-5 3-3h6l3 4v5H30Z" fill="#b68a60" stroke="#d5c29b" strokeWidth=".5"/><path d="m33 22 2-2h4l2 3Z" fill="#233f46"/><path d="M31 26h3m7 0h2" stroke="#e9d499" strokeWidth=".8"/><path d="M32 28h2m7 0h2" stroke="#132a2f" strokeWidth="1.5"/></g>
 {editor?<g className={s.editorWire} fill="none" stroke="#c9d9b2" strokeWidth=".4"><path d="M0 30 21 19h11l20 11M5 26h40m-30-3h25"/><rect x="29" y="18" width="15" height="11" strokeDasharray="1 1"/></g>:<><ScreenBurst x={19} y={22} delay={-.4}/><path className={s.pursuitLights} d="M11 22h2m2 0h2" stroke="#e6a471" strokeWidth="1.3"/></>}
 </svg>;}

// Original genre illustrations; not traced gameplay or licensed character art.
function ConsoleGameArt({racing=false,editor=false}:{racing?:boolean;editor?:boolean}){return <svg width="52" height="30" viewBox="0 0 52 30" overflow="hidden">
 <rect width="52" height="30" fill={racing?"#9fa88b":"#698b8a"}/><circle cx="41" cy="6" r="4" fill="#e4c394"/>
 {racing?<>
  <path d="M0 19 8 9l6 5 9-12 12 12 7-5 10 10v11H0Z" fill="#657d6c"/><path d="m12 14 11-12 8 9-7-3-4 5-4-1Z" fill="#b8b99b"/>
  <path d="M0 24q9-9 23-4t29-3v13H0Z" fill="#8c9366"/><path d="M6 30q0-8 19-9t4-6h5q18 5-5 10t0 5Z" fill="#334d4e"/>
  <path d="M8 30q-1-7 18-8M28 30q-6-3 4-5" fill="none" stroke="#d1c599" strokeWidth=".65"/>
  <g transform="translate(24 23)"><g className={editor?undefined:s.raceCar}><path d="m-7 5 1-6 3-3h7l3 3 1 6Z" fill="#b27051" stroke="#e9bf87" strokeWidth=".55"/><path d="m-3-1 1-2h5l2 2Z" fill="#19323a"/><path d="M-6 3h3m6 0h3" stroke="#f1d295"/><path d="M-7 5h2m9 0h2" stroke="#162c31" strokeWidth="1.4"/></g></g>
  <path d="M3 23v-7m0 4-2-2m2 1 2-2M44 25v-9m0 4 3-3m-3 1-2-2" stroke="#48634d" strokeWidth="1.2"/>
 </>:<>
  <path d="M0 30V10h7v20h3V5h8v25h4V11h7v19h4V3h7v27h5V12h7v18Z" fill="#34595d"/>
  {[3,12,15,24,35,38,47].map(x=><path key={x} d={`M${x} 14v13`} stroke="#bfc49c" strokeWidth=".65" strokeDasharray="1 2"/>)}
  <path d="m0 30 7-9 6 9m16 0 8-15 9 15" fill="#1b3b44"/><g className={editor?undefined:s.citySwing}>
   <path d="M42-3 27 11" stroke="#e5d0a5" strokeWidth=".45"/><circle cx="26" cy="13" r="1.1" fill="#dab789"/><path d="m26 15-2 4 4 2 3-2m-7-2-3-1 2-2m3 6-2 5m4-4 4 2" fill="none" stroke="#b98462" strokeWidth="1.6"/>
  </g>
 </>}
 {editor?<g className={s.editorWire} fill="none" stroke="#d6dbb3" strokeWidth=".45"><path d="M2 10h48M2 20h48M13 1v28M26 1v28M39 1v28"/><rect x="17" y="13" width="18" height="15" strokeDasharray="1 1"/></g>:null}
 </svg>;}

// An invented city action scene: recognizable genre cues, not copied game art.
function AdventureArt({editor=false,gameTitle}:{editor?:boolean;gameTitle?:string}){if(gameTitle==="GRAND THEFT AUTO V")return <CoastalArt editor={editor}/>;if(gameTitle==="FORZA HORIZON 5"||gameTitle==="SPIDER-MAN 2")return <ConsoleGameArt racing={gameTitle==="FORZA HORIZON 5"} editor={editor}/>;return <svg width="52" height="30" viewBox="0 0 52 30" overflow="hidden">
 <rect width="52" height="30" fill="#2e5159"/><circle cx="40" cy="6" r="3.7" fill="#afbc9b"/>
 <path d="M0 20V8h5V4h6v12h5V9h5v10h7V7h4V2h7v17h5V9h8v21H0Z" fill="#19353f"/>
 <path d="M1 6h8v21H0m45-18h7v19h-9V14h2Z" fill="#142c37"/>
 <path d="M4 9v9m3-9v6m12-3v6m13-9v8m3-12v12m12-3v8" stroke="#8ab4a5" strokeWidth=".7" strokeDasharray="1 2"/>
 <path d="M11 30 24 19h7l18 11Z" fill="#385052"/><path d="m23 30 4-9m10 9-6-9" stroke="#c5ad70" strokeWidth=".65"/>
 <path d="M1 13h9v3H1m37-3h9v3H37" fill="#ad7353"/><path d="M2 14h6m31 0h6" stroke="#f5d18d" strokeWidth=".6"/>
 <path d="m29 24 2-3h7l3 3v3H28Z" fill="#74806c" stroke="#c8b98b" strokeWidth=".5"/><path d="M32 22h4l2 2h-8Z" fill="#1a343d"/><path d="M29 26h3m6 0h3" stroke="#efd59b"/>
 <path d="M3 30 8 25l3 1 3 4" fill="#11262e" stroke="#91a38c" strokeWidth=".5"/>
 {!editor?<><ScreenBurst x={34} y={23}/><ScreenBurst x={16} y={21} delay={-.56}/></>:<g className={s.editorWire} fill="none" stroke="#acd1b2" strokeWidth=".45"><path d="M11 30 24 19h7l18 11M1 20h50M8 24h40m-23-5-9 11m12-11 9 11"/><rect x="28" y="20" width="14" height="8" strokeDasharray="1 1"/></g>}
 </svg>;}
function WorkMonitor({editor=false,gameTitle}:{editor?:boolean;gameTitle?:string}){return <>
 <Plane u={23} v={46} z={43.2}><g className={editor?s.editorLight:s.monitorLight}><ellipse cx="26" cy="9" rx="34" ry="15" fill={editor?"#acd5b2":"#e6b471"} opacity=".17"/><ellipse cx="26" cy="6" rx="23" ry="9" fill="#d5dbab" opacity=".16"/></g></Plane>
 <Top u={44} v={39} w={25} d={10} z={43.4} fill="#566d60"/>
 <Box u={54} v={40} w={5} d={3} z={44} h={9} top="#85927a" front="#677b6b"/>
 <Front u={24} v={44} z={88}>
  <rect x="-2" y="-2" width="67" height="39" rx="1.5" fill="#17292d" stroke="#c1aa77" strokeWidth=".9"/>
  <rect width="63" height="33" fill="#0b2028"/>
  <g transform={editor?"translate(2 2) scale(.85 .8)":"translate(2 2) scale(1.13 .9)"}><AdventureArt editor={editor} gameTitle={gameTitle}/></g>
  {editor?<>
   <path d="M49 4h10m-10 3h7m-7 4h9m-9 4h6m-6 4h10m-10 4h7" stroke="#769988" strokeWidth=".8"/>
   <path d="M3 29h57" stroke="#668376"/>{[8,18,29,39].map(x=><rect key={x} x={x} y="27" width="7" height="4" fill="#aa996d" opacity=".7"/>)}
   <g transform="translate(6 26)"><g className={s.editPlayhead}><path d="M0 0v6" stroke="#f4d79b" strokeWidth="1.2"/><path d="m-2 0 2 2 2-2Z" fill="#f4d79b"/></g></g>
   <g className={s.editorCursor}><path d="m20 11 1 7 2-2 3 1Z" fill="#e8e2b5" stroke="#203934" strokeWidth=".55"/><path d="M22 20v5m-2-2h4" stroke="#b7d9a8" strokeWidth=".55"/></g>
  </>:<><path d="M3 30h18m22 0h16" stroke="#cdb479" strokeWidth=".9"/>{[4,9,14].map(x=><rect key={x} x={x} y="28" width="3" height="3" fill="#857658"/>)}<g className={s.gameCursor}><path d="m40 18 2 6 2-2 2-1Z" fill="#f2deb0"/></g></>}
  <path d="M3 35h51" stroke="#768b78" strokeWidth=".5"/><circle cx="60" cy="35" r=".8" fill={teal} className={s.pcLed}/>
 </Front>
 </>;}
function DeskInputs(){return <Plane u={29} v={57} z={44.6}>
 <rect width="34" height="13" rx="1" fill="#172e33" stroke="#8eac92" strokeWidth=".7"/>
 {[0,1,2].map(row=><g key={row}>{[0,1,2,3,4,5,6,7].map(col=><rect key={col} x={2+col*3.8} y={1.5+row*3.2} width="2.5" height="2" fill="#9eae91" opacity={col===row+2?.95:.56}/>)}</g>)}
 <path d="M10 11h15" stroke="#c2bd91" strokeWidth="1"/>
 <rect x="39" y="-1" width="16" height="17" rx="2" fill="#294a44" stroke="#758b6c" strokeWidth=".5"/>

 </Plane>;}
function SeatedUser({artist=false}:{artist?:boolean}){
 const [x,y]=p(56,83),[lx,ly]=p(47,63,45),[rx,ry]=p(76,62,45);
 return <g>
  <ellipse cx={x+2} cy={y+3} rx="19" ry="6" fill="#071519" opacity=".7"/>
  <path d={`M${x-6} ${y-23}l-1 18 7 2 2-17m5-2 3 15 8 1`} fill="none" stroke="#263c3e" strokeWidth="5"/>
  <path d={`M${x-9} ${y-2}l9 2m10-1 7 2`} stroke="#85947b" strokeWidth="2"/>
  <g transform={`translate(${x} ${y-49})`}>
   <path d="M-10 4Q0-1 10 5l3 20-24 1Z" fill={artist?"#7b8060":"#526e69"} stroke="#b0b58b" strokeWidth=".8"/>
   <path d="M-7 8 0 10l7-2M0 10v13" fill="none" stroke={artist?"#a0aa82":"#87a295"} strokeWidth=".6"/>
   <g className={s.pcHead}>
    <path d="M-3 3v-7h6v7" fill="#b69973"/>
    <ellipse cx="-6" cy="-7" rx="1.4" ry="2.5" fill="#c3a77f"/><ellipse cx="6" cy="-7" rx="1.4" ry="2.5" fill="#c3a77f"/>
    <path d="M-6-7v-6q1-7 7-6 6 1 6 7l-1 8-5 2-6-3Z" fill={artist?"#534b3c":"#263d3c"} stroke="#aa9c79" strokeWidth=".6"/>
    <path d="M-4-15q5-3 9 1M-4-5l4 2 4-2" fill="none" stroke={artist?"#8f7956":"#56786a"} strokeWidth=".8"/>
    {!artist?<><path d="M-8-8v-5q0-9 8-9t8 9v5" fill="none" stroke="#9f9670" strokeWidth="2"/><path d="M-8-11v6m16-6v6" stroke="#15292c" strokeWidth="3.5"/></>:null}
   </g>
  </g>
  <path d={`M${x-8} ${y-41}L${x-10} ${y-32} ${lx} ${ly}M${x+9} ${y-40}L${x+18} ${y-32}`} fill="none" stroke={artist?"#8f9470":"#76978b"} strokeWidth="3.5"/>
  <g transform={`translate(${lx} ${ly})`}><ellipse rx="3.1" ry="1.4" fill="#c9ac7e"/><g className={s.keyTap}><path d="m-1-1 3-1m-2 2 3-1" stroke="#ead09c" strokeWidth=".8"/></g></g>
  <g transform={`translate(${x+18} ${y-32})`}><g className={s.mouseArm}>
   <path d={`M0 0L${rx-x-18} ${ry-y+32}`} stroke={artist?"#8f9470":"#76978b"} strokeWidth="3.5"/>
   <g transform={`translate(${rx-x-18} ${ry-y+32})`}>
    <ellipse cy="1" rx="4.3" ry="2.5" fill="#172c30" stroke="#c4b589" strokeWidth=".6"/>
    <path d="m-3-1 4-1 2 2-3 1Z" fill="#cfb485" stroke="#e0c594" strokeWidth=".5"/><path className={s.mouseTap} d="M0-1h2" stroke="#f6d7a0"/>
   </g>
  </g></g>
 </g>;
}
function OfficeSeat(){return <>
 <Line a={[56,87,0]} b={[56,87,23]} stroke="#859483" width={2}/>
 {[[43,76,1],[70,76,1],[43,99,1],[71,99,1]].map((q,i)=><g key={i}><Line a={[56,87,5]} b={[q[0],q[1],q[2]]} stroke="#7c8f7b" width={1.6}/><Box u={q[0]-1} v={q[1]-1} w={3} d={3} h={2} top="#1a3033"/></g>)}
 <Box u={43} v={82} w={26} d={15} z={23} h={3} top="#7c8c70" front="#334e48"/>
 <Box u={44} v={91} w={24} d={4} z={26} h={20} top="#899b7c" front="#3b574e" side="#233c39"/>
 <Front u={47} v={95.2} z={42}><path d="M1 0h16m-16 3h16m-16 3h16m-16 3h16" stroke="#71917a" strokeWidth=".7" opacity=".6"/></Front>
 </>;}
function StudioBoards({gameTitle}:{gameTitle?:string}){return <>
 <Side v={103} z={103}>
  <rect width="89" height="51" fill="#152d34" stroke="#ad9869"/>
  <rect x="3" y="3" width="48" height="43" fill="#bdbd96"/>
  <g fill="none" stroke="#416b62" strokeWidth=".7">{gameTitle==="GRAND THEFT AUTO V"?<><path d="M7 11h40M7 20h40M7 30h40M15 7v35M27 7v35M39 7v35" stroke="#698879"/><path d="M8 36h8V21h23V12h8" stroke="#945c42" strokeWidth="1.3"/><circle cx="16" cy="36" r="2" fill="#aa744a"/><circle cx="39" cy="12" r="2" fill="#42675c"/><path d="M5 42q15-9 43-2" strokeWidth="2" opacity=".5"/></>:<path d="m7 36 9-15 8 6 7-19 17 30M9 42l10-12 10 6 15-20M29 34v-12l3-2v-7h7v13l6 4v12"/>}<path d="M7 6h16m-16 3h9M29 7h17M5 40h42" opacity=".6"/></g>
  {[6,19,32].map((y,i)=><g key={y}><rect x="57" y={y} width="25" height="9" fill={i===1?"#637a63":"#344f48"} stroke="#a6b08a" strokeWidth=".5"/><rect className={s.boardCue} style={{"--motion-phase":`${-i*1.6}s`} as CSSProperties} x="56" y={y-1} width="27" height="11" fill="#d5e4b1" fillOpacity=".24" stroke="#e7d9a7" strokeWidth="1.2"/><path d={`M61 ${y+3}h13m-13 3h9`} stroke="#c3c5a0" strokeWidth=".65"/>{i<2?<path d={`M69 ${y+9}v4`} stroke="#b5b888" strokeWidth=".65"/>:null}</g>)}
  <path d="M55 46h27" stroke="#bbab76"/><circle cx="5" cy="2" r="1" fill="#e0c18a"/>
 </Side>
 <Front u={9} v={.8} z={104}><rect width="71" height="18" fill="#2b443e" stroke="#999b74"/>{[0,1,2,3].map(i=><g key={i}><rect x={4+i*17} y="3" width="12" height="8" fill="#607460" stroke="#b1b38d" strokeWidth=".4"/><path d={`M${5+i*17} 14h10`} stroke="#c6bc8e" strokeWidth=".6"/></g>)}</Front>
 </>;}
function Studio({gameTitle}:{gameTitle?:string}){return <>
 <Wall/><StudioBoards gameTitle={gameTitle}/><Lamp u={23} v={52}/>
 <Desk u={13} v={35} w={83} d={35} h={43}/>
 <Line a={[17,38,31]} b={[89,38,31]} stroke="#758773" width={1.4}/>
 <WorkMonitor editor gameTitle={gameTitle}/><DeskInputs/>
 <Plane u={16} v={49} z={44.5}><rect width="10" height="17" fill="#c9c39b" stroke="#f0dbab" strokeWidth=".5"/><path d="M2 3h6m-6 3h5m-5 3h6m-6 3h3" stroke="#5a7966" strokeWidth=".7"/><path d="M10 4v11" stroke="#ad784d" strokeWidth="1.3"/></Plane>
 <Front u={90} v={58} z={52}><path d="M0 0h5v7H0Z" fill="#756448" stroke="#bba272"/><path d="M5 1q4 0 2 4H5" stroke="#bba272" fill="none"/></Front>
 <SeatedUser artist/><OfficeSeat/>
 </>;}
function CoverArt({index}:{index:number}){return <>
 <rect width="18" height="22" fill={["#6b7860","#435968","#905c46"][index]}/>
 {index===0?<><circle cx="13" cy="5" r="2.3" fill="#e0c796"/><path d="M0 22V14l4-2 2-7 3 5 3-1 3 5 3-2v10Z" fill="#203c3c"/><path d="M6 22v-6l3-2 3 2v6" fill="#b29967"/></>:index===1?<><circle cx="8" cy="9" r="5" fill="none" stroke="#9bbdb5" strokeWidth="1.5"/><path d="m2 22 4-9h5l5 9Z" fill="#172d38"/><path d="m8 7-2 2 2 4 3-5Z" fill="#cbd5ae"/></>:<><path d="m0 14 5-8 4 5 6-10 3 12v9H0Z" fill="#432d30"/><path d="m6 22 4-15 4 15" fill="#d2a064"/><path d="M3 18h12" stroke="#e8be86" strokeWidth=".5"/></>}
 <path d="M3 19h12m-10 2h8" stroke="#e6d4a6" strokeWidth=".55"/>
 </>;}
/** Editorial interpretation of the PS Store web hierarchy, inspected 7 October 2026.
 * Its light navigation, panoramic feature and separate action strip differ from Steam. */
function PlayStationStorefront({catalog=false}:{catalog?:boolean}){return <>
 <ellipse cx="110" cy="190" rx="88" ry="11" fill="#061318" opacity=".6"/>
 <g transform="matrix(1 .08 -.08 1 22 20)">
  <rect x="3" y="4" width="174" height="160" rx="4" fill="#050f17" opacity=".7"/>
  <rect width="174" height="160" rx="4" fill="#c4c8bc" stroke="#adab89" strokeWidth=".9"/>
  <path d="M4 0h166q4 0 4 4v9H0V4Q0 0 4 0" fill="#12202a"/>
  <text x="144" y="9" fill="#dee0d0" fontSize="6" fontFamily="Georgia,serif" letterSpacing="1">SONY</text>
  <path d="M0 14h174v20H0Z" fill="#d5d7c8"/>
  <text x="7" y="23" fill="#325570" fontSize="6.5" fontWeight="bold" fontFamily="Arial,sans-serif">{catalog?"PlayStation Plus":"PlayStation Store"}</text>
  <rect x="127" y="17" width="25" height="8" rx="4" fill="#3a6983"/><text x="132" y="22.5" fill="#ecedde" fontSize="4" fontFamily="Arial,sans-serif">Sign in</text>
  <circle cx="162" cy="21" r="2" fill="none" stroke="#46677a" strokeWidth=".7"/><path d="m163.5 22.5 2 2" stroke="#46677a" strokeWidth=".7"/>
  <rect x="36" y="28" width="21" height="7" rx="3.5" fill="#b4c0b6"/>
  <text x="40" y="33" fill="#354b51" fontSize="4.3" fontFamily="Arial,sans-serif">Latest</text>
  <text x="61" y="33" fill="#354b51" fontSize="4.3" fontFamily="Arial,sans-serif">Collections   Deals   Browse</text>
  <path d="M0 39h174" stroke="#9caeab" strokeWidth=".6"/>
  <svg x="0" y="43" width="174" height="58" viewBox="0 0 174 58" overflow="hidden">
   <rect width="174" height="58" fill="#283b4b"/>
   <g transform="translate(48 0) scale(2.44 1.94)"><ConsoleGameArt racing={false}/></g>
   <path d="M0 0h64l17 58H0Z" fill="#1b3040"/>
   <path d="M0 56h174" stroke="#d6b57b" strokeWidth=".6"/>
   <text x="8" y="21" fill="#e2d5ad" fontSize="8" fontWeight="bold" fontFamily="Arial,sans-serif">SPIDER-MAN</text>
   <text x="10" y="44" fill="#db9675" fontSize="23" fontFamily="Georgia,serif">2</text>
   <path d="M33 34h25m-25 4h19m-19 4h22" stroke="#829cac" strokeWidth=".7"/>
   <rect className={s.storeFocus} x="1" y="1" width="172" height="56" fill="none" stroke="#ede3bd" strokeWidth="1.2"/>
  </svg>
  <path d="M0 102h174v21H0Z" fill="#d3d4c1"/>
  <text x="8" y="111" fill="#293e46" fontSize="5.6" fontFamily="Arial,sans-serif">Marvel’s Spider-Man 2</text>
  <text x="8" y="118" fill="#587075" fontSize="4" fontFamily="Arial,sans-serif">{catalog?"PS5 · Game Catalog":"PS5 · Digital game"}</text>
  <rect x="121" y="107" width="45" height="11" rx="5.5" fill="#386d8b"/>
  <rect className={s.cartGlow} x="120" y="106" width="47" height="13" rx="6.5" fill="#a9d2e1" fillOpacity=".25" stroke="#719baa"/>
  <text x="132" y="114" fill="#eff0d9" fontSize="4.7" fontFamily="Arial,sans-serif">{catalog?"Download":"Buy game"}</text>
  {[0,1,2,3].map(i=><g key={i} transform={`translate(${7+i*41} 129)`}>
   <rect width="37" height="22" rx="2" fill={["#35525b","#687459","#685647","#385967"][i]} stroke="#728884" strokeWidth=".5"/>
   <g transform="translate(1 1) scale(1.85 .56)"><CoverArt index={i%3}/></g>
   <path d="M3 19h22" stroke="#d2ca9f" strokeWidth=".7"/>
  </g>)}
  <g transform="translate(144 125) scale(.7)"><g className={s.psPointer}><path d="m0 0 1 11 3-3 3 5 2-1-3-5 4-1Z" fill="#f6edd4" stroke="#254a5d" strokeWidth="1.2"/></g></g>
 </g>
</>;}
function DigitalStorefront({gameTitle="CYBERPUNK 2077",epic=false,platform,catalog=false}:{gameTitle?:string;epic?:boolean;platform?:"xbox"|"playstation";catalog?:boolean}){
 const headlines=platform==="xbox"||gameTitle==="FORZA HORIZON 5"?["FORZA HORIZON","5"]:platform==="playstation"?["SPIDER-MAN","2"]:epic?["CREATOR","GAMES"]:gameTitle==="CYBERPUNK 2077"?["CYBERPUNK","2077"]:["GRAND THEFT","AUTO V"];
 return <>
 <ellipse cx="109" cy="188" rx="88" ry="11" fill="#061318" opacity=".6"/>
 <g transform="matrix(1 .08 -.08 1 22 22)">
  <rect x="3" y="4" width="174" height="156" rx="5" fill="#050f17" opacity=".7"/>
  <rect width="174" height="156" rx="5" fill="#122a36" stroke="#a19d76" strokeWidth=".9"/>
  <path d="M0 16h174" stroke="#687e74" strokeWidth=".6"/>
  {[7,13,19].map((x,i)=><circle key={x} cx={x} cy="8" r="1.6" fill={["#bb835e","#b8a677","#81a896"][i]}/>)}
  <rect x="30" y="4" width="127" height="8" rx="3" fill="#0b1f2a" stroke="#6f8277" strokeWidth=".4"/>
  <text x="39" y="10" fill="#aebcab" fontSize="4.3" fontFamily="Arial,sans-serif">{platform==="xbox"?(catalog?"xbox.com / game-pass":"xbox.com / games / store"):platform==="playstation"?"store.playstation.com":epic?"store.epicgames.com":"store.steampowered.com"}</text>
  <text x="10" y="30" fill="#d4decd" fontSize="11" fontFamily="Arial,sans-serif" fontWeight="bold">{platform==="xbox"?"XBOX":platform==="playstation"?"PS":""}{!platform?(epic?"EPIC":"steam"):null}</text>
  <text x="49" y="28" fill="#9dbeb1" fontSize="4.8" fontFamily="Arial,sans-serif">{platform==="xbox"?(catalog?"GAME PASS   LIBRARY   SUPPORT":"STORE   GAMES   SUPPORT"):platform==="playstation"?"PLAYSTATION STORE   GAMES":"STORE   COMMUNITY   SUPPORT"}</text>
  <rect x="9" y="36" width="156" height="10" fill="#31514f" stroke="#607f70" strokeWidth=".4"/>
  <text x="14" y="43" fill="#c3ceb4" fontSize="4.5" fontFamily="Arial,sans-serif">Discover   Categories   New releases</text>
  <rect x="117" y="38" width="44" height="6" rx="1" fill="#19323b"/><circle cx="155" cy="40.5" r="1.3" fill="none" stroke="#9cc0af" strokeWidth=".5"/><path d="m156 42 1 1" stroke="#9cc0af" strokeWidth=".5"/>
  <rect x="9" y="52" width="156" height="50" fill="#0a1d29" stroke="#798b74" strokeWidth=".5"/>
  <g transform="translate(10 53) scale(1.96 1.6)"><AdventureArt gameTitle={gameTitle}/></g>
  <text x="115" y="60" fill="#e1cf99" fontSize="5.2" fontFamily="Arial,sans-serif">{headlines[0]}</text><text x="115" y="67" fill="#d2bd7b" fontSize="7" fontFamily="Arial,sans-serif">{headlines[1]}</text>
  <path d="M115 74h43m-43 3h38m-38 3h40" stroke="#729586" strokeWidth=".7"/>
  <rect x="114" y="87" width="45" height="9" rx="1" fill="#6d8760" stroke="#c2bc86" strokeWidth=".5"/><rect className={s.cartGlow} x="113" y="86" width="47" height="11" rx="1.5" fill="#e0e6ae" fillOpacity=".3" stroke="#e1e8b4" strokeWidth="1.4"/><text x="120" y="93" fontSize="4.8" fill="#edf0cd" fontFamily="Arial,sans-serif">{platform==="xbox"?(catalog?"Install game":"Buy game"):platform==="playstation"?"Buy game":"Add to cart"}</text>
  {[0,1,2].map(i=><g key={i} transform={`translate(${9+i*53} 109)`}><rect width="49" height="29" fill="#1d3840" stroke="#638676" strokeWidth=".4"/><g transform="translate(1 1) scale(2.6 .85)"><CoverArt index={i}/></g><path d="M3 23h23m7 0h11m-40 3h16" stroke="#9db297" strokeWidth=".6"/></g>)}
  <g className={s.storeFocus}><rect x="8" y="51" width="158" height="52" rx="1" fill="none" stroke="#c3d9a6" strokeWidth=".8"/></g>
  <path d="M9 146h155" stroke="#526e64" strokeWidth="2"/><g transform="translate(9 146)"><g className={s.downloadFill}><path d="M0 0h145" stroke="#a8c7a4" strokeWidth="3"/></g></g>
  <g className={s.deliveryReady}><circle cx="160" cy="146" r="4.3" fill="#bdd9ad"/><path d="m157.5 146 1.6 1.7 3-3.5" fill="none" stroke="#244739" strokeWidth="1.1"/></g>
  <g className={s.storePointer}><path d="m0 0 1 11 3-3 3 5 2-1-3-5 4-1Z" fill="#f5eac6" stroke="#112d34" strokeWidth="1.1"/></g>
 </g>
 </>;}
function PcCase({u=59,v=27,z=44,w=30,d=31,h=50,open=false}:{u?:number;v?:number;z?:number;w?:number;d?:number;h?:number;open?:boolean}){return <>
 <Box u={u} v={v} w={w} d={d} z={z} h={h} top="#526e60" front="#152e35" side="#29473f"/>
 <Front u={u+3} v={v+d+.2} z={z+h-4}>
  <rect width={w-6} height={h-8} fill="#0d252e" stroke="#81997b" strokeWidth=".8"/>
  <g transform={`translate(${(w-6)/2} ${h*.24})`}><FanWheel r={w*.26}/></g>
  <g transform={`translate(${(w-6)/2} ${h*.63})`}><FanWheel r={w*.26}/></g>
  <path d={`M3 ${h-6}h${w-12}`} stroke="#a9c4a1" strokeWidth=".8" className={s.pcLed}/>
 </Front>
 <SidePanel u={u+w+.2} v={v+d-2} z={z+h-4}>
  <rect width={d-4} height={h-8} fill={open?"#1b3b3a":"#26473f"} stroke="#a6b193" strokeWidth=".7"/>
  <rect x="3" y="3" width={d-10} height={h-19} fill="#385e4e" stroke="#6e9273" strokeWidth=".5"/>
  <path d={`M4 8h${d-12}m-${d-12} 6h${d-12}m-${d-12} 6h${d-12}`} stroke="#9caf77" strokeWidth=".5"/>
  <rect x="6" y="7" width="9" height="10" fill="#152e31" stroke="#b2b590" strokeWidth=".7"/>
  <path d={`M3 ${h-24}h${d-10}v6H3Z`} fill="#142d30" stroke="#a3ac7d" strokeWidth=".7"/>
  <path d={`M${d-9} 7v${h-18}q-5 7-11 1`} fill="none" stroke="#bb9766" strokeWidth="1.2"/>
  {!open?<path d={`M2 ${h-10} ${d-6} 2h-6L2 ${h-20}Z`} fill="#93b3a0" opacity=".14"/>:null}
 </SidePanel>
 {[u+3,u+w-5].map(a=><Box key={a} u={a} v={v+d-5} w={3} d={3} z={z-2} h={2} top="#8c9573" front="#172c2b"/>)}
 </>;}
function RetailMonitor({u,v,z=48}:{u:number;v:number;z?:number}){return <>
 <Top u={u+7} v={v+1} w={15} d={7} z={z} fill="#526e65"/>
 <Box u={u+12} v={v+1} w={3} d={3} z={z} h={7} top="#8a9981"/>
 <Front u={u} v={v+4} z={z+30}><rect x="-1" y="-1" width="31" height="21" rx="1" fill="#132a33" stroke="#a6b196" strokeWidth=".8"/><g transform="scale(.56 .62)"><AdventureArt/></g><rect className={s.demoGlow} x="0" y="0" width="29" height="18.6" fill="#c7deac" fillOpacity=".18" stroke="#dbdfb2" strokeWidth=".8"/></Front>
</>;}
function Hardware(){return <>
 <Wall/><Lamp u={26} v={52}/>
 <Side v={103} z={104}><rect width="88" height="16" fill="#1a383d" stroke="#b2a473"/><text x="9" y="11" fontSize="8" fontFamily="Arial,sans-serif" letterSpacing="1.3" fill="#ddd2ac">COMPUTERS</text></Side>
 <Box u={4} v={13} w={24} d={82} h={34} top="#677d6a" front="#294440" side="#1a3437"/>
 <g style={{"--motion-phase":"0s"} as CSSProperties}><RetailMonitor u={2} v={23} z={35}/></g><g style={{"--motion-phase":"-2.8s"} as CSSProperties}><RetailMonitor u={2} v={66} z={35}/></g>
 <SidePanel u={28.4} v={88} z={29}>{[0,1,2].map(i=><g key={i} transform={`translate(${i*23} 0)`}><rect width="19" height="22" fill="#8a8766" stroke="#b8b08a" strokeWidth=".5"/><rect x="4" y="5" width="11" height="8" fill="#314e49"/><path d="M4 17h11m-9 3h7" stroke="#cdc397" strokeWidth=".6"/></g>)}</SidePanel>
 <Front u={35} v={1} z={102}><rect width="64" height="22" fill="#2b4747" stroke="#8b9a7e"/><text x="5" y="10" fontSize="5" fill="#d4d0a6" fontFamily="Arial,sans-serif">DESKTOPS · LAPTOPS</text><path d="M6 15h48m-48 3h27" stroke="#84a794" strokeWidth=".6"/></Front>
 <Box u={49} v={13} w={48} d={23} h={34} top="#75836a" front="#2b4745"/>
 <Plane u={53} v={20} z={35}><rect width="24" height="15" rx="1" fill="#809689" stroke="#c1c5a1" strokeWidth=".6"/><path d="M3 3h18m-18 3h18m-18 3h18m-12 3h6" stroke="#385650" strokeWidth=".8"/></Plane>
 <Front u={53} v={20} z={50}><rect width="24" height="15" rx="1" fill="#122c36" stroke="#c1c5a1" strokeWidth=".8"/><path d="M2 12 11 3l6 5 5-3v8H2" fill="#658774"/></Front>
 <Box u={83} v={20} w={10} d={13} z={35} h={24} top="#718674" front="#203b41" side="#415f55"/><Front u={84} v={33.2} z={56}><path d="M1 2h6m-6 3h6m-6 3h6" stroke="#91b1a0" strokeWidth=".55"/><circle cx="4" cy="15" r=".8" fill="#c7d9a9" className={s.pcLed}/></Front>
 <Box u={40} v={65} w={61} d={24} h={37} top="#8c8762" front="#304743" side="#213a3b"/>
 <Front u={44} v={89.2} z={29}><rect width="51" height="20" fill="#1c3538" stroke="#b29e6c" strokeWidth=".55"/><text x="9" y="13" fontFamily="Arial,sans-serif" fontSize="7" letterSpacing="1" fill="#cbb78a">PC STORE</text></Front>
 <Box u={46} v={72} w={13} d={8} z={38} h={2} top="#273e41"/>
 <Front u={47} v={75} z={51}><rect width="11" height="12" rx="1" fill="#19343c" stroke="#9cae8c" strokeWidth=".6"/><rect x="2" y="2" width="7" height="5" fill="#72917a"/><path d="M3 4h5" stroke="#d3e1b6" className={s.pcLed}/><g className={s.terminalReady}><rect x="1.5" y="1.5" width="8" height="6" fill="#b7d9a2"/><path d="m3 4 1.6 1.5L8 3" fill="none" stroke="#25463d" strokeWidth="1"/></g><path d="M2 9h7" stroke="#acae87"/></Front>
 <Box u={72} v={71} w={23} d={14} z={38} h={17} top="#b4a173" front="#867950" side="#666e4c"/>
 <Plane u={72} v={71} z={55.2}><path d="M11 0v14" stroke="#dccb97" strokeWidth="3"/></Plane>
 <Front u={76} v={85.2} z={51}><rect width="13" height="8" fill="#d2c69e"/><path d="M2 2h8m-8 2h8m-8 2h5" stroke="#526b55" strokeWidth=".7"/></Front>
 </>;}
function HomeWindow(){return <Side v={103} z={104}>
 <rect x="-3" y="-3" width="82" height="55" fill="#4c5746" stroke="#b1a374"/>
 <rect width="76" height="49" fill="#163541" stroke="#a8b79a" strokeWidth=".7"/>
 <circle cx="56" cy="10" r="5" fill="#bfd0b4"/>
 <g className={s.pcCloud}><path d="M5 15q3-5 8-3 3-6 9-2 5-1 7 5H5Zm29 15q2-4 7-3 4-6 10-2 7-1 10 5H34Z" fill="#5d7b80" opacity=".65"/></g>
 <path d="M0 40 9 34h9v-8h8v9h12V22h5v11h12v-4h13v11h8v9H0Z" fill="#0c2630"/>
 <path d="M21 31v3m20-6v3m17 4v3m5-5v3M8 40v3" stroke="#c7b282" strokeWidth="1.2" opacity=".65"/>
 <svg x="2" y="13" width="72" height="34" viewBox="0 0 72 34" overflow="hidden"><g className={s.pcRainField} fill="none" stroke="#c6e0cf" strokeWidth=".65">{Array.from({length:18},(_,i)=><path key={i} className={s.pcRain} d={`M${5+(i*17)%79} -12l-1.4 7`} style={{animationDelay:`${-i*.193}s`,animationDuration:`${1.2+(i%4)*.21}s`}}/>)}</g></svg>
 <rect x="1" y="1" width="74" height="12" fill="#42574f"/>
 <path d="M1 3h74m-74 4h74m-74 4h74" stroke="#9aab8d" strokeWidth="1.2"/>
 <path d="M1 13h74" stroke="#1b3437" strokeWidth="1.5"/>
 <path d="M38 1v47M1 48h74" stroke="#b3b496" strokeWidth="2"/><path d="M74 12v34l-1 2" stroke="#baad7d" strokeWidth=".6"/>
 </Side>;}
function HomePlant(){return <>
 <Box u={90} v={85} w={12} d={12} h={13} top="#baaa78" front="#80674b" side="#635d43"/>
 <Line a={[96,91,13]} b={[95,91,42]} stroke="#899d6e" width={1.4}/>
 {[[87,89,36],[103,91,39],[91,86,29],[104,95,27]].map(([u,v,z],i)=>{const [x,y]=p(u,v,z),[a,b]=p(95,91,z-8);return <g key={i}><path d={`M${a} ${b}Q${x} ${b-8} ${x} ${y}`} fill="none" stroke="#91a278"/><path d={`M${x} ${y}q${i%2?9:-9} -4 ${i%2?7:-7} 4q${i%2?-7:7} 4 ${i%2?-7:7}-4Z`} fill={i%2?"#7a986e":"#527d65"} stroke="#a5b184" strokeWidth=".45"/></g>;})}
 </>;}
function HomeDeskLamp(){
 const [baseX,baseY]=p(20,61,44),[jointX,jointY]=p(18,61,62),[headX,headY]=p(26,61,76);
 return <g>
  <Plane u={14} v={49} z={44.2}><ellipse cx="9" cy="9" rx="9" ry="8" fill="#e4c183" opacity=".12" className={s.pcDeskLight}/></Plane>
  <ellipse cx={baseX} cy={baseY+1} rx="6" ry="2.4" fill="#233b3b" stroke="#9a9e79" strokeWidth=".8"/>
  <ellipse cx={baseX} cy={baseY} rx="5.5" ry="1.7" fill="#667c68"/>
  <path d={`M${baseX} ${baseY-1}L${jointX} ${jointY} ${headX} ${headY-2}`} fill="none" stroke="#c2b18a" strokeWidth="1.8"/>
  <circle cx={jointX} cy={jointY} r="2" fill="#36524d" stroke="#c2b18a" strokeWidth=".75"/>
  <g transform={`translate(${headX} ${headY})`}>
   <path d="M-5 3q0-7 5-7t6 7Z" fill="#6d8675" stroke="#bbba91" strokeWidth=".8"/>
   <path d="M-3-1q1-2 3-2" fill="none" stroke="#9cb5a0" strokeWidth=".65"/>
   <ellipse cy="3" rx="5.5" ry="1.5" fill="#263f3d" stroke="#bbba91" strokeWidth=".6"/>
   <ellipse cy="3.3" rx="4" ry=".8" fill="#ecd3a0"/>
  </g>
 </g>;
}
function GamingSeat(){return <>
 <Line a={[56,87,2]} b={[56,87,24]} stroke="#75887b" width={2.8}/>
 {[[40,78,1],[64,70,1],[75,88,1],[57,105,1],[37,98,1]].map((q,i)=><g key={i}><Line a={[56,87,5]} b={[q[0],q[1],q[2]+1]} stroke="#718778" width={1.8}/><Box u={q[0]-1.5} v={q[1]-2} w={4} d={4} h={3} top="#344b46" front="#12272b" side="#142a2d"/></g>)}
 <Box u={41} v={77} w={30} d={21} z={23} h={4} top="#283e40" front="#192f33" side="#182d32"/>
 <Box u={40} v={78} w={4} d={18} z={27} h={4} top="#8b6553" front="#684c43"/>
 <Box u={68} v={78} w={4} d={18} z={27} h={4} top="#8b6553" front="#684c43"/>
 <Line a={[39,80,26]} b={[39,80,36]} stroke="#677c71" width={1.5}/><Box u={37} v={72} w={5} d={16} z={35} h={2} top="#53675a"/>
 <Line a={[74,80,26]} b={[74,80,36]} stroke="#677c71" width={1.5}/><Box u={71} v={72} w={5} d={16} z={35} h={2} top="#53675a"/>
 <Front u={42} v={96} z={67}>
  <path d="M2 43-1 20l4-8 3-10q8-4 16 0l3 10 4 8-3 23Z" fill="#101f26" stroke="#8d9980" strokeWidth=".8"/>
  <path d="m6 3-2 11-3 7 3 19 5-3-2-15 2-9V4Zm16 0 2 11 3 7-3 19-5-3 2-15-2-9V4Z" fill="#8b6250" stroke="#b69472" strokeWidth=".6"/>
  <path d="M10 4q4-1 8 0l1 8-2 5H11l-2-5Z" fill="#3b5150"/>
  <path d="M9 20q5-3 10 0l-1 15q-4 3-8 0Z" fill="#2c4343" stroke="#617469" strokeWidth=".6"/>
  <path d="M9 39q5-3 10 0l2 3H7Z" fill="#55685d"/>
  <path d="M8 11h4v3H8Zm8 0h4v3h-4Z" fill="#0a1d23" stroke="#bba17c" strokeWidth=".6"/>
  <path d="m5 18-2 4 2 14m18-18 2 4-2 14M12 22v10m4-10v10" fill="none" stroke="#b3a183" strokeWidth=".45" strokeDasharray="1 1.3"/>
 </Front>
 </>;}
function PcHome({gameTitle}:{gameTitle?:string}){return <>
 <Wall/><HomeWindow/>
 <Top u={19} v={69} w={64} d={35} z={.3} fill="#394e46" stroke="#ae966b"/>
 {[0,1,2].map(i=><Line key={i} a={[21,73+i*12,.4]} b={[81,73+i*12,.4]} stroke="#b6a172" opacity={.34}/>)}
 <Front u={18} v={.8} z={102}><rect width="36" height="24" fill="#b2aa82" stroke="#8b855f"/><path d="M2 22 14 6l7 10 8-7 5 13Z" fill="#31504c"/><circle cx="26" cy="6" r="3" fill="#d7bc89"/><path d="m9 22 6-10 4 7" fill="none" stroke="#8fab90" strokeWidth=".7"/></Front>
 <Desk u={13} v={35} w={83} d={35} h={43}/><WorkMonitor gameTitle={gameTitle}/><DeskInputs/>
 <PcCase u={79} v={42} z={3} w={20} d={22} h={34}/>
 <Line a={[65,42,43]} b={[83,43,34]} stroke="#101e25" width={1.2}/>
 <HomeDeskLamp/>
 <SeatedUser/><GamingSeat/><HomePlant/>
 </>;}

function Store({catalog=false,gameTitle}:{catalog?:boolean;gameTitle?:string}){if(!catalog)return <DigitalStorefront gameTitle={gameTitle}/>;return <><Wall/><Lamp u={45} v={50}/><Top u={17} v={42} w={83} d={41} fill="#142929" stroke="#142929"/><Box u={40} v={50} w={40} d={21} h={5} top="#5d6046"/><Box u={55} v={55} w={11} d={7} z={5} h={32} top="#667050"/><Box u={14} v={42} w={88} d={5} z={29} h={68} top="#576044" front="#10262c" side="#354a41"/><Front u={19} v={47.2} z={89}><rect width="78" height="50" fill={catalog?"#292f2c":"#253f3c"}/><path d="M3 4h22m6 0h8m6 0h8" stroke={catalog?"#cc8566":teal} strokeWidth="1.5"/>{[0,1,2].map(i=><g key={i} transform={`translate(${3+i*25} 10)`}><rect width="22" height="30" fill={["#626841","#465b65","#7d503c"][i]} stroke="#ad9b6e" strokeWidth=".5"/><path d={i===0?"M0 28 7 10l6 9 9-11v22H0Z":i===1?"M2 30 12 7l6 12 4-3v14Z":"M2 30 7 14l7-6 6 14 2 8Z"} fill="#14282b"/><circle cx="16" cy="7" r="2" fill="#d7bc83"/><path d="M1 34h18m-18 3h12" stroke="#abaf8a" strokeWidth=".8"/></g>)}<path d="M4 47h69" stroke={catalog?"#bd7856":teal} className={s.screenGlow}/></Front><Line a={[27,75,0]} b={[94,75,0]} stroke="#96a87c" opacity={.4}/></>;}
function Home({viewer=false}:{viewer?:boolean}){return <><Wall/><WallPrint window/><Lamp u={75} v={23}/>{viewer?<><Desk u={28} v={22} w={70} d={21} h={35}/><Monitor u={35} v={28} z={35}/><Box u={22} v={75} w={65} d={24} z={4} h={18} top="#64735b"/><Box u={18} v={73} w={7} d={30} z={4} h={32} top="#7b8060"/><Box u={84} v={73} w={7} d={30} z={4} h={32} top="#7b8060"/><Figure u={56} v={89} scale={.96} back/><Box u={22} v={99} w={65} d={6} z={6} h={37} top="#788064" front="#3e574d"/></>:<><Desk/><Monitor game/><Keyboard/><Figure u={52} v={83} scale={.99} back/><Chair u={37} v={79}/></>}<Box u={88} v={82} w={11} d={11} h={13} top="#8e8056" front="#8a6c49"/>{[0,1,2].map(i=><Line key={i} a={[93,87,13]} b={[88+i*5,83+i*4,34-i*3]} stroke="#86a17b" width={2}/>)}<Line a={[88,83,34]} b={[83,83,28]} stroke="#86a17b" width={2}/><Line a={[98,91,28]} b={[103,91,32]} stroke="#86a17b" width={2}/></>;}
function Servers({network=false}:{network?:boolean}){return <><Wall/><Line a={[1,95,97]} b={[1,1,97]} stroke="#89b5a4" opacity={.5}/><Line a={[1,1,97]} b={[105,1,97]} stroke="#89b5a4" opacity={.5}/>{[0,1,2].map(i=>{const u=13+i*30,v=30;return <g key={i}><Box u={u} v={v} w={25} d={33} h={85} top="#55654e" front="#142e34" side="#263c3c"/><Front u={u+3} v={v+33.2} z={79}>{[0,1,2,3,4,5].map(j=><g key={j}><rect y={j*12} width="19" height="9" fill="#2c4540" stroke="#81947a" strokeWidth=".5"/><path d={`M3 ${4+j*12}h8`} stroke="#809880"/><circle cx="15" cy={4+j*12} r="1.1" fill={j%2?teal:"#d5bb78"} className={j===i?s.signal:undefined}/></g>)}</Front><Line a={[u+12,v+34,1]} b={[u+12,79,1]} stroke="#b89d68" width={1.2}/></g>;})}<Line a={[25,79,1]} b={[86,79,1]} stroke="#b89d68" width={1.2}/>{network?<Front u={36} v={2} z={110}><path d="M0 18V1m-10 7q10-10 20 0m-15 5q5-5 10 0" stroke={teal} fill="none"/></Front>:null}</>;}
function Film(){const [x,y]=p(24,73,47);const tripod:Point[]=[[10,63,0],[35,68,0],[25,91,0]];return <><Wall/><Front u={25} v={2} z={96}><rect width="75" height="64" fill="#65705a" stroke="#b9ac7b"/><g transform="translate(5 5) scale(1.35 1.7)"><ScreenArt/></g></Front><Lamp u={8} v={73}/><Line a={[17,24,0]} b={[17,24,81]} width={2} stroke="#92a48e"/><Line a={[7,18,0]} b={[17,24,24]} width={2}/><Line a={[28,27,0]} b={[17,24,24]} width={2}/><Box u={11} v={18} w={13} d={12} z={77} h={9} top="#b5a479"/><Line a={[24,73,0]} b={[24,73,49]} stroke="#95a48b" width={2}/>{tripod.map((q,i)=><Line key={i} a={q} b={[24,73,27]} stroke="#a4a487" width={2}/>)}<g transform={`translate(${x-12} ${y-14})`}><path d="M0 0h27v20H0Z" fill="#354d47" stroke={brass}/><path d="m27 5 11-4v16l-11-4Z" fill="#5b6c55" stroke={brass}/>{[5,23].map(cx=><g key={cx} transform={`translate(${cx} -5)`}><circle r="9" fill="#10242a" stroke="#b9a875"/><g className={s.fan}><circle r="2.5" fill="#c3b786"/>{[0,1,2].map(j=><circle key={j} cy="-5.5" r="1.8" transform={`rotate(${j*120})`} fill="#5c796c"/>)}</g></g>)}</g><Figure u={58} v={94} scale={1.02}/></>;}

function PublisherOffice({gameTitle}:{gameTitle?:string}){return <>
 <Wall/><Lamp u={23} v={52}/>
 <Side v={103} z={103}><rect width="86" height="57" fill="#172e33" stroke="#baab7c"/><text x="7" y="10" fontFamily="Arial,sans-serif" fontSize="6.8" fill="#d2c396">RELEASE PLANNING</text>{[0,1,2,3].map(i=><g key={i}><path d={`M7 ${18+i*9}h70`} stroke="#6b8371" strokeWidth=".6"/><rect x={12+i*11} y={15+i*9} width={27-i*3} height="5" fill="#3c554d"/><g transform={`translate(${12+i*11} ${15+i*9})`}><rect className={s.releaseBar} style={{"--motion-phase":`${-i*.7}s`} as CSSProperties} width={27-i*3} height="5" fill={i%2?"#d3b77d":"#9dcab1"}/></g></g>)}<g transform="translate(11 13)"><g className={s.releaseMarker}><rect x="-3" width="6" height="38" fill="#decc93" opacity=".1"/><path d="M0 0v38m-2-1 2 3 2-3" fill="none" stroke="#f3dba4" strokeWidth="1.3"/></g></g></Side>
 <Front u={14} v={1} z={101}><rect width="72" height="46" fill="#313e36" stroke="#baab7c"/><rect x="4" y="4" width="28" height="37" fill="#6e7559"/><circle cx="24" cy="12" r="4" fill="#c9b47e"/>{gameTitle==="FORZA HORIZON 5"||gameTitle==="SPIDER-MAN 2"?<g transform="translate(4 5) scale(.54 1.17)"><ConsoleGameArt racing={gameTitle==="FORZA HORIZON 5"} editor/></g>:gameTitle==="GRAND THEFT AUTO V"?<g><path d="M5 33v-9h5v-4h5v10h4V18h6v10h6v13H5Z" fill="#243f3b"/><path d="m13 41 7-12 7 12" fill="#a19868"/><path d="M9 34 10 17m0 0-5-2m5 2 5-3m-5 3-4 2m4-2 4 2" stroke="#243e32" strokeWidth="1.2"/><path d="M20 32v2m0 3v3" stroke="#dfc693"/></g>:<path d="M5 37 14 19l7 8 10-13v27H5Z" fill="#213d3b"/>}<text x="38" y="13" fontSize="5" fill="#d8cba1" fontFamily="Arial,sans-serif">CAMPAIGN</text><path d="M38 20h28m-28 5h22m-22 5h25m-25 5h14" stroke="#a0b08e"/><rect className={s.campaignLight} x="3" y="3" width="30" height="39" fill="#f2d096" fillOpacity=".15" stroke="#ecd09a" strokeWidth="1.4"/>{[0,1,2].map(i=><path key={i} className={s.campaignTick} style={{"--motion-phase":`${-i*.6}s`} as CSSProperties} d={`m38 ${22+i*7} 2 2 4-4`} fill="none" stroke="#d7e6b9" strokeWidth="1.5"/>)}</Front>
 <Desk u={14} v={41} w={79} d={36} h={41}/>
 <Plane u={21} v={46} z={42}><rect width="25" height="19" fill="#c5bb91"/><path d="M3 4h18m-18 4h18m-18 4h12" stroke="#4b6d5c"/><rect x="36" y="4" width="24" height="20" fill="#6b7c63" stroke="#b0b08a"/><path d="M39 8h18m-18 4h10m-10 4h14" stroke="#c9c095"/><circle cx="19" cy="15" r="2" fill="#9d684e"/></Plane>
 <Box u={80} v={20} w={16} d={15} h={38} top="#7d8060"/><Front u={82} v={35.1} z={33}><path d="M0 0h12m-12 10h12m-12 10h12" stroke="#b5aa7a"/><path d="M4 5h4m-4 10h4m-4 10h4" stroke="#ddc690"/></Front>
 <SeatedUser artist/><OfficeSeat/>
 </>;}


type ConsolePlatform = "xbox" | "playstation";
function ConsoleUnit({u,v,z=0,platform}:{u:number;v:number;z?:number;platform:ConsolePlatform}){return <g>
 <Box u={u} v={v} w={15} d={20} z={z} h={35} top={platform==="xbox"?"#52694d":"#414e4b"} front="#132a30" side="#263d3e"/>
 {platform==="xbox"?<>
  <Plane u={u+2} v={v+2} z={z+35.2}>{[0,1,2,3].map(i=><g key={i}>{[0,1,2,3].map(j=><circle key={j} cx={1+i*3} cy={2+j*4} r="1" fill="#172d2c"/>)}</g>)}</Plane>
  <Front u={u+1} v={v+20.2} z={z+32}><circle cx="10" cy="2" r="1.3" fill="#bed6a0" className={s.pcLed}/><path d="M2 10v17" stroke="#050f18" strokeWidth="1.2"/><path d="M2 29h9" stroke="#758c71" strokeWidth=".5"/></Front>
 </>:<>
  <Front u={u-1} v={v+20.3} z={z+37}><path d="M0 0q4 2 4 9v21l-2 9H0q1-16 0-39Zm17 0q-4 2-4 9v21l2 9h2q-1-16 0-39Z" fill="#c7c6ae" stroke="#e0d9b9" strokeWidth=".6"/><path d="M5 9v24m7-24v24" stroke="#85b6bf" strokeWidth=".7" className={s.pcLed}/></Front>
  <Line a={[u,v,36+z]} b={[u,v+20,36+z]} stroke="#d9d3b9" width={1.5}/>
 </>}
 </g>;}
function Controller({light=false}:{light?:boolean}){return <g>
 <path d="M-8-3q-3 2-3 8 0 3 3 1l4-3h8l4 3q3 2 3-1 0-6-3-8Z" fill={light?"#c2c5b2":"#263e3f"} stroke="#aeb798" strokeWidth=".65"/>
 <path d="M-6-1v4m-2-2h4" stroke={light?"#374e51":"#c6c8a1"} strokeWidth="1"/>
 <circle cx="5" cy="0" r=".8" fill="#9bbb95"/><circle cx="8" cy="2" r=".8" fill="#b58c6d"/><circle cx="0" cy="2" r="1.1" fill="#101f29"/>
 </g>;}
function ConsoleHardware({platform}:{platform:ConsolePlatform}){return <>
 <Wall/><Lamp u={23} v={52}/>
 <Side v={103} z={104}><rect width="88" height="20" fill="#1a383d" stroke="#b2a473"/><text x="8" y="13" fontSize="8" fontFamily="Arial,sans-serif" fill="#ddd2ac">{platform==="xbox"?"XBOX SERIES X":"PLAYSTATION 5"}</text></Side>
 <Box u={6} v={18} w={27} d={77} h={31} top="#6d806c" front="#294541"/>
 {[28,70].map(v=><ConsoleUnit key={v} u={10} v={v} z={32} platform={platform}/>)}
 <Front u={41} v={1} z={101}><rect width="61" height="38" fill="#425f5b" stroke="#c2b484"/><g transform="translate(3 3) scale(1.05 .98)"><ConsoleGameArt racing={platform==="xbox"} editor/></g></Front>
 <Box u={47} v={15} w={45} d={18} h={31} top="#7d856c" front="#304b45"/>
 <Plane u={52} v={21} z={32}><g transform="translate(14 4)"><Controller light={platform==="playstation"}/></g></Plane>
 <Box u={39} v={67} w={62} d={26} h={34} top="#8c8762" front="#2c4644" side="#213a3b"/>
 <Front u={43} v={93.2} z={28}><rect width="54" height="20" fill="#18333a" stroke="#b29e6c"/><text x="5" y="13" fontSize="7" fontFamily="Arial,sans-serif" fill="#d6c79e">CONSOLE STORE</text></Front>
 <Box u={68} v={72} w={24} d={16} z={35} h={25} top="#999e80" front="#4d6860" side="#3b554f"/>
 <Front u={70} v={88.2} z={57}><rect width="20" height="20" fill="#aeb391"/><path d={platform==="xbox"?"M7 3h7v14H7Z":"M6 2q4 4 1 15h9q-3-11 1-15Z"} fill="#2b464a"/><path d="M3 19h14" stroke="#4b6352"/></Front>
 <Front u={44} v={78} z={48}><rect width="13" height="13" rx="1" fill="#183039" stroke="#a6af8d"/><rect x="2" y="2" width="9" height="6" fill="#597c69"/><g className={s.terminalReady}><path d="m3 5 2 2 5-4" fill="none" stroke="#d9e3b4" strokeWidth="1.4"/></g><path d="M3 10h7" stroke="#9b9c73"/></Front>
 </>;}
function ConsoleHome({platform}:{platform:ConsolePlatform}){
 const [x,y]=p(60,84);
 return <>
 <Wall/><HomeWindow/>
 <Top u={17} v={48} w={78} d={58} z={.3} fill="#405449"/>
 {[52,58,96,102].map(v=><Line key={v} a={[19,v,.4]} b={[92,v,.4]} stroke="#b3a271" opacity={.4}/>)}
 <Box u={18} v={4} w={81} d={28} h={23} top="#80806a" front="#334b45" side="#223b3c"/>
 <Front u={23} v={32.2} z={19}><path d="M0 0h68v12H0Zm34 0v12" fill="none" stroke="#859273"/><path d="M11 5h8m30 0h8" stroke="#c9b985"/></Front>
 <ConsoleUnit u={81} v={9} z={24} platform={platform}/>
 <Front u={15} v={8} z={99}><rect x="-2" y="-2" width="75" height="48" rx="1.5" fill="#11262e" stroke="#a8b195" strokeWidth="1"/><g transform="scale(1.36 1.4)"><ConsoleGameArt racing={platform==="xbox"}/></g><path d="M4 44h57" stroke="#b1ba91" strokeWidth=".5"/><circle cx="67" cy="44" r=".8" fill="#9fc7ad" className={s.pcLed}/></Front>
 <Box u={30} v={71} w={60} d={25} z={4} h={17} top="#697a64" front="#354d44"/>
 <Box u={25} v={70} w={6} d={32} z={4} h={29} top="#909475" front="#4c6454"/>
 <Box u={90} v={70} w={6} d={32} z={4} h={29} top="#909475" front="#4c6454"/>
 <g transform={`translate(${x} ${y})`}>
  <path d="m-7-20-5 14 6 2 7-13 6 13 7-2-6-15" fill="#233a3d" stroke="#82947a" strokeWidth="1"/>
  <path d="M-10-49q10-5 20 0l3 28h-25Z" fill="#6b806b" stroke="#a7b28b" strokeWidth=".7"/>
  <path d="M-4-52v-7h8v7" stroke="#c6a980" strokeWidth="3"/>
  <path d="M-7-64q0-9 8-8 8 1 6 11l-3 7-7-1Z" fill="#34463e" stroke="#a89c77" strokeWidth=".7"/>
  <path d="m-9-44-4 10 9 3m13-13 4 10-9 3" fill="none" stroke="#9da987" strokeWidth="3"/>
  <g transform="translate(0 -32)"><Controller light={platform==="playstation"}/><path d="M-7-1h2m10 1h2" stroke="#e5c599" strokeWidth="2"/><g className={s.keyTap}><circle cx="-5" cy="0" r="1" fill="#f1d2a4"/><circle cx="6" cy="1" r="1" fill="#f1d2a4"/></g></g>
 </g>
 <Box u={31} v={97} w={59} d={5} z={8} h={35} top="#8d9577" front="#3c594e" side="#2c433d"/>
 <Front u={35} v={102.2} z={39}><path d="M0 0h50m-34 0v24m17-24v24" stroke="#718a71" strokeWidth=".65"/></Front>
 </>;
}

/** Deterministic geometry. CSS animates only lifecycle-gated screen/mechanical details. */
export const CircuitVignette = memo(function CircuitVignette({kind,gameTitle,catalogAccess=false}:{kind:CircuitScene;gameTitle?:string;catalogAccess?:boolean}){
 return <g strokeLinejoin="round" strokeLinecap="round"><Floor/>{kind==="playstation-store"?<PlayStationStorefront catalog={catalogAccess}/>:kind==="xbox-store"?<DigitalStorefront platform="xbox" gameTitle="FORZA HORIZON 5" catalog={catalogAccess}/>:kind==="xbox-hardware"||kind==="playstation-hardware"?<ConsoleHardware platform={kind==="xbox-hardware"?"xbox":"playstation"}/>:kind==="xbox-home"||kind==="playstation-home"?<ConsoleHome platform={kind==="xbox-home"?"xbox":"playstation"}/>:kind==="factory"?<Factory/>:kind==="operator"?<Operator/>:kind==="bar"?<Bar/>:kind==="arcade-player"?<ArcadePlayers/>:kind==="studio"||kind==="engine"?<Studio gameTitle={gameTitle}/>:kind==="epic-store"?<DigitalStorefront epic/>:kind==="publisher"?<PublisherOffice gameTitle={gameTitle}/>:kind==="store"?<Store gameTitle={gameTitle}/>:kind==="hardware"?<Hardware/>:kind==="pc-home"?<PcHome gameTitle={gameTitle}/>:kind==="home"?<Home/>:kind==="servers"?<Servers/>:kind==="film"?<Film/>:kind==="catalog"?<Store catalog/>:kind==="network"?<Servers network/>:<Home viewer/>}</g>;
});
