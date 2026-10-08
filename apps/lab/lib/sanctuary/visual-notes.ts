import historyMedia from "./history-media.json";
import type { Chapter, EvidenceSource } from "./types";
import descriptions from "./graphic-descriptions.json";
import { artDirection } from "./art-direction";
import { coverReferences } from "./cover-references";
import editorial from "./editorial-media.json";
import arcade from "./arcade-media.json";
import context from "./context-media.json";
import worlds from "./world-media.json";

export type VisualNote = {
  id: string; title: string; kind: string;
  description: string; reading: string; behavior?: string; boundary?: string;
  references: {title:string;url:string}[];
};
const records: Record<string, {title:string;purpose:string;source:string;sourceUrl:string|null;sourceDate:string;owner:string;treatment:string;provenanceNote?:string}> = {...historyMedia.assets,...editorial.assets,...arcade.assets,...context.assets,...worlds.assets};

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

/** Internal art-direction notebook. Descriptions and motion rationale are not public reader content. */
export function chapterVisualNotes(chapter:Chapter,sources:EvidenceSource[]):VisualNote[] {
 if(chapter.id==="mobile-freemium") return [
  {id:"scene-mobile-freemium",title:"A little game. A very long life.",kind:"Editorial artwork and historical comparison",description:"King’s complete official Candy Crush promotion stands beside its studio mark and a compact editorial title. A responsive split places the work before the opening paragraph.",reading:"The recognizable brand introduces the game before the prose traces its continuing production. The dated level counts belong in the adjacent narrative, not repeated in the caption.",references:sourceLinks(sources)},
  {id:"diagram-mobile-freemium",title:"You are already playing.",kind:"Original explanatory diagram",description:"An original brass-and-teal route joins free entry to play, with a continuing unpaid path and a separate optional purchase branch. A switch highlights either route beside King’s attributed promotional gameplay plate.",reading:"The diagram distinguishes entry from assistance within a known experience. It neither models conversion rates nor makes payment compulsory. A separate ownership sequence shows King’s two changes of parent.",behavior:"Buttons update the qualitative highlighted path. There is no continuous animation or external request; publisher images are never animated or recolored.",references:sourceLinks(sources)},
  ...(chapter.embeddedAssets??[]).map(id=>sourceNote(id,records[id].title,records[id].purpose))
 ];
 const detail=descriptions[chapter.id as keyof typeof descriptions];
 if(!detail) throw new Error(`Missing original visual notes: ${chapter.id}`);
 const references=sourceLinks(sources);
 const result:VisualNote[]=[];
 if(chapter.id!=="the-fork") result.push({id:`scene-${chapter.id}`,title:chapter.id==="insert-coin"?"The place around the game":artDirection[chapter.id].title,kind:chapter.id==="making-worlds"?"Visual comparison · cited games and original concept art":"Original procedural illustration",...detail.scene,
  boundary:chapter.id==="making-worlds"?"Game captures identify the works being analyzed; the Loopforge painting is owner-authorized concept art, not a gameplay or engine-output claim.":chapter.id==="insert-coin"?"The original scene studies a contemporary bar photograph. It is not documentary evidence of a 1970s venue, customer motives or beverage sales.":"Original interpretive geometry. References establish the game, theory or historical context; they do not turn this invented scene into documentary evidence.",
  references:chapter.id==="insert-coin"?references.filter(r=>r.url.includes("computerhistory")):references});
 result.push({id:`diagram-${chapter.id}`,title:chapter.visual.diagram.title,kind:"Explanatory instrument",...detail.diagram,references});
 if(chapter.id==="platform-business") result.push({id:"business-chains",title:"Who makes it. Who gets paid.",kind:"Comparative business map",
  description:"Eight concrete routes share six fixed questions, shown two columns at a time: production and supply, promotion and operation, audience payments and upstream settlement. Controls compare all routes, screen entertainment, Cyberpunk 2077 across three delivery routes, or two Xbox offers for Diablo IV.",
  reading:"The same work can travel through different businesses and payment arrangements. Repeated games hold the creative work roughly constant while distribution, computing and access change. An operator and a venue are roles that one owner can combine.",
  behavior:"Three keyboard-operated tabs switch the same table’s columns. A comparison selector filters rows without changing the active layer. Phones stack the labeled cells. This instrument has no continuous animation or external runtime request.",
  boundary:"An analytical map, not a quantitative flow or audited ledger. Historical examples and current US digital offers are dated. Private commissions, IP royalties and internal subscription allocations are not estimated. Cell links and the source register distinguish documented offers from the general business interpretation.",
  references:[{title:"Source register within the comparison",url:"/stepanoskin/game-monetization?chapter=platform-business#business-chains"},{title:"Operator and venue arrangements: Betson",url:"https://www.betson.com/are-arcades-profitable/"},{title:"Steam’s distribution payments",url:"https://partner.steamgames.com/doc/finance/payments_salesreporting/faq"}]});
 if(chapter.id==="studio-to-screen") {
  result.push({id:"business-circuit",title:"What has to keep selling?",kind:"Original procedural illustration · comparative payment routes",
   description:"Four engraved stations show an arcade maker, route operator, bar and players. Every video-game route uses five stations: studio, publisher, store or catalog, computing supplier and player. Game access and computing arrive at the player on separate branches. Cloud play holds Forza Horizon 5 and GeForce NOW fixed while switching Steam purchase and PC Game Pass access. Further tabs show Forza Horizon 5 downloaded through Game Pass to an Xbox, Spider-Man 2 bought for a PS5, and an ad-free Netflix arrangement. Teal paths carry work, equipment and access; numbered brass return paths identify selected payments. Native controls inspect each participant and transaction.",
   reading:"Follow who pays for which work, who receives the money and what each business needs to sell next. Cabinet purchases are separate from coin collections. The dedicated cloud chapter keeps the game and storefront constant while equipment and its payment change. The overview separates access to a game from where it runs; both console tabs explicitly identify cloud alternatives. Netflix commissions and licenses work as well as supplying a catalog.",
   behavior:"Original isometric workshop, venue, storefront, computer, console retailer, sofa-and-TV, server and screen vignettes share a deterministic SVG vocabulary. Console screens use original racing and city-swinging scenery; they are genre cues rather than captured gameplay. Sparse screen, fan and payment motion is gated by useLivingPlate, visibility, global motion preference and OS reduced motion. Mobile shows the same actors in two columns and uses explicit payer-to-recipient labels on the payment controls. The seven-layer detail is in the dedicated platform-business chapter.",
   boundary:"An analytical schematic, not a financial ledger or historical reconstruction. The order is not a timing claim; line width does not encode money. Private splits are not invented. Arcade collection allocation is shown separately from cabinet sales. Hardware suppliers and internet providers provide equipment/connectivity alongside content distribution, not as mandatory recipients of the game or membership fee. All artwork is original geometry and imaginary screen scenery, not an authentic game capture or logo.",
   references:[{title:"Alcorn oral history, page 13",url:"https://archive.computerhistory.org/resources/access/text/2012/09/102658257-05-01-acc.pdf"},{title:"Operator / location survey, 1984",url:"https://elibrary.arcade-museum.com/magazines/pm/PlayMeter-1984-11-01/PlayMeter-1984-11-01-042.pdf"},{title:"Valve: Cloud Play",url:"https://partner.steamgames.com/doc/features/cloudgaming"},{title:"Netflix: investor questions",url:"https://ir.netflix.net/ir-overview/top-investor-questions/default.aspx"}]});
 }
 if(chapter.id==="platform-business") {
  result.push({id:"platform-revenue",title:"What a platform earns from",kind:"Reported revenue · interactive paired bars",description:"Seven pairs compare Sony’s FY24 and FY25 Game & Network Services sales. Teal outlines denote FY24; brass bars denote FY25. Bars share a zero baseline. Unit controls switch yen billions to shares of the reported segment total.",reading:"The platform has several revenue streams. Select a category to see its scope, particularly Network Services, which includes both PlayStation Plus and advertising. Reported revenue is not gross player expenditure.",behavior:"Buttons update only the bars and readout. Exact source values remain in an accessible button label. No animation, network request or charting library is needed.",boundary:"Years end 31 March 2025 and 2026. Totals include intersegment activity; the categories include product sales, royalties and service revenue. FY25 detail differs from the published total by ¥1m through rounding. Shares are calculated; cloud revenue is not separately reported.",references:references.filter(r=>r.url.includes("sony.com"))});
 }
 if(chapter.id==="cloud-gaming") {
  result.push({id:"cloud-envelope",title:"The connection has requirements, too",kind:"Published requirements · selectable horizontal bars",description:"Four stream modes use a common 0–50 Mbps scale. The selected mode turns brass and identifies resolution, frame rate and bandwidth. A separate readout shows the provider’s sub-80 ms network-latency requirement.",reading:"Rendering can move off the player’s device while the connection becomes more demanding. Higher stream modes do not remove device, plan or network constraints.",behavior:"Select a mode with mouse, keyboard or touch. The chart stays still and its values remain visible without a tooltip.",boundary:"Selected NVIDIA Windows-client requirements checked 5 October 2026. Not measured throughput, guaranteed rendered frame rates or total input-to-display latency.",references:references.filter(r=>r.url.includes("system-reqs"))});
  result.push({id:"cloud-reach",title:"An early measure of reach",kind:"Historical company disclosures",description:"Two zero-based horizontal bars mark GeForce NOW’s over-10-million and over-25-million member disclosures in May 2021 and February 2023. Hatched ends and explicit labels identify lower bounds.",reading:"The milestones establish historical reach, while the label keeps members distinct from active users, paying users, revenue or profit.",boundary:"Two disclosed milestones, not a continuous growth series. No exact growth multiple, market share, causal sales lift or current population is inferred.",references:references.filter(r=>r.url.includes("nvda-20210502")||r.url.includes("feb-2"))});
 }
 if(chapter.id==="platform-business") {
  result.push({id:"cinema",title:"A ticket for a showing",kind:"Original cinema illustration",
   description:"A proscenium frames pleated red drapes, rows of individually shaped seated silhouettes and a luminous screen. Seat rows converge toward the screen; curtain folds attach to their upper rail. The image on the screen is its own small original world, held within the cinema’s architecture.",
   reading:"The composition gathers an audience around one scheduled work. The ticket below identifies an admission, while the catalog beside it places individual titles within a continuing membership.",
   behavior:"A restrained projection glow and the screen’s small animated layers make the auditorium feel occupied. The frame and audience stay grounded.",
   boundary:"An invented cinema, not a photograph or a claim that films only earn from tickets.",references:references.filter(r=>r.url.includes("netflix")||r.url.includes("wga"))});
  for(const cover of coverReferences) result.push({id:cover.id,title:cover.title,kind:`Original parody · reference: ${cover.original}`,
   description:cover.detail,reading:"Shown as one invitation within a Netflix-like catalog. The invented title connects the recognizable screen world to the surrounding discussion of watching, return and renewal.",
   behavior:"Small local animation layers keep the card legible as a cover rather than turning it into a trailer.",boundary:`Reference creators: ${cover.creator}. Original geometry; not an official poster, cast portrait or actual catalog listing.`,references:[{title:"Production reference: Netflix Tudum",url:cover.source}]});
  result.push(sourceNote("netflix-wordmark","The red Netflix wordmark identifies the catalog side of the comparison.","Its role is identification; the surrounding interface and covers are our interpretation."));
 }
 if(chapter.id==="the-fork") {
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
