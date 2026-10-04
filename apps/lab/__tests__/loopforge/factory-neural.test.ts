import {
  neuralDischarge,
  neuralPulse,
} from "@/components/loopforge/factory-neural";
import { cargoFor } from "@/components/loopforge/factory-drive";

describe("decorative neural activity", () => {
  it("spaces irregular discharges apart and bounds their duration over a long session", () => {
    const starts: number[] = [],
      durations: number[] = [];
    let wasActive = false,
      start = 0;
    for (let t = 0; t < 900; t += 0.025) {
      const event = neuralDischarge(t),
        active = event.strength > 0;
      expect(event.strength).toBeGreaterThanOrEqual(0);
      expect(event.strength).toBeLessThanOrEqual(1);
      if (active && !wasActive) {
        starts.push(t);
        start = t;
      }
      if (!active && wasActive) durations.push(t - start);
      wasActive = active;
    }
    expect(starts.length).toBeGreaterThan(80);
    const gaps = starts.slice(1).map((t, i) => t - starts[i]);
    expect(Math.min(...gaps)).toBeGreaterThan(4.5);
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeGreaterThan(1);
    expect(Math.max(...durations)).toBeLessThan(1.2);
  });

  it("retains a lit still image with no moving packets or discharges", () => {
    for (const t of [0, 2, 8, 14, 71, 271]) {
      expect(neuralDischarge(t, true).strength).toBe(0);
      expect(neuralPulse(t, 47, 0, true)).toEqual({
        light: 0.28,
        position: -1,
      });
    }
  });

  it("keeps independent specimen pulses deterministic across replay", () => {
    const pulses = new Set<number>();
    for (let i = 0; i < 12; i++) {
      const q = cargoFor(i);
      expect(neuralPulse(13, q.seed, 0)).toEqual(neuralPulse(13, q.seed, 0));
      pulses.add(neuralPulse(13, q.seed, 0).position);
    }
    expect(pulses.size).toBe(12);
  });
});
