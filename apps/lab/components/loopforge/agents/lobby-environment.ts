import type {Scene} from '@babylonjs/core/scene';
import type {Vector3} from '@babylonjs/core/Maths/math.vector';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {LOBBY_CLAIM_DESKS} from '@/lib/loopforge/rooms/arrival-room-layout';
import {roomEnvironmentKit} from './room-environment-kit';

/** Claims hall and approach. The existing imported entrance remains its landmark. */
export function createLobbyEnvironment(scene:Scene){
 const k=roomEnvironmentKit(scene,'Lobby',true),{wall,iron,brass,dark,paper,lamp}=k.palette;
 const b=k.box,p=k.tube,sign=k.signs(['CLAIMS / 01','CLAIMS / 02','ASSIGNMENTS','FORMS','SECURITY']);
 // Occupied hall is 16×11m; the remaining old Lobby rectangle is outdoors.
 b('west enclosure',[.28,6.8,10.7],116.14,116.65,3.4,wall,'west');
 b('east enclosure',[.28,6.8,10.7],131.86,116.65,3.4,wall,'east');
 for(const [x,section]of [[116.35,'west'],[131.65,'east']] as const){
  b('wall plinth',[.4,.4,10.4],x,116.5,.2,iron,section);
  for(const y of [112.6,116.7,120.8]){
   b('rib',[.3,6.8,.25],x,y,3.4,iron,section);
   p('bundled service',[[x,y+.3,.3],[x,y+.3,5.8],[x,y+1,6.1]],.075,iron,section);
   b('high recess',[.04,2.3,2.5],x+(section==='west'?.19:-.19),y,4.5,dark,section);
  }
 }
 for(const y of [112,117,121.55]){
  b('overhead beam',[15.6,.32,.25],124,y,6.52,iron);
  b('beam edge',[15.6,.07,.4],124,y,6.31,brass);
 }
 // Numbered claim bays and terminals are at the edge, outside the ten-worker staging.
 for(const [i,s]of LOBBY_CLAIM_DESKS.entries()){
  b('claim desk top',[1.8,.12,.95],s.x,s.y,1.02,brass);
  for(const dx of [-.68,.68])b('desk pedestal',[.32,.92,.78],s.x+dx,s.y,.46,iron);
  b('paper drawer',[.75,.24,.75],s.x,s.y,.75,wall);
  b('terminal body',[.53,.42,.32],s.x-.42,s.y-.19,1.3,iron);
  b('terminal glass',[.41,.27,.018],s.x-.42,s.y-.015,1.32,lamp);
  b('keyboard',[.48,.045,.2],s.x-.42,s.y+.18,1.105,dark);
  b('paper tray',[.46,.06,.34],s.x+.42,s.y+.05,1.11,iron);
  b('paper in tray',[.36,.012,.25],s.x+.42,s.y+.05,1.15,paper);
  p('desk lamp stem',[[s.x+.7,s.y-.3,1.08],[s.x+.7,s.y-.3,1.6],[s.x+.4,s.y-.3,1.6]],.025,brass);
  b('desk shade',[.35,.1,.25],s.x+.4,s.y-.3,1.59,iron);
  b('desk lamp',[.28,.02,.18],s.x+.4,s.y-.3,1.53,lamp);
  // Claim notices face the centre of the hall; paper stays on the wall/desk.
  b('assignment cabinet',[.22,2.65,2.9],116.38,s.y,2.25,iron,'west');
  b('notice backing',[.035,1.9,2.5],116.51,s.y,2.15,dark,'west');
  for(let j=0;j<6;j++)b('clipped notice',[.018,.35,.29],116.54,s.y-.9+(j%3)*.65,1.75+Math.floor(j/3)*.65,paper,'west');
  sign(i,116.56,s.y,3.35,2.3,-Math.PI/2,'west');
 }
 b('forms cabinet',[1.02,2.55,2.45],130.85,113.5,1.275,iron);
 for(const h of [.45,1.1,1.75])b('forms drawer seam',[.04,.035,2.2],130.31,113.5,h,brass);
 sign(3,130.29,113.5,2.25,1.7,Math.PI/2);
 sign(2,116.56,116.7,5.1,3.2,-Math.PI/2,'west');
 // Quiet inset emblem is well behind the card/fall patch at y112.8.
 for(const y of [117.2,119.7])b('emblem border',[4.1,.014,.055],124,y,.005,brass);
 for(const x of [121.95,126.05])b('emblem border',[.055,.014,2.5],x,118.45,.005,brass);
 b('emblem inner bar',[2.2,.013,.055],124,118.45,.005,brass);
 for(const x of [120.6,129.4])b('central aisle edge',[.045,.016,8.2],x,117.55,.006,brass);
 // Arrival facade stays the existing loaded kit. Only flank services are added.
 for(const x of [116.45,131.55]){
  p('facade riser',[[x,122.25,.2],[x,122.25,6.5],[x+(x<124?.65:-.65),122.25,6.8]],.11,brass,'facade');
  b('facade light housing',[.36,.65,.3],x,122.5,4.35,iron,'facade');
  b('facade lamp',[.25,.5,.08],x,122.7,4.35,lamp,'facade');
 }
 b('entrance drain',[9.5,.015,.2],124,123,.006,dark);
 for(let x=119.4;x<128.7;x+=.35)b('drain bar',[.055,.019,.19],x,123,.017,brass);
 const result=k.finish(),westX=worldPoint(116,116)[0],eastX=worldPoint(132,116)[0];
 return {updateCamera(camera:Vector3,showEntrance:boolean){result.section('west',camera.x>=westX);result.section('east',camera.x<=eastX);result.section('facade',showEntrance);},dispose:result.dispose};
}
