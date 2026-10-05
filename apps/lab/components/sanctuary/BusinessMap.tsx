"use client";
import {useId,useState} from "react";
import {Plate,brass,teal,bone} from "./plates/Engraving";
import s from "./business-atlas.module.css";
const layers=[
  {
    "name": "Fund & make",
    "title": "The team must be paid before release.",
    "exchange": "A studio pays its staff and suppliers. Investors can provide money in return for a stake in the company; a publisher can fund a project in return for agreed rights and proceeds. Using the studio’s own money leaves it carrying the risk.",
    "measure": "How long can the team keep working with the money available? Compare the cost of finishing with the next source of funding, not just the hoped-for sales total.",
    "link": "https://store.epicgames.com/news/epic-games-publishing-announcement?lang=en-US",
    "source": "Example: Epic’s publishing offer"
  },
  {
    "name": "Own & license",
    "title": "Who owns what the game uses?",
    "exchange": "Permission to use an existing world, character or other protected work comes from its rights holder. A license defines the permitted use and payment. Larian makes Baldur’s Gate 3; Wizards of the Coast owns the Dungeons & Dragons material it uses.",
    "measure": "Which rights were acquired, for how long, and on what payment terms? A royalty paid to a rights holder is different from income earned for developing the game.",
    "link": "https://investor.hasbro.com/static-files/0e548540-ae0c-49a2-83ed-053cd009623a",
    "source": "Example: Hasbro’s digital licensing"
  },
  {
    "name": "Publish & reach",
    "title": "A release still has to find its players.",
    "exchange": "Publishers organize a release and its promotion. An advertising channel sells exposure; a reviewer, friend or store recommendation may bring a player to the game without a paid placement.",
    "measure": "Where did buyers discover the game, and what did reaching them cost? A trailer view shows attention; a purchase answers a different question.",
    "link": "https://partner.steamgames.com/doc/marketing/tools",
    "source": "Example: Steam’s discovery tools"
  },
  {
    "name": "Sell & settle",
    "title": "What reaches the studio from a sale?",
    "exchange": "The store collects payment and pays its commercial partner under their agreement. Taxes, refunds and the store’s share affect the amount paid out. The recipient may then owe payments to a financier or rights holder.",
    "measure": "Keep the sale price, the amount received and the profit separate. If an agreement repays earlier production funding first, the first sale need not produce a profit payment.",
    "link": "https://partner.steamgames.com/doc/finance/payments_salesreporting/faq",
    "source": "Example: Steam settlement"
  },
  {
    "name": "Equip & render",
    "title": "Buying the game does not supply the computer.",
    "exchange": "A local player supplies a PC or console. GeForce NOW supplies a remote computer, while the player still supplies a receiving device and connection. A paid plan charges for use of that computing service.",
    "measure": "Which players can the available equipment serve? Capacity, queues and cost per streamed hour matter to the provider; device compatibility and connection quality matter to the player.",
    "link": "https://www.nvidia.com/en-us/geforce-now/how-to-play/",
    "source": "Example: GeForce NOW"
  },
  {
    "name": "Operate & maintain",
    "title": "What has to keep working after launch?",
    "exchange": "The developer supplies fixes and updates. An online world also needs running services, which may use rented hosting. A cloud gaming provider does another job: running and streaming the game’s images.",
    "measure": "When play fails, which service failed? A game server, an account service and a video stream have different operators, costs and measures of reliability.",
    "link": "https://partner.steamgames.com/doc/features/cloudgaming",
    "source": "Example: Cloud Play integration"
  },
  {
    "name": "Play & pay",
    "title": "What does this payment let the player do?",
    "exchange": "A game purchase, a catalog subscription, multiplayer access and remote computing buy different things. Several can be needed for one evening. Optional purchases inside the game add further offers.",
    "measure": "Identify the offer before interpreting its revenue. Another hour of play can matter differently to a studio selling copies, a catalog seeking renewals and a provider paying to run the hardware.",
    "link": "https://www.xbox.com/en-US/games/diablo-iv",
    "source": "Example: Diablo IV on Xbox"
  }
];

