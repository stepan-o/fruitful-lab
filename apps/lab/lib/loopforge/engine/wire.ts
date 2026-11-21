import { decode } from "./validate";
import { canonical, validEnvelope, type Envelope } from "../intro/protocol";

export const schema = "loopforge_campaign_1";
export const subscription = {
  stream: "LIVE",
  channels: ["WORLD", "AGENTS", "ITEMS", "EVENTS"],
  diff_policy: "DIFF_ONLY",
  snapshot_policy: "ON_JOIN",
  compression: "NONE",
};
export type State = {
  world: PublicWorld;
  agents: Actor[];
  items: Item[];
  events: Speech[];
};
import type { Actor as IntroActor, Item, Utterance } from "../intro/protocol";
import type { Floor } from "../shifts/playthrough";
export type Actor = IntroActor & {
  duty: string;
  station: number;
  available: boolean;
  label: string;
};
export type Speech = Utterance & Floor["dialogue"][number];
export type PublicWorld = {
  phase: "intro" | "console" | "call" | "floor";
  minute: number;
  layout: string;
  quota: number;
  topic: number;
  clock_tick: number;
  day_one_count: number;
  rack: string[];
  gate_mm: number;
  jammed: boolean;
  outputs: number;
  edited_ms: number;
  confirmed: number;
  order: null | { station: string; text: string };
  floor?: {
    stage: string;
    start: number;
    lead: string;
    bell: number;
    lesson: string;
    held: boolean;
    posts: string[];
    crew: string[];
    manual: boolean;
    closed: boolean;
    dayCount: number;
    status: string;
    deadline: number;
    waiting: string[];
    coverage: string[];
    ratings: Record<string, number[]>;
    needs: number[][];
    bids: Record<string, string>;
    machines: (Floor["machines"][number] & { cycleMs: number | null })[];
    shot: "security" | "conveyor";
    shotSeq: number;
    opening: boolean;
    stroke: number;
  };
};
export type Frame = { tick: number; hash: string; state: State };
export async function sha(text: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(bytes), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
}
type Segment = string | number;
type Op = { op: "SET" | "REMOVE"; path: Segment[]; value?: unknown };
function patch(root: unknown, entry: Op, depth = 0): unknown {
  const key = entry.path[depth];
  if (
    !root ||
    typeof root !== "object" ||
    !["SET", "REMOVE"].includes(entry.op) ||
    !Array.isArray(entry.path) ||
    entry.path.length > 24 ||
    (depth === 0 &&
      !["world", "agents", "items", "events"].includes(String(key))) ||
    ["__proto__", "constructor", "prototype"].includes(String(key))
  )
    throw Error("Invalid patch");
  const copy = Array.isArray(root)
    ? root.slice()
    : ({ ...root } as Record<string, unknown>);
  if (
    Array.isArray(copy)
      ? typeof key !== "number" ||
        !Number.isSafeInteger(key) ||
        key < 0 ||
        key > copy.length
      : typeof key !== "string"
  )
    throw Error("Invalid patch path");
  const record = copy as Record<Segment, unknown>;
  if (depth + 1 < entry.path.length)
    record[key] = patch(record[key], entry, depth + 1);
  else if (entry.op === "SET" && Object.hasOwn(entry, "value"))
    record[key] = entry.value;
  else if (entry.op === "REMOVE" && Object.hasOwn(record, key)) {
    if (Array.isArray(copy)) copy.splice(Number(key), 1);
    else delete record[key];
  } else throw Error("Invalid patch value");
  return copy;
}
export async function read(before: Frame | null, e: Envelope): Promise<Frame> {
  const p = e.payload;
  if (
    !validEnvelope(e) ||
    p.schema_version !== schema ||
    !/^([0-9a-f]{64})$/.test(String(p.step_hash))
  )
    throw Error("Invalid frame");
  let tick: number, state: State;
  if (e.msg_type === "FULL_SNAPSHOT") {
    tick = Number(p.tick);
    state = p.state as State;
  } else if (
    e.msg_type === "FRAME_DIFF" &&
    before &&
    p.from_tick === before.tick &&
    p.to_tick === before.tick + 1 &&
    p.prev_step_hash === before.hash &&
    Array.isArray(p.ops)
  ) {
    tick = p.to_tick as number;
    state = (p.ops as Op[]).reduce(
      (s, op) => patch(s, op) as State,
      before.state,
    );
  } else throw Error("Tick gap");
  if (
    !Number.isSafeInteger(tick) ||
    tick < 0 ||
    !state?.world ||
    ![state.agents, state.items, state.events].every(Array.isArray)
  )
    throw Error("Invalid state");
  state = decode(state);
  if ((await sha(canonical(state))) !== p.step_hash)
    throw Error("Public state hash mismatch");
  return { tick, state, hash: p.step_hash as string };
}
type Pointer = { url: string; sha256: string };
export async function fetchReplay(
  p: Record<string, unknown>,
  artifact: (url: string) => string,
) {
  async function checked(ref: Pointer) {
    const text = artifact(ref.url);
    if ((await sha(text)) !== ref.sha256) throw Error("Artifact hash mismatch");
    return text;
  }
  const manifest = JSON.parse(
    await checked({
      url: String(p.artifacts_manifest_url),
      sha256: String(p.manifest_sha256),
    }),
  );
  const end = Number(p.recovery_tick) + 1;
  if (
    manifest.schema_version !== schema ||
    manifest.run_anchors?.run_id !== p.run_id ||
    manifest.available_end_tick !== end ||
    manifest.integrity?.hash_alg !== "SHA-256"
  )
    throw Error("Invalid replay manifest");
  const base = String(p.artifacts_manifest_url).replace(/[^/]+$/, "");
  async function record(
    ref: { id: string; rel_path: string; msg_type: string },
    type: string,
  ) {
    if (
      !ref ||
      ref.msg_type !== type ||
      !/^state\/(snapshots|diffs)\/[a-z0-9_.]+$/.test(ref.rel_path)
    )
      throw Error("Invalid record pointer");
    const e = JSON.parse(
      await checked({
        url: base + ref.rel_path,
        sha256: manifest.integrity.records_sha256[ref.id],
      }),
    );
    if (e.msg_type !== type || e.sent_at_ms !== 0)
      throw Error("Invalid replay record");
    return e;
  }
  const start = manifest.available_start_tick;
  let frame = await read(
    null,
    await record(manifest.snapshots[start], "FULL_SNAPSHOT"),
  );
  if (frame.tick !== start) throw Error("Unexpected keyframe");
  for (let t = start; t < end - 1; t++) {
    frame = await read(
      frame,
      await record(manifest.diffs.diffs_by_from_tick[t], "FRAME_DIFF"),
    );
  }
  if (frame.hash !== manifest.step_hash) throw Error("Incomplete replay");
  return frame;
}
