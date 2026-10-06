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
function Monitor({u=38,v=48,z=43}:{u?:number;v?:number;z?:number}){return <g><Top u={u+17} v={v-2} w={20} d={11} z={z+.5} fill="#43584b"/><Front u={u} v={v} z={z+43}><path d="M0 0h56v37H0Z" fill="#0c1a20" stroke="#bba47a"/><g transform="translate(4 4)"><ScreenArt/></g><path d="M23 37v7h10v-7" fill="#4a5b4b" stroke="#8d9574"/></Front></g>;}
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
function Studio(){return <><Wall/><WallPrint/><Lamp u={27} v={55}/><Desk/><Monitor/><Keyboard/><Box u={83} v={40} w={14} d={23} h={29} top="#4c5944"/><Figure u={52} v={83} scale={.99} back/><Chair u={37} v={79}/></>;}
function Store({catalog=false}:{catalog?:boolean}){return <><Wall/><Lamp u={45} v={50}/><Top u={17} v={42} w={83} d={41} fill="#142929" stroke="#142929"/><Box u={40} v={50} w={40} d={21} h={5} top="#5d6046"/><Box u={55} v={55} w={11} d={7} z={5} h={32} top="#667050"/><Box u={14} v={42} w={88} d={5} z={29} h={68} top="#576044" front="#10262c" side="#354a41"/><Front u={19} v={47.2} z={89}><rect width="78" height="50" fill={catalog?"#292f2c":"#253f3c"}/><path d="M3 4h22m6 0h8m6 0h8" stroke={catalog?"#cc8566":teal} strokeWidth="1.5"/>{[0,1,2].map(i=><g key={i} transform={`translate(${3+i*25} 10)`}><rect width="22" height="30" fill={["#626841","#465b65","#7d503c"][i]} stroke="#ad9b6e" strokeWidth=".5"/><path d={i===0?"M0 28 7 10l6 9 9-11v22H0Z":i===1?"M2 30 12 7l6 12 4-3v14Z":"M2 30 7 14l7-6 6 14 2 8Z"} fill="#14282b"/><circle cx="16" cy="7" r="2" fill="#d7bc83"/><path d="M1 34h18m-18 3h12" stroke="#abaf8a" strokeWidth=".8"/></g>)}<path d="M4 47h69" stroke={catalog?"#bd7856":teal} className={s.screenGlow}/></Front><Line a={[27,75,0]} b={[94,75,0]} stroke="#96a87c" opacity={.4}/></>;}
function Hardware(){return <><Wall/><Lamp u={24} v={59}/><Box u={26} v={28} w={53} d={49} h={5} top="#273a34"/><Box u={28} v={30} w={49} d={44} z={5} h={89} top="#52634c" front="#152f34" side="#243c3b"/><Front u={32} v={74.2} z={86}><rect width="41" height="71" fill="#102429" stroke="#839575"/>{[19,53].map(y=><g key={y} transform={`translate(21 ${y})`}><circle r="15" fill="#122329" stroke="#8d9b79"/><g className={s.fan}>{[0,1,2,3,4].map(i=><path key={i} d="M0-3Q-13-17-5-13L2-4Z" fill="#567e72" transform={`rotate(${i*72})`}/>)}</g><circle r="3" fill="#bca06b"/></g>)}<path d="M4-4h32" stroke={teal} className={s.screenGlow}/></Front><Quad points={[[77.2,34,81],[77.2,67,81],[77.2,67,19],[77.2,34,19]]} fill="#203d3b" stroke="#7a907a"/>{[0,1,2,3,4].map(i=><Line key={i} a={[77.4,40,69-i*10]} b={[77.4,61,69-i*10]} stroke="#7f9b7d" opacity={.7}/>)}<Top u={82} v={61} w={15} d={12} fill="#b0ac83"/></>;}
function Home({viewer=false}:{viewer?:boolean}){return <><Wall/><WallPrint window/><Lamp u={75} v={23}/>{viewer?<><Desk u={28} v={22} w={70} d={21} h={35}/><Monitor u={35} v={28} z={35}/><Box u={22} v={75} w={65} d={24} z={4} h={18} top="#64735b"/><Box u={18} v={73} w={7} d={30} z={4} h={32} top="#7b8060"/><Box u={84} v={73} w={7} d={30} z={4} h={32} top="#7b8060"/><Figure u={56} v={89} scale={.96} back/><Box u={22} v={99} w={65} d={6} z={6} h={37} top="#788064" front="#3e574d"/></>:<><Desk/><Monitor/><Keyboard/><Figure u={52} v={83} scale={.99} back/><Chair u={37} v={79}/></>}<Box u={88} v={82} w={11} d={11} h={13} top="#8e8056" front="#8a6c49"/>{[0,1,2].map(i=><Line key={i} a={[93,87,13]} b={[88+i*5,83+i*4,34-i*3]} stroke="#86a17b" width={2}/>)}<Line a={[88,83,34]} b={[83,83,28]} stroke="#86a17b" width={2}/><Line a={[98,91,28]} b={[103,91,32]} stroke="#86a17b" width={2}/></>;}
function Servers({network=false}:{network?:boolean}){return <><Wall/><Line a={[1,95,97]} b={[1,1,97]} stroke="#89b5a4" opacity={.5}/><Line a={[1,1,97]} b={[105,1,97]} stroke="#89b5a4" opacity={.5}/>{[0,1,2].map(i=>{const u=13+i*30,v=30;return <g key={i}><Box u={u} v={v} w={25} d={33} h={85} top="#55654e" front="#142e34" side="#263c3c"/><Front u={u+3} v={v+33.2} z={79}>{[0,1,2,3,4,5].map(j=><g key={j}><rect y={j*12} width="19" height="9" fill="#2c4540" stroke="#81947a" strokeWidth=".5"/><path d={`M3 ${4+j*12}h8`} stroke="#809880"/><circle cx="15" cy={4+j*12} r="1.1" fill={j%2?teal:"#d5bb78"} className={j===i?s.signal:undefined}/></g>)}</Front><Line a={[u+12,v+34,1]} b={[u+12,79,1]} stroke="#b89d68" width={1.2}/></g>;})}<Line a={[25,79,1]} b={[86,79,1]} stroke="#b89d68" width={1.2}/>{network?<Front u={36} v={2} z={110}><path d="M0 18V1m-10 7q10-10 20 0m-15 5q5-5 10 0" stroke={teal} fill="none"/></Front>:null}</>;}
function Film(){const [x,y]=p(24,73,47);const tripod:Point[]=[[10,63,0],[35,68,0],[25,91,0]];return <><Wall/><Front u={25} v={2} z={96}><rect width="75" height="64" fill="#65705a" stroke="#b9ac7b"/><g transform="translate(5 5) scale(1.35 1.7)"><ScreenArt/></g></Front><Lamp u={8} v={73}/><Line a={[17,24,0]} b={[17,24,81]} width={2} stroke="#92a48e"/><Line a={[7,18,0]} b={[17,24,24]} width={2}/><Line a={[28,27,0]} b={[17,24,24]} width={2}/><Box u={11} v={18} w={13} d={12} z={77} h={9} top="#b5a479"/><Line a={[24,73,0]} b={[24,73,49]} stroke="#95a48b" width={2}/>{tripod.map((q,i)=><Line key={i} a={q} b={[24,73,27]} stroke="#a4a487" width={2}/>)}<g transform={`translate(${x-12} ${y-14})`}><path d="M0 0h27v20H0Z" fill="#354d47" stroke={brass}/><path d="m27 5 11-4v16l-11-4Z" fill="#5b6c55" stroke={brass}/>{[5,23].map(cx=><g key={cx} transform={`translate(${cx} -5)`}><circle r="9" fill="#10242a" stroke="#b9a875"/><g className={s.fan}><circle r="2.5" fill="#c3b786"/>{[0,1,2].map(j=><circle key={j} cy="-5.5" r="1.8" transform={`rotate(${j*120})`} fill="#5c796c"/>)}</g></g>)}</g><Figure u={58} v={94} scale={1.02}/></>;}

/** Deterministic geometry. CSS animates only lifecycle-gated screen/mechanical details. */
export const CircuitVignette = memo(function CircuitVignette({kind}:{kind:CircuitScene}){
 return <g strokeLinejoin="round" strokeLinecap="round"><Floor/>{kind==="factory"?<Factory/>:kind==="operator"?<Operator/>:kind==="bar"?<Bar/>:kind==="arcade-player"?<ArcadePlayers/>:kind==="studio"?<Studio/>:kind==="store"?<Store/>:kind==="hardware"?<Hardware/>:kind==="home"?<Home/>:kind==="servers"?<Servers/>:kind==="film"?<Film/>:kind==="catalog"?<Store catalog/>:kind==="network"?<Servers network/>:<Home viewer/>}</g>;
});
