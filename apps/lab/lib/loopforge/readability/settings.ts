import {ROOM_FLOORS,CATHEXIS_APPEARANCE} from '../rooms/appearance';
import {LIMEN_PALETTE} from '../agents/limen-palette';
import {STILETTO_PALETTE} from '../agents/stiletto-palette';

/** Art-direction audition only. Never written to world state or player graphics preferences. */
export type ReadabilitySettings = {
 version:1; room:'security'|'conveyor'; camera:'front'|'side'|'rear'; distance:number;
 size:'room'|'console'; labels:boolean; original:boolean;
 background:'current'|'neutral'|'proposed'; floor:string; securityFloor:string; conveyorFloor:string; walls:string; detail:number;
 neutralLight:number; worker:string; limen:string; stiletto:string; cathexis:string;
 workerPaint:number; limenPaint:number; stilettoPaint:number; cathexisPaint:number;
 limenHeight:number; stilettoHeight:number; cathexisHeight:number; cathexisVisible:boolean; cathexisFace:'full'|'half-left'|'half-right'|'none'; signatures:boolean; shadows:boolean; bloom:boolean;
};
export const READABILITY_DEFAULT:ReadabilitySettings={
 version:1,room:'conveyor',camera:'front',distance:25,size:'room',labels:false,original:false,
 background:'proposed',floor:ROOM_FLOORS.conveyor,securityFloor:ROOM_FLOORS.security,conveyorFloor:ROOM_FLOORS.conveyor,walls:'#343d38',detail:30,neutralLight:0,
 worker:'#467ba4',limen:LIMEN_PALETTE.steel,stiletto:STILETTO_PALETTE.accent,cathexis:CATHEXIS_APPEARANCE.ivory,workerPaint:85,limenPaint:LIMEN_PALETTE.strength,stilettoPaint:STILETTO_PALETTE.strength,cathexisPaint:CATHEXIS_APPEARANCE.strength,
 limenHeight:1.25,stilettoHeight:1.2,cathexisHeight:CATHEXIS_APPEARANCE.heightRatio,cathexisVisible:true,cathexisFace:'full',signatures:true,shadows:true,bloom:true,
};
const ranges={distance:[18,36],detail:[0,100],neutralLight:[0,100],workerPaint:[0,100],limenPaint:[0,100],stilettoPaint:[0,100],limenHeight:[1,1.5],stilettoHeight:[1,1.5],cathexisHeight:[1,1.5],cathexisPaint:[0,100]} as const;
export function parseReadability(value:unknown):ReadabilitySettings {
 const result={...READABILITY_DEFAULT};if(!value||typeof value!=='object')return result;
 const v=value as Record<string,unknown>;if(v.version!==1)return result;
 for(const key of Object.keys(ranges) as (keyof typeof ranges)[]){const n=v[key];if(typeof n==='number'&&Number.isFinite(n))result[key]=Math.max(ranges[key][0],Math.min(ranges[key][1],n));}
 for(const key of ['floor','securityFloor','conveyorFloor','walls','worker','limen','stiletto','cathexis'] as const)if(typeof v[key]==='string'&&/^#[0-9a-f]{6}$/i.test(v[key]))result[key]=v[key];
 for(const key of ['labels','original','signatures','shadows','bloom','cathexisVisible'] as const)if(typeof v[key]==='boolean')result[key]=v[key];
 if(v.room==='security'||v.room==='conveyor')result.room=v.room;
 if(v.camera==='front'||v.camera==='side'||v.camera==='rear')result.camera=v.camera;
 if(v.size==='room'||v.size==='console')result.size=v.size;
 if(v.background==='current'||v.background==='neutral'||v.background==='proposed')result.background=v.background;
 if(['full','half-left','half-right','none'].includes(String(v.cathexisFace)))result.cathexisFace=v.cathexisFace as ReadabilitySettings['cathexisFace'];
 // Legacy global floor belongs only to the room in which it was saved.
 if(!('securityFloor' in v)&&!('conveyorFloor' in v)&&typeof v.floor==='string'&&/^#[0-9a-f]{6}$/i.test(v.floor))result[result.room==='security'?'securityFloor':'conveyorFloor']=v.floor;
 result.floor=result.room==='security'?result.securityFloor:result.conveyorFloor;
 return result;
}
/** A/B changes only treatment: framing, poses, lighting switches and overlay choice stay comparable. */
export function treatment(s:ReadabilitySettings){return s.original?{...s,background:'current' as const,neutralLight:0,workerPaint:0,limenPaint:0,stilettoPaint:0,cathexisPaint:0}:s;}
export function heightScale(original:boolean,sourceHeight:number,workerHeight:number,ratio:number){
 if(original)return 1;
 if(sourceHeight<=0||workerHeight<=0)throw Error('Neutral body height is missing.');
 return workerHeight*ratio/sourceHeight;
}

/** Source names are checked against the delivered motion review manifests. */
export const READABILITY_POSES={limen:{clip:'Idle',phase:.02},stiletto:{clip:'Stand_Talking_Angry',phase:.25},cathexis:{clip:'Happy_Sway',phase:0},workerSeconds:0} as const;
