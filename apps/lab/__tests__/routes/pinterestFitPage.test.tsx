import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/tools/pinterestFit", () => ({
    PinterestFitAssessment: () => <h1>Pinterest Fit Assessment UI</h1>,
}));

import Page, { metadata } from "@/app/(flow)/tools/pinterest-fit-assessment/page";

describe("pinterest-fit-assessment page", () => {
    it("exports fit-assessment metadata", () => {
        expect(metadata.title).toBe("Pinterest Fit Assessment | Fruitful Lab");
        expect(metadata.description).toMatch(/product-based brands/i);
        expect(metadata.description).toMatch(/what role it could play/i);
    });

    it("renders the new assessment route", () => {
        render(<Page />);

        expect(screen.getByRole("heading", { name: /pinterest fit assessment ui/i })).toBeInTheDocument();
    });
});
