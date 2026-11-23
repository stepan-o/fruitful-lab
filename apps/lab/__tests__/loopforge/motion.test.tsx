import { act, render, cleanup } from "@testing-library/react";
import Conveyor from "@/components/loopforge/Conveyor";
import { writePreference, motionKey } from "@/lib/stepanoskin/preferences";
let notify: IntersectionObserverCallback;
let reduced = false;
let change: () => void;
const disconnect = jest.fn();
beforeEach(() => {
  window.localStorage.clear();
  reduced = false;
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_name: string, listener: () => void) => {
        change = listener;
      },
      removeEventListener: jest.fn(),
    }),
  });
  global.IntersectionObserver = class {
    constructor(callback: IntersectionObserverCallback) {
      notify = callback;
    }
    observe() {}
    disconnect = disconnect;
  } as unknown as typeof IntersectionObserver;
});
afterEach(cleanup);
test("conveyor suspends offscreen, for reduced motion, on preference change and on disposal", () => {
  const { container, unmount } = render(<Conveyor />);
  const belt = container.firstChild as HTMLElement;
  expect(belt.dataset.running).toBe("false");
  act(() =>
    notify(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    ),
  );
  expect(belt.dataset.running).toBe("true");
  act(() => {
    reduced = true;
    change();
  });
  expect(belt.dataset.running).toBe("false");
  act(() => {
    reduced = false;
    change();
  });
  expect(belt.dataset.running).toBe("true");
  act(() =>
    notify(
      [{ isIntersecting: false }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    ),
  );
  expect(belt.dataset.running).toBe("false");
  act(() => writePreference(motionKey, false));
  act(() =>
    notify(
      [{ isIntersecting: true }] as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    ),
  );
  expect(belt.dataset.running).toBe("false");
  unmount();
  expect(disconnect).toHaveBeenCalled();
});
