import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import type { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Scene } from '@babylonjs/core/scene';
import { accessible, FIRST_FLOOR_HEIGHT, FLOOR_SIZE, INITIAL_UNLOCKED, PORTALS, portalOpen, portalRect, worldPoint, zone, ZONES, type ZoneId } from '@/lib/loopforge/spatial/floor';
import { BUILDING_BANDS, BUILDING_EDGES, SERVICE_INFILL, SERVICE_BLOCKS } from '@/lib/loopforge/spatial/envelope';
import { CONSTRUCTION_RESERVES, DELIVERY_AISLES } from '@/lib/loopforge/spatial/capacity';
export type V = [number,number,number];
export type Mat = PBRMaterial | StandardMaterial;
export type WorkshopTools = {
  box(name:string,size:V,pos:V,mat:Mat,parent?:TransformNode,cast?:boolean):Mesh;
  pipe(name:string,points:V[],radius:number,mat:Mat,parent?:TransformNode):Mesh;
  cylinder(name:string,radius:number,height:number,pos:V,mat:Mat,parent?:TransformNode,tessellation?:number):Mesh;
  sphere(name:string,diameter:number,pos:V,mat:Mat,parent?:TransformNode,scale?:V,segments?:number):Mesh;
  ring(name:string,radius:number,thickness:number,pos:V,mat:Mat,parent?:TransformNode):Mesh;
  bar(name:string,a:V,b:V,radius:number,mat:Mat,parent?:TransformNode):Mesh;
  sign(text:string,sub:string,width:number,pos:V,parent?:TransformNode):void;
  iron:Mat;dark:Mat;brass:Mat;copper:Mat;green:Mat;floorMat:PBRMaterial;amber:Mat;quiet:Mat;cyan:Mat;ridge:Mat;
};

/** Architecture uses metre-scale repetition; increasing tile count does not produce
 * a mesh per tile. Each hall is a cullable, material-batched chunk. */
