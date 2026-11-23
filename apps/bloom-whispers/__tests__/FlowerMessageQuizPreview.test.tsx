import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FlowerMessageQuizPreview } from "@/components/quiz/FlowerMessageQuizPreview";

describe("FlowerMessageQuizPreview", () => {
  it("walks from start through preview, soft gate, and full result", async () => {
    const user = userEvent.setup();

    render(<FlowerMessageQuizPreview />);

    await user.click(screen.getByRole("button", { name: "Start the quiz" }));
    await user.click(screen.getByRole("button", { name: "I wanted a small ritual to hold onto." }));
    await user.click(screen.getByRole("button", { name: "A pale bloom in a room that finally got quiet." }));
    await user.click(screen.getByRole("button", { name: "The one that leads to a quieter evening." }));
    await user.click(screen.getByRole("button", { name: "Moonlit softness and room to exhale." }));
    await user.click(screen.getByRole("button", { name: "You may rest before everything is mended." }));
    await user.click(screen.getByRole("button", { name: "A candle burning lower, not brighter." }));
    await user.click(screen.getByRole("button", { name: "A tiny ritual with a journaling prompt." }));
    await user.click(screen.getByRole("button", { name: "Beauty that lets the room get quieter." }));

    expect(screen.getByRole("heading", { name: "Hellebore" })).toBeInTheDocument();
    expect(screen.getByText("Where should the garden send your full note?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Keep reading here" }));

    expect(screen.getByText("Why this flower is speaking to you")).toBeInTheDocument();
    expect(screen.getByText("A tiny ritual")).toBeInTheDocument();
  });
});
