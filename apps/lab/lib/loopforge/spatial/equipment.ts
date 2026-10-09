import type { ManagedRoomId, Rect, Tile } from './floor';

/** Authored scale-study placements. Future build commands buy/place instances of these
 * archetypes; these records are not owned equipment or production state. */
export type EquipmentKind = 'holding-cage' | 'records-bank' | 'intake' | 'scrap-maw' | 'outtake' | 'feed-bank' | 'vat' | 'filters' | 'control' | 'loom' | 'neural-column' | 'harmonic-dais' | 'theatre-stage' | 'conditioning-bank' | 'assembly-chamber' | 'assembly-feed' | 'cooling-bank';
export type EquipmentPlacement = Readonly<{ id: string; room: ManagedRoomId; kind: EquipmentKind; name: string; footprint: Rect; height: number; operator: Tile }>;
export const EQUIPMENT_STUDY: readonly EquipmentPlacement[] = [
  { id:'holding',room:'security',kind:'holding-cage',name:'Holding cage',footprint:{x:43,y:41,w:3,h:5},height:3.4,operator:{x:47,y:43} },
  { id:'records',room:'security',kind:'records-bank',name:'Clearance records',footprint:{x:50,y:32,w:3,h:4},height:2.8,operator:{x:49,y:36} },
  { id:'intake',room:'conveyor',kind:'intake',name:'Intake / preheat',footprint:{x:32,y:57,w:8,h:4},height:5.2,operator:{x:37,y:55} },
  { id:'scrap',room:'conveyor',kind:'scrap-maw',name:'Scrap maw',footprint:{x:32,y:50,w:4,h:4},height:3.4,operator:{x:36,y:52} },
  { id:'outtake',room:'conveyor',kind:'outtake',name:'Outtake press',footprint:{x:50,y:57,w:7,h:4},height:6.8,operator:{x:57,y:59} },
  { id:'feed',room:'conveyor',kind:'feed-bank',name:'Process supply',footprint:{x:41,y:53,w:6,h:3},height:4.8,operator:{x:48,y:54} },
  { id:'substrate-vat',room:'brewery',kind:'vat',name:'Cognitive substrate reactor',footprint:{x:53,y:12,w:11,h:11},height:8,operator:{x:58,y:24} },
  { id:'filter-train',room:'brewery',kind:'filters',name:'Filtration train',footprint:{x:69,y:11,w:5,h:15},height:5.4,operator:{x:67,y:18} },
  { id:'brew-control',room:'brewery',kind:'control',name:'Reaction desk',footprint:{x:48,y:24,w:4,h:3},height:1.9,operator:{x:49,y:27} },
  { id:'loom-west',room:'weaving',kind:'loom',name:'West ribbon loom',footprint:{x:18,y:16,w:5,h:10},height:3.6,operator:{x:24,y:21} },
  { id:'loom-east',room:'weaving',kind:'loom',name:'East ribbon loom',footprint:{x:36,y:16,w:5,h:10},height:3.6,operator:{x:34,y:21} },
  { id:'column-west',room:'weaving',kind:'neural-column',name:'West neural column',footprint:{x:18,y:8,w:4,h:5},height:8.4,operator:{x:23,y:12} },
  { id:'column-east',room:'weaving',kind:'neural-column',name:'East neural column',footprint:{x:37,y:8,w:4,h:5},height:8.4,operator:{x:35,y:12} },
  { id:'harmonic-dais',room:'weaving',kind:'harmonic-dais',name:'Harmonic instrument',footprint:{x:26,y:8,w:8,h:7},height:8.2,operator:{x:29,y:17} },
  { id:'theatre-stage',room:'theatre',kind:'theatre-stage',name:'Projection stage',footprint:{x:87,y:14,w:15,h:6},height:6.5,operator:{x:94,y:21} },
  { id:'conditioning-bank',room:'theatre',kind:'conditioning-bank',name:'Conditioning cradles',footprint:{x:87,y:23,w:15,h:10},height:1.7,operator:{x:85,y:27} },
  { id:'assembly-core',room:'cortex',kind:'assembly-chamber',name:'Cortex assembly chamber',footprint:{x:68,y:51,w:8,h:9},height:9.5,operator:{x:66,y:55} },
  { id:'assembly-feed',room:'cortex',kind:'assembly-feed',name:'Prototype approach line',footprint:{x:69,y:63,w:6,h:8},height:2.1,operator:{x:67,y:67} },
  { id:'cooling-west',room:'cortex',kind:'cooling-bank',name:'West cooling bank',footprint:{x:61,y:47,w:4,h:17},height:6.2,operator:{x:66,y:49} },
  { id:'cooling-east',room:'cortex',kind:'cooling-bank',name:'East cooling bank',footprint:{x:79,y:47,w:4,h:17},height:6.2,operator:{x:77,y:49} },
  { id:'assembly-console',room:'cortex',kind:'control',name:'Assembly operator desk',footprint:{x:75,y:64,w:4,h:3},height:1.9,operator:{x:76,y:68} },
];
export const ROOM_STAGING: Record<ManagedRoomId, { title: string; premise: string; encounter: Rect; interaction: string }> = {
  security:{title:'Permission versus throughput',premise:'A clearance lane, holding cage and records desk frame the threshold to the line.',encounter:{x:47,y:44,w:3,h:3},interaction:'LIMEN and STILETTO meet at the checkpoint. Queued workers can witness the dispute.'},
  conveyor:{title:'A line long enough to work around',premise:'Intake → live assembly segment → outtake. The scrap maw and process feeds occupy the back of the bay.',encounter:{x:41,y:63,w:9,h:3},interaction:'An open service aisle gives Rivet Witch repair access, Stiletto a restart position and workers room to gather.'},
  theatre:{title:'The operator faces an audience',premise:'Sixteen conditioning cradles face three projection screens. Side aisles lead to the lecture stage.',encounter:{x:88,y:20,w:13,h:3},interaction:'Cathexis can address the workforce from a shared forecourt; the same arrangement supports conditioning and collective defiance.'},
  brewery:{title:'The reaction dominates the room',premise:'A large vat, suspended agitators and separate filtration train leave a working apron around the process.',encounter:{x:54,y:24,w:10,h:4},interaction:'Witch works at the vat edge; Thrum can turn its apron into a gathering. Spills have space to become visible.'},
  weaving:{title:'An instrument, not a tabletop loom',premise:'Paired ribbon looms and tall neural columns flank the approach to a raised harmonic instrument.',encounter:{x:26,y:17,w:8,h:10},interaction:'Thrum owns the central listening space. Side access lets Witch reach the mechanisms without occupying the forecourt.'},
  cortex:{title:'Assembly as a major plant',premise:'A suspended central chamber, twin cooling banks and an approach conveyor surround a technician service ring.',encounter:{x:66,y:60,w:12,h:3},interaction:'The prototype can draw several specialists to separate stations. Specific supervisor outcomes here are still design work.'},
};
export const SCALE_FIGURES = EQUIPMENT_STUDY.filter(e=>!['security','conveyor'].includes(e.room)).map(e=>({room:e.room,x:e.operator.x+.5,y:e.operator.y+.5}));
