import type {Scene} from './wire';
import type {ArtView,Skin} from './skin';
import geometry from '../intro/geometry.json';
import {approachZone,type Room,stations} from './contract';
import atlas from '../../../public/loopforge-intro/sprites.json';
import floorPack from '../../../public/loopforge-design/floor-correction/v1/manifest.json';
import {drawRoomMaterial} from '../room-material';
import introSprites from './intro-sprites.json';

type Images = Record<string,CanvasImageSource>;
declare global { interface Window { floorImages?: Record<string,string> } }
const floorRoot = '../loopforge-design/floor-correction/v1/';
let loading: Promise<Images> | undefined;

export function loadArt(root='..'): Promise<Images> {
  if (!loading) {
    const images: Images = {};
    const sources = introSprites.map(name => [name, root+'/loopforge-intro/' + name + '.webp']);
    for (const {material, room} of Object.values(floorPack.rooms)) {
      for (const {file} of [material, room]) sources.push([file, root+floorRoot.slice(2) + file]);
    }
    loading = Promise.all(sources.map(async ([name, url]) => {
      const image = new Image();
      image.src = window.floorImages?.[name] ?? url;
      await image.decode();
      images[name] = image;
    })).then(() => images);
  }
  return loading;
}
export function drawBidPortrait(canvas:HTMLCanvasElement,lead:'LIMEN'|'STILETTO',images:Images){
  const key=lead==='LIMEN'?'char-limen-check':'char-stiletto-check';
  const ctx=canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled=false;
  // An upper-body crop of the first calibrated frame fits the pack's aperture.
  const [x,y]=lead==='LIMEN'?[12,0]:[68,52];
  ctx.drawImage(images[key],x,y,36,35,0,0,36,35);
}
export const registerDesk=[123.6,132] as const;
export function floorView(w:number,h:number,room:Room,approach=false,crew:Scene['agents']=[],focusX?:number){
  const sec=room==='security';
  let scale=Math.min(sec?50:43,w/(sec?11.4:21.8),h/(sec?8.5:6.8));
  let center=sec?127.15:127.4,cy=sec?(approach?127.2:129):144.35;
  if(sec&&approach&&!crew.length){
    // Hold the north edge at the entry to the rail. The incoming crew crosses
    // this edge and the south edge includes LIMEN's boom on both screen sizes.
    scale=Math.min(scale,h/(.67*15.1));
    cy=121.5+.58*h/(scale*.67);
  }
  if(sec&&crew.length){
    const xs=crew.map(a=>a.x/1000),ys=crew.map(a=>a.y/1000);
    const left=Math.min(...xs),right=Math.max(...xs),front=Math.min(...ys),back=Math.max(...ys);
    center=(left+right)/2;cy=(front+back)/2-.65;
    scale=Math.min(48,w/Math.max(13,right-left+4),h/(.67*(back-front+7)));
    // Begin on the empty staff door, then follow once the crew catches up.
    cy=Math.min(cy,140.65-.42*h/(scale*.67));
  }
  if(!sec&&focusX!==undefined&&w<=780){
    center=focusX;
    scale=Math.min(50,w/8.0,h/3.65);
    cy=144.9;
  }
  const xy=(x:number,y:number)=>[w/2+(x-center)*scale,h*.58+(y-cy)*scale*.67];
  return {sec,scale,xy};
}
// Retain one raster per room. A resize or camera change replaces that room's raster.
const backdrops = new Map<Room, {key: string; canvas: HTMLCanvasElement}>();
function floorBackdrop(room: Room, w: number, h: number, view: ReturnType<typeof floorView>, images: Images) {
  const {material, room: detail} = floorPack.rooms[room];
  const {xy} = view;
  const [ox, oy] = material.originM;
  const [dx, dy] = material.extentM;
  const [left, top] = xy(ox, oy);
  const [right, bottom] = xy(ox + dx, oy + dy);
  const key = [floorPack.version, w, h, left, top, right, bottom].join('|');
  const cached = backdrops.get(room);
  if (cached?.key === key) return cached.canvas;

  const canvas = cached?.canvas ?? document.createElement('canvas');
  if(canvas.width!==w)canvas.width=w;
  if(canvas.height!==h)canvas.height=h;
  const base = canvas.getContext('2d')!;
  base.imageSmoothingEnabled = false;
  base.globalCompositeOperation = 'source-over';
  base.globalAlpha = 1;
  drawRoomMaterial(base,w,h,room,xy,images);
  backdrops.set(room, {key, canvas});
  return canvas;
}
// The opening camera follows the moving group across the same north-up floor
// as Day One. The visible walls have gaps at the actual staff portals.
function approachFloor(ctx:CanvasRenderingContext2D,w:number,h:number,camera:ReturnType<typeof floorView>,images:Images){
  const {scale,xy}=camera;
  const tile=images['tile-security'],tw=4*scale,th=tw*.67,[ox,oy]=xy(0,0);
  for(let x=((ox%tw)+tw)%tw-tw;x<w;x+=tw)
    for(let y=((oy%th)+th)%th-th;y<h;y+=th)
      ctx.drawImage(tile,Math.floor(x),Math.floor(y),Math.ceil(tw)+1,Math.ceil(th)+1);
  const rect=(x:number,y:number,dx:number,dy:number,color:string)=>{
    const [px,py]=xy(x,y);ctx.fillStyle=color;ctx.fillRect(px,py,dx*scale,dy*scale*.67);
  };
  const entrance=geometry.portals.find(p=>p.id==='staff-entrance')!;
  const [west,east]=entrance.span;
  const [,threshold]=xy(...west as [number,number]);
  ctx.fillStyle='#17202788';ctx.fillRect(0,threshold,w,Math.max(0,h-threshold));
  const security=geometry.zones.find(z=>z.id==='security')!;
  if(xy(security.rect.x,0)[0]<w){
    ctx.save();ctx.beginPath();
    security.polygon.forEach(([x,y],i)=>{const [px,py]=xy(x,y);if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);});
    ctx.closePath();ctx.clip();ctx.drawImage(floorBackdrop('security',w,h,camera,images),0,0);ctx.restore();
  }
  for(const r of geometry.walls){
    rect(r.x,r.y-.24,Math.max(r.w,.17),Math.max(r.h,.17)+.30,'#283333');
    rect(r.x,r.y-.30,Math.max(r.w,.17),Math.max(r.h,.17),'#8c8e80');
  }
  for(const key of ['L2','L3','D1','D2','D3'] as const)for(const r of geometry.roomObjects[key]){
    rect(r.x,r.y-.55,r.w,r.h+.55,'#344043');rect(r.x,r.y-.55,r.w,r.h,'#777d72');
  }
  rect(west[0],west[1]-.15,east[0]-west[0],.3,'#b6aa88');
  for(const [x,y] of entrance.span){
    rect(x-.22,y-.48,.44,.76,'#424e4c');rect(x-.22,y-.53,.44,.24,'#dfcba1');
  }
}
export function paint(ctx:CanvasRenderingContext2D,w:number,h:number,scene:Scene,room:Room,tick:number,images:Images,skin:Skin,view:ArtView,operation?:{stroke:number;deskCut:boolean;focusStation?:number;opening?:boolean}){
  const tracking=room==='security'&&scene.world.stage==='walk'&&!operation?.deskCut;
  const crew=tracking?scene.agents.filter(a=>a.duty==='walking'):[];
  const approachingDesk=crew.length>0&&crew.every(a=>a.room==='security');
  // Use the same desk frame across the splice and greeting. Include LIMEN and
  // the east aisle where STILETTO comes alongside the queue.
  const latest=view.speeches.at(-1);
  const focusX=operation?.focusStation===undefined?undefined:
    operation.opening?(latest?latest.at[0]/1000:geometry.stations[3].x):
    geometry.stations[operation.focusStation].x;
  const camera = floorView(w,h,room,tracking||['welcome','posting','queue'].includes(scene.world.stage),approachingDesk?[]:crew,focusX);
  const {sec,scale,xy} = camera;
  ctx.imageSmoothingEnabled=false;
  if(tracking&&!approachingDesk)approachFloor(ctx,w,h,camera,images);
  else ctx.drawImage(floorBackdrop(room, w, h, camera, images), 0, 0);
  const sprites=atlas.sheets as Record<string,number[]>;
  function sprite(key:string,n:number,x:number,y:number,k=scale/64){
    const im=images[key];if(!im)return;
    const [sw,sh,cols,px,py]=sprites[key];
    ctx.drawImage(im,n%cols*sw,Math.floor(n/cols)*sh,sw,sh,Math.round(x-px*k),Math.round(y-py*k),Math.round(sw*k),Math.round(sh*k));
  }
  function tag(text:string,x:number,y:number,ink='#e8e1c9',bg='#17292a'){
    ctx.font='bold 11px monospace';const tw=ctx.measureText(text).width+8;const left=Math.max(1,Math.min(w-tw-1,x-tw/2));
    ctx.fillStyle=bg;ctx.fillRect(left,y-11,tw,14);ctx.fillStyle=ink;ctx.textAlign='left';ctx.fillText(text,left+4,y);
  }
  const layers:{y:number;draw:()=>void}[]=[];
  const anchors=new Map<string,number[]>();
  if(sec){
    const [x0,y0]=xy(123.25,122.8),[x1,y1]=xy(130.25,127.2);
    ctx.strokeStyle='#729193';ctx.lineWidth=2;for(const x of [x0,x1]){ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y1);ctx.stroke();}
    for(const [cx,cy] of [registerDesk,[131.6,131.9]]){
      const [x,y]=xy(cx,cy);layers.push({y:cy-.7,draw:()=>sprite('desk-back',0,x,y)},{y:cy,draw:()=>sprite('desk-front',0,x,y)});
    }
    const [gx,gy]=xy(124.9,134);
    layers.push({y:134,draw:()=>{sprite('boom',scene.world.passageGateMm===undefined?(view.gate==='fl-gate-released'?0:24):Math.round(24*scene.world.passageGateMm/(geometry.gate.length*1000)),gx,gy);if(view.gate)skin.world(ctx,view.gate,gx,gy,scale);}});
  }else{
    const [x,y]=xy(118,145),[x2]=xy(135.5,145);
    ctx.fillStyle='#292f2d';ctx.fillRect(x,y,x2-x,scale*1.6);
    for(let i=0;i<4;i++){
      const [cx,yy]=xy(119.7+i*4,145.7),span=scale*2;
      if(i===3){
        // Day One's calibrated rear and grip share a registration point; the
        // operator at the approved Forge control belongs between their depths.
        const [px,root]=xy(132,geometry.stations[i].y);
        const registered=root+(420-126)*scale/64;
        layers.push({y:144.38,draw:()=>sprite('press-back',operation?6-Math.round(6*Math.sin(Math.PI*operation.stroke)):6,px,registered)},
          {y:144.48,draw:()=>sprite('press-front',0,px,registered)});
        if(operation)layers.push({y:144.47,draw:()=>{
          const [tx,ty]=xy(131.92,144.48);
          ctx.strokeStyle='#e1b975';ctx.lineWidth=Math.max(2,scale*.075);
          ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(tx+scale*.38,ty-(operation.stroke?0:scale*.14));ctx.stroke();
        }});
        continue;
      }
      layers.push({y:146,draw:()=>{
        ctx.fillStyle=['#716944','#3a6268','#53636a'][i];ctx.fillRect(cx-span*.65,yy,span*1.3,span*.53);
        ctx.fillStyle='#25302d';ctx.fillRect(cx-span*.65,yy+span*.53,span*1.3,span*.18);

      }});
    }
    for (const [i,post] of view.posts.entries()) {
      const station=geometry.stations[i], [x,y]=xy(station.x,station.y);
      const hand=view.handoffs[i];
      layers.push({y:station.y+.01,draw:()=>{
        skin.world(ctx,post.asset,x+15*scale/64,y-9*scale/64,scale);
        if(hand.asset)skin.world(ctx,hand.asset,x-23*scale/64,y-12*scale/64,scale);
      }});
    }
    for(const [sx,sy] of geometry.contact.outputSlots){
      const [x,ground]=xy(sx,sy),y=ground-.72*scale;
      const filled=view.rack.items.some((p:{at:number[]})=>p.at[0]===Math.round(sx*1000)&&p.at[1]===Math.round(sy*1000));
      layers.push({y:sy,draw:()=>{
        skin.world(ctx,'fl-rack-cradle',x,y,scale);
        if(filled)skin.world(ctx,'fl-cortex-finished',x,y,scale);
        skin.world(ctx,'fl-rack-lip',x,y,scale);
      }});
    }
    for(const item of scene.items){
      if(item.status==='rack')continue;
      const [x,ground]=xy(item.at[0]/1000,item.at[1]/1000),y=ground-.72*scale;
      // The pack supplies finished cortexes only. Keep the existing carrier for WIP.
      layers.push({y:item.at[1]/1000+.02,draw:()=>{
        ctx.fillStyle='#292a30';ctx.fillRect(x-5,y-6,11,8);
        ctx.fillStyle='#e7ba8a';ctx.fillRect(x-4,y-7,8,5);
        ctx.fillStyle='#a15f70';ctx.fillRect(x-2,y-6,4,3);
      }});
    }
  }
  const recentChoices=new Map(scene.events.filter(e=>e.kind==='worker.choice'&&tick-e.tick<90).map(e=>[e.actor,e.text]));
  const returned=view.returnedOriginal.at(-1);
  for(const a of scene.agents){
    if(a.id==='STILETTO' && a.duty==='outside')continue;
    if((a.room!==room&&!(tracking&&approachZone(a.room)))||a.duty==='detained')continue;
    const [x,y]=xy(a.x/1000,a.y/1000);
    const direction=tracking&&a.facing==='N'?'N':'S';
    const sup=a.id===a.id.toUpperCase(),key=sup?'char-'+a.id.toLowerCase()+'-check':a.id==='max'?'char-max-walk-'+direction:a.moving?'char-bob-walk-'+direction:sec?'bob-security':'bob-forge';
    const k=scale/64,top=y-sprites[key][4]*k;
    if(x< -scale||x>w+scale||y<0||top>h)continue;
    anchors.set(a.id,[x,top]);
    layers.push({y:a.y/1000,draw:()=>{
      ctx.fillStyle='#07141466';ctx.beginPath();ctx.ellipse(x,y,scale*.38,scale*.14,0,0,Math.PI*2);ctx.fill();
      const march=a.id==='STILETTO'&&a.moving?Math.abs(Math.sin(Math.PI*a.walked/620))*scale*.045:0;
      sprite(key,!sup&&a.moving?Math.floor(a.walked/105)%8:0,x,y-march,k);
      if(a.id==='bob' && scene.world.pass?.day===scene.world.day)
        skin.world(ctx,scene.world.pass.valid?'sec-pass-issued-world':'sec-pass-expired-world',x+scale*.23,y-scale*.5,scale);
      if(a.id==='bob' && returned && tick-returned.tick<58)skin.world(ctx,'sec-id-bob-world',x+scale*.23,y-scale*.5,scale);
      const act=[...scene.events].reverse().find(e=>e.actor===a.id&&e.kind==='gesture.seen'&&['hand.return','demonstrated.open.palm'].includes(e.text)&&tick-e.tick<55);
      const reaction=[...scene.events].reverse().find(e=>e.actor===a.id&&e.kind==='gesture.seen'&&/^\p{Extended_Pictographic}/u.test(e.text)&&tick-e.tick<38);
      if(reaction)tag(a.id+' '+reaction.text,x,top-6);
      if(act){
        const hand=x+scale*.22,level=y-scale*.56,reach=Math.min(1,(tick-act.tick)/12);
        ctx.fillStyle='#cb9c75';ctx.fillRect(hand,level,scale*.32,3);
        if(act.text==='hand.return'){
          const edge=hand+(1-reach)*scale*.42;
          ctx.fillStyle='#263534';ctx.fillRect(edge-1,level-4,10,7);
          ctx.fillStyle='#f5dfae';ctx.fillRect(edge,level-3,8,5);
          ctx.fillStyle='#5a6359';ctx.fillRect(edge+1,level-2,2,3);
        }
      }
      const contact=[...scene.events].reverse().find(e=>e.actor===a.id&&e.kind==='worker.approaches'&&tick-e.tick<115);
      if(contact)tag(a.id+' → '+contact.subject,x,y+13);
      const choice=recentChoices.get(a.id);
      if(choice) tag(a.id+' · '+(choice==='go'?'goes':'stays'),x,y+12);
      else if(!contact&&((sec&&['welcome','posting','queue'].includes(scene.world.stage)&&['ed','gus'].includes(a.id))||a.id==='bob'||a.id==='LIMEN'||a.id==='STILETTO'||a.id===scene.world.called||(!sec&&scene.world.coverage.includes(a.id))))
        tag(a.id,x,y+12,sup?'#ffd395':'#e8f1eb');
    }});
  }
  layers.sort((a,b)=>a.y-b.y).forEach(l=>l.draw());
  if(!sec)for(let i=0;i<4;i++){const [x,y]=xy(119.7+i*4,147.5);if(x>=8&&x<=w-8)tag(stations[i],x,Math.min(h-4,y+18));}
  // Simultaneous voices share the reading interval. Stack their plates in event
  // order and paint all tails first so none can strike through another line.
  const group = view.speeches.length > 1;
  const bodyFont = w < 580 ? '600 15px sans-serif' : '600 17px sans-serif';
  const lineHeight = w < 580 ? 19 : 21;
  const limit = Math.min(310, w - 42);
  let stackTop = 5;
  const hand = sec && scene.events.findLast(e => e.kind === 'gesture.seen' &&
    e.text === 'hand.return' && tick - e.tick < 55);
  const bubbles = view.speeches.map(ev => {
    const [speakerX, speakerY] = anchors.get(ev.speaker) ?? xy(ev.at[0]/1000, ev.at[1]/1000);
    const ax = Math.max(2, Math.min(w-2, speakerX)), ay = Math.max(2, Math.min(h-2, speakerY));
    ctx.font = bodyFont;
    const lines: string[] = [];
    let line = '';
    for (const word of ev.text.split(/\s+/)) {
      const next = line ? line + ' ' + word : word;
      if (line && ctx.measureText(next).width > limit) {lines.push(line); line = word;}
      else line = next;
    }
    lines.push(line);
    const bw = Math.max(84, ...lines.map(l => ctx.measureText(l).width + 24));
    const bh = 26 + lines.length * lineHeight;
    const x = Math.max(3, Math.min(w-bw-3, group ? (w-bw)/2 : ax-bw/2));
    let y = group ? stackTop : Math.max(3, Math.min(h-bh-4, ay-bh-12));
    if (group) stackTop += bh + 5;
    if (hand && !group) {
      const [hx, hy] = xy(hand.at[0]/1000, hand.at[1]/1000);
      if (x < hx+30 && x+bw > hx-30 && y < hy+11 && y+bh > hy-46)
        y = hy-50-bh >= 3 ? hy-50-bh : Math.min(h-bh-4, hy+15);
    }
    return {ev, ax, ay, x, y, bw, bh, lines};
  });
  for (const {ax, ay, x, y, bw, bh} of bubbles) {
    const tail = Math.max(x+8, Math.min(x+bw-14, ax));
    ctx.strokeStyle='#d7c7a8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tail,y+bh-2);ctx.lineTo(ax,ay);ctx.stroke();
    skin.draw(ctx,ax<tail?'fl-tail-left':'fl-tail-right',tail-5,y+bh-3);
  }
  for (const {ev, x, y, bw, bh, lines} of bubbles) {
    skin.draw(ctx,ev.asset,x,y,{width:bw,height:bh});
    ctx.textAlign='left';ctx.font='bold 12px monospace';
    skin.draw(ctx,ev.nameplate,x+7,y+3,{width:ctx.measureText(ev.speaker).width+13,height:17});
    ctx.fillStyle='#fff1d3';ctx.fillText(ev.speaker,x+13,y+16);
    ctx.fillStyle='#182626';ctx.font=bodyFont;
    lines.forEach((line,i)=>ctx.fillText(line,x+10,y+36+i*lineHeight));
  }
}
