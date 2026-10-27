import {actStory,newStory,storyGuard,storyLine,type StoryAction,type StoryState} from "@/lib/agentic-systems/story-workshop";
test("a request is required for rehearsal and quiet is not converted into consent",()=>{
  const initial=newStory("quiet");expect(actStory(initial,"practice")).toBe(initial);
  const asked=actStory(initial,"ask");expect(actStory(asked,"practice")).toBe(asked);
  expect(actStory(asked,"ask")).toBe(asked);
});
test("one period cannot pay for both output and rehearsal",()=>{
  const practiced=actStory(actStory(newStory("practice"),"ask"),"practice");
  expect(actStory(practiced,"produce")).toBe(practiced);
  expect(actStory(newStory("practice"),"leave").ended).toBe(false);
});
test("every reachable unfinished state can reach an ending and endings preserve distinct histories",()=>{
 const actions:StoryAction[]=["ask","practice","quiet","produce","leave"];
 for(const request of ["practice","quiet"] as const){const states:StoryState[]=[newStory(request)];for(let i=0;i<states.length;i++){const s=states[i];const next=actions.filter(a=>!storyGuard(s,a)).map(a=>actStory(s,a));if(!s.ended){expect(next.length).toBeGreaterThan(0);states.push(...next);}else expect(next).toHaveLength(0);}expect(states.filter(s=>s.ended).length).toBe(3);}
 const unheard=actStory(actStory(newStory("practice"),"produce"),"leave");
 const heard=actStory(actStory(actStory(newStory("practice"),"ask"),"produce"),"leave");
 expect(storyLine(unheard).text).not.toBe(storyLine(heard).text);
 expect([0,1,2].map(v=>storyLine(heard,v).text)).toEqual(Array(3).fill(storyLine(heard).text));
});
