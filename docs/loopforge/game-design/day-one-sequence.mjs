// One score for playback, seeking, recording and Scene Direction. Times are seconds.
// Movement uses floor metres and real walking speeds, even across the marked edit.
export function makeSequence(floor, script) {
  const cast = {
    bob: [126.2,121.5], sam: [125.1,121.1], ed: [124.2,121.9], max: [127.3,120.7],
    jo: [128.7,120.6], gus: [129.4,118.9], mae: [127.7,118.9], kit: [126.3,118.6],
    lou: [124.7,117.5], ben: [126,117], LIMEN: [125.32,125.13], STILETTO: [132,118.3],
  };
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
  const threshold=[128.4,128.1], threat=floor.anchors[0].floor;
  // Morning count. The line bunches around max while the supervisor overtakes it on the east.
  for (const [id,p] of Object.entries(cast).filter(([id])=>id!=='LIMEN'&&id!=='STILETTO')) {
    tracks[id][0].p=[p[0],p[1]-1.35];
    walk(id,.15,.67,p);
  }
  walk('bob',22,.95,[126.15,124.25]);
  walk('bob',26.9,1,[125.9,124]);
  walk('sam',26.6,1.25,[125.05,123.7]);
  walk('ed',26.9,1.20,[124.16,123.3]);
  walk('ed',31,1.1,[124.05,122.3]);
  // She approaches outside the queue and waits on the east side of the desk aisle.
  // He leaves the checking position, works the west post, and only then releases her lane.
  const gate = {hinge:[floor.doorway.x + .15, floor.doorway.y + .85], length:3.50};
  walk('STILETTO',24.6,1.65,[131.25,121.9],[128.35,123.55]);
  const atPost = walk('LIMEN',29.2,1.4,[125.75,127.05]);
  const openAt = atPost + .75;
  gate.openings = [[atPost,openAt,44,44.75],[77,77.6,84,84.6],[109.5,110.1,116,116.6],
    [139,139.6,164,164.6],[181,181.6,Infinity,Infinity]];
  const throughGate = walk('STILETTO',openAt,1.75,[128.15,125.1],[128.15,130.1]);
  walk('STILETTO',throughGate,1.75,[124.4,132.2],[120.8,132.25]);
  gate.hold = {start:atPost, end:throughGate+.6};
  walk('LIMEN',gate.hold.end,1.4,[126.8,125.3]);
  walk('bob',37.8,1.15,[127.8,124.45],threshold,[127.1,130.2],[121.2,133],intake);
  walk('sam',39,1.1,[125.65,124.8]);
  walk('STILETTO',53,1.4,[120.7,133.45]);
  walk('STILETTO',57,1.5,[122.3,133],[124.5,132.5]);
  walk('bob',58.2,.98,wash);
  walk('bob',65.2,1.1,belt);
  walk('STILETTO',65,1.45,[128.6,132.5]);
  walk('bob',71.5,1.12,forge);
  walk('STILETTO',71.1,1.5,[132.45,132.55]);
  // Clear sam while the first cortex lands. The front of the queue advances around the desks.
  walk('sam',77.8,1.42,[125.5,126.8],[126,128.3],[125.8,131.1],[122.1,132.05]);
  walk('jo',78,1.05,[128.6,122.8]);
  walk('max',79,1,[127.1,122]);
  walk('gus',89.4,1.4,[129.75,122.1],[130.4,123.4],checks);
  walk('ed',89.2,1.15,[123.55,123.25],register);
  walk('jo',92.7,1.30,[127.8,124.7]);
  walk('sam',99,1.45,intake);
  walk('bob',109.5,1.2,wash);
  walk('jo',110,1.45,threshold,[128.75,130.8],[126.8,132.5]);
  walk('max',111.5,1.10,[127.65,124.8]);
  walk('bob',118,1.18,belt);
  walk('bob',123.4,1.17,forge);
  walk('STILETTO',127.9,1.75,[132.5,130.8],threat);
  walk('max',139.3,1.45,[128.3,126.5],[128.55,127.85],[129,129.6],[132.75,132.45]);
  walk('bob',141.0,1.08,wash);
  walk('jo',146,1.2,belt);
  walk('max',147.3,1.25,forge);
  // Four checks overlap the previous worker's walk to the line.
  const crew=[
    ['mae',139.9,145.5,[116.9,133.9]],
    ['kit',142.8,148.9,[128.95,134.4]],
    ['lou',145.8,152.4,witness],
    ['ben',149.4,155.9,[136.8,132.9]],
  ];
  for(const [id,advance,clear,dest] of crew) {
    walk(id,advance,1.5,[127,122.8],[127.6,124.65]);
    walk(id,clear,1.55,[128.2,126.75],threshold,[128.5,130.45],[dest[0],132.1],dest);
  }
  walk('STILETTO',156.9,1.5,[132.4,129.4],[133.4,129.4]);
  // Departure uses the checkpoint and both Dispatch portals. Each physical crossing
  // is counted at the register. The same route continues beyond the edit to the yard.
  const dispatch=floor.egress.slice(2);
  const finalOrder=['jo','kit','bob','max','sam','lou','mae','ben'];
  const tallies=[];
  function returnThroughLobby(id,start,slot,clerk=false) {
    const angle=(12+slot*14)*Math.PI/180;
    const dest=[72.5+9*Math.cos(angle),130.4+9*Math.sin(angle)];
    let leave=start;
    if (!clerk) {
      const from=tracks[id].at(-1).p;
      let t=walk(id,start,1.55,[from[0],132],[126.35,130.1],[126.35,127.1]);
      const counted=walk(id,t,1.55,[125.5,125.5],[125,124.3]);
      tallies.push(counted);
      leave=counted;
    }
    walk(id,leave,1.6,[124,122],[121.7,121.9],[120.8,114.4],...dispatch.slice(0,-1),[72.5,129.4],[72.5,130.4],dest);
  }
  finalOrder.forEach((id,i)=>returnThroughLobby(id,181+i*3.65,i>=4?i+1:i));
  const eight=Math.max(...tallies);
  returnThroughLobby('LIMEN',eight+2.7,10,true);
  returnThroughLobby('ed',eight+6.1,11,true);
  returnThroughLobby('gus',eight+10.5,4,true);
  walk('STILETTO',eight-3,1.55,[129,129.7],[129,127.2],[128.8,124.5]);
  returnThroughLobby('STILETTO',eight+13.7,9,true);
  const yard=Math.max(...Object.values(tracks).map(track=>track.at(-1).t))+1;
  const cuts=[{at:tallies[0]+1.7,to:tallies.at(-2)-1.8,label:'Later at the register'},{at:eight+9,to:yard-3,label:'Outside the Lobby'}];
  for (const id of ['max','gus']) {
    const [x,y]=tracks[id].at(-1).p;
    walk(id,yard,1.1,[x,y+1.5],[x-.4,y+3.4]);
  }
  const end=yard+13.4;
  const editTime=w=>w-cuts.reduce((skip,c)=>skip+Math.max(0,Math.min(w,c.to)-c.at),0);
  function worldTime(t) {
    let w=t;
    for(const c of cuts)if(w>=c.at-1e-8)w+=c.to-c.at;
    return w;
  }
  const beats=[
    [0,'At the gate','gate'],[25.4,'The fallen card','passage'],[40.5,'The first brain','line'],
    [77,'Two volunteers','gate'],[95.7,'The second brain','line'],[130,'The fourth check','door'],
    [143,'The crew fills in','wide'],[165.4,'Run it','follow'],[179.8,'End of shift','wide'],
    [cuts[0].at,'The register','gate'],[cuts[1].at,'Outside','yard'],
  ].map(([at,name,view])=>({at,name,view}));
  const windows=[
    [1,4.2],[4.1,5.6],[5.6,7.2],[7.3,13.4],[13.6,15.3],[15.4,16.8],[16.7,19.9],
    [20,22.9],[22.9,25.1],[25.1,27.3],[28.9,31.2],[32.8,35.3],[35.4,38.3],
    [40.9,45.2],[45.4,48.1],[48.2,51.5],[55.2,58.1],[63.8,68.1],[70.4,73.7],
    [77.2,78.7],[79.3,82],[82.2,85.2],[85.4,90],[85.55,90.25],[85.85,90.5],[86.1,91.3],
    [93,95.35],[95.8,97.8],[97.9,101.6],[102,104],[104.1,106.9],[107,110.3],
    [119.7,122.2],[122.3,126.9],[131.45,139.4],[165.5,167.1],[177.4,179.6],
    [eight+.1,eight+3.2],[yard+.1,yard+3.2],[yard+3.3,yard+5],[yard+5.4,yard+9.4],
  ];
  if(windows.length!==script.length) throw Error('Approved dialogue changed; retime the score.');
  const speech=windows.map(([start,end],i)=>({...script[i],start,end}));
  // Action spells are independent of speech; the cast can act through a line.
  const cues=[
    [0,3,'max','draws his jaw into his collar'],[13,16.6,'max','clicks his jaw'],[19.4,21.4,'bob','laughs'],
    [23.2,25.4,'bob','offers his card'],[26.35,27.35,'LIMEN','strikes bob’s leg'],
    [26.75,32,'sam','kneels beside bob'],[27.45,30.1,'ed','stops the card with his boot'],[30.1,31.5,'ed','pockets the card'],
    [gate.hold.start,gate.hold.end,'LIMEN','holds the gate'],[32,35.1,'bob','gets his weight back'],
    [40,77.8,'LIMEN','checks sam’s ID'],[51,53,'bob','pulls the loader'],[53,55.8,'bob','finishes the pull seated'],
    [54.7,56.9,'STILETTO','inspects the cradle'],[56.9,60,'bob','pulls himself up by the rail'],
    [61.7,64.9,'bob','rinses the grit away'],[68.6,70.8,'bob','clamps the cradle and starts the drive'],
    [75,77,'bob','closes the press'],[89.1,92.5,'LIMEN','turns the register'],[91.8,95.4,'gus','holds the second desk'],
    [101.7,108.9,'bob','faces the jammed press'],[108.9,110.3,'bob','knocks the press door free'],
    [101.5,106,'sam','loads a full tray'],[115.8,118.5,'bob','runs Wash'],[121,123.6,'bob','starts the belt'],
    [126.6,129,'bob','closes the press'],[131.1,139.4,'LIMEN','compares the photo to max'],
    [131.1,139.6,'STILETTO','points both blades at LIMEN'],[139.4,141.8,'max','ducks under the blade'],
    ...crew.map(([id,,clear])=>[clear-1.5,clear,'LIMEN','stamps '+id+'’s card']),
    [157,161,'mae','slides a tray to sam'],[160,165,'kit','feels the drive housing'],
    [167.1,169.4,'sam','feeds the third brain'],[169.6,172,'bob','washes it'],[172.2,174.5,'jo','clamps and starts the belt'],
    [174.7,177.1,'max','drops the press'],[179.8,182.3,'mae','cuts the feed'],[179.8,182.5,'kit','stops the drive'],
    [eight, eight+3.2,'ed','offers LIMEN the register'],[eight+3.3,eight+6,'ed','clips his pen beside bob’s card'],
    [yard+5.1,yard+8,'max','pulls his jaw back'],[yard+9.4,yard+12,'ed','laughs first'],
  ].map(([start,end,actor,label])=>({start,end,actor,label}));
  // Each knot is the physical centre of a cradle. Finished cortexes keep individual rack slots.
  const xs=floor.stations.map(q=>q.x);
  function product(id,times,slot) {
    const points=[...xs.map(x=>[x,136]),[135.05+slot*.55,136]];
    return {id,keys:times.map(([at,index])=>({t:at,p:points[index]}))};
  }
  const products=[
    product(1,[[0,0],[55.1,0],[60.8,1],[64.8,1],[68.4,2],[70,2],[73.9,3],[76,3],[77,4]],0),
    product(2,[[101.5,0],[106,0],[114.9,1],[118,1],[121,2],[122.8,2],[126.1,3],[127.1,3],[128.1,4]],1),
    product(3,[[113.5,0],[168.8,0],[170.1,1],[171.8,1],[172.8,2],[174.3,2],[175.6,3],[176.4,3],[177.2,4]],2),
  ];
  return {cast,tracks,beats,speech,cues,gate,products,tallies:tallies.sort((a,b)=>a-b),cuts,end,editTime,duration:editTime(end),worldTime};
}

export function samplePath(keys,t) {
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
