import { studioCopy, publisherCopy, storefrontCopy, hardwareRetailerCopy, cloudProviderCopy, localPlayerCopy, cloudPlayerCopy } from "./business-role-copy";
import { consoleCircuits, consoleAccessOptions } from "./console-business-circuits";
/** Selected arrangements, not a universal supply chain or measured money flow. */
export type CircuitScene = "factory" | "operator" | "bar" | "arcade-player" | "studio" | "engine" | "epic-store" | "publisher" | "store" | "hardware" | "home" | "pc-home" | "servers" | "film" | "catalog" | "network" | "viewer" | "xbox-store" | "playstation-store" | "xbox-hardware" | "playstation-hardware" | "xbox-home" | "playstation-home";
export type CircuitParty = { name: string; category: string; role: string; scene: CircuitScene; gameTitle?: string; catalogAccess?: boolean; pays: string; earns: string; next: string };
export type CircuitPayment = { name: string; from: number; to: number; explanation: string };
export type CircuitSupply = { name: string; from: number; to: number; payment: number };
export type BusinessCircuit = { id: string; label: string; context: string; defaultPayment?: number; accessMode?: "purchase"|"catalog"; play?: {access:string;compute:string}; alternative?: {text:string;label:string;url:string}; parties: CircuitParty[]; supplies: CircuitSupply[]; payments: CircuitPayment[]; note: string; sources: { label: string; url: string }[] };
export const partyTitle = (party: CircuitParty) => `${party.name} (${party.category})`;
const studio: CircuitParty = {name:"CD PROJEKT RED",category:"studio",scene:"studio",gameTitle:"CYBERPUNK 2077",...studioCopy};
const publisher: CircuitParty = {name:"CD PROJEKT RED",category:"publisher",scene:"publisher",gameTitle:"CYBERPUNK 2077",...publisherCopy};
const steam: CircuitParty = {name:"Steam",category:"storefront",scene:"store",gameTitle:"CYBERPUNK 2077",...storefrontCopy};
// Studio, publisher, game access, computing and player keep the same positions
// in the local/cloud comparison. Role separation does not imply separate owners.
const steamSupplies: CircuitSupply[] = [
 {name:"Game development",from:0,to:1,payment:0},
 {name:"Published release",from:1,to:2,payment:1},
 {name:"Game access",from:2,to:4,payment:2},
];
const steamPayments: CircuitPayment[] = [
 {name:"Development budget",from:1,to:0,explanation:"CD PROJEKT RED develops and publishes Cyberpunk 2077. These boxes separate production from publishing responsibilities inside the same business. The line represents an allocated development budget, not an external publishing fee."},
 {name:"Store settlement",from:2,to:1,explanation:"Valve pays its publishing partner under their agreement after adjustments such as refunds and taxes. The checkout total is not the amount the publisher keeps. Cloud play leaves this settlement unchanged."},
 {name:"Game purchase",from:4,to:2,explanation:"The player buys Cyberpunk 2077 through Steam. This payment buys the game; it does not pay for a computer or a streaming membership. The game licence belongs to the player’s store account."},
];
const steamSources = [
 {label:"Steam: game & publisher",url:"https://store.steampowered.com/app/1091500/Cyberpunk_2077/"},
 {label:"Steam: settlement",url:"https://partner.steamgames.com/doc/finance/payments_salesreporting/faq"},
];
const circuits: BusinessCircuit[] = [
 {
  id:"arcade",label:"Arcade",context:"A cabinet placed in a bar · a route-operated arrangement",
  parties:[
   {name:"Atari",category:"manufacturer",role:"Makes the cabinet",scene:"factory",pays:"Game development, parts, assembly and sales.",earns:"Cabinet sales to commercial buyers.",next:"Another cabinet order. A popular machine gives operators a reason to buy it."},
   {name:"Operator",category:"equipment owner",role:"Buys & maintains",scene:"operator",pays:"The cabinet, repairs and collection visits.",earns:"An agreed share of the machine’s takings.",next:"Another paid turn—and enough takings to justify keeping this cabinet on the route."},
   {name:"Bar",category:"venue",role:"Hosts & attracts",scene:"bar",pays:"Space, power, staff and the running of the venue.",earns:"Its agreed share of takings; drinks are a separate sale.",next:"Another visit, another drink. The game can also make the room somewhere people want to stay."},
   {name:"Players",category:"customers",role:"Gather & play",scene:"arcade-player",pays:"Coins for play; any drinks separately.",earns:"An occasion to enjoy, rather than a share of the takings.",next:"A turn worth joining. The player’s reason to return need not be the operator’s reason to keep the machine."},
  ],
  supplies:[{name:"A cabinet",from:0,to:1,payment:0},{name:"Placement & upkeep",from:1,to:2,payment:2},{name:"A place to play",from:2,to:3,payment:1}],
  payments:[
   {name:"Cabinet purchase",from:1,to:0,explanation:"The operator buys a cabinet, directly or through a distributor. Atari earns from that sale; this is separate from the coins collected during play."},
   {name:"Coins for play",from:3,to:2,explanation:"Players put coins into the machine at the bar. The takings are collected and shared under the operator–venue agreement."},
   {name:"Collection split",from:2,to:1,explanation:"The operator and venue divide the collections. This line shows the operator’s share of a common pool, not a claim that the bar always collects or transfers the money."},
  ],
  note:"One documented type of arrangement. A venue may own its cabinet; distributors may sit between manufacturer and operator. No particular Pong tavern contract or revenue split is implied.",
  sources:[{label:"Al Alcorn: making & operating Pong",url:"https://archive.computerhistory.org/resources/access/text/2012/09/102658257-05-01-acc.pdf"},{label:"Operator / location splits, 1984",url:"https://elibrary.arcade-museum.com/magazines/pm/PlayMeter-1984-11-01/PlayMeter-1984-11-01-042.pdf"},{label:"Operator arrangements",url:"https://www.betson.com/are-arcades-profitable/"}],
 },
 {
  id:"local-pc",label:"Local PC",defaultPayment:3,play:{access:"Individual game purchase",compute:"Your PC runs the game"},context:"Cyberpunk 2077 · bought on Steam and run on the player’s PC",
  parties:[studio,publisher,steam,
   {name:"PC store",category:"hardware retailer",scene:"hardware",...hardwareRetailerCopy},
   {name:"Player",category:"customer",scene:"pc-home",gameTitle:"CYBERPUNK 2077",...localPlayerCopy},
  ],
  supplies:[...steamSupplies,{name:"Local computing",from:3,to:4,payment:3}],
  payments:[...steamPayments,{name:"Equipment purchase",from:4,to:3,explanation:"The player buys a computer or components from hardware sellers. The purchase can serve many games and other tasks; it is not a fee for this particular session."}],
  note:"The game download goes from Steam to the player’s PC; the PC store sells equipment separately. This local route holds the game purchase constant for the cloud comparison. CD PROJEKT RED performs both the studio and publisher roles; separate boxes identify their responsibilities, not separate ownership.",sources:steamSources,
 },
 {
  id:"cloud",label:"Cloud play",defaultPayment:3,accessMode:"purchase",play:{access:"Individual game purchase",compute:"GeForce NOW computing subscription"},context:"Cyberpunk 2077 · a purchased Steam copy, run remotely through a paid GeForce NOW membership. CD PROJEKT RED performs both the studio and publisher roles.",
  parties:[studio,publisher,steam,
   {name:"NVIDIA",category:"cloud provider",scene:"servers",...cloudProviderCopy},
   {name:"Player",category:"customer",scene:"home",...cloudPlayerCopy},
  ],
  supplies:[...steamSupplies,{name:"Remote computing",from:3,to:4,payment:3}],
  payments:[...steamPayments,{name:"Cloud membership",from:4,to:3,explanation:"This is a separate payment to NVIDIA for its computing service. Valve says Cloud Play leaves the game purchase and publisher payout on their existing terms."}],
  note:"A paid GeForce NOW route, not every cloud service. Steam supplies game access to the player; NVIDIA supplies remote computing to that same player. Store sign-in and publisher opt-in enable supported streaming; NVIDIA is not buying the game from Steam and reselling it. A receiving device and connection are still needed. Cyberpunk requires a supported paid GeForce NOW tier. Private contracts and rates are not inferred.",
  sources:[...steamSources,{label:"NVIDIA: Cyberpunk on Steam & GeForce NOW",url:"https://www.nvidia.com/en-gb/geforce/news/cyberpunk-2077-rtx-dlss-out-now/"},{label:"Valve: Cloud Play",url:"https://partner.steamgames.com/doc/features/cloudgaming"},{label:"NVIDIA: Cyberpunk paid-tier requirement from April 2026",url:"https://blogs.nvidia.com/blog/geforce-now-thursday-virtual-reality-update/"},{label:"NVIDIA: membership",url:"https://www.nvidia.com/en-us/geforce-now/faq/"}],
 },
 {
  id:"netflix",label:"Netflix",context:"An ad-free membership · commissioned and licensed screen entertainment",
  parties:[
   {name:"Producers",category:"studios & rights holders",role:"Make & license",scene:"film",pays:"Writers, performers, crews, production and rights.",earns:"Production funding or licensing payments on agreed terms.",next:"Another commission or license. The contract decides what the producer receives; a view is not automatically a ticket sale."},
   {name:"Netflix",category:"streaming service",role:"Funds, curates & sells",scene:"catalog",pays:"Commissioned and licensed work, promotion, technology and service operation.",earns:"Membership fees in this selected ad-free example.",next:"Another membership period. A title can help attract or retain members without being sold separately to each viewer."},
   {name:"Internet provider",category:"network operator",role:"Connects the home",scene:"network",pays:"Network equipment, capacity, maintenance and support.",earns:"The household’s broadband bill.",next:"Another service period. Connectivity supports many uses, not just this film or episode."},
   {name:"Viewer",category:"subscriber",role:"Chooses & watches",scene:"viewer",pays:"Membership, connectivity and their viewing equipment.",earns:"Access to the available catalog while subscribed.",next:"Something worth watching. The viewer can choose another title without buying another admission."},
  ],
  supplies:[{name:"Productions & rights",from:0,to:1,payment:1},{name:"Catalog & discovery",from:1,to:3,payment:0},{name:"Connection & delivery",from:2,to:3,payment:2}],
  payments:[
   {name:"Membership",from:3,to:1,explanation:"The viewer pays Netflix for catalog access. The next episode does not require a separate ticket purchase."},
   {name:"Production & licenses",from:1,to:0,explanation:"Netflix commissions work and licenses titles under agreements that can pay for production before viewing begins. This is not a per-view allocation of the viewer’s fee."},
   {name:"Broadband",from:3,to:2,explanation:"The household also pays for its internet connection. That service carries Netflix alongside other uses; the entire broadband bill cannot be attributed to one evening’s viewing."},
  ],
  note:"Netflix can perform several jobs within one company. This selects an ad-free plan; advertising supplies another revenue stream on ad-supported plans. The lines show relationships, not timing or amounts.",
  sources:[{label:"Netflix: funding & business model",url:"https://ir.netflix.net/ir-overview/top-investor-questions/default.aspx"},{label:"Netflix: recommendations",url:"https://help.netflix.com/en/node/100639/"}],
 },
];

