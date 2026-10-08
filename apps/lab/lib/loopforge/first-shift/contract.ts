/** Primitives-only viewer contract. No kernel, renderer, clock or provider imports. */
export const PROTOCOL = "loopforge-kvp-http/1" as const;
export const SCHEMA = "loopforge_first_shift_1" as const;
export const ENGINE = "first-shift-1.0.0" as const;
export const SHIFT_TICKS = 48;
export type SupervisorId = "limen" | "stiletto";
export type RoomId = "conveyor" | "security";
export type Assignments = Record<RoomId, SupervisorId>;
export type Resolution = "slow" | "push" | "hold" | "wave";
export type Command =
  | { type: "choose_adviser"; adviser: SupervisorId }
  | { type: "approve_plan"; assignments: Assignments }
  | { type: "start_shift" }
  | { type: "advance" }
  | { type: "resolve_incident"; incident: string; response: Resolution }
  | { type: "commit_output"; retain: number };
export type Phase =
  | "choose"
  | "briefing"
  | "ready"
  | "running"
  | "decision"
  | "allocation"
  | "complete";
export type Briefing = {
  assessment: string;
  context: string;
  priority: string;
  rationale: string;
  tradeoff: string;
  assignments: Assignments;
};
export type Choice = { id: Resolution; label: string; consequence: string };
export type Incident = {
  id: string;
  room: RoomId;
  title: string;
  observation: string;
  recommendation: Resolution;
  advice: string;
  choices: Choice[];
};
export type Event = {
  id: string;
  tick: number;
  shiftTick: number;
  kind:
    | "adviser"
    | "plan"
    | "shift"
    | "production"
    | "incident"
    | "resolution"
    | "allocation";
  room: RoomId | null;
  title: string;
  detail: string;
  cause: string;
  actor: SupervisorId | "director" | "factory";
};
export type PersonView = {
  id: SupervisorId;
  room: RoomId | null;
  remark: string;
};
export type PlayerView = {
  tick: number;
  shiftTick: number;
  phase: Phase;
  day: number;
  cash: number;
  workers: number;
  condition: number;
  produced: number;
  quota: number;
  committed: number;
  retained: number;
  losses: number;
  adviser: SupervisorId | null;
  assignments: Assignments | null;
  briefing: Briefing | null;
  pending: Incident | null;
  people: PersonView[];
  events: Event[];
};
export type Header = {
  protocol: typeof PROTOCOL;
  schema_version: typeof SCHEMA;
  engine_version: typeof ENGINE;
  msg_id: string;
  sent_at_ms: number;
  run_id: string;
};
export type Op =
  | { op: "set_fields"; value: Omit<PlayerView, "events"> }
  | { op: "append_events"; value: Event[] };
export type Snapshot = Header & {
  msg_type: "FULL_SNAPSHOT";
  payload: { tick: number; step_hash: string; view: PlayerView };
};
export type Diff = Header & {
  msg_type: "FRAME_DIFF";
  payload: {
    from_tick: number;
    to_tick: number;
    prev_step_hash: string;
    step_hash: string;
    ops: Op[];
  };
};
export type RecordMessage = Snapshot | Diff;
export type RunRequest = {
  protocol: typeof PROTOCOL;
  schema_version: typeof SCHEMA;
  engine_version: typeof ENGINE;
  run_id: string;
  seed: number;
  initial_workers: number;
  commands: Command[];
  baseline: { tick: number; step_hash: string } | null;
};
export type Receipt = { view: PlayerView; hash: string; runId: string };
/** Canonical JSON for this integer-only schema; keys sort, operation arrays do not. */
export function canonical(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean")
    return JSON.stringify(value);
  if (typeof value === "number" && Number.isSafeInteger(value))
    return String(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${canonical(record[k])}`)
      .join(",")}}`;
  }
  throw new Error("non_canonical_value");
}
