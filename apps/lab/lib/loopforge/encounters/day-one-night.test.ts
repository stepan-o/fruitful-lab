import {arrival} from './arrival';
import {admit} from './kernel';
function closedShift(){
 const t=arrival();t.world.facts={...t.world.facts,'line.output':3,'day.stage':'departure','line.staffed':false,'line.feed-stopped':true,'line.drive-stopped':true,'line.in-flight':false};
 for(const a of Object.values(t.world.agents)){a.room='outside';a.position=[124600,146000];t.world.facts[`day.departed.${a.id}`]=true;}
 return t;
}
it.each([['line.feed-stopped',false],['line.drive-stopped',false],['line.in-flight',true],['line.staffed',true]] as const)('night rejects an unfinished shutdown: %s', (key,value)=>{
 const t=closedShift();t.world.facts[key]=value;const s=admit(t.world,{id:'day-one-night',action:'day-one-night',initiator:'bob'},t.registry,t.space);
 expect(s.active).toEqual([]);expect(s.facts['day.stage']).toBe('departure');expect(s.facts['day.complete']).toBeUndefined();expect(s.events.at(-1)?.kind).toBe('rejected');
});
it('admits night after actual departure flags and completed shutdown',()=>{
 const t=closedShift(),s=admit(t.world,{id:'day-one-night',action:'day-one-night',initiator:'bob'},t.registry,t.space);expect(s.active).toHaveLength(1);
});
