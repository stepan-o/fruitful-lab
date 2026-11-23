/** Portable kernel: no I/O, wall clock, ambient RNG or framework imports. */
export const ENGINE_VERSION = "lf-teaching-1" as const;
export const MAX_SHIFTS = 8;
export const QUOTA = 240;
export const supervisorIds = [
  "limen",
  "stiletto",
  "cathexis",
  "witch",
  "thrum",
] as const;
export type Supervisor = (typeof supervisorIds)[number];
export const doctrines = ["balanced", "pressure", "care"] as const;
export type Doctrine = (typeof doctrines)[number];
export type Command = Readonly<{
  type: "resolve";
  assignments: readonly Supervisor[];
  doctrine: Doctrine;
}>;
export type RoomResult = Readonly<{
  room: number;
  supervisor: Supervisor;
  expertise: number;
  disturbance: number;
  output: number;
}>;
export type ShiftEvent = Readonly<{
  id: string;
  shift: number;
  doctrine: Doctrine;
  strainBefore: number;
  strainAfter: number;
  delta: number;
  total: number;
  rooms: readonly RoomResult[];
}>;
export type State = Readonly<{
  version: typeof ENGINE_VERSION;
  seed: number;
  rng: number;
  shift: number;
  total: number;
  strain: number;
  phase: "planning" | "complete";
  events: readonly ShiftEvent[];
}>;
export type Failure = "invalid_command" | "run_complete" | "wrong_version";
export type Result =
  | { ok: true; state: State; event: ShiftEvent }
  | { ok: false; error: Failure };
export const defaultAssignments: readonly Supervisor[] = [...supervisorIds];
export function initialState(seed: number): State {
  if (!Number.isInteger(seed) || seed < 1 || seed > 0xffffffff)
    throw new Error("Seed must be an unsigned, nonzero 32-bit integer");
  return {
    version: ENGINE_VERSION,
    seed,
    rng: seed,
    shift: 0,
    total: 0,
    strain: 0,
    phase: "planning",
    events: [],
  };
}
export function isCommand(value: unknown): value is Command {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const c = value as Record<string, unknown>;
  return (
    Object.keys(c).length === 3 &&
    c.type === "resolve" &&
    doctrines.includes(c.doctrine as Doctrine) &&
    Array.isArray(c.assignments) &&
    c.assignments.length === 5 &&
    new Set(c.assignments).size === 5 &&
    c.assignments.every((x) => supervisorIds.includes(x))
  );
}
/** xorshift32; JS bitwise results are normalized to u32 after every step. */
export function nextRandom(input: number): number {
  let x = input >>> 0;
  x = (x ^ (x << 13)) >>> 0;
  x = (x ^ (x >>> 17)) >>> 0;
  return (x ^ (x << 5)) >>> 0;
}
export function transition(state: State, command: unknown): Result {
  if (state.version !== ENGINE_VERSION)
    return { ok: false, error: "wrong_version" };
  if (state.phase === "complete") return { ok: false, error: "run_complete" };
  if (!isCommand(command)) return { ok: false, error: "invalid_command" };
  let rng = state.rng;
  const modifier =
    command.doctrine === "pressure" ? 2 : command.doctrine === "care" ? -1 : 0;
  const penalty = Math.floor(state.strain / 20);
  const rooms = command.assignments.map((supervisor, room) => {
    rng = nextRandom(rng);
    const disturbance = (rng % 3) - 1;
    const expertise = supervisor === supervisorIds[room] ? 2 : 0;
    return {
      room,
      supervisor,
      expertise,
      disturbance,
      output: Math.max(0, 4 + expertise + modifier + disturbance - penalty),
    };
  });
  const delta = rooms.reduce((n, r) => n + r.output, 0),
    shift = state.shift + 1;
  const strain = Math.max(
    0,
    Math.min(
      100,
      state.strain +
        (command.doctrine === "pressure"
          ? 18
          : command.doctrine === "care"
            ? -16
            : 4),
    ),
  );
  const event: ShiftEvent = {
    id: `${ENGINE_VERSION}:${state.seed}:${shift}`,
    shift,
    doctrine: command.doctrine,
    strainBefore: state.strain,
    strainAfter: strain,
    delta,
    total: state.total + delta,
    rooms,
  };
  return {
    ok: true,
    event,
    state: {
      ...state,
      rng,
      shift,
      total: event.total,
      strain,
      phase: shift === MAX_SHIFTS ? "complete" : "planning",
      events: [...state.events, event],
    },
  };
}
export function replay(seed: number, commands: readonly unknown[]): State {
  if (commands.length > MAX_SHIFTS)
    throw new Error("History exceeds run bounds");
  let state = initialState(seed);
  for (const command of commands) {
    const result = transition(state, command);
    if (!result.ok) throw new Error(result.error);
    state = result.state;
  }
  return state;
}
