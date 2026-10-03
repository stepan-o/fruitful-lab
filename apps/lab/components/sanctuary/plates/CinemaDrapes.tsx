/** Heavy velvet hangs from the arch, gathers at a real tie, and falls under gravity. */
export default function CinemaDrapes({ id }: { id: string }) {
  const paint = (name: string) => `url(#${id}-${name})`;
  return <g>
    <defs>
      <linearGradient id={`${id}-velvet`}><stop stopColor="#241e21"/><stop offset=".25" stopColor="#72443b"/><stop offset=".48" stopColor="#442a29"/><stop offset=".72" stopColor="#94634b"/><stop offset="1" stopColor="#302123"/></linearGradient>
      <linearGradient id={`${id}-swag`} x2="0" y2="1"><stop stopColor="#37252a"/><stop offset=".6" stopColor="#795040"/><stop offset=".88" stopColor="#362327"/><stop offset="1" stopColor="#a07d53"/></linearGradient>
    </defs>
    {[0,1].map(side=><g key={side} transform={side?"translate(900 0) scale(-1 1)":undefined}>
      <path d="M178 112 269 81Q268 176 211 278Q236 319 244 368L176 374Z" fill={paint("velvet")} stroke="#291e22" strokeWidth="2"/>
      {Array.from({length:7},(_,i)=><g key={i}>
        <path d={`M${184+i*12} ${111-i*4}Q${192+i*16} 198 ${184+i*4} 278Q${183+i*6} 324 ${182+i*9} ${371-i*.5}`} fill="none" stroke={i%2?"#bd8b61":"#1c171d"} strokeWidth={i%2?1.3:6} opacity={i%2?.42:.5}/>
        <path d={`M${190+i*10} ${121-i*3}Q${215+i*7} 195 ${192+i*3} 265`} fill="none" stroke="#ae8059" strokeWidth=".65" opacity=".24"/>
      </g>)}
      <path d="M177 272q15 12 36 3l-1 9q-20 9-35-3Z" fill="#b79a64" stroke="#dac092" strokeWidth=".6"/>
      <path d="m181 276 29 4m-29-2 28 4" stroke="#55402e" strokeWidth=".8"/>
      <path d="M210 282q25 34 3 43" fill="none" stroke="#c4a871" strokeWidth="2"/>
      <path d="m208 323 8 2 4 16-15-2Z" fill="#b09360"/>
      <path d="m209 328-1 10m4-10v11m3-10 2 10" stroke="#ead19a" strokeWidth=".7"/>
      <path d="M177 369q9 9 17 1 8 8 17-1 9 8 16-2 9 7 17-1" fill="none" stroke="#b4915c" strokeWidth="2"/>
    </g>)}
    {[0,1,2].map(i=><g key={i}>
      <path d={`M${218+i*147} ${91-(i===1?28:0)}Q${294+i*147} ${154-(i===1?18:0)} ${383+i*147} ${80+(i===1?-10:12)}L${375+i*147} ${68+(i===1?-10:0)}Q${300+i*147} ${105-(i===1?20:0)} ${224+i*147} ${74-(i===1?26:0)}Z`} fill={paint("swag")} stroke="#9c7951" strokeWidth="1"/>
      {[0,1,2].map(j=><path key={j} d={`M${232+i*147} ${86-j*4-(i===1?24:0)}Q${302+i*147} ${134-j*9-(i===1?14:0)} ${372+i*147} ${84-j*4-(i===1?10:0)}`} fill="none" stroke={j===1?"#291e23":"#c49a66"} strokeOpacity=".38" strokeWidth={j===1?3:.8}/>)}
    </g>)}
  </g>;
}
