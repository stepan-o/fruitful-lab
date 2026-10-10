import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { Scene } from '@babylonjs/core/scene';
import { EQUIPMENT_STUDY, ROOM_STAGING } from '@/lib/loopforge/spatial/equipment';
import { INITIAL_UNLOCKED, worldPoint, type ManagedRoomId } from '@/lib/loopforge/spatial/floor';
import type { WorkshopTools, V } from './floor-scene';

/** Procedural equipment vocabulary; metre-sized parts are never resized to fill a room. */
export function buildEquipment(scene:Scene,t:WorkshopTools){
  const {box,cylinder,sphere,ring,pipe,bar,sign,iron,dark,brass,copper,green,amber,cyan,ridge}=t;
  const roots:TransformNode[]=[],later:TransformNode[]=[];
  const rotors:{node:TransformNode;room:ManagedRoomId;axis:'x'|'y'|'z';speed:number}[]=[];
  const node=(name:string,p:V=[0,0,0],parent?:TransformNode)=>{const n=new TransformNode(name,scene);n.position.set(...p);n.parent=parent??null;return n;};
  function rivets(p:TransformNode,w:number,y:number,z:number){for(let x=-w/2+.18;x<w/2;x+=.55){const b=cylinder('panel rivet',.045,.05,[x,y,z],brass,p,6);b.rotation.x=Math.PI/2;}}
  function console(p:TransformNode,x:number,z:number,w=2.7){
    box('instrument console',[w,1.18,1.2],[x,.6,z],green,p,true);const slope=box('sloped control deck',[w+.1,.16,1.45],[x,1.3,z-.1],brass,p);slope.rotation.x=.23;
    for(let i=0;i<3;i++){const dx=x-w*.3+i*w*.3;box('dial bezel',[.42,.4,.12],[dx,1.55,z+.2],iron,p);const g=cylinder('pressure dial',.15,.04,[dx,1.55,z+.12],amber,p,20);g.rotation.x=Math.PI/2;bar('dial needle',[dx,1.55,z+.09],[dx+.075,1.62,z+.09],.012,dark,p);}
    for(let i=0;i<8;i++)cylinder('selector switch',.045,.09,[x-w*.38+i*w*.106,1.41,z-.5],i%3?dark:amber,p,8);
    rivets(p,w,1.18,z-.63);for(let i=0;i<4;i++)box('console vent',[w*.6,.025,.03],[x,.35+i*.13,z-.62],dark,p);
  }
  function vessel(p:TransformNode,x:number,z:number,r:number,h:number,lit=false){
    cylinder('vessel foot',r+.15,.3,[x,.15,z],iron,p,24);cylinder('pressure jacket',r,h,[x,h/2+.3,z],green,p,32);
    sphere('vessel dome',r*2,[x,h+.25,z],iron,p,[1,.32,1],20);
    for(const y of [.6,h*.5,h-.2])ring('riveted retaining band',r+.04,.1,[x,y,z],brass,p);
    for(let i=0;i<8;i++){const a=i*Math.PI/4;bar('vessel stiffener',[x+Math.cos(a)*r,.45,z+Math.sin(a)*r],[x+Math.cos(a)*r,h-.15,z+Math.sin(a)*r],.045,iron,p);}
    box('inspection window',[.32,h*.55,.075],[x,h*.54,z-r-.04],dark,p);box('fluid sight glass',[.12,h*.47,.035],[x,h*.54,z-r-.09],lit?cyan:amber,p);
    pipe('outlet bend',[[x+r,.9,z],[x+r+.45,.9,z],[x+r+.45,.2,z]],.14,copper,p);
  }
  function belt(p:TransformNode,length:number,z=0,x=0){
    for(const side of [-1,1]){box('transfer rail',[length,.28,.16],[x,1.25,z+side],iron,p,true);box('polished rail edge',[length,.055,.21],[x,1.43,z+side],brass,p);}
    for(let px=-length/2+.2;px<length/2;px+=.35)box('transfer tread',[.29,.08,1.8],[x+px,1.4,z],green,p);
    for(let px=-length/2+.4;px<length/2;px+=1.8)for(const side of [-1,1]){box('transfer trestle',[.18,1.25,.35],[x+px,.65,z+side],iron,p);box('anchored foot',[.5,.08,.55],[x+px,.04,z+side],brass,p);}
  }
  function brain(p:TransformNode,x:number,y:number,z:number,scale=.75){
    for(const side of [-1,1])sphere('reference cortex',scale,[x+side*scale*.22,y,z],ridge,p,[.65,.65,1],16);
    for(let i=0;i<9;i++){const a=i/9*Math.PI*2;pipe('cortex gyrus',Array.from({length:9},(_,j)=>{const u=j/8*Math.PI;return[x+Math.cos(a)*Math.sin(u)*scale*.37,y+Math.sin(u)*scale*.34,z+Math.cos(u)*scale*.46] as V;}),scale*.047,ridge,p);}
    pipe('neural connection',[[x+.3,y-.1,z],[x+.48,y-.2,z+.3],[x+.5,y-.4,z+.5]],.024,cyan,p);
  }
  function liquid(p:TransformNode,r:number,h:number){
    const texture=new DynamicTexture('substrate currents',512,scene,true),c=texture.getContext() as CanvasRenderingContext2D;
    c.fillStyle='#215d58';c.fillRect(0,0,512,512);
    for(let i=0;i<48;i++){c.strokeStyle=i%3?'#468c7f':'#6dd5b5';c.lineWidth=1+i%3;c.beginPath();for(let j=0;j<80;j++){const a=j*.095,rr=15+i*5+j*.13;c.lineTo(256+Math.cos(a)*rr,256+Math.sin(a)*rr);}c.stroke();}
    texture.update();const fluid=new StandardMaterial('cognitive substrate',scene);fluid.diffuseTexture=texture;fluid.emissiveTexture=texture;fluid.emissiveColor=new Color3(.25,.6,.5);fluid.specularColor=Color3.Black();fluid.disableLighting=true;
    cylinder('luminous substrate',r,.045,[0,h,0],fluid,p,48);
    for(let i=0;i<4;i++)ring('surface interference',r*(.3+i*.18),.03,[0,h+.02,0],brass,p);
  }
  function neuralColumn(p:TransformNode,x:number,z:number,h=7.5){
    cylinder('column lower drum',1.3,.7,[x,.4,z],iron,p,32);cylinder('column upper drum',1.3,.65,[x,h-.3,z],iron,p,32);
    for(const y of [.1,.7,h-.65,h])ring('column binding',1.3,.12,[x,y,z],brass,p);
    for(let i=0;i<10;i++){const a=i*Math.PI/5;bar('column cage',[x+Math.cos(a)*1.2,.7,z+Math.sin(a)*1.2],[x+Math.cos(a)*1.2,h-.6,z+Math.sin(a)*1.2],.04,brass,p);}
    for(let strand=0;strand<14;strand++){const a=strand*2.4;pipe('suspended neural filament',Array.from({length:17},(_,i)=>[x+Math.sin(i*.55+a)*(.4+strand%3*.18),.7+(h-1.4)*i/16,z+Math.cos(i*.47+a)*(.4+strand%3*.18)] as V),.016,cyan,p);}
  }
  function projection(p:TransformNode,x:number,z:number,kind:number){
    box('projection surround',[4.1,3.8,.22],[x,4.1,z],brass,p);const tex=new DynamicTexture('conditioning pattern '+kind,512,scene,true),c=tex.getContext() as CanvasRenderingContext2D;
    c.fillStyle='#abc2ac';c.fillRect(0,0,512,512);c.strokeStyle='#263d39';c.fillStyle='#263d39';
    if(kind===0){c.lineWidth=14;c.beginPath();for(let i=0;i<350;i++){const a=i*.095,r=i*.66;c.lineTo(256+Math.cos(a)*r,256+Math.sin(a)*r);}c.stroke();}
    else if(kind===1){for(let y=0;y<8;y++)for(let x=0;x<8;x++)if((x+y)%2)c.fillRect(x*64,y*64,64,64);}
    else{c.lineWidth=18;for(let r=45;r<240;r+=45){c.beginPath();c.arc(256,256,r,0,Math.PI*2);c.stroke();}}
    tex.update();const m=new StandardMaterial('phosphor projection '+kind,scene);m.diffuseTexture=tex;m.emissiveTexture=tex;m.emissiveColor=new Color3(.28,.4,.36);m.specularColor=Color3.Black();
    const plate=MeshBuilder.CreatePlane('conditioning screen',{width:3.8,height:3.5},scene);plate.parent=p;plate.position.set(x,4.1,z-.13);plate.material=m;plate.isPickable=false;
  }
  for(const e of EQUIPMENT_STUDY){const r=e.footprint,p=node(e.name,worldPoint(r.x+r.w/2,r.y+r.h/2));roots.push(p);if(!INITIAL_UNLOCKED.includes(e.room))later.push(p);
    // Local +Z points into the far end of the room. Fronts face south / camera.
    if(e.kind==='holding-cage'){
      box('cage floor',[2.8,.18,4.8],[0,.09,0],iron,p);for(const x of [-1.35,1.35])for(let z=-2.2;z<=2.2;z+=.4)bar('cage vertical',[x,.2,z],[x,3.2,z],.035,brass,p);
      for(const y of [.35,2.8,3.25])for(const x of [-1.35,1.35])box('cage rail',[.09,.1,4.7],[x,y,0],iron,p);
      for(const z of [-2.3,2.3]){box('cage lintel',[2.8,.14,.14],[0,3.3,z],brass,p);for(let x=-1.3;x<1.4;x+=.32)bar('cage gate',[x,.2,z],[x,3.2,z],.03,iron,p);}sign('HOLD','AWAIT CLEARANCE',2.2,[0,2.8,-2.35],p);
    }else if(e.kind==='records-bank'){
      for(let x=-.8;x<=.8;x+=.8){box('records cabinet',[.72,2.6,2],[x,1.3,.6],green,p,true);for(let y=.3;y<2.5;y+=.4){box('file drawer',[.64,.32,.04],[x,y,-.43],iron,p);box('drawer pull',[.22,.035,.07],[x,y,-.47],brass,p);}}console(p,0,-1.15,2.5);
    }else if(e.kind==='intake'||e.kind==='outtake'){
      belt(p,r.w-.1);const x=e.kind==='intake'?-2:1,h=e.height;
      for(const z of [-1.5,1.5]){box('press column',[.7,h,.65],[x,h/2,z],iron,p,true);pipe('hydraulic ram',[[x-.4,.3,z],[x-.4,h-.6,z]],.13,brass,p);}
      box('press crown',[2.3,.7,3.6],[x,h-.3,0],green,p,true);box('heated jaw',[1.5,.65,2.25],[x,2.75,0],brass,p);box('furnace throat',[.14,.5,2.05],[x-.82,2.55,0],amber,p);
      // Layered castings and exposed services keep these tall machines from reading as enlarged blocks.
      for(const z of [-1.5,1.5]){
        for(let i=0;i<5;i++){const y=.55+i*(h-1.1)/5;box('column facing plate',[.73,.65,.055],[x,y,z-.34],green,p);for(const dx of [-.25,.25]){const bolt=cylinder('press anchor',.055,.055,[x+dx,y,z-.38],brass,p,6);bolt.rotation.x=Math.PI/2;}}
        pipe('press service loop',[[x+.45,.4,z],[x+.55,h-1,z],[x,h-.8,z],[x-.3,h-1.1,z]],.065,copper,p);
        box('column footing',[1.35,.26,1.1],[x,.13,z],iron,p);
      }
      for(let i=0;i<8;i++)box('crown cooling louvre',[1.65,.06,.05],[x,h-.5+i*.07,-1.825],dark,p);
      for(const dx of [-.95,.95])pipe('crown tension stay',[[x+dx,h-.6,-1.6],[x+dx,h+.05,-1.6],[x+dx,h+.05,1.6]],.065,brass,p);
      cylinder('press pressure head',.6,1.8,[x,h-1.5,0],copper,p,24);for(const y of [h-2.2,h-.8])ring('press collar',.67,.14,[x,y,0],brass,p);
      console(p,e.kind==='intake'?1.9:-1.8,-1.15,1.65);sign(e.kind==='intake'?'INTAKE':'CORTEX / OUT','AUTHORIZED OPERATORS',2.9,[x,h-.15,-1.9],p);
      if(e.kind==='outtake')brain(p,x,1.98,0,.95);
    }else if(e.kind==='scrap-maw'){
      cylinder('scrap crucible',1.45,2,[0,1,0],iron,p,32);ring('scrap maw lip',1.5,.27,[0,2,0],brass,p);cylinder('molten reject pool',1.23,.035,[0,1.98,0],amber,p,32);
      for(let i=0;i<8;i++){const a=i*Math.PI/4;box('crucible tooth',[.19,.4,.3],[Math.sin(a)*1.35,2.2,Math.cos(a)*1.35],green,p);}
      pipe('fume extraction',[[1.3,.5,1],[1.3,3.1,1],[0,3.1,0]],.24,copper,p);sign('SCRAP MAW','WASTE IS A LESSON',2.4,[0,1.3,-1.5],p);
    }else if(e.kind==='feed-bank'){
      for(const x of [-2,0,2])vessel(p,x,.2,.64,3.8);for(const y of [3.5,4.35])pipe('process header',[[-2.8,y,1],[2.8,y,1]],.13,copper,p);
    }else if(e.kind==='vat'){
      const deck=box('reactor working deck',[10,.3,10],[0,.3,0],iron,p,true);void deck;
      cylinder('substrate vessel',3.55,2.7,[0,1.65,0],green,p,48);for(const y of [.45,1,2.8,3.05])ring('reactor belt',3.6,.17,[0,y,0],brass,p);liquid(p,3.36,3.0);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;bar('reactor upright',[Math.cos(a)*3.6,.4,Math.sin(a)*3.6],[Math.cos(a)*3.6,2.9,Math.sin(a)*3.6],.055,iron,p);}
      for(const x of [-4.3,4.3])box('agitator support',[.42,7.3,.5],[x,3.8,1.5],iron,p,true);box('agitator gantry',[9.4,.55,.8],[0,7.5,1.5],brass,p);
      for(const x of [-1.8,0,1.8]){const rotor=node('substrate screw',[x,4.7,0],p);cylinder('agitator spindle',.19,4.7,[0,0,0],iron,rotor);for(let i=0;i<7;i++){const blade=box('mixing paddle',[1.15,.12,.3],[0,-1.5+i*.5,0],brass,rotor);blade.rotation.y=i*.65;}rotors.push({node:rotor,room:e.room,axis:'y',speed:.35});}
      for(const side of [-1,1])pipe('reactor outlet',[[side*3.5,1.5,0],[side*4.4,1.5,0],[side*4.4,.5,2.5]],.25,copper,p);
      for(let i=0;i<3;i++)box('deck step',[3,.18,1],[0,.08+i*.15,-5+i*.45],iron,p);
    }else if(e.kind==='filters'||e.kind==='cooling-bank'){
      for(let z=-r.h/2+2;z<r.h/2;z+=3.5)vessel(p,0,z,1.15,e.height-1,true);
      pipe('bank supply',[[1.65,.5,-r.h/2+.5],[1.65,e.height-.5,-r.h/2+.5],[1.65,e.height-.5,r.h/2-.5],[1.65,.5,r.h/2-.5]],.17,copper,p);
    }else if(e.kind==='control'){console(p,0,0,3.6);}
    else if(e.kind==='neural-column'){neuralColumn(p,0,0,e.height);}
    else if(e.kind==='loom'){
      for(const z of [-3.6,3.6]){box('loom head',[4.5,2.4,1],[0,1.3,z],green,p,true);const drum=cylinder('ribbon drum',.75,3.8,[0,2.5,z],brass,p,28);drum.rotation.z=Math.PI/2;}
      for(const x of [-2.15,2.15])box('loom frame',[.22,.25,8],[x,2.1,0],iron,p,true);
      for(let i=0;i<25;i++){const x=-1.8+i*.15;pipe('stretched neural thread',[[x,2.5,-3.6],[x,2.25,0],[x,2.5,3.6]],.012,cyan,p);}
      for(const z of [-1,1]){box('heddle bank',[4.3,.18,.3],[0,3.4,z],brass,p);for(let i=0;i<12;i++)bar('heddle needle',[-1.8+i*.32,3.3,z],[-1.8+i*.32,2.4,z],.018,iron,p);}
      console(p,0,-4.3,2);for(const x of [-1.9,1.9])pipe('loom umbilical',[[x,.2,3.7],[x,.2,4.5],[x,3.4,4.5]],.09,copper,p);
    }else if(e.kind==='harmonic-dais'){
      for(let i=0;i<5;i++)box('dais stair',[7-i*.5,.25,5-i*.65],[0,.12+i*.25,.3+i*.2],iron,p,true);
      const disc=ring('harmonic halo',2.15,.22,[0,4.7,1.1],brass,p);disc.rotation.x=Math.PI/2;
      for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.cos(a)*2.3,y=4.7+Math.sin(a)*2.3;const dial=cylinder('harmonic resonator',.32,.22,[x,y,1.1],iron,p,20);dial.rotation.x=Math.PI/2;sphere('resonator glow',.3,[x,y,.94],cyan,p,[1,1,.3],12);bar('resonator arm',[x,y,1.1],[x*.8,4.7+(y-4.7)*.8,1.1],.065,brass,p);}
      for(let i=0;i<9;i++){const a=i*2.4;pipe('harmonic field',Array.from({length:12},(_,j)=>{const u=j/11;return[Math.sin(u*6+a)*1.7,3.1+u*3.2,1+Math.cos(u*5+a)*.15] as V;}),.018,cyan,p);}
      console(p,0,-.7,4.5);sign('HARMONIC ARRAY','LISTEN BEFORE YOU TOUCH',4.3,[0,7.8,1.4],p);
    }else if(e.kind==='theatre-stage'){
      box('lecture platform',[14,.48,5],[0,.24,0],iron,p,true);for(let i=0;i<3;i++)box('stage stair',[4,.16,1.2],[0,.08+i*.15,-3+i*.35],brass,p);
      for(let i=0;i<3;i++)projection(p,-4.7+i*4.7,2.2,i);console(p,5,-1,2.4);box('speaker podium',[1.8,1.3,1.2],[0,1,-.8],green,p);sign('BURN IN','ATTEND / ABSORB / REPEAT',8,[0,6.4,2.25],p);
    }else if(e.kind==='conditioning-bank'){
      for(let row=0;row<4;row++)for(let col=0;col<4;col++){const x=-5.8+col*3.85,z=-3.6+row*2.4;box('conditioning pedestal',[1.35,.92,1.5],[x,.46,z],green,p,true);box('conditioning collar',[1.55,.2,1.65],[x,1.03,z],brass,p);brain(p,x,1.5,z,.72);for(let i=0;i<3;i++)box('unit indicator',[.12,.04,.05],[x-.35+i*.33,.8,z-.79],cyan,p);pipe('conditioning cable',[[x+.65,.8,z],[x+.85,.1,z],[x+1.2,.07,z+.7]],.035,dark,p);}
    }else if(e.kind==='assembly-chamber'){
      cylinder('assembly foundation',3.5,.65,[0,.35,0],iron,p,40);for(const y of [.6,1,4.8,5.2,8.9])ring('assembly crown',3.3,.25,[0,y,0],brass,p);
      for(let i=0;i<8;i++){const a=i*Math.PI/4;bar('assembly pillar',[Math.cos(a)*3.2,.65,Math.sin(a)*3.2],[Math.cos(a)*3.2,8.9,Math.sin(a)*3.2],.18,iron,p);}
      cylinder('suspended compression head',2.7,1.7,[0,7.7,0],green,p,40);cylinder('prototype holder',2.3,.55,[0,1.3,0],brass,p,40);brain(p,0,3,0,2.35);
      for(let i=0;i<10;i++){const a=i*Math.PI/5;pipe('assembly neural harness',[[Math.cos(a)*2.7,6.9,Math.sin(a)*2.7],[Math.cos(a)*1.5,4.7,Math.sin(a)*1.5],[Math.cos(a)*1.1,3.3,Math.sin(a)*1.1]],.045,cyan,p);}
      sign('CORTEX / 2.0','ASSEMBLY CHAMBER',4.2,[0,9.4,0],p);
    }else if(e.kind==='assembly-feed'){
      const turn=node('approach conveyor',[0,0,0],p);turn.rotation.y=Math.PI/2;belt(turn,7.5);for(const x of [-2.2,0,2.2])brain(turn,x,1.92,0,.85);
    }
  }
  const markings=node('interaction floor clearances');roots.push(markings);
  for(const room of ['security','conveyor'] as const){const a=ROOM_STAGING[room].encounter;for(const x of [a.x,a.x+a.w]){const p=worldPoint(x,a.y+a.h/2);box('service aisle edge',[.045,.018,a.h],[p[0],.03,p[2]],brass,markings);} }
  let inspecting=false;
  return {roots,study(enabled:boolean){inspecting=enabled;for(const n of later)n.setEnabled(enabled);},animate(time:number,motion:boolean,focus:string){if(inspecting&&motion)for(const r of rotors)if(focus===r.room)r.node.rotation[r.axis]=time*r.speed;},counts:EQUIPMENT_STUDY.length};
}
