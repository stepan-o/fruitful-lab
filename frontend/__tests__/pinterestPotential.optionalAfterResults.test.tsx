import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PinterestPotentialWizard from "@/components/tools/pinterestPotential/PinterestPotentialWizard";

describe("PinterestPotentialWizard — optional_after_results mode", () => {
  it("shows 9 steps (no lead) and initial progress reads 'Step 1 of 9'", () => {
    render(<PinterestPotentialWizard leadMode="optional_after_results" />);
    expect(screen.getByText(/Step 1 of 9/i)).toBeInTheDocument();
  });
});
