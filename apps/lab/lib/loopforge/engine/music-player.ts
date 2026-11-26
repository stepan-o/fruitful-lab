import { manifest, transitionCue, type Cue, type MusicView, type Surface } from "./music-score";

const root = "/loopforge-design/music-audition/day-two/";
const seconds = (frame: number) => frame / manifest.sampleRate;
const bar = 4 * 60 / manifest.tempo;
const { tracks, cues, reel } = manifest;
const opening = tracks.conveyor.openingFrames;
const openingLength = seconds(opening[1] - opening[0]);
const isLine = (surface: Surface) => surface === "conveyor" || surface === "day-one-line";

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
  if (room === "menu" || room === "options" || room === "security") {
    const track = tracks[room];
    return { file: track.file, range: track.loopFrames, loop: true };
  }
  return reelCut(room === "results" ? "results" : room === "day-one" ? "day-one" : "console");
}
type Voice = { source: AudioBufferSourceNode; gain: GainNode };
export type PlaybackStatus = "ready" | "playing" | "muted" | "unavailable";

/** Owns only presentation time. No worker or command interface is available here. */
export class CampaignMusicPlayer {
  private context: AudioContext | null = null;
  private active = false;
  private paused = false;
  private visible = true;
  private view: MusicView | null = null;
  private epoch = 0;
  private elapsed = 0;
  private since: number | null = null;
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
    if (this.freshEntry && !paused && next.surface === "day-one") cue = "factory-open";
    this.view = next;
    this.paused = paused;
    if (!moved && wasPaused === paused && !cue && prev?.speech === next.speech &&
        previousCut?.range === nextCut?.range) return;

    this.interrupt();
    if (moved) {
      if (prev) this.positions.set(prev.surface, this.elapsed);
      this.elapsed = this.positions.get(next.surface) ?? (this.restored && isLine(next.surface) ? openingLength : 0);
    }
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
  private interrupt() {
    this.epoch++;
    const now = this.context?.currentTime ?? 0;
    if (this.since !== null) this.elapsed += Math.max(0, now - this.since);
    this.since = null;
    for (const { source, gain } of this.voices) {
      const level = gain.gain;
      if (typeof level.cancelAndHoldAtTime === "function") level.cancelAndHoldAtTime(now);
      else { const value = level.value; level.cancelScheduledValues(now); level.setValueAtTime(value, now); }
      level.linearRampToValueAtTime(0, now + .045);
      source.stop(now + .050);
    }
    this.voices.clear();
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
      if (this.context === ctx && (file === reel.file || (this.view && arrangement(this.view)?.file === file))) {
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
  private sound(ctx: AudioContext, buffer: AudioBuffer, cut: Cut, when: number, offset: number, duck: boolean) {
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
    if (duck) {
      filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = manifest.arrangement.interrupt.speechLowpassHz;
      source.connect(filter).connect(gain);
    } else source.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(duck ? manifest.arrangement.interrupt.speechGain : 1, when + .020);
    const voice = { source, gain };
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
  private play(cue?: Cue) {
    const ctx = this.context, view = this.view;
    if (!ctx || !view || !this.active || this.paused || !this.visible || ctx.state !== "running") return;
    const version = this.epoch;
    const bed = arrangement(view), pickup = cue && reelCut(cue);
    void Promise.all([
      bed && this.buffer(ctx, bed.file),
      pickup && this.buffer(ctx, pickup.file),
    ]).then(([bedBytes, cueBytes]) => {
      if (version !== this.epoch) return;
      let when = ctx.currentTime + .005;
      if (pickup && cueBytes) {
        const duration = this.sound(ctx, cueBytes, pickup, when, 0, view.speech);
        when += duration;
        if (cue && (cues[cue].kind === "bridge" || cues[cue].kind === "entry") && !isLine(view.surface)) {
          const firstBar = cue === "options-menu" ? 49 : cue === "conveyor-security" ? 17 : 1;
          this.elapsed = this.positions.has(view.surface) ? Math.ceil(this.elapsed / bar) * bar : firstBar * bar;
        }
      }
      this.since = when;
      if (!bed || !bedBytes) return;
      let offset = this.elapsed;
      if (isLine(view.surface) && bed.file === tracks.conveyor.file) {
        if (offset < openingLength) {
          const intro = { file: bed.file, range: opening, loop: false };
          when += this.sound(ctx, bedBytes, intro, when, offset, false);
        }
        offset = Math.max(0, offset - openingLength);
      }
      this.sound(ctx, bedBytes, bed, when, offset, view.speech && !(isLine(view.surface) && bed.file === reel.file));
    }).catch(() => { if (version === this.epoch) this.failed(); });
  }
}
