/* Listening desk only. The score observes a manual context, and sends no commands. */
'use strict';
const $ = id => document.getElementById(id);
const beat = 60 / 164;
const bar = 4 * beat;
const rooms = {menu:'Menu', options:'Options', 'day-one':'Day One', console:'Console',
  security:'Security', conveyor:'Conveyor', results:'Results'};
const labels = {entry:'Track entries', exit:'Track exits', loop:'Looping arrangements',
  bridge:'Room transitions', scene:'Scene cues', event:'Work cues'};
const take = $('take');
const say = text => { $('readout').textContent = text; };
const welcome = new Audio('/loopforge-shifts/limen-welcome.mp3');
welcome.preload = 'none';
let manifest, ctx, master, timer, token = 0, routeToken = 0;
let room = null, origin = 0, held = 0, paused = false, talking = false, waiting = false;
let pendingSeek = null, demo = false;
const voices = new Set();
const positions = new Map();
const cache = new Map();
const loading = new Map();

function stopSpeech() {
  welcome.pause();
  if (welcome.readyState) welcome.currentTime = 0;
}
function update() {
  $('pause').disabled = !room;
  $('pause').textContent = paused ? 'Resume' : 'Pause';
  $('stop').disabled = !room && !voices.size && !demo && take.paused;
  $('wait').disabled = room !== 'conveyor' || paused;
  $('talk').disabled = !room || paused;
  $('bell').disabled = !room || paused;
  $('wait').textContent = waiting ? 'Resume work' : 'Wait';
  $('talk').setAttribute('aria-pressed', String(talking));
  $('wait').setAttribute('aria-pressed', String(waiting));
  for (const button of $('rooms').children) button.setAttribute('aria-pressed',String(button.dataset.room === room));
}
function cancelRoute() {
  demo = false;
  ++routeToken;
  clearTimeout(timer);
}
function clearSound() {
  ++token;
  stopSpeech();
  if (!ctx) return;
  const now = ctx.currentTime;
  for (const active of voices) {
    const {source, gain} = active;
    if (gain.gain.cancelAndHoldAtTime) gain.gain.cancelAndHoldAtTime(now);
    else {
      const level = gain.gain.value;
      gain.gain.cancelScheduledValues(now); gain.gain.setValueAtTime(level, now);
    }
    gain.gain.linearRampToValueAtTime(0, now + .045);
    try { source.stop(now + .05); } catch {}
  }
}
function stop(message = 'Stopped.') {
  cancelRoute();
  clearSound();
  take.pause(); positions.clear();
  room = null; paused = talking = waiting = false; held = 0;
  update(); say(message);
}
async function audioReady() {
  if (!ctx) {
    ctx = new AudioContext({sampleRate:32000});
    master = ctx.createGain();
    master.gain.value = $('mute').checked ? 0 : 1;
    master.connect(ctx.destination);
  }
  if (ctx.state !== 'running') await ctx.resume();
}
async function buffer(file) {
  if (cache.has(file)) {
    const value = cache.get(file);
    cache.delete(file); cache.set(file,value);
    return value;
  }
  if (!loading.has(file)) {
    const promise = (async () => {
      const response = await fetch(file);
      if (!response.ok) throw Error('A recording could not be loaded.');
      const decoded = await ctx.decodeAudioData(await response.arrayBuffer());
      if (file !== manifest.reel.file) {
        // Only the reel and the latest two room performances stay cached.
        const tracks = [...cache.keys()].filter(key => key !== manifest.reel.file);
        while (tracks.length >= 2) cache.delete(tracks.shift());
      }
      cache.set(file,decoded);
      return decoded;
    })();
    loading.set(file,promise);
    promise.finally(() => loading.delete(file)).catch(() => {});
  }
  return loading.get(file);
}
function entry(id) {
  const track = manifest.tracks[id];
  if (track) return {file:track.file, frames:track.loopFrames, loop:true, label:rooms[id]};
  const cue = manifest.cues[id];
  return {file:manifest.reel.file, frames:cue.frames, loop:cue.kind === 'loop', label:cue.label};
}
function sound(asset, decoded, when, offset=0, volume=1, filterHz=0) {
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = decoded;
  const start = asset.frames[0] / manifest.sampleRate;
  const end = Math.min(asset.frames[1] / manifest.sampleRate, decoded.duration);
  const span = end - start;
  if (span <= 0) throw Error('Empty cue range.');
  source.loop = asset.loop;
  source.loopStart = start; source.loopEnd = end;
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(volume, when + .022);
  if (filterHz) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = filterHz; lp.Q.value = .6;
    source.connect(lp).connect(gain);
  } else source.connect(gain);
  gain.connect(master);
  const handle = {source, gain};
  voices.add(handle);
  source.onended = () => { voices.delete(handle); gain.disconnect(); source.disconnect(); update(); };
  if (asset.loop) source.start(when, start + offset % span);
  else source.start(when, start, span);
  return span;
}
function warn(error, version) {
  if (version === token) stop(error.message || 'Playback unavailable. Choose a recording to retry.');
}
function phase() { return paused ? held : Math.max(0, (ctx?.currentTime ?? 0) - origin); }

