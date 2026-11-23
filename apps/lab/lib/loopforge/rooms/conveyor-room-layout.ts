import type {EquipmentPlacement} from '../spatial/equipment';

/** Metres in the arrival plan: x east, y south; vertical height is separate.
 * These are physical reservations, not new purchasable machines or actions. */
export const CONVEYOR_ROOM = {
  version: 'conveyor-hall/1',
  bounds: {x:132,y:98,w:24,h:14},
  height:6.8,
  bays:[134.25,138.25,142.25,146.25,150.25,154.25],
  workLane:{x:133.2,y:105.4,w:20.8,h:1.2},
  supervisionLane:{x:133.2,y:106.6,w:20.8,h:2.4},
  confrontation:{x:139,y:107.6,w:6,h:2.6},
  entrance:{x:132,y:102,w:1.2,h:4},
} as const;

export const CONVEYOR_ROOM_FIXTURES:readonly EquipmentPlacement[]=[
  {id:'conveyor-rear-services',room:'conveyor',kind:'feed-bank',name:'Rear service spine',footprint:{x:132,y:98,w:24,h:1.5},height:6.8,operator:{x:143,y:100.1}},
  {id:'conveyor-output-services',room:'conveyor',kind:'outtake',name:'Output service wall',footprint:{x:154.8,y:99.5,w:1.2,h:12.5},height:6.8,operator:{x:154.2,y:105.8}},
  {id:'conveyor-south-enclosure',room:'conveyor',kind:'feed-bank',name:'South hall wall',footprint:{x:132,y:111.65,w:22.8,h:.35},height:6.8,operator:{x:145,y:111}},
  {id:'conveyor-west-north-return',room:'conveyor',kind:'feed-bank',name:'Conveyor entrance north return',footprint:{x:132,y:99.5,w:.35,h:2.5},height:6.8,operator:{x:133,y:101}},
  {id:'conveyor-west-return',room:'conveyor',kind:'feed-bank',name:'Conveyor entrance south return',footprint:{x:132,y:106,w:.35,h:5.65},height:6.8,operator:{x:133,y:108}},
  {id:'conveyor-spares',room:'conveyor',kind:'feed-bank',name:'Empty carrier rack',footprint:{x:134,y:110.35,w:3.2,h:1.3},height:2.4,operator:{x:135.6,y:109.7}},
  {id:'conveyor-repair-bench',room:'conveyor',kind:'records-bank',name:'Repair bench',footprint:{x:150.7,y:110.35,w:3.4,h:1.3},height:1.25,operator:{x:152.4,y:109.7}},
];

/** Authored staging sockets, with no automatic relocation or new behaviour. */
export const CONVEYOR_ROOM_SOCKETS={
  repair:[152.4,109.7],
  spareCarrier:[135.6,109.7],
  discussionA:[141,108.4],
  discussionB:[143.2,108.4],
  waitWest:[137.8,109.6],
  waitEast:[147.5,109.6],
} as const;
