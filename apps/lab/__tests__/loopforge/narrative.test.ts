/** @jest-environment node */
import { defaultAssignments, replay } from "@/lib/loopforge/engine";
import {
  validateNarrative,
  narrativeRequest,
  extractResponse,
  type Evidence,
} from "@/lib/loopforge/narrative";
import {
  evidenceFor,
  generateNarrative,
  narrationAvailable,
  authorizeNarration,
} from "@/lib/loopforge/narrative-server";
import { parseRun, readBoundedJson } from "@/lib/loopforge/protocol";
const request = parseRun({
  version: "lf-teaching-1",
  seed: 7,
  commands: [
    { type: "resolve", assignments: defaultAssignments, doctrine: "pressure" },
  ],
});
const evidence: Evidence = evidenceFor(
  request,
  replay(request.seed, request.commands),
);
const good = {
  speaker: "stiletto",
  line: "The order moved. So did the price of keeping up.",
  evidenceId: evidence.id,
};
test("validates evidence identity, speaker, bounded text and field whitelist", () => {
  expect(validateNarrative(good, evidence)).toEqual(good);
  for (const bad of [
    { ...good, evidenceId: "another-branch" },
    { ...good, speaker: "admin" },
    { ...good, speaker: "limen" },
    { ...good, line: "x".repeat(421) },
    { ...good, line: "<script>run()</script>" },
    { ...good, command: { type: "open_room" } },
    { ...good, line: "word ".repeat(66) },
  ])
    expect(() => validateNarrative(bad, evidence)).toThrow();
});
test("evidence hash distinguishes branches with the same seed and shift", () => {
  const other = parseRun({
    ...request,
    commands: [{ ...request.commands[0], doctrine: "care" }],
  });
  expect(evidenceFor(other, replay(other.seed, other.commands)).id).not.toBe(
    evidence.id,
  );
});
test("adapter accepts only a completed text artifact, handles refusal/incomplete", () => {
  expect(
    extractResponse({
      status: "completed",
      model: "test",
      output: [
        { type: "reasoning" },
        { type: "message", content: [{ type: "output_text", text: "{}" }] },
      ],
      usage: { input_tokens: 100, output_tokens: 20 },
    }).usage,
  ).toEqual({ input: 100, output: 20, cached: 0 });
  for (const value of [
    { status: "incomplete", output: [] },
    {
      status: "completed",
      output: [{ type: "message", content: [{ type: "refusal" }] }],
    },
  ])
    expect(() => extractResponse(value)).toThrow();
  const payload = narrativeRequest(evidence);
  expect(payload).toMatchObject({ store: false, max_output_tokens: 240 });
  expect(payload).not.toHaveProperty("tools");
});
test("JSON body cap works without a trusted content length", async () => {
  const req = new Request("http://local/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ x: "x".repeat(50) }),
  });
  await expect(readBoundedJson(req, 20)).rejects.toThrow("body_too_large");
});
const originalEnv = { ...process.env };
const originalFetch = global.fetch;
beforeEach(() => {
  process.env.OPENAI_API_KEY = "test-key";
  process.env.LOOPFORGE_DEMO_ACCESS_CODE = "test-code";
  process.env.LOOPFORGE_REDIS_REST_URL = "https://quota.test";
  process.env.LOOPFORGE_REDIS_REST_TOKEN = "test-token";
  process.env.LOOPFORGE_BUDGET_ID = "test-epoch";
  process.env.LOOPFORGE_BUDGET_MICRO_USD = "100000";
});
afterEach(() => {
  process.env = { ...originalEnv };
  global.fetch = originalFetch;
});
const response = (result: unknown) =>
  Promise.resolve(new Response(JSON.stringify({ result }), { status: 200 }));
