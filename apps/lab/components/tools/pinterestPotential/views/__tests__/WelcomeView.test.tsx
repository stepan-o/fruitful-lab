import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import WelcomeView from "@/components/tools/pinterestPotential/views/WelcomeView";
import { DRAFT_STORAGE_KEY } from "@/components/tools/pinterestPotential/usePinterestPotentialDraft";

describe("WelcomeView draft state", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
    });

    it("shows Start when only the pristine draft shape exists", async () => {
        window.sessionStorage.setItem(
            DRAFT_STORAGE_KEY,
            JSON.stringify({
                stepIndex: 1,
                started: false,
                answers: {},
            }),
        );

        render(<WelcomeView onStart={() => {}} onReset={() => {}} />);

        expect(await screen.findByRole("button", { name: /start/i })).toBeInTheDocument();
        expect(screen.getByText(/progress saved/i)).toBeInTheDocument();
    });

    it("shows Resume when meaningful progress exists", async () => {
        window.sessionStorage.setItem(
            DRAFT_STORAGE_KEY,
            JSON.stringify({
                stepIndex: 3,
                started: true,
                answers: { segment: "content_creator" },
            }),
        );

        render(<WelcomeView onStart={() => {}} onReset={() => {}} />);

        expect(await screen.findByRole("button", { name: /resume/i })).toBeInTheDocument();
        expect(screen.getByText(/resume available/i)).toBeInTheDocument();
    });
});
