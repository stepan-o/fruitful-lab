import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import GameClient from "@/components/loopforge/first-shift/GameClient";
import ThemeProvider, { useConsoleTheme } from "@/components/loopforge/first-shift/ThemeProvider";
import ThemeSettings from "@/components/loopforge/first-shift/ThemeSettings";
import { DEFAULT_RECIPE, THEMES, parseRecipe, prepareTheme, recipeFromQuery, themeFiles, THEME_STORAGE_KEY, type ThemeRecipe } from "@/lib/loopforge/first-shift/themes";
import { firstShiftMedia } from "@/lib/loopforge/first-shift/media";
import { useRun } from "@/components/loopforge/first-shift/useRun";
import { initialState } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";

jest.mock("@/lib/loopforge/first-shift/themes", () => ({
  ...jest.requireActual("@/lib/loopforge/first-shift/themes"), prepareTheme: jest.fn(),
}));
jest.mock("@/components/loopforge/first-shift/useRun");
jest.mock("@/components/media/AssetImage", () => ({ __esModule: true, default: () => <span /> }));
const prepared = jest.mocked(prepareTheme);
const send = jest.fn().mockResolvedValue(true), restart = jest.fn();
beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);
  window.scrollTo = jest.fn();
  window.matchMedia = jest.fn().mockReturnValue({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
  HTMLDialogElement.prototype.showModal = function() { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function() { this.removeAttribute("open"); };
});
beforeEach(() => {
  localStorage.clear(); jest.clearAllMocks();
  prepared.mockImplementation(async (r, compact) => themeFiles(r, compact));
  jest.mocked(useRun).mockReturnValue({ view: project(initialState(7)), pending: false, error: "", send, restart, recover: jest.fn(), download: jest.fn() });
});
function Harness() {
  const t = useConsoleTheme()!;
  return <><output aria-label="Active recipe">{t.recipe.shell}/{t.recipe.controls}</output><ThemeSettings /></>;
}
it("registers every study as a complete four-part family and bounds malformed recipes", () => {
  expect(THEMES).toHaveLength(6);
  for (const t of THEMES) {
    const files = themeFiles({ version: 1, shell: t.id, controls: t.id }, false);
    expect(Object.keys(files).sort()).toEqual(["button-hover", "button-pressed", "button-rest", "monitor-frame"]);
    for (const file of Object.values(files)) expect(file.src).toMatch(/^\/media\/files\/[a-f0-9]{64}\.webp$/);
  }
  expect(parseRecipe({ version: 2, shell: "baseline", controls: "baseline" })).toEqual(DEFAULT_RECIPE);
  expect(recipeFromQuery("?theme=https://bad.example/asset")).toEqual(DEFAULT_RECIPE);
  expect(recipeFromQuery("?theme=broadcast-desk&controls=foundry-switchboard")).toEqual({ version: 1, shell: "broadcast-desk", controls: "foundry-switchboard" });
});
it("applies every whole theme and persists the actual committed recipe", async () => {
  render(<ThemeProvider><Harness /></ThemeProvider>);
  await screen.findByText("Factory Original applied.");
  for (const t of THEMES) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(t.name) }));
    await waitFor(() => expect(screen.getByLabelText("Active recipe")).toHaveTextContent(`${t.id}/${t.id}`));
    expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)!)).toEqual({ version: 1, shell: t.id, controls: t.id });
  }
});
it("ignores superseded preparation and retains the current kit on failure", async () => {
  render(<ThemeProvider><Harness /></ThemeProvider>);
  await screen.findByText("Factory Original applied.");
  let release!: (value: ReturnType<typeof themeFiles>) => void;
  prepared.mockImplementationOnce(() => new Promise(resolve => { release = resolve; }));
  fireEvent.click(screen.getByRole("button", { name: /Field Instrument/ }));
  fireEvent.click(screen.getByRole("button", { name: /Broadcast Desk/ }));
  await screen.findByText("Broadcast Desk applied.");
  await act(async () => release(themeFiles({ version: 1, shell: "field-instrument", controls: "field-instrument" }, true)));
  expect(screen.getByLabelText("Active recipe")).toHaveTextContent("broadcast-desk/broadcast-desk");
  prepared.mockRejectedValueOnce(new Error("offline"));
  fireEvent.click(screen.getByRole("button", { name: /Neural Diagnostics/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("previous theme and shift are intact");
  expect(screen.getByLabelText("Active recipe")).toHaveTextContent("broadcast-desk/broadcast-desk");
});
it("keeps an uncommitted dispatch choice through theme changes and a menu round-trip", async () => {
  jest.mocked(useRun).mockReturnValue({ view: { ...project(initialState(7)), phase: "allocation", produced: 11 }, pending: false, error: "", send, restart, recover: jest.fn(), download: jest.fn() });
  render(<GameClient media={firstShiftMedia()} />);
  await waitFor(() => expect(screen.getByRole("button", { name: /Start shift/ })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: /Start shift/ }));
  fireEvent.click(screen.getByRole("button", { name: "Split output" }));
  fireEvent.click(screen.getByRole("button", { name: "Review dispatch order" }));
  fireEvent.click(screen.getByRole("button", { name: "Settings", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: /Submarine Watch/ }));
  await screen.findByText("Submarine Watch applied.");
  fireEvent.click(screen.getByRole("button", { name: "Return to the console" }));
  fireEvent.click(screen.getByRole("button", { name: "Menu", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: /Resume shift/ }));
  expect(screen.getByRole("group", { name: "Confirm permanent allocation" })).toBeVisible();
  expect(send).not.toHaveBeenCalled(); expect(restart).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Seal dispatch order" }));
  expect(send).toHaveBeenCalledWith({ type: "commit_output", retain: 5 });
});
it("keeps the selector unavailable while an order is in flight", async () => {
  render(<ThemeProvider><ThemeSettings disabled /></ThemeProvider>);
  await screen.findByText("Waiting for the current order to finish…");
  expect(screen.getByRole("button", { name: /Neural Diagnostics/ })).toBeDisabled();
});
it("restores a saved mixed recipe without creating a run before Start shift", async () => {
  const recipe: ThemeRecipe = { version: 1, shell: "neural-diagnostics", controls: "foundry-switchboard" };
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(recipe));
  render(<GameClient media={firstShiftMedia()} />);
  await waitFor(() => expect(prepared).toHaveBeenCalledWith(recipe, true));
  expect(useRun).not.toHaveBeenCalled();
});
