import {fireEvent,render,screen,within} from "@testing-library/react";
import AdviserSelection,{type AdviserCandidate} from "@/components/loopforge/first-shift/AdviserSelection";
import {firstShiftMedia} from "@/lib/loopforge/first-shift/media";
jest.mock("@/components/media/AssetImage",()=>({__esModule:true,default:()=> <span />}));
it("inspects and appoints any of five candidates without implicitly committing a preview",()=>{
 const candidates:AdviserCandidate[]=["limen","stiletto","cathexis","witch","thrum"].map(id=>({id,name:id.toUpperCase(),available:true,pitch:`Listen to ${id}`,priority:`Priority of ${id}`,gain:`Gain from ${id}`,cost:`Cost of ${id}`}));
 const appoint=jest.fn();render(<AdviserSelection media={firstShiftMedia()} candidates={candidates} onAppoint={appoint} onHelp={()=>{}} />);
 expect(within(screen.getByRole("group",{name:"Supervisor roster"})).getAllByRole("button")).toHaveLength(5);
 for(const p of candidates){fireEvent.click(screen.getByRole("button",{name:`Inspect ${p.name}`}));expect(screen.getByText(p.cost)).toBeVisible();}
 expect(appoint).not.toHaveBeenCalled();fireEvent.click(screen.getByRole("button",{name:"Appoint THRUM for today"}));expect(appoint).toHaveBeenCalledWith("thrum");
});
