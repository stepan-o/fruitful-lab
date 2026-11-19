// All destination sizes are canvas units. Set up the camera or DPI transform once in the host.
export function drawAsset(ctx, manifest, images, id, x, y, options = {}) {
  const entry = manifest.assets[id];
  if (!entry) throw new RangeError('Unknown Days 2–4 art asset ' + id);
  const image = images[entry.atlas];
  if (!image) throw new Error('Load atlas before drawing ' + entry.atlas);
  const [sx, sy, sw, sh] = entry.rect;
  const scale = options.scale ?? 1;
  const w = options.width ?? sw * scale;
  const h = options.height ?? sh * scale;
  if (![x, y, w, h, scale].every(Number.isFinite) || w <= 0 || h <= 0 || scale <= 0) {
    throw new RangeError('Expected finite destination and positive size/scale');
  }
  const [left, top, right, bottom] = entry.insets ?? [0, 0, 0, 0];
  if (left + right >= sw || top + bottom >= sh ||
      w < (left + right) * scale || h < (top + bottom) * scale) {
    throw new RangeError('Destination too small for ' + id + ' borders');
  }
  const xs = [0, left, sw - right, sw];
  const ys = [0, top, sh - bottom, sh];
  const targetX = [x, x + left * scale, x + w - right * scale, x + w];
  const targetY = [y, y + top * scale, y + h - bottom * scale, y + h];
  ctx.save();
  try {
    ctx.imageSmoothingEnabled = false;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const srcW = xs[col + 1] - xs[col];
        const srcH = ys[row + 1] - ys[row];
        const dstW = targetX[col + 1] - targetX[col];
        const dstH = targetY[row + 1] - targetY[row];
        if (srcW && srcH && dstW && dstH) {
          ctx.drawImage(image, sx + xs[col], sy + ys[row], srcW, srcH,
            targetX[col], targetY[row], dstW, dstH);
        }
      }
    }
  } finally {
    ctx.restore();
  }
}

const stations = ['intake', 'wash', 'belt', 'forge'];
const leads = ['LIMEN', 'STILETTO'];
const panelFrames = {
  available: 'sec-panel-active', committed: 'sec-panel-committed',
  expired: 'sec-panel-expired', spent: 'sec-panel-spent',
};
const label = e => ({seq: e.seq, tick: e.tick, speaker: e.actor, subject: e.subject, text: e.text, anchor: e.anchor, at: e.at});

