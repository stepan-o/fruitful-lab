import type { CSSProperties } from "react";
import { CabinetWoodDefs } from "./OperatorCabinet";
import { BoardSurface } from "./OperatorBoard";
import { Grain, Screw, round } from "./engraving-primitives";
import { board, cabinet, doors, doorShadows, floorTranslation, groundShadows, linkageFrames, output, overhangDrop, sliderPose, wheels, wheelWallOffset } from "@/lib/production-systems/open-cabinet";
import { wheelOutline, type MovementWheel } from "@/lib/production-systems/turk-movement";
import styles from "./open-cabinet.module.css";

const ink="#49382b", brass="#b49b6c", edge="#cfb285";
const d=cabinet.depth, dx=round(d/Math.sqrt(3));
const wood=(id:string)=>`url(#${id}-walnut)`;

/** Fine joinery belongs to the local board, including on the opened leaves. */
function Panel({id,width,height}:{id:string;width:number;height:number}) {
  return <g stroke={ink} strokeWidth=".65">
    <path d={`M0 0H${width}V${height}H0Z`} fill={wood(id)}/>
    <path d={`M0 0H${width}V${height}H0Z`} fill={`url(#${id}-long-grain)`} stroke="none"/>
    <path d={`M8 12H${width-8}V${height-12}H8Z`} fill="#463528"/>
    <path d={`M10 14H${width-10}V${height-14}H10Z`} fill="#af895b"/>
    <path d={`M14 19H${width-14}V${height-19}H14Z`} fill="#5d422f"/>
    <path d={`M19 25H${width-19}V${height-25}H19Z`} fill={wood(id)}/>
    <path d={`M19 25H${width-19}V${height-25}H19Z`} fill={`url(#${id}-figured-grain)`} stroke="none"/>
    <path d={`M2 ${height-2}V2H${width-2}M9 ${height-13}V13H${width-9}M19 ${height-24}H${width-18}V25`} fill="none" stroke={edge}/>
    <path d={`M8 12 19 25M${width-8} 12 ${width-19} 25M8 ${height-12} 19 ${height-25}M${width-8} ${height-12} ${width-19} ${height-25}`} fill="none" strokeWidth=".55"/>
    <path d={`M3 6H${width-3}M3 ${height-6}H${width-3}M4 13H8M${width-8} 13H${width-4}M4 ${height-13}H8M${width-8} ${height-13}H${width-4}`} fill="none" stroke="#ba9567" strokeWidth=".5"/>
  </g>;
}
function Foot({id,x,y}:{id:string;x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`} stroke={ink} strokeWidth=".75">
    <path d="M-10-2H10V3L7 7V11Q11 16 6 21Q0 25-6 21Q-11 16-7 11V7L-10 3Z" fill={wood(id)}/>
    <path d="M-9 2H9M-7 7H7M-7 10H7M-6 13H6" fill="none"/>
    <path d="M-8 0H8M-6 8H6M-5 18Q0 22 5 18" fill="none" stroke={edge} strokeWidth=".6"/>
    <path d="M-4 13q-2 3 0 5m3-5v7m3-7v7m2-7q2 3 0 5" fill="none" strokeWidth=".4"/>
  </g>;
}
function Shell({id}:{id:string}) {
  return <g stroke={ink} strokeLinejoin="round">
    <Foot id={id} x={round(445+dx)} y={356-d}/>
    <Foot id={id} x={146} y={356}/><Foot id={id} x={446} y={356}/>
    <g transform={`matrix(.57735 -1 0 1 466 134)`} data-cabinet-study="side-return"><Panel id={id} width={d} height={210}/></g>
    <path d={`M120 132 ${120+dx} ${132-d}H${472+dx}L472 132Z`} fill="#ad8b5d" strokeWidth="1"/>
    <path d={`M126 130 ${126+dx} ${136-d}H${466+dx}L466 130Z`} fill={wood(id)} strokeWidth=".65"/>
    <g transform="matrix(1 0 -.57735 1 168 62)"><Grain x={0} y={0} w={335} h={66}/></g>
    <path d={`M133 124 ${133+dx-8} ${140-d}H${460+dx-8}M138 118H461`} fill="none" stroke={edge} strokeWidth=".55"/>
    <BoardSurface board={board} inside={false}/>
    <path d={`M472 132 ${472+dx} ${132-d}V${142-d}L472 142ZM466 142 ${466+dx} ${142-d}V${150-d}L466 150Z`} fill="#7c593b" strokeWidth=".75"/>
    <path d="M126 134H466V344H126Z" fill={wood(id)} strokeWidth="1.1"/>
    <path d="M126 134H466V344H126Z" fill={`url(#${id}-long-grain)`} stroke="none"/>
    <path d="M141 150H451V316H141Z" fill="#aa8356" strokeWidth=".65"/>
    <path d="M145 154H447V310H145Z" fill="#2b352b" strokeWidth="1"/>
    <path d="M145 154H447V310H145Z" fill={`url(#${id}-interior-light)`} stroke="none"/>
    <g clipPath={`url(#${id}-opening)`} data-cabinet-study="empty-working-bay">
      <path d="M145 154 162.32 124V280L145 310Z" fill="#51452f"/>
      <path d="M145 310 162.32 280H464.32L447 310Z" fill="#7c6747"/>
      <path d="M148 307 164 281H463M151 302H450M155 295H456M159 288H460" fill="none" stroke="#b49665" strokeWidth=".55"/>
      <path d="M162.32 127V280H464" fill="none" stroke="#b39a69" strokeWidth=".7"/>
      <path d="M170 167H427V278H170Z" fill={`url(#${id}-back-hatch)`} stroke="none" opacity=".22"/>
      <path d={`M145 154H447V${154+overhangDrop}H145Z`} fill="#18231b" opacity=".28" stroke="none"/>
      <path d="M164 174H437M170 283H432M170 176V281M436 176V281" fill="none" stroke="#82724e" strokeWidth="1.4" opacity=".6"/>
      <path d="M172 176H432M172 281H430" fill="none" stroke="#c0a474" strokeWidth=".5" opacity=".55"/>
      {/* A removable upper service frame reads as supported cabinetry, not a person. */}
      <path d="M292 162H429V168H292Z" fill="#8a744e" strokeWidth=".65"/>
      <path d="M303 169V187M418 169V187M303 186H418" fill="none" stroke={brass} strokeWidth="1.1"/>
      <path d="M307 173H414M307 177H414M307 181H414" fill="none" stroke="#7c805e" strokeWidth=".65"/>
      {[303,418].map(x=><Screw key={x} x={x} y={166} r={2}/>)}
    </g>
  </g>;
}
function GearGeometry({wheel,index}:{wheel:MovementWheel;index:number}) {
  const r=wheel.radius,inner=r-(r>30?5:3),spokes=r<12?3:index===0?6:5;
  return <>
    <path d={`${wheelOutline(wheel.teeth)}M${inner} 0a${inner} ${inner} 0 1 0 ${-2*inner} 0a${inner} ${inner} 0 1 0 ${2*inner} 0Z`} fillRule="evenodd"/>
    <path d={Array.from({length:spokes},(_,i)=>{
      const a=i*Math.PI*2/spokes,c=Math.cos(a),s=Math.sin(a);
      const p=(x:number,y:number)=>`${round(x*c-y*s)} ${round(x*s+y*c)}`;
      return `M${p(-1.3,-2)}L${p(-2,-inner)}L${p(2,-inner)}L${p(1.3,-2)}Z`;
    }).join("")}/>
    <circle r={r<12?2.8:4.1}/>
  </>;
}
function Wheel({id,wheel,index,shadow=false}:{id:string;wheel:MovementWheel;index:number;shadow?:boolean}) {
  const {x,y,radius:r,name,phase,direction,period}=wheel;
  const steel=[1,3,5,7].includes(index),metal=steel?"#8d967e":"#bda16e";
  const offset=shadow?wheelWallOffset(wheel.layer):{x:0,y:0};
  return <g transform={`translate(${round(x+offset.x)} ${round(y+offset.y)})`} data-cabinet-wheel={shadow?undefined:name} opacity={shadow?.35:1}>
    <g className={styles.wheel} style={{"--period":`${period}s`,"--turn":`${direction*360}deg`} as CSSProperties}>
      <g transform={`rotate(${phase})`}>
        <use href={`#${id}-wheel-${name}`} fill={shadow?"#16231b":metal} stroke={shadow?"none":"#3b3428"} strokeWidth=".45"/>
        {!shadow&&<>
          <circle r={r-1.5} fill="none" stroke="#e0c998" strokeWidth=".55"/>
          <circle r={r-(r>30?4.3:2.3)} fill="none" stroke={steel?"#c0c6a1":"#d4b882"} strokeWidth=".5"/>
          <circle r="2" fill="#514b38" stroke={edge} strokeWidth=".6"/>
          <path d="M-.8-.8H.8V.8H-.8Z" fill="#292a22" stroke="none"/>
          {r>20&&<path d={Array.from({length:wheel.teeth},(_,i)=>{const a=i*2*Math.PI/wheel.teeth;return `M${round(Math.cos(a)*(r-3))} ${round(Math.sin(a)*(r-3))}l${round(Math.cos(a)*.8)} ${round(Math.sin(a)*.8)}`;}).join("")} stroke="#4c402d" strokeWidth=".35" opacity=".55"/>}
        </>}
      </g>
    </g>
    {!shadow&&<>
      <path d={`M${-r*.86} ${-r*.42}A${r-.8} ${r-.8} 0 0 1 ${r*.34} ${-r*.89}`} fill="none" stroke={steel?"#d1d6b5":"#f2dba7"} strokeWidth=".8" opacity=".8"/>
      <path d={`M${r*.86} ${r*.42}A${r-.8} ${r-.8} 0 0 1 ${-r*.34} ${r*.89}`} fill="none" stroke="#292d22" strokeWidth=".85" opacity=".7"/>
    </>}
  </g>;
}
function Movement({id}:{id:string}) {
  const pose=sliderPose(0),a=(pose.slider.x-pose.pin.x)/60,b=(pose.slider.y-pose.pin.y)/60;
  const timing={"--period":`${output.period}s`} as CSSProperties;
  return <g clipPath={`url(#${id}-opening)`} strokeLinejoin="round" data-cabinet-study="connected-movement">
    {wheels.map((wheel,index)=><Wheel key={wheel.name} id={id} wheel={wheel} index={index} shadow/>)}
    {wheels.map(w=><g key={w.name} transform={`translate(${round(w.x)} ${round(w.y)})`}>
      <path d="M-5-3H5V3H-5Z" fill="#89754f" stroke={ink} strokeWidth=".5"/>
      <circle r="4.5" fill="#544d35" stroke="#c3a778" strokeWidth=".6"/>
    </g>)}
    {wheels.map((wheel,index)=><Wheel key={wheel.name} id={id} wheel={wheel} index={index}/>)}
    {/* Output wheel, crank and slider share the same shaft, phase and period. */}
    <path d="M409 237H446V249H409Z" fill="#4d533d" stroke={ink} strokeWidth=".7"/>
    <path d="M409 238H446M409 247H446" stroke="#bdab7c" strokeWidth="1.4"/>
    {[411,444].map(x=><Screw key={x} x={x} y={243} r={1.7}/>)}
    <g transform={`translate(${output.x} ${output.y})`}>
      <g className={styles.wheel} style={{...timing,"--turn":`${output.direction*360}deg`} as CSSProperties}>
        <g transform={`rotate(${output.phase})`}><path d="M-3-4H12Q17 0 12 4H-3Z" fill="#b99f6b" stroke={ink} strokeWidth=".7"/><path d="M0-2H11" stroke="#ead1a0" strokeWidth=".6"/><Screw x={12} y={0} r={2.3}/></g>
      </g>
      <Screw x={0} y={0} r={3}/>
    </g>
    <g className={styles.link} style={{...timing,animationName:`${id}-slider`,transform:`translate(${pose.slider.x}px,${pose.slider.y}px)`}} data-cabinet-study="slider">
      <path d="M-4-8H4V8H-4Z" fill="#bca777" stroke={ink} strokeWidth=".7"/><path d="M-2-6H2V6H-2" fill="#e1cf9b" strokeWidth=".4"/>
      <path d="M-1-8V-24H2V-8" fill="#978760" stroke={ink} strokeWidth=".6"/><path d="M-5-26H6V-22H-5Z" fill="#ddd0a8" stroke={ink} strokeWidth=".65"/>
    </g>
    <g className={styles.link} style={{...timing,animationName:`${id}-rod`,transform:`matrix(${a},${b},${-b},${a},${pose.pin.x},${pose.pin.y})`}} data-cabinet-study="connecting-rod">
      <path d="M0-2.1H60V2.1H0Z" fill="#ac9164" stroke={ink} strokeWidth=".65"/><path d="M4-1H56" stroke="#ead1a0" strokeWidth=".55"/>
      <Screw x={0} y={0} r={2.5}/><Screw x={60} y={0} r={2.5}/>
    </g>
  </g>;
}
function Finish({id}:{id:string}) {
  return <g stroke={ink} strokeWidth=".7">
    <path d="M120 132H472V142H120ZM126 142H466V150H126Z" fill="#92704b"/>
    <Grain x={123} y={134} w={346} h={6}/>
    <path d="M121 133H471M127 144H465" stroke={edge} strokeWidth=".75"/>
    <path d="M122 141H470M128 149H464" stroke="#3d2f24" strokeWidth="1.2"/>
    <path d="M141 150 145 154M451 150 447 154M141 316 145 310M451 316 447 310" fill="none"/>
    <path d="M142 314V151H450M145 311H448V154" fill="none" stroke={edge} strokeWidth=".65"/>
    {[128,452].map(x=><g key={x}>
      <path d={`M${x} 150h12v166h-12Z`} fill={wood(id)}/>
      <path d={`M${x+3} 165v136m4-136v136m4-136v136`} stroke="#453224" strokeWidth="1.4"/>
      <path d={`M${x+3.6} 166v134m4-134v134m4-134v134M${x+1} 155h10m-10 155h10`} stroke={edge} strokeWidth=".5"/>
    </g>)}
    <path d="M126 316H466V344H126Z" fill={wood(id)}/>
    {[143,302].map(x=><g key={x}>
      <path d={`M${x} 321h143v17H${x}Z`} fill="#443326"/>
      <path d={`M${x+2} 323h139v13H${x+2}Z`} fill="#a98052"/>
      <path d={`M${x+5} 326h133v7H${x+5}Z`} fill="#775437"/>
      <Grain x={x+7} y={327} w={129} h={5}/>
      <path d={`M${x+3} 335v-11h138`} fill="none" stroke={edge} strokeWidth=".55"/>
      <g transform={`translate(${x+71.5} 329)`}><Screw x={0} y={0} r={2}/><path d="M-2 1q-5 2-2 5q4 3 8 0q3-3-2-5" fill="none" stroke="#342b22" strokeWidth="1.8"/><path d="M-2 1q-4 2-2 4q4 3 8 0q2-2-2-4" fill="none" stroke="#c5a574" strokeWidth=".8"/></g>
    </g>)}
    <path d={`M126 344H466L472 347V353H120V347ZM466 344 ${466+dx} ${344-d}L${472+dx} ${347-d} 472 347Z`} fill="#886440"/>
    <path d={`M472 347 ${472+dx} ${347-d}V${353-d}L472 353Z`} fill="#624b34"/>
    <path d={`M122 353H470V357H122ZM470 353 ${470+dx} ${353-d}V${357-d}L470 357Z`} fill="#443326"/>
    <path d={`M122 348H471L${471+dx} ${348-d}M126 344H466`} fill="none" stroke={edge} strokeWidth=".75"/>
  </g>;
}
function OpenDoors({id}:{id:string}) {
  return <g strokeLinejoin="round" data-cabinet-study="opened-doors">
    {doors.map(door=><g key={door.side}>
      <g transform={`matrix(${door.a} ${door.b} 0 1 ${door.hinge} 154)`}>
        <path d={`M0 154H151V158H0Z`} fill="#3c3025" stroke={ink} strokeWidth=".65"/>
        <Panel id={id} width={151} height={154}/>
        <path d="M148 2h3v151h-3Z" fill="#c09a6a" stroke={ink} strokeWidth=".55"/>
        <g transform="translate(139 77)">
          <path d="M-3-7Q0-10 3-7L5-2 3 3H-3L-5-2Z" fill={brass} stroke={ink} strokeWidth=".65"/>
          <path d="M-1-4a1.7 1.7 0 1 0 2 0l1 5h-4Z" fill="#392f25"/>
          <path d="M-2 6q-5 3-2 9q4 4 8 0q3-6-2-9" fill="none" stroke="#372b21" strokeWidth="2"/>
          <path d="M-2 6q-4 3-2 8q4 4 8 0q2-5-2-8" fill="none" stroke="#c7ab7c" strokeWidth="1"/>
          <Screw x={0} y={5} r={1.7}/>
        </g>
      </g>
      {[175,275].map(y=><g key={y} transform={`translate(${door.hinge} ${y})`} stroke={ink} strokeWidth=".55">
        <path d="M-6 0H6V15H-6Z" fill={brass}/><path d="M-1.6-1H1.6V16H-1.6Z" fill="#cdb07c"/>
        <path d="M-.6 0V15M-1.6 4H1.6M-1.6 9H1.6" fill="none" stroke="#edce94" strokeWidth=".5"/>
        {[-4,4].map(x=><Screw key={x} x={x} y={7} r={1}/>)}
      </g>)}
    </g>)}
  </g>;
}
export default function OpenCabinet({id}:{id:string}) {
  return <g data-cabinet-study="finished-open-case">
    <style>{linkageFrames(id)}</style>
    <defs>
      <CabinetWoodDefs id={id}/>
      <linearGradient id={`${id}-walnut`} x1="0" y1="0" x2="1" y2=".35"><stop stopColor="#674631"/><stop offset=".3" stopColor="#96734e"/><stop offset=".68" stopColor="#805b3e"/><stop offset="1" stopColor="#634631"/></linearGradient>
      <linearGradient id={`${id}-interior-light`} x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#626449"/><stop offset=".55" stopColor="#354534"/><stop offset="1" stopColor="#24382c"/></linearGradient>
      <pattern id={`${id}-back-hatch`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1 1-1M0 5 5 0M4 6 6 4" stroke="#b4a775" strokeWidth=".45"/></pattern>
      <clipPath id={`${id}-opening`}><path d="M145 154H447V310H145Z"/></clipPath>
      {wheels.map((wheel,index)=><g key={wheel.name} id={`${id}-wheel-${wheel.name}`}><GearGeometry wheel={wheel} index={index}/></g>)}
    </defs>
    <g transform={`translate(0 ${floorTranslation})`} fill="#3a4233" stroke="none">
      {groundShadows.map((path,i)=><path key={i} d={path} opacity=".016"/>)}
      {doorShadows.map((path,i)=><path key={i} d={path} opacity=".012"/>)}
    </g>
    {[{x:146,y:379},{x:446,y:379},{x:445+dx,y:379-d}].map(({x,y})=><ellipse key={x} cx={x} cy={y} rx="11" ry="2.2" fill="#3a3428" opacity=".17"/>)}
    <Shell id={id}/><Movement id={id}/><Finish id={id}/><OpenDoors id={id}/>
  </g>;
}
