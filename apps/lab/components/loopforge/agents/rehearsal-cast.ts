import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import type {ActorView,View} from '@/lib/loopforge/encounters/contract';
import {rehearsal,type Study} from '@/lib/loopforge/encounters/rehearsals';
import type {FactoryScene} from '../factory-study/scene';
import {loadWorker} from './worker-model';
import {loadLimen} from './limen-model';
import {loadStiletto} from './stiletto-model';

type Puppet={clip:(name:string)=>void;seek:(phase:number)=>void;duration:()=>number;place:(x:number,y:number,z:number,yaw:number)=>void;dispose:()=>void};
/** Existing accepted assets. Only this adapter knows vendor clip names and Babylon. */
export async function loadRehearsalCast(floor:FactoryScene,study:Study,signal:AbortSignal){
 const stage=floor.characterStage(),puppets:Record<string,Puppet>={},clips:Record<string,string>={};
 try{
  if(study!=='threshold'){const worker=await loadWorker(stage,signal,()=>{});worker.ground(false);worker.centre(false);puppets['worker-07']=worker as Puppet;}
  if(study!=='conveyor'){const limen=await loadLimen(stage,signal,()=>{});puppets.limen={...limen,clip:(name:string)=>{if(name!=='Idle')throw Error(`Unsupported LIMEN scene motion: ${name}`);limen.clip(name);}};}
  if(study!=='security'){const stiletto=await loadStiletto(stage,signal,()=>{});stiletto.flame(false);stiletto.effectsMotion(false);puppets.stiletto=stiletto as Puppet;}
  signal.throwIfAborted();
 }catch(e){Object.values(puppets).forEach(p=>p.dispose());throw e;}
 const scene=stage.scene,base=rehearsal(study,'care').anchor,anchor=new Vector3(...worldPoint(base[0],base[1]));
 const metal=new StandardMaterial('Rehearsal station casing',scene);metal.diffuseColor=Color3.FromHexString('#233c39');metal.specularColor.set(.2,.2,.2);
 const signalMat=new StandardMaterial('Confirmed station signal',scene);signalMat.disableLighting=true;
 const pedestal=MeshBuilder.CreateBox('Station mockup · contact art pending',{width:.5,height:1.1,depth:.4},scene);pedestal.position.copyFrom(anchor).addInPlaceFromFloats(0,.55,1.1);pedestal.material=metal;
 const lamp=MeshBuilder.CreateBox('Engine-owned status lamp',{width:.3,height:.08,depth:.05},scene);lamp.position.copyFrom(pedestal.position).addInPlaceFromFloats(0,.4,-.23);lamp.material=signalMat;
 const bar=MeshBuilder.CreateBox('Rehearsal checkpoint arm',{width:1.8,height:.08,depth:.1},scene);bar.position.copyFrom(anchor).addInPlaceFromFloats(0,1,1.1);bar.material=metal;bar.setEnabled(study==='security');
 let view:View|null=null;
 function sample(a:ActorView){
  const puppet=puppets[a.id];if(!puppet)return;
  const clip=a.character==='limen'?'Idle':a.character==='stiletto'?(a.motion==='walk'?'Quick_Walk':a.motion==='dismiss'?'Shrug':a.motion==='threaten'?'Stand_Talking_Angry':a.motion==='listen'?'Listening_Gesture':'Alert'):(a.motion==='walk'?'walking_2_inplace':a.motion==='scratch'?'Confused_Scratch':a.motion==='listen'?'Listening_Gesture':'idle');
  if(clips[a.id]!==clip){puppet.clip(clip);clips[a.id]=clip;}
  // Locomotion speed is calibrated for this short authored lane, not arbitrary animation-time warping.
  const duration=puppet.duration(),loop=['idle','walk'].includes(a.motion)||a.character==='limen';
  puppet.seek(loop?(a.seconds%duration)/duration:Math.min(.999,a.seconds/duration));
  const p=worldPoint(a.position[0]/1000,a.position[1]/1000);puppet.place(p[0],.015,p[2],a.yaw);
 }
 return {
  update(next:View){view=next;next.actors.forEach(sample);const green=study==='security'?next.gateOpen:next.drive==='steady';pedestal.setEnabled(study!=='threshold');lamp.setEnabled(study!=='threshold');signalMat.emissiveColor=Color3.FromHexString(green?'#72f5bb':'#ed9c48');bar.position.y=next.gateOpen?2.5:1;stage.gate(study==='threshold'||next.gateOpen);stage.refresh();},
  anchors(){const camera=scene.activeCamera,engine=scene.getEngine();if(!camera||!view)return [];const viewport=camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());return view.actors.map(a=>{const p=worldPoint(a.position[0]/1000,a.position[1]/1000);const projected=Vector3.Project(new Vector3(p[0],2.08,p[2]),Matrix.IdentityReadOnly,scene.getTransformMatrix(),viewport);return {id:a.id,x:100*projected.x/engine.getRenderWidth(),y:100*projected.y/engine.getRenderHeight(),visible:projected.z>0&&projected.z<1};});},
  dispose(){Object.values(puppets).forEach(p=>p.dispose());pedestal.dispose();lamp.dispose();bar.dispose();metal.dispose();signalMat.dispose();}
 };
}
