/** @jest-environment node */
import { createHash } from "node:crypto";
import {
  canonical,
  ENGINE,
  PROTOCOL,
  SCHEMA,
  type Command,
  type RecordMessage,
  type RunRequest,
  type SupervisorId,
} from "@/lib/loopforge/first-shift/contract";
import { initialState, replay, step } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";
import {
  parseRequest,
  respond,
  viewHash,
} from "@/lib/loopforge/first-shift/server";
import { applyRecord } from "@/lib/loopforge/first-shift/viewer";
import { POST } from "@/app/api/loopforge/first-shift/route";
import {
  crew,
  workforceTotals,
  assignCrew,
} from "@/lib/loopforge/first-shift/workers";
const runId = "12345678-1234-4123-8123-123456789012";
function request(commands: Command[] = []): RunRequest {
  return {
    protocol: PROTOCOL,
    schema_version: SCHEMA,
    engine_version: ENGINE,
    run_id: runId,
    seed: 7,
    initial_workers: 24,
    commands,
    baseline: null,
  };
}
function play(
  adviser: SupervisorId,
  swap = false,
  seed = 7,
  startingWorkers = 24,
) {
  const commands: Command[] = [];
  let state = initialState(seed, startingWorkers);
  const send = (command: Command) => {
    commands.push(command);
    state = step(state, command);
  };
  send({ type: "choose_adviser", adviser });
  const proposal = state.briefing!.assignments;
  send({
    type: "approve_plan",
    assignments: swap
      ? { conveyor: proposal.security, security: proposal.conveyor }
      : proposal,
  });
  send({ type: "start_shift" });
  while (state.phase === "running" || state.phase === "decision") {
    if (state.pending)
      send({
        type: "resolve_incident",
        incident: state.pending.id,
        response: state.pending.recommendation,
      });
    else send({ type: "advance" });
  }
  return { state, commands, send, current: () => state };
}
test("first day has no assignments, no chosen adviser and a weekly delivery", () => {
  const view = project(initialState(7));
  expect(view).toMatchObject({
    assignments: null,
    adviser: null,
    workers: 24,
    cash: 240,
    quota: 60,
    committed: 0,
  });
  expect(view.people.every((p) => p.room === null)).toBe(true);
  expect(() => step(initialState(7), { type: "start_shift" })).toThrow();
});
test("choosing the adviser commits the voice but does not assign the floor", () => {
  const prior = initialState(7),
    saved = canonical(prior),
    next = step(prior, { type: "choose_adviser", adviser: "limen" });
  expect(canonical(prior)).toBe(saved);
  expect(next.assignments).toBeNull();
  expect(() =>
    step(next, { type: "choose_adviser", adviser: "stiletto" }),
  ).toThrow();
  expect(() =>
    step(next, {
      type: "approve_plan",
      assignments: { conveyor: "limen", security: "limen" },
    }),
  ).toThrow();
});
test.each(["limen", "stiletto"] as const)(
  "%s has auto authority only in the actual assigned room",
  (adviser) => {
    for (const swap of [false, true]) {
      const { state } = play(adviser, swap);
      const resolutions = state.events.filter((e) => e.kind === "resolution");
      expect(resolutions).toHaveLength(2);
      const ownRoom =
        state.assignments!.conveyor === adviser ? "conveyor" : "security";
      expect(resolutions.find((e) => e.room === ownRoom)?.actor).toBe(adviser);
      expect(resolutions.find((e) => e.room !== ownRoom)?.actor).toBe(
        "director",
      );
    }
  },
);
test("decision pauses reject ticks and stale or wrong-room responses", () => {
  let s = initialState(7);
  for (const c of [
    { type: "choose_adviser", adviser: "limen" },
    {
      type: "approve_plan",
      assignments: { conveyor: "stiletto", security: "limen" },
    },
    { type: "start_shift" },
  ] as Command[])
    s = step(s, c);
  while (s.phase === "running") s = step(s, { type: "advance" });
  expect(s.pending?.room).toBe("conveyor");
  expect(() => step(s, { type: "advance" })).toThrow();
  expect(() =>
    step(s, {
      type: "resolve_incident",
      incident: "clearance-mismatch",
      response: "hold",
    }),
  ).toThrow();
  expect(() =>
    step(s, {
      type: "resolve_incident",
      incident: "belt-vibration",
      response: "wave",
    }),
  ).toThrow();
});
test("safer work preserves condition at an output cost, without early repairs or income", () => {
  const safe = play("limen").state,
    fast = play("stiletto").state;
  expect(workforceTotals(safe.workers).produced).toBeLessThan(
    workforceTotals(fast.workers).produced,
  );
  expect(safe.condition).toBeGreaterThan(fast.condition);
  expect(safe.condition).toBeLessThan(82);
  expect(safe.cash).toBe(240);
  expect(fast.cash).toBe(240);
  expect(workforceTotals(safe.workers).losses).toBe(0);
  expect(() =>
    parseRequest(request([{ type: "repair" } as unknown as Command])),
  ).toThrow();
});
test("risk has seeded variation, does not force an accident, and replay preserves it", () => {
  const losses = new Set<number>();
  for (let seed = 1; seed <= 12; seed++) {
    const result = play("stiletto", false, seed);
    losses.add(workforceTotals(result.state.workers).losses);
    expect(replay(seed, result.commands)).toEqual(result.state);
  }
  expect([...losses].sort()).toEqual([0, 1]);
});
test("each valid allocation conserves production and cannot be changed afterward", () => {
  const result = play("limen"),
    before = result.state;
  for (
    let retain = 0;
    retain <= workforceTotals(before.workers).produced;
    retain++
  ) {
    const after = step(before, { type: "commit_output", retain });
    const totals = workforceTotals(after.workers);
    expect(totals.committed + totals.retained).toBe(
      workforceTotals(before.workers).produced,
    );
    expect(totals.workers).toBe(
      workforceTotals(before.workers).workers + retain,
    );
    expect(totals.retained).toBe(retain);
    expect(() => step(after, { type: "commit_output", retain: 0 })).toThrow();
    expect(() => step(after, { type: "advance" })).toThrow();
  }
  for (const retain of [-1, 1.5, workforceTotals(before.workers).produced + 1])
    expect(() => step(before, { type: "commit_output", retain })).toThrow();
});
test("hidden history and internal reasoning exist but never enter the player projection", () => {
  const result = play("stiletto", true),
    state = result.state;
  expect(
    state.workers.order
      .filter((id) => state.workers.identity[id].origin === "manufactured")
      .every((id) => state.workers.conditioning[id].state === "unconditioned"),
  ).toBe(true);
  expect(state.traces.length).toBeGreaterThan(1);
  expect(state.minds.stiletto.loyalty).toBeLessThan(60);
  const serialized = JSON.stringify(project(state));
  for (const secret of [
    "unconditioned",
    "psychology",
    "worker-",
    "confidence",
    "loyalty",
    "memories",
    "traces",
    "rng",
    "Seeded risk draw",
  ])
    expect(serialized).not.toContain(secret);
});
test("snapshots plus ordered operations reconstruct every state and reject duplicate/out-of-order records", async () => {
  const { commands } = play("limen", true);
  let receipt = await applyRecord(null, respond(request()), runId, async (v) =>
    viewHash(v),
  );
  for (let i = 1; i <= commands.length; i++) {
    const message = respond({
      ...request(commands.slice(0, i)),
      baseline: { tick: receipt.view.tick, step_hash: receipt.hash },
    });
    const previous = receipt;
    receipt = await applyRecord(receipt, message, runId, async (v) =>
      viewHash(v),
    );
    expect(receipt.view).toEqual(project(replay(7, commands.slice(0, i))));
    await expect(
      applyRecord(receipt, message, runId, async (v) => viewHash(v)),
    ).rejects.toThrow();
    const corrupt = JSON.parse(JSON.stringify(message));
    corrupt.payload.step_hash = "0".repeat(64);
    await expect(
      applyRecord(previous, corrupt, runId, async (v) => viewHash(v)),
    ).rejects.toThrow("integrity_mismatch");
  }
  expect(respond(request(commands)).msg_type).toBe("FULL_SNAPSHOT");
});
test("version, seed, input bounds, forged baselines and unknown records fail closed", async () => {
  for (const bad of [
    { protocol: "0.1" },
    { schema_version: "wrong" },
    { engine_version: "wrong" },
    { seed: 0 },
    { seed: 1.1 },
    { seed: 0x100000000 },
    { run_id: "no" },
    { commands: Array(57).fill({ type: "advance" }) },
  ])
    expect(() => respond({ ...request(), ...bad })).toThrow();
  const commands: Command[] = [{ type: "choose_adviser", adviser: "limen" }];
  expect(() =>
    respond({
      ...request(commands),
      baseline: { tick: 0, step_hash: "a".repeat(64) },
    }),
  ).toThrow("baseline_mismatch");
  await expect(
    applyRecord(
      null,
      {
        ...respond(request()),
        msg_type: "mystery",
      } as unknown as RecordMessage,
      runId,
    ),
  ).rejects.toThrow();
});
test("a model artifact cannot act as a command or state mutation", () => {
  expect(() =>
    parseRequest(
      request([{ type: "model_result", produced: 999 } as unknown as Command]),
    ),
  ).toThrow();
  const parsed = parseRequest({
    ...request([
      { type: "choose_adviser", adviser: "limen", produced: 999 } as Command,
    ]),
    minds: { limen: { loyalty: 0 } },
  });
  expect(parsed.commands).toEqual([
    { type: "choose_adviser", adviser: "limen" },
  ]);
});

