import {resourceWindows,resourceShare} from "../lib/agentic-systems/resource-ledger";
describe("frozen studio accounts",()=>{
 it("defaults to the later correction window without adding its enclosing day",()=>{
  expect(resourceWindows[0].id).toBe("focused");
  expect(resourceWindows[0].total.combined).toBe(217434674);
  expect(resourceWindows[1].total.combined).toBe(342861755);
  expect(resourceWindows[0].total.count).toBe(1465);
  expect(resourceWindows[1].total.combined).toBeGreaterThan(resourceWindows[0].total.combined);
 });
 it("partitions tokens without double-counting cache or reasoning",()=>{
  const total=resourceWindows[0].total;
  expect([total.cache_read,total.input,total.output]).toEqual([211424128,4874045,1136501]);
  for(const window of resourceWindows)for(const row of [...window.rows,window.total])expect(row.input+row.cache_read+row.output).toBe(row.combined);
 });
 it("keeps the busy roles and zero-use accounts interpretable",()=>{
  const rows=resourceWindows[0].rows;
  expect(rows.find(r=>r.role==="Producer")?.median).toBe(151978);
  expect(rows.find(r=>r.role==="Engine Master")?.combined).toBe(94045662);
  expect(rows.find(r=>r.role==="Animator")?.count).toBe(300);
  expect(resourceShare(0,0)).toBe(0);
  expect(resourceShare(25,100)).toBe(25);
 });
});
