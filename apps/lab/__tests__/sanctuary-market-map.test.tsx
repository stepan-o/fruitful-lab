import {fireEvent,render,screen,within} from "@testing-library/react";
import MarketMap from "@/components/sanctuary/MarketMap";
import {marketGames,companyRoutes,computeOptions,initialSelection,selectAccess,selectCompute,selectGame} from "@/lib/sanctuary/market-map";
const access=()=>screen.getByRole("combobox",{name:"Game access"});
const computing=()=>screen.getByRole("combobox",{name:"Computing provider"});
function game(name:RegExp){fireEvent.click(within(screen.getByRole("group",{name:"Choose a game"})).getByRole("button",{name}));}

test("a storefront change preserves compatible computing and the actual developer/publisher",()=>{
 render(<MarketMap/>);
 expect(access()).toHaveValue("steam");expect(computing()).toHaveValue("gfn");
 fireEvent.change(access(),{target:{value:"battle"}});
 expect(computing()).toHaveValue("gfn");
 for(const name of ["Make the game","Bring it to market"]){expect(within(screen.getByRole("article",{name})).getByText("Blizzard Entertainment")).toBeVisible();}
 fireEvent.change(computing(),{target:{value:"pc"}});
 expect(access()).toHaveValue("battle");
 expect(screen.getByRole("status")).toHaveTextContent("Game access stays with Battle.net");
});

test("an incompatible store change announces its hardware fallback and cannot use a PC license on Sony cloud",()=>{
 render(<MarketMap/>);
 expect(within(computing()).getByRole("option",{name:/PlayStation cloud/})).toBeDisabled();
 fireEvent.change(access(),{target:{value:"ps-store"}});
 expect(computing()).toHaveValue("ps5");
 expect(screen.getByRole("status")).toHaveTextContent("Computing changed to Your PlayStation 5");
 expect(within(computing()).getByRole("option",{name:/NVIDIA/})).toBeDisabled();
 expect(selectCompute(initialSelection,"ps-cloud")).toEqual(initialSelection);
});

test("one game can use three different clouds without pretending the licenses are interchangeable",()=>{
 render(<MarketMap/>);game(/^Cyberpunk/);
 expect(computing()).toHaveValue("gfn");expect(access()).toHaveValue("steam");
 fireEvent.click(screen.getByRole("button",{name:"PlayStation Store with PlayStation cloud"}));
 expect(access()).toHaveValue("ps-store");expect(computing()).toHaveValue("ps-cloud");
 expect(screen.getByText("Purchase + Sony membership")).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Xbox Store with Xbox Cloud Gaming"}));
 expect(access()).toHaveValue("xbox-store");expect(computing()).toHaveValue("xbox-cloud");
 expect(screen.getByText("Purchase + Microsoft membership")).toBeVisible();
 expect(screen.getByText(/A Steam copy does not become a PlayStation or Xbox license/)).toBeVisible();
});

test("Sony catalog plus Sony cloud is one Premium membership, not two subscriptions",()=>{
 render(<MarketMap/>);game(/^Cyberpunk/);
 fireEvent.click(screen.getByRole("button",{name:"PlayStation Store with PlayStation cloud"}));
 fireEvent.change(access(),{target:{value:"ps-plus"}});
 expect(computing()).toHaveValue("ps-cloud");
 expect(screen.getByText("One Sony membership")).toBeVisible();
 expect(screen.getByText(/no second cloud subscription on top of Premium/)).toBeVisible();
});

test("Cyberpunk catalog access supports Xbox cloud without granting a PC entitlement to NVIDIA",()=>{
 render(<MarketMap/>);game(/^Cyberpunk/);
 fireEvent.click(screen.getByRole("button",{name:"Game Pass Ultimate with Xbox Cloud Gaming"}));
 expect(access()).toHaveValue("ultimate");expect(computing()).toHaveValue("xbox-cloud");
 expect(screen.getByText("One Microsoft membership")).toBeVisible();
 expect(within(computing()).getByRole("option",{name:/NVIDIA/})).toBeDisabled();
 expect(within(computing()).getByRole("option",{name:/Your PC/})).toBeDisabled();
 expect(within(access()).queryByRole("option",{name:/PC Game Pass/})).not.toBeInTheDocument();
 const state={gameId:"cyberpunk",accessId:"ultimate",computeId:"xbox-cloud" as const};
 expect(selectCompute(state,"gfn")).toEqual(state);
 fireEvent.change(access(),{target:{value:"steam"}});
 expect(computing()).toHaveValue("pc");
 expect(within(computing()).getByRole("option",{name:/NVIDIA/})).toBeEnabled();
});

