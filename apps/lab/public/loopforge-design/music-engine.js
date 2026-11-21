// Music-owned observation consumer. This page has no game connection or audio output.
(() => {
  'use strict';
  const root = document.querySelector('#music-fixture');
  if (!root) return;
  const field = name => root.querySelector('[data-ms="' + name + '"]');
  const control = action => root.querySelector('[data-ms-action="' + action + '"]');
  const names = {
    landing: 'Landing', menu: 'Main menu', options: 'Settings / Options', reading: 'Reading / journal',
    intro: 'Day 1 intro', console: 'Producer console', play: 'Factory floor', security: 'Security',
    conveyor: 'Conveyor', results: 'Results'
  };
  const phrases = {
    landing: 'Rapid descent into a held off-note.', menu: 'Rolling break and open voicings.',
    options: 'Drums alone. Move the falling accents around the kit.', reading: 'Open intervals with long rests.',
    intro: 'Two-note fragments between the walk-in and room reveals.', console: 'Dry pulse under the quota.',
    security: 'Dry rim clicks around the desk.', play: 'Neutral room voicing.', results: 'Two-note return in an open voicing.'
  };
  const surfaces = ['landing', 'menu', 'options', 'reading', 'intro', 'console', 'play', 'results'];
  const rooms = [null, 'security', 'conveyor'];
  const production = ['unknown', 'idle', 'running', 'waiting', 'jammed'];
  const priority = new Map([['carrier.moved', 1], ['line.jammed', 2], ['shift.bell', 3]]);
  const defaults = {surface:'menu', room:null, pressure:null, production:'unknown', speech:false, paused:false};
  const position = state => state.surface === 'play' && state.room ? state.room : state.surface;
  const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const integer = value => Number.isSafeInteger(value) && value >= 0;
  const validId = value => typeof value === 'string' && /^[A-Za-z0-9._-]{1,80}$/.test(value);

  function readSnapshot(payload) {
    if (!Object.keys(payload).every(key => Object.hasOwn(defaults, key))) return null;
    const state = {...defaults, ...payload};
    if (state.surface === 'unknown') state.surface = 'menu';
    if (!surfaces.includes(state.surface) || !rooms.includes(state.room) ||
        (state.surface !== 'play' && state.room !== null) ||
        !production.includes(state.production) || typeof state.speech !== 'boolean' ||
        typeof state.paused !== 'boolean') return null;
    if (state.pressure !== null && (!Number.isFinite(state.pressure) || state.pressure < 0 || state.pressure > 1)) return null;
    return state;
  }

  function newSession(sessionId, muted) {
    return {sessionId, source:'manual', beat:0, seq:0, lastStateBeat:-1, state:{...defaults}, active:'menu',
      muted, energy:0.35, dense:false, seen:new Map(), pending:null, lastMove:null, answer:'', receipt:'Manual session ready.'};
  }

  function clearAccents(model) {
    model.pending = null;
    model.lastMove = null;
    model.answer = '';
  }

  function observe(model, packet) {
    if (!record(packet) || packet.version !== 1 || packet.sessionId !== model.sessionId ||
        packet.source !== model.source) return 'Dropped · incorrect version, session or source.';
    if (!integer(packet.seq) || packet.seq <= model.seq) return 'Dropped · sequence already consumed or out of order.';
    if (!integer(packet.observedBeat) || packet.observedBeat > model.beat || !record(packet.payload))
      return 'Dropped · invalid timestamp or payload.';
    const p = packet.payload;
    if (packet.kind === 'state') {
      const next = readSnapshot(p);
      if (!next) return 'Dropped · invalid state.';
      if (packet.observedBeat < model.lastStateBeat) return 'Dropped · superseded snapshot.';
      if (position(next) !== position(model.state) || next.speech !== model.state.speech ||
          next.paused !== model.state.paused || next.production === 'waiting' || next.production === 'idle') clearAccents(model);
      model.seq = packet.seq;
      model.lastStateBeat = packet.observedBeat;
      model.state = next;
      return 'Accepted · latest visible state.';
    }
    if (packet.kind !== 'cue' || !validId(p.id) || !priority.has(p.type) ||
        !rooms.includes(p.room) || p.visibility !== 'public') return 'Dropped · invalid or private cue.';
    model.seq = packet.seq;
    if (model.beat - packet.observedBeat > 2) return 'Dropped · cue older than two beats.';
    if (model.seen.has(p.id)) return 'Dropped · duplicate event ID.';
    if (model.seen.size >= 64) return 'Dropped · event window full.';
    model.seen.set(p.id, packet.observedBeat);
    if (p.type === 'shift.bell' ? p.room !== null :
        p.room !== 'conveyor' || position(model.state) !== p.room || model.active !== p.room)
      return 'Dropped · outside the settled listening position.';
    if (model.muted || model.state.paused || model.state.speech) return 'Dropped · mix is muted, paused or protecting speech.';
    if (p.type === 'carrier.moved' && model.state.production !== 'running')
      return 'Dropped · carrier movement needs a confirmed running state.';
    if (model.pending && priority.get(model.pending.type) >= priority.get(p.type))
      return 'Coalesced · a cue of equal or higher priority is already scheduled.';
    model.pending = {id:p.id, type:p.type};
    return 'Accepted · ' + p.type + ' scheduled for the next beat.';
  }

  function advance(model) {
    if (model.state.paused) return;
    model.beat += 1;
    model.answer = '';
    for (const [id, observed] of model.seen) if (model.beat - observed > 2) model.seen.delete(id);
    model.energy += ((model.state.pressure ?? 0.35) - model.energy) / 2;
    if (model.energy >= 0.7) model.dense = true;
    if (model.energy <= 0.5) model.dense = false;
    if (model.beat % 4 === 0) model.active = position(model.state);
    if (!model.pending) return;
    const {type} = model.pending;
    if (type === 'carrier.moved') {
      model.answer = model.lastMove !== null && model.beat - model.lastMove <= 2 ? 'Linked bass riff.' : 'Single bass answer.';
      model.lastMove = model.beat;
    } else {
      model.answer = type === 'line.jammed' ? 'One clipped jam accent.' : 'Bell phrase ending.';
      model.lastMove = null;
    }
    model.receipt = 'Delivered on beat ' + (model.beat % 4 + 1) + ' · ' + model.answer;
    model.pending = null;
  }

  let generation = 0, sequence = 0, eventNumber = 0, lastCue = null, lastPacket = null;
  let model = newSession('fixture-' + ++generation, false);

  function send(kind, payload, observedBeat = model.beat) {
    lastPacket = {version:1, source:'manual', sessionId:model.sessionId, seq:++sequence, observedBeat, kind, payload};
    model.receipt = observe(model, lastPacket);
  }
  function setState(patch) { send('state', {...model.state, ...patch}); }
  function cue(type) {
    lastCue = {id:'event-' + ++eventNumber, type, room:type === 'shift.bell' ? null : 'conveyor', visibility:'public'};
    send('cue', lastCue);
  }
  function conveyorPhrase() {
    if (model.state.production === 'waiting' || model.state.production === 'jammed') return 'Bass gap. Fast hats carry the pulse.';
    if (model.state.production === 'running') return 'Half-time snare. Bass can answer confirmed motion.';
    return 'Half-time snare over a steady hat. Neutral bass.';
  }
  function draw() {
    const s = model.state, target = position(s);
    field('position').value = target;
    field('pressure').value = s.pressure === null ? '' : String(s.pressure);
    field('speech').checked = s.speech; field('pause').checked = s.paused; field('mute').checked = model.muted;
    field('count').textContent = 'Bar ' + (Math.floor(model.beat / 4) + 1) + ' · beat ' + (model.beat % 4 + 1);
    field('arrangement').textContent = names[model.active];
    field('phrase').textContent = model.answer || (model.active === 'conveyor' ? conveyorPhrase() : phrases[model.active]);
    const changes = [];
    if (target !== model.active) changes.push(names[target] + ' at next bar');
    if (model.pending) changes.push(model.pending.type + ' on next beat');
    field('pending').textContent = changes.join(' · ') || 'No change queued.';
    let mix = 'Normal mix';
    if (s.speech) mix = 'Speech foreground · duck 8 dB';
    if (s.paused) mix = 'Paused · phrase held';
    if (model.muted) mix = 'Muted';
    field('mix').textContent = mix + ' · ' + (model.dense ? 'dense' : 'restrained') + ' · smoothed pressure ' + model.energy.toFixed(2);
    field('receipt').textContent = model.receipt;
    field('packet').textContent = JSON.stringify(lastPacket, null, 2);
    for (const name of ['hold','move','jam']) control(name).disabled = target !== 'conveyor' || model.active !== 'conveyor';
    control('repeat').disabled = !lastCue;
    control('stale').disabled = model.beat < 3;
    control('bar').disabled = s.paused; control('beat').disabled = s.paused;
  }
  root.addEventListener('change', event => {
    const input = event.target, key = input.dataset.ms;
    if (key === 'position') {
      const value = input.value, floor = value === 'conveyor' || value === 'security';
      setState({surface:floor ? 'play' : value, room:floor ? value : null, production:'unknown', pressure:null});
    } else if (key === 'pressure') setState({pressure:input.value === '' ? null : Number(input.value)});
    else if (key === 'speech' || key === 'pause') setState({[key === 'pause' ? 'paused' : key]:input.checked});
    else if (key === 'mute') {
      model.muted = input.checked; clearAccents(model);
      model.receipt = 'Local output preference changed.';
    }
    draw();
  });
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-ms-action]');
    if (!button || button.disabled) return;
    switch (button.dataset.msAction) {
      case 'bar':
        for (let n = 4 - model.beat % 4; n > 0; n--) advance(model);
        break;
      case 'beat': advance(model); break;
      case 'hold': setState({production:'waiting'}); break;
      case 'move': setState({production:'running'}); cue('carrier.moved'); break;
      case 'jam': setState({production:'jammed'}); cue('line.jammed'); break;
      case 'bell': cue('shift.bell'); break;
      case 'repeat': send('cue', lastCue, lastCueBeat); draw(); return;
      case 'stale': send('cue', {id:'old-' + ++eventNumber, type:'shift.bell', room:null, visibility:'public'}, model.beat - 3); break;
      case 'reset':
        model = newSession('fixture-' + ++generation, model.muted);
        sequence = 0; eventNumber = 0; lastCue = null; setState({});
        model.receipt = 'New manual session · phrase and event history cleared.';
        break;
    }
    if (['move','bell','jam'].includes(button.dataset.msAction)) lastCueBeat = model.beat;
    draw();
  });
  let lastCueBeat = 0;
  setState({});
  draw();
})();

