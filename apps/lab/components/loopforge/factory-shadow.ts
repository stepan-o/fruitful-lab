/** Point-light projection onto the illustrated rear receiver plane.
 * Parallel sprite/receiver planes preserve every source → blocker → shadow
 * line in screen space. This is a 2.5D lighting model, not a depth reconstruction.
 */
export type Point = { x: number; y: number };
export const receiverDepthRatio = 3.4;

/** Bake the opaque outer contour, including non-convex cradle/brain edges.
 * Transparent padding and faint cyan bloom do not cast solid shadows.
 */
export function alphaSilhouette(data: Uint8ClampedArray, width: number, height: number): Point[] {
  const left:Point[]=[],right:Point[]=[];
  for(let y=0;y<height;y+=2) {
    let lo=-1,hi=-1;
    for(let x=0;x<width;x++)if(data[(y*width+x)*4+3]>=160){if(lo<0)lo=x;hi=x;}
    if(lo>=0){left.push({x:lo/width*210-105,y:y/height*210-172});right.push({x:hi/width*210-105,y:y/height*210-172});}
  }
  return left.concat(right.reverse());
}

/** Similar triangles: the rear-plane point is on the same ray, beyond its
 * blocker. A finite receiver retains a recognizable cast silhouette rather
 * than incorrectly treating all air behind each cradle as opaque geometry.
 */
export function projectToReceiver(point: Point, source: Point, ratio=receiverDepthRatio): Point {
  return {x:source.x+(point.x-source.x)*ratio,y:source.y+(point.y-source.y)*ratio};
}

/** Affine form of exactly the same point projection, for cached Path2D blits. */
export function shadowTransform(x: number, y: number, scale: number, source: Point) {
  const origin=projectToReceiver({x,y},source);
  return {a:scale*receiverDepthRatio,b:0,c:0,d:scale*receiverDepthRatio,e:origin.x,f:origin.y};
}

/** Three deterministic filament samples. Average their blocker unions;
 * penumbra width is emitter width × (receiver depth / blocker depth − 1).
 */
export function emitterSamples(source: Point): Point[] {
  return [-1,0,1].map(offset=>({x:source.x+offset*1.8,y:source.y+Math.abs(offset)*.45}));
}
