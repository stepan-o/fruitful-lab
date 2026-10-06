import { fireEvent, render, screen, within } from "@testing-library/react";
import BusinessCircuit from "@/components/sanctuary/BusinessCircuit";

test("separates a cabinet purchase from collections and the venue’s income",()=>{
 render(<BusinessCircuit/>);
 const figure=screen.getByRole("region",{name:"What has to keep selling?"});
 fireEvent.click(within(figure).getByRole("button",{name:/Cabinet purchase Operator → Atari/}));
 expect(within(figure).getByText(/Atari earns from that sale; this is separate from the coins/)).toBeVisible();
 fireEvent.click(within(figure).getByRole("button",{name:/Bar Hosts & attracts/}));
 expect(within(figure).getByText(/drinks are a separate sale/)).toBeVisible();
});

test("holds the store purchase constant while local equipment becomes a separate cloud service",()=>{
 render(<BusinessCircuit/>);
 fireEvent.click(screen.getByRole("button",{name:"PC purchase",exact:true}));
 expect(screen.getByRole("button",{name:/Equipment purchase Player → PC supplier/})).toHaveAttribute("aria-pressed","true");
 fireEvent.click(screen.getByRole("button",{name:"Cloud play",exact:true}));
 expect(screen.getByRole("button",{name:/Cloud membership Player → NVIDIA/})).toHaveAttribute("aria-pressed","true");
 expect(screen.getByText(/separate payment to NVIDIA/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:/Game purchase Player → Steam/}));
 expect(screen.getByText(/This payment buys the game; it does not pay for a computer/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:/Larian Makes & publishes/}));
 expect(screen.getByText(/Proceeds from game sales after store settlement/)).toBeVisible();
 expect(screen.getByRole("button",{name:/Store settlement Steam.*Larian/})).toHaveAttribute("aria-pressed","true");
});

test("explains Netflix production payments without inventing a per-view royalty",()=>{
 render(<BusinessCircuit/>);
 fireEvent.click(screen.getByRole("button",{name:"Netflix",exact:true}));
 fireEvent.click(screen.getByRole("button",{name:/Production & licenses Netflix → Producers/}));
 expect(screen.getByText(/not a per-view allocation of the viewer’s fee/)).toBeVisible();
 expect(screen.getByRole("heading",{name:"Producers / rights"})).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Arcade",exact:true}));
 expect(screen.getByRole("button",{name:/Coins for play Players → Bar/})).toHaveAttribute("aria-pressed","true");
 expect(screen.queryByText(/not a per-view allocation/)).not.toBeInTheDocument();
});

// The counterpart is a business relationship, not necessarily the reversed edge:
// a supported cloud copy still belongs to the Steam purchase, not NVIDIA's fee.
test.each([
 ["Arcade", [["A cabinet", "Cabinet purchase", [0,1], [0,1]], ["Placement & upkeep", "Collection split", [1,2], [1,2]], ["A place to play", "Coins for play", [2,3], [2,3]]]],
 ["PC purchase", [["Game & release", "Store settlement", [0,1], [0,1]], ["Store & download", "Game purchase", [1,3], [1,3]], ["Local computing", "Equipment purchase", [2,3], [2,3]]]],
 ["Cloud play", [["Game & release", "Store settlement", [0,1], [0,1]], ["Supported store copy", "Game purchase", [1,2], [1,3]], ["Remote computing", "Cloud membership", [2,3], [2,3]]]],
 ["Netflix", [["Productions & rights", "Production & licenses", [0,1], [0,1]], ["Catalog & discovery", "Membership", [1,3], [1,3]], ["Connection & delivery", "Broadband", [2,3], [2,3]]]],
] as const)("links supply and payment selections in %s", (arrangement, pairs)=>{
 render(<BusinessCircuit/>);
 fireEvent.click(screen.getByRole("button",{name:arrangement,exact:true}));
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
 const atari=captions.getByRole("button",{name:/Atari Makes the cabinet/});
 const operator=captions.getByRole("button",{name:/Operator Buys & maintains/});
 const bar=captions.getByRole("button",{name:/Bar Hosts & attracts/});
 const players=captions.getByRole("button",{name:/Players/});
 for(const control of [rooms.getByRole("button",{name:"Inspect Atari scene"}),atari,supplies.getByRole("button",{name:/A cabinet/}),payments.getByRole("button",{name:/Cabinet purchase/})]){
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
 fireEvent.pointerEnter(screen.getByRole("button",{name:"Inspect Atari scene"}));
 fireEvent.click(screen.getByRole("button",{name:"Cloud play",exact:true}));
 expect(screen.getByRole("button",{name:/NVIDIA Runs & streams/})).toHaveAttribute("data-highlighted","true");
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
