import {custodyAt,hearingResult,receiveClaim} from "../lib/agentic-systems/knowledge-room";
it("keeps an unobserved transfer out of Bob's record while preserving the world's custody",()=>{
 const hidden=custodyAt(2,false),witnessed=custodyAt(2,true);
 expect(hidden.holder).toBe("ed");expect(hidden.beliefs.bob).toMatchObject({value:"bob",beat:0,mode:"observed"});
 expect(hidden.beliefs.ed).toMatchObject({value:"ed",beat:2});expect(witnessed.beliefs.bob).toMatchObject({value:"ed",beat:2});
});
it("cannot turn a received false report into physical truth or change a previous snapshot",()=>{
 const prior=custodyAt(2,false),next=receiveClaim(prior,"floor",{far:false,portal:false,channel:"local"},3);
 expect(next.holder).toBe("ed");expect(next.beliefs.bob).toMatchObject({value:"floor",mode:"reported",source:"Ed's statement",beat:3});
 expect(prior.beliefs.bob.value).toBe("bob");expect(next.beliefs.ed).toEqual(prior.beliefs.ed);
});
it("requires both reach and an audible route for the cross-room report",()=>{
 const prior=custodyAt(2,false);
 for(const setup of [{far:true,portal:true,channel:"local" as const},{far:true,portal:false,channel:"shout" as const}]){
  expect(hearingResult(setup).heard).toBe(false);expect(receiveClaim(prior,"ed",setup,3)).toBe(prior);
 }
 expect(hearingResult({far:true,portal:true,channel:"shout"}).heard).toBe(true);
 expect(hearingResult({far:false,portal:false,channel:"local"}).heard).toBe(true);
});
