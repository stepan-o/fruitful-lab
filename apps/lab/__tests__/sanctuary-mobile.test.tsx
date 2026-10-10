import {fireEvent,render,screen,within} from "@testing-library/react";
import AcquiredWorlds,{FreemiumOffer,KingOwnership} from "@/components/sanctuary/AcquiredWorlds";
import {sanctuaryMedia} from "@/lib/sanctuary/media";
import {chapters,sources} from "@/lib/sanctuary/content";
import {chapterVisualSources} from "@/lib/sanctuary/visual-sources";
import {portfolio} from "@/lib/sanctuary/acquired-portfolio";

it("opens with attributed promotional art and mounts just the requested gameplay image",()=>{
 render(<AcquiredWorlds assets={sanctuaryMedia}/>);
 for(const game of portfolio){
  expect(screen.getByRole("img",{name:game.alt})).toBeVisible();
  expect(screen.queryByRole("img",{name:game.playAlt})).not.toBeInTheDocument();
 }
 const cards=screen.getAllByRole("article");
 fireEvent.click(within(cards[2]).getByRole("button",{name:/See how it plays/}));
 expect(screen.getByRole("img",{name:portfolio[2].playAlt})).toHaveAttribute("loading","lazy");
 fireEvent.click(within(cards[0]).getByRole("button",{name:/See how it plays/}));
 expect(screen.queryByRole("img",{name:portfolio[2].playAlt})).not.toBeInTheDocument();
 expect(screen.getByRole("img",{name:portfolio[0].playAlt})).toBeVisible();
 expect(screen.getByText(/Original Call of Duty: Infinity Ward/)).toBeVisible();
 expect(screen.getByText(/Original Diablo: Blizzard North/)).toBeVisible();
});
it("keeps unpaid play available when inspecting optional assistance",()=>{
 render(<FreemiumOffer assets={sanctuaryMedia}/>);
 const free=screen.getByRole("button",{name:"Keep playing free"});
 expect(free).toHaveAttribute("aria-pressed","true");
 fireEvent.click(screen.getByRole("button",{name:"Buy assistance"}));
 expect(screen.getByRole("img",{name:/An optional purchase supplies/})).toBeVisible();
 fireEvent.click(free);
 expect(screen.getByText(/An unpaid player can progress/)).toBeVisible();
});
it("places King before Valve and resolves the embedded art and evidence",()=>{
 expect(chapters.slice(0,5).map(c=>c.id)).toEqual(["insert-coin","studio-to-screen","three-ecosystems","mobile-freemium","valve-platform"]);
 for(const id of ["studio-to-screen","three-ecosystems","mobile-freemium"]){
  const chapter=chapters.find(c=>c.id===id)!;
  const credits=chapterVisualSources(chapter);
  for(const asset of chapter.embeddedAssets??[]){
   expect(sanctuaryMedia.assets[asset]).toBeDefined();
   expect(credits.some(credit=>credit.id===asset)).toBe(true);
  }
  for(const source of Object.values(chapter.paragraphCitations??{}).flat()) expect(sources.some(s=>s.id===source)).toBe(true);
 }
 render(<KingOwnership assets={sanctuaryMedia}/>);
 expect(screen.getByRole("heading",{name:"King made the game. Two deals changed its parent."})).toBeVisible();
 expect(screen.getAllByRole("listitem")).toHaveLength(3);
});
