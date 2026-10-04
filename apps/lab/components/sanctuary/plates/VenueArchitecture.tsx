import { InsetPanel, WoodGrain, round } from "./ArcadeMaterials";

function Pier({x}:{x:number}) {
 return <g transform={`translate(${x} 0)`}>
  <path d="M-16 77H16V365H-16Z" fill="#253431" stroke="#b59a68"/>
  <path d="M-11 95H-5V344H-11ZM4 95H10V344H4Z" fill="#111f22" stroke="#6f775d" strokeWidth=".7"/>
  <path d="M-19 72H19V86H-19ZM-20 346H20V365H-20Z" fill="#6c664b" stroke="#c6aa75"/>
  <path d="M-21 68H21V73H-21ZM-21 363H21V371H-21Z" fill="#253332" stroke="#a99364"/>
  <path d="M-17 78H17M-17 351H17M-15 359H15M-13 86V345" fill="none" stroke="#dbc391" strokeWidth=".65"/>
  <path d="M0 98V336" stroke="#0c191d" strokeWidth="3"/>
  <path d="M-7 99v239M8 99v239" stroke="#c4ac76" opacity=".2"/>
 </g>;
}
function Arch({x,w}:{x:number;w:number}) {
 const h=w/2, center=x+h;
 const d=`M${x} 351V208Q${x} 118 ${center} 109Q${x+w} 118 ${x+w} 208V351Z`;
 return <g><path d={d} fill="#0d1e23" stroke="#625e46" strokeWidth="12"/><path d={d} fill="none" stroke="#b99b63" strokeWidth="1.5"/><path d={`M${x+10} 348V207Q${x+10} 129 ${center} 120Q${x+w-10} 129 ${x+w-10} 207V348`} fill="none" stroke="#76836b" strokeWidth="1"/>
  <path d={Array.from({length:15},(_,i)=>{const a=Math.PI+(i/14)*Math.PI;return `M${round(center+Math.cos(a)*(h+4))} ${round(209+Math.sin(a)*103)}l${round(Math.cos(a)*7)} ${round(Math.sin(a)*7)}`;}).join("")} stroke="#0b181b" strokeWidth="2.2"/>
  <path d={`M${center-8} 104l8-13 8 13-2 16h-12Z`} fill="#8f7952" stroke="#ceaf77" strokeWidth=".7"/>
 </g>;
}

/** A single-point room, with joinery and mouldings sharing the same perspective. */
export default function VenueArchitecture({id}:{id:string}) {
 const floor="M30 377L106 343H902L974 377L944 559H59Z";
 return <g data-art-element="room-architecture" strokeLinejoin="round">
  <defs>
   <linearGradient id={`${id}-room`} x2="0" y2="1"><stop stopColor="#293432"/><stop offset=".65" stopColor="#162629"/><stop offset="1" stopColor="#0c191f"/></linearGradient>
   <linearGradient id={`${id}-floor`} x2=".3" y2="1"><stop stopColor="#42483a"/><stop offset="1" stopColor="#16272b"/></linearGradient>
   <pattern id={`${id}-wallpaper`} width="24" height="28" patternUnits="userSpaceOnUse"><path d="M12 1l5 12-5 14-5-14Z M0 13h24M12 6v15" stroke="#c2aa7a" fill="none" strokeWidth=".6" opacity=".1"/></pattern>
   <clipPath id={`${id}-floor-clip`}><path d={floor}/></clipPath>
  </defs>
  <path d="M29 376V62L105 22H902L974 62V377Z" fill={`url(#${id}-room)`} stroke="#70694e"/>
  <path d="M30 62L107 27H899L974 62Z" fill="#354036"/>
  <path d="M31 70H974V341H31Z" fill={`url(#${id}-wallpaper)`}/>
  <path d="M29 64H974V82H29ZM30 339H974V378H30Z" fill="#25322d" stroke="#9b8357"/>
  <path d="M31 66H972M32 73H971M34 80H969M32 345H971M34 371H969" stroke="#cfb581" strokeWidth=".9" opacity=".65"/>
  <path d={Array.from({length:57},(_,i)=>`M${40+i*16} 70v6`).join("")} stroke="#090f12" strokeWidth="4"/>
  <WoodGrain x={34} y={349} w={932} h={18}/>
  <Arch x={105} w={241}/><Arch x={387} w={222}/><Arch x={653} w={241}/>
  {[71,368,635,931].map(x=><Pier key={x} x={x}/>)}
  <path d={floor} fill={`url(#${id}-floor)`} stroke="#927c54"/>
  <g clipPath={`url(#${id}-floor-clip)`} fill="none">
   <path d={Array.from({length:19},(_,i)=>`M${100+i*45} 342L${-520+i*115} 565`).join("")} stroke="#08191d" strokeWidth="2"/>
   <path d={Array.from({length:19},(_,i)=>`M${102+i*45} 342L${-517+i*115} 565`).join("")} stroke="#b0a173" strokeWidth=".7" opacity=".32"/>
   {[364,394,434,486,554].map((y,i)=><path key={y} d={`M0 ${y}H1000M${84+i*73} ${y}l44 -2m159 2 92 -3m106 3 61 -2`} stroke="#b8a779" strokeWidth=".7" opacity=".24"/>)}
   <path d={Array.from({length:46},(_,i)=>{const y=377+i*4;return `M${51+(i%7)*13} ${y}q68 -2 137 0m${93+(i%5)*17} 0q79 3 151 0m77 0 169 1`;}).join("")} stroke="#bda775" strokeWidth=".5" opacity=".13"/>
  </g>
  <path d="M34 383L63 549H940L967 383M44 384L70 543H934L957 385" stroke="#b29861" strokeWidth="1.1" fill="none" opacity=".6"/>
  <path d="M31 382L52 563H950L974 382" fill="none" stroke="#0a1218" strokeWidth="8"/>
  <path d="M101 345H347V362H101M391 345H606V362H391M657 345H896V362H657" fill="none" stroke="#bb9d65" strokeWidth=".7"/>
  <g opacity=".9"><InsetPanel x={405} y={271} w={85} h={67}/><InsetPanel x={499} y={271} w={85} h={67}/></g>
 </g>;
}
