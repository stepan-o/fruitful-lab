import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import GameClient from "@/components/loopforge/first-shift/GameClient";
import ThemeProvider, { useConsoleTheme } from "@/components/loopforge/first-shift/ThemeProvider";
import ThemeSettings from "@/components/loopforge/first-shift/ThemeSettings";
import { CONSOLES, DEFAULT_RECIPE, THEMES, consolePreview, parseRecipe, prepareTheme, recipeForConsole, recipeFromQuery, recipeLink, themeFiles, THEME_STORAGE_KEY, type ThemeRecipe } from "@/lib/loopforge/first-shift/themes";
import { firstShiftMedia } from "@/lib/loopforge/first-shift/media";
import { useRun } from "@/components/loopforge/first-shift/useRun";
import { initialState } from "@/lib/loopforge/first-shift/kernel";
import { project } from "@/lib/loopforge/first-shift/projection";
import { producerPlate } from "@/lib/loopforge/first-shift/producer-art";

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
  window.history.replaceState({}, "", "/stepanoskin/loopforge/play");
  prepared.mockImplementation(async (r, compact) => themeFiles(r, compact));
  jest.mocked(useRun).mockReturnValue({ view: project(initialState(7)), pending: false, error: "", send, restart, recover: jest.fn(), download: jest.fn() });
});
function Harness() {
  const t = useConsoleTheme()!;
  return <><output aria-label="Active recipe">{t.recipe.console} / {t.recipe.shell}/{t.recipe.controls}</output><ThemeSettings /></>;
}
it("keeps complete legacy families internal and registers exactly four producer consoles", () => {
  expect(THEMES).toHaveLength(6);
  expect(CONSOLES.map(c => c.id)).toEqual(["foundry-desk", "broadcast-control", "dispatch-office", "obedience-organ"]);
  for (const t of THEMES) {
    const files = themeFiles({ version: 1, shell: t.id, controls: t.id }, false);
    expect(Object.keys(files)).toEqual(expect.arrayContaining(["button-hover", "button-pressed", "button-rest", "monitor-frame", "supervisor-socket"]));
    for (const file of Object.values(files)) expect(file.src).toMatch(/^\/media\/files\/[a-f0-9]{64}\.webp$/);
  }
  for (const c of CONSOLES) {
    expect(recipeForConsole(c.id)).toEqual({ version: 1, console: c.id, shell: c.defaultLegacyShell, controls: c.defaultLegacyShell });
    expect(consolePreview(c.id).src).toMatch(/^\/media\/files\/[a-f0-9]{64}\.webp$/);
    expect(consolePreview(c.id).width).toBe(480);
  }
});
it("bounds malformed recipes and migrates legacy preferences without losing focused-screen mappings", () => {
  expect(parseRecipe({ version: 2, shell: "baseline", controls: "baseline" })).toEqual(DEFAULT_RECIPE);
  expect(parseRecipe({ ...DEFAULT_RECIPE, console: "https://bad.example/asset" })).toEqual(DEFAULT_RECIPE);
  expect(parseRecipe({ ...DEFAULT_RECIPE, console: null })).toEqual(DEFAULT_RECIPE);
  expect(parseRecipe({ ...DEFAULT_RECIPE, controls: "unknown" })).toEqual(DEFAULT_RECIPE);
  expect(parseRecipe(null)).toEqual(DEFAULT_RECIPE);
  expect(parseRecipe({ version: 1, shell: "neural-diagnostics", controls: "foundry-switchboard" })).toEqual({ version: 1, shell: "neural-diagnostics", controls: "foundry-switchboard", console: "obedience-organ" });
  expect(parseRecipe({ version: 1, shell: "field-instrument", controls: "field-instrument" }).console).toBe("foundry-desk");
  expect(parseRecipe({ version: 1, shell: "submarine-watch", controls: "submarine-watch" }).console).toBe("broadcast-control");
});
it("links all four consoles and gives explicit console links precedence over legacy queries", () => {
  for (const c of CONSOLES) {
    const recipe = recipeForConsole(c.id);
    expect(recipeLink(recipe)).toBe(`/stepanoskin/loopforge/play?console=${c.id}`);
    expect(recipeFromQuery(`?console=${c.id}`)).toEqual(recipe);
  }
  expect(recipeFromQuery("?console=dispatch-office&theme=neural-diagnostics&controls=baseline")).toEqual(recipeForConsole("dispatch-office"));
  expect(recipeFromQuery("?console=unknown&theme=neural-diagnostics")).toEqual(DEFAULT_RECIPE);
  expect(recipeFromQuery("?unrelated=1")).toBeNull();
  expect(recipeFromQuery("?theme=https://bad.example/asset")).toEqual(DEFAULT_RECIPE);
  expect(recipeFromQuery("?theme=broadcast-desk&controls=foundry-switchboard")).toEqual({ version: 1, shell: "broadcast-desk", controls: "foundry-switchboard", console: "broadcast-control" });
});
it("waits for the exact full-size console plate even when focused-screen assets use compact variants", async () => {
  const actual = jest.requireActual<typeof import("@/lib/loopforge/first-shift/themes")>("@/lib/loopforge/first-shift/themes");
  const requests: Array<{ src: string; complete: () => void }> = [];
  const OriginalImage = global.Image;
  global.Image = jest.fn().mockImplementation(() => {
    const image = {
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
      decode: jest.fn().mockResolvedValue(undefined),
      set src(src: string) { requests.push({ src, complete: () => image.onload?.() }); },
    };
    return image;
  }) as unknown as typeof Image;
  const recipe = recipeForConsole("broadcast-control");
  const plate = producerPlate(recipe.console);
  const fullPlate = plate.variants[plate.variants.length - 1];
  const preparation = actual.prepareTheme(recipe, true);
  let ready = false;
  void preparation.then(() => { ready = true; });
  try {
    expect(requests.map(r => r.src)).toContain(fullPlate.src);
    for (const request of requests) if (request.src !== fullPlate.src) request.complete();
    await Promise.resolve();
    await Promise.resolve();
    expect(ready).toBe(false);
    requests.find(r => r.src === fullPlate.src)!.complete();
    await expect(preparation).resolves.toEqual(themeFiles(recipe, true));
    expect(ready).toBe(true);
  } finally {
    requests.forEach(request => request.complete());
    global.Image = OriginalImage;
    await preparation;
  }
});
it("offers only the four producer consoles, applies each and persists only the committed recipe", async () => {
  render(<ThemeProvider><Harness /></ThemeProvider>);
  await screen.findByText("Foundry desk applied.");
  expect(screen.getAllByRole("button")).toHaveLength(4);
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(screen.queryByText(/combine equipment/i)).not.toBeInTheDocument();
  for (const t of THEMES) expect(screen.queryByRole("button", { name: new RegExp(t.name) })).not.toBeInTheDocument();
  for (const c of CONSOLES) {
    const recipe = recipeForConsole(c.id);
    expect(screen.getByRole("link", { name: `Start a new shift with ${c.name}` })).toHaveAttribute("href", recipeLink(recipe));
    fireEvent.click(screen.getByRole("button", { name: new RegExp(c.name) }));
    await screen.findByText(`${c.name} applied.`);
    expect(screen.getByLabelText("Active recipe")).toHaveTextContent(`${c.id} / ${recipe.shell}/${recipe.controls}`);
    expect(screen.getByRole("button", { name: new RegExp(c.name) })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)!)).toEqual(recipe);
  }
});
it("keeps the current console until ready, ignores superseded preparation and allows retry after failure", async () => {
  render(<ThemeProvider><Harness /></ThemeProvider>);
  await screen.findByText("Foundry desk applied.");
  let release!: (value: ReturnType<typeof themeFiles>) => void;
  prepared.mockImplementationOnce(() => new Promise(resolve => { release = resolve; }));
  fireEvent.click(screen.getByRole("button", { name: /Dispatch office/ }));
  expect(screen.getByLabelText("Active recipe")).toHaveTextContent("foundry-desk");
  expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)!)).toEqual(DEFAULT_RECIPE);
  fireEvent.click(screen.getByRole("button", { name: /Broadcast control/ }));
  await screen.findByText("Broadcast control applied.");
  await act(async () => release(themeFiles(recipeForConsole("dispatch-office"), true)));
  expect(screen.getByLabelText("Active recipe")).toHaveTextContent("broadcast-control");
  prepared.mockRejectedValueOnce(new Error("offline"));
  fireEvent.click(screen.getByRole("button", { name: /Obedience organ/ }));
  expect(await screen.findByRole("alert")).toHaveTextContent("previous console and shift are intact");
  expect(screen.getByLabelText("Active recipe")).toHaveTextContent("broadcast-control");
  expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)!)).toEqual(recipeForConsole("broadcast-control"));
  fireEvent.click(screen.getByRole("button", { name: /Obedience organ/ }));
  await screen.findByText("Obedience organ applied.");
  expect(screen.getByLabelText("Active recipe")).toHaveTextContent("obedience-organ");
});
it("does not surface an older load failure after a newer console is fitted", async () => {
  render(<ThemeProvider><Harness /></ThemeProvider>);
  await screen.findByText("Foundry desk applied.");
  let reject!: (error: Error) => void;
  prepared.mockImplementationOnce(() => new Promise((_, fail) => { reject = fail; }));
  fireEvent.click(screen.getByRole("button", { name: /Dispatch office/ }));
  fireEvent.click(screen.getByRole("button", { name: /Broadcast control/ }));
  await screen.findByText("Broadcast control applied.");
  await act(async () => reject(new Error("stale load failed")));
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Active recipe")).toHaveTextContent("broadcast-control");
  expect(JSON.parse(localStorage.getItem(THEME_STORAGE_KEY)!)).toEqual(recipeForConsole("broadcast-control"));
});
it("keeps an uncommitted dispatch choice through theme changes and a menu round-trip", async () => {
  jest.mocked(useRun).mockReturnValue({ view: { ...project(initialState(7)), phase: "allocation", produced: 11 }, pending: false, error: "", send, restart, recover: jest.fn(), download: jest.fn() });
  render(<GameClient media={firstShiftMedia()} />);
  await waitFor(() => expect(screen.getByRole("button", { name: /Start shift/ })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: /Start shift/ }));
  fireEvent.click(screen.getByRole("button", { name: "Split output" }));
  fireEvent.click(screen.getByRole("button", { name: "Review dispatch order" }));
  fireEvent.click(screen.getByRole("button", { name: "Settings" }));
  fireEvent.click(screen.getByRole("button", { name: /Dispatch office/ }));
  await screen.findByText("Dispatch office applied.");
  fireEvent.click(screen.getByRole("button", { name: "Return to the console" }));
  fireEvent.click(screen.getByRole("button", { name: "Menu" }));
  fireEvent.click(screen.getByRole("button", { name: /Resume shift/ }));
  expect(screen.getByRole("group", { name: "Confirm permanent allocation" })).toBeVisible();
  expect(send).not.toHaveBeenCalled(); expect(restart).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Seal dispatch order" }));
  expect(send).toHaveBeenCalledWith({ type: "commit_output", retain: 5 });
});
it("keeps the selector unavailable while an order is in flight", async () => {
  render(<ThemeProvider><ThemeSettings disabled /></ThemeProvider>);
  await screen.findByText("Waiting for the current order to finish…");
  for (const c of CONSOLES) expect(screen.getByRole("button", { name: new RegExp(c.name) })).toBeDisabled();
});
it("migrates a saved legacy recipe without creating a run before Start shift", async () => {
  const recipe: ThemeRecipe = { version: 1, shell: "neural-diagnostics", controls: "foundry-switchboard" };
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(recipe));
  render(<GameClient media={firstShiftMedia()} />);
  await waitFor(() => expect(prepared).toHaveBeenCalledWith({ ...recipe, console: "obedience-organ" }, true));
  expect(useRun).not.toHaveBeenCalled();
});
it("opens an explicit console link ahead of a stored preference without starting a run", async () => {
  localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(recipeForConsole("obedience-organ")));
  window.history.replaceState({}, "", "/stepanoskin/loopforge/play?console=broadcast-control");
  render(<GameClient media={firstShiftMedia()} />);
  await waitFor(() => expect(prepared).toHaveBeenCalledWith(recipeForConsole("broadcast-control"), true));
  expect(useRun).not.toHaveBeenCalled();
});
