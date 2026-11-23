import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/orders/EspacioGourmetOrderForm", () => ({
    __esModule: true,
    default: () => <h1>Pedido Espacio Gourmet</h1>,
}));

import Page, { metadata } from "@/app/pedidos/espacio-gourmet/page";

describe("/pedidos/espacio-gourmet page", () => {
    it("exports noindex metadata for the hidden order page", () => {
        expect(metadata.title).toBe("Pide cochinita pibil | Espacio Gourmet");
        expect(metadata.description).toMatch(/cochinita pibil/i);
        expect(metadata.robots).toEqual({
            index: false,
            follow: false,
        });
    });

    it("renders the Espacio Gourmet order form", () => {
        render(<Page />);

        expect(screen.getByRole("heading", { name: /pedido espacio gourmet/i })).toBeInTheDocument();
    });
});
