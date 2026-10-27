"use client";
import {useState} from "react";
import {useLivingPlate} from "@/components/sanctuary/plates/useLivingPlate";
import s from "./delegation.module.css";
export default function GripBoundary(){
 const [whole,setWhole]=useState(false);const ref=useLivingPlate<HTMLDivElement>();
 return <div ref={ref} className={s.cabinet} data-playing="false"><div className={s.gripControls} role="group" aria-label="Choose the receiving check"><button type="button" aria-pressed={!whole} onClick={()=>setWhole(false)}>Wrist target</button><button type="button" aria-pressed={whole} onClick={()=>setWhole(true)}>Whole relation</button></div>
 <svg className={s.grip} viewBox="0 0 700 430" role="img" aria-label={whole?"A schematic wrist reaches its target, while the card overlaps the torso envelope.":"The wrist target is isolated; the surrounding body and card are barely visible."}>
 <defs><pattern id="grip-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 0v9" stroke="#ac694b" strokeWidth="3"/></pattern></defs>
 <rect width="700" height="430" fill="#e1d6b9"/><path d="M30 35H670V390H30Z" fill="#ece2c6" stroke="#b3a889"/>{[85,135,185,235,285,335].map(y=><path key={y} d={`M30 ${y}h640`} stroke="#b2baa2" opacity=".25"/>)}{[80,130,180,230,280,330,380,430,480,530,580,630].map(x=><path key={x} d={`M${x} 35v355`} stroke="#b2baa2" opacity=".25"/>)}
 <g opacity={whole?1:.12} className={s.envelope}>
 <path d="M161 155Q220 111 282 151L300 321Q229 346 168 317Z" fill="#789b91" stroke="#365e59" strokeWidth="4"/><path d="M195 174h58v64h-58Z" fill="#4f756f"/><path d="M200 130v-20h43v22" fill="#91ac9a"/><circle cx="220" cy="82" r="33" fill="#9ab2a0" stroke="#3b6159" strokeWidth="3"/><path d="M189 80h62v14h-62Z" fill="#375c56"/>
 <path d="M180 327l-5 55M273 327l12 55" stroke="#567d74" strokeWidth="25"/><path d="M151 386h49M266 386h46" stroke="#335c55" strokeWidth="12"/>
 <path d="M277 168L364 203L321 255" fill="none" stroke="#557d74" strokeWidth="24" strokeLinecap="round"/><path d="M277 168L364 203L321 255" fill="none" stroke="#abc0a8" strokeWidth="13" strokeLinecap="round"/>
 <path d="M312 241l26 11-14 23-25-7Z" fill="#b39a70" stroke="#5b6d54" strokeWidth="3"/><path d="M266 218l49 11-20 75-49-13Z" fill="#f0d69e" stroke="#9b714c" strokeWidth="3"/><path d="M272 234l29 7M267 246l24 6" stroke="#9e875e" strokeWidth="4"/>
 <path d="M162 145Q225 101 290 147L315 329Q233 361 152 328Z" fill="none" stroke="#a66042" strokeWidth="3" strokeDasharray="8 6"/><path d="M266 218l33 8 7 44-11 34-49-13Z" fill="url(#grip-hatch)" opacity=".75"/>
 <path d="M456 141h169v135H456Z" fill="#bcc4a4" stroke="#607d68"/><path d="M476 160h125M476 178h88M476 208h125M476 226h107M476 244h125" stroke="#78917a" strokeWidth="5"/><path d="M321 271L431 302L476 276" fill="none" stroke="#a66042" strokeWidth="2"/><circle cx="431" cy="302" r="6" fill="#a66042"/>
 </g>
 <path d="M286 255h70M321 220v70" stroke="#3a7666" strokeWidth="2"/><circle cx="321" cy="255" r="17" fill="none" stroke="#4c8b71" strokeWidth="3"/><circle cx="321" cy="255" r="5" fill="#316f5b"/>
 <g opacity={whole?.35:1} className={s.envelope}><path d="M338 247L424 118H569" fill="none" stroke="#587d69" strokeWidth="2"/><circle cx="559" cy="86" r="24" fill="#8caf91"/><path d="M546 86l9 9 18-21" stroke="#eef1d2" strokeWidth="5" fill="none"/></g>
 </svg>
 <div className={s.gripReading} aria-live="polite"><h3>{whole?"The receiver needs an arrangement.":"A point answers a narrow question."}</h3><p>{whole?"Adding the body envelope changes what this drawing lets us notice. The target remains satisfied; the card and arm still need room. A joint handoff would make that relationship inspectable.":"A target marker can establish where the wrist should go. It says nothing by itself about the volume occupied by the rest of the performance."}</p></div></div>;
}
