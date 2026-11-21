import { envelope, validEnvelope, type Envelope } from "../intro/protocol";
import { schema, subscription, fetchReplay, read, type Frame } from "./wire";

type Exports = {
  input: (n: number) => number;
  output: () => number;
  exchange: (op: number) => number;
  memory: WebAssembly.Memory;
};
let wasm: Exports,
  frame: Frame | null = null,
  seq = 0,
  head = 0,
  run = "",
  queue = Promise.resolve(),
  timer: ReturnType<typeof setTimeout> | undefined;
let replay = false,
  joined = false,
  paused = true,
  rate = 1,
  suspended = false,
  last = 0,
  saved = 0;
const encoder = new TextEncoder(),
  decoder = new TextDecoder("utf-8", { fatal: true });
function host(op: number, v: unknown) {
  const b = encoder.encode(JSON.stringify(v)),
    ptr = wasm.input(b.length);
  new Uint8Array(wasm.memory.buffer, ptr, b.length).set(b);
  const size = wasm.exchange(op);
  const result = JSON.parse(
    decoder.decode(new Uint8Array(wasm.memory.buffer, wasm.output(), size)),
  );
  if (result.error) throw Error(result.error);
  return result.value;
}
class Rejected extends Error {}
function schedule(task: () => Promise<void>) {
  queue = queue.then(task).catch((e) => {
    if (e instanceof Rejected) {
      postMessage({ type: "notice", message: e.message });
      return;
    }
    paused = true;
    clearTimeout(timer);
    postMessage({ type: "error", message: String(e.message || e) });
  });
}
function save() {
  postMessage({ type: "save", journal: host(5, null) });
  saved = performance.now();
}
function show() {
  if (frame) postMessage({ type: "view", frame, paused, rate });
}
async function wire(type: string, p: object) {
  await consume(host(1, envelope(type, ++seq, p)));
}
async function consume(records: Envelope[]) {
  for (const e of records) {
    if (!validEnvelope(e)) throw Error("Invalid kernel envelope");
    const p = e.payload;
    switch (e.msg_type) {
      case "KERNEL_HELLO":
        if (
          p.engine_name !== "loopforge_rust" ||
          p.schema_version !== schema ||
          p.run_id !== run
        )
          throw Error("Incompatible kernel");
        await wire("SUBSCRIBE", subscription);
        break;
      case "SUBSCRIBED":
        joined = true;
        replay = false;
        break;
      case "FULL_SNAPSHOT":
      case "FRAME_DIFF":
        if (!joined || replay) throw Error("Unexpected live state");
        try {
          frame = await read(frame, e);
        } catch (error) {
          if (e.msg_type === "FULL_SNAPSHOT") throw error;
          await wire("DESYNC_REPORT", {
            tick: frame?.tick ?? 0,
            issue: "EXTERNAL_HASH_MISMATCH",
          });
          return;
        }
        head = Math.max(head, frame.tick);
        if (e.msg_type === "FULL_SNAPSHOT")
          host(3, { tick: frame.tick, hash: frame.hash });
        break;
      case "REPLAY_READY":
      case "DESYNC_CONFIRMED":
        if (p.artifacts_manifest_url) {
          frame = await fetchReplay(p, (url) => host(4, url));
          replay = true;
          joined = false;
        } else frame = null;
        break;
      case "COMMAND_ACCEPTED":
        break;
      case "COMMAND_REJECTED":
        throw new Rejected(String(p.reason));
      default:
        throw Error(String(p.message || e.msg_type));
    }
  }
}
async function input(kind: string, payload: object) {
  await wire("INPUT_COMMAND", {
    client_cmd_id: crypto.randomUUID(),
    tick_target: (frame?.tick ?? 0) + 1,
    cmd: { type: kind, payload },
  });
}
async function live() {
  if (replay) await wire("SUBSCRIBE", subscription);
}
async function control(hint: string, extra = {}) {
  await live();
  await input("VIEW_CONTROL", { hint, ...extra });
}
function clock() {
  clearTimeout(timer);
  if (paused || suspended || replay) return;
  timer = setTimeout(
    () =>
      schedule(async () => {
        const now = performance.now(),
          elapsed = Math.max(0, Math.floor(now - last));
        last = now;
        const before = frame?.tick;
        await consume(host(2, elapsed));
        if (before !== frame?.tick) show();
        if (now - saved > 1500) save();
        clock();
      }),
    25,
  );
}
async function play() {
  await control("PLAY");
  paused = false;
  last = performance.now();
  clock();
}
async function pause() {
  await control("PAUSE");
  paused = true;
  clearTimeout(timer);
}
async function seek(seconds: number) {
  await pause();
  let target = Math.max(0, frame!.tick + Math.round(seconds * 20));
  if (target > head) {
    await control("RATE", { rate_milli: 1000 });
    await control("PLAY");
    while (frame!.tick < target) {
      const prior = frame!.tick;
      await consume(host(2, Math.min(250, (target - prior) * 50)));
      if (frame!.tick === prior) break;
    }
    await control("PAUSE");
    await control("RATE", { rate_milli: rate * 1000 });
    target = frame!.tick;
  }
  await wire("REPLAY_BEGIN", {
    run_id: run,
    start_tick: 0,
    end_tick: head + 1,
    delivery: "ARTIFACTS",
  });
  await wire("REPLAY_SEEK", { tick: target, policy: "SNAPSHOT_THEN_DIFFS" });
  save();
  show();
}
self.onmessage = ({ data: m }) =>
  schedule(async () => {
    switch (m.type) {
      case "boot": {
        const res = await fetch("/loopforge-engine/kernel.wasm");
        if (!res.ok) throw Error("Rust kernel unavailable");
        wasm = (await WebAssembly.instantiate(await res.arrayBuffer(), {}))
          .instance.exports as unknown as Exports;
        run = m.run;
        host(0, { run, save: m.save, legacy: m.legacy });
        head = m.save?.head ?? 0;
        await wire("VIEWER_HELLO", {
          viewer_name: "loopforge-game",
          viewer_version: "1.0.0",
          supported_schema_versions: [schema],
          supports: {
            diff_stream: true,
            full_snapshot: true,
            replay_seek: true,
          },
        });
        show();
        if (m.legacy) save();
        break;
      }
      case "intent": {
        if (replay) await live();
        await input("WORLD_NUDGE", m.intent);
        head = frame!.tick;
        show();
        save();
        break;
      }
      case "play":
        await play();
        show();
        break;
      case "pause":
        await pause();
        show();
        save();
        break;
      case "rate":
        await control("RATE", { rate_milli: m.rate * 1000 });
        rate = m.rate;
        show();
        break;
      case "seek":
        await seek(m.seconds);
        break;
      case "visibility":
        suspended = m.hidden;
        last = performance.now();
        clock();
        if (suspended) save();
        break;
    }
  });
