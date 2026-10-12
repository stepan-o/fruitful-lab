import { ROUTE_LENGTH } from "@/lib/loopforge/spatial/floor";
import { command, FIXTURES, initialStudy, SHIFT_TICKS, step, type Command, type StudyState } from "@/lib/loopforge/factory-study/kernel";
import { StudyHost } from "@/lib/loopforge/factory-study/host";

function apply(s: StudyState, c: Command) { const r = command(s, c); if (!r.ok) throw new Error(r.reason); return r.state; }
function ready(count: 10 | 100 = 10) { return initialStudy(count); }
function start(count: 10 | 100 = 10) { return apply(ready(count), { type: "shift" }); }

describe("prebuilt floor fixture", () => {
  it("starts with complete equipment and never changes it when entering the shift", () => {
    const s=initialStudy(),before=JSON.stringify(s);
    expect(s.phase).toBe('morning');expect(s.installed).toEqual(FIXTURES);
    expect(command(s,{type:'morning'}).ok).toBe(false);
    expect(start().installed).toEqual(FIXTURES);expect(JSON.stringify(s)).toBe(before);
  });
  it("keeps a night or morning stationary; pause stops ticks and jam stops physical output", () => {
    expect(step(ready())).toEqual(ready());
    const morning = ready(); expect(step(morning)).toBe(morning);
    let s = start(); for (let i = 0; i < 30; i++) s = step(s);
    expect(s.travel).toBeGreaterThan(0);
    const paused = apply(s, { type: "running", value: false }); expect(step(paused)).toBe(paused);
    const jam = apply(s, { type: "obstruct" }); let stuck = jam;
    for (let i = 0; i < 50; i++) stuck = step(stuck);
    expect(stuck.travel).toBe(jam.travel); expect(stuck.cycles).toBe(jam.cycles);
    expect(stuck.workers.map(w => w.progress)).toEqual(jam.workers.map(w => w.progress));
    expect(step(apply(stuck, { type: "release" })).travel).toBeGreaterThan(stuck.travel);
  });
  it("ends the compressed eighteen-hour shift at the same tick and preserves installations", () => {
    let s = start(); for (let i = 0; i < SHIFT_TICKS; i++) s = step(s);
    expect(s.phase).toBe("night"); expect(s.day).toBe(2); expect(s.running).toBe(false);
    expect(s.installed).toEqual(FIXTURES); expect(s.shiftTick).toBe(SHIFT_TICKS);
    expect(step(s)).toBe(s);
    s = apply(apply(s, { type: "morning" }), { type: "shift" });
    expect(s.shiftTick).toBe(0); expect(s.day).toBe(2);
  });
  it("replays identical commands and ticks for 100 distinct workers without mutating inputs", () => {
    const replay = () => { let s = start(100); for (let i = 0; i < 500; i++) { if (i === 50) s = apply(s, { type: "pace", value: "push" }); if (i === 110) s = apply(s, { type: "obstruct" }); if (i === 180) s = apply(s, { type: "release" }); const before = JSON.stringify(s); const next = step(s); expect(JSON.stringify(s)).toBe(before); s = next; } return s; };
    const a = replay(); expect(a).toEqual(replay()); expect(new Set(a.workers.map(w => w.id)).size).toBe(100);
    expect(a.workers.every(w => Number.isInteger(w.progress) && w.progress >= 0 && w.progress < ROUTE_LENGTH)).toBe(true);
    expect(a.events.length).toBeLessThanOrEqual(48);
  });
  it("has a disposable clock with no catch-up after suspension", () => {
    jest.useFakeTimers(); const h = new StudyHost();
    h.send({ type: "shift" });
    h.resumeClock(); h.resumeClock(); jest.advanceTimersByTime(500); expect(h.snapshot.tick).toBe(10);
    h.suspendClock(); jest.advanceTimersByTime(5000); expect(h.snapshot.tick).toBe(10);
    h.resumeClock(); jest.advanceTimersByTime(100); expect(h.snapshot.tick).toBe(12);
    h.dispose(); jest.advanceTimersByTime(5000); expect(h.snapshot.tick).toBe(12); jest.useRealTimers();
  });
});
