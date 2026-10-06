/** Selected arrangements, not a universal supply chain or measured money flow. */
export type CircuitScene = "factory" | "operator" | "bar" | "arcade-player" | "studio" | "store" | "hardware" | "home" | "servers" | "film" | "catalog" | "network" | "viewer";
export type CircuitParty = { name: string; role: string; scene: CircuitScene; pays: string; earns: string; next: string };
export type CircuitPayment = { name: string; from: number; to: number; explanation: string };
export type CircuitSupply = { name: string; from: number; to: number; payment: number };
export type BusinessCircuit = { id: string; label: string; context: string; parties: CircuitParty[]; supplies: CircuitSupply[]; payments: CircuitPayment[]; note: string; sources: { label: string; url: string }[] };
const studio: CircuitParty = {name:"Larian",role:"Makes & publishes",scene:"studio",pays:"Development, licensing, release and support.",earns:"Proceeds from game sales after store settlement and other obligations.",next:"Another copy sold can help pay for the work already done and the next production."};
const steam: CircuitParty = {name:"Steam / Valve",role:"Reaches & sells",scene:"store",pays:"Storefront, delivery, payment systems and support.",earns:"Its agreed share of sales through the store.",next:"The store benefits when its audience finds another game worth buying."};
const steamPayments: CircuitPayment[] = [
 {name:"Game purchase",from:3,to:1,explanation:"The player buys Baldur’s Gate 3 through Steam. This payment buys the game; it does not pay for a computer or a streaming membership."},
 {name:"Store settlement",from:1,to:0,explanation:"Valve pays its partner under their agreement after adjustments such as refunds and taxes. The checkout total is not the amount the studio keeps."},
];
const steamSources = [
 {label:"Steam: game & publisher",url:"https://store.steampowered.com/app/1086940/Baldur_s_Gate_3/"},
 {label:"Steam: settlement",url:"https://partner.steamgames.com/doc/finance/payments_salesreporting/faq"},
];
export const businessCircuits: BusinessCircuit[] = [
 {
  id:"arcade",label:"Arcade",context:"A cabinet placed in a bar · a route-operated arrangement",
  parties:[
   {name:"Atari",role:"Makes the cabinet",scene:"factory",pays:"Game development, parts, assembly and sales.",earns:"Cabinet sales to commercial buyers.",next:"Another cabinet order. A popular machine gives operators a reason to buy it."},
   {name:"Operator",role:"Buys & maintains",scene:"operator",pays:"The cabinet, repairs and collection visits.",earns:"An agreed share of the machine’s takings.",next:"Another paid turn—and enough takings to justify keeping this cabinet on the route."},
   {name:"Bar",role:"Hosts & attracts",scene:"bar",pays:"Space, power, staff and the running of the venue.",earns:"Its agreed share of takings; drinks are a separate sale.",next:"Another visit, another drink. The game can also make the room somewhere people want to stay."},
   {name:"Players",role:"Gather & play",scene:"arcade-player",pays:"Coins for play; any drinks separately.",earns:"An occasion to enjoy, rather than a share of the takings.",next:"A turn worth joining. The player’s reason to return need not be the operator’s reason to keep the machine."},
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
  id:"pc",label:"PC purchase",context:"Baldur’s Gate 3 · Steam copy running on the player’s PC",
  parties:[studio,steam,
   {name:"PC supplier",role:"Supplies equipment",scene:"hardware",pays:"Hardware, manufacture or assembly, and distribution.",earns:"The sale of the computer or its components.",next:"Another equipment purchase. Hours spent replaying a game do not automatically produce another hardware sale."},
   {name:"Player",role:"Owns the machine",scene:"home",pays:"The game and equipment, plus power and connectivity as needed.",earns:"Use of the purchased game on their own computer.",next:"Another evening can use purchases already made. Enjoyment can continue without another game sale."},
  ],
  supplies:[{name:"Game & release",from:0,to:1,payment:1},{name:"Store & download",from:1,to:3,payment:0},{name:"Local computing",from:2,to:3,payment:2}],
  payments:[...steamPayments,{name:"Equipment purchase",from:3,to:2,explanation:"The player buys a computer or components from hardware sellers. The purchase can serve many games and other tasks; it is not a fee for this particular session."}],
  note:"Selected purchase route. The game download goes from Steam to the player’s PC; the PC supplier provides equipment separately. Licensing and financing obligations are introduced in the prose below.",sources:steamSources,
 },
 {
  id:"cloud",label:"Cloud play",context:"The same Steam copy · a paid GeForce NOW membership",
  parties:[studio,steam,
   {name:"NVIDIA",role:"Runs & streams",scene:"servers",pays:"Remote computing capacity, power, networking and service operation.",earns:"The selected paid GeForce NOW membership.",next:"Another membership period. Continued service has running costs even when the game has already been bought."},
   {name:"Player",role:"Connects & plays",scene:"home",pays:"The game, streaming membership, receiving device and connection.",earns:"Use of remote computing to play their supported store copy.",next:"Another month of streaming can be another payment to NVIDIA without being another purchase from Larian."},
  ],
  supplies:[{name:"Game & release",from:0,to:1,payment:1},{name:"Supported store copy",from:1,to:2,payment:0},{name:"Remote computing",from:2,to:3,payment:2}],
  payments:[...steamPayments,{name:"Cloud membership",from:3,to:2,explanation:"This is a separate payment to NVIDIA for its computing service. Valve says Cloud Play leaves the game purchase and publisher payout on their existing terms."}],
  note:"A paid GeForce NOW route, not every cloud service. A receiving device and connection are still needed. Other membership options exist; private contracts and rates are not inferred.",
  sources:[...steamSources,{label:"Valve: Cloud Play",url:"https://partner.steamgames.com/doc/features/cloudgaming"},{label:"NVIDIA: membership",url:"https://www.nvidia.com/en-us/geforce-now/faq/"}],
 },
 {
  id:"netflix",label:"Netflix",context:"An ad-free membership · commissioned and licensed screen entertainment",
  parties:[
   {name:"Producers / rights",role:"Make & license",scene:"film",pays:"Writers, performers, crews, production and rights.",earns:"Production funding or licensing payments on agreed terms.",next:"Another commission or license. The contract decides what the producer receives; a view is not automatically a ticket sale."},
   {name:"Netflix",role:"Funds, curates & sells",scene:"catalog",pays:"Commissioned and licensed work, promotion, technology and service operation.",earns:"Membership fees in this selected ad-free example.",next:"Another membership period. A title can help attract or retain members without being sold separately to each viewer."},
   {name:"Internet provider",role:"Connects the home",scene:"network",pays:"Network equipment, capacity, maintenance and support.",earns:"The household’s broadband bill.",next:"Another service period. Connectivity supports many uses, not just this film or episode."},
   {name:"Viewer",role:"Chooses & watches",scene:"viewer",pays:"Membership, connectivity and their viewing equipment.",earns:"Access to the available catalog while subscribed.",next:"Something worth watching. The viewer can choose another title without buying another admission."},
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
