import { memo, useId, type CSSProperties } from "react";
import VenueArchitecture from "./VenueArchitecture";
import VenueFurnishings from "./VenueFurnishings";
import VenuePatrons from "./VenuePatrons";
import ArcadeCabinet from "./ArcadeCabinet";
import s from "./arcade-craft.module.css";

const motes=Array.from({length:16},(_,i)=>({x:135+(i*137)%729,y:129+(i*61)%217,r:.65+(i%3)*.25,delay:-i*1.71,duration:11+(i%5)*2}));
/** A Sanctuary woodcut of an imagined social venue; not a historical reconstruction. */
function EveningVenue(){
 const id=useId().replaceAll(":","");
 return <svg viewBox="0 0 1000 590" role="img" aria-label="An imagined venue: conversation, spectators and a game share a warmly lit room">
  <defs>
   <radialGradient id={`${id}-lamplight`}><stop stopColor="#e9c78c" stopOpacity=".29"/><stop offset=".35" stopColor="#d8ac64" stopOpacity=".1"/><stop offset="1" stopColor="#d8ac64" stopOpacity="0"/></radialGradient>
   <radialGradient id={`${id}-screenlight`}><stop stopColor="#99d5bd" stopOpacity=".17"/><stop offset="1" stopColor="#74b6aa" stopOpacity="0"/></radialGradient>
   <radialGradient id={`${id}-vignette`}><stop offset=".55" stopColor="#071218" stopOpacity="0"/><stop offset="1" stopColor="#071218" stopOpacity=".64"/></radialGradient>
  </defs>
  <path d="M0 0H1000V590H0Z" fill="#101d21"/>
  <VenueArchitecture id={id}/>
  <VenueFurnishings id={id}/>
  <ellipse cx="805" cy="446" rx="116" ry="32" fill={`url(#${id}-screenlight)`}/>
  <svg x="670" y="169" width="283" height="334" viewBox="0 0 500 590" overflow="visible" aria-hidden="true"><ArcadeCabinet label="" decorative/></svg>
  <VenuePatrons id={id}/>
  {/* Light touches the people and floor; it never washes out the entire room. */}
  <ellipse cx="235" cy="407" rx="106" ry="20" fill={`url(#${id}-lamplight)`} opacity=".65"/>
  <ellipse cx="544" cy="427" rx="92" ry="24" fill={`url(#${id}-lamplight)`} opacity=".45"/>
  <g aria-hidden="true" pointerEvents="none" data-art-element="room-atmosphere">
   {motes.map((m,i)=><circle key={i} className={s.mote} cx={m.x} cy={m.y} r={m.r} fill={i%3?"#d1bd8a":"#9fccc2"} style={{animationDelay:`${m.delay}s`,animationDuration:`${m.duration}s`} as CSSProperties}/>)}
   <g transform="translate(235 399)"><path className={s.steam} d="M0 0C-5-7 4-13 1-20S-3-27 0-31" fill="none" stroke="#e1cf9e" strokeWidth="1.7"/></g>
   <g transform="translate(235 399)"><path className={s.steam} d="M1 0C7-9-2-15 2-24" fill="none" stroke="#e1cf9e" strokeWidth="1.2" style={{animationDelay:"-4.5s"}}/></g>
  </g>
  <path d="M0 0H1000V590H0Z" fill={`url(#${id}-vignette)`} pointerEvents="none"/>
  <g fill="none" stroke="#b59b68" opacity=".65" strokeWidth=".8"><path d="M14 53V16H76M924 16H986V53M14 534V574H76M924 574H986V534"/><path d="M20 40V23H51M949 23H979V40M20 550V567H51M949 567H979V550"/></g>
  <path d="M495 571l5-7 5 7-5 7Z" fill="#162b30" stroke="#b9a273" strokeWidth=".8"/>
 </svg>;
}
export default memo(EveningVenue);
