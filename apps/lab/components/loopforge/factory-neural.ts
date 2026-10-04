import { noise } from "./factory-drive";

/** One scene-wide discharge at a time; irregular onsets, no per-frame randomness. */
export function neuralDischarge(time: number, still = false) {
  const cycle = Math.floor(time / 8.4),
    onset = cycle * 8.4 + 0.8 + noise(cycle * 71 + 31) * 3.8;
  const age = time - onset,
    duration = 1.15;
  const strength =
    still || age < 0 || age >= duration
      ? 0
      : Math.min(1, age / 0.13) * Math.pow(1 - age / duration, 1.7);
  return { cycle, age, strength, choice: noise(cycle * 139 + 17) };
}

export function neuralPulse(
  time: number,
  seed: number,
  route: number,
  still = false,
) {
  if (still) return { light: 0.28, position: -1 };
  const period = 2.6 + noise(seed + route * 41) * 3,
    phase = (time / period + noise(seed + route * 109)) % 1;
  return {
    light: 0.22 + 0.48 * Math.pow(Math.sin(phase * Math.PI), 6),
    position: phase * 1.45 - 0.2,
  };
}
