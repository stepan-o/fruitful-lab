import { Glass } from "./VenueFurnishings";

/** Small engraved portraits, with distinct gestures and feet planted on the room's floor. */
function Patron({x,y,scale=1,flip=false,pose="talk",tone="#647d72",id,hair="short"}:{x:number;y:number;scale?:number;flip?:boolean;pose?:"talk"|"play"|"sit"|"watch";tone?:string;id:string;hair?:"short"|"long"|"cap"}) {
 const coat="M-14-83Q-7-89 5-88L16-77L18-44L10-34L-17-38L-19-64Z";
 const seated=pose==="sit";
 return <g transform={`translate(${x} ${y}) scale(${flip?-scale:scale} ${scale*1.2})`} strokeLinejoin="round" data-art-element={`patron-${pose}`}>
  <defs><clipPath id={`${id}-jacket`}><path d={coat}/></clipPath></defs>
  <ellipse cy="3" rx="29" ry="7" fill="#071317" opacity=".75"/>
  {seated?<>
   <path d="M-13-39L29-36L34-6L26-4L18-26L-9-19L-18-24Z" fill="#263338" stroke="#aaa17c" strokeWidth=".8"/>
   <path d="M-13-29L10-21L4 0H-5L-2-18L-23-20Z" fill="#17292f" stroke="#747e68" strokeWidth=".8"/>
   <path d="M-5-2L4-2L12 2V5H-9ZM25-7L34-8L42-3V1H26Z" fill="#101d22" stroke="#c1ad80" strokeWidth=".6"/>
   <path d="M-10-35l32 4 6 20M-13-24l17 4-5 14" fill="none" stroke="#859082" strokeWidth=".6"/>
  </>:<>
   <path d="M-15-41L13-39L11-20L17-4L8 0L-1-24L-7-2H-17L-15-24Z" fill="#25363a" stroke="#9a9f86" strokeWidth=".8"/>
   <path d="M-15-6H-6L-5 1L-19 5L-25 3V0ZM7-6L16-7L24 0V4H9Z" fill="#101d21" stroke="#c5b18c" strokeWidth=".7"/>
   <path d="M-11-34L-13-11M5-34L4-24L12-11M-15 1L-8 0M11 0L19 1" stroke="#b8b18e" strokeWidth=".6" fill="none"/>
  </>}
  <path d={coat} fill={tone} stroke="#9ca88b" strokeWidth=".85"/>
  <g clipPath={`url(#${id}-jacket)`} fill="none">
   <path d={Array.from({length:17},(_,i)=>`M${-23+i*2.5}-87q-6 24 3 54`).join("")} stroke="#0c252b" strokeWidth=".65" opacity=".55"/>
   <path d="M-13-67q-5 13 0 25M-10-82l5 17 8 21M5-82l4 16 1 18" stroke="#e5d0a0" strokeWidth=".7" opacity=".7"/>
  </g>
  <path d="M-6-87L0-70L6-85L2-88Z" fill="#d4c5a0" stroke="#1f3131" strokeWidth=".6"/>
  <path d="M-6-88L-11-81L-4-73L-1-76M5-86L12-77L6-72L1-76M1-72V-42M-10-54h8" fill="none" stroke="#dad0ab" strokeWidth=".65"/>
  <path d="M-17-40Q-3-34 15-39" stroke="#d2bd91" strokeWidth=".7" fill="none"/>
  <path d="M4-62v1m0 7v1m0 7v1" stroke="#e6d1a0" strokeWidth="1.6"/>
  {/* The near hand follows a physical forearm to either a glass or the control deck. */}
  {pose==="play"?<>
   <path d="M11-79Q20-78 20-70L35-73L33-65L14-63L8-72" fill={tone} stroke="#c3be96" strokeWidth=".8"/>
   <path d="M-13-76L-17-63L20-72L21-65L-24-55L-23-75Z" fill={tone} stroke="#99a58c" strokeWidth=".7"/>
   <path d="M33-74L43-74L46-70L42-67L33-67Z M20-73h9l4 4-3 3h-10Z" fill="#bcaa84" stroke="#263c3b" strokeWidth=".7"/>
   <path d="M37-72l7 1m-6 1h5M13-76q5 4 4 6l14-1" stroke="#e3cea2" strokeWidth=".6" fill="none"/>
  </>:<>
   <path d="M11-78L19-61L33-67L36-60L18-51Q11-52 7-65" fill={tone} stroke="#d0c39d" strokeWidth=".85"/>
   <path d="M-15-78Q-24-70-22-54L-14-42L-9-46L-16-58L-10-73" fill={tone} stroke="#a4b097" strokeWidth=".8"/>
   <path d="M32-67l7-4 5 1 1 5-9 5Z M-14-44l5-4 3 4-4 6-5-2Z" fill="#c8b08b" stroke="#243637" strokeWidth=".65"/>
   {pose==="talk"||seated?<Glass x={43} y={-65}/>:<path d="M36-66l10-3m-8 6 7-1" stroke="#d9c19b" strokeWidth="1.5"/>}
   <path d="M12-72L17-59L31-63M-19-67l2 13 5 8" fill="none" stroke="#e1cca4" strokeWidth=".65"/>
  </>}
  <path d="M-3-91L-4-85L3-79L8-87L7-97Z" fill="#a59071" stroke="#243234" strokeWidth=".65"/>
  <g transform="translate(0 -88) scale(.66) translate(0 88)">
  <path d="M-12-108Q-10-122 3-122Q16-120 14-111L16-103L21-100L16-96L15-89Q6-84 0-91L-8-98Z" fill="#c0aa84" stroke="#1b3034" strokeWidth="1"/>
  <path d="M4-116Q11-111 9-101L14-100M13-95l-6 1M-2-96l5 5M10-107h5" fill="none" stroke="#514b3e" strokeWidth=".75"/>
  <circle cx="12" cy="-104" r="1" fill="#14292d"/>
  <path d="M-3-104q-6-6-6 1t5 5M-6-104l2 3" fill="none" stroke="#ead0a0" strokeWidth=".75"/>
  {hair==="long"?<path d="M-12-104Q-23-116-9-124Q6-135 17-118L9-111L-2-116L-5-103L-7-90L-18-78L-24-84Q-15-97-12-104Z" fill="#393a2d" stroke="#9b946d" strokeWidth=".8"/>:hair==="cap"?<><path d="M-15-112Q-9-129 5-127L17-117L21-115L11-111Z" fill="#635740" stroke="#c4ad80" strokeWidth=".7"/><path d="M-15-111L-8-101L-4-110M-6-124l8 10m-12-7 7 7" fill="#3c3d2f" stroke="#ab9a72" strokeWidth=".6"/></>:<path d="M-13-104Q-23-119-8-127Q7-133 16-119L14-112L4-116L-2-112L-4-103L-8-102Z" fill="#26312d" stroke="#8f9474" strokeWidth=".7"/>}
  <path d="M-13-115l8-7m-6 11 10-9m-8 12 5-5" stroke="#c9b68b" strokeWidth=".5" opacity=".5"/>
  </g>
 </g>;
}
export default function VenuePatrons({id}:{id:string}) {
 return <g data-art-element="patrons">
  <Patron x={177} y={439} scale={.83} pose="sit" tone="#758572" id={`${id}-a`} hair="long"/>
  <Patron x={342} y={453} scale={.89} flip pose="talk" tone="#996f50" id={`${id}-b`}/>
  <Patron x={468} y={475} scale={1.1} pose="talk" tone="#a18a5a" id={`${id}-c`} hair="cap"/>
  <Patron x={580} y={494} scale={1.17} flip pose="watch" tone="#52797c" id={`${id}-d`} hair="long"/>
  <Patron x={689} y={486} scale={1.51} pose="play" tone="#728777" id={`${id}-e`}/>
  <Patron x={934} y={490} scale={1.56} flip pose="play" tone="#986d50" id={`${id}-f`} hair="cap"/>
 </g>;
}
