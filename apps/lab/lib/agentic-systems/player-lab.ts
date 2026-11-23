/** Authored teaching rules, not measured Loopforge balance. */
export type Fault = "jam" | "fatigue" | "clear";
export type DeskAction = "inspect" | "repair" | "pace" | "produce";
export type DeskState = { fault: Fault; turns: number; output: number; inspected: boolean; fixed: boolean; paced: boolean; log: string[]; last: DeskAction | null; sequence: number; effect: "idle" | "inspect" | "clear" | "pace" | "delivery" | "blocked" };
export function newDesk(fault: Fault): DeskState { return { fault, turns: 4, output: 0, inspected: false, fixed: false, paced: false, log: [], last: null, sequence: 0, effect: "idle" }; }
export function clue(s: DeskState) {
 return s.fault === "jam" && !s.fixed ? "A crate is wedged against the guide. The operator reaches the button on time." : s.fault === "fatigue" && !s.paced ? "The guide is clear. The operator reaches after the control window closes." : "The guide is clear and the operator reaches within the control window.";
}
export function actionCost(action: DeskAction) { return action === "repair" ? 2 : 1; }
export function act(s: DeskState, action: DeskAction): DeskState {
 const cost = actionCost(action);
 if (s.turns < cost) return s;
 let message = ""; let output = s.output;
 const next: DeskState = { ...s, turns: s.turns - cost, last: action, sequence: s.sequence + 1 };
 if (action === "inspect") { next.inspected = true; next.effect = "inspect"; message = clue(s); }
 if (action === "repair") { next.fixed = true; next.effect = "clear"; message = s.fault === "jam" && !s.fixed ? "You lift the wedged crate and reset the guide. Two turns used." : "You service the guide, finding no obstruction. Two turns used."; }
 if (action === "pace") { next.paced = true; next.effect = "pace"; message = "The control window is longer. Future successful runs yield one workpiece instead of two."; }
 if (action === "produce") {
  const ready = (s.fault !== "jam" || s.fixed) && (s.fault !== "fatigue" || s.paced);
  if (ready) { output += s.paced ? 1 : 2; next.effect = "delivery"; message = s.paced ? "One workpiece reaches the tray." : "Two workpieces reach the tray."; }
  else { next.turns = Math.max(0, s.turns - 2); next.effect = "blocked"; message = "The cycle stops with no delivery. Restarting consumes a second turn, if one remains. The closed-cycle warning does not identify the cause."; }
 }
 return { ...next, output, log: [...s.log, message] };
}
