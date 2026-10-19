import type {ReadabilitySettings} from './settings';
export function changeReadabilityRoom(s:ReadabilitySettings,patch:Partial<ReadabilitySettings>):ReadabilitySettings {
 const next={...s,...patch};
 if(patch.floor!==undefined)next[next.room==='security'?'securityFloor':'conveyorFloor']=patch.floor;
 else if(patch.room)next.floor=next.room==='security'?next.securityFloor:next.conveyorFloor;
 return next;
}
