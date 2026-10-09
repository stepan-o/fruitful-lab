import { studioCopy, publisherCopy, catalogPublisherCopy, storefrontCopy, catalogCopy, hardwareRetailerCopy, localPlayerCopy, catalogLocalPlayerCopy } from "./business-role-copy";
import type { BusinessCircuit, CircuitScene } from "./business-circuit";

type ConsoleOffer = {
 id:"playstation"|"xbox"; label:string; owner:string; machine:string;
 store:string; catalog:string; membership:string;
 storeScene:CircuitScene; hardwareScene:CircuitScene; homeScene:CircuitScene;
 offerUrl:string; hardwareUrl:string; cloudUrl:string; cloudLabel:string;
};

/** Same independent developer/publisher and game; different platform agreements. */
function consoleOffers(config:ConsoleOffer):Record<"purchase"|"catalog",BusinessCircuit>{
 const purchase:BusinessCircuit={
  id:config.id,label:config.label,defaultPayment:2,accessMode:"purchase",
  context:`Cyberpunk 2077 · bought through ${config.store} and downloaded to the player’s ${config.machine}.`,
  play:{access:"Individual game purchase",compute:`Your ${config.id==="playstation"?"PS5":"Xbox"} runs the game`},
  alternative:{text:`${config.label} also supports Cyberpunk through its own cloud service under eligible membership and device conditions. The route shown here uses an owned console.`,label:config.cloudLabel,url:config.cloudUrl},
  parties:[
   {name:"CD PROJEKT RED",category:"studio",scene:"studio",gameTitle:"CYBERPUNK 2077",...studioCopy},
   {name:"CD PROJEKT RED",category:"publisher",scene:"publisher",gameTitle:"CYBERPUNK 2077",...publisherCopy},
   {name:config.store,category:"storefront",scene:config.storeScene,gameTitle:"CYBERPUNK 2077",...storefrontCopy},
   {name:"Console store",category:"hardware retailer",scene:config.hardwareScene,gameTitle:"CYBERPUNK 2077",...hardwareRetailerCopy},
   {name:"Player",category:"customer",scene:config.homeScene,gameTitle:"CYBERPUNK 2077",...localPlayerCopy},
  ],
  supplies:[{name:"Game development",from:0,to:1,payment:0},{name:"Published release",from:1,to:2,payment:1},{name:"Store & download",from:2,to:4,payment:2},{name:"Local computing",from:3,to:4,payment:3}],
  payments:[
   {name:"Development budget",from:1,to:0,explanation:"CD PROJEKT RED develops and publishes Cyberpunk 2077. These boxes separate production from publishing responsibilities inside the same business. The line represents an allocated development budget, not an external publishing fee."},
   {name:"Store settlement",from:2,to:1,explanation:`${config.owner} collects the store payment and settles with CD PROJEKT RED under their agreement. The publisher is independent of the platform owner; the diagram does not assume a commission rate or private contract terms.`},
   {name:"Game purchase",from:4,to:2,explanation:`The player buys Cyberpunk 2077 through ${config.store}. The downloaded game runs on their console; ${config.id==="playstation"?"PlayStation Plus":"Game Pass"} is not required for this single-player purchase route.`},
   {name:"Console purchase",from:4,to:3,explanation:`The ${config.machine} is a separate hardware purchase, here through a retailer. That machine can run many games, whether bought individually or accessed through a catalog.`},
  ],
  note:`Selected US offers checked 8 October 2026. Cyberpunk’s developer and publisher are CD PROJEKT RED, independent of ${config.owner}. The store, console manufacturer and catalog belong to ${config.owner}; the retailer is shown separately. The diagram separates responsibilities and omits wholesale hardware transactions, regional distribution and other contributors. No private commission or internal transfer price is inferred. Catalog access, cloud play and individual purchases have separate conditions; one platform’s purchase does not grant a licence on every other platform.`,
  sources:[{label:"Cyberpunk: purchase, catalog & publisher",url:config.offerUrl},{label:`${config.machine}: local hardware`,url:config.hardwareUrl},{label:`${config.cloudLabel}: eligibility`,url:config.cloudUrl}],
 };
 const catalog:BusinessCircuit={
  ...purchase,id:`${config.id}-catalog`,accessMode:"catalog",
  context:`Cyberpunk 2077 · the same game, downloaded through ${config.catalog} and run on the player’s ${config.machine}.`,
  play:{access:`${config.membership} catalog subscription`,compute:purchase.play!.compute},
  parties:purchase.parties.map((party,index)=>index===1?{...party,...catalogPublisherCopy}:index===2?{...party,name:config.catalog,category:"catalog service",catalogAccess:true,...catalogCopy}:index===4?{...party,category:"subscriber",...catalogLocalPlayerCopy}:party),
  supplies:purchase.supplies.map((supply,index)=>index===2?{...supply,name:"Access & download"}:supply),
  payments:purchase.payments.map((payment,index)=>index===1?{...payment,name:"Catalog agreement",explanation:`${config.owner} licenses Cyberpunk 2077 from CD PROJEKT for its catalog. This is a separate publisher–platform agreement, not an internal payment or an assumed fee for each play session. The contract’s financial terms are not public here.`}:index===2?{...payment,name:"Catalog membership",explanation:`The player pays ${config.owner} for eligible ${config.catalog} catalog access, then downloads Cyberpunk 2077. Access lasts while the membership is active and the game remains included. The console does the computing at home; a subscription does not necessarily mean cloud gaming.`}:payment),
  note:purchase.note+` This selects catalog access and local computing. Phantom Liberty remains a separate offer. ${config.id==="xbox"?"Cyberpunk’s Game Pass catalog offer covers Xbox consoles and Xbox Cloud Gaming, not PC Game Pass or a Windows licence for NVIDIA.":"Sony’s July 2025 catalog agreement is the deal discussed in the chapter; management’s published rationale is not assigned to Microsoft."}`,
  sources:[...purchase.sources,{label:config.id==="playstation"?"Cyberpunk joins PlayStation Plus, July 2025":"Cyberpunk joins Xbox Game Pass, March 2026",url:config.id==="playstation"?"https://blog.playstation.com/2025/07/09/playstation-plus-game-catalog-for-july-cyberpunk-2077-abiotic-factor-banishers-ghosts-of-new-eden-and-more/":"https://news.xbox.com/en-us/2026/03/03/xbox-game-pass-march-2026-wave-1/"}],
 };
 return {purchase,catalog};
}

