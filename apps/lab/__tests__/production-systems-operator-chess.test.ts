import { boardOutline, mainLift, innerLift, control, leverState, armPose, chessTransforms, foreLength, gripPoint, indicatorBoard, innerBoard, innerPieceScale, mainBoard, mainPieceScale, move, moveState, pawnPoint, position, shoulder, squareCenter, upperLength, wristPoint } from "@/lib/production-systems/operator-chess";

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
    // Supporting rooks must not put a king in check before the demonstration.
    for(const king of position.filter(p=>p.kind==="king")) for(const rook of position.filter(p=>p.kind==="rook"&&p.dark!==king.dark)) {
      expect(rook.square%8).not.toBe(king.square%8);
      expect(Math.floor(rook.square/8)).not.toBe(Math.floor(king.square/8));
    }
    for(const board of [mainBoard,innerBoard]) {
      expect(pawnPoint(0,board,20)).toEqual(squareCenter(move.from,board));
      expect(pawnPoint(.65,board,20)).toEqual(squareCenter(move.to,board));
    }
  });

  it("keeps both boards and their mitred frames on one cabinet projection",()=>{
    expect(mainBoard.depth/mainBoard.width).toBeCloseTo(innerBoard.depth/innerBoard.width,10);
    for(const board of [mainBoard,innerBoard]) {
      const [a,b,c,d]=boardOutline(board,.3,.55);
      expect(a.y).toBe(b.y);expect(c.y).toBe(d.y);
      expect((d.x-a.x)/(d.y-a.y)).toBeCloseTo(-1/Math.sqrt(3),10);
      expect(b.x-a.x).toBeCloseTo(c.x-d.x,10);
    }
    const mainRim=boardOutline(mainBoard,.3,.55),innerRim=boardOutline(innerBoard,.3,.55);
    expect(mainRim[0].y).toBeGreaterThan(37); // rear rail rests inside the tabletop
    expect(mainRim[3].y+4.5).toBeLessThan(97); // front lip remains on its support
    expect(innerRim[3].y+3.5).toBeLessThan(315); // visible above the sectioned wall
  });

  it("keeps the boards at identical file/rank progress and both hands on their held pawn",()=>{
    for(let i=0;i<=100;i++) {
      const t=i/100,state=moveState(t),a=boardCoordinates(pawnPoint(t,mainBoard,mainLift),mainBoard,state.lift*mainLift),b=boardCoordinates(pawnPoint(t,innerBoard,innerLift),innerBoard,state.lift*innerLift);
      expect(a.col).toBeCloseTo(b.col,8);expect(a.row).toBeCloseTo(b.row,8);
      if(t>=.16&&t<=.6) for(const [board,scale,lift] of [[mainBoard,mainPieceScale,mainLift],[innerBoard,innerPieceScale,innerLift]] as const) {
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

  it("preserves the forward operator grip and keeps its link rigid through the pull",()=>{
    expect(control.pivot).toEqual({x:340,y:244});
    expect(leverState(0).tip).toEqual({x:334,y:182});
    for(let i=0;i<=100;i++) {
      const t=i/100,state=leverState(t),rod=matrix(chessTransforms(t).rod);
      expect(distance(state.pin,state.tip)).toBeCloseTo(control.linkLength,8);
      expect(distance(control.roof,state.pin)).toBeCloseTo(control.crankRadius,8);
      expect(distance(control.pivot,state.tip)).toBeCloseTo(distance(control.pivot,control.grip),8);
      expect(state.tip.x).toBeLessThan(355); // stays in front of the face, never behind the body
      expect(rod[4]+rod[0]*control.linkLength).toBeCloseTo(state.tip.x,1);
      expect(rod[5]+rod[1]*control.linkLength).toBeCloseTo(state.tip.y,1);
    }
  });

  it("pulls toward the body during the move, holds through placement and returns with withdrawal",()=>{
    expect(leverState(.1).angle).toBe(0);
    expect(leverState(.28).angle).toBeGreaterThan(4);
    expect(leverState(.48).angle).toBe(14);
    expect(leverState(.65).angle).toBe(14);
    expect(leverState(.8).angle).toBeLessThan(14);
    expect(leverState(.9).angle).toBe(0);
    expect(leverState(.48).tip.x-leverState(0).tip.x).toBeGreaterThan(14);
  });

  it("withdraws the hand before resetting and never shows the pawn sliding backwards",()=>{
    expect(moveState(.8).travel).toBe(1);
    expect(moveState(.8).handReturn).toBeGreaterThan(0);
    expect(moveState(.96).resetOpacity).toBe(0);
    expect(chessTransforms(1)).toEqual(chessTransforms(0));
    for(let i=1;i<96;i++) expect(moveState(i/100).travel).toBeGreaterThanOrEqual(moveState((i-1)/100).travel);
  });
});
