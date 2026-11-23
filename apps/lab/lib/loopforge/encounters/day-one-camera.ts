import type {SceneFraming,View} from './contract';
import {operationalPose} from './operational-camera';

/** Selected D6 / Level R2 authored views; these are not operational CCTV mounts.
 * Floor coordinates are metres. Actual containment/occlusion awaits scene review. */
type EyeView={eye:readonly[number,number,number];target:readonly[number,number,number];verticalFov:number};
export type AuthoredSetup=readonly[number,number,number,number,number,number];
export const D6_EYES={
 "clerk-register": {
  "eye": [
   124,
   104.2,
   2.6
  ],
  "target": [
   121.5,
   106.7,
   1.1
  ],
  "verticalFov": 0.8
 },
 "clerk-sorting": {
  "eye": [
   124,
   104.2,
   2.6
  ],
  "target": [
   126.5,
   106.7,
   1.1
  ],
  "verticalFov": 0.8
 },
 "pair-work-reply": {
  "eye": [
   139,
   112,
   2.6
  ],
  "target": [
   138.5,
   107.2,
   1.2
  ],
  "verticalFov": 0.8
 },
 "jo-work-reply": {
  "eye": [
   141,
   112,
   2.7
  ],
  "target": [
   140.5,
   106.8,
   1.1
  ],
  "verticalFov": 0.8
 },
 "output-reply": {
  "eye": [
   141.2,
   111.8,
   2.7
  ],
  "target": [
   141.2,
   106.5,
   1.1
  ],
  "verticalFov": 0.8
 },
 "exit-pair": {
  "eye": [
   124.8,
   127.5,
   2.4
  ],
  "target": [
   124.8,
   122,
   1.1
  ],
  "verticalFov": 0.8
 },
 "exit-flow": {
  "eye": [
   127.5,
   132,
   3.3
  ],
  "target": [
   124.6,
   123,
   1.2
  ],
  "verticalFov": 0.8
 }
} as const satisfies Partial<Record<SceneFraming,EyeView>>;
export const D6_WORK:Partial<Record<SceneFraming,AuthoredSetup>>={"intake": [136.6, 105.1, 1.05, 6.8, -2.1, 1.28], "wash": [140.5, 105.1, 1.05, 7.4, -2.1, 1.25], "belt": [144.6, 105.1, 1.05, 8.5, -2.1, 1.24], "forge": [149, 105, 1.15, 8.5, -2.8, 1.24]};
export function authoredSetup(view:EyeView):AuthoredSetup{
 const p=operationalPose({...view,id:'authored',label:'Authored view',source:'D6 / Level R2'});
 return [...view.target,p.radius,p.alpha,p.beta];
}
export function selectedAuthoredSetup(shot:SceneFraming):AuthoredSetup|undefined{
 if(Object.prototype.hasOwnProperty.call(D6_EYES,shot))return authoredSetup(D6_EYES[shot as keyof typeof D6_EYES]);
 return D6_WORK[shot];
}
/** The slowest remaining actual exit position controls the exterior follow.
 * Never average the crowd, move the facade, or use this for the morning walk. */
export function departureCamera(view:Pick<View,'actors'|'dayOne'>):EyeView|undefined{
 if(view.dayOne?.stage!=='departure')return undefined;
 const remaining=view.actors.filter(a=>a.visible!==false);
 if(!remaining.length)return undefined;
 const finalY=Math.min(...remaining.map(a=>a.position[1]/1000));
 const y=Math.max(123,Math.min(146,finalY));
 return {eye:[127.5,y+9,3.3],target:[124.6,y,1.2],verticalFov:.8};
}
export function exteriorEntranceVisible(shot:SceneFraming){return ['approach','passage','exit-pair','exit-flow'].includes(shot);}
