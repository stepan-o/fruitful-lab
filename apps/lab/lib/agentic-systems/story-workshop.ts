export type Request = "practice" | "quiet";
export type StoryAction = "ask" | "practice" | "quiet" | "produce" | "leave";
export type StoryState = { request: Request; asked: boolean; activity: "none" | "practice" | "quiet" | "produce"; ended: boolean; history: StoryAction[] };
export const newStory = (request:Request):StoryState => ({request,asked:false,activity:"none",ended:false,history:[]});
export function storyGuard(s:StoryState,a:StoryAction):string|null {
  if(s.ended)return "The scene has ended. Begin another rehearsal.";
  if(a==="ask")return s.asked?"Kit has already answered.":s.activity!=="none"?"The spare period has already been spent.":null;
  if(a==="leave")return s.activity==="none"?"Choose how to spend the spare period first.":null;
  if(s.activity!=="none")return "Only one spare period is available.";
  if(a==="practice"&&!s.asked)return "Ask Kit before arranging a rehearsal.";
  if(a==="practice"&&s.request!=="practice")return "Kit asked for quiet. A rehearsal is not consented to.";
  if(a==="quiet"&&(!s.asked||s.request!=="quiet"))return "Ask Kit; this beat answers a request for quiet.";
  return null;
}
export function actStory(s:StoryState,a:StoryAction):StoryState {
  if(storyGuard(s,a))return s;
  return {...s,asked:s.asked||a==="ask",activity:a==="practice"||a==="quiet"||a==="produce"?a:s.activity,ended:a==="leave",history:[...s.history,a]};
}
export function storyLine(s:StoryState,variant=0):{speaker:string;text:string} {
  if(s.ended){if(s.activity==="quiet")return {speaker:"Kit",text:"You left the machine off. Thank you."};if(s.activity==="practice")return {speaker:"Kit",text:["Tomorrow, same time?","Leave the chairs there. We’ll need them.","I know where the second chair goes now."][variant%3]};if(!s.asked)return {speaker:"Kit",text:"You never asked what the hour was for."};return s.request==="quiet"?{speaker:"Kit",text:"I’ll take the quiet on the way home."}:{speaker:"Kit",text:"We made another crate. Keep the chairs for tomorrow."};}
  if(s.activity==="quiet")return {speaker:"Lou",text:"Then we can let the machine have the hour too."};
  if(s.activity==="practice")return {speaker:"Lou",text:"Start again from the entrance. I’ll wait for your cue."};
  if(s.activity==="produce")return {speaker:"Lou",text:"One more crate for the count."};
  if(s.asked)return s.request==="practice"?{speaker:"Kit",text:"A rehearsal. Just once, with someone who waits for me."}:{speaker:"Kit",text:"Quiet. Please don’t turn it into a group activity."};
  return {speaker:"Lou",text:"There’s one period left before the gate closes."};
}
export function storyFacts(s:StoryState){return {request:s.asked?(s.request==="practice"?"A rehearsal":"Quiet"):"Not asked",period:s.activity==="none"?"Available":"Spent",output:s.activity==="produce"?1:0,practice:s.activity==="practice"?"Completed":"Not held"};}
export const storyActions:{id:StoryAction;label:string;effect:string}[]=[{id:"ask",label:"Ask Kit",effect:"Record the request; spend no period."},{id:"practice",label:"Hold the rehearsal",effect:"Spend the period on practice; add no crate."},{id:"quiet",label:"Leave the machine off",effect:"Spend the period quietly; add no crate."},{id:"produce",label:"Make one more crate",effect:"Spend the period on output; add one crate."},{id:"leave",label:"Leave together",effect:"Close the scene; choose a reply from its history."}];
