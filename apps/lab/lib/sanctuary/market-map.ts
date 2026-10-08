/** Selected, evidenced routes, reviewed 7 October 2026. Never infer compatibility
 * from company ownership, a store listing, cross-play or cross-progression. */
export type MarketRole = "make" | "publish" | "access" | "compute";
export type ComputeId = "pc" | "ps5" | "xbox" | "gfn" | "ps-cloud" | "xbox-cloud";
export type MarketSource = { label: string; url: string };
export type AccessPath = {
 id: string; name: string; company: string; kind: "purchase" | "catalog" | "free";
 detail: string; payment: string; developer?: string; publisher?: string; compute: ComputeId[]; sources: MarketSource[];
};
export type MarketGame = {
 id: string; name: string; genre: string; developer: string; publisher: string;
 observation: string; boundary: string; sources: MarketSource[]; access: AccessPath[];
};
export const marketReviewDate = "7 October 2026";
export const marketRoles: {id: MarketRole; title: string; job: string}[] = [
 {id:"make",title:"Make the game",job:"Development studio"},
 {id:"publish",title:"Bring it to market",job:"Publishing & promotion"},
 {id:"access",title:"Get the game",job:"Choose a store or catalog"},
 {id:"compute",title:"Run the game",job:"Choose local or cloud hardware"},
];
const src = (label:string,url:string):MarketSource => ({label,url});
export const platformSources = {
 gfn:src("NVIDIA: game access & computing","https://www.nvidia.com/en-us/geforce-now/faq/"),
 ps:src("Sony: catalog & purchased-game streaming","https://www.playstation.com/en-us/ps5-game-cloud-streaming/"),
 xbox:src("Xbox: cloud access & eligible purchases","https://www.xbox.com/en-US/cloud-gaming"),
 pass:src("Xbox: current Game Pass plans","https://www.xbox.com/en-US/xbox-game-pass"),
 steam:src("Steam: settlement with publishers","https://partner.steamgames.com/doc/finance/payments_salesreporting/faq"),
};
const d4Steam=src("NVIDIA: Diablo IV on Steam","https://blogs.nvidia.com/blog/geforce-now-thursday-feb-games-list-four-year-anniversary-celebration/");
const d4Battle=src("NVIDIA: Diablo IV on Battle.net","https://blogs.nvidia.com/blog/geforce-now-thursday-battlenet-march-games-list/");
const d4Pass=src("NVIDIA: Battle.net games through Game Pass","https://nvidia.custhelp.com/app/answers/detail/a_id/5529/");
const d4Xbox=src("Xbox: Diablo IV publisher, platforms & catalog","https://www.xbox.com/en-US/games/store/diablo-iv/9nqrcd3w41l3");
const d4PS=src("PlayStation: Diablo IV","https://www.playstation.com/en-us/games/diablo-iv/");
const cpPC=src("NVIDIA: Cyberpunk on Steam, Epic & GOG","https://blogs.nvidia.com/blog/geforce-now-thursday-aug-31/");
const cpPS=src("PlayStation: Cyberpunk purchase, catalog & cloud","https://www.playstation.com/en-us/games/cyberpunk-2077/");
const cpXbox=src("Xbox: Cyberpunk in Stream your own game","https://news.xbox.com/en-us/2024/11/20/stream-your-own-game-xbox-cloud-gaming-beta/");
const cpXboxPass=src("Xbox: Cyberpunk catalog access is console & Xbox cloud","https://www.xbox.com/en-us/games/store/game/BX3M8L83BBRW");
const cpPaid=src("NVIDIA: Cyberpunk requires a paid tier from April 2026","https://blogs.nvidia.com/blog/geforce-now-thursday-virtual-reality-update/");
const forza=src("Xbox: Forza Horizon 5 platforms & Play Anywhere","https://www.xbox.com/en-US/games/forza-horizon-5");
const forzaGFN=src("NVIDIA: Forza through Steam, Xbox & PC Game Pass","https://blogs.nvidia.com/blog/geforce-now-thursday-forza-horizon/");
const fortnite=src("Epic: Fortnite cloud services","https://www.epicgames.com/help/c-34254770/c-38015632/a26740713");
const fortniteDevices=src("Epic: Fortnite devices","https://www.epicgames.com/help/c-34254770/c-Trending_0/what-devices-can-i-use-to-play-fortnite-on-mobile-console-or-pc-a21785133");
const bought=(id:string,name:string,company:string,compute:ComputeId[],sources:MarketSource[],detail="Buy this platform’s edition of the game."):AccessPath=>({id,name,company,kind:"purchase",compute,sources,detail,payment:`Pay ${company} for the game. The store and publisher settle under their distribution agreement.`});
const pcPass=(compute:ComputeId[],sources:MarketSource[],detail:string):AccessPath=>({id:"pc-pass",name:"PC Game Pass",company:"Microsoft",kind:"catalog",compute,sources,detail,payment:"Pay Microsoft a recurring PC Game Pass fee. Access depends on active membership and the game remaining in the catalog."});
const ultimate=(compute:ComputeId[],sources:MarketSource[],detail:string):AccessPath=>({id:"ultimate",name:"Game Pass Ultimate",company:"Microsoft",kind:"catalog",compute,sources,detail,payment:"Pay Microsoft one recurring Game Pass Ultimate fee for the included game catalog and eligible Xbox cloud play."});
const spider=src("Sony: Spider-Man 2 purchase, catalog & cloud","https://store.playstation.com/en-us/concept/10002456");
const spiderPC=src("Sony: Spider-Man 2 on PC & port credits","https://www.playstation.com/en-ca/games/marvels-spider-man-2/marvels-spider-man-2-pc/");
const sonyStudios=src("Sony: PlayStation Studios","https://www.playstation.com/en-us/corporate/playstation-studios/");
const sonyHardware=src("Sony: direct PS5 sales","https://direct.playstation.com/en-us/hardware/ps5");
const xboxHardware=src("Microsoft: direct Xbox console sales","https://www.xbox.com/en-US/consoles/xbox-series-x");
export const marketGames:MarketGame[]=[
 {id:"diablo",name:"Diablo IV",genre:"Action role-playing",developer:"Blizzard Entertainment",publisher:"Blizzard Entertainment",observation:"Blizzard makes and publishes Diablo IV. A Steam purchase can run on your PC or NVIDIA’s servers; a PlayStation purchase takes a different route to the same world.",boundary:"Cross-play and shared progress do not make a purchase valid in every store. Only evidenced routes are enabled here; this map does not assume Xbox or Sony cloud support for Diablo IV. Its console online-play requirements still apply.",sources:[d4Xbox,d4PS,d4Steam,d4Battle,d4Pass],access:[
  bought("steam","Steam","Valve",["pc","gfn"],[d4Steam],"A PC copy sold through Steam; Battle.net account linking is required."),
  bought("battle","Battle.net","Blizzard",["pc","gfn"],[d4Battle],"Blizzard sells the PC edition directly through Battle.net."),
  pcPass(["pc","gfn"],[d4Pass],"The PC entitlement is supplied through a linked Battle.net account."),
  bought("ps-store","PlayStation Store","Sony",["ps5"],[d4PS]),
  bought("xbox-store","Xbox Store","Microsoft",["xbox"],[d4Xbox],"This is the Xbox console edition, not a PC license."),
  ultimate(["pc","xbox","gfn"],[d4Pass,d4Xbox],"The catalog supplies console access and linked Battle.net access on PC. NVIDIA remains a separate computing service."),
 ]},
 {id:"cyberpunk",name:"Cyberpunk 2077",genre:"Open-world role-playing",developer:"CD PROJEKT RED",publisher:"CD PROJEKT RED",observation:"The same game reaches three different clouds. NVIDIA uses a supported PC-store copy. Sony accepts eligible PlayStation purchases or catalog access. Xbox accepts a bought Xbox copy or eligible Game Pass catalog access for its cloud.",boundary:"A Steam copy does not become a PlayStation or Xbox license. Sony’s cloud requires Premium even when you bought the game. Cyberpunk’s Game Pass catalog offer covers the Xbox edition, not PC Game Pass or NVIDIA. The base game’s catalog inclusion does not automatically include Phantom Liberty.",sources:[cpPC,cpPS,cpXbox,cpXboxPass,cpPaid],access:[
  bought("steam","Steam","Valve",["pc","gfn"],[cpPC]),
  bought("epic","Epic Games Store","Epic Games",["pc","gfn"],[cpPC]),
  bought("gog","GOG","GOG",["pc","gfn"],[cpPC]),
  bought("ps-store","PlayStation Store","Sony",["ps5","ps-cloud"],[cpPS]),
  {id:"ps-plus",name:"PlayStation Plus",company:"Sony",kind:"catalog",compute:["ps5","ps-cloud"],sources:[cpPS],detail:"Extra supplies local catalog access. Premium adds eligible cloud play.",payment:"Pay Sony a recurring membership fee. Extra covers the local catalog; Premium includes the catalog and cloud access."},
  bought("xbox-store","Xbox Store","Microsoft",["xbox","xbox-cloud"],[cpXbox],"Buy the Xbox edition; cloud play then requires an eligible Game Pass membership."),
  ultimate(["xbox","xbox-cloud"],[cpXboxPass],"This catalog offer supplies the Xbox edition, locally or on Xbox Cloud Gaming. It does not supply PC Game Pass access or a PC copy for NVIDIA."),
 ]},
 {id:"forza",name:"Forza Horizon 5",genre:"Open-world racing",developer:"Playground Games",publisher:"Xbox Game Studios",observation:"A Microsoft-published game can be sold by Valve and run by NVIDIA. Game Pass can instead supply the game, while either Microsoft or NVIDIA supplies the cloud hardware.",boundary:"The Xbox digital purchase supports Play Anywhere on Xbox and Windows; the Steam and PlayStation copies are separate purchases. PC Game Pass alone does not include Xbox Cloud Gaming. Ultimate is the bundled example shown here.",sources:[forza,forzaGFN],access:[
  bought("steam","Steam","Valve",["pc","gfn"],[forzaGFN]),
  bought("xbox-store","Xbox Store","Microsoft",["pc","xbox","gfn"],[forza,forzaGFN],"This digital edition supports Xbox Play Anywhere: one purchase for Xbox and Windows."),
  pcPass(["pc","gfn"],[forzaGFN],"The PC catalog provides the game; choose your PC or supported NVIDIA cloud play."),
  ultimate(["pc","xbox","gfn","xbox-cloud"],[forza,forzaGFN],"The catalog can run locally, on Microsoft’s cloud, or through a separate NVIDIA plan."),
  bought("ps-store","PlayStation Store","Sony",["ps5"],[forza],"The PlayStation edition is a separate purchase from the Xbox and Steam editions."),
 ]},
 {id:"fortnite",name:"Fortnite",genre:"Free-to-play multiplayer",developer:"Epic Games",publisher:"Epic Games",observation:"A route need not begin with a game purchase. Fortnite is free to enter on these platforms, including Xbox’s cloud; optional purchases inside the game support its business.",boundary:"Fortnite’s free Xbox cloud access is an exception to the usual membership requirement. Optional cosmetics and memberships are separate purchases. These selected PC and console routes omit mobile stores, Nintendo and Amazon Luna.",sources:[fortnite,fortniteDevices,platformSources.xbox],access:[
  {id:"epic",name:"Epic Games Store",company:"Epic Games",kind:"free",compute:["pc","gfn"],sources:[fortnite],detail:"Free PC access through Epic, with optional purchases in the game.",payment:"No base-game purchase. Optional content and memberships are paid separately through the applicable storefront."},
  {id:"ps-store",name:"PlayStation Store",company:"Sony",kind:"free",compute:["ps5"],sources:[fortniteDevices],detail:"Download Fortnite for free on PlayStation.",payment:"No base-game purchase; optional content is sold separately."},
  {id:"xbox-store",name:"Xbox / free account",company:"Microsoft",kind:"free",compute:["xbox","xbox-cloud"],sources:[platformSources.xbox],detail:"Play locally on Xbox, or enter Xbox Cloud Gaming with a free Microsoft account.",payment:"No base-game purchase and no Game Pass requirement for this cloud route. Optional content is sold separately."},
 ]},
 {id:"spider",name:"Marvel’s Spider-Man 2",genre:"Superhero adventure",developer:"Insomniac Games",publisher:"Sony Interactive Entertainment",observation:"Sony owns the development studio, publishes the game, operates the store and catalog, and sells the PS5. Its PC edition can also pass through Steam or Epic to someone else’s computer.",boundary:"Sony spans these jobs without owning every input: Marvel supplies the licensed characters. Nixxes adapted the PC edition. Buying it on Steam or Epic does not supply the PlayStation edition or Sony cloud access.",sources:[spider,spiderPC,sonyStudios],access:[
  bought("ps-store","PlayStation Store","Sony",["ps5","ps-cloud"],[spider]),
  {id:"ps-plus",name:"PlayStation Plus",company:"Sony",kind:"catalog",compute:["ps5","ps-cloud"],sources:[spider],detail:"Extra includes local catalog access; Premium also supplies eligible PS5 and Portal cloud play.",payment:"Pay Sony a recurring PS Plus membership. Extra covers local catalog access; Premium includes the catalog and eligible streaming."},
  {...bought("steam","Steam","Valve",["pc"],[spiderPC]),developer:"Insomniac / Nixxes",publisher:"PlayStation Publishing",detail:"Sony’s PC edition is sold through Steam, with PC adaptation by Nixxes."},
  {...bought("epic","Epic Games Store","Epic Games",["pc"],[spiderPC]),developer:"Insomniac / Nixxes",publisher:"PlayStation Publishing",detail:"Sony’s PC edition is sold through Epic, with PC adaptation by Nixxes."},
 ]},
];
export const computeOptions:{id:ComputeId;name:string;short:string;company:string;cloud:boolean;detail:string}[]=[
 {id:"pc",name:"Your PC",short:"PC",company:"Hardware retailer",cloud:false,detail:"Your computer renders the game. The purchase of that equipment is separate from the game license."},
 {id:"ps5",name:"Your PlayStation 5",short:"PS5",company:"Hardware retailer / Sony",cloud:false,detail:"Your PS5 renders the PlayStation edition locally."},
 {id:"xbox",name:"Your Xbox",short:"Xbox",company:"Hardware retailer / Microsoft",cloud:false,detail:"Your Xbox console renders the Xbox edition locally."},
 {id:"gfn",name:"NVIDIA GeForce NOW",short:"NVIDIA",company:"NVIDIA",cloud:true,detail:"NVIDIA runs the supported PC edition remotely. Your device receives the stream and sends back your inputs."},
 {id:"ps-cloud",name:"PlayStation cloud",short:"Sony",company:"Sony",cloud:true,detail:"Sony runs the supported PS5 edition remotely and streams it to a PS5 or PlayStation Portal. Premium and a supported region are required."},
 {id:"xbox-cloud",name:"Xbox Cloud Gaming",short:"Xbox",company:"Microsoft",cloud:true,detail:"Microsoft runs the console edition remotely. A supported receiving device and region are required."},
];
export const gameById=(id:string)=>marketGames.find(game=>game.id===id)??marketGames[0];
export const computeById=(id:ComputeId)=>computeOptions.find(item=>item.id===id)!;
export type MarketSelection={gameId:string;accessId:string;computeId:ComputeId};
export const initialSelection:MarketSelection={gameId:"diablo",accessId:"steam",computeId:"gfn"};
/** Preserve compatible choices; only replace the dependent field when necessary. */
export function selectAccess(state:MarketSelection,accessId:string):MarketSelection{
 const path=gameById(state.gameId).access.find(item=>item.id===accessId);
 if(!path)return state;
 return {...state,accessId,computeId:path.compute.includes(state.computeId)?state.computeId:path.compute[0]};
}
export function selectGame(state:MarketSelection,gameId:string):MarketSelection{
 const game=gameById(gameId);
 const path=game.access.find(item=>item.id===state.accessId)??game.access[0];
 return {gameId:game.id,accessId:path.id,computeId:path.compute.includes(state.computeId)?state.computeId:path.compute[0]};
}
export function selectCompute(state:MarketSelection,computeId:ComputeId):MarketSelection{
 const path=gameById(state.gameId).access.find(item=>item.id===state.accessId)!;
 return path.compute.includes(computeId)?{...state,computeId}:state;
}
export function computingPayment(game:MarketGame,path:AccessPath,computeId:ComputeId):{title:string;detail:string}{
 if(computeId==="gfn")return {title:"A separate NVIDIA service",detail:game.id==="cyberpunk"?"Pay NVIDIA for a supported paid GeForce NOW tier. Cyberpunk no longer supports the Free tier. This payment does not buy the game.":"Paid GeForce NOW plans charge for computing separately from game access. GeForce NOW also offers a limited Free tier, subject to game and rig eligibility."};
 if(computeId==="ps-cloud")return path.kind==="catalog"?{title:"One Sony membership",detail:"Premium includes both this catalog game and eligible cloud computing. There is no second cloud subscription on top of Premium."}:{title:"Purchase + Sony membership",detail:"The game purchase and PS Plus Premium are separate payments to Sony. Premium is still required to stream your bought copy."};
 if(computeId==="xbox-cloud")return path.kind==="free"?{title:"Free Xbox cloud access",detail:"Fortnite can stream with a free Microsoft account. No Game Pass fee is required; you still provide a device and internet connection."}:path.id==="ultimate"?{title:"One Microsoft membership",detail:"Game Pass Ultimate includes this catalog game and Xbox cloud computing within its plan limits. NVIDIA is not part of this route."}:{title:"Purchase + Microsoft membership",detail:"Keep the Xbox game purchase and add a cloud-enabled Game Pass plan. Buying a Steam or PlayStation copy does not grant this Xbox entitlement."};
 return {title:"Equipment bought separately",detail:`Use ${computeId==="pc"?"a suitable PC":computeId==="ps5"?"your PS5":"your Xbox"}. Its cost goes to the hardware seller; using equipment you already own adds no cloud-computing fee. Online multiplayer may have separate console membership requirements.`};
}
export function routeSources(game:MarketGame,path:AccessPath,computeId:ComputeId):MarketSource[]{
 const extra=computeId==="gfn"?[platformSources.gfn]:computeId==="ps-cloud"?[platformSources.ps]:computeId==="xbox-cloud"?[platformSources.xbox]:[];
 return [...new Map([...game.sources,...path.sources,...extra,...(path.kind==="catalog"&&path.id!=="ps-plus"?[platformSources.pass]:[]),...(path.id==="steam"?[platformSources.steam]:[])].map(source=>[source.url,source])).values()];
}

