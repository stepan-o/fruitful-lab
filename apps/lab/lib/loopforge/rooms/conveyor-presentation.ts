import type {View} from '../encounters/contract';

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
/** A disposable visual projection. Only the encounter kernel can advance a batch.
 * Seeking, waiting to read, lowering effects and dropping frames never make output. */
export function conveyorFrame(process:View['process']){
 const stage=process?.stage??0,active=process?.active?.station,p=clamp(process?.progress??0);
 let x=[135.5,136.5,140.5,148.5,150.2][Math.min(4,Math.max(0,stage))],height=stage===0?.65:1.12;
 let clean=stage>=2?1:0,compressed=stage>=4?1:0,ram=0,spray=0,heat=0;
 if(active==='intake'){x=mix(135.5,136.5,ease(p));height=mix(.65,1.12,ease(p));}
 if(active==='wash'){x=mix(136.5,140.5,ease(p/.4));clean=ease((p-.4)/.5);spray=p>.35&&p<.94?1:0;}
 if(active==='belt')x=mix(140.5,148.5,ease(p));
 if(active==='forge'){
  ram=p<.25?ease(p/.25):1-ease((p-.72)/.18);
  compressed=ease((p-.25)/.35);heat=Math.sin(Math.PI*clamp((p-.25)/.65));
  x=mix(148.5,150.2,ease((p-.9)/.1));
 }
 return {x,y:102.4,height,clean,compressed,ram,spray,heat,
  beltRunning:active==='wash'||active==='belt'||active==='forge',
  // Material changes are meaningful even with every optional effect disabled.
  appearance:compressed>.5?'compressed':clean>.5?'washed':'dirty',
  ready:stage>=4,output:process?.output??0};
}

/** Platen underside meets the workpiece instead of cutting through its lobes. */
export function compressionPose(compressed:number,ram:number,sourceHeight:number){
 const heightScale=1-clamp(compressed)*.55,widthScale=1-clamp(compressed)*.6;
 const top=1.12+.1+sourceHeight*heightScale,contact=top+.125;
 return {heightScale,widthScale,top,platen:contact+(2.55-contact)*(1-clamp(ram))};
}
