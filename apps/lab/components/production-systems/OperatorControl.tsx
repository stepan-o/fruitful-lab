import { control } from "@/lib/production-systems/operator-chess";
import { Screw } from "./engraving-primitives";
import { moveStyle } from "./OperatorChess";
import styles from "./turk-operator.module.css";

const ink="#463a30", brass="#ae9365", edge="#dfc18c";

/** A shallow mechanism fixed to the far wall, with no unsupported rod ends. */
export function OperatorControl({id}:{id:string}) {
  const {input,output,handle,crankRadius:r}=control, length=input.y-output.y;
  return <g data-operator-part="operator-control" stroke={ink} strokeLinejoin="round" strokeLinecap="round">
    {/* Small contact shadow, chamfered backplate and four real mounting points. */}
    <path d="M452 142H497L505 150V278L497 286H452L444 278V150Z" fill="#111e17" opacity=".28" stroke="none"/>
    <path d="M448 139H491L499 147V273L491 281H448L440 273V147Z" fill="#5f6047" strokeWidth="1.2"/>
    <path d="M449 142H490L496 148V272L490 278H449L443 272V148Z" fill="#39483a" stroke="#b49b69" strokeWidth=".65"/>
    <path d="M446 152V269M494 154V268M450 275H489" fill="none" stroke="#807e56" strokeWidth=".65"/>
    {[{x:449,y:150},{x:490,y:150},{x:449,y:271},{x:490,y:271}].map((p,i)=><Screw key={i} {...p} r={2}/>)}
    {/* Output shaft enters the Turk's pedestal, held by two bearing collars. */}
    <path d={`M${output.x-3} 94V${output.y}h6V94Z`} fill="#8d8058" strokeWidth=".8"/>
    <path d={`M${output.x-1.5} 96V${output.y-9}`} fill="none" stroke={edge} strokeWidth=".8"/>
    {[111,137].map(y=><g key={y}><path d={`M461 ${y-5}h20v10h-20Z`} fill="#84754e" strokeWidth=".7"/><path d={`M465 ${y-4}v8m12-8v8`} stroke={edge} strokeWidth=".7"/><Screw x={462.5} y={y} r={1.3}/><Screw x={479.5} y={y} r={1.3}/></g>)}
    <path d="M460 94H482V99H460Z" fill={brass} strokeWidth=".8"/>
    {/* The two rockers have equal pin radii. Their coupling stays rigid. */}
    {[output,input].map((p,i)=><g key={i} transform={`translate(${p.x} ${p.y})`}>
      <circle r="21" fill="#26332b" stroke="#7d7855" strokeWidth=".7"/>
      <circle r="18" fill="#4e5440" stroke={brass} strokeWidth=".7"/>
      <path d="M-17-4A17 17 0 0 1-7-15" stroke={edge} strokeWidth=".75" fill="none"/>
      <g className={styles.chess} style={moveStyle(id,i?"lever":"drive")}>
        <path d="M-16-4H9L13 0 9 4H-16Z" fill={brass} strokeWidth=".8"/>
        <path d="M-13-2H8" fill="none" stroke={edge} strokeWidth=".7"/>
        {i===1&&<>
          <path d={`M0 0 ${handle.x} ${handle.y}`} fill="none" stroke="#302b22" strokeWidth="6"/>
          <path d={`M0 0 ${handle.x} ${handle.y}`} fill="none" stroke={brass} strokeWidth="3.5"/>
          <path d={`M-2-5 ${handle.x-1} ${handle.y+3}`} fill="none" stroke={edge} strokeWidth=".7"/>
          <ellipse cx={handle.x} cy={handle.y} rx="5" ry="9" fill="#5d4534" strokeWidth=".8"/>
          <path d={`M${handle.x-2} ${handle.y-5}v10`} stroke="#b29261" strokeWidth=".7"/>
        </>}
        <circle cx={-r} r="3" fill="#d5ba80" strokeWidth=".7"/>
      </g>
      <Screw x={0} y={0} r={3.5}/>
    </g>)}
    <g className={styles.chess} style={moveStyle(id,"rod")}>
      <path d={`M0-2.4H${length}V2.4H0Z`} fill="#a59060" strokeWidth=".8"/>
      <path d={`M4-1.1H${length-4}`} stroke={edge} strokeWidth=".65"/>
      <Screw x={0} y={0} r={3.1}/><Screw x={length} y={0} r={3.1}/>
    </g>
  </g>;
}

function OperatorSleeve({length,fore=false,silhouette=false}:{length:number;fore?:boolean;silhouette?:boolean}) {
  const root=fore?7:10, end=fore?5:8;
  return <g stroke={silhouette?"none":ink} strokeLinejoin="round" strokeLinecap="round">
    <path d={`M0-${root}Q${length*.4}-${root+3} ${length}-${end}Q${length+4} 0 ${length} ${end}Q${length*.4} ${root+2} 0 ${root}Q-5 0 0-${root}Z`} fill={silhouette?"currentColor":"#9b8866"} strokeWidth=".8"/>
    {!silhouette&&<>
      <path d={`M3 ${-root+2}Q${length*.45} -5 ${length-3} ${-end+2}M5 ${root-2}Q${length*.6} 4 ${length-3} ${end-2}`} fill="none" stroke="#dbc69a" strokeWidth=".6"/>
      <path d={Array.from({length:12},(_,i)=>{const x=3+i*(length-7)/12,h=root+(end-root)*x/length;return `M${x} ${-h+2+(i%3)}q-2 ${h*.8} 1 ${h*1.4}`;}).join("")} fill="none" stroke="#4c4132" strokeWidth=".55" opacity=".8"/>
      <path d={`M${length-8} ${-end+1}q-4 5-2 ${end*1.5}M${length-4} ${-end+2}q-3 3-1 ${end}`} fill="none" stroke="#5a4b36" strokeWidth=".6"/>
    </>}
  </g>;
}

/** The hand and lever share the same grip point; only the two sleeve joints solve. */
export function OperatorLeverArm({id,silhouette=false}:{id:string;silhouette?:boolean}) {
  return <g data-operator-part={silhouette?undefined:"operator-lever-arm"} color="#111e17">
    <g className={styles.chess} style={moveStyle(id,"controlUpper")}><OperatorSleeve length={control.upperLength} silhouette={silhouette}/></g>
    <g className={styles.chess} style={moveStyle(id,"controlFore")}><OperatorSleeve length={control.foreLength} fore silhouette={silhouette}/></g>
    <g className={styles.chess} style={moveStyle(id,"controlHand")} stroke={silhouette?"none":ink} strokeWidth=".65" strokeLinejoin="round">
      <path d="M-11 1-6-3-3-8Q0-10 2-7L5-3Q7 1 3 5L-2 8-9 10Z" fill={silhouette?"currentColor":"#ceba92"}/>
      {!silhouette&&<><path d="M-3-5 1-3 3 0M-4-1 0 1 2 3M-5 3-1 5M-9 2-7 7" fill="none" stroke="#6e5b3e" strokeWidth=".55"/><path d="M-7-1-3-4" stroke="#edd5a6" strokeWidth=".75"/></>}
    </g>
  </g>;
}