test("Game Pass with NVIDIA remains separate while Ultimate with Xbox cloud is bundled",()=>{
 render(<MarketMap/>);game(/^Forza/);
 fireEvent.click(screen.getByRole("button",{name:"PC Game Pass with NVIDIA GeForce NOW"}));
 expect(screen.getByText("A separate NVIDIA service")).toBeVisible();
 expect(within(computing()).getByRole("option",{name:/Xbox Cloud Gaming/})).toBeDisabled();
 fireEvent.click(screen.getByRole("button",{name:"Game Pass Ultimate with Xbox Cloud Gaming"}));
 expect(screen.getByText("One Microsoft membership")).toBeVisible();
 expect(screen.getByText(/NVIDIA is not part of this route/)).toBeVisible();
});

test("free cloud entry and source records follow the chosen game",()=>{
 render(<MarketMap/>);game(/^Fortnite/);
 fireEvent.click(screen.getByRole("button",{name:"Xbox / free account with Xbox Cloud Gaming"}));
 expect(screen.getByText("Free Xbox cloud access")).toBeVisible();
 expect(screen.getByText(/No Game Pass fee is required/)).toBeVisible();
 fireEvent.click(screen.getByText(/Sources & scope/));
 expect(screen.getByRole("link",{name:"Epic: Fortnite cloud services ↗"})).toBeVisible();
 expect(screen.queryByRole("link",{name:/NVIDIA: Diablo/})).not.toBeInTheDocument();
});

test("every offered connection is well formed and selection changes always produce an evidenced route",()=>{
 const known=new Set(computeOptions.map(item=>item.id));
 for(const item of marketGames){
  expect(new Set(item.access.map(path=>path.id)).size).toBe(item.access.length);
  expect(item.sources.length).toBeGreaterThan(0);
  for(const path of item.access){
   expect(path.compute.length).toBeGreaterThan(0);expect(path.sources.length).toBeGreaterThan(0);
   for(const machine of path.compute){expect(known.has(machine)).toBe(true);}
   const changed=selectAccess(selectGame(initialSelection,item.id),path.id);
   expect(path.compute).toContain(changed.computeId);
  }
 }
 expect(selectAccess(initialSelection,"unknown")).toEqual(initialSelection);
 expect(selectGame(initialSelection,"cyberpunk")).toEqual({...initialSelection,gameId:"cyberpunk"});
});

test("company-led presets retain the real studio and distinguish bought consoles from bundled cloud",()=>{
 render(<MarketMap/>);
 const preset=screen.getByRole("combobox",{name:"Or follow a company through the chain"});
 fireEvent.change(preset,{target:{value:"sony-console"}});
 expect(access()).toHaveValue("ps-plus");expect(computing()).toHaveValue("ps5");
 expect(screen.getByText("Console purchase · Sony")).toBeVisible();
 expect(within(screen.getByRole("article",{name:"Make the game"})).getByText("Insomniac Games")).toBeVisible();
 fireEvent.change(preset,{target:{value:"xbox-cloud"}});
 expect(access()).toHaveValue("ultimate");expect(computing()).toHaveValue("xbox-cloud");
 expect(screen.getByText("One Microsoft membership")).toBeVisible();
 fireEvent.change(access(),{target:{value:"steam"}});
 expect(preset).toHaveValue("");expect(computing()).toHaveValue("pc");
 expect(within(screen.getByRole("article",{name:"Make the game"})).getByText("Playground Games")).toBeVisible();
 for(const route of companyRoutes){
  const game=marketGames.find(item=>item.id===route.gameId)!;
  expect(game.access.find(item=>item.id===route.accessId)!.compute).toContain(route.computeId);
 }
});
