import type {AttentionStep} from '@/lib/loopforge/encounters/attention';
import type {View} from '@/lib/loopforge/encounters/contract';
type Anchor={id:string;visible:boolean};
/** Presentation consumes only the currently selected public reading bubble. */
export function selectedHeldSpeech(view:View|null|undefined,reading:AttentionStep|null|undefined){
 if(!view||!reading?.speech||view.tick!==reading.tick)return undefined;
 return view.bubbles.find(b=>b.id==='reading-'+reading.id&&b.speaker===reading.speech!.speaker&&b.text===reading.speech!.text&&view.actors.some(a=>a.id===b.speaker));
}
export function offscreenHeldSpeech(view:View|null|undefined,reading:AttentionStep|null|undefined,anchors:readonly Anchor[]){
 const speech=selectedHeldSpeech(view,reading);
 return speech&&anchors.some(a=>a.id===speech.speaker&&!a.visible)?speech:undefined;
}
