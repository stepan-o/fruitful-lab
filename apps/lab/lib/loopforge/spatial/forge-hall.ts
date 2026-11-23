// Historical pre-redesign Forge study. The approved rehearsal uses approved-factory.json.
// Day 1 installation inside the existing 80 × 56 m Forge shell. North is Security.
import type { Rect } from './floor';

function rect(x: number, y: number, w: number, h: number): Rect { return {x,y,w,h}; }
function installation(id: string, name: string, bounds: Rect, height: number, build: string) {
  return {id, name, rect: bounds, height, build};
}
export const FORGE_HALL = {
  runs: [
    {id:'delivery', name:'Dispatch receiving road', rect:rect(93,128,6,34)},
    {id:'transfer', name:'Cross-hall transfer road', rect:rect(82,156,78,6)},
    {id:'outbound', name:'Outbound cart lane', rect:rect(150,142,6,14)},
    {id:'staff', name:'Operator walk', rect:rect(102,136,47,2.6)},
  ],
  installations: [
    installation('receiving','Receiving stillages',rect(83,136,9,14),2.2,'Two rows of cradle bins face the Dispatch road. Forks approach from the east and pick up empty frames on the return trip.'),
    installation('infeed','Tray accumulator',rect(100,139,18,6),1.25,'Three gravity roller sections stage full trays from Dispatch. Align the final rollers with the Intake cradle.'),
    installation('transfer-table','Outbound transfer table',rect(141,139,9,6),1.05,'The line discharges east into a cross-transfer table. Its cart end meets the outbound lane.'),
    installation('drive-shop','Drive overhaul bay',rect(84,165,20,14),4.2,'A trolley enters from the north road. Leave the middle free for a carrier between the workbenches. Sink a covered inspection pit along its centre.'),
    installation('jig-shop','Press tooling bay',rect(108,165,18,14),4.8,'Face the removable die cassette and jib toward the transfer road. Park spare dies along the side walls.'),
    installation('water-plant','Wash-water return',rect(101,149,17,5),3.8,'Return water from Wash through a floor trench to two settling tanks. Service both from the transfer road.'),
    installation('empty-racks','Empty cradle return',rect(130,149,16,5),2.1,'Stack the empty carriers on low return rails. A tug can collect them from the south road for the next intake delivery.'),
  ],
  crane: {name:'Bridge crane', rect:rect(101,135,49,20), base:9, height:2.4, bridgeX:139,
    build:'Two longitudinal runways sit on paired column rows. Span the working line with a moving bridge and transverse hoist for roller frames, the drive and press dies.'},
  columns: [101,110,115,140,149].flatMap(x=>[134.65,154.65].map(y=>rect(x,y,.6,.6))),
  reserve: {id:'forge-spare',room:'conveyor',label:'SPARE FITTING BAY',rect:rect(131,165,25,15)},
  carrierY:142,
} as const;
