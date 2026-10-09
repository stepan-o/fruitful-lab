/** Player-facing readouts. Pure projection adapter: no kernel, clock or hidden state. */
import type { Event, PlayerView, RoomId, SupervisorId } from "./contract";

export type FeedbackId = `room:${RoomId}` | `person:${SupervisorId}` | "funds" | "workers" | "condition" | "quota" | "output";
export type FeedbackAction = "leadership" | "advisers" | "planning" | "incident" | "dispatch" | "debrief" | `room:${RoomId}` | `person:${SupervisorId}`;
export type Feedback = {
  id: FeedbackId;
  label: string;
  value: string;
  knowledge: "Confirmed" | "Observed" | "Statement";
  tone: "quiet" | "good" | "attention" | "loss";
  source: string;
  detail: string;
  context: string;
  events: Event[];
  action: { id: FeedbackAction; label: string } | null;
  revision: string;
};
const personName = (id: SupervisorId) => id === "limen" ? "LIMEN" : "STILETTO";
const roomName = (id: RoomId) => id === "conveyor" ? "Lattice Forge" : "Security";
const delta = (n: number) => `${n > 0 ? "+" : ""}${n}`;

/** Event IDs and content are already admitted by the server's knowledge allowlist. */
export function feedbackFor(view: PlayerView, id: FeedbackId, opening?: PlayerView | null): Feedback {
  const latest = (kind: Event["kind"], room?: RoomId) => view.events.findLast(e => e.kind === kind && (!room || e.room === room));
  const plan = latest("plan"), allocation = latest("allocation");
  const result: Feedback = {
    id, label: "Factory", value: "Awaiting orders", knowledge: "Confirmed", tone: "quiet",
    source: "Factory instruments", detail: "", context: "", events: [], action: null, revision: "",
  };
  if (id.startsWith("person:")) {
    const person = id.slice(7) as SupervisorId;
    const p = view.people.find(item => item.id === person)!;
    const room = p.room;
    const related = view.events.filter(e => e.kind === "resolution" || e.kind === "plan" || e.kind === "adviser").slice(-2);
    Object.assign(result, {
      label: personName(person), value: p.remark, knowledge: "Statement", source: `${personName(person)} · internal channel`,
      detail: p.remark,
      context: room ? `${roomName(room)} · ${person === view.adviser ? "today’s adviser; acts in this room without asking" : "your adviser recommends; you decide here"}.` : "No room assignment has been approved.",
      events: related,
      action: view.phase === "choose" ? { id: "advisers", label: "Choose today’s adviser" } : { id, label: `Open ${personName(person)}’s channel` },
    });
  } else if (id.startsWith("room:")) {
    const room = id.slice(5) as RoomId;
    const resolution = latest("resolution", room), observation = latest("incident", room), production = latest("production", room);
    const operator = view.assignments?.[room];
    const pending = view.pending?.room === room;
    const recentOrder = resolution && view.shiftTick - resolution.shiftTick < 5;
    Object.assign(result, {
      label: roomName(room), knowledge: room === "conveyor" && view.losses ? "Confirmed" : pending || (room === "conveyor" && view.condition < 75 && !recentOrder) ? "Observed" : "Confirmed", source: `${roomName(room)} · live room report`,
      value: pending ? "Response required" : room === "conveyor" && view.losses ? `${view.losses} worker lost` : !operator ? "Awaiting assignment" : view.phase === "ready" ? "Orders accepted" : recentOrder ? resolution.actor === "director" ? "Order recorded" : `${personName(resolution.actor as SupervisorId)} acted` : room === "conveyor" ? view.condition < 75 ? "Wear warning" : `${view.produced} completed` : resolution ? "Report filed" : "Gate ready",
      tone: pending ? "attention" : room === "conveyor" && view.losses ? "loss" : room === "conveyor" && view.condition < 75 ? "attention" : production ? "good" : "quiet",
      detail: pending ? view.pending!.observation : room === "conveyor" ? `${view.condition}% known line condition. ${view.produced} robots completed. ${view.losses ? `${view.losses} worker lost this shift.` : "No worker losses recorded."}` : resolution?.detail ?? "Security is available. No clearance incident has been recorded.",
      context: operator ? `${personName(operator)} is assigned. ${operator === view.adviser ? "You delegated this room to today’s adviser." : "Your adviser recommends responses here; you can override."}` : "Choose an adviser, then approve or change their proposed placements.",
      events: [resolution, observation, production, plan].filter((e): e is Event => Boolean(e)).slice(0, 3),
      action: pending ? { id: "incident", label: "Decide the response" } : !operator ? { id: view.phase === "briefing" ? "planning" : "advisers", label: view.phase === "briefing" ? "Review placements" : "Choose adviser" } : { id, label: "Open room camera" },
    });
  } else if (id === "condition") {
    const change = opening ? view.condition - opening.condition : null;
    Object.assign(result, {
      label: "Line condition", value: `${view.condition}%`, knowledge: "Observed", source: "Conveyor condition instrument",
      tone: view.condition < 75 ? "attention" : "quiet",
      detail: change === null ? "Known condition of the line." : `${opening!.condition}% at handover → ${view.condition}% now (${delta(change)} points).`,
      context: "Production wears the line. The chosen pace and load decisions affect wear; a quiet shift does not undo it.",
      events: [latest("resolution", "conveyor"), plan].filter((e): e is Event => Boolean(e)),
      action: { id: "room:conveyor", label: "Inspect the line" },
    });
  } else if (id === "workers") {
    Object.assign(result, {
      label: "Workforce", value: String(view.workers), source: "Workforce ledger", tone: view.losses ? "loss" : view.retained ? "good" : "quiet",
      detail: opening ? `${opening.workers} at handover · ${view.retained} retained · ${view.losses} lost → ${view.workers} in the factory.` : `${view.workers} in the factory. ${view.retained} retained; ${view.losses} lost this shift.`,
      context: view.phase === "complete" ? "Retained robots belong to the factory. This allocation is final." : `${view.produced} completed robots await end-of-shift allocation; they are not yet in the workforce.`,
      events: [allocation, ...(view.losses ? [latest("resolution", "conveyor")] : [])].filter((e): e is Event => Boolean(e)),
      action: view.phase === "allocation" ? { id: "dispatch", label: "Allocate today’s output" } : { id: "room:conveyor", label: "Inspect the line" },
    });
  } else if (id === "quota" || id === "output") {
    Object.assign(result, {
      label: id === "quota" ? "Weekly delivery" : "Today’s output",
      value: id === "quota" ? `${view.committed} / ${view.quota}` : `${view.produced} completed`,
      source: id === "quota" ? "Dispatch ledger" : "Outtake counter", tone: view.committed || view.produced ? "good" : "quiet",
      detail: view.phase === "complete" ? `${view.retained} retained + ${view.committed} dispatched = ${view.produced} produced. The split is final.` : `${view.produced} completed. None of today’s output counts toward delivery until you commit the split.`,
      context: `${view.quota} robots are due at the end of day seven. Retained robots cannot be reassigned to the quota later.`,
      events: [allocation, latest("production")].filter((e): e is Event => Boolean(e)),
      action: view.phase === "allocation" ? { id: "dispatch", label: "Allocate today’s output" } : view.phase === "complete" ? { id: "debrief", label: "Review the shift" } : id === "quota" ? { id: "leadership", label: "Read the weekly mandate" } : null,
    });
  } else {
    Object.assign(result, {
      label: "Available funds", value: `¤ ${view.cash}`, source: "Factory ledger",
      detail: opening ? `¤ ${opening.cash} at handover → ¤ ${view.cash} now.` : `¤ ${view.cash} available.`,
      context: "No spending order is available in this first-day slice. Development investment enters with later rooms.",
    });
  }
  // Stable through unrelated ticks; changes cue the actual readout, not a polling heartbeat.
  result.revision = JSON.stringify([result.value, result.detail, result.events.map(e => e.id)]);
  return result;
}
