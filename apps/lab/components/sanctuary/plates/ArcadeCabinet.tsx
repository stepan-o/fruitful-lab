import { memo, useId } from "react";

/** Original cutaway drawing, not Gauntlet's screen, cabinet art or wiring. */
function ArcadeCabinet({ health = 600, operator = false, label }: {
  health?: number; operator?: boolean; label: string;
}) {
  const id = useId().replaceAll(":", "");
  return <svg viewBox="0 0 480 550" role="img" aria-label={label}>
    <defs>
      <linearGradient id={`${id}-wood`} x2="1" y2="1"><stop stopColor="#36403c"/><stop offset=".5" stopColor="#182529"/><stop offset="1" stopColor="#081115"/></linearGradient>
      <radialGradient id={`${id}-glass`}><stop stopColor="#23443e"/><stop offset="1" stopColor="#071318"/></radialGradient>
      <pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#a78d61" strokeWidth=".65" opacity=".18"/></pattern>
    </defs>
    <ellipse cx="230" cy="521" rx="197" ry="17" fill="#000" opacity=".45"/>
    <path d="M108 38H360L396 99L370 283L409 335L381 514H92L68 337L103 277L72 93Z" fill={`url(#${id}-wood)`} stroke="#8c7955" strokeWidth="2"/>
    <path d="M360 38L407 61L443 124L416 289L451 339L422 494L381 514L409 335L370 283L396 99Z" fill="#101b20" stroke="#56605a"/>
    <path d="M375 76L397 88L424 130L400 294L431 342L409 486" fill="none" stroke="#b28e5a" opacity=".4"/>
    <path d="M92 514L68 337L103 277L72 93L108 38H360" fill="none" stroke="#d6c29c" strokeWidth="3" opacity=".35"/>
    <path d="M108 50H349L375 91H88Z" fill="#111d20" stroke="#b29765"/>
    <text x="232" y="79" textAnchor="middle" fill="#e2ceb0" fontFamily="Georgia,serif" fontSize="22" letterSpacing="5">INSERT COIN</text>
    <path d="M100 109H363L343 277H123Z" fill="#030a0c" stroke="#b29765" strokeWidth="3"/>
    <path d="M112 119H351L333 266H132Z" fill={`url(#${id}-glass)`}/>
    {/* A legible invented dungeon: architecture, food, party and threats. */}
    <g opacity={operator ? .42 : 1}>
      <path d="M149 140H306V242H158V175H276V213H195M178 142V159M226 176V150M307 201H325M154 222H178" fill="none" stroke="#081214" strokeWidth="12"/>
      <path d="M149 137H306V239H158V172H276V210H195M178 139V156M226 173V147M307 198H325M154 219H178" fill="none" stroke="#697e6c" strokeWidth="7"/>
      {Array.from({length:18},(_,i)=><path key={i} d={`M${149+i*9} 133v8M${158+i*8} 235v8`} stroke="#152622" strokeWidth="1.3"/>)}
      {([[184,193,"#cf8b69"],[208,192,"#e1cf91"],[205,224,"#79b7b7"],[229,226,"#93b883"]] as const).map(([x,y,color],i)=><g key={i} transform={`translate(${x} ${y})`} fill={color}>
        <circle cy="-5" r="3"/><path d="M-4 -1H4L6 8H1V4H-1V8H-6Z"/><path d="M5 -3L9 3" stroke="#e4d5b8" strokeWidth="1.4"/>
      </g>)}
      {[[250,154],[259,155],[288,218],[298,222],[253,229]].map(([x,y],i)=><path key={i} d={`M${x-3} ${y+5}v-8l3 2 3 -2v8l-3 -2Z`} fill="#a85040"/>)}
      <ellipse cx="291" cy="184" rx="7" ry="4" fill="#ac8960"/><ellipse cx="291" cy="182" rx="4" ry="2" fill="#d8b586"/>
    </g>
    <path d="M124 124H342L338 145H127Z" fill="#bedcc3" opacity=".035"/>
    <path d="M100 288H371L395 333H80Z" fill="#3b423b" stroke="#b8a073"/>
    <path d="M110 296H361L375 324H96Z" fill={`url(#${id}-hatch)`}/>
    {[132,193,254,315].map((x,i)=><g key={x}>
      <ellipse cx={x} cy="316" rx="11" ry="4" fill="#050c10"/>
      <path d={`M${x} 314v-13`} stroke="#b6a383" strokeWidth="3"/>
      <circle cx={x} cy="301" r="6" fill={["#a6664e","#9c9272","#5e959e","#748e5e"][i]}/>
      <ellipse cx={x+20} cy="317" rx="5" ry="3" fill="#ac9060"/>
    </g>)}
    <path d="M105 350H371L350 492H120Z" fill="#101b1e" stroke="#645d48"/>
    {operator ? <g>
      <path d="M125 365H350L335 477H136Z" fill="#233230" stroke="#b39869"/>
      {Array.from({length:8},(_,i)=><path key={i} d={`M${147+i*24} 375v${32+(i%3)*11}h${(i%2?1:-1)*12}v24`} fill="none" stroke="#718b74" strokeWidth="1.1" opacity=".5"/>)}
      <rect x="153" y="390" width="155" height="44" rx="3" fill="#0a1417" stroke="#887958"/>
      <text x="230" y="407" textAnchor="middle" fill="#a6b4a8" fontSize="9" letterSpacing="1.5">HEALTH PER COIN</text>
      <text x="230" y="428" textAnchor="middle" fill="#f0cc91" fontFamily="monospace" fontSize="21">{health}</text>
      {[172,231,290].map(x=><g key={x}><circle cx={x} cy="453" r="11" fill="#0d181b" stroke="#a58a5a"/><path d={`M${x} 453l5 -6`} stroke="#dbc99a" strokeWidth="2"/></g>)}
    </g> : <g>
      <path d="M154 366H309V473H154Z" fill="#172426" stroke="#917850"/>
      <path d="M159 371H304V468H159Z" fill={`url(#${id}-hatch)`}/>
      <circle cx="231" cy="407" r="27" fill="#0b1418" stroke="#b39461" strokeWidth="2"/>
      <circle cx="231" cy="407" r="22" fill="none" stroke="#5b5140"/>
      <path d="M227 390h8v31h-8Z" fill="#bc9565"/><path d="M230 392h2v27" stroke="#091014" strokeWidth="3"/>
      <text x="231" y="453" textAnchor="middle" fill="#c2b28d" fontSize="10" letterSpacing="2">CONTINUE?</text>
    </g>}
    {[105,347].map(x=>[55,350,484].map(y=><g key={`${x}-${y}`}><circle cx={x} cy={y} r="3" fill="#a99264"/><path d={`M${x-2} ${y}h4`} stroke="#162024"/></g>))}
    <path d="M78 338H404M97 505H380" stroke="#c5ad79" strokeWidth="2" opacity=".6"/>
  </svg>;
}
export default memo(ArcadeCabinet);
