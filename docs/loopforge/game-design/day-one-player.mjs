// Browser projection. All physical state is evaluated at the requested time.
const {floor,dialogue}=JSON.parse(document.querySelector('#score-data').textContent);
const score=makeSequence(floor,dialogue);
const byId=id=>document.getElementById(id);
const buildObjects=makeBuildMarkers(floor,score);
let hallView=false, inspecting=false, selectedObject=buildObjects.find(m=>m.id==='S6');
const pinButtons=new Map();
const canvas=document.querySelector('canvas'), ctx=canvas.getContext('2d');
const colours={bob:'#f7bf78',sam:'#75c5ac',ed:'#c8b0e6',max:'#f0ce68',jo:'#86b9e8',gus:'#e79578',mae:'#beaf83',kit:'#8fcacb',lou:'#e6aab6',ben:'#a6bd85',LIMEN:'#74e5eb',STILETTO:'#ff9273',BELL:'#e4d4aa'};
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
let width=1,height=1,scale=1,center=[0,0],time=0,playing=true,whole=false,lastFrame=null,lastVoice='',frame=0;
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
  const workerY=samplePath(score.tracks.max,w).p[1];
  // Pan with the walkers while jo finishes her line inside the Lobby.
  const entrancePan=inspecting?0:Math.min(8,Math.max(0,(w-score.start-4)*1.1));
  const shot={
    entrance:[floor.exit.x+floor.exit.w/2,floor.exit.y+4.3-entrancePan,20,22],
    gate:[127.6,122.2,16,14.4],passage:[127.6,125.15,16,14.5],line:[127.6,138.15,25,14.5],door:[128.6,126.75,14.8,12.8],
    wide:[127,132.25,26,24],release:[127,134.4,25,15],hall:[120,156,84,60],follow:[Math.max(120.1,Math.min(134,third[0])),140.7,13.5,11],
    yard:[72.4,Math.max(134,(128+workerY)/2),21,Math.max(16,workerY-128+5)],securityObjects:[128.5,122.4,17.8,15.8],conveyorObjects:[129,141.7,27,13],
  }[mode];
  center=shot.slice(0,2);scale=Math.min(width/shot[2],height/shot[3]);
}
function drawCheckpoint(){
  const deck=buildObjects.find(m=>m.id==='S11').rect;
  box(deck.x,deck.y,deck.w,deck.h,'#1c2c30','#465657');
  // Seams are flush with the floor. Only the two authored queue rails obstruct travel.
  for(let row=0;row<6;row++){
    for(let col=0;col<4;col++){
      const x=122.65+col*2.79,y=115.7+row*1.99;
      box(x,y,2.72,1.92,(col+row)%3===0?'#273a3c':'#243438','#304448');
      box(x+.12,y+.12,.09,.09,'#657775');
      box(x+2.50,y+1.70,.09,.09,'#445955');
    }
  }
  for(const marker of buildObjects.filter(m=>m.id==='S7'||m.id==='S8')){
    const {x,y,w}=marker.rect;
    box(x,y-.22,w,.49,'#273838','#576d69');
    box(x+.14,y+.30,w-.28,.09,'#a9d8d2');
    const title=marker.id==='S7'?'BLUE-COLLAR INTAKE':'VISITOR-CONTRACTOR HOLD';
    label([x+w/2,y],title,'#acbfb6',Math.max(6,Math.min(10,w*scale/(title.length*.65))));
  }
}
function drawBuilding(w,view){
  ctx.fillStyle='#142824';ctx.fillRect(0,0,width,height);
  for(const z of floor.zones){
    const r=z.rect;
    const col={security:'#273d3e',conveyor:'#413a31',lobby:'#36403a'}[z.id]||'#293633';
    box(r.x,r.y,r.w,r.h,col,'#a5a78d');
  }
  const left=Math.floor(center[0]-width/scale/2),top=Math.floor(center[1]-height/scale/2);
  for(let x=left;x<left+width/scale+2;x++)line([[x,top],[x,top+height/scale+2]],x%5?'#d9e6cb0b':'#d9e6cb16');
  for(let y=top;y<top+height/scale+2;y++)line([[left,y],[left+width/scale+2,y]],y%5?'#d9e6cb0b':'#d9e6cb16');
  drawCheckpoint();
  for(const r of floor.reserves.map(q=>q.rect)){
    ctx.setLineDash([3,4]);box(r.x,r.y,r.w,r.h,'#7a9e7f0b','#71857266');ctx.setLineDash([]);
  }
  for(const p of floor.portals){const r=p.rect;box(r.x,r.y,r.w,r.h,'#81795a');}
  drawHall(view==='hall');
  if(view==='yard'||view==='entrance'){
    const on=w<score.yard+10.5;
    for(const x of [61,64.2,67.4,76.5,79.7]){
      box(x,126.85,2.2,.85,on?'#e8b875':'#263437','#546569');
      if(on)box(x-.4,128.1,3,2.6,'#e9b35f25');
    }
  }
  box(floor.doorway.x,127.45,floor.doorway.w,1.1,'#6f725d');
  for(const x of [125,131])box(x-.13,127.45,.26,1.1,'#dcc68b');
  drawStaffEntrance(view==='entrance',w<score.yard+10.5);
  if(view==='hall')return;
  if(view!=='entrance')label([72.5,126.9],'LOBBY EXIT','#e0d1aa');
  label([124.2,113.3],'SECURITY   /   01','#9fbabb',11);

  if(view!=='entrance')label([72.5,142.4],'OUTSIDE   /   SOUTH YARD','#89b6a3',10);
}
function drawStaffEntrance(close,lit){
  const {x,y,w}=floor.exit, cx=x+w/2;
  // The wall stops at the jambs. Show the tiles continuing underneath the open doors.
  box(x,y-.55,w,1.1,'#62615a');
  for(const side of [-1,1]){
    const jamb=side<0?x:x+w;
    box(side<0?jamb-.45:jamb,y-.55,.45,1.1,'#625342','#bc9b6b');
    box(side<0?jamb-2.3:jamb+.45,y-.5,1.85,.3,'#45504b','#777b68');
  }
  if(!close)return;
  for(let dy=1;dy<16;dy+=1.3){
    for(let dx=-7;dx<7;dx+=2.5){
      const bx=cx+dx+(Math.round(dy)%2)*1.25;
      line([[bx,y+dy],[bx+1.5,y+dy]],'#96978138',1);
    }
  }
  for(const side of [-1,1]){
    const lamp=cx+side*(w/2+.9);
    box(lamp-.25,y-.35,.5,.6,lit?'#fad699':'#484c47','#ad9160');
    if(lit)line([[lamp,y+.4],[lamp+side*.25,y+2.3]],'#eac28566',3);
  }
  // Elevate the lettering on screen to keep the passage and arrivals visible below it.
  box(cx-4.15,y-4.05,8.3,1.65,'#273630','#bd9e67');
  label([cx,y-3.56],'LOOPFORGE','#f6d696',Math.max(10,Math.min(19,scale*.85)));
  label([cx,y-2.86],'AI BRAIN FACTORY','#d9c497',Math.max(7,Math.min(10,scale*.52)));
}
function drawHall(overview){
  const hall=floor.forgeHall;
  const r=hall.crane.rect;
  // Cast-iron bed, north operating apron and service side of the line.
  box(99,138.8,51.4,6.5,'#362e29','#817464');
  for(const road of hall.runs){
    const {x,y,w,h}=road.rect;
    box(x,y,w,h,road.id==='staff'?'#55574b':'#514b41','#827a60');
    const across=w>h;
    line(across?[[x+.3,y+h*.5],[x+w-.3,y+h*.5]]:[[x+w*.5,y+.3],[x+w*.5,y+h-.3]],'#ceba7a',1,[5,6]);
  }
  for(const q of hall.installations){
    const {x,y,w,h}=q.rect;
    box(x,y,w,h,'#364348','#a99b83');
    if(q.id==='water-plant'){
      for(const f of [.25,.75])ellipse([x+w*f,y+h/2],2.65,1.85,'#446367','#99b4ac');
      line([[x+w*.25,y],[x+w*.25,146.5],[123.7,146.5],[123.7,145]],'#729998',2);
    }else if(q.id==='drive-shop'||q.id==='jig-shop'){
      box(x+1,y+1.1,w-2,h-2.2,'#504d43','#928779');
      for(const bx of [x+1,x+w-3])box(bx,y+2,2,h-4,'#69635a','#c2ac7b');
      box(x+w*.34,y+2.6,w*.32,h-5.2,q.id==='drive-shop'?'#232b2f':'#927756','#b89f7c');
      for(let yy=y+3.2;yy<y+h-3;yy+=1.3)line([[x+w*.36,yy],[x+w*.64,yy]],'#736e63',1);
      box(x+w*.35,y-.4,w*.30,.7,'#6c6654');
    }else if(q.id==='receiving'||q.id==='empty-racks'){
      for(let xx=x+.8;xx<x+w-1.5;xx+=3.5)for(let yy=y+.8;yy<y+h-1;yy+=3.3)
        box(xx,yy,2.25,2,'#78674f','#bdaa8b');
    }else{
      for(let xx=x+.5;xx<x+w-.35;xx+=.75)line([[xx,y+.35],[xx,y+h-.35]],'#8c9992',1.4);
    }
  }
  const spare=hall.reserve.rect;
  box(spare.x,spare.y,spare.w,spare.h,'#5d544022','#8a806a');
  for(const py of [r.y,r.y+r.h])line([[r.x,py],[r.x+r.w,py]],'#afad9f',1.5,[7,3]);
  for(const col of hall.columns)box(col.x,col.y,col.w,col.h,'#929a98','#333c3c');
  // The bridge is overhead, with an open lattice through which the line remains visible.
  const bx=hall.crane.bridgeX;
  for(const x of [bx-.6,bx+.6])line([[x,r.y],[x,r.y+r.h]],'#cbb27a',1.5);
  for(let y=r.y;y<r.y+r.h;y+=2)line([[bx-.6,y],[bx+.6,y+1],[bx-.6,y+2]],'#ae9b71',1);
  box(bx-.65,147,1.3,1.6,'#867653','#dcc591');
  if(overview){
    for(const [point,name] of [
      [[88,133.6],'RECEIVING'],[[121.5,132],'ASSEMBLY LINE  →'],[[150,136.5],'OUTBOUND'],
      [[109.5,151.6],'WATER RETURN'],[[137.8,151.6],'CRADLES'],[[142,147.2],'CRANE'],
      [[120,158.9],'TRANSFER ROAD'],[[94,173],'DRIVE SHOP'],[[117,173],'TOOLING'],
      [[144,172.5],'SPARE BAY']
    ]){label(point,name,'#fff1cb',Math.max(7,Math.min(11,scale*1.7)));}
  }
}
function equipment(w,view){
  for(const q of floor.fixtures){
    const {x,y,w:fw,h}=q.rect,cx=x+fw/2,cy=y+h/2;
    if(q.kind==='rail'){
      const mid=x+fw/2;
      line([[mid,y],[mid,y+h]],'#0c191d',Math.max(3,scale*.29));
      line([[mid,y],[mid,y+h]],'#697c7b',Math.max(2,scale*.17));
      line([[mid-.04,y],[mid-.04,y+h]],'#a1b3ae',1);
      for(const py of [y+.09,y+h*.5,y+h-.09])box(mid-fw/2,py-.09,fw,.18,'#3a4c4e','#80918b');
      if(q.id==='west-rail'){
        for(const py of [y+1.05,y+2.75])box(mid-.18,py,.14,.22,'#ada98d','#64675a');
      }
      continue;
    }
    if(q.kind==='drain'){
      box(x,y,fw,h,'#112422','#bdc7af');
      for(let i=.1;i<fw;i+=.2)line([[x+i,y],[x+i,y+h]],'#9ba8a0');
      continue;
    }
    if(q.kind==='desk'){
      box(x,y,fw,h,'#465553','#8a9891');
      box(x+.15,y+.15,fw*.48,h*.66,q.id==='register'?'#f3deb4':'#95c7c1');
      if(view!=='hall')label([cx,y+h+.38],q.name.toUpperCase(),'#e2dac4',Math.min(12,Math.max(8,scale*.49)));
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
    if(q.kind==='machine'){
      box(cx-.66,y-.06,1.32,.38,'#34413f','#baa98b');
      const stopped=w>=(q.id==='intake'?score.shutdown.mae:score.shutdown.kit);
      box(cx+.20,y+.01,.20,.16,stopped?'#56615a':'#bdcbae');
      if(q.id==='forge'){
        for(const px of [x+.12,x+fw-.34])box(px,y+.65,.23,h-1,'#b7a37a','#615d54');
        box(x+.40,y+h-.66,fw-.8,.34,'#353d3c','#b6a589');
      }
    }
    if(scale>10)label([cx,y+h+.55],q.name.toUpperCase(),'#f0d5a8',Math.max(9,Math.min(13,scale*.54)));
  }
  line([score.gate.hinge,gateTipAt(score.gate,w)],'#e8c477',3);
  ellipse(score.gate.hinge,.17,.17,'#e8c477','#39453d');
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
  const leaving=score.departures.find(worker=>worker.id===id);
  const towards=(other)=>Math.atan2(positions[other].p[1]-pose.p[1],positions[other].p[0]-pose.p[0]);
  if(leaving && w>=leaving.brake && w<leaving.at){
    if(id==='sam')return Math.atan2(floor.stations[0].y-pose.p[1],floor.stations[0].x-pose.p[0]);
    if(id==='lou')return towards('ben');
    const turn=Math.min(1,(w-leaving.brake)/.3);
    return -Math.PI/2+(towards('STILETTO')+Math.PI/2)*turn;
  }
  if(pose.moving)return Math.atan2(pose.to[1]-pose.from[1],pose.to[0]-pose.from[0]);
  if(w>=score.yard && id==='ed')return towards('max');
  if(w>130&&w<140&&id==='STILETTO')return towards('LIMEN');
  if(w>130&&w<140&&id==='LIMEN')return towards('max');
  if(id==='lou'&&w>=85&&w<=90)return towards('ben');
  if(id==='sam'&&w<32)return towards('bob');
  if(id==='ed'&&w>=26&&w<31)return Math.PI/2;
  if(id==='bob'&&w<19.9)return towards('max');
  if(id==='LIMEN' && w>=score.gate.hold.start && w<score.gate.hold.end){
    return Math.atan2(score.gate.hinge[1]-pose.p[1],score.gate.hinge[0]-pose.p[0]);
  }
  if(id==='LIMEN' && w<score.gate.hold.start)return towards(w>=22?'bob':'max');
  if(id==='LIMEN')return w>=39&&w<78?towards('sam'):-Math.PI/2;
  if(id==='STILETTO')return w<score.gate.openings[0][1]?towards('LIMEN'):towards('bob');
  if(w>=25&&w<37&&id==='bob')return towards('LIMEN');
  return Math.PI/2;
}
function drawCast(w,voices){
  const poses=Object.fromEntries(actors.map(id=>[id,samplePath(score.tracks[id],w)]));
  const names=[];
  for(const [i,id] of actors.entries()){
    const pos=poses[id], p=pos.p, c=colours[id],boss=id===id.toUpperCase(),angle=facing(id,pos,w,poses);
    const visible=w>=score.tracks[id][0].t;
    dots[i].setAttribute('visibility',visible?'visible':'hidden');
    if(!visible)continue;
    dots[i].setAttribute('cx',p[0]);dots[i].setAttribute('cy',p[1]);
    if(whole)continue;
    const [sx,sy]=project(p);
    if(sx< -10||sx>width+10||sy< -10||sy>height+10)continue;
    // Recent trail is sampled from the same route as the token.
    if(pos.moving){
      const trail=[];for(let ago=2;ago>=0;ago-=.25)trail.push(samplePath(score.tracks[id],Math.max(score.start,w-ago)).p);
      line(trail,c+'88',1.8,[3,3]);
    }
    const speaking=voices.some(v=>v.speaker===id);
    const cue=score.cues.find(q=>q.actor===id&&q.start<=w&&w<q.end);
    const low=cue&&/kneels|seated|ducks/.test(cue.label);
    const checkpoint=w<40.5;
    const rad=(checkpoint&&id==='LIMEN'?.52:boss?.43:.37)*(low?.80:1);
    const dir=[Math.cos(angle),Math.sin(angle)],side=[-dir[1],dir[0]];
    const offset=(d,s)=>[p[0]+dir[0]*d+side[0]*s,p[1]+dir[1]*d+side[1]*s];
    if(speaking)ellipse(p,rad+.19,rad+.19,null,c);
    ctx.save();ctx.translate(sx,sy);ctx.rotate(angle);ctx.scale(scale,scale);
    ctx.fillStyle='#0a1615';ctx.fillRect(-rad*.9,-rad*1.15,rad*1.8,rad*2.3);
    ctx.fillStyle=checkpoint?'#667674':c;ctx.fillRect(-rad*.64,-rad,rad*1.25,rad*2);
    if(checkpoint){
      for(const flank of [-1,1]){
        ctx.fillStyle='#27383b';ctx.fillRect(-rad*.82,flank*rad*.81-rad*.24,rad*1.38,rad*.48);
        ctx.fillStyle='#95a5a0';ctx.fillRect(-rad*.48,flank*rad*.81-rad*.15,rad*.44,rad*.15);
      }
    }
    ctx.restore();
    ellipse(p,rad*.76,rad*.76,'#20332e',c);
    line([offset(rad*.14,-rad*.43),offset(rad*.7,0),offset(rad*.14,rad*.43)],'#fff5d5',2);
    if(checkpoint){
      line([offset(rad*.54,-rad*.32),offset(rad*.65,0),offset(rad*.54,rad*.32)],'#caf8f1',1.6);
      if(['bob','max','jo','ben'].includes(id) && w<26.7){
        const card=offset(.42,.25);
        box(card[0]-.11,card[1]-.14,.22,.28,'#cbd3b9','#667671');
      }
    }
    if(boss){
      const extent=cue&&/strikes|blades|catches|waves/.test(cue.label)?1.12:.56;
      const hands=id==='LIMEN'?[1]:[-1,1];
      for(const d of hands){
        const grip=offset(.12,d*.44);
        if(checkpoint && id==='LIMEN'){
          const engaging=cue?.label.startsWith('strikes');
          const shoulderTip=offset(.85,.53);
          const target=poses.bob.p;
          const stroke=engaging?Math.sin(Math.PI*(w-cue.start)/(cue.end-cue.start)):0;
          const tip=shoulderTip.map((v,i)=>v+(target[i]-v)*stroke);
          line([grip,tip],'#317d82',5);
          line([grip,tip],'#a5fff4',2);
        }else line([grip,offset(extent,d*.56)],c,2.5);
      }
    }
    if(id==='max'&&cue&&/jaw/.test(cue.label))line([offset(.2,-.1),offset(.66+.16*Math.sin(w*7),0)],c,3);
    if(cue&&/photo|offers his card|stamps|register|clips his pen/.test(cue.label)){
      const card=offset(.5,.25);box(card[0]-.14,card[1]-.09,.28,.18,'#f6e9bc');
    }
    if(scale>10 || speaking)names.push({id,sx,sy,r:rad*scale,c});
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
function selectObject(marker){
  selectedObject=marker;
  byId('objectSelect').value=marker.id;
  const {x,y,w,h}=marker.rect;
  const reference=byId('objectArt'), entrance=marker.room==='Factory entrance';
  reference.href=entrance?'/media/loopforge-opening-storyboard/morning-1672.3cd92c950e1fadcc.webp':'/media/files/42d2f07b9d72f8ce0bc776641a06047304a1eab567f5ca9c3efd3dd31619560a.webp';
  reference.textContent=entrance?'The morning walk · storyboard ↗':'At the gate · concept art ↗';
  const metres=n=>Number(n.toFixed(2));
  const mount=marker.mount?' · attach to '+marker.mount:' · base '+marker.base+' m';
  byId('objectSize').textContent='Floor x '+metres(x)+' m, y '+metres(y)+' m · '+metres(w)+' × '+metres(h)+' m footprint · '+marker.height+' m high'+mount;
  byId('objectBrief').textContent=marker.build;
  for(const [id,pin] of pinButtons)pin.setAttribute('aria-pressed',String(id===marker.id));
}
function initBuildPins(){
  let group;
  for(const marker of buildObjects){
    if(group?.label!==marker.room){
      group=document.createElement('optgroup');group.label=marker.room;byId('objectSelect').append(group);
    }
    group.append(new Option(marker.id+' · '+marker.name,marker.id));
    const pin=document.createElement('button');
    pin.type='button';pin.textContent=marker.id;pin.setAttribute('aria-label',marker.id+' '+marker.name);
    pin.onclick=()=>{selectObject(marker);draw();};
    byId('pins').append(pin);pinButtons.set(marker.id,pin);
  }
  byId('objectSelect').onchange=e=>{selectObject(buildObjects.find(m=>m.id===e.target.value));draw();};
  selectObject(selectedObject);
}
function drawBuildPins(){
  const {x,y,w,h}=selectedObject.rect;
  box(x,y,w,h,'#f5cd662c','#f5cb78');
  for(const marker of buildObjects){
    const pin=pinButtons.get(marker.id),r=marker.rect;
    pin.hidden=marker.room!==selectedObject.room;
    if(pin.hidden)continue;
    const anchor=[r.x+r.w/2,r.y+r.h/2], [sx,sy]=project(anchor);
    const above=marker.id==='E2'||(marker.room==='Security'&&!['S3','S5','S6','S9'].includes(marker.id));
    const offset=above?-1:1;
    const labelY=Math.min(height-15,Math.max(15,sy+offset*23));
    ctx.strokeStyle='#e8ce99';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx,labelY);ctx.stroke();
    pin.style.left=sx+'px';pin.style.top=labelY+'px';
  }
}
function setInspecting(value){
  inspecting=value;byId('buildPanel').hidden=!value;byId('pins').hidden=!value;
  byId('buildView').setAttribute('aria-pressed',String(value));
}
function draw(){
  const w=score.worldTime(time);
  const index=score.beats.findLastIndex(b=>b.at<=w+1e-8);
  const beat=score.beats[index], voices=score.speech.filter(q=>q.start<=w&&w<q.end);
  let view=hallView?'hall':beat.view;
  if(!hallView && beat.view==='entrance' && w>=score.cuts[0].to)view='gate';
  if(inspecting)view=selectedObject.room==='Security'?'securityObjects':selectedObject.room==='Conveyor'?'conveyorObjects':selectedObject.room==='Factory entrance'?'entrance':'hall';
  if(!hallView && !inspecting && w>=score.bell-1.1 && w<score.bell)view='release';
  if(!hallView && !inspecting && beat.name==='The register' && w<score.dismissal+2.6)view='wide';
  if(!hallView && !inspecting && beat.view==='line' && w>=40.5 && w<43.7)view='hall';
  chooseCamera(view,w);
  drawBuilding(w,view);equipment(w,view);brains(w);drawCast(w,voices);
  if(inspecting)drawBuildPins();
  const signature=voices.map(v=>v.start).join(',');
  if(signature!==lastVoice){
    lastVoice=signature;byId('voices').replaceChildren(...voices.map(v=>{
      const el=document.createElement('div');el.className='bubble';el.style.setProperty('--voice',colours[v.speaker]);
      if(v.speaker==='BELL')el.classList.add('bell-cue');
      if(v.start===score.call)el.classList.add('shout-cue');
      const name=document.createElement('b');name.textContent=v.speaker+(v.aside?' · '+v.aside:'');
      const words=document.createElement('span');words.textContent=v.text;el.append(name,words);return el;
    }));
  }
  const actions=score.cues.filter(q=>q.start<=w&&w<q.end);
  byId('action').textContent=actions.filter(q=>q.actor!=='LIMEN'||actions.length<=2||beat.view==='gate'||beat.view==='passage').slice(-2).map(q=>q.actor+' '+q.label).join(' · ');
  if(w>=score.yard+10.5)byId('action').textContent='Factory lights out';
  const completed=score.products.filter(b=>b.keys.at(-1).t<=w).length;
  byId('count').textContent=w+1e-8>=score.bell?score.tallies.filter(t=>t<=w).length+' / 8 checked out':completed+' / 3 cortexes';
  const edit=score.cuts.find(c=>w>=c.to&&w<c.to+3);
  byId('cut').hidden=!edit;
  if(edit)byId('cut').textContent='Cut · '+edit.label+' · +'+Math.round(edit.to-edit.at)+' s';
  byId('beat').textContent=hallView?'Lattice Forge · 80 × 56 m':beat.name;byId('beatSelect').value=index;
  byId('clock').value=timer(time)+' / '+timer(score.duration);
  byId('scrub').value=time;
  byId('play').textContent=playing?'Pause':time>=score.duration?'Replay':'Play';
}
function render(now){
  if(playing && lastFrame !== null)time=Math.min(score.duration,time+(now-lastFrame)/1000);
  if(time>=score.duration)playing=false;
  lastFrame=now;draw();
  frame=playing?requestAnimationFrame(render):0;
}
function update(t,run=playing){
  cancelAnimationFrame(frame);time=Math.max(0,Math.min(score.duration,t));playing=run;
  lastFrame=null;draw();frame=playing?requestAnimationFrame(render):0;
}
byId('play').onclick=()=>{setInspecting(false);setHall(false);update(time>=score.duration?0:time,!playing);};
byId('restart').onclick=()=>{setInspecting(false);setHall(false);update(0,true);};
byId('scrub').oninput=e=>{setInspecting(false);setHall(false);update(Number(e.target.value));};
byId('beatSelect').onchange=e=>{setInspecting(false);setHall(false);update(score.editTime(score.beats[Number(e.target.value)].at));};
function setHall(value){
  hallView=value;byId('hallView').setAttribute('aria-pressed',String(value));byId('hallNote').hidden=!value;
}
byId('hallView').onclick=()=>{const open=!hallView;setInspecting(false);if(whole)setView(false);setHall(open);draw();};
function setView(value){if(value){setInspecting(false);setHall(false);}whole=value;byId('atlas').hidden=!value;byId('view').textContent=value?'Follow scene ↙':'Whole factory ↗';byId('view').setAttribute('aria-pressed',String(value));draw();}
byId('view').onclick=()=>setView(!whole);
byId('atlas').onclick=()=>setView(false);
initBuildPins();
byId('buildView').onclick=()=>{
  if(inspecting){setInspecting(false);draw();return;}
  if(!hallView && score.worldTime(time)<score.cuts[0].to)selectObject(buildObjects.find(m=>m.id==='E1'));
  if(hallView)selectObject(buildObjects.find(m=>m.id==='H8'));
  if(whole)setView(false);setHall(false);
  setInspecting(true);update(time,false);
};
new ResizeObserver(()=>{
  const r=canvas.getBoundingClientRect();width=r.width;height=r.height;
  const dpr=Math.min(devicePixelRatio,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);draw();
}).observe(canvas);
const initialBeatName={'#forge-hall':'Run it','#end-of-shift':'End of shift','#the-fallen-card':'The fallen card','#fourth-check':'The fourth check'}[location.hash];
const initialBeat=score.beats.find(beat=>beat.name===initialBeatName);
setHall(location.hash==='#forge-hall');
update(initialBeat?score.editTime(initialBeat.at):0,!hallView);
