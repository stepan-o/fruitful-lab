import { soundUrl, type RecordedSound } from "@/lib/loopforge/sound-assets";

type ShiftSample = Exclude<RecordedSound, "menu-clang">;
const samples: ShiftSample[] = ["contactor", "ratchet-engage", "ratchet-release"];

/** Optional presentation assets. No queued playback and no simulation dependency. */
export class RecordedAudio {
  private buffers = new Map<ShiftSample, AudioBuffer>();
  private active = new Set<() => void>();
  private last = new Map<ShiftSample, number>();
  private request = new AbortController();
  private started = false;

  constructor(private context: AudioContext, private output: AudioNode) {}

  load() {
    if (this.started) return;
    this.started = true;
    // Only 24 KB for the shift. The review ambience and menu clang are not fetched.
    void Promise.allSettled(samples.map(async id => {
      const response = await fetch(soundUrl(id), { signal: this.request.signal });
      if (!response.ok) throw new Error("Sound unavailable");
      const buffer = await this.context.decodeAudioData(await response.arrayBuffer());
      if (!this.request.signal.aborted) this.buffers.set(id, buffer);
    }));
  }

  play(id: ShiftSample, volume: number): boolean {
    const buffer = this.buffers.get(id);
    if (!buffer) return false; // Procedural cue stays available on slow/offline loads.
    if (this.request.signal.aborted || this.context.state !== "running") return true;
    const now = this.context.currentTime;
    if (this.active.size >= 4 || now - (this.last.get(id) ?? -Infinity) < 0.08) return true;
    this.last.set(id, now);
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.output);
    const release = () => {
      if (!this.active.delete(stop)) return;
      source.disconnect();
      gain.disconnect();
    };
    const stop = () => {
      source.stop();
      release();
    };
    this.active.add(stop);
    source.onended = release;
    source.start(now);
    return true;
  }

  stop() {
    for (const stop of this.active) stop();
    this.last.clear();
  }

  close() {
    this.request.abort();
    this.stop();
    this.buffers.clear();
  }
}