// One media element keeps the two comparison takes mutually exclusive.
(() => {
  'use strict';
  const deck = document.querySelector('#music-landing-01');
  if (!deck) return;
  const audio = deck.querySelector('audio');
  const status = deck.querySelector('[data-ms-listen-status]');
  const takes = [...deck.querySelectorAll('[data-ms-take]')];
  let selected = 'b';
  let pendingSeek = null;
  let request = 0;

  function setPosition(seconds) {
    pendingSeek = seconds;
    if (audio.readyState >= 1) {
      audio.currentTime = Math.min(seconds, audio.duration || 24);
      pendingSeek = null;
    }
  }
  function play() {
    const ticket = ++request;
    audio.play().catch(error => {
      if (ticket === request && error.name !== 'AbortError')
        status.textContent = 'Audio could not start. Use Play or open the listening copy below.';
    });
  }
  function stop() { request++; audio.pause(); }

  audio.addEventListener('loadedmetadata', () => {
    if (pendingSeek !== null) setPosition(pendingSeek);
  });
  audio.addEventListener('error', () => {
    status.textContent = 'Audio unavailable. Open a listening copy below to retry.';
  });
  deck.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-ms-seek')) {
      setPosition(Number(button.dataset.msSeek) * 60 / 170);
      play();
      return;
    }
    const next = button.dataset.msTake;
    if (!['a','b'].includes(next) || next === selected) return;
    const resume = !audio.paused && !audio.ended;
    const seconds = audio.ended ? 0 : pendingSeek ?? audio.currentTime;
    stop();
    selected = next;
    pendingSeek = seconds;
    audio.src = '/loopforge-design/music-audition/landing-' + next + '.mp3';
    audio.load();
    takes.forEach(take => take.setAttribute('aria-pressed', String(take.dataset.msTake === next)));
    status.textContent = 'Take ' + next.toUpperCase() + ' selected at ' + seconds.toFixed(1) + ' s.';
    if (resume) play();
  });
  document.addEventListener('design:panelchange', () => { if (deck.closest('.panel').hidden) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
})();
// Score comparisons follow bar position. Picture comparisons follow elapsed seconds.
(() => {
  const panel = document.querySelector('#music-engine');
  if (!panel) return;
  const media = [...panel.querySelectorAll('audio, video')];
  const stopAll = () => media.forEach(player => player.pause());
  panel.addEventListener('play', event => {
    if (media.includes(event.target)) media.forEach(other => {
      if (other !== event.target) other.pause();
    });
  }, true);
  document.addEventListener('design:panelchange', () => { if (panel.hidden) stopAll(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  window.addEventListener('pagehide', stopAll);

  for (const deck of panel.querySelectorAll('[data-grid-player]')) {
    const score = deck.dataset.gridPlayer === 'grid';
    const player = deck.querySelector('audio, video');
    const status = deck.querySelector('[role="status"]');
    const buttons = [...deck.querySelectorAll('[data-tempo]')];
    let tempo = 170;
    let target = null;
    const seek = seconds => {
      target = seconds;
      if (player.readyState >= 1 && Number.isFinite(player.duration)) {
        player.currentTime = Math.min(target, player.duration);
        target = null;
      }
    };
    const play = () => player.play().catch(error => {
      if (error.name !== 'AbortError') status.textContent = 'Use Play or open the direct listening copy.';
    });
    player.addEventListener('loadedmetadata', () => { if (target !== null) seek(target); });
    player.addEventListener('error', () => { status.textContent = 'Media unavailable. Try the direct listening copy.'; });
    deck.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.hasAttribute('data-bar')) {
        const bar = Number(button.dataset.bar);
        seek((bar - 1) * 4 * 60 / tempo);
        status.textContent = tempo + ' / ' + tempo / 2 + ' · bar ' + bar;
        play();
        return;
      }
      const next = Number(button.dataset.tempo);
      if (![164, 170].includes(next) || tempo === next) return;
      const playing = !player.paused && !player.ended;
      const seconds = player.ended ? 0 : target ?? player.currentTime;
      target = seconds * (score ? tempo / next : 1);
      tempo = next;
      player.src = '/loopforge-design/music-audition/session-02/' +
        (score ? 'grid-' + tempo + '.mp3' : 'speech-' + tempo + '.mp4');
      player.load();
      buttons.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.tempo) === tempo)));
      status.textContent = tempo + ' / ' + tempo / 2 + (score ? ' · same bar.' : ' · same picture time.');
      if (playing) play();
    });
  }
})();
