// Export the approved design in metres. The Sim4 runtime owns its historical floor.
import fs from 'node:fs';
import {makeSequence} from '../../../docs/loopforge/game-design/day-one-sequence.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const app = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(app, 'lib/loopforge/spatial/approved-factory.json');
const board = path.resolve(app, '../../docs/loopforge/game-design');
const publicDir = path.join(app,'public/loopforge-design');
const design = JSON.parse(fs.readFileSync(source));
const bounds = points => {
  const xs=points.map(p=>p[0]), ys=points.map(p=>p[1]);
  return {x:Math.min(...xs),y:Math.min(...ys),w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys)};
};
const zones = design.zones.map(z=>({...z,rect:bounds(z.polygon)}));
const portals = design.portals.map(p=>{
  const r=bounds(p.span);
  return {...p,rect:r.w?{...r,y:r.y-.25,h:.5}:{...r,x:r.x-.25,w:.5}};
});
const portal=id=>portals.find(p=>p.id===id);
const middle=id=>portal(id).span[0].map((v,i)=>(v+portal(id).span[1][i])/2);
const [exitX,exitY]=portal('staff-entrance').span[0];
const exit={x:exitX,y:exitY,w:portal('staff-entrance').rect.w};
// Union coincident collinear wall runs, then subtract openings once on both sides.
const runs=new Map();
function add([a,b],kind){
  const axis=a[1]===b[1]?0:1, fixed=a[1-axis];
  if(a[1-axis]!==b[1-axis]) throw Error('Expected an orthogonal wall');
  const key=[axis,fixed].join(',');
  if(!runs.has(key))runs.set(key,{axis,fixed,solid:[],open:[]});
  runs.get(key)[kind].push([Math.min(a[axis],b[axis]),Math.max(a[axis],b[axis])]);
}
for(const z of zones)z.polygon.forEach((p,i)=>add([p,z.polygon[(i+1)%z.polygon.length]],'solid'));
design.partitions.forEach(edge=>add(edge,'solid'));
portals.forEach(p=>add(p.span,'open'));
const walls=[];
for(const {axis,fixed,solid,open} of runs.values()){
  const edges=[...new Set([...solid,...open].flat())].sort((a,b)=>a-b);
  for(let i=1;i<edges.length;i++){
    const lo=edges[i-1],hi=edges[i],mid=(lo+hi)/2;
    if(!solid.some(([a,b])=>a<mid&&mid<b)||open.some(([a,b])=>a<mid&&mid<b))continue;
    walls.push(axis===0?{x:lo,y:fixed,w:hi-lo,h:0}:{x:fixed,y:lo,w:0,h:hi-lo});
  }
}
const byId=Object.fromEntries([...design.fixtures,...design.forgeHall.installations,...portals].map(q=>[q.id,q.rect]));
byId.crane=design.forgeHall.crane.rect;
const roomObjects=Object.fromEntries(Object.entries(design.roomObjects).map(([id,items])=>[id,items.map(q=>typeof q==='string'?byId[q]:q)]));
const yard=middle('staff-entrance'),west=middle('lobby-dispatch'),east=middle('dispatch-security');
const egress=[middle('security-conveyor'),middle('inspection-gate'),[120.4,east[1]],east,west,[yard[0],west[1]+3],[yard[0],yard[1]+3]];
const floor={...design,zones,portals,walls,roomObjects,exit,egress,doorway:portal('security-conveyor').rect,
  reserves:[design.forgeHall.reserve],aisles:design.forgeHall.runs.map(q=>({...q,room:'conveyor'}))};
// Trace the actual editorial paths for the two moving-crew overlays on the layout tab.
const script=[...fs.readFileSync(path.resolve(board,'../DAY_ONE_INTRO.md'),'utf8').matchAll(/^\*\*(\w+)\*\*\s+(.+)$/gm)].map(([,speaker,text])=>({speaker,text}));
const score=makeSequence(floor,script);
const route=(id,from,until)=>score.tracks[id].filter(k=>k.t>=from && k.t<=until).map(k=>k.p)
  .filter((p,i,points)=>!i||p.some((v,j)=>v!==points[i-1][j]));
const gate=middle('inspection-gate'), apron=[gate[0],(gate[1]+middle('security-conveyor')[1])/2];
const eastAisle=design.partitions[1][0][0]+7, crossY=middle('security-theatre')[1]-7;
const staff={};
for(const id of ['weaving','brewery','cortex','theatre','conveyor']){
  const opening=middle('security-'+id);
  staff[id]=id==='conveyor'?[gate,apron,opening,[opening[0],opening[1]+2]]:
    [gate,apron,[eastAisle,apron[1]],[eastAisle,crossY],[opening[0],crossY],opening,
      ...(id==='theatre'?[[opening[0],opening[1]+3]]:[middle(id+'-inner'),[opening[0],middle(id+'-inner')[1]-3]])];
}
floor.reviewPaths={staff,arrival:{workers:route('max',score.start,18),supervisor:route('STILETTO',score.start,52)},
  release:Object.fromEntries(['mae','max','lou'].map(id=>[id,route(id,score.bell,score.streetTime[id])]))};
