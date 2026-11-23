import { roomPath as d, segment, wallRect } from "./venue-perspective";
import VenueScreen from "./VenueScreen";

/** Uprights face into the aisle; their backs sit against the left wall. */
function Cabinet({z,tone,pong=false}:{z:number;tone:string;pong?:boolean}) {
 const w=1.28, a=z, b=z+w;
 const side=[[-4.05,0,a],[-4.05,1.97,a],[-3.2,1.97,a],[-3.03,1.66,a],[-3.23,1.18,a],[-2.74,1.02,a],[-2.81,.85,a],[-3.05,0,a]] as const;
 const front=(x:number,y:number,x2:number,y2:number)=>d([[x,y,a],[x,y,b],[x2,y2,b],[x2,y2,a]]);
 return <g data-art-element="wall-cabinet" strokeLinejoin="round">
  <path d={d([[-4.1,0,a-.04],[-4.1,0,b+.1],[-2.58,0,b+.1],[-2.58,0,a-.04]])} fill="#050e13" opacity=".55"/>
  <path d={d(side)} fill="#25332f" stroke="#a39064" strokeWidth="1.1"/>
  <path d={d([[-3.94,.15,a-.01],[-3.94,1.83,a-.01],[-3.3,1.83,a-.01],[-3.39,1.27,a-.01],[-2.98,1.0,a-.01],[-3.18,.15,a-.01]])} fill={tone} stroke="#7e7956" strokeWidth=".7"/>
  <path d={Array.from({length:25},(_,i)=>segment([-3.9,.18+i*.064,a-.02],[-3.45,.18+i*.064,a-.02])).join("")} stroke="#142329" strokeWidth=".6" opacity=".55"/>
  <path d={d([[-3.85,.27,a-.025],[-3.85,1.62,a-.025],[-3.56,1.74,a-.025],[-3.45,1.5,a-.025],[-3.58,.43,a-.025]])} fill="#263b3a" stroke="#ae9b70" strokeWidth=".8"/>
  <path d={segment([-3.79,.44,a-.03],[-3.61,1.51,a-.03])+segment([-3.73,.43,a-.03],[-3.55,1.5,a-.03])} stroke="#c1b181" strokeWidth=".7" opacity=".55"/>
  <path d={front(-3.2,1.97,-3.03,1.66)} fill="#5b664b" stroke="#bca778" strokeWidth="1.2"/>
  <path d={d([[-3.15,1.91,a+.08],[-3.15,1.91,b-.08],[-3.05,1.73,b-.08],[-3.05,1.73,a+.08]])} fill="#9f986a"/>
  <path d={Array.from({length:9},(_,i)=>segment([-3.1,1.81,a+.16+i*.106],[-3.13,1.875,a+.16+i*.106])).join("")} stroke="#283c37" strokeWidth="2.2"/>
  <path d={front(-3.03,1.66,-3.23,1.18)} fill="#06161c" stroke="#a29264"/>
  <path d={d([[-3.025,1.64,a+.08],[-3.025,1.64,b-.08],[-3.195,1.215,b-.08],[-3.195,1.215,a+.08]])} fill="#082027" stroke="#7c8e77" strokeWidth="1.2"/>
  <VenueScreen z={z} pong={pong}/>
  <path d={front(-3.23,1.18,-2.74,1.02)} fill="#746443" stroke="#c6af7b" strokeWidth="1"/>
  <path d={front(-2.74,1.02,-2.81,.85)} fill="#24352e" stroke="#998358"/>
  {[a+.34,b-.3].map(q=><g key={q}>
   {pong?<path d={wallRect(-2.94,1.08,q-.05,.1,.04,true)} fill="#202c2b" stroke="#d8be86" strokeWidth="1.6"/>:<><path d={segment([-2.95,1.09,q],[-2.95,1.17,q])} stroke="#d1c08e" strokeWidth="2"/><path d={wallRect(-2.94,1.155,q-.035,.07,.06,true)} fill="#b98159" stroke="#e0bb83" strokeWidth=".6"/></>}
   <path d={segment([-2.83,1.055,q+.12],[-2.83,1.055,q+.2])} stroke="#d6b17c" strokeWidth="2.6"/>
  </g>)}
  <path d={front(-2.81,.85,-3.05,0)} fill="#213430" stroke="#9c8b61"/>
  <path d={d([[-2.86,.7,a+.3],[-2.86,.7,b-.3],[-3.01,.16,b-.3],[-3.01,.16,a+.3]])} fill="#0e1d23" stroke="#78846b" strokeWidth=".8"/>
  <path d={segment([-2.87,.66,a+.49],[-2.9,.56,a+.49])+segment([-2.96,.3,a+.48],[-2.96,.3,a+.77])} stroke="#c5b281" strokeWidth="2"/>
 </g>;
}
export default function VenueCabinets(){return <g data-art-element="cabinet-row"><Cabinet z={5} tone="#665443"/><Cabinet z={3.1} tone="#4e6553"/><Cabinet z={1.05} tone="#75613f" pong/></g>;}
