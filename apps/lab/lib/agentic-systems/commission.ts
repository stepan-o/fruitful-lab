export const commissionFields=[
 {key:"outcome",label:"Useful difference",prompt:"Who receives the result, and what will become possible or perceptibly better?"},
 {key:"baseline",label:"Starting specimen",prompt:"Identify the source, build, input and recorded failure from which this job begins."},
 {key:"preserve",label:"Protected work",prompt:"Name what must survive and what this job may change. Mark shared interfaces."},
 {key:"evidence",label:"Receiving test",prompt:"What observation would accept or reject this difference? Include recovery or visual review where relevant."},
 {key:"authority",label:"Decision owner",prompt:"Who can implement, inspect, resolve disagreement and authorize delivery?"},
 {key:"resources",label:"Resource boundary",prompt:"Set an actual limit before work starts. Keep elapsed time, overlapping work, review attention and money distinct; unknown is not zero."},
 {key:"stop",label:"Stopping decision",prompt:"What triggers repair, a new brief, deferral or closure? What may not restart itself?"},
 {key:"delivery",label:"Handoff package",prompt:"Name the runnable result, evidence, unresolved findings and next owner's entry point."}
] as const;
export type CommissionKey=typeof commissionFields[number]["key"];
export type Commission=Record<CommissionKey,string>;
export const commissionExamples:{name:string;fields:Commission}[]=[
 {name:"Example · repair the recorded pause",fields:{
 outcome:"A viewer on the target HD 620 machine can watch the passage without the recorded long-frame interruptions.",
 baseline:"Pin the delivered Day 1 build and reproduce its failed protocol. The older opening-r12 trace is an investigation lead, not a measurement of this newer workload.",
 preserve:"Preserve cast, authored action, world obligations and camera sequence. Begin with one measured recurring operation; keep larger rendering changes outside this first job.",
 evidence:"Capture the relevant profile, change one justified operation, then run the matched full protocol and inspect the action at ordinary speed. Record setup failures separately.",
 authority:"Assign an implementation owner, a receiving reviewer and the person authorized to accept the new device result before starting.",
 resources:"UNASSIGNED: agree a bounded investigation and review allowance before dispatch. Record elapsed time, overlapping agent work and reviewer time separately; use actual billed money only when available.",
 stop:"If the trace does not support the proposed cause, return the evidence and a revised hypothesis. Do not strip the scene or open an architectural rewrite without a changed commission.",
 delivery:"Return the exact source/build, before/after measurements, ordinary-speed capture, remaining failures and a reproducible entry command. A failed check remains a finding, not an automatic new assignment."
 }},
 {name:"Example · investigate a second day",fields:{
 outcome:"Decide whether one consequence from Day 1 can support a meaningful choice in a second day.",
 baseline:"Start from the preserved delivered day and DAY_TWO_BOUNDARY.md. No implemented second day or cohort system is assumed.",
 preserve:"Preserve completed Day 1 and existing custody/history. Explore one consequence with a small authored prototype; do not silently add new rewards or a general planner.",
 evidence:"Show the reachable prior histories, one consequential choice and its resulting state. Have the intended reader/player try it before commissioning the full day.",
 authority:"Assign an author and implementation owner; name the product owner who can decide whether the consequence earns expansion.",
 resources:"UNASSIGNED: set the prototype and review allowance before work. Keep model/API spend separate from implementation and human review; no live inference is required for this probe.",
 stop:"Close with a prototype and decision. If the choice changes no meaningful consequence, record why and stop; a larger story is a separate commission.",
 delivery:"Preserve the runnable prototype, its source, the observed decision, rejected assumptions and the smallest justified next brief."
 }}
];
export function commissionMarkdown(fields:Commission){
 return "# Production commission\n\nDraft for human review. Field completeness is not authorization or evidence of quality.\n\n"+commissionFields.map(f=>"## "+f.label+"\n\n"+(fields[f.key].trim()||"[Unspecified]")).join("\n\n")+"\n";
}
