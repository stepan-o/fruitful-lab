/** One demonstration, sampled once on the server for every linked part. */
export type Point = { x: number; y: number };
export type ChessBoard = Point & { width: number; depth: number; skew: number };
export const mainBoard: ChessBoard = { x: 145, y: 40, width: 226, depth: 42, skew: -42/Math.sqrt(3) };
export const innerBoard: ChessBoard = { x: 230, y: 277, width: 145, depth: 32, skew: -32/Math.sqrt(3) };
export const mainPieceScale=.4, innerPieceScale=.27;
export const move = { from: 52, to: 36 }; // e2 → e4, viewed from White's side.
export const position = [{ square: 7, kind: "king", dark: true }, { square: 10, kind: "pawn", dark: true }, { square: 56, kind: "king", dark: false }] as const;
export function squareCenter(square: number, board: ChessBoard): Point {
  const file = square % 8 + .5, rank = Math.floor(square / 8) + .5;
  return { x: board.x + file*board.width/8 + rank*board.skew/8, y: board.y + rank*board.depth/8 };
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
export const shoulder = { x: 420, y: -58 }, upperLength=102, foreLength=108;
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
  const origin={x:388,y:262}, original={x:300,y:291}, grip=gripPoint(t,innerBoard,innerPieceScale,10);
  const target={x:grip.x+3,y:grip.y-4};
  const u={x:original.x-origin.x,y:original.y-origin.y},v={x:target.x-origin.x,y:target.y-origin.y};
  const norm=u.x*u.x+u.y*u.y, a=(u.x*v.x+u.y*v.y)/norm,b=(u.x*v.y-u.y*v.x)/norm;
  return `matrix(${n(a)},${n(b)},${n(-b)},${n(a)},${n(origin.x-a*origin.x+b*origin.y)},${n(origin.y-b*origin.x-a*origin.y)})`;
}
export function leverState(t:number) {
  const s=moveState(t), angle=-7*(s.lift*.65+s.travel*.35)*(1-s.handReturn), r=angle*Math.PI/180;
  const pivot={x:340,y:244}, tip={x:334,y:182};
  return { angle, tip:{ x:pivot.x+(tip.x-pivot.x)*Math.cos(r)-(tip.y-pivot.y)*Math.sin(r),y:pivot.y+(tip.x-pivot.x)*Math.sin(r)+(tip.y-pivot.y)*Math.cos(r) } };
}
export function chessTransforms(t:number) {
  const main=pawnPoint(t,mainBoard,20), inner=pawnPoint(t,innerBoard,10), grip=gripPoint(t,mainBoard,mainPieceScale,20);
  const wrist={x:grip.x+22,y:grip.y-7}, arm=armPose(wrist), lever=leverState(t), s=moveState(t);
  return {
    mainShadow:`translate(${n(main.x+s.lift*3)}px,${n(main.y+s.lift*21)}px) scale(${n(1+s.lift*.3)})`,
    innerShadow:`translate(${n(inner.x+s.lift*2)}px,${n(inner.y+s.lift*11)}px) scale(${n(1+s.lift*.3)})`,
    mainPawn:`translate(${n(main.x)}px,${n(main.y)}px)`, innerPawn:`translate(${n(inner.x)}px,${n(inner.y)}px)`,
    upper:segmentMatrix(shoulder,arm.elbow,upperLength), fore:segmentMatrix(arm.elbow,wrist,foreLength),
    hand:`translate(${n(grip.x)}px,${n(grip.y)}px)`, finger:`rotate(${n((1-s.grip)*-18)}deg)`,
    operatorHand:forearmMatrix(t), lever:`rotate(${n(lever.angle)}deg)`,
    rod:segmentMatrix({x:319,y:136},lever.tip,50), drive:`rotate(${n(lever.angle*2)}deg)`,
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
