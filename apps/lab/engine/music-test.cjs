const assert = require("node:assert/strict");
const { test } = require("node:test");
require("../scripts/shifts/typescript.cjs");
const { campaignMusic, menuMusic, transitionCue, manifest } = require("../lib/loopforge/engine/music-score.ts");
const { CampaignMusicPlayer } = require("../lib/loopforge/engine/music-player.ts");

function frame(world, agents = [], events = []) {
  return { tick: 500, state: { world: { clock_tick: 500, ...world }, agents, events } };
}
const crew = n => Array.from({ length: n }, (_, i) => ({ agent_id: "worker" + i, room: "conveyor" }));
const line = (n, other = {}) => frame({
  phase: "floor",
  floor: { stage: "work", held: false, machines: Array.from({ length: n }, () => ({ hold: "Working" })), ...other }
});
test("Day One reads staged workers, holds and forward scene crossings", () => {
  const intro = (ms, actors, extra) => campaignMusic(frame({ phase: "intro", edited_ms: ms, ...extra }, actors), "security");
  const actors = [...crew(2), { agent_id: "max", room: "security" }, { agent_id: "STILETTO", room: "conveyor" }];
  assert.equal(intro(45000, crew(1)).surface, "first-line");
  assert.equal(intro(80000, crew(1)).surface, "day-one-security");
  assert.equal(intro(95000, actors).surface, "day-one-security");
  assert.equal(intro(96000, actors).surface, "day-one-line");
  assert.equal(intro(133000, actors).surface, "day-one-security");
  assert.equal(intro(140000, actors).tier, "two");
  assert.equal(intro(140000, crew(4)).tier, "four");
  assert.equal(intro(151100, crew(8)).tier, "full");
  assert.equal(intro(140000, actors, { order: { station: "wash" } }).production, "waiting");
  assert.equal(transitionCue(intro(16290, []), intro(16350, [])), "gate");
  assert.equal(transitionCue(intro(40050, []), intro(40100, [])), "floor");
  const yard = intro(165400, actors);
  assert.equal(transitionCue(intro(165350, actors), yard), "depart");
  assert.equal(transitionCue(yard, yard), undefined);
});
test("focused Day Two room controls tier, explicit waits, speech, confirmed bell", () => {
  assert.deepEqual([0,1,2,3,4].map(n => campaignMusic(line(n), "conveyor").tier), ["two","two","four","full","full"]);
  assert.equal(campaignMusic(line(0), "conveyor").production, "unknown");
  const waiting = campaignMusic(line(0, { machines: [{ carrier: "c1", hold: "Waiting for clearance" }] }), "conveyor");
  assert.equal(waiting.production, "waiting");
  assert.equal(transitionCue(waiting, campaignMusic(line(1), "conveyor")), "restart");
  const state = line(2);
  state.state.events = [{ kind:"speech.delivered", speaker:"bob", room:"security", tick:490, until:520 }];
  assert.equal(campaignMusic(state, "security").speech, true);
  assert.equal(campaignMusic(state, "conveyor").speech, false);
  assert.equal(campaignMusic(line(2, { held:true }), "conveyor").production, "waiting");
  const closed = campaignMusic(line(0,{ closed:true, bell:500 }), "security");
  assert.equal(transitionCue(waiting, closed), "bell-release");
  assert.equal(transitionCue(closed, closed), undefined);
  assert.equal(transitionCue(null, closed), undefined);
  assert.equal(transitionCue(waiting, campaignMusic(line(0,{ closed:true, bell:600 }), "security")), undefined);
});

