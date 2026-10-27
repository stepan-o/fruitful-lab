import {workshop} from "../lib/agentic-systems/workshop";
describe("authored dependency comparison",()=>{
 it("only parallelizes jobs that have no predecessor",()=>{
  expect(workshop("independent",1,0).total).toBe(10);
  expect(workshop("independent",3,0).total).toBe(4);
  expect(workshop("coupled",1,0).total).toBe(9);
  expect(workshop("coupled",3,0).total).toBe(11);
  expect(workshop("coupled",3,0,0).total).toBe(9);
  for(const staffing of [1,3] as const)for(let beat=0;beat<12;beat++){
   const state=workshop("coupled",staffing,beat);
   expect(state.jobs.filter(job=>job.status==="working").length).toBeLessThanOrEqual(1);
   state.jobs.forEach((job,i)=>{if(i&&job.progress>0)expect(state.jobs[i-1].status).toBe("done");});
  }
 });
 it("withholds a combined brief until synthesis is complete",()=>{
  const before=workshop("independent",3,3),after=workshop("independent",3,4);
  expect(before.jobs.every(job=>job.status==="done")).toBe(true);
  expect(before.phase).toBe("synthesis");
  expect(before.output).toBe("Not delivered");
  expect(after.output).toBe("One combined brief");
 });
});
