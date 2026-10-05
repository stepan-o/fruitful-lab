import {render,screen,fireEvent} from "@testing-library/react";
import {PlatformRevenue,CloudFigures} from "@/components/sanctuary/BusinessCharts";
import BusinessMap from "@/components/sanctuary/BusinessMap";
import {platformRows,platformTotals} from "@/lib/sanctuary/industry-data";
it("reconciles reported detail to totals within Sony’s one-million-yen rounding",()=>{
 for(let year=0;year<2;year++) expect(Math.abs(platformRows.reduce((sum,row)=>sum+row.values[year],0)-platformTotals[year])).toBeLessThanOrEqual(1);
});
it("switches units while preserving categories and exposes the network-services boundary",()=>{
 render(<PlatformRevenue/>);
 fireEvent.click(screen.getByRole("button",{name:/Network services: FY24/}));
 expect(screen.getByText(/not a pure subscription or cloud category/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Share of segment"}));
 expect(screen.getByText("16.3%")).toBeVisible();
 expect(screen.queryByText("763.1")).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Billions of yen"}));
 expect(screen.getByText("763.1")).toBeVisible();
});
it("keeps bandwidth separate from latency when choosing a cloud mode",()=>{
 render(<CloudFigures/>);
 fireEvent.click(screen.getByRole("button",{name:"4K, 120 frames per second, 45 megabits per second"}));
 expect(screen.getByText(/3840 × 2160/)).toBeVisible();
 expect(screen.getByText("<80",{exact:false})).toBeVisible();
 expect(screen.getByText(/not a current user count/)).toBeVisible();
});
it("connects each layer selection to the relevant offer and measurement question",()=>{
 render(<BusinessMap/>);
 fireEvent.click(screen.getByRole("button",{name:"Equip & render"}));
 expect(screen.getByRole("heading",{name:"Buying the game does not supply the computer."})).toBeVisible();
 expect(screen.getByText(/Capacity, queues and cost per streamed hour/)).toBeVisible();
 fireEvent.click(screen.getByRole("button",{name:"Own & license"}));
 expect(screen.getByRole("heading",{name:"Who owns what the game uses?"})).toBeVisible();
});
