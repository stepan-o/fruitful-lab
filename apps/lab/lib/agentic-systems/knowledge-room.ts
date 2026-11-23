import type {ActorId} from "./mini-world";
export type Holder=ActorId|"floor";
export type Belief={value:Holder;mode:"observed"|"reported";source:string;beat:number};
export type CustodyRecord={holder:Holder;beliefs:Record<ActorId,Belief>};
export function custodyAt(beat:0|1|2,bobWatching:boolean):CustodyRecord{
 const holder:Holder=beat===0?"bob":beat===1?"floor":"ed";
 const first:Belief={value:"bob",mode:"observed",source:"opening view",beat:0};
 const seen:Belief={value:holder,mode:"observed",source:beat===1?"the drop":beat===2?"the pickup":"opening view",beat};
 return {holder,beliefs:{bob:bobWatching?{...seen}:{...first},ed:{...seen}}};
}
export type HearingSetup={far:boolean;portal:boolean;channel:"local"|"shout"};
export function hearingResult(setup:HearingSetup){
 const distance=setup.far?9:4,range=setup.channel==="local"?6:18;
 const reason=distance>range?"Beyond the selected range":setup.far&&!setup.portal?"The doorway blocks this route":"Received";
 return {distance,range,heard:reason==="Received",reason};
}
/** A received report changes the listener's record, never physical custody. */
export function receiveClaim(prior:CustodyRecord,claim:Holder,setup:HearingSetup,beat:number):CustodyRecord{
 if(!hearingResult(setup).heard)return prior;
 return {...prior,beliefs:{...prior.beliefs,bob:{value:claim,mode:"reported",source:"Ed's statement",beat}}};
}
