import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SiteHeader from "@/components/layout/SiteHeader";

// Mock next/navigation for client components used inside the header (LogoutButton)
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// Mock getCurrentUser so we can control auth state per test
jest.mock("@/lib/auth", () => ({
  getCurrentUser: jest.fn(),
}));

const { getCurrentUser } = jest.requireMock("@/lib/auth");

describe("SiteHeader – nav + auth-aware CTAs", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nav and CTAs for logged-out users (Book a Call + Login)", async () => {
    getCurrentUser.mockResolvedValueOnce(null);

    // SiteHeader is an async server component
    render(await SiteHeader());

    // Center nav items
    const tools = screen.getAllByRole("link", { name: /tools & calculators/i });
    expect(tools.length).toBeGreaterThanOrEqual(1);
    expect(tools[0]).toHaveAttribute("href", "/tools");

    const caseStudies = screen.getAllByRole("link", { name: /case studies/i });
    expect(caseStudies.length).toBeGreaterThanOrEqual(1);
    expect(caseStudies[0]).toHaveAttribute("href", "/case-studies");

    const agency = screen.getAllByRole("link", { name: /main agency site/i });
    expect(agency.length).toBeGreaterThanOrEqual(1);
    expect(agency[0]).toHaveAttribute("href", "https://fruitfulpin.com");

    // Right-side CTAs
    const book = screen.getAllByRole("link", { name: /book a call/i });
    expect(book.length).toBeGreaterThanOrEqual(1);
    expect(book[0]).toHaveAttribute("href", "https://calendly.com/fruitfulab/15min");

    const loginLinks = screen.getAllByRole("link", { name: /login/i });
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    expect(loginLinks[0]).toHaveAttribute("href", "/login?next=/dashboard");

    // No logout button when logged out
    expect(screen.queryByRole("button", { name: /log out/i })).not.toBeInTheDocument();
  });

  it("renders nav and CTAs for logged-in users (Book a Call + Log out)", async () => {
    getCurrentUser.mockResolvedValueOnce({ id: "user_1", email: "tester@example.com", groups: [] });

    render(await SiteHeader());

    // Center nav items stay the same
    expect(screen.getAllByRole("link", { name: /tools & calculators/i })[0]).toHaveAttribute("href", "/tools");
    expect(screen.getAllByRole("link", { name: /case studies/i })[0]).toHaveAttribute("href", "/case-studies");
    expect(screen.getAllByRole("link", { name: /main agency site/i })[0]).toHaveAttribute("href", "https://fruitfulpin.com");

    // Right side: Book a Call present
    expect(screen.getAllByRole("link", { name: /book a call/i })[0]).toHaveAttribute(
      "href",
      "https://calendly.com/fruitfulab/15min"
    );

    // Shows at least one Logout button (desktop and mobile menus both render)
    expect(screen.getAllByRole("button", { name: /log out/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("link", { name: /login/i })).not.toBeInTheDocument();
  });
});
