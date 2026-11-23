import { createHash, timingSafeEqual } from "node:crypto";
import {
  DEFAULT_MODEL,
  narrativeRequest,
  extractResponse,
  validateNarrative,
  PROMPT_VERSION,
  type Evidence,
} from "./narrative";
import type { RunRequest } from "./protocol";
import type { State } from "./engine";
export function evidenceFor(request: RunRequest, state: State): Evidence {
  const event = state.events.at(-1);
  if (!event) throw new Error("no_event");
  return {
    id: createHash("sha256").update(JSON.stringify(request)).digest("hex"),
    event,
  };
}
function config() {
  const apiKey = process.env.OPENAI_API_KEY,
    gate = process.env.LOOPFORGE_DEMO_ACCESS_CODE;
  // Vercel's dedicated LOOPFORGE-prefix Upstash integration supplies KV_* names.
  // Select a complete naming scheme; never combine credentials from two stores.
  const manualStore =
    process.env.LOOPFORGE_REDIS_REST_URL !== undefined ||
    process.env.LOOPFORGE_REDIS_REST_TOKEN !== undefined;
  const url = manualStore
      ? process.env.LOOPFORGE_REDIS_REST_URL
      : process.env.LOOPFORGE_KV_REST_API_URL,
    token = manualStore
      ? process.env.LOOPFORGE_REDIS_REST_TOKEN
      : process.env.LOOPFORGE_KV_REST_API_TOKEN;
  const budget = Number(process.env.LOOPFORGE_BUDGET_MICRO_USD ?? 0),
    epoch = process.env.LOOPFORGE_BUDGET_ID;
  if (
    !apiKey ||
    !gate ||
    !url ||
    !token ||
    !epoch ||
    !Number.isSafeInteger(budget) ||
    budget <= 0
  )
    return null;
  if (!url.startsWith("https://")) return null;
  return { apiKey, gate, url, token, budget, epoch };
}
export function narrationAvailable() {
  return config() !== null;
}
export function authorizeNarration(header: string | null) {
  const c = config();
  if (!c || !header) return false;
  const actual = createHash("sha256").update(header).digest(),
    expected = createHash("sha256").update(`Bearer ${c.gate}`).digest();
  return timingSafeEqual(actual, expected);
}
async function redis(
  command: unknown[],
  c: NonNullable<ReturnType<typeof config>>,
) {
  const response = await fetch(c.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(3000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("budget_unavailable");
  const result = await response.json();
  if (result.error) throw new Error("budget_unavailable");
  return result.result;
}
/** Conservative, non-refundable reservation. Atomic across deployments; uncertainty consumes budget. */
export async function generateNarrative(evidence: Evidence, sample = 0) {
  if (!Number.isInteger(sample) || sample < 0 || sample > 2)
    throw new Error("invalid_sample");
  const c = config();
  if (!c) throw new Error("not_configured");
  const payload = narrativeRequest(evidence);
  const body = JSON.stringify(payload);
  // Fixed pinned model rates: $0.40/M input, $1.60/M output; UTF-8 byte count + envelope margin overestimates input tokens.
  // Model changes MUST change rates, budget proof and evaluation fixtures together.
  const reservation = Math.ceil(
    (Buffer.byteLength(body) + 2048) * 0.4 + 240 * 1.6,
  );
  const key = `loopforge:${c.epoch}:${DEFAULT_MODEL}:${PROMPT_VERSION}:${evidence.id}:${sample}`;
  const cached = await redis(["GET", `${key}:artifact`], c);
  if (cached) return { ...JSON.parse(cached), cached: true };
  const script =
    "if redis.call('EXISTS',KEYS[2]) == 1 then return -1 end; local spent=tonumber(redis.call('GET',KEYS[1]) or '0'); if spent+tonumber(ARGV[1])>tonumber(ARGV[2]) then return 0 end; redis.call('INCRBY',KEYS[1],ARGV[1]); redis.call('SET',KEYS[2],'reserved'); return 1";
  const reserved = await redis(
    [
      "EVAL",
      script,
      2,
      `loopforge:${c.epoch}:reserved_micro_usd`,
      `${key}:reservation`,
      reservation,
      c.budget,
    ],
    c,
  );
  if (reserved === 0) throw new Error("budget_exhausted");
  if (reserved !== 1) throw new Error("already_requested");
  const start = Date.now();
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.apiKey}`,
      "Content-Type": "application/json",
    },
    body,
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("provider_unavailable");
  const output = extractResponse(await response.json());
  const narrative = validateNarrative(JSON.parse(output.text), evidence);
  const artifact = {
    narrative,
    provenance: {
      provider: "OpenAI",
      model: output.model,
      promptVersion: PROMPT_VERSION,
      evidenceId: evidence.id,
      sample,
      usage: output.usage,
      latencyMs: Date.now() - start,
      reservedMicroUsd: reservation,
    },
    cached: false,
  };
  await redis(["SET", `${key}:artifact`, JSON.stringify(artifact)], c);
  return artifact;
}