function Station({kind}:{kind:number}) {
 return <g stroke={brass} strokeWidth="1.3" fill="#18292b">
  {kind===0?<><path d="M15 95V36l55-22 48 22v59Z"/><path d="M8 38 70 9 127 37M70 15v80M17 76h100M17 83h100" fill="none"/>{[29,48,83,101].map(x=><g key={x}><path d={`M${x} 47v18h11V43Z`} fill="#b88e52"/><path d={`M${x+5} 44v21`} stroke="#263839"/></g>)}<path d="m42 96 7-18h46l7 18M53 79l3 15m26-15 4 15"/><path d="m57 72 17-8 13 7-17 8Z" fill={bone}/><path d="m68 68 11 5"/></>:null}
  {kind===1?<><path d="M22 85V23l64-5 21 14v61l-66 5Z"/><path d="m22 23 20 13 65-4M42 36v62"/><path d="m51 45 46-3m-46 11 46-3m-46 11 46-3m-46 11 46-3" opacity=".5"/><circle cx="74" cy="69" r="13" fill="#a2623e"/><path d="m68 81-3 20 11-7 8 6-5-19" fill="#83533b"/><path d="m67 68 5 5 9-11" stroke={bone} fill="none"/></>:null}
  {kind===2?<><path d="M16 95V43h104v52M13 44l10-23h89l12 23Z"/><path d="M25 47v35h37V47m12 0v48M17 85h47"/><path d="m34 21-5 22m23-22-2 22m22-22 1 22m20-22 4 22" strokeWidth="7" opacity=".6"/><rect x="81" y="56" width="27" height="19" fill="#a5814e"/><path d="M86 62h17m-17 6h11" stroke="#253238"/><path d="M17 96h106" strokeWidth="3"/></>:null}
  {kind===3?<>{[21,71].map(x=><g key={x}><path d={`M${x} 93V20l33-7 11 9v71Z`}/><path d={`M${x+33} 14v79`}/>{[29,43,57,71].map(y=><g key={y}><rect x={x+5} y={y} width="21" height="10"/><path d={`M${x+9} ${y+4}h8`} stroke={teal}/><circle cx={x+22} cy={y+5} r="1.4" fill={bone}/></g>)}</g>)}<path d="M13 101h111M56 89h12"/></>:null}
  {kind===4?<><path d="M12 72V18h111v54Z"/><path d="M18 24h99v42H18Z" fill="#284340"/><path d="m19 57 23-20 14 10 18-16 41 32M72 32v31" fill="#142d31"/><path d="m57 73-5 12h34l-5-12M12 89h111M25 90v18m85-18v18"/><path d="M52 119V98q5-14 18-14t18 14v21" fill="#243332"/><path d="M43 110v-10h53v10m-7 0v15m-39-15v15"/><ellipse cx="70" cy="77" rx="9" ry="11" fill="#ba9a75"/><path d="M61 75q0-17 17-6v5" fill="#1c2426"/></>:null}
 </g>;
}
export default function BusinessMap(){
 const [active,setActive]=useState(0);const id=useId().replace(/:/g,"");const layer=layers[active];
 return <section className={s.atlas} aria-labelledby={`${id}-title`}>
  <p className={s.kicker}>An atlas of the business · select a layer</p><h2 id={`${id}-title`}>The work travels out.<br/><em>The receipts travel back.</em></h2>
  <svg viewBox="0 0 920 275" className={s.map} role="img" aria-label="Five engraved stations: production, rights, distribution, computing and the player. Work moves toward the audience; receipts support the businesses behind it. Schematic, not a measured money flow.">
   <defs><linearGradient id={`${id}-glow`}><stop stopColor="#af7840" stopOpacity="0"/><stop offset=".5" stopColor="#af7840" stopOpacity=".16"/><stop offset="1" stopColor="#af7840" stopOpacity="0"/></linearGradient></defs>
   <rect width="920" height="275" fill="#091519"/><ellipse cx="460" cy="138" rx="445" ry="85" fill={`url(#${id}-glow)`}/>
   <path d="M100 58V27h720v31m-9-11 9 11 9-11" fill="none" stroke={brass} strokeWidth="1.6"/><path d="M820 209v38H100v-38m-9 11 9-11 9 11" fill="none" stroke={teal} strokeDasharray="4 5"/>
   <rect x="368" y="15" width="184" height="23" fill="#091519"/><text x="460" y="30" textAnchor="middle" fill={brass} fontFamily="monospace" fontSize="11">WORK · RIGHTS · ACCESS →</text>
   <rect x="363" y="236" width="194" height="23" fill="#091519"/><text x="460" y="251" textAnchor="middle" fill={teal} fontFamily="monospace" fontSize="11">← PAYMENTS & SETTLEMENT</text>
   {["PRODUCTION","PERMISSION","DISTRIBUTION","COMPUTING","THE PLAYER"].map((label,i)=><g key={label} transform={`translate(${25+i*180} 52)`}><Plate x={0} y={0} w={150} h={150} tone={i===4?teal:brass}/><g transform="translate(7 8)"><Station kind={i}/></g><text x="75" y="138" fill={bone} fontSize="10" fontFamily="monospace" textAnchor="middle">{label}</text>{i<4?<path d="M153 76h24m-5-4 5 4-5 4" stroke={brass} fill="none"/>:null}</g>)}
  </svg>
  <div className={s.mobileMap} role="img" aria-label="Production, permission, distribution, computing and the player: the same roles, sometimes combined in one company.">{["Production","Permission","Distribution","Computing","The player"].map((label,i)=><div key={label}><svg viewBox="0 0 140 125" aria-hidden="true"><Station kind={i}/></svg><span>{label}</span></div>)}</div>
  <div className={s.layers} role="group" aria-label="Inspect a business layer">{layers.map((item,i)=><button type="button" key={item.name} aria-pressed={i===active} onClick={()=>setActive(i)}><span aria-hidden="true">{String(i+1).padStart(2,"0")} </span>{item.name}</button>)}</div>
  <div className={s.layerReading} aria-live="polite"><div><p className={s.kicker}>Who buys what from whom</p><h3>{layer.title}</h3><p>{layer.exchange}</p></div><div className={s.measure}><p className={s.kicker}>The analytical question</p><p>{layer.measure}</p><a href={layer.link} target="_blank" rel="noreferrer">{layer.source} ↗</a></div></div>
  <p className={s.footnote}>These are jobs, not a required number of companies. One business can do several. The analytical questions are ours; the linked examples document particular arrangements.</p>
 </section>;
}
