import { act, fireEvent, render, screen } from "@testing-library/react";
import ConveyorPace from "@/components/production-systems/ConveyorPace";

let reduced = false;
const listeners = new Set<() => void>();
const printListeners = new Set<() => void>();
const getAnimations = jest.fn();

beforeEach(() => {
  reduced = false;
  listeners.clear();
  printListeners.clear();
  getAnimations.mockReset();
  Object.defineProperty(window, "matchMedia", { configurable: true, value: (query: string) => ({
    get matches() { return reduced; },
    addEventListener: (_: string, callback: () => void) => (query === "print" ? printListeners : listeners).add(callback),
    removeEventListener: (_: string, callback: () => void) => (query === "print" ? printListeners : listeners).delete(callback),
  }) });
  Object.defineProperty(Element.prototype, "getAnimations", { configurable: true, value: getAnimations });
  jest.spyOn(window, "requestAnimationFrame").mockImplementation(callback => { callback(0); return 1; });
  jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

function wheel() {
  return { updatePlaybackRate: jest.fn(), currentTime: 1700, playState: "paused", play: jest.fn() };
}

it("starts at Medium and changes every part's rate without seeking or unpausing", () => {
  const parts = [wheel(), wheel(), wheel()];
  getAnimations.mockReturnValue(parts);
  render(<figure data-engraving="conveyor"><ConveyorPace /></figure>);
  expect(screen.getByRole("radio", { name: "Medium" })).toBeChecked();
  parts.forEach(part => expect(part.updatePlaybackRate).toHaveBeenLastCalledWith(1.1));
  fireEvent.click(screen.getByRole("radio", { name: "Fast" }));
  parts.forEach(part => {
    expect(part.updatePlaybackRate).toHaveBeenLastCalledWith(3);
    expect(part.currentTime).toBe(1700);
    expect(part.playState).toBe("paused");
    expect(part.play).not.toHaveBeenCalled();
  });
  fireEvent.click(screen.getByRole("radio", { name: "Slow" }));
  parts.forEach(part => expect(part.updatePlaybackRate).toHaveBeenLastCalledWith(.55));
});

it("disables motion controls for reduced motion and reapplies the chosen pace to recreated animations", () => {
  getAnimations.mockReturnValue([wheel()]);
  const { unmount } = render(<figure data-engraving="conveyor"><ConveyorPace /></figure>);
  fireEvent.click(screen.getByRole("radio", { name: "Slow" }));
  getAnimations.mockReturnValue([]);
  act(() => { reduced = true; listeners.forEach(notify => notify()); });
  expect(screen.getByRole("radio", { name: "Slow" })).toBeDisabled();
  const recreated = wheel();
  getAnimations.mockReturnValue([recreated]);
  act(() => { reduced = false; listeners.forEach(notify => notify()); });
  expect(screen.getByRole("radio", { name: "Slow" })).toBeEnabled();
  expect(recreated.updatePlaybackRate).toHaveBeenCalledWith(.55);
  unmount();
  expect(listeners.size).toBe(0);
});

it("connects the pace explanation to the statistical sources without claiming to simulate accuracy", () => {
  getAnimations.mockReturnValue([]);
  render(<figure data-engraving="conveyor"><ConveyorPace /></figure>);
  fireEvent.click(screen.getByText("i", { selector: "summary" }));
  expect(screen.getByRole("link", { name: /Sample size/ })).toHaveAttribute("href", "#source-pace");
  expect(screen.getByRole("link", { name: /False-discovery/ })).toHaveAttribute("href", "#source-fdr");
  expect(screen.getByText(/example results stay fixed/)).toBeVisible();
});


it("restores the selected rate when returning from a print layout that removed animations", () => {
  getAnimations.mockReturnValue([wheel()]);
  const { unmount } = render(<figure data-engraving="conveyor"><ConveyorPace /></figure>);
  fireEvent.click(screen.getByRole("radio", { name: "Slow" }));
  getAnimations.mockReturnValue([]);
  act(() => printListeners.forEach(notify => notify()));
  const recreated = wheel();
  getAnimations.mockReturnValue([recreated]);
  act(() => printListeners.forEach(notify => notify()));
  expect(recreated.updatePlaybackRate).toHaveBeenCalledWith(.55);
  expect(recreated.play).not.toHaveBeenCalled();
  unmount();
  expect(printListeners.size).toBe(0);
});
