import type { Chapter, EvidenceSource } from "./types";
import descriptions from "./graphic-descriptions.json";
import { artDirection } from "./art-direction";
import { coverReferences } from "./cover-references";
import editorial from "./editorial-media.json";
import arcade from "./arcade-media.json";
import context from "./context-media.json";

export type VisualNote = {
  id: string; title: string; kind: string;
  description: string; reading: string; behavior?: string; boundary?: string;
  references: {title:string;url:string}[];
};
const records: Record<string, {title:string;purpose:string;source:string;sourceUrl:string|null;sourceDate:string;owner:string;treatment:string;provenanceNote?:string}> = {...editorial.assets,...arcade.assets,...context.assets};

export const sharedVisualNotes: VisualNote[] = [
  {id:"devil-mural",title:"The mosaic devil",kind:"Original cover illustration",
   description:"An angular face emerges from triangular stone tiles inside an arched frame. Broken gold edges, deep teal stone and warm eyes repeat Sanctuary’s material palette. The mouth and gaze supply the cover’s focal points while its left side leaves room for the title.",
   reading:"The figure establishes a theatrical, diabolical atmosphere for a study named Sanctuary Economics. It is an invented host for the essay, not a portrait of a publisher, a verdict that monetization is evil or a tracing of Diablo’s characters.",
   behavior:"The eyes pulse; short displaced fragments interrupt the otherwise stable mosaic. The global motion preference and reduced-motion setting stop the animated treatment.",
   references:[]},
  {id:"ambient-fire",title:"Embers, shadow and the fire at the edge",kind:"Original ambient layers",
   description:"Small warm embers pass through the dark reading space. Shadow and fire are separate procedural layers; the fire stays low and appears at the bottom of the page rather than following every paragraph.",
   reading:"The layers carry the cover’s atmosphere through the study. Their relative scale, brightness and placement keep attention on words and exhibits; they encode no measurements or commercial claims.",
   behavior:"The renderer caps its workload and responds to visibility and motion preferences. Fire movement belongs to rising heat; shadow supplies slower changes behind it.",references:[]},
  {id:"infernal-words",title:"Future sales, the gap and subscription",kind:"Original typographic effects",
   description:"Spectral trails surround future sales; the gap opens into a dark glowing recess; subscription is framed as an attractive recurring offer. Each treatment operates at the scale of a phrase, not as an additional full-page animation.",
   reading:"These are editorial emphasis: an uncertain next sale, the interval that must be funded and the invitation to a continuing payment relationship. Their theatrical tone should invite scrutiny without standing in for evidence about any company.",
   behavior:"Motion can be paused. The words remain readable when effects are disabled.",references:[]},
];

function sourceLinks(sources:EvidenceSource[]) {return sources.map(({title,url})=>({title:`Context: ${title}`,url}));}
function sourceNote(asset:string,alt:string,caption:string):VisualNote {
 const record=records[asset];
 if(!record) throw new Error(`Missing visual source record: ${asset}`);
 return {id:`media-${asset}`,title:record.title,kind:`Visual citation · ${record.owner}`,
  description:`${alt.replace(/\.$/, "")}. ${caption}`,reading:record.purpose,
  boundary:[record.provenanceNote,record.sourceDate,record.treatment].filter(Boolean).join(" "),
  references:[...(record.sourceUrl?[{title:record.source,url:record.sourceUrl}]:[]),{title:"Full source, credit and use record",url:`/stepanoskin/game-monetization/credits#${asset}`}],
 };
}

