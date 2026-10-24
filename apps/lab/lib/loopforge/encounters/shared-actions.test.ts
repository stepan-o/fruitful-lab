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

it('isolates nested viewer positions and credential custody from the authoritative world',()=>{
 const t=arrival(),before=JSON.stringify(t.world);
 const snapshot=encounterSnapshot(t.world,t.registry,{worldId:'day-one',runId:'copy-proof',seed:0});
 const view=viewFromSnapshot(snapshot),bob=view.actors.find(a=>a.id==='bob')!;
 expect(bob.position).not.toBe(t.world.agents.bob.position);
 expect(view.props!.length).toBeGreaterThan(0);
 const card=view.props![0];
 expect(card).not.toBe(t.world.props![card.id]);
 expect(card.location).not.toBe(t.world.props![card.id].location);
 Object.assign(bob.position,{0:-123});
 Object.assign(card.location,{agent:'viewer-mutation'});
 expect(JSON.stringify(t.world)).toBe(before);
 const fresh=encounterSnapshot(t.world,t.registry,{worldId:'day-one',runId:'copy-proof',seed:0});
 expect(fresh.state.agents.find(a=>a.id==='bob')!.position).toEqual(t.world.agents.bob.position);
 expect(fresh.state.items.find(p=>p.id===card.id)!.location).toEqual(t.world.props![card.id].location);
});
