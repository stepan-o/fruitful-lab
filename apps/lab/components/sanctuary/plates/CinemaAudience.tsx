const rows = [
  { y: 416, scale: .69, left: [165, 213, 261, 309], right: [552,600,648,696] },
  { y: 457, scale: .94, left: [103,165,227,289], right: [557,619,681,743] },
  { y: 508, scale: 1.24, left: [13,92,171,250], right: [573,652,731,810] },
];

export default function CinemaAudience() {
  return <g>{rows.map((row,r)=><g key={r}>
    {[...row.left,...row.right].map((x,i)=>{
      const seed=r*8+i; const lean=(seed%5-2)*1.6; const head=seed%3;
      return <g key={i} transform={`translate(${x} ${row.y}) scale(${row.scale})`}>
        <ellipse cx="25" cy="15" rx="35" ry="9" fill="#03080b" opacity=".6"/>
        <path d="M-5 7v-24Q-5-32 9-34h33q14 1 14 15V9Z" fill={r===0?"#67483a":"#342a29"} stroke="#aa855b" strokeWidth="1"/>
        <path d="M0 6v-23Q0-28 10-29h30q10 0 10 12V7" fill="none" stroke="#9e7855" strokeOpacity=".45"/>
        <g transform={`translate(${lean} 0)`}>
          <path d="M5-10q0-22 13-25l4-4h9l4 4q14 2 14 25Z" fill={seed%4===0?"#34423e":"#111b20"} stroke="#9fa58a" strokeOpacity=".55"/>
          <path d="M21-38v-8h12v9l-6 4Z" fill="#736756"/>
          {head===0?<path d="M17-55q0-13 11-13 14 0 14 13l-2 13q-11 11-20-1Z" fill="#222a2a" stroke="#b1b29a" strokeWidth="1.4"/>:head===1?<path d="M15-51q-3-17 12-20 16-1 18 17l2 25-8 4-4-14-16 2-6 8Z" fill="#10191e" stroke="#8e9a8c" strokeWidth="1.1"/>:<path d="m15-52 2-10 7-5 8 1 10 7 1 16-8 8-16-5Z" fill="#333831" stroke="#b1b29a" strokeWidth="1.1"/>}
          <path d="M19-32q7 6 15-1M11-22l-1 10m32-10 2 10" fill="none" stroke="#8d937c" strokeOpacity=".35"/>
        </g>
        <path d="M-6 10V-9q0-3 4-3h4q3 0 3 3v17M49 8V-9q0-3 4-3h4q3 0 3 3v19" fill="#332d29" stroke="#a7885e" strokeOpacity=".5"/>
        <path d="M8 5h35M8 8h35" stroke="#715e47" strokeOpacity=".45"/>
      </g>;
    })}
  </g>)}</g>;
}
