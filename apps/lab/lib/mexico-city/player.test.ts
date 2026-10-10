/** @jest-environment node */
import { playerOverview } from "./player";
import { demoState, demoCommand, personalPoints } from "./field-game";

test("progress and actions belong only to the active player", () => {
  const state = demoState();
  const summary = playerOverview(state);
  expect(summary.own.every((record) => record.owner === state.me.id)).toBe(
    true,
  );
  expect(summary.discoveryPoints + summary.learningPoints).toBe(
    personalPoints(state),
  );
  for (const action of summary.actions) {
    if (action.kind === "invitation")
      expect(action.challenge.target).toBe(state.me.id);
    if (action.kind === "review")
      expect(
        Object.entries(action.challenge.evidence).some(
          ([id, evidence]) =>
            id !== state.me.id && evidence.status === "submitted",
        ),
      ).toBe(true);
  }
});

test("a different discovery keeps an outing active; a matching photo completes it once", () => {
  let state = demoState();
  state.goal = "books";
  const record = {
    kind: "record" as const,
    title: "A place",
    place: "Roma",
    photo: "data:image/jpeg;base64,test",
    lat: 19.4,
    lng: -99.1,
  };
  state = demoCommand(state, { ...record, id: "other", category: "art" });
  expect(state.goal).toBe("books");
  state = demoCommand(state, { ...record, id: "matching", category: "books" });
  expect(state.goal).toBeNull();
  expect(playerOverview(state).completedOutings).toBe(1);
  const points = personalPoints(state);
  state = demoCommand(state, { ...record, id: "matching", category: "books" });
  expect(personalPoints(state)).toBe(points);
  expect(playerOverview(state).completedOutings).toBe(1);
});
