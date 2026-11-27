import {cutOpacity,drawFactory,drawFactorySprite,easeCamera,factoryProjection,roomCut,shotScale} from '../../../lib/loopforge/factory-scene';
import type {Skin as FloorSkin} from '../../../lib/loopforge/shifts/skin';
import {storyRoomCuts} from '../../../lib/loopforge/intro/story-camera';
import floor from '../../../lib/loopforge/intro/geometry.json';
import type {Actor,Frame,Utterance} from '../../../lib/loopforge/intro/protocol';

export type Art={sheets:Record<string,number[]>;checkpoint:(string|number)[][];palm:number[]};
export type Bank={art:Art;images:Record<string,CanvasImageSource>;world:FloorSkin['world']};
type XY=[number,number];
type Rect={x:number;y:number;w:number;h:number};
export type Camera={x:number;y:number;scale:number;time:number;station?:XY};
export type Skin='sprites'|'model';
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
const placeholder=new Set(['sam','jo','ed','gus','kit','lou','ben','mae']);
const crewColors:Record<string,string>={sam:'#cdb8a9',jo:'#9bb7af',ed:'#cabe8f',gus:'#a8aabc',kit:'#b5b88a',lou:'#bb9d98',ben:'#95a7af',mae:'#b49b80'};
function focus(actors:Actor[],events:Utterance[],t:number):XY[]{
  let ids=t<12.5?['max','jo','bob']:t<37?['LIMEN','bob']:t<77?['bob','STILETTO']:t<95.6?['LIMEN','max']:t<125.1?['bob']:t<140.1?['LIMEN','max','STILETTO']:t<165.4?['bob','jo','max','sam']:t<178.65?['ed','LIMEN']:['max','gus'];
  const speakers=events.map(e=>e.speaker).filter(id=>id!=='BELL');
  if(speakers.length&&!(t>=125.1&&t<=140.1))ids=speakers.length>1?speakers:[...speakers,...ids.slice(0,1)];
  if(t>=101.3&&t<=110.5)ids=['bob'];
  return actors.filter(a=>ids.includes(a.agent_id)).map(a=>[a.x/1000,a.y/1000]);
}
export function paint(ctx:CanvasRenderingContext2D,w:number,h:number,frame:Frame,t:number,bank:Bank,skin:Skin,cam:Camera,dt:number,previous?:Frame,alpha=1,story=false,reducedMotion=false,order:number|null=null){
  const {state}=frame;
  const actors=state.agents.map((a,i)=>{
    const before=previous?.state.agents[i];
    return before&&before.agent_id===a.agent_id?{...a,x:before.x+(a.x-before.x)*alpha,y:before.y+(a.y-before.y)*alpha}:a;
  });
  const station=order===null?undefined:floor.stations[order%4];
  const narrow=w<560,iso=skin==='model',flatten=iso?.58:.70;
  // Compose the conversation around its participants, independent of the active bubble.
  let subjects=focus(actors,story?[]:state.events,t);
  if(story&&t>=76.6&&t<95.3)subjects=actors.filter(a=>a.agent_id==='LIMEN').map(a=>[a.x/1000,a.y/1000]);
  if(story&&t>=165.4&&t<178.65)subjects=[[125,144],[130,140]];
  if(story&&t>=110.5&&t<130.3)subjects=actors.filter(a=>['jo','bob'].includes(a.agent_id)).map(a=>[a.x/1000,a.y/1000]);
  if(story&&t>=130.3&&t<139.7)subjects=actors.filter(a=>['LIMEN','max','STILETTO'].includes(a.agent_id)).map(a=>[a.x/1000,a.y/1000]);
  const boundary=story?storyRoomCuts.find(([at])=>t>=at-roomCut.out&&t<at+roomCut.into):undefined;
  const fade=boundary?cutOpacity(t-boundary[0]):0;
  if(station)subjects.push([station.x,station.y]);
  const xs=subjects.map(p=>p[0]),ys=subjects.map(p=>p[1]);
  let x=(Math.min(...xs)+Math.max(...xs))/2,y=(Math.min(...ys)+Math.max(...ys))/2;
  if(!Number.isFinite(x)){x=126;y=132;}
  if(t>=101.3&&t<=110.5){x+=.36;y+=.45;}
  const close=t>=101.3&&t<=110.5||t>=130.7&&t<=138.05;
  const spanX=Math.max(...xs)-Math.min(...xs),spanY=Math.max(...ys)-Math.min(...ys);
  const scale=story?shotScale(w,h,spanX,spanY,close)*(reducedMotion?1:1-.32*fade):
    Math.min(close?(narrow?100:120):(narrow?62:77),(w-65)/Math.max(2,spanX+1.6),(h*.54)/Math.max(2,spanY*flatten+2));
  if(story)easeCamera(cam,x,y,scale,dt,reducedMotion);
  else{
    const cut=Math.abs(cam.time-t)>.4||!cam.scale||t>=12.5&&cam.time<12.5||t>=178.65&&cam.time<178.65;
    const blend=cut?1:1-Math.exp(-dt*6);
    cam.x+=(x-cam.x)*blend;cam.y+=(y-cam.y)*blend;cam.scale+=(scale-cam.scale)*blend;
  }
  cam.time=t;
  const s=cam.scale,project=factoryProjection(w,h,cam.x,cam.y,s,iso);
  const sprite=(key:string,n:number,x:number,y:number,k=s/64)=>drawFactorySprite(ctx,bank.images,bank.art.sheets,key,n,x,y,k);
  const entries:{depth:number;draw:()=>void}[]=[];
  const queue=(depth:number,draw:()=>void)=>entries.push({depth,draw});
  const pressing=actors.some(a=>/^cortex-\d+-forge$/.test(a.action));
  const block=drawFactory(ctx,w,h,project,s,bank.images,sprite,queue,state.world.jammed?0:pressing?3:6,
    clamp(Math.round(24*state.world.gate_mm/(floor.gate.length*1000)),0,24),(id,x,y)=>bank.world(ctx,id,x,y,s),iso);
  if(!iso){
    for(const [i,station] of floor.stations.entries()){
      const [x,y]=project(station.x,station.y);
      const staffed=actors.some(a=>a.room==='conveyor'&&Math.hypot(a.x/1000-station.x,a.y/1000-station.y)<.85&&!a.moving&&a.agent_id!==a.agent_id.toUpperCase());
      const occupied=state.items.some(item=>item.item_id.startsWith('cortex-')&&item.stage===i&&Math.abs(item.x/1000-station.x)<.5);
      queue(i===3?144.49:146.91,()=>{
        bank.world(ctx,staffed?'fl-post-staffed':'fl-post-vacant',x+15*s/64,y-9*s/64,s);
        if(staffed&&!occupied)bank.world(ctx,'fl-handoff-ready',x-23*s/64,y-12*s/64,s);
      });
    }


  }
  const labels:{id:string;x:number;y:number;top:number}[]=[];
  for(const actor of actors){
    const id=actor.agent_id,[px,py]=project(actor.x/1000,actor.y/1000);
    if(px< -70||px>w+70||py< -50||py>h+160)continue;
    let key='char-'+id+'-check',index=0;
    const gait=Math.floor(actor.walked/775*8)%8,dir=actor.facing==='N'?'N':'S';
    const ck=bank.art.checkpoint[clamp(Math.floor((t-125.1)*20+.001),0,bank.art.checkpoint.length-1)];
    if(id==='LIMEN'||id==='STILETTO'){key='char-'+id.toLowerCase()+'-check';index=t>=125.1&&t<=140.1?Number(ck[id==='LIMEN'?0:2]):0;}
    else if(id==='bob'&&t>=101.3&&t<110.5&&(state.world.jammed||t>=108.9)){key='bob-press';index=bank.art.palm[clamp(Math.floor((t-101.3)*20+.001),0,bank.art.palm.length-1)];}
    else if(id==='max'&&t>=125.1&&t<=140.1){index=Number(ck[1]);}
    else {
      key='char-'+(placeholder.has(id)?'bob':id)+'-walk-'+dir;index=actor.moving?gait:0;
      if(!placeholder.has(id)&&(t<3.18||id==='max'&&t>=12.5&&t<14.3)){
        const approach=t<3.18;
        const amount=approach?clamp(Math.min(t/.50,(3.18-t)/.6),0,1):clamp(Math.sin((t-12.5)/1.8*Math.PI),0,1);
        key=id==='bob'?'char-bob-walking-glance-N':approach?'char-max-jaw-imitation-N':'char-max-jaw-click-S';
        index=Math.round(amount*7)*8+gait;
      }else if(id==='bob'&&!actor.moving){key='bob-'+(actor.room==='conveyor'?'forge':'security');index=0;}
    }
    const height=(bank.art.sheets[key]?.[4]??64)*s/64;
    labels.push({id,x:px,y:py,top:py-(iso||placeholder.has(id)?1.1*s:height)});
    queue(actor.y/1000,()=>{
      ctx.fillStyle='rgba(10,15,17,.35)';ctx.beginPath();ctx.ellipse(px+s*.12,py+s*.03,s*.38,s*.12,0,0,Math.PI*2);ctx.fill();
      if(iso){
        const color=crewColors[id]??(id===id.toUpperCase()?'#cbb38b':'#9aafad');
        const rect={x:actor.x/1000-.18,y:actor.y/1000-.16,w:.36,h:.32};
        block(rect,.78,'#4f585a',color);block({...rect,x:rect.x+.03,w:.3},1.02,'#65635a',color);
        ctx.fillStyle='#c4e3d0';ctx.fillRect(px-s*.1,py-s*.89,s*.2,Math.max(2,s*.04));
      }else{
        sprite(key,index,px,py);
        if(placeholder.has(id)){ctx.fillStyle=crewColors[id];ctx.fillRect(Math.round(px-s*.13),Math.round(py-s*.41),Math.max(2,Math.round(s*.18)),Math.max(2,Math.round(s*.07)));}
      }
      if(!iso&&state.items.some(it=>it.item_id==='bob:id'&&it.holder===id))
        bank.world(ctx,'sec-id-bob-world',px+14*s/64,py-44*s/64,s);
      const card=state.items.find(it=>it.item_id==='max:id'&&it.holder===id);
      if(card&&!iso){
        const registered=ck[3]===id;
        sprite('credential',0,px+(registered?Number(ck[4])-128:14)*s/64,py+(registered?Number(ck[5])-208:-44)*s/64);
      }
    });
  }
  for(const item of state.items){
    if(item.holder)continue;
    const [px,py]=project(item.x/1000,item.y/1000,item.item_id.startsWith('cortex')?.72:0);
    queue(item.y/1000+.1,()=>{
      if(!iso&&item.item_id==='bob:id'){bank.world(ctx,'sec-id-bob-world',px,py,s);return;}
      if(!iso&&item.stage===4){bank.world(ctx,'fl-cortex-finished',px,py,s);return;}
      if(item.item_id.endsWith(':id')){sprite('credential',0,px,py);return;}
      ctx.fillStyle=item.stage===4?'#d8c19e':'#aa8980';ctx.fillRect(px-s*.21,py-s*.15,s*.42,s*.29);
      ctx.fillStyle='#604e53';ctx.fillRect(px-s*.12,py-s*.04,s*.24,s*.055);
    });
  }
  entries.sort((a,b)=>a.depth-b.depth).forEach(e=>e.draw());
  drawLabels(ctx,w,h,labels,story&&t>=165.4&&t<178.65?state.events.filter(e=>e.speaker!=='ed'):state.events);
  cam.station=station?project(station.x,station.y):undefined;
  if(cam.station&&order!==null){
    const [px,py]=cam.station;ctx.save();ctx.strokeStyle='#ffe3a1';ctx.lineWidth=3;
    ctx.beginPath();ctx.ellipse(px,py,27,13,0,0,2*Math.PI);ctx.stroke();ctx.textAlign='center';
    ctx.font='bold 13px monospace';const title=(floor.stations[order%4].name==='Main belt'?'Belt':floor.stations[order%4].name);
    const width=ctx.measureText(title).width+16;ctx.fillStyle='#1d2925';
    ctx.fillRect(px-width/2,py+16,width,19);ctx.fillStyle='#ffe3a1';ctx.fillText(title,px,py+30);ctx.restore();
  }
  const blackout=story?clamp((t-187.5)/2.8,0,1):0;
  if(fade||blackout){
    ctx.fillStyle='rgba(5,10,11,'+Math.max(blackout,fade*.84)+')';ctx.fillRect(0,0,w,h);
    if(boundary){ctx.save();ctx.globalAlpha=fade;ctx.fillStyle='#f1e3c6';ctx.textAlign='center';ctx.font='600 '+(w<560?18:24)+'px Georgia';ctx.fillText('Meanwhile at '+boundary[1],w/2,h*.51);ctx.restore();}
  }
}
type Label={id:string;x:number;y:number;top:number};
function drawLabels(ctx:CanvasRenderingContext2D,w:number,h:number,labels:Label[],events:Utterance[]){
  const occupied:Rect[]=[];
  const overlap=(a:Rect,b:Rect)=>Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y));
  function place(px:number,py:number,width:number,height:number,speech:boolean){
    const seed={x:clamp(px-width/2,4,w-width-4),y:clamp(py-height-8,4,h-height-4),w:width,h:height};
    let best=seed,score=Infinity;
    for(let row=0;row<(speech?12:5);row++)for(const dx of [0,-.55,.55,-1,1]){
      const r={...seed,x:clamp(seed.x+dx*width,4,w-width-4),y:clamp(seed.y-row*(height+5),4,h-height-4)};
      const cost=occupied.reduce((a,b)=>a+overlap(r,b)*5000,0)+Math.abs(r.x-seed.x)+1.35*Math.abs(r.y-seed.y);
      if(cost<score){best=r;score=cost;}
    }
    occupied.push({...best,x:best.x-2,y:best.y-2,w:best.w+4,h:best.h+4});return best;
  }
  const active=new Set(events.map(e=>e.speaker));
  for(const e of events){
    const label=labels.find(l=>l.id===e.speaker)??{id:e.speaker,x:w/2,y:h*.6,top:h*.45};
    const fs=w<560?14:16;ctx.font='600 '+fs+'px system-ui';
    const max=Math.min(w-30,events.length>2?Math.max(88,w*.37):Math.min(360,w*.80));
    const lines:string[]=[];let line='';
    for(const word of e.text.split(/\s+/)){const next=line?line+' '+word:word;if(line&&ctx.measureText(next).width>max-20){lines.push(line);line=word;}else line=next;}lines.push(line);
    const width=Math.min(w-8,Math.max(65,ctx.measureText(e.speaker).width+20,...lines.map(l=>ctx.measureText(l).width+20)));
    const r=place(label.x,label.top,width,25+lines.length*(fs+3),true);
    ctx.strokeStyle='#f9d597';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(clamp(label.x,r.x+5,r.x+r.w-5),r.y+r.h);ctx.lineTo(clamp(label.x,2,w-2),clamp(label.top+1,0,h));ctx.stroke();
    ctx.fillStyle='#f7f1df';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.fillStyle='#674318';ctx.font='bold 12px monospace';ctx.textAlign='left';ctx.fillText(e.speaker,r.x+9,r.y+15);
    ctx.fillStyle='#172023';ctx.font='600 '+fs+'px system-ui';lines.forEach((l,i)=>ctx.fillText(l,r.x+9,r.y+20+(i+1)*(fs+3)-3));
  }
  ctx.font='bold 12px monospace';ctx.textAlign='center';
  for(const l of labels.filter(l=>!active.has(l.id)&&l.x>0&&l.x<w&&l.y>0&&l.y<h)){
    const r=place(l.x,l.top,ctx.measureText(l.id).width+12,18,false);
    ctx.fillStyle='rgba(23,32,35,.93)';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.fillStyle='#f4dcac';ctx.fillText(l.id,r.x+r.w/2,r.y+13);
    if(Math.abs(r.x+r.w/2-l.x)>8||l.top-r.y>30){ctx.strokeStyle='#c5aa7b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(r.x+r.w/2,r.y+r.h);ctx.lineTo(l.x,l.top);ctx.stroke();}
  }
}
