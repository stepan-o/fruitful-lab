import { fireEvent, render, screen, within } from "@testing-library/react";
import BusinessCircuit from "@/components/sanctuary/BusinessCircuit";

test("separates a cabinet purchase from collections and the venue’s income",()=>{
 render(<BusinessCircuit/>);
 const figure=screen.getByRole("region",{name:"What has to keep selling?"});
 fireEvent.click(within(figure).getByRole("button",{name:/Cabinet purchase Operator.* → Atari/}));
 expect(within(figure).getByText(/Atari earns from that sale; this is separate from the coins/)).toBeVisible();
 fireEvent.click(within(figure).getByRole("button",{name:/Bar.* Hosts & attracts/}));
 expect(within(figure).getByText(/drinks are a separate sale/)).toBeVisible();
});

test("holds the store purchase constant while local equipment becomes a separate cloud service",()=>{
 render(<BusinessCircuit cloudOnly/>);
 fireEvent.click(screen.getByRole("button",{name:"Local PC"}));
 expect(screen.getByRole("button",{name:/Equipment purchase Player.* → PC store/})).toHaveAttribute("aria-pressed","true");
 fireEvent.click(screen.getByRole("button",{name:"Cloud play"}));
 expect(screen.getByRole("button",{name:/Cloud membership Player.* → NVIDIA/})).toHaveAttribute("aria-pressed","true");
 expect(screen.getByText(/separate payment to NVIDIA/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:/Game purchase Player.* → Steam/}));
 expect(screen.getByText(/This payment buys the game; it does not pay for a computer/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:/CD PROJEKT RED.*publisher.* Funds & publishes/}));
 expect(screen.getByText(/Game sales, after distribution costs and other obligations/)).toBeVisible();
 expect(screen.getByRole("button",{name:/Store settlement Steam.*CD PROJEKT RED/})).toHaveAttribute("aria-pressed","true");
});

test("explains Netflix production payments without inventing a per-view royalty",()=>{
 render(<BusinessCircuit/>);
 fireEvent.click(screen.getByRole("button",{name:"Netflix"}));
 fireEvent.click(screen.getByRole("button",{name:/Production & licenses Netflix.* → Producers/}));
 expect(screen.getByText(/not a per-view allocation of the viewer’s fee/)).toBeVisible();
 expect(screen.getByRole("heading",{name:"Producers (studios & rights holders)"})).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Arcade"}));
 expect(screen.getByRole("button",{name:/Coins for play Players.* → Bar/})).toHaveAttribute("aria-pressed","true");
 expect(screen.queryByText(/not a per-view allocation/)).not.toBeInTheDocument();
});

// Game access and computing both reach the player directly. Selecting either
// side of an exchange highlights the same two participants.
test.each([
 ["Arcade", [["A cabinet", "Cabinet purchase", [0,1], [0,1]], ["Placement & upkeep", "Collection split", [1,2], [1,2]], ["A place to play", "Coins for play", [2,3], [2,3]]]],
 ["Xbox", [["Game development","Development budget",[0,1],[0,1]],["Published release","Store settlement",[1,2],[1,2]],["Store & download","Game purchase",[2,4],[2,4]],["Local computing","Console purchase",[3,4],[3,4]]]],
 ["PlayStation", [["Game development","Development budget",[0,1],[0,1]],["Published release","Store settlement",[1,2],[1,2]],["Store & download","Game purchase",[2,4],[2,4]],["Local computing","Console purchase",[3,4],[3,4]]]],
 ["PC purchase", [["Game development","Development budget",[0,1],[0,1]],["Published release","Store settlement",[1,2],[1,2]],["Store & download","Game purchase",[2,4],[2,4]],["Local computing","Equipment purchase",[3,4],[3,4]]]],
 ["Cloud play", [["Game development","Development budget",[0,1],[0,1]],["Published release","Store settlement",[1,2],[1,2]],["Game access","Game purchase",[2,4],[2,4]],["Remote computing","Cloud membership",[3,4],[3,4]]]],
 ["Netflix", [["Productions & rights", "Production & licenses", [0,1], [0,1]], ["Catalog & discovery", "Membership", [1,3], [1,3]], ["Connection & delivery", "Broadband", [2,3], [2,3]]]],
] as const)("links supply and payment selections in %s", (arrangement, pairs)=>{
 render(<BusinessCircuit/>);
 fireEvent.click(screen.getByRole("button",{name:arrangement}));
 const supplies=within(screen.getByRole("list",{name:"What each participant supplies"}));
 const payments=within(screen.getByRole("group",{name:"Follow a payment"}));
 const captions=within(screen.getByRole("group",{name:"Inspect a business or its customer"})).getAllByRole("button");
 const expectEndpoints=(endpoints:readonly number[])=>captions.forEach((button,index)=>{
  expect(button).toHaveAttribute("data-highlighted",String(endpoints.includes(index)));
  expect(button).toHaveAttribute("aria-pressed",String(endpoints.includes(index)));
 });
 for(const [supplyName,paymentName,supplyEndpoints,paymentEndpoints] of pairs){
  const supply=supplies.getByRole("button",{name:new RegExp(`^${supplyName} `)});
  const payment=payments.getByRole("button",{name:new RegExp(`^${paymentName} `)});
  fireEvent.click(supply);
  expectEndpoints(supplyEndpoints);
  expect(payment).toHaveAttribute("aria-pressed","true");
  // Move away, then enter the same relationship from the payment side.
  fireEvent.click(supplies.getAllByRole("button").find(button=>button!==supply)!);
  fireEvent.click(payment);
  expectEndpoints(paymentEndpoints);
  expect(supply).toHaveAttribute("aria-pressed","true");
  expect(supplies.getAllByRole("button",{pressed:true})).toHaveLength(1);
  expect(payments.getAllByRole("button",{pressed:true})).toHaveLength(1);
 }
});


