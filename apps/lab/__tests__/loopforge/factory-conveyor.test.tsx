import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FactoryConveyor from "@/components/loopforge/FactoryConveyor";
import { createFactoryRenderer } from "@/components/loopforge/factory-renderer";
import { playClang } from "@/lib/stepanoskin/audio";

jest.mock("@/components/loopforge/factory-renderer",()=>({createFactoryRenderer:jest.fn()}));
jest.mock("@/lib/stepanoskin/audio",()=>({playClang:jest.fn()}));
const draw=jest.fn(),dispose=jest.fn();
let notify: IntersectionObserverCallback,mediaChange:()=>void;
let reduced=false,hidden=false,now=1000,id=0;
const frames=new Map<number,FrameRequestCallback>();
async function intersect(visible: boolean) {
  await act(async()=>{});
  act(()=>notify([{isIntersecting:visible}] as IntersectionObserverEntry[],{} as IntersectionObserver));
}
function advance(seconds: number) {
  act(()=>{for(let i=0;i<Math.ceil(seconds*25);i++) {now+=40; const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(now));}});
}
beforeEach(()=>{
  jest.clearAllMocks(); window.localStorage.clear(); frames.clear(); now=1000; reduced=false;hidden=false;
  jest.mocked(createFactoryRenderer).mockReturnValue({draw,dispose,resize:jest.fn(),ready:Promise.resolve(true)});
  jest.spyOn(window,"requestAnimationFrame").mockImplementation(fn=>{frames.set(++id,fn);return id;});
  jest.spyOn(window,"cancelAnimationFrame").mockImplementation(key=>{frames.delete(key);});
  Object.defineProperty(document,"hidden",{configurable:true,get:()=>hidden});
  Object.defineProperty(window,"matchMedia",{writable:true,value:()=>({get matches(){return reduced;},addEventListener:(_name:string,fn:()=>void)=>{mediaChange=fn;},removeEventListener:jest.fn()})});
  global.IntersectionObserver=class {constructor(fn:IntersectionObserverCallback){notify=fn;}observe(){}disconnect(){}} as unknown as typeof IntersectionObserver;
  global.ResizeObserver=class {observe(){}disconnect(){}} as unknown as typeof ResizeObserver;
});
afterEach(()=>{cleanup();jest.restoreAllMocks();});

test("jam is announced and keyboard activation restarts the line without repeated reset sounds",async()=>{
  const user=userEvent.setup();render(<FactoryConveyor/>);await intersect(true);advance(2.9);
  expect(screen.getByRole("status")).toHaveTextContent("PRODUCTION IN PROGRESS");
  advance(.2);
  expect(screen.getByRole("status")).toHaveTextContent("LINE JAMMED");
  const resetButton=screen.getByRole("button",{name:"Restart conveyor"});
  resetButton.focus(); await user.keyboard("{Enter}");
  expect(screen.getByRole("status")).toHaveTextContent("DRIVE ENGAGING");
  expect(playClang).toHaveBeenCalledTimes(1);
  await user.keyboard("{Enter}");expect(playClang).toHaveBeenCalledTimes(1);
  advance(2);expect(screen.getByRole("status")).toHaveTextContent("PRODUCTION IN PROGRESS");
});

test("hidden, offscreen and reduced-motion states cancel frame work, and pause persists",async()=>{
  const {unmount}=render(<FactoryConveyor/>);
  expect(frames.size).toBe(0);await intersect(true);advance(1);expect(frames.size).toBe(1);
  await intersect(false);const count=draw.mock.calls.length;advance(40);
  expect(draw).toHaveBeenCalledTimes(count);expect(frames.size).toBe(0);
  await intersect(true);act(()=>{hidden=true;document.dispatchEvent(new Event("visibilitychange"));});expect(frames.size).toBe(0);
  act(()=>{hidden=false;document.dispatchEvent(new Event("visibilitychange"));});expect(frames.size).toBe(1);
  act(()=>{reduced=true;mediaChange();});expect(frames.size).toBe(0);expect(screen.getByRole("button",{name:"Pause factory motion"})).toBeDisabled();
  act(()=>{reduced=false;mediaChange();});expect(frames.size).toBe(1);
  fireEvent.click(screen.getByRole("button",{name:"Pause factory motion"}));await intersect(true);
  expect(frames.size).toBe(0);expect(localStorage.getItem("stepanoskin_motion_v1")).toBe("off");
  advance(50);expect(screen.getByRole("status")).toHaveTextContent("LINE AT REST");
  fireEvent.click(screen.getByRole("button",{name:"Resume factory motion"}));await intersect(true);advance(1);
  expect(screen.getByRole("status")).toHaveTextContent("PRODUCTION IN PROGRESS");
  unmount();expect(frames.size).toBe(0);expect(dispose).toHaveBeenCalled();
});

