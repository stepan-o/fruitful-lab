import { act, render } from "@testing-library/react";
import Hearth from "@/components/sanctuary/Hearth";
import { createHearth } from "@/components/sanctuary/hearth-renderer";

jest.mock("@/components/sanctuary/hearth-renderer", () => ({createHearth: jest.fn()}));
const create = jest.mocked(createHearth);
const renderer = {draw: jest.fn(), resize: jest.fn(), clear: jest.fn(), dispose: jest.fn()};
let hidden = false;
let reduced = false;
let motionChange: (() => void) | undefined;
let pending: Map<number, FrameRequestCallback>;
let frameId = 0;
beforeEach(() => {
  jest.clearAllMocks();
  hidden = false;
  reduced = false;
  pending = new Map();
  create.mockReturnValue(renderer);
  Object.defineProperty(document, "hidden", {configurable: true, get: () => hidden});
  Object.defineProperty(window, "matchMedia", {writable:true, value: () => ({
    get matches() { return reduced; },
    addEventListener: (_: string, listener: () => void) => { motionChange = listener; },
    removeEventListener: () => { motionChange = undefined; },
  })});
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
    pending.set(++frameId, callback); return frameId;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => {pending.delete(id);});
  jest.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue({width:1440,height:440} as DOMRect);
});
afterEach(() => {jest.restoreAllMocks();});

it("allocates only when motion is allowed and bounds the rendering surface", () => {
  reduced = true;
  const {rerender, unmount} = render(<Hearth enabled/>);
  expect(create).not.toHaveBeenCalled();
  act(() => { reduced = false; motionChange?.(); });
  expect(create).toHaveBeenCalledTimes(1);
  const [width, height] = renderer.resize.mock.calls[0];
  expect(width).toBeLessThanOrEqual(960);
  expect(height).toBeLessThanOrEqual(256);
  expect(pending.size).toBe(1);
  act(() => {hidden = true; document.dispatchEvent(new Event("visibilitychange"));});
  expect(pending.size).toBe(0);
  expect(renderer.clear).toHaveBeenCalled();
  act(() => {hidden = false; document.dispatchEvent(new Event("visibilitychange"));});
  expect(pending.size).toBe(1);
  act(() => {reduced = true; motionChange?.();});
  expect(pending.size).toBe(0);
  rerender(<Hearth enabled={false}/>);
  expect(renderer.dispose).toHaveBeenCalledTimes(1);
  unmount();
  expect(pending.size).toBe(0);
});

it("recovers from context loss and leaves no animation loop without WebGL", () => {
  const {container, unmount} = render(<Hearth enabled/>);
  const canvas = container.querySelector("canvas")!;
  act(() => {canvas.dispatchEvent(new Event("webglcontextlost", {cancelable:true}));});
  expect(pending.size).toBe(0);
  act(() => {canvas.dispatchEvent(new Event("webglcontextrestored"));});
  expect(create).toHaveBeenCalledTimes(2);
  expect(pending.size).toBe(1);
  unmount();
  expect(renderer.dispose).toHaveBeenCalledTimes(1);
  expect(pending.size).toBe(0);
  create.mockReturnValue(null);
  const fallback = render(<Hearth enabled/>);
  expect(pending.size).toBe(0);
  fallback.unmount();
});
