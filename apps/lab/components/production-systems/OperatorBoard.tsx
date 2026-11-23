import { boardOutline, boardPoint, type ChessBoard, type Point } from "@/lib/production-systems/operator-chess";

const polygon=(points:Point[])=>`M${points.map(p=>`${p.x} ${p.y}`).join("L")}Z`;
const lower=(p:Point,drop:number)=>({...p,y:p.y+drop});

/** All rails, mitres and square inlays live in the cabinet's projected plane. */
export function BoardSurface({board,inside}:{board:ChessBoard;inside:boolean}) {
  const rim=boardOutline(board,.3,.55), lip=boardOutline(board,.35,.65);
  const drop=inside?3.5:4.5;
  return <g strokeLinejoin="round" data-chess-surface={inside?"private":"public"}>
    <path d={polygon(lip.map(p=>lower(p,drop+1.2)))} fill="#25281e" opacity=".3" stroke="none"/>
    <path d={polygon([rim[0],rim[3],lower(rim[3],drop),lower(rim[0],drop)])} fill="#5b422d" stroke="#433c2c" strokeWidth=".65"/>
    <path d={polygon([rim[3],rim[2],lower(rim[2],drop),lower(rim[3],drop)])} fill="#795437" stroke="#433c2c" strokeWidth=".65"/>
    <path d={polygon(rim)} fill="#9e7950" stroke="#443d2e" strokeWidth=".85"/>
    <path d={polygon(boardOutline(board,.16,.29))} fill="none" stroke="#d7ba7e" strokeWidth=".55"/>
    {/* Quiet maple/olive inlays separate the board from the ivory/ebony pieces. */}
    {Array.from({length:64},(_,i)=>{
      const f=i%8,r=Math.floor(i/8),dark=(f+r)%2===1;
      const p=[boardPoint(board,f,r),boardPoint(board,f+1,r),boardPoint(board,f+1,r+1),boardPoint(board,f,r+1)];
      return <path key={i} d={polygon(p)} fill={dark?"#8b8b70":"#c6b893"} stroke="#756c50" strokeWidth=".3"/>;
    })}
    <path d={polygon(boardOutline(board))} fill="none" stroke="#463f2f" strokeWidth=".9"/>
    <path d={Array.from({length:8},(_,r)=>{
      const a=boardPoint(board,0,r+.23),b=boardPoint(board,8,r+.23);
      return `M${a.x} ${a.y}L${b.x} ${b.y}`;
    }).join("")} fill="none" stroke="#eee0b9" strokeWidth=".35" opacity=".28"/>
    <path d={rim.map((p,i)=>`M${p.x} ${p.y}L${boardOutline(board)[i].x} ${boardOutline(board)[i].y}`).join("")} fill="none" stroke="#695034" strokeWidth=".55"/>
    <path d={`M${rim[3].x} ${rim[3].y+.75}L${rim[2].x} ${rim[2].y+.75}`} stroke="#eed4a0" strokeWidth=".7"/>
    <path d={`M${rim[3].x} ${rim[3].y+drop-1}L${rim[2].x} ${rim[2].y+drop-1}`} stroke="#503d2a" strokeWidth=".6"/>
    <g fill="#ead7ad" fontFamily="Georgia, serif" fontSize={inside?3.8:4.5} textAnchor="middle" stroke="none" aria-hidden="true">
      {Array.from({length:8},(_,i)=>{const p=boardPoint(board,i+.5,8.52);return <text key={i} x={p.x} y={p.y+drop-.5}>{"abcdefgh"[i]}</text>;})}
    </g>
  </g>;
}

/** Turned chessmen with readable outlines at the page's actual illustration size.
 * The pawn's crown stays at y=-39, shared by the two hand-contact calculations. */
export function ChessMan({x,y,scale,kind="pawn",dark=false}:{x:number;y:number;scale:number;kind?:"pawn"|"king"|"rook";dark?:boolean}) {
  const body=dark?"#293e33":"#f5e8c6", shade=dark?"#1c2c25":"#c5ac79";
  const light=dark?"#a1ad82":"#fff6da", contour=dark?"#dfcd9d":"#3b3b2e";
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round" strokeLinecap="round" data-chess-piece={kind}>
    <ellipse cy="2" rx="18" ry="5" fill="#283023" opacity=".32" stroke="none"/>
    <g fill={body} stroke={contour} strokeWidth="1.7">
      {kind==="pawn"?<>
        <path d="M-12-9Q-5-18-6-27H6Q5-18 12-9Z"/>
        <ellipse cy="-28" rx="10" ry="3" fill={shade}/>
        <circle cy="-39" r="9"/>
        <path d="M3-47Q13-37 3-32Q9-38 3-47M3-25 3-17 9-10H4L-1-13" fill={shade} stroke="none"/>
        <path d="M-5-42Q-7-39-5-36M-3-24-5-13" fill="none" stroke={light} strokeWidth="2"/>
      </>:kind==="king"?<>
        <path d="M-12-9Q-6-23-7-37L-11-48H11L7-37Q6-23 12-9Z"/>
        <path d="M-10-50-13-58-5-60V-65H-9V-70H-4V-76H4V-70H9V-65H5V-60L13-58 10-50Z"/>
        <ellipse cy="-49" rx="12" ry="3" fill={shade}/>
        <path d="M4-46 3-29 9-11H3Q-2-28 4-46" fill={shade} stroke="none"/>
        <path d="M-6-55H4M-3-43-4-23M-1-68V-72" fill="none" stroke={light} strokeWidth="1.9"/>
      </>:<>
        <path d="M-12-9-8-18-8-42H8V-18L12-9Z"/>
        <path d="M-12-42-14-54V-60H-7V-55H-3V-60H3V-55H7V-60H14V-54L12-42Z"/>
        <path d="M3-40H8V-18L11-10H4L0-17Z" fill={shade} stroke="none"/>
        <path d="M-5-39V-20M-9-48H6" fill="none" stroke={light} strokeWidth="1.8"/>
      </>}
      <path d="M-12-10H12L16-6V-1Q0 7-16-1V-6Z"/>
      <path d="M-15-5Q0-1 15-5M-13 0Q0 4 13 0" fill="none" stroke={shade} strokeWidth="1.4"/>
      <path d="M-12-7H8M-12-2Q-6 0-2 0" fill="none" stroke={light} strokeWidth="1.5"/>
    </g>
  </g>;
}
