import type { MovementWheel } from "./turk-movement";
import { cast, floorShadow, keyRay, keySamples, planeOffset } from "./turk-lighting";

// The same orthographic return as the other cabinets, with its own envelope.
export const cabinet = { left:126, right:466, top:134, bottom:354, depth:72, ground:380 };
export const board = { x:223, y:76, width:222, depth:44, skew:-44/Math.sqrt(3) };
export const wheels:MovementWheel[]=[{name:"winding",x:202,y:243,teeth:68,radius:34,phase:0,direction:1,period:5,layer:0}];
export const meshes:[number,number][]=[];
function mesh(parent:number,name:string,teeth:number,angle:number) {
  const a=wheels[parent],radius=teeth/2,rad=angle*Math.PI/180,d=a.radius+radius;
  const phase=angle+180-(.5-(angle-a.phase)*a.teeth/360)*360/teeth;
  meshes.push([parent,wheels.length]);
  wheels.push({name,x:a.x+Math.cos(rad)*d,y:a.y+Math.sin(rad)*d,teeth,radius,phase,direction:-a.direction,period:a.period*teeth/a.teeth,layer:a.layer});
}
mesh(0,"upper-pinion",28,-65);
mesh(1,"crown",40,-150);
mesh(0,"winding-pinion",20,-153);
mesh(0,"lower-wheel",36,55);
export const compound:[number,number]=[0,5];
wheels.push({...wheels[0],name:"compound",teeth:20,radius:10,layer:1});
mesh(5,"transfer",44,0);
mesh(6,"relay",28,0);
mesh(7,"intermediate",50,0);
mesh(8,"output",72,0);
export const output=wheels[9];
export const crankRadius=12, connectingLength=60;
export function sliderPose(t:number) {
  const angle=(output.phase+output.direction*360*t)*Math.PI/180;
  const pin={x:output.x+crankRadius*Math.cos(angle),y:output.y+crankRadius*Math.sin(angle)};
  const slider={x:pin.x+Math.sqrt(connectingLength**2-(pin.y-output.y)**2),y:output.y};
  return {pin,slider};
}
const n=(v:number)=>Math.round(v*10000)/10000;
export function linkageFrames(id:string) {
  const poses=Array.from({length:121},(_,i)=>({at:i/120*100,...sliderPose(i/120)}));
  return `@keyframes ${id}-rod{${poses.map(({at,pin,slider})=>{
    const a=(slider.x-pin.x)/connectingLength,b=(slider.y-pin.y)/connectingLength;
    return `${n(at)}%{transform:matrix(${n(a)},${n(b)},${n(-b)},${n(a)},${n(pin.x)},${n(pin.y)})}`;
  }).join("")}}@keyframes ${id}-slider{${poses.map(({at,slider})=>`${n(at)}%{transform:translate(${n(slider.x)}px,${n(slider.y)}px)}`).join("")}}`;
}
export const wheelWallOffset=(layer:number)=>planeOffset(layer===0?27:25,30);
// Reuse the opening's source direction. Only the ground origin changes.
export const floorTranslation=cabinet.ground-523;
const caseCaster=[cabinet.left,cabinet.right].flatMap(x=>[0,cabinet.depth].flatMap(depth=>[26,246].map(height=>({x,depth,height}))));
export const doors=[{hinge:145,side:-1},{hinge:447,side:1}].map(({hinge,side})=>{
  const angle=10*Math.PI/180,width=151,depth=-width*Math.sin(angle);
  const a=side*Math.cos(angle)-Math.sin(angle)/Math.sqrt(3),b=Math.sin(angle);
  const points=[0,154].flatMap(y=>[
    {x:hinge,depth:0,height:cabinet.ground-(154+y)},
    {x:hinge+side*width*Math.cos(angle),depth,height:cabinet.ground-(154+y)},
  ]);
  return {hinge,side,width,a,b,points};
});
export const groundShadows=keySamples.map(ray=>floorShadow(caseCaster,ray));
export const doorShadows=keySamples.flatMap(ray=>doors.map(door=>floorShadow(door.points,ray)));
// The front cornice casts onto the thirty-unit recessed wall; gears sit near it.
const hit=cast({x:0,depth:0,height:0},"depth",30,keyRay)!;
export const overhangDrop=-hit.height-hit.depth;
