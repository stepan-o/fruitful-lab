import { InsetPanel, WoodGrain, Screw } from "./ArcadeMaterials";
import s from "./arcade-craft.module.css";

function Bottle({x,y,h,tone}:{x:number;y:number;h:number;tone:string}) {
 return <g transform={`translate(${x} ${y})`}>
  <ellipse cy="2" rx="7" ry="2" fill="#070f13"/>
  <path d={`M-5 0V${-h+13}Q-5 ${-h+9}-2 ${-h+9}V${-h}H2V${-h+9}Q6 ${-h+8}6 ${-h+13}V0Z`} fill={tone} stroke="#c1b580" strokeWidth=".6"/>
  <path d={`M-2 ${-h+1}H2M-3 ${-h+15}V-4`} stroke="#e1d8a8" strokeWidth=".9" opacity=".6"/>
  <path d={`M-5 ${-h+18}H6v8H-5Z`} fill="#cfbb8d" opacity=".55"/><path d={`M-2 ${-h+20}h5m-5 3h4`} stroke="#273530" strokeWidth=".65"/>
 </g>;
}
export function Glass({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`}><ellipse cy="1" rx="7" ry="2" fill="#0c1718"/><path d="M-5-19H5L4 0H-4Z" fill="#97703c" fillOpacity=".55" stroke="#dbcd9d" strokeWidth=".65"/><path d="M-4-14H4M-3-16V-3" stroke="#eadfbd" strokeWidth=".8"/><ellipse cy="-19" rx="5" ry="1.8" fill="#dfd2ab" opacity=".7"/></g>;
}
export function Stool({x,y}:{x:number;y:number}) {
 return <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
  <ellipse cy="3" rx="26" ry="7" fill="#09171b" opacity=".65"/>
  <path d="M-15-51-22 0H-17L-9-49M12-51 21 0H16L6-49M-2-50-5-1H0L3-50" fill="#584c34" stroke="#c1a273" strokeWidth="1"/>
  <path d="M-18-18Q0-12 17-18M-17-22Q0-16 17-22" stroke="#ab8c5b" fill="none" strokeWidth="1.6"/>
  <ellipse cy="-51" rx="24" ry="8" fill="#1b2827" stroke="#a89163"/>
  <ellipse cy="-54" rx="24" ry="7" fill="#634e37" stroke="#c5a772"/>
  <path d="M-17-55q17-6 33 0M-18-52q18 6 36 0" fill="none" stroke="#d0b78a" strokeWidth=".65"/>
 </g>;
}
export function Lamp({x,y,id}:{x:number;y:number;id:string}) {
 return <g transform={`translate(${x} ${y})`} data-art-element="lamp">
  <path d="M0-64V-15" stroke="#c9ae75" strokeWidth="1.5"/><path d="M-2-61h4m-4 8h4m-4 8h4m-4 8h4m-4 8h4" stroke="#142126" strokeWidth=".7"/>
  <ellipse className={s.lampHalo} cy="40" rx="124" ry="145" fill={`url(#${id}-lamplight)`}/>
  <path d="M0-23l5 7-5 6-5-6Z" fill="#756340" stroke="#c6a96f" strokeWidth=".8"/>
  <path d="M-29 0Q-16-15 0-14Q16-15 29 0L21 7H-21Z" fill="#344139" stroke="#c0a272"/>
  <path d="M-21 7L-14 49H14L21 7Z" fill="#c6a56d" stroke="#debf88"/>
  <path className={s.lampCore} d="M-17 10L-11 43H11L17 10Z" fill="#f3daa5"/>
  <path d="M-7 8L-5 46M7 8L5 46M-20 8H20M-14 47H14M-10 53H10M0 52v6" stroke="#514b34" strokeWidth="1.5"/>
  <path d="M-25-1Q0-17 25-1M-14 0Q0-12 14 0M-15 5H15" stroke="#e2c58d" strokeWidth=".65" fill="none"/>
  <path d="M-5 48H5L3 55H-3Z" fill="#ac8e59"/>
 </g>;
}
function Landscape({id}:{id:string}) {
 return <g data-art-element="framed-landscape">
  <defs><clipPath id={`${id}-picture`}><path d="M423 173H573V250H423Z"/></clipPath></defs>
  <path d="M411 158H586V264H411Z" fill="#322f24" stroke="#b39663" strokeWidth="2"/>
  <path d="M415 162H582V260H415Z" fill="#685c3e" stroke="#e1c591" strokeWidth=".7"/>
  <path d="M420 168H577V255H420Z" fill="#0b1b20" stroke="#98835b"/>
  <g clipPath={`url(#${id}-picture)`}>
   <path d="M423 173H573V250H423Z" fill="#566456"/><circle cx="522" cy="193" r="16" fill="#d1bd87"/>
   <path d="M420 220L454 188L469 207L487 193L522 227L548 196L580 227V256H420Z" fill="#293d3c" stroke="#82917a"/>
   <path d="M420 246L450 215L466 221L489 212L509 235L546 228L577 243V255H420Z" fill="#142a30" stroke="#657b6c"/>
   <path d="M453 190l-4 22 9-8 8 16m23-24 4 16 7 4m49-17-6 24 9-8 7 18M450 218l-3 14 6 6m36-23-5 15 7 4" fill="none" stroke="#90a18a" strokeWidth=".7"/>
   <path d="M492 227q-14 9 0 13t-6 15h17q15-9 1-16t-4-12" fill="#cbb781"/>
   <path d="M480 225v-9h23v9M477 216l14-9 15 9" fill="#283a38" stroke="#a3a281" strokeWidth=".6"/>
   <path d="M489 225v-8h7v8" fill="#e1c88e"/>
   <path d="M425 185h43l-6-3h-29m58 13h30l-4-3h-15" fill="none" stroke="#ded0a5" opacity=".3"/>
  </g>
  <path d="M415 164V260H582M423 252H575V170" fill="none" stroke="#131d1d" strokeWidth="2"/>
  <path d="M410 160l10 10m163-10-10 10m-162 91 9-9m163 9-9-9" stroke="#e5c997" strokeWidth=".8"/>
  <path d="M439 267H559V276H439Z" fill="#74603f" stroke="#b99f68" strokeWidth=".5"/><path d="M468 271H530" stroke="#192322" strokeWidth="1.3"/>
 </g>;
}
export default function VenueFurnishings({id}:{id:string}) {
 return <g strokeLinejoin="round" data-art-element="furnishings">
  {/* Shelves have thickness, brackets and a dark recess behind the glass. */}
  <path d="M125 162H323V291H125Z" fill="#0a1b20" stroke="#8e7e56"/>
  {[201,251].map((y,row)=><g key={y}>
   {[145,165,188,211,237,263,287,309].map((x,i)=><Bottle key={x} x={x} y={y} h={21+(i*7+row*5)%18} tone={["#4b6f60","#856844","#668576","#9b8357"][i%4]}/>)}
   <path d={`M121 ${y+2}H329v6H121Z`} fill="#74603e" stroke="#bb9b67" strokeWidth=".7"/>
   <path d={`M139 ${y+9}l11 13v-13M306 ${y+9}l-11 13v-13`} fill="#304039" stroke="#957e51" strokeWidth=".6"/>
  </g>)}
  <path d="M112 288L317 281L342 294L135 305Z" fill="#ad8c58" stroke="#d5b981"/>
  <path d="M135 305H342V372H135Z" fill="#4c4832" stroke="#0b191b" strokeWidth="2"/>
  <path d="M112 298L135 305V372L112 356Z" fill="#2a342a" stroke="#8f7853"/>
  <path d="M112 289v9l23 14H342v-18M136 310H340M137 367H341" fill="none" stroke="#c3a572"/>
  <InsetPanel x={146} y={318} w={54} h={43}/><InsetPanel x={211} y={318} w={54} h={43}/><InsetPanel x={276} y={318} w={54} h={43}/>
  <path d="M126 381L337 390M146 371v13m171-11v16" fill="none" stroke="#ae9362" strokeWidth="3"/>
  <path d="M138 290L313 286M153 295L325 290" stroke="#dbc18d" strokeWidth=".65"/>
  <Glass x={164} y={293}/><Glass x={307} y={290}/>
  <Landscape id={id}/>
  <Lamp x={235} y={116} id={id}/><Lamp x={548} y={116} id={id}/>
  <Stool x={151} y={439}/><Stool x={309} y={441}/>
  {/* A turned pedestal carries the entire table, rather than floating decorative legs. */}
  <g transform="translate(264 459)" data-art-element="table">
   <ellipse cy="34" rx="67" ry="11" fill="#08161b" opacity=".65"/>
   <path d="M-8-30H8V16L42 32L38 37L3 26L-31 39L-39 34L-8 16Z" fill="#69583c" stroke="#c1a16c" strokeWidth="1.1"/>
   <path d="M-5-28V16M-4 20L-31 33M6 21L35 32" stroke="#ddbd87" strokeWidth=".65"/>
   <ellipse cy="-18" rx="11" ry="3.5" fill="#3a3d2e" stroke="#b99b66"/><ellipse cy="7" rx="11" ry="4" fill="#3b3d2e" stroke="#b99b66"/>
   <ellipse cy="-32" rx="77" ry="21" fill="#302f25" stroke="#ad8b58" strokeWidth="1.5"/>
   <ellipse cy="-37" rx="77" ry="21" fill="#786444" stroke="#d3b989"/>
   <ellipse cy="-38" rx="70" ry="17" fill="#4d513b" stroke="#a38f5e" strokeWidth=".7"/>
   <path d="M-63-40q63-17 126 0M-62-35q62 13 123 0M-51-44q51-9 103 0M-53-33q50 8 106 0" fill="none" stroke="#c8b481" strokeWidth=".55" opacity=".65"/>
   <Glass x={-29} y={-37}/><Glass x={30} y={-39}/>
   <path d="M-9-37l16-3 11 5-16 3Z" fill="#c3b08a" stroke="#25322c" strokeWidth=".6"/><path d="M-4-36l10-2" stroke="#7c6242"/>
  </g>
  <WoodGrain x={129} y={155} w={190} h={6}/>
  <Screw x={128} y={164} r={1.5}/><Screw x={320} y={164} r={1.5}/>
 </g>;
}
