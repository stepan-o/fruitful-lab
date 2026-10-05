"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { chainModels, chainPhases, chainSources } from "@/lib/sanctuary/business-chains";
import s from "./business-chains.module.css";

const sourceIds = Object.keys(chainSources);
const groups = [
  {
    "id": "all",
    "label": "All eight routes",
    "title": "The player is not always the buyer who funds production.",
    "text": "The cabinet maker sells to an operator; a producer can make a series for a commissioning service. The audience pays later, under another arrangement. Keeping those transactions separate helps explain how a popular work supports the businesses around it."
  },
  {
    "id": "screen",
    "label": "Arcade · cinema · Netflix",
    "title": "An attraction can support more than one business.",
    "text": "An arcade or film can help a venue earn from food and drinks. A series can help a catalog keep a subscriber. The value of a work to its distributor can extend beyond a separately priced turn, ticket or episode."
  },
  {
    "id": "bg3",
    "label": "BG3 · three ways to play",
    "title": "Another month of streaming is not another game sale.",
    "text": "Paying NVIDIA for another month does not create another Steam purchase for Larian. A service can earn from continued play even when the developer sells the game once."
  },
  {
    "id": "diablo",
    "label": "Diablo IV · two Xbox offers",
    "title": "Two offers can fund the same game.",
    "text": "A purchase and an eligible Game Pass subscription lead into the same Diablo IV service. Microsoft owns both the platform and Blizzard, so an assumed payment to an outside studio would give the wrong account of where the money goes."
  }
];

const marks = ["I","II","III"];

export default function BusinessChains() {
  const [phaseIndex,setPhaseIndex] = useState(0);
  const [group,setGroup] = useState("all");
  const tabs = useRef<(HTMLButtonElement|null)[]>([]);
  const phase = chainPhases[phaseIndex];
  const selected = groups.find(item=>item.id===group) ?? groups[0];
  const models = group === "all" ? chainModels : chainModels.filter(model=>model.group===group);

  function navigateTabs(event:KeyboardEvent<HTMLButtonElement>,index:number) {
    let next=index;
    if(event.key==="ArrowRight") next=(index+1)%chainPhases.length;
    else if(event.key==="ArrowLeft") next=(index+chainPhases.length-1)%chainPhases.length;
    else if(event.key==="Home") next=0;
    else if(event.key==="End") next=chainPhases.length-1;
    else return;
    event.preventDefault();
    setPhaseIndex(next);
    tabs.current[next]?.focus();
  }

  return <section className={s.instrument} id="business-chains" aria-labelledby="business-chains-title">
    <div className={s.heading}>
      <p className={s.eyebrow}>Across the years · eight routes to an audience</p>
      <h2 id="business-chains-title">Who makes it.<br/><em>Who gets paid.</em></h2>
      <p>Compare the same questions across eight arrangements. Use the selector to follow one game through different offers, or compare games with film and television.</p>
    </div>
    <div className={s.controls}>
      <label htmlFor="chain-comparison">Put side by side</label>
      <select id="chain-comparison" value={group} onChange={event=>setGroup(event.target.value)}>{groups.map(item=><option key={item.id} value={item.id}>{item.label}</option>)}</select>
    </div>
    <div className={s.tabs} role="tablist" aria-label="Business chain layers">
      {chainPhases.map((item,index)=><button key={item.id} ref={node=>{tabs.current[index]=node;}} id={`chain-tab-${item.id}`} role="tab" type="button" aria-selected={index===phaseIndex} aria-controls={`chain-panel-${item.id}`} tabIndex={index===phaseIndex?0:-1} onClick={()=>setPhaseIndex(index)} onKeyDown={event=>navigateTabs(event,index)}>
        <span className={s.step} aria-hidden="true">{marks[index]}</span><span>{item.label}</span><span className={s.activeLight} aria-hidden="true"/>
      </button>)}
    </div>
    <div className={s.panel} id={`chain-panel-${phase.id}`} role="tabpanel" aria-labelledby={`chain-tab-${phase.id}`} tabIndex={0}>
      <p className={s.phaseNote}>{phase.note}</p>
      <p className={s.scope}>Eight selected routes · current services checked 5 Oct 2026 · digital game editions, US offers</p>
      <table className={s.table} role="table">
        <caption className={s.srOnly}>{selected.label}: {phase.label}. {models.length} routes. Each source number links to supporting evidence.</caption>
        <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">The route</th>{phase.columns.map(column=><th key={column} scope="col" role="columnheader">{column}</th>)}</tr></thead>
        <tbody role="rowgroup">{models.map(model=><tr key={model.id} role="row">
          <th scope="row" role="rowheader" className={s.route}>
            <span className={s.routeLabel}>{model.label}</span><span className={s.example}>{model.example}</span><span className={s.tag}>{model.tag}</span>
            <details className={s.reading}><summary>What this reveals <span aria-hidden="true">+</span></summary><p><strong>Still here. </strong>{model.stays}</p><p><strong>What differs. </strong>{model.changes}</p><p className={s.boundary}>{model.boundary}</p></details>
          </th>
          {phase.fields.map((field,index)=><td key={field} role="cell"><span className={s.mobileLabel} aria-hidden="true">{phase.columns[index]}</span><p>{model.cells[field].text}</p><div className={s.citations} aria-label={`Sources: ${model.example}, ${phase.columns[index]}`}>{model.cells[field].sources.map(id=><a key={id} href={chainSources[id].url} target="_blank" rel="noreferrer" title={chainSources[id].title} aria-label={`Evidence ${sourceIds.indexOf(id)+1}: ${chainSources[id].title}`}>{sourceIds.indexOf(id)+1}<span aria-hidden="true">↗</span></a>)}</div></td>)}
        </tr>)}</tbody>
      </table>
    </div>
    <div className={s.finding}><span aria-hidden="true">◇</span><div><h3>{selected.title}</h3><p>{selected.text}</p></div></div>
    <details className={s.sources}><summary>Sources, contracts & limits <span aria-hidden="true">+</span></summary>
      <p>This is an analytical map of selected routes, not an audited ledger. Employee and supplier payments are production or operating costs; revenue-share, licensing and commissioning terms depend on the contract. Taxes, refunds and payment processing affect receipts but are not separately diagrammed. No unreported commission, royalty, profit margin or per-title subscription allocation is estimated.</p>
      <p>Promotion is its own layer: paid advertising can fund a media channel, while publicity, player recommendations and storefront discovery need not involve a placement fee. A listing proves availability, not a particular marketing budget.</p>
      <ol>{sourceIds.map(id=><li key={id}><a href={chainSources[id].url} target="_blank" rel="noreferrer">{chainSources[id].title} ↗</a><p>{chainSources[id].note}</p></li>)}</ol>
    </details>

  </section>;
}
