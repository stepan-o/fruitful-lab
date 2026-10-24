import type {Scene} from '@babylonjs/core/scene';
import type {Vector3} from '@babylonjs/core/Maths/math.vector';
import {worldPoint} from '@/lib/loopforge/spatial/floor';
import {SECURITY_DESKS} from '@/lib/loopforge/rooms/arrival-room-layout';
import {roomEnvironmentKit} from './room-environment-kit';

/** The shared compact ed/gus posts and loaded desk/portal kit stay authoritative.
 * This gives their work a room, keeps the confrontation pocket and route open. */
export function createSecurityEnvironment(scene:Scene){
 const k=roomEnvironmentKit(scene,'Security',false),{wall,iron,brass,dark,paper,lamp}=k.palette;
 const b=k.box,p=k.tube,sign=k.signs(['RECORDS','INSPECTION','CONVEYOR →','SECURITY','DOCUMENTS']);
 b('north enclosure',[12,6.8,.2],126,103.4,3.4,wall);
 b('east records partition',[.2,6.8,4.82],128.1,108.41,3.4,wall,'east');
 b('connector south return',[4,6.8,.2],130,106.1,3.4,wall);
 b('west records partition',[.2,6.8,7.32],119.9,107.16,3.4,wall,'west');
 b('west enclosure',[.28,6.8,11.7],116.14,105.15,3.4,wall,'west');
 b('east north return',[.28,6.8,2.7],131.86,100.35,3.4,wall,'east');
 b('east south return',[.28,6.8,5],131.86,108.5,3.4,wall,'east');
 b('Conveyor upper reveal',[.28,2,4],131.86,104,5.8,wall,'east');
 for(const x of [119,129])b('checkpoint south return',[6,6.8,.18],x,110.91,3.4,wall,'south');
 b('checkpoint upper reveal',[4,1.8,.18],124,110.91,5.9,wall,'south');
 for(const x of [120.2,124,127.8,131.6]){
  b('rear pilaster',[.28,6.8,.45],x,103.3,3.4,iron);
  b('rear column foot',[.55,.35,.55],x,103.3,.175,brass);
 }
 for(const y of [103.6,107,110.55]){
  b('roof beam',[7.6,.32,.22],124,y,6.5,iron);
  b('roof flange',[7.6,.065,.4],124,y,6.31,brass);
 }
 // Clerical density is concentrated behind the desks, not behind hands and documents.
 for(const x of [121.1,124,126.9]){
  b('records cabinet',[1.8,2.75,.48],x,103.33,1.65,iron);
  for(const h of [.7,1.35,2,2.65]){
   b('record drawer',[1.6,.55,.045],x,103.31,h,wall);
   b('drawer pull',[.28,.055,.05],x,103.36,h,brass);
  }
 }
 for(const [i,desk] of SECURITY_DESKS.entries()){
  const [x,y]=desk.center;
  sign(i,x,103.52,3.4,2.6);
  b('inspection canopy',[1.9,.22,1],x,y,4.25,iron);
  b('neutral task diffuser',[1.6,.045,.6],x,y,4.1,lamp);
  p('canopy suspension',[[x-.65,y,4.35],[x-.65,y,6.35]],.025,iron);
  p('canopy suspension',[[x+.65,y,4.35],[x+.65,y,6.35]],.025,iron);
  // Desk-mounted forms are contained inside existing collision footprints.
  b('document tray',[.45,.06,.34],x+.4,y,1.13,iron);
  b('document stack',[.35,.045,.28],x+.4,y,1.18,paper);
  for(const dx of [-.7,.7])b('clerk standing edge',[.045,.012,1.1],x+dx,desk.root[1],.005,brass);
 }
 // Passive directory. No green/red fiction about gate or credential state.
 b('destination board',[3.2,1.15,.18],125.5,103.25,3.7,iron);
 sign(2,125.5,103.37,3.9,2.9);
 sign(4,125.5,103.37,3.47,2.2);
 p('north utility trunk',[[120.2,103.25,5.15],[131.4,103.25,5.15]],.09,brass);
 for(const x of [120.3,131.3])p('service drop',[[x,103.35,5.15],[x,103.35,.4]],.07,brass);
 // Short threshold edges imply controlled passage without fencing the crowd.
 for(const x of [122.25,125.75]){
  b('threshold edge',[.07,.014,1.8],x,110.1,.005,brass);
  for(const y of [109.45,110.05,110.65])b('threshold floor lamp',[.11,.02,.18],x,y,.012,lamp);
 }
 for(const y of [103.7,105.8])b('Conveyor threshold edge',[1.4,.014,.055],131.1,y,.005,brass);
 const result=k.finish(),southZ=worldPoint(124,111)[2],westX=worldPoint(120,105)[0],eastX=worldPoint(128,105)[0];
 return {updateCamera(camera:Vector3){result.section('south',camera.z>=southZ);result.section('west',camera.x>=westX);result.section('east',camera.x<=eastX);},dispose:result.dispose};
}
