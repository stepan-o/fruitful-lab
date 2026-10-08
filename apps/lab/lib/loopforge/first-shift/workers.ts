/** Worker entities and deterministic component systems. Only the kernel mutates these. */
import type { RoomId } from "./contract";

export type WorkerId = `worker-${number}`;
export type WorkerStatus =
  | "active"
  | "awaiting_allocation"
  | "dispatched"
  | "destroyed";
export type WorkerMemory = {
  tick: number;
  eventId: string;
  kind:
    | "created"
    | "assigned"
    | "strain"
    | "witnessed_loss"
    | "injured"
    | "retained"
    | "dispatched";
};
export type WorkerWorld = {
  nextId: number;
  order: WorkerId[];
  identity: Record<
    WorkerId,
    {
      generation: "basic";
      origin: "inherited" | "manufactured";
      createdTick: number;
    }
  >;
  body: Record<
    WorkerId,
    { condition: number; workBeats: number; status: WorkerStatus }
  >;
  assignment: Record<WorkerId, { room: RoomId | null }>;
  psychology: Record<WorkerId, { stress: number }>;
  conditioning: Record<
    WorkerId,
    { state: "unknown" | "unconditioned" | "indoctrinated" }
  >;
  history: Record<WorkerId, WorkerMemory[]>;
};
const bounded = (value: number) => Math.max(0, Math.min(100, value));

export function addWorker(
  world: WorkerWorld,
  origin: "inherited" | "manufactured",
  tick: number,
  eventId: string,
): WorkerId {
  const id: WorkerId = `worker-${world.nextId++}`;
  world.order.push(id);
  world.identity[id] = { generation: "basic", origin, createdTick: tick };
  world.body[id] = {
    condition: 100,
    workBeats: 0,
    status: origin === "inherited" ? "active" : "awaiting_allocation",
  };
  world.assignment[id] = { room: null };
  world.psychology[id] = { stress: origin === "inherited" ? 10 : 0 };
  world.conditioning[id] = {
    state: origin === "inherited" ? "unknown" : "unconditioned",
  };
  world.history[id] = [{ tick, eventId, kind: "created" }];
  return id;
}

export function createWorkers(count: number): WorkerWorld {
  if (!Number.isInteger(count) || count < 2 || count > 1000)
    throw new Error("invalid_workforce");
  const world: WorkerWorld = {
    nextId: 1,
    order: [],
    identity: {},
    body: {},
    assignment: {},
    psychology: {},
    conditioning: {},
    history: {},
  };
  for (let i = 0; i < count; i++) addWorker(world, "inherited", 0, "handover");
  return world;
}

export function crew(world: WorkerWorld, room?: RoomId): WorkerId[] {
  return world.order.filter(
    (id) =>
      world.body[id].status === "active" &&
      world.body[id].condition > 0 &&
      (room === undefined || world.assignment[id].room === room),
  );
}

/** A first-day automatic crew rule, not a station-staffing player action. */
export function assignCrew(world: WorkerWorld, tick: number, eventId: string) {
  const active = crew(world),
    securityCount = Math.max(1, Math.floor(active.length / 6));
  active.forEach((id, i) => {
    world.assignment[id].room = i < securityCount ? "security" : "conveyor";
    world.history[id].push({ tick, eventId, kind: "assigned" });
  });
}

/** Return integer production work; condition and stress are individual, hidden records. */
export function workBeat(world: WorkerWorld, fast: boolean): number {
  const working = crew(world, "conveyor");
  for (const id of working) {
    const body = world.body[id];
    body.workBeats++;
    if (body.workBeats % 4 === 0) {
      body.condition = bounded(body.condition - (fast ? 2 : 1));
      world.psychology[id].stress = bounded(
        world.psychology[id].stress + (fast ? 2 : 1),
      );
    }
  }
  return working.length * (fast ? 2 : 1);
}

export function crewStress(world: WorkerWorld): number {
  const ids = crew(world, "conveyor");
  return ids.length
    ? Math.floor(
        ids.reduce((sum, id) => sum + world.psychology[id].stress, 0) /
          ids.length,
      )
    : 0;
}

export function strainCrew(
  world: WorkerWorld,
  delta: number,
  tick: number,
  eventId: string,
) {
  for (const id of crew(world, "conveyor")) {
    world.psychology[id].stress = bounded(world.psychology[id].stress + delta);
    world.history[id].push({ tick, eventId, kind: "strain" });
  }
}

/** The casualty stays an entity; only the crew present witnesses this incident. */
export function injureWorker(
  world: WorkerWorld,
  target: WorkerId,
  tick: number,
  eventId: string,
) {
  const room = world.assignment[target].room;
  if (world.body[target].status !== "active" || !room)
    throw new Error("invalid_casualty");
  for (const id of crew(world, room)) {
    world.psychology[id].stress = bounded(
      world.psychology[id].stress + (id === target ? 30 : 12),
    );
    world.history[id].push({
      tick,
      eventId,
      kind: id === target ? "injured" : "witnessed_loss",
    });
  }
  world.body[target].condition = 0;
  world.body[target].status = "destroyed";
}

export function allocateWorkers(
  world: WorkerWorld,
  retain: number,
  tick: number,
  eventId: string,
) {
  const waiting = world.order.filter(
    (id) => world.body[id].status === "awaiting_allocation",
  );
  if (!Number.isInteger(retain) || retain < 0 || retain > waiting.length)
    throw new Error("invalid_allocation");
  waiting.forEach((id, index) => {
    const kept = index < retain;
    world.body[id].status = kept ? "active" : "dispatched";
    world.history[id].push({
      tick,
      eventId,
      kind: kept ? "retained" : "dispatched",
    });
  });
}

/** Readouts are derived; there is no independent mutable worker count. */
export function workforceTotals(world: WorkerWorld) {
  let workers = 0,
    produced = 0,
    retained = 0,
    committed = 0,
    losses = 0;
  for (const id of world.order) {
    const status = world.body[id].status,
      made = world.identity[id].origin === "manufactured";
    if (status === "active") workers++;
    if (made) produced++;
    if (made && status === "active") retained++;
    if (status === "dispatched") committed++;
    if (status === "destroyed") losses++;
  }
  return { workers, produced, retained, committed, losses };
}
