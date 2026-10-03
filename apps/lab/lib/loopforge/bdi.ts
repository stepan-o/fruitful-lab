import {
  MAX_SHIFTS,
  QUOTA,
  type State,
  type Supervisor,
  type Doctrine,
} from "./engine";
export type Beliefs = Readonly<{
  observedShift: number;
  strain: number;
  remainingOrder: number;
  shiftsLeft: number;
}>;
export type Intention = Readonly<{
  agent: Supervisor;
  basedOnShift: number;
  expiresAfterShift: number;
  goal: "recover" | "deliver" | "stabilize";
  doctrine: Doctrine;
  scores: Readonly<{ recover: number; deliver: number; stabilize: number }>;
  beliefs: Beliefs;
}>;
/** Small deterministic BDI teaching policy. It advises; only the director issues commands. */
export function deliberate(state: State, agent: Supervisor): Intention {
  const beliefs = {
    observedShift: state.shift,
    strain: state.strain,
    remainingOrder: Math.max(0, QUOTA - state.total),
    shiftsLeft: MAX_SHIFTS - state.shift,
  };
  const careBias =
    agent === "witch" ? 18 : agent === "thrum" ? 12 : agent === "limen" ? 8 : 0;
  const outputBias = agent === "stiletto" ? 18 : agent === "cathexis" ? 7 : 0;
  const scores = {
    recover: state.strain * 2 + careBias,
    deliver:
      Math.ceil(beliefs.remainingOrder / Math.max(1, beliefs.shiftsLeft)) +
      outputBias,
    stabilize: 38,
  };
  const goal =
    scores.recover >= scores.deliver && scores.recover >= scores.stabilize
      ? "recover"
      : scores.deliver > scores.stabilize
        ? "deliver"
        : "stabilize";
  return {
    agent,
    basedOnShift: state.shift,
    expiresAfterShift: state.shift,
    goal,
    doctrine:
      goal === "recover"
        ? "care"
        : goal === "deliver"
          ? "pressure"
          : "balanced",
    scores,
    beliefs,
  };
}
export function intentionIsCurrent(state: State, intention: Intention) {
  return (
    state.phase === "planning" &&
    state.shift === intention.basedOnShift &&
    state.shift <= intention.expiresAfterShift
  );
}
