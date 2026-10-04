/** Playback multipliers for the shared 2.4-second mechanical timebase.
 * Medium gives each specimen three real seconds, 25% longer than before.
 * These are display rates, not a statistical simulation or FDR estimates.
 */
export const conveyorPaces = {
  slow: { label: "Slow", rate: .55, hint: "More time to inspect each result." },
  medium: { label: "Medium", rate: .8, hint: "A measured cadence for reading results." },
  fast: { label: "Fast", rate: 1.1, hint: "More results arriving in less time." },
} as const;
export type ConveyorPaceName = keyof typeof conveyorPaces;
