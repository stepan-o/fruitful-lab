import {arrival} from './arrival';
import {admit,advance,cancel,project} from './kernel';
import {inspectOwnCard,inspectAtSecurity,selectCardSeed,CARD_SEEDS} from './card-arc';
import type {Action,World,Registry} from './contract';
const setup=()=>{
 const t=arrival(),s=t.world;s.agents.bob.position=[123900,111500];s.props!['bob:id']={...s.props!['bob:id'],location:{kind:'stowed',agent:'jo'}};
 s.facts['checkpoint.cleared.bob']=true;s.facts['checkpoint.admission.bob']='unchecked-after-reprimand';return t;
};
function run(s:World,a:Action){const registry:Registry={[a.id]:a},t=arrival();let next=admit(s,{id:a.id,action:a.id,initiator:a.participants[0]},registry,t.space);for(let i=0;i<100&&next.active.length;i++)next=advance(next,registry,t.space);return next;}
it('selects reproducible compatible holder/motive pairs without choosing one for the author',()=>{
 expect(CARD_SEEDS).toHaveLength(4);expect(selectCardSeed(4)).toEqual(selectCardSeed(0));expect(selectCardSeed(3).holder).toBe('jo');expect(()=>selectCardSeed(-1)).toThrow();expect(()=>selectCardSeed(.5)).toThrow();
});
it('bob can discover the loss himself without learning custody or broadcasting his search',()=>{
 const t=setup(),before=JSON.stringify(t.world),s=run(t.world,inspectOwnCard(t.world,'bob','look'));
 expect(JSON.stringify(t.world)).toBe(before);expect(s.facts['credential.missing.bob']).toBe(true);expect(s.facts['card.search.bob']).toBe('active');
 expect(s.agents.bob.beliefs['prop.bob:id.holder'].value).toBe('unknown');expect(s.agents.bob.beliefs['card.search.bob'].value).toBe('active');
 expect(s.agents.limen.beliefs['card.search.bob']).toBeUndefined();expect(s.agents.jo.beliefs['credential.missing.bob']).toBeUndefined();expect(project(s,{}).props?.some(p=>p.id==='bob:id')).toBe(false);
});
it('the next LIMEN check blocks admission and requests intervention without inventing a suspect',()=>{
 const t=setup(),s=run(t.world,inspectAtSecurity(t.world,'bob','limen','next-limen-check'));
 expect(s.facts).toMatchObject({'checkpoint.cleared.bob':false,'checkpoint.admission.bob':'blocked-missing','checkpoint.intervention.bob':true,'card.search.bob':'active'});
 expect(s.agents.limen.beliefs['credential.missing.bob'].value).toBe(true);expect(s.agents.limen.beliefs['prop.bob:id.holder']).toBeUndefined();expect(s.props!['bob:id'].location).toEqual({kind:'stowed',agent:'jo'});
});
it('STILETTO admits bob without discovering or resolving the loss, and a later LIMEN check still sees it',()=>{
 const t=setup();t.world.agents.stiletto.position=[123900,110400];
 const through=run(t.world,inspectAtSecurity(t.world,'bob','stiletto','through'));
 expect(through.facts['checkpoint.cleared.bob']).toBe(true);expect(through.facts['checkpoint.admission.bob']).toBe('throughput');expect(through.facts['credential.missing.bob']).toBeUndefined();expect(through.facts['card.search.bob']).toBeUndefined();
 const later=run(through,inspectAtSecurity(through,'bob','limen','later'));expect(later.facts['checkpoint.intervention.bob']).toBe(true);
 const searched=run(t.world,inspectOwnCard(t.world,'bob','search'));const again=run(searched,inspectAtSecurity(searched,'bob','stiletto','through-again'));expect(again.facts['card.search.bob']).toBe('active');
});
it('recovery changes the later check and never recreates a missing card to force the plot',()=>{
 const t=setup();t.world.facts['card.search.bob']='active';t.world.props!['bob:id']={...t.world.props!['bob:id'],location:{kind:'stowed',agent:'bob'}};
 const s=run(t.world,inspectAtSecurity(t.world,'bob','limen','recovered'));
 expect(s.facts).toMatchObject({'checkpoint.cleared.bob':true,'checkpoint.admission.bob':'credential','checkpoint.intervention.bob':false,'credential.missing.bob':false,'card.search.bob':'recovered'});
 expect(s.agents.bob.beliefs['prop.bob:id.holder'].value).toBe('bob');
});
it('a proposed inspection is invalidated if custody changes before admission or during it',()=>{
 const t=setup(),a=inspectOwnCard(t.world,'bob','look'),registry={[a.id]:a};
 const recovered={...t.world,props:{...t.world.props,'bob:id':{...t.world.props!['bob:id'],location:{kind:'stowed' as const,agent:'bob'}}}};
 expect(admit(recovered,{id:'look',action:'look',initiator:'bob'},registry,t.space).events.at(-1)?.kind).toBe('rejected');
 let s=admit(t.world,{id:'look',action:'look',initiator:'bob'},registry,t.space);expect(s.held['prop:bob:id']).toBe('look');
 s={...s,props:recovered.props};for(let i=0;i<30;i++)s=advance(s,registry,t.space);
 expect(s.events.at(-1)?.kind).toBe('cancelled');expect(s.facts['credential.missing.bob']).toBeUndefined();
});
it('an interrupted or distant check cannot produce a clearance result',()=>{
 const t=setup(),a=inspectAtSecurity(t.world,'bob','limen','check'),registry={[a.id]:a};
 const started=admit(t.world,{id:'check',action:'check',initiator:'bob'},registry,t.space),stopped=cancel(started,'check');expect(stopped.facts['checkpoint.intervention.bob']).toBeUndefined();
 t.world.agents.bob.position=[123900,120000];expect(admit(t.world,{id:'check',action:'check',initiator:'bob'},registry,t.space).events.at(-1)?.kind).toBe('rejected');
});
it('rejects an observation addressed to an unknown or nonparticipating agent',()=>{
 const t=setup(),a=inspectOwnCard(t.world,'bob','bad');a.phases[0].effects=[{fact:'secret',value:true,observedBy:['limen']}];
 expect(admit(t.world,{id:'bad',action:'bad',initiator:'bob'},{bad:a},t.space).events.at(-1)?.detail).toBe('Invalid effect observer.');
});
