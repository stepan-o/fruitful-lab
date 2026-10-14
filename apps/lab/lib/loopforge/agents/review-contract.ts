/** Review status describes evidence, never grants simulation capabilities. */
export const reviewSections = [
 {id:'body', title:'Body & materials', question:'Does the silhouette, scale and surface match the character art?'},
 {id:'equipment', title:'Equipment & effects', question:'Are modules mounted correctly, readable and inexpensive to animate?'},
 {id:'motion', title:'Motion library', question:'Can the action be understood without a label or dialogue?'},
 {id:'contact', title:'Contacts & clearance', question:'Do limbs, tools, workers and machinery stay physically convincing?'},
 {id:'readability', title:'Factory & CCTV', question:'Is this character and its action legible from all three room cameras?'},
 {id:'performance', title:'Performance & delivery', question:'Does the versioned runtime asset fit the intended scene and device budget?'}
] as const;
export type ReviewSection = typeof reviewSections[number]['id'];
export type ReviewGate = {status:'Accepted slice'|'Candidate'|'Needs work'|'Not measured'; detail:string};
export type ReviewReadiness = Record<ReviewSection, ReviewGate>;
export const reviewReadiness: Record<string, ReviewReadiness> = {
 'limen-assembly': {
  body:{status:'Accepted slice',detail:'Owner approved prototype appearance and character resemblance.'},
  equipment:{status:'Accepted slice',detail:'Body/blade fit and arm-flowing energy accepted. Contact sparks and game cues remain open.'},
  motion:{status:'Candidate',detail:'Maintenance idle, walk and run available. Factory interactions still need authoring.'},
  contact:{status:'Needs work',detail:'Owner observed no blade/body overlap in tested movement. Worker and machine contacts remain untested.'},
  readability:{status:'Candidate',detail:'Three CCTV presets available; full room-action recognition still needs review.'},
  performance:{status:'Not measured',detail:'Live single-character counters available. Crowd and physical-device budgets are not certified.'}
 },
 'worker-01-motions': {
  body:{status:'Candidate',detail:'One imported worker body and rig; inspect against the approved source art.'},
  equipment:{status:'Needs work',detail:'Working props and contact sockets have not been integrated.'},
  motion:{status:'Candidate',detail:'19 motions available. Hot Walk is a Cathexis reference, not the worker default.'},
  contact:{status:'Needs work',detail:'Audited, not corrected. Walk 2, Run Fast 10 and Injured Walk still have leg intersections; gesture contacts and missing afraid/work actions remain.'},
  readability:{status:'Candidate',detail:'Review gestures in factory lighting and at CCTV scale before assigning gameplay meaning.'},
  performance:{status:'Not measured',detail:'One consolidated body and motion bank. Real crowd and device measurements remain open.'}
 },
 'stiletto-blades': {
  body:{status:'Accepted slice',detail:'Owner accepts prototype appearance. Rigid armour weights and visor emission remain open.'},
  equipment:{status:'Accepted slice',detail:'Owner accepts both mounted blade arms in motion. Welder mounting and tool-change acting are still pending.'},
  motion:{status:'Accepted slice',detail:'Owner accepts the visible prototype acting. Idle/alert readings swapped; Reprimand reads as attack and Argument as threat. Source clips remain traceable.'},
  contact:{status:'Needs work',detail:'2,335 corrected poses pass sampled blade checks. Gait, blends and machine/worker clearance remain open.'},
  readability:{status:'Candidate',detail:'Factory/CCTV inspection available; visor identity and blade-aware interactions still need acceptance.'},
  performance:{status:'Not measured',detail:'49,358 body-and-blade triangles. Runtime counters are evidence, not crowd or device certification.'}
 }
};
export const upcomingReviewSubjects = [
 {id:'cathexis',name:'CATHEXIS',focus:'Presence and influence',direction:'Staged Meshy brief ready: Hot Walk only, no run or alert state; modular face inserts, porcelain shells and grime variants. Her own rig and worker-facing acting remain to validate.'},
 {id:'rivet-witch',name:'RIVET WITCH',focus:'Engineering and intervention',direction:'Tool mounts, precise machine contacts, inspection, repair and visible frustration with unresolved damage.'},
 {id:'thrum',name:'THRUM',focus:'Rhythm and calm',direction:'Distinct movement and vibration cues; worker relaxation must read differently from productive discipline.'}
] as const;
