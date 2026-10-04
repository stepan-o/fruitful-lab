import { project, wallRect } from "./venue-perspective";
import s from "./venue-life.module.css";

// Two tiled stroke groups, clipped behind the actual door frame; no particle loop.
const rain = (offset:number) => Array.from({length:10},(_,row)=>Array.from({length:16},(_,col)=>{
 const x=col*13-row*6+offset, y=row*24-48;
 return `M${x} ${y}l-2 8`;
}).join("")).join("");
const fineRain=rain(-25),nearRain=rain(-19);
export default function VenueWeather({id}:{id:string}) {
 const [x,y]=project([-1.22,2.45,8.94]);
 return <g data-art-element="weather-outside" aria-hidden="true">
  <defs><clipPath id={`${id}-door-glass`}><path d={wallRect(-1.22,.12,8.94,2.08,2.33)}/></clipPath></defs>
  <g clipPath={`url(#${id}-door-glass)`}>
   <g transform={`translate(${x} ${y})`}>
    <path className={s.lightning} d="M0 0H104V113H0Z" fill="#b4d5cb"/>
    <g fill="none" stroke="#bed6c5" strokeLinecap="round">
     <path className={s.rainFar} d={fineRain} strokeWidth=".65"/>
     <path className={s.rainNear} d={nearRain} strokeWidth=".95"/>
    </g>
   </g>
  </g>
 </g>;
}
