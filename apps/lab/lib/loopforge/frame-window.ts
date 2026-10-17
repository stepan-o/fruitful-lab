/** Wall-clock intervals between presented scene draws, not GPU execution time. */
export type FrameMode = 'active' | 'idle' | 'loading';
export function createFrameWindow(capacity = 300) {
  let mode: FrameMode = 'loading';
  let previous: number | null = null;
  const intervals: number[] = [];
  function reset() { previous = null; intervals.length = 0; }
  return {
    reset,
    frame(now: number, next: FrameMode) {
      if (next !== mode) { reset(); mode = next; }
      if (mode !== 'active') { reset(); return; }
      // Long stalls are important evidence. Never discard them as outliers.
      if (previous !== null && now > previous) {
        intervals.push(now - previous);
        if (intervals.length > capacity) intervals.shift();
      }
      previous = now;
    },
    snapshot() {
      const sorted = [...intervals].sort((a, b) => a - b);
      const percentile = (p: number) => sorted.length ? Math.round(sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)]) : undefined;
      const total = intervals.reduce((sum, value) => sum + value, 0);
      return { sampleMode: mode, sampleCount: intervals.length,
        fps: total ? Math.round(1000 * intervals.length / total) : 0,
        p50: percentile(.5), p95: percentile(.95), p99: percentile(.99) };
    },
  };
}
