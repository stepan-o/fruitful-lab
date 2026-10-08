import { act, fireEvent, render, screen, within, waitFor } from "@testing-library/react";
import FirstShift from "@/components/loopforge/first-shift/FirstShift";
import GameClient from "@/components/loopforge/first-shift/GameClient";
import { firstShiftMedia } from "@/lib/loopforge/first-shift/media";
import { initialState, step } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";
import { useRun } from "@/components/loopforge/first-shift/useRun";
import type { PlayerView } from "@/lib/loopforge/first-shift/contract";
import { prepareTheme, themeFiles } from "@/lib/loopforge/first-shift/themes";
jest.mock("@/components/loopforge/first-shift/useRun");
jest.mock("@/lib/loopforge/first-shift/themes", () => ({
  ...jest.requireActual("@/lib/loopforge/first-shift/themes"),
  prepareTheme: jest.fn(),
}));
jest.mock("@/components/media/AssetImage", () => ({
  __esModule: true,
  default: () => <span aria-hidden="true" />,
}));
const media = firstShiftMedia(),
  send = jest.fn().mockResolvedValue(true),
  restart = jest.fn();
const resizeObservers: TestResizeObserver[] = [];
class TestResizeObserver implements ResizeObserver {
  readonly targets = new Set<Element>();
  constructor(private readonly callback: ResizeObserverCallback) {
    resizeObservers.push(this);
  }
  observe(target: Element) { this.targets.add(target); }
  unobserve(target: Element) { this.targets.delete(target); }
  disconnect() { this.targets.clear(); }
  notify(target: Element) {
    if (!this.targets.has(target)) return;
    const contentRect = target.getBoundingClientRect();
    const box = { inlineSize: contentRect.width, blockSize: contentRect.height };
    this.callback([{
      target,
      contentRect,
      borderBoxSize: [box],
      contentBoxSize: [box],
      devicePixelContentBoxSize: [box],
    }], this);
  }
}
function resizeProducerConsole(width: number, height: number) {
  const console = screen.getByRole("region", { name: "Producer console" });
  jest.spyOn(console, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, width, height));
  const observing = resizeObservers.filter(observer => observer.targets.has(console));
  expect(observing).toHaveLength(1);
  act(() => observing.forEach(observer => observer.notify(console)));
  return console;
}
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
      restart,
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
  global.ResizeObserver = TestResizeObserver;
  window.scrollTo = jest.fn();
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    disconnect: jest.fn(),
  }));
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
beforeEach(() => {
  jest.clearAllMocks();
  resizeObservers.length = 0;
  localStorage.clear();
  window.history.replaceState({}, "", "/stepanoskin/loopforge/play");
  jest.mocked(prepareTheme).mockImplementation(async (recipe, compact) =>
    themeFiles(recipe, compact),
  );
  setup(project(initialState(7)));
});
async function acknowledgeOpeningQuota() {
  fireEvent.click(screen.getByRole("button", { name: "Answer leadership" }));
  fireEvent.click(screen.getByRole("button", { name: "Receive the quota" }));
  fireEvent.click(screen.getByRole("button", { name: "Acknowledge quota" }));
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Choose adviser", exact: true })).toBeEnabled(),
  );
}
it("opens on six cameras with answering leadership as the sole enabled gameplay action", () => {
  render(<FirstShift media={media} />);
  const console = screen.getByRole("region", { name: "Producer console" });
  expect(within(console).getByLabelText("Six factory cameras")).toBeVisible();
  expect(within(console).getAllByRole("img", { name: /unpowered camera/ })).toHaveLength(4);
  expect(within(console).getAllByText("No supervisor assigned")).toHaveLength(2);
  const answer = within(console).getByRole("button", { name: "Answer leadership" });
  expect(within(console).getAllByRole("button").filter(button => !button.hasAttribute("disabled"))).toEqual([answer]);
  for (const name of ["Choose adviser", "Development", "Records"]) {
    expect(within(console).getByRole("button", { name, exact: true })).toBeDisabled();
  }
  expect(screen.queryByRole("region", { name: "Weekly leadership call" })).not.toBeInTheDocument();
  resizeProducerConsole(320, 700);
  const channels = within(console).getByRole("navigation", { name: "Camera channels" });
  expect(within(channels).getAllByRole("button")).toHaveLength(6);
  for (const channel of within(channels).getAllByRole("button")) expect(channel).toBeDisabled();
  expect(send).not.toHaveBeenCalled();
});
it("requires the weekly quota acknowledgement before the roster and explicit appointment", async () => {
  render(<FirstShift media={media} />);
  fireEvent.click(screen.getByRole("button", {name:"Answer leadership"}));
  expect(screen.getByRole("region", {name:"Weekly leadership call"})).toBeVisible();
  expect(screen.queryByLabelText("Six factory cameras")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", {name:"Receive the quota"}));
  expect(screen.getByText("Due at the end of Day 07")).toBeVisible();
  fireEvent.click(screen.getByRole("button", {name:"Acknowledge quota"}));
  await waitFor(()=>expect(screen.getByRole("button", {name:"Choose adviser",exact:true})).toBeEnabled());
  expect(screen.getAllByText("No supervisor assigned")).toHaveLength(2);
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
it.each(["handover", "quota"])("dismissing the %s before acknowledgement leaves adviser selection locked", async topic => {
  render(<FirstShift media={media} />);
  fireEvent.click(screen.getByRole("button", { name: "Answer leadership" }));
  if (topic === "quota") fireEvent.click(screen.getByRole("button", { name: "Receive the quota" }));
  fireEvent.click(screen.getByRole("button", { name: "Return to factory ↗" }));
  await waitFor(() => expect(screen.getByLabelText("Six factory cameras")).toBeVisible());
  expect(screen.getByRole("button", { name: "Answer leadership" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Choose adviser", exact: true })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Records" })).toBeDisabled();
  expect(send).not.toHaveBeenCalled();
  await acknowledgeOpeningQuota();
  expect(screen.getByRole("button", { name: "Records" })).toBeEnabled();
  expect(send).not.toHaveBeenCalled();
});
it.each(["Leadership call", "Weekly quota: 0 / 60. Inspect"])("reopening through %s preserves an acknowledged mandate", async control => {
  render(<FirstShift media={media} />);
  await acknowledgeOpeningQuota();
  fireEvent.click(screen.getByRole("button", { name: control, exact: true }));
  expect(screen.getByRole("region", { name: "Weekly leadership call" })).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Return to factory ↗" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Choose adviser", exact: true })).toBeEnabled());
  expect(screen.queryByRole("button", { name: "Answer leadership" })).not.toBeInTheDocument();
  expect(send).not.toHaveBeenCalled();
});
it("reopening leadership only presents the mandate and preserves confirmed state", async () => {
  setup({...project(initialState(7)),phase:"ready",adviser:"limen",committed:9});
  render(<FirstShift media={media} />);
  fireEvent.click(screen.getByRole("button",{name:"Weekly quota: 9 / 60. Inspect"}));
  fireEvent.click(screen.getByRole("button",{name:/The quota$/}));
  fireEvent.click(screen.getByRole("button",{name:"Acknowledge quota"}));
  await waitFor(()=>expect(screen.getByRole("button",{name:"Start the line"})).toBeVisible());
  expect(send).not.toHaveBeenCalled();
});
it("preserves the acknowledgement gate through console changes and menu round-trips", async () => {
  render(<GameClient media={media} />);
  await waitFor(() => expect(screen.getByRole("button", { name: /Start shift/ })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: /Start shift/ }));

  async function changeConsoleAndResume(name: string) {
    fireEvent.click(screen.getByRole("button", { name: "Settings" }));
    const settings = screen.getByRole("dialog", { name: "Console settings" });
    fireEvent.click(within(settings).getByRole("button", { name: new RegExp(name) }));
    await within(settings).findByText(`${name} applied.`);
    fireEvent.click(within(settings).getByRole("button", { name: "Return to the console" }));
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    fireEvent.click(screen.getByRole("button", { name: /Resume shift/ }));
  }

  await changeConsoleAndResume("Obedience organ");
  expect(screen.getByRole("button", { name: "Answer leadership" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Choose adviser", exact: true })).toBeDisabled();
  await acknowledgeOpeningQuota();
  await changeConsoleAndResume("Broadcast control");
  expect(screen.getByRole("button", { name: "Choose adviser", exact: true })).toBeEnabled();
  expect(screen.queryByRole("button", { name: "Answer leadership" })).not.toBeInTheDocument();
  expect(send).not.toHaveBeenCalled();
  expect(restart).not.toHaveBeenCalled();
});
it("preserves the acknowledged mandate, adviser and selected camera across available console sizes", async () => {
  let state = initialState(7);
  const { rerender } = render(<FirstShift media={media} />);
  expect(resizeProducerConsole(1440, 860)).toHaveAttribute("data-layout", "wall");
  await acknowledgeOpeningQuota();
  fireEvent.click(screen.getByRole("button", { name: "Choose adviser", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: "Inspect LIMEN" }));
  fireEvent.click(screen.getByRole("button", { name: "Appoint LIMEN for today" }));
  expect(send).toHaveBeenLastCalledWith({ type: "choose_adviser", adviser: "limen" });
  state = step(state, { type: "choose_adviser", adviser: "limen" });
  setup(project(state));
  rerender(<FirstShift media={media} />);
  fireEvent.click(screen.getByRole("button", { name: "Review placements" }));
  fireEvent.click(screen.getByRole("button", { name: "Approve the arrangement" }));
  expect(send).toHaveBeenLastCalledWith({ type: "approve_plan", assignments: state.briefing!.assignments });
  state = step(state, { type: "approve_plan", assignments: state.briefing!.assignments });
  setup(project(state));
  rerender(<FirstShift media={media} />);

  const console = resizeProducerConsole(1440, 860);
  expect(console).toHaveAttribute("data-layout", "wall");
  expect(screen.queryByRole("navigation", { name: "Camera channels" })).not.toBeInTheDocument();
  expect(resizeProducerConsole(320, 700)).toHaveAttribute("data-layout", "channel");
  const channels = screen.getByRole("navigation", { name: "Camera channels" });
  fireEvent.click(within(channels).getByRole("button", { name: /Security$/ }));
  expect(within(channels).getByRole("button", { name: /Security$/ })).toHaveAttribute("aria-pressed", "true");

  for (const [width, height, layout] of [[390, 800, "portrait"], [844, 350, "compact"]] as const) {
    expect(resizeProducerConsole(width, height)).toBe(console);
    expect(console).toHaveAttribute("data-layout", layout);
    expect(screen.getByRole("button", { name: "Inspect Security" })).toHaveAttribute("data-selected", "true");
    expect(screen.getByRole("button", { name: "Inspect Lattice Forge" })).toHaveAttribute("data-selected", "false");
    expect(screen.getByRole("button", { name: "Leadership call", exact: true })).toBeEnabled();
    expect(screen.queryByRole("button", { name: "Answer leadership" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LIMEN adviser channel" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Start the line" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Weekly quota: 0 / 60. Inspect" })).toBeEnabled();
    if (layout === "portrait") {
      expect(screen.queryByRole("navigation", { name: "Camera channels" })).not.toBeInTheDocument();
    } else {
      expect(within(screen.getByRole("navigation", { name: "Camera channels" })).getByRole("button", { name: /Security$/ })).toHaveAttribute("aria-pressed", "true");
    }
  }
  expect(send).toHaveBeenCalledTimes(2);
  expect(restart).not.toHaveBeenCalled();
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
  const { rerender } = render(<FirstShift media={media} />);
  await acknowledgeOpeningQuota();
  fireEvent.click(screen.getByRole("button", {name:"Choose adviser", exact:true}));
  const recover = setup(project(initialState(7)), "Connection interrupted");
  rerender(<FirstShift media={media} />);
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Your last confirmed choices are intact.",
  );
  expect(screen.getByText("82%")).toBeVisible();
  expect(screen.getByRole("button", { name: "Inspect LIMEN" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Reconnect" }));
  expect(recover).toHaveBeenCalledTimes(1);
  expect(send).not.toHaveBeenCalled();
});
