import { act, render } from "@testing-library/react";
import ForkPlate from "@/components/sanctuary/plates/ForkPlate";
import { createForkWorld } from "@/components/sanctuary/plates/fork-world";
import { motionKey, writePreference } from "@/lib/stepanoskin/preferences";

jest.mock("@/components/sanctuary/plates/fork-world", () => ({ createForkWorld: jest.fn() }));
const create = jest.mocked(createForkWorld);
const draw = jest.fn();
let intersection: IntersectionObserverCallback;
let hidden = false;
let reduced = false;
let motionChange: (() => void) | undefined;
let pending: Map<number, FrameRequestCallback>;
let frameId = 0;
const disconnect = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  hidden = reduced = false;
  pending = new Map();
  localStorage.removeItem(motionKey);
  create.mockReturnValue({ draw });
  Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
  Object.defineProperty(window, "matchMedia", { configurable: true, writable: true, value: () => ({
    get matches() { return reduced; },
    addEventListener: (_: string, listener: () => void) => { motionChange = listener; },
    removeEventListener: () => { motionChange = undefined; },
  }) });
  Object.defineProperty(window, "IntersectionObserver", { configurable: true, writable: true,
    value: jest.fn((callback: IntersectionObserverCallback) => {
      intersection = callback;
      return { observe: jest.fn(), disconnect };
    }),
  });
  Object.defineProperty(window, "ResizeObserver", { configurable: true, writable: true,
    value: jest.fn(() => ({ observe: jest.fn(), disconnect })),
  });
  jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({ width: 1500 } as DOMRect);
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
    pending.set(++frameId, callback);
    return frameId;
  });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(id => { pending.delete(id); });
});
afterEach(() => { jest.restoreAllMocks(); localStorage.removeItem(motionKey); });

function show(visible: boolean) {
  act(() => intersection([{ isIntersecting: visible, intersectionRatio: visible ? 1 : 0 } as IntersectionObserverEntry], {} as IntersectionObserver));
}
function tick(time: number) {
  act(() => {
    const callbacks = [...pending.values()];
    pending.clear();
    callbacks.forEach(callback => callback(time));
  });
}

it("allocates on visibility, caps resolution and frame rate, and stops offscreen or hidden", () => {
  const { container, unmount } = render(<ForkPlate label="Opening landscape" />);
  expect(create).not.toHaveBeenCalled();
  expect(pending.size).toBe(0);
  show(true);
  const canvas = container.querySelector("canvas")!;
  expect(canvas.width).toBeLessThanOrEqual(960);
  expect(canvas.height).toBeLessThanOrEqual(566);
  expect(pending.size).toBe(1);
  draw.mockClear();
  tick(100);
  tick(116);
  tick(132);
  expect(draw).toHaveBeenCalledTimes(1);
  tick(150);
  expect(draw).toHaveBeenCalledTimes(2);
  show(false);
  expect(pending.size).toBe(0);
  show(true);
  expect(create).toHaveBeenCalledTimes(1);
  act(() => { hidden = true; document.dispatchEvent(new Event("visibilitychange")); });
  expect(pending.size).toBe(0);
  act(() => { hidden = false; document.dispatchEvent(new Event("visibilitychange")); });
  expect(pending.size).toBe(1);
  unmount();
  expect(pending.size).toBe(0);
  expect(disconnect).toHaveBeenCalledTimes(2);
});

it("keeps a still image for reduced motion, the reader switch, and the covered plate", () => {
  const { rerender } = render(<ForkPlate label="Opening landscape" />);
  show(true);
  act(() => { reduced = true; motionChange?.(); });
  expect(pending.size).toBe(0);
  act(() => { reduced = false; motionChange?.(); });
  expect(pending.size).toBe(1);
  act(() => { writePreference(motionKey, false); });
  show(true);
  expect(pending.size).toBe(0);
  expect(draw).toHaveBeenCalled();
  act(() => { writePreference(motionKey, true); });
  show(true);
  expect(pending.size).toBe(1);
  rerender(<ForkPlate label="Opening landscape" paused />);
  show(true);
  expect(pending.size).toBe(0);
});
