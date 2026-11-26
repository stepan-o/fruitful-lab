import { manifest, transitionCue, type Cue, type MusicView, type Surface } from "./music-score";

const root = "/loopforge-design/music-audition/day-two/";
const seconds = (frame: number) => frame / manifest.sampleRate;
const bar = 4 * 60 / manifest.tempo;
const { tracks, cues, reel } = manifest;
const opening = tracks.conveyor.openingFrames;
const openingLength = seconds(opening[1] - opening[0]);
const isLine = (surface: Surface) => surface === "conveyor" || surface === "day-one-line";

function mixSurface(surface: Surface) {
  if (surface === "console" || surface === "briefing") return "console";
  if (surface === "day-one-security") return surface;
}

function fadeTo(param: AudioParam, value: number, at: number) {
  if (typeof param.cancelAndHoldAtTime === "function") param.cancelAndHoldAtTime(at);
  else {
    const current = param.value;
    param.cancelScheduledValues(at);
    param.setValueAtTime(current, at);
  }
  param.linearRampToValueAtTime(value, at + .045);
}

function replacesBed(view: MusicView) {
  return view.production === "waiting" || (isLine(view.surface) && view.speech);
}

type Cut = { file: string; range: number[]; loop: boolean };
function reelCut(id: Cue): Cut {
  const cue = cues[id];
  return { file: reel.file, range: cue.frames, loop: cue.kind === "loop" };
}
function arrangement(view: MusicView): Cut | null {
  const room = view.surface;
  if (room === "departure") return null;
  if (isLine(room) && view.speech) return reelCut("speech");
  if (view.production === "waiting") return reelCut("waiting");
  if (isLine(room)) return { file: tracks.conveyor.file, range: tracks.conveyor.layers[view.tier].frames, loop: true };
  if (room === "menu" || room === "options" || room === "security" || room === "day-one-security") {
    const track = tracks[room === "day-one-security" ? "security" : room];
    return { file: track.file, range: track.loopFrames, loop: true };
  }
  return reelCut(room === "results" ? "results" : (room === "day-one" || room === "first-line") ? "day-one" : "console");
}
type Voice = { source: AudioBufferSourceNode; gain: GainNode; pickup: boolean };
export type PlaybackStatus = "ready" | "playing" | "muted" | "unavailable";

/** Owns only presentation time. No worker or command interface is available here. */
export class CampaignMusicPlayer {
  private context: AudioContext | null = null;
  private active = false;
  private paused = false;
  private visible = true;
  private view: MusicView | null = null;
  private epoch = 0;
  private cueEpoch = 0;
  private pickup: { id: Cue; end: Promise<number> } | null = null;
  private elapsed = 0;
  private since: number | null = null;
  private startedAtOffset = 0;
  private overlayElapsed = 0;
  private playingOverlay = false;
  private bedMix: { gain: AudioParam; cutoff: AudioParam; start: number } | null = null;
  private freshEntry = false;
  private restored = false;
  private positions = new Map<Surface, number>();
  private voices = new Set<Voice>();
  private buffers = new Map<string, AudioBuffer>();
  private pending = new Map<string, Promise<AudioBuffer>>();
  private report: (status: PlaybackStatus) => void;
  constructor(report: (status: PlaybackStatus) => void) { this.report = report; }

