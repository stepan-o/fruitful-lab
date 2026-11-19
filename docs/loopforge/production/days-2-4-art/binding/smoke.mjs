import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {commandPayload, drawAsset, selectShiftArt} from './shift-art.mjs';

const fixture = JSON.parse(readFileSync(new URL('samples.json', import.meta.url)));
assert.equal(fixture.schema, 'shift_floor_1');
const frame = name => {
  const {tick, state, step_hash} = fixture.snapshots[name];
  return {tick, scene: state, hash: step_hash};
};
function view(name, room = 'security', opened = true) {
  const f = frame(name);
  return selectShiftArt(f, {room, openCase: opened ? f.scene.world.caseId : null});
}
const failed = frame('desk-open');
const security = {room: 'security', openCase: failed.scene.world.caseId};
assert.equal(view('morning').surface, 'co-briefing-chassis');
assert.equal(view('morning').choices.filter(c => c.action === 'appoint').length, 2);
assert.equal(view('desk-open', 'security', false).panel, null);
assert.equal(view('desk-open').signal, 'sec-signal-action');
assert.equal(view('desk-open').gate, 'fl-gate-held');
assert.equal(view('desk-spent').signal, 'sec-signal-report');
assert.equal(view('desk-spent').panel.state, 'spent');
assert.equal(commandPayload(failed, {room:'conveyor'}, 'issue-pass', 'bob', 'art-issue'), null);
const payload = commandPayload(failed, security, 'issue-pass', 'bob', 'art-issue');
assert.deepEqual(payload.cmd, fixture.receipts['art-issue'].cmd);
assert.deepEqual(commandPayload(failed, security, 'issue-pass', 'bob', 'art-issue'), payload);
assert.equal(commandPayload(failed, security, 'issue-pass', 'bob', '__proto__'), null);
assert.equal(failed.scene.world.spent, null);
assert.equal(view('pass-issued').panel.state, 'committed');
assert.equal(commandPayload(frame('pass-issued'), security, 'issue-pass', 'bob', 'art-again'), null);
assert.equal(view('next-worker').nextStep.at(-1).speaker, 'jo');
assert.equal(view('detained').custodyInsert, 'sec-custody-held');
assert.equal(view('released').custodyInsert, 'sec-custody-released');
assert.equal(view('pass-expired').pass.asset, 'sec-pass-expired');
assert.equal(view('pass-expired').panel.state, 'expired');
assert.equal(view('next-morning').transition, 'co-next-shift');
assert.equal(view('renewal-open').panel.state, 'available');
assert.notEqual(frame('renewal-open').scene.world.caseId, security.openCase);
const report = view('detained','conveyor').reports.at(-1);
assert.equal(report.speaker, 'LIMEN');
assert.match(report.text, /custody/);
assert.equal(view('desk-open','conveyor').posts[0].operator, 'sam');
assert.equal(view('desk-open','conveyor').posts[1].asset, 'fl-post-vacant');
assert.equal(view('detained','conveyor').reports.length, 1); // world.report also occurs in events
const evicted = frame('pass-expired');
assert(evicted.scene.world.report.seq < evicted.scene.events[0].seq);
assert.equal(view('pass-expired','conveyor').reports[0].text, evicted.scene.world.report.text);
const otherAddressee = structuredClone(evicted);
otherAddressee.scene.world.report.audience = ['bob'];
assert.equal(selectShiftArt(otherAddressee,{room:'conveyor'}).reports.length, 0);
assert.equal(view('next-morning','conveyor').reports.length,0);
const interrupted = view('reply-interrupted','conveyor');
const complete = view('reply-delivered','conveyor');
assert.equal(interrupted.speeches.find(s => s.speaker === 'sam').asset, 'fl-bubble-interrupted');
assert(complete.speeches.some(s => /desk/i.test(s.text)));
assert(!interrupted.speeches.some(s => /desk/i.test(s.text)));
assert(view('first-handoff-LIMEN','conveyor').handoffs.some(h => h.asset === 'fl-handoff-rushed'));
assert(view('first-handoff-STILETTO','conveyor').handoffs.some(h => h.asset === 'fl-handoff-clear'));
for (const lead of ['LIMEN','STILETTO']) {
  const rack = view('rack-' + lead, 'conveyor').rack;
  assert.equal(rack.total, 3 + rack.thisShift);
  assert.equal(rack.total, rack.items.length);
  assert.deepEqual(new Set(rack.items.map(i => i.id)), new Set(frame('rack-' + lead).scene.world.completed));
}
const clashMoves = frame('crew-STILETTO').scene.events.filter(e => e.kind === 'worker.choice');
assert(clashMoves.some(e => e.actor === 'bob' && e.text === 'stay'));
assert(clashMoves.some(e => e.actor === 'kit' && e.text === 'go'));
assert(view('endorsement').speeches.some(s => s.speaker === 'Producer'));
assert(!view('endorsement','conveyor').speeches.some(s => s.speaker === 'Producer'));
assert.equal(view('clash-open').choices.filter(c => c.action === 'endorse').length, 2);
const untrusted = structuredClone(failed);
untrusted.scene.world.thoughts = ['private sentinel'];
untrusted.scene.agents[0].beliefs = {secret:'private sentinel'};
assert.equal(JSON.stringify(selectShiftArt(untrusted,security)).includes('private sentinel'), false);

const ids = new Set();
function scan(obj) {
  if (typeof obj === 'string' && /^(sec-|fl-|co-)/.test(obj)) ids.add(obj);
  else if (obj && typeof obj === 'object') Object.values(obj).forEach(scan);
}
for (const name of Object.keys(fixture.snapshots)) {
  for (const room of ['security','conveyor']) scan(view(name,room));
}
const stamps = [];
const ctx = {save(){},restore(){},drawImage(...args){stamps.push(args);}};
const art = {assets:{panel:{atlas:'a',rect:[30,50,18,24],insets:[2,3,4,5]}}};
drawAsset(ctx,art,{a:{}},'panel',10,12,{width:42,height:68});
assert.equal(stamps.length,9);
assert.deepEqual(stamps[0].slice(1),[30,50,2,3,10,12,2,3]);
assert.deepEqual(stamps.at(-1).slice(1),[44,69,4,5,48,75,4,5]);
assert.throws(() => drawAsset(ctx,art,{a:{}},'panel',0,0,{width:2}),RangeError);
if (process.argv[2]) {
  const manifest = JSON.parse(readFileSync(process.argv[2]));
  for (const id of ids) {
    assert(manifest.assets[id], 'Missing in pack: ' + id);
    assert.equal(typeof manifest.assets[id].atlas,'string',id + ' lacks atlas');
    assert.equal(manifest.assets[id].rect.length,4,id + ' lacks source rectangle');
  }
}
console.log('Passed ' + Object.keys(fixture.snapshots).length + ' captured public frames; exercised ' + ids.size + ' art IDs.');
