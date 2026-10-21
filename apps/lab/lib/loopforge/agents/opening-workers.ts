import manifest from '@/lib/assets/generated/loopforge-opening-workers.json';
import delivery from './opening-worker-delivery.json';
export const openingWorkers=[
 {id:'bob',signature:'Fly eyes · small frame · restless curiosity'},
 {id:'sam',signature:'Round shoulders · heavy porter'},
 {id:'ed',signature:'Long jaw · swept skull · a ready accusation'},
 {id:'jo',signature:'Flat cap · work jacket · ordinary jo'},
 {id:'gus',signature:'Square shoulders · pale yoke · heavy frame'},
 {id:'max',signature:'Tall, narrow frame · long face'},
 {id:'mae',signature:'Box head · compact, fitted frame'},
 {id:'kit',signature:'Barrel forearms · fixed pipe'},
 {id:'lou',signature:'Long neck · beaked face · wiry limbs'},
 {id:'ben',signature:'Round hood · barrel body · thin forearms'},
] as const;
export type OpeningWorkerId=typeof openingWorkers[number]['id'];
export type WorkerDetail='portrait'|'floor'|'console';
export function isOpeningWorker(value:string):value is OpeningWorkerId{return openingWorkers.some(w=>w.id===value);}
export function openingWorkerAsset(worker:OpeningWorkerId,detail:WorkerDetail){
 const key=`${worker}-${detail}` as keyof typeof manifest.assets;
 return {...manifest.assets[key].variants[0],...delivery.workers[worker].levels[detail]};
}
export const openingMotionLabels:Record<string,string>={Rig_Source:'Neutral rig',idle:'Idle',Alert:'Alert',Agree_Gesture:'Agree gesture',Angry_Stomp:'Angry stomp',Carry_Heavy_Object_Walk_inplace:'Carry heavy object',Catching_Breath:'Catching breath',Hot_Walk:'Hot walk · reference',Confused_Scratch:'Confused scratch',Discuss_While_Moving:'Discuss while moving',Electrocuted_Fall:'Electrocuted fall',Electrocution_Reaction:'Electrical reaction',Idle_Turn_Left:'Turn left',Idle_Turn_Right:'Turn right',Listening_Gesture:'Listening gesture',Push_Forward_and_Stop:'Push forward',Victory_Cheer:'Victory cheer',injured_walk:'Injured walk',run_fast_10_inplace:'Run in place',walking_2_inplace:'Walk 2 · in place',Meshy_Walking:'Meshy walking',Meshy_Running:'Meshy running'};
export const openingLoopClips=new Set(['idle','Alert','walking_2_inplace','run_fast_10_inplace','injured_walk','Carry_Heavy_Object_Walk_inplace','Catching_Breath','Hot_Walk','Meshy_Walking','Meshy_Running']);
