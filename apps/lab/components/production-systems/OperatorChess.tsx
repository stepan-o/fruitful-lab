import type { CSSProperties } from "react";
import { Board, Piece, Screw } from "./engraving-primitives";
import { chessTransforms, foreLength, innerBoard, innerPieceScale, mainBoard, mainPieceScale, move, position, shoulder, squareCenter, upperLength, type ChessBoard } from "@/lib/production-systems/operator-chess";
import styles from "./turk-operator.module.css";

const ink="#463a30", brass="#ae9365";
export function moveStyle(id:string, part:keyof ReturnType<typeof chessTransforms>):CSSProperties {
  return {animationName:`${id}-${part}`,transform:chessTransforms(0)[part]};
}
/** Board-square coordinates govern pieces, peg holes, highlights and indicators. */
export function WorkingBoard({id,inside=false}:{id:string;inside?:boolean}) {
  const board=inside?innerBoard:mainBoard, scale=inside?innerPieceScale:mainPieceScale;
  const cell=(index:number)=>{
    const p=squareCenter(index,board),x=p.x-board.width/16-board.skew/16,y=p.y-board.depth/16;
    return `M${x} ${y}h${board.width/8}l${board.skew/8} ${board.depth/8}h${-board.width/8}Z`;
  };
  return <g data-operator-part={inside?"private-pegboard":"public-chessboard"}>
    <Board {...board}/>
    {[move.from,move.to].map((square,i)=><path key={square} d={cell(square)} fill={i?"#77916c":"#c0aa70"} fillOpacity=".32" stroke="#5c7154" strokeWidth=".75"/>)}
    {inside&&<path d={Array.from({length:64},(_,i)=>{const p=squareCenter(i,board);return `M${p.x-.45} ${p.y}h.9`;}).join("")} stroke={ink} strokeWidth="1" strokeLinecap="round"/>}
    {/* Rear pieces first; the near king remains in front of the moving pawn. */}
    {position.filter(p=>p.square<move.from).map(p=><Piece key={p.square} {...squareCenter(p.square,board)} scale={scale} kind={p.kind} dark={p.dark}/>)}
    <g className={styles.chess} style={moveStyle(id,inside?"innerShadow":"mainShadow")}><ellipse cy="1" rx={19*scale} ry={5*scale} fill="#352d27" opacity=".23"/></g>
    <g className={styles.chess} style={moveStyle(id,inside?"innerPawn":"mainPawn")} data-chess-pawn={inside?"private":"public"}><Piece x={0} y={0} scale={scale}/></g>
    {position.filter(p=>p.square>move.from).map(p=><Piece key={p.square} {...squareCenter(p.square,board)} scale={scale} kind={p.kind} dark={p.dark}/>)}
    <Coordinates board={board} inside={inside}/>
  </g>;
}
function Coordinates({board,inside}:{board:ChessBoard;inside:boolean}) {
  return <g fill="#64513a" fontFamily="Georgia, serif" fontSize={inside?4.2:5.7} textAnchor="middle" stroke="none" aria-hidden="true">
    {Array.from({length:8},(_,i)=>{const p=squareCenter(56+i,board);return <text key={i} x={p.x+board.skew/16} y={board.y+board.depth+(inside?4:6)}>{"abcdefgh"[i]}</text>;})}
    {!inside&&Array.from({length:8},(_,i)=>{const p=squareCenter(i*8,board);return <text key={i} x={p.x-board.width/16-5} y={p.y+2}>{8-i}</text>;})}
  </g>;
}
function Sleeve({length,fore=false}:{length:number;fore?:boolean}) {
  return <g stroke={ink} strokeLinejoin="round">
    <path d={`M0-12Q${length*.5}-17 ${length-8}-${fore?8:11}L${length+3}-5V7L${length-9} ${fore?9:13}Q${length*.5} 19 0 12Q-8 0 0-12Z`} fill={fore?"#7e866f":"#69795f"} strokeWidth="1.1"/>
    <path d={Array.from({length:20},(_,i)=>{const x=5+i*(length-12)/20;return `M${x}-11q-4 9 0 23`;}).join("")} stroke="#3f4937" strokeWidth=".6" fill="none" opacity=".65"/>
    <path d={`M4-10Q${length*.5}-13 ${length-10}-6M8 10Q${length*.5} 15 ${length-12} 7`} fill="none" stroke="#b0ae87" strokeWidth=".7"/>
    <path d={`M${length-9}-9l-2 18h8l2-18Z`} fill="#c5aa74" strokeWidth=".6"/>
    <path d={`M${length-7}-7l-2 14`} stroke="#f0d6a0" strokeWidth=".55"/>
  </g>;
}
export function TurkArm({id}:{id:string}) {
  return <g data-operator-part="turk-playing-arm">
    <ellipse cx={shoulder.x+3} cy={shoulder.y+3} rx="17" ry="14" fill="#303e30" opacity=".3"/>
    <g className={styles.chess} style={moveStyle(id,"upper")}><Sleeve length={upperLength}/></g>
    <g className={styles.chess} style={moveStyle(id,"fore")}><Sleeve length={foreLength} fore/></g>
    <g className={styles.chess} style={moveStyle(id,"hand")} stroke={ink} strokeWidth=".8" strokeLinejoin="round">
      <path d="M24-12 16-12Q8-14 3-8L-3-3 -3 2Q0 5 2 1L5-3 12-3 22 0Z" fill="#d9c69d"/>
      <path d="M20-10 14-9 8-7M19-6 12-5M20-3 15-3" fill="none" stroke="#9a815c" strokeWidth=".55"/>
      <g className={styles.chess} style={moveStyle(id,"finger")}><path d="M10-6Q4-8 0-4L-5 1Q-6 4-3 5L1 3 4 0 10-1" fill="#dfcba2"/><path d="M1-1 4 0M-2 2 1 3" stroke="#a78c64" fill="none" strokeWidth=".5"/></g>
    </g>
  </g>;
}
export function OperatorControl({id}:{id:string}) {
  return <g data-operator-part="operator-control" strokeLinejoin="round">
    {/* Roof transmission, guide, input bell crank and the visible driven arbor. */}
    <path d="M319 136V121H476V96M476 121V268" fill="none" stroke="#302c22" strokeWidth="5"/>
    <path d="M319 136V121H476V96M476 121V268" fill="none" stroke={brass} strokeWidth="2.8"/>
    <path d="M321 119H474M474 126V267" stroke="#d1b985" strokeWidth=".65" fill="none"/>
    <path d="M310 126H328V145H310Z" fill="#726448" stroke={ink}/>
    <path d="M315 128V144M323 128V144" stroke="#c6ae78" strokeWidth=".8"/>
    <path d="M340 244H357V259H338Z" fill="#706047" stroke={ink}/>
    <g className={styles.chess} style={{...moveStyle(id,"lever"),transformOrigin:"340px 244px"}}>
      <path d="M340 244 334 182" stroke="#332d23" strokeWidth="5"/>
      <path d="M340 244 334 182" stroke={brass} strokeWidth="2.7"/>
      <path d="M338 238 333 190" stroke="#dbc491" strokeWidth=".7"/>
      <Screw x={334} y={182} r={3}/>
    </g>
    <g className={styles.chess} style={moveStyle(id,"rod")}><path d="M0-2H50V2H0Z" fill={brass} stroke={ink} strokeWidth=".65"/><path d="M2-1H47" stroke="#e0c899" strokeWidth=".5"/></g>
    <Screw x={319} y={136} r={2.8}/><Screw x={340} y={244} r={3.2}/>
    <g className={styles.chess} style={{...moveStyle(id,"drive"),transformOrigin:"476px 121px"}}><circle cx="476" cy="121" r="9" fill="#796849" stroke={ink}/><path d="M469 121H483M476 114V128" stroke="#cbb17b" strokeWidth="1.1"/></g>
    <Screw x={476} y={121} r={2.4}/>
    <path d="M469 249H483V259H469ZM472 89V98M480 89V98" stroke={ink} fill={brass} strokeWidth="1"/>
    <path d="M467 94H485V99H467Z" fill={brass} stroke={ink} strokeWidth=".8"/>
  </g>;
}