// Supply a hash-verified Frame from shifts/wire.read. Clicking the desk only sets ui.openCase.
export function selectShiftArt(frame, ui = {}) {
  const {tick, scene: {world, agents, items, events}} = frame;
  const room = ui.room ?? 'security';
  const live = world.phase === 'shift';
  const here = events.filter(e => e.day === world.day && e.room === room && e.tick <= tick);
  const recent = here.filter(e => tick - e.tick <= (ui.bubbleTicks ?? 60));
  const speech = new Map();
  for (const e of recent) {
    if (e.kind === 'speech.delivered' || e.kind === 'endorsement.public') {
      speech.set(e.actor, {...label(e), asset: 'fl-bubble', nameplate: 'fl-bubble-nameplate'});
    } else if (e.kind === 'chat.interrupted' && speech.has(e.subject)) {
      speech.get(e.subject).asset = 'fl-bubble-interrupted';
    }
  }
  const hasCase = world.status !== 'none' && Boolean(world.caseId);
  const caseOpen = live && world.status === 'open';
  const mayIssue = caseOpen && !world.spent && tick < world.deadline;
  let panel = null;
  if (room === 'security' && hasCase && ui.openCase === world.caseId) {
    let state = 'expired';
    if (world.status === 'pass' && world.pass?.valid) state = 'committed';
    else if (caseOpen && world.spent) state = 'spent';
    else if (mayIssue) state = 'available';
    panel = {asset: panelFrames[state], state, incident: world.caseId, mayIssue};
  }
  const bob = agents.find(a => a.id === 'bob');
  const release = here.findLast(e => e.kind === 'custody.release');
  const lastGate = here.findLast(e => ['worker.cleared', 'queue.called', 'case.resolved', 'queue.advanced'].includes(e.kind));
  let gate = null;
  if (room === 'security' && live) {
    gate = world.called ? 'fl-gate-check' : null;
    if (caseOpen || ['demand', 'refusal', 'clash'].includes(world.pressure)) gate = 'fl-gate-held';
    else if (['worker.cleared', 'case.resolved'].includes(lastGate?.kind)) gate = 'fl-gate-released';
  }
  const interrupted = recent.findLast(e => e.kind === 'chat.interrupted');
  const signal = room === 'security' && caseOpen ? (mayIssue ? 'sec-signal-action' : 'sec-signal-report') : null;
  const pass = world.pass ? {
    asset: world.pass.valid ? 'sec-pass-issued' : 'sec-pass-expired',
    holder: world.pass.holder, issuer: world.pass.issuer, day: world.pass.day,
  } : null;

  // The latest attributed report is retained in world.report after it leaves the event window.
  const publicReports = new Map();
  for (const e of [...events, world.report]) {
    if (e?.kind === 'report.received' && e.day === world.day && e.tick <= tick &&
        (!e.audience.length || e.audience.includes('Producer'))) {
      publicReports.set(e.seq, label(e));
    }
  }
  const choices = [];
  const add = (action, target, incident) => choices.push({action, target, room, incident,
    asset: world.spent ? 'sec-panel-spent' : 'sec-panel-active', enabled: !world.spent});
  if (world.phase === 'briefing' && room === 'security') {
    for (const lead of leads) add('appoint', lead, 'morning');
  }
  if (live && room === 'security') {
    if (panel?.mayIssue || panel?.state === 'spent') add('issue-pass', 'bob', world.caseId);
    if (world.lead === 'LIMEN' && !world.quick && world.waiting.length && world.pressure !== 'clash') {
      add('accelerate', 'LIMEN', 'D' + world.day + '-checks');
    }
    if (world.pressure === 'clash') {
      for (const lead of leads) add('endorse', lead, 'D' + world.day + '-clash');
    }
  }
  if (live && room === 'conveyor' && world.lead === 'LIMEN') {
    if (world.pace !== 'slow') add('slow', 'STILETTO', 'D' + world.day + '-pace');
    add('rush', 'STILETTO', 'D' + world.day + '-pace');
  }

  return {
    choices, phase: world.phase, day: world.day, room, signal, gate, panel, pass,
    custodyInsert: room !== 'security' ? null : bob?.duty === 'detained' ? 'sec-custody-held' : release ? 'sec-custody-released' : null,
    nextStep: here.filter(e => e.kind === 'queue.advanced').map(label),
    returnedOriginal: here.filter(e => e.kind === 'credential.returned').map(e => ({...label(e), asset: 'sec-id-bob-world'})),
    speeches: live ? [...speech.values()].sort((a, b) => a.seq - b.seq) : [],
    interruption: live && interrupted ? {seq: interrupted.seq, speaker: interrupted.subject, anchor: interrupted.anchor} : null,
    reports: [...publicReports.values()].sort((a,b) => a.seq - b.seq),
    posts: room === 'conveyor' && live ? stations.map((station, index) => ({
      station, operator: world.coverage[index] || null,
      asset: world.coverage[index] ? 'fl-post-staffed' : 'fl-post-vacant',
    })) : [],
    handoffs: room === 'conveyor' && live ? stations.map((station, index) => {
      const piece = items.find(p => p.status === 'process' && p.stage === index);
      const event = piece && here.findLast(e => e.anchor === 'control.' + station &&
        e.subject === piece.id && (e.kind === 'handoff.started' || e.kind === 'handoff.wait'));
      const waitingForClear = event?.kind === 'handoff.wait';
      let asset = null;
      if (world.coverage[index] && piece) {
        asset = 'fl-handoff-ready';
        if (event?.kind === 'handoff.started' && event.text === 'rushed') asset = 'fl-handoff-rushed';
        if (event?.kind === 'handoff.started' && event.text === 'all-clear') asset = 'fl-handoff-clear';
      }
      return {station, seq: event?.seq ?? null, asset, waitingForClear};
    }) : [],
    rack: {thisShift: world.phase === 'briefing' ? null : world.shiftOutput, total: world.completed.length,
      items: items.filter(item => item.status === 'rack').map(({id, at}) => ({id, at, asset: 'fl-cortex-finished'}))},
    surface: world.phase === 'briefing' ? 'co-briefing-chassis' : world.phase === 'close' ? 'co-close-docket' : null,
    transition: world.phase === 'close' ? 'co-overnight' : world.phase === 'briefing' && world.day > 2 ? 'co-next-shift' : null,
    bids: leads.map(lead => ({lead, security: lead, conveyor: lead === 'LIMEN' ? 'STILETTO' : 'LIMEN',
      asset: live && world.lead === lead ? 'co-bid-committed' : world.phase === 'briefing' && ui.previewLead === lead ? 'co-bid-selected' : 'co-bid-idle'})),
  };
}

// Construct one INPUT_COMMAND payload on explicit commit. Retry with the exact same payload.
export function commandPayload(frame, ui, action, target, commandId) {
  if (typeof commandId !== 'string' || !/^[\w-]{1,96}$/.test(commandId) || commandId in Object.prototype) return null;
  const choice = selectShiftArt(frame, ui).choices.find(c => c.enabled && c.action === action && c.target === target);
  if (!choice) return null;
  return {client_cmd_id: commandId, tick_target: frame.tick, cmd: {id: commandId, tick: frame.tick,
    day: frame.scene.world.day, action, target, room: choice.room, incident: choice.incident}};
}
