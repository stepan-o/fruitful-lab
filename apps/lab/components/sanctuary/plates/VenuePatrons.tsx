import { Glass } from "./VenueFurnishings";
import { atFloor } from "./venue-perspective";

/** Restrained silhouettes, approximately seven heads tall; all scale comes from floor depth. */
function Player({x,z,shirt="#58746b",near=false}:{x:number;z:number;shirt?:string;near?:boolean}) {
 return <g transform={atFloor(x,z)} data-art-element="player-facing-screen" strokeLinejoin="round">
  <ellipse cx="2" cy="2" rx="32" ry="6" fill="#071318" opacity=".75"/>
  {/* A planted rear leg and a slightly bent front knee support the forward lean. */}
  <path d="M-14-83L12-82L16-44L25-6L15-3L2-38L-5-62L-12-35L-12-3H-24L-25-43Z" fill="#1b2d32" stroke="#687466" strokeWidth=".7"/>
  <path d="M-12-78L-17-42L-18-8M5-75L8-40L19-8" fill="none" stroke="#879184" strokeWidth=".7" opacity=".5"/>
  <path d="M-24-6H-12L-12 1L-32 3L-35 0ZM15-6L25-8L30-1L27 3H12Z" fill="#0b1a20" stroke="#9e997b" strokeWidth=".75"/>
  {/* Far hand, then torso, then near forearm: the elbow-to-wrist chain meets the deck. */}
  <path d="M-24-141L-45-118L-71-112L-70-106L-39-108L-13-130Z" fill={shirt} stroke="#879781" strokeWidth=".75"/>
  <path d="M-70-112L-80-111L-84-106L-79-103L-69-106Z" fill="#b1a382"/>
  <path d="M-29-148Q-17-152-7-146L7-134L14-84Q-1-77-22-84L-26-114L-35-137Z" fill={shirt} stroke="#96a08c" strokeWidth=".8"/>
  <path d="M-26-146L-20-120L-12-91L9-87M-9-142L-1-131L4-108" fill="none" stroke="#d0bd91" strokeWidth=".75" opacity=".48"/>
  <path d="M-21-120L-10-101M-19-115L-9-96M-16-109L-7-92M-26-143L-15-139" stroke="#233d3b" strokeWidth="1.4" opacity=".6"/>
  <path d="M-1-137Q9-138 9-128L-4-106L-62-99L-64-107L-17-113L-9-132Z" fill={shirt} stroke="#a8ad91" strokeWidth=".8"/>
  <path d="M-62-108L-73-109L-78-105L-76-100L-62-99Z" fill="#c4b28b" stroke="#263a37" strokeWidth=".6"/>
  <path d="M-67-106L-75-104M-4-133L-11-116L-57-105" fill="none" stroke="#d9c59a" strokeWidth=".65" opacity=".65"/>
  <path d="M-26-157L-26-145L-18-140L-11-147L-12-156Z" fill="#a99a7a"/>
  {/* Three-quarter rear head, nose toward the screen rather than another player. */}
  <path d="M-34-167Q-36-181-22-181Q-9-180-8-169L-11-157L-18-151L-28-155L-29-161L-36-162Z" fill="#beac88" stroke="#314240" strokeWidth=".7"/>
  <path d="M-35-169Q-40-179-30-184Q-16-190-9-179L-7-169L-13-161L-18-162L-18-172L-28-172Z" fill={near?"#253334":"#3c3f30"} stroke="#829380" strokeWidth=".65"/>
  <path d="M-19-165q5-5 6 1l-3 5M-29-158l5 3" fill="none" stroke="#d7c599" strokeWidth=".7"/>
 </g>;
}
export function Bartender() {
 return <g transform={atFloor(2.95,4.35)} data-art-element="bartender">
  <path d="M-18-137Q0-150 17-137L26-86L-23-85Z" fill="#17292d" stroke="#738476" strokeWidth=".7"/>
  <path d="M-4-145L-7-136L1-128L8-138L6-146Z" fill="#baaa87"/>
  <path d="M-10-166Q0-174 10-164L9-150L1-143L-9-150Z" fill="#c1af88"/>
  <path d="M-11-159L-13-170L-4-175L9-171L13-159L6-163L-4-163Z" fill="#202d2d" stroke="#9b9a78" strokeWidth=".6"/>
  <path d="M-15-133L-26-112L-38-109M15-134L25-116L9-106" fill="none" stroke="#485e57" strokeWidth="11" strokeLinecap="round"/>
  <path d="M-37-109l-7 1M8-106l-6-1" stroke="#c8b68e" strokeWidth="5" strokeLinecap="round"/>
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
  <path d="M-7-140L-6-131L2-126L8-135L7-145Z" fill="#a69272"/>
  <path d="M-12-155Q-8-167 4-162L12-154L12-149L17-145L12-141L9-134L-2-135L-10-143Z" fill="#c3af87"/>
  {longHair?<path d="M-12-147Q-19-163-5-169Q12-170 14-153L7-152L3-158L-2-155L-1-139L-9-120L-19-128Z" fill="#3f3d2e" stroke="#969274" strokeWidth=".7"/>:<path d="M-12-145Q-20-160-6-168Q7-171 14-157L9-152L0-159L-4-149Z" fill="#303d37" stroke="#95977a" strokeWidth=".7"/>}
  <path d="M8-147h3M9-140l-5 1" stroke="#655b47" strokeWidth=".6"/>
 </g>;
}
export default function VenuePatrons() {
 return <g data-art-element="patrons">
  <Player x={-2.11} z={4.08} shirt="#85734f"/>
  <BarGuest x={1.02} z={5.55} shirt="#987958"/>
  <BarGuest x={1.02} z={2.15} shirt="#4c6d72" longHair/>
  <Player x={-1.8} z={1.7} shirt="#64776a" near/>
  {/* A quiet spectator, turned toward the nearer game, keeps the social context legible. */}
  <g transform={atFloor(-.15,3.2)} data-art-element="spectator" strokeLinejoin="round">
   <ellipse cy="2" rx="22" ry="5" fill="#09191e"/>
   <path d="M-12-84H11L13-42L18-4H8L1-48L-5-4H-16L-15-45Z" fill="#203238" stroke="#65786e" strokeWidth=".7"/>
   <path d="M-16-6H-5L-5 2H-23V-1ZM8-6H18L23 0V3H7Z" fill="#0a1b22" stroke="#a2a184" strokeWidth=".6"/>
   <path d="M-17-145Q1-153 16-141L19-89L10-80L-19-85Z" fill="#796148" stroke="#9b987b" strokeWidth=".8"/>
   <path d="M-16-137L-26-108L-13-100M15-136L24-114L12-103" fill="none" stroke="#927657" strokeWidth="10" strokeLinecap="round"/>
   <path d="M-12-102L-6-100M12-104L6-102" stroke="#bca681" strokeWidth="4" strokeLinecap="round"/>
   <Glass x={1} y={-100}/>
   <path d="M-5-154V-144L2-140L8-146V-155Z" fill="#a38e6d"/>
   <path d="M-12-172Q-3-181 8-173L12-160L4-150L-7-154L-9-161L-16-165Z" fill="#bba680"/>
   <path d="M-13-167Q-20-180-4-183Q11-186 14-171L10-161L5-162L3-174L-7-173Z" fill="#3e4132" stroke="#8b9277" strokeWidth=".7"/>
   <path d="M0-168q6-4 5 2M-10-160l5 3" fill="none" stroke="#d5c09a" strokeWidth=".6"/>
  </g>
 </g>;
}
