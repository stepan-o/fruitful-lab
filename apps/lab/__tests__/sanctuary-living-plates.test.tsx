import { act, fireEvent, render, screen } from "@testing-library/react";
import { useLivingPlate } from "@/components/sanctuary/plates/useLivingPlate";
import CatalogCovers from "@/components/sanctuary/plates/CatalogCovers";
import { motionKey, writePreference } from "@/lib/stepanoskin/preferences";

let intersect: IntersectionObserverCallback;
let reduceChanged: () => void;
let reduced = false;
const disconnect = jest.fn();
const removeMedia = jest.fn();
function Plate() { const ref=useLivingPlate<HTMLDivElement>(); return <div ref={ref} data-testid="plate"/>; }
const visible=(value:boolean)=>act(()=>intersect([{isIntersecting:value} as IntersectionObserverEntry],{} as IntersectionObserver));
beforeEach(()=>{
  window.localStorage.clear(); reduced=false; disconnect.mockClear(); removeMedia.mockClear();
  Object.defineProperty(document,"hidden",{configurable:true,value:false});
  Object.defineProperty(window,"IntersectionObserver",{configurable:true,writable:true,value:jest.fn((callback:IntersectionObserverCallback)=>{intersect=callback;return {observe:jest.fn(),disconnect};})});
  Object.defineProperty(window,"matchMedia",{configurable:true,writable:true,value:()=>({get matches(){return reduced;},addEventListener:(_event:string,callback:()=>void)=>{reduceChanged=callback;},removeEventListener:removeMedia})});
  HTMLDialogElement.prototype.showModal=function(){this.setAttribute("open","");};
  HTMLDialogElement.prototype.close=function(){this.removeAttribute("open");this.dispatchEvent(new Event("close"));};
});

test("illustration motion stops offscreen, in a hidden tab, and for reduced motion",()=>{
  const {unmount}=render(<Plate/>); const plate=screen.getByTestId("plate");
  expect(plate).toHaveAttribute("data-playing","false");
  visible(true); expect(plate).toHaveAttribute("data-playing","true");
  visible(false); expect(plate).toHaveAttribute("data-playing","false");
  visible(true);
  act(()=>{Object.defineProperty(document,"hidden",{configurable:true,value:true});document.dispatchEvent(new Event("visibilitychange"));});
  expect(plate).toHaveAttribute("data-playing","false");
  act(()=>{Object.defineProperty(document,"hidden",{configurable:true,value:false});document.dispatchEvent(new Event("visibilitychange"));});
  expect(plate).toHaveAttribute("data-playing","true");
  act(()=>{reduced=true;reduceChanged();}); expect(plate).toHaveAttribute("data-playing","false");
  unmount(); expect(disconnect).toHaveBeenCalled(); expect(removeMedia).toHaveBeenCalledWith("change",expect.any(Function));
});
test("the global motion switch also controls the new plates",()=>{
  render(<Plate/>); visible(true);
  act(()=>writePreference(motionKey,false)); visible(true);
  expect(screen.getByTestId("plate")).toHaveAttribute("data-playing","false");
  act(()=>writePreference(motionKey,true)); visible(true);
  expect(screen.getByTestId("plate")).toHaveAttribute("data-playing","true");
});
test("each cover opens its own cited artwork and supports native cancellation",()=>{
  render(<CatalogCovers/>);
  for(const title of ["Stranger Returns","Renew’s Day","One More Round"]){
    fireEvent.click(screen.getByRole("button",{name:`Explore ${title}`}));
    const dialog=screen.getByRole("dialog",{name:title});
    expect(dialog).toBeVisible(); expect(dialog.querySelector("a")).toHaveAttribute("href",expect.stringContaining("https://www.netflix.com/tudum/"));
    fireEvent(dialog,new Event("cancel",{bubbles:false,cancelable:true})); expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  }
});
