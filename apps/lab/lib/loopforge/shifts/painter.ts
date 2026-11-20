import type {Scene} from './wire';
import type {ArtView,Skin} from './skin';
import geometry from '../intro/geometry.json';
import {type Room,stations} from './contract';
import atlas from '../../../public/loopforge-intro/sprites.json';
import floorPack from '../../../public/loopforge-design/floor-correction/v1/manifest.json';
import introSprites from './intro-sprites.json';

type Images = Record<string,CanvasImageSource>;
declare global { interface Window { floorImages?: Record<string,string> } }
const floorRoot = '../loopforge-design/floor-correction/v1/';
let loading: Promise<Images> | undefined;

export function loadArt(): Promise<Images> {
  if (!loading) {
    const images: Images = {};
    const sources = introSprites.map(name => [name, '../loopforge-intro/' + name + '.webp']);
    for (const {material, room} of Object.values(floorPack.rooms)) {
      for (const {file} of [material, room]) sources.push([file, floorRoot + file]);
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
export function floorView(w:number,h:number,room:Room,approach=false){
  const sec=room==='security',scale=Math.min(sec?50:43,w/(sec?11.4:21.8),h/(sec?8.5:6.8));
  const center=sec?127.15:127.4,cy=sec?(approach?125.1:129):144.35;
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

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const base = canvas.getContext('2d')!;
  base.imageSmoothingEnabled = false;
  base.globalCompositeOperation = 'source-over';
  base.globalAlpha = 1;
  // The canvas bounds clip partial cells and the single room layer to the camera.
  function draw(file: string, x: number, y: number, width: number, height: number) {
    const [x0, y0] = xy(x, y).map(Math.round);
    const [x1, y1] = xy(x + width, y + height).map(Math.round);
    base.drawImage(images[file], x0, y0, x1 - x0, y1 - y0);
  }
  const tileW = right - left, tileH = bottom - top;
  const cols = Math.ceil((w - left) / tileW), rows = Math.ceil((h - top) / tileH);
  for (let row = Math.floor(-top / tileH); row < rows; row++) {
    for (let col = Math.floor(-left / tileW); col < cols; col++) {
      draw(material.file, ox + col * dx, oy + row * dy, dx, dy);
    }
  }
  draw(detail.file, detail.originM[0], detail.originM[1], detail.extentM[0], detail.extentM[1]);
  backdrops.set(room, {key, canvas});
  return canvas;
}
export function paint(ctx:CanvasRenderingContext2D,w:number,h:number,scene:Scene,room:Room,tick:number,images:Images,skin:Skin,view:ArtView){
  const camera = floorView(w,h,room,scene.world.stage==='walk'||scene.world.stage==='welcome');
  const {sec,scale,xy} = camera;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(floorBackdrop(room, w, h, camera, images), 0, 0);
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
    layers.push({y:134,draw:()=>{sprite('boom',view.gate==='fl-gate-held'?0:24,gx,gy);if(view.gate)skin.world(ctx,view.gate,gx,gy,scale);}});
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
        layers.push({y:144.38,draw:()=>sprite('press-back',6,px,registered)},
          {y:144.48,draw:()=>sprite('press-front',0,px,registered)});
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
    if(a.room!==room||a.duty==='detained')continue;
    const [x,y]=xy(a.x/1000,a.y/1000);if(x< -12||x>w+12||y<0||y>h+20)continue;
    const sup=a.id===a.id.toUpperCase(),key=sup?'char-'+a.id.toLowerCase()+'-check':a.id==='max'?'char-max-walk-S':a.moving?'char-bob-walk-S':sec?'bob-security':'bob-forge';
    const k=scale/64,top=y-sprites[key][4]*k;
    anchors.set(a.id,[x,top]);
    layers.push({y:a.y/1000,draw:()=>{
      ctx.fillStyle='#07141466';ctx.beginPath();ctx.ellipse(x,y,scale*.38,scale*.14,0,0,Math.PI*2);ctx.fill();
      sprite(key,!sup&&a.moving?Math.floor(a.walked/105)%8:0,x,y,k);
      if(a.id==='bob' && scene.world.pass?.day===scene.world.day)
        skin.world(ctx,scene.world.pass.valid?'sec-pass-issued-world':'sec-pass-expired-world',x+scale*.23,y-scale*.5,scale);
      if(a.id==='bob' && returned && tick-returned.tick<58)skin.world(ctx,'sec-id-bob-world',x+scale*.23,y-scale*.5,scale);
      const act=[...scene.events].reverse().find(e=>e.actor===a.id&&e.kind==='gesture.seen'&&['hand.return','demonstrated.open.palm'].includes(e.text)&&tick-e.tick<55);
      const reaction=[...scene.events].reverse().find(e=>e.actor===a.id&&e.kind==='gesture.seen'&&/^\p{Extended_Pictographic}/u.test(e.text)&&tick-e.tick<38);
      if(reaction)tag(a.id+' '+reaction.text,x,top-6);
      if(act){ctx.fillStyle='#f3ebcf';ctx.fillRect(x+scale*.18,y-scale*.52,scale*.22,scale*.14);}
      const contact=[...scene.events].reverse().find(e=>e.actor===a.id&&e.kind==='worker.approaches'&&tick-e.tick<115);
      if(contact)tag(a.id+' → '+contact.subject,x,y+13);
      const choice=recentChoices.get(a.id);
      if(choice) tag(a.id+' · '+(choice==='go'?'goes':'stays'),x,y+12);
      else if(!contact&&(a.id==='bob'||a.id==='LIMEN'||a.id==='STILETTO'||a.id===scene.world.called||(!sec&&scene.world.coverage.includes(a.id))))
        tag(a.id,x,y+12,sup?'#ffd395':'#e8f1eb');
    }});
  }
  layers.sort((a,b)=>a.y-b.y).forEach(l=>l.draw());
  if(!sec)for(let i=0;i<4;i++){const [x,y]=xy(119.7+i*4,147.5);tag(stations[i],x,Math.min(h-4,y+18));}
  const occupied:{x:number;y:number;w:number;h:number}[]=[];
  for(const ev of view.speeches){
    const [ax,ay]=anchors.get(ev.speaker)??xy(ev.at[0]/1000,ev.at[1]/1000);
    if(ax<0||ax>w||ay<0||ay>h)continue;
    const bodyFont=w<580?'600 14px sans-serif':'600 16px sans-serif';
    ctx.font=bodyFont;
    const limit=Math.min(230,w*.74),lines:string[]=[];
    let line='';
    for(const word of ev.text.split(' ')){
      const next=line?line+' '+word:word;
      if(line&&ctx.measureText(next).width>limit){lines.push(line);line=word;}else line=next;
    }
    lines.push(line);
    const bw=Math.max(70,...lines.map(l=>ctx.measureText(l).width+24)),bh=26+lines.length*17;
    const x=Math.max(3,Math.min(w-bw-3,ax-bw/2));
    const aim=Math.max(3,Math.min(h-bh-18,ay-bh-10));
    const collides=(y:number)=>occupied.some(r=>x<r.x+r.w+2&&x+bw+2>r.x&&y<r.y+r.h+2&&y+bh+2>r.y);
    const candidates=[aim,...occupied.flatMap(r=>[r.y-bh-4,r.y+r.h+4])].filter(y=>y>=3&&y+bh<=h-4&&!collides(y));
    const y=candidates.sort((a,b)=>Math.abs(a-aim)-Math.abs(b-aim))[0]??aim;
    occupied.push({x,y,w:bw,h:bh});
    const tail=Math.max(x+8,Math.min(x+bw-14,ax));
    ctx.strokeStyle='#d7c7a8';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tail,y+bh-2);ctx.lineTo(ax,ay);ctx.stroke();
    skin.draw(ctx,ax<tail?'fl-tail-left':'fl-tail-right',tail-5,y+bh-3);
    skin.draw(ctx,ev.asset,x,y,{width:bw,height:bh});
    ctx.textAlign='left';ctx.font='bold 12px monospace';
    skin.draw(ctx,ev.nameplate,x+7,y+3,{width:ctx.measureText(ev.speaker).width+13,height:17});
    ctx.fillStyle='#fff1d3';ctx.fillText(ev.speaker,x+13,y+16);
    ctx.fillStyle='#182626';ctx.font=bodyFont;
    lines.forEach((l,i)=>ctx.fillText(l,x+9,y+34+i*17));
  }
}