export function buildFloor(scene:Scene,t:WorkshopTools){
  const {box,pipe,iron,dark,brass,copper,green,amber,quiet}=t;

  const roots:TransformNode[]=[], covers:TransformNode[]=[], shutters:TransformNode[]=[];
  const northWalls=new Map<ZoneId,TransformNode>();
  const surveyPaint=new StandardMaterial("worn construction paint",scene);surveyPaint.diffuseColor=new Color3(.42,.38,.26);surveyPaint.emissiveColor=new Color3(.24,.21,.14);surveyPaint.specularColor=Color3.Black();
  const at=(x:number,y:number,h=0):V=>{const p=worldPoint(x,y);p[1]=h;return p;};
  const parent=(name:string)=>{const n=new TransformNode(name,scene);roots.push(n);return n;};
  const texture=new DynamicTexture('four metre worn floor panels',1024,scene,true),ctx=texture.getContext() as CanvasRenderingContext2D;
  ctx.fillStyle='#39423c';ctx.fillRect(0,0,1024,1024);
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){
    const k=x+y*4;ctx.fillStyle=['#3b4039','#3d423b','#3a403a','#3e433b'][k%4];ctx.fillRect(x*256+3,y*256+3,250,250);
    ctx.strokeStyle='#151d19';ctx.lineWidth=3;ctx.strokeRect(x*256+3,y*256+3,250,250);
    ctx.strokeStyle='#626554';ctx.lineWidth=1;ctx.strokeRect(x*256+8,y*256+8,236,236);
    for(const dx of [18,238])for(const dy of [18,238]){ctx.fillStyle='#151a17';ctx.beginPath();ctx.arc(x*256+dx,y*256+dy,4,0,Math.PI*2);ctx.fill();}
  }
  for(let i=0;i<3600;i++){const x=(i*197)%1024,y=(i*443)%1024;ctx.fillStyle=i%3?'#10181219':'#c0b89522';ctx.fillRect(x,y,2+i%17,1+i%2);}
  for(let i=0;i<24;i++){const x=(i*191)%1024,y=(i*337)%1024,g=ctx.createRadialGradient(x,y,0,x,y,35+i%40);g.addColorStop(0,'#070e0b50');g.addColorStop(1,'#070e0b00');ctx.fillStyle=g;ctx.fillRect(x-80,y-80,160,160);}
  texture.wrapU=Texture.WRAP_ADDRESSMODE;texture.wrapV=Texture.WRAP_ADDRESSMODE;texture.update();const floorMat=t.floorMat.clone('architectural floor');floorMat.albedoTexture=texture;floorMat.albedoColor=new Color3(.92,.94,.88);floorMat.metallic=.12;floorMat.roughness=.82;floorMat.bumpTexture=null;
  function stencil(title:string,sub:string,x:number,y:number,w:number,h:number,elevation:number,p:TransformNode,dim=false){
    const tex=new DynamicTexture(title+' stencil',{width:1024,height:256},scene,true),c=tex.getContext() as CanvasRenderingContext2D;
    c.clearRect(0,0,1024,256);c.textAlign='center';c.fillStyle=dim?'#9f9c86':'#d0bd88';c.font='bold 80px Georgia';c.fillText(title,512,115,950);c.font='26px monospace';c.fillStyle='#8ba494';c.fillText(sub,512,190,950);
    c.globalCompositeOperation='destination-out';for(let i=0;i<100;i++)c.fillRect(i*97%1024,i*71%256,4+i%8,2);tex.hasAlpha=true;tex.update();
    const m=new StandardMaterial(title+' paint',scene);m.diffuseTexture=tex;m.useAlphaFromDiffuseTexture=true;m.emissiveColor=new Color3(.28,.29,.23);m.specularColor=Color3.Black();m.backFaceCulling=false;
    const mesh=MeshBuilder.CreatePlane(title,{width:w,height:h},scene);mesh.position.copyFromFloats(...at(x,y,elevation));mesh.rotation.x=Math.PI/2;mesh.material=m;mesh.parent=p;mesh.isPickable=false;
  }
  function wallRun(z:ZoneId,side:'north'|'south'|'west'|'east',p:TransformNode){
    const r=zone(z).rect,horizontal=side==='north'||side==='south',fixed=side==='north'?r.y:side==='south'?r.y+r.h:side==='west'?r.x:r.x+r.w;
    const start=horizontal?r.x:r.y,len=horizontal?r.w:r.h;
    for(let i=0;i<len;i+=2){
      const along=start+i+1,x=horizontal?along:fixed,y=horizontal?fixed:along;
      const opening=PORTALS.some(port=>{if(port.a!==z&&port.b!==z)return false;const q=portalRect(port);return x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h;});
      if(opening)continue;
      const full=side==='north'||side==='west',height=full?FIRST_FLOOR_HEIGHT:.7;
      box('masonry bay',horizontal?[2,height,.32]:[.32,height,2],at(x,y,height/2),dark,p);
      box('brass coping',horizontal?[2,.09,.42]:[.42,.09,2],at(x,y,height+.03),brass,p);
      if(full){
        for(let j=0;j<Math.floor(height);j+=2)box('wall horizontal course',horizontal?[1.94,.025,.05]:[.05,.025,1.94],at(x+(horizontal?0:.18),y+(horizontal?.18:0),.4+j),iron,p);
        if(i%4===0){box('structural pilaster',horizontal?[.32,height+.4,.6]:[.6,height+.4,.32],at(x,y,(height+.4)/2),green,p,true);box('column capital',[.7,.22,.7],at(x,y,height+.3),brass,p);}
        if(i%4===2){
          const px=x+(horizontal?0:.28),py=y+(horizontal?.28:0);
          pipe('vertical service riser',[at(px,py,.2),at(px,py,3.9),at(px+(horizontal?.5:0),py+(horizontal?0:.5),4.35)],.085,copper,p);
          for(const h of [.7,2.4,3.5])box('service strap',horizontal?[.35,.075,.22]:[.22,.075,.35],at(px,py,h),brass,p);
        }
        if(i%6===0){const lx=x+(horizontal?0:.32),ly=y+(horizontal?.32:0);box('electrical cabinet',horizontal?[.8,1.3,.3]:[.3,1.3,.8],at(lx,ly,3.2),iron,p);for(let j=0;j<3;j++)box('cabinet slot',horizontal?[.48,.025,.035]:[.035,.025,.48],at(lx+(horizontal?0:.18),ly+(horizontal?.18:0),3+j*.2),brass,p);}
      }
    }
    if(side==='north'){
      const roof=FIRST_FLOOR_HEIGHT;
      for(const h of [roof-1.35,roof-.8,roof-.35])pipe('continuous service main',[at(r.x+.4,r.y+.6,h),at(r.x+r.w-.4,r.y+.6,h)],h===roof-.8?.17:.085,copper,p);
      for(let x=r.x+2;x<r.x+r.w;x+=4){pipe('hanging cable loop',[at(x,r.y+.8,roof-.2),at(x+.2,r.y+1,roof-1.5),at(x+1,r.y+1,roof-1.8),at(x+1.5,r.y+.8,roof-.3)],.045,dark,p);box('caged wall light',[.62,.25,.5],at(x,r.y+.85,roof-1.65),brass,p);box('warm tube',[.44,.08,.27],at(x,r.y+.98,roof-1.76),amber,p);}
    }
  }
  for(const z of ZONES){const r=z.rect,x=r.x+r.w/2,y=r.y+r.h/2,p=parent(z.id+' architecture');
    const slab=box('continuous slab',[r.w,.4,r.h],at(x,y,-.22),floorMat,p),uv=slab.getVerticesData('uv');if(uv){for(let i=0;i<uv.length;i+=2){uv[i]*=r.w/4;uv[i+1]*=r.h/4;}slab.setVerticesData('uv',uv);}
    // Perimeter trench and metre-scaled drain grilles make worker scale legible.
    for(let tx=r.x+2;tx<r.x+r.w-1;tx+=3){box('service trench',[2.85,.015,.48],at(tx,r.y+r.h-2,.015),dark,p);for(let i=0;i<10;i++)box('trench grille',[.055,.025,.42],at(tx-1.3+i*.27,r.y+r.h-2,.03),iron,p);}
    for(const side of ['north','south','west','east'] as const){
      const wall=side==='north'?parent(z.id+' camera cutaway'):p;
      if(side==='north')northWalls.set(z.id,wall);
      wallRun(z.id,side,wall);
    }
    // Sparse floor-painted plots communicate construction capacity without filling it
    // with decorative machinery. They are clear ground, not restrictive build slots.
    for(const plot of CONSTRUCTION_RESERVES.filter(b=>b.room===z.id)){
      const q=plot.rect;
      for(const xx of [q.x,q.x+q.w])for(const yy of [q.y,q.y+q.h]){
        box('plot corner',[2,.018,.09],at(xx+(xx===q.x?1:-1),yy,.04),surveyPaint,p);
        box('plot corner',[.09,.018,2],at(xx,yy+(yy===q.y?1:-1),.04),surveyPaint,p);
      }
      for(let xx=q.x+5;xx<q.x+q.w;xx+=5)for(let yy=q.y+5;yy<q.y+q.h;yy+=5){
        box('survey cross',[.5,.015,.04],at(xx,yy,.025),iron,p);
        box('survey cross',[.04,.015,.5],at(xx,yy,.025),iron,p);
      }
      stencil(plot.label,`${q.w} × ${q.h} m / UNFITTED`,q.x+q.w/2,q.y+q.h/2,Math.min(20,q.w-2),3,.045,p,true);
    }
    for(const aisle of DELIVERY_AISLES.filter(a=>a.room===z.id)){
      const q=aisle.rect,horizontal=q.w>q.h,length=horizontal?q.w:q.h;
      for(let a=1;a<length;a+=3)for(const side of [0,1]){
        box('delivery lane dash',horizontal?[1.6,.017,.1]:[.1,.017,1.6],at(q.x+(horizontal?a:side*q.w),q.y+(horizontal?side*q.h:a),.04),surveyPaint,p);
      }
    }
    stencil(z.short.toUpperCase(),z.kind==='support'?'LOOPFORGE / SERVICES':z.number+' / PRODUCTION FLOOR',x,r.y+r.h-3,Math.min(13,r.w-2),2,.032,p);
    if(!accessible(z.id,INITIAL_UNLOCKED)){const cover=parent(z.id+' sealed cover');covers.push(cover);
      box('uncommissioned roof',[r.w-.4,.5,r.h-.4],at(x,y,FIRST_FLOOR_HEIGHT+.3),iron,cover);
      for(let tx=r.x+1;tx<r.x+r.w;tx+=3)box('roof seam',[.075,.08,r.h-.7],at(tx,y,FIRST_FLOOR_HEIGHT+.6),brass,cover);
      stencil(z.short.toUpperCase(),z.number+' / SEALED',x,y,r.w-2,3.2,FIRST_FLOOR_HEIGHT+.61,cover,true);
    }
  }
  // One continuous foundation and enclosed utility blocks replace floating bridges.
  // The caps stay in study mode: these are service structure, not unlockable rooms.
  const shell=parent('continuous factory envelope');
  for(const r of BUILDING_BANDS)box('continuous foundation',[r.w,.55,r.h],at(r.x+r.w/2,r.y+r.h/2,-.68),dark,shell);
  for(const r of SERVICE_INFILL)box('service floor',[r.w,.4,r.h],at(r.x+r.w/2,r.y+r.h/2,-.22),floorMat,shell);
  for(const r of SERVICE_BLOCKS){
    const x=r.x+r.w/2,y=r.y+r.h/2,height=FIRST_FLOOR_HEIGHT;
    box('pipe wall',[r.w,height,r.h],at(x,y,height/2),green,shell);
    box('utility roof coping',[r.w,.12,r.h],at(x,y,height+.06),iron,shell);
    for(let sx=r.x+2;sx<r.x+r.w;sx+=4)box('roof standing seam',[.06,.06,r.h],at(sx,y,height+.15),brass,shell);
    const horizontal=r.w>r.h,length=horizontal?r.w:r.h;
    // Bundled headers identify the remaining four-metre walls as process services.
    for(const offset of [-.95,0,.95]){
      pipe('process header',horizontal?[at(r.x+.3,y+offset,height+.35),at(r.x+r.w-.3,y+offset,height+.35)]:[at(x+offset,r.y+.3,height+.35),at(x+offset,r.y+r.h-.3,height+.35)],.24,copper,shell);
    }
    for(let a=2;a<length;a+=5)box('header saddle',horizontal?[.18,.55,3]:[3,.55,.18],at(horizontal?r.x+a:x,horizontal?y:r.y+a,height+.28),iron,shell);
  }
  for(const {start:a,end:b} of BUILDING_EDGES){
    const horizontal=a.y===b.y;
    box('continuous building plinth',horizontal?[Math.abs(a.x-b.x),.8,.38]:[.38,.8,Math.abs(a.y-b.y)],at((a.x+b.x)/2,(a.y+b.y)/2,-.18),iron,shell);
  }
  const transit=parent('door thresholds and enclosed service passages');
  const corridor=PORTALS.find(p=>p.id==='security-theatre')!;
  const left=zone('security').rect.x+zone('security').rect.w,right=zone('theatre').rect.x;
  for(const y of [corridor.start.y,corridor.start.y+corridor.width]){
    box('corridor boundary',[right-left,.8,.32],at((left+right)/2,y,.4),green,transit);
    pipe('corridor handrail',[at(left,y,1.1),at(right,y,1.1)],.07,brass,transit);
    for(let x=left+2;x<right;x+=6){box('corridor rail post',[.12,1.1,.12],at(x,y,.55),iron,transit);box('corridor marker',[.55,.04,.2],at(x,y+(y===corridor.start.y?.3:-.3),.07),amber,transit);}
  }
  stencil('SECURITY  /  THEATRE','EAST PASSAGE', (left+right)/2,corridor.start.y+4,34,2.2,.04,transit);
  for(const p of PORTALS){const a=zone(p.a).rect,b=zone(p.b).rect,horizontal=p.start.x!==p.end.x;
    const x=horizontal?a.x+a.w:p.start.x+p.width/2,y=horizontal?p.start.y+p.width/2:a.y+a.h;
    if(horizontal&&b.x>a.x+a.w)box('enclosed passage floor',[b.x-a.x-a.w,.3,p.width],at((a.x+a.w+b.x)/2,y,-.15),floorMat,transit);
    if(!horizontal&&b.y>a.y+a.h)box('enclosed passage floor',[p.width,.3,b.y-a.y-a.h],at(x,(a.y+a.h+b.y)/2,-.15),floorMat,transit);
    for(const side of [-1,1])box('door pilaster',[.45,4.8,.45],at(x+(horizontal?0:side*p.width/2),y+(horizontal?side*p.width/2:0),2.4),green,transit,true);
    box('door cornice',horizontal?[.55,.45,p.width+.6]:[p.width+.6,.45,.55],at(x,y,4.8),brass,transit);
    box('door indicator',horizontal?[.08,.14,1]:[1,.14,.08],at(x-(horizontal?.3:0),y+(horizontal?0:.3),4.85),portalOpen(p,INITIAL_UNLOCKED)?amber:quiet,transit);
    if(!portalOpen(p,INITIAL_UNLOCKED)){const shutter=parent('sealed shutter '+p.id);shutters.push(shutter);for(let i=0;i<14;i++)box('steel shutter slat',horizontal?[.15,.31,p.width-.3]:[p.width-.3,.31,.15],at(x,y,.2+i*.32),dark,shutter);}
    for(let i=0;i<p.width*3;i++)box('door hazard marking',horizontal?[.6,.016,.13]:[.13,.016,.6],at(x+(horizontal?0:-p.width/2+.2+i*.33),y+(horizontal?-p.width/2+.2+i*.33:0),.03),brass,transit);
  }
  const support=parent('support equipment');
  // Human-scale support stations occupy only a small part of each service hall.
  box('reception counter',[5,1.2,1.7],at(66,97,.6),green,support,true);box('countertop',[5.2,.12,1.9],at(66,97,1.27),brass,support);
  stencil('LOOPFORGE','AI BRAIN FACTORY',68,104,13,3.4,.04,support);
  for(let i=0;i<8;i++){const x=58+i*2.7;box('charging dock',[1.25,2.6,.75],at(x,113,1.3),green,support);box('charging contacts',[.4,.7,.1],at(x,112.55,1.5),brass,support);pipe('charging lead',[at(x+.3,112.5,1.7),at(x+.7,112.3,.9),at(x+.65,112.4,.1)],.04,copper,support);}
  for(let i=0;i<3;i++){const x=92+i*2.8;box('dispatch desk',[2,1.1,1.35],at(x,102,.55),green,support);for(let j=0;j<6;j++)box('dispatch files',[.65,.2,.5],at(x+(j%2)*.7-.35,102.1,1.25+Math.floor(j/2)*.23),brass,support);}
  for(let x=246;x<261;x+=3.2)for(let y=145;y<163;y+=5){box('loading pallet',[2,.18,3],at(x,y,.09),iron,support);box('packed units',[1.65,1.6,2.5],at(x,y,.98),green,support);for(const dx of [-.65,.65])box('shipping strap',[.1,1.66,2.6],at(x+dx,y,.97),brass,support);}
  return {roots,focus(id:ZoneId|"wide"){
    // Cut away a foreground neighbour's north wall, never its floor or admission.
    // A tall Forge wall must not hide Security when inspecting its checkpoint.
    const focused=id==="wide"?null:zone(id).rect;
    for(const [other,n] of northWalls){const r=zone(other).rect;n.setEnabled(!focused||!(r.y>=focused.y+focused.h/2&&r.x<focused.x+focused.w&&focused.x<r.x+r.w));}
  },study(enabled:boolean){for(const n of [...covers,...shutters])n.setEnabled(!enabled);},center(id:ZoneId){const r=zone(id).rect;return new Vector3(...at(r.x+r.w/2,r.y+r.h/2,1.7));},size:FLOOR_SIZE};
}
