import type { CSSProperties } from "react";
import { board, cast, keyframes, lamp, n, outline, period, pieceShadow, pieces, placement, polygon, project, square, stage, surface, surfacePath, type ChessPiece, type WorldPoint } from "@/lib/production-systems/chess-study";
import styles from "./chess-study.module.css";
const anim=(name:string):CSSProperties=>({animationName:name,animationDuration:`${period}s`});
const face=(points:WorldPoint[])=>polygon(points.map(project));

function Chessman({piece,id}:{piece:ChessPiece;id:string}) {
  const p=project(placement(piece)),body=piece.dark?"#304333":"#f2e4bf",shade=piece.dark?"#182a21":"#b89b68",edge=piece.dark?"#c0ad7f":"#fff6db";
  return <g transform={`translate(${n(p.x)} ${n(p.y)})`} data-study-piece={piece.id}>
    <g className={piece.kind==="knight"?styles.motion:undefined} style={piece.kind==="knight"?anim(`${id}-move`):undefined}>
      <g transform={`scale(${piece.scale})`} strokeLinejoin="round" strokeLinecap="round">
        <use href={`#${id}-${piece.kind}`} fill={body} stroke={piece.dark?"#18251d":"#4a4230"} strokeWidth="1.2"/>
        <g clipPath={`url(#${id}-${piece.kind}-clip)`}>
          <path d="M-25-85H-1Q-7-53-2-31L-8-12-2 8H-25Z" fill={shade} opacity={piece.dark?.48:.35}/>
          <path d="M11-78Q24-39 8-18L16-8 19 3" stroke={edge} opacity=".76" fill="none" strokeWidth="1.6"/>
          <path d={Array.from({length:24},(_,i)=>`M${-21+i*.6} ${-70+i*2.6}q10 -3 17 1`).join("")} stroke={piece.dark?"#101f18":"#6e6043"} opacity=".4" strokeWidth=".45" fill="none"/>
        </g>
        {piece.kind==="knight"?<>
          <path d="M-4-55Q10-47 7-30M-15-44l5-4M-18-38h7M-9-29l12-8" fill="none" stroke="#514632" strokeWidth="1.1"/>
          {/* Preserve the lowered eye and long muzzle of the original sad horse. */}
          <path d="M-10-52q3 0 5 2M-19-40l3 1" stroke="#4b4230" strokeWidth="1.2" fill="none"/>
          <circle cx="-7" cy="-50" r="1.3" fill="#3e392b"/>
          <path d="M-11-59-10-54M0-59Q13-49 10-26M-16-35l7 0" fill="none" stroke="#fff3cf" strokeWidth="1.3"/>
          <path d={Array.from({length:14},(_,i)=>`M${2+i*.48} ${-55+i*2.4}q6 7 0 13`).join("")} fill="none" stroke="#66543b" opacity=".8" strokeWidth=".6"/>
        </>:piece.kind==="king"?<>
          <ellipse cy="-48" rx="11.4" ry="2.9" fill={body} stroke={shade} strokeWidth="1"/>
          <path d="M-8-49Q0-46 9-49M-3-38Q-1-30-4-21M1-71v7M-5-65H4" stroke={edge} strokeWidth="1" fill="none"/>
          <path d="M-6-40H6M-5-35H5" stroke={shade} strokeWidth=".7"/>
        </>:<>
          <ellipse cy="-30" rx="9" ry="2.8" fill={body} stroke={shade} strokeWidth=".8"/>
          <path d="M3-44q5 2 4 7M-4-26-6-20M-6-30Q0-28 7-30" stroke={edge} strokeWidth="1.2" fill="none"/>
        </>}
        <path d="M-17-5Q0 1 17-5M-15 0Q0 4 15 0M-11-11H11M-7-17H7" stroke={shade} strokeWidth="1" fill="none"/>
        <path d="M-14-7Q0-3 14-7M2 2Q11 1 15-1" stroke={edge} strokeWidth=".95" fill="none"/>
        <path d={Array.from({length:10},(_,i)=>`M${-15+i*3.2} -4v4`).join("")} stroke={shade} strokeWidth=".5" fill="none"/>
      </g>
    </g>
  </g>;
}
function Candle({id}:{id:string}) {
  const base=project({...lamp,height:0}),source=project(lamp);
  return <>
    <ellipse cx={base.x} cy={base.y+1} rx="26" ry="5" fill="#443922" opacity=".18"/>
    <g transform={`translate(${n(base.x)} ${n(base.y)})`} stroke="#4e422b" strokeWidth="1" strokeLinejoin="round">
      <path d="M-27-4Q-29 4 0 7Q29 4 27-4L23-9H-23Z" fill={`url(#${id}-brass)`}/>
      <ellipse cy="-8" rx="23" ry="6" fill="#9b814e"/><ellipse cy="-8" rx="20" ry="4" fill="#4e4a30"/>
      <path d="M-19-8Q-6-14-6-24L-4-64H4L6-24Q6-14 19-8Z" fill={`url(#${id}-brass)`}/>
      <path d="M-4-58H4M-5-32H5M-7-26Q0-23 7-26M-13-13Q0-10 13-13" fill="none" stroke="#e4c88c" strokeWidth=".85"/>
      <path d="M16-22C43-38 47-4 23-2" fill="none" stroke="#594b2c" strokeWidth="5"/>
      <path d="M17-23C40-35 43-8 25-5" fill="none" stroke="#c6a86b" strokeWidth="2"/>
      <path d="M-14-67Q0-60 14-67L10-76H-10Z" fill={`url(#${id}-brass)`}/>
      <ellipse cy="-76" rx="14" ry="4" fill="#d4b880"/>
      <path d="M-7-77V-127Q-3-132 1-128Q5-124 7-129V-77Q0-74-7-77Z" fill={`url(#${id}-wax)`}/>
      <path d="M-5-126v26q3 9 4 0v-21M3-123v19q4 7 3 12" stroke="#cdb887" strokeWidth="1.3" fill="none"/>
      <ellipse cy="-128" rx="6" ry="2.8" fill="#c2a26b" stroke="none"/>
      <path d="M0-128q-2-5 0-9" stroke="#403629" strokeWidth="1.6" fill="none"/>
      <path d="M-22-4Q0 2 23-4M2-63V-32M8-17 14-13" stroke="#f0d495" fill="none" strokeWidth=".7"/>
      <path d="M-18-6l-2 3m5-2-1 3m5-2v3m5-2v3" stroke="#655232" strokeWidth=".55"/>
    </g>
    <g transform={`translate(${n(source.x)} ${n(source.y)})`}><g className={styles.motion} style={anim(`${id}-flame`)}>
      <ellipse rx="63" ry="78" fill={`url(#${id}-halo)`}/><ellipse rx="20" ry="27" fill={`url(#${id}-core)`}/>
      </g><g className={styles.motion} style={anim(`${id}-flame-shape`)}><path d="M0 12C-10 5-7-4-1-18C-3-6 12 0 0 12Z" fill="#c88538"/>
      <path d="M0 11C-5 6-4 0-1-9C-2-2 6 4 0 11Z" fill="#ffe4a4"/>
      <path d="M0 10Q-3 5 0 1Q4 7 0 10Z" fill="#fff8db"/>
    </g></g>
  </>;
}
/** Masks subtract only direct candle illumination. Each emitter sample unions
 * all silhouettes, so overlapping shadows cannot multiply their darkness. */
