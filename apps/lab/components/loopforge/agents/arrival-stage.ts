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
import type {StationLighting} from './station-light';
import {createConveyorLine} from './conveyor-line';
import {loadOpeningArchitecture} from './load-room-kit';
import type {View,SceneFraming} from '@/lib/loopforge/encounters/contract';
import {ARRIVAL_LAYOUT,ARRIVAL_EQUIPMENT} from '@/lib/loopforge/encounters/arrival-layout';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {ROOM_FLOORS} from '@/lib/loopforge/rooms/appearance';
import {createFrameWindow} from '@/lib/loopforge/frame-window';
import {resolveGraphics,REFERENCE_GRAPHICS} from '@/lib/loopforge/graphics/settings';
import {graphicsSnapshot,subscribeGraphics} from '@/lib/loopforge/graphics/store';
import {buildEquipment} from '../factory-study/equipment-scene';
import {workshopPrimitives} from '../factory-study/workshop-primitives';
import {createReviewOrbit} from '../factory-study/review-orbit';
import type {FactoryScene,SceneReport} from '../factory-study/scene';
export type RehearsalStage=Pick<FactoryScene,'characterStage'|'motion'|'active'|'reviewCamera'|'dispose'>&{sceneShot?:(shot:SceneFraming)=>void;trackApproach?:(view:View)=>void;benchmark?:(enabled:boolean)=>void;ready?:Promise<void>;presentProcess?:(process:View['process'])=>void;machineEffects?:(enabled:boolean)=>void;stationLighting?:(mode:StationLighting)=>void;stationLightSnapshot?:()=>unknown};
/** Reusable three-room scene shell. Bounds and doorway come from the same layout as admission.
 * Equipment uses the shared factory vocabulary and the engine’s physical footprints. */