test("room, caption, supply and payment controls share the same visual spotlight",()=>{
 render(<BusinessCircuit/>);
 const captions=within(screen.getByRole("group",{name:"Inspect a business or its customer"}));
 const rooms=within(screen.getByRole("group",{name:"Inspect an illustrated room"}));
 const supplies=within(screen.getByRole("list",{name:"What each participant supplies"}));
 const payments=within(screen.getByRole("group",{name:"Follow a payment"}));
 const atari=captions.getByRole("button",{name:/Atari.* Makes the cabinet/});
 const operator=captions.getByRole("button",{name:/Operator.* Buys & maintains/});
 const bar=captions.getByRole("button",{name:/Bar.* Hosts & attracts/});
 const players=captions.getByRole("button",{name:/Players/});
 for(const control of [rooms.getByRole("button",{name:"Inspect Atari (manufacturer) scene"}),atari,supplies.getByRole("button",{name:/A cabinet/}),payments.getByRole("button",{name:/Cabinet purchase/})]){
  fireEvent.click(players);
  fireEvent.click(control);
  expect(atari).toHaveAttribute("data-highlighted","true");
  expect(atari).toHaveAttribute("aria-pressed","true");
  expect(players).toHaveAttribute("data-highlighted","false");
 }
 fireEvent.focus(operator);
 expect(operator).toHaveAttribute("data-highlighted","true");
 fireEvent.pointerEnter(bar);
 expect(bar).toHaveAttribute("data-highlighted","true");
 fireEvent.pointerLeave(bar);
 expect(operator).toHaveAttribute("data-highlighted","true");
 fireEvent.blur(operator);
 expect(atari).toHaveAttribute("data-highlighted","true");
 fireEvent.pointerEnter(bar);
 fireEvent.focus(players);
 expect(players).toHaveAttribute("data-highlighted","true");
 fireEvent.blur(players);
 expect(atari).toHaveAttribute("data-highlighted","true");
 // Keyboard focus takes over from a stationary pointer. A preview does not commit a selection.
 expect(atari).toHaveAttribute("aria-pressed","true");
});

test("an arrangement switch clears the previous room preview and retains row explanations",()=>{
 render(<BusinessCircuit/>);
 fireEvent.pointerEnter(screen.getByRole("button",{name:"Inspect Atari (manufacturer) scene"}));
 fireEvent.click(screen.getByRole("button",{name:"Cloud play"}));
 expect(screen.getByRole("button",{name:/NVIDIA.* Runs & streams/})).toHaveAttribute("data-highlighted","true");
 expect(screen.getByRole("list",{name:"What each participant supplies"})).toHaveAccessibleDescription(/Products & services.*supplier → recipient/);
 expect(screen.getByRole("group",{name:"Follow a payment"})).toHaveAccessibleDescription(/Purchases, fees & revenue shares.*payer → recipient/);
});


test("connection previews restore both selected endpoints and room selection remains individual",()=>{
 render(<BusinessCircuit/>);
 const captions=within(screen.getByRole("group",{name:"Inspect a business or its customer"}));
 const participants=captions.getAllByRole("button");
 const expectEndpoints=(endpoints:readonly number[])=>participants.forEach((button,index)=>expect(button).toHaveAttribute("data-highlighted",String(endpoints.includes(index))));
 const supply=screen.getByRole("button",{name:/A cabinet Atari/});
 const payment=screen.getByRole("button",{name:/Coins for play Players/});
 fireEvent.click(supply);
 expectEndpoints([0,1]);
 fireEvent.pointerEnter(payment);
 expectEndpoints([2,3]);
 fireEvent.pointerLeave(payment);
 expectEndpoints([0,1]);
 fireEvent.focus(payment);
 expectEndpoints([2,3]);
 fireEvent.blur(payment);
 expectEndpoints([0,1]);
 fireEvent.click(captions.getByRole("button",{name:/Players/}));
 expectEndpoints([3]);
});


