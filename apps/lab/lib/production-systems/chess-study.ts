/** Figure IV: one orthographic space and one finite candle source. Geometry is
 * prepared on the server; the browser only interpolates bounded SVG/CSS poses. */
export type WorldPoint = { x: number; depth: number; height: number };
export type Point = { x: number; y: number };
export type PieceKind = "pawn" | "king" | "knight";
export const stage = { ground: 378, skew: -.26, depthScale: .58 };
export const board = { x: 105, depth: 0, width: 400, length: 250, height: 38, rim: 13, thickness: 17 };
export const lamp: WorldPoint = { x: 518, depth: 305, height: 148 };
export const period = 18;
export const n = (v: number) => Math.round(v * 1000) / 1000;
export const project = (p: WorldPoint): Point => ({ x: p.x + stage.skew * p.depth, y: stage.ground - stage.depthScale * p.depth - p.height });
export function cast(p: WorldPoint, receiver: number, source = lamp): WorldPoint {
  if (p.height >= source.height || receiver > p.height) throw new Error("Receiver must be below the caster and source");
  const t = (source.height - receiver) / (source.height - p.height);
  return { x: source.x + t * (p.x-source.x), depth: source.depth + t * (p.depth-source.depth), height: receiver };
}
export const polygon = (points: Point[]) => points.map((p,i)=>`${i?"L":"M"}${n(p.x)} ${n(p.y)}`).join("")+"Z";
export const surface = (margin=0,height=board.height) => [
  {x:board.x-margin,depth:board.length+margin,height}, {x:board.x+board.width+margin,depth:board.length+margin,height},
  {x:board.x+board.width+margin,depth:-margin,height}, {x:board.x-margin,depth:-margin,height},
];
export const surfacePath = (margin=0,height=board.height) => polygon(surface(margin,height).map(project));
export const square = (file:number,rank:number) => ({x:board.x+(file+.5)*board.width/8,depth:(rank+.5)*board.length/8,height:board.height});
export type ChessPiece = {id:string;kind:PieceKind;dark:boolean;file:number;rank:number;scale:number};
export const pieces: ChessPiece[] = [
  {id:"black-king",kind:"king",dark:true,file:4,rank:7,scale:1.02},
  {id:"black-b-pawn",kind:"pawn",dark:true,file:1,rank:6,scale:.87},
  {id:"black-g-pawn",kind:"pawn",dark:true,file:6,rank:6,scale:.87},
  {id:"white-b-pawn",kind:"pawn",dark:false,file:1,rank:3,scale:.94},
  {id:"black-h-pawn",kind:"pawn",dark:true,file:7,rank:3,scale:.94},
  {id:"knight",kind:"knight",dark:false,file:2,rank:2,scale:1.25},
  {id:"white-king",kind:"king",dark:false,file:6,rank:0,scale:1.08},
];
const smooth = (v:number) => { const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t); };
/** c3–e4 and return, with a deliberate lift, flight and placement. */
export function moveAt(t:number) {
  const p=t%1;
  const travel=p<.5?smooth((p-.2)/.16):1-smooth((p-.72)/.16);
  const lift=p<.5?12*smooth((p-.16)/.04)*(1-smooth((p-.36)/.04)):12*smooth((p-.68)/.04)*(1-smooth((p-.88)/.04));
  return {x:travel*100,depth:travel*31.25,height:lift};
}
export function placement(piece:ChessPiece,t=0):WorldPoint {
  const p=square(piece.file,piece.rank),m=piece.kind==="knight"?moveAt(t):{x:0,depth:0,height:0};
  return {x:p.x+m.x,depth:p.depth+m.depth,height:p.height+m.height};
}
// Preserve the original sad knight contour. Curves are sampled once for its
// projected silhouette; the visible piece retains the authored Bezier curves.
type Command = ["M",number,number]|["L",number,number]|["Q",number,number,number,number]|["C",number,number,number,number,number,number];
const base:Command[]=[["M",-18,0],["L",-18,-5],["Q",-17,-9,-11,-10],["L",-7,-19],["L",7,-19],["L",11,-10],["Q",17,-9,18,-5],["L",18,0],["Q",0,6,-18,0]];
const head:Record<PieceKind,Command[]>={
  knight:[["M",-10,-17],["Q",-3,-26,-7,-34],["L",-18,-33],["L",-21,-40],["L",-13,-52],["L",-13,-64],["L",-5,-59],["L",2,-63],["Q",21,-49,13,-19]],
  king:[["M",-7,-19],["Q",-2,-31,-9,-41],["L",-12,-50],["L",-2,-50],["L",-2,-63],["L",-7,-63],["L",-7,-67],["L",-2,-67],["L",-2,-74],["L",2,-74],["L",2,-67],["L",7,-67],["L",7,-63],["L",2,-63],["L",2,-50],["L",12,-50],["L",9,-41],["Q",2,-31,7,-19]],
  pawn:[["M",-6,-19],["Q",-2,-26,-7,-32],["C",-20,-51,20,-51,7,-32],["Q",2,-26,6,-19]],
};
export const contours=(kind:PieceKind)=>[base,head[kind]];
export const outline=(kind:PieceKind)=>contours(kind).map(commands=>commands.map(c=>c[0]+c.slice(1).join(" ")).join("")+"Z").join("");
function flatten(commands:Command[]):Point[] {
  const points:Point[]=[];let p={x:0,y:0};
  for(const c of commands){
    if(c[0]==="M"||c[0]==="L"){p={x:c[1],y:c[2]};points.push(p);continue;}
    const start=p,steps=c[0]==="Q"?5:10;
    for(let i=1;i<=steps;i++){const t=i/steps,q=1-t;
      p=c[0]==="Q"?{x:q*q*start.x+2*q*t*c[1]+t*t*c[3],y:q*q*start.y+2*q*t*c[2]+t*t*c[4]}:
        {x:q*q*q*start.x+3*q*q*t*c[1]+3*q*t*t*c[3]+t*t*t*c[5],y:q*q*q*start.y+3*q*q*t*c[2]+3*q*t*t*c[4]+t*t*t*c[6]};points.push(p);
    }
  }return points;
}
export const silhouette=(kind:PieceKind)=>contours(kind).map(flatten);
export function pieceShadow(piece:ChessPiece,receiver:number,t=0,source=lamp) {
  const p=placement(piece,t);
  return silhouette(piece.kind).map(points=>polygon(points.map(v=>project(cast({x:p.x+v.x*piece.scale,depth:p.depth,height:p.height-Math.min(0,v.y)*piece.scale},receiver,source))))).join("");
}
/** Lateral source displacement is an EXACT affine shear of this vertical
 * caster's planar shadow. The anchor stays fixed at receiver/caster contact. */
