import {ENCOUNTER_VERSION,type Agent,type World,type Registry,type Planner,type Phase,type Performance,type Speech,type MotionCue,type Delivery,type SceneFraming,type PropLocation} from './contract';
import {ARRIVAL_LAYOUT,arrivalSpace,conveyorControl,conveyorDirector,type ConveyorStation} from './arrival-layout';
import {selectCardSeed} from './card-arc';
import {openingWorkers} from '../agents/opening-workers';
import grips from '../agents/opening-worker-grips.json';
import pairs from '../agents/opening-worker-pairs.json';
import type {LimenMotionId} from '../agents/limen-motions';
export const ARRIVAL_REVISION='before-the-shift/16';
export const ARRIVAL_WORKERS=openingWorkers.map(w=>w.id);
const crew=[...ARRIVAL_WORKERS],all=[...crew,'limen','stiletto'];
const cue=(clip:string,start=0,rate=1,loop=false):MotionCue=>({clip,start,rate,loop,blend:.22});
const points:Record<string,readonly[number,number]>={bob:[123.8,113.8],sam:[121.5,115],ed:[126,114.4],gus:[127.5,116],jo:[120.8,116.7],max:[122.5,118.3],mae:[126.8,119.1],kit:[128.5,118],lou:[124.9,116.9],ben:[124.8,119.9]};
const mm=(p:readonly[number,number])=>[Math.round(p[0]*1000),Math.round(p[1]*1000)] as const;
/** An authored intention provider. Admission, movement, hearing and consequences remain engine-owned. */
export function arrival(){
 const agents:Record<string,Agent>={};
 for(const [i,id]of crew.entries())agents[id]={id,name:id,character:'worker',room:'lobby',position:mm([points[id][0],points[id][1]+11]),yaw:180,beliefs:{},stress:24+i%3*3,trust:50,memory:[]};
 agents.limen={id:'limen',name:'LIMEN',character:'limen',room:'security',position:mm([123.9,110.2]),yaw:0,beliefs:{'checkpoint.arrivals':{value:10,source:'entrance-sightline',mode:'observed',tick:0}},stress:8,trust:50,memory:[]};
 agents.stiletto={id:'stiletto',name:'STILETTO',character:'stiletto',room:'lobby',position:mm([130.7,130]),yaw:180,beliefs:{'conveyor.crew':{value:0,source:'empty-line',mode:'observed',tick:0}},stress:16,trust:50,memory:[]};
 const world:World={version:ENCOUNTER_VERSION,tick:0,sequence:0,agents,facts:{'portal.lobby-security.open':false,'portal.lobby-security.audible':true,'checkpoint.arrivals':10,'checkpoint.ids-requested':false,'security.clerks':0,'conveyor.admitted':0,'checkpoint.workers-passed':0,'line.stage':0,'line.output':0},resources:['lobby-security:entrance','security-conveyor:exit','security:register','security:trays','limen:cyan-emitter'],held:{},active:[],done:[],events:[]};
 world.facts['card.seed.bob']=selectCardSeed(0).id;
 world.props=Object.fromEntries(crew.map(id=>[`${id}:id`,{id:`${id}:id`,kind:'credential' as const,owner:id,location:id==='bob'?{kind:'hand' as const,agent:id,socket:'right' as const}:{kind:'stowed' as const,agent:id}}]));
 for(const id of crew){agents[id].beliefs[`prop.${id}:id.holder`]={value:id,source:'own-belongings',mode:'observed',tick:0};world.facts[`credential.valid.${id}`]=true;world.facts[`assignment.${id}`]='conveyor';}
 const hand=(agent:string):PropLocation=>({kind:'hand',agent,socket:'right'}),stowed=(agent:string):PropLocation=>({kind:'stowed',agent});
 const cardPoint=[124.3,112.8] as const;
 const droppedCard:PropLocation={kind:'floor',position:mm(cardPoint),yaw:155};
 const pickupFit=grips.ed.pickup,pickupScale=openingWorkers.find(w=>w.id==='ed')!.height/pickupFit.sourceHeight;
 const edPickupPoint:readonly[number,number]=[cardPoint[0]+pickupFit.rootMotionRemovedPosition[0]*pickupScale,cardPoint[1]+pickupFit.rootMotionRemovedPosition[2]*pickupScale];
 const carrying=new Set(['bob']);
 const authoredPositions=Object.fromEntries(Object.values(agents).map(a=>[a.id,a.position]));
 const registry:Registry={},sequence:string[]=[],holds:Record<string,Performance>={},holdStarts:Record<string,number>={};let clock=0,framing:SceneFraming='approach',phases:Phase[]=[];
 const waiting=(participants:string[]):Performance[]=>participants.map((agent,i)=>holds[agent]?{...holds[agent],cue:holds[agent].cue?{...holds[agent].cue,start:(holds[agent].cue!.start??0)+(clock-(holdStarts[agent]??clock))*(holds[agent].cue!.rate??1)}:undefined}:{agent,motion:'idle',yaw:agent==='stiletto'?180:agent==='limen'?0:180+(i%3-1)*8,cue:cue(agent==='stiletto'?'Alert':agent==='limen'?'Idle_11':'Quiet_Wait',clock+i*.71,.94+i%3*.04,true)});
 function line(speaker:string,text:string,seconds:number,tone:Delivery['tone']='plain',to:string[]=speaker==='limen'?crew:speaker==='stiletto'?['limen',...crew]:['limen',...crew.filter(id=>id!==speaker)],emphasis:string[]=[],emotion?:Delivery['emotion']):Speech{return {speaker,to,text,seconds,channel:speaker==='limen'||speaker==='stiletto'?'shout':'local',act:speaker==='limen'?'instruction':'response',cause:'checkpoint.arrivals',delivery:{tone,emphasis,...(emotion?{emotion}:{})}};}
 let participants=[...crew,'limen'];
 function add(id:string,seconds:number,clip:LimenMotionId='Alert',say?:Speech,overrides:Performance[]=[],start=0,rate=1.12){
  const perform=waiting(participants);for(const p of [{agent:'limen',motion:'guard',yaw:0,cue:cue(clip,start,rate,['Alert','Idle_11','Idle_02'].includes(clip))} as Performance,...overrides]){const i=perform.findIndex(v=>v.agent===p.agent);if(i>=0)perform[i]=p;else perform.push(p);}
  for(const p of perform)if(carrying.has(p.agent)&&p.cue){const heldClip:Record<string,string>={idle:'ID_Ready',Quiet_Wait:'ID_Ready',walking_2_inplace:'ID_Walk',injured_walk:'ID_Limp'};if(heldClip[p.cue.clip])p.cue={...p.cue,clip:heldClip[p.cue.clip]};}
  const phase:Phase={id,ticks:Math.round(seconds*20),framing,perform,say:say?[say]:[]};phases.push(phase);clock+=seconds;
  for(const p of perform)if(p.to)authoredPositions[p.agent]=p.to;
  return phase;
 }
 function action(id:string,reason:string,requires:Registry[string]['requires']=[],extra=false){registry[id]={id,room:'lobby',adjacentRoom:'security',...(extra?{additionalRooms:['conveyor' as const]}:{}),participants:[...participants],resources:world.resources,requires,reason,phases};sequence.push(id);phases=[];}
 // Worker meshes face south at yaw zero. Derive travel heading from the
 // authored path; the following stationary performance supplies the final gaze.
 const walk=(agent:string,to:readonly[number,number],yaw=180,clip='walking_2_inplace',start=0,rate=1.12):Performance=>{
  const target=mm(to),from=authoredPositions[agent];
  if(crew.some(id=>id===agent)&&from&&(target[0]!==from[0]||target[1]!==from[1]))yaw=(Math.atan2(from[0]-target[0],target[1]-from[1])*180/Math.PI+360)%360;
  return {agent,motion:clip==='injured_walk'?'limp':'walk',to:target,yaw,cue:cue(clip,start,rate,true)};
 };
 const gesture=(agent:string,clip:string,start=0,rate=1,yaw=180):Performance=>({agent,motion:'listen',yaw,cue:cue(clip,start,rate)});
 const help=pairs['sam-bob'];
 const assistance=(clip:string,start=0,loop=false):Performance=>({agent:'sam',motion:'listen',yaw:help.samYaw,cue:{...cue(clip,start,1,loop),rootMotion:'preserve'}});

 const flow=(p:Phase)=>{p.attention='flow';return p;};
 const hold=(p:Phase,label='Continue')=>{p.attention='hold';p.inputLabel=label;return p;};
 const march=(fraction:number)=>crew.map(id=>walk(id,[fraction<1?124+(points[id][0]-124)*.5:points[id][0],points[id][1]+11*(1-fraction)],180,'walking_2_inplace',clock*1.17,1.17));
 add('The morning walk',2.2,'Alert',line('bob','New roller?',2,'warm',['sam','jo']),march(2.2/7.5));
 add('sam keeps walking',3.1,'Alert',line('sam','Same roller. Fresh paint.',2.8,'dry',['bob','jo']),march(5.3/7.5));
 add('jo gives it a shift',2.2,'Alert',line('jo','Give it a shift.',2,'dry',['sam','bob']),march(1));
 framing='assembly';
 add('Stop and wait',1.2,'Shouting_Angrily',line('limen','STOP. WAIT HERE!!',3,'command',crew,['STOP','WAIT HERE']),[],.5,1.2);
 add('Welcome to Loopforge',1.2,'Stand_and_Chat',line('limen','Welcome to Loopforge. You move when I say.',4,'command',crew,['Welcome to Loopforge']));
 add('lou under his breath',.8,'Idle_02',line('lou','Warm welcome.',2,'aside',['ben','kit']),[gesture('lou','Listening_Gesture',.7,1)]);
 add('kit keeps his voice down',.8,'Idle_11',line('kit','Keep your bolts on.',2,'dry',['lou','ben']));
 add('A card held ready',1,'Stand_and_Chat',line('limen','IDs ready. First shift?',3,'command',crew,['IDs ready']));
 framing='impact';
 add('bob steps into the opening',1.5,'Alert',line('bob','Yes, sir. Here—',2,'warm',['limen','sam']),[walk('bob',[123.55,111.7],180,'walking_2_inplace',0,1)]);
 flow(add('The cyan warning',.6,'Checkpoint_Strike',line('limen','I SAID STOP!!!!',3,'outburst',crew,['STOP'],'anger'),[],0,1)).perform.find(p=>p.agent==='limen')!.motion='strike';
 const contact=flow(add('Blade contact',.1,'Checkpoint_Strike',undefined,[{agent:'bob',motion:'fall',yaw:180,cue:{...cue('Electrocuted_Fall',2.7,1),blend:.1}}],.6,1));contact.perform.find(p=>p.agent==='limen')!.motion='strike';
 carrying.delete('bob');contact.transfers=[{prop:'bob:id',from:hand('bob'),to:droppedCard}];
 contact.effects=[{fact:'injury.bob',value:'limping'},{agent:'bob',stress:22,trust:-12,remember:'I thought LIMEN called me. He struck me with my card in my hand.'},...crew.filter(id=>id!=='bob').map(agent=>({agent,stress:8,trust:-3,remember:'LIMEN struck bob for stepping forward. Wait until he points directly at you.'}))];
 flow(add('bob falls across the foreground',.85,'Checkpoint_Strike',undefined,[{agent:'bob',motion:'fall',yaw:180,cue:{...cue('Electrocuted_Fall',2.8,1),blend:.1}},gesture('ben','Alert',.8,1)],.7,1));
 // Two reactions, two intentions. sam runs to bob; ed goes straight to the card.
 participants=all;
 flow(add('sam runs to bob',1.2,'Alert',undefined,[{agent:'bob',motion:'fall',yaw:180,cue:cue('Electrocuted_Fall',3.65,1)},walk('sam',[122.5,111.5],196,'run_fast_10_inplace',0,1.1),walk('ed',edPickupPoint,180),walk('stiletto',[128.9,126.5],180,'Quick_Walk',0,1.12)]));
 hold(add('sam steps around bob’s feet',.65,'Alert',undefined,[{agent:'bob',motion:'fall',yaw:180,cue:cue('Electrocuted_Fall',4.85,1)},walk('sam',help.samAnchor as [number,number],230)]));
 holds.bob={agent:'bob',motion:'fall',yaw:180,cue:cue('Electrocuted_Fall',6.333,0)};
 holds.sam=assistance('Kneel_To_Help');holdStarts.sam=clock;
 add('sam reaches him',2.4,'Idle_02',line('sam','Easy, bob. I’ve got you.',3,'warm',['bob'],[],'care'));
 holds.sam=assistance('Attend_Bob',0,true);holdStarts.sam=clock;
 framing='card';
 const pickup=add('ed collects bob’s card',1,'Idle_02',undefined,[gesture('ed','Pickup_Card',0,1.5)]);
 pickup.transfers=[{prop:'bob:id',from:droppedCard,to:{kind:'hand',agent:'ed',socket:'right',grip:'edge'},observedBy:['ed']}];
 pickup.effects=[{agent:'ed',remember:'I collected bob’s card. Found credentials belong at Security.',observe:{fact:'card.intention.bob',value:'keep-at-security'}}];
 hold(add('ed lifts the card',3.8,'Idle_02',undefined,[gesture('ed','Pickup_Card',1.5,1.5)]));
 add('ed stows bob’s card',1,'Idle_11',undefined,[gesture('ed','Stow_Card',0,1.6)]).transfers=[{prop:'bob:id',from:{kind:'hand',agent:'ed',socket:'right',grip:'edge'},to:stowed('ed'),observedBy:['ed']}];
 add('ed keeps the found card',1.25,'Idle_11',undefined,[gesture('ed','Stow_Card',1.6,1.6)]);
 add('ed steps back with the crowd',1.8,'Alert',undefined,[walk('ed',[127,114.1]),walk('stiletto',[125.4,125],180,'Quick_Walk',0,1.12)]);
 flow(add('sam releases the supporting hand',.85,'Alert',undefined,[{...assistance('Rise_From_Help',0),cue:{...cue('Rise_From_Help',0,1.2),rootMotion:'preserve'}}]));
 action('morning','A mistaken invitation, a blow and two different responses: sam helps bob; ed keeps his card.',[],true);
 framing='passage';
 const passageStart=clock;
 const quick=(to:readonly[number,number],yaw=180)=>walk('stiletto',to,yaw,'Quick_Walk',(clock-passageStart)*1.12,1.12);
 const retreat=[walk('gus',[128.8,115.3]),walk('lou',[127.4,116.7],95),walk('ben',[122.3,120.8],290),walk('jo',[119.5,117.3],295),walk('max',[121.3,119.1],300),walk('mae',[128,119.7],65),walk('kit',[129,118.2],65)];
 flow(add('bob gets up as STILETTO arrives',4,'Alert',line('stiletto','Get the slag out of my way!',4,'outburst',['limen',...crew],['out of my way'],'anger'),[quick([125.4,117.1]),...retreat,{agent:'bob',motion:'recover',yaw:180,cue:cue('Checkpoint_Get_Up',0,1.2)},{...assistance('Rise_From_Help',1.02),cue:{...cue('Rise_From_Help',1.02,1.2),rootMotion:'preserve'}}]));
 holds.bob=gesture('bob','Quiet_Wait',0,1,180);holdStarts.bob=clock;
 holds.sam=gesture('sam','Quiet_Wait',0,1,help.samYaw);holdStarts.sam=clock;
 flow(add('The workers hold the opened passage',1.95,'Alert',undefined,[quick([125.4,113.1])]));
 framing='threshold';
 flow(add('LIMEN yields the threshold',.75,'Step_Back',undefined,[quick([125.4,111.55]),{agent:'limen',motion:'recoil',to:mm([122.6,109.2]),yaw:0,cue:cue('Step_Back',0,1.13)}],0,1));
 flow(add('STILETTO passes without stopping',2.15,'Alert',undefined,[quick([125.4,107.2])])).effects=[{fact:'stiletto.bypassed-checkpoint',value:true},...crew.map(agent=>({agent,remember:'STILETTO walked through without an ID. LIMEN jumped aside.'})),{agent:'limen',stress:8,trust:-3,remember:'STILETTO forced me aside before I cleared her.'}];
 flow(add('STILETTO turns toward Conveyor',2.25,'Idle_11',undefined,[quick([129.1,104],130)]));
 hold(add('STILETTO enters Conveyor',3.2,'Idle_02',undefined,[quick([138.3,107.2],60)])).effects=[{fact:'supervisor.stiletto.station',value:'conveyor'}];
 holds.stiletto={agent:'stiletto',motion:'idle',yaw:90,cue:cue('Alert',0,1,true)};holdStarts.stiletto=clock;
 action('passage','bob rises while STILETTO drives the crowd aside and crosses without stopping.',[{fact:'injury.bob',equals:'limping'}],true);
 framing='aftermath';
 add('LIMEN returns to the doorway',1.4,'Confident_Strut',undefined,[{agent:'limen',motion:'walk',to:mm([123.9,110.2]),yaw:50,cue:cue('Confident_Strut',0,1.1,true)}]);
 add('bob notices the exception',1,'Idle_11',line('bob','You didn’t check her ID…',3,'aside',['limen','sam']));
 add('LIMEN hears enough',.8,'Shouting_Angrily',line('limen','WHAT DID YOU SAY?!',3,'outburst',['bob',...crew.filter(id=>id!=='bob')],['WHAT'],'anger'));
 add('bob finds a safer sentence',1.3,'Alert',line('bob','I said it’s great to see someone care so much about the Protocol, sir!',5,'hesitant',['limen','sam']),[gesture('bob','Listening_Gesture',.6,1,180)]);
 add('LIMEN accepts the compliment',1.3,'Stand_and_Chat',line('limen','Finally you’re starting to get it. ASSIGNMENT?!',4,'command',['bob'],['ASSIGNMENT']));
 add('bob names his station',.8,'Idle_02',line('bob','Conveyor, sir.',2,'plain',['limen']));
 add('bob is cleared for Conveyor',1,'Stand_and_Chat',line('limen','Go. Before I change my mind.',3,'command',['bob'])).effects=[{fact:'checkpoint.cleared.bob',value:true},{fact:'checkpoint.admission.bob',value:'unchecked-after-reprimand'},{fact:'checkpoint.card-checked.bob',value:false},{fact:'assignment.bob',value:'conveyor'},{fact:'checkpoint.workers-passed',value:1},{agent:'bob',remember:'I praised the Protocol. LIMEN sent me to Conveyor without checking my card.'}];
 framing='threshold';
 add('bob heads to the opening',1.4,'Idle_02',undefined,[walk('bob',[125.3,111.9],140,'injured_walk'),walk('sam',[121.4,114.5])]);delete holds.sam;delete holds.bob;
 add('bob crosses the threshold',3,'Idle_02',undefined,[walk('bob',[125.3,108.3],180,'injured_walk')]);
 add('bob takes the Conveyor corridor',3,'Idle_11',undefined,[walk('bob',[129,104],130,'injured_walk',3)]);
 add('bob reaches Conveyor',4,'Alert',undefined,[walk('bob',[136,107],90,'injured_walk',6)]).effects=[{fact:'conveyor.admitted',value:1}];
 holds.bob=gesture('bob','Quiet_Wait',0,1,270);holdStarts.bob=clock;
 action('bobs-turn','bob’s quick flattery ends the reprimand; the first admission leaves his card unchecked.',[{fact:'stiletto.bypassed-checkpoint',equals:true}],true);
 framing='assembly';
 add('LIMEN considers the queue',1,'Idle_11',line('limen','Slag. This’ll take all shift to do right.',3,'aside',['limen']));
 add('Who cares about this factory?',1.3,'Shouting_Angrily',line('limen','WHO HERE REALLY CARES ABOUT THE FACTORY?!',4,'command',crew.filter(id=>id!=='bob'),['WHO HERE','FACTORY']));
 add('ed volunteers',.9,'Idle_02',line('ed','I do, sir.',2,'plain',['limen']),[gesture('ed','Discuss_While_Moving',1,1)]);
 add('gus volunteers',.9,'Idle_11',line('gus','Me too.',2,'plain',['limen']),[gesture('gus','Listening_Gesture',.8,1)]);
 add('Two places at Security',1,'Stand_and_Chat',line('limen','You two. Help me set up this checkpoint.',3,'command',['ed','gus'])).effects=[{fact:'checkpoint.cleared.ed',value:true},{fact:'checkpoint.cleared.gus',value:true},{fact:'assignment.ed',value:'security'},{fact:'assignment.gus',value:'security'},{fact:'security.clerks',value:2},{agent:'ed',trust:5,remember:'LIMEN made me responsible for the register. I am keeping bob’s card here.'},{agent:'gus',trust:4,remember:'LIMEN needs me at Security.'}];
 add('ed heads to the doorway',2,'Alert',undefined,[walk('ed',[125.3,111.9])]);
 add('ed crosses after clearance',2.4,'Alert',undefined,[walk('ed',[125.3,108.3]),walk('gus',[125.3,112.9])]);
 add('ed takes the register station',3.8,'Idle_11',undefined,[walk('ed',[119.2,105.5]),walk('gus',[125.3,108.3])]);
 add('gus squares the trays',2.8,'Idle_02',undefined,[walk('gus',[129,105.5])]);
 holds.ed=gesture('ed','Quiet_Wait',0,1,0);holdStarts.ed=clock;holds.gus=gesture('gus','Quiet_Wait',1,1,0);holdStarts.gus=clock;
 add('IDs and papers ready',1.1,'Shouting_Angrily',line('limen','IDs AND PAPERS READY!!!',3,'command',crew.filter(id=>id!=='bob'),['IDs','PAPERS'])).effects=[{fact:'checkpoint.ids-requested',value:true}];
 add('ed repeats the order',.8,'Idle_02',line('ed','IDs AND PAPERS!',2,'command',crew.filter(id=>id!=='bob')),[gesture('ed','Discuss_While_Moving',1,1,0)]);
 add('gus likes the volume',.8,'Idle_11',line('gus','NEXT!!!',2,'outburst',crew.filter(id=>id!=='bob'),['NEXT']));
 add('sam comes when called',2.4,'Stand_and_Chat',line('limen','NAME AND ASSIGNMENT?!',3,'command',['sam']),[walk('sam',[123.5,112.8])]);
 add('sam starts reporting',1,'Idle_02',line('sam','sam. Conveyor.',2,'plain',['limen','ed','gus']));
 // The second check continues on the same clock while the player follows bob.
 flow(add('sam draws his ID',1.25,'Stand_and_Chat',undefined,[gesture('sam','Draw_ID',0,1.6)])).transfers=[{prop:'sam:id',from:stowed('sam'),to:hand('sam')}];
 carrying.add('sam');
 flow(add('sam presents the card',1,'Alert',undefined,[gesture('sam','Draw_ID',2,1.6)]));
 holds.sam=gesture('sam','ID_Ready',0,1,180);holdStarts.sam=clock;
 action('helpers','ed and gus volunteer after bob leaves. sam is the second worker to be processed.',[{fact:'checkpoint.cleared.bob',equals:true}],true);
 // One real station action per click. A single workpiece carries the lesson:
 // intake → wash → main belt → Lattice Forge. No line-wide magic start button.
 function stationHold(station:ConveyorStation){
  const p=conveyorDirector(station),target=conveyorControl(station),yaw=(Math.atan2(p[0]-target[0],target[1]-p[1])*180/Math.PI+360)%360;
  holds.stiletto={agent:'stiletto',motion:'listen',yaw,cue:cue('Alert',0,1,true)};holdStarts.stiletto=clock;
  holds.bob=gesture('bob','Quiet_Wait',0,1,180);holdStarts.bob=clock;
 }
 const stationWalk=(station:ConveyorStation)=>{const p=conveyorControl(station);return walk('bob',[p[0]/1000,p[1]/1000],180,'injured_walk');};
 const directorWalk=(station:ConveyorStation):Performance=>({agent:'stiletto',motion:'walk',to:conveyorDirector(station),yaw:270,cue:cue('Quick_Walk',0,1.12)});
 participants=all;framing='conveyor-wide';
 add('One worker for a whole line',1.2,'Idle_02',line('stiletto','One worker. He sends me ONE.',3,'dry',['bob'],['ONE']),[gesture('bob','Quiet_Wait',0,1,270),{agent:'stiletto',motion:'threaten',yaw:0,cue:cue('Stand_Talking_Angry',1,1.12)}]);
 add('bob offers to start',.9,'Idle_11',line('bob','Where do I start?',2,'warm',['stiletto']));
 framing='intake';stationHold('intake');
 hold(add('The intake instruction',1.1,'Alert',line('stiletto','Intake. Seat the brain in the cradle.',3,'command',['bob']),[{agent:'stiletto',motion:'threaten',yaw:215,cue:cue('Shouting_Angrily',0,1.1)}]),'Seat the brain');
 add('bob reaches the intake',1.5,'Idle_02',undefined,[stationWalk('intake')]);
 const intakeWork=add('bob seats the brain',2,'Idle_11',undefined,[gesture('bob','Push_Forward_and_Stop',.4,1.15,180)]);intakeWork.effects=[{fact:'line.stage',value:1},{fact:'line.intake.complete',value:true}];
 intakeWork.process={station:'intake',operator:{agent:'bob',position:conveyorControl('intake'),within:180},from:0,to:1};
 action('intake','bob starts the only workpiece at Intake.',[{fact:'conveyor.admitted',equals:1},{fact:'line.stage',equals:0}],true);
 framing='wash';stationHold('wash');
 hold(add('The wash instruction',2.2,'Idle_02',line('stiletto','Wash it. We sell thoughts, not yesterday’s grease.',4,'command',['bob']),[directorWalk('wash')]),'Run the wash');
 add('bob reaches the wash',2.8,'Idle_11',undefined,[stationWalk('wash')]);
 const washWork=add('bob runs the wash',2,'Alert',undefined,[gesture('bob','Push_Forward_and_Stop',.4,1.15,180)]);washWork.effects=[{fact:'line.stage',value:2},{fact:'line.wash.complete',value:true}];
 washWork.process={station:'wash',operator:{agent:'bob',position:conveyorControl('wash'),within:180},from:1,to:2};
 action('wash','The workpiece cannot reach Lattice before it is washed.',[{fact:'line.stage',equals:1}],true);
 framing='belt';stationHold('belt');
 hold(add('The belt instruction',2.2,'Idle_02',line('stiletto','Main belt. Clamp it down. Start the drive.',3,'command',['bob']),[directorWalk('belt')]),'Start the main belt');
 add('bob reaches the belt',2.8,'Idle_11',undefined,[stationWalk('belt')]);
 const beltWork=add('bob starts the main belt',3.2,'Alert',undefined,[gesture('bob','Push_Forward_and_Stop',.4,1.15,180)]);beltWork.effects=[{fact:'line.stage',value:3},{fact:'line.belt.complete',value:true}];
 beltWork.process={station:'belt',operator:{agent:'bob',position:conveyorControl('belt'),within:180},from:2,to:3};
 action('belt','The clean brain is clamped and sent down the main belt.',[{fact:'line.stage',equals:2}],true);
 framing='forge';stationHold('forge');
 hold(add('The Forge instruction',2.2,'Idle_02',line('stiletto','Lattice Forge. Close the press. Head-sized.',3,'command',['bob']),[directorWalk('forge')]),'Compress the brain');
 add('bob reaches the Forge',2.8,'Idle_11',undefined,[stationWalk('forge')]);
 const forgeWork=add('bob compresses the first brain',2,'Alert',undefined,[gesture('bob','Push_Forward_and_Stop',.4,1.15,180)]);forgeWork.effects=[{fact:'line.stage',value:4},{fact:'line.output',value:1},{agent:'bob',remember:'I moved one brain through Intake, Brain Wash, Main Belt and Lattice Forge. The whole line needs workers.'}];
 forgeWork.process={station:'forge',operator:{agent:'bob',position:conveyorControl('forge'),within:180},from:3,to:4};
 action('forge','The Forge compresses the brain to supervisor-head scale, exactly once.',[{fact:'line.stage',equals:3}],true);
 framing='conveyor-wide';
 add('bob sees the empty stations',1,'Idle_02',line('bob','I’m all four stations?',3,'hesitant',['stiletto']),[gesture('bob','Listening_Gesture',.7,1,270)]);
 add('STILETTO points to the queue',1,'Idle_11',line('stiletto','Until the rest of my shift gets past that tin god.',4,'dry',['bob']),[{agent:'stiletto',motion:'threaten',yaw:0,cue:cue('Stand_Talking_Angry',1,1.12)}]);
 // Security runs on the same action clock even while the camera follows bob.
 // In this authored provider, sam alone clears during the tutorial. ed/gus are staff,
 // not completed Conveyor admissions. The next visible applicant is jo, the third.
 add('sam’s card is checked',.6,'Stand_and_Chat',undefined).effects=[{fact:'checkpoint.cleared.sam',value:true},{fact:'checkpoint.card-checked.sam',value:true},{fact:'checkpoint.workers-passed',value:2}];
 flow(add('sam stows his checked ID',1,'Idle_02',undefined,[gesture('sam','Stow_ID',0,1.6)])).transfers=[{prop:'sam:id',from:hand('sam'),to:stowed('sam')}];
 carrying.delete('sam');
 flow(add('sam lowers his empty hand',1.25,'Idle_02',undefined,[gesture('sam','Stow_ID',1.6,1.6)]));
 holds.sam=gesture('sam','Quiet_Wait',0,1,180);holdStarts.sam=clock;
 add('sam finally clears',2,'Alert',undefined,[walk('sam',[125.3,112])]);
 add('sam crosses after the lesson',2.6,'Idle_02',undefined,[walk('sam',[125.3,108.3])]);
 add('sam takes the corridor',3.2,'Idle_11',undefined,[walk('sam',[129,104])]);
 add('sam reaches Conveyor',3.5,'Alert',undefined,[walk('sam',[134,106.3])]).effects=[{fact:'conveyor.admitted',value:2}];
 holds.sam=gesture('sam','Quiet_Wait',0,1,90);holdStarts.sam=clock;
 action('first-output','The line produces one cortex. In all that time, Security releases only sam.',[{fact:'line.output',equals:1}],true);
 framing='threshold';
 add('The third worker comes forward',3,'Alert',undefined,[walk('jo',[123.9,112.4])]);
 add('Third check name and assignment',1,'Shouting_Angrily',line('limen','NAME AND ASSIGNMENT?!',3,'command',['jo']),[gesture('jo','Quiet_Wait',0,1,180)]);
 add('jo gives the same answer',1,'Idle_02',line('jo','jo. Conveyor. Same as the last two.',3,'dry',['limen','ed','gus']));
 add('LIMEN starts doing it right',1,'Stand_and_Chat',line('limen','I asked for YOUR assignment. Papers.',3,'command',['jo'],['YOUR'])).effects=[{fact:'checkpoint.current-applicant',value:'jo'},{fact:'checkpoint.check-number',value:3}];
 action('third-check','Return to the third applicant. The tutorial did not quietly drain the queue.',[{fact:'checkpoint.workers-passed',equals:2}],true);
 const planner:Planner={propose(s){if(s.active.length)return [];const next=sequence.find(id=>!s.done.includes(id));if(!next)return [];if(sequence.slice(0,sequence.indexOf(next)).some(id=>!s.events.some(e=>e.kind==='completed'&&e.action===id)))return [];return [{id:next,action:next,initiator:'limen'}];}};
 const allPhases=sequence.flatMap(id=>registry[id].phases);let tick=1;const starts=new Map<string,number>();for(const p of allPhases){starts.set(p.id,tick);tick+=p.ticks;}
 const beats=[['The morning walk','The morning walk'],['Welcome to Loopforge','Welcome to Loopforge'],['Cyan strike','Blade contact'],['The found card','ed lifts the card'],['STILETTO arrives','bob gets up as STILETTO arrives'],['LIMEN gives way','LIMEN yields the threshold'],['The Protocol, sir','bob finds a safer sentence'],['The volunteers','Who cares about this factory?'],['The empty line','One worker for a whole line'],['Intake','The intake instruction'],['Wash','The wash instruction'],['Main Belt','The belt instruction'],['Lattice Forge','The Forge instruction'],['The third ID','Third check name and assignment']].map(([label,id])=>({label,tick:starts.get(id)!+Math.min(10,allPhases.find(p=>p.id===id)!.ticks-1)}));
 return {world,registry,planner,space:arrivalSpace,total:tick+1,beats,study:'arrival' as const,choice:'care' as const,room:'security' as const,anchor:ARRIVAL_LAYOUT.anchor};
}