  async enable() {
    if (this.active && this.context?.state === "running") return;
    this.active = true;
    try {
      const ctx = this.context ??= new AudioContext({ sampleRate: 32000 });
      await ctx.resume();
      if (!this.active || this.context !== ctx) return;
      this.report("playing");
      this.interrupt();
      this.play();
    } catch {
      if (this.active) this.failed();
    }
  }
  mute() {
    this.active = false;
    this.interrupt();
    this.report("muted");
  }
  visibility(visible: boolean) {
    if (this.visible === visible) return;
    this.visible = visible;
    this.interrupt();
    if (visible && this.active && this.context?.state === "suspended") void this.enable();
    else if (visible) this.play();
  }
  reset(fresh = false) {
    this.interrupt();
    if (this.view?.surface === "menu" || this.view?.surface === "options")
      this.positions.set(this.view.surface, this.elapsed);
    for (const key of this.positions.keys())
      if (key !== "menu" && key !== "options") this.positions.delete(key);
    this.view = null;
    this.elapsed = 0;
    this.freshEntry = fresh;
    this.restored = !fresh;
  }
  update(next: MusicView, paused: boolean) {
    const prev = this.view, wasPaused = this.paused;
    const previousCut = prev && arrangement(prev), nextCut = arrangement(next);
    const moved = prev?.surface !== next.surface;
    let cue = transitionCue(prev, next);
    if (this.restored || (prev && wasPaused) || paused) cue = undefined;
    if (this.freshEntry && !paused && next.surface === "day-one-security") cue = "factory-open";
    this.view = next;
    this.paused = paused;
    if (!moved && wasPaused === paused && !cue && prev?.speech === next.speech &&
        previousCut?.range === nextCut?.range) return;

    const mix = mixSurface(next.surface);
    if (prev && mix && mixSurface(prev.surface) === mix && !paused && !wasPaused &&
        prev.production !== "waiting" && next.production !== "waiting" && (!cue || cue === "gate")) {
      // The console, call and supervisor bids share one performance. Day One
      // Security also keeps its bass running through speech and the gate.
      const ctx = this.context;
      if (ctx && this.visible && this.active && ctx.state === "running") {
        if (prev.speech !== next.speech && this.bedMix) {
          const { gain, cutoff, start } = this.bedMix;
          const at = Math.max(ctx.currentTime, start + .020);
          const { speechGain, speechLowpassHz } = manifest.arrangement.interrupt;
          fadeTo(gain, next.speech ? speechGain : 1, at);
          fadeTo(cutoff, next.speech ? speechLowpassHz : ctx.sampleRate / 2, at);
        }
        if (cue) {
          const version = this.cueEpoch;
          void this.startCue(ctx, cue).catch(() => { if (version === this.cueEpoch) this.failed(); });
        }
      }
      return;
    }

    this.interrupt(moved || wasPaused !== paused || !!cue);
    if (moved) {
      if (prev?.surface === "first-line") {
        // Only the opening belongs to the solo reveal. Its following day bed
        // cannot advance a two-worker arrangement before that crew arrives.
        this.positions.set("day-one-line", Math.min(this.elapsed, openingLength));
      } else if (prev) this.positions.set(mixSurface(prev.surface) ?? prev.surface, this.elapsed);
      this.elapsed = this.positions.get(mix ?? next.surface) ?? (this.restored && (isLine(next.surface) || next.surface === "first-line") ? openingLength : 0);
    }
    if (moved || !prev || !replacesBed(prev)) this.overlayElapsed = this.elapsed;
    this.restored = false;
    if (!paused) this.freshEntry = false;
    this.play(cue);
  }
  dispose() {
    this.active = false;
    this.interrupt();
    const ctx = this.context;
    this.context = null;
    this.buffers.clear();
    if (ctx) void ctx.close().catch(() => {});
  }
  private failed() {
    this.active = false;
    this.interrupt();
    this.report("unavailable");
  }
  private interrupt(cancelPickup = true) {
    this.epoch++;
    this.bedMix = null;
    if (cancelPickup) {
      this.cueEpoch++;
      this.pickup = null;
    }
    const now = this.context?.currentTime ?? 0;
    if (this.since !== null && now >= this.since) {
      // Its destination is already sounding. Future bed edits keep their
      // current phrase without reapplying the original entry alignment.
      this.pickup = null;
      const position = this.startedAtOffset + now - this.since;
      if (this.playingOverlay) this.overlayElapsed = position;
      else this.elapsed = position;
    }
    this.since = null;
    for (const voice of this.voices) {
      if (voice.pickup && !cancelPickup) continue;
      const { source, gain } = voice;
      fadeTo(gain.gain, 0, now);
      source.stop(now + .050);
      this.voices.delete(voice);
    }
  }
  private buffer(ctx: AudioContext, file: string) {
    const cached = this.buffers.get(file);
    if (cached) return Promise.resolve(cached);
    const pending = this.pending.get(file);
    if (pending) return pending;
    const request = (async () => {
      const response = await fetch(root + file);
      if (!response.ok) throw Error("Music recording unavailable");
      const decoded = await ctx.decodeAudioData(await response.arrayBuffer());
      if (this.context === ctx && (file === reel.file || (this.view && arrangement(this.view)?.file === file) ||
          (this.view?.surface === "first-line" && file === tracks.conveyor.file))) {
        // Keep the short-cue reel and at most one full decoded recording.
        if (file !== reel.file) for (const key of this.buffers.keys())
          if (key !== reel.file) this.buffers.delete(key);
        this.buffers.set(file, decoded);
      }
      return decoded;
    })().finally(() => this.pending.delete(file));
    this.pending.set(file, request);
    return request;
  }
  private sound(ctx: AudioContext, buffer: AudioBuffer, cut: Cut, when: number, offset: number, duck: boolean, role: "bed" | "cue" | "mixed-bed" = "bed") {
    const begin = seconds(cut.range[0]), end = Math.min(seconds(cut.range[1]), buffer.duration);
    const span = end - begin;
    if (span <= 0) throw Error("Invalid music range");
    const skip = cut.loop ? offset % span : Math.min(offset, span);
    if (!cut.loop && skip >= span) return 0;
    const source = ctx.createBufferSource(), gain = ctx.createGain();
    source.buffer = buffer;
    source.loop = cut.loop;
    source.loopStart = begin;
    source.loopEnd = end;
    let filter: BiquadFilterNode | undefined;
    if (duck || role === "mixed-bed") {
      filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = duck ? manifest.arrangement.interrupt.speechLowpassHz : ctx.sampleRate / 2;
      source.connect(filter).connect(gain);
    } else source.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(duck ? manifest.arrangement.interrupt.speechGain : 1, when + .020);
    if (role === "mixed-bed" && filter)
      this.bedMix = { gain: gain.gain, cutoff: filter.frequency, start: when };
    const voice = { source, gain, pickup: role === "cue" };
    this.voices.add(voice);
    source.onended = () => {
      this.voices.delete(voice);
      source.disconnect();
      filter?.disconnect();
      gain.disconnect();
    };
    if (cut.loop) source.start(when, begin + skip);
    else source.start(when, begin + skip, span - skip);
    return span - skip;
  }
  private startCue(ctx: AudioContext, cue: Cue) {
    const cut = reelCut(cue), version = this.cueEpoch;
    return this.buffer(ctx, cut.file).then(bytes => {
      if (version !== this.cueEpoch) return 0;
      const start = ctx.currentTime + .005;
      return start + this.sound(ctx, bytes, cut, start, 0, !!this.view?.speech, "cue");
    });
  }
  private play(cue?: Cue) {
    const ctx = this.context, view = this.view;
    if (!ctx || !view || !this.active || this.paused || !this.visible || ctx.state !== "running") return;
    const version = this.epoch;
    if (cue) {
      // A posted receipt can arrive well before the destination recording
      // decodes. Give its short cue its own lifecycle across bed mix changes.
      this.pickup = { id: cue, end: this.startCue(ctx, cue) };
    }
    const bed = arrangement(view), pickup = this.pickup;
    const soloOpening = view.surface === "first-line" && !replacesBed(view) && this.elapsed < openingLength;
    void Promise.all([
      bed && this.buffer(ctx, bed.file),
      pickup?.end,
      soloOpening && this.buffer(ctx, tracks.conveyor.file),
    ]).then(([bedBytes, cueEnd, openingBytes]) => {
      if (version !== this.epoch) return;
      let when = Math.max(ctx.currentTime + .005, cueEnd ?? 0);
      const overlay = replacesBed(view);
      let offset = overlay ? this.overlayElapsed : this.elapsed;
      if (pickup && (cues[pickup.id].kind === "bridge" || cues[pickup.id].kind === "entry") && !isLine(view.surface)) {
        const firstBar = pickup.id === "options-menu" ? 49 : pickup.id === "conveyor-security" ? 17 : 1;
        offset = this.positions.has(view.surface) ? Math.ceil(offset / bar) * bar : firstBar * bar;
      }
      if (!bed || !bedBytes) return;
      // The main performance advances only when its source actually sounds.
      // Unheard bridge destinations, decode time and interruption beds own no
      // part of its opening or work-loop phase.
      this.since = when;
      this.startedAtOffset = offset;
      this.playingOverlay = overlay;
      if ((isLine(view.surface) && bed.file === tracks.conveyor.file) || (view.surface === "first-line" && !overlay)) {
        if (offset < openingLength) {
          const intro = { file: tracks.conveyor.file, range: opening, loop: false };
          when += this.sound(ctx, openingBytes || bedBytes, intro, when, offset, view.surface === "first-line" && view.speech);
        }
        offset = Math.max(0, offset - openingLength);
      }
      const liveMix = mixSurface(view.surface) && !overlay;
      const speech = liveMix ? !!this.view?.speech : view.speech;
      this.sound(ctx, bedBytes, bed, when, offset, speech && !(isLine(view.surface) && bed.file === reel.file),
        liveMix ? "mixed-bed" : "bed");
    }).catch(() => { if (version === this.epoch) this.failed(); });
  }
}