export default function ChessStudy({id}:{id:string}) {
  const rim=surface(board.rim),bottom=rim.map(p=>({...p,height:board.height-board.thickness}));
  const knight=pieces.find(piece=>piece.kind==="knight")!;
  const feet=[{x:board.x+11,depth:10},{x:board.x+board.width-11,depth:10},{x:board.x+11,depth:board.length-10},{x:board.x+board.width-11,depth:board.length-10}];
  return <>
    <style>{keyframes(id)}</style>
    <defs>
      <linearGradient id={`${id}-brass`}><stop stopColor="#665534"/><stop offset=".3" stopColor="#b19761"/><stop offset=".67" stopColor="#d2b879"/><stop offset="1" stopColor="#79663c"/></linearGradient>
      <linearGradient id={`${id}-wax`}><stop stopColor="#a79169"/><stop offset=".3" stopColor="#e2ce9c"/><stop offset=".8" stopColor="#f5e8bb"/><stop offset="1" stopColor="#cbb581"/></linearGradient>
      <radialGradient id={`${id}-halo`}><stop stopColor="#e9bb65" stopOpacity=".35"/><stop offset=".3" stopColor="#d8ac56" stopOpacity=".17"/><stop offset="1" stopColor="#d8ac56" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-core`}><stop stopColor="#fff3c8" stopOpacity=".68"/><stop offset=".25" stopColor="#f3d18d" stopOpacity=".3"/><stop offset="1" stopColor="#e9bb65" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-floor-light`} gradientUnits="userSpaceOnUse" cx="438.7" cy="201.1" r="405" gradientTransform="translate(0 80) scale(1 .6)"><stop stopColor="#dbc593" stopOpacity=".48"/><stop offset="1" stopColor="#c5b48c" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-direct`} gradientUnits="userSpaceOnUse" cx="438.7" cy="201.1" r="480"><stop stopColor="#fff0bd" stopOpacity=".51"/><stop offset=".64" stopColor="#eedba7" stopOpacity=".32"/><stop offset="1" stopColor="#d5bc8b" stopOpacity=".1"/></radialGradient>
      <radialGradient id={`${id}-surface-fade`}><stop stopColor="white"/><stop offset=".56" stopColor="white" stopOpacity=".7"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient>
      <mask id={`${id}-surface-mask`} maskUnits="userSpaceOnUse" x="0" y="170" width="600" height="250"><ellipse cx="300" cy="297" rx="295" ry="115" fill={`url(#${id}-surface-fade)`}/></mask>
      <clipPath id={`${id}-top`}><path d={surfacePath(board.rim)}/></clipPath>
      <clipPath id={`${id}-tiles`}><path d={surfacePath()}/></clipPath>
      {(["pawn","king","knight"] as const).map(kind=><g key={kind}><path id={`${id}-${kind}`} d={outline(kind)}/><clipPath id={`${id}-${kind}-clip`}><use href={`#${id}-${kind}`}/></clipPath></g>)}
      {[0,board.height].map(receiver=><g key={receiver}>
        {pieces.filter(piece=>piece.kind!=="knight").map(piece=><path key={piece.id} id={`${id}-${piece.id}-cast-${receiver}`} d={pieceShadow(piece,receiver)}/>)}
        {[-1,0,1].map(sample=><mask key={sample} id={`${id}-visibility-${receiver}-${sample+1}`} maskUnits="userSpaceOnUse" x="-160" y="-20" width="860" height="480" style={{maskType:"luminance"}}>
          <rect x="-160" y="-20" width="860" height="480" fill="white"/>
          <g fill="black">
            {receiver===0&&<>
              <path d={face(rim.map(p=>cast(p,0)))} className={styles.motion} style={anim(`${id}-case-${sample+1}`)}/>
              <path d={face(Array.from({length:32},(_,i)=>{const a=i*Math.PI/16;return cast({x:lamp.x+7*Math.cos(a),depth:lamp.depth+7*Math.sin(a),height:128},0);}))} className={styles.motion} style={anim(`${id}-wax-shadow`)}/>
            </>}
            {pieces.map(piece=><g key={piece.id} className={styles.motion} style={anim(`${id}-${piece.id}-${receiver}-${sample+1}`)}>{piece.kind==="knight"?<path d={pieceShadow(knight,receiver)} className={styles.motion} style={anim(`${id}-horse-shadow-${receiver}`)}/>:<use href={`#${id}-${piece.id}-cast-${receiver}`}/>}</g>)}
          </g>
        </mask>)}
      </g>)}
    </defs>
    <g mask={`url(#${id}-surface-mask)`}>
      <path d="M0 170H600V420H0Z" fill="#8b7b5e" opacity=".085"/>
      <g className={styles.motion} style={anim(`${id}-power`)}>
        {[-1,0,1].map(sample=><path key={sample} d="M0 170H600V420H0Z" fill={`url(#${id}-floor-light)`} mask={`url(#${id}-visibility-0-${sample+1})`} opacity=".333"/>)}
      </g>
    </g>
    <Candle id={id}/>
    {feet.sort((a,b)=>b.depth-a.depth).map((foot,i)=>{const p=project({...foot,height:0});return <g key={i} transform={`translate(${n(p.x)} ${n(p.y)})`}>
      <ellipse cy="1" rx="12" ry="3.5" fill="#303427" opacity=".22"/>
      <path d="M-8-23H8L6-14Q11-9 7-4L5 0H-5L-7-4Q-11-9-6-14Z" fill="#725239" stroke="#483c2a" strokeWidth=".9"/>
      <path d="M-6-18H6M-7-12Q0-9 7-12M-6-5Q0-3 6-5" fill="none" stroke="#b19060" strokeWidth=".7"/>
    </g>;})}
    <path d={face([rim[1],rim[2],bottom[2],bottom[1]])} fill="#4d3e2d" stroke="#473b2b"/>
    <path d={face([rim[3],rim[2],bottom[2],bottom[3]])} fill="#755238" stroke="#463b2b"/>
    <path d={face(rim)} fill="#967147" stroke="#473f2c" strokeWidth="1.3"/>
    <g clipPath={`url(#${id}-top)`}><g transform={`matrix(1 0 ${stage.skew} ${-stage.depthScale} ${board.x} ${stage.ground-board.height})`}>
      <path d={Array.from({length:30},(_,i)=>`M-16 ${i*9}q130 ${i%3-1} 220 0t230 0`).join("")} fill="none" stroke="#493f2c" strokeWidth=".65" opacity=".25"/>
    </g></g>
    <g clipPath={`url(#${id}-tiles)`}>
      {Array.from({length:64},(_,i)=>{const f=i%8,r=Math.floor(i/8),x=board.x+f*50,depth=r*31.25;return <path key={i} d={face([{x,depth,height:board.height},{x:x+50,depth,height:board.height},{x:x+50,depth:depth+31.25,height:board.height},{x,depth:depth+31.25,height:board.height}])} fill={(f+r)%2===0?"#54634b":"#c6b891"} stroke="#6a684c" strokeWidth=".35"/>;})}
      <path d={Array.from({length:96},(_,i)=>{const d=(i+.4)*board.length/96;const a=project({x:board.x,depth:d,height:board.height}),b=project({x:board.x+400,depth:d,height:board.height});return `M${n(a.x)} ${n(a.y)}Q${n((a.x+b.x)/2)} ${n(a.y+.65*Math.sin(i))} ${n(b.x)} ${n(b.y)}`;}).join("")} fill="none" stroke="#494735" strokeWidth=".5" opacity=".2"/>
    </g>
    <path d={surfacePath()} fill="none" stroke="#493e2b" strokeWidth="1.1"/>
    <path d={surfacePath(4)} fill="none" stroke="#dcc491" strokeWidth=".7"/>
    <path d={surfacePath(6)} fill="none" stroke="#5d482f" strokeWidth=".65"/>
    <path d={surfacePath(11.5)} fill="none" stroke="#c3a16b" strokeWidth=".65"/>
    <path d={rim.map((p,i)=>`M${n(project(p).x)} ${n(project(p).y)}L${n(project(surface()[i]).x)} ${n(project(surface()[i]).y)}`).join("")} stroke="#59452d" fill="none" strokeWidth=".7"/>
    <g clipPath={`url(#${id}-top)`}>
      <path d={surfacePath(board.rim)} fill="#242e22" opacity=".13"/>
      {[-1,0,1].map(sample=><g key={sample} mask={`url(#${id}-visibility-${board.height}-${sample+1})`} opacity=".333">
        <g className={styles.motion} style={anim(`${id}-power`)}><path d={surfacePath(board.rim)} fill={`url(#${id}-direct)`}/></g>
        <path d={Array.from({length:35},(_,i)=>{const a=project({x:board.x-12,depth:i*7.7,height:board.height}),b=project({x:board.x+412,depth:i*7.7,height:board.height});return `M${n(a.x)} ${n(a.y)}L${n(b.x)} ${n(b.y)}`;}).join("")} fill="none" stroke="#fff1c8" opacity=".22" strokeWidth=".4"/>
      </g>)}
    </g>
    {[3,6,12,15].map((drop,i)=><path key={drop} d={face([rim[3],rim[2]].map(p=>({...p,height:p.height-drop})))} fill="none" stroke={i%2?"#4b3d2b":"#b19160"} strokeWidth={i===1?1:.6}/>)}
    <g fill="#d4bb8c" fontFamily="Georgia, serif" fontSize="5.5" textAnchor="middle" aria-hidden="true">
      {Array.from({length:8},(_,i)=>{const p=project({...square(i,0),depth:-10,height:board.height-12});return <text key={i} x={p.x} y={p.y}>{"abcdefgh"[i]}</text>;})}
    </g>
    {pieces.map(piece=><Chessman key={piece.id} piece={piece} id={id}/>)}
  </>;
}
