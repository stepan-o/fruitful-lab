import {inspectRoute,rankRoutes,routeCandidates,routeLength} from "../lib/agentic-systems/search-yard";
it("makes the shortest proposal fail delivery while preserving the best clear routes",()=>{
 expect(rankRoutes(7,"distance")[0].candidate.id).toBe("G");
 expect(rankRoutes(7,"open")[0].candidate.id).toBe("E");
 expect(rankRoutes(7,"robust")[0].candidate.id).toBe("A");
 expect(inspectRoute(routeCandidates[6],false).clear).toBe(false);
 expect(inspectRoute(routeCandidates[4],false).clear).toBe(true);
 expect(inspectRoute(routeCandidates[4],true).clear).toBe(false);
});
it("checks cargo extent and stops at the first continuous intersection, before the rack centre",()=>{
 const trial=inspectRoute(routeCandidates[6],false);
 expect(trial.travelled.at(-1)).toEqual({x:2.1,y:3});
 expect(routeLength(trial.travelled)).toBeCloseTo(2.1);
 expect(trial.reason).toContain("rack");
});
it("never selects a collision under either gated evaluator at any proposal prefix",()=>{
 for(let n=1;n<=7;n++)for(const rule of ["open","robust"] as const){
  const winner=rankRoutes(n,rule)[0];expect(winner.eligible).toBe(true);expect(winner.open.clear).toBe(true);if(rule==="robust")expect(winner.closed.clear).toBe(true);
 }
});
