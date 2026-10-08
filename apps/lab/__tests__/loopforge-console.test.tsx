import { fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import FirstShift from "@/components/loopforge/first-shift/FirstShift";
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
const media = firstShiftMedia(),
  send = jest.fn().mockResolvedValue(true);
function setup(view: PlayerView, error = "") {
  const recover = jest.fn();
  jest
    .mocked(useRun)
    .mockReturnValue({
      view,
      pending: false,
      error,
      send,
      recover,
      restart: jest.fn(),
      download: jest.fn(),
    });
  return recover;
}
beforeAll(() => {
  window.matchMedia = jest
    .fn()
    .mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
beforeEach(() => {
  jest.clearAllMocks();
  setup(project(initialState(7)));
});
it("separates the weekly call, factory summary, roster and explicit appointment", async () => {
  render(<FirstShift media={media} />);
  expect(screen.getByRole("region", {name:"Weekly leadership call"})).toBeVisible();
  expect(screen.queryByLabelText("Six factory cameras")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", {name:"Receive the quota"}));
  expect(screen.getByText("Due at the end of Day 07")).toBeVisible();
  fireEvent.click(screen.getByRole("button", {name:"Enter the factory"}));
  await waitFor(()=>expect(screen.getAllByText("No supervisor assigned")).toHaveLength(2));
  expect(screen.getAllByRole("img",{name:/unpowered camera/})).toHaveLength(4);
  expect(screen.queryByRole("group",{name:"Supervisor roster"})).not.toBeInTheDocument();
  expect(screen.queryByText(/Give me the line/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Choose adviser",exact:true}));
  const roster=screen.getByRole("group",{name:"Supervisor roster"});
  expect(within(roster).getAllByRole("button")).toHaveLength(5);
  expect(screen.getByRole("button",{name:"CATHEXIS — not arrived"})).toBeDisabled();
  expect(screen.queryByLabelText("Six factory cameras")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Inspect STILETTO"}));
  expect(screen.getByText("More equipment wear. Higher accident risk.")).toBeVisible();
  expect(send).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button",{name:"Appoint STILETTO for today"}));
  expect(send).toHaveBeenCalledWith({type:"choose_adviser",adviser:"stiletto"});
});
it("reopening leadership only presents the mandate and preserves confirmed state", async () => {
  setup({...project(initialState(7)),phase:"ready",adviser:"limen",committed:9});
  render(<FirstShift media={media} />);
  fireEvent.click(screen.getByRole("button",{name:"Weekly quota: 9 / 60. Inspect"}));
  fireEvent.click(screen.getByRole("button",{name:/The quota$/}));
  fireEvent.click(screen.getByRole("button",{name:"Enter the factory"}));
  await waitFor(()=>expect(screen.getByRole("button",{name:"Start the line"})).toBeVisible());
  expect(send).not.toHaveBeenCalled();
});
it("separates the brief from placements and submits an explicit override", () => {
  setup(
    project(
      step(initialState(7), { type: "choose_adviser", adviser: "limen" }),
    ),
  );
  render(<FirstShift media={media} />);
  expect(
    screen.getByRole("heading", { name: "The morning brief" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Review placements" }));
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
it("opens an incident, lets the player inspect evidence and return to the same unresolved decision", () => {
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
  setup(project(state));
  render(<FirstShift media={media} />);
  expect(
    screen.getByRole("dialog", { name: "Incident response" }),
  ).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Inspect the recorded events" }),
  );
  expect(
    screen.getByRole("heading", { name: "The shift record" }),
  ).toBeVisible();
  expect(send).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Respond to incident" }));
  expect(screen.getByText("Override LIMEN")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Issue override" }));
  expect(send).toHaveBeenCalledWith({
    type: "resolve_incident",
    incident: "clearance-mismatch",
    response: "wave",
  });
});
it("keeps an allocation preview through records navigation and commits only after explicit review", () => {
  setup({ ...project(initialState(7)), phase: "allocation", produced: 11 });
  render(<FirstShift media={media} />);
  fireEvent.click(screen.getByRole("button", { name: "Split output" }));
  fireEvent.click(screen.getByRole("button", { name: "Records" }));
  fireEvent.click(screen.getByRole("button", { name: "Dispatch output" }));
  expect(screen.getByRole("slider")).toHaveValue("5");
  fireEvent.click(
    screen.getByRole("button", { name: "Review dispatch order" }),
  );
  expect(send).not.toHaveBeenCalled();
  expect(screen.getByRole("slider")).toBeDisabled();
  const group = screen.getByRole("group", {
    name: "Confirm permanent allocation",
  });
  expect(group).toHaveTextContent("This cannot be undone.");
  fireEvent.click(
    within(group).getByRole("button", { name: "Seal dispatch order" }),
  );
  expect(send).toHaveBeenCalledWith({ type: "commit_output", retain: 5 });
});
it("keeps confirmed facts visible and blocks appointments until reconnection", async () => {
  const recover = setup(project(initialState(7)), "Connection interrupted");
  render(<FirstShift media={media} />);
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Your last confirmed choices are intact.",
  );
  expect(screen.getByText("82%")).toBeVisible();
  fireEvent.click(screen.getByRole("button", {name:"Return to factory ↗"}));
  await waitFor(()=>expect(screen.getByRole("button",{name:"Choose adviser",exact:true})).toBeVisible());
  fireEvent.click(screen.getByRole("button", {name:"Choose adviser", exact:true}));
  expect(screen.getByRole("button", { name: "Inspect LIMEN" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Reconnect" }));
  expect(recover).toHaveBeenCalledTimes(1);
  expect(send).not.toHaveBeenCalled();
});
