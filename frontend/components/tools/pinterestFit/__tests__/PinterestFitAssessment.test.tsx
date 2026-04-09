import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PinterestFitAssessment } from "@/components/tools/pinterestFit/PinterestFitAssessment";

describe("PinterestFitAssessment", () => {
    it("runs through the intro, auto-advances between questions, and reaches results", async () => {
        const user = userEvent.setup();

        render(<PinterestFitAssessment />);

        expect(screen.getByRole("heading", { name: /is pinterest actually a fit for your brand/i })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /start the assessment/i }));

        expect(screen.getByRole("heading", { name: /which category best fits your brand/i })).toBeInTheDocument();
        expect(screen.getByText("Question 1 of 7")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /home & decor/i }));

        expect(
            screen.getByRole("heading", { name: /how proven is the product or collection you'd want pinterest to support/i }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /very proven/i }));
        await user.click(
            screen.getByRole("button", {
                name: /strong - we have plenty of product\/lifestyle visuals and helpful content/i,
            }),
        );
        await user.click(screen.getByRole("button", { name: /ready - clear, credible, easy to shop/i }));
        await user.click(screen.getByRole("button", { name: /get the brand in front of new people/i }));
        await user.click(screen.getByRole("button", { name: /ready now/i }));
        await user.click(screen.getByRole("button", { name: /very open - we'd consider ads as part of the strategy/i }));

        expect(
            await screen.findByRole("heading", { name: /your brand looks like a strong fit for pinterest/i }),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /restart/i })).toBeInTheDocument();
    });

    it("supports going back to the intro from the first question and restoring a prior answer when navigating back", async () => {
        const user = userEvent.setup();

        render(<PinterestFitAssessment />);

        await user.click(screen.getByRole("button", { name: /start the assessment/i }));
        await user.click(screen.getByRole("button", { name: /fashion & accessories/i }));

        expect(
            screen.getByRole("heading", { name: /how proven is the product or collection you'd want pinterest to support/i }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /back/i }));

        const priorAnswer = screen.getByRole("button", { name: /fashion & accessories/i });
        expect(priorAnswer).toHaveAttribute("aria-pressed", "true");

        await user.click(screen.getByRole("button", { name: /back/i }));

        expect(screen.getByRole("heading", { name: /is pinterest actually a fit for your brand/i })).toBeInTheDocument();
    });
});
