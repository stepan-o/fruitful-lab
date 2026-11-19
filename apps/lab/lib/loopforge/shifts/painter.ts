import type {Scene} from './wire';
import {type Room,stations} from './contract';
import atlas from '../../../public/loopforge-intro/sprites.json';
type Images = Record<string,CanvasImageSource>;
export const assets=['tile-security','tile-forge','desk-back','desk-front','press-back','press-front','char-limen-check','char-stiletto-check','char-bob-walk-S','char-max-walk-S','bob-security','bob-forge','boom'] as const;
export async function loadArt():Promise<Images>{
  const images:Images={}; await Promise.all(assets.map(async name=>{
    const im=new Image();im.src='../loopforge-intro/'+name+'.webp';await im.decode();images[name]=im;
  }));return images;
}
export function paint(ctx:CanvasRenderingContext2D,w:number,h:number,scene:Scene,room:Room,tick:number,images:Images){
  const sec=room==='security',scale=Math.min(sec?50:43,w/(sec?11.4:21.8),h/(sec?8.5:6.8));
  const center=sec?127.15:127.4,cy=sec?129:144.35;
  const xy=(x:number,y:number)=>[w/2+(x-center)*scale,h*.58+(y-cy)*scale*.67];
  ctx.clearRect(0,0,w,h);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle=sec?'#213d42':'#493522';ctx.fillRect(0,0,w,h);
  const tile=images[sec?'tile-security':'tile-forge'];
  const tw=Math.round(4*scale),th=Math.round(tw*.67);
  if(tile)for(let x=0;x<w;x+=tw)for(let y=0;y<h;y+=th)ctx.drawImage(tile,x,y,tw,th);
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
    for(const [cx,cy] of [[123.6,132],[131.6,131.9]]){
      const [x,y]=xy(cx,cy);layers.push({y:cy-.7,draw:()=>sprite('desk-back',0,x,y)},{y:cy,draw:()=>sprite('desk-front',0,x,y)});
    }
    const [gx,gy]=xy(124.9,134);
    layers.push({y:134,draw:()=>{sprite('boom',scene.world.status==='open'?0:24,gx,gy);}});
  }else{
    const [x,y]=xy(118,145),[x2]=xy(135.5,145);
    ctx.fillStyle='#292f2d';ctx.fillRect(x,y,x2-x,scale*1.6);
    for(let i=0;i<4;i++){
      const [cx,yy]=xy(119.7+i*4,145.7),span=scale*2;
      layers.push({y:146,draw:()=>{
        if(i===3){sprite('press-back',0,cx,yy+scale*1.55,scale/96);return;}
        ctx.fillStyle=['#716944','#3a6268','#53636a'][i];ctx.fillRect(cx-span*.65,yy,span*1.3,span*.53);
        ctx.fillStyle='#25302d';ctx.fillRect(cx-span*.65,yy+span*.53,span*1.3,span*.18);
        ctx.fillStyle=scene.world.coverage[i]?'#b8dec3':'#b89678';ctx.fillRect(cx-span*.45,yy+4,Math.max(3,scale*.2),4);
      }});
    }
    scene.items.forEach(p=>{const [x,y]=xy(p.at[0]/1000,p.at[1]/1000);layers.push({y:p.at[1]/1000+.02,draw:()=>{ctx.fillStyle='#2b2a32';ctx.fillRect(x-5,y-6,11,8);ctx.fillStyle='#e7ba8a';ctx.fillRect(x-4,y-7,8,5);ctx.fillStyle='#a15f70';ctx.fillRect(x-2,y-6,4,3);}});});
  }
  for(const a of scene.agents){
    if(a.room!==room||a.duty==='detained')continue;
    const [x,y]=xy(a.x/1000,a.y/1000);if(x< -12||x>w+12||y<0||y>h+20)continue;
    const sup=a.id===a.id.toUpperCase(),key=sup?'char-'+a.id.toLowerCase()+'-check':a.id==='max'?'char-max-walk-S':a.moving?'char-bob-walk-S':sec?'bob-security':'bob-forge';
    const k=scale/64,top=y-sprites[key][4]*k;
    anchors.set(a.id,[x,top]);
    layers.push({y:a.y/1000,draw:()=>{
      ctx.fillStyle='#07141466';ctx.beginPath();ctx.ellipse(x,y,scale*.38,scale*.14,0,0,Math.PI*2);ctx.fill();
      sprite(key,!sup&&a.moving?Math.floor(a.walked/105)%8:0,x,y,k);
      if(a.id==='bob'||a.id==='LIMEN'||a.id==='STILETTO'||a.id===scene.world.called||(!sec&&scene.world.coverage.includes(a.id)))
        tag(a.id,x,y+12,sup?'#ffd395':'#e8f1eb');
    }});
  }
  layers.sort((a,b)=>a.y-b.y).forEach(l=>l.draw());
  if(!sec)for(let i=0;i<4;i++){const [x,y]=xy(119.7+i*4,147.5);tag(stations[i],x,Math.min(h-4,y+18));}
  const bubbles=scene.events.filter(e=>e.room===room&&(e.kind==='speech.delivered'||e.kind==='endorsement.public')&&tick-e.tick<58).filter((e,i,list)=>!list.slice(i+1).some(n=>n.actor===e.actor)).slice(-2);
  let occupied=0;
  for(const ev of bubbles){
    const [ax,ay]=anchors.get(ev.actor)??xy(ev.at[0]/1000,ev.at[1]/1000);
    ctx.font='600 14px sans-serif';const limit=Math.min(244,w*.78),words=ev.text.split(' '),lines:string[]=[];
    let line='';for(const word of words){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>limit-16){lines.push(line);line=word;}else line=next;}lines.push(line);
    const bw=Math.max(58,...lines.map(l=>ctx.measureText(l).width+16)),bh=22+lines.length*16;
    const x=Math.max(4,Math.min(w-bw-4,ax-bw/2)),y=Math.max(4,occupied,Math.min(h-bh-4,ay-bh-12));
    occupied=y+bh+4;
    ctx.strokeStyle='#efd6a3';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+bw/2,y+bh);ctx.lineTo(ax,ay-2);ctx.stroke();
    ctx.fillStyle='#eee8d5';ctx.fillRect(x,y,bw,bh);ctx.fillStyle='#72491c';ctx.font='bold 12px monospace';ctx.textAlign='left';ctx.fillText(ev.actor,x+7,y+14);
    ctx.fillStyle='#162626';ctx.font='600 14px sans-serif';lines.forEach((l,i)=>ctx.fillText(l,x+7,y+32+i*16));
  }
}
