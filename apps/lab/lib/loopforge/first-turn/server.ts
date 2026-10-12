import { createHash, randomUUID } from "node:crypto";
import {
  canonical,
  ENGINE,
  PROTOCOL,
  SCHEMA,
  type Command,
  type PlayerView,
  type RecordMessage,
  type RunRequest,
} from "./contract";
import { replay } from "./kernel";
import { project } from "./kernel";
import { parseCommand as parseDailyCommand } from "../first-shift/server";
export const MAX_COMMANDS = 256;
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const hashPattern = /^[0-9a-f]{64}$/;
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid_object");
  return value as Record<string, unknown>;
}
export function parseCommand(value: unknown): Command {
  const c=object(value);
  if(c.type==='acknowledge_mandate')return {type:c.type};
  if(c.type==='set_operation'&&(c.feed==='hold'||c.feed==='metered'||c.feed==='open')&&(c.drive==='steady'||c.drive==='push'))return {type:c.type,feed:c.feed,drive:c.drive};
  return parseDailyCommand(value);
}
export function parseRequest(value: unknown): RunRequest {
  const r = object(value);
  if (
    r.protocol !== PROTOCOL ||
    r.schema_version !== SCHEMA ||
    r.engine_version !== ENGINE ||
    typeof r.run_id !== "string" ||
    !uuid.test(r.run_id) ||
    !Number.isInteger(r.seed) ||
    Number(r.seed) < 1 ||
    Number(r.seed) > 0xffffffff ||
    !Number.isInteger(r.initial_workers) ||
    Number(r.initial_workers) < 10 ||
    Number(r.initial_workers) > 100 ||
    !Array.isArray(r.commands) ||
    r.commands.length > MAX_COMMANDS
  )
    throw new Error("invalid_request");
  let baseline: RunRequest["baseline"] = null;
  if (r.baseline !== null) {
    const b = object(r.baseline);
    if (
      !Number.isInteger(b.tick) ||
      Number(b.tick) < 0 ||
      typeof b.step_hash !== "string" ||
      !hashPattern.test(b.step_hash)
    )
      throw new Error("invalid_baseline");
    baseline = { tick: Number(b.tick), step_hash: b.step_hash };
  }
  return {
    protocol: PROTOCOL,
    schema_version: SCHEMA,
    engine_version: ENGINE,
    run_id: r.run_id,
    seed: Number(r.seed),
    initial_workers: Number(r.initial_workers),
    commands: r.commands.map(parseCommand),
    baseline,
  };
}
export function viewHash(view: PlayerView) {
  return createHash("sha256").update(canonical(view)).digest("hex");
}
export function respond(value: unknown): RecordMessage {
  const request = parseRequest(value),
    state = replay(request.seed, request.commands, request.initial_workers),
    view = project(state),
    hash = viewHash(view);
  const header = {
    protocol: PROTOCOL,
    schema_version: SCHEMA,
    engine_version: ENGINE,
    msg_id: randomUUID(),
    sent_at_ms: Date.now(),
    run_id: request.run_id,
  };
  if (request.baseline) {
    if (request.baseline.tick !== view.tick - 1)
      throw new Error("baseline_mismatch");
    const previous = project(
      replay(
        request.seed,
        request.commands.slice(0, -1),
        request.initial_workers,
      ),
    );
    if (viewHash(previous) !== request.baseline.step_hash)
      throw new Error("baseline_mismatch");
    const { events, ...fields } = view;
    return {
      ...header,
      msg_type: "FRAME_DIFF",
      payload: {
        from_tick: previous.tick,
        to_tick: view.tick,
        prev_step_hash: request.baseline.step_hash,
        step_hash: hash,
        ops: [
          { op: "set_fields", value: fields },
          { op: "append_events", value: events.slice(previous.events.length) },
        ],
      },
    };
  }
  return {
    ...header,
    msg_type: "FULL_SNAPSHOT",
    payload: { tick: view.tick, step_hash: hash, view },
  };
}
