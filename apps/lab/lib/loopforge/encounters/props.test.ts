import {arrival} from './arrival';
import {applyPropTransfers} from './props';
import {admit,advance,cancel,project} from './kernel';
import {replay,rehearsal} from './rehearsals';
import type {PropTransfer,Registry} from './contract';
const held=(agent:string)=>({kind:'hand' as const,agent,socket:'right' as const});
const setup=()=>{const t=arrival();t.world.agents.bob.position=[124000,114000];t.world.agents.sam.position=[125000,114000];return t;};
const transfer:PropTransfer={prop:'bob:id',from:held('bob'),to:held('sam')};
it('moves one existing card atomically without changing its owner or prior snapshot',()=>{
 const {world}=setup(),before=JSON.stringify(world),next=applyPropTransfers(world,[transfer]);
 expect(next?.['bob:id']).toMatchObject({owner:'bob',location:held('sam')});expect(JSON.stringify(world)).toBe(before);
 expect(applyPropTransfers({...world,props:next!},[transfer])).toBeNull();
});
it('rejects stale, unreachable, duplicate and occupied-hand transfers as one batch',()=>{
 const {world}=setup();expect(applyPropTransfers(world,[transfer,{...transfer,prop:'missing'}])).toBeNull();
 expect(applyPropTransfers(world,[transfer,transfer])).toBeNull();world.agents.sam.position=[128000,114000];expect(applyPropTransfers(world,[transfer])).toBeNull();
 world.agents.sam.position=[125000,114000];world.props!['sam:id']={...world.props!['sam:id'],location:held('sam')};expect(applyPropTransfers(world,[transfer])).toBeNull();
 expect(applyPropTransfers(world,[{...transfer,to:{...held('sam'),grip:'edge'}}])).toBeNull();
});
it('reserves a prop, releases it on cancellation and never awards an interrupted handover',()=>{
 const t=setup(),registry:Registry={give:{id:'give',room:'lobby',participants:['bob','sam'],resources:[],requires:[],reason:'Hand over the card.',phases:[{id:'offer',ticks:3,perform:[],transfers:[transfer],effects:[{fact:'handover.finished',value:true}]}]}};
 const s=admit(t.world,{id:'give',action:'give',initiator:'bob'},registry,t.space);expect(s.held['prop:bob:id']).toBe('give');
 const stopped=cancel(s,'give');expect(stopped.props!['bob:id'].location).toEqual(held('bob'));expect(stopped.facts['handover.finished']).toBeUndefined();expect(stopped.held).toEqual({});
 let changed={...s,props:{...s.props,'bob:id':{...s.props!['bob:id'],location:{kind:'stowed' as const,agent:'bob'}}}};
 for(let i=0;i<3;i++)changed=advance(changed,registry,t.space) as typeof changed;
 expect(changed.events.at(-1)?.kind).toBe('cancelled');expect(changed.facts['handover.finished']).toBeUndefined();
});
it('keeps the same card with the finder while bob leaves unaware and unchecked',()=>{
 const t=rehearsal('arrival','care');let tick=1;const starts:Record<string,number>={};for(const a of Object.values(t.registry))for(const p of a.phases){starts[p.id]=tick;tick+=p.ticks;}
 expect(t.world.facts['card.seed.bob']).toBe('ed-procedure');
 const during=replay(t,starts['STILETTO passes without stopping']);expect(during.props!['bob:id'].location).toEqual({kind:'stowed',agent:'ed'});
 const collected=replay(t,starts['ed lifts the card']);expect(collected.props!['bob:id'].location).toEqual({kind:'hand',agent:'ed',socket:'right',grip:'edge'});
 const kept=replay(t,starts['ed keeps the found card']);expect(kept.props!['bob:id'].location).toEqual({kind:'stowed',agent:'ed'});expect(kept.props!['bob:id'].owner).toBe('bob');
 const end=replay(t,t.total);expect(end.props!['bob:id'].location).toEqual({kind:'stowed',agent:'ed'});expect(project(end,t.registry).props?.some(p=>p.id==='bob:id')).toBe(false);
 expect(end.agents.ed.beliefs['prop.bob:id.holder']).toMatchObject({value:'ed',mode:'observed'});
 expect(end.agents.bob.beliefs['prop.bob:id.holder'].value).toBe('bob');expect(end.facts['credential.missing.bob']).toBeUndefined();
 expect(end.facts['checkpoint.admission.bob']).toBe('unchecked-after-reprimand');expect(end.facts['checkpoint.card-checked.bob']).toBe(false);
});
