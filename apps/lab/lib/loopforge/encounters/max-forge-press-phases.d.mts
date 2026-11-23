import type {Registry,MotionCue} from '@/lib/loopforge/encounters/contract';
export function applyMaxForgeControlPress(registry:Registry):{applied:false;reason:string}|{
 applied:true;phaseIds:string[];starts:number[];
 quietStart:{phaseId:string;cue:MotionCue;seconds:number};
 quietEnd:{phaseId:string;cue:MotionCue;seconds:number};
 durationSeconds:number;preparationSeconds:number;contactAtForgeSeconds:number;
};
