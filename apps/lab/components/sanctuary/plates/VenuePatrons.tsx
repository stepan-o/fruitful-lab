import { Glass } from "./VenueFurnishings";
import motion from "./venue-life.module.css";
import VenueHead from "./VenueHead";
import { atFloor, project, roomScale } from "./venue-perspective";

/** Restrained silhouettes, approximately seven heads tall; all scale comes from floor depth. */
function Player({x,z,shirt="#58746b",near=false,controlZ}:{x:number;z:number;shirt?:string;near?:boolean;controlZ:number}) {
 const [ox,oy]=project([x,0,z]), k=roomScale(z)/100;
 const [cx,cy]=project([-2.94,1.12,controlZ]);
 const hx=Math.round((cx-ox)/k*100)/100, hy=Math.round((cy-oy)/k*100)/100;
 return <g transform={atFloor(x,z)} data-art-element="player-facing-screen" data-control-depth={controlZ} strokeLinejoin="round">
  <ellipse cx="2" cy="2" rx="32" ry="6" fill="#071318" opacity=".75"/>
  {/* A planted rear leg and a slightly bent front knee support the forward lean. */}
  <path d="M-14-83L12-82L16-44L25-6L15-3L2-38L-5-62L-12-35L-12-3H-24L-25-43Z" fill="#1b2d32" stroke="#687466" strokeWidth=".7"/>
  <path d="M-12-78L-17-42L-18-8M5-75L8-40L19-8" fill="none" stroke="#879184" strokeWidth=".7" opacity=".5"/>
  <path d="M-24-6H-12L-12 1L-32 3L-35 0ZM15-6L25-8L30-1L27 3H12Z" fill="#0b1a20" stroke="#9e997b" strokeWidth=".75"/>
  {/* Far hand, then torso, then near forearm: the elbow-to-wrist chain meets the deck. */}
  <path d={`M-24-141L-40-120L${hx+8} ${hy+3}`} fill="none" stroke={shirt} strokeWidth="9" strokeLinecap="round"/>
  <path d={`M${hx+8} ${hy+3}l-8-2`} stroke="#b1a382" strokeWidth="4" strokeLinecap="round"/>
  <path d="M-29-148Q-17-152-7-146L7-134L14-84Q-1-77-22-84L-26-114L-35-137Z" fill={shirt} stroke="#96a08c" strokeWidth=".8"/>
  <path d="M-26-146L-20-120L-12-91L9-87M-9-142L-1-131L4-108" fill="none" stroke="#d0bd91" strokeWidth=".75" opacity=".48"/>
  <path d="M-21-120L-10-101M-19-115L-9-96M-16-109L-7-92M-26-143L-15-139" stroke="#233d3b" strokeWidth="1.4" opacity=".6"/>
  <path d={`M-1-137Q9-138 9-128L-8-108L${hx+9} ${hy+4}L${hx+8} ${hy-3}L-19-116L-9-132Z`} fill={shirt} stroke="#a8ad91" strokeWidth=".8"/>
  <path d={`M${hx+9} ${hy-3}l-10-1-5 3 1 4 14 1Z`} fill="#c4b28b" stroke="#263a37" strokeWidth=".6"/>
  <path d={`M-4-133L-15-112L${hx+13} ${hy}`} fill="none" stroke="#d9c59a" strokeWidth=".65" opacity=".65"/>
  <VenueHead x={-22} y={-170} hair={near?"#253334":"#434431"}/>

 </g>;
}
export function Bartender() {
 return <g transform={atFloor(2.95,4.35)} data-art-element="bartender" strokeLinejoin="round">
  <path d="M-18-137Q0-150 17-137L26-86L-23-85Z" fill="#17292d" stroke="#738476" strokeWidth=".7"/>
  <path d="M-10-139L-4-129L-1-92M7-139L3-129" fill="none" stroke="#a8a180" strokeWidth=".7"/>
  <path d="M-11-124H11L15-86H-15Z" fill="#5b6859" stroke="#93937a" strokeWidth=".7"/>
  <VenueHead x={0} y={-160} hair="#202d2d"/>
  {/* The supporting hand and glass stay still; the other elbow pivots the polishing cloth. */}
  <path d="M-15-133L-27-120L-32-112" fill="none" stroke="#485e57" strokeWidth="10" strokeLinecap="round"/>
  <Glass x={-29} y={-114}/>
  <path d="M-34-116q4 5 8 0" fill="none" stroke="#c8b68e" strokeWidth="4" strokeLinecap="round"/>
  <path d="M15-134L17-117" stroke="#485e57" strokeWidth="10" strokeLinecap="round"/>
  <g transform="translate(17 -117)">
   <g className={motion.polish} data-art-element="polishing-arm">
    <path d="M0 0L-33-5" stroke="#68796a" strokeWidth="9" strokeLinecap="round"/>
    <path d="M-33-5L-43-5" stroke="#c8b68e" strokeWidth="5" strokeLinecap="round"/>
    <path d="M-49-12L-39-10L-41-2L-38 5L-46 9L-51 2Z" fill="#b9b699" stroke="#d9ceb0" strokeWidth=".6"/>
    <path d="M-47-8L-44-2L-46 5M-42-6L-43 1" fill="none" stroke="#697b70" strokeWidth=".7"/>
   </g>
  </g>
 </g>;
}
function BarGuest({x,z,shirt,longHair=false}:{x:number;z:number;shirt:string;longHair?:boolean}) {
 return <g transform={atFloor(x,z)} data-art-element="seated-bar-guest" strokeLinejoin="round">
  {/* Pelvis is on the 72cm stool, knees point toward the counter, feet on its rail. */}
  <path d="M-13-76L12-76L30-57L23-28H14L17-54L-9-55Z" fill="#20343a" stroke="#788679" strokeWidth=".7"/>
  <path d="M-10-65L3-48L-2-18H-12L-10-48L-23-62Z" fill="#182c34" stroke="#6e7b70" strokeWidth=".7"/>
  <path d="M-12-21H-1L6-17V-13H-14ZM14-30H25L31-27V-23H13Z" fill="#0c1d23" stroke="#a7a181" strokeWidth=".6"/>
  <path d="M-20-129Q-3-140 9-129L18-112L12-76Q-5-70-21-78L-23-102Z" fill={shirt} stroke="#92a08b" strokeWidth=".7"/>
  <path d="M-17-124L-12-100L-15-82M-5-128L1-100L9-82" fill="none" stroke="#c5b58c" strokeWidth=".75" opacity=".47"/>
  <path d="M8-124L23-107L39-108L40-100L18-98L1-115Z" fill={shirt} stroke="#9fab8d" strokeWidth=".7"/>
  <path d="M39-108l9-2 5 4-3 5-10 1Z" fill="#c1ad86"/>
  <path d="M-20-122L-30-98L-17-88" fill="none" stroke={shirt} strokeWidth="10" strokeLinecap="round"/>
  <path d="M-17-89l6 4" stroke="#b4a282" strokeWidth="5" strokeLinecap="round"/>
  <VenueHead x={1} y={-149} facing="right" hair={longHair?"#454034":"#303d37"} longHair={longHair}/>

 </g>;
}
export default function VenuePatrons() {
 return <g data-art-element="patrons">
  <Player x={-2.11} z={4.08} controlZ={3.98} shirt="#85734f"/>
  <BarGuest x={1.02} z={5.55} shirt="#987958"/>
  <BarGuest x={1.02} z={2.15} shirt="#4c6d72" longHair/>
  {/* Far-to-near order: each partner reaches a different rotary control. */}
  <g data-art-element="two-player-pair">
   <Player x={-2.03} z={2.2} controlZ={2.03} shirt="#8d715b"/>
   <Player x={-2.09} z={1.26} controlZ={1.39} shirt="#64776a" near/>
  </g>
  {/* A quiet spectator, turned toward the nearer game, keeps the social context legible. */}
  <g transform={atFloor(-.15,3.2)} data-art-element="spectator" strokeLinejoin="round">
   <ellipse cy="2" rx="22" ry="5" fill="#09191e"/>
   <path d="M-12-84H11L13-42L18-4H8L1-48L-5-4H-16L-15-45Z" fill="#203238" stroke="#65786e" strokeWidth=".7"/>
   <path d="M-16-6H-5L-5 2H-23V-1ZM8-6H18L23 0V3H7Z" fill="#0a1b22" stroke="#a2a184" strokeWidth=".6"/>
   <path d="M-17-145Q1-153 16-141L19-89L10-80L-19-85Z" fill="#796148" stroke="#9b987b" strokeWidth=".8"/>
   <path d="M-16-137L-26-108L-13-100M15-136L24-114L12-103" fill="none" stroke="#927657" strokeWidth="10" strokeLinecap="round"/>
   <path d="M-12-102L-6-100M12-104L6-102" stroke="#bca681" strokeWidth="4" strokeLinecap="round"/>
   <Glass x={1} y={-100}/>
   <VenueHead x={-2} y={-168} hair="#3e4132"/>

  </g>
 </g>;
}