/** Server-side catalog: only the active chapter’s entries enter the reader. */
export function chapterVisualNotes(chapter:Chapter,sources:EvidenceSource[]):VisualNote[] {
 const detail=descriptions[chapter.id as keyof typeof descriptions];
 if(!detail) throw new Error(`Missing original visual notes: ${chapter.id}`);
 const references=sourceLinks(sources);
 const result:VisualNote[]=[];
 if(chapter.id!=="the-fork") result.push({id:`scene-${chapter.id}`,title:chapter.id==="insert-coin"?"The place around the game":artDirection[chapter.id].title,kind:"Original procedural illustration",...detail.scene,
  boundary:chapter.id==="insert-coin"?"The original scene studies a contemporary bar photograph. It is not documentary evidence of a 1970s venue, customer motives or beverage sales.":"Original interpretive geometry. References establish the game, theory or historical context; they do not turn this invented scene into documentary evidence.",
  references:chapter.id==="insert-coin"?references.filter(r=>r.url.includes("computerhistory")):references});
 result.push({id:`diagram-${chapter.id}`,title:chapter.visual.diagram.title,kind:"Explanatory instrument",...detail.diagram,references});
 if(chapter.id==="studio-to-screen") result.push({id:"business-chains",title:"Who makes it. Who gets paid.",kind:"Comparative business map",
  description:"Eight concrete routes share six fixed questions, shown two columns at a time: production and supply, promotion and operation, audience payments and upstream settlement. Controls compare all routes, screen entertainment, BG3 across three delivery routes, or two Xbox offers for Diablo IV.",
  reading:"The same work can travel through different businesses and payment arrangements. Repeated games hold the creative work roughly constant while distribution, computing and access change. An operator and a venue are roles that one owner can combine.",
  behavior:"Three keyboard-operated tabs switch the same table’s columns. A comparison selector filters rows without changing the active layer. Phones stack the labeled cells. This instrument has no continuous animation or external runtime request.",
  boundary:"An analytical map, not a quantitative flow or audited ledger. Historical examples and current US digital offers are dated. Private commissions, IP royalties and internal subscription allocations are not estimated. Cell links and the source register distinguish documented offers from the general business interpretation.",
  references:[{title:"Source register within the comparison",url:"/stepanoskin/game-monetization?chapter=studio-to-screen#business-chains"},{title:"Operator and venue arrangements: Betson",url:"https://www.betson.com/are-arcades-profitable/"},{title:"Steam’s distribution payments",url:"https://partner.steamgames.com/doc/finance/payments_salesreporting/faq"}]});
 if(chapter.id==="studio-to-screen") {
  result.push({id:"platform-revenue",title:"A console is one line in the business",kind:"Reported revenue · interactive paired bars",description:"Seven pairs compare Sony’s FY24 and FY25 Game & Network Services sales. Teal outlines denote FY24; brass bars denote FY25. Bars share a zero baseline. Unit controls switch yen billions to shares of the reported segment total.",reading:"The platform has several revenue streams. Select a category to see its scope, particularly Network Services, which includes both PlayStation Plus and advertising. Reported revenue is not gross player expenditure.",behavior:"Buttons update only the bars and readout. Exact source values remain in an accessible button label. No animation, network request or charting library is needed.",boundary:"Years end 31 March 2025 and 2026. Totals include intersegment activity; the categories include product sales, royalties and service revenue. FY25 detail differs from the published total by ¥1m through rounding. Shares are calculated; cloud revenue is not separately reported.",references:references.filter(r=>r.url.includes("sony.com"))});
  result.push({id:"cloud-envelope",title:"The constraint moves",kind:"Published requirements · selectable horizontal bars",description:"Four stream modes use a common 0–50 Mbps scale. The selected mode turns brass and identifies resolution, frame rate and bandwidth. A separate readout shows the provider’s sub-80 ms network-latency requirement.",reading:"Rendering can move off the player’s device while the connection becomes more demanding. Higher stream modes do not remove device, plan or network constraints.",behavior:"Select a mode with mouse, keyboard or touch. The chart stays still and its values remain visible without a tooltip.",boundary:"Selected NVIDIA Windows-client requirements checked 5 October 2026. Not measured throughput, guaranteed rendered frame rates or total input-to-display latency.",references:references.filter(r=>r.url.includes("system-reqs"))});
  result.push({id:"cloud-reach",title:"Millions found another way in",kind:"Historical company disclosures",description:"Two zero-based horizontal bars mark GeForce NOW’s over-10-million and over-25-million member disclosures in May 2021 and February 2023. Hatched ends and explicit labels identify lower bounds.",reading:"The milestones establish historical reach, while the label keeps members distinct from active users, paying users, revenue or profit.",boundary:"Two disclosed milestones, not a continuous growth series. No exact growth multiple, market share, causal sales lift or current population is inferred.",references:references.filter(r=>r.url.includes("nvda-20210502")||r.url.includes("feb-2"))});
 }
 if(chapter.id==="the-fork") {
  result.push({id:"cinema",title:"A ticket for a showing",kind:"Original cinema illustration",
   description:"A proscenium frames pleated red drapes, rows of individually shaped seated silhouettes and a luminous screen. Seat rows converge toward the screen; curtain folds attach to their upper rail. The image on the screen is its own small original world, held within the cinema’s architecture.",
   reading:"The composition gathers an audience around one scheduled work. The ticket below identifies an admission, while the catalog beside it places individual titles within a continuing membership.",
   behavior:"A restrained projection glow and the screen’s small animated layers make the auditorium feel occupied. The frame and audience stay grounded.",
   boundary:"An invented cinema, not a photograph or a claim that films only earn from tickets.",references:references.filter(r=>r.url.includes("netflix")||r.url.includes("wga"))});
  for(const cover of coverReferences) result.push({id:cover.id,title:cover.title,kind:`Original parody · reference: ${cover.original}`,
   description:cover.detail,reading:"Shown as one invitation within a Netflix-like catalog. The invented title connects the recognizable screen world to the surrounding discussion of watching, return and renewal.",
   behavior:"Small local animation layers keep the card legible as a cover rather than turning it into a trailer.",boundary:`Reference creators: ${cover.creator}. Original geometry; not an official poster, cast portrait or actual catalog listing.`,references:[{title:"Production reference: Netflix Tudum",url:cover.source}]});
  result.push(sourceNote("netflix-wordmark","The red Netflix wordmark identifies the catalog side of the comparison.","Its role is identification; the surrounding interface and covers are our interpretation."));
  result.push({id:"gathering-place",title:"A game in the room / a world to meet in",kind:"Original comparison",
   description:"A view switch places the arcade bar beside an invented lantern-lit courtyard with travelers, tables and an adventure gate. Three stable accounts below separate people, work and payment.",
   reading:"Compare who supplies the gathering place and what people contribute to it. Social value can extend beyond playing together, and it does not determine a single correct payment model.",
   behavior:"The switch replaces the complete setting. The bar’s screen loops, rain and glass-polishing action run only while that view is visible and motion is enabled; the courtyard is a still scene.",
   boundary:"Both are illustrative settings. The courtyard is not a reconstructed Diablo town, and the room is not evidence of historical customer behavior.",references:references.filter(r=>r.url.includes("nickyee")||r.url.includes("wiley"))});
 }
 if(chapter.id==="shape-of-money") result.push({id:"funding",title:"Where the next sale comes from",kind:"Original commercial comparison",
  description:"A common player/studio structure is redrawn around several sources of a subsequent sale. Selecting a commercial model changes the offer, the funding connection and a short account of the resulting design pressure.",
  reading:"The person replaying a bought game need not be the person providing its next revenue. Follow who is asked to pay for what before judging how continued play supports production.",
  boundary:"The stated design pressures are our interpretation. No profit curves, studio budgets or eight-year revenue forecasts are plotted.",references});
 for(const figure of chapter.figures??[]) result.push(sourceNote(figure.asset,figure.alt,figure.caption));
 return result;
}
