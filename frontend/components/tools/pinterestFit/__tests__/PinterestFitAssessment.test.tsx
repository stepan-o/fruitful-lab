import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PinterestFitAssessment } from "@/components/tools/pinterestFit/PinterestFitAssessment";
import { ResultsScreen } from "@/components/tools/pinterestFit/ResultsScreen";
import { scorePinterestFitAssessment, trackPinterestFitCallClicked } from "@/lib/tools/pinterestFit";

type DataLayerEvent = Record<string, unknown> & { event: string };

const originalCrypto = globalThis.crypto;

function getDataLayerEvents() {
    return (window as Window & { dataLayer?: DataLayerEvent[] }).dataLayer ?? [];
}

beforeEach(() => {
    (window as Window & { dataLayer?: DataLayerEvent[] }).dataLayer = [];
    Object.defineProperty(globalThis, "crypto", {
        value: {
            randomUUID: jest.fn(() => "run-123"),
        },
        configurable: true,
    });
});

afterAll(() => {
    Object.defineProperty(globalThis, "crypto", {
        value: originalCrypto,
        configurable: true,
    });
});

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
        expect(
            screen.getByText(/todo: replace the fit call booking url in frontend\/lib\/tools\/pinterestFit\/config\.ts before shipping\./i),
        ).toBeInTheDocument();
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

    it("pushes the Pinterest Fit tracking events with the expected minimum payloads", async () => {
        const user = userEvent.setup();

        render(<PinterestFitAssessment />);

        await user.click(screen.getByRole("button", { name: /start the assessment/i }));
        await user.click(screen.getByRole("button", { name: /home & decor/i }));
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

        await screen.findByRole("heading", { name: /your brand looks like a strong fit for pinterest/i });

        const events = getDataLayerEvents();

        expect(events).toHaveLength(10);
        expect(events[0]).toMatchObject({
            event: "assessment_started",
            run_id: "run-123",
            tool_name: "pinterest-fit-assessment",
            assessment_key: "pinterest-fit-assessment",
        });
        expect(events[1]).toMatchObject({
            event: "assessment_question_completed",
            run_id: "run-123",
            question_id: "q1",
            selected_answer: "home_decor",
            step_number: 1,
        });
        expect(events[7]).toMatchObject({
            event: "assessment_question_completed",
            run_id: "run-123",
            question_id: "q7",
            selected_answer: "very_open",
            step_number: 7,
        });
        expect(events[8]).toMatchObject({
            event: "assessment_completed",
            run_id: "run-123",
            final_score: 25,
            final_outcome: "strong_fit",
            role_key: "discovery_traffic",
            reason_keys: ["reason_category_strong", "reason_offer_proven", "reason_support_ready"],
        });
        expect(events[9]).toMatchObject({
            event: "result_strong_fit",
            run_id: "run-123",
            final_score: 25,
            final_outcome: "strong_fit",
            result_variant: "strong_fit",
            role_key: "discovery_traffic",
        });
    });

    it("pushes the CTA tracking event with the result payload", () => {
        const result = scorePinterestFitAssessment({
            q1: "home_decor",
            q2: "very_proven",
            q3: "strong",
            q4: "ready",
            q5: "discovery",
            q6: "ready_now",
            q7: "very_open",
        });

        trackPinterestFitCallClicked({ runId: "run-cta", result });

        expect(getDataLayerEvents()).toContainEqual(
            expect.objectContaining({
                event: "cta_fit_call_clicked",
                run_id: "run-cta",
                final_score: 25,
                final_outcome: "strong_fit",
                result_variant: "strong_fit",
                role_key: "discovery_traffic",
                reason_keys: ["reason_category_strong", "reason_offer_proven", "reason_support_ready"],
                button_label: "Book a Fit Call",
                cta_url: "TODO_ADD_REAL_FIT_CALL_URL_BEFORE_SHIPPING",
            }),
        );
    });

    it("resets back to the intro when restarting from results", async () => {
        const user = userEvent.setup();

        render(<PinterestFitAssessment />);

        await user.click(screen.getByRole("button", { name: /start the assessment/i }));
        await user.click(screen.getByRole("button", { name: /home & decor/i }));
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

        await screen.findByRole("heading", { name: /your brand looks like a strong fit for pinterest/i });

        await user.click(screen.getByRole("button", { name: /restart/i }));

        expect(screen.getByRole("heading", { name: /is pinterest actually a fit for your brand/i })).toBeInTheDocument();
        expect(screen.queryByText(/question 1 of 7/i)).not.toBeInTheDocument();
    });

    it("renders a clickable Fit Call CTA when a non-placeholder booking URL is available", async () => {
        const user = userEvent.setup();
        const handleCtaClick = jest.fn();
        const result = scorePinterestFitAssessment({
            q1: "home_decor",
            q2: "very_proven",
            q3: "strong",
            q4: "ready",
            q5: "discovery",
            q6: "ready_now",
            q7: "very_open",
        });

        render(
            <ResultsScreen
                result={{
                    ...result,
                    cta: {
                        ...result.cta,
                        url: "https://example.com/fit-call",
                    },
                }}
                onRestart={() => {}}
                onCtaClick={handleCtaClick}
            />,
        );

        const ctaLink = screen.getByRole("link", { name: /book a fit call/i });
        expect(ctaLink).toHaveAttribute("href", "https://example.com/fit-call");

        await user.click(ctaLink);

        expect(handleCtaClick).toHaveBeenCalledTimes(1);
    });
});
