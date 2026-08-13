export type EspacioGourmetPaymentMethod = "Efectivo" | "Transferencia";

export type EspacioGourmetOrderDetails = {
    customerName: string;
    quantityKilos: number;
    deliveryDate: string;
    deliveryTime: string;
    address: string;
    paymentMethod: EspacioGourmetPaymentMethod;
    reference?: string;
    notes?: string;
};

export type DeliveryDateOption = {
    value: string;
    label: string;
};

export const ESPACIO_GOURMET_ORDER = {
    brandName: "Espacio Gourmet",
    productName: "Cochinita pibil",
    presentation: "Bote de 1 kilo",
    unitPrice: 350,
    currency: "MXN",
    whatsappNumber: "529834707401",
    included: "Cebollita preparada y salsa de chile habanero",
    delivery: "Entrega incluida en todo Cancun",
    anticipation: "Pedidos con un dia de anticipacion",
    deliveryDays: "Martes a domingo",
    earliestDeliveryTime: "09:00",
} as const;

const DELIVERY_TIME_ZONE = "America/Cancun";
const MONDAY = 1;

function cleanLine(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

function pluralizeKilos(quantity: number): string {
    return `${quantity} kilo${quantity === 1 ? "" : "s"}`;
}

export function formatMxCurrency(amount: number): string {
    return `$${amount.toLocaleString("es-MX")} MXN`;
}

export function getEspacioGourmetOrderTotal(quantityKilos: number): number {
    return quantityKilos * ESPACIO_GOURMET_ORDER.unitPrice;
}

function getCancunIsoDate(date: Date): string {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: DELIVERY_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    if (!year || !month || !day) {
        throw new Error("Could not build Cancun date");
    }

    return `${year}-${month}-${day}`;
}

function addDaysToIsoDate(isoDate: string, days: number): string {
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));

    return date.toISOString().slice(0, 10);
}

function getIsoWeekday(isoDate: string): number {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

function formatDeliveryDateLabel(isoDate: string): string {
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const label = new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
    }).format(date);

    return label.charAt(0).toUpperCase() + label.slice(1);
}

export function getNextDeliveryDateOptions(baseDate = new Date(), limit = 12): DeliveryDateOption[] {
    const todayIso = getCancunIsoDate(baseDate);
    const options: DeliveryDateOption[] = [];
    let offset = 1;

    while (options.length < limit && offset <= 28) {
        const candidate = addDaysToIsoDate(todayIso, offset);

        if (getIsoWeekday(candidate) !== MONDAY) {
            options.push({
                value: candidate,
                label: formatDeliveryDateLabel(candidate),
            });
        }

        offset += 1;
    }

    return options;
}

export function isAllowedDeliveryDate(isoDate: string, baseDate = new Date()): boolean {
    if (!isoDate) {
        return false;
    }

    const todayIso = getCancunIsoDate(baseDate);

    return isoDate > todayIso && getIsoWeekday(isoDate) !== MONDAY;
}

export function isAllowedDeliveryTime(time: string): boolean {
    return Boolean(time) && time >= ESPACIO_GOURMET_ORDER.earliestDeliveryTime;
}

export function buildEspacioGourmetWhatsAppMessage(order: EspacioGourmetOrderDetails): string {
    const quantity = Math.max(1, Math.trunc(order.quantityKilos));
    const total = getEspacioGourmetOrderTotal(quantity);
    const reference = order.reference ? cleanLine(order.reference) : "";
    const notes = order.notes ? cleanLine(order.notes) : "";

    return [
        "Hola, quiero hacer un pedido de cochinita pibil.",
        "",
        `Nombre: ${cleanLine(order.customerName)}`,
        `Producto: ${ESPACIO_GOURMET_ORDER.presentation} de ${ESPACIO_GOURMET_ORDER.productName}`,
        `Cantidad: ${pluralizeKilos(quantity)}`,
        `Total: ${formatMxCurrency(total)}`,
        `Incluye: ${ESPACIO_GOURMET_ORDER.included}`,
        `Entrega: ${order.deliveryDate} a las ${order.deliveryTime}`,
        `Direccion: ${cleanLine(order.address)}`,
        reference ? `Referencia: ${reference}` : "",
        `Pago: ${order.paymentMethod}`,
        notes ? `Notas: ${notes}` : "",
        "",
        "Entiendo que los pedidos se hacen con un dia de anticipacion.",
        "Entrega incluida en todo Cancun.",
    ]
        .filter(Boolean)
        .join("\n");
}

export function buildEspacioGourmetWhatsAppUrl(order: EspacioGourmetOrderDetails): string {
    const message = buildEspacioGourmetWhatsAppMessage(order);

    return `https://wa.me/${ESPACIO_GOURMET_ORDER.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
