import {encounterSnapshot,viewFromSnapshot} from './encounter-boundary';
import {arrival} from './arrival';
import {individualAction,type AgentRequest} from './shared-actions';
it('rejects a future action kind rather than silently compiling it as an inspection',()=>{
 const t=arrival(),request={id:'future-release',kind:'release-station',actor:'limen',target:'sam',object:'security:register',ticks:20} as unknown as AgentRequest;
 expect(()=>individualAction(t.world,request)).toThrow(/Unsupported individual action/);
 expect(t.world.active).toEqual([]);expect(t.world.facts['checkpoint.cleared.sam']).toBeUndefined();
});

it('versions occupancy-bearing snapshots and rejects the previous shape explicitly',()=>{
 const t=arrival(),snap=encounterSnapshot(t.world,t.registry,{worldId:'day-one',runId:'r8',seed:0});
 expect(snap.schema).toBe('loopforge.encounter.local/3');expect(viewFromSnapshot(snap).dayOne?.stationOccupancy).toBeDefined();
 const old=structuredClone(snap);(old as {schema:string}).schema='loopforge.encounter.local/2';expect(()=>viewFromSnapshot(old)).toThrow('Unsupported encounter schema');
});
