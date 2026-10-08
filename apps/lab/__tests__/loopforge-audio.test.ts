import { playLandingSound } from "@/lib/loopforge/landing-audio";
import { soundUrl } from "@/lib/loopforge/sound-assets";
import { soundKey, writePreference } from "@/lib/stepanoskin/preferences";
import { RecordedAudio } from "@/components/loopforge/first-shift/recorded-audio";

describe("Loopforge user-activated landing audio", () => {
  const clips: (EventTarget & { play: jest.Mock; pause: jest.Mock; currentTime: number })[] = [];
  let constructor: jest.SpyInstance;
  beforeEach(() => {
    clips.length = 0;
    writePreference(soundKey, true);
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    constructor = jest.spyOn(window, "Audio").mockImplementation(() => {
      const clip = Object.assign(new EventTarget(), { play: jest.fn().mockResolvedValue(undefined), pause: jest.fn(), currentTime: 0 });
      clips.push(clip);
      return clip as unknown as HTMLAudioElement;
    });
  });
  afterEach(() => {
    writePreference(soundKey, false);
    constructor.mockRestore();
    window.localStorage.clear();
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
  });
  it("uses different cropped sounds for menu and RESET, starting at zero, with one voice", () => {
    playLandingSound("menu-clang");
    playLandingSound("contactor");
    expect(constructor).toHaveBeenNthCalledWith(1, soundUrl("menu-clang"));
    expect(constructor).toHaveBeenNthCalledWith(2, soundUrl("contactor"));
    expect(soundUrl("menu-clang")).not.toBe(soundUrl("contactor"));
    expect(clips[0].pause).toHaveBeenCalledTimes(1);
    expect(clips.map(x => x.currentTime)).toEqual([0, 0]);
  });
  it("does not fetch while muted and stops an in-flight tail when muted", () => {
    writePreference(soundKey, false);
    playLandingSound("menu-clang");
    expect(constructor).not.toHaveBeenCalled();
    writePreference(soundKey, true);
    playLandingSound("menu-clang");
    writePreference(soundKey, false);
    expect(clips[0].pause).toHaveBeenCalledTimes(1);
  });
  it("stops on a hidden page without replaying when visible again", () => {
    playLandingSound("contactor");
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
    playLandingSound("menu-clang");
    expect(clips[0].pause).toHaveBeenCalledTimes(1);
    expect(constructor).toHaveBeenCalledTimes(1);
  });
  it("absorbs browser playback rejection", async () => {
    constructor.mockImplementationOnce(() => Object.assign(new EventTarget(), { play: () => Promise.reject(new Error("blocked")), pause: jest.fn() }) as unknown as HTMLAudioElement);
    playLandingSound("menu-clang");
    await Promise.resolve();
  });
});

describe("Optional recorded first-shift cues", () => {
  const originalFetch = global.fetch;
  function fixture() {
    const sources: { start: jest.Mock; stop: jest.Mock }[] = [];
    const context = {
      state: "running", currentTime: 1,
      decodeAudioData: jest.fn().mockResolvedValue({ duration: 0.3 }),
      createGain: () => ({ gain: { value: 0 }, connect: jest.fn(), disconnect: jest.fn() }),
      createBufferSource: () => {
        const source = { connect: jest.fn(), disconnect: jest.fn(), start: jest.fn(), stop: jest.fn() };
        sources.push(source);
        return source;
      },
    };
    return { context, sources, audio: new RecordedAudio(context as unknown as AudioContext, {} as AudioNode) };
  }
  const settle = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)) });
  });
  afterEach(() => { global.fetch = originalFetch; });
  it("loads only shift cues once; leaves review ambience out; never plays on load", async () => {
    const { audio, sources } = fixture();
    expect(audio.play("contactor", 1)).toBe(false);
    audio.load(); audio.load();
    await settle();
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(sources).toHaveLength(0);
    expect(audio.play("contactor", 1)).toBe(true);
    expect(sources[0].start).toHaveBeenCalledTimes(1);
    audio.close();
  });
  it("retains immediate procedural fallback when requests fail", async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error("offline"));
    const { audio } = fixture();
    audio.load(); await settle();
    expect(audio.play("ratchet-engage", 1)).toBe(false);
    audio.close();
  });
  it("coalesces repeated events, caps voices and stops them before suspension", async () => {
    const { audio, context, sources } = fixture();
    audio.load(); await settle();
    audio.play("ratchet-engage", 1); audio.play("ratchet-engage", 1);
    expect(sources).toHaveLength(1);
    for (let i = 0; i < 8; i++) { context.currentTime++; audio.play("contactor", 1); }
    expect(sources).toHaveLength(4);
    audio.stop();
    expect(sources.every(s => s.stop.mock.calls.length === 1)).toBe(true);
    context.state = "suspended";
    audio.play("contactor", 1);
    expect(sources).toHaveLength(4);
    audio.close();
  });
  it("does not admit late decode completion after mute or unmount", async () => {
    const { audio, context, sources } = fixture();
    let finish!: (value: object) => void;
    const pending = new Promise(resolve => { finish = resolve; });
    context.decodeAudioData.mockReturnValue(pending);
    audio.load(); await settle(); audio.close();
    finish({ duration: 0.3 }); await settle();
    expect(audio.play("contactor", 1)).toBe(false);
    expect(sources).toHaveLength(0);
  });
});
