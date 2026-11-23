"use client";
import {useId,useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import {useCompactStudy} from "./useCompactStudy";
import TermNote from "../TermNote";
import s from "./team-studies.module.css";
const interfaces=[
 {label:"Direction & stopping",nodes:[0,1,2],title:"The owner can end the commission",crosses:"Priorities, scope and the decision to ship with declared limits pass into coordination.",stays:"A specialist’s next valid task does not authorize another cycle. The owner retains the stopping decision.",object:"A decision with a scope"},
 {label:"Delegation & return",nodes:[2,3,4],title:"A craft returns something its receiver can inspect",crosses:"Producer assigns bounded work; specialists return a versioned candidate, findings and unresolved obligations.",stays:"Private context is not a shared memory. Another craft must be able to reproduce the receiving example.",object:"A candidate and its evidence"},
 {label:"Joint acceptance",nodes:[3,4],title:"Two crafts meet at one specimen",crosses:"Animator and Engine must agree on the actual loaded body, transforms and the conditions used to judge contact.",stays:"A local pose or successful export cannot accept the assembled performance. Shared tests still have a scope.",object:"The same body, the same build"},
 {label:"Review & release",nodes:[0,1,2,5],title:"A verdict and an authorization are different returns",crosses:"Review supplies evidence about a particular specimen. Coordination carries the selected work and its known limits to the owner.",stays:"Root, the studio Critic and an independent reviewer are distinct participants. None becomes the owner by finding a defect.",object:"A finding tied to a version"}
];
const labels=[['Owner','Direction · stop'],['Root / Codex','Access & support'],['Producer','Native lead'],['Animator','Motion craft'],['Engine','Runtime integration'],['Review','Scoped findings']];
export default function TeamTopology(){
 const [selected,setSelected]=useState(0),ref=useLivingPlate<HTMLDivElement>(),compact=useCompactStudy(ref),uid=useId().replaceAll(":","");
 const current=interfaces[selected],w=compact?360:800;
 const positions=compact?[[180,54],[93,162],[267,162],[93,388],[267,388],[180,500]]:[[400,54],[135,178],[665,178],[135,405],[665,405],[400,500]];
 const edges=[[0,1],[0,2],[1,2],[2,3],[2,4],[3,4],[1,5],[2,5]];
 return <div className={s.study} ref={ref} data-playing="false">
  <div className={s.controls} role="group" aria-label="Inspect a team interface">{interfaces.map((item,i)=><button key={item.label} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{item.label}</button>)}</div>
  <div className={`${s.diagram} ${s.topologyDiagram}`}><svg viewBox={`0 0 ${w} 555`} role="img" aria-label={`Responsibility map. ${current.title}. Participants: Owner, Root/Codex, Producer, Animator, Engine and scoped Review. Highlighted: ${current.nodes.map(i=>labels[i][0]).join(", ")}. ${current.crosses} ${current.stays} Shared versioned records connect separate contexts; lines are conceptual interfaces, not message counts.`}>
   <defs><linearGradient id={uid+"wall"} x2="0" y2="1"><stop stopColor="#476264"/><stop offset="1" stopColor="#233f46"/></linearGradient><linearGradient id={uid+"brass"}><stop stopColor="#80764e"/><stop offset=".5" stopColor="#dfc58d"/><stop offset="1" stopColor="#8b8055"/></linearGradient></defs>
   <rect width={w} height="555" fill={`url(#${uid}wall)`}/><path d={`M0 112H${w}M0 226H${w}M0 449H${w}`} stroke="#9dba9a" opacity=".15"/>
   {[12,w-12].map(x=><path key={x} d={`M${x} 12V543`} stroke={`url(#${uid}brass)`} strokeWidth="3"/>)}
   {edges.map(([a,b],i)=>{const [x1,y1]=positions[a],[x2,y2]=positions[b],active=current.nodes.includes(a)&&current.nodes.includes(b);return <g key={i}><path d={`M${x1} ${y1}L${x2} ${y2}`} stroke={active?'#d8bf8a':'#9bb19b'} opacity={active?0.8:0.22} strokeWidth={active?3:1.5} strokeDasharray={active?'7 8':'2 7'} className={active?s.signal:undefined}/></g>;})}
   <g transform={`translate(${w/2- (compact?140:190)} 247)`}>
    <path d={`M0 12L18 0H${compact?262:362}L${compact?280:380} 12V83H0Z`} fill="#203b3d" stroke="#b7ad7d"/>
    <rect x="9" y="13" width={compact?262:362} height="60" fill="#baa982"/>
    {[0,1,2].map(i=><g key={i} transform={`translate(${compact?23+i*82:54+i*104} 23)`}><rect width="68" height="34" fill="#e0cfaa" stroke="#6b7d66"/><path d="M8 10h49M8 18h37M8 26h45" stroke="#8c9779"/></g>)}
    <text x={compact?140:190} y="105" textAnchor="middle" fill="#e5d5ad" fontFamily="Arial" fontSize={compact?17:15}>VERSIONED SHARED RECORDS</text>
   </g>
   {positions.map(([x,y],i)=>{const active=current.nodes.includes(i),cw=compact?146:204;return <g key={i} transform={`translate(${x-cw/2} ${y-32})`} opacity={1}><rect x="3" y="5" width={cw} height="67" rx="2" fill="#142f36"/><rect width={cw} height="64" rx="2" fill={active?'#d9c59a':'#385b52'} stroke={active?'#f1d29c':'#9fae8b'} strokeWidth="2"/><circle cx="12" cy="12" r="2" fill="#3c5c52"/><circle cx={cw-12} cy="12" r="2" fill="#3c5c52"/><text x={cw/2} y="28" textAnchor="middle" fill={active?'#284e46':'#eadcb8'} fontFamily="Georgia" fontSize={compact?20:22}>{labels[i][0]}</text><text x={cw/2} y="49" textAnchor="middle" fill={active?'#294b40':'#e0d8b9'} fontFamily="Arial" fontSize={compact?14:16}>{labels[i][1]}</text></g>;})}
  </svg></div>
  <div className={s.receipt} aria-live="polite"><p className={s.eyebrow}>{current.object}</p><h3>{current.title}</h3><p>{current.crosses}</p><p className={s.limit}>{current.stays}</p></div>
  <div className={s.notes}><TermNote term="What the map leaves out">The studio had nine specialist crafts plus Producer. Animator and Engine are shown because their shared correction dominates this example. This is a conceptual map of responsibilities, not an exhaustive organization chart, message log or measurement of collaboration.</TermNote><TermNote term="Separate contexts">Here “team” means distinct working conversations linked by delegation, artifacts and review. The diagram supplies no evidence of a collective mind or emergent hive intelligence.</TermNote><TermNote term="Which reviewer?">The native studio Critic, the independent retrospective reviewer and Root’s receiving checks have different scopes. The review station groups their function for this diagram; it does not make them one agent or establish that every candidate received every review.</TermNote></div>
 </div>;
}
