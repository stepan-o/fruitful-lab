import {fireEvent,render,screen} from "@testing-library/react";
import {HistoryComparison} from "@/components/sanctuary/DiabloHistory";
import CompanyEvolution from "@/components/sanctuary/CompanyEvolution";
import {chapters} from "@/lib/sanctuary/content";

describe("The rebuilt historical argument",()=>{
 it("keeps the approved opening, company sequence and contiguous Diablo history",()=>{
  expect(chapters.slice(0,6).map(c=>c.id)).toEqual(["insert-coin","studio-to-screen","valve-platform","epic-infrastructure","rockstar-world","the-fork"]);
  const start=chapters.findIndex(c=>c.id==="several-histories");
  expect(chapters.slice(start,start+5).map(c=>c.id)).toEqual(["several-histories","diablo-second-life","diablo-market","diablo-service","how-many-lives"]);
  expect(chapters.slice(-2).map(c=>c.id)).toEqual(["what-decides","does-it-work"]);
  const parts=chapters.map(c=>c.part);expect(parts).toEqual([...parts].sort((a,b)=>a-b));
 });
 it("changes the comparison lens without losing the historical subjects",()=>{
  render(<HistoryComparison chapter="diablo-second-life"/>);
  expect(screen.getByText("An ending is not exhaustion")).toBeVisible();
  fireEvent.click(screen.getByRole("button",{name:"The next payment"}));
  expect(screen.getByRole("button",{name:"The next payment"})).toHaveAttribute("aria-pressed","true");
  expect(screen.getByText("A box, then an expansion")).toBeVisible();
  expect(screen.queryByText("An ending is not exhaustion")).not.toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(4);
  expect(screen.getByText("This chapter").closest("li")).toHaveTextContent("Diablo II");
 });
 it("keeps the Valve catalog with the developer and shows a handheld for the equipment role",()=>{
  render(<CompanyEvolution chapter="valve-platform"/>);
  fireEvent.click(screen.getByText("Explore games bearing Valve’s developer credit"));
  expect(screen.getByRole("link",{name:"Half-Life"})).toBeVisible();
  expect(screen.getByRole("link",{name:/Counter-Strike 2/})).toBeVisible();
  fireEvent.click(screen.getByRole("button",{name:/Equipment supplier/}));
  expect(screen.queryByText("Explore games bearing Valve’s developer credit")).not.toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Valve’s device/})).toHaveAttribute("href","https://www.steamdeck.com/en/");
  expect(screen.getByRole("button",{name:/Equipment supplier/})).toHaveAttribute("aria-pressed","true");
 });
});
