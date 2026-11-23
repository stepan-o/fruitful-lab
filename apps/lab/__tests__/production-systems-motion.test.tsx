import { act, fireEvent, render, screen } from "@testing-library/react";
import ProfileMotion, { profileMotionKey } from "@/components/production-systems/ProfileMotion";

let intersection: IntersectionObserverCallback;
let reduced = false;
let hidden = false;
let motionChange: (() => void) | undefined;
const disconnect = jest.fn();

beforeEach(() => {
  localStorage.removeItem(profileMotionKey);
  reduced = hidden = false;
  disconnect.mockClear();
  Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({
    get matches() { return reduced; },
    addEventListener: (_: string, listener: () => void) => { motionChange = listener; },
    removeEventListener: () => { motionChange = undefined; },
  }) });
  Object.defineProperty(window, "IntersectionObserver", { configurable: true, writable: true, value: jest.fn((callback: IntersectionObserverCallback) => {
    intersection = callback;
    return { observe: jest.fn(), disconnect };
  }) });
});

function visible(target: Element, show = true) {
  act(() => intersection([{ target, isIntersecting: show } as IntersectionObserverEntry], {} as IntersectionObserver));
}
function page() {
  return render(<ProfileMotion><figure data-engraving="one" data-playing="false" /><figure data-engraving="two" data-playing="false" /></ProfileMotion>);
}

it("runs only visible scenes and suspends all motion while hidden or reduced", () => {
  const { container, unmount } = page();
  const [one, two] = container.querySelectorAll("figure");
  expect(one).toHaveAttribute("data-playing", "false");
  visible(one);
  expect(one).toHaveAttribute("data-playing", "true");
  expect(two).toHaveAttribute("data-playing", "false");
  act(() => { hidden = true; document.dispatchEvent(new Event("visibilitychange")); });
  expect(one).toHaveAttribute("data-playing", "false");
  act(() => { hidden = false; document.dispatchEvent(new Event("visibilitychange")); });
  expect(one).toHaveAttribute("data-playing", "true");
  act(() => { reduced = true; motionChange?.(); });
  expect(one).toHaveAttribute("data-playing", "false");
  act(() => { reduced = false; motionChange?.(); });
  expect(one).toHaveAttribute("data-playing", "true");
  visible(one, false);
  expect(one).toHaveAttribute("data-playing", "false");
  unmount();
  expect(disconnect).toHaveBeenCalled();
  expect(motionChange).toBeUndefined();
});

it("persists a manual pause across remount and resumes only visible scenes", () => {
  const first = page();
  visible(first.container.querySelector("figure")!);
  fireEvent.click(screen.getByRole("button", { name: "Pause illustrations" }));
  expect(localStorage.getItem(profileMotionKey)).toBe("off");
  expect(screen.getByRole("button", { name: "Play illustrations" })).toHaveAttribute("aria-pressed", "true");
  visible(first.container.querySelector("figure")!);
  expect(first.container.querySelector("figure")).toHaveAttribute("data-playing", "false");
  first.unmount();
  const second = page();
  visible(second.container.querySelector("figure")!);
  expect(second.container.querySelector("figure")).toHaveAttribute("data-playing", "false");
  fireEvent.click(screen.getByRole("button", { name: "Play illustrations" }));
  visible(second.container.querySelector("figure")!);
  expect(second.container.querySelector("figure")).toHaveAttribute("data-playing", "true");
});
