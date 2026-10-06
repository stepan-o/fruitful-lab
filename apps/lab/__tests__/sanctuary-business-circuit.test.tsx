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
