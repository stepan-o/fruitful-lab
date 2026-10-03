import { useId } from "react";
import { useLivingPlate } from "./useLivingPlate";
import styles from "./audience-economy.module.css";

export default function RenewsDayCover() {
  const id=useId().replace(/:/g,"");
  const ref=useLivingPlate<HTMLDivElement>();
  return <div ref={ref} className={styles.living} data-scene="wednesday"><svg viewBox="0 0 260 380" role="img" aria-label="Renew’s Day: a braided cellist beneath a gothic rose window. An original parody of Wednesday.">
    <defs>
      <radialGradient id={`${id}-glass`}><stop stopColor="#a4b5aa"/><stop offset=".6" stopColor="#566b71"/><stop offset="1" stopColor="#263340"/></radialGradient>
      <linearGradient id={`${id}-stone`}><stop stopColor="#546168"/><stop offset=".35" stopColor="#293943"/><stop offset=".7" stopColor="#192934"/><stop offset="1" stopColor="#728077"/></linearGradient>
      <radialGradient id={`${id}-candle`}><stop stopColor="#f2cf8d" stopOpacity=".7"/><stop offset=".3" stopColor="#bf915b" stopOpacity=".16"/><stop offset="1" stopColor="#bf915b" stopOpacity="0"/></radialGradient>
      <linearGradient id={`${id}-dress`}><stop stopColor="#0a141d"/><stop offset=".5" stopColor="#293341"/><stop offset="1" stopColor="#0a141d"/></linearGradient>
    </defs>
    <path d="M0 0h260v380H0Z" fill="#15232c"/>
    <path d="M18 277V110Q23 53 130 14q107 39 112 96v167Z" fill="#26353e" stroke="#879182" strokeWidth="2"/>
    <path d="M27 267V111Q32 60 130 24q98 36 103 87v156Z" fill="#13242e" stroke="#656e68"/>
    <circle cx="130" cy="122" r="87" fill={`url(#${id}-glass)`} stroke="#a3ab96" strokeWidth="2"/>
    <circle cx="130" cy="122" r="78" fill="none" stroke="#152832" strokeWidth="3"/>
    {Array.from({length:12},(_,i)=><path key={i} d="M130 122q-32-41 0-75 32 34 0 75Z" transform={`rotate(${i*30} 130 122)`} fill="none" stroke="#182c35" strokeWidth="2"/>)}
    <g stroke="#b9b9a0" strokeWidth=".6" fill="none" opacity=".45">
      {Array.from({length:12},(_,i)=><g key={i} transform={`rotate(${i*30} 130 122)`}><path d="M130 47v54m-7-48q7 11 14 0M112 66q18 16 36 0M116 79q14 9 28 0"/><path d="m130 31 4 7-4 7-4-7Z"/></g>)}
    </g>
    <path className={styles.windowLight} d="m77 99 81 5 65 164h-45Z" fill="#c6d1b7" opacity=".055"/>
    <circle cx="130" cy="122" r="18" fill="#344851" stroke="#afbaaa"/>
    {[0,1].map(s=><g key={s} transform={s?"translate(260 0) scale(-1 1)":undefined}>
      <path d="M8 96h24v190H8Z" fill={`url(#${id}-stone)`}/><path d="M4 94h32v9H4zm0 174h32v10H4Z" fill="#54615f" stroke="#a0a28b" strokeWidth=".6"/>
      <path d="M39 243v-35q14-25 27 0v35m4 0v-35q14-25 27 0v35M161 243v-35q14-25 27 0v35m4 0v-35q14-25 27 0v35" fill="none" stroke="#809082" strokeOpacity=".45"/>
    </g>)}
    <g fill="none" stroke="#82918a" strokeWidth=".65" opacity=".5">
      <path d="M16 116v130m7-130v130m214-130v130m7-130v130M32 111l12-2m-11 27 8-1m-9 20 16-1m-16 22h22m172-66-12-2m11 27-8-1m9 20-16-1m16 22h-22"/>
      <path d="m42 87 9-4 4-12 14-6 5-12 13-1m99 1 14 9 5 11 13 5m-191 184h68m76 0h49"/>
    </g>
    <path d="M16 248h228v8H16zm-6 16h240v10H10zM0 283h260v13H0Z" fill="#3c4a50" stroke="#9ba28a" strokeWidth=".65"/>
    <path d="m82 275 9-61 14-24 31 2 13 40 19 50Z" fill={`url(#${id}-dress)`} stroke="#778a87"/>
    <path d="m109 197 2-14h18l4 14-12 11Z" fill="#c1bca5"/>
    <path d="M104 163q1-18 15-19 18 0 19 20l-4 19-13 10-13-10Z" fill="#b5b3a5" stroke="#091921" strokeWidth="2"/>
    <path d="M101 172q-8-32 20-32 25 0 21 34l-8-10-2-10-6 11-7-11-7 12-3-10-2 17Z" fill="#081620"/>
    <path d="M104 171q-6 23-3 38m34-37q7 23 7 38" fill="none" stroke="#091923" strokeWidth="7"/>
    <path d="m102 180-2 5 3 4-3 4 3 5m34-18 3 5-2 4 3 4-2 5" fill="none" stroke="#7d9090" strokeWidth=".8"/>
    <path d="m104 197 13 13 5-8 5 8 10-13" fill="#d3d0b9"/>
    <path d="M143 191h7l-2 37q15-8 17 8 0 9-6 13 17 30-8 37-30 4-24-22l7-15q-12-10-5-17 5-7 12-3Z" fill="#67514a" stroke="#c2a481"/>
    <path d="m145 186 2 77m-3-70 1 67m5-67-1 70m-3 22v16" stroke="#ccbe99" strokeWidth=".7"/>
    <g fill="none" stroke="#b49b7f" strokeWidth=".9">
      <path d="M137 242q-4-5 0-6m0 6-3 5m22-5q4-5 0-6m0 6 3 5M141 259h12m-11 2h10m-16 17q13 4 22-2"/>
    </g>
    <path d="M110 174h7m8 0h7m-13 1-1 7 4 1m-6 4h9" fill="none" stroke="#35454b" strokeWidth="1"/>
    <path d="m111 173 3 1m13 0 3-1" stroke="#091823" strokeWidth="1.7"/>
    <path d="M96 222 88 271m14-39-4 38m11-30-4 34m12-31-3 29m-26 6q11-4 33 2" stroke="#6b7a80" strokeOpacity=".55" fill="none" strokeWidth=".8"/>
    <path d="M122 215v13" stroke="#adb4a2" strokeWidth="1" strokeDasharray="1 4"/>
    <path d="m105 213 15 19 23-15m-6-8 14 15" fill="none" stroke="#a3aaa0" strokeWidth="4"/>
    <path d="m112 251 72-38" stroke="#ddd0a3" strokeWidth="1.5"/>
    <path d="m64 253 15-2 8 6-17 3Z m0 4 6 3 17-3v4l-17 4-6-4Z" fill="#8a8070" stroke="#b4aa8b" strokeWidth=".6"/>
    <path d="m177 260 15-1 12 5-16 1Z" fill="#afa38a"/><path d="m178 264 10 3 15-3v4l-15 3-10-4Z" fill="#5d5656"/>
    <g className={styles.candleLight}><ellipse cx="57" cy="223" rx="34" ry="45" fill={`url(#${id}-candle)`}/><ellipse cx="207" cy="231" rx="30" ry="40" fill={`url(#${id}-candle)`}/></g>
    {[{x:57,y:228},{x:207,y:237}].map(({x,y})=><g key={x} transform={`translate(${x} ${y})`}><path d="M-3 0h6v21h-6Z" fill="#beb297"/><path d="m0-10-3 8 3 3 2-4Z" fill="#eed59f"/><path d="M-6 22H6m-6 0v5m-10 0h20" stroke="#a89b74"/></g>)}
    <g className={styles.coverMotes} fill="#c9c5a8" opacity=".5"><circle cx="81" cy="112" r=".9"/><circle cx="174" cy="185" r=".8"/><circle cx="193" cy="88" r=".7"/><circle cx="61" cy="161" r=".6"/></g>
    <path d="M0 300h260v80H0z" fill="#0e1b25"/>
    <text x="130" y="324" textAnchor="middle" fill="#ced0bd" fontFamily="Georgia,serif" fontSize="29" letterSpacing="2">RENEW’S</text>
    <text x="130" y="352" textAnchor="middle" fill="#a8b5b0" fontFamily="Georgia,serif" fontSize="25" letterSpacing="7">DAY</text>
    <text x="130" y="369" textAnchor="middle" fill="#a1aa9e" fontSize="7" letterSpacing="1.7">A RECURRING SENSE OF DREAD</text>
    <path d="M7 7h246v366H7z" fill="none" stroke="#ba9a68" strokeOpacity=".35"/>
  </svg></div>;
}
