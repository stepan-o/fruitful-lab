"use client";
import {useEffect,useState,type RefObject} from "react";
/** Geometry follows the available study width; CSS reserves its matching ratio before hydration. */
export function useCompactStudy(ref:RefObject<HTMLDivElement|null>){
 const [compact,setCompact]=useState(false);
 useEffect(()=>{
  const element=ref.current;if(!element)return;
  const observer=new ResizeObserver(([entry])=>setCompact(entry.contentRect.width<=640));
  observer.observe(element);return()=>observer.disconnect();
 },[ref]);
 return compact;
}
