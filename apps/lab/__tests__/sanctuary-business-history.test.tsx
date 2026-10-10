import { fireEvent, render, screen, within } from "@testing-library/react";
import BusinessHistory from "@/components/sanctuary/BusinessHistory";
import { businessHistory } from "@/lib/sanctuary/business-history";
import { chapters, sources } from "@/lib/sanctuary/content";

it("lets readers select historical milestones and follow their evidence", () => {
  render(<BusinessHistory sources={sources}/>);
  const timeline = screen.getByRole("group", { name: "Explore the business history" });
  const buttons = within(timeline).getAllByRole("button");
  expect(buttons).toHaveLength(businessHistory.length);
  const reading = document.getElementById(buttons[0].getAttribute("aria-controls")!)!;
  for (const [i, era] of businessHistory.entries()) {
    fireEvent.click(buttons[i]);
    expect(buttons[i]).toHaveAttribute("aria-pressed", "true");
    expect(buttons.filter(button => button.getAttribute("aria-pressed") === "true")).toHaveLength(1);
    expect(within(reading).getByRole("heading", { name: era.label })).toBeVisible();
    expect(reading).toHaveTextContent(era.stake);
    expect(within(reading).getAllByRole("link").map(a => a.getAttribute("href"))).toEqual(era.sources.map(id => sources.find(source => source.id === id)!.url));
    for (const id of era.sources) expect(chapters.find(chapter => chapter.id === "studio-to-screen")!.sources).toContain(id);
  }
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});

it("keeps mobile lane selection and the detail panel in sync", () => {
  render(<BusinessHistory sources={sources}/>);
  const choices = screen.getByRole("group", { name: "Choose a history lane" });
  fireEvent.click(within(choices).getByRole("button", { name: "PC", exact: true }));
  const pc = screen.getByRole("region", { name: "PC", exact: true });
  expect(pc).toHaveAttribute("data-active", "true");
  expect(within(pc).getByRole("button", { name: /Boxed PC games/ })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(within(choices).getByRole("button", { name: "Consoles", exact: true }));
  expect(pc).toHaveAttribute("data-active", "false");
  const consoles = screen.getByRole("region", { name: "Consoles", exact: true });
  fireEvent.click(within(consoles).getByRole("button", { name: /Console cloud play/ }));
  expect(screen.getByRole("link", { name: /Windows app launch/ })).toHaveAttribute("href", "https://blog.playstation.com/2016/08/30/playstation-now-september-update-pc-streaming-6-greatest-hits/");
  expect(screen.getByText(/without owning a PlayStation/)).toBeVisible();
});
