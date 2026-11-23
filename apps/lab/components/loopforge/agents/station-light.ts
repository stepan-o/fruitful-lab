import {SpotLight} from '@babylonjs/core/Lights/spotLight';
import {ShadowGenerator} from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {Color3} from '@babylonjs/core/Maths/math.color';
import type {Scene} from '@babylonjs/core/scene';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import type {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import type {conveyorFrame} from '@/lib/loopforge/rooms/conveyor-presentation';
export type StationLighting='glow'|'light'|'shadows';
/** One bounded spotlight, one 512px depth map. No point-light cube or particle lights.
 * The experiment is independent of process authority and global shadow preferences. */
export function createStationLight(scene:Scene,receivers:()=>AbstractMesh[],invalidate:()=>void){
 let mode:StationLighting='glow',allowed=true,light:SpotLight|undefined,shadow:ShadowGenerator|undefined;
 let lastStation='',casters:AbstractMesh[]=[],frame:ReturnType<typeof conveyorFrame>|undefined;
 const materials=new Map<PBRMaterial,number>();
 function prepare(){
  if(light)return;
  light=new SpotLight('Active station spill',Vector3.Zero(),new Vector3(0,-1,0),Math.PI*.58,2,scene);
  light.range=6;light.shadowMinZ=.15;light.shadowMaxZ=7;light.intensity=0;
  light.includedOnlyMeshes=receivers();
  for(const mesh of light.includedOnlyMeshes){const m=mesh.material as PBRMaterial|null;if(m&&typeof m.maxSimultaneousLights==='number'&&!materials.has(m)){materials.set(m,m.maxSimultaneousLights);m.maxSimultaneousLights=Math.max(3,m.maxSimultaneousLights);}}
  shadow=new ShadowGenerator(512,light);shadow.usePercentageCloserFiltering=true;shadow.filteringQuality=ShadowGenerator.QUALITY_LOW;shadow.bias=.001;shadow.normalBias=.018;
 }
 function present(next:ReturnType<typeof conveyorFrame>){
  frame=next;
  if(mode==='glow'){light?.setEnabled(false);return;}
  prepare();
  const station=next.spray?'wash':next.heat>.02?'forge':'';
  light!.setEnabled(!!station);if(!station)return;
  if(station!==lastStation){
   lastStation=station;const [x,,z]=worldPoint(station==='wash'?140.5:148.5,102.4);
   light!.position.set(x,station==='wash'?3.2:2.7,z-.55);light!.direction.set(0,-1,.38).normalize();
   light!.diffuse=Color3.FromHexString(station==='wash'?'#a6d8e6':'#ffc078');
  }
  light!.intensity=station==='wash'?2.2:2.6*next.heat;
  light!.shadowEnabled=mode==='shadows'&&allowed;
  if(light!.shadowEnabled){
   // Only nearby opaque solids cast. The floor receives; streaks never cast.
   const nextCasters=light!.includedOnlyMeshes.filter(mesh=>{
    if(!mesh.isEnabled()||!mesh.isVisible||/floor|apron/i.test(mesh.name))return false;
    const b=mesh.getBoundingInfo().boundingBox,p=light!.position;
    const dx=Math.max(b.minimumWorld.x-p.x,0,p.x-b.maximumWorld.x),dz=Math.max(b.minimumWorld.z-p.z,0,p.z-b.maximumWorld.z);
    return dx*dx+dz*dz<25;
   });
   if(nextCasters.length!==casters.length||nextCasters.some((m,i)=>m!==casters[i])){casters=nextCasters;shadow!.getShadowMap()!.renderList=casters;}
  }
 }
 return {set(value:StationLighting){mode=value;if(frame)present(frame);invalidate();},shadowsAllowed(value:boolean){allowed=value;if(frame)present(frame);invalidate();},present,
  snapshot(){return {mode,active:!!light?.isEnabled(),shadowMap:mode==='shadows'&&allowed?512:0,casters:casters.length};},
  dispose(){shadow?.dispose();light?.dispose();for(const [m,count]of materials)if(scene.materials.includes(m))m.maxSimultaneousLights=count;}};
}
