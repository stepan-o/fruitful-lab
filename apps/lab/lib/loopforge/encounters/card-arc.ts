import type {Action,Condition,Effect,World} from './contract';
import {custodyBelief,propCustodian} from './props';

/** ed is the approved first rehearsal seed. The numeric seed selects a
 * compatible pair once; subsequent custody is exclusively the prop system's. */
export const CARD_SEEDS=[
 {id:'ed-procedure',holder:'ed',motive:'keep-at-security'},
 {id:'max-joke',holder:'max',motive:'joke-then-concealment'},
 {id:'lou-favour',holder:'lou',motive:'be-needed'},
 {id:'jo-avoidance',holder:'jo',motive:'avoid-involvement'},
] as const;
export type CardSeed=typeof CARD_SEEDS[number];
export function selectCardSeed(seed:number):CardSeed {
 if(!Number.isSafeInteger(seed)||seed<0)throw Error('A card seed must be a non-negative safe integer.');
 return CARD_SEEDS[seed%CARD_SEEDS.length];
}
const card=(worker:string)=>`${worker}:id`;
const missing=(worker:string)=>`credential.missing.${worker}`;
const search=(worker:string)=>`card.search.${worker}`;
const hasCard=(s:World,worker:string)=>propCustodian(s,card(worker))===worker;
function requireWorker(s:World,worker:string){if(!s.agents[worker]||s.props?.[card(worker)]?.owner!==worker)throw Error('The worker must own an existing credential.');}
const custody=(worker:string,held:boolean):Condition=>({prop:card(worker),heldBy:worker,equals:held});

/** An agent can inspect their own belongings independently of any checkpoint.
 * Absence reveals no holder. The proposed action still requires engine admission. */
export function inspectOwnCard(s:World,worker:string,id:string):Action {
 requireWorker(s,worker);const held=hasCard(s,worker),effects:Effect[]=[
  {fact:missing(worker),value:!held,observedBy:[worker]},
  {agent:worker,observe:{fact:custodyBelief(card(worker)),value:held?worker:'unknown'}},
 ];
 if(!held||s.facts[search(worker)]==='active')effects.push({fact:search(worker),value:held?'recovered':'active',observedBy:[worker]});
 return {id,room:s.agents[worker].room,participants:[worker],resources:[],requires:[custody(worker,held)],reason:'Look for my admission card.',phases:[{id:'Check the card holder',ticks:30,perform:[{agent:worker,motion:'idle'}],effects}]};
}

/** Policy is the inspector's. STILETTO's throughput admission does not inspect
 * inventory or complete the worker's search. LIMEN requires a valid card in the
 * worker's possession. The second encounter consumes the world left by day one. */
export function inspectAtSecurity(s:World,worker:string,inspector:string,id:string):Action {
 requireWorker(s,worker);const supervisor=s.agents[inspector];
 if(!supervisor||!['limen','stiletto'].includes(supervisor.character))throw Error('A Security supervisor is required.');
 const throughput=supervisor.character==='stiletto',held=hasCard(s,worker),valid=s.facts[`credential.valid.${worker}`]===true;
 const admitted=throughput||(held&&valid),observers=[worker,inspector];
 const effects:Effect[]=[
  {fact:`checkpoint.cleared.${worker}`,value:admitted,observedBy:observers},
  {fact:`checkpoint.admission.${worker}`,value:throughput?'throughput':admitted?'credential':held?'blocked-invalid':'blocked-missing',observedBy:observers},
  {fact:`checkpoint.intervention.${worker}`,value:!admitted,observedBy:observers},
 ];
 const requires:Condition[]=[{agent:worker,near:inspector,within:1800}];
 if(!throughput){
  requires.push(custody(worker,held));
  if(held)requires.push({fact:`credential.valid.${worker}`,equals:s.facts[`credential.valid.${worker}`]});
  effects.push({fact:`checkpoint.card-checked.${worker}`,value:true,observedBy:observers},{fact:missing(worker),value:!held,observedBy:observers});
  effects.push({agent:worker,observe:{fact:custodyBelief(card(worker)),value:held?worker:'unknown'}});
  if(!held||s.facts[search(worker)]==='active')effects.push({fact:search(worker),value:held?'recovered':'active',observedBy:[worker]});
 }
 return {id,room:s.agents[worker].room,...(supervisor.room!==s.agents[worker].room?{adjacentRoom:supervisor.room}:{}),participants:observers,resources:[],requires,reason:throughput?'Get the worker onto the line.':'Check the worker’s credential.',phases:[{id:throughput?'Go through':'Show your card',ticks:40,perform:[{agent:worker,motion:'listen'},{agent:inspector,motion:'guard'}],effects}]};
}
