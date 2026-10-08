/** Viewer reconstruction. This module must never import the kernel or private projection. */
import {
  canonical,
  ENGINE,
  PROTOCOL,
  SCHEMA,
  type PlayerView,
  type Receipt,
  type RecordMessage,
} from "./contract";
export type Hasher = (value: PlayerView) => Promise<string>;
export const digestView: Hasher = async (view) => {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonical(view)),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
};
export async function applyRecord(
  previous: Receipt | null,
  message: RecordMessage,
  runId: string,
  hash: Hasher = digestView,
): Promise<Receipt> {
  if (
    message.protocol !== PROTOCOL ||
    message.schema_version !== SCHEMA ||
    message.engine_version !== ENGINE ||
    message.run_id !== runId ||
    (previous && previous.runId !== runId)
  )
    throw new Error("incompatible_record");
  let view: PlayerView;
  switch (message.msg_type) {
    case "FULL_SNAPSHOT":
      if (previous) throw new Error("explicit_recovery_required");
      view = message.payload.view;
      if (view.tick !== message.payload.tick)
        throw new Error("invalid_snapshot");
      break;
    case "FRAME_DIFF": {
      const p = message.payload;
      if (
        !previous ||
        p.from_tick !== previous.view.tick ||
        p.to_tick !== p.from_tick + 1 ||
        p.prev_step_hash !== previous.hash
      )
        throw new Error("out_of_order_record");
      view = JSON.parse(JSON.stringify(previous.view));
      if (
        p.ops.length !== 2 ||
        p.ops[0].op !== "set_fields" ||
        p.ops[1].op !== "append_events"
      )
        throw new Error("invalid_operations");
      for (const op of p.ops) {
        if (op.op === "set_fields") view = { ...op.value, events: view.events };
        else if (op.op === "append_events") view.events.push(...op.value);
        else throw new Error("unsupported_operation");
      }
      if (
        view.tick !== p.to_tick ||
        new Set(view.events.map((e) => e.id)).size !== view.events.length
      )
        throw new Error("invalid_transition");
      break;
    }
    default:
      throw new Error("unsupported_record");
  }
  if ((await hash(view)) !== message.payload.step_hash)
    throw new Error("integrity_mismatch");
  return { view, hash: message.payload.step_hash, runId };
}
