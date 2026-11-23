export type Point = {x:number;y:number};
export type Limb = {origin:Point;elbow:Point;end:Point;upper:number;lower:number};
export function limb(origin:Point,end:Point,a:number,b:number,bend=1):Limb {
 const dx=end.x-origin.x,dy=end.y-origin.y,d=Math.hypot(dx,dy);
 const direction=Math.atan2(dy,dx),offset=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));
 const upper=direction+bend*offset,elbow={x:origin.x+a*Math.cos(upper),y:origin.y+a*Math.sin(upper)};
 return {origin,elbow,end,upper:upper*180/Math.PI,lower:Math.atan2(end.y-elbow.y,end.x-elbow.x)*180/Math.PI};
}
const keys=[{t:0,x:270,y:253,lean:0},{t:.2,x:258,y:240,lean:-.15},{t:.45,x:350,y:198,lean:.85},{t:.58,x:350,y:208,lean:1},{t:.7,x:350,y:198,lean:.7},{t:1,x:270,y:253,lean:0}];
export function motionPose(time:number,whole:boolean){
 const t=Math.max(0,Math.min(1,time));let i=0;while(i<keys.length-2&&t>keys[i+1].t)i++;
 const a=keys[i],b=keys[i+1],u=(t-a.t)/(b.t-a.t),e=u*u*(3-2*u);
 const mix=(x:number,y:number)=>x+(y-x)*e,l=whole?mix(a.lean,b.lean):0;
 const hip={x:246+7*l,y:268},shoulder={x:253+18*l,y:189-2*l},left={x:233+18*l,y:192-2*l};
 const hand={x:mix(a.x,b.x),y:mix(a.y,b.y)},other={x:219-7*l,y:255-6*l};
 const head={x:246+20*l,y:155-2*l};
 return {hip,shoulder,left,head,hand,lean:l,right:limb(shoulder,hand,58,55,1),other:limb(left,other,42,35,1),front:limb(hip,{x:272,y:350},46,44,-1),rear:limb({x:hip.x-9,y:hip.y},{x:228,y:350},46,44,1),button:Math.max(0,hand.y-198)*(t>=.45&&t<=.7?1:0)};
}
export function limbTransforms(l:Limb){return {upper:`translate(${l.origin.x.toFixed(3)}px,${l.origin.y.toFixed(3)}px) rotate(${l.upper.toFixed(3)}deg)`,lower:`translate(${l.elbow.x.toFixed(3)}px,${l.elbow.y.toFixed(3)}px) rotate(${l.lower.toFixed(3)}deg)`};}
