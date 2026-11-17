// Browser projection. All physical state is evaluated at the requested time.
const {floor,dialogue}=JSON.parse(document.querySelector('#score-data').textContent);
const score=makeSequence(floor,dialogue);
const byId=id=>document.getElementById(id);
const canvas=document.querySelector('canvas'), ctx=canvas.getContext('2d');
const colours={bob:'#f7bf78',sam:'#75c5ac',ed:'#c8b0e6',max:'#f0ce68',jo:'#86b9e8',gus:'#e79578',mae:'#beaf83',kit:'#8fcacb',lou:'#e6aab6',ben:'#a6bd85',LIMEN:'#74e5eb',STILETTO:'#ff9273'};
const actors=Object.keys(score.cast), ns='http://www.w3.org/2000/svg';
const atlasMarks=document.createElementNS(ns,'g');
atlasMarks.setAttribute('transform','translate(72 153) scale(3.72)');
byId('atlas').querySelector('svg').append(atlasMarks);
const dots=actors.map(id=>{
  const dot=document.createElementNS(ns,'circle');
  dot.setAttribute('r','1.05');dot.setAttribute('fill',colours[id]);atlasMarks.append(dot);return dot;
});
for(const [i,b] of score.beats.entries())byId('beatSelect').add(new Option(b.name,i));
for(const a of [...floor.anchors,...floor.stations.map(s=>({name:s.name,scene:s.sceneMetres,floor:[s.x,s.y]}))]){
  const row=byId('anchors').insertRow();
  for(const v of [a.name,a.scene.join(', '),a.floor.join(', ')])row.insertCell().textContent=v;
}
let width=1,height=1,scale=1,center=[0,0],time=0,playing=true,whole=false,lastFrame=performance.now(),lastVoice='',frame=0;
byId('scrub').max=score.duration;
const timer=t=>[Math.floor(t/60),String(Math.floor(t%60)).padStart(2,'0')].join(':');
const project=([x,y])=>[(x-center[0])*scale+width/2,(y-center[1])*scale+height/2];
const bounds=(x,y,w,h)=>[...project([x,y]),w*scale,h*scale];
function box(x,y,w,h,fill,stroke){
  const r=bounds(x,y,w,h);
  if(fill){ctx.fillStyle=fill;ctx.fillRect(...r);}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(...r);}
}
function line(points,colour,weight=1,dash=[]){
  ctx.beginPath();points.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](...project(p)));ctx.strokeStyle=colour;ctx.lineWidth=weight;ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);
}
function ellipse(p,rx,ry,fill,stroke){
  ctx.beginPath();ctx.ellipse(...project(p),Math.max(.1,rx*scale),Math.max(.1,ry*scale),0,0,Math.PI*2);
  if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
}
function label(p,txt,colour,size=10,align='center'){
  ctx.font='600 '+size+'px ui-monospace,monospace';ctx.textAlign=align;ctx.textBaseline='middle';
  ctx.fillStyle=colour;ctx.fillText(txt,...project(p));
}
function chooseCamera(mode,w){
  const third=samplePath(score.products[2].keys,w).p;
  const shot={
    gate:[127.1,122.4,15.7,12],line:[127.4,134.35,23.4,10.6],door:[128.6,126.75,14.8,12.8],
    wide:[127,128,23,23],follow:[Math.max(120.1,Math.min(134,third[0])),135.0,12.8,10.5],
    yard:[72.5,135.2,21.5,14.2],
  }[mode];
  center=shot.slice(0,2);scale=Math.min(width/shot[2],height/shot[3]);
}
function drawBuilding(){
  ctx.fillStyle='#142824';ctx.fillRect(0,0,width,height);
  for(const z of floor.zones){
    const r=z.rect;
    const col={security:'#273d3e',conveyor:'#413a31',lobby:'#36403a'}[z.id]||'#293633';
    box(r.x,r.y,r.w,r.h,col,'#a5a78d');
  }
  const left=Math.floor(center[0]-width/scale/2),top=Math.floor(center[1]-height/scale/2);
  for(let x=left;x<left+width/scale+2;x++)line([[x,top],[x,top+height/scale+2]],x%5?'#d9e6cb0b':'#d9e6cb16');
  for(let y=top;y<top+height/scale+2;y++)line([[left,y],[left+width/scale+2,y]],y%5?'#d9e6cb0b':'#d9e6cb16');
  for(const r of floor.reserves.map(q=>q.rect)){
    ctx.setLineDash([3,4]);box(r.x,r.y,r.w,r.h,'#7a9e7f0b','#71857266');ctx.setLineDash([]);
  }
  for(const p of floor.portals){const r=p.rect;box(r.x,r.y,r.w,r.h,'#81795a');}
  box(floor.doorway.x,127.45,floor.doorway.w,1.1,'#6f725d');
  for(const x of [125,131])box(x-.13,127.45,.26,1.1,'#dcc68b');
  box(floor.exit.x,127.7,floor.exit.w,.6,'#c9b98e');
  label([72.5,126.9],'LOBBY EXIT','#e0d1aa');
  label([124.2,113.3],'SECURITY   /   01','#9fbabb',11);
  label([127.2,139.1],'LATTICE FORGE   /   02','#c2ad92',11);
  label([72.5,142.4],'OUTSIDE   /   SOUTH YARD','#89b6a3',10);
}
function equipment(w){
  for(const q of floor.fixtures){
    const {x,y,w:fw,h}=q.rect,cx=x+fw/2,cy=y+h/2;
    if(q.kind==='rail'){box(x,y,fw,h,'#c3c5ad','#536660');continue;}
    if(q.kind==='drain'){
      box(x,y,fw,h,'#112422','#bdc7af');
      for(let i=.1;i<fw;i+=.2)line([[x+i,y],[x+i,y+h]],'#9ba8a0');
      continue;
    }
    if(q.kind==='desk'){
      box(x,y,fw,h,'#886d50','#ceba8d');
      box(x+.15,y+.15,fw*.48,h*.66,q.id==='register'?'#f3deb4':'#95c7c1');
      label([cx,y+h+.38],q.name.toUpperCase(),'#e2dac4',Math.min(12,Math.max(8,scale*.49)));
      continue;
    }
    box(x-.08,y-.06,fw+.16,h+.2,'#252b28','#6e6757');
    box(x,y,fw,h,'#655948','#c4a77e');
    if(q.id==='intake'){
      for(let i=.35;i<fw;i+=.65)line([[x+i,y+.18],[x+i,y+h-.18]],'#c4aa81',2);
      const stroke=w>=51&&w<55.2?(w-51)/4.2:0;
      line([[x+.4,y+.45],[x+.7+stroke*1.55,y+1.2]],'#e7c085',3);
    }else if(q.id==='wash'){
      ellipse([cx,cy],1.23,.74,'#3c6263','#89b2ae');
      if(score.cues.some(c=>c.actor==='bob'&&/rinses|runs Wash|washes it/.test(c.label)&&w>=c.start&&w<c.end)){
        for(let i=0;i<9;i++){const k=(i*.29+w*1.8)%1;line([[cx-1+i*.24,cy-.5],[cx-.8+i*.24,cy-.2+k*.7]],'#a5edee',2);}
      }
    }else if(q.id==='belt'){
      for(let i=.15;i<fw-.15;i+=.38)line([[x+i,y+.15],[x+i,y+h-.15]],'#ac9980',2);
    }else if(q.id==='forge'){
      const jam=w>101.6&&w<109.3;
      const press=score.products.some(p=>w>p.keys.at(-2).t-.6&&w<p.keys.at(-2).t+.3);
      for(const d of [-1,1])box(cx+(d<0?-1.46:press?.06:jam?.3:.62),y+.13,press?1.4:.86,h-.26,'#414c48','#b1afa1');
      if(jam)label([cx,y-.55],'JAM','#ffab7e',11);
    }else for(let i=.35;i<fw;i+=.55)line([[x+i,y+.1],[x+i,y+h-.1]],'#c3b38f',2);
    label([cx,y+h+.55],q.name.toUpperCase(),'#f0d5a8',Math.max(9,Math.min(13,scale*.54)));
  }
  // Gate arm pivots for individual admissions, while the side lane stays clear.
  const open=(w>=29&&w<=44)||(w>=77&&w<=84)||(w>=109.5&&w<=116)||(w>=139&&w<=164)||w>=181;
  line([[125.15,127.85],open?[125.28,126.6]:[127.25,127.85]],'#e8c477',3);
  if(w>=26.55&&w<30.2){
    const p=samplePath([{t:26.55,p:[126.1,124.2]},{t:27.5,p:[124.14,123.46]}],w).p;
    box(p[0]-.16,p[1]-.1,.32,.2,'#fff0ae','#f4d589');
  }
}
function brains(w){
  for(const b of score.products){
    if(w<b.keys[0].t)continue;
    const p=[...samplePath(b.keys,w).p],done=w>=b.keys.at(-1).t;
    if(b.id===1&&w<54.9){p[0]-=.22;p[1]+=.19;}
    const r=done?.2:.35;
    for(const dx of [-.35,.35])ellipse([p[0]+dx*r,p[1]],r*.78,r,done?'#cfae77':'#edaaa0','#603d37');
    if(!done)line([[p[0]-.2,p[1]-.07],[p[0]-.08,p[1]+.06],[p[0],p[1]-.06],[p[0]+.17,p[1]+.03]],'#8c5652',1.5);
  }
}
function facing(id,pose,w,positions){
  if(pose.moving)return Math.atan2(pose.to[1]-pose.from[1],pose.to[0]-pose.from[0]);
  const towards=(other)=>Math.atan2(positions[other].p[1]-pose.p[1],positions[other].p[0]-pose.p[0]);
  if(w>score.cuts[1].to){return id==='max'?towards('gus'):towards('max');}
  if(w>130&&w<140&&id==='STILETTO')return towards('LIMEN');
  if(w>130&&w<140&&id==='LIMEN')return towards('max');
  if(id==='lou'&&w>=85&&w<=90)return towards('ben');
  if(id==='sam'&&w<32)return towards('bob');
  if(id==='ed'&&w>=26&&w<31)return Math.PI/2;
  if(id==='bob'&&w<19.9)return towards('max');
  if(id==='LIMEN')return w>=39&&w<78?towards('sam'):-Math.PI/2;
  if(id==='STILETTO')return towards('bob');
  if(w>=25&&w<37&&id==='bob')return towards('LIMEN');
  return Math.PI/2;
}
function drawCast(w,voices){
  const poses=Object.fromEntries(actors.map(id=>[id,samplePath(score.tracks[id],w)]));
  const names=[];
  for(const [i,id] of actors.entries()){
    const pos=poses[id], p=pos.p, c=colours[id],boss=id===id.toUpperCase(),angle=facing(id,pos,w,poses);
    dots[i].setAttribute('cx',p[0]);dots[i].setAttribute('cy',p[1]);
    if(whole)continue;
    const [sx,sy]=project(p);
    if(sx< -10||sx>width+10||sy< -10||sy>height+10)continue;
    // Recent trail is sampled from the same route as the token.
    if(pos.moving){
      const trail=[];for(let ago=2;ago>=0;ago-=.25)trail.push(samplePath(score.tracks[id],Math.max(0,w-ago)).p);
      line(trail,c+'88',1.8,[3,3]);
    }
    const speaking=voices.some(v=>v.speaker===id);
    const cue=score.cues.find(q=>q.actor===id&&q.start<=w&&w<q.end);
    const low=cue&&/kneels|seated|ducks/.test(cue.label);
    const rad=(boss?.43:.37)*(low?.80:1);
    const dir=[Math.cos(angle),Math.sin(angle)],side=[-dir[1],dir[0]];
    const offset=(d,s)=>[p[0]+dir[0]*d+side[0]*s,p[1]+dir[1]*d+side[1]*s];
    if(speaking)ellipse(p,rad+.19,rad+.19,null,c);
    ctx.save();ctx.translate(sx,sy);ctx.rotate(angle);ctx.scale(scale,scale);
    ctx.fillStyle='#0a1615';ctx.fillRect(-rad*.9,-rad*1.15,rad*1.8,rad*2.3);
    ctx.fillStyle=c;ctx.fillRect(-rad*.64,-rad,rad*1.25,rad*2);
    ctx.restore();
    ellipse(p,rad*.76,rad*.76,'#20332e',c);
    line([offset(rad*.14,-rad*.43),offset(rad*.7,0),offset(rad*.14,rad*.43)],'#fff5d5',2);
    if(boss){
      const extent=cue&&/strikes|blades/.test(cue.label)?1.12:.56;
      const hands=id==='LIMEN'?[1]:[-1,1];
      for(const d of hands)line([offset(.12,d*.44),offset(extent,d*.56)],c,2.5);
    }
    if(id==='max'&&cue&&/jaw/.test(cue.label))line([offset(.2,-.1),offset(.66+.16*Math.sin(w*7),0)],c,3);
    if(cue&&/photo|offers his card|stamps|register|clips his pen/.test(cue.label)){
      const card=offset(.5,.25);box(card[0]-.14,card[1]-.09,.28,.18,'#f6e9bc');
    }
    names.push({id,sx,sy,r:rad*scale,c});
  }
  drawNames(names);
}
function drawNames(names){
  const placed=[];
  for(const {id,sx,sy,r,c} of names){
    const fs=width<600?10:12;
    ctx.font='600 '+fs+'px ui-monospace,monospace';
    const tw=ctx.measureText(id).width+7,th=fs+4;
    const slots=[[0,-r-th/2-3],[0,r+th/2+3],[tw/2+r+3,0],[-tw/2-r-3,0],[0,-r-th*1.6],[0,r+th*1.6]];
    let best,score=Infinity;
    for(const [dx,dy] of slots){
      const x=Math.max(1,Math.min(width-tw-1,sx+dx-tw/2)),y=Math.max(1,Math.min(height-th-1,sy+dy-th/2));
      let penalty=0;
      for(const rect of [...placed,...names.map(n=>[n.sx-n.r,n.sy-n.r,n.r*2,n.r*2])]){
        penalty+=Math.max(0,Math.min(x+tw,rect[0]+rect[2])-Math.max(x,rect[0]))*Math.max(0,Math.min(y+th,rect[1]+rect[3])-Math.max(y,rect[1]));
      }
      if(penalty<score){score=penalty;best=[x,y,tw,th];}if(!penalty)break;
    }
    placed.push(best);const [x,y]=best;
    ctx.strokeStyle=c+'99';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(x+tw/2,y+th/2);ctx.stroke();
    ctx.fillStyle='#15231fee';ctx.fillRect(x,y,tw,th);ctx.fillStyle=c;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(id,x+tw/2,y+th/2);
  }
}
function draw(){
  const w=score.worldTime(time);
  const index=score.beats.findLastIndex(b=>b.at<=w);
  const beat=score.beats[index], voices=score.speech.filter(q=>q.start<=w&&w<q.end);
  chooseCamera(beat.view,w);
  drawBuilding();equipment(w);brains(w);drawCast(w,voices);
  if(w>=score.end-3.4){
    const opacity=Math.min(.68,(w-score.end+3.4)*.45);
    box(8,80,72,48,'rgba(1,7,6,'+opacity+')');
  }
  const signature=voices.map(v=>v.start).join(',');
  if(signature!==lastVoice){
    lastVoice=signature;byId('voices').replaceChildren(...voices.map(v=>{
      const el=document.createElement('div');el.className='bubble';el.style.setProperty('--voice',colours[v.speaker]);
      const name=document.createElement('b');name.textContent=v.speaker+(v.aside?' · '+v.aside:'');
      const words=document.createElement('span');words.textContent=v.text;el.append(name,words);return el;
    }));
  }
  const actions=score.cues.filter(q=>q.start<=w&&w<q.end);
  byId('action').textContent=actions.filter(q=>q.actor!=='LIMEN'||actions.length<=2||beat.view==='gate').slice(-2).map(q=>q.actor+' '+q.label).join(' · ');
  if(w>=score.end-3.4)byId('action').textContent='Factory lights out';
  const completed=score.products.filter(b=>b.keys.at(-1).t<=w).length;
  byId('count').textContent=w>=179.8?score.tallies.filter(t=>t<=w).length+' / 8 checked out':completed+' / 3 cortexes';
  const edit=score.cuts.find(c=>w>=c.to&&w<c.to+3);
  byId('cut').hidden=!edit;
  if(edit)byId('cut').textContent='Cut · '+edit.label+' · +'+Math.round(edit.to-edit.at)+' s';
  byId('beat').textContent=beat.name;byId('beatSelect').value=index;
  byId('clock').value=timer(time)+' / '+timer(score.duration);
  byId('scrub').value=time;
  byId('play').textContent=playing?'Pause':time>=score.duration?'Replay':'Play';
}
function render(now){
  if(playing)time=Math.min(score.duration,time+(now-lastFrame)/1000);
  if(time>=score.duration)playing=false;
  lastFrame=now;draw();
  frame=playing?requestAnimationFrame(render):0;
}
function update(t,run=playing){
  cancelAnimationFrame(frame);time=Math.max(0,Math.min(score.duration,t));playing=run;
  lastFrame=performance.now();draw();frame=playing?requestAnimationFrame(render):0;
}
byId('play').onclick=()=>update(time>=score.duration?0:time,!playing);
byId('restart').onclick=()=>update(0,true);
byId('scrub').oninput=e=>update(Number(e.target.value));
byId('beatSelect').onchange=e=>update(score.editTime(score.beats[Number(e.target.value)].at));
function setView(value){whole=value;byId('atlas').hidden=!value;byId('view').textContent=value?'Follow scene ↙':'Whole factory ↗';byId('view').setAttribute('aria-pressed',String(value));draw();}
byId('view').onclick=()=>setView(!whole);
byId('atlas').onclick=()=>setView(false);
new ResizeObserver(()=>{
  const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
  const dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);draw();
}).observe(canvas);
update(0,true);
