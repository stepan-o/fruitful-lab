import manifest from '@/lib/assets/generated/loopforge-opening-workers.json';
import delivery from './opening-worker-delivery.json';
export const openingWorkers=[
 {id:'bob',height:1.4,signature:'Fly eyes · small frame · restless curiosity'},
 {id:'sam',height:1.65,signature:'Round shoulders · heavy porter'},
 {id:'ed',height:1.72,signature:'Long jaw · swept skull · a ready accusation'},
 {id:'jo',height:1.56,signature:'Flat cap · work jacket · ordinary jo'},
 {id:'gus',height:1.76,signature:'Square shoulders · pale yoke · heavy frame'},
 {id:'max',height:1.84,signature:'Tall, narrow frame · long face'},
 {id:'mae',height:1.48,signature:'Box head · compact, fitted frame'},
 {id:'kit',height:1.6,signature:'Barrel forearms · fixed pipe'},
 {id:'lou',height:1.75,signature:'Long neck · beaked face · wiry limbs'},
 {id:'ben',height:1.44,signature:'Round hood · barrel body · thin forearms'},
] as const;
export type OpeningWorkerId=typeof openingWorkers[number]['id'];
export type WorkerDetail='portrait'|'floor'|'console';
export function isOpeningWorker(value:string):value is OpeningWorkerId{return openingWorkers.some(w=>w.id===value);}
export function openingWorkerAsset(worker:OpeningWorkerId,detail:WorkerDetail){
 const key=`${worker}-${detail}` as keyof typeof manifest.assets;
 return {...manifest.assets[key].variants[0],...delivery.workers[worker].levels[detail]};
}
export const openingMotionLabels:Record<string,string>={Quiet_Wait:'Quiet checkpoint wait · restrained idle',Kneel_Source:'Kneel and stand · source',Kneel_To_Help:'Kneel beside bob · fitted',Attend_Bob:'Steady bob · fitted',Rise_From_Help:'Rise after helping bob · fitted',Rig_Source:'Neutral rig',Stow_Card:'Keep the found card',Stow_ID:'Put own ID away',Draw_ID:'Take own ID out',Pickup_Card:'Pick up bob’s card · fitted',Male_Bend_Over_Pick_Up:'Bend over and pick up · source',ID_Ready:'ID ready · fitted hold',ID_Walk:'Walk with ID',ID_Limp:'Limp with ID',Checkpoint_Get_Up:'Checkpoint recovery · candidate',idle:'Idle',Alert:'Alert',Agree_Gesture:'Agree gesture',Angry_Stomp:'Angry stomp',Carry_Heavy_Object_Walk_inplace:'Carry heavy object',Catching_Breath:'Catching breath',Hot_Walk:'Hot walk · reference',Confused_Scratch:'Confused scratch',Discuss_While_Moving:'Discuss while moving',Electrocuted_Fall:'Electrocuted fall',Electrocution_Reaction:'Electrical reaction',Idle_Turn_Left:'Turn left',Idle_Turn_Right:'Turn right',Listening_Gesture:'Listening gesture',Push_Forward_and_Stop:'Push forward',Victory_Cheer:'Victory cheer',injured_walk:'Injured walk',run_fast_10_inplace:'Run in place',walking_2_inplace:'Walk 2 · in place',Meshy_Walking:'Meshy walking',Meshy_Running:'Meshy running'};
export const openingLoopClips=new Set(['Quiet_Wait','Attend_Bob','ID_Ready','ID_Walk','ID_Limp','idle','Alert','walking_2_inplace','run_fast_10_inplace','injured_walk','Carry_Heavy_Object_Walk_inplace','Catching_Breath','Hot_Walk','Meshy_Walking','Meshy_Running']);
