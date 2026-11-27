/** Edited seconds in the ordinary Day One story cut. Both the picture and its
 * room-specific score consume these same public camera transitions. */
export const storyRoomCuts = [
  [38.8, "Conveyor"], [76.6, "Security"], [95.3, "Conveyor"],
  [130.3, "Security"], [139.7, "Conveyor"],
] as const;

export function storyRoom(seconds: number) {
  return storyRoomCuts.findLast(([at]) => at <= seconds)?.[1] ?? "Security";
}
