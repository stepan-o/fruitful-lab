const clusters = [
  { x: -15, y: -23, s: .65, a: -8 },
  { x: 17, y: -32, s: .85, a: 5 },
  { x: -5, y: -41, s: .75, a: -4 },
  { x: 28, y: -51, s: .78, a: 5 },
  { x: 12, y: -62, s: .7, a: -3 },
];

/** Windswept trunk and separate irregular needle masses, rather than a canopy disk. */
export default function ForkPine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinecap="round" strokeLinejoin="round">
    <path d="M-7 2L-2 -3Q-6 -18 0 -31Q8 -43 9 -61L13 -65Q14 -45 6 -31Q0 -17 3 -4L11 2L2 0L-2 3Z" fill="#162d30" stroke="#acac85" strokeWidth=".7" />
    <g fill="none" stroke="#172b2e">
      <path d="M0 -14Q-7 -22 -18 -22M3 -27Q14 -24 26 -33M7 -35Q-4 -36 -11 -42M9 -44Q24 -42 36 -51M10 -55L20 -64" strokeWidth="3" />
      <path d="M-13 -22L-16 -29M16 -29L18 -37M-5 -39L-2 -47M26 -46L28 -56" strokeWidth="1.7" />
    </g>
    {clusters.map((c, i) => <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.a}) scale(${c.s})`}>
      <path d="M-25 3L-21 -2L-17 0L-13 -5L-10 -3L-5 -8L-1 -5L4 -9L8 -6L14 -7L16 -3L22 -2L21 1L27 4L20 6L16 5L10 8L5 5L0 7L-5 5L-12 6L-16 3L-21 5Z" fill="#38574e" stroke="#132a2e" strokeWidth="1.3" />
      <path d="M-20 0L-14 -2M-11 -2L-5 -5M0 -3L5 -6M10 -4L16 -3M-16 2L-10 1M-4 1L2 -1M6 2L12 0M14 3L20 2" stroke="#91a28b" strokeWidth="1" opacity=".65" />
    </g>)}
    <path d="M-1 -5Q-3 -17 2 -27M6 -36L10 -48" fill="none" stroke="#99a489" strokeWidth=".8" />
  </g>;
}
