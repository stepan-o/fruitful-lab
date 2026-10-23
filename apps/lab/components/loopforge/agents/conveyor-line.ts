import {createStationLight} from './station-light';
import {loadWashHousing,loadBrain,loadForgeHousing,loadCarrier,loadIntakeHousing,loadIntakeCrate} from './load-room-kit';
import {Scene} from '@babylonjs/core/scene';
import {Constants} from '@babylonjs/core/Engines/constants';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {conveyorFrame,compressionPose} from '@/lib/loopforge/rooms/conveyor-presentation';
import type {View} from '@/lib/loopforge/encounters/contract';

/** Operating parts stay independent of generated housings. One UV-scrolled belt,
 * shared materials, merged fittings, bounded spray. No per-slat animation, fluid
 * simulation or particle spawning. A separately switchable bounded light tests spill/shadows. */
export function createConveyorLine(scene:Scene,invalidate:()=>void){
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const existing=new Set(scene.meshes);
 const staticMeshes:Mesh[]=[],dynamic:Mesh[]=[];
 function metal(name:string,hex:string,metallic=.65,roughness=.65){const m=new PBRMaterial(name,scene);m.albedoColor=Color3.FromHexString(hex).toLinearSpace();m.metallic=metallic;m.roughness=roughness;m.maxSimultaneousLights=2;return m;}
 const iron=metal('Conveyor cast iron','#303b40'),edge=metal('Conveyor worn brass','#998662'),enamel=metal('Conveyor enamel','#616a64',.35),black=metal('Belt recess','#182125',.2),rubber=metal('Belt surface','#546366',.25),ivory=metal('Conveyor ceramics','#aca598',.1);
 const glow=new StandardMaterial('Machine signal light',scene);glow.disableLighting=true;glow.emissiveColor=Color3.FromHexString('#deab5e');
 const water=new StandardMaterial('Rinse streaks',scene);water.disableLighting=true;water.emissiveColor=Color3.FromHexString('#93b5bc');water.alpha=.38;
 const hot=new StandardMaterial('Forge pressure light',scene);hot.disableLighting=true;hot.emissiveColor=Color3.FromHexString('#efb568');
 function box(name:string,size:[number,number,number],x:number,y:number,h:number,m:PBRMaterial|StandardMaterial,moving=false){const mesh=MeshBuilder.CreateBox(name,{width:size[0],height:size[1],depth:size[2]},scene);mesh.position.set(...worldPoint(x,y));mesh.position.y=h;mesh.material=m;mesh.isPickable=false;mesh.receiveShadows=true;(moving?dynamic:staticMeshes).push(mesh);return mesh;}
 function cylinder(name:string,x:number,y:number,h:number,r:number,length:number,m:PBRMaterial,axis:'vertical'|'across'='vertical',moving=false){const mesh=MeshBuilder.CreateCylinder(name,{diameter:r*2,height:length,tessellation:12},scene);mesh.position.set(...worldPoint(x,y));mesh.position.y=h;if(axis==='across')mesh.rotation.x=Math.PI/2;mesh.material=m;mesh.isPickable=false;(moving?dynamic:staticMeshes).push(mesh);return mesh;}
 // Repeatable exact track; generated drive housings attach alongside these parts.
 box('Belt undercarriage',[15.4,.32,1.65],143.1,102.4,.72,iron);
 for(const y of [101.43,103.37]){
  box('Continuous brass guide',[15.4,.12,.13],143.1,y,1.08,edge);
  box('Side chain guard',[15.4,.24,.16],143.1,y,.85,black);
  for(let x=136;x<=150;x+=2){box('Belt trestle',[.18,.82,.2],x,y,.41,iron);box('Trestle foot',[.5,.08,.4],x,y,.04,edge);}
 }
 const tex=new DynamicTexture('Moving belt slats',{width:256,height:64},scene,false),ctx=tex.getContext();
 ctx.fillStyle='#c6cdcb';ctx.fillRect(0,0,256,64);ctx.fillStyle='#465258';ctx.fillRect(0,0,36,64);ctx.fillStyle='#e4e6df';ctx.fillRect(36,0,6,64);ctx.fillStyle='#8f9b9c';ctx.fillRect(42,0,5,64);
 ctx.fillStyle='#727e80';for(const y of [6,52])ctx.fillRect(60,y,140,5);tex.update();tex.wrapU=Constants.TEXTURE_WRAP_ADDRESSMODE;tex.wrapV=Constants.TEXTURE_WRAP_ADDRESSMODE;tex.uScale=28;rubber.albedoTexture=tex;
 const belt=MeshBuilder.CreateGround('Continuous moving belt',{width:15.2,height:1.58},scene);belt.position.set(...worldPoint(143.1,102.4));belt.position.y=.98;belt.material=rubber;belt.isPickable=false;belt.receiveShadows=true;
 const drive=cylinder('Drive drum',150.65,102.4,.81,.25,1.74,edge,'across',true);
 cylinder('Intake roller',135.55,102.4,.81,.25,1.74,edge,'across');
 box('Drive motor housing',[1.05,.62,.6],145.1,103.76,.58,enamel);
 for(let x=144.7;x<145.6;x+=.13)box('Motor cooling rib',[.045,.67,.66],x,103.76,.58,iron);
 // Intake, wash and forge are replaceable visual housings around the same sockets.
 box('Intake lift frame',[2.8,.5,2.6],136.5,102.4,.32,enamel);
 box('Intake crate',[1.3,.55,1.4],135.5,102.4,.48,iron);
 for(const y of [101.8,103])box('Crate rim',[1.4,.08,.08],135.5,y,.79,edge);
 box('Wash basin bottom',[3.2,.24,2.7],140.5,102.4,.69,enamel);
 for(const y of [101.1,103.7])box('Wash basin rim',[3.25,.16,.14],140.5,y,1.15,edge);
 for(const x of [139.1,141.9])cylinder('Wash pipe upright',x,101.4,1.55,.075,2,edge);
 const manifold=cylinder('Rinse manifold',140.5,101.4,2.55,.09,3,edge);manifold.rotation.z=Math.PI/2;
 for(const x of [139.65,140.5,141.35]){
  box('Rinse pipe extension',[.13,.13,1],x,101.9,2.55,edge);
  cylinder('Rinse nozzle',x,102.4,2.4,.105,.25,iron);
 }
 for(const x of [147.2,149.8]){
  box('Forge column',[.4,3.7,.55],x,101.4,1.85,iron);box('Forge column brass face',[.15,3.5,.12],x,101.75,1.85,edge);
  box('Forge footing',[.85,.22,2.8],x,102.4,.11,iron);
 }
 box('Lattice Forge lintel',[3.5,.65,1.5],148.5,102.1,3.65,iron);
 cylinder('Pressure cylinder',148.5,102.2,3.05,.35,.85,edge);
 const ram=cylinder('Compression ram',148.5,102.4,2.7,.18,1.2,ivory,'vertical',true);
 const platen=box('Lattice platen',[1.85,.25,1.9],148.5,102.4,2.25,iron,true);
 const heat=box('Compression seam',[1.8,.05,.07],148.5,103.37,1.02,hot,true);
 // Calm practical fixtures: luminous surfaces, no additional real-time light pass.
 for(const x of [136.5,140.5,144.5,148.5]){
  box('Operator pedestal',[.45,.8,.5],x,105.05,.4,iron);
  box('Control deck',[.72,.13,.65],x,105.05,.86,edge);
  const lamp=box('Control ready lamp',[.16,.035,.12],x-.19,105.16,.94,glow);
  lamp.receiveShadows=false;
  box('Guarded stop button',[.13,.08,.13],x+.16,105.16,.95,black);
 }
 // One shared carrier; the textured brain stays the same object through processing.
 const carrier=new TransformNode('Active brain carrier',scene),brain=new TransformNode('Workpiece',scene);
 const tray=box('Brain cradle',[1.6,.12,1.4],0,0,0,edge,true);tray.parent=carrier;tray.position.set(0,0,0);
 const jaws=[-1,1].map(side=>{const m=box('Carrier jaw',[.12,.3,.95],0,0,0,iron,true);m.parent=carrier;m.position.set(side*.73,.18,0);return m;});
 brain.parent=carrier;brain.position.y=.1;
 const spray=Array.from({length:12},(_,i)=>{const x=139.65+(i%3)*.85;const m=box('Rinse streak',[.016,.22,.016],x,102.4,2,water,true);m.receiveShadows=false;return m;});
 const washProxy=staticMeshes.filter(m=>/Wash basin|Wash pipe|Rinse manifold|Rinse pipe|Rinse nozzle/.test(m.name));
 const forgeProxy=staticMeshes.filter(m=>/Forge column|Forge footing|Lattice Forge lintel|Pressure cylinder/.test(m.name));
 const intakeProxy=staticMeshes.filter(m=>/Intake lift frame|Intake crate|Crate rim/.test(m.name));
 const replacements=[...washProxy,...forgeProxy,...intakeProxy];
 let forge:Awaited<ReturnType<typeof loadForgeHousing>>|undefined,carrierModel:Awaited<ReturnType<typeof loadCarrier>>|undefined;
 let intake:Awaited<ReturnType<typeof loadIntakeHousing>>|undefined,crate:Awaited<ReturnType<typeof loadIntakeCrate>>|undefined;
 const abort=new AbortController();let housing:Awaited<ReturnType<typeof loadWashHousing>>|undefined,brainModel:Awaited<ReturnType<typeof loadBrain>>|undefined;
 const ready=Promise.all([
  loadIntakeHousing(scene,abort.signal).then(model=>{intake=model;intakeProxy.filter(m=>m.name==='Intake lift frame').forEach(m=>m.setEnabled(false));}),
  loadIntakeCrate(scene,abort.signal).then(model=>{crate=model;intakeProxy.filter(m=>m.name!=='Intake lift frame').forEach(m=>m.setEnabled(false));}),
  loadWashHousing(scene,abort.signal).then(model=>{housing=model;washProxy.forEach(m=>m.setEnabled(false));}),
  loadBrain(scene,abort.signal,brain).then(model=>{brainModel=model;}),
  loadForgeHousing(scene,abort.signal).then(model=>{forge=model;forgeProxy.forEach(m=>m.setEnabled(false));}),
  loadCarrier(scene,abort.signal,carrier).then(model=>{carrierModel=model;tray.setEnabled(false);})
 ]).then(()=>{present(undefined);invalidate();}).catch(error=>{abort.abort();housing?.dispose();brainModel?.dispose();forge?.dispose();carrierModel?.dispose();intake?.dispose();crate?.dispose();throw error;});
 // The caller awaits the asset before enabling playback. Never silently certify a proxy.
 for(const material of [iron,edge,enamel,black,ivory,glow]){const meshes=staticMeshes.filter(m=>m.material===material&&!replacements.includes(m));if(meshes.length>1)Mesh.MergeMeshes(meshes,true,true);}
 const stationLight=createStationLight(scene,()=>scene.meshes.filter(m=>m.getTotalVertices()>0&&!!m.material&&!m.material.needAlphaBlending()&&(!existing.has(m)||m.name==='conveyor floor')&&m.material!==glow&&m.material!==hot),invalidate);
 let frame=conveyorFrame(undefined),effects=true,time=0;
 function present(process:View['process']){
  frame=conveyorFrame(process);carrier.position.set(...worldPoint(frame.x,frame.y));carrier.position.y=frame.height;
  const pose=compressionPose(frame.compressed,frame.ram,brainModel?.height??.637);brain.scaling.set(pose.widthScale,pose.heightScale,pose.widthScale);brain.position.y=.1;
  brainModel?.finish.present(frame.clean,frame.compressed);
  for(let i=0;i<jaws.length;i++)jaws[i].position.x=(i?1:-1)*(.73-frame.clean*.13);
  platen.position.y=pose.platen;ram.position.y=platen.position.y+.72;
  heat.setEnabled(effects&&frame.heat>.05);heat.visibility=frame.heat;
  for(const m of spray)m.setEnabled(effects&&frame.spray>0);
  stationLight.present(frame);invalidate();
 }
 return {ready,present,stationLight,effects(value:boolean){effects=value;for(const m of spray)m.setEnabled(value&&frame.spray>0);heat.setEnabled(value&&frame.heat>.05);invalidate();},
  animate(dt:number){if(reducedMotion.matches)return;time+=Math.min(.1,dt);if(frame.beltRunning){tex.uOffset=(tex.uOffset+dt*.72)%1;drive.rotation.y-=dt*2;}
   if(effects&&frame.spray)for(let i=0;i<spray.length;i++){const m=spray[i];m.position.y=2.3-((time*1.9+i*.157)%1)*1.2;}
  },dispose(){stationLight.dispose();abort.abort();housing?.dispose();brainModel?.dispose();forge?.dispose();carrierModel?.dispose();intake?.dispose();crate?.dispose();carrier.dispose();}};
}
