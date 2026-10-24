import type {EquipmentPlacement} from '../spatial/equipment';
import type {ZoneId} from '../spatial/floor';
export type ArrivalRoomFixture=Omit<EquipmentPlacement,'room'>&{room:ZoneId};
/** Metres, x east/y south. The Lobby navigation rectangle includes the outdoor approach. */
export const ARRIVAL_ROOMS={
 height:6.8,lobbyInterior:{x:116,y:111,w:16,h:11},approach:{x:116,y:122,w:16,h:22},
 securityInterior:{x:120,y:103.5,w:8,h:7.5},securityConnector:{x:128,y:103.5,w:4,h:2.5},cardKeepClear:{x:121.7,y:111.15,w:4.2,h:2.35},
 publicSpine:{x:120.6,y:113.5,w:8.8,h:8.5},checkpointLane:{x:122.4,y:104.3,w:3.2,h:7.7},
 supervisorPocket:{x:126.8,y:108.2,w:1.2,h:1.8},
} as const;
export const LOBBY_CLAIM_DESKS=[{id:'claims-01',x:118.1,y:114.8},{id:'claims-02',x:118.1,y:118.9}] as const;
export const ARRIVAL_ROOM_FIXTURES:readonly ArrivalRoomFixture[]=[
 {id:'security-rear-records-volume',room:'security',kind:'records-bank',name:'Non-public records volume',footprint:{x:116,y:99,w:16,h:4.5},height:6.8,operator:{x:124,y:104.2}},
 {id:'security-east-records-volume',room:'security',kind:'records-bank',name:'Non-public east service volume',footprint:{x:128,y:106,w:4,h:4.82},height:6.8,operator:{x:127.3,y:109}},
 {id:'security-west-records-volume',room:'security',kind:'records-bank',name:'Non-public side records volume',footprint:{x:116,y:103.5,w:4,h:7.32},height:6.8,operator:{x:120.6,y:108}},
 {id:'lobby-west-wall',room:'lobby',kind:'records-bank',name:'Lobby west service wall',footprint:{x:116,y:111.3,w:.55,h:10.7},height:6.8,operator:{x:117.2,y:120.4}},
 {id:'lobby-east-wall',room:'lobby',kind:'records-bank',name:'Lobby east service wall',footprint:{x:131.45,y:111.3,w:.55,h:10.7},height:6.8,operator:{x:130.8,y:120.4}},
 {id:'lobby-facade-west-services',room:'lobby',kind:'records-bank',name:'Entrance west riser',footprint:{x:116,y:121.65,w:.8,h:1.2},height:6.8,operator:{x:117.4,y:123}},
 {id:'lobby-facade-east-services',room:'lobby',kind:'records-bank',name:'Entrance east riser',footprint:{x:131.2,y:121.65,w:.8,h:1.2},height:6.8,operator:{x:130.6,y:123}},
 ...LOBBY_CLAIM_DESKS.map(s=>({id:s.id,room:'lobby' as const,kind:'records-bank' as const,name:'Claim desk '+s.id.slice(-2),footprint:{x:s.x-.95,y:s.y-.6,w:1.9,h:1.2},height:1.65,operator:{x:s.x,y:s.y+1.25}})),
 {id:'lobby-forms-bank',room:'lobby',kind:'records-bank',name:'Forms and assignment cabinet',footprint:{x:130.3,y:112.2,w:1.1,h:2.6},height:2.6,operator:{x:129.6,y:113.5}},
 {id:'security-north-wall',room:'security',kind:'records-bank',name:'Security records wall',footprint:{x:116,y:99,w:16,h:.8},height:6.8,operator:{x:124,y:100.4}},
 {id:'security-west-wall',room:'security',kind:'records-bank',name:'Security service wall',footprint:{x:116,y:99.7,w:.55,h:11.3},height:6.8,operator:{x:117.2,y:108}},
 {id:'security-east-south-wall',room:'security',kind:'records-bank',name:'Conveyor portal south return',footprint:{x:131.65,y:106,w:.35,h:5},height:6.8,operator:{x:131,y:108}},
 {id:'security-east-north-wall',room:'security',kind:'records-bank',name:'Conveyor portal north return',footprint:{x:131.65,y:99.7,w:.35,h:2.3},height:6.8,operator:{x:131,y:101}},
 {id:'security-threshold-west',room:'security',kind:'records-bank',name:'Checkpoint west wall',footprint:{x:116,y:110.82,w:6,h:.18},height:6.8,operator:{x:121.3,y:110.2}},
 {id:'security-threshold-east',room:'security',kind:'records-bank',name:'Checkpoint east wall',footprint:{x:126,y:110.82,w:6,h:.18},height:6.8,operator:{x:126.7,y:110.2}},
];
export const ARRIVAL_ROOM_SOCKETS={
 claims01:{position:[118.1,116.05],facing:180},claims02:{position:[118.1,120.15],facing:180},
 forms:{position:[129.6,113.5],facing:90},registerClerk:{position:[121.5,107.2],facing:0},
 traysClerk:{position:[126.5,107.2],facing:0},limenAuthority:{position:[123.9,110.2],facing:0},
 supervisorPause:{position:[127.25,109],facing:270},outputWitness:{position:[151.8,106.8],facing:315},
} as const;
/** Waypoint centre lines, not a scheduler. Episode owner staggers release, keeps
 * >=0.85m root separation and uses real room transitions/clearance facts. */
