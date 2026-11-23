import type {Action,PropLocation,PropTransfer,SceneProp,World} from './contract';

const same=(a:PropLocation,b:PropLocation)=>a.kind===b.kind&&(a.kind==='floor'&&b.kind==='floor'
 ?a.position[0]===b.position[0]&&a.position[1]===b.position[1]&&a.yaw===b.yaw
 :a.kind!=='floor'&&b.kind!=='floor'&&a.agent===b.agent&&(a.kind!=='hand'||b.kind==='hand'&&a.socket===b.socket&&(a.grip??'palm')===(b.grip??'palm')));
const valid=(s:World,p:PropLocation)=>p.kind==='floor'
 ?p.position.every(Number.isFinite)&&Number.isFinite(p.yaw)
 :!!s.agents[p.agent]&&(p.kind!=='hand'||['left','right'].includes(p.socket));
const point=(s:World,p:PropLocation)=>p.kind==='floor'?p.position:s.agents[p.agent].position;

export const propCustodian=(s:World,id:string):string|null=>{const location=s.props?.[id]?.location;return location&&location.kind!=='floor'?location.agent:null;};
export const custodyBelief=(id:string)=>`prop.${id}.holder`;
export const propResources=(action:Action)=>[...new Set([...action.requires.flatMap(c=>'prop'in c?[`prop:${c.prop}`]:[]),...action.phases.flatMap(p=>(p.transfers??[]).map(t=>`prop:${t.prop}`))])];
export function propDefinitionError(s:World,action:Action):string|null {
 for(const c of action.requires)if('prop'in c&&(!s.props?.[c.prop]||!s.agents[c.heldBy]))return 'Invalid prop condition.';
 for(const phase of action.phases){
  const seen=new Set<string>();
  for(const t of phase.transfers??[]){
   if(t.observedBy?.some(id=>!action.participants.includes(id)))return 'Invalid prop observer.';
   if(seen.has(t.prop)||!s.props?.[t.prop]||![t.from,t.to].every(p=>valid(s,p)&&('agent'in p?action.participants.includes(p.agent):true)))return 'Invalid prop transfer.';
   seen.add(t.prop);
  }
 }
 return null;
}
/** Atomically commit contact outcomes. Stale custody or an out-of-reach partner
 * cancels the phase before any other effect is awarded. Location records remain
 * immutable, so replay/cancellation cannot rewrite an earlier snapshot. */
export function applyPropTransfers(s:World,transfers:readonly PropTransfer[]):Record<string,SceneProp>|null {
 if(!transfers.length)return s.props??{};
 const next={...s.props},seen=new Set<string>();
 for(const t of transfers){
  const prop=next[t.prop];
  if(seen.has(t.prop)||!prop||!valid(s,t.from)||!valid(s,t.to)||!same(prop.location,t.from))return null;
  const a=point(s,t.from),b=point(s,t.to);
  if(Math.hypot(a[0]-b[0],a[1]-b[1])>1400)return null;
  // A hand cannot silently hold two cards. Stowed inventory can contain several.
  if(t.to.kind==='hand'&&Object.values(next).some(p=>p.id!==prop.id&&p.location.kind==='hand'&&t.to.kind==='hand'&&p.location.agent===t.to.agent&&p.location.socket===t.to.socket))return null;
  next[t.prop]={...prop,location:t.to,previous:{location:prop.location,tick:s.tick}};seen.add(t.prop);
 }
 return next;
}
