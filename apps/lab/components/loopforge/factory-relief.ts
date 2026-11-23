import { noise } from './factory-drive';

const SIZE=256;
function valueNoise(x:number,y:number) {
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const a=noise(ix*1597+iy*5171+113),b=noise((ix+1)*1597+iy*5171+113);
  const c=noise(ix*1597+(iy+1)*5171+113),d=noise((ix+1)*1597+(iy+1)*5171+113);
  return (a+(b-a)*u)*(1-v)+(c+(d-c)*u)*v;
}

/** Stable hammered sheet: broad dents, warped pressing ripples and fine pits.
 * Only the light moves. This tile and its gradients are baked once. */
export function createReceiverRelief() {
  const tile=new Float32Array(SIZE*SIZE),nx=new Float32Array(SIZE*SIZE),ny=new Float32Array(SIZE*SIZE);
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++) {
    const warp=valueNoise(x/39,y/39),dent=valueNoise(x/18,y/18);
    tile[y*SIZE+x]=dent*13+valueNoise(x/4,y/4)*1.5
      +Math.sin(x*.18+y*.08+warp*8)*1.8+noise(x+y*SIZE)*.25;
  }
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++) {
    const i=y*SIZE+x;
    // Mirrored sampling below avoids hard seams at tile boundaries.
    nx[i]=(tile[y*SIZE+Math.min(255,x+1)]-tile[y*SIZE+Math.max(0,x-1)])*.65;
    ny[i]=(tile[Math.min(255,y+1)*SIZE+x]-tile[Math.max(0,y-1)*SIZE+x])*.65;
  }
  const surface=document.createElement('canvas');
  return {
    surface,
    bake(width:number,height:number,source:{x:number;y:number}) {
      const scale=Math.min(.65,960/width,720/height);
      surface.width=Math.ceil(width*scale);surface.height=Math.ceil(height*scale);
      const c=surface.getContext('2d')!,pixels=c.createImageData(surface.width,surface.height);
      for(let y=0;y<surface.height;y++)for(let x=0;x<surface.width;x++) {
        const wx=x/scale,wy=y/scale,tx=Math.floor(wx*.58)%512,ty=Math.floor(wy*.58)%512;
        const ix=tx<256?tx:511-tx,iy=ty<256?ty:511-ty,i=iy*SIZE+ix;
        const dx=source.x-wx,dy=source.y-wy,len=Math.hypot(dx,dy,140);
        const sx=nx[i]*(tx<256?1:-1),sy=ny[i]*(ty<256?1:-1);
        const facing=(140-sx*dx-sy*dy)/(len*Math.hypot(sx,sy,1));
        // Art-directed shallow relief, not a depth reconstruction of the plate.
        const tone=Math.round(255*Math.max(.28,Math.min(1,.69+facing*.7)));
        const at=(y*surface.width+x)*4;
        pixels.data[at]=pixels.data[at+1]=pixels.data[at+2]=255;pixels.data[at+3]=tone;
      }
      c.putImageData(pixels,0,0);
    },
    dispose(){surface.width=surface.height=0;}
  };
}
