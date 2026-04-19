import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MouseEvent as ReactMouseEvent } from "react";

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

        expect(
            screen.getByRole("heading", {
                name: /could pinterest be a bigger opportunity for your brand than you think/i,
            }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /see if it’s a fit/i }));

        expect(screen.getByRole("heading", { name: /which category best describes what you sell/i })).toBeInTheDocument();
        expect(screen.getByText("Question 1 of 7")).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /home & decor/i }));

        expect(
            screen.getByRole("heading", {
                name: /how much traction does the product or collection you’d promote already have/i,
            }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /we already know it sells well/i }));
        await user.click(
            screen.getByRole("button", {
                name: /strong — we have plenty of product\/lifestyle visuals and helpful content/i,
            }),
        );
        await user.click(screen.getByRole("button", { name: /we’d feel good sending traffic there now/i }));
        await user.click(screen.getByRole("button", { name: /get my brand in front of new people/i }));
        await user.click(screen.getByRole("button", { name: /ready now/i }));
        await user.click(screen.getByRole("button", { name: /very open — we’d consider ads as part of the strategy/i }));

        expect(
            await screen.findByRole("heading", {
                name: /pinterest could be a strong growth channel for your brand/i,
            }),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /restart/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /book a fit call/i })).toHaveAttribute(
            "href",
            "https://cal.com/fruitfullab/pinterest-strategy",
        );
        expect(screen.getByRole("heading", { name: /want your full breakdown sent to your inbox/i })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: /top 3 reasons/i })).not.toBeInTheDocument();
    });

    it("reveals the gated breakdown after a valid email submit without blocking the hero CTA", async () => {
        const user = userEvent.setup();
        const strongFitResult = scorePinterestFitAssessment({
            q1: "home_decor",
            q2: "very_proven",
            q3: "strong",
            q4: "ready",
            q5: "discovery",
            q6: "ready_now",
            q7: "very_open",
        });

        render(<ResultsScreen result={strongFitResult} onRestart={() => {}} />);

        expect(screen.getByText("Strong fit")).toBeInTheDocument();
        const heroCtas = screen.getAllByRole("link", { name: /book a fit call/i });
        expect(heroCtas).toHaveLength(1);
        expect(screen.queryByRole("heading", { name: /top 3 reasons/i })).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /unlock my full result/i }));
        expect(screen.getByText(/enter a valid email to unlock your full result/i)).toBeInTheDocument();

        await user.type(screen.getByLabelText(/email/i), "founder@example.com");
        await user.type(screen.getByLabelText(/first name/i), "Avery");
        await user.click(screen.getByRole("button", { name: /unlock my full result/i }));

        expect(screen.getByRole("heading", { name: /your full breakdown is unlocked/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /next step/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /top 3 reasons/i })).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /best role for pinterest/i })).toBeInTheDocument();
        expect(screen.getAllByRole("link", { name: /book a fit call/i })).toHaveLength(2);
    });

    it("shows the talk-it-through caption in the unlocked next-step block for not_right_now results", async () => {
        const user = userEvent.setup();
        const notRightNowResult = scorePinterestFitAssessment({
            q1: "other",
            q2: "not_proven_yet",
            q3: "weak",
            q4: "not_ready",
            q5: "sales",
            q6: "just_exploring",
            q7: "not_open",
        });

        render(<ResultsScreen result={notRightNowResult} onRestart={() => {}} />);

        expect(screen.getByText("Not the right fit right now")).toBeInTheDocument();

        await user.type(screen.getByLabelText(/email/i), "founder@example.com");
        await user.click(screen.getByRole("button", { name: /unlock my full result/i }));

        expect(screen.getByText("Still want to talk it through or get a second opinion?")).toBeInTheDocument();
        expect(
            screen.getByText(/if you want a second opinion on whether pinterest is worth exploring later/i),
        ).toBeInTheDocument();
    });

    it("supports going back to the intro from the first question and restoring a prior answer when navigating back", async () => {
        const user = userEvent.setup();

        render(<PinterestFitAssessment />);

        await user.click(screen.getByRole("button", { name: /see if it’s a fit/i }));
        await user.click(screen.getByRole("button", { name: /fashion & accessories/i }));

        expect(
            screen.getByRole("heading", {
                name: /how much traction does the product or collection you’d promote already have/i,
            }),
        ).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /back/i }));

        const priorAnswer = screen.getByRole("button", { name: /fashion & accessories/i });
        expect(priorAnswer).toHaveAttribute("aria-pressed", "true");

        await user.click(screen.getByRole("button", { name: /back/i }));

        expect(
            screen.getByRole("heading", {
                name: /could pinterest be a bigger opportunity for your brand than you think/i,
            }),
        ).toBeInTheDocument();
    });

    it("pushes the Pinterest Fit tracking events with the expected minimum payloads", async () => {
        const user = userEvent.setup();

        render(<PinterestFitAssessment />);

        await user.click(screen.getByRole("button", { name: /see if it’s a fit/i }));
        await user.click(screen.getByRole("button", { name: /home & decor/i }));
        await user.click(screen.getByRole("button", { name: /we already know it sells well/i }));
        await user.click(
            screen.getByRole("button", {
                name: /strong — we have plenty of product\/lifestyle visuals and helpful content/i,
            }),
        );
        await user.click(screen.getByRole("button", { name: /we’d feel good sending traffic there now/i }));
        await user.click(screen.getByRole("button", { name: /get my brand in front of new people/i }));
        await user.click(screen.getByRole("button", { name: /ready now/i }));
        await user.click(screen.getByRole("button", { name: /very open — we’d consider ads as part of the strategy/i }));

        await screen.findByRole("heading", { name: /pinterest could be a strong growth channel for your brand/i });

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
                cta_url: "https://cal.com/fruitfullab/pinterest-strategy",
            }),
        );
    });

    it("resets back to the intro when restarting from results", async () => {
        const user = userEvent.setup();

        render(<PinterestFitAssessment />);

        await user.click(screen.getByRole("button", { name: /see if it’s a fit/i }));
        await user.click(screen.getByRole("button", { name: /home & decor/i }));
        await user.click(screen.getByRole("button", { name: /we already know it sells well/i }));
        await user.click(
            screen.getByRole("button", {
                name: /strong — we have plenty of product\/lifestyle visuals and helpful content/i,
            }),
        );
        await user.click(screen.getByRole("button", { name: /we’d feel good sending traffic there now/i }));
        await user.click(screen.getByRole("button", { name: /get my brand in front of new people/i }));
        await user.click(screen.getByRole("button", { name: /ready now/i }));
        await user.click(screen.getByRole("button", { name: /very open — we’d consider ads as part of the strategy/i }));

        await screen.findByRole("heading", { name: /pinterest could be a strong growth channel for your brand/i });

        await user.click(screen.getByRole("button", { name: /restart/i }));

        expect(
            screen.getByRole("heading", {
                name: /could pinterest be a bigger opportunity for your brand than you think/i,
            }),
        ).toBeInTheDocument();
        expect(screen.queryByText(/question 1 of 7/i)).not.toBeInTheDocument();
    });

    it("renders a clickable Fit Call CTA when a non-placeholder booking URL is available", async () => {
        const user = userEvent.setup();
        const handleCtaClick = jest.fn((event: ReactMouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
        });
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
