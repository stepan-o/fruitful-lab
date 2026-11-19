import fs from 'node:fs';
import {makeSequence} from '../../../docs/loopforge/game-design/day-one-sequence.mjs';
const read = path => fs.readFileSync(new URL(path,import.meta.url),'utf8');
const floor = JSON.parse(read('../../../docs/loopforge/game-design/day-one-geometry.json'));
const lines = [...read('../../../docs/loopforge/DAY_ONE_INTRO.md').matchAll(/^\*\*(\w+)\*\*\s+(.+)$/gm)].map(([,speaker,raw]) => {
  const aside=raw.match(/^\*\((.*?)\)\*\s*/);
  return {speaker,text:raw.slice(aside?.[0].length ?? 0),aside:aside?.[1] ?? ''};
});
const score = makeSequence(floor,lines);
const {start,end,duration,tracks,speech,beats,cues,cuts,gate}=score;
const target=new URL('../lib/loopforge/intro/score.json',import.meta.url);
const content=JSON.stringify({start,end,duration,tracks,speech,beats,cues,cuts,gate},(_,v)=>v===Infinity?1e6:v)+'\n';
if(process.argv.includes('--check')) {
  if(fs.readFileSync(target,'utf8')!==content) throw Error('Regenerate the intro with node scripts/intro-score.mjs');
} else fs.writeFileSync(target,content);

// Runtime consumers live inside the app deployment root.
const keys=['version','zones','walls','portals','fixtures','forgeHall','stations','gate','contact','roomObjects','aisles'];
const geometry=JSON.stringify(Object.fromEntries(keys.map(k=>[k,floor[k]])))+'\n';
const floorPath=new URL('../lib/loopforge/intro/geometry.json',import.meta.url);
if(process.argv.includes('--check')) {
  if(fs.readFileSync(floorPath,'utf8')!==geometry)throw Error('Stale runtime geometry');
} else fs.writeFileSync(floorPath,geometry);
