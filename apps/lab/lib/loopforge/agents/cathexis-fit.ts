/** Calibrated static fitting transforms, in the accepted body's 1.9 m review space.
 * The original GLB stays immutable. Face-seat indices are restored for body-only review. */
export type EyePatch={x:number;y:number;rx:number;ry:number;zMin:number;slope?:number};
export const bodyEyePatch:EyePatch={x:.031,y:1.742,rx:.016,ry:.008,zMin:.13,slope:.12};
export type FaceFit={scale:[number,number,number];position:[number,number,number];rotation?:[number,number,number];eyes:EyePatch};
export const cathexisFits:Record<string,FaceFit>={
 'grace-3k':{scale:[.10,.10,.10],position:[0,1.64,.17],eyes:{x:.31,y:.96,rx:.16,ry:.065,zMin:.18,slope:.18}},
 'grace-8k':{scale:[.10,.10,.10],position:[0,1.64,.17],eyes:{x:.31,y:.96,rx:.16,ry:.065,zMin:.18,slope:.18}},
 'mechanism-grimace':{scale:[.10,.10,.10],position:[0,1.64,.16],eyes:{x:.31,y:1.0,rx:.16,ry:.065,zMin:.12,slope:.18}},
 'mechanism-fury':{scale:[.10,.10,.10],position:[0,1.64,.16],eyes:{x:.31,y:1.0,rx:.16,ry:.065,zMin:.18,slope:.18}},
 'mechanism-distress':{scale:[.10,.10,.10],position:[0,1.64,.16],eyes:{x:.31,y:1.0,rx:.16,ry:.065,zMin:.18,slope:.18}},
};
/** Remove only central facial surface under the fitted insert, never crown/hair.
 * This is a reversible viewer fitting seat, not a remodeled source body. */
export function cathexisSeatIndices(positions:ArrayLike<number>,indices:ArrayLike<number>):number[]{
 const keep:number[]=[];
 for(let t=0;t<indices.length;t+=3){
  let hidden=true;
  for(let k=0;k<3;k++){
   const i=indices[t+k]*3,x=positions[i],y=positions[i+1],z=positions[i+2];
   if(z<.115||(x/.071)**2+((y-1.735)/.105)**2>1)hidden=false;
  }
  if(!hidden)keep.push(indices[t],indices[t+1],indices[t+2]);
 }
 return keep;
}
