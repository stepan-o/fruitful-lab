import type { Frame } from "./wire";
import type { Room } from "../shifts/contract";
import { visibleFloorSpeech } from "./music-score";

const words = "It is my privilege to welcome you to Loopforge.";

/** The existing spoken take belongs to one Security line. Consume its onset even
 * when muted or off camera, so refocus cannot turn old dialogue into a new cue. */
export class WelcomeVoice {
  private lastTick: number | null = null;
  private lastRoom: Room | null = null;
  private receipt = "";
  private audio: HTMLAudioElement;
  constructor(audio: HTMLAudioElement) { this.audio = audio; }

  reset(newRun = false) {
    this.audio.pause();
    this.lastTick = null;
    this.lastRoom = null;
    if (newRun) this.receipt = "";
  }
  update(frame: Frame, room: Room, audible: boolean) {
    const { world } = frame.state;
    const before = this.lastTick, beforeRoom = this.lastRoom;
    this.lastTick = world.clock_tick;
    this.lastRoom = room;
    if (!audible || room !== "security" || !world.floor || world.floor.closed) {
      this.audio.pause();
      return;
    }
    if (before === null || beforeRoom !== "security" || world.clock_tick <= before) return;
    const line = visibleFloorSpeech(frame.state, room).find(e =>
      e.tick > before && e.speaker === "LIMEN" && e.text === words);
    if (!line || this.receipt === line.event_id) return;
    this.receipt = line.event_id;
    this.audio.currentTime = 0;
    void this.audio.play().catch(() => {});
  }
}
