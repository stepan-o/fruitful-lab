import { fireEvent, render, screen, within } from "@testing-library/react";
import FirstShift from "@/components/loopforge/first-shift/FirstShift";
import CommandDeck from "@/components/loopforge/first-shift/CommandDeck";
import { firstShiftMedia } from "@/lib/loopforge/first-shift/media";
import { initialState, step } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";
import { useRun } from "@/components/loopforge/first-shift/useRun";
import type { PlayerView } from "@/lib/loopforge/first-shift/contract";

jest.mock("@/components/loopforge/first-shift/useRun");
jest.mock("@/components/media/AssetImage", () => ({
  __esModule: true,
  default: () => <span aria-hidden="true" />,
}));
const media = firstShiftMedia();
const send = jest.fn().mockResolvedValue(true);
const props = (view: PlayerView) => ({
  media,
  view,
  busy: false,
  send,
  onRecords: jest.fn(),
  onRestart: jest.fn(),
});

beforeAll(() => {
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn().mockReturnValue({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
  global.IntersectionObserver = jest
    .fn()
    .mockImplementation(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
  HTMLDialogElement.prototype.close = jest.fn();
});
beforeEach(() => send.mockClear());

it("opens on unassigned factory facts and the adviser choice, without an arrival gate", () => {
  jest.mocked(useRun).mockReturnValue({
    view: project(initialState(7)),
    pending: false,
    error: "",
    send,
    recover: jest.fn(),
    restart: jest.fn(),
    download: jest.fn(),
  });
  render(<FirstShift media={media} />);
  expect(
    screen.getByRole("heading", { name: "Whom do you trust?" }),
  ).toBeVisible();
  expect(screen.getByText("No supervisor assigned")).toBeVisible();
  expect(screen.getByText("Due at the end of day 7")).toBeVisible();
  expect(
    screen.queryByRole("button", { name: /Report for/ }),
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Choose STILETTO" }));
  expect(send).toHaveBeenCalledWith({
    type: "choose_adviser",
    adviser: "stiletto",
  });
});

it("makes a placement override explicit and submits the reversed assignments", () => {
  const state = step(initialState(7), {
    type: "choose_adviser",
    adviser: "limen",
  });
  render(<CommandDeck {...props(project(state))} />);
  fireEvent.click(screen.getByRole("button", { name: "Swap assignments" }));
  expect(screen.getByText(/will object to being overruled/)).toBeVisible();
  expect(screen.getByText("Acts automatically here")).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Issue revised assignments" }),
  );
  expect(send).toHaveBeenCalledWith({
    type: "approve_plan",
    assignments: { conveyor: "stiletto", security: "limen" },
  });
});

it("labels following and overriding the adviser, and carries the chosen response to the server", () => {
  let state = step(initialState(7), {
    type: "choose_adviser",
    adviser: "limen",
  });
  state = step(state, {
    type: "approve_plan",
    assignments: state.briefing!.assignments,
  });
  state = step(state, { type: "start_shift" });
  while (state.phase === "running") state = step(state, { type: "advance" });
  render(<CommandDeck {...props(project(state))} />);
  expect(screen.getByText("Follow your adviser")).toBeVisible();
  expect(screen.getByText("Override LIMEN")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Issue override" }));
  expect(send).toHaveBeenCalledWith({
    type: "resolve_incident",
    incident: "clearance-mismatch",
    response: "wave",
  });
});

it("keeps dispatch as a local preview until a second, explicit irreversible commitment", () => {
  const view = {
    ...project(initialState(7)),
    phase: "allocation" as const,
    produced: 11,
  };
  render(<CommandDeck {...props(view)} />);
  fireEvent.click(screen.getByRole("button", { name: "Split output" }));
  fireEvent.click(
    screen.getByRole("button", { name: "Review dispatch order" }),
  );
  expect(send).not.toHaveBeenCalled();
  expect(screen.getByRole("slider")).toBeDisabled();
  const confirmation = screen.getByRole("group", {
    name: "Confirm permanent allocation",
  });
  expect(confirmation).toHaveTextContent("This cannot be undone.");
  fireEvent.click(
    within(confirmation).getByRole("button", { name: "Seal dispatch order" }),
  );
  expect(send).toHaveBeenCalledWith({ type: "commit_output", retain: 5 });
});

it("keeps confirmed facts visible and blocks new orders until reconnection", () => {
  const recover = jest.fn();
  jest
    .mocked(useRun)
    .mockReturnValue({
      view: project(initialState(7)),
      pending: false,
      error: "Connection interrupted",
      send,
      recover,
      restart: jest.fn(),
      download: jest.fn(),
    });
  render(<FirstShift media={media} />);
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Your last confirmed choices are intact.",
  );
  expect(screen.getByText("82%")).toBeVisible();
  expect(screen.getByRole("button", { name: "Choose LIMEN" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Reconnect" }));
  expect(recover).toHaveBeenCalledTimes(1);
  expect(send).not.toHaveBeenCalled();
});