export const consoleAccessOptions={
 playstation:consoleOffers({id:"playstation",label:"PlayStation",owner:"Sony",machine:"PS5",store:"PlayStation Store",catalog:"PlayStation Plus",membership:"PlayStation Plus Extra",storeScene:"playstation-store",hardwareScene:"playstation-hardware",homeScene:"playstation-home",offerUrl:"https://www.playstation.com/en-us/games/cyberpunk-2077/",hardwareUrl:"https://www.playstation.com/en-us/ps5/",cloudUrl:"https://www.playstation.com/ps5-game-cloud-streaming",cloudLabel:"PlayStation cloud streaming"}),
 xbox:consoleOffers({id:"xbox",label:"Xbox",owner:"Microsoft",machine:"Xbox Series X",store:"Xbox Store",catalog:"Game Pass",membership:"Game Pass Premium",storeScene:"xbox-store",hardwareScene:"xbox-hardware",homeScene:"xbox-home",offerUrl:"https://www.xbox.com/en-us/games/store/game/BX3M8L83BBRW",hardwareUrl:"https://www.xbox.com/en-US/consoles/xbox-series-x",cloudUrl:"https://www.xbox.com/en-US/cloud-gaming",cloudLabel:"Xbox Cloud Gaming"}),
};
export const consoleCircuits:BusinessCircuit[]=[consoleAccessOptions.playstation.purchase,consoleAccessOptions.xbox.purchase];
