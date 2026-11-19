require('./typescript.cjs');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {Intro} = require('../../lib/loopforge/intro/simulation.ts');
const {projectIntro} = require('../../lib/loopforge/intro/projection.ts');
const {canonical} = require('../../lib/loopforge/intro/protocol.ts');
const {createHash} = require('node:crypto');
const sim = new Intro();
while (!sim.finished) sim.step();
const state = projectIntro(sim);
const hash = createHash('sha256').update(canonical(state)).digest('hex');
assert.equal(hash, require('../../lib/loopforge/intro/golden.json').checkpoints.at(-1)[1]);
const agents = Object.values(sim.world.agents).map(a => ({
  id: a.id, character: a.character, room: a.room, position: a.position,
  stress: a.stress, trust: a.trust, memory: a.memory,
  beliefs: Object.fromEntries(Object.entries(a.beliefs).filter(([key]) => !key.startsWith('available.'))),
}));
const deskReport = sim.world.events.find(e => e.kind === 'speech' && e.speech?.claim?.fact === 'heard.line.31');
assert(deskReport.detail.includes('ed and gus'));
const seed = {schema:'loopforge/shift-inheritance/1', tick:sim.world.tick, hash, agents,
  props: sim.world.props, injury:sim.world.facts['injury.bob'], clerks:['ed','gus'],
  clerkEvidence:deskReport.id, pieces:sim.pieces, concessions:1};
const file = path.resolve(__dirname,'../../lib/loopforge/shifts/inheritance.json');
const data = JSON.stringify(seed) + '\n';
if (process.argv.includes('--check')) assert.equal(fs.readFileSync(file,'utf8'),data);
else fs.writeFileSync(file,data);
