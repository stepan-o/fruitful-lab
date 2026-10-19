import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import type {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {createFactoryScene,type GraphicsFrame} from '../factory-study/scene';
import {REFERENCE_GRAPHICS} from '@/lib/loopforge/graphics/settings';
import {heightScale,treatment,READABILITY_POSES,type ReadabilitySettings} from '@/lib/loopforge/readability/settings';
import {initialStudy} from '@/lib/loopforge/factory-study/kernel';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {loadWorkerCrowd} from './worker-crowd';
import {loadLimen,limenFile,bladeFile} from './limen-model';
import {loadStiletto,stilettoFile} from './stiletto-model';
import {ReadabilityMaterial} from './readability-material';

/** Material copies share decoded maps; DynamicTexture.clone() intentionally has a blank canvas. */
function sharedTextureMaterial(source:PBRMaterial,name:string){
 const copy=source.clone(name),cloned=copy.getActiveTextures();
 for(const key of ['albedoTexture','ambientTexture','opacityTexture','reflectionTexture','emissiveTexture','reflectivityTexture','metallicTexture','metallicReflectanceTexture','microSurfaceTexture','bumpTexture','lightmapTexture','refractionTexture'] as const)copy[key]=source[key];
 const used=new Set([...source.getActiveTextures(),...copy.getActiveTextures()]);
 for(const texture of cloned)if(!used.has(texture))texture.dispose();
 return copy;
}
/** Owns one demand-rendered scene. No animation clock, benchmark mutation or simulation writes. */
export async function createReadabilityScene(canvas:HTMLCanvasElement,labels:HTMLDivElement[],signal:AbortSignal,publish:(f:GraphicsFrame)=>void){
 const renderSize:[number,number]=[1280,720];
 const floor=createFactoryScene(canvas,()=>{},()=>{},{reviewOnly:true,renderSize,graphics:{...REFERENCE_GRAPHICS,targetFps:30},context:'room',onFrame:publish});
 const stage=floor.characterStage(),scene=stage.scene,engine=scene.getEngine();
 let crowd:Awaited<ReturnType<typeof loadWorkerCrowd>>|null=null,limen:Awaited<ReturnType<typeof loadLimen>>|null=null,stiletto:Awaited<ReturnType<typeof loadStiletto>>|null=null;
 let disposed=false,visible=true;
 try{
  floor.inset(0,0);floor.isolate(true);floor.motion(false);floor.review(false);floor.focus('conveyor');floor.cctv(true,0,false);floor.update({...initialStudy(),workers:[],running:false});
  const environment=scene.meshes.map(mesh=>({mesh,visibility:mesh.visibility}));
  const clear=scene.clearColor.clone();
  const lights=scene.lights.map(light=>({light,colour:light.diffuse.clone(),ground:light instanceof HemisphericLight?light.groundColor.clone():null}));
  const roomMaterials=new Map<PBRMaterial,{material:PBRMaterial;plugin:ReadabilityMaterial;floor:boolean}>();
  // Architectural batches get their own material instances; machinery retains its palette.
  for(const {mesh} of environment){
   const m=mesh.material;if(!(m instanceof PBRMaterial))continue;
   const isFloor=m.name==='architectural floor';
   const architecture=/architecture|camera cutaway/.test(mesh.parent?.name??'');
   if(!isFloor&&!(architecture&&['recesses','oil black iron','old enamel'].includes(m.name)))continue;
   let entry=roomMaterials.get(m);if(!entry){const clone=sharedTextureMaterial(m,'Readability / '+m.name);const plugin=new ReadabilityMaterial(clone);plugin.kind=3;entry={material:clone,plugin,floor:isFloor};roomMaterials.set(m,entry);}mesh.material=entry.material;
  }
  const backdrop=MeshBuilder.CreateGround('Neutral diagnostic floor',{width:200,height:200},scene);
  const backdropMaterial=new PBRMaterial('Neutral diagnostic surface',scene);backdropMaterial.albedoColor=Color3.FromHexString('#666666').toLinearSpace();backdropMaterial.metallic=0;backdropMaterial.roughness=.95;backdrop.material=backdropMaterial;backdrop.receiveShadows=true;backdrop.visibility=0;backdrop.isPickable=false;
  crowd=await loadWorkerCrowd(stage,24,signal);
  limen=await loadLimen(stage,signal,()=>{});limen.clip(READABILITY_POSES.limen.clip);limen.play(false);limen.light(false);limen.seek(READABILITY_POSES.limen.phase);
  stiletto=await loadStiletto(stage,signal,()=>{});stiletto.clip(READABILITY_POSES.stiletto.clip);stiletto.seek(READABILITY_POSES.stiletto.phase);stiletto.play(false);stiletto.light(false);stiletto.flame(false);stiletto.effectsMotion(false);
  signal.throwIfAborted();
  const workerMaterials=new Map<number,ReadabilityMaterial>();
  const workerVariants=new Map<number,PBRMaterial>();
  crowd.bodies.forEach(({mesh},i)=>{
   const source=mesh.material;if(!(source instanceof PBRMaterial))throw Error('Worker paint material is unavailable.');
   const shade=i%3;let m=workerVariants.get(shade);
   if(!m){m=sharedTextureMaterial(source,'Worker blue shade '+shade);workerVariants.set(shade,m);workerMaterials.set(shade,new ReadabilityMaterial(m));}
   mesh.material=m;
  });
  function bodyStudy(subject:{root:TransformNode;bodyMeshes:AbstractMesh[]},kind:number){
   const body=subject.bodyMeshes.reduce((a,b)=>a.getTotalVertices()>b.getTotalVertices()?a:b);subject.root.computeWorldMatrix(true);body.computeWorldMatrix(true);
   const box=body.getBoundingInfo().boundingBox,sourceHeight=box.maximumWorld.y-box.minimumWorld.y;
   const foot=box.minimumWorld.y-subject.root.position.y;
   if(sourceHeight<=0)throw Error('Character height could not be established.');
   // glTF skin bounds can use the skin-node basis (STILETTO's height is Z there).
   // The shader reads undeformed POSITION, whose authored height remains Y.
   const positions=body.getVerticesData('position');if(!positions)throw Error('Character bind positions are missing.');
   let bindMinY=Infinity,bindMaxY=-Infinity;for(let i=1;i<positions.length;i+=3){bindMinY=Math.min(bindMinY,positions[i]);bindMaxY=Math.max(bindMaxY,positions[i]);}
   const plugins=[...new Set(subject.bodyMeshes.map(m=>m.material))].filter((m):m is PBRMaterial=>m instanceof PBRMaterial).map(m=>{const p=new ReadabilityMaterial(m);p.kind=kind;p.minY=bindMinY;p.height=bindMaxY-bindMinY;return p;});
   return {root:subject.root,sourceHeight,foot,plugins};
  }
  const limenBody=bodyStudy(limen.presentation,1),stilettoBody=bodyStudy(stiletto.presentation,2);
  const worker=crowd.bodies[0];worker.mesh.computeWorldMatrix(true);const wb=worker.mesh.getBoundingInfo().boundingBox,workerHeight=wb.maximumWorld.y-wb.minimumWorld.y;
  const origin=Vector3.Zero(),positions=[Vector3.Zero(),Vector3.Zero()];let current:ReadabilitySettings|null=null;
  function applyLight(amount:number){for(const {light,colour,ground} of lights){light.diffuse=Color3.Lerp(colour,Color3.White(),amount/100);if(ground&&light instanceof HemisphericLight)light.groundColor=Color3.Lerp(ground,new Color3(.07,.07,.07),amount/100);}}
  const beforeRender=scene.onBeforeRenderObservable.add(()=>{if(current)applyLight(treatment(current).neutralLight);});
  function update(s:ReadabilitySettings){
   if(disposed)return;const before=current;current={...s};const t=treatment(s);
   if(before?.room!==s.room){floor.focus(s.room);floor.cctv(true,0,false);const point=s.room==='security'?[130,123]:[121,149];origin.set(...worldPoint(point[0],point[1]));crowd!.place(origin);crowd!.bodies.forEach(({root})=>root.rotation.y=0);crowd!.sample(READABILITY_POSES.workerSeconds);backdrop.position.set(origin.x,0,origin.z);}
   if(before?.size!==s.size||before?.shadows!==s.shadows||before?.bloom!==s.bloom){renderSize[0]=s.size==='console'?320:1280;renderSize[1]=s.size==='console'?180:720;floor.graphics({...REFERENCE_GRAPHICS,targetFps:30,shadows:s.shadows?'low':'off',bloom:s.bloom});}
   const neutral=t.background==='neutral';for(const {mesh,visibility} of environment)mesh.visibility=neutral?0:visibility;
   backdrop.visibility=neutral?1:0;scene.clearColor=neutral?new Color4(.2,.2,.2,1):clear;
   for(const {plugin,floor:isFloor} of roomMaterials.values()){plugin.set(isFloor?t.floor:t.walls,t.background==='proposed'?100:0);plugin.detail=t.detail/100;}
   applyLight(t.neutralLight);
   for(const [i,p] of workerMaterials){p.set(t.worker,t.workerPaint);p.colour.scaleInPlace([.72,1,1.28][i]);}
   for(const p of limenBody.plugins)p.set(t.limen,t.limenPaint);
   for(const p of stilettoBody.plugins)p.set(t.stiletto,t.stilettoPaint);
   [limenBody,stilettoBody].forEach((body,i)=>{
    const scale=heightScale(s.original,body.sourceHeight,workerHeight,i===0?s.limenHeight:s.stilettoHeight);body.root.scaling.setAll(scale);
    positions[i].copyFrom(origin).addInPlaceFromFloats(i===0?-2:2,.015,-4.5);
    if(i===0){limen!.place(positions[i].x,.015,positions[i].z,0);limen!.turn(0);}else stiletto!.place(positions[i].x,.015,positions[i].z,180);
    body.root.position.y=.015-body.foot*scale;body.root.computeWorldMatrix(true);positions[i].y=body.sourceHeight*scale+.18;
   });
   limen!.blade(s.signatures);stiletto!.visor(s.signatures);
   floor.shot({target:[origin.x,1,origin.z],alpha:s.camera==='front'?-Math.PI/2:s.camera==='side'?-.2:Math.PI/2,beta:.9,radius:s.distance});
   stage.refresh(true);
  }
  const after=scene.onAfterRenderObservable.add(()=>{
   if(!current)return;const viewport=scene.activeCamera!.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight());
   labels.forEach((label,i)=>{const p=Vector3.Project(positions[i],Matrix.IdentityReadOnly,scene.getTransformMatrix(),viewport);label.style.left=`${100*p.x/engine.getRenderWidth()}%`;label.style.top=`${100*p.y/engine.getRenderHeight()}%`;label.hidden=!current!.labels||p.z<0||p.z>1;});
  });
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;floor.active(visible);});observer.observe(canvas);
  const captures=new Set<(error:Error)=>void>();
  return {update,
   async capture():Promise<string>{
    if(disposed||!visible||document.hidden)throw Error('Keep the shot visible before saving it.');
    return new Promise((resolve,reject)=>{
     const fail=(error:Error)=>{clearTimeout(timer);scene.onAfterRenderObservable.remove(token);captures.delete(fail);reject(error);};
     const timer=setTimeout(()=>fail(Error('The shot is still loading. Try saving again.')),10000);
     const token=scene.onAfterRenderObservable.add(()=>{if(!scene.isReady())return;try{const data=canvas.toDataURL('image/png');clearTimeout(timer);scene.onAfterRenderObservable.remove(token);captures.delete(fail);resolve(data);}catch(e){fail(e instanceof Error?e:Error('Unable to save shot.'));}});
     captures.add(fail);stage.refresh(true);
    });
   },
   evidence(){return {kind:'Static cast readability audition',settings:current,renderSize:[...renderSize],neutralHeights:{worker:workerHeight,limen:limenBody.sourceHeight,stiletto:stilettoBody.sourceHeight},assets:{worker:crowd!.manifest,limen:limenFile,blade:bladeFile,stiletto:stilettoFile},poses:READABILITY_POSES,resources:{meshes:scene.meshes.length,materials:scene.materials.length,textures:engine.getLoadedTexturesCache().length},limitations:['Art-direction shader masks are approximate; final paint needs authored armour masks.','Static frames do not establish animation performance or recognition acceptance.','CATHEXIS is outside this first two-room comparison.']};},
   dispose(){if(disposed)return;disposed=true;captures.forEach(f=>f(Error('Studio closed.')));observer.disconnect();scene.onBeforeRenderObservable.remove(beforeRender);scene.onAfterRenderObservable.remove(after);crowd!.dispose();limen!.dispose();stiletto!.dispose();floor.dispose();},
  };
 }catch(e){crowd?.dispose();limen?.dispose();stiletto?.dispose();floor.dispose();throw e;}
}