const rect=(r,fill)=>`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${fill}"/>`;
const pathLine=(a,b,color,width)=>`<path d="M${a.join(' ')}L${b.join(' ')}" stroke="${color}" stroke-width="${width}"/>`;
const parts=['<g id="shell">'];
for(const z of zones)parts.push(`<polygon points="${z.polygon.map(p=>p.join(',')).join(' ')}" fill="${z.id==='conveyor'?'#40392e':z.kind==='support'?'#32433c':'#273c35'}"/>`);
for(const r of design.galleries)parts.push(rect(r,'#485445'),pathLine([r.x,r.y+r.h*.55],[r.x+r.w,r.y+r.h*.55],'#a2b099',.42));
const [supply,returnGallery]=design.galleries;
for(const r of design.galleries){
  parts.push(pathLine([r.x,r.y+r.h*.78],[r.x+r.w,r.y+r.h*.78],'#78928b',.35));
  for(let x=r.x+1;x<r.x+r.w;x+=8)parts.push(pathLine([x,r.y+.2],[x,r.y+r.h-.2],'#8d9b84',.29));
}
parts.push(pathLine([supply.x+supply.w-1,returnGallery.y+1],[supply.x+supply.w-1,supply.y+supply.h*.55],'#a2b099',.48));
for(const id of ['weaving','brewery','cortex']){
  const [a,b]=portal('security-'+id).span;
  const y=middle(id+'-inner')[1];
  for(const [x] of [a,b])parts.push(pathLine([x,y],[x,a[1]],'#bbccba',.27));
}
for(const r of walls)parts.push(pathLine([r.x,r.y],[r.x+r.w,r.y+r.h],'#a6b2a1',.48));
for(const p of portals)parts.push(pathLine(...p.span,p.kind==='freight'?'#d89b7f':'#f0cb85',.85));
for(const q of design.forgeHall.runs)parts.push(rect(q.rect,'#5a5544'));
for(const r of [...design.forgeHall.installations,...design.fixtures])parts.push(rect(r.rect,'#a48b66'));
for(const [key,rs] of Object.entries(roomObjects))if(/^[WBCGTLPD]/.test(key)&&key!=='L1')for(const r of rs)parts.push(rect(r,'#667b6d'));
parts.push('</g>');
const shell=parts.join('\n');
const labels=zones.map(z=>{
  const [x,y]=z.polygon[0];
  return `<text x="${x+2}" y="${y+4.7}" fill="#eff1dd" font-size="2.65">${z.short}</text>`;
}).join('\n');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="24.75 35.75 240 170" role="img" aria-labelledby="planTitle"><title id="planTitle">Approved factory · Day 1 · north up</title>
<rect x="24.75" y="35.75" width="240" height="170" fill="#152520"/>${shell}<g font-family="system-ui,sans-serif">${labels}
<text x="30" y="42" fill="#e1d5ac" font-size="3">FACTORY 01   /   N ↑</text>
<text x="163" y="106" fill="#ced9c7" font-size="2.2">CLEARED STAFF CONCOURSE</text>
<text x="32" y="199" fill="#c3d0c2" font-size="2.5">Gold · staff openings       Copper · freight       Day 1 · Security and Forge</text>
<path d="M220 198h20m-20 -1v2m20 -2v2" stroke="#e1d5ac" stroke-width=".4"/><text x="228" y="202" fill="#ded6b4" font-size="2">20 m</text></g></svg>\n`;
const hash=createHash('sha256').update(svg).digest('hex').slice(0,12);
const name=`factory-floor-plan.${hash}.svg`;
const metadata={version:design.version,src:'/loopforge-design/'+name,width:1200,height:850,hallHeight:design.hallHeight,connections:portals.length};
const outputs=[[path.join(board,'day-one-geometry.json'),JSON.stringify(floor)+'\n'],[path.resolve(board,'../maps/factory-floor-plan.svg'),svg],[path.join(publicDir,name),svg],[path.join(board,'factory-floor-plan.json'),JSON.stringify(metadata,null,2)+'\n']];
for(const [file,data] of outputs){
  if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==data)throw Error('Stale export '+file);}
  else {fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);}
}
console.log(design.version,name);
