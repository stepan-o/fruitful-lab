"use client";
import {useId,useState} from "react";
import BusinessCircuit from "./BusinessCircuit";
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

export default function BusinessMap(){
 const [active,setActive]=useState(0);const id=useId().replace(/:/g,"");const layer=layers[active];
 return <>
  <BusinessCircuit/>
  <details className={s.layerDetails}>
   <summary>Inspect the seven business layers</summary>
   <section className={s.atlas} aria-labelledby={`${id}-layers-title`}>
   <h2 id={`${id}-layers-title`}>The work behind the offer.</h2>
  <div className={s.layers} role="group" aria-label="Inspect a business layer">{layers.map((item,i)=><button type="button" key={item.name} aria-pressed={i===active} onClick={()=>setActive(i)}><span aria-hidden="true">{String(i+1).padStart(2,"0")} </span>{item.name}</button>)}</div>
  <div className={s.layerReading} aria-live="polite"><div><p className={s.kicker}>Who buys what from whom</p><h3>{layer.title}</h3><p>{layer.exchange}</p></div><div className={s.measure}><p className={s.kicker}>The analytical question</p><p>{layer.measure}</p><a href={layer.link} target="_blank" rel="noreferrer">{layer.source} ↗</a></div></div>
  <p className={s.footnote}>These are jobs, not a required number of companies. One business can do several. The analytical questions are ours; the linked examples document particular arrangements.</p>
 </section>
 </details>
 </>;
}
