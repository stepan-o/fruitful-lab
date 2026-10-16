/** Calibrated static fitting transforms, in the accepted body's 1.9 m review space.
 * The original body face stays intact beneath the porcelain. No body triangles are removed. */
export type EyePatch={x:number;y:number;rx:number;ry:number;zMin:number;slope?:number};
export const bodyEyePatch:EyePatch={x:.031,y:1.742,rx:.016,ry:.008,zMin:.13,slope:.12};
export type FaceFit={scale:[number,number,number];position:[number,number,number];rotation?:[number,number,number];eyes:EyePatch};
export const cathexisFits:Record<string,FaceFit>={
 'grace-3k':{scale:[.10,.10,.10],position:[0,1.64,.173],eyes:{x:.31,y:.96,rx:.16,ry:.065,zMin:.18,slope:.18}},
 'grace-8k':{scale:[.10,.10,.10],position:[0,1.64,.173],eyes:{x:.31,y:.96,rx:.16,ry:.065,zMin:.18,slope:.18}},
 'mechanism-grimace':{scale:[.10,.10,.10],position:[0,1.64,.16],eyes:{x:.31,y:1.0,rx:.16,ry:.065,zMin:.12,slope:.18}},
 'mechanism-fury':{scale:[.10,.10,.10],position:[0,1.64,.16],eyes:{x:.31,y:1.0,rx:.16,ry:.065,zMin:.18,slope:.18}},
 'mechanism-distress':{scale:[.10,.10,.10],position:[0,1.64,.16],eyes:{x:.31,y:1.0,rx:.16,ry:.065,zMin:.18,slope:.18}},
};
export type MaskCoverage='full'|'half-left'|'half-right';
export type MaskGeometry={positions:number[];normals:number[];uvs:number[];indices:number[]};
/** Clip a porcelain source at its centre plane, interpolating UVs and normals.
 * A small return edge gives the cut thickness. Body geometry is never touched. */
export function halfMaskGeometry(source:MaskGeometry,side:1|-1){
 type V={p:number[];n:number[];uv:number[]};
 const result:MaskGeometry={positions:[],normals:[],uvs:[],indices:[]},rim:number[]=[];
 const vertex=(i:number):V=>({p:source.positions.slice(i*3,i*3+3),n:source.normals.slice(i*3,i*3+3),uv:source.uvs.slice(i*2,i*2+2)});
 const crossing=(a:V,b:V):V=>{const t=a.p[0]/(a.p[0]-b.p[0]);const mix=(x:number[],y:number[])=>x.map((v,i)=>v+(y[i]-v)*t);return {p:[0,...mix(a.p,b.p).slice(1)],n:mix(a.n,b.n),uv:mix(a.uv,b.uv)};};
 const emit=(v:V)=>{result.indices.push(result.positions.length/3);result.positions.push(...v.p);const l=Math.hypot(...v.n)||1;result.normals.push(...v.n.map(n=>n/l));result.uvs.push(...v.uv);};
 for(let t=0;t<source.indices.length;t+=3){
  const polygon=[0,1,2].map(k=>vertex(source.indices[t+k])),clipped:V[]=[],cuts:V[]=[];
  for(let i=0;i<3;i++){const a=polygon[i],b=polygon[(i+1)%3],inside=a.p[0]*side>=0,next=b.p[0]*side>=0;if(inside)clipped.push(a);if(inside!==next){const c=crossing(a,b);clipped.push(c);cuts.push(c);}}
  for(let i=1;i<clipped.length-1;i++){emit(clipped[0]);emit(clipped[i]);emit(clipped[i+1]);}
  if(cuts.length===2){const [a,b]=cuts.map(v=>v.p),aa=[a[0],a[1],a[2]-.025],bb=[b[0],b[1],b[2]-.025];rim.push(...a,...b,...aa,...b,...bb,...aa);}
 }
 return {geometry:result,rim};
}