export const CONVEYOR_SHIFT_SOCKETS=[136.5,140.5,144.5,148.5].map((x,index)=>({stationIndex:index,operator:[x,105.8] as const,support:[x+1.3,108.6] as const}));
export const SHIFT_ROUTES={
 arrival:[[124.8,132],[124.8,123],[125.3,112],[124.5,108.3],[124.5,104.5],[129,104.5],[133.2,104.5],[134,106.1],[135,108]],
 departure:[[135,108],[134,106.1],[133.2,104.5],[129,104.5],[124.5,104.5],[124.5,108.3],[125.3,112],[124.8,123],[124.8,132],[124.6,146]],
 registerDeparture:[[121.5,107.2],[124.5,108.3],[125.3,112],[124.8,123],[124.8,132],[124.6,146]],
 traysDeparture:[[126.5,107.2],[124.5,108.3],[125.3,112],[124.8,123],[124.8,132],[124.6,146]],
 limenDeparture:[[123.9,110.2],[125.3,112],[124.8,123],[124.8,132],[124.6,146]],
 conveyorCollection:[[150.3,107.2],[146.3,108],[142.3,108],[138.3,108],[135,108]],
} as const;

/** Engine must create the actual outside transition; roomAt currently ends at y144. */
export const SHIFT_EXIT={boundaryY:144,outsideEndpoint:[124.6,146],requiresRuntimeZone:"outside",allCastMustLeave:12} as const;
export const SECURITY_HELPER_APPROACH={ed:[[125.3,112],[124.5,108.3],[121.5,107.2]],gus:[[125.3,112],[124.5,108.3],[126.5,107.2]]} as const;
export const CONVEYOR_OUTTAKE_SOCKET=[151.7,105.8] as const;

/** Shared physical desk size, reservations and reach targets. Floor x/y; height third. */
export const SECURITY_DESKS=[
 {id:'security-register',name:'Admission register',center:[121.5,106.2],size:[1.5,1.1,.9],root:[121.5,107.2],control:[121.5,106.6,1.1]},
 {id:'security-trays',name:'ID sorting desk',center:[126.5,106.2],size:[1.5,1.1,.9],root:[126.5,107.2],control:[126.5,106.6,1.1]},
] as const;
export const SECURITY_INTERACTION={
 samInspection:[123.5,112.8],samYawDegrees:180,limenAuthority:[123.9,110.2],limenInspect:[122.6,110.2],
 inspectionCamera:[123.75,111.7,1.15,4.1,1.18,1.23],
 conveyorAperture:{axisX:132,minY:103.5,maxY:106},
 threatRoot:[131.1,104.6],threatFacing:270,
 threatApproach:[[134.8,107.2],[133.2,106.1],[133.2,104.6],[131.1,104.6]],
 // The speaking doorway must be seen along the connector, not through its south wall.
 threatCamera:{eye:[124.5,107.2,2.4],target:[130.8,104.6,1.35],fovRadians:.8},
} as const;
