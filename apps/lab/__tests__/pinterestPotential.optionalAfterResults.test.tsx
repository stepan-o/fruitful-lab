import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import PinterestPotentialWizard from "@/components/tools/pinterestPotential/PinterestPotentialWizard";

jest.mock("next/navigation", () => {
    return {
        useSearchParams: () => ({
            get: (_key: string): string | null => null,
        }),
    };
});

describe("PinterestPotentialWizard (v0.2) — no_welcome variant", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        document.cookie = "";
    });

    it("renders the wizard directly and progress reads 'Step 1 of 8'", () => {
        render(<PinterestPotentialWizard leadMode="soft_lock" initialVariant="no_welcome" />);

        expect(screen.getByText(/Step\s+1\s+of\s+8/i)).toBeInTheDocument();
        expect(screen.getByText(/Which best describes your business\?/i)).toBeInTheDocument();
    });
});