function installAudio(delay = async () => {}, resume = ctx => { ctx.state = "running"; }) {
  const starts = [], requests = [], stops = [], gains = [], cutoffs = [];
  const param = () => ({ value:1, ramps:[], setValueAtTime(){},
    linearRampToValueAtTime(value, time){ this.ramps.push({value, time}); }, cancelScheduledValues(){} });
  let ctx;
  class Audio {
    constructor() { ctx = this; this.sampleRate = 32000; this.currentTime = 0; this.state = "suspended"; }
    async resume() { await resume(this); }
    async close() { this.state = "closed"; }
    async decodeAudioData() { return { duration:300 }; }
    createBufferSource() {
      let started;
      return { connect(dest){return dest;}, disconnect(){},
        start(when, offset, duration){ started = { when, offset, duration, end:this.loopEnd }; starts.push(started); },
        stop(time){ stops.push(time); if (started) started.stop = time; } };
    }
    createGain() { const gain=param(); gains.push(gain); return { gain, connect(){}, disconnect(){} }; }
    createBiquadFilter() { const frequency=param(); cutoffs.push(frequency); return { frequency, connect(){return this;}, disconnect(){} }; }
  }
  const oldAudio = global.AudioContext, oldFetch = global.fetch;
  global.AudioContext = Audio;
  global.fetch = async url => {
    requests.push(url);
    await delay(url);
    return { ok:true, async arrayBuffer(){ return new ArrayBuffer(0); } };
  };
  return { starts, requests, stops, gains, cutoffs, get ctx() { return ctx; },
    restore() { global.AudioContext = oldAudio; global.fetch = oldFetch; } };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

test("a later gesture retries a pending resume and only the current visible menu can play", async () => {
  const attempts = [], reports = [];
  const audio = installAudio(undefined, ctx => new Promise((resolve, reject) => attempts.push({ctx, resolve, reject})));
  const player = new CampaignMusicPlayer(status => reports.push(status));
  try {
    player.update(menuMusic(false), false);
    const landing = player.enable();
    const click = player.enable();
    assert.equal(attempts.length, 2, "a trusted retry invokes resume during the click");
    attempts[1].ctx.state = "running";
    player.visibility(false);
    attempts[1].resolve();
    await click; await flush();
    assert.equal(audio.starts.length, 0);
    player.visibility(true); await flush();
    assert.equal(audio.starts.length, 1);
    assert.equal(audio.starts[0].end, manifest.tracks.menu.loopFrames[1] / manifest.sampleRate);
    attempts[0].reject(Error("obsolete blocked resume"));
    await landing; await flush();
    assert.deepEqual(reports, ["playing"]);
    assert.equal(audio.starts.length, 1);

    player.mute();
    const abandoned = player.enable();
    player.dispose();
    attempts[2].resolve();
    await abandoned; await flush();
    assert.deepEqual(reports, ["playing", "muted"]);
    assert.equal(audio.starts.length, 1, "leaving the menu owns the pending attempt's lifetime");
  } finally { player.dispose(); audio.restore(); }
});

test("Web Audio transport uses exact ranges, room memory, aligned work loops and cancellation", async () => {
  let slowOptions;
  const audio = installAudio(url => url.endsWith("/options.mp3") && slowOptions);
  const { starts, requests, stops } = audio;
  const sec = n => n / manifest.sampleRate;
  const tr = manifest.tracks.conveyor;
  const checkOffset = (actual, expected) => assert.ok(Math.abs(actual - expected) < .002, actual + " != " + expected);
  const p = new CampaignMusicPlayer(() => {});
  try {
    p.update(menuMusic(false), false);
    assert.equal(requests.length, 0);
    await p.enable(); await flush();
    const { ctx } = audio;
    checkOffset(starts.at(-1).offset, 0);
    ctx.currentTime = 10.005;
    p.update(menuMusic(true), false); await flush();
    checkOffset(starts.at(-2).offset, sec(manifest.cues["menu-options"].frames[0]));
    p.update(menuMusic(false), false); await flush();
    const bar = 4 * 60 / 164;
    checkOffset(starts.at(-1).offset, Math.ceil(10 / bar) * bar);
    assert.ok(stops.every(t => t <= ctx.currentTime + .05));
    const work = campaignMusic(line(1), "conveyor");
    p.reset(true);
    p.update({...work, production:"waiting"}, false); await flush();
    ctx.currentTime += 35;
    p.update(work, false); await flush();
    checkOffset(starts.at(-2).offset, sec(tr.openingFrames[0]));
    const firstAudible = starts.at(-2).when;
    ctx.currentTime = firstAudible + 3;
    p.update({...work,speech:true}, false); await flush();
    ctx.currentTime += 31;
    p.update({...work,tier:"four"}, false); await flush();
    checkOffset(starts.at(-2).offset, sec(tr.openingFrames[0]) + 3);
    checkOffset(starts.at(-1).offset, sec(tr.layers.four.frames[0]));
    ctx.currentTime = starts.at(-1).when + 2;
    p.update({...work,tier:"four"}, true);
    const count = starts.length;
    ctx.currentTime += 100;
    p.update({...work,tier:"full"}, true); await flush();
    assert.equal(starts.length, count);
    p.update({...work,tier:"full"}, false); await flush();
    checkOffset(starts.at(-1).offset, sec(tr.layers.full.frames[0]) + 2);
    p.update({...work,tier:"full",speech:true}, false); await flush();
    assert.equal(starts.at(-1).end, sec(manifest.cues.speech.frames[1]));
    p.visibility(false);
    const hidden = starts.length;
    p.update(menuMusic(true), false); await flush();
    assert.equal(starts.length, hidden);
    p.visibility(true); await flush();
    p.reset();
    p.update(work, true); p.update(work, false); await flush();
    checkOffset(starts.at(-1).offset, sec(tr.layers.two.frames[0]));
    p.reset(true);
    const solo = {...work,surface:"first-line",production:"unknown"};
    p.update(solo,false); await flush();
    assert.equal(starts.at(-1).end,sec(manifest.cues["day-one"].frames[1]),"Solo reveal returns to day bed");
    ctx.currentTime = starts.at(-2).when + 15;
    p.update({...solo,surface:"day-one"},false); await flush();
    ctx.currentTime += 18;
    p.update({...work,surface:"day-one-line"},false); await flush();
    checkOffset(starts.at(-2).offset,15);
    checkOffset(starts.at(-1).offset,sec(tr.layers.two.frames[0]));
    let release;
    slowOptions = new Promise(resolve => { release = resolve; });
    p.update(menuMusic(true), false); await flush();
    p.mute();
    const canceled = starts.length;
    release(); await flush();
    assert.equal(starts.length, canceled, "A stale decode cannot restart music after mute");
  } finally {
    p.dispose(); audio.restore();
  }
});

test("confirmed scene cues sound before a cold bed and survive same-room speech changes", async () => {
  let releaseSecurity;
  const coldSecurity = new Promise(resolve => { releaseSecurity = resolve; });
  const audio = installAudio(url => url.endsWith("/" + manifest.tracks.security.file) && coldSecurity);
  const player = new CampaignMusicPlayer(() => {});
  const markers = name => audio.starts.filter(s => s.offset === manifest.cues[name].frames[0] / manifest.sampleRate);
  const briefing = campaignMusic(line(0, {stage:"briefing"}), "security");
  const security = campaignMusic(line(0), "security");
  try {
    player.update(briefing, false);
    await player.enable(); await flush();
    player.update(security, false); await flush();
    assert.equal(markers("appointment").length, 1, "posted receipt sounds while Security is still decoding");
    const tap = markers("appointment")[0];
    audio.ctx.currentTime = tap.when + .10;
    player.update({...security, speech:true}, false); await flush();
    assert.equal(tap.stop, undefined, "visible speech cannot cancel a confirmed same-room tap");
    releaseSecurity(); await flush();
    assert.ok(audio.starts.at(-1).when >= tap.when + tap.duration, "room enters after appointment");
    assert.equal(markers("appointment").length, 1);
    player.update(campaignMusic(line(0,{closed:true,bell:500}), "security"), false); await flush();
    assert.equal(markers("bell-release").length, 1);
    player.reset();
    assert.ok(markers("bell-release")[0].stop <= audio.ctx.currentTime + .05, "seek retires audible pickup");
    const day = ms => campaignMusic(frame({phase:"intro",edited_ms:ms}), "security");
    player.update(day(16290), false);
    player.update(day(16350), false); await flush();
    player.update({...day(16400), speech:true}, false); await flush();
    assert.equal(markers("gate").length, 1);
    assert.equal(markers("gate")[0].stop, undefined);
    player.update(day(165400), false); await flush();
    assert.equal(markers("depart").length, 1);
    player.update(briefing, false); await flush();
    assert.ok(markers("depart")[0].stop <= audio.ctx.currentTime + .05, "leaving the scene retires its marker");
    player.update(security, false);
    player.reset();
    player.update(security, false); await flush();
    assert.equal(markers("appointment").length, 1, "a seek before the cue is scheduled cannot backfill the tap");
  } finally { releaseSecurity(); player.dispose(); audio.restore(); }
});

test("Options 02 continues from the Day One departure through the desk, call and posting", async () => {
  const audio = installAudio();
  const player = new CampaignMusicPlayer(() => {});
  const show = async (world, at) => {
    audio.ctx.currentTime = at;
    player.update(campaignMusic(frame(world), "security"), false);
    await flush();
  };
  const desk = {phase:"console"}, call = {phase:"call"};
  try {
    await player.enable();
    await show({phase:"intro", edited_ms:165400}, 0);
    const bed = audio.starts[0];
    const [start,end] = manifest.tracks.options.loopFrames.map(n => n / manifest.sampleRate);
    await show(desk, 1);
    assert.ok(audio.requests.some(url => url.endsWith(manifest.tracks.options.file)));
    assert.equal(bed.offset, start);
    assert.equal(bed.end, end);
    await show(call, 3);
    await show(desk, 6);
    await show(call, 8);
    await show({...call, topic:1}, 9);
    await show({phase:"floor", floor:{stage:"briefing"}}, 53);
    assert.deepEqual(audio.starts, [bed], "dialogue and bidding leave the loop running past its first 32 bars");
    assert.equal(bed.stop, undefined);
    const { speechGain, speechLowpassHz } = manifest.arrangement.interrupt;
    assert.deepEqual(audio.gains[0].ramps.map(r => r.value), [1, speechGain, 1, speechGain]);
    assert.deepEqual(audio.cutoffs[0].ramps.map(r => r.value), [speechLowpassHz, audio.ctx.sampleRate/2, speechLowpassHz]);
    const walk = {phase:"floor", floor:{stage:"walk", machines:[]}};
    await show(walk, 56);
    await show(walk, 57);
    assert.deepEqual(audio.starts.map(s => s.offset), [start, manifest.cues.appointment.frames[0]/manifest.sampleRate, 0]);
    assert.equal(audio.starts[2].end, manifest.tracks.security.loopFrames[1]/manifest.sampleRate);
    assert.ok(bed.stop >= 56 && bed.stop <= 56.05);
    await show({phase:"floor",floor:{closed:true,bell:500}}, 70);
    const release = manifest.cues["bell-release"].frames[0]/manifest.sampleRate;
    assert.equal(audio.starts.at(-2).offset, release);
    assert.equal(audio.starts.at(-1).end, end);
    player.update(menuMusic(false), false); await flush();
    assert.equal(audio.starts.at(-2).offset, manifest.cues["options-menu"].frames[0]/manifest.sampleRate);
    assert.equal(audio.starts.at(-1).end, manifest.tracks.menu.loopFrames[1]/manifest.sampleRate);
    player.reset();
    const mark = audio.starts.length;
    await show({phase:"floor",floor:{closed:true,bell:500}},75);
    assert.deepEqual(audio.starts.slice(mark).map(s => [s.offset,s.end]), [[0,end]], "restoring results selects Options directly");
  } finally { player.dispose(); audio.restore(); }
});

test("fresh Day One Security shots play and resume the 96-bar recording through the verified campaign", async () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const { read, schema, subscription } = require("../lib/loopforge/engine/wire.ts");
  const { envelope } = require("../lib/loopforge/intro/protocol.ts");
  const { instance } = await WebAssembly.instantiate(fs.readFileSync(path.join(__dirname, "../public/loopforge-engine/kernel.wasm")));
  const wasm = instance.exports;
  function host(operation, payload) {
    const input = Buffer.from(JSON.stringify(payload));
    const offset = wasm.input(input.length);
    new Uint8Array(wasm.memory.buffer, offset, input.length).set(input);
    const length = wasm.exchange(operation);
    const result = JSON.parse(Buffer.from(wasm.memory.buffer, wasm.output(), length).toString());
    assert.equal(result.error, undefined);
    return result.value;
  }

  const audio = installAudio();
  const player = new CampaignMusicPlayer(() => {});
  const securityEnd = manifest.tracks.security.loopFrames[1] / manifest.sampleRate;
  const entries = [];
  let snapshot = null, previousSurface, seq = 0, holds = 0;
  async function consume(records) {
    for (const record of records) {
      assert.notEqual(record.msg_type, "COMMAND_REJECTED");
      if (record.msg_type !== "FULL_SNAPSHOT" && record.msg_type !== "FRAME_DIFF") continue;
      snapshot = await read(snapshot, record);
      if (record.msg_type === "FULL_SNAPSHOT") host(3, { tick:snapshot.tick, hash:snapshot.hash });
      const view = campaignMusic(snapshot, "security");
      audio.ctx.currentTime = Math.max(audio.ctx.currentTime, view.editedMs/1000);
      const before = audio.starts.length;
      player.update(view, false);
      await flush();
      if (view.surface === "day-one-security" && view.surface !== previousSurface) {
        const bed = audio.starts.slice(before).find(source => source.end === securityEnd);
        assert.ok(bed, "a Security camera cut selects the full room recording");
        entries.push({ ms:view.editedMs, offset:bed.offset });
      }
      previousSurface = view.surface;
    }
  }
  function wire(type, payload) { return consume(host(1, envelope(type, ++seq, payload))); }
  function input(type, payload) {
    return wire("INPUT_COMMAND", { client_cmd_id:"music-" + seq, tick_target:snapshot.tick + 1, cmd:{type,payload} });
  }
  try {
    await player.enable();
    player.reset(true);
    host(0, {run:"8ca6443d-3f2f-419c-8d80-76f11e6528b8"});
    await wire("VIEWER_HELLO", { viewer_name:"music-check", viewer_version:"1", supported_schema_versions:[schema],
      supports:{ diff_stream:true, full_snapshot:true, replay_seek:true } });
    await wire("SUBSCRIBE", subscription);
    await input("VIEW_CONTROL", {hint:"PLAY"});
    for (let step = 0; step < 1200 && snapshot.state.world.phase === "intro"; step++) {
      const order = snapshot.state.world.order;
      if (order) { holds++; await input("WORLD_NUDGE", {action:"confirm", target:order.station}); }
      else await consume(host(2, 250));
    }
    assert.deepEqual(entries.map(entry => Math.floor(entry.ms/100)), [0, 766, 1303]);
    assert.equal(entries[0].offset, 0);
    const optionsEnd = manifest.tracks.options.loopFrames[1]/manifest.sampleRate;
    const transitions = audio.starts.filter(source => source.end === optionsEnd);
    assert.equal(transitions.length, 1, "one Options recording continues across register, yard and next day desk");
    assert.ok(transitions[0].when > 165.4 && transitions[0].when < 167.1);
    const firstCut = 38.8;
    const firstBeds = audio.starts.filter(source => source.end === securityEnd && source.when < firstCut);
    assert.equal(firstBeds.length, 1, "speech transitions and the gate leave the bass on its original source");
    assert.ok(firstBeds[0].stop >= firstCut, "the full recording keeps running until the camera cut");
    const gate = audio.starts.find(source => source.offset === manifest.cues.gate.frames[0] / manifest.sampleRate);
    assert.ok(gate.when > firstBeds[0].when && gate.when + gate.duration < firstBeds[0].stop);
    const { speechGain, speechLowpassHz } = manifest.arrangement.interrupt;
    assert.ok(audio.gains.some(gain => gain.ramps.some(r => r.value === speechGain && r.time < firstCut) &&
      gain.ramps.some(r => r.value === 1 && r.time < firstCut)), "speech ducks and releases one room gain");
    assert.ok(audio.cutoffs.some(filter => filter.ramps.some(r => r.value === speechLowpassHz && r.time < firstCut) &&
      filter.ramps.some(r => r.value === audio.ctx.sampleRate/2 && r.time < firstCut)), "room filter opens again");
    assert.ok(entries[1].offset > 33 && entries[1].offset < 39, "second shot resumes heard Security time");
    assert.ok(entries[2].offset > entries[1].offset + 15, "third shot resumes the longer phrase");
    for (const cue of ["factory-open","gate","floor","depart"]) {
      const offset = manifest.cues[cue].frames[0] / manifest.sampleRate;
      assert.equal(audio.starts.filter(source => source.offset === offset).length, 1, cue);
    }
    assert.ok(audio.requests.some(url => url.endsWith(manifest.tracks.security.file)));
    assert.equal(holds, 8);
    assert.equal(snapshot.state.world.phase, "console");
  } finally { player.dispose(); audio.restore(); }
});

