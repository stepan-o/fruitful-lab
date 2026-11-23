import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

const trackCtaClick = jest.fn();

jest.mock("@/lib/gtm", () => ({
    trackCtaClick: (...args: unknown[]) => trackCtaClick(...args),
}));

import ToolsIndexPage from "@/app/(site)/tools/page";

describe("/tools index page", () => {
    beforeEach(() => {
        trackCtaClick.mockReset();
    });

    it("links to the Pinterest Fit Assessment and does not expose the legacy calculator", () => {
        render(<ToolsIndexPage />);

        const assessmentLink = screen.getByRole("link", { name: /start assessment/i });
        expect(assessmentLink).toHaveAttribute("href", "/tools/pinterest-fit-assessment");

        expect(screen.getByText(/pinterest fit assessment/i)).toBeInTheDocument();
        expect(screen.getByText(/built for product-based brands only/i)).toBeInTheDocument();
        expect(screen.queryByText(/pinterest potential calculator/i)).not.toBeInTheDocument();
        expect(screen.queryByRole("link", { name: /pinterest potential calculator/i })).not.toBeInTheDocument();
    });

    it("keeps the legacy route hidden while still showing the new fit-assessment framing", () => {
        render(<ToolsIndexPage />);

        expect(screen.getByText(/a clear fit outcome for your brand/i)).toBeInTheDocument();
        expect(screen.getByText(/the best role pinterest could play for you/i)).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: /tools\/pinterest-potential/i })).not.toBeInTheDocument();
    });
});
