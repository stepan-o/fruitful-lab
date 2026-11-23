import {initialWorld,transition,actors,walls,same,type Command,type ActorId,type MiniWorld} from "@/lib/agentic-systems/mini-world";
const run=(commands:Command[],start=initialWorld(),actor:ActorId="bob")=>commands.reduce((s,command)=>transition(s,{id:"intent-"+s.seen.length,actor,command}),start);
const atPress=()=>run(["right","right","right","claim"]);
describe("smallest world authority",()=>{
 it("requires custody, presence and reservation before output and again during execution",()=>{
  let s=atPress();s=run(["start","tick"],s);expect(s.made.bob).toBe(0);
  s=run(["up","tick"],s);expect(s.active).toBeNull();expect(s.made.bob).toBe(0);
  expect(s.receipts.at(-1)?.text).toContain("interrupted");
 });
 it("does not duplicate output when a delivered intent is retried",()=>{
  const before=run(["start","tick"],atPress());const intent={id:"commit",actor:"bob" as const,command:"tick" as const};
  const done=transition(before,intent);expect(done.made.bob).toBe(1);expect(transition(done,intent)).toBe(done);
  expect(before.made.bob).toBe(0);expect(before.active?.remaining).toBe(1);
 });
 it("keeps custody singular and rejects unauthorized or distant transfer",()=>{
  let s=initialWorld();s=transition(s,{id:"steal",actor:"ed",command:"give"});expect(s.card).toBe("bob");
  s=run(["right","give"],s);expect(s.card).toBe("bob");
  s=run(["left","give"],s);expect(s.card).toBe("ed");
 });
 it("requires an explicit station handover and supports both operators finishing",()=>{
  let s=run(["start","tick","tick","up"],atPress());
  s=run(["right","up","right","right"],s,"ed");
  s=run(["give"],s);expect(s.card).toBe("ed");
  s=run(["claim"],s,"ed");expect(s.reserved).toBe("bob");expect(s.receipts.at(-1)?.accepted).toBe(false);
  s=run(["release"],s);s=run(["claim","start","tick","tick"],s,"ed");
  expect(s.made).toEqual({bob:1,ed:1});
 });
 it("rechecks custody after the cycle has started",()=>{
  let s=atPress();s=run(["up"],s,"ed");
  s=run(["right","right"],s,"ed"); // (2,1), adjacent to control
  s=run(["start","give","tick"],s);expect(s.card).toBe("ed");expect(s.made.bob).toBe(0);expect(s.active).toBeNull();
 });
 it("preserves occupancy, walls, single ownership and bounded output under adversarial commands",()=>{
  const commands:Command[]=["left","right","up","down","claim","release","give","start","tick","cancel"];
  let s:MiniWorld=initialWorld(),seed=804;
  for(let i=0;i<2000;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const actor=actors[(seed>>>16)%2];seed=(Math.imul(seed,1664525)+1013904223)>>>0;s=transition(s,{id:"random-"+i,actor,command:commands[seed%commands.length]});
   expect(same(s.positions.bob,s.positions.ed)).toBe(false);
   for(const p of Object.values(s.positions)){expect(walls.some(w=>same(w,p))).toBe(false);expect(p[0]).toBeGreaterThanOrEqual(0);expect(p[0]).toBeLessThanOrEqual(4);expect(p[1]).toBeGreaterThanOrEqual(0);expect(p[1]).toBeLessThanOrEqual(2);}
   expect(actors).toContain(s.card);expect(s.reserved===null||actors.includes(s.reserved)).toBe(true);
   expect(s.made.bob).toBeLessThanOrEqual(1);expect(s.made.ed).toBeLessThanOrEqual(1);
  }
 });
});
