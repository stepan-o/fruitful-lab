import floor from './intro/geometry.json';
import {drawQueueRail,drawRoomMaterial} from './room-material';

export type XY=[number,number];
type Rect={x:number;y:number;w:number;h:number};
type Sprite=(name:string,index:number,x:number,y:number)=>void;
type Queue=(depth:number,draw:()=>void)=>void;
type Project=(x:number,y:number,z?:number)=>XY;

export const roomCut={out:1.4,into:1.75};
export function cutOpacity(offset:number){
  return Math.max(0,Math.min(1,(offset+roomCut.out)/1.12,(roomCut.into-offset)/1.2));
}
export const floorDepth=.70;
export function factoryProjection(w:number,h:number,x:number,y:number,scale:number,model=false):Project{
  const anchor=h*(w<560?.64:.61);
  return (wx,wy,z=0)=>[w*.5+(wx-x+(model?(wy-y)*.35:0))*scale,anchor+(wy-y)*scale*(model?.58:floorDepth)-z*scale];
}
export function shotScale(w:number,h:number,spanX:number,spanY:number,close=false){
  const narrow=w<560;
  return (narrow?.81:.8)*Math.min(close?(narrow?100:120):(narrow?62:77),
    (w-65)/Math.max(2,spanX+1.6),h*.54/Math.max(2,spanY*floorDepth+2));
}
export function easeCamera(camera:{x:number;y:number;scale:number},x:number,y:number,scale:number,dt:number,instant=false){
  const blend=!camera.scale||instant?1:1-Math.exp(-Math.max(0,dt)*1.55);
  camera.x+=(x-camera.x)*blend;camera.y+=(y-camera.y)*blend;camera.scale+=(scale-camera.scale)*blend;
}

export function drawFactorySprite(ctx:CanvasRenderingContext2D,images:Record<string,CanvasImageSource>,
  sheets:Record<string,number[]>,name:string,index:number,x:number,y:number,k:number){
  const image=images[name],cell=sheets[name];if(!image||!cell)return;
  const [w,h,cols,pivotX,pivotY]=cell;
  ctx.drawImage(image,index%cols*w,Math.floor(index/cols)*h,w,h,Math.round(x-pivotX*k),Math.round(y-pivotY*k),w*k,h*k);
}

// All fixed geometry and registration points are painted here in factory metres.
// Moving workers and work signals join the same depth queue in each episode.
export function drawFactory(ctx:CanvasRenderingContext2D,w:number,h:number,project:Project,s:number,
  images:Record<string,CanvasImageSource>,sprite:Sprite,queue:Queue,pressFrame:number,gateFrame:number,world:(asset:string,x:number,y:number)=>void,iso=false){
  const polygon=(points:XY[],fill:string,stroke?:string)=>{
    ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
  };
  const footprint=(r:Rect,fill:string,z=0)=>polygon([project(r.x,r.y,z),project(r.x+r.w,r.y,z),project(r.x+r.w,r.y+r.h,z),project(r.x,r.y+r.h,z)],fill);
  function block(r:Rect,height:number,wall:string,top:string){
    const {x,y,w,h}=r;
    polygon([project(x,y+h),project(x+w,y+h),project(x+w,y+h,height),project(x,y+h,height)],wall);
    polygon([project(x+w,y),project(x+w,y+h),project(x+w,y+h,height),project(x+w,y,height)],wall);
    footprint(r,top,height);
  }
  ctx.clearRect(0,0,w,h);
  ctx.imageSmoothingEnabled=false;ctx.fillStyle='#242b2c';ctx.fillRect(0,0,w,h);
  if(!iso){
    // The approach crosses multiple rooms. Clip each fixed light layer to its
    // approved polygon, including when both sides of the gate are in frame.
    drawRoomMaterial(ctx,w,h,'security',project,images,false);
    for(const room of ['security','conveyor'] as const){
      const zone=floor.zones.find(z=>z.id===room)!;
      const corners=zone.polygon.map(([x,y])=>project(x,y));
      if(corners.every(p=>p[0]<0)||corners.every(p=>p[0]>w)||corners.every(p=>p[1]<0)||corners.every(p=>p[1]>h))continue;
      ctx.save();ctx.beginPath();
      corners.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
      drawRoomMaterial(ctx,w,h,room,project,images);ctx.restore();
    }
  }else for(const zone of floor.zones)polygon(zone.polygon.map(([x,y])=>project(x,y)),zone.id==='conveyor'?'#394046':'#34434a','#728182');
  for(const road of floor.aisles)footprint(road.rect,'rgba(224,197,144,.07)');
  for(const wall of floor.walls){
    const r={...wall,w:Math.max(.14,wall.w),h:Math.max(.14,wall.h)};block(r,.32,'#151c20','#7a796f');
  }
  for(const [id,rects] of Object.entries(floor.roomObjects))if(['L2','L3','D1','D2','D3'].includes(id))for(const r of rects)block(r,.7,'#303c3e','#72756c');
  for(const f of [...floor.fixtures,...floor.forgeHall.installations]){
    if(['intake','wash','belt','forge'].includes(f.id)||!iso&&['checks','register','west-rail','east-rail','output'].includes(f.id))continue;
    queue(f.rect.y+f.rect.h,()=>block(f.rect,.55,'#354044','#899186'));
  }
  for(const [i,station] of floor.stations.entries()){
    const [sx,sy]=project(station.x,146.9);
    if(i===3&&!iso){
      const [px]=project(132,149);
      // Machine registration uses the native 64 px/m plate for its elevated face.
      const [,rootY]=project(131.7,144.4);
      const registeredY=rootY+(420-126)*s/64;

      queue(144.38,()=>sprite('press-back',pressFrame,px,registeredY));
      queue(144.48,()=>sprite('press-front',0,px,registeredY));

    }else queue(146.9,()=>{
      block({x:station.x-1.5,y:145.1,w:3,h:2.2},.85,'#313d3e',i===0?'#70684f':i===1?'#42636a':'#606357');
      ctx.fillStyle='#e8d9b3';ctx.font='bold 11px monospace';ctx.textAlign='center';ctx.fillText(station.name,sx,sy-s);
    });
  }
  if(!iso){
    for(const rail of floor.fixtures.filter(f=>f.kind==='rail')){
      if(images.queueRail)queue(rail.rect.y+rail.rect.h,()=>drawQueueRail(ctx,images.queueRail,project,rail.rect,s));
    }
    for(const desk of floor.fixtures.filter(f=>f.kind==='desk')){
      const {x,y,w,h}=desk.rect,[px,py]=project(x+w/2,y+h);
      queue(y-.9,()=>sprite('desk-back',0,px,py));queue(y+h+.03,()=>sprite('desk-front',0,px,py));
    }
    for(const [x,y] of floor.contact.outputSlots){
      const [px,py]=project(x,y,.72);
      queue(y+.08,()=>world('fl-rack-cradle',px,py));
      queue(y+.12,()=>world('fl-rack-lip',px,py));
    }
    const [gx,gy]=project(...floor.gate.hinge as XY);
    queue(134,()=>sprite('boom',gateFrame,gx,gy));
  }
  return block;
}
