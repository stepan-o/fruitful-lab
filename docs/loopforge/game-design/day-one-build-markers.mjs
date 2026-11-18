// Day 1 blockout handoff. x increases east, y increases south, dimensions are metres.
// Reuse the playable fixture rectangles so a footprint edit also moves its handoff pin.
export function makeBuildMarkers(floor, score) {
  const {gate,cast}=score;
  const markers = [];
  function mark(id, room, name, rect, base, height, build) {
    markers.push({id, room, name, rect, base, height, build});
  }
  function fixture(id, room, name, source, height, build) {
    mark(id, room, name, floor.fixtures.find(f => f.id === source).rect, 0, height, build);
  }
  fixture('S1','Security','West queue rail','west-rail',1.12,
    'Run two scuffed steel tubes north–south. Bolt three banded posts to the deck. Hang inspection tags on the outside face.');
  fixture('S2','Security','East queue rail','east-rail',1.12,
    'Instance the west rail here. End both rails before the desks. STILETTO approaches along its outside and turns in beyond its south end.');
  fixture('S3','Security','Register and pen clip','register',1.02,
    'Face the clerk north. Seat an open paper ledger in a recessed lip. Keep its near edge within reach when LIMEN turns it toward ed.');
  fixture('S4','Security','Card drain','grate',0,
    'Set a slotted grate flush with the deck. Recess the slats below the rim so bob’s card can skid across to ed’s boot.');
  fixture('S5','Security','ID checking desk','checks',1.02,
    'Face the clerk north. Block in a sloped photo reader and a pale card tray. Leave the aisle between the desks open.');
  mark('S6','Security','Lift gate and west control post',
    {x:gate.hinge[0]-.17,y:gate.hinge[1]-.17,w:gate.length+.34,h:.34},0,gate.length+1.05,
    'Anchor the pivot at the west end, 1.05 m above the deck. Raise the boom vertically. LIMEN works the post from Security. STILETTO calls from the east aisle and walks through the raised span without breaking stride.');
  mark('S7','Security','Intake sign and strip light',
    floor.checkpointMarks.S7,2.65,.48,
    'Suspend a blackened steel BLUE-COLLAR INTAKE sign above the queue. Face it north toward arrivals. Tuck one cold tube under its hood.');
  mark('S8','Security','Visitor hold sign and strip light',
    floor.checkpointMarks.S8,2.65,.48,
    'Hang VISITOR-CONTRACTOR HOLD beside the intake sign, facing north. Keep the approach underneath clear. This sign identifies the waiting side of Security.');
  function carried(id,name,actor,w,h,thickness,build){
    const [x,y]=cast[actor];
    mark(id,'Security',name,{x:x-w/2,y:y-h/2,w,h},0,thickness,build);
    markers.at(-1).mount=actor+' · inspection mark';
  }
  carried('S9','LIMEN’s cyan blade','LIMEN',.12,1.12,.06,
    'Mount to LIMEN’s forearm. Give the pale cutting edge a darker teal spine. Pose it low at rest so the sweep toward bob’s leg reads against the steel floor.');
  carried('S10','Worker credential','bob',.22,.28,.003,
    'Instance a worn paper credential for the queue. Give bob’s copy two states, held and loose, so it leaves his hand, skids to the grate, then disappears into ed’s pocket.');
  mark('S11','Security','Riveted checkpoint deck',floor.checkpointMarks.S11,-.08,.08,
    'Tile the receiving pen with dark steel panels and bolted seams. The top sits flush with the surrounding floor and drain. Leave the moving cast readable against it.');
  fixture('C1','Conveyor','Intake loader','intake',1.25,
    'Block in the longitudinal rails, hand lever and low motor housing. Leave room on the operator side for bob to sit down and pull.');
  fixture('C2','Conveyor','Wash basin','wash',1.10,
    'Inset a steel trough and overhead spray manifold. Face the hand control north so bob can reach it from the working aisle.');
  fixture('C3','Conveyor','Main belt and cradle clamp','belt',1.05,
    'Run rollers east–west. Put a working clamp and start paddle on the north side. Keep the cradle continuous across the station seams.');
  fixture('C4','Conveyor','Forge press','forge',5.80,
    'Build the guards and moving press door around the cradle centerline. Give the north face a readable handle for the jam and release.');
  fixture('C5','Conveyor','Output rack','output',1.05,
    'Continue the belt into three visible rack slots. Keep the north aisle open for the crew to see the finished cortexes.');
  floor.forgeHall.installations.forEach((item,i)=>{
    mark('H'+(i+1),'Forge hall',item.name,item.rect,0,item.height,item.build);
  });
  const crane=floor.forgeHall.crane;
  mark('H8','Forge hall',crane.name,crane.rect,crane.base,crane.height,crane.build);
  const road=floor.forgeHall.runs.find(q=>q.id==='transfer');
  mark('H9','Forge hall',road.name,road.rect,0,0,'Stripe the six-metre clear road from receiving to the eastern transfer lane. Keep it open in front of each overhaul bay.');
  const door=floor.exit;
  mark('E1','Factory entrance','Open staff doors',{x:door.x,y:door.y-.22,w:door.w,h:.44},0,4.0,
    'Set a recessed double steel door in the south Lobby wall. Park both leaves behind the side jambs during arrivals and departures. Keep the full staff opening clear.');
  mark('E2','Factory entrance','Loopforge sign and lamps',{x:door.x-.85,y:door.y-.46,w:door.w+1.7,h:.46},4.25,1.4,
    'Hang the curved LOOPFORGE / AI BRAIN FACTORY sign above the doors, facing south toward the yard. Put a warm lamp at either end so the opening reads from across the wet apron.');
  return markers;
}
