import { fireEvent, render, screen, within } from "@testing-library/react";
import WorldWorkshop from "@/components/sanctuary/WorldWorkshop";
import example from "@/lib/sanctuary/loopforge-example.json";

describe("Loopforge's recorded world-building comparison", () => {
  it("changes consequences with policy while keeping speech separate from the event", () => {
    render(<WorldWorkshop/>);
    const record = screen.getByTestId("world-event");
    expect(within(record).getByText("36")).toBeInTheDocument();
    expect(within(record).getByText("124")).toBeInTheDocument();
    const before = record.textContent;
    fireEvent.click(screen.getByRole("button", {name:/Change the account/}));
    expect(screen.getByText(/Someone else can admire the strain gauge/)).toBeInTheDocument();
    expect(record.textContent).toBe(before);
    fireEvent.click(screen.getByRole("button", {name:/Care Ease the pressure/}));
    expect(within(record).getByText("21")).toBeInTheDocument();
    expect(within(record).getByText("109")).toBeInTheDocument();
    expect(screen.getByRole("heading", {name:"Rivet Witch has a view"})).toBeInTheDocument();
    expect(screen.getByText("Authored dialogue for this exhibit")).toBeInTheDocument();
    expect(screen.getByText(/does not call a language model/)).toBeInTheDocument();
  });

  it("retains the shared starting state and the original model's room-level evidence", () => {
    expect(example.start).toEqual({shift:3,total:88,strain:12});
    expect(example.priorPolicies).toEqual(["balanced","balanced","balanced"]);
    for(const result of Object.values(example.results)) {
      expect(result.shift).toBe(4);
      expect(result.strainBefore).toBe(example.start.strain);
      expect(result.rooms.reduce((sum,room)=>sum+room.output,0)).toBe(result.delta);
      expect(result.total).toBe(example.start.total+result.delta);
      expect(result.rooms.map(room=>room.supervisor)).toEqual(example.assignments);
    }
    expect(example.results.care.rooms.map(room=>room.disturbance)).toEqual(example.results.pressure.rooms.map(room=>room.disturbance));
  });
});
