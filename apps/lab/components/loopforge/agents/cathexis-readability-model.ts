import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {CharacterStage} from '../factory-study/scene';
import {loadMotionModel,type InspectionMotion} from './motion-model';
import {ReadabilityMaterial} from './readability-material';
import manifest from '@/lib/assets/generated/loopforge-cathexis-motion.json';
import faces from '@/lib/assets/generated/loopforge-cathexis-review.json';
import {cathexisFits} from '@/lib/loopforge/agents/cathexis-fit';
import {READABILITY_POSES,type ReadabilitySettings} from '@/lib/loopforge/readability/settings';

export const cathexisStudyFile=manifest.assets['cathexis-motion'].variants[0];
export const cathexisGraceFile=faces.assets['grace-3k'].variants[0];
const pose=READABILITY_POSES.cathexis;
const bank:InspectionMotion={file:cathexisStudyFile,triangles:51031,joints:23,extraJoints:6,revision:'cathexis-contact-v7',record:'',note:'Approved Happy Sway held still.',clips:[{id:pose.clip,label:'Happy Sway Standing',source:'Happy_Sway_Standing',duration:10.041666984558105,markers:[]}]};
/** Reuses the approved moving-body adapter, sampled once. No new GLB or motion edits. */
export async function loadCathexisStudy(stage:CharacterStage,signal:AbortSignal){
 const model=await loadMotionModel(stage,bank,signal,()=>{});
 try{
  model.motion.select(pose.clip,'Corrected');model.motion.seek(pose.phase);model.motion.play(false);model.light(false);
  const body=model.presentation.bodyMeshes[0];body.computeWorldMatrix(true);
  const box=body.getBoundingInfo().boundingBox;
  // Neutral bounds, never the height of a swaying pose. The source includes a crown;
  // scalp landmark is approximately 1.82 m in the accepted 1.90 m fitting space.
  const crownHeight=box.maximumWorld.y-box.minimumWorld.y,sourceHeight=crownHeight*1.82/1.9;
  const foot=box.minimumWorld.y-model.presentation.root.position.y;
  const material=body.material;if(!(material instanceof PBRMaterial))throw Error('CATHEXIS paint material is unavailable.');
  const paint=new ReadabilityMaterial(material);paint.kind=4;
  return {
   presentation:{...model.presentation,sourceHeight,foot,crownHeight},place:model.place,eyes:model.eyes,
   colour(hex:string,strength:number){paint.set(hex,strength);stage.refresh();},
   mask(value:ReadabilitySettings['cathexisFace']){return model.face(value==='none'?null:cathexisGraceFile,cathexisFits['grace-3k'],value==='none'?'full':value);},
   dispose:model.dispose,
  };
 }catch(error){model.dispose();throw error;}
}
