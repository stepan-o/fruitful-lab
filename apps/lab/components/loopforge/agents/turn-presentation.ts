import {DAY_ONE_NIGHT_ART} from '@/lib/loopforge/encounters/day-one-night';
import type {Bubble,Character,View} from '@/lib/loopforge/encounters/contract';
import {REACTION_ART} from '@/lib/loopforge/encounters/dialogue-turn';
export function presentedSpeech(view:View|null|undefined):Bubble[]{if(!view)return [];const status=view.credentialStatus;return [...view.bubbles,...(status?[{id:'credential-status-'+status.actorId,speaker:status.actorId,to:[],text:status.verified?'Credential record verified · cleared for Conveyor':'Credential record · awaiting validation',act:'report' as const,age:10}]:[])];}
export function presentationName(b:Bubble,name:string){return name+(b.id.startsWith('credential-status-')?' · credential status':'');}
export const frameSource=(family:Character)=>'/loopforge/turn-art/frame-'+family+'.svg';
const images=new Map<string,HTMLImageElement>();
export async function prepareTurnArt(){await Promise.all([DAY_ONE_NIGHT_ART.src,...['worker','limen','stiletto','cathexis'].map(f=>frameSource(f as Character)),...Object.values(REACTION_ART).map(a=>a.src),'/loopforge/turn-art/tail-down.svg','/loopforge/turn-art/tail-side.svg'].map(async src=>{if(images.has(src))return;const img=new window.Image();img.src=src;await img.decode();images.set(src,img);}));}
export function turnArt(src:string){const image=images.get(src);if(!image)throw Error('Turn art must be loaded before export: '+src);return image;}
/** Same original nine-slice frame and live typography as the page. */
export function paintTurnFrame(ctx:CanvasRenderingContext2D,family:Character,x:number,y:number,w:number,h:number,scale:number){const image=turnArt(frameSource(family)),edge=24*scale;for(let row=0;row<3;row++)for(let col=0;col<3;col++){const sx=[0,24,104][col],sy=[0,24,104][row],sw=[24,80,24][col],sh=[24,80,24][row];ctx.drawImage(image,sx,sy,sw,sh,x+[0,edge,w-edge][col],y+[0,edge,h-edge][row],[edge,w-2*edge,edge][col],[edge,h-2*edge,edge][row]);}}