export const localCloudCircuits = circuits.filter(route=>route.id==="local-pc"||route.id==="cloud");

// Keep Cyberpunk fixed throughout the overview. Its console catalog licences do
// not supply the PC entitlement required by NVIDIA; broader routes live in MarketMap.
const pcPurchaseCircuit:BusinessCircuit={...localCloudCircuits[0],id:"pc",label:"PC purchase",defaultPayment:1,supplies:localCloudCircuits[0].supplies.map((supply,index)=>index===2?{...supply,name:"Store & download"}:supply)};
const cloudPurchaseCircuit:BusinessCircuit={
 ...localCloudCircuits[1],
 alternative:{text:"Cyberpunk’s console catalog memberships do not include the PC edition used by GeForce NOW. This route keeps the Steam purchase; the market map includes other games with supported PC catalog access.",label:"Xbox: Cyberpunk’s console/cloud catalog scope",url:"https://news.xbox.com/en-us/2026/03/03/xbox-game-pass-march-2026-wave-1/"},
};
export const businessCircuits=[...circuits.filter(route=>route.id==="arcade"),pcPurchaseCircuit,...consoleCircuits,cloudPurchaseCircuit,...circuits.filter(route=>route.id==="netflix")];
export const circuitAccessOptions:Partial<Record<string,Record<"purchase"|"catalog",BusinessCircuit>>>=consoleAccessOptions;