export function shadowMatrix(depth:number,receiver:number,dx:number) {
  const k=-dx/(stage.depthScale*(lamp.depth-depth)),anchor=stage.ground-stage.depthScale*depth-receiver;
  return [1,0,n(k),1,n(-k*anchor),0];
}
export const flameAt=(t:number)=>({x:1.8*Math.sin(t*Math.PI*14)+.65*Math.sin(t*Math.PI*34),power:.87+.075*Math.sin(t*Math.PI*22)+.045*Math.cos(t*Math.PI*38)});
// Include every motion boundary as well as regular flame samples. All layers
// have the same 18-second clock and linear interpolation between these poses.
export const poses=Array.from(new Set([...Array.from({length:37},(_,i)=>i/36),.16,.2,.36,.4,.68,.72,.88,.92,1])).sort((a,b)=>a-b);
const matrix=(values:number[])=>`matrix(${values.join(",")})`;
export function keyframes(id:string) {
  const frames=(get:(t:number)=>string)=>poses.map(t=>`${n(t*100)}%{${get(t)}}`).join("");
  let css=`@keyframes ${id}-flame{${frames(t=>`transform:translateX(${n(flameAt(t).x)}px);opacity:${n(flameAt(t).power)}`)}}`;
  css+=`@keyframes ${id}-flame-shape{${frames(t=>`transform:matrix(1,0,${n(-flameAt(t).x/12)},1,${n(flameAt(t).x)},0);opacity:${n(flameAt(t).power)}`)}}`;
  css+=`@keyframes ${id}-wax-shadow{${frames(t=>`transform:translateX(${n(-128/(lamp.height-128)*flameAt(t).x)}px)`)}}`;
  css+=`@keyframes ${id}-power{${frames(t=>`opacity:${n(flameAt(t).power)}`)}}`;
  css+=`@keyframes ${id}-move{${frames(t=>{const p=moveAt(t);return `transform:translate(${n(p.x+stage.skew*p.depth)}px,${n(-stage.depthScale*p.depth-p.height)}px)`;})}}`;
  const knight=pieces.find(p=>p.kind==="knight")!;
  for(const receiver of [0,board.height]){
    css+=`@keyframes ${id}-horse-shadow-${receiver}{${frames(t=>`d:path('${pieceShadow(knight,receiver,t)}')`)}}`;
    for(const piece of pieces)for(const sample of [-1,0,1]){
      css+=`@keyframes ${id}-${piece.id}-${receiver}-${sample+1}{${frames(t=>`transform:${matrix(shadowMatrix(placement(piece,t).depth,receiver,flameAt(t).x+sample*1.15))};`)}}`;
    }
    const shift=-board.height/(lamp.height-board.height);
    if(receiver===0)for(const sample of [-1,0,1])css+=`@keyframes ${id}-case-${sample+1}{${frames(t=>`transform:translateX(${n(shift*(flameAt(t).x+sample*1.15))}px)`)}}`;
  }
  return css;
}
