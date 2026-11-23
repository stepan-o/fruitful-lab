/** One eye level and ground plane for the entire room. Units are metres. */
export type RoomPoint = readonly [number, number, number];
export const roomScale = (z:number) => 620 / (z + 4);
export function project([x,y,z]:RoomPoint):[number,number] {
 const s=roomScale(z);
 return [Math.round((500+x*s)*100)/100,Math.round((205+(1.65-y)*s)*100)/100];
}
export function roomPath(points:readonly RoomPoint[],close=true) {
 return points.map((p,i)=>`${i?"L":"M"}${project(p).join(" ")}`).join("")+(close?"Z":"");
}
export const segment=(a:RoomPoint,b:RoomPoint)=>roomPath([a,b],false);
export function wallRect(x:number,y:number,z:number,w:number,h:number,side=false) {
 return roomPath(side?[[x,y,z],[x,y,z+w],[x,y+h,z+w],[x,y+h,z]]:[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]]);
}
export function atFloor(x:number,z:number) {
 const [px,py]=project([x,0,z]);return `translate(${px} ${py}) scale(${roomScale(z)/100})`;
}
