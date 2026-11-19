// Run alongside the ENGINE checkout. Writes only into this handoff directory.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const engineRoot = process.argv[2];
if (!engineRoot) throw Error('Usage: node capture.cjs /path/to/engine-checkout');
const lab = path.resolve(engineRoot, 'apps/lab');
const source = path.join(lab, 'lib/loopforge/shifts');
function readDigests() {
  const digests = {};
  for (const name of ['contract.ts', 'events.ts', 'conveyor.ts', 'navigation.ts', 'simulation.ts',
    'replay.ts', 'wire.ts', 'worker.ts', 'inheritance.json']) {
    digests[name] = crypto.createHash('sha256').update(fs.readFileSync(path.join(source, name))).digest('hex');
  }
  return digests;
}
const digests = readDigests();
require(path.join(lab, 'scripts/shifts/typescript.cjs'));
const {start, nextMorning, intent, admitCommand} = require(path.join(source, 'simulation.ts'));
const {restorePoint, until} = require(path.join(source, 'replay.ts'));
const {full, read, schema, engine} = require(path.join(source, 'wire.ts'));
const snapshots = {};
const receipts = {};
const developerWitnesses = [];

async function capture(id, run) {
  const payload = await full(run);
  await read(undefined, 'FULL_SNAPSHOT', payload);
  snapshots[id] = payload;
}
function send(run, id, action, target, room) {
  const cmd = intent(run, id, action, target, room);
  const result = admitCommand(run, cmd);
  receipts[id] = {cmd, ...result};
  assert(result.accepted, id + ' ' + result.reason);
  return cmd;
}
const has = (run, kind) => run.marks.some(e => e.day === run.day && e.kind === kind);
async function main() {
  await capture('morning', restorePoint('Morning bids'));
  const failed = restorePoint('Missing ID');
  await capture('desk-open', failed);
  const pass = structuredClone(failed);
  const click = send(pass, 'art-issue', 'issue-pass', 'bob', 'security');
  const seq = pass.marks.at(-1).seq;
  const retry = admitCommand(pass, click);
  assert(retry.accepted && pass.marks.at(-1).seq === seq, 'A retried command admitted twice');
  await capture('pass-issued', pass);
  until(pass, s => has(s, 'queue.advanced'));
  await capture('next-worker', pass);
  until(pass, s => s.phase === 'close');
  await capture('pass-expired', pass);
  assert(nextMorning(pass));
  await capture('next-morning', pass);
  send(pass, 'art-appoint-again', 'appoint', 'LIMEN', 'security');
  until(pass, s => s.case?.status === 'open');
  await capture('renewal-open', pass);

  const detention = structuredClone(failed);
  until(detention, s => has(s, 'custody.admitted'));
  await capture('detained', detention);
  until(detention, s => s.phase === 'close');
  await capture('released', detention);

  const spent = structuredClone(failed);
  send(spent, 'art-spent', 'slow', 'STILETTO', 'conveyor');
  await capture('desk-spent', spent);

  const chat = restorePoint('Conveyor chat');
  const quiet = structuredClone(chat);
  send(quiet, 'art-lower-pace', 'slow', 'STILETTO', 'conveyor');
  until(quiet, s => s.chat === 'finished');
  await capture('reply-delivered', quiet);
  until(chat, s => s.chat === 'interrupted');
  await capture('reply-interrupted', chat);

  for (const lead of ['LIMEN', 'STILETTO']) {
    const run = start('late');
    send(run, 'art-bid-' + lead, 'appoint', lead, 'security');
    until(run, s => has(s, 'handoff.started'));
    await capture('first-handoff-' + lead, run);
    until(run, s => s.phase === 'close');
    await capture('rack-' + lead, run);
  }
  const clash = restorePoint('Conflicting orders');
  await capture('clash-open', clash);
  for (const lead of ['none', 'LIMEN', 'STILETTO']) {
    const run = structuredClone(clash);
    if (lead !== 'none') send(run, 'art-back-' + lead, 'endorse', lead, 'security');
    if (lead !== 'none') {
      const endorsement = run.marks.findLast(e => e.kind === 'endorsement.public');
      const heard = run.heard[String(endorsement.seq)];
      developerWitnesses.push({day:run.day,tick:endorsement.tick,seq:endorsement.seq,backing:lead,
        heard, outsideHearing:Object.keys(run.world.agents).filter(actor => !heard.includes(actor)).sort()});
    }
    if (lead === 'STILETTO') await capture('endorsement', run);
    until(run, s => has(s, 'clash.resolved'));
    await capture('crew-' + lead, run);
  }
  const {selectShiftArt} = await import('./shift-art.mjs');
  const fixtureFiles = ['morning-limen', 'morning-stiletto', 'missing-pass', 'missing-detention',
    'chat-slow', 'chat-rushed', 'clash-limen', 'clash-stiletto', 'clash-unaided'];
  const official = [];
  for (const id of fixtureFiles) {
    const file = id + '.json';
    const bytes = fs.readFileSync(path.join(lab, 'public/loopforge-shifts/fixtures', file));
    const f = JSON.parse(bytes);
    const initial = await read(undefined, 'FULL_SNAPSHOT', f.initial);
    const accepted = await read(undefined, 'FULL_SNAPSHOT', f.accepted_baseline);
    const next = await read(accepted, f.first_diff.msg_type, f.first_diff.payload);
    const terminal = await read(undefined, 'FULL_SNAPSHOT', f.terminal);
    for (const frame of [initial,accepted,next,terminal]) {
      for (const room of ['security','conveyor']) {
        const v = selectShiftArt(frame, {room,openCase:frame.scene.world.caseId});
        assert.equal(v.day,frame.scene.world.day);
      }
    }
    official.push({file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),
      initialHash:initial.hash, firstDiffHash:next.hash, terminalHash:terminal.hash});
  }
  assert.deepEqual(readDigests(), digests, 'ENGINE inputs changed while capturing; rerun the capture');
  const record = {engine, schema, sourceSha256:digests, engineFixtures:official, receipts, snapshots};
  fs.writeFileSync(path.join(__dirname, 'samples.json'), JSON.stringify(record) + '\n');
  fs.writeFileSync(path.join(__dirname, 'review-only-hearing.json'), JSON.stringify({
    use:'Developer evidence from Run.heard; excluded from the player adapter and its public snapshots.',
    sourceSha256:digests['simulation.ts'], endorsements:developerWitnesses,
  }, null, 2) + '\n');
  console.log(Object.keys(snapshots).length + ' ENGINE full snapshots and ' + official.length + ' published replays verified.');
}
main().catch(e => {console.error(e);process.exitCode = 1;});
