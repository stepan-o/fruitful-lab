export type WorkshopKind = "independent" | "coupled";
export type Staffing = 1 | 3;
export function workshop(kind: WorkshopKind, workers: Staffing, requestedBeat: number, handover: 0 | 1 = 1) {
  const starts = kind === "independent"
    ? (workers === 3 ? [0, 0, 0] : [0, 3, 6])
    : (workers === 3 ? [0, 3 + handover, 6 + 2 * handover] : [0, 3, 6]);
  const workEnd = Math.max(...starts) + 3;
  const total = workEnd + (kind === "independent" ? 1 : 0);
  const beat = Math.max(0, Math.min(total, requestedBeat));
  const jobs = starts.map((start, i) => ({
    worker: workers === 1 ? 1 : i + 1,
    progress: Math.max(0, Math.min(3, beat - start)),
    status: beat < start ? "waiting" : beat >= start + 3 ? "done" : "working",
  }));
  const phase = beat === total ? "complete"
    : kind === "independent" && beat === workEnd ? "synthesis"
    : kind === "coupled" && workers === 3 && handover === 1 && (beat === 3 || beat === 7) ? "handover"
    : "work";
  return { beat, total, jobs, phase, output: beat === total ? (kind === "independent" ? "One combined brief" : "One fitted assembly") : "Not delivered" };
}
