/** Playback multipliers for the shared 2.4-second mechanical timebase.
 * Medium uses the former Fast rate (~2.18 seconds per test); Fast takes 0.8s.
 * These are display rates, not a statistical simulation or FDR estimates.
 */
export const conveyorPaces = {
  slow: { label: "Slow", rate: .55, hint: "More time to inspect each result." },
  medium: { label: "Medium", rate: 1.1, hint: "A measured cadence for reading results." },
  fast: { label: "Fast", rate: 3, hint: "More results arriving in less time." },
} as const;
export type ConveyorPaceName = keyof typeof conveyorPaces;
