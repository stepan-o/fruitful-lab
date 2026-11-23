import {act,newDesk,type DeskAction,type Fault} from "@/lib/agentic-systems/player-lab";
const run=(fault:Fault,actions:DeskAction[])=>actions.reduce(act,newDesk(fault));
describe("operator desk decisions",()=>{
 it("offers a real trade between inspecting and experimenting",()=>{
  expect(run("jam",["inspect","repair","produce"]).output).toBe(2);
  expect(run("jam",["produce","repair","produce"]).output).toBe(0);
  expect(run("fatigue",["inspect","pace","produce","produce"]).output).toBe(2);
  expect(run("fatigue",["produce","pace","produce"]).output).toBe(1);
  expect(run("clear",["inspect","produce","produce","produce"]).output).toBe(6);
  expect(run("clear",["produce","produce","produce","produce"]).output).toBe(8);
 });
 it("does not reveal the hidden fault through a covered failed run",()=>{
  const a=act(newDesk("jam"),"produce"), b=act(newDesk("fatigue"),"produce");
  expect(a.log).toEqual(b.log);expect(a.turns).toBe(2);expect(b.inspected).toBe(false);
 });
 it("does not make blind servicing a free substitute for information",()=>{
  expect(run("jam",["repair","produce","produce"]).output).toBe(4);
  expect(run("fatigue",["repair","pace","produce"]).output).toBe(1);
  expect(run("clear",["repair","produce","produce"]).output).toBe(4);
 });
 it("requires different interventions and preserves earlier states",()=>{
  expect(run("jam",["pace","produce","produce"]).output).toBe(0);
  expect(run("fatigue",["repair","produce"]).output).toBe(0);
  const start=newDesk("jam"), inspected=act(start,"inspect");
  expect(start.inspected).toBe(false);expect(start.log).toEqual([]);
  expect(inspected.inspected).toBe(true);
 });
 it("rejects unaffordable actions and never allows negative time or post-shift output",()=>{
  const one=run("jam",["inspect","produce"]);
  expect(one.turns).toBe(1);expect(act(one,"repair")).toBe(one);
  const end=act(one,"produce");expect(end.turns).toBe(0);expect(act(end,"produce")).toBe(end);
  expect(newDesk("clear")).toMatchObject({turns:4,output:0,inspected:false,fixed:false,paced:false,log:[]});
 });
});
