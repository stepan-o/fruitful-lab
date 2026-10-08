import { fireEvent, render, screen, within } from "@testing-library/react";
import BusinessChains from "@/components/sanctuary/BusinessChains";
import { chainModels, chainPhases, chainSources } from "@/lib/sanctuary/business-chains";

describe("Sanctuary business-chain comparison",()=>{
  it("keeps the compared works in place while keyboard navigation changes layers",()=>{
    render(<BusinessChains/>);
    const first=screen.getByRole("tab",{name:/Make & supply/});
    first.focus();
    fireEvent.keyDown(first,{key:"End"});
    expect(screen.getByRole("tab",{name:/Collect & settle/})).toHaveFocus();
    expect(screen.getByRole("tab",{name:/Collect & settle/})).toHaveAttribute("aria-selected","true");
    expect(screen.getByRole("columnheader",{name:"Where the receipts go next"})).toBeVisible();
    expect(within(screen.getByRole("table")).getAllByRole("rowheader")).toHaveLength(8);
    fireEvent.keyDown(screen.getByRole("tab",{name:/Collect & settle/}),{key:"ArrowRight"});
    expect(first).toHaveFocus();
    expect(screen.getByRole("columnheader",{name:/Who makes the work/})).toBeVisible();
  });
  it("isolates the same game across three routes without losing the selected layer",()=>{
    render(<BusinessChains/>);
    fireEvent.click(screen.getByRole("tab",{name:/Collect & settle/}));
    fireEvent.change(screen.getByLabelText("Put side by side"),{target:{value:"cyberpunk"}});
    const table=within(screen.getByRole("table"));
    expect(table.getAllByRole("rowheader")).toHaveLength(3);
    expect(table.getByText(/Two payments buy two different things/)).toBeVisible();
    expect(table.queryByText(/Blizzard develops/)).not.toBeInTheDocument();
    expect(screen.getByRole("tab",{name:/Collect & settle/})).toHaveAttribute("aria-selected","true");
    fireEvent.change(screen.getByLabelText("Put side by side"),{target:{value:"diablo"}});
    expect(table.getAllByRole("rowheader")).toHaveLength(2);
    expect(table.getByText(/no public per-player allocation/)).toBeVisible();
  });
  it("resolves evidence for every stage and preserves explicit limits on the modeled route",()=>{
    expect(new Set(chainModels.map(model=>model.id)).size).toBe(chainModels.length);
    expect(chainPhases.flatMap(phase=>phase.fields)).toEqual([0,1,2,3,4,5]);
    for(const model of chainModels){
      expect(model.cells).toHaveLength(6);
      expect(model.boundary.length).toBeGreaterThan(30);
      for(const cell of model.cells){
        expect(cell.sources.length).toBeGreaterThan(0);
        for(const id of cell.sources)expect(chainSources[id]?.url).toMatch(/^https:\/\//);
      }
    }
  });
});
