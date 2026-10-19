import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {DynamicTexture} from '@babylonjs/core/Materials/Textures/dynamicTexture';
import {RawCubeTexture} from '@babylonjs/core/Materials/Textures/rawCubeTexture';
import {Constants} from '@babylonjs/core/Engines/constants';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {ShadowGenerator} from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import {DefaultRenderingPipeline} from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';
import {ARRIVAL_LAYOUT} from '@/lib/loopforge/encounters/arrival-layout';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {ROOM_FLOORS} from '@/lib/loopforge/rooms/appearance';
import {createFrameWindow} from '@/lib/loopforge/frame-window';
import {resolveGraphics} from '@/lib/loopforge/graphics/settings';
import {graphicsSnapshot,subscribeGraphics} from '@/lib/loopforge/graphics/store';
import {createReviewOrbit} from '../factory-study/review-orbit';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
export type RehearsalStage=Pick<FactoryScene,'characterStage'|'motion'|'active'|'reviewCamera'|'dispose'>&{sceneShot?:(shot:'lobby'|'doorway')=>void};
/** Reusable two-room scene shell. Bounds and doorway come from the same layout as admission.
 * Native proxy fittings are deliberately cheap; final room art can replace them at these anchors. */
export function createArrivalStage(canvas:HTMLCanvasElement,report:(r:SceneReport)=>void):RehearsalStage{
 const engine=new Engine(canvas,false,{stencil:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 const scene=new Scene(engine);scene.clearColor=new Color4(.025,.035,.04,1);
 const camera=new ArcRotateCamera('Lobby doorway camera',-1.3,.85,23,Vector3.Zero(),scene);camera.minZ=.1;camera.maxZ=100;camera.fov=.8;
 let dirty=true,visible=true,playing=false,disposed=false,lastDraw=0,lastReport=0;
 const invalidate=()=>{dirty=true;};
 const orbit=createReviewOrbit(camera,canvas,invalidate,36);
 orbit.framing(19,5);orbit.orientation(-1.42,1.02);orbit.attach(new Vector3(...worldPoint(...ARRIVAL_LAYOUT.anchor)).add(new Vector3(0,1,0)));
 const key=new DirectionalLight('Entrance overhead',new Vector3(.4,-1,-.2),scene);key.position=new Vector3(-14,14,-5);key.intensity=2.5;key.diffuse=Color3.FromHexString('#fff0d6');
 const hemi=new HemisphericLight('Lobby bounce',Vector3.Up(),scene);hemi.intensity=1.1;hemi.groundColor=new Color3(.19,.22,.26);
 const shadow=new ShadowGenerator(1024,key);shadow.usePercentageCloserFiltering=true;shadow.filteringQuality=ShadowGenerator.QUALITY_LOW;shadow.bias=.001;shadow.normalBias=.03;
 const faces=Array.from({length:6},(_,face)=>{const data=new Uint8Array(16*16*4);for(let i=0;i<data.length;i+=4){const c=face===2?140:face===3?30:75;data[i]=data[i+1]=data[i+2]=c;data[i+3]=255;}return data;});
 scene.environmentTexture=new RawCubeTexture(scene,faces,16,Constants.TEXTUREFORMAT_RGBA,Constants.TEXTURETYPE_UNSIGNED_BYTE,true,false);scene.environmentIntensity=.65;
 const pipeline=new DefaultRenderingPipeline('Opening room presentation',false,scene,[camera]);pipeline.samples=1;pipeline.bloomThreshold=1.4;pipeline.bloomWeight=.12;
 const materials:PBRMaterial[]=[];
 function material(name:string,hex:string,metal=.25){const m=new PBRMaterial(name,scene);m.albedoColor=Color3.FromHexString(hex).toLinearSpace();m.metallic=metal;m.roughness=.75;m.maxSimultaneousLights=3;materials.push(m);return m;}
 const iron=material('Worn door iron','#263138',.7),brass=material('Dull brass edging','#8d784d',.65),wall=material('Quiet wall enamel','#343d38'),dark=material('Recessed housings','#161f26');
 function box(name:string,size:[number,number,number],x:number,y:number,height:number,m:PBRMaterial){const mesh=MeshBuilder.CreateBox(name,{width:size[0],height:size[1],depth:size[2]},scene);mesh.position.set(...worldPoint(x,y));mesh.position.y=height;mesh.material=m;mesh.receiveShadows=true;mesh.isPickable=false;return mesh;}
 for(const room of ARRIVAL_LAYOUT.rooms){
  const {x,y,w,h}=room.rect,m=material(`${room.id} floor`,ROOM_FLOORS[room.id],.08);
  const tex=new DynamicTexture(`${room.id} worn panels`,512,scene,true),ctx=tex.getContext();ctx.fillStyle='#ffffff';ctx.fillRect(0,0,512,512);ctx.strokeStyle='#b9bbbd';ctx.lineWidth=2;ctx.strokeRect(2,2,508,508);
  for(let i=0;i<130;i++){ctx.fillStyle=i%3?'#00000007':'#00000016';ctx.fillRect(i*197%512,i*71%512,3+i%20,1);}
  tex.update();tex.uScale=w/2;tex.vScale=h/2;m.albedoTexture=tex;
  box(`${room.id} floor`,[w,.2,h],x+w/2,y+h/2,-.11,m);
  for(let xx=x+2;xx<x+w;xx+=2)box('Floor seam',[.015,.006,h],xx,y+h/2,.005,dark);
  for(let yy=y+2;yy<y+h;yy+=2)box('Floor seam',[w,.006,.015],x+w/2,yy,.005,dark);
  box(`${room.id} east wall`,[.25,3,h],x+w,y+h/2,1.5,wall);
  for(let yy=y+1;yy<y+h;yy+=3){box('Ribbed pilaster',[.35,3.5,.35],x+w-.15,yy,1.75,iron);box('Brass footing',[.5,.15,.6],x+w-.15,yy,.08,brass);}
 }
 const door=ARRIVAL_LAYOUT.portal;
 box('Security west return',[6,3,.3],119,door.axis,1.5,wall);box('Security east return',[6,3,.3],129,door.axis,1.5,wall);
 box('Security back wall',[16,4,.3],124,99,2,wall);
 for(const x of [door.min,door.max]){box('Checkpoint pillar',[.4,3.8,.5],x,door.axis,1.9,iron);box('Checkpoint brass band',[.48,.13,.55],x,door.axis,2.65,brass);}
 box('Checkpoint lintel',[4.5,.45,.6],124,door.axis,3.65,iron);
 box('WAIT HERE line',[4,.025,.18],124,112.6,.015,brass);
 for(let y=114;y<120;y+=2){for(const x of [121.5,126.5]){box('Queue rail upright',[.07,.8,.07],x,y,.4,brass);box('Queue rail',[.08,.07,2],x,y+1,.8,iron);}}
 for(const x of [119,129]){box('Inspection desk',[2,1.05,1],x,104,.525,wall);box('Desk edge',[2.2,.12,1.2],x,104,1.12,brass);box('Terminal housing',[.8,.65,.45],x,104,1.5,iron);box('Dark terminal face',[.65,.45,.04],x,104.24,1.55,dark);box('ID tray',[.6,.08,.4],x+.55,104.25,1.24,brass);}
 function sign(text:string,x:number,y:number,h:number,w:number){const texture=new DynamicTexture(text,{width:1024,height:128},scene,true);const c=texture.getContext() as CanvasRenderingContext2D;c.fillStyle='#172226';c.fillRect(0,0,1024,128);c.fillStyle='#d1c7a5';c.font='bold 70px Georgia';c.textAlign='center';c.fillText(text,512,90);texture.update();const m=new StandardMaterial(text,scene);m.diffuseTexture=texture;m.emissiveColor=new Color3(.4,.4,.4);const plane=MeshBuilder.CreatePlane(text,{width:w,height:.48,sideOrientation:Mesh.DOUBLESIDE},scene);plane.position.set(...worldPoint(x,y));plane.position.y=h;plane.material=m;}
 sign('SECURITY / ADMISSION',124,111.34,3.7,4.2);sign('IDENTIFICATION',124,99.22,2.8,4);
 // Batch room fittings once; cast bodies retain independent rigs and share geometry/maps.
 for(const m of materials){const meshes=scene.meshes.filter(mesh=>mesh.material===m) as Mesh[];if(meshes.length>1)Mesh.MergeMeshes(meshes,true,true);}
 let preferences=graphicsSnapshot(),effective=resolveGraphics(preferences,'room');
 function size(){engine.setHardwareScalingLevel(1/(Math.min(window.devicePixelRatio||1,1.5)*effective.scale));engine.resize();orbit.snapshot();orbit.attach(camera.target);invalidate();}
 function settings(){preferences=graphicsSnapshot();effective=resolveGraphics(preferences,'room');scene.shadowsEnabled=effective.shadows!=='off';pipeline.fxaaEnabled=effective.antialias;pipeline.bloomEnabled=effective.bloom;shadow.getShadowMap()?.resize(effective.shadows==='full'?1024:512);size();}
 const unsubscribe=subscribeGraphics(settings);settings();
 const resize=new ResizeObserver(size);resize.observe(canvas);
 const timings=createFrameWindow();let previousCamera='';
 scene.onDataLoadedObservable.add(invalidate);engine.onContextRestoredObservable.add(invalidate);
 const pointer=()=>{dirty=true;};canvas.addEventListener('pointermove',pointer);canvas.addEventListener('wheel',pointer);canvas.addEventListener('keydown',pointer);
 engine.runRenderLoop(()=>{
  if(disposed||!visible||document.hidden){timings.reset();return;}
  const now=performance.now(),cameraState=[camera.alpha,camera.beta,camera.radius,camera.inertialAlphaOffset,camera.inertialBetaOffset,camera.inertialRadiusOffset].join('/');
  if(previousCamera!==cameraState){dirty=true;previousCamera=cameraState;}
  if(now-lastDraw<1000/effective.targetFps-1||(!playing&&!dirty&&scene.isReady()))return;
  lastDraw=now;dirty=false;const before=performance.now();scene.render();timings.frame(now,scene.isReady()?(playing?'active':'idle'):'loading');
  if(now-lastReport>1000){lastReport=now;report({...timings.snapshot(),meshes:scene.meshes.length,active:scene.getActiveMeshes().length,workers:10,resolution:`${engine.getRenderWidth()} × ${engine.getRenderHeight()}`,renderer:engine.getGlInfo().renderer,renderMs:Math.round(performance.now()-before),updateMs:0,drawCalls:engine._drawCalls.current,triangles:Math.round(scene.getActiveIndices()/3)});}
 });
 return {
  sceneShot(shot){orbit.framing(shot==='lobby'?19:12.5,5);orbit.orientation(-1.42,1.02);orbit.attach(new Vector3(...worldPoint(124,shot==='lobby'?117:112.7)).add(new Vector3(0,1.15,0)));},
  characterStage(){return {scene,shadow,gate(){},refresh:invalidate};},
  motion(value){playing=value;timings.reset();invalidate();},active(value){visible=value;timings.reset();invalidate();},reviewCamera(action){if(action)orbit.action(action);return orbit.snapshot();},
  dispose(){if(disposed)return;disposed=true;unsubscribe();resize.disconnect();canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('wheel',pointer);canvas.removeEventListener('keydown',pointer);orbit.suspend();scene.dispose();engine.dispose();}
 };
}
