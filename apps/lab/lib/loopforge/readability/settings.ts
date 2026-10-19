/** Art-direction audition only. Never written to world state or player graphics preferences. */
export type ReadabilitySettings = {
 version:1; room:'security'|'conveyor'; camera:'front'|'side'|'rear'; distance:number;
 size:'room'|'console'; labels:boolean; original:boolean;
 background:'current'|'neutral'|'proposed'; floor:string; walls:string; detail:number;
 neutralLight:number; worker:string; limen:string; stiletto:string;
 workerPaint:number; limenPaint:number; stilettoPaint:number;
 limenHeight:number; stilettoHeight:number; signatures:boolean; shadows:boolean; bloom:boolean;
};
export const READABILITY_DEFAULT:ReadabilitySettings={
 version:1,room:'conveyor',camera:'front',distance:25,size:'room',labels:false,original:false,
 background:'proposed',floor:'#666860',walls:'#343d38',detail:30,neutralLight:0,
 worker:'#467ba4',limen:'#aab9bd',stiletto:'#c5443c',workerPaint:85,limenPaint:85,stilettoPaint:90,
 limenHeight:1.25,stilettoHeight:1.2,signatures:true,shadows:true,bloom:true,
};
const ranges={distance:[18,36],detail:[0,100],neutralLight:[0,100],workerPaint:[0,100],limenPaint:[0,100],stilettoPaint:[0,100],limenHeight:[1,1.5],stilettoHeight:[1,1.5]} as const;
export function parseReadability(value:unknown):ReadabilitySettings {
 const result={...READABILITY_DEFAULT};if(!value||typeof value!=='object')return result;
 const v=value as Record<string,unknown>;if(v.version!==1)return result;
 for(const key of Object.keys(ranges) as (keyof typeof ranges)[]){const n=v[key];if(typeof n==='number'&&Number.isFinite(n))result[key]=Math.max(ranges[key][0],Math.min(ranges[key][1],n));}
 for(const key of ['floor','walls','worker','limen','stiletto'] as const)if(typeof v[key]==='string'&&/^#[0-9a-f]{6}$/i.test(v[key]))result[key]=v[key];
 for(const key of ['labels','original','signatures','shadows','bloom'] as const)if(typeof v[key]==='boolean')result[key]=v[key];
 if(v.room==='security'||v.room==='conveyor')result.room=v.room;
 if(v.camera==='front'||v.camera==='side'||v.camera==='rear')result.camera=v.camera;
 if(v.size==='room'||v.size==='console')result.size=v.size;
 if(v.background==='current'||v.background==='neutral'||v.background==='proposed')result.background=v.background;
 return result;
}
/** A/B changes only treatment: framing, poses, lighting switches and overlay choice stay comparable. */
export function treatment(s:ReadabilitySettings){return s.original?{...s,background:'current' as const,neutralLight:0,workerPaint:0,limenPaint:0,stilettoPaint:0}:s;}
export function heightScale(original:boolean,sourceHeight:number,workerHeight:number,ratio:number){
 if(original)return 1;
 if(sourceHeight<=0||workerHeight<=0)throw Error('Neutral body height is missing.');
 return workerHeight*ratio/sourceHeight;
}

/** Source names are checked against the delivered motion review manifests. */
export const READABILITY_POSES={limen:{clip:'Idle',phase:.02},stiletto:{clip:'Stand_Talking_Angry',phase:.25},workerSeconds:0} as const;
