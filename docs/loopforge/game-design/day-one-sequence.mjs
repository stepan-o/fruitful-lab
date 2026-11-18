// One score for playback, seeking, recording and Scene Direction. Times are seconds.
// Movement uses floor metres; the final walkout deliberately accelerates between dialogue beats.
export function makeSequence(floor, script) {
  const cast = {...floor.queue, STILETTO:[floor.exit.x-7.5,floor.exit.y+4.7]};
  const tracks = Object.fromEntries(Object.entries(cast).map(([id,p])=>[id, [{t:0,p}]]));
  // Explicit holds and path corners keep replay independent of frame rate.
  function walk(id,start,speed,...points) {
    const track=tracks[id], last=track.at(-1);
    if (start < last.t-.001) throw Error(id+' has overlapping paths at '+start+' after '+last.t);
    let p=last.p, t=start;
    track.push({t,p});
    for (const next of points) {
      t+=Math.hypot(next[0]-p[0],next[1]-p[1])/speed;
      track.push({t,p:next});
      p=next;
    }
    return t;
  }
  const [intake,wash,belt,forge]=floor.stations.map(q=>[q.x,q.y]);
  const witness=floor.anchors[3].floor, register=floor.anchors[1].floor, checks=floor.anchors[2].floor;
  const threat=floor.anchors[0].floor;
  // Stage checkpoint traffic in metres from the middle of the inspection boom.
  const [gateX,gateY]=[floor.gate.hinge[0]+floor.gate.length/2,floor.gate.hinge[1]];
  const atGate=(east,south)=>[gateX+east,gateY+south];
  const threshold=atGate(.4,.1);
  const forgeDoor=[floor.doorway.x+floor.doorway.w/2,floor.doorway.y+floor.doorway.h/2];
  const lineApproach=[forgeDoor[0],forgeDoor[1]+.85];
  // The workers talk on the approach. LIMEN takes over when max reaches the queue.
  const entrance=floor.exit, doorX=entrance.x+entrance.w/2;
  const portalCentre=id=>{
    const {x,y,w,h}=floor.portals.find(p=>p.id===id).rect;
    return [x+w/2,y+h/2];
  };
  const [west,westY]=portalCentre('lobby-dispatch');
  const [east,eastY]=portalCentre('dispatch-security');
  // Each lane bends around the Lobby corner, traverses both Dispatch portals, then
  // fans into its own part of the queue. Deeper marks fill first within each lane.
  const ranks=[
    ['ed',1,0],['bob',0,.35],['jo',-1,.75],
    ['sam',1,2.35],['max',0,2.8],['gus',-1,3.1],
    ['lou',1,5.05],['kit',0,5.65],['mae',-1,5.6],['ben',0,8.25],
  ];
  const speed=1.55;
  const greeting=16.7, maxAtQueue=greeting-.3;
  const arrivals={};
  for(const [id,lane,gap] of ranks){
    const [qx,qy]=cast[id], offset=lane*1.45, x=doorX+offset;
    const bendX=126.65-offset, bendY=westY+offset;
    const start=[x+lane*(.35+gap*.10),entrance.y+4.9+gap];
    tracks[id]=[{t:0,p:start}];
    const crossed=walk(id,0,speed,[x,entrance.y+1.3],[x,entrance.y-.8]);
    const approach=walk(id,crossed,speed,[x,bendY+2],[x+2,bendY],[west,bendY],
      [east,eastY+offset],[bendX-2,eastY+offset],[bendX,eastY+offset+.65],
      [qx,gateY-12]);
    const queuePace = (id === 'bob' || id === 'max') ? 0.95 : 1.2;
    arrivals[id]=walk(id,approach,queuePace,[qx,qy]);
  }
  const start=maxAtQueue-arrivals.max;
  for(const [id] of ranks)for(const key of tracks[id])key.t+=start;
  tracks.LIMEN[0].t=start;
  // The edit falls after jo's reply. Hold the incoming approach in silence
  // as the workers take their final steps toward LIMEN.
  const morningCut={at:start+12.5,to:maxAtQueue-3.5,label:'Through Dispatch to Security'};
  walk('bob',22,.95,atGate(-1.85,-3.75));
  walk('bob',26.9,1,atGate(-2.1,-4));
  walk('sam',26.6,1.25,atGate(-2.95,-4.3));
  walk('ed',26.9,1.20,atGate(-3.84,-4.7));
  walk('ed',31,1.1,atGate(-3.95,-5.7));
  // STILETTO comes in from the street after the crew, travelling on their east side
  // in Security. Set her stride from the distance to her speaking mark.
  const supervisorStart=morningCut.at+0.5; // Enter from the yard after the crew’s exterior shot.
  const street=cast.STILETTO;
  const request=atGate(3.45,-6.25), requestAt=28.9;
  const path=[[doorX-1.5,entrance.y+1.15],[doorX-1.45,entrance.y-.8],
    [doorX-1.45,westY+.55],[doorX+.55,westY-1.45],[west,westY-1.45],
    [east,eastY-1.45],[129.45,eastY-1.45],[131.45,eastY+.55],request];
  const distance=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
  const length=path.reduce((metres,p,i)=>metres+distance(i?path[i-1]:street,p),0);
  const stride=length/(requestAt-supervisorStart);
  tracks.STILETTO=[{t:supervisorStart,p:street}];
  const atRequest=walk('STILETTO',supervisorStart,stride,...path);
  const throughGate=walk('STILETTO',atRequest,stride,atGate(1.9,-5.1),atGate(0.35,-4.45),atGate(0.15,-2.9),atGate(0.15,2.1));
  walk('STILETTO',throughGate,stride,forgeDoor,lineApproach,[124.4,139.4],[122.4,142.25]);
  const gate = {...floor.gate};
  const atPost = walk('LIMEN',requestAt,1.4,floor.contact.patrolPost);
  const openAt = atPost + .75;
  const threatEnd = 138.05;
  gate.openings = [[atPost,openAt,44,44.75],[77,77.6,84,84.6],[109.5,110.1,121,121.6],
    [threatEnd-.4,threatEnd+.2,150,150.6],[167,167.6,Infinity,Infinity]];
  gate.hold = {start:atPost, end:throughGate+.6};
  walk('LIMEN',gate.hold.end,1.4,atGate(-1.2,-2.7));
  walk('bob',37.25,1.95,atGate(-0.2,-3.55),threshold,[126.9,137.6],[126.5,138.8],[121,140.2],intake);
  walk('sam',39,1.1,atGate(-2.35,-3.2));
  walk('STILETTO',53,1.4,[120.7,143.45]);
  walk('STILETTO',57,1.5,[122.3,143],[124.5,142.5]);
  walk('bob',58.2,.98,wash);
  walk('bob',65.2,1.1,belt);
  walk('STILETTO',65,1.45,[128.6,142.5]);
  walk('bob',71.5,1.12,forge);
  walk('STILETTO',71.1,1.5,[132.45,142.55]);
  // Clear sam while the first cortex lands. The front of the queue advances around the desks.
  walk('sam',77.8,1.72,atGate(-2.5,-1.2),atGate(-2,0.3),[126.1,138.6],[122.1,142.05]);
  walk('jo',78,1.05,atGate(0.6,-5.2));
  walk('max',79,1,atGate(-0.9,-6));
  walk('gus',89.4,1.4,atGate(1.75,-5.9),atGate(2.4,-4.6),checks);
  walk('ed',89.2,1.15,atGate(-4.45,-4.75),register);
  walk('jo',92.7,1.30,atGate(-0.2,-3.3));
  walk('sam',99,1.45,intake);
  walk('bob',109.5,1.2,wash);
  walk('jo',110,1.7,threshold,[128.75,138.8],[126.8,142.5]);
  // The fourth check stays at the photo reader. STILETTO comes back to them.
  walk('LIMEN',110.9,1.55,floor.contact.fourthClerk);
  walk('max',111.5,1.55,floor.contact.photo);
  walk('bob',118,1.18,belt);
  walk('bob',123.4,1.17,forge);
  walk('STILETTO',125.7,2.20,[130.2,139.6],threat);
  walk('max',threatEnd-.1,3.9,atGate(1.1,0),[129.45,138.8],[132.75,142.45]);
  walk('bob',140.4,1.6,wash);
  walk('jo',144.3,1.6,belt);
  walk('max',143.7,1.6,forge);
  // Each stamp releases a worker while the next card is already on its way.
  const crew=[
    ['mae',137.7,140.6,[116.9,143.9]],
    ['kit',139.1,142.3,[128.95,144.4]],
    ['lou',140.8,144.0,witness],
    ['ben',142.4,145.7,[136.8,142.9]],
  ];
  const stamps=[];
  for(const [id,advance,clear,dest] of crew) {
    const atDesk=walk(id,advance,3.9,atGate(-.1,-4.7),floor.contact.photo);
    stamps.push([atDesk,clear,'LIMEN','stamps '+id+'’s card']);
    walk(id,clear,4.4,atGate(1.1,0),[128.5,138.85],[dest[0],142.1],dest);
  }
  walk('STILETTO',139.0,2.25,[130.7,138.9],[136.8,139.05]);
  walk('STILETTO',149.6,2.25,[133.4,141.25]);
  // The bell starts an unauthorized walkout. STILETTO catches the crew in motion,
  // then they recover after one beat and answer on the move. She calls after them.
  const bell=165.8;
  // Turn to the register for the checkout count when the shift bell rings.
  walk('LIMEN',bell+.3,1.55,atGate(-1.2,-2.7));
  const call=bell+3.0;
  const resume=call+1.2;
  const dismissal=call+4.9;
  const shutdown={mae:bell+1.0,kit:bell+1.2};
  const departures=[
    {id:'mae',spacing:2,at:resume+.12,turn:bell+1.3,brake:call+.22,lane:-1},
    {id:'sam',spacing:0.45,at:resume+.14,turn:bell+.55,brake:call+.24,lane:0},
    {id:'bob',spacing:0.8,at:resume+.22,turn:bell+.65,brake:call+.32,lane:-1},
    {id:'jo',spacing:0.12,at:resume+.02,turn:bell+.25,brake:call+.12,lane:1},
    {id:'kit',apronY:140.5,spacing:2.35,at:resume+.18,turn:bell+1.5,brake:call+.28,lane:1},
    {id:'max',spacing:0.65,at:resume,turn:bell+.4,brake:call+.10,lane:-1},
    {id:'lou',spacing:0.25,at:resume+.08,turn:bell+.35,brake:call+.18,lane:-1},
    {id:'ben',apronY:139.25,spacing:0.95,at:resume+.10,turn:bell+.80,brake:call+.20,lane:1},
  ];
  const reader=floor.contact.reader, merge=[126.35,138.85], walkSpeed=1.55;
  const viaReader=[atGate(-1.65,-0.9),atGate(-2.5,-2.5),reader];
  for(const worker of departures){
    const {id,at,turn,brake}=worker;
    const [x,y]=tracks[id].at(-1).p;
    // The shout catches a step for a moment; the replies continue along the exit route.
    walk(id,turn,3/(brake-turn),[x,y-3]);
    worker.apron=[x,139.8];
    // Recover into different walking rhythms while retaining the clear merge slots.
    const approach=distance([x,y-3],worker.apron);
    worker.onApron=call+1+worker.spacing+approach/walkSpeed;
    worker.atMerge=worker.onApron+distance(worker.apron,merge)/walkSpeed;
    // Stagger the turn corners within the open aisle as the group regains its stride.
    if(worker.apronY!==undefined)worker.apron[1]=worker.apronY;
  }
  departures.sort((a,b)=>a.atMerge-b.atMerge);
  const tallies=[];
  let mergeFree=0;
  for(const worker of departures){
    const crossing=Math.max(worker.atMerge,mergeFree);
    const approach=distance(tracks[worker.id].at(-1).p,worker.apron);
    const toMerge=distance(worker.apron,merge);
    // Spread the reader spacing over the whole approach so nobody stalls or creeps.
    const pace=(approach+toMerge)/(crossing-worker.at);
    worker.onApron=walk(worker.id,worker.at,pace,worker.apron);
    walk(worker.id,worker.onApron,pace,merge);
    worker.counted=walk(worker.id,crossing,3.15,...viaReader);
    tallies.push(worker.counted);
    mergeFree=crossing+1.12;
  }
  let eight=tallies.at(-1);
  // Parallel foot traffic can spread within both six-metre Dispatch openings.
  const corridor=[atGate(-6.85,-6.05),[120.4,114.3],...floor.egress.slice(2,5),[doorX-.1,westY+4],[doorX-.1,entrance.y+1.3]];
  function laneThroughLobby(lane){
    // Offset both straight runs at each corner so neighbouring paths stay parallel around bends.
    const normals=corridor.slice(1).map(([x,y],i)=>{
      const [px,py]=corridor[i], length=distance(corridor[i],[x,y]);
      return [(y-py)/length,(px-x)/length];
    });
    return corridor.map(([x,y],i)=>{
      if(i===0)return [x,y];
      const a=normals[i-1], b=normals[i]||a;
      const m=lane*1.18/(1+a[0]*b[0]+a[1]*b[1]);
      return [x+(a[0]+b[0])*m,y+(a[1]+b[1])*m];
    });
  }
  function walkOut(id,start,lane,speed=1.6){
    return walk(id,start,speed,atGate(-4,-6),...laneThroughLobby(lane));
  }
  const streetTime={};
  for(const {id,counted,lane} of departures)streetTime[id]=walkOut(id,counted,lane);
  // gus closes his desk and catches max. LIMEN passes ed during the offer. ed leaves after pocketing the pen.
  const maxCheck=departures.find(worker=>worker.id==='max').counted;
  walk('gus',maxCheck+2.75,1.6,atGate(1.6,-5.8),atGate(-2.4,-5.6));
  streetTime.gus=walkOut('gus',tracks.gus.at(-1).t,1);
  streetTime.LIMEN=walkOut('LIMEN',eight+2.05,-1);
  streetTime.ed=walkOut('ed',eight+5.85,0,1.68);
  walk('STILETTO',eight-8.0,2.15,[130.0,138.8],atGate(1.6,1.7),atGate(1.6,-0.8),atGate(1.6,-3.4));
  streetTime.STILETTO=walkOut('STILETTO',eight+2.5,1);
  let yard=Math.max(streetTime.max,streetTime.gus)+3.5;
  // Workers continue across the yard in different directions during the exchange.
  const streetRoutes={
    sam:[-12.5,21],bob:[-11.5,23],jo:[2.3,25],kit:[5.8,20],mae:[-16.5,17],lou:[-20.5,13],
    ben:[3.9,27],LIMEN:[-12.5,12],STILETTO:[6.5,14],ed:[-4.2,18],
  };
  for(const [id,destination] of Object.entries(streetRoutes)){
    walk(id,streetTime[id],id==='ed'?1.35:1.45,[doorX+destination[0],entrance.y+destination[1]]);
  }
  for(const [id,x] of [['max',doorX-.3],['gus',doorX+1.05]]){
    const join=[x,entrance.y+(id==='gus'?6.65:6.4)];
    const from=tracks[id].at(-1).p;
    walk(id,streetTime[id],distance(from,join)/(yard-streetTime[id]),join);
    walk(id,yard,1.10,[x+2.5,join[1]+15.4]);
  }
  // Hurry the entire exit procession together, preserving every clearance and the brief freeze.
  // Resume normal acting pace for the yard exchange; speech keeps its own reading time.
  const exitPace=2.4, fastStart=Math.max(...departures.map(worker=>worker.at)), yardArrival=yard;
  const exitTime=t=>t<=fastStart?t:t<yardArrival
    ?fastStart+(t-fastStart)/exitPace
    :fastStart+(yardArrival-fastStart)/exitPace+t-yardArrival;
  for(const track of Object.values(tracks)){
    const corners=[fastStart,yardArrival].filter(t=>t>track[0].t && t<track.at(-1).t && !track.some(k=>k.t===t))
      .map(t=>({t,p:samplePath(track,t).p}));
    track.push(...corners);track.sort((a,b)=>a.t-b.t);
    for(const key of track)key.t=exitTime(key.t);
  }
  for(const worker of departures){
    for(const field of ['at','turn','brake','onApron','atMerge','counted'])worker[field]=exitTime(worker[field]);
  }
  for(let i=0;i<tallies.length;i++)tallies[i]=exitTime(tallies[i]);
  for(const id of Object.keys(streetTime))streetTime[id]=exitTime(streetTime[id]);
  eight=exitTime(eight);yard=exitTime(yard);
  // Finish ed's line, allow one small transition beat, then pick up max outside.
  const cuts=[morningCut,{at:eight+3.35,to:yard-.55,label:'Outside the Lobby'}];
  const end=yard+11.4;
  const editTime=w=>w-start-cuts.reduce((skip,c)=>skip+Math.max(0,Math.min(w,c.to)-c.at),0);
  function worldTime(t) {
    let w=start+t;
    for(const c of cuts){
      const boundary=editTime(c.at);
      if(t<boundary)break;
      w=c.to+(t-boundary);
    }
    return w;
  }
  const beats=[
    [start,'The morning walk','entrance'],[greeting,'At the gate','gate'],[25.4,'The fallen card','passage'],[40.5,'The first brain','line'],
    [77,'Two volunteers','gate'],[95.7,'The second brain','line'],[125.5,'The fourth check','checkpoint'],
    [138.7,'The crew fills in','wide'],[151.4,'Run it','follow'],[bell,'End of shift','release'],
    [tallies[0]-.7,'The register','gate'],[cuts[1].at,'Outside','yard'],
  ].map(([at,name,view])=>({at,name,view}));
  const windows=[
    [start,start+3.1],[start+3.05,start+3.85],[start+3.95,start+5.2],[start+5.35,start+12.05],
    [greeting,19.9],
    [20,22.9],[22.9,25.1],[25.1,27.3],[requestAt,31.2],[32.8,35.3],[35.4,38.3],
    [40.9,45.2],[45.4,48.1],[48.2,51.5],[55.2,58.1],[63.8,68.1],[70.4,73.7],
    [77.2,78.7],[79.3,82],[82.2,85.2],[85.4,90],[85.55,90.25],[85.85,90.5],[86.1,91.3],
    [93,95.35],[95.8,97.8],[97.9,101.6],[102,104],[104.1,106.9],[107,110.3],
    [119.7,122.2],[122.3,126.9],[131.45,threatEnd],[151.5,153.1],[163.4,165.6],
    [bell,bell+1.65],
    [call,call+1.25],
    [call+1.3,call+4.35],[call+1.45,call+4.55],[call+1.6,call+4.7],[call+1.75,call+4.8],
    [dismissal,dismissal+2.6],
    [eight+.1,eight+3.2],[yard+.1,yard+3.2],[yard+3.3,yard+5],[yard+5.4,yard+9.4],
  ];
  if(windows.length!==script.length) throw Error('Approved dialogue changed; retime the score.');
  const speech=windows.map(([start,end],i)=>({...script[i],start,end}));
  // Action spells are independent of speech; the cast can act through a line.
  const cues=[
    [start,start+3,'max','draws his jaw into his collar'],[morningCut.to,morningCut.to+1.8,'max','clicks his jaw'],[19.4,21.4,'bob','laughs'],
    [23.2,25.4,'bob','offers his card'],[26.35,27.35,'LIMEN','strikes bob’s leg'],
    [26.75,32,'sam','kneels beside bob'],[27.45,30.1,'ed','stops the card with his boot'],[30.1,31.5,'ed','pockets the card'],
    [gate.hold.start,gate.hold.end,'LIMEN','holds the gate'],[32,35.1,'bob','gets his weight back'],
    [40,77.8,'LIMEN','checks sam’s ID'],[51,53,'bob','pulls the loader'],[53,55.8,'bob','finishes the pull seated'],
    [54.7,56.9,'STILETTO','inspects the cradle'],[56.9,60,'bob','pulls himself up by the rail'],
    [61.7,64.9,'bob','rinses the grit away'],[68.6,70.8,'bob','clamps the cradle and starts the drive'],
    [75,77,'bob','closes the press'],[89.1,92.5,'LIMEN','turns the register'],[91.8,95.4,'gus','holds the second desk'],
    [101.7,108.9,'bob','faces the jammed press'],[108.9,110.3,'bob','knocks the press door free'],
    [101.5,106,'sam','loads a full tray'],[115.8,118.5,'bob','runs Wash'],[121,123.6,'bob','starts the belt'],
    [126.6,129,'bob','closes the press'],[131.1,threatEnd,'LIMEN','compares the photo to max'],
    [131.1,139.6,'STILETTO','points both blades at LIMEN'],[threatEnd,140.5,'max','ducks under the blade'],
    ...stamps,
    [146.3,150.3,'mae','slides a tray to sam'],[147,151,'kit','feels the drive housing'],
    [153.1,155.4,'sam','feeds the third brain'],[155.6,158,'bob','washes it'],[158.2,160.5,'jo','clamps and starts the belt'],
    [160.7,163.1,'max','drops the press'],
    [bell,shutdown.mae,'mae','cuts the feed'],[bell,shutdown.kit,'kit','stops the drive'],
    ...departures.map(({id,turn,brake})=>[turn,brake,id,'breaks for the door']),
    [call,call+.5,'STILETTO','catches the crew mid-step'],
    [call+.5,resume,'STILETTO','gets a momentary freeze'],
    ...departures.map(({id,at})=>[at,dismissal+2.6,id,'keeps walking']),
    [dismissal,dismissal+2.6,'STILETTO','waves after their backs'],
    [eight,eight+3.2/exitPace,'ed','offers LIMEN the register'],[eight+3.3/exitPace,eight+6/exitPace,'ed','clips his pen beside bob’s card'],
    [yard+5.1,yard+8,'max','pulls his jaw back'],[yard+9.4,yard+11.1,'ed','laughs first'],
  ].map(([start,end,actor,label])=>({start,end,actor,label}));
  // Each knot is the physical centre of a cradle. Finished cortexes keep individual rack slots.
  const xs=floor.stations.map(q=>q.x);
  function product(id,times,slot) {
    const points=[...xs.map(x=>[x,floor.forgeHall.carrierY]),floor.contact.outputSlots[slot]];
    return {id,keys:times.map(([at,index])=>({t:at,p:points[index]}))};
  }
  const products=[
    product(1,[[0,0],[55.1,0],[60.8,1],[64.8,1],[68.4,2],[70,2],[73.9,3],[76,3],[77,4]],0),
    product(2,[[101.5,0],[106,0],[114.9,1],[118,1],[121,2],[122.8,2],[126.1,3],[127.1,3],[128.1,4]],1),
    product(3,[[113.5,0],[154.8,0],[156.1,1],[157.8,1],[158.8,2],[160.3,2],[161.6,3],[162.4,3],[163.2,4]],2),
  ];
  return {start,cast,tracks,beats,speech,cues,gate,products,departures,streetTime,yard,bell,call,shutdown,resume,dismissal,exitPace,tallies:tallies.sort((a,b)=>a-b),cuts,end,editTime,duration:editTime(end),worldTime};
}

export function samplePath(keys,t) {
  const first=keys[0].p;
  if(t<keys[0].t)return {p:first,moving:false,from:first,to:first};
  let i=0;
  while(i+1<keys.length && keys[i+1].t<=t) i++;
  const a=keys[i], b=keys[i+1];
  if(!b||b.t===a.t)return {p:a.p,moving:false,from:a.p,to:a.p};
  const f=Math.max(0,(t-a.t)/(b.t-a.t));
  return {p:[a.p[0]+(b.p[0]-a.p[0])*f,a.p[1]+(b.p[1]-a.p[1])*f],moving:a.p[0]!==b.p[0]||a.p[1]!==b.p[1],from:a.p,to:b.p};
}

// A boom lifts vertically at the west post. Its overhead projection shrinks as it rises.
export function gateTipAt(gate, t) {
  const opening = gate.openings.find(([start,,,closed]) => start <= t && t < closed);
  let angle = 0;
  if (opening) {
    const [start, open, release, closed] = opening;
    const fraction = t < open ? (t-start)/(open-start) : t <= release ? 1 : (closed-t)/(closed-release);
    angle = fraction * Math.PI / 2;
  }
  return [gate.hinge[0] + gate.length*Math.cos(angle), gate.hinge[1]];
}
