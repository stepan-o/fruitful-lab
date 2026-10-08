import { studioCopy, publisherCopy, catalogPublisherCopy, integratedStorefrontCopy, catalogCopy, hardwareRetailerCopy, localPlayerCopy, catalogLocalPlayerCopy } from "./business-role-copy";
import type { BusinessCircuit } from "./business-circuit";

/** Specific console routes. Company roles are not separate ownership claims. */
const consoleOfferBases: BusinessCircuit[] = [
 {
  id:"playstation",label:"PlayStation",defaultPayment:2,accessMode:"purchase",
  context:"Marvel’s Spider-Man 2 · a superhero adventure, bought on PlayStation Store and downloaded to a PS5.",
  play:{access:"Individual game purchase",compute:"Your PS5 runs the game"},
  alternative:{text:"PlayStation also offers cloud play through Plus Premium, including selected purchased PS5 games on PS5 and Portal. Availability depends on the game, device and region.",label:"PlayStation cloud streaming",url:"https://www.playstation.com/ps5-game-cloud-streaming"},
  parties:[
   {name:"Insomniac Games",category:"studio",scene:"studio",gameTitle:"SPIDER-MAN 2",...studioCopy},
   {name:"Sony Interactive Entertainment",category:"publisher",scene:"publisher",gameTitle:"SPIDER-MAN 2",...publisherCopy},
   {name:"PlayStation Store",category:"storefront",scene:"playstation-store",...integratedStorefrontCopy},
   {name:"Console store",category:"hardware retailer",scene:"playstation-hardware",...hardwareRetailerCopy},
   {name:"Player",category:"customer",scene:"playstation-home",...localPlayerCopy},
  ],
  supplies:[{name:"Game development",from:0,to:1,payment:0},{name:"Published release",from:1,to:2,payment:1},{name:"Store & download",from:2,to:4,payment:2},{name:"Local computing",from:3,to:4,payment:3}],
  payments:[
   {name:"Development budget",from:1,to:0,explanation:"Insomniac belongs to Sony Interactive Entertainment. This line represents production funding within the group, not a fee negotiated between independent companies."},
   {name:"Game sales revenue",from:2,to:1,explanation:"The storefront and publisher both belong to Sony. A sale contributes to the same group’s business; these boxes do not imply an external store commission between them."},
   {name:"Game purchase",from:4,to:2,explanation:"The player buys Marvel’s Spider-Man 2 for PS5 through PlayStation Store. The downloaded game runs on their console; PlayStation Plus is not required for this single-player purchase route."},
   {name:"Console purchase",from:4,to:3,explanation:"The PS5 is a separate hardware purchase, here through a retailer. The console stays in the home and can run many games, whether purchased individually or accessed through a catalog."},
  ],
  note:"Selected US digital purchase, checked 6 October 2026. Spider-Man 2 also has a PlayStation Plus catalog offer and supported cloud-streaming options; this diagram chooses a purchase and local PS5 play. It does not equate PlayStation with purchases or Xbox with subscriptions. Insomniac, publisher and storefront sit within Sony. Marvel licensing, other production contributors and retail wholesale transactions are omitted; private terms are not inferred.",
  sources:[{label:"Spider-Man 2: game & developer",url:"https://www.playstation.com/en-us/games/marvels-spider-man-2/"},{label:"Store: purchase, catalog & player count",url:"https://store.playstation.com/en-us/concept/10002456"},{label:"PS5: local hardware",url:"https://www.playstation.com/en-us/ps5/"},{label:"Insomniac joins PlayStation, 2019",url:"https://sonyinteractive.com/en/press-releases/2019/sony-interactive-entertainment-to-acquire-insomniac-games-developer-of-playstation4-top-selling-marvels-spider-man-ratchet-clank/"}],
 },
 {
  id:"xbox",label:"Xbox",defaultPayment:2,accessMode:"catalog",
  context:"Forza Horizon 5 · an open-world racing game, downloaded through Game Pass and run on an Xbox Series X.",
  play:{access:"Game Pass catalog subscription",compute:"Your Xbox runs the game"},
  alternative:{text:"Xbox also offers cloud play: supported games run on Microsoft’s servers and stream to a compatible device. That route uses provider-operated computing instead of a console in the home.",label:"Xbox Cloud Gaming",url:"https://www.xbox.com/en-US/cloud-gaming"},
  parties:[
   {name:"Playground Games",category:"studio",scene:"studio",gameTitle:"FORZA HORIZON 5",...studioCopy},
   {name:"Xbox Game Studios",category:"publisher",scene:"publisher",gameTitle:"FORZA HORIZON 5",...catalogPublisherCopy},
   {name:"Game Pass",category:"catalog service",scene:"xbox-store",catalogAccess:true,...catalogCopy},
   {name:"Console store",category:"hardware retailer",scene:"xbox-hardware",...hardwareRetailerCopy},
   {name:"Player",category:"subscriber",scene:"xbox-home",...catalogLocalPlayerCopy},
  ],
  supplies:[{name:"Game development",from:0,to:1,payment:0},{name:"Published release",from:1,to:2,payment:1},{name:"Access & download",from:2,to:4,payment:2},{name:"Local computing",from:3,to:4,payment:3}],
  payments:[
   {name:"Development budget",from:1,to:0,explanation:"Playground Games and Xbox Game Studios belong to Microsoft. This is a production-funding relationship within the group, not an external publishing contract."},
   {name:"Content funding",from:2,to:1,explanation:"Microsoft funds its own releases and its catalog. This line identifies the content obligation behind the service; it does not assert a separate Game Pass royalty or a payment for each race."},
   {name:"Game Pass membership",from:4,to:2,explanation:"The player pays for access to a catalog, then downloads Forza Horizon 5. The Xbox does the computing at home: a subscription does not necessarily mean cloud gaming."},
   {name:"Console purchase",from:4,to:3,explanation:"The player buys the Xbox separately, here through a retailer. That purchase supplies local computing; payment for game access is separate."},
  ],
  note:"Selected US offer checked 6 October 2026: Forza Horizon 5 is sold separately and included in eligible Game Pass plans. This route chooses a local console download. Xbox also offers cloud play and PC access under applicable terms. The first three roles belong to Microsoft; arrows do not invent internal transfer prices or third-party catalog terms. Retail wholesale transactions and individual add-ons are outside this simplified view.",
  sources:[{label:"Forza: developer, publisher & offers",url:"https://www.xbox.com/en-US/games/forza-horizon-5"},{label:"Game Pass: catalog access & terms",url:"https://www.xbox.com/en-US/xbox-game-pass"},{label:"Xbox Series X: local hardware",url:"https://www.xbox.com/en-US/consoles/xbox-series-x"},{label:"Playground joins Microsoft Studios, 2018",url:"https://www.microsoft.com/en-us/Investor/acquisition-history.aspx"}],
 },
];