async function arrange(next, {cut=null, keep=false, speech=talking, wait=waiting, voice=false} = {}) {
  const previous = room;
  if (!keep && previous && previous !== next && ctx) positions.set(previous, phase());
  const elapsed = keep ? phase() : positions.get(next) ?? 0;
  clearSound();
  const version = token;
  take.pause();
  room = next; paused = false; talking = speech; waiting = next === 'conveyor' && wait;
  update(); say('Loading ' + rooms[next] + '…');
  try {
    await audioReady();
    if (version !== token) return;
    if (voice && talking) { welcome.currentTime = 0; welcome.play().catch(() => {}); }
    const bedId = next === 'conveyor' && talking ? 'speech' : waiting ? 'waiting' : next;
    const bed = entry(bedId);
    let cutId = cut;
    if (cut === 'auto') {
      const bridge = previous + '-' + next;
      cutId = manifest.cues[bridge]?.kind === 'bridge' ? bridge :
        manifest.cues[next+'-in'] ? next+'-in' : null;
    }
    const pickup = cutId ? entry(cutId) : null;
    const [bedBytes, cutBytes] = await Promise.all([buffer(bed.file), pickup ? buffer(pickup.file) : null]);
    if (version !== token) return;
    const now = ctx.currentTime + .015;
    let length = 0;
    if (pickup) length = sound(pickup,cutBytes,now,0,talking ? .42 : 1);
    // Bridges contain one bar from the destination. Continue at its next downbeat.
    const destinationBar = {'options-menu':49, 'conveyor-security':17}[cutId] ?? 1;
    let offset = elapsed + length;
    if (!keep && (manifest.cues[cutId]?.kind === 'bridge' || manifest.cues[cutId]?.kind === 'entry')) {
      offset = positions.has(next) ? Math.ceil(elapsed / bar) * bar : destinationBar * bar;
    }
    origin = now + length - offset;
    sound(bed,bedBytes,now+length,offset,talking ? .49 : 1,talking && bedId !== 'speech' ? 1150 : 0);
    const message = [rooms[next], talking ? 'speech arrangement' : waiting ? 'line waiting' : 'playing'];
    if (cutId) message.push(manifest.cues[cutId].label);
    say(message.join(' · '));
  } catch (error) { warn(error,version); }
}
function openRoom(next, cut='auto') {
  return arrange(next,{cut,speech:false,wait:false});
}
function switchSpeech() {
  return arrange(room,{keep:true,speech:!talking,voice:!talking});
}
function switchWait() {
  return arrange(room,{keep:true,wait:!waiting,cut:waiting && !talking ? 'restart' : null});
}
function bell() {
  // The first beat of the release is silent for the actual bell or UI effect.
  return openRoom('results','bell-release');
}
function pause() {
  if (paused) return arrange(room,{keep:true});
  held = phase(); paused = true;
  clearSound(); update(); say(rooms[room] + ' · paused. The current tail releases.');
}
const steps = [
  [8,()=>openRoom('menu','menu-in')], [6,()=>openRoom('options')], [4,()=>openRoom('menu')],
  [6,()=>openRoom('day-one','factory-open')], [4,()=>arrange('day-one',{cut:'gate',keep:true})],
  [6,()=>arrange('day-one',{cut:'floor',keep:true})], [4,()=>openRoom('console','depart')],
  [8,()=>arrange('console',{keep:true,speech:true,voice:true})], [6,()=>openRoom('security','appointment')],
  [12,()=>openRoom('conveyor')], [6,()=>switchWait()], [8,()=>switchWait()],
  [8,()=>switchSpeech()], [4,()=>switchSpeech()], [6,()=>bell()], [8,()=>openRoom('menu','menu-in')]
];
async function route() {
  stop(); demo = true; update();
  const version = routeToken;
  async function next(i) {
    if (version !== routeToken) return;
    if (i === steps.length) { demo = false; say('Route complete · Menu continues.'); update(); return; }
    await steps[i][1]();
    if (version === routeToken) {
      const upcoming = {0:'options', 6:'security', 8:'conveyor', 14:'menu'}[i];
      if (upcoming) buffer(entry(upcoming).file).catch(() => {});
      timer = setTimeout(() => next(i + 1), steps[i][0] * beat * 1000);
    }
  }
  await next(0);
}
async function solo() {
  stop();
  const id = $('pick').value;
  if (manifest.tracks[id] || Object.hasOwn(rooms,id)) return openRoom(id,null);
  const version = token, item = entry(id);
  try {
    await audioReady();
    const data = await buffer(item.file);
    if (version !== token) return;
    sound(item,data,ctx.currentTime+.015);
    update(); say(item.label + (item.loop ? ' · repeating' : ' · one shot'));
  } catch (error) { warn(error,version); }
}
async function downloadSelection() {
  const id = $('pick').value;
  const a = document.createElement('a');
  const track = manifest.tracks[id];
  if (track) {
    a.href = track.file; a.download = track.file.split('/').pop(); a.click();
    return;
  }
  $('download').disabled = true;
  try {
    const response = await fetch(manifest.reel.file);
    if (!response.ok) throw Error('The cue reel could not be downloaded.');
    const sr = manifest.sampleRate;
    const data = await new OfflineAudioContext(2, 1, sr).decodeAudioData(await response.arrayBuffer());
    const [from, to] = manifest.cues[id].frames;
    const frames = to - from;
    const bytes = new ArrayBuffer(44 + frames * 4), view = new DataView(bytes);
    const tag = (at, name) => [...name].forEach((ch,i)=>view.setUint8(at+i,ch.charCodeAt(0)));
    tag(0,'RIFF'); view.setUint32(4,bytes.byteLength-8,true); tag(8,'WAVE'); tag(12,'fmt ');
    view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,2,true);
    view.setUint32(24,sr,true); view.setUint32(28,sr*4,true); view.setUint16(32,4,true);
    view.setUint16(34,16,true); tag(36,'data'); view.setUint32(40,frames*4,true);
    for (let c=0;c<2;c++) {
      const samples = data.getChannelData(c);
      for (let i=0;i<frames;i++) {
        const x = Math.max(-1,Math.min(1,samples[from+i]));
        view.setInt16(44+4*i+2*c,Math.round(x*(x<0?32768:32767)),true);
      }
    }
    a.href=URL.createObjectURL(new Blob([bytes],{type:'audio/wav'}));
    a.download=id+'.wav'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),60000);
  } catch(error) { say(error.message); }
  finally { $('download').disabled=false; }
}
function group(label, items) {
  const el = document.createElement('optgroup'); el.label = label;
  for (const [id, title] of items) el.append(new Option(title,id));
  $('pick').append(el);
}
function manual(fn) { return () => { cancelRoute(); fn(); }; }
function seekMarker() {
  if (pendingSeek !== null && take.readyState) { take.currentTime = pendingSeek; pendingSeek = null; }
}
for (const b of document.querySelectorAll('[data-bar]')) b.onclick = () => {
  pendingSeek = Number(b.dataset.bar)*bar; seekMarker();
  take.play().catch(() => say('Use the recording’s Play control.'));
};
take.onloadedmetadata = seekMarker;
take.onplay = () => {
  cancelRoute(); clearSound(); room = null; paused = talking = waiting = false;
  update(); say('Uninterrupted Conveyor · two 64-bar passes');
};
take.onpause = update;
$('mute').checked = localStorage.getItem('lf-day-two-music-muted') === 'on';
take.muted = $('mute').checked;
$('mute').onchange = () => {
  const muted = $('mute').checked;
  localStorage.setItem('lf-day-two-music-muted',muted ? 'on' : 'off');
  take.muted = muted;
  if (master) master.gain.setTargetAtTime(muted ? 0 : 1,ctx.currentTime,.012);
};
$('download').onclick = downloadSelection;
$('route').onclick = route; $('pause').onclick = manual(pause);
$('stop').onclick = () => stop();
$('talk').onclick = manual(switchSpeech); $('wait').onclick = manual(switchWait);
$('bell').onclick = manual(bell); $('solo').onclick = solo;
document.addEventListener('visibilitychange',()=>{ if (document.hidden) stop('Hidden · stopped. Choose a passage to resume.'); });
window.addEventListener('pagehide',()=>stop());
(async function init(){
  $('route').disabled = $('solo').disabled = true;
  update();
  try {
    const response = await fetch('cues.json');
    if (!response.ok) throw Error('Cue sheet unavailable.');
    manifest = await response.json();
    for (const [id,name] of Object.entries(rooms)) {
      const b=document.createElement('button'); b.textContent=name; b.dataset.room=id;
      b.onclick=manual(()=>openRoom(id)); $('rooms').append(b);
    }
    group('Room recordings',Object.keys(manifest.tracks).map(id=>[id,rooms[id]]));
    for (const [kind,label] of Object.entries(labels)) {
      group(label,Object.entries(manifest.cues).filter(([,c])=>c.kind===kind).map(([id,c])=>[id,c.label]));
    }
    $('pick').value='conveyor';
    $('download').disabled = $('route').disabled = $('solo').disabled = false; update();
  } catch (error) { say(error.message); }
})();
