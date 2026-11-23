import { command, initialStudy, step, TICK_MS, type Command, type StudyState } from "./kernel";

/** Replaceable local host for the public visual fixture, not the private first-shift run. */
export class StudyHost {
  private value: StudyState;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<(s: StudyState) => void>();
  constructor(count: 10 | 100 = 10) { this.value = initialStudy(count); }
  get snapshot() { return this.value; }
  subscribe(fn: (s: StudyState) => void) { this.listeners.add(fn); fn(this.value); return () => { this.listeners.delete(fn); }; }
  private publish(s: StudyState) { this.value = s; for (const fn of this.listeners) fn(s); }
  send(c: Command) { const r = command(this.value, c); if (r.ok) this.publish(r.state); return r; }
  reset(count: 10 | 100) { this.publish(initialStudy(count)); }
  resumeClock() { if (this.timer) return; this.timer = setInterval(() => { const next = step(this.value); if (next !== this.value) this.publish(next); }, TICK_MS); }
  suspendClock() { if (this.timer) clearInterval(this.timer); this.timer = null; }
  dispose() { this.suspendClock(); this.listeners.clear(); }
}
