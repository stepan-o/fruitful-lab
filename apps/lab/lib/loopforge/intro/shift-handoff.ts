import type {Intro} from './simulation';
import type {Inheritance} from '../shifts/simulation';

// The rehearsal fixture was made at this same boundary. The ordinary run supplies its own actors and props.
export function departure(sim:Intro):Inheritance{
  if(!sim.finished)throw Error('The crew has not finished Day 1');
  const w=sim.world;
  const agents=Object.values(w.agents).map(a=>({
    id:a.id,character:a.character,room:a.room,position:a.position,stress:a.stress,trust:a.trust,memory:a.memory,
    beliefs:Object.fromEntries(Object.entries(a.beliefs).filter(([key])=>!key.startsWith('available.'))),
  }));
  return {tick:w.tick,agents,props:w.props,injury:w.facts['injury.bob'],concessions:1,
    pieces:sim.pieces.filter(p=>w.facts[p.id+'.socket']===4)};
}
