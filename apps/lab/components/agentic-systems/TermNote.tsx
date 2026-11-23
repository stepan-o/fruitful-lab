"use client";
import {useEffect,useId,useLayoutEffect,useRef,useState,type ReactNode} from "react";
import {createPortal} from "react-dom";
import s from "./term-note.module.css";

/** Supplementary, non-interactive detail; the trigger remains the keyboard target. */
export default function TermNote({term,children}:{term:string;children:ReactNode}){
 const id=useId(),trigger=useRef<HTMLButtonElement>(null),panel=useRef<HTMLSpanElement>(null);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),pinned=useRef(false);
 const [open,setOpen]=useState(false),[position,setPosition]=useState({left:12,top:12,ready:false});
 const cancel=()=>{if(timer.current)clearTimeout(timer.current);};
 const dismiss=()=>{cancel();pinned.current=false;setOpen(false);};
 const leave=()=>{cancel();timer.current=setTimeout(()=>{if(!pinned.current&&document.activeElement!==trigger.current)setOpen(false);},120);};
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 useEffect(()=>{
  if(!open)return;
  const key=(event:KeyboardEvent)=>{if(event.key==="Escape"){event.stopPropagation();pinned.current=false;setOpen(false);}};
  const outside=(event:PointerEvent)=>{const target=event.target as Node;if(!trigger.current?.contains(target)&&!panel.current?.contains(target)){pinned.current=false;setOpen(false);}};
  document.addEventListener("keydown",key,true);document.addEventListener("pointerdown",outside);
  return()=>{document.removeEventListener("keydown",key,true);document.removeEventListener("pointerdown",outside);};
 },[open]);
 useLayoutEffect(()=>{
  if(!open)return;
  const place=()=>{if(!trigger.current||!panel.current)return;
   const t=trigger.current.getBoundingClientRect(),p=panel.current.getBoundingClientRect();
   const frame=document.documentElement.getBoundingClientRect(),h=window.innerHeight;
   // Stable scrollbar gutters can offset the fixed-position containing block.
   const originX=p.left-parseFloat(panel.current.style.left||"0"),originY=p.top-parseFloat(panel.current.style.top||"0");
   const minX=Math.max(0,frame.left)+12,maxX=Math.min(window.innerWidth,frame.right)-12;
   const left=Math.max(minX,Math.min(t.left+t.width/2-p.width/2,maxX-p.width));
   const desired=t.top>=p.height+20?t.top-p.height-10:t.bottom+10;
   setPosition({left:left-originX,top:Math.max(12,Math.min(desired,h-p.height-12))-originY,ready:true});};
  place();const observer=new ResizeObserver(place);if(panel.current)observer.observe(panel.current);
  window.addEventListener("resize",place);window.addEventListener("scroll",place,true);
  return()=>{observer.disconnect();window.removeEventListener("resize",place);window.removeEventListener("scroll",place,true);};
 },[open]);
 return <span className={s.term}><button ref={trigger} type="button" className={s.trigger} aria-expanded={open} aria-controls={open?id:undefined} aria-describedby={open?id:undefined}
  onPointerEnter={event=>{if(event.pointerType==="mouse"){cancel();setOpen(true);}}} onPointerLeave={leave}
  onFocus={()=>{cancel();setOpen(true);}} onBlur={dismiss}
  onClick={()=>{if(pinned.current)dismiss();else{pinned.current=true;setOpen(true);}}}>{term}<span aria-hidden="true" className={s.mark}>＋</span></button>
 {open&&createPortal(<span ref={panel} id={id} role="tooltip" className={s.panel} style={{left:position.left,top:position.top,visibility:position.ready?"visible":"hidden"}} onPointerEnter={cancel} onPointerLeave={leave}><strong>{term}</strong>{children}</span>,document.body)}</span>;
}