test("HTTP boundary rejects oversized input and supports explicit recovery after a lost response", async () => {
  const call = (body: unknown) =>
    POST(
      new Request("http://localhost/api/loopforge/first-shift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  const first = await call(request());
  expect(first.status).toBe(200);
  expect(first.headers.get("cache-control")).toBe("no-store");
  const confirmed = await applyRecord(
    null,
    await first.json(),
    runId,
    async (v) => viewHash(v),
  );
  const commands: Command[] = [{ type: "choose_adviser", adviser: "limen" }];
  const lost = await call({
    ...request(commands),
    baseline: { tick: 0, step_hash: confirmed.hash },
  });
  expect(lost.status).toBe(200);
  const retry = await call({
    ...request(commands),
    baseline: { tick: 0, step_hash: confirmed.hash },
  });
  expect((await retry.json()).payload).toEqual((await lost.json()).payload);
  const mismatch = await call({
    ...request(commands),
    baseline: { tick: 0, step_hash: "0".repeat(64) },
  });
  expect(mismatch.status).toBe(409);
  const recovered = await applyRecord(
    null,
    await (await call(request(commands))).json(),
    runId,
    async (v) => viewHash(v),
  );
  expect(recovered.view.tick).toBe(1);
  expect(recovered.view.adviser).toBe("limen");
  expect(
    (await call({ ...request(), padding: "x".repeat(16001) })).status,
  ).toBe(400);
  expect((await call(request([{ type: "start_shift" }]))).status).toBe(400);
});

test("a viewer cannot accept a record for another run or skip a command", async () => {
  const first = respond(request());
  await expect(
    applyRecord(null, first, "different-run", async (v) => viewHash(v)),
  ).rejects.toThrow("incompatible_record");
  const receipt = await applyRecord(null, first, runId, async (v) =>
    viewHash(v),
  );
  const commands: Command[] = [
    { type: "choose_adviser", adviser: "limen" },
    {
      type: "approve_plan",
      assignments: { conveyor: "limen", security: "stiletto" },
    },
  ];
  const prior = project(replay(7, commands.slice(0, 1)));
  const skipped = respond({
    ...request(commands),
    baseline: { tick: prior.tick, step_hash: viewHash(prior) },
  });
  await expect(
    applyRecord(receipt, skipped, runId, async (v) => viewHash(v)),
  ).rejects.toThrow("out_of_order_record");
});

test.each([10, 24, 100])(
  "%i workers are individual entities throughout production and allocation",
  (count) => {
    const initial = initialState(7, count),
      world = initial.workers;
    expect(world.order).toHaveLength(count);
    expect(new Set(world.order).size).toBe(count);
    expect(world.order.every((id) => world.assignment[id].room === null)).toBe(
      true,
    );
    const { state, commands } = play("stiletto", false, 7, count);
    expect(replay(7, commands, count)).toEqual(state);
    const made = state.workers.order.filter(
      (id) => state.workers.identity[id].origin === "manufactured",
    );
    expect(made.length).toBeGreaterThan(0);
    const settled = step(state, {
      type: "commit_output",
      retain: Math.min(3, made.length),
    });
    expect(settled.workers.order).toEqual(state.workers.order);
    for (const id of world.order) {
      expect(settled.workers.identity[id]).toEqual(world.identity[id]);
      expect(settled.workers.body[id]).toBeDefined();
      expect(settled.workers.psychology[id]).toBeDefined();
      expect(
        settled.workers.history[id].some((m) => m.kind === "assigned"),
      ).toBe(true);
    }
    expect(
      made.every(
        (id) => settled.workers.conditioning[id].state === "unconditioned",
      ),
    ).toBe(true);
    expect(workforceTotals(settled.workers).retained).toBe(
      Math.min(3, made.length),
    );
  },
);

test("larger working crews produce more without changing the entity or system model", () => {
  const small = play("limen", false, 7, 10).state;
  const large = play("limen", false, 7, 100).state;
  expect(workforceTotals(large.workers).produced).toBeGreaterThan(
    workforceTotals(small.workers).produced,
  );
  expect(crew(large.workers, "conveyor")).toHaveLength(84);
  expect(crew(small.workers, "conveyor")).toHaveLength(9);
  const line = crew(large.workers, "conveyor")[0],
    gate = crew(large.workers, "security")[0];
  expect(large.workers.body[line].condition).toBeLessThan(
    large.workers.body[gate].condition,
  );
  expect(large.workers.psychology[line].stress).toBeGreaterThan(
    large.workers.psychology[gate].stress,
  );
});

test("the server admits a bounded 100-worker setup and derives its public counts", async () => {
  const { state, commands } = play("stiletto", false, 7, 100);
  const body = { ...request(commands), initial_workers: 100 };
  const snapshot = respond(body);
  const receipt = await applyRecord(null, snapshot, runId, async (v) =>
    viewHash(v),
  );
  expect(receipt.view).toEqual(project(state));
  expect(receipt.view.workers).toBe(100);
  expect(receipt.view.produced).toBeGreaterThan(24);
  const committed = respond({
    ...body,
    commands: [...commands, { type: "commit_output", retain: 30 }],
  });
  expect(
    (await applyRecord(null, committed, runId, async (v) => viewHash(v))).view
      .workers,
  ).toBe(130);
  for (const invalid of [0, 9, 100.5, 101])
    expect(() => respond({ ...request(), initial_workers: invalid })).toThrow(
      "invalid_request",
    );
});

test("accidents target a real worker, affect local witnesses and preserve history across assignment", () => {
  const casualtyRun = Array.from(
    { length: 12 },
    (_, i) => play("stiletto", false, i + 1, 100).state,
  ).find((s) => workforceTotals(s.workers).losses > 0)!;
  expect(casualtyRun).toBeDefined();
  const world = casualtyRun.workers;
  const victim = world.order.find(
    (id) => world.body[id].status === "destroyed",
  )!;
  expect(world.body[victim].condition).toBe(0);
  expect(world.history[victim].some((m) => m.kind === "injured")).toBe(true);
  const witnesses = world.order.filter((id) =>
    world.history[id].some((m) => m.kind === "witnessed_loss"),
  );
  expect(witnesses.length).toBeGreaterThan(0);
  expect(
    witnesses.every((id) => world.assignment[id].room === "conveyor"),
  ).toBe(true);
  expect(
    crew(world, "security").every(
      (id) => !world.history[id].some((m) => m.kind === "witnessed_loss"),
    ),
  ).toBe(true);
  const survivor = witnesses[0],
    memory = structuredClone(world.history[survivor]),
    stress = world.psychology[survivor].stress;
  assignCrew(world, 99, "later-plan");
  expect(world.history[survivor].slice(0, memory.length)).toEqual(memory);
  expect(world.psychology[survivor].stress).toBe(stress);
  expect(world.body[victim].status).toBe("destroyed");
});

test("golden first-day truth and player projection", () => {
  const summarize = (adviser: SupervisorId) => {
    const { state } = play(adviser);
    return {
      produced: workforceTotals(state.workers).produced,
      condition: state.condition,
      losses: workforceTotals(state.workers).losses,
      truth: createHash("sha256").update(canonical(state)).digest("hex"),
      player: viewHash(project(state)),
    };
  };
  expect({ limen: summarize("limen"), stiletto: summarize("stiletto") })
    .toMatchInlineSnapshot(`
{
  "limen": {
    "condition": 76,
    "losses": 0,
    "player": "c020ab89e69c1b445e9f077a09102ea0fc70bed4f2334d6086d3b9fd7e9fd7f7",
    "produced": 10,
    "truth": "13d9c06b26986bfc3621b1db03f10d190fad169e789e5a09ba8ef8c7303d04cd",
  },
  "stiletto": {
    "condition": 67,
    "losses": 0,
    "player": "e24a6630cd64e6a4f2511e586ed882761f01bd7031dcc06f822ad46210d57d62",
    "produced": 24,
    "truth": "e8db9685ddcb753acfa59405a8ccb527c1bbf13498124cc7549af2ada3d1b9f1",
  },
}
`);
});
