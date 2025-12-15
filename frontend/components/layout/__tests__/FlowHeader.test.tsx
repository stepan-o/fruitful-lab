import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FlowHeader from "../FlowHeader";

describe("FlowHeader", () => {
  it("renders logo and Book a Call button with default backHref", () => {
    render(<FlowHeader />);

    const logo = screen.getByText("Fruitful Lab");
    expect(logo.closest("a")).toHaveAttribute("href", "/hub");

    const bookCall = screen.getByText(/book a call/i);
    expect(bookCall.closest("a")).toHaveAttribute(
      "href",
      "https://calendly.com/fruitfulab/15min"
    );
  });

  it("respects custom backHref", () => {
    render(<FlowHeader backHref="/tools" />);
    const logo = screen.getByText("Fruitful Lab");
    expect(logo.closest("a")).toHaveAttribute("href", "/tools");
  });
});
