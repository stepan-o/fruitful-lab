import type { CSSProperties } from "react";
import { Board, Piece } from "./engraving-primitives";
import { chessTransforms, foreLength, innerBoard, innerPieceScale, mainBoard, mainPieceScale, move, position, shoulder, squareCenter, upperLength, type ChessBoard } from "@/lib/production-systems/operator-chess";
import styles from "./turk-operator.module.css";

const ink="#463a30";
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
  const root=fore?10:13, end=fore?7:9;
  // Tapered cloth with long tension folds and gathered elbow creases; avoid
  // identical ribs, which make the human sleeve read as an extensible hose.
  return <g stroke={ink} strokeLinejoin="round" strokeLinecap="round">
    <path d={`M0-${root}Q${length*.3}-${root+4} ${length-8}-${end}L${length+2}-${end-2}Q${length+5} 0 ${length+2} ${end-2}L${length-8} ${end}Q${length*.32} ${root+3} 0 ${root}Q-7 0 0-${root}Z`} fill={fore?"#819075":"#7b896e"} strokeWidth="1"/>
    <path d={Array.from({length:14},(_,i)=>{
      const x=4+i*(length-12)/14, half=root+(end-root)*x/length;
      return `M${x} ${-half+1+(i%3)*1.2}q${-2+(i%4)} ${half*.8} ${1+(i%3)} ${half*1.5-(i%2)*2}`;
    }).join("")} stroke="#46513c" strokeWidth=".5" fill="none" opacity=".65"/>
    <path d={`M6 ${-root+3}Q${length*.36} -6 ${length-11} ${-end+3}M10 ${root-3}Q${length*.5} 5 ${length-12} ${end-3}M${length-19} ${-end+1}q-7 5-3 12m7-14q-4 5-2 12`} fill="none" stroke="#4c5842" strokeWidth=".65"/>
    <path d={`M5 ${-root+1}Q${length*.3} ${-root-1} ${length-12} ${-end+1}M8 ${root-2}Q${length*.4} ${root-1} ${length-14} ${end-1}`} fill="none" stroke="#c0bb95" strokeWidth=".6"/>
    {fore&&<g><path d={`M${length-7}-8l-1 16h7l1-16Z`} fill="#c5aa74" strokeWidth=".6"/><path d={`M${length-5}-6l-1 12`} stroke="#f0d6a0" strokeWidth=".55"/></g>}
  </g>;
}
export function TurkArm({id}:{id:string}) {
  return <g data-operator-part="turk-playing-arm">
    <ellipse cx={shoulder.x+3} cy={shoulder.y+3} rx="13" ry="12" fill="#303e30" opacity=".3"/>
    <g className={styles.chess} style={moveStyle(id,"upper")}><Sleeve length={upperLength}/></g>
    <g className={styles.chess} style={moveStyle(id,"fore")}><Sleeve length={foreLength} fore/></g>
    <g className={styles.chess} style={moveStyle(id,"hand")} stroke={ink} strokeWidth=".8" strokeLinejoin="round">
      <path d="M24-12 16-12Q8-14 3-8L-3-3 -3 2Q0 5 2 1L5-3 12-3 22 0Z" fill="#d9c69d"/>
      <path d="M20-10 14-9 8-7M19-6 12-5M20-3 15-3" fill="none" stroke="#9a815c" strokeWidth=".55"/>
      <g className={styles.chess} style={moveStyle(id,"finger")}><path d="M10-6Q4-8 0-4L-5 1Q-6 4-3 5L1 3 4 0 10-1" fill="#dfcba2"/><path d="M1-1 4 0M-2 2 1 3" stroke="#a78c64" fill="none" strokeWidth=".5"/></g>
    </g>
  </g>;
}
