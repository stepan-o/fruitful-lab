import {initialAgentTest,stepAgentTest,replayAgentTest,projectAgentTest,cancelAgentTest,reserve,type TestConfig} from '@/lib/loopforge/agents/production-test';
const base:TestConfig={kind:'gate',supervisor:'limen',count:24,strained:false};
test.each([10,24,100] as const)('%i stable identities and immutable deterministic replay',count=>{const config={...base,count},initial=initialAgentTest(config),saved=JSON.stringify(initial);let s=initial;for(let i=0;i<400;i++)s=stepAgentTest(s);expect(s).toEqual(replayAgentTest(config,400));expect(JSON.stringify(initial)).toBe(saved);expect(new Set(projectAgentTest(s).actors.map(a=>a.id)).size).toBe(count+1);});
test('inspection and bypass produce different committed clearance rates',()=>{const slow=replayAgentTest(base,500),fast=replayAgentTest({...base,supervisor:'stiletto'},500);expect(slow.completed).toBe(2);expect(fast.completed).toBe(4);expect(slow.history.every(a=>a.outcome==='released')).toBe(true);});
test('paired reservations are atomic and cannot steal occupied slots',()=>{const held={worker:'first'};expect(reserve(['worker','station'],'second',held)).toBeNull();expect(held).toEqual({worker:'first'});expect(reserve(['worker','worker'],'first',held)).toBeNull();});
test('cradle ownership changes at confirmed ticks, independent of projection frequency',()=>{const config={...base,kind:'transfer' as const};expect(replayAgentTest(config,60).propOwner).toBe('source-dock');expect(replayAgentTest(config,61).propOwner).toBe('worker-001');expect(replayAgentTest(config,181).propOwner).toBe('receiving-dock');const s=replayAgentTest(config,240);for(let i=0;i<500;i++)projectAgentTest(s);expect(s.completed).toBe(0);expect(stepAgentTest(s).completed).toBe(1);});
test('cancellation releases every paired resource without awarding completion',()=>{const s=cancelAgentTest(replayAgentTest({...base,kind:'transfer'},100));expect(s.reservations).toEqual({});expect(s.active).toBeNull();expect(s.completed).toBe(0);expect(s.propOwner).toBe('source-dock');expect(stepAgentTest(s)).toBe(s);});
test('the bounded take cancels its partial final action rather than claiming early completion',()=>{const s=replayAgentTest(base,600);expect(s.completed).toBe(3);expect(s.reservations).toEqual({});expect(s.history.at(-1)?.outcome).toBe('cancelled');});
test('strained worker refusal is causal and public projection does not leak the input',()=>{const config={...base,kind:'intervention' as const,supervisor:'stiletto' as const,strained:true},s=replayAgentTest(config,181);expect(s.completed).toBe(0);expect(s.history[0].outcome).toBe('refused');const v=projectAgentTest(s);expect(JSON.stringify(v)).not.toMatch(/strained|belief|desire|loyalty|confidence/);expect(replayAgentTest({...config,supervisor:'limen'},181).completed).toBe(1);});
test('seek bounds and malformed configuration fail closed',()=>{expect(()=>replayAgentTest(base,601)).toThrow();expect(()=>replayAgentTest(base,-1)).toThrow();expect(()=>replayAgentTest(base,1.5)).toThrow();expect(()=>initialAgentTest({...base,count:0 as 10})).toThrow();});

test('clearing one lane does not relocate workers in the other lanes',()=>{
 const before=projectAgentTest(replayAgentTest({...base,count:100},180));
 const after=projectAgentTest(replayAgentTest({...base,count:100},182));
 expect(after.actors[12].position).toEqual(before.actors[12].position);
 const atRelease=projectAgentTest(replayAgentTest(base,181));
 expect(atRelease.actors[0].position).toEqual([126500,0,130000]);
});
