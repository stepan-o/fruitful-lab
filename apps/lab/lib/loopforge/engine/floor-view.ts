import type { Floor } from "../shifts/playthrough";
import type { State } from "./wire";

// Adapt names and units for the existing artist bindings. Every value that can
// change an outcome arrives from the verified public projection.
export type CampaignFloor = Floor & {
  ratings: Record<string, number[]>;
  needs: number[][];
};
export function campaignScene(state: State): Floor["scene"] {
  const w = state.world,
    f = w.floor;
  const phase = !f ? "briefing" : f.closed
    ? "close"
    : f?.stage === "briefing"
      ? "briefing"
      : "shift";
  const dialogue = state.events.map((e) => ({ ...e, day: 2 }));
  const stage = f?.stage === "briefing" ? "walk" : f?.stage ?? "walk";
  const world = {
    day: 2,
    stage,
    phase,
    start: f?.start ?? w.clock_tick,
    lead: f?.lead,
    pace: f?.manual ? "all-clear" : "rushed",
    spent: f?.status === "pass" ? "issue-pass" : null,
    quick: false,
    called: "",
    waiting: f?.waiting ?? [],
    status: f?.status,
    caseId: !f || f.status === "none" ? "" : "D2-bob-id",
    caseSubject: "bob",
    deadline: f?.deadline ?? 0,
    report: null,
    pressure: "quiet",
    backing: null,
    coverage: f?.coverage ?? [],
    ...(!f && { passageGateMm: w.gate_mm }),
    completed: w.rack,
    pass:
      f?.status === "pass"
        ? { holder: "bob", issuer: "LIMEN", day: 2, valid: !f?.closed }
        : null,
    shiftOutput: f?.dayCount,
    chat: "idle",
    bids: f?.bids,
  };
  const scene = {
    world,
    agents: state.agents.map((a) => ({ ...a, id: a.agent_id })),
    items: state.items.map((i) => ({
      id: i.item_id,
      stage: i.stage,
      at: [i.x, i.y] as [number, number],
      status:
        i.stage === 4
          ? "rack"
          : "travel" in i && i.travel
            ? "travel"
            : "process",
    })),
    events: dialogue,
  };
  return scene as Floor["scene"];
}

export function floorView(state: State): CampaignFloor {
  const w = state.world, f = w.floor!;
  const scene = campaignScene(state);
  return {
    ratings: f.ratings,
    needs: f.needs,
    tick: w.clock_tick,
    scene,
    tutorial: f.manual
      ? null
      : ({
          stage: f.lesson,
          posts: f.posts,
          crew: f.crew,
          held: f.held,
          hint:
            f.lesson === "pairs"
              ? "Give each operator two stations to cover."
              : f.lesson === "singles"
                ? "Assign a different operator to each station."
                : f.lesson === "live"
                  ? "More crew at the entrance. Assign them while the line runs."
                  : "",
          cue: 0,
          baseline: 0,
          due: 0,
        } as Floor["tutorial"]),
    machines: f.machines.map((m) => ({
      ...m,
      cycleSeconds: m.cycleMs === null ? null : m.cycleMs / 1000,
    })),
    workers: state.agents
      .filter((a) => !["STILETTO", "LIMEN"].includes(a.agent_id))
      .map((a) => ({ id: a.agent_id, label: a.label, available: a.available })),
    stroke: f.stroke / 1000,
    deskCut: false,
    dialogue: scene.events,
    bell: f.bell,
    manual: f.manual,
    opening: f.opening,
    handoff: f.opening ? 0 : 1,
    shot: f.shot,
    shotSeq: f.shotSeq,
    inspecting: f.machines.some(m => m.hold === "LIMEN inspecting"),
    closed: f.closed,
    dayCount: f.dayCount,
  };
}
