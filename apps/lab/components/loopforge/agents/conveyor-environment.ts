import type {Scene} from '@babylonjs/core/scene';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {PBRMaterial} from '@babylonjs/core/Materials/PBR/pbrMaterial';
import {Color3} from '@babylonjs/core/Maths/math.color';
import {Vector3} from '@babylonjs/core/Maths/math.vector';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {CONVEYOR_ROOM,CONVEYOR_ROOM_FIXTURES} from '@/lib/loopforge/rooms/conveyor-room-layout';

/** A working hall around the existing four functional machines. Static batches,
 * six shared materials, no lights, shadows, particles or per-frame allocations.
 * South wall is a camera-side section only: its navigation footprint stays solid. */
export function createConveyorEnvironment(scene:Scene){
  const materials:PBRMaterial[]=[],meshes:Mesh[]=[],facade:Mesh[]=[];
  function material(name:string,hex:string,metallic:number,roughness=.78,emission=0){
    const m=new PBRMaterial(`Conveyor hall ${name}`,scene);
    m.albedoColor=Color3.FromHexString(hex).toLinearSpace();m.metallic=metallic;m.roughness=roughness;m.maxSimultaneousLights=2;
    if(emission)m.emissiveColor=Color3.FromHexString(hex).toLinearSpace().scale(emission);
    materials.push(m);return m;
  }
  const shell=material('graphite enamel','#364347',.28),iron=material('structural iron','#263137',.65);
  const recess=material('deep service recess','#172328',.2),brass=material('worn edges','#8d7956',.6);
  const floor=material('quiet aisle stone','#7b8583',.04,.95),lamp=material('warm practical glass','#d8b77b',.05,.65,.65);
  function box(name:string,size:readonly[number,number,number],x:number,y:number,h:number,m:PBRMaterial,front=false){
    const mesh=MeshBuilder.CreateBox(`Conveyor hall / ${name}`,{width:size[0],height:size[1],depth:size[2]},scene);
    mesh.position.set(...worldPoint(x,y));mesh.position.y=h;mesh.material=m;mesh.isPickable=false;mesh.receiveShadows=true;
    (front?facade:meshes).push(mesh);return mesh;
  }
  function pipe(name:string,points:readonly(readonly[number,number,number])[],radius:number,m:PBRMaterial){
    const path=points.map(([x,y,h])=>{const p=new Vector3(...worldPoint(x,y));p.y=h;return p;});
    const mesh=MeshBuilder.CreateTube(`Conveyor hall / ${name}`,{path,radius,tessellation:8,cap:Mesh.CAP_ALL},scene);
    mesh.material=m;mesh.isPickable=false;mesh.receiveShadows=true;meshes.push(mesh);return mesh;
  }

  // Tall, repeated bays make the line read as a factory interior, not four exhibits.
  box('north enclosure',[24,6.8,.28],144,98.14,3.4,shell);
  box('north plinth',[24,.45,.55],144,98.32,.225,iron);
  box('east enclosure',[.28,6.8,14],155.86,105,3.4,shell);
  box('west upper return',[.28,3.4,14],132.14,105,5.1,shell);
  box('west north return',[.28,3.4,4],132.14,100,1.7,shell);
  box('west south return',[.28,3.4,6],132.14,109,1.7,shell);
  box('south enclosure',[23.72,6.8,.28],144,111.86,3.4,shell,true);
  box('south plinth',[23.72,.45,.35],144,111.8,.225,iron,true);
  for(const x of CONVEYOR_ROOM.bays){
    box('rear column',[.32,6.8,.55],x,98.55,3.4,iron);
    box('column shoe',[.6,.5,.8],x,98.6,.25,brass);
    box('deep upper panel',[3.3,2.2,.12],x+1.8>155?x-1.8:x+1.8,98.34,4.5,recess);
    box('roof cross beam',[.24,.42,13.4],x,105,6.55,iron);
    box('roof lower flange',[.46,.09,13.4],x,105,6.31,brass);
    box('south column',[.32,6.8,.3],x,111.8,3.4,iron,true);
    for(const dx of [-1,1]){
      const brace=box('rear knee brace',[.14,1.55,.22],x+dx*.46,98.7,5.65,iron);brace.rotation.z=dx*-.63;
    }
  }
  for(const y of [99.2,103.9])box('longitudinal roof beam',[23.4,.3,.24],144,y,6.65,iron);
  box('north roof band',[23.7,.16,2.2],144,99.2,6.85,shell);
  // Deep end housing frames the output; the existing press/ram remains the active machine.
  box('output recessed panel',[.12,4.6,5.4],155.64,102.6,3.3,recess);
  for(const y of [100,105.2])box('output buttress',[.85,5.9,.5],155.35,y,2.95,iron);
  box('output header',[.85,.65,5.8],155.35,102.6,5.6,brass);
  box('output receiver ledge',[.9,.3,2.2],155.25,102.5,.9,iron);
  box('press exhaust hood',[3.5,.55,1.1],148.5,99.95,4.8,iron);
  box('press exhaust riser',[1.4,1.8,.85],148.5,99.15,5.7,shell);
  for(const x of [147.05,149.95])box('press backdrop rib',[.2,4.2,.22],x,99.34,2.7,brass);

  // Services live on the rear spine. Wide housings, large pipes, restrained hardware.
  for(const [x,width] of [[135.5,2.2],[140.5,2.7],[144.5,1.8],[151.9,2.3]] as const){
    box('service cabinet',[width,1.9,.7],x,98.9,1.1,iron);
    box('cabinet inset',[width-.22,1.55,.08],x,99.29,1.17,shell);
    box('cabinet foot',[width+.12,.18,.8],x,98.95,.16,brass);
    box('cabinet handle',[.08,.38,.08],x+width*.3,99.36,1.2,brass);
  }
  for(const h of [3.55,3.95])pipe('main utility trunk',[[133,98.9,h],[153.8,98.9,h],[155.1,99.7,h],[155.1,103,h]],.105,brass);
  for(const x of [136.5,140.5,144.5,148.5]){
    pipe('station service riser',[[x,99.3,.3],[x,99.3,3.55],[x+.4,99.3,3.75]],.07,brass);
    box('task light housing',[2,.18,.45],x,100.1,4.15,iron);
    box('task light diffuser',[1.75,.055,.32],x,100.1,4.04,lamp);
    pipe('light suspension',[[x-.65,100.1,4.24],[x-.65,100.1,6.35]],.025,iron);
    pipe('light suspension',[[x+.65,100.1,4.24],[x+.65,100.1,6.35]],.025,iron);
  }
  // Wash gets an unmistakable drain and hanging service hose, never permanent crisis fire.
  box('wash drain surround',[3.15,.035,1],140.5,104.3,.022,brass);
  box('wash grate dark bed',[2.95,.045,.84],140.5,104.3,.032,recess);
  for(let x=139.1;x<142;x+=.2)box('wash drain bar',[.065,.04,.82],x,104.3,.062,iron);
  pipe('wash maintenance hose',[[139.1,99.4,4.2],[139.1,101.05,4.2],[139.1,101.05,2.5],[139.35,101.05,2.2],[139.6,101.05,2.5]],.045,recess);
  // Framed empty carrier rack and low repair bench give the south perimeter a purpose.
  const spare=CONVEYOR_ROOM_FIXTURES.find(f=>f.id==='conveyor-spares')!.footprint;
  for(const x of [spare.x+.15,spare.x+spare.w-.15])box('spare carrier rack upright',[.14,2.4,1.05],x,111,1.2,iron);
  for(const h of [.18,1.15,2.15])box('spare carrier shelf',[3.05,.1,1.08],135.6,111,h,iron);
  for(const h of [.36,1.33]){
    box('empty carrier tray',[1.55,.13,.86],135.6,111,h,brass);
    for(const x of [134.9,136.3])box('empty tray clamp',[.12,.25,.6],x,111,h+.15,iron);
  }
  box('repair bench top',[3.3,.16,1.15],152.4,111,1.15,brass);
  for(const x of [151.15,153.65])box('repair bench support',[.3,1.1,.9],x,111,.55,iron);
  box('repair parts drawer',[1.25,.55,.95],152.4,111,.69,shell);
  box('repair tray',[.9,.09,.6],153.1,111,1.27,iron);
  // A broad quiet apron separates control use, passage and supervisor conversation.
  box('working aisle',[20.9,.025,1.45],143.65,105.95,.009,floor);
  box('supervision aisle',[20.9,.022,2.4],143.65,108.05,.009,floor);
  box('work lane edge',[20.9,.018,.055],143.65,106.66,.031,brass);
  for(const x of [136.5,140.5,144.5,148.5]){
    box('station apron',[2.8,.025,1.45],x,105.5,.03,shell);
    for(const dx of [-1.32,1.32])box('station approach edge',[.055,.025,1.4],x+dx,105.5,.047,brass);
  }
  box('entrance sill',[1.1,.025,3.8],132.7,104,.02,brass);

  // Merge each ownership/visibility group independently; never consume other scene meshes.
  const batches:Mesh[]=[],frontBatches:Mesh[]=[];
  for(const [source,target] of [[meshes,batches],[facade,frontBatches]] as const){
    for(const m of materials){
      const group=source.filter(mesh=>mesh.material===m);if(!group.length)continue;
      const batch=group.length===1?group[0]:Mesh.MergeMeshes(group,true,true)!;
      batch.name=`${m.name}${source===facade?' / south section':' / static'}`;batch.isPickable=false;batch.receiveShadows=true;target.push(batch);
    }
  }
  const southZ=worldPoint(144,111.65)[2];let frontVisible=true;
  return {
    /** No fade or hidden collision changes. Outside review cameras section the near wall. */
    updateCamera(position:Vector3){const show=position.z>=southZ;if(show===frontVisible)return;frontVisible=show;for(const mesh of frontBatches)mesh.setEnabled(show);},
    dispose(){for(const mesh of [...batches,...frontBatches])mesh.dispose();for(const m of materials)m.dispose();},
  };
}
