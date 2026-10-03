import {
  defaultAssignments,
  initialState,
  isCommand,
  nextRandom,
  replay,
  transition,
  ENGINE_VERSION,
  type Doctrine,
} from "@/lib/loopforge/engine";
import { deliberate, intentionIsCurrent } from "@/lib/loopforge/bdi";
import { resolveRun } from "@/lib/loopforge/protocol";
const command = (doctrine: Doctrine = "balanced") => ({
  type: "resolve",
  assignments: [...defaultAssignments],
  doctrine,
});
const plan: Doctrine[] = [
  "pressure",
  "pressure",
  "care",
  "pressure",
  "care",
  "pressure",
  "care",
  "pressure",
];
test("versioned golden run is portable and exactly reproducible", () => {
  const state = replay(7, plan.map(command));
  expect(state).toMatchObject({
    version: ENGINE_VERSION,
    rng: 1865636743,
    total: 241,
    strain: 42,
    phase: "complete",
    shift: 8,
  });
  expect(state.events.map((e) => e.delta)).toEqual([
    38, 41, 18, 35, 22, 36, 16, 35,
  ]);
  expect(replay(7, plan.map(command))).toEqual(state);
  expect(replay(8, plan.map(command))).not.toEqual(state);
});
test("rejected commands do not consume randomness or mutate state", () => {
  const state = Object.freeze(initialState(7));
  const before = JSON.stringify(state);
  for (const invalid of [
    null,
    {},
    command("wrong" as Doctrine),
    { ...command(), assignments: Array(5).fill("limen") },
    { ...command(), extra: true },
    { ...command(), assignments: ["limen"] },
  ]) {
    expect(isCommand(invalid)).toBe(false);
    expect(transition(state, invalid)).toEqual({
      ok: false,
      error: "invalid_command",
    });
    expect(JSON.stringify(state)).toBe(before);
  }
  const result = transition(state, command());
  expect(result.ok).toBe(true);
  expect(JSON.stringify(state)).toBe(before);
});
test("run ends at eight shifts; bounds hold across seeds and doctrines", () => {
  for (let seed = 1; seed <= 100; seed++)
    for (const doctrine of ["pressure", "care", "balanced"] as const) {
      const s = replay(
        seed,
        Array.from({ length: 8 }, () => command(doctrine)),
      );
      expect(transition(s, command())).toEqual({
        ok: false,
        error: "run_complete",
      });
      expect(s.strain).toBeGreaterThanOrEqual(0);
      expect(s.strain).toBeLessThanOrEqual(100);
      for (const e of s.events) {
        expect(e.rooms.reduce((n, r) => n + r.output, 0)).toBe(e.delta);
        for (const r of e.rooms) {
          expect(Number.isInteger(r.output)).toBe(true);
          expect(r.output).toBeGreaterThanOrEqual(0);
        }
      }
    }
});
test("PRNG is explicit u32 and invalid seed/history is rejected", () => {
  expect(nextRandom(7)).toBe(1892583);
  for (const seed of [0, -1, 1.5, 2 ** 32, NaN])
    expect(() => initialState(seed)).toThrow();
  expect(() =>
    replay(
      7,
      Array.from({ length: 9 }, () => command()),
    ),
  ).toThrow();
});
test("server rebuilds facts and ignores client-supplied state", () => {
  const a = resolveRun({
    version: ENGINE_VERSION,
    seed: 7,
    commands: [command()],
    state: { total: 999999 },
  });
  expect(a.state.total).toBe(28);
  expect(
    resolveRun({ version: ENGINE_VERSION, seed: 8, commands: [] }).state.total,
  ).toBe(0);
  expect(() => resolveRun({ version: "old", seed: 7, commands: [] })).toThrow();
});
test("BDI traits change priorities and stale advice expires", () => {
  const s = initialState(7);
  expect(deliberate(s, "stiletto").doctrine).toBe("pressure");
  expect(deliberate(s, "witch").doctrine).toBe("balanced");
  const pressured = { ...s, strain: 40 };
  expect(deliberate(pressured, "witch").doctrine).toBe("care");
  const intent = deliberate(s, "witch");
  expect(intentionIsCurrent(s, intent)).toBe(true);
  expect(intentionIsCurrent({ ...s, shift: 1 }, intent)).toBe(false);
});
