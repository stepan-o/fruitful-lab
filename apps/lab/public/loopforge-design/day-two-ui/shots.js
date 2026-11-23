// Each destination is a drawing. Choice links select a recorded branch of the same morning.
export const shots = {};
function shot(id, chapter, title, next, note, extra={}) {
  shots[id]={id,chapter,title,next,note,...extra};
}
const start='Morning', staff='STILETTO on Conveyor', hold='bob stays at Security', lim='LIMEN on Conveyor';
shot('console',start,'The receiver rings','handover','The two powered monitors establish the rooms. The incoming line singles out the handset. Full-screen cameras lose the desk housing.');
shot('handover',start,'Factory handover','quota','The receiver opens the leadership painting. Day 1 has already put three finished cortexes on the rack.');
shot('quota',start,'The weekly mandate','appointment','Only rack arrivals count. The quota is due at the end of Day 7. Returning early brings the player back to the ringing console.');
shot('appointment',start,'Post the supervisors','walk','Choose one complete assignment. The lead takes Security and the other supervisor takes Conveyor. Committing the order starts the shift.');
shot('walk',staff,'Crew walk-in','screening','The camera picks up the approach. Local speech follows its speaker. No order is due during this beat.');
shot('screening',staff,'Individual checks','pairs','LIMEN checks the queue. Earlier workers can reach Conveyor while the remaining crew waits at Security.');
shot('pairs',staff,'Two operators, four stations','first-post','A held teaching beat names the two available operators. The Operator posts sam to Intake and Wash, then max to Belt and Forge in this worked route.',{post:['sam',0]});
shot('first-post',staff,'Cover a second post','pair-posts','Intake now carries sam’s name. The second destination is Wash.',{post:['sam',1]});
shot('pair-posts',staff,'Hand the remaining pair to max','third-post','The two assigned posts retain their names on the floor while max is selected.',{post:['max',2]});
shot('third-post',staff,'Complete the two pairs','demonstration','All four sockets have to be filled. The last placement releases the teaching hold.',{post:['max',3]});
shot('demonstration',staff,'Run one carrier','missing','Work resumes. The operators walk between their posts and a single finished carrier reaches the rack before the camera returns to bob.');
shot('missing',staff,'bob reaches LIMEN’s desk','case','The case originates at bob. Selecting the attached marker inspects it without spending today’s intervention.',{incident:true});
shot('case',staff,'Open the missing-ID case','grant-desk','The dedicated painting takes over the viewport. The explicit pass action states its cost. Returning to the camera leaves the option available.');
shot('returned',staff,'Return to the held desk','hold-desk','The camera and the case are restored. In this study the next drawing follows the observed timeout. The player can still reopen the case while it is live.',{key:'missing',incident:true});
shot('expired',hold,'The case closes while open','hold-desk','The command disappears when the window expires. Return to the camera to see bob in custody.');
for (const pass of [true,false]) {
  const p=pass?'grant':'hold', group=pass?staff:hold;
  shot(p+'-desk',group,pass?'Pass confirmed at the gate':'The desk holds bob',p+'-visit',pass?'The intervention is spent. bob crosses with a pass valid until the bell.':'The intervention is available. bob stays in custody, and his portrait is unavailable for Conveyor.');
  shot(p+'-visit',group,'STILETTO goes to Security',p+'-singles','The camera follows her request for crew. jo and kit are released before the roster reopens.');
  shot(p+'-singles',group,'One worker per station',p+'-one-post',pass?'sam, max, bob, jo and kit are eligible. Four different operators must be posted.':'Four operators are eligible. The worked route puts max at Wash in bob’s absence.',{post:['sam',0],single:true});
  shot(p+'-one-post',group,'Cover Wash',p+'-two-posts','The first operator stays at Intake. Put the next eligible operator at Wash.',{post:[pass?'bob':'max',1],single:true});
  shot(p+'-two-posts',group,'Cover Belt',p+'-last-post','jo handles Belt while kit is available for the fourth post.',{post:['jo',2],single:true});
  shot(p+'-last-post',group,'Post the fourth operator',p+'-two','The first three posts are shown as confirmed. Posting kit to Forge completes the assignment and restarts production.',{post:['kit',3]});
  shot(p+'-two',group,'Two further rack arrivals',p+'-release','Two more finished cortexes trigger STILETTO’s return to the checkpoint.');
  shot(p+'-release',group,'Release the waiting crew',p+'-live','STILETTO’s shout belongs to Security. The rest of the eligible crew move to Conveyor.');
  shot(p+'-live',group,'Run the staffed line',p+'-move','The line runs automatically. Select kit to compare worker ratings with Belt’s needs. Moving a worker is free and takes time.',{staffing:true});
  shot(p+'-security',group,'Look back at Security',p+'-live','A free camera switch shows the actual Security floor at the same recorded instant. Returning restores the Conveyor view.',{cameraReturn:p+'-live'});
  shot(p+'-move',group,'kit receives the Belt order',p==='grant'?'grant-bell':'relief',pass?'The current contact finishes first. max can keep Forge running while kit moves.':'kit is leaving Forge. The recovery example posts an available worker there. The unattended alternative reaches the bell with the line held.');
  shot(p+'-bell',group,pass?'Bell after the day pass':'Bell with Forge left uncovered','console','The closing record reconciles new arrivals with the three already credited on Day 1. The pass expires or custody ends at the bell.',{bell:true});
}
shot('relief',hold,'Restore Forge coverage','relief-bell','The relief operator arrives at Forge. A worker in transit starts contributing only at the post.');
shot('relief-bell',hold,'Bell after restoring coverage','console','A separate replay takes the same run through the bell with Forge covered.',{bell:true});
shot('swap-walk',lim,'Crew approach the swapped posts','farewell','The same crew reaches the same factory. The supervisor assignment changes the scene that follows.');
shot('farewell',lim,'LIMEN leaves his desk','rush','LIMEN’s farewell is private. The camera can observe him. The line gives the workers no new knowledge.');
shot('rush',lim,'STILETTO clears the queue','empty','All ten pass on STILETTO’s shout. The camera follows the workers to the conveyor.');
shot('empty',lim,'The empty stroke','silence','max strokes an empty Forge. It produces zero. LIMEN stops the line before the player takes control.');
shot('silence',lim,'Wait for the Protocol','one-rack','The first authored two-second silence occurs before the loaded Forge clearance. The console adds no dialogue to fill it.');
shot('one-rack',lim,'STILETTO sees the first cortex','second-rest','One completed cortex is on the rack. STILETTO’s response is local to the Conveyor floor.');
shot('second-rest',lim,'LIMEN resumes his lesson','ready','The second written silence separates “Where was I...” from “Ah yes. The Protocol.” The floor then works the second load toward max.');
shot('ready',lim,'Two stations need a call','calling','Intake has sam and C3. Forge has max and C2. Each ready control is attached to its machine. The other two machines show their current state.',{clear:true});
shot('ready-security',lim,'STILETTO at the gate','ready','Security remains available to watch. Return to the same Conveyor decision.',{cameraReturn:'ready'});
shot('calling',lim,'The Forge call is in flight','stroke','LIMEN has spoken. A pending call does not count as a stroke. max must receive this particular clearance.');
shot('stroke',lim,'max takes the treadle','rack','The loaded press moves on receipt. The rack count waits for physical delivery.');
shot('rack',lim,'The second cortex arrives','inspection','The new rack arrival increments both Day 2 and the week once.');
shot('inspection',lim,'LIMEN is inspecting','clear-bell','During the inspection, Clear is unavailable. Already cleared work and the shift clock continue.');
shot('clear-bell',lim,'Bell after clearing Forge','console','The example issues one Forge clearance after handover. Compare its total with watching the same shift.',{bell:true});
shot('watch-bell',lim,'Bell after watching','console','Same handover and bell. Waiting leaves the second loaded carrier at Forge.',{bell:true});
shot('intake-call',lim,'Call Intake instead','intake-result','sam receives the clearance for C3 at Intake. The loaded Forge remains a separate decision.');
shot('intake-result',lim,'C3 reaches Wash','intake-bell','The third carrier is at Wash. max still waits with C2. The next drawing holds further orders until the bell.');
shot('intake-bell',lim,'Bell after Intake only','console','Clearing Intake moved work through the line. It did not authorise the Forge operation.',{bell:true});
export const order=[
  'console','handover','quota','appointment',
  'walk','screening','pairs','first-post','pair-posts','third-post','demonstration','missing','case','returned','grant-desk','grant-visit','grant-singles','grant-one-post','grant-two-posts','grant-last-post','grant-two','grant-release','grant-live','grant-security','grant-move','grant-bell',
  'expired','hold-desk','hold-visit','hold-singles','hold-one-post','hold-two-posts','hold-last-post','hold-two','hold-release','hold-live','hold-security','hold-move','relief','relief-bell','hold-bell',
  'swap-walk','farewell','rush','empty','silence','one-rack','second-rest','ready','ready-security','calling','stroke','rack','inspection','clear-bell','watch-bell','intake-call','intake-result','intake-bell'
];
