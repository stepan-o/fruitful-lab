/** Verified embedded clip names from the 19 October Meshy delivery. These are review candidates. */
export const limenMotions = [
 {id:'Shouting_Angrily',label:'Shouting angrily',seconds:7.167,note:'Entrance-warning candidate. Review the full arm gesture with the cyan blade before pairing it with workers.'},
 {id:'Alert',label:'Alert',seconds:4,note:'Guard stance. Review body and blade clearance through the settling motion.'},
 {id:'Idle_11',label:'Idle 11 · relaxed',seconds:1.833,note:'Relaxed standing candidate. This export includes the complete skinned body.'},
 {id:'Idle_02',label:'Idle 02 · downloaded as Idle 1',seconds:1.833,note:'The download was named Idle 1; its embedded take is Idle_02. Slightly raised right forearm.'},
 {id:'Axe_Spin_Attack',label:'Axe spin attack',seconds:2.5,note:'Large wind-up and spin. Human two-handed weapon motion: watch the left hand, torso and blade sweep. Not yet approved as the entrance strike.'},
 {id:'Angry_Ground_Stomp',label:'Angry ground stomp',seconds:1.333,note:'Short frustration beat. Check the landing and blade clearance before looping.'},
 {id:'Stand_and_Chat',label:'Stand and chat',seconds:5.167,note:'Conversation candidate. The source starts off-centre; the viewer preserves that staging.'},
 {id:'Agree_Gesture',label:'Agree gesture',seconds:13,note:'Long gesture with a clap. About 18 cm of net hip drift; hands and blade need contact review.'},
 {id:'Shrug',label:'Shrug',seconds:2,note:'Open-arm gesture. Review both the silhouette and the blade tip.'},
 {id:'Confused_Scratch',label:'Confused scratch',seconds:11.5,note:'Right-hand head scratch. LIMEN carries the blade on this forearm: head contact and blade clearance need correction. About 11 cm of net hip drift.'},
 {id:'Confident_Strut',label:'Confident strut',seconds:2.667,note:'In-place stylized gait. Review crossed leg trajectories and the broad arm swing.'},
 {id:'Injured_Walk',label:'Injured walk',seconds:8.667,note:'LIMEN injury candidate. This is on the new LIMEN rig, not the approved worker recovery sequence.'},
 {id:'Arise',label:'Arise · floor offset needs work',seconds:1.8,note:'Raw export starts below the floor and ends low. Preserved for inspection; not a ready floor-to-standing recovery.'},
 {id:'Axe_Breathe_and_Look_Around',label:'Axe breathe and look around',seconds:11.233,note:'Crouched weapon-ready stance. The implied handheld axe is absent; inspect whether it reads with the forearm emitter.'},
 {id:'Boxing_Warmup',label:'Boxing warm-up',seconds:6.333,note:'Human boxing arm crosses and guards need blade-aware cleanup.'},
 {id:'air_squat',label:'Air squat',seconds:1.833,note:'Exercise candidate. Arms extend forwards; check blade and knee separation.'},
 {id:'All_Night_Dance',label:'All-night dance',seconds:8.167,note:'Broad performance motion. Nearly a metre of lateral hip travel within the cycle; reserve space around it.'},
] as const;
export type LimenMotionId=typeof limenMotions[number]['id'];
export type LimenReviewBank='approved'|'motions';
export const LIMEN_MOTION_REVISION='meshy-limen-motions-2026-10-19';
export const limenMotion=(id:string)=>limenMotions.find(m=>m.id===id);
