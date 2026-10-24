import type {View} from './contract';
const securityShots=new Set(['assembly','impact','card','passage','threshold','checkpoint','sam-inspection','aftermath','limen-emphasis','workers-reverse','doorway-pressure','security-check-reverse']);
export function authoredCameraLocked(view:Pick<View,'dayOne'|'framing'>,reviewOverride=false){return !reviewOverride&&(view.dayOne?.stage==='entry'||securityShots.has(view.framing??''));}
/** Clear queued inertia as well as disconnecting all Babylon input handlers. */
export function clearCameraInput(camera:{detachControl:()=>void;inertialAlphaOffset:number;inertialBetaOffset:number;inertialRadiusOffset:number;inertialPanningX:number;inertialPanningY:number}){camera.detachControl();camera.inertialAlphaOffset=0;camera.inertialBetaOffset=0;camera.inertialRadiusOffset=0;camera.inertialPanningX=0;camera.inertialPanningY=0;}
