import {
  ENGINE_VERSION,
  isCommand,
  MAX_SHIFTS,
  replay,
  type Command,
} from "./engine";
export type RunRequest = {
  version: typeof ENGINE_VERSION;
  seed: number;
  commands: Command[];
};
export function parseRun(value: unknown): RunRequest {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("invalid_run");
  const r = value as Record<string, unknown>;
  if (
    r.version !== ENGINE_VERSION ||
    !Number.isInteger(r.seed) ||
    Number(r.seed) < 1 ||
    Number(r.seed) > 0xffffffff ||
    !Array.isArray(r.commands) ||
    r.commands.length > MAX_SHIFTS ||
    !r.commands.every(isCommand)
  )
    throw new Error("invalid_run");
  return {
    version: ENGINE_VERSION,
    seed: r.seed as number,
    commands: r.commands.map((c) => ({
      type: "resolve",
      doctrine: c.doctrine,
      assignments: [...c.assignments],
    })),
  };
}
export function resolveRun(value: unknown) {
  const request = parseRun(value);
  return { request, state: replay(request.seed, request.commands) };
}
/** Bound bytes while reading; Content-Length is not trusted. */
export async function readBoundedJson(
  request: Request,
  maxBytes = 12000,
): Promise<unknown> {
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new Error("expected_json");
  if (!request.body) throw new Error("empty_body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("body_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let at = 0;
  for (const c of chunks) {
    bytes.set(c, at);
    at += c.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
