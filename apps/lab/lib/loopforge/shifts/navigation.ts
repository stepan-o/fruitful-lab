import {segmentBoxDistanceSquared, simultaneousDistanceSquared} from '../encounters/arrival-navigation';
import {geom, roomAt} from '../intro/floor';
import {type Point, type Run} from './contract';

export const meters = (x:number,y:number):Point => [Math.round(x*1000),Math.round(y*1000)];
export const controls = geom.stations.map(s => meters(s.x,s.y));
export const desk:Point = meters(126.2,130.25);
export const returnSpot = meters(124.65,130.1);
export const supervisorPost:Point = meters(125.3,131.25);
export const workPost:Point = meters(126.3,142.2);
export const steps = [meters(127,132),meters(127,136),meters(127,140),meters(125.6,143)];
export const queueSpots = [meters(126.4,128.65),meters(127.7,128),meters(126.3,127.05),meters(127.7,126.35),meters(126.25,125.5),meters(127.7,124.8),meters(126.25,123.95),meters(127.7,123.2)];
export const standby = [meters(134,143),meters(136,142.7),meters(138,143.2),meters(140,142.8)];
export const dist = (a:Point,b:Point) => Math.hypot(a[0]-b[0],a[1]-b[1]);
const obstacles = [...geom.walls,...geom.fixtures.filter(f=>f.kind!=='drain').map(f=>f.rect),...geom.forgeHall.columns,...geom.forgeHall.installations.map(f=>f.rect)].map(r=>({minX:r.x*1000,minY:r.y*1000,maxX:(r.x+r.w)*1000,maxY:(r.y+r.h)*1000}));
function visible(a:Point,b:Point, bodies:Point[]) {
  const x1=Math.min(a[0],b[0])-400,x2=Math.max(a[0],b[0])+400;
  const y1=Math.min(a[1],b[1])-400,y2=Math.max(a[1],b[1])+400;
  return obstacles.every(r=>r.maxX<x1||r.minX>x2||r.maxY<y1||r.minY>y2||segmentBoxDistanceSquared(a,b,r)>=399**2)
    && bodies.every(p=>simultaneousDistanceSquared(a,b,p,p)>=800**2);
}
function route(a:Point,b:Point,bodies:Point[]):Point[] {
  if(visible(a,b,bodies)) return [b];
  const nodes=[a,b,...steps,meters(129.5,129),meters(125,128.5),meters(128.7,132),meters(126,141.4),meters(131,142.8)];
  for(const p of bodies) if(dist(a,p)+dist(b,p)<dist(a,b)+5000){
    for(const [dx,dy] of [[950,0],[-950,0],[0,950],[0,-950]])nodes.push([p[0]+dx,p[1]+dy]);
  }
  const cost=nodes.map(()=>Infinity), prior=nodes.map(()=>-1),used=new Set<number>();cost[0]=0;
  while(used.size<nodes.length){
    let at=-1;
    for(let j=0;j<nodes.length;j++)if(!used.has(j)&&cost[j]<(at<0?Infinity:cost[at]))at=j;
    if(at<0)break;
    if(at===1){const points:Point[]=[];while(at>0){points.unshift(nodes[at]);at=prior[at];}return points;}
    used.add(at);
    for(let j=1;j<nodes.length;j++){const c=cost[at]+dist(nodes[at],nodes[j]);
      if(!used.has(j)&&c<cost[j]&&visible(nodes[at],nodes[j],bodies)){cost[j]=c;prior[j]=at;}
    }
  }
  return [];
}
export function go(s:Run,id:string,to:Point){
  const t=s.tasks[id];t.destination=to;t.path=route(s.world.agents[id].position,to,[]);
}
export function move(s:Run){
  for(const [id,t] of Object.entries(s.tasks)){
    const a=s.world.agents[id];t.moving=false;
    if(!t.path.length&&dist(a.position,t.destination)>50&&s.tick%10===0)go(s,id,t.destination);
    if(!t.path.length)continue;
    const next=t.path[0],d=dist(a.position,next),stride=id==='bob'?115:id==='STILETTO'?205:155,
      speed=a.room==='conveyor'&&a.character==='worker'&&s.pace!=='all-clear'?Math.round(stride*(s.pace==='pushed'?1.22:s.pace==='rushed'?1.12:.95)):stride;
    const p:Point=d<=speed?next:[a.position[0]+Math.round((next[0]-a.position[0])*speed/d),a.position[1]+Math.round((next[1]-a.position[1])*speed/d)];
    const others=Object.values(s.world.agents).filter(o=>o!==a&&s.tasks[o.id].duty!=='detained').map(o=>o.position);
    if(!visible(a.position,p,others)){
      if(s.tick%8===0)t.path=route(a.position,t.destination,others);
      continue;
    }
    a.position=p;a.room=roomAt(p);t.moving=d>0;t.walked+=Math.round(Math.min(d,speed));
    if(d<=speed)t.path.shift();
  }
}
