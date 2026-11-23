import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SupervisorAtlas from "@/components/loopforge/SupervisorAtlas";
import content from "@/lib/loopforge/supervisor-content.json";
import type { ImageAsset } from "@/lib/assets/types";

const assets: Record<string, ImageAsset> = Object.fromEntries(content.scenes.map(scene => [scene.id, {
  kind: "image", width: 1536, height: 1024,
  variants: [{ src: `/media/${scene.id}.webp`, width: 1536, height: 1024, mime: "image/webp", bytes: 100, sha256: "0".repeat(64) }],
}]));

test("event authorization changes the reading without swapping the art and resets with the supervisor", async () => {
  const user = userEvent.setup();
  render(<SupervisorAtlas assets={assets} />);
  const image = within(screen.getByRole("button", { name: "Enlarge Security Lockdown" })).getByRole("img");
  const src = image.getAttribute("src");
  await user.click(screen.getByRole("button", { name: "Supervisor defies" }));
  expect(screen.getByText("He declares your instruction noncompliant and seals the works against it.")).toBeVisible();
  expect(image).toHaveAttribute("src", src);
  await user.click(within(screen.getByRole("group", { name: "Choose a supervisor" })).getByRole("button", { name: /STILETTO/ }));
  expect(screen.getByRole("heading", { name: "STILETTO / Lattice Forge" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Director permits" })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: "Enlarge Conveyor Overdrive" })).toBeVisible();
});

test("a room-table assignment updates the supervisor, room and available scene together", async () => {
  const user = userEvent.setup();
  render(<SupervisorAtlas assets={assets} />);
  await user.click(screen.getByRole("link", { name: "RIVET WITCH in Lattice Forge: Repair, then restart" }));
  expect(screen.getByRole("heading", { name: "RIVET WITCH / Lattice Forge" })).toBeVisible();
  expect(within(screen.getByRole("group", { name: "Scene variations" })).getByRole("button", { name: "Repair" })).toBeVisible();
  await user.click(within(screen.getByRole("group", { name: "Choose a room" })).getByRole("button", { name: /Cortex Assembly/ }));
  expect(screen.getByRole("heading", { name: "Align, cool and prove" })).toBeVisible();
  expect(screen.getByText(/was closed in the original simulation/)).toBeVisible();
  expect(screen.getByRole("button", { name: "Enlarge Cortex Assembly room study" })).toBeVisible();
  expect(screen.queryByRole("group", { name: "Scene variations" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "System Refactor" })).toBeVisible();
});

test("pairings without joint art show separate references rather than an invented confrontation", async () => {
  const user = userEvent.setup();
  render(<SupervisorAtlas assets={assets} />);
  await user.click(screen.getByRole("link", { name: /RIVET WITCH × THRUM/ }));
  expect(screen.getByText(/No joint painting was found for this pair/)).toBeVisible();
  expect(screen.getByRole("button", { name: "Enlarge RIVET WITCH — individual reference" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Enlarge THRUM — individual reference" })).toBeVisible();
  expect(screen.queryByRole("group", { name: "Pair scenes" })).not.toBeInTheDocument();
});

test("a floor-plan entry opens its service room and exposes a marked action for each supervisor", async () => {
  const user = userEvent.setup();
  render(<SupervisorAtlas assets={assets} initialRoom="logistics" />);
  expect(screen.getByRole("heading", { name: "LIMEN / Logistics" })).toBeVisible();
  await user.click(screen.getByRole("link", { name: "STILETTO in Logistics: Clear the dock" }));
  expect(screen.getByRole("heading", { name: "STILETTO / Logistics" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Locate G3 on the factory floor" })).toHaveAttribute("href", "/loopforge-design/factory-layout-proposal.html#asset-G3");
  expect(screen.getByRole("button", { name: "Enlarge Logistics room study" })).toBeVisible();
});
