/** One demonstration, sampled once on the server for every linked part. */
export type Point = { x: number; y: number };
export type ChessBoard = Point & { width: number; depth: number; skew: number };
export const mainBoard: ChessBoard = { x: 246, y: 42, width: 180, depth: 42, skew: -42/Math.sqrt(3) };
export const innerBoard: ChessBoard = { x: 232, y: 269, width: 150, depth: 35, skew: -35/Math.sqrt(3) };
export const mainPieceScale=.52, innerPieceScale=.44;
export const indicatorBoard: ChessBoard = { ...mainBoard, y: mainBoard.y + 69 };
export const mainLift=24, innerLift=13;
export const handScale = .8;
export const move = { from: 52, to: 36 }; // e2 → e4, viewed from White's side.
export const position = [{ square: 1, kind: "rook", dark: true }, { square: 3, kind: "king", dark: true }, { square: 10, kind: "pawn", dark: true }, { square: 56, kind: "king", dark: false }, { square: 62, kind: "rook", dark: false }] as const;
/** One affine plane for cells, rails, feet and all piece contacts. Depth follows
 * the cabinet's 30-degree return; positive rank runs toward the viewer. */
export function boardPoint(board: ChessBoard, file: number, rank: number): Point {
  return { x: board.x+file*board.width/8+rank*board.skew/8, y: board.y+rank*board.depth/8 };
}
export function boardOutline(board: ChessBoard, marginFile=0, marginRank=0) {
  return [boardPoint(board,-marginFile,-marginRank),boardPoint(board,8+marginFile,-marginRank),boardPoint(board,8+marginFile,8+marginRank),boardPoint(board,-marginFile,8+marginRank)];
}
export function squareCenter(square: number, board: ChessBoard): Point {
  return boardPoint(board,square%8+.5,Math.floor(square/8)+.5);
}
const mix = (a: number, b: number, t: number) => a+(b-a)*t;
const ramp = (t: number, a: number, b: number) => { const p=Math.max(0,Math.min(1,(t-a)/(b-a))); return p*p*(3-2*p); };
export function moveState(t: number) {
  // The pawn stays placed while the hand withdraws. Only the brief loop reset
  // dissolves the pawn; never depict an illegal backwards chess move.
  const reset = t >= .96;
  return { travel: reset ? 0 : ramp(t,.28,.48), lift: reset ? 0 : ramp(t,.16,.28)*(1-ramp(t,.48,.59)), grip: ramp(t,.08,.16)*(1-ramp(t,.60,.68)), resetOpacity: t<.90 ? 1 : t<.96 ? 1-ramp(t,.90,.96) : ramp(t,.96,1), handReturn: ramp(t,.70,.88) };
}
export function pawnPoint(t: number, board: ChessBoard, lift: number): Point {
  const s=moveState(t), a=squareCenter(move.from,board), b=squareCenter(move.to,board);
  return { x:mix(a.x,b.x,s.travel), y:mix(a.y,b.y,s.travel)-s.lift*lift };
}
export function gripPoint(t: number, board: ChessBoard, scale: number, lift: number): Point {
  const p=pawnPoint(t,board,lift), a=squareCenter(move.from,board), s=moveState(t);
  // Return above the board, then approach the starting piece for the next loop.
  const clear=10*ramp(t,.64,.70)*(1-ramp(t,.88,.98));
  return { x:mix(p.x,a.x,s.handReturn), y:mix(p.y,a.y,s.handReturn)-39*scale-clear };
}
// Fit the board to the seated figure's natural reach, not the limbs to a distant board.
export const shoulder = { x: 416, y: -48 }, upperLength=68, foreLength=62;
export function wristPoint(t: number): Point {
  const grip = gripPoint(t,mainBoard,mainPieceScale,mainLift);
  return { x:grip.x+22*handScale, y:grip.y-7*handScale };
}
export function armPose(wrist: Point) {
  const dx=wrist.x-shoulder.x, dy=wrist.y-shoulder.y, d=Math.hypot(dx,dy);
  if (d>upperLength+foreLength || d<Math.abs(upperLength-foreLength)) throw new Error("Turk wrist is outside its articulated reach");
  const a=Math.atan2(dy,dx)-Math.acos((upperLength**2+d*d-foreLength**2)/(2*upperLength*d));
  const elbow={x:shoulder.x+upperLength*Math.cos(a),y:shoulder.y+upperLength*Math.sin(a)};
  return { elbow, upperAngle:a*180/Math.PI, foreAngle:Math.atan2(wrist.y-elbow.y,wrist.x-elbow.x)*180/Math.PI };
}
const n=(v:number)=>Math.round(v*10000)/10000;
export function segmentMatrix(a: Point, b: Point, length: number) {
  const x=(b.x-a.x)/length,y=(b.y-a.y)/length;
  return `matrix(${n(x)},${n(y)},${n(-y)},${n(x)},${n(a.x)},${n(a.y)})`;
}
export function forearmMatrix(t: number) {
  const origin={x:388,y:262}, original={x:300,y:291}, grip=gripPoint(t,innerBoard,innerPieceScale,innerLift);
  const target={x:grip.x+3,y:grip.y-4};
  const u={x:original.x-origin.x,y:original.y-origin.y},v={x:target.x-origin.x,y:target.y-origin.y};
  const norm=u.x*u.x+u.y*u.y, a=(u.x*v.x+u.y*v.y)/norm,b=(u.x*v.y-u.y*v.x)/norm;
  return `matrix(${n(a)},${n(b)},${n(-b)},${n(a)},${n(origin.x-a*origin.x+b*origin.y)},${n(origin.y-b*origin.x-a*origin.y)})`;
}
// Preserve the approved operator's forward grip and elbow. The raised lever
// drives a short rigid link and a roof rocker; the wall movement is downstream.
export const control = { pivot:{x:340,y:244}, grip:{x:334,y:182}, roof:{x:319,y:136}, crankRadius:20, linkLength:38 } as const;
export function leverState(t:number) {
  const pull=ramp(t,.12,.48)*(1-moveState(t).handReturn), angle=14*pull, r=angle*Math.PI/180;
  const {pivot,grip,roof,crankRadius:a,linkLength:b}=control;
  const tip={x:pivot.x+(grip.x-pivot.x)*Math.cos(r)-(grip.y-pivot.y)*Math.sin(r),y:pivot.y+(grip.x-pivot.x)*Math.sin(r)+(grip.y-pivot.y)*Math.cos(r)};
  const dx=tip.x-roof.x,dy=tip.y-roof.y,d=Math.hypot(dx,dy);
  if(d>a+b||d<Math.abs(a-b)) throw new Error("Operator link is outside its roof rocker's reach");
  const drive=Math.atan2(dy,dx)-Math.acos((a*a+d*d-b*b)/(2*a*d));
  return {angle,tip,drive:drive*180/Math.PI,pin:{x:roof.x+a*Math.cos(drive),y:roof.y+a*Math.sin(drive)}};
}
export function chessTransforms(t:number) {
  const main=pawnPoint(t,mainBoard,mainLift), inner=pawnPoint(t,innerBoard,innerLift), grip=gripPoint(t,mainBoard,mainPieceScale,mainLift);
  const wrist=wristPoint(t), arm=armPose(wrist), lever=leverState(t), s=moveState(t);
  return {
    mainShadow:`translate(${n(main.x+s.lift*3)}px,${n(main.y+s.lift*(mainLift+1))}px) scale(${n(1+s.lift*.3)})`,
    innerShadow:`translate(${n(inner.x+s.lift*2)}px,${n(inner.y+s.lift*(innerLift+1))}px) scale(${n(1+s.lift*.3)})`,
    mainPawn:`translate(${n(main.x)}px,${n(main.y)}px)`, innerPawn:`translate(${n(inner.x)}px,${n(inner.y)}px)`,
    upper:segmentMatrix(shoulder,arm.elbow,upperLength), fore:segmentMatrix(arm.elbow,wrist,foreLength),
    hand:`translate(${n(grip.x)}px,${n(grip.y)}px) scale(${handScale})`, finger:`rotate(${n((1-s.grip)*-18)}deg)`,
    operatorHand:forearmMatrix(t), lever:`rotate(${n(lever.angle)}deg)`,
    rod:segmentMatrix(lever.pin,lever.tip,control.linkLength),
    rocker:`rotate(${n(lever.drive)}deg)`, drive:`rotate(${n(lever.drive-leverState(0).drive)}deg)`,
  };
}
export function chessKeyframes(id:string) {
  const keys=Object.keys(chessTransforms(0)) as (keyof ReturnType<typeof chessTransforms>)[];
  // Dense shared samples bound the mismatch caused by CSS matrix interpolation;
  // no requestAnimationFrame, React state or per-frame inverse kinematics.
  const frames=Array.from({length:101},(_,i)=>({at:i,t:i/100,pose:chessTransforms(i/100)}));
  return keys.map(key=>`@keyframes ${id}-${key}{${frames.map(f=>`${f.at}%{transform:${f.pose[key]};${(key.endsWith("Pawn")||key.endsWith("Shadow"))?`opacity:${n(moveState(f.t).resetOpacity)};`:""}}`).join("")}}`).join("")+
    ["origin","destination"].map(key=>`@keyframes ${id}-${key}{${frames.map(f=>{const s=moveState(f.t),near=(key==="origin"?1-s.travel:s.travel)*(1-s.lift);return `${f.at}%{opacity:${n(.18+.82*near)}}`;}).join("")}}`).join("");
}
