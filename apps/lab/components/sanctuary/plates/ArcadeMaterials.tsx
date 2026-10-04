/** Sanctuary's engraved material vocabulary. Geometry is deterministic and strokes are batched. */
export const arcadeInk = "#091317", arcadeEdge = "#ccb585", arcadeBrass = "#a78957";
export const round = (n: number) => Math.round(n * 100) / 100;

export function Screw({x,y,r=2}:{x:number;y:number;r?:number}) {
  return <g transform={`translate(${x} ${y})`}><circle cy=".6" r={r+.7} fill="#080e11"/><circle r={r} fill="#a38c62" stroke="#d1bc8b" strokeWidth=".5"/><path d={`M${-r*.6} ${r*.5}l${r*1.2} ${-r}`} stroke="#192023" strokeWidth=".8"/></g>;
}
export function WoodGrain({x,y,w,h,vertical=false}:{x:number;y:number;w:number;h:number;vertical?:boolean}) {
  const length=vertical?h:w,span=vertical?w:h;
  const d=Array.from({length:Math.floor(span/3)},(_,i)=>{
    const a=2+i*3,b=(i%5-2)*.7;
    return `M0 ${a}q${round(length*.24)} ${b} ${round(length*.5)} 0t${round(length*.5)} 0`;
  }).join("");
  return <g transform={`translate(${x} ${y})${vertical?" matrix(0 1 1 0 0 0)":""}`}><path d={d} fill="none" stroke="#d6ba84" strokeWidth=".55" opacity=".2"/><path d={`M${round(length*.15)} ${round(span*.37)}q${round(length*.15)} -2 ${round(length*.28)} 0t${round(length*.32)} 0`} fill="none" stroke="#070f12" strokeWidth=".75" opacity=".7"/></g>;
}
export function InsetPanel({x,y,w,h}:{x:number;y:number;w:number;h:number}) {
 return <g><path d={`M${x} ${y}h${w}v${h}h${-w}Z`} fill="#192627" stroke="#796346" strokeWidth="1.1"/><path d={`M${x+4} ${y+h-4}V${y+4}H${x+w-4}`} fill="none" stroke="#0a1417" strokeWidth="2.5"/><path d={`M${x+5} ${y+h-5}H${x+w-5}V${y+5}`} fill="none" stroke="#be9e6b" strokeWidth=".75"/><path d={`M${x+9} ${y+9}h${w-18}v${h-18}h${18-w}Z`} fill="#29312a" stroke="#8f7956" strokeWidth=".5"/><WoodGrain x={x+11} y={y+11} w={w-22} h={h-22}/></g>;
}
