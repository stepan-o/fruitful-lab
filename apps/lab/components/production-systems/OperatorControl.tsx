import { control } from "@/lib/production-systems/operator-chess";
import { Screw } from "./engraving-primitives";
import { moveStyle } from "./OperatorChess";
import styles from "./turk-operator.module.css";

const ink="#463a30", brass="#ae9365", edge="#d8bc85";

/** The approved forward lever stays beside the raised source hand. Only the
 * downstream movement is fixed to the far wall on the operator's right. */
export function OperatorControl({id}:{id:string}) {
  return <g data-operator-part="operator-control" stroke={ink} strokeLinejoin="round">
    {/* A supported roof transmission routes the input toward the Turk's seat. */}
    <path d="M319 136V121H476V96M476 121V257" fill="none" stroke="#302c22" strokeWidth="5"/>
    <path d="M319 136V121H476V96M476 121V257" fill="none" stroke={brass} strokeWidth="2.8"/>
    <path d="M321 119H474M474 126V254" stroke={edge} strokeWidth=".65" fill="none"/>
    {[354,411].map(x=><g key={x}><path d={`M${x-6} 116h12v13h-12Z`} fill="#7f704f" strokeWidth=".7"/><path d={`M${x-3} 118v9m6-9v9`} stroke={edge} strokeWidth=".65"/></g>)}
    <path d="M310 126H328V145H310Z" fill="#726448"/>
    <path d="M315 128V144M323 128V144" stroke="#c6ae78" strokeWidth=".8"/>
    <g transform={`translate(${control.roof.x} ${control.roof.y})`}>
      <g className={styles.chess} style={moveStyle(id,"rocker")}>
        <path d={`M-3-4H${control.crankRadius}V4H-3Z`} fill="#958056" strokeWidth=".8"/>
        <path d={`M2-2H${control.crankRadius-3}`} stroke={edge} strokeWidth=".6"/>
      </g>
      <Screw x={0} y={0} r={3}/>
    </g>
    <path d="M340 244H357V259H338Z" fill="#706047"/>
    <g className={styles.chess} style={{...moveStyle(id,"lever"),transformOrigin:"340px 244px"}}>
      <path d="M340 244 334 182" stroke="#332d23" strokeWidth="5"/>
      <path d="M340 244 334 182" stroke={brass} strokeWidth="2.7"/>
      <path d="M338 238 333 190" stroke={edge} strokeWidth=".7"/>
      <Screw x={334} y={182} r={3}/>
    </g>
    <g className={styles.chess} style={moveStyle(id,"rod")}>
      <path d={`M0-2H${control.linkLength}V2H0Z`} fill={brass} strokeWidth=".65"/>
      <path d={`M3-1H${control.linkLength-3}`} stroke={edge} strokeWidth=".5"/>
      <Screw x={0} y={0} r={2.6}/><Screw x={control.linkLength} y={0} r={2.6}/>
    </g>
    <Screw x={340} y={244} r={3.2}/>
    {/* Recessed wall fittings give the previously dangling shaft a purpose
        and a physical end. The human does not reach back to this mechanism. */}
    <path d="M465 144H490V266H465Z" fill="#16251d" opacity=".24" stroke="none"/>
    <path d="M462 142H487V263H462Z" fill="#62563d" strokeWidth=".7"/>
    <path d="M464 144H485V260H464Z" fill="#3b4937" stroke="#998458" strokeWidth=".55"/>
    {[150,251].map(y=><g key={y}><path d={`M464 ${y-5}h24v10h-24Z`} fill="#85734d" strokeWidth=".7"/><path d={`M472 ${y-4}v8m8-8v8`} stroke={edge} strokeWidth=".7"/><Screw x={467} y={y} r={1.5}/><Screw x={485} y={y} r={1.5}/></g>)}
    <g transform="translate(476 219)">
      <circle r="20" fill="#23392b" stroke="#82724b" strokeWidth=".8"/>
      <g className={styles.chess} style={moveStyle(id,"drive")}>
        <circle r="16" fill="none" stroke={brass} strokeWidth="2.5"/>
        <path d="M0-15V15M-13-7 13 7M-13 7 13-7" stroke={brass} strokeWidth="2.3"/>
        <circle r="6" fill="#826e47" stroke={edge} strokeWidth=".7"/>
      </g>
      <path d="M-16-4A16 16 0 0 1-6-15" stroke={edge} strokeWidth=".7" fill="none"/>
      <Screw x={0} y={0} r={2.3}/>
    </g>
    <circle cx="476" cy="121" r="10" fill="#635d42" stroke={brass} strokeWidth=".8"/>
    <path d="M470 121H482M476 115V127" stroke="#cbb17b" strokeWidth="1"/>
    <Screw x={476} y={121} r={2.5}/>
    <path d="M467 94H485V99H467ZM472 257H480V262H472Z" fill={brass} strokeWidth=".8"/>
  </g>;
}
