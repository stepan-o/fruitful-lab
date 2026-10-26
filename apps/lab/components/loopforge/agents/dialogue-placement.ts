import type {SceneFraming} from '@/lib/loopforge/encounters/contract';
import type {SpeechRect} from './strike-speech-placement';
export type ActorFrameState='in-frame'|'out-of-frame'|'unknown';
export type DialogueAnchor={id:string;x:number;y:number;visible:boolean};
export type PlacementEvidence={pageWidth:number;canvasHeight:number;actorState:ActorFrameState;heads?:readonly SpeechRect[];fullGroup?:SpeechRect;reserved?:readonly SpeechRect[];strikeFits?:boolean};
/** V5: the nominal label point proves neither body visibility nor head clearance.
 * Until current rig/head and full transformed group bounds are supplied together,
 * use one ordinary named rail. No offscreen or collision-free claim is invented.
 */
export function dialoguePlacement(framing:SceneFraming|undefined,width:number,anchor:DialogueAnchor|undefined,evidence?:PlacementEvidence):'rail'|'anchor'{
 if(width<=480||(evidence?.pageWidth??width)<=480||!anchor?.visible)return 'rail';
 const group=evidence?.fullGroup;
 if(evidence?.actorState!=='in-frame'||!evidence.heads?.length||!group)return 'rail';
 if(framing==='impact'&&evidence.strikeFits!==true)return 'rail';
 const values=[group.x,group.y,group.width,group.height,width,evidence.canvasHeight];
 if(!values.every(Number.isFinite)||group.width<=0||group.height<=0||group.x<12||group.y<12||group.x+group.width>width-12||group.y+group.height>evidence.canvasHeight-12)return 'rail';
 for(const box of [...evidence.heads,...(evidence.reserved??[])]){
  if(![box.x,box.y,box.width,box.height].every(Number.isFinite))return 'rail';
  if(group.x<box.x+box.width+12&&group.x+group.width>box.x-12&&group.y<box.y+box.height+12&&group.y+group.height>box.y-12)return 'rail';
 }
 return 'anchor';
}
