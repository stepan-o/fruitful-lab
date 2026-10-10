import type { ManagedRoomId, Rect, Tile } from './floor';

/** Authored scale-study placements. Future build commands buy/place instances of these
 * archetypes; these records are not owned equipment or production state. */
export type EquipmentKind = 'holding-cage' | 'records-bank' | 'intake' | 'scrap-maw' | 'outtake' | 'feed-bank' | 'vat' | 'filters' | 'control' | 'loom' | 'neural-column' | 'harmonic-dais' | 'theatre-stage' | 'conditioning-bank' | 'assembly-chamber' | 'assembly-feed' | 'cooling-bank';
export type EquipmentPlacement = Readonly<{ id: string; room: ManagedRoomId; kind: EquipmentKind; name: string; footprint: Rect; height: number; operator: Tile }>;
export const EQUIPMENT_STUDY: readonly EquipmentPlacement[] = [
  { id:'holding',room:'security',kind:'holding-cage',name:'Holding cage',footprint:{x:121,y:121,w:3,h:5},height:3.4,operator:{x:125,y:123} },
  { id:'records',room:'security',kind:'records-bank',name:'Clearance records',footprint:{x:128,y:112,w:3,h:4},height:2.8,operator:{x:127,y:116} },
  { id:'intake',room:'conveyor',kind:'intake',name:'Intake / preheat',footprint:{x:110,y:143,w:8,h:4},height:5.2,operator:{x:115,y:141} },
  { id:'scrap',room:'conveyor',kind:'scrap-maw',name:'Scrap maw',footprint:{x:110,y:136,w:4,h:4},height:3.4,operator:{x:114,y:138} },
  { id:'outtake',room:'conveyor',kind:'outtake',name:'Outtake press',footprint:{x:128,y:143,w:7,h:4},height:6.8,operator:{x:135,y:145} },
  { id:'feed',room:'conveyor',kind:'feed-bank',name:'Process supply',footprint:{x:119,y:139,w:6,h:3},height:4.8,operator:{x:126,y:140} },
  { id:'substrate-vat',room:'brewery',kind:'vat',name:'Cognitive substrate reactor',footprint:{x:151,y:31,w:11,h:11},height:8,operator:{x:156,y:43} },
  { id:'filter-train',room:'brewery',kind:'filters',name:'Filtration train',footprint:{x:167,y:30,w:5,h:15},height:5.4,operator:{x:165,y:37} },
  { id:'brew-control',room:'brewery',kind:'control',name:'Reaction desk',footprint:{x:149,y:48,w:4,h:3},height:1.9,operator:{x:151,y:47} },
  { id:'loom-west',room:'weaving',kind:'loom',name:'West ribbon loom',footprint:{x:79,y:35,w:5,h:10},height:3.6,operator:{x:85,y:40} },
  { id:'loom-east',room:'weaving',kind:'loom',name:'East ribbon loom',footprint:{x:97,y:35,w:5,h:10},height:3.6,operator:{x:95,y:40} },
  { id:'column-west',room:'weaving',kind:'neural-column',name:'West neural column',footprint:{x:79,y:27,w:4,h:5},height:8.4,operator:{x:84,y:31} },
  { id:'column-east',room:'weaving',kind:'neural-column',name:'East neural column',footprint:{x:98,y:27,w:4,h:5},height:8.4,operator:{x:96,y:31} },
  { id:'harmonic-dais',room:'weaving',kind:'harmonic-dais',name:'Harmonic instrument',footprint:{x:87,y:27,w:8,h:7},height:8.2,operator:{x:90,y:36} },
  { id:'theatre-stage',room:'theatre',kind:'theatre-stage',name:'Projection stage',footprint:{x:241,y:43,w:15,h:6},height:6.5,operator:{x:248,y:50} },
  { id:'conditioning-bank',room:'theatre',kind:'conditioning-bank',name:'Conditioning cradles',footprint:{x:241,y:52,w:15,h:10},height:1.7,operator:{x:239,y:56} },
  { id:'assembly-core',room:'cortex',kind:'assembly-chamber',name:'Cortex assembly chamber',footprint:{x:171,y:142,w:8,h:9},height:9.5,operator:{x:169,y:146} },
  { id:'assembly-feed',room:'cortex',kind:'assembly-feed',name:'Prototype approach line',footprint:{x:172,y:154,w:6,h:8},height:2.1,operator:{x:170,y:158} },
  { id:'cooling-west',room:'cortex',kind:'cooling-bank',name:'West cooling bank',footprint:{x:164,y:138,w:4,h:17},height:6.2,operator:{x:169,y:140} },
  { id:'cooling-east',room:'cortex',kind:'cooling-bank',name:'East cooling bank',footprint:{x:182,y:138,w:4,h:17},height:6.2,operator:{x:180,y:140} },
  { id:'assembly-console',room:'cortex',kind:'control',name:'Assembly operator desk',footprint:{x:178,y:155,w:4,h:3},height:1.9,operator:{x:179,y:159} },
];
export const ROOM_STAGING: Record<ManagedRoomId, { title: string; premise: string; encounter: Rect; interaction: string }> = {
  security:{title:'Permission versus throughput',premise:'A clearance lane, holding cage and records desk frame the threshold to the line.',encounter:{x:125,y:124,w:3,h:3},interaction:'LIMEN and STILETTO meet at the checkpoint. Queued workers can witness the dispute.'},
  conveyor:{title:'One line. A hall to build into.',premise:'A 25 m starter chain occupies one working bay. Four empty plots leave 2,068 m² for feeds, buffers, longer lines and parallel production.',encounter:{x:119,y:149,w:9,h:3},interaction:'An open service aisle gives Rivet Witch repair access, Stiletto a restart position and workers room to gather.'},
  theatre:{title:'The operator faces an audience',premise:'Sixteen conditioning cradles face three projection screens. Side aisles lead to the lecture stage.',encounter:{x:242,y:49,w:13,h:3},interaction:'Cathexis can address the workforce from a shared forecourt; the same arrangement supports conditioning and collective defiance.'},
  brewery:{title:'A reactor with room for a process train',premise:'A large vat, suspended agitators and separate filtration train leave a working apron around the process.',encounter:{x:152,y:43,w:10,h:4},interaction:'Witch works at the vat edge; Thrum can turn its apron into a gathering. Spills have space to become visible.'},
  weaving:{title:'An instrument, not a tabletop loom',premise:'Paired ribbon looms and tall neural columns flank the approach to a raised harmonic instrument.',encounter:{x:87,y:36,w:8,h:10},interaction:'Thrum owns the central listening space. Side access lets Witch reach the mechanisms without occupying the forecourt.'},
  cortex:{title:'Assembly as a major plant',premise:'A suspended central chamber, twin cooling banks and an approach conveyor surround a technician service ring.',encounter:{x:169,y:151,w:12,h:3},interaction:'The prototype can draw several specialists to separate stations. Specific supervisor outcomes here are still design work.'},
};
export const SCALE_FIGURES = EQUIPMENT_STUDY.filter(e=>!['security','conveyor'].includes(e.room)).map(e=>({room:e.room,x:e.operator.x+.5,y:e.operator.y+.5}));
