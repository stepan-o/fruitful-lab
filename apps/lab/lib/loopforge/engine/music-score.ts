import manifest from "../../../public/loopforge-design/music-audition/day-two/cues.json";
import { approachZone, type Room } from "../shifts/contract";
import type { Frame, State } from "./wire";

export type Tier = keyof typeof manifest.tracks.conveyor.layers;
export type Surface = "menu" | "options" | "day-one" | "day-one-line" | "departure" |
  "console" | "briefing" | Room | "results";
export type Cue = keyof typeof manifest.cues;
export type MusicView = {
  surface: Surface;
  tier: Tier;
  speech: boolean;
  production: "waiting" | "running" | "unknown";
  editedMs: number;
  bell: number;
};
const beats = manifest.arrangement.dayOneEditedSeconds;
const neutral = { tier: "two", speech: false, production: "unknown", editedMs: -1, bell: 0 } as const;
export function menuMusic(settings: boolean): MusicView {
  return { ...neutral, surface: settings ? "options" : "menu" };
}

export function visibleFloorSpeech(state: State, room: Room) {
  const { clock_tick: tick, floor } = state.world;
  return state.events.filter(e => e.kind === "speech.delivered" && e.tick <= tick && tick < e.until &&
    (e.room === room || (room === "security" && floor?.stage === "walk" && approachZone(e.room))));
}

export function campaignMusic(frame: Frame, room: Room): MusicView {
  const { world, agents, events } = frame.state;
  const f = world.floor;
  if (world.phase === "intro") {
    const ms = world.edited_ms;
    const at = (beat: keyof typeof beats) => ms >= beats[beat] * 1000;
    const crew = agents.filter(a => a.room === "conveyor" && a.agent_id === a.agent_id.toLowerCase()).length;
    const departed = at("End of shift");
    const line = at("The second brain") && crew >= 2 && !departed;
    // The gate volunteers stay in Security. The final setup and staffed run
    // share operators, so use the public edited beat as well as their staging.
    const tier = crew >= 4 && at("The crew fills in") ? (at("Run it") ? "full" : "four") : "two";
    return {
      ...neutral, surface: departed ? "departure" : line ? "day-one-line" : "day-one",
      editedMs: ms, tier,
      production: world.order || world.jammed ? "waiting" : line ? "running" : "unknown",
      speech: events.some(e => e.speaker !== "BELL" &&
        !(departed && !at("Outside") && e.speaker === "ed")),
    };
  }
  if (!f) return { ...neutral, surface: "console", speech: world.phase === "call" };
  if (f.closed) return { ...neutral, surface: "results", bell: f.bell > 0 && world.clock_tick >= f.bell ? f.bell : 0 };
  if (f.stage === "briefing") return { ...neutral, surface: "briefing", speech: true };

  const view = { ...neutral, surface: room, speech: visibleFloorSpeech(frame.state, room).length > 0 };
  if (room !== "conveyor") return view;
  const working = f.machines.filter(m => m.hold === "Working").length;
  const waiting = f.held || (working === 0 && f.machines.some(m => m.carrier &&
    (m.hold === "Waiting for clearance" || m.hold === "LIMEN inspecting" ||
     m.hold.startsWith("LIMEN calling ") || m.hold === "Needs worker")));
  return { ...view, tier: working >= 3 ? "full" : working === 2 ? "four" : "two",
    production: waiting ? "waiting" : working ? "running" : "unknown" };
}

export function transitionCue(before: MusicView | null, next: MusicView): Cue | undefined {
  if (!before) return undefined;
  const from = before.surface, to = next.surface;
  if (from !== to) {
    if (from === "menu" && to === "options") return "menu-options";
    if (from === "options" && to === "menu") return "options-menu";
    if (from === "security" && to === "conveyor") return "security-conveyor";
    if (from === "conveyor" && to === "security") return "conveyor-security";
    if (to === "results" && next.bell && (from === "security" || from === "conveyor")) return "bell-release";
    if (from === "briefing" && (to === "security" || to === "conveyor")) return "appointment";
    if (to === "departure" && before.editedMs >= 0) return "depart";
    if (to === "security" || to === "conveyor") return to === "security" ? "security-in" : "conveyor-in";
    if (to === "menu") return "menu-in";
  }
  if (next.editedMs >= 0 && before.editedMs >= 0) {
    for (const [name, cue] of [["At the gate", "gate"], ["The first brain", "floor"]] as const) {
      const threshold = beats[name] * 1000;
      if (before.editedMs < threshold && next.editedMs >= threshold) return cue;
    }
  }
  if (from === to && before.production === "waiting" && next.production === "running" && !next.speech)
    return "restart";
}

export { manifest };
