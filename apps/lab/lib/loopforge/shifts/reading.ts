import {approachZone, type Mark, type Room} from './contract';
import type {Frame} from './wire';

export type Bubble = {
  seq: number; tick: number; speaker: string; text: string; at: Mark['at'];
  asset: string; nameplate: string;
};
type Beat = {lines: Bubble[]; remaining: number};

export function readingTime(text: string) {
  // Include time to locate the speaker before reading at about 150 words/minute.
  return Math.max(3200, 1000 + 400 * text.trim().split(/\s+/).length);
}

export class DialogueReading {
  private beats: Beat[] = [];
  private cursor = 0;

  get lines(): Bubble[] { return this.beats[0]?.lines ?? []; }
  get remaining() { return this.beats[0]?.remaining ?? 0; }
  get waiting() { return this.beats.length > 1; }

  save() { return structuredClone({beats: this.beats, cursor: this.cursor}); }
  restore(state: ReturnType<DialogueReading['save']>) {
    const copy = structuredClone(state);
    this.beats = copy.beats;
    this.cursor = copy.cursor;
  }
  spend(ms: number) {
    const beat = this.beats[0];
    if (beat && (beat.remaining -= ms) <= 0) this.beats.shift();
    // A newly visible beat always receives its full time, including after a late browser timer.
  }
  receive(frame: Frame, room: Room, restart = false) {
    const {events, world} = frame.scene;
    const visible = (e:Mark) => e.room===room || (room==='security' && world.stage==='walk' && approachZone(e.room));
    const speaks = (e: Mark) => e.kind === 'speech.delivered' || e.kind === 'endorsement.public';
    if (restart) {
      this.beats = [];
      this.cursor = events.at(-1)?.seq ?? 0;
      const latest = events.findLast(e => visible(e) && speaks(e));
      if (!latest || (frame.tick - latest.tick) * 50 >= readingTime(latest.text)) return;
      // On arrival in a room or checkpoint, start with the current utterance only.
      this.cursor = events.find(e => e.tick === latest.tick)!.seq - 1;
    }
    for (const event of events) {
      if (event.seq <= this.cursor) continue;
      this.cursor = event.seq;
      if (event.day !== world.day || !visible(event)) continue;
      if (event.kind === 'chat.interrupted') {
        for (const beat of this.beats.slice().reverse()) {
          const cut = beat.lines.findLast(line => line.speaker === event.subject);
          if (cut) { cut.asset = 'fl-bubble-interrupted'; break; }
        }
      }
      if (!speaks(event)) continue;
      const line: Bubble = {
        seq: event.seq, tick: event.tick, speaker: event.actor, text: event.text, at: event.at,
        asset: 'fl-bubble', nameplate: 'fl-bubble-nameplate',
      };
      const last = this.beats.at(-1);
      // The greeting chorus is delivered by distinct workers on one posting tick.
      if (world.stage === 'posting' && last?.lines[0].tick === line.tick &&
          last.lines.every(other => other.speaker !== line.speaker)) {
        last.lines.push(line);
        last.remaining = Math.max(last.remaining, readingTime(line.text));
      } else {
        this.beats.push({lines: [line], remaining: readingTime(line.text)});
      }
    }
  }
}