// Keep each console, game and production team fixed when comparing access offers.
const [playstationPurchase,xboxCatalog] = consoleOfferBases;
const playstationCatalog: BusinessCircuit = {
 ...playstationPurchase,id:"playstation-catalog",accessMode:"catalog",
 context:"Marvel’s Spider-Man 2 · the same PS5 game, downloaded through the PlayStation Plus Game Catalog and run on the player’s console.",
 play:{access:"PlayStation Plus Extra catalog subscription",compute:"Your PS5 runs the game"},
 parties:playstationPurchase.parties.map((party,index)=>index===1?{...party,...catalogPublisherCopy}:index===2?{...party,name:"PlayStation Plus",category:"catalog service",catalogAccess:true,...catalogCopy}:index===4?{...party,category:"subscriber",...catalogLocalPlayerCopy}:party),
 supplies:playstationPurchase.supplies.map((supply,index)=>index===2?{...supply,name:"Access & download"}:supply),
 payments:playstationPurchase.payments.map((payment,index)=>index===1?{...payment,name:"Content funding",explanation:"Sony funds its own releases and its catalog. This line identifies the content obligation behind the service; it does not assert a separate PlayStation Plus royalty or a payment for each play session."}:index===2?{...payment,name:"Catalog membership",explanation:"The player pays Sony for PlayStation Plus Extra catalog access, then downloads Marvel’s Spider-Man 2 to their PS5. Access lasts while the membership is active and the game remains included. The console still does the computing at home."}:payment),
 note:"Selected US catalog offer checked 7 October 2026. Spider-Man 2 is included in the PlayStation Plus Game Catalog at Extra and Premium tiers; inclusion, plans and regional availability can change. This selects an Extra download to an owned PS5, not Premium cloud streaming. Studio, publisher and catalog belong to Sony; no internal royalty or transfer price is inferred. Marvel licensing, other contributors, add-ons and retail wholesale transactions are omitted.",
 sources:[...playstationPurchase.sources,{label:"PlayStation Plus: catalog access conditions",url:"https://www.playstation.com/en-us/ps-plus/"}],
};
const xboxPurchase: BusinessCircuit = {
 ...xboxCatalog,id:"xbox-purchase",accessMode:"purchase",
 context:"Forza Horizon 5 · the same racing game, bought through Xbox Store and downloaded to the player’s Xbox Series X.",
 play:{access:"Individual game purchase",compute:"Your Xbox runs the game"},
 parties:xboxCatalog.parties.map((party,index)=>index===1?{...party,...publisherCopy}:index===2?{...party,name:"Xbox Store",category:"storefront",catalogAccess:false,...integratedStorefrontCopy}:index===4?{...party,category:"customer",...localPlayerCopy}:party),
 supplies:xboxCatalog.supplies.map((supply,index)=>index===2?{...supply,name:"Store & download"}:supply),
 payments:xboxCatalog.payments.map((payment,index)=>index===1?{...payment,name:"Game sales revenue",explanation:"The storefront and publisher both belong to Microsoft. A sale contributes to the same group’s business; these boxes do not imply an external store commission between them."}:index===2?{...payment,name:"Game purchase",explanation:"The player buys Forza Horizon 5 through Xbox Store and downloads it to their console. The game purchase does not depend on continued catalog membership. Online console multiplayer requires an eligible Game Pass plan separately."}:payment),
 note:"Selected US digital purchase checked 7 October 2026. Forza Horizon 5 is sold separately and included in eligible Game Pass plans; the selector holds the game and owned Xbox constant. This digital purchase also supports Xbox Play Anywhere on Windows. The first three roles belong to Microsoft; no internal transfer price is inferred. Online console multiplayer, add-ons and retail wholesale transactions are outside the displayed base-game purchase.",
};
export const consoleAccessOptions = {
 playstation:{purchase:playstationPurchase,catalog:playstationCatalog},
 xbox:{purchase:xboxPurchase,catalog:xboxCatalog},
};

// Start both console comparisons with a purchase; catalog access is an explicit choice.
export const consoleCircuits: BusinessCircuit[] = [playstationPurchase,{...xboxPurchase,id:"xbox"}];
