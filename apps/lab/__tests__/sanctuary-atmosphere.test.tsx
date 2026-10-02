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
let intersection: IntersectionObserverCallback;
const observe = jest.fn();
const disconnect = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  hidden = false;
  reduced = false;
  pending = new Map();
  create.mockReturnValue(renderer);
  Object.defineProperty(window, "IntersectionObserver", {configurable: true, writable: true, value:
    jest.fn((callback: IntersectionObserverCallback) => {
      intersection = callback;
      return {observe, disconnect};
    }),
  });
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

function tick(time: number) {
  act(() => {
    const callbacks = [...pending.values()];
    pending.clear();
    callbacks.forEach(callback => callback(time));
  });
}

function showEnd(ratio: number) {
  act(() => intersection([
    {isIntersecting: ratio > 0, intersectionRatio: ratio} as IntersectionObserverEntry,
  ], {} as IntersectionObserver));
}

it("reveals fire only at the full page end, hides it on leaving, and cleans up observation", () => {
  const {unmount} = render(<Hearth enabled/>);
  expect(observe).toHaveBeenCalledTimes(1);
  tick(100);
  expect(renderer.draw).toHaveBeenLastCalledWith(expect.any(Number), 0);
  // A visible footer or a partly visible final pixel is not the page bottom.
  showEnd(.5);
  tick(180);
  expect(renderer.draw).toHaveBeenLastCalledWith(expect.any(Number), 0);
  showEnd(1);
  for (let time = 260; time <= 980; time += 80) tick(time);
  expect(renderer.draw).toHaveBeenLastCalledWith(expect.any(Number), 1);
  // Scrolling upward or expanding evidence moves the end out of view.
  showEnd(0);
  tick(1060);
  expect(renderer.draw).toHaveBeenLastCalledWith(expect.any(Number), 0);
  showEnd(1);
  tick(1140);
  const strength = renderer.draw.mock.calls.at(-1)![1];
  expect(strength).toBeGreaterThan(0);
  expect(strength).toBeLessThan(1);
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(pending.size).toBe(0);
});

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
