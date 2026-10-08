/** Headless, integer-only domain. No framework, clock, I/O or ambient randomness. */
import {
  SHIFT_TICKS,
  type Assignments,
  type Briefing,
  type Command,
  type Event,
  type Incident,
  type Phase,
  type Resolution,
  type RoomId,
  type SupervisorId,
} from "./contract";
import {
  addWorker,
  allocateWorkers,
  assignCrew,
  createWorkers,
  crew,
  crewStress,
  injureWorker,
  strainCrew,
  workBeat,
  workforceTotals,
  type WorkerWorld,
} from "./workers";
export type Mind = {
  confidence: number;
  loyalty: number;
  respect: number;
  stress: number;
  memories: string[];
};
export type State = {
  tick: number;
  shiftTick: number;
  workTicks: number;
  rng: number;
  phase: Phase;
  cash: number;
  workers: WorkerWorld;
  productionWork: number;
  condition: number;
  downtime: number;
  exposure: number;
  adviser: SupervisorId | null;
  assignments: Assignments | null;
  briefing: Briefing | null;
  pending: Incident | null;
  events: Event[];
  minds: Record<SupervisorId, Mind>;
  traces: {
    tick: number;
    actor: SupervisorId;
    belief: string;
    desire: string;
    intention: string;
    reason: string;
  }[];
};
export function initialState(seed: number, startingWorkers = 24): State {
  if (!Number.isInteger(seed) || seed < 1 || seed > 0xffffffff)
    throw new Error("invalid_seed");
  const mind = (): Mind => ({
    confidence: 50,
    loyalty: 60,
    respect: 50,
    stress: 10,
    memories: [],
  });
  return {
    tick: 0,
    shiftTick: 0,
    workTicks: 0,
    rng: seed,
    phase: "choose",
    cash: 240,
    workers: createWorkers(startingWorkers),
    productionWork: 0,
    condition: 82,
    downtime: 0,
    exposure: 0,
    adviser: null,
    assignments: null,
    briefing: null,
    pending: null,
    events: [],
    minds: { limen: mind(), stiletto: mind() },
    traces: [],
  };
}
export function name(id: SupervisorId) {
  return id === "limen" ? "LIMEN" : "Stiletto";
}
export function brief(id: SupervisorId, workers = 24): Briefing {
  return id === "limen"
    ? {
        assessment:
          "The line is operational. It must still be operational at the end of the week.",
        context:
          "Stiletto will favour a faster start. I expect we will disagree.",
        priority: "Keep the line within operating limits.",
        rationale:
          "Give me the Conveyor. Stiletto can cover Security. We need seven working days, not one impressive morning.",
        tradeoff:
          "Fewer robots today. Less equipment wear and lower accident exposure.",
        assignments: { conveyor: "limen", security: "stiletto" },
      }
    : {
        assessment: `${workers} workers. A working line. We can do more than stand here admiring it.`,
        context:
          "LIMEN will want headroom for everything that might go wrong. I want something coming off that belt.",
        priority: "Build an early production lead.",
        rationale:
          "Give me the Conveyor. Put LIMEN on Security; he can count the badges while I make us some options.",
        tradeoff:
          "More robots to retain or deliver. More wear and greater accident exposure.",
        assignments: { conveyor: "stiletto", security: "limen" },
      };
}
function event(
  s: State,
  kind: Event["kind"],
  title: string,
  detail: string,
  cause: string,
  room: RoomId | null = null,
  actor: Event["actor"] = "factory",
) {
  s.events.push({
    id: `event-${s.events.length + 1}`,
    tick: s.tick,
    shiftTick: s.shiftTick,
    kind,
    title,
    detail,
    cause,
    room,
    actor,
  });
}
function change(
  s: State,
  id: SupervisorId,
  key: "confidence" | "loyalty" | "respect" | "stress",
  delta: number,
) {
  s.minds[id][key] = Math.max(0, Math.min(100, s.minds[id][key] + delta));
}
function random(s: State) {
  s.rng = (Math.imul(s.rng, 1664525) + 1013904223) >>> 0;
  return s.rng;
}
function incident(s: State, room: RoomId): Incident {
  const cautious = s.adviser === "limen";
  return room === "conveyor"
    ? {
        id: "belt-vibration",
        room,
        title: "A shudder in the line",
        observation:
          "The load sensor is pulsing above its normal range. The line is still moving.",
        recommendation: cautious ? "slow" : "push",
        advice: cautious
          ? "Reduce the load. A missed batch is preferable to a broken worker."
          : "It’s carrying the load. Keep it moving; I want this batch finished.",
        choices: [
          {
            id: "slow",
            label: "Ease the line",
            consequence:
              "Lose three production beats. Reduce exposure; existing wear remains.",
          },
          {
            id: "push",
            label: "Keep the pressure on",
            consequence: "Preserve output. Add wear and risk a worker injury.",
          },
        ],
      }
    : {
        id: "clearance-mismatch",
        room,
        title: "A clearance mismatch",
        observation:
          "Security finds two workers whose access records do not match their current station. The crew is waiting for clearance.",
        recommendation: cautious ? "hold" : "wave",
        advice: cautious
          ? "Hold the transfer and verify the records. Exceptions become procedures when nobody stops them."
          : "We know where they work. Wave them through. We can survive an untidy record.",
        choices: [
          {
            id: "hold",
            label: "Verify the records",
            consequence:
              "Hold production for three beats. Keep the crew’s clearance in order.",
          },
          {
            id: "wave",
            label: "Wave the crew through",
            consequence:
              "Keep production moving. Leave an unresolved clearance exception.",
          },
        ],
      };
}
function resolve(
  s: State,
  problem: Incident,
  response: Resolution,
  automatic: boolean,
) {
  if (!problem.choices.some((c) => c.id === response))
    throw new Error("invalid_response");
  const adviser = s.adviser!,
    actor = automatic ? adviser : "director",
    override = response !== problem.recommendation;
  let outcome: string;
  const sourceEvent = `event-${s.events.length + 1}`;
  if (response === "slow") {
    s.downtime += 3;
    s.exposure = Math.max(0, s.exposure - 10);
    strainCrew(s.workers, -2, s.tick, sourceEvent);
    outcome =
      "Load reduced. Three production beats withheld. Existing equipment wear remains.";
  } else if (response === "push") {
    s.condition = Math.max(0, s.condition - 3);
    s.exposure += 12;
    strainCrew(s.workers, 5, s.tick, sourceEvent);
    const roll = random(s) % 100,
      threshold = Math.min(
        95,
        (s.assignments!.conveyor === "stiletto" ? 40 : 18) +
          s.exposure +
          Math.floor(crewStress(s.workers) / 10) +
          Math.floor((100 - s.condition) / 10),
      );
    const exposed = crew(s.workers, "conveyor");
    if (roll < threshold && exposed.length) {
      const target = exposed[random(s) % exposed.length];
      injureWorker(s.workers, target, s.tick, sourceEvent);
      s.condition = Math.max(0, s.condition - 5);
      s.downtime += 2;
      change(s, s.assignments!.conveyor, "stress", 12);
      change(s, s.assignments!.conveyor, "confidence", -8);
      outcome =
        "The batch cleared, but a worker was damaged beyond this shift’s capacity to return them to service. One worker lost; the line carries additional damage.";
    } else
      outcome =
        "The batch cleared without a worker injury. The extra load left additional equipment wear.";
    s.traces.push({
      tick: s.tick,
      actor: adviser,
      belief: "Load can be carried at current operating condition",
      desire: "Preserve output",
      intention: "Continue under strain",
      reason: `Seeded risk draw ${roll}; threshold ${threshold}; exposure ${s.exposure}.`,
    });
  } else if (response === "hold") {
    s.downtime += 3;
    outcome =
      "Records verified. The crew is cleared; three production beats lost to the check.";
  } else {
    s.exposure += 5;
    outcome =
      "Crew admitted. Production continues; the unresolved exception is entered in the shift record.";
  }
  if (override) {
    change(s, adviser, "loyalty", -4);
    change(s, adviser, "confidence", -3);
  } else change(s, adviser, "confidence", 3);
  for (const id of ["limen", "stiletto"] as const) {
    const aligned =
      id === "limen"
        ? response === "hold" || response === "slow"
        : response === "wave" || response === "push";
    change(s, id, "respect", aligned ? 3 : -2);
    s.minds[id].memories.push(
      `${problem.id}:${response}:${override ? "overridden" : "supported"}`,
    );
  }
  event(
    s,
    "resolution",
    `${automatic ? name(adviser) + " acted" : override ? "Recommendation overridden" : "Recommendation accepted"} · ${problem.choices.find((c) => c.id === response)!.label}`,
    outcome,
    `${automatic ? "Adviser has automatic authority in their assigned room." : "Director chose the response in another room."} ${problem.observation}`,
    problem.room,
    actor,
  );
  s.pending = null;
  s.phase = "running";
}
function raise(s: State, room: RoomId) {
  const problem = incident(s, room);
  event(
    s,
    "incident",
    problem.title,
    problem.observation,
    "Scheduled first-day observation fixture; response and consequences depend on the actual plan.",
    room,
  );
  s.traces.push({
    tick: s.tick,
    actor: s.adviser!,
    belief: problem.observation,
    desire: s.briefing!.priority,
    intention: problem.recommendation,
    reason: "Authored first-day BDI policy; adviser is sincere. No model call.",
  });
  if (s.assignments![room] === s.adviser)
    resolve(s, problem, problem.recommendation, true);
  else {
    s.pending = problem;
    s.phase = "decision";
  }
}
export function step(previous: State, command: Command): State {
  const s: State = JSON.parse(JSON.stringify(previous));
  s.tick++;
  switch (command.type) {
    case "choose_adviser": {
      if (s.phase !== "choose") throw new Error("adviser_already_chosen");
      s.adviser = command.adviser;
      s.briefing = brief(command.adviser, workforceTotals(s.workers).workers);
      s.phase = "briefing";
      s.traces.push({
        tick: s.tick,
        actor: command.adviser,
        belief: "Operational line; weekly quota; no initial assignments",
        desire: s.briefing.priority,
        intention: `Operate ${s.briefing.assignments.conveyor} on Conveyor`,
        reason: "Role-specific sincere opening policy.",
      });
      event(
        s,
        "adviser",
        `${name(command.adviser)} is today’s adviser`,
        s.briefing.priority,
        "Director chose one adviser for the day.",
        null,
        "director",
      );
      break;
    }
    case "approve_plan": {
      if (
        s.phase !== "briefing" ||
        !s.briefing ||
        command.assignments.conveyor === command.assignments.security
      )
        throw new Error("invalid_plan");
      s.assignments = { ...command.assignments };
      assignCrew(s.workers, s.tick, `event-${s.events.length + 1}`);
      s.phase = "ready";
      const overridden =
        s.assignments.conveyor !== s.briefing.assignments.conveyor;
      if (overridden) {
        change(s, s.adviser!, "confidence", -3);
        change(s, s.adviser!, "loyalty", -4);
      }
      s.minds[s.adviser!].memories.push(
        overridden ? "opening-plan-overridden" : "opening-plan-backed",
      );
      event(
        s,
        "plan",
        overridden
          ? "The director changed the arrangement"
          : "The adviser’s arrangement is approved",
        `${name(s.assignments.conveyor)} → Conveyor. ${name(s.assignments.security)} → Security.`,
        "Adviser choice did not assign anyone until the director approved this plan.",
        null,
        "director",
      );
      break;
    }
    case "start_shift":
      if (s.phase !== "ready") throw new Error("plan_required");
      s.phase = "running";
      event(
        s,
        "shift",
        "First shift started",
        "The cameras are live. The weekly delivery closes at the end of day seven.",
        "Director released the approved plan.",
        null,
        "director",
      );
      break;
    case "advance": {
      if (s.phase !== "running") throw new Error("shift_not_running");
      s.shiftTick++;
      const fast = s.assignments!.conveyor === "stiletto";
      const working = s.downtime === 0;
      if (!working) s.downtime--;
      else {
        s.workTicks++;
        s.productionWork += workBeat(s.workers, fast);
      }
      if (working && s.workTicks % 4 === 0) {
        const count = Math.floor(s.productionWork / 80);
        s.productionWork %= 80;
        for (let n = 0; n < count; n++)
          addWorker(
            s.workers,
            "manufactured",
            s.tick,
            `event-${s.events.length + 1}`,
          );
        if (count)
          event(
            s,
            "production",
            `${count} ${count === 1 ? "robot" : "robots"} completed`,
            `${workforceTotals(s.workers).produced} ready for end-of-shift allocation.`,
            `${name(s.assignments!.conveyor)} is operating the Conveyor.`,
            "conveyor",
            s.assignments!.conveyor,
          );
      }
      if (s.shiftTick % (fast ? 4 : 8) === 0)
        s.condition = Math.max(0, s.condition - 1);
      if (s.shiftTick === 12) raise(s, "conveyor");
      if (s.shiftTick === 30) raise(s, "security");
      if (s.shiftTick === SHIFT_TICKS) {
        s.phase = "allocation";
        event(
          s,
          "shift",
          "The first shift is complete",
          `${workforceTotals(s.workers).produced} robots await your commitment. ${workforceTotals(s.workers).losses} workers lost this shift.`,
          "Forty-eight production beats completed.",
        );
      }
      break;
    }
    case "resolve_incident":
      if (
        s.phase !== "decision" ||
        !s.pending ||
        command.incident !== s.pending.id
      )
        throw new Error("incident_not_pending");
      resolve(s, s.pending, command.response, false);
      break;
    case "commit_output": {
      if (
        s.phase !== "allocation" ||
        !Number.isInteger(command.retain) ||
        command.retain < 0 ||
        command.retain > workforceTotals(s.workers).produced
      )
        throw new Error("invalid_allocation");
      allocateWorkers(
        s.workers,
        command.retain,
        s.tick,
        `event-${s.events.length + 1}`,
      );
      const totals = workforceTotals(s.workers);
      s.phase = "complete";
      event(
        s,
        "allocation",
        "Output committed",
        `${totals.retained} joined the factory. ${totals.committed} committed to the weekly quota. This split is final.`,
        "Director confirmed an irreversible allocation.",
        null,
        "director",
      );
      break;
    }
    default: {
      const exhaustive: never = command;
      throw new Error(`unsupported_command:${exhaustive}`);
    }
  }
  return s;
}
export function replay(
  seed: number,
  commands: Command[],
  startingWorkers = 24,
) {
  return commands.reduce(step, initialState(seed, startingWorkers));
}
