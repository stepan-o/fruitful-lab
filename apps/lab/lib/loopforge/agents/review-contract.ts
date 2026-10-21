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
 'opening-workers': {
  body:{status:'Candidate',detail:'Ten individually generated bodies follow the approved cast art. Inspect each silhouette and the three simplified detail levels before accepting the exported geometry.'},
  equipment:{status:'Candidate',detail:'Characteristic clothing and kit’s pipe are part of the source body. Held IDs and paired prop contacts remain to be fitted.'},
  motion:{status:'Candidate',detail:'Each bank has nineteen transferred Worker 01 motions, a neutral rig and two companion Meshy clips. Source finger tracks do not transfer to these 24-joint rigs.'},
  contact:{status:'Needs work',detail:'New proportions need individual fitting. The first bob scan finds hand/head, hand/leg and fall/floor contacts. Worker 01’s earlier cleanup does not certify these bodies.'},
  readability:{status:'Candidate',detail:'Inspect the new cast under the same factory lighting and CCTV cameras. Full-cast and names-hidden recognition remain separate checks.'},
  performance:{status:'Not measured',detail:'Ten floor bodies total 92,385 triangles and 12.75 MB including motion banks. The smaller set preserves head features and totals 45,542 triangles. These are delivery measurements; the actual opening-scene device test is still pending.'}
 },
 'cathexis-intake': {
  body:{status:'Accepted slice',detail:'Accepted v2 silhouette and rear skirt; rigged export has 51,031 triangles. Matching delivery normal map remains missing.'},
  equipment:{status:'Accepted slice',detail:'Owner approves full/split Grace fit on the intact animated head. Recessed eyes and static/moving fitting share one adapter. Physical mask removal and facial articulation remain outside this slice.'},
  motion:{status:'Accepted slice',detail:'Owner approves corrected Hot Walk, Happy Sway, Mirror Viewing and Red Carpet Walk. Hot Walk remains the default travel gait; Red Carpet is a performance walk. Original exports remain available for comparison. Head Hold in Pain is missing; that ZIP contains Mirror Viewing.'},
  contact:{status:'Needs work',detail:'3,505 corrected poses across both banks pass sampled dress/leg and leg/leg checks; Happy Sway sole drift is at most 2.12 mm. Grace attachment passes 22,908 first-bank and 19,188 second-bank samples. Hand/mask surfaces, self-contact, blends and paired encounters remain unverified.'},
  readability:{status:'Candidate',detail:'Portrait, full-body and CCTV framing share one performer. A fixed floor grid exposes contact drift; close-up acceptance does not certify distant action readability.'},
  performance:{status:'Not measured',detail:'Approved banks: 11.51 MB for Hot Walk/Sway, 13.88 MB for Mirror/Red Carpet. Only the selected bank loads; one body renders. Baked skinning, no runtime cloth. Crowd and physical-device performance remain unmeasured.'}
 },
 'limen-assembly': {
  body:{status:'Accepted slice',detail:'Owner approved the 42k body. The separate 9,752-triangle / 80-joint source candidate is available for review; it does not replace that game performer.'},
  equipment:{status:'Accepted slice',detail:'Body/blade fit and arm-flowing energy accepted. Contact sparks and game cues remain open.'},
  motion:{status:'Candidate',detail:'20 source and transferred motions with finger animation, plus the accepted maintenance idle, walk and run. Shout and attack candidates require scene-specific staging; Arise has a below-floor source trajectory.'},
  contact:{status:'Needs work',detail:'Accepted assembly clearance remains approved. New source motions use a candidate forearm emitter fit; self-contact, swept blade paths and paired worker contacts need review.'},
  readability:{status:'Candidate',detail:'Three CCTV presets available; full room-action recognition still needs review.'},
  performance:{status:'Not measured',detail:'New bank: 9.91 MiB, one body, 17 clips and embedded PBR maps; housing adds 1.12 MiB. Only the selected bank loads. Crowd and physical-device budgets are not certified.'}
 },
 'worker-01-motions': {
  body:{status:'Candidate',detail:'Accepted source body retained; corrected skin adds ten rigid digit hinges for inspection.'},
  equipment:{status:'Needs work',detail:'Working props and contact sockets have not been integrated.'},
  motion:{status:'Candidate',detail:'19 original/corrected motion pairs plus three finger-pose studies. Hot Walk remains a CATHEXIS source reference.'},
  contact:{status:'Candidate',detail:'13,551 exported poses at 120 Hz clear the tested self-contact regions. Source/corrected comparison is available; blends, floor staging and paired prop/agent contacts remain separate gates.'},
  readability:{status:'Candidate',detail:'Review gestures in factory lighting and at CCTV scale before assigning gameplay meaning.'},
  performance:{status:'Not measured',detail:'One consolidated body and motion bank. Real crowd and device measurements remain open.'}
 },
 'stiletto-blades': {
  body:{status:'Accepted slice',detail:'Owner accepts prototype appearance. Rigid armour weights remain open; the red cross visor is a review candidate.'},
  equipment:{status:'Accepted slice',detail:'Owner accepts both mounted blade arms in motion. Welders/flames are mounted review candidates; tool-change acting is still pending.'},
  motion:{status:'Accepted slice',detail:'Owner accepts the visible prototype acting. Idle/alert readings swapped; Reprimand reads as attack and Argument as threat. Source clips remain traceable.'},
  contact:{status:'Needs work',detail:'2,335 corrected poses pass sampled blade checks. Gait, blends and machine/worker clearance remain open.'},
  readability:{status:'Candidate',detail:'Factory/CCTV inspection available; visor identity and blade-aware interactions still need acceptance.'},
  performance:{status:'Not measured',detail:'49,358 body-and-blade triangles. Runtime counters are evidence, not crowd or device certification.'}
 }
};
export const upcomingReviewSubjects = [
 {id:'rivet-witch',name:'RIVET WITCH',focus:'Engineering and intervention',direction:'Tool mounts, precise machine contacts, inspection, repair and visible frustration with unresolved damage.'},
 {id:'thrum',name:'THRUM',focus:'Rhythm and calm',direction:'Distinct movement and vibration cues; worker relaxation must read differently from productive discipline.'}
] as const;
