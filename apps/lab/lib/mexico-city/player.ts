import {
  GOALS,
  type Challenge,
  type Group,
  type FieldState,
} from "./field-game";
import { learningPoints } from "./rewards";

/** Derived only from this authenticated player's server snapshot (or explicit demo). */
type PlayerAction = {
  group: Group;
  challenge: Challenge;
  kind: "invitation" | "review" | "outing";
};

export function playerOverview(state: FieldState) {
  const own = state.records.filter((record) => record.owner === state.me.id);
  const actions = state.groups.flatMap((group) =>
    group.challenges.flatMap<PlayerAction>((challenge) => {
      const me = state.me.id;
      if (challenge.target === me && challenge.status === "offered")
        return [{ group, challenge, kind: "invitation" as const }];
      if (
        ["submitted", "clarification"].includes(challenge.status) &&
        (challenge.sender === me ||
          (challenge.together && challenge.target === me)) &&
        Object.entries(challenge.evidence).some(
          ([id, evidence]) => id !== me && evidence.status === "submitted",
        )
      )
        return [{ group, challenge, kind: "review" as const }];
      if (
        ["active", "clarification", "submitted"].includes(challenge.status) &&
        (challenge.target === me ||
          (challenge.together && challenge.sender === me)) &&
        (!challenge.evidence[me] ||
          challenge.evidence[me].status === "clarification")
      )
        return [{ group, challenge, kind: "outing" as const }];
      return [];
    }),
  );
  const counts = new Map<string, number>();
  own.forEach((record) =>
    counts.set(record.category, (counts.get(record.category) || 0) + 1),
  );
  const suggestion = [...GOALS].sort(
    (a, b) => (counts.get(a.category) || 0) - (counts.get(b.category) || 0),
  )[0];
  return {
    own,
    actions,
    suggestion,
    discoveryPoints: own.length * 30,
    learningPoints: learningPoints(state.learning),
    completedOutings: own.filter((record) => record.goalId).length,
    published: own.filter((record) => record.publication === "approved").length,
  };
}
