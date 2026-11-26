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
  assert.equal(intro(80000, crew(1)).surface, "day-one");
  assert.equal(intro(95000, actors).surface, "day-one");
  assert.equal(intro(96000, actors).surface, "day-one-line");
  assert.equal(intro(133000, actors).surface, "day-one");
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

test("Web Audio transport uses exact ranges, room memory, aligned work loops and cancellation", async () => {
  const starts = [], requests = [], stops = [];
  const flush = () => new Promise(resolve => setImmediate(resolve));
  const param = () => ({ value:1, setValueAtTime(){}, linearRampToValueAtTime(){}, cancelScheduledValues(){} });
  let ctx, slowOptions;
  class Audio {
    constructor() { ctx = this; this.currentTime = 0; this.state = "suspended"; }
    async resume() { this.state = "running"; }
    async close() { this.state = "closed"; }
    async decodeAudioData() { return { duration:300 }; }
    createBufferSource() {
      return { connect(dest){return dest;}, disconnect(){}, start(when, offset, duration){ starts.push({ when, offset, duration, end:this.loopEnd }); },
        stop(time){ stops.push(time); } };
    }
    createGain() { return { gain:param(), connect(){}, disconnect(){} }; }
    createBiquadFilter() { return { frequency:param(), connect(){return this;}, disconnect(){} }; }
  }
  const oldAudio = global.AudioContext, oldFetch = global.fetch;
  global.AudioContext = Audio;
  global.fetch = async url => {
    requests.push(url);
    if (url.endsWith("/options.mp3") && slowOptions) await slowOptions;
    return { ok:true, async arrayBuffer(){ return new ArrayBuffer(0); } };
  };
  const sec = n => n / manifest.sampleRate;
  const tr = manifest.tracks.conveyor;
  const checkOffset = (actual, expected) => assert.ok(Math.abs(actual - expected) < .002, actual + " != " + expected);
  const p = new CampaignMusicPlayer(() => {});
  try {
    p.update(menuMusic(false), false);
    assert.equal(requests.length, 0);
    await p.enable(); await flush();
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
    p.dispose(); global.AudioContext = oldAudio; global.fetch = oldFetch;
  }
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
