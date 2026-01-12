import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import PinterestPotentialWizard from "@/components/tools/pinterestPotential/PinterestPotentialWizard";

// Force a deterministic variant so the component does NOT render the Welcome screen.
// (Welcome vs no_welcome is otherwise randomized on first mount.)
jest.mock("next/navigation", () => {
    const params: Record<string, string> = { variant: "no_welcome" };

    return {
        useSearchParams: () => ({
            get: (key: string): string | null => params[key] ?? null,
        }),
    };
});

describe("PinterestPotentialWizard (v0.2) — no_welcome variant", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        document.cookie = "";
    });

    it("renders the wizard directly and progress reads 'Step 1 of 8'", () => {
        render(<PinterestPotentialWizard leadMode="soft_lock" />);

        // v0.2: stepIndex is 1..8 (Q1–Q8), and progress is displayed in wizard view
        expect(screen.getByText(/Step\s+1\s+of\s+8/i)).toBeInTheDocument();

        // Step 1 title from getStepTitle(1)
        expect(screen.getByText(/Which best describes your business\?/i)).toBeInTheDocument();
    });
});
