import type {ActorView,View} from '@/lib/loopforge/encounters/contract';
import {finite,type MotionSnapshot,type MotionSource} from './motion-snapshot';

export const MOTION_CASES=[
 {id:'A3-01',phase:'The morning walk',actors:['max','jo']},
 {id:'A3-02',phase:'The morning walk',actors:['max','jo']},
 {id:'A3-03',phase:'ed lifts the card',actors:['bob','sam','ed']},
 {id:'A3-04',phase:'sam releases as ed steps back',actors:['bob','sam','ed']},
 {id:'A3-05',phase:'bob gets up as STILETTO arrives',actors:['bob','sam']},
 {id:'A3-06',phase:'max fourth credential check',actors:['max','jo']},
 {id:'A3-07',phase:'shift-departure',actors:['max','jo','mae']},
 {id:'A3-08',phase:'shift-departure',actors:['max','jo','mae']},
] as const;
export type MotionCaseId=typeof MOTION_CASES[number]['id'];
export type RetainedMotionCast={
 renderedView():View|null;
 motionSnapshot(id:string,view:ActorView,source:MotionSource):MotionSnapshot;
};
export type ProbeContext={
 source:MotionSource;userPaused:boolean;playing:boolean;readingActive:boolean;readingPaused:boolean;
 readSeconds:number;readingStep:unknown;authoritativeProjection:View;authorState:unknown;
 activePhases:readonly {action:string;phase:string;remainingTicks:number}[];
 camera:unknown;canvasRect:{x:number;y:number;width:number;height:number};render:unknown;
};
function clone<T>(x:T):T{return JSON.parse(JSON.stringify(x)) as T;}
export function assertMotionPaused(c:Pick<ProbeContext,'userPaused'|'playing'|'readingActive'|'readingPaused'|'readSeconds'>){
 if(c.playing||!c.userPaused||(c.readingActive&&!c.readingPaused))throw Error('A3 pause world AND reading before export');
 finite([c.readSeconds]);if(c.readSeconds<0)throw Error('A3 invalid reading time');
}
export function createMotionProbe(maxWorkerCalls=32){
 if(!Number.isInteger(maxWorkerCalls)||maxWorkerCalls<1||maxWorkerCalls>32)throw Error('A3 cap must be 1..32');
 let exports=0,calls=0,stopped=false;
 let previous:{tick:number;phase:string;clips:string[]}|null=null;
 return {
  status(){return {exports,workerCalls:calls,stopped,maximumExports:8,maximumWorkerCalls:maxWorkerCalls};},
  stop(error:unknown){stopped=true;return {ok:false as const,error:error instanceof Error?error.message:String(error),exports,workerCalls:calls};},
  snapshot(caseId:string,ids:readonly string[],cast:RetainedMotionCast|null,c:ProbeContext){
   try{
    if(stopped)throw Error('A3 stopped; no retry/reset in this session');
    const spec=MOTION_CASES[exports];if(!spec||spec.id!==caseId)throw Error('A3 unexpected case/order or export cap exhausted');
    assertMotionPaused(c);
    if(!/^[a-f0-9]{40}$/.test(c.source.baseTree)||(c.source.sourceTree!==null&&!/^[a-f0-9]{40}$/.test(c.source.sourceTree))||!Object.keys(c.source.sourceHashes).length||Object.values(c.source.sourceHashes).some(hash=>!/^[a-f0-9]{64}$/.test(hash)))throw Error('A3 missing exact diagnostic build identity');
    if(new Set(ids).size!==ids.length)throw Error('A3 duplicate requested IDs');
    if(ids.length!==spec.actors.length||ids.some((id,i)=>id!==spec.actors[i]))throw Error('A3 missing or unexpected requested ID');
    if(!cast)throw Error('A3 arrival cast unavailable');
    const retained=cast.renderedView();if(!retained)throw Error('A3 cast not yet rendered');
    const v=clone(retained);
    if(v.tick!==c.authoritativeProjection.tick)throw Error('A3 retained render/world tick mismatch');
    if(new Set(v.actors.map(a=>a.id)).size!==v.actors.length)throw Error('A3 duplicate rendered actor IDs');
    const actors=ids.map(id=>{const actor=v.actors.find(a=>a.id===id);if(!actor||actor.character!=='worker'||actor.visible===false)throw Error('A3 missing/unavailable rendered worker '+id);return actor;});
    if(caseId==='A3-06'){
     if(v.credentialStatus?.actorId!=='max'||!['Listening_Gesture','Quiet_Wait'].includes(actors[0].cue?.clip??''))throw Error('A3 expected actual temporary Max check');
    }else if(caseId==='A3-07'||caseId==='A3-08'){
     if(v.dayOne?.stage!=='departure'||!actors.every(a=>/^shift-departure\/(?:0|[1-9]\d*)$/.test(a.action)))throw Error('A3 expected actual departure');
    }else if(!v.phase.includes(spec.phase))throw Error('A3 wrong live phase');
    if(['A3-01','A3-03','A3-05','A3-06'].includes(caseId)&&actors.some(a=>a.seconds<.35||!!a.previous&&(a.blend??1)<1))throw Error('A3 sample not yet unblended/settled');
    if((caseId==='A3-01'||caseId==='A3-02')&&actors.some(a=>a.motion!=='walk'))throw Error('A3 expected moving morning workers');
    if(caseId==='A3-03'&&actors.find(a=>a.id==='sam')?.cue?.clip!=='Attend_Bob')throw Error('A3 Sam help cue differs');
    if(caseId==='A3-03'||caseId==='A3-04'){
     const bob=actors.find(a=>a.id==='bob')!;
     if(bob.cue?.clip!=='Electrocuted_Fall'||bob.cue.rate!==0||Math.abs((bob.cue.start??0)-6.333)>.001)throw Error('A3 held Bob cue differs; save failure and stop');
    }
    if(caseId==='A3-04'&&!c.activePhases.some(p=>p.phase.includes(spec.phase)&&p.remainingTicks===1))throw Error('A3 release sample must be the last phase tick');
    const clips=actors.map(a=>a.cue?.clip??'');
    if(caseId==='A3-02'||caseId==='A3-08'){
     if(!previous||v.tick!==previous.tick+6||v.phase!==previous.phase||clips.some((x,i)=>x!==previous!.clips[i]))throw Error('A3 six-tick pair crossed a phase/clip boundary');
    }
    finite([c.canvasRect.x,c.canvasRect.y,c.canvasRect.width,c.canvasRect.height]);
    if(c.canvasRect.width<=0||c.canvasRect.height<=0)throw Error('A3 empty page canvas');
    if(calls+ids.length>maxWorkerCalls)throw Error('A3 worker call cap exhausted');
    const workers=actors.map(a=>{calls++;return cast.motionSnapshot(a.id,a,c.source);});
    // All data copied synchronously; no async work or pose setter is admitted here.
    const result=clone({ok:true as const,schema:'engine.manual-motion-evidence/1',caseId,exportNumber:exports+1,workerCalls:calls,source:c.source,at:new Date().toISOString(),renderedView:v,authoritativeProjection:c.authoritativeProjection,authorState:c.authorState,readingStep:c.readingStep,readSeconds:c.readSeconds,userPaused:c.userPaused,activePhases:c.activePhases,camera:c.camera,canvasRect:c.canvasRect,render:c.render,workers});
    exports++;previous={tick:v.tick,phase:v.phase,clips};return result;
   }catch(error){stopped=true;throw error;}
  },
 };
}
// One module lifetime, never reset by room changes, pause, seek or a new cast.
// Reloading to bypass the finite session is forbidden by the operation contract.
export const motionProbe=createMotionProbe();
