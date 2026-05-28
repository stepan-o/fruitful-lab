import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PinterestReadinessCheck } from "./PinterestReadinessCheck";

describe("PinterestReadinessCheck", () => {
  it("moves through the seven-question flow into the gated result view", async () => {
    const user = userEvent.setup();

    render(<PinterestReadinessCheck />);

    await user.click(screen.getByRole("button", { name: "Find Out If Your Brand Is Ready" }));

    for (let index = 0; index < 7; index += 1) {
      await user.click(screen.getAllByRole("button", { pressed: false })[0]);
    }

    expect(screen.getByText("Strong Pinterest Fit")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Want the full picture?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get My Full Readout" })).toBeInTheDocument();
  });
});
