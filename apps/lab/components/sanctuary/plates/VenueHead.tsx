/** Quiet engraved profiles: a rounded cranium, small facial plane and supported neck. */
export default function VenueHead({x,y,facing="left",hair="#303d37",longHair=false}:{x:number;y:number;facing?:"left"|"right";hair?:string;longHair?:boolean}) {
 return <g transform={`translate(${x} ${y}) scale(${facing==="right"?-1:1} 1)`} data-art-element="human-profile" strokeLinejoin="round">
  <path d="M-2 9L-3 20L3 25L10 18L7 6Z" fill="#a89575" stroke="#536157" strokeWidth=".5"/>
  {longHair&&<path d="M2-12Q16-12 16 3L19 24L12 30L4 23L7 1Z" fill={hair} stroke="#8c927a" strokeWidth=".65"/>}
  <path d="M-10-8Q-8-17 2-16Q13-14 13-3L10 7L4 14Q0 16-6 11L-7 6L-12 5L-12 2L-15 1L-11-4Z" fill="#bca986" stroke="#344842" strokeWidth=".65"/>
  <path d="M4-11Q12-9 12-2L8 7L3 13L-3 12L-2 7L3 3Z" fill="#9c8d70" opacity=".65"/>
  <path d="M-11-6Q-15-16-5-19Q8-23 14-11L14-1L9 5L5 3L6-5L1-9L-5-8Z" fill={hair} stroke="#8f9980" strokeWidth=".65"/>
  <path d="M-8-15Q1-19 8-12M-5-12L0-13" fill="none" stroke="#a6a88a" strokeWidth=".6" opacity=".42"/>
  <path d="M5 0q4-4 5 0l-3 5" fill="#bbaa88" stroke="#6c7561" strokeWidth=".6"/>
  <path d="M-10-3l3 1M-9 8l4 1" fill="none" stroke="#5a5a49" strokeWidth=".7" strokeLinecap="round"/>
 </g>;
}