test("the static fallback remains meaningful when canvas is unavailable",()=>{
  jest.mocked(createFactoryRenderer).mockReturnValue(null);const {container}=render(<FactoryConveyor/>);
  expect(container.querySelector('section')).toHaveAttribute("data-ready","false");
  expect(screen.getByRole("status")).toHaveTextContent("LINE AT REST");expect(frames.size).toBe(0);
});

test("the menu reset owns its hint and retains the renderer through pause and resume", async()=>{
  const dock=document.createElement("div");document.body.append(dock);
  const {unmount}=render(<FactoryConveyor controlTarget={dock}/>);
  await intersect(true);advance(3.1);
  const resetButton=screen.getByRole("button",{name:"Restart conveyor"});
  expect(dock).toContainElement(resetButton);
  expect(resetButton).toHaveAccessibleDescription("Press RESET to restart.");
  expect(dock).toContainElement(screen.getByText("Press RESET to restart."));
  const user=userEvent.setup();resetButton.focus();await user.keyboard(" ");
  expect(screen.getByRole("status")).toHaveTextContent("DRIVE ENGAGING");
  fireEvent.click(screen.getByRole("button",{name:"Pause factory motion"}));
  fireEvent.click(screen.getByRole("button",{name:"Resume factory motion"}));
  expect(createFactoryRenderer).toHaveBeenCalledTimes(1);
  unmount();dock.remove();
});

test("a single touch press resets a jam; pressing during production does nothing",async()=>{
  const user=userEvent.setup();render(<FactoryConveyor/>);await intersect(true);
  const button=screen.getByRole("button",{name:"Restart conveyor"});
  await user.pointer([{keys:"[TouchA>]",target:button},{keys:"[/TouchA]",target:button}]);
  expect(playClang).not.toHaveBeenCalled();
  advance(3.1);
  expect(button).toHaveAttribute("aria-disabled","false");
  await user.pointer([{keys:"[TouchA>]",target:button},{keys:"[/TouchA]",target:button}]);
  expect(screen.getByRole("status")).toHaveTextContent("DRIVE ENGAGING");
  expect(playClang).toHaveBeenCalledTimes(1);
  expect(button).toHaveAttribute("aria-disabled","true");
  advance(5);
  expect(screen.getByRole("status")).toHaveTextContent("PRODUCTION IN PROGRESS");
});

test("the first-jam countdown waits for artwork and suspends while hidden",async()=>{
  let resolve!:(ok:boolean)=>void;const ready=new Promise<boolean>(done=>{resolve=done;});
  jest.mocked(createFactoryRenderer).mockReturnValue({draw,dispose,resize:jest.fn(),ready});
  render(<FactoryConveyor/>);await intersect(true);advance(20);
  expect(screen.getByRole("status")).toHaveTextContent("LINE AT REST");
  await act(async()=>resolve(true));advance(2);
  act(()=>{hidden=true;document.dispatchEvent(new Event("visibilitychange"));});
  advance(20);
  expect(screen.getByRole("status")).toHaveTextContent("PRODUCTION IN PROGRESS");
  act(()=>{hidden=false;document.dispatchEvent(new Event("visibilitychange"));});
  advance(.9);
  expect(screen.getByRole("status")).toHaveTextContent("PRODUCTION IN PROGRESS");
  advance(.3);
  expect(screen.getByRole("status")).toHaveTextContent("LINE JAMMED");
});

// Artwork is an asynchronous prerequisite: a failed or abandoned load must
// not start a hidden animation loop or hide the readable static fallback.
test("failed artwork leaves the still visible and drive inactive",async()=>{
  jest.mocked(createFactoryRenderer).mockReturnValue({draw,dispose,resize:jest.fn(),ready:Promise.resolve(false)});
  const {container}=render(<FactoryConveyor/>);await intersect(true);advance(30);
  expect(container.querySelector('section')).toHaveAttribute("data-ready","false");
  expect(frames.size).toBe(0);expect(screen.getByRole("status")).toHaveTextContent("LINE AT REST");
});
test("a late artwork load cannot resume an unmounted scene",async()=>{
  let resolve!:(ok:boolean)=>void;const ready=new Promise<boolean>(done=>{resolve=done;});
  jest.mocked(createFactoryRenderer).mockReturnValue({draw,dispose,resize:jest.fn(),ready});
  const {unmount}=render(<FactoryConveyor/>);await intersect(true);unmount();
  await act(async()=>resolve(true));expect(frames.size).toBe(0);expect(dispose).toHaveBeenCalledTimes(1);
});
