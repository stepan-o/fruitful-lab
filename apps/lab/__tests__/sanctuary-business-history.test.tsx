import { fireEvent, render, screen, within } from "@testing-library/react";
import BusinessHistory from "@/components/sanctuary/BusinessHistory";
import { businessHistory } from "@/lib/sanctuary/business-history";
import { chapters, sources } from "@/lib/sanctuary/content";

it("lets readers select historical milestones and follow their evidence", () => {
  render(<BusinessHistory sources={sources}/>);
  const timeline = screen.getByRole("list", { name: "Explore the business history" });
  const buttons = within(timeline).getAllByRole("button");
  expect(buttons).toHaveLength(6);
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
