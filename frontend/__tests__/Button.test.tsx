import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Button from "@/components/ui/Button";

describe("Button UI primitive", () => {
  it("renders as <button> when href is not provided", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
  });

  it("renders as <a> via Next Link when href is provided", () => {
    render(<Button href="/tools">Tools</Button>);
    const link = screen.getByRole("link", { name: /tools/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/tools");
  });

  it("applies primary styling by default", () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole("button", { name: /primary/i });
    expect(btn.className).toContain("bg-[var(--brand-raspberry)]");
    expect(btn.className).toContain("text-white");
  });

  it("applies secondary styling when variant='secondary'", () => {
    render(
      <Button href="/login" variant="secondary">
        Login
      </Button>
    );
    const link = screen.getByRole("link", { name: /login/i });
    // Secondary uses alabaster border and prussian (brand-heading) text color
    expect(link.className).toContain("border-[var(--brand-alabaster)]");
    expect(link.className).toContain("text-[var(--brand-heading)]");
  });

  it("fires onClick when rendered as <button>", () => {
    const onClick = jest.fn();
    render(
      <Button onClick={onClick} type="button">
        Do it
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: /do it/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
