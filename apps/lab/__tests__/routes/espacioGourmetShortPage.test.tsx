import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/orders/EspacioGourmetOrderForm", () => ({
    __esModule: true,
    default: () => <h1>Pedido Espacio Gourmet</h1>,
}));

import Page, { metadata } from "@/app/espacio-gourmet/page";

describe("/espacio-gourmet page", () => {
    it("renders the Espacio Gourmet order form from the short URL", () => {
        render(<Page />);

        expect(screen.getByRole("heading", { name: /pedido espacio gourmet/i })).toBeInTheDocument();
    });

    it("keeps the short URL hidden from search engines", () => {
        expect(metadata.robots).toEqual({
            index: false,
            follow: false,
        });
    });
});
