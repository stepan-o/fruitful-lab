import {
    buildEspacioGourmetWhatsAppMessage,
    buildEspacioGourmetWhatsAppUrl,
    formatMxCurrency,
    getEspacioGourmetOrderTotal,
    getNextDeliveryDateOptions,
    isAllowedDeliveryDate,
    isAllowedDeliveryTime,
} from "@/lib/orders/espacioGourmet";

describe("Espacio Gourmet order helpers", () => {
    const baseSaturday = new Date("2026-08-08T15:00:00.000Z");

    it("calculates kilo totals", () => {
        expect(getEspacioGourmetOrderTotal(1)).toBe(350);
        expect(getEspacioGourmetOrderTotal(3)).toBe(1050);
        expect(formatMxCurrency(1050)).toBe("$1,050 MXN");
    });

    it("offers delivery dates from tomorrow and skips Mondays", () => {
        const options = getNextDeliveryDateOptions(baseSaturday, 4);

        expect(options.map((option) => option.value)).toEqual([
            "2026-08-09",
            "2026-08-11",
            "2026-08-12",
            "2026-08-13",
        ]);
        expect(isAllowedDeliveryDate("2026-08-09", baseSaturday)).toBe(true);
        expect(isAllowedDeliveryDate("2026-08-10", baseSaturday)).toBe(false);
        expect(isAllowedDeliveryDate("2026-08-08", baseSaturday)).toBe(false);
    });

    it("only allows delivery times from 9 AM onward", () => {
        expect(isAllowedDeliveryTime("")).toBe(false);
        expect(isAllowedDeliveryTime("08:59")).toBe(false);
        expect(isAllowedDeliveryTime("09:00")).toBe(true);
        expect(isAllowedDeliveryTime("10:30")).toBe(true);
    });

    it("builds a clear WhatsApp order message and URL", () => {
        const order = {
            customerName: "Ana Perez",
            quantityKilos: 2,
            deliveryDate: "Martes 11 de agosto",
            deliveryTime: "10:30",
            address: "Av. Tulum 123, Cancun",
            reference: "Casa blanca",
            paymentMethod: "Transferencia" as const,
            notes: "Llamar al llegar",
        };

        const message = buildEspacioGourmetWhatsAppMessage(order);
        const url = buildEspacioGourmetWhatsAppUrl(order);

        expect(message).toContain("Hola, quiero hacer un pedido de cochinita pibil.");
        expect(message).toContain("Cantidad: 2 kilos");
        expect(message).toContain("Total: $700 MXN");
        expect(message).toContain("Incluye: Cebollita preparada y salsa de chile habanero");
        expect(message).toContain("Entrega: Martes 11 de agosto a las 10:30");
        expect(message).toContain("Pago: Transferencia");
        expect(url).toContain("https://wa.me/529834707401?text=");
        expect(decodeURIComponent(url)).toContain("Direccion: Av. Tulum 123, Cancun");
    });
});
