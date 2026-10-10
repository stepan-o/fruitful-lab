export const LEARNING_REWARDS = {
  orientation: 15,
  "city-lake": 20,
  "city-causeway": 20,
  "city-south": 20,
  "city-metro": 20,
  "city-cable": 20,
  "city-airport": 20,
  "nahuatl-atl": 10,
  "nahuatl-tepetl": 10,
  "nahuatl-xochitl": 10,
  "nahuatl-milli": 10,
  "nahuatl-ehecatl": 10,
  "nahuatl-xochimilco": 20,
  "nahuatl-xochitepec": 20,
} as const;
export type LearningId = keyof typeof LEARNING_REWARDS;
export type Learning = Partial<Record<LearningId, boolean>>;
export function learningPoints(learning: Learning = {}) {
  return (Object.keys(LEARNING_REWARDS) as LearningId[]).reduce(
    (sum, id) => sum + (learning[id] === true ? LEARNING_REWARDS[id] : 0),
    0,
  );
}
