export type BenchBuild = "sound" | "wire" | "count";
export type BenchTrial = { requested: number; received: number; output: number };
/** The deliberately faulty variants are teaching specimens, never production behavior. */
export function commitCrate(current: number, build: BenchBuild) { return current + (build === "count" ? 2 : 1); }
export function useBenchControl(build: BenchBuild): BenchTrial { return build === "wire" ? {requested:1,received:0,output:0} : {requested:1,received:1,output:commitCrate(0,build)}; }
export type Judge = "accept" | "inspect" | "reject";
export function judgeBatch(failures: number, judge: Judge) {
  const records = Array.from({length:20},(_,i)=>({id:i+1,good:i>=failures})).map(r=>({...r,accepted:judge==="accept" || (judge==="inspect" && r.good)}));
  return {records,agreement:records.filter(r=>r.good===r.accepted).length,caught:records.filter(r=>!r.good&&!r.accepted).length,missed:records.filter(r=>!r.good&&r.accepted).length,goodAccepted:records.filter(r=>r.good&&r.accepted).length,goodRejected:records.filter(r=>r.good&&!r.accepted).length};
}
