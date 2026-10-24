import {LoadAssetContainerAsync} from '@babylonjs/core/Loading/sceneLoader';
import './gltf-delivery';
import {createBrainMaterial} from './brain-material';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {Scene} from '@babylonjs/core/scene';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import kit from '@/lib/loopforge/rooms/room-kit.json';
import {SECURITY_DESKS} from '@/lib/loopforge/rooms/arrival-room-layout';

async function load(scene:Scene,signal:AbortSignal,key:keyof typeof kit.assets){
 const file=kit.assets[key],integrity='sha256-'+btoa(String.fromCharCode(...file.sha256.match(/../g)!.map(x=>parseInt(x,16))));
 const response=await fetch(file.src,{signal:AbortSignal.any([signal,AbortSignal.timeout(60000)]),integrity,credentials:'same-origin'});
 if(!response.ok)throw Error(`${file.asset} could not be loaded.`);
 const data=new Uint8Array(await response.arrayBuffer());signal.throwIfAborted();
 const container=await LoadAssetContainerAsync(data,scene,{pluginExtension:'.glb',name:file.asset+'.glb'});
 if(signal.aborted||scene.isDisposed){container.dispose();throw new DOMException('Room load cancelled','AbortError');}
 const root=new TransformNode(file.asset,scene);container.addAllToScene();container.rootNodes.forEach(n=>n.parent=root);
 const meshes=container.meshes.filter(m=>m.getTotalVertices()>0);meshes.forEach(m=>m.computeWorldMatrix(true));
 let min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);
 for(const m of meshes){const b=m.getBoundingInfo().boundingBox;min=Vector3.Minimize(min,b.minimumWorld);max=Vector3.Maximize(max,b.maximumWorld);m.isPickable=false;m.receiveShadows=true;}
 const materials=container.materials.filter((m):m is PBRMaterial=>m instanceof PBRMaterial);materials.forEach(m=>{m.maxSimultaneousLights=2;});
 return {root,materials,min,extent:max.subtract(min),center:min.add(max).scale(.5),dispose(){container.dispose();root.dispose();}};
}
/** Generated housing has no simulation authority; mechanism sockets are authored. */
export async function loadWashHousing(scene:Scene,signal:AbortSignal){
 const model=await load(scene,signal,'wash'),{root,extent,min,center}=model;
 root.scaling.set(3.2/extent.x,2.2/extent.y,2.6/extent.z);
 const [x,,z]=worldPoint(140.5,102.4);root.position.set(x-center.x*root.scaling.x,-min.y*root.scaling.y,z-center.z*root.scaling.z);
 return model;
}
export async function loadBrain(scene:Scene,signal:AbortSignal,parent:TransformNode){
 const model=await load(scene,signal,'brain'),{root,extent,min,center}=model;
 // Uniform scale preserves the recognisable lobes; the process compresses the parent.
 const s=1.05/extent.x;root.scaling.setAll(s);root.position.set(-center.x*s,-min.y*s,-center.z*s);root.parent=parent;
 try{const finish=await createBrainMaterial(scene,signal,model.materials);return {...model,height:extent.y*s,finish,dispose(){finish.dispose();model.dispose();}};}catch(error){model.dispose();throw error;}
}

/** The press portal spans ACROSS the belt. Its empty aperture is the workpiece route. */
export async function loadForgeHousing(scene:Scene,signal:AbortSignal){
 const model=await load(scene,signal,'forge'),{root,extent,min,center}=model;
 root.scaling.set(5.2/extent.x,4.1/extent.y,2.8/extent.z);root.rotation.y=Math.PI/2;
 const [x,,z]=worldPoint(148.5,102.4);
 root.position.set(x-center.z*root.scaling.z,-min.y*root.scaling.y,z+center.x*root.scaling.x);
 return model;
}
export async function loadCarrier(scene:Scene,signal:AbortSignal,parent:TransformNode){
 const model=await load(scene,signal,'carrier'),{root,extent,min,center}=model;
 root.scaling.set(1.6/extent.x,.25/extent.y,1.4/extent.z);
 root.position.set(-center.x*root.scaling.x,-min.y*root.scaling.y-.06,-center.z*root.scaling.z);root.parent=parent;
 return model;
}

/** All fixtures fit inside the existing reserved work areas. Empty apertures were
 * measured from the delivered geometry; visual/contact review remains separate. */
export async function loadIntakeHousing(scene:Scene,signal:AbortSignal){
 const model=await load(scene,signal,'intake');
 place(model,[2.9,1.12,2.7],136.5,102.4);
 return model;
}
export async function loadIntakeCrate(scene:Scene,signal:AbortSignal){
 const model=await load(scene,signal,'crate');
 place(model,[1.45,.36,1.05],135.5,102.4,.43);
 return model;
}
type LoadedRoomProp=Awaited<ReturnType<typeof load>>;
function place(model:LoadedRoomProp,size:[number,number,number],x:number,y:number,height=0,apertureOffset=0){
 const {root,extent,min,center}=model;root.scaling.set(size[0]/extent.x,size[1]/extent.y,size[2]/extent.z);
 const [wx,,wz]=worldPoint(x,y);root.position.set(wx-center.x*root.scaling.x+apertureOffset,height-min.y*root.scaling.y,wz-center.z*root.scaling.z);
}
export async function loadOpeningArchitecture(scene:Scene,signal:AbortSignal){
 const models:LoadedRoomProp[]=[];let secondDesk:TransformNode|undefined;
 try{
  const entrance=await load(scene,signal,'entrance');models.push(entrance);place(entrance,[14.8,6.5,.85],124,122);
  const portal=await load(scene,signal,'portal');models.push(portal);
  // Reader housing makes the source asymmetrical. Centre the OPENING, not its bounding box.
  place(portal,[8.6,4.8,.85],124,111,0,.272);
  const [ed,gus]=SECURITY_DESKS;
  const desk=await load(scene,signal,'desk');models.push(desk);place(desk,[...ed.size],ed.center[0],ed.center[1]);
  secondDesk=desk.root.clone('Security trays desk',null,false)??undefined;
  if(!secondDesk)throw Error('The second Security desk could not be created.');
  secondDesk.position.x+=gus.center[0]-ed.center[0];secondDesk.position.z-=gus.center[1]-ed.center[1];
  return {entrance:entrance.root,dispose(){secondDesk?.dispose();models.forEach(m=>m.dispose());}};
 }catch(error){secondDesk?.dispose();models.forEach(m=>m.dispose());throw error;}
}
