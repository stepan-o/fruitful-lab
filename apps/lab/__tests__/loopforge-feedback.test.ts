/** @jest-environment node */
import { feedbackFor } from "@/lib/loopforge/first-shift/feedback";
import { initialState, step, type State } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";
import type { SupervisorId } from "@/lib/loopforge/first-shift/contract";
function begin(adviser: SupervisorId, swap = false, seed = 7) {
  let s = step(initialState(seed), { type: "choose_adviser", adviser });
  const plan = s.briefing!.assignments;
  s = step(s, { type: "approve_plan", assignments: swap ? { conveyor: plan.security, security: plan.conveyor } : plan });
  return step(s, { type: "start_shift" });
}
function finish(s: State) {
  while (s.phase === "running" || s.phase === "decision") s = s.pending ? step(s, { type: "resolve_incident", incident: s.pending.id, response: s.pending.recommendation }) : step(s, { type: "advance" });
  return s;
}
test("tokens reflect safe/fast actual outcomes and distinguish claims from evidence", () => {
  const opening = project(initialState(7));
  for (const adviser of ["limen", "stiletto"] as const) {
    const view = project(finish(begin(adviser)));
    const room = feedbackFor(view, "room:conveyor", opening);
    expect(room.value).toBe(adviser === "limen" ? "10 completed" : "Wear warning");
    expect(room.knowledge).toBe(adviser === "limen" ? "Confirmed" : "Observed");
    expect(room.events.every(e => view.events.some(actual => actual.id === e.id))).toBe(true);
    expect(feedbackFor(view, `person:${adviser}`).knowledge).toBe("Statement");
    expect(feedbackFor(view, "condition", opening).detail).toContain(`82% at handover → ${view.condition}%`);
  }
});
test("pending decisions route to response; delegated events remain inspectable without inventing another choice", () => {
  let s = begin("limen", true);
  while (s.phase === "running") s = step(s, { type: "advance" });
  const pending = feedbackFor(project(s), "room:conveyor");
  expect(pending.action?.id).toBe("incident");
  expect(pending.value).toBe("Response required");
  const complete = project(finish(begin("limen")));
  const room = feedbackFor(complete, "room:conveyor");
  expect(room.events.some(e => e.kind === "resolution" && e.actor === "limen")).toBe(true);
  expect(room.action?.id).toBe("room:conveyor");
});
test("allocation tokens conserve the actual split and never count unallocated units toward quota", () => {
  const ready = finish(begin("stiletto"));
  expect(feedbackFor(project(ready), "quota").value).toBe("0 / 60");
  expect(feedbackFor(project(ready), "workers").detail).toContain("24 in the factory");
  const view = project(step(ready, { type: "commit_output", retain: 5 }));
  expect(feedbackFor(view, "quota").value).toBe("19 / 60");
  expect(feedbackFor(view, "workers").value).toBe("29");
  expect(feedbackFor(view, "output").detail).toContain("5 retained + 19 dispatched = 24 produced");
});
test("presentation never reads undisclosed minds, worker histories or simulation randomness", () => {
  const state = finish(begin("stiletto", true));
  const signals = () => (["room:conveyor", "room:security", "person:limen", "person:stiletto", "workers", "condition", "quota", "output"] as const).map(id => feedbackFor(project(state), id));
  const before = signals();
  state.minds.limen.loyalty = 0;
  state.minds.stiletto.confidence = 99;
  state.rng = 99;
  expect(signals()).toEqual(before);
  expect(JSON.stringify(before)).not.toMatch(/unconditioned|loyalty|confidence|Seeded risk draw/);
});
test("actual losses are distinct from a load warning; private stress remains hidden", () => {
  const run = Array.from({length:12}, (_, i) => project(finish(begin("stiletto", false, i + 1)))).find(v => v.losses)!;
  const signal = feedbackFor(run, "workers");
  expect(signal.tone).toBe("loss");
  expect(feedbackFor(run, "room:conveyor").value).toBe("1 worker lost");
  expect(feedbackFor(run, "room:conveyor").knowledge).toBe("Confirmed");
  expect(signal.detail).toContain("1 lost");
  expect(signal.events.some(e => e.kind === "resolution")).toBe(true);
});