test("supports the dedicated Marketplace store without mixing credential pairs", () => {
  delete process.env.LOOPFORGE_REDIS_REST_URL;
  delete process.env.LOOPFORGE_REDIS_REST_TOKEN;
  process.env.LOOPFORGE_KV_REST_API_URL = "https://marketplace-quota.test";
  process.env.LOOPFORGE_KV_REST_API_TOKEN = "marketplace-test-token";
  expect(narrationAvailable()).toBe(true);
  process.env.LOOPFORGE_REDIS_REST_URL = "https://different-quota.test";
  expect(narrationAvailable()).toBe(false);
  process.env.LOOPFORGE_REDIS_REST_TOKEN = "manual-test-token";
  expect(narrationAvailable()).toBe(true);
});
test("missing credentials or budget close the paid lane", () => {
  expect(narrationAvailable()).toBe(true);
  expect(authorizeNarration("Bearer test-code")).toBe(true);
  expect(authorizeNarration("Bearer wrong")).toBe(false);
  delete process.env.LOOPFORGE_BUDGET_MICRO_USD;
  expect(narrationAvailable()).toBe(false);
});
test.each([0, -1])(
  "exhausted quota or duplicate reservation never calls provider (%s)",
  async (result) => {
    const mock = jest
      .fn()
      .mockImplementationOnce(() => response(null))
      .mockImplementationOnce(() => response(result));
    global.fetch = mock;
    await expect(generateNarrative(evidence)).rejects.toThrow(
      result === 0 ? "budget_exhausted" : "already_requested",
    );
    expect(mock).toHaveBeenCalledTimes(2);
    expect(mock.mock.calls.every(([url]) => url === "https://quota.test")).toBe(
      true,
    );
  },
);
test("provider failure does not refund reservation or retry", async () => {
  const mock = jest
    .fn()
    .mockImplementationOnce(() => response(null))
    .mockImplementationOnce(() => response(1))
    .mockResolvedValueOnce(new Response("unavailable", { status: 500 }));
  global.fetch = mock;
  await expect(generateNarrative(evidence)).rejects.toThrow(
    "provider_unavailable",
  );
  expect(mock).toHaveBeenCalledTimes(3);
});
test("valid response is stored with usage and provenance; mechanics are unchanged", async () => {
  const before = JSON.stringify(evidence);
  const mock = jest
    .fn()
    .mockImplementationOnce(() => response(null))
    .mockImplementationOnce(() => response(1))
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: "completed",
          model: "test-model",
          output: [
            {
              type: "message",
              content: [{ type: "output_text", text: JSON.stringify(good) }],
            },
          ],
          usage: { input_tokens: 900, output_tokens: 80 },
        }),
      ),
    )
    .mockImplementationOnce(() => response("OK"));
  global.fetch = mock;
  const result = await generateNarrative(evidence);
  expect(result.narrative).toEqual(good);
  expect(result.provenance.usage).toEqual({
    input: 900,
    output: 80,
    cached: 0,
  });
  expect(JSON.stringify(evidence)).toBe(before);
  expect(mock).toHaveBeenCalledTimes(4);
});
test("schema-valid prose can still be unfaithful; requires semantic evaluation", () => {
  expect(
    validateNarrative(
      { ...good, line: "I opened the sealed assembly room." },
      evidence,
    ),
  ).toBeDefined();
});
test("narration receives named facts, assigned voice and explicit quota outcome", () => {
  const finished = replay(
    7,
    Array.from({ length: 8 }, () => request.commands[0]),
  );
  const payload = narrativeRequest({
    id: "finished",
    event: finished.events[7],
  });
  const input = JSON.parse(payload.input);
  expect(input.committedFacts).toMatchObject({ runComplete: true, quota: 240 });
  expect(input.committedFacts.rooms[0]).toMatchObject({
    name: "Security",
    supervisor: "Limen",
  });
  expect(input.committedFacts.rooms[0]).not.toHaveProperty("room");
  expect(input.assignedSpeaker).toBe("cathexis");
  expect(payload.text.format.schema.properties.speaker.enum).toEqual([
    "cathexis",
  ]);
});