export function createArrivalStage(canvas:HTMLCanvasElement,report:(r:SceneReport)=>void):RehearsalStage{
 const engine=new Engine(canvas,false,{stencil:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 const scene=new Scene(engine);scene.clearColor=new Color4(.025,.035,.04,1);
 const camera=new ArcRotateCamera('Lobby doorway camera',-1.3,.85,23,Vector3.Zero(),scene);camera.minZ=.1;camera.maxZ=100;camera.fov=.8;
 let dirty=true,visible=true,playing=false,disposed=false,lastDraw=0,lastReport=0,readyForMotion=false,lastReadinessCheck=0;
 const invalidate=()=>{dirty=true;};
 const orbit=createReviewOrbit(camera,canvas,invalidate,36);
 orbit.framing(16,5);orbit.orientation(-Math.PI/2,1.2);orbit.attach(new Vector3(...worldPoint(124,125.5)).add(new Vector3(0,1.4,0)));
 const key=new DirectionalLight('Entrance overhead',new Vector3(.4,-1,-.2),scene);key.position=new Vector3(-14,14,-5);key.intensity=1.35;key.diffuse=Color3.FromHexString('#fff0d6');
 const hemi=new HemisphericLight('Lobby bounce',Vector3.Up(),scene);hemi.intensity=.8;hemi.groundColor=new Color3(.19,.22,.26);
 const shadow=new ShadowGenerator(1024,key);shadow.usePercentageCloserFiltering=true;shadow.filteringQuality=ShadowGenerator.QUALITY_LOW;shadow.bias=.001;shadow.normalBias=.03;
 // Poses advance at 20 Hz. Reuse their unchanged shadow map between pose updates.
 // Resolution and filtering stay identical; a new pose invalidates it immediately.
 shadow.getShadowMap()!.refreshRate=0;
 const refreshPose=()=>{shadow.getShadowMap()?.resetRefreshCounter();invalidate();};
 const faces=Array.from({length:6},(_,face)=>{const data=new Uint8Array(16*16*4);for(let i=0;i<data.length;i+=4){const c=face===2?140:face===3?30:75;data[i]=data[i+1]=data[i+2]=c;data[i+3]=255;}return data;});
 scene.environmentTexture=new RawCubeTexture(scene,faces,16,Constants.TEXTUREFORMAT_RGBA,Constants.TEXTURETYPE_UNSIGNED_BYTE,true,false);scene.environmentIntensity=.5;
 const pipeline=new DefaultRenderingPipeline('Opening room presentation',false,scene,[camera]);pipeline.samples=1;pipeline.bloomThreshold=1.4;pipeline.bloomWeight=.12;
 const materials:PBRMaterial[]=[];
 function material(name:string,hex:string,metal=.25){const m=new PBRMaterial(name,scene);m.albedoColor=Color3.FromHexString(hex).toLinearSpace();m.metallic=metal;m.roughness=.75;m.maxSimultaneousLights=3;materials.push(m);return m;}
 const iron=material('Worn door iron','#263138',.7),brass=material('Dull brass edging','#8d784d',.65),wall=material('Quiet wall enamel','#343d38'),dark=material('Recessed housings','#161f26');
 function box(name:string,size:[number,number,number],x:number,y:number,height:number,m:PBRMaterial){const mesh=MeshBuilder.CreateBox(name,{width:size[0],height:size[1],depth:size[2]},scene);mesh.position.set(...worldPoint(x,y));mesh.position.y=height;mesh.material=m;mesh.receiveShadows=true;mesh.isPickable=false;return mesh;}
 for(const room of ARRIVAL_LAYOUT.rooms){
  const {x,y,w,h}=room.rect,m=material(`${room.id} floor`,ROOM_FLOORS[room.id],.08);
  const tex=new DynamicTexture(`${room.id} worn panels`,512,scene,true),ctx=tex.getContext();ctx.fillStyle='#ffffff';ctx.fillRect(0,0,512,512);ctx.strokeStyle='#e1e2e1';ctx.lineWidth=1;ctx.strokeRect(2,2,508,508);
  for(let i=0;i<130;i++){ctx.fillStyle=i%3?'#00000007':'#00000016';ctx.fillRect(i*197%512,i*71%512,3+i%20,1);}
  tex.update();tex.wrapU=Constants.TEXTURE_WRAP_ADDRESSMODE;tex.wrapV=Constants.TEXTURE_WRAP_ADDRESSMODE;tex.uScale=w/2;tex.vScale=h/2;m.albedoTexture=tex;
  box(`${room.id} floor`,[w,.2,h],x+w/2,y+h/2,-.11,m);
  // Panel seams live in one low-contrast floor texture, below the cast. No extra meshes.
  if(room.id==='security'){box('East wall beside Conveyor south',[.25,3,5],132,108.5,1.5,wall);box('East wall beside Conveyor north',[.25,3,3],132,100.5,1.5,wall);box('Conveyor doorway lintel',[.4,.4,4],132,104,3.2,iron);}else box(`${room.id} east wall`,[.25,3,h],x+w,y+h/2,1.5,wall);
  for(let yy=y+1;yy<y+h;yy+=3){if(room.id==='security'&&yy>=102&&yy<=106)continue;box('Ribbed pilaster',[.35,3.5,.35],x+w-.15,yy,1.75,iron);box('Brass footing',[.5,.15,.6],x+w-.15,yy,.08,brass);}
 }
 const door=ARRIVAL_LAYOUT.portal;
 box('Security west return',[6,3,.3],119,door.axis,1.5,wall);box('Security east return',[6,3,.3],129,door.axis,1.5,wall);
 box('Security back wall',[16,4,.3],124,99,2,wall);
 for(const x of [door.min,door.max]){box('Checkpoint pillar',[.4,3.8,.5],x,door.axis,1.9,iron);box('Checkpoint brass band',[.48,.13,.55],x,door.axis,2.65,brass);}
 box('Checkpoint lintel',[4.5,.45,.6],124,door.axis,3.65,iron);
 box('WAIT HERE line',[4,.025,.18],124,112.6,.015,brass);
 const checkpointProxy=scene.meshes.filter(m=>/^Checkpoint /.test(m.name));
 // The workers choose their own places around the doorway. No queue pens.
 const outside=material('Morning approach concrete','#626c72',.04);
 box('Factory approach',[16,.015,13],124,128.5,.006,outside);
 for(const x of [117.5,130.5])box('Factory facade',[3,6.4,.45],x,122,3.2,wall);
 for(const x of [119,129])box('Factory main door frame',[.45,5.3,.65],x,122,2.65,iron);
 box('Factory main door lintel',[10.4,.55,.75],124,122,5.15,iron);
 // Rolled-up door leaves the same open corridor used by the navigation layout.
 box('Rolled shutter housing',[10.3,.65,.8],124,122,5.7,dark);

 // The working fixtures use the same footprints as navigation and future operator actions.
 const copper=material('Aged copper pipes','#71604a',.65),green=material('Security enamel','#42514a',.35),quiet=material('Instrument ivory','#aaa88d',.1);
 const amber=new StandardMaterial('Warm instrument glass',scene);amber.diffuseColor=Color3.FromHexString('#b99a55');amber.emissiveColor=new Color3(.35,.22,.07);
 const cyan=new StandardMaterial('Security strip glass',scene);cyan.diffuseColor=Color3.FromHexString('#76a5aa');cyan.emissiveColor=new Color3(.18,.35,.38);
 const tools=workshopPrimitives(scene,{iron,dark,brass,copper,green,floorMat:outside,amber,quiet,cyan,ridge:quiet});
 const beforeEquipment=new Set(scene.meshes);
 buildEquipment(scene,tools,['security'],{placements:ARRIVAL_EQUIPMENT,markings:false});
 const deskProxy=scene.meshes.filter(m=>!beforeEquipment.has(m)&&/instrument console|sloped control deck|dial bezel|pressure dial|dial needle|selector switch|console vent|panel rivet/.test(m.name));
 for(let x=117;x<=131;x+=2){
  box('Security wall inset',[1.65,2.9,.08],x,99.19,1.85,green);
  box('Inset lower rail',[1.75,.08,.13],x,99.27,.42,brass);
  for(const dx of [-.77,.77])box('Inset stile',[.055,2.9,.12],x+dx,99.25,1.85,iron);
 }
 for(const x of [117,121,127,131]){
  const [wx,,wz]=worldPoint(x,99.45);
  tools.pipe('Security service riser',[[wx,.15,wz],[wx,3.6,wz],[wx+.45,3.8,wz],[wx+.45,3.8,wz-1.2]],.075,copper);
  for(const h of [.6,2.8])tools.ring('Pipe collar',.095,.055,[wx,h,wz],brass);
 }
 for(const x of [119,129]){
  const [wx,,wz]=worldPoint(x,99.55);
  tools.box('Inspection light housing',[2,.17,.2],[wx,3.35,wz],dark);
  tools.box('Inspection light diffuser',[1.7,.06,.22],[wx,3.29,wz-.04],cyan);
 }
 // Rear service wall gives the line depth without cluttering the operator floor.
 box('Conveyor service wall',[24,4.8,.25],144,98,2.4,wall);
 for(let x=134;x<155;x+=3){
  box('Conveyor rear rib',[.22,4.9,.32],x,98.2,2.45,iron);
  box('Conveyor service panel',[2.5,2.5,.12],x+1.45,98.2,1.6,green);
  box('Service panel inset',[1.7,1.3,.1],x+1.45,98.31,1.65,dark);
  for(let j=0;j<4;j++)box('Service louvre',[1.55,.07,.1],x+1.45,98.39,1.25+j*.24,iron);
 }
 for(const h of [3.45,3.8]){
  const [x,,z]=worldPoint(133,98.6),[end]=worldPoint(155,98.6);
  tools.pipe('Conveyor overhead service',[[x,h,z],[end,h,z]],.08,copper);
 }
 for(const x of [136.5,140.5,144.5,148.5]){
  const [wx,,wz]=worldPoint(x,99.1);
  tools.pipe('Station service drop',[[wx,3.8,wz],[wx,2.9,wz],[wx+.4,2.6,wz],[wx+.4,.2,wz]],.06,copper);
  tools.box('Station light housing',[2.1,.18,.45],[wx,3.75,wz-.3],dark);
  tools.box('Warm station light',[1.8,.06,.32],[wx,3.64,wz-.3],amber);
  box('Operator apron',[2.8,.025,1.6],x,105.4,.018,dark);
  for(const dx of [-1.3,1.3])box('Apron boundary',[.06,.03,1.5],x+dx,105.4,.021,brass);
 }
 function sign(text:string,x:number,y:number,h:number,w:number){const texture=new DynamicTexture(text,{width:1024,height:128},scene,true);const c=texture.getContext() as CanvasRenderingContext2D;c.fillStyle='#172226';c.fillRect(0,0,1024,128);c.fillStyle='#d1c7a5';c.font='bold 70px Georgia';c.textAlign='center';c.fillText(text,512,90);texture.update();const m=new StandardMaterial(text,scene);m.diffuseTexture=texture;m.emissiveColor=new Color3(.4,.4,.4);const plane=MeshBuilder.CreatePlane(text,{width:w,height:.48,sideOrientation:Mesh.DOUBLESIDE},scene);plane.position.set(...worldPoint(x,y));plane.position.y=h;plane.material=m;}
 sign('LOOPFORGE',124,122.49,5.45,5.8);sign('SECURITY / ADMISSION',124,111.49,4.32,4.2);sign('IDENTIFICATION',124,99.22,2.8,4);
 for(const [label,x] of [['01 / INTAKE',136.5],['02 / BRAIN WASH',140.5],['03 / MAIN BELT',144.5],['04 / LATTICE FORGE',148.5]] as const)sign(label,x,98.5,3,3.3);
 const cutaway=scene.meshes.filter(m=>/Factory facade|Factory main door|Rolled shutter|LOOPFORGE/.test(m.name));
 const entranceProxy=cutaway.filter(m=>/Factory main door|Rolled shutter/.test(m.name));
 const replacementProxies=[...checkpointProxy,...deskProxy,...entranceProxy];
 const architectureAbort=new AbortController();let architecture:Awaited<ReturnType<typeof loadOpeningArchitecture>>|undefined,currentShot:SceneFraming='approach';
 const architectureReady=loadOpeningArchitecture(scene,architectureAbort.signal).then(model=>{architecture=model;replacementProxies.forEach(m=>m.setEnabled(false));model.entrance.setEnabled(currentShot==='approach'||currentShot==='passage');invalidate();});
 // Batch static fittings once; each character keeps its independent body and rig.
 for(const m of [...materials,amber,cyan]){const meshes=scene.meshes.filter(mesh=>mesh.material===m&&!cutaway.includes(mesh)&&!replacementProxies.includes(mesh)) as Mesh[];if(meshes.length>1)Mesh.MergeMeshes(meshes,true,true);}
 const conveyor=createConveyorLine(scene,invalidate);conveyor.present(undefined);
 let benchmarking=false;let preferences=graphicsSnapshot(),effective=resolveGraphics(preferences,'room');
 function size(){if(benchmarking){engine.setHardwareScalingLevel(1);engine.setSize(1280,720);invalidate();return;}engine.setHardwareScalingLevel(1/(Math.min(window.devicePixelRatio||1,1.5)*effective.scale));engine.resize();orbit.snapshot();orbit.attach(camera.target);invalidate();}
 function settings(){preferences=graphicsSnapshot();effective=resolveGraphics(benchmarking?REFERENCE_GRAPHICS:preferences,'room');scene.shadowsEnabled=effective.shadows!=='off';conveyor.stationLight.shadowsAllowed(effective.shadows!=='off');pipeline.fxaaEnabled=effective.antialias;pipeline.bloomEnabled=effective.bloom;shadow.getShadowMap()?.resize(effective.shadows==='full'?1024:512);size();}
 const unsubscribe=subscribeGraphics(settings);settings();
 const resize=new ResizeObserver(size);resize.observe(canvas);
 const timings=createFrameWindow();let previousCamera='';
 scene.onDataLoadedObservable.add(()=>{readyForMotion=false;invalidate();});engine.onContextRestoredObservable.add(()=>{readyForMotion=false;refreshPose();});
 const pointer=()=>{dirty=true;};canvas.addEventListener('pointermove',pointer);canvas.addEventListener('wheel',pointer);canvas.addEventListener('keydown',pointer);
 engine.runRenderLoop(()=>{
  if(disposed||!visible||document.hidden){timings.reset();return;}
  const now=performance.now(),cameraState=[camera.alpha,camera.beta,camera.radius,camera.inertialAlphaOffset,camera.inertialBetaOffset,camera.inertialRadiusOffset].join('/');
  if(previousCamera!==cameraState){dirty=true;previousCamera=cameraState;}
  // Rendering checks each visible material itself. A second whole-scene readiness
  // traversal on every frame is unnecessary once the assets have loaded.
  if(now-lastReadinessCheck>1000){readyForMotion=scene.isReady();lastReadinessCheck=now;}
  if((!benchmarking&&now-lastDraw<1000/effective.targetFps-1)||(!playing&&!dirty&&readyForMotion))return;
  const dt=lastDraw?Math.min(.1,(now-lastDraw)/1000):0;if(playing)conveyor.animate(dt);
  lastDraw=now;dirty=false;const before=performance.now(),drawStart=engine._drawCalls.current;scene.render();timings.frame(now,readyForMotion?(playing?'active':'idle'):'loading');
  if(now-lastReport>1000){lastReport=now;report({...timings.snapshot(),meshes:scene.meshes.length,active:scene.getActiveMeshes().length,workers:10,resolution:`${engine.getRenderWidth()} × ${engine.getRenderHeight()}`,renderer:engine.getGlInfo().renderer,renderMs:Math.round(performance.now()-before),updateMs:0,drawCalls:engine._drawCalls.current-drawStart,triangles:Math.round(scene.getActiveIndices()/3)});}
 });
 return {
  ready:Promise.all([conveyor.ready,architectureReady]).then(()=>undefined),presentProcess:conveyor.present,machineEffects:conveyor.effects,stationLighting:conveyor.stationLight.set,stationLightSnapshot:conveyor.stationLight.snapshot,
  benchmark(enabled){benchmarking=enabled;settings();if(enabled)camera.detachControl();},
  sceneShot(shot){
   const setups={
    approach:[124,124.5,1.55,11,-Math.PI/2,1.32],
    assembly:[124,111.9,1.6,6.0,-1.78,1.4],
    impact:[123.85,111.8,.95,4.8,-2.15,1.12],
    card:[124.2,112.2,.8,4.1,-2.5,.98],
    passage:[125.1,116.0,1.3,7.9,1.79,1.36],
    threshold:[124.9,110.9,1.05,7.1,-1.5,1.25],
    // Keep the applicant, LIMEN and both rear desks in one working composition.
    checkpoint:[124.1,108.7,1.45,10.2,-1.66,1.3],
    aftermath:[124.6,111.3,1.45,4.8,-1.45,1.35],
    'conveyor-wide':[141.5,103.7,1.25,15,-1.9,1.18],
    intake:[136.6,104.5,1.25,6.8,-2.1,1.28],
    wash:[140.5,104.4,1.35,7.4,-2.1,1.25],
    belt:[144.6,104.3,1.3,8.5,-2.1,1.24],
    forge:[148.5,103.8,1.65,8.5,-2.8,1.24],
   } as const;
   currentShot=shot;refreshPose();const showEntrance=shot==='approach'||shot==='passage';
   cutaway.forEach(m=>m.setEnabled(showEntrance&&!(architecture&&entranceProxy.includes(m))));architecture?.entrance.setEnabled(showEntrance);
   const s=setups[shot==='wide'?'assembly':shot==='interaction'?'impact':shot];orbit.framing(s[3],3.5);orbit.orientation(s[4],s[5]);orbit.attach(new Vector3(...worldPoint(s[0],s[1])).add(new Vector3(0,s[2],0)));if(benchmarking)camera.detachControl();
  },
  trackApproach(view){
   if(currentShot!=='approach')return;
   const workers=view.actors.filter(a=>a.character==='worker');if(!workers.length)return;
   const y=workers.reduce((sum,a)=>sum+a.position[1]/1000,0)/workers.length-2.8;
   const [x,,z]=worldPoint(124,y);camera.target.set(x,1.55,z);invalidate();
  },
  characterStage(){return {scene,shadow,gate(){},refresh:refreshPose};},
  motion(value){if(playing===value)return;playing=value;timings.reset();invalidate();},active(value){visible=value;timings.reset();invalidate();},reviewCamera(action){if(action)orbit.action(action);return orbit.snapshot();},
  dispose(){if(disposed)return;disposed=true;unsubscribe();resize.disconnect();canvas.removeEventListener('pointermove',pointer);canvas.removeEventListener('wheel',pointer);canvas.removeEventListener('keydown',pointer);orbit.suspend();architectureAbort.abort();architecture?.dispose();conveyor.dispose();scene.dispose();engine.dispose();}
 };
}