export type CompanyRoute = MarketSelection & {id:string;name:string;company:string;context:string;hardwarePayment?:string;sources:MarketSource[]};
export const companyRoutes:CompanyRoute[]=[
 {id:"sony-console",name:"Sony · catalog + bought console",company:"Sony",gameId:"spider",accessId:"ps-plus",computeId:"ps5",context:"Sony owns Insomniac, publishes Spider-Man 2, runs PlayStation Plus and sells the PS5. This route follows a console bought directly from Sony, then recurring payments for game access. The equipment and catalog remain separate purchases.",hardwarePayment:"Pay Sony once for a PS5 bought through PlayStation Direct, then pay the PS Plus membership separately. Other retailers also sell the console.",sources:[sonyStudios,sonyHardware]},
 {id:"sony-cloud",name:"Sony · catalog + cloud",company:"Sony",gameId:"spider",accessId:"ps-plus",computeId:"ps-cloud",context:"Sony supplies the studio, publishing, catalog and remote computing for this route. Premium bundles game access with cloud play. The player still needs a supported receiving device; the cloud does not make hardware disappear.",sources:[sonyStudios,platformSources.ps]},
 {id:"xbox-console",name:"Microsoft · catalog + bought console",company:"Microsoft",gameId:"forza",accessId:"ultimate",computeId:"xbox",context:"Microsoft’s Playground Games makes Forza; Xbox publishes it, supplies Game Pass and sells the console. Buying an Xbox directly from Microsoft and subscribing to the catalog creates two different bills within one company’s business.",hardwarePayment:"Pay Microsoft for an Xbox bought directly from its store; pay Game Pass separately for continuing catalog access. Retailer purchases are another hardware route.",sources:[forza,xboxHardware]},
 {id:"xbox-cloud",name:"Microsoft · catalog + cloud",company:"Microsoft",gameId:"forza",accessId:"ultimate",computeId:"xbox-cloud",context:"The studio, publisher, Game Pass catalog and Xbox cloud service all sit within Microsoft’s gaming business. Ultimate bundles game access and computing for this route. The same game can leave that integrated chain through Steam or NVIDIA.",sources:[forza,platformSources.xbox]},
];
