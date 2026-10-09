/** Public commissioning fixture. No framework, wall clock, rendering or private game state. */
export const STUDY_VERSION = "loopforge-commissioning/1";
export const TICK_MS = 50;
export const SHIFT_TICKS = 1200; // One-minute visual study; represents an eighteen-hour shift.
export type Phase = "night" | "morning" | "shift";
export type Fixture = "terminal" | "gate" | "drive";
export type StudyEvent = { id: number; tick: number; kind: "installed" | "start" | "stop" | "cycle" | "jam" | "release" | "pace" | "phase"; text: string };
export type Worker = { id: number; progress: number; waiting: boolean };
export type StudyState = {
  version: typeof STUDY_VERSION; tick: number; day: number; phase: Phase; shiftTick: number; installed: Fixture[]; running: boolean;
  jammed: boolean; pace: "steady" | "push"; travel: number; cycles: number;
  workers: Worker[]; events: StudyEvent[]; nextEvent: number;
};
export type Command = { type: "install"; fixture: Fixture } | { type: "running"; value: boolean } |
  { type: "pace"; value: "steady" | "push" } | { type: "obstruct" } | { type: "release" } | { type: "morning" } | { type: "shift" };
export type Result = { ok: true; state: StudyState } | { ok: false; reason: string };
export const FIXTURES: readonly Fixture[] = ["terminal", "gate", "drive"];
export function initialStudy(count: 10 | 100 = 10): StudyState {
  return { version: STUDY_VERSION, tick: 0, day: 1, phase: "night", shiftTick: 0, installed: [], running: false, jammed: false,
    pace: "steady", travel: 0, cycles: 0, nextEvent: 1, events: [],
    workers: Array.from({ length: count }, (_, id) => ({ id, progress: Math.floor(id * 16000 / count), waiting: false })) };
}
function event(s: StudyState, kind: StudyEvent["kind"], text: string): StudyState {
  return { ...s, nextEvent: s.nextEvent + 1, events: [...s.events.slice(-47), { id: s.nextEvent, tick: s.tick, kind, text }] };
}
export function command(s: StudyState, c: Command): Result {
  switch (c.type) {
    case "install":
      if (s.phase !== "night") return { ok: false, reason: "Construction happens at night, with production stopped." };
      if (FIXTURES[s.installed.length] !== c.fixture) return { ok: false, reason: "Commission the marked equipment in order." };
      return { ok: true, state: event({ ...s, installed: [...s.installed, c.fixture] }, "installed", `${c.fixture === "terminal" ? "Clearance terminal" : c.fixture === "gate" ? "Access gate" : "Conveyor drive"} commissioned.`) };
    case "running":
      if (s.phase !== "shift") return { ok: false, reason: "Start the shift first." };
      if (s.running === c.value) return { ok: true, state: s };
      return { ok: true, state: event({ ...s, running: c.value }, c.value ? "start" : "stop", c.value ? "Commissioning cycle started. Test specimens only." : "Commissioning cycle paused.") };
    case "pace":
      if (c.value === s.pace) return { ok: true, state: s };
      return { ok: true, state: event({ ...s, pace: c.value }, "pace", c.value === "push" ? "Drive pushed. The mechanism is working harder." : "Drive returned to its steady range.") };
    case "obstruct":
      if (!s.running || s.jammed) return { ok: false, reason: "The line must be moving to run an obstruction test." };
      return { ok: true, state: event({ ...s, jammed: true }, "jam", "Test obstruction. Drive stopped; Security holds access.") };
    case "release":
      if (!s.jammed) return { ok: false, reason: "The line is clear." };
      return { ok: true, state: event({ ...s, jammed: false }, "release", "Obstruction released. The drive can move again.") };
    case "morning":
      if (s.phase !== "night" || s.installed.length !== 3) return { ok: false, reason: "Complete the three installations before morning." };
      return { ok: true, state: event({ ...s, phase: "morning" }, "phase", "Morning. Commissioning crew ready.") };
    case "shift":
      if (s.phase !== "morning") return { ok: false, reason: "The morning handover comes first." };
      return { ok: true, state: event({ ...s, phase: "shift", running: true, shiftTick: 0 }, "phase", "Shift start. Eighteen factory hours; one minute in this study.") };
  }
}
export function gateOpen(s: StudyState): boolean { return s.running && !s.jammed && s.tick % 100 < 57; }
export function step(s: StudyState): StudyState {
  if (!s.running || s.phase !== "shift") return s;
  const tick = s.tick + 1;
  const advance = s.jammed ? 0 : (s.pace === "push" ? 66 : 39) + [0, 3, 7, 2, 0, -3, -7, -2][tick % 8];
  const travel = s.travel + advance;
  let next: StudyState = { ...s, tick, shiftTick: s.shiftTick + 1, travel, workers: s.workers.map(w => {
    const waiting = s.jammed || (w.progress >= 2500 && w.progress < 3200 && !gateOpen(s));
    return { ...w, waiting, progress: waiting ? w.progress : (w.progress + (s.pace === "push" ? 29 : 22)) % 16000 };
  }) };
  const cycles = Math.floor(travel / 1600);
  if (cycles > s.cycles) next = event({ ...next, cycles }, "cycle", `Test cradle ${cycles} passed the outtake. No quota output created.`);
  if (next.shiftTick >= SHIFT_TICKS) next = event({ ...next, day: s.day + 1, phase: "night", running: false, jammed: false }, "phase", "Night. Six-hour charging window; production stopped.");
  return next;
}
