import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import PublicHubLanding from "@/components/PublicHubLanding";

describe("PublicHubLanding hero CTAs", () => {
  it("renders primary CTA to external site and secondary CTAs to tools and login", () => {
    render(<PublicHubLanding />);

    // Primary CTA
    const primary = screen.getByRole("link", { name: /go to fruitful pin site/i });
    expect(primary).toBeInTheDocument();
    expect(primary).toHaveAttribute("href", "https://fruitfulpin.com");

    // Secondary: tools
    const tools = screen.getByRole("link", { name: /browse public tools/i });
    expect(tools).toBeInTheDocument();
    expect(tools).toHaveAttribute("href", "/tools");

    // Secondary: sign in
    const login = screen.getByRole("link", { name: /sign in to dashboards/i });
    expect(login).toBeInTheDocument();
    expect(login).toHaveAttribute("href", "/login?next=/dashboard");
  });
});
