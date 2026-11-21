// Both sprite players project the same authored ground marks in factory metres.
import pack from '../../public/loopforge-design/floor-correction/v1/manifest.json';

export const roomMaterials=pack.rooms;
export const materialFiles=Object.values(pack.rooms).flatMap(room=>[room.material.file,room.room.file]);
export const materialRoot='/loopforge-design/floor-correction/v1/';
type Projection=(x:number,y:number)=>number[];

export function drawRoomMaterial(ctx:CanvasRenderingContext2D,w:number,h:number,room:keyof typeof pack.rooms,
  xy:Projection,images:Record<string,CanvasImageSource>,detail=true){
  const {material,room:lighting}=pack.rooms[room];
  const [ox,oy]=material.originM,[dx,dy]=material.extentM;
  const [left,top]=xy(ox,oy),[right,bottom]=xy(ox+dx,oy+dy);
  const tileW=right-left,tileH=bottom-top;
  if(tileW<=0||tileH<=0)return;
  function draw(file:string,x:number,y:number,width:number,height:number){
    const [x0,y0]=xy(x,y).map(Math.round),[x1,y1]=xy(x+width,y+height).map(Math.round);
    ctx.drawImage(images[file],x0,y0,x1-x0,y1-y0);
  }
  const cols=Math.ceil((w-left)/tileW),rows=Math.ceil((h-top)/tileH);
  for(let row=Math.floor(-top/tileH);row<rows;row++)
    for(let col=Math.floor(-left/tileW);col<cols;col++)
      draw(material.file,ox+col*dx,oy+row*dy,dx,dy);
  if(detail)draw(lighting.file,lighting.originM[0],lighting.originM[1],lighting.extentM[0],lighting.extentM[1]);
}

// S1/S2 share the S5 export's [10,326] south ground pivot at 64 px/m.
// Foreshorten its ground run while keeping the upright above the north post.
export function drawQueueRail(ctx:CanvasRenderingContext2D,image:CanvasImageSource,xy:Projection,
  rect:{x:number;y:number;w:number;h:number},scale:number){
  const [x,north]=xy(rect.x+rect.w/2,rect.y),[,south]=xy(rect.x+rect.w/2,rect.y+rect.h);
  const k=scale/64,top=north-(326-rect.h*64)*k;
  ctx.drawImage(image,Math.round(x-10*k),Math.round(top),20*k,south-top+4*k);
}
