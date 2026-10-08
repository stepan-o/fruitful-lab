/** Replaceable presentation sink. Never schedules or resolves simulation commands. */
export type SoundCue =
  | "connect"
  | "commit"
  | "batch"
  | "strain"
  | "impact"
  | "release"
  | "end";
export class FactoryAudio {
  private context: AudioContext;
  private master: GainNode;
  private motor: GainNode;
  private noise: AudioBuffer;
  private voices = 0;
  constructor() {
    this.context = new AudioContext();
    this.master = this.context.createGain();
    this.master.gain.value = 0.18;
    this.master.connect(this.context.destination);
    this.motor = this.context.createGain();
    this.motor.gain.value = 0;
    const filter = this.context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 155;
    this.motor.connect(filter);
    filter.connect(this.master);
    for (const f of [43, 87.4]) {
      const oscillator = this.context.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.value = f;
      oscillator.connect(this.motor);
      oscillator.start();
    }
    this.noise = this.context.createBuffer(
      1,
      this.context.sampleRate,
      this.context.sampleRate,
    );
    const channel = this.noise.getChannelData(0);
    let seed = 17;
    for (let i = 0; i < channel.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      channel[i] = (seed / 0xffffffff) * 2 - 1;
    }
  }
  async enable() {
    await this.context.resume();
  }
  machine(running: boolean, hidden: boolean, strain: boolean) {
    if (this.context.state === "closed") return;
    if (hidden) {
      void this.context.suspend();
      return;
    }
    if (this.context.state === "suspended")
      void this.context.resume().catch(() => {});
    this.motor.gain.setTargetAtTime(
      running ? (strain ? 0.095 : 0.065) : 0,
      this.context.currentTime,
      0.3,
    );
  }
  cue(cue: SoundCue) {
    if (this.context.state !== "running" || this.voices >= 8) return;
    const t = this.context.currentTime;
    const tone = (
      hz: number,
      end: number,
      duration: number,
      gain: number,
      delay = 0,
    ) => {
      this.voices++;
      const oscillator = this.context.createOscillator(),
        envelope = this.context.createGain();
      oscillator.type = cue === "strain" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(hz, t + delay);
      oscillator.frequency.exponentialRampToValueAtTime(
        end,
        t + delay + duration,
      );
      envelope.gain.setValueAtTime(0, t + delay);
      envelope.gain.linearRampToValueAtTime(gain, t + delay + 0.006);
      envelope.gain.exponentialRampToValueAtTime(0.0001, t + delay + duration);
      oscillator.connect(envelope);
      envelope.connect(this.master);
      oscillator.start(t + delay);
      oscillator.stop(t + delay + duration + 0.02);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
        this.voices--;
      };
    };
    const hiss = (duration: number, frequency: number, gain: number) => {
      const source = this.context.createBufferSource(),
        filter = this.context.createBiquadFilter(),
        envelope = this.context.createGain();
      source.buffer = this.noise;
      filter.type = "bandpass";
      filter.frequency.value = frequency;
      filter.Q.value = 1.8;
      envelope.gain.setValueAtTime(gain, t);
      envelope.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      source.connect(filter);
      filter.connect(envelope);
      envelope.connect(this.master);
      source.start(t);
      source.stop(t + duration);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        envelope.disconnect();
      };
    };
    switch (cue) {
      case "connect":
        hiss(0.12, 1800, 0.13);
        tone(580, 530, 0.08, 0.15);
        tone(420, 380, 0.1, 0.12, 0.12);
        break;
      case "commit":
        hiss(0.15, 850, 0.35);
        tone(115, 52, 0.32, 0.45);
        tone(710, 400, 0.09, 0.08, 0.04);
        break;
      case "batch":
        tone(290, 180, 0.08, 0.13);
        tone(112, 65, 0.17, 0.16, 0.05);
        break;
      case "strain":
        tone(340, 250, 0.4, 0.17);
        tone(352, 264, 0.42, 0.12);
        hiss(0.25, 2700, 0.08);
        break;
      case "impact":
        hiss(0.42, 560, 0.55);
        tone(100, 27, 0.55, 0.6);
        break;
      case "release":
        hiss(0.35, 620, 0.18);
        tone(48, 110, 0.65, 0.27);
        break;
      case "end":
        tone(240, 50, 0.8, 0.17);
        hiss(0.6, 1100, 0.08);
        break;
    }
  }
  close() {
    if (this.context.state !== "closed")
      void this.context.close().catch(() => {});
  }
}
