import type { PlayerView, SupervisorId } from "./contract";
import type { State } from "./kernel";
import { workforceTotals } from "./workers";
function remark(s: State, id: SupervisorId): string {
  const { losses } = workforceTotals(s.workers);
  if (!s.adviser)
    return id === "limen"
      ? "I have a procedure for meeting the quota. It does not require maximum speed."
      : "Give me the line. Let’s make the quota look small.";
  const lastResponse = s.minds[id].memories.at(-1) ?? "";
  if (losses && s.phase !== "complete" && s.phase !== "allocation")
    return id === "limen"
      ? "A worker is out of service. That belongs in the report."
      : "I saw the worker go down. Give me a moment.";
  if (lastResponse.startsWith("belt-vibration:") && !losses) {
    const eased = lastResponse.includes(":slow:");
    if (lastResponse.endsWith(":overridden") && s.adviser === id)
      return id === "limen"
        ? "I asked you to ease the load. That was your decision."
        : "You asked for output. Then you cut the load.";
    return id === "limen"
      ? eased ? "Three beats withheld. The line can wait." : "The batch cleared. That does not make the load safe."
      : eased ? "Three beats gone. We still have a quota." : "It held. That’s why I kept it moving.";
  }
  if (!losses && lastResponse.startsWith("clearance-mismatch:")) {
    const held = lastResponse.includes(":hold:");
    if (lastResponse.endsWith(":overridden") && s.adviser === id)
      return id === "limen"
        ? "You asked for procedure. At the gate, you chose an exception."
        : "You wanted my judgment. Then we stopped the line for two badges.";
    return id === "limen"
      ? held
        ? "The records are now in order. That is work, too."
        : "That clearance exception now carries your authority."
      : held
        ? "Three beats for a badge. I hope it was worth it."
        : "The crew got through. The line kept moving. Good.";
  }
  if (s.phase === "complete" || s.phase === "allocation") {
    if (losses)
      return id === "limen"
        ? "The output is in the ledger. So is the worker we lost."
        : "I saw what it cost. Don’t pretend I didn’t.";
    if (s.assignments?.conveyor === id)
      return id === "limen"
        ? "The procedure held. I recommend continuing it."
        : "That bought us room to move. I know where to use it.";
    return id === "limen"
      ? "A successful shift does not make every exception safe."
      : "Nobody broke. Good. Tomorrow, let’s do something with that.";
  }
  if (
    s.adviser === id &&
    s.minds[id].memories.includes("opening-plan-overridden")
  )
    return id === "limen"
      ? "I will follow the arrangement. My objection remains on record."
      : "You asked for my judgment. Interesting use of it.";
  return id === "limen"
    ? "The procedure is in effect."
    : "We’re here to make something. Let’s move.";
}
/** Allowlist projection. Private histories, BDI traces and trait values stay server-side. */
export function project(s: State): PlayerView {
  const totals = workforceTotals(s.workers);
  return {
    tick: s.tick,
    shiftTick: s.shiftTick,
    phase: s.phase,
    day: 1,
    cash: s.cash,
    workers: totals.workers,
    condition: s.condition,
    produced: totals.produced,
    quota: 60,
    committed: totals.committed,
    retained: totals.retained,
    losses: totals.losses,
    adviser: s.adviser,
    assignments: s.assignments ? { ...s.assignments } : null,
    briefing: s.briefing ? JSON.parse(JSON.stringify(s.briefing)) : null,
    pending: s.pending ? JSON.parse(JSON.stringify(s.pending)) : null,
    people: (["limen", "stiletto"] as const).map((id) => ({
      id,
      room:
        s.assignments?.conveyor === id
          ? "conveyor"
          : s.assignments?.security === id
            ? "security"
            : null,
      remark: remark(s, id),
    })),
    events: s.events.map((e) => ({
      ...e,
      cause:
        e.kind === "incident"
          ? "Observed by the room crew and entered in the director’s live record."
          : e.cause,
    })),
  };
}
