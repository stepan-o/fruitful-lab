import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PinterestFitAssessment } from "@/components/tools/pinterestFit/PinterestFitAssessment";
import { ResultsScreen } from "@/components/tools/pinterestFit/ResultsScreen";
import { scorePinterestFitAssessment } from "@/lib/tools/pinterestFit";

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

    it("renders the results screen with fit-specific blocks and only shows the talk-it-through caption for not_right_now", () => {
        const strongFitResult = scorePinterestFitAssessment({
            q1: "home_decor",
            q2: "very_proven",
            q3: "strong",
            q4: "ready",
            q5: "discovery",
            q6: "ready_now",
            q7: "very_open",
        });

        const { rerender } = render(<ResultsScreen result={strongFitResult} onRestart={() => {}} />);

        expect(screen.getByText("Strong fit")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /top 3 reasons/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /best role for pinterest/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /next step/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /book a fit call/i })).toBeDisabled();
        expect(screen.queryByText(/still want to talk it through/i)).not.toBeInTheDocument();

        const notRightNowResult = scorePinterestFitAssessment({
            q1: "other",
            q2: "not_proven_yet",
            q3: "weak",
            q4: "not_ready",
            q5: "sales",
            q6: "just_exploring",
            q7: "not_open",
        });

        rerender(<ResultsScreen result={notRightNowResult} onRestart={() => {}} />);

        expect(screen.getByText("Not the right fit right now")).toBeInTheDocument();
        expect(screen.getByText("Still want to talk it through?")).toBeInTheDocument();
        expect(
            screen.getByText(/if you want a second opinion on whether pinterest is worth exploring later/i),
        ).toBeInTheDocument();
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
