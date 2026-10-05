import { armPose, chessTransforms, foreLength, gripPoint, indicatorBoard, innerBoard, innerPieceScale, mainBoard, mainPieceScale, move, moveState, pawnPoint, position, shoulder, squareCenter, upperLength, wristPoint } from "@/lib/production-systems/operator-chess";

function boardCoordinates(p:{x:number;y:number},board:typeof mainBoard,lift:number) {
  const row=(p.y+lift-board.y)/(board.depth/8);
  return { row, col:(p.x-board.x-row*board.skew/8)/(board.width/8) };
}
function matrix(s:string) { return s.slice(7,-1).split(",").map(Number); }
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);

describe("one decision on two chess boards",()=>{
  it("uses a legal unobstructed initial double pawn move with the same position on both boards",()=>{
    expect(move.from%8).toBe(move.to%8);
    expect(Math.floor(move.from/8)).toBe(6);
    expect(move.to).toBe(move.from-16);
    expect(position.some(p=>[move.from,move.from-8,move.to].includes(p.square))).toBe(false);
    expect(position.filter(p=>p.kind==="king")).toHaveLength(2);
    for(const board of [mainBoard,innerBoard]) {
      expect(pawnPoint(0,board,20)).toEqual(squareCenter(move.from,board));
      expect(pawnPoint(.65,board,20)).toEqual(squareCenter(move.to,board));
    }
  });

  it("keeps the boards at identical file/rank progress and both hands on their held pawn",()=>{
    for(let i=0;i<=100;i++) {
      const t=i/100,state=moveState(t),a=boardCoordinates(pawnPoint(t,mainBoard,20),mainBoard,state.lift*20),b=boardCoordinates(pawnPoint(t,innerBoard,10),innerBoard,state.lift*10);
      expect(a.col).toBeCloseTo(b.col,8);expect(a.row).toBeCloseTo(b.row,8);
      if(t>=.16&&t<=.6) for(const [board,scale,lift] of [[mainBoard,mainPieceScale,20],[innerBoard,innerPieceScale,10]] as const) {
        const pawn=pawnPoint(t,board,lift),grip=gripPoint(t,board,scale,lift);
        expect(grip.x).toBeCloseTo(pawn.x);expect(grip.y).toBeCloseTo(pawn.y-39*scale);
      }
    }
  });

  it("keeps both rigid arm segments attached and within reach throughout the gesture",()=>{
    for(let i=0;i<=100;i++) {
      const t=i/100,wrist=wristPoint(t),pose=armPose(wrist),css=chessTransforms(t);
      expect(distance(shoulder,pose.elbow)).toBeCloseTo(upperLength,8);
      expect(distance(pose.elbow,wrist)).toBeCloseTo(foreLength,8);
      const upper=matrix(css.upper),fore=matrix(css.fore);
      expect(upper[4]+upper[0]*upperLength).toBeCloseTo(fore[4],1);
      expect(upper[5]+upper[1]*upperLength).toBeCloseTo(fore[5],1);
      expect(fore[4]+fore[0]*foreLength).toBeCloseTo(wrist.x,1);
      expect(fore[5]+fore[1]*foreLength).toBeCloseTo(wrist.y,1);
    }
  });

  it("fits the upper board under a relaxed reach and keeps its indicators vertically aligned",()=>{
    for(let i=0;i<64;i++) {
      const top=squareCenter(i,mainBoard),below=squareCenter(i,indicatorBoard);
      expect(below.x).toBeCloseTo(top.x,8);
      expect(below.y-top.y).toBe(69);
    }
    for(let i=0;i<=100;i++) {
      const wrist=wristPoint(i/100),pose=armPose(wrist);
      // A real bend remains even at maximum reach; elbow stays outside the torso.
      expect(distance(shoulder,wrist)).toBeLessThan((upperLength+foreLength)*.94);
      expect(pose.elbow.x).toBeLessThan(shoulder.x);
      expect(pose.elbow.y).toBeLessThan(30);
    }
  });

  it("withdraws the hand before resetting and never shows the pawn sliding backwards",()=>{
    expect(moveState(.8).travel).toBe(1);
    expect(moveState(.8).handReturn).toBeGreaterThan(0);
    expect(moveState(.96).resetOpacity).toBe(0);
    expect(chessTransforms(1)).toEqual(chessTransforms(0));
    for(let i=1;i<96;i++) expect(moveState(i/100).travel).toBeGreaterThanOrEqual(moveState((i-1)/100).travel);
  });
});
