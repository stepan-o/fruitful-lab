import { act, fireEvent, render, screen } from "@testing-library/react";
import { ConsoleSignals, useConsoleSignals } from "@/components/loopforge/first-shift/ConsoleSignals";
jest.mock("@/lib/stepanoskin/preferences", () => ({usePreference: () => [true, jest.fn()]}));
function Probe() {
  const signals=useConsoleSignals()!;
  return <><output>{signals.pulse ? `${signals.pulse.kind}:${signals.pulse.serial}` : "dark"}</output><button onClick={()=>signals.impulse("production")}>Production receipt</button></>;
}
beforeEach(()=>jest.useFakeTimers());
afterEach(()=>{jest.useRealTimers();jest.restoreAllMocks();});
it("sweeps during quiet observation, ignores pointer motion, and preserves dark time after production",()=>{
  render(<ConsoleSignals><Probe /></ConsoleSignals>);
  act(()=>jest.advanceTimersByTime(10000));
  fireEvent.pointerMove(window);
  act(()=>jest.advanceTimersByTime(2000));
  expect(screen.getByRole("status")).toHaveTextContent("idle:1");
  act(()=>jest.advanceTimersByTime(17000));
  fireEvent.click(screen.getByRole("button"));
  expect(screen.getByRole("status")).toHaveTextContent("production:2");
  act(()=>jest.advanceTimersByTime(5000));
  expect(screen.getByRole("status")).toHaveTextContent("production:2");
  act(()=>jest.advanceTimersByTime(2000));
  expect(screen.getByRole("status")).toHaveTextContent("idle:3");
});
it("does not catch up idle flashes after a hidden tab returns",()=>{
  const hidden=jest.spyOn(document,"hidden","get").mockReturnValue(false);
  render(<ConsoleSignals><Probe /></ConsoleSignals>);
  act(()=>jest.advanceTimersByTime(5000));
  hidden.mockReturnValue(true);fireEvent(document,new Event("visibilitychange"));
  act(()=>jest.advanceTimersByTime(120000));
  expect(screen.getByRole("status")).toHaveTextContent("dark");
  hidden.mockReturnValue(false);fireEvent(document,new Event("visibilitychange"));
  act(()=>jest.advanceTimersByTime(11000));
  expect(screen.getByRole("status")).toHaveTextContent("dark");
  act(()=>jest.advanceTimersByTime(1000));
  expect(screen.getByRole("status")).toHaveTextContent("idle:1");
});