test("the welcome voice requires the exact on-camera delivery and never backfills", () => {
  const { WelcomeVoice } = require("../lib/loopforge/engine/welcome-voice.ts");
  let plays = 0, pauses = 0;
  const voice = new WelcomeVoice({ pause(){ pauses++; }, play(){ plays++; return Promise.resolve(); } });
  const moment = (tick, events = []) => {
    const f = line(0); f.state.world.clock_tick = tick; f.state.events = events;
    return f;
  };
  const receipt = { event_id:"speech-9", speaker:"LIMEN", kind:"speech.delivered", tick:11, until:60,
    room:"security", text:"It is my privilege to welcome you to Loopforge." };
  voice.update(moment(10), "security", true);
  voice.update(moment(11, [receipt]), "security", true);
  voice.update(moment(13, [receipt]), "security", true);
  assert.equal(plays, 1);
  voice.update(moment(13, [receipt]), "conveyor", true);
  voice.update(moment(14, [receipt]), "security", true);
  voice.reset();
  voice.update(moment(12, [receipt]), "security", true);
  assert.equal(plays, 1);
  voice.reset(true);
  voice.update(moment(10), "security", true);
  voice.update(moment(11, [receipt]), "security", false);
  voice.update(moment(12, [receipt]), "security", true);
  assert.equal(plays, 1);
  assert.ok(pauses > 0);
});
