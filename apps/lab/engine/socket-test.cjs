const { spawn } = require("node:child_process");
const { createInterface } = require("node:readline");
const assert = require("node:assert/strict");
const path = require("node:path");
require("../scripts/shifts/typescript.cjs");
const { envelope } = require("../lib/loopforge/intro/protocol.ts");
const {
  read,
  schema,
  subscription,
} = require("../lib/loopforge/engine/wire.ts");
(async () => {
  const bin = path.join(
    process.env.CARGO_TARGET_DIR || path.join(__dirname, "target"),
    "release/loopforge",
  );
  const native = spawn(bin, ["serve", "0"], {
    stdio: ["ignore", "pipe", "inherit"],
  });
  const timeout = setTimeout(() => {
    native.kill();
    process.exitCode = 1;
  }, 20000);
  try {
    const { value: address } = await createInterface({ input: native.stdout })
      [Symbol.asyncIterator]()
      .next();
    const socket = new WebSocket(address.split(" ")[0]);
    const queue = [],
      waiters = [];
    socket.onmessage = (e) => {
      const record = JSON.parse(e.data);
      if (waiters.length) waiters.shift()(record);
      else queue.push(record);
    };
    const receive = () =>
      queue.length
        ? Promise.resolve(queue.shift())
        : new Promise((r) => waiters.push(r));
    await new Promise((resolve, reject) => {
      socket.onopen = resolve;
      socket.onerror = reject;
    });
    let seq = 0;
    const send = (kind, p) =>
      socket.send(JSON.stringify(envelope(kind, ++seq, p)));
    send("VIEWER_HELLO", {
      viewer_name: "socket-test",
      viewer_version: "1",
      supported_schema_versions: [schema],
      supports: { diff_stream: true, full_snapshot: true, replay_seek: true },
    });
    const hello = await receive();
    assert.equal(hello.msg_type, "KERNEL_HELLO");
    send("SUBSCRIBE", subscription);
    assert.equal((await receive()).msg_type, "SUBSCRIBED");
    const frame = await read(null, await receive());
    send("INPUT_COMMAND", {
      client_cmd_id: "applied",
      tick_target: 1,
      cmd: {
        type: "VIEW_CONTROL",
        payload: {
          hint: "BASELINE_APPLIED",
          tick: frame.tick,
          step_hash: frame.hash,
        },
      },
    });
    assert.equal((await receive()).msg_type, "COMMAND_ACCEPTED");
    send("INPUT_COMMAND", {
      client_cmd_id: "socket-skip",
      tick_target: 1,
      cmd: { type: "WORLD_NUDGE", payload: { action: "skip" } },
    });
    assert.equal((await receive()).msg_type, "COMMAND_ACCEPTED");
    const next = await read(frame, await receive());
    assert.equal(next.state.world.phase, "console");
    send("REPLAY_BEGIN", {
      run_id: hello.payload.run_id,
      start_tick: 0,
      end_tick: 2,
      delivery: "ARTIFACTS",
    });
    const pointer = await receive();
    assert.equal(pointer.msg_type, "REPLAY_READY");
    const manifest = await fetch(pointer.payload.artifacts_manifest_url).then(
      (r) => r.json(),
    );
    assert.equal(manifest.step_hash, next.hash);
    socket.close();
    console.log(
      "Verified native WebSocket text frames, command receipt, delta chain and out-of-band HTTP replay.",
    );
  } finally {
    clearTimeout(timeout);
    native.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
