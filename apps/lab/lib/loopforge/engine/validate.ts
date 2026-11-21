// The decoder defines the hash domain. A future optional field is ignored by
// this schema. A new enum variant or unknown patch operator needs negotiation.
type Decoder = (value: unknown) => unknown;
const invalid = (): never => {
  throw Error("Invalid campaign schema");
};
const string: Decoder = (x) => (typeof x === "string" ? x : invalid());
const int: Decoder = (x) => (Number.isSafeInteger(x) ? x : invalid());
const flag: Decoder = (x) => (typeof x === "boolean" ? x : invalid());
const anyOf =
  (...values: string[]): Decoder =>
  (x) =>
    values.includes(x as string) ? x : invalid();
const array =
  (check: Decoder): Decoder =>
  (x) =>
    Array.isArray(x) ? x.map(check) : invalid();
const nullable =
  (check: Decoder): Decoder =>
  (x) =>
    x === null ? x : check(x);
const strings = array(string),
  ints = array(int);
function object(
  required: Record<string, Decoder>,
  optional: Record<string, Decoder> = {},
): Decoder {
  return (input) => {
    if (!input || typeof input !== "object" || Array.isArray(input))
      return invalid();
    const record = input as Record<string, unknown>,
      out: Record<string, unknown> = {};
    for (const [k, check] of Object.entries(required))
      out[k] = check(record[k]);
    for (const [k, check] of Object.entries(optional))
      if (Object.hasOwn(record, k)) out[k] = check(record[k]);
    return out;
  };
}
const machine = object({
  name: anyOf("intake", "wash", "belt", "forge"),
  title: string,
  crew: strings,
  rate: int,
  cycleMs: nullable(int),
  carrier: string,
  hold: string,
  canClear: flag,
  caller: string,
});
const floor = object({
  stage: anyOf("briefing", "walk", "welcome", "work", "close"),
  start: int,
  lead: anyOf("", "LIMEN", "STILETTO"),
  bell: int,
  lesson: anyOf(
    "arrival",
    "walk",
    "gate",
    "pairs",
    "demonstration",
    "card",
    "visit",
    "two-cleared",
    "singles",
    "production",
    "return",
    "release",
    "live",
    "swapped",
  ),
  held: flag,
  posts: strings,
  crew: strings,
  manual: flag,
  closed: flag,
  dayCount: int,
  status: anyOf("none", "open", "pass", "detention"),
  deadline: int,
  waiting: strings,
  coverage: strings,
  ratings: object(
    Object.fromEntries(
      ["sam", "max", "bob", "jo", "kit", "mae", "lou", "ben", "ed", "gus"].map(
        (id) => [id, ints],
      ),
    ),
  ),
  needs: array(ints),
  bids: object({ LIMEN: string, STILETTO: string }),
  machines: array(machine),
  shot: anyOf("security", "conveyor"),
  shotSeq: int,
  opening: flag,
  stroke: int,
});
const world = object(
  {
    phase: anyOf("intro", "console", "call", "floor"),
    minute: int,
    layout: string,
    quota: int,
    topic: int,
    clock_tick: int,
    day_one_count: int,
    rack: strings,
    gate_mm: int,
    jammed: flag,
    outputs: int,
    edited_ms: int,
    confirmed: int,
    order: nullable(object({ station: string, text: string })),
  },
  { floor },
);
const actor = object({
  agent_id: string,
  x: int,
  y: int,
  room: string,
  facing: anyOf("N", "S", "E", "W"),
  moving: flag,
  walked: int,
  injured: flag,
  action: string,
  duty: string,
  station: int,
  available: flag,
  label: string,
});
const item = object(
  { item_id: string, x: int, y: int, holder: string, stage: int },
  { travel: flag },
);
const event = object(
  { event_id: string, tick: int, until: int, speaker: string, text: string },
  {
    seq: int,
    kind: string,
    actor: string,
    room: string,
    at: ints,
    audience: strings,
    subject: string,
    anchor: string,
  },
);
const channels = object({
  world,
  agents: array(actor),
  items: array(item),
  events: array(event),
});
import type { State } from "./wire";
export function decode(value: unknown): State {
  const state = channels(value) as State;
  if (state.world.phase === "floor" && !state.world.floor) invalid();
  if (
    state.agents.some(
      (a, i) => i && a.agent_id <= state.agents[i - 1].agent_id,
    ) ||
    state.items.some((a, i) => i && a.item_id <= state.items[i - 1].item_id)
  )
    invalid();
  if (
    state.events.some(
      (e, i) =>
        e.until <= e.tick ||
        (i > 0 &&
          (e.tick < state.events[i - 1].tick ||
            (e.tick === state.events[i - 1].tick &&
              e.event_id <= state.events[i - 1].event_id))),
    )
  )
    invalid();
  return state;
}
