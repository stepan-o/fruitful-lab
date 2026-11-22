// Drive the native executable and the checked-in WebAssembly through the same
// protocol. A third implementation (the actual viewer) rebuilds each state.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { createInterface } = require("node:readline");
require("../scripts/shifts/typescript.cjs");
const {
  read,
  fetchReplay,
  schema,
  subscription,
} = require("../lib/loopforge/engine/wire.ts");
const { envelope } = require("../lib/loopforge/intro/protocol.ts");
const run = "3e6acbfd-b4e1-4cef-acf3-6a04680d9e44";
async function main() {
  const root = __dirname,
    target = process.env.CARGO_TARGET_DIR || path.join(root, "target");
  const native = spawn(path.join(target, "release", "loopforge"), [], {
    stdio: ["pipe", "pipe", "inherit"],
  });
  const lines = createInterface({ input: native.stdout })[
    Symbol.asyncIterator
  ]();
  const bytes = fs.readFileSync(
    path.join(root, "../public/loopforge-engine/kernel.wasm"),
  );
  const { instance } = await WebAssembly.instantiate(bytes, {}),
    wasm = instance.exports;
  function browser(op, value) {
    const src = Buffer.from(JSON.stringify(value));
    const ptr = wasm.input(src.length);
    new Uint8Array(wasm.memory.buffer, ptr, src.length).set(src);
    const len = wasm.exchange(op);
    return JSON.parse(
      Buffer.from(wasm.memory.buffer, wasm.output(), len).toString("utf8"),
    );
  }
  let seq = 0,
    frame = null,
    frames = 0;
  const trace = {};
  async function both(op, value) {
    native.stdin.write(JSON.stringify({ op, value }) + "\n");
    const a = browser(op, value);
    const { value: line, done } = await lines.next();
    assert.ok(!done, "Native host exited");
    assert.deepEqual(JSON.parse(line), a);
    assert.equal(a.error, undefined);
    return a.value;
  }
  async function apply(result) {
    for (const e of result) {
      if (e.msg_type === "FRAME_DIFF" || e.msg_type === "FULL_SNAPSHOT") {
        frame = await read(frame, e);
        frames++;
        if (e.msg_type === "FULL_SNAPSHOT")
          await both(3, { tick: frame.tick, hash: frame.hash });
      }
    }
    return result;
  }
  const wire = async (k, p) => apply(await both(1, envelope(k, ++seq, p)));
  async function input(type, p) {
    const r = await wire("INPUT_COMMAND", {
      client_cmd_id: "case-" + seq,
      tick_target: frame.tick + 1,
      cmd: { type, payload: p },
    });
    assert.equal(r[0].msg_type, "COMMAND_ACCEPTED", JSON.stringify(r[0]));
  }
  const command = (p) => input("WORLD_NUDGE", p);
  const mark = (name) => {
    trace[name] = { tick: frame.tick, hash: frame.hash };
  };
  try {
    await both(0, { run });
    await wire("VIEWER_HELLO", {
      viewer_name: "parity",
      viewer_version: "1",
      supported_schema_versions: [schema],
      supports: { diff_stream: true, full_snapshot: true, replay_seek: true },
    });
    await wire("SUBSCRIBE", subscription);
    mark("join");
    await input("VIEW_CONTROL", { hint: "PLAY" });
    await apply(await both(2, 250));
    mark("first_steps");
    await command({ action: "skip" });
    mark("console");
    assert.equal(frame.state.world.day_one_count, 3);
    await command({ action: "answer" });
    await command({ action: "topic", target: "1" });
    await command({ action: "acknowledge" });
    mark("appointment");
    await command({
      action: "appoint",
      target: "LIMEN",
      room: "security",
      incident: "morning",
    });
    for (let i = 0; i < 30; i++) await apply(await both(2, 250));
    mark("walking");
    const last = frame.hash,
      tick = frame.tick;
    const pointer = (
      await wire("REPLAY_BEGIN", {
        run_id: run,
        start_tick: 0,
        end_tick: tick + 1,
        delivery: "ARTIFACTS",
      })
    )[0].payload;
    const replay = await fetchReplay(pointer, (url) => browser(4, url).value);
    assert.equal(replay.hash, last);
    const checkpoint = (
      await wire("REPLAY_SEEK", {
        tick: trace.console.tick,
        policy: "SNAPSHOT_THEN_DIFFS",
      })
    )[0].payload;
    assert.equal(
      (await fetchReplay(checkpoint, (url) => browser(4, url).value)).hash,
      trace.console.hash,
    );
    await assert.rejects(
      fetchReplay(checkpoint, (url) => browser(4, url).value + "!"),
    );
    const journal = await both(5, null);
    await both(0, { run, save: journal });
    await wire("VIEWER_HELLO", {
      viewer_name: "parity",
      viewer_version: "1",
      supported_schema_versions: [schema],
      supports: { diff_stream: true, full_snapshot: true },
    });
    await wire("SUBSCRIBE", subscription);
    assert.equal(frame.hash, trace.console.hash);
    mark("restored");
    const golden = path.join(root, "content/campaign-golden.json");
    if (process.argv.includes("--write-golden"))
      fs.writeFileSync(golden, JSON.stringify(trace, null, 2) + "\n");
    else assert.deepEqual(trace, JSON.parse(fs.readFileSync(golden)));
    console.log(
      frames +
        " verified frames; native/Wasm agreement, independent viewer hashes, artifact seek, corrupt artifact rejection and journal restore.",
    );
  } finally {
    native.stdin.end();
    native.kill();
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
