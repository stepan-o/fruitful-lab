"use client";
import {useRef,useState} from "react";
import AssetImage from "@/components/media/AssetImage";
import type {ImageAsset} from "@/lib/assets/types";
import s from "./reader.module.css";
export default function Evidence({asset,alt,caption,original,preload=false}:{asset:ImageAsset;alt:string;caption:string;original:string;preload?:boolean}){
 const dialog=useRef<HTMLDialogElement>(null);
 const [zoom,setZoom]=useState(false);
 const [inspecting,setInspecting]=useState(false);
 const inspectionWidth=Math.max(asset.variants[asset.variants.length-1].width??asset.width,asset.width<480?asset.width*2:0);
 return <figure className={s.evidence}>
 <button className={s.imageButton} style={asset.width<480?{maxWidth:asset.width,marginInline:"auto"}:undefined} type="button" aria-label={`Inspect image: ${alt}`} onClick={()=>{setZoom(false);setInspecting(true);dialog.current?.showModal();}}><AssetImage asset={asset} alt={alt} sizes="(max-width: 850px) 94vw, (max-width: 1400px) 70vw, 1000px" preload={preload}/><span>Inspect ↗</span></button>
 <figcaption>{caption} <a href={original}>Published original ↗</a></figcaption>
 <dialog ref={dialog} aria-label={`Image detail: ${alt}`} className={s.imageDialog} onClose={()=>setInspecting(false)} onClick={e=>{if(e.target===e.currentTarget)dialog.current?.close();}}><div className={s.imageToolbar}><button type="button" aria-pressed={zoom} onClick={()=>setZoom(value=>!value)}>{zoom?"Fit image":"Read full detail"}</button><button type="button" autoFocus onClick={()=>dialog.current?.close()}>Close image</button></div><p className={s.imageHelp}>{zoom?"Scroll or swipe inside the image to inspect it. With the image focused, use the arrow keys.":"Choose Read full detail for small labels and individual panels."}</p><div className={s.imageViewport} tabIndex={0} role="region" aria-label="Scrollable image detail">{inspecting&&<div style={{width:zoom?inspectionWidth:"100%",maxWidth:!zoom&&asset.width<480?asset.width:undefined,marginInline:"auto"}}><AssetImage asset={asset} alt={alt} sizes={zoom?`${inspectionWidth}px`:"96vw"}/></div>}</div><p>{caption}</p></dialog>
 </figure>;
}
