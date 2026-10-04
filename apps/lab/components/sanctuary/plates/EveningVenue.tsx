import { memo, useId, type CSSProperties } from "react";
import VenueArchitecture from "./VenueArchitecture";
import VenueCabinets from "./VenueCabinets";
import VenueFurnishings, { ForegroundTable, VenueBackBar } from "./VenueFurnishings";
import VenuePatrons, { Bartender } from "./VenuePatrons";
import s from "./arcade-craft.module.css";

const motes=Array.from({length:10},(_,i)=>({x:115+(i*109)%752,y:125+(i*43)%201,r:.65+(i%3)*.25,delay:-i*1.7,duration:13+i%5}));
/** Original interpretation of a photographed arcade bar, not a historical reconstruction. */
function EveningVenue() {
 const id=useId().replaceAll(":","");
 return <svg viewBox="0 0 1000 590" role="img" aria-label="An imagined arcade bar: cabinets line the left wall, a timber counter runs along the right, and players face glowing screens beside an open aisle" data-venue-composition="photographic-perspective">
  <defs>
   <radialGradient id={`${id}-lamplight`}><stop stopColor="#e4b671" stopOpacity=".3"/><stop offset=".38" stopColor="#d8ac64" stopOpacity=".13"/><stop offset="1" stopColor="#d8ac64" stopOpacity="0"/></radialGradient>
   <radialGradient id={`${id}-crtlight`}><stop stopColor="#7fbcae" stopOpacity=".14"/><stop offset="1" stopColor="#74b6aa" stopOpacity="0"/></radialGradient>
   <radialGradient id={`${id}-vignette`}><stop offset=".5" stopColor="#071218" stopOpacity="0"/><stop offset="1" stopColor="#071218" stopOpacity=".62"/></radialGradient>
  </defs>
  <VenueArchitecture id={id}/>
  <VenueBackBar/>
  <Bartender/>
  <VenueCabinets/>
  <VenueFurnishings id={id}/>
  <VenuePatrons/>
  <ellipse cx="280" cy="324" rx="110" ry="150" fill={`url(#${id}-crtlight)`} pointerEvents="none"/>
  <ForegroundTable/>
  <g aria-hidden="true" pointerEvents="none" data-art-element="room-atmosphere">
   {motes.map((m,i)=><circle key={i} className={s.mote} cx={m.x} cy={m.y} r={m.r} fill={i%3?"#d1bd8a":"#9fccc2"} style={{animationDelay:`${m.delay}s`,animationDuration:`${m.duration}s`} as CSSProperties}/>)}
  </g>
  <path d="M0 0H1000V590H0Z" fill={`url(#${id}-vignette)`} pointerEvents="none"/>
  <path d="M14 53V16H76M924 16H986V53M14 534V574H76M924 574H986V534" fill="none" stroke="#ad9667" opacity=".5" strokeWidth=".8"/>
 </svg>;
}
export default memo(EveningVenue);