test("console access terms stay distinct from where the game runs",()=>{
 render(<BusinessCircuit/>);
 expect(screen.queryByRole("button",{name:"Self-published"})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Xbox"}));
 expect(screen.getByRole("button",{name:"Purchased game"})).toHaveAttribute("aria-pressed","true");
 expect(screen.getByText("Individual game purchase")).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Catalog membership"}));
 expect(screen.getByText("Game Pass Premium catalog subscription")).toBeVisible();
 expect(screen.getByText("Your Xbox runs the game")).toBeVisible();
 expect(screen.getByRole("link",{name:"Xbox Cloud Gaming ↗"})).toHaveAttribute("href","https://www.xbox.com/en-US/cloud-gaming");
 expect(screen.getByText(/a subscription does not necessarily mean cloud gaming/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"PlayStation"}));
 expect(screen.getByText("Individual game purchase")).toBeVisible();
 expect(screen.getByText("Your PS5 runs the game")).toBeVisible();
 expect(screen.getByRole("link",{name:"PlayStation cloud streaming ↗"})).toHaveAttribute("href","https://www.playstation.com/ps5-game-cloud-streaming");
 expect(screen.getByText(/PlayStation Plus is not required for this single-player purchase route/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Cloud play"}));
 expect(screen.getByText("Individual game purchase")).toBeVisible();
 expect(screen.getByText("GeForce NOW computing subscription")).toBeVisible();
});

test("the dedicated cloud comparison holds Cyberpunk constant and does not introduce console tabs",()=>{
 render(<BusinessCircuit cloudOnly/>);
 const choices=within(screen.getByRole("group",{name:"Compare business arrangements"}));
 expect(choices.getAllByRole("button")).toHaveLength(2);
 expect(choices.getByRole("button",{name:"Local PC"})).toBeVisible();
 expect(choices.getByRole("button",{name:"Cloud play"})).toHaveAttribute("aria-pressed","true");
});


test("console catalog access does not leak into Cyberpunk’s NVIDIA route",()=>{
 render(<BusinessCircuit/>);
 const routes=within(screen.getByRole("group",{name:"Compare business arrangements"}));
 expect(routes.getAllByRole("button").map(button=>button.textContent)).toEqual(["Arcade","PC purchase","PlayStation","Xbox","Cloud play","Netflix"]);
 fireEvent.click(routes.getByRole("button",{name:"Xbox"}));
 fireEvent.click(screen.getByRole("button",{name:"Catalog membership"}));
 fireEvent.click(routes.getByRole("button",{name:"Cloud play"}));
 expect(screen.queryByRole("group",{name:"Choose how to access the game"})).not.toBeInTheDocument();
 expect(screen.getByText("Individual game purchase")).toBeVisible();
 expect(screen.getByText("GeForce NOW computing subscription")).toBeVisible();
 expect(screen.getByText(/console catalog memberships do not include the PC edition/)).toBeVisible();
 expect(screen.getByRole("button",{name:/Game purchase Player.*Steam/})).toBeVisible();
 expect(screen.getByRole("button",{name:/Cloud membership Player.*NVIDIA/})).toHaveAttribute("aria-pressed","true");
 fireEvent.click(routes.getByRole("button",{name:"Xbox"}));
 expect(screen.getByRole("button",{name:"Purchased game"})).toHaveAttribute("aria-pressed","true");
});

test("the dedicated cloud chapter retains a same-game comparison without catalog switching",()=>{
 render(<BusinessCircuit cloudOnly/>);
 expect(screen.queryByRole("group",{name:"Choose how to access the game"})).not.toBeInTheDocument();
 expect(screen.getByText(/Cyberpunk 2077 · a purchased Steam copy/)).toBeVisible();
});

test("the four game arrangements hold Cyberpunk and its makers fixed",()=>{
 render(<BusinessCircuit/>);
 for(const route of ["PC purchase","PlayStation","Xbox","Cloud play"]){
  fireEvent.click(screen.getByRole("button",{name:route}));
  const captions=within(screen.getByRole("group",{name:"Inspect a business or its customer"})).getAllByRole("button");
  expect(captions).toHaveLength(5);
  expect(captions[0]).toHaveTextContent("CD PROJEKT RED (studio)");
  expect(captions[1]).toHaveTextContent("CD PROJEKT RED (publisher)");
  expect(screen.getByText(/^Cyberpunk 2077 ·/)).toBeVisible();
 }
 const supplies=within(screen.getByRole("list",{name:"What each participant supplies"}));
 expect(supplies.queryByRole("button",{name:/Steam.*NVIDIA/})).not.toBeInTheDocument();
 expect(supplies.getByRole("button",{name:/^Game access Steam.*Player/})).toBeVisible();
 expect(supplies.getByRole("button",{name:/^Remote computing NVIDIA.*Player/})).toBeVisible();
});

test.each([
 ["PlayStation","PlayStation Store","PlayStation Plus","Your PS5 runs the game","Cyberpunk 2077","Catalog membership"],
 ["Xbox","Xbox Store","Game Pass","Your Xbox runs the game","Cyberpunk 2077","Catalog membership"],
])("%s compares buying and catalog access without changing the game or hardware",(platform,store,catalog,compute,game,membership)=>{
 render(<BusinessCircuit/>);
 fireEvent.click(screen.getByRole("button",{name:platform}));
 const options=within(screen.getByRole("group",{name:"Choose how to access the game"}));
 const parties=within(screen.getByRole("group",{name:"Inspect a business or its customer"}));
 const payments=within(screen.getByRole("group",{name:"Follow a payment"}));
 const supplies=within(screen.getByRole("list",{name:"What each participant supplies"}));
 const originalPeople=parties.getAllByRole("button").slice(0,2).map(button=>button.textContent);
 const expectEndpoints=(indices:number[])=>parties.getAllByRole("button").forEach((button,index)=>expect(button).toHaveAttribute("data-highlighted",String(indices.includes(index))));
 for(const catalogSelected of [false,true,false]){
  fireEvent.click(options.getByRole("button",{name:catalogSelected?"Catalog membership":"Purchased game"}));
  expect(options.getByRole("button",{name:catalogSelected?"Catalog membership":"Purchased game"})).toHaveAttribute("aria-pressed","true");
  expect(screen.getByText(compute)).toBeVisible();
  expect(screen.getByText(new RegExp(`^${game} ·`))).toBeVisible();
  expect(parties.getAllByRole("button")).toHaveLength(5);
  expect(parties.getAllByRole("button").slice(0,2).map(button=>button.textContent)).toEqual(originalPeople);
  expect(parties.getAllByRole("button")[2]).toHaveTextContent(catalogSelected?catalog:store);
  const accessPayment=payments.getByRole("button",{name:new RegExp(`^${catalogSelected?membership:"Game purchase"} Player`)});
  expect(accessPayment).toHaveAttribute("aria-pressed","true");
  expectEndpoints([2,4]);
  fireEvent.click(supplies.getByRole("button",{name:/^Local computing /}));
  expectEndpoints([3,4]);
  expect(payments.getByRole("button",{name:/^Console purchase Player/})).toHaveAttribute("aria-pressed","true");
  fireEvent.click(accessPayment);
  expectEndpoints([2,4]);
  expect(supplies.getByRole("button",{name:new RegExp(`^${catalogSelected?"Access & download":"Store & download"} `)})).toHaveAttribute("aria-pressed","true");
  fireEvent.click(parties.getAllByRole("button")[4]);
  expect(screen.getByText(catalogSelected?"A catalog membership and a hardware purchase. Optional extras are separate.":"A game purchase and a hardware purchase. Optional extras are separate.")).toBeVisible();
  if(catalogSelected)expect(screen.getByText(/while the catalog membership remains active and the games remain included/)).toBeVisible();
 }
});

test("access alternatives reset cleanly between console, cloud and non-catalog examples",()=>{
 render(<BusinessCircuit/>);
 fireEvent.click(screen.getByRole("button",{name:"PlayStation"}));
 fireEvent.click(screen.getByRole("button",{name:"Catalog membership"}));
 fireEvent.click(screen.getByRole("button",{name:"Xbox"}));
 expect(screen.getByRole("button",{name:"Purchased game"})).toHaveAttribute("aria-pressed","true");
 expect(screen.getByRole("button",{name:"Catalog membership"})).toHaveAttribute("aria-pressed","false");
 fireEvent.click(screen.getByRole("button",{name:"Catalog membership"}));
 fireEvent.click(screen.getByRole("button",{name:"PlayStation"}));
 expect(screen.getByRole("button",{name:"Purchased game"})).toHaveAttribute("aria-pressed","true");
 expect(screen.queryByRole("button",{name:/Inspect Xbox Store/})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"PC purchase"}));
 expect(screen.queryByRole("group",{name:"Choose how to access the game"})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Cloud play"}));
 expect(screen.queryByRole("group",{name:"Choose how to access the game"})).not.toBeInTheDocument();
 expect(screen.getByRole("button",{name:/Cloud membership Player.*NVIDIA/})).toHaveAttribute("aria-pressed","true");
});
