import type { Metadata } from "next";

import EspacioGourmetOrderForm from "@/components/orders/EspacioGourmetOrderForm";
import { getNextDeliveryDateOptions } from "@/lib/orders/espacioGourmet";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Pide cochinita pibil | Espacio Gourmet",
    description:
        "Cochinita pibil a domicilio en Cancun: bote de 1 kilo con cebollita preparada y salsa de chile habanero.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function EspacioGourmetOrderPage() {
    const deliveryDates = getNextDeliveryDateOptions(new Date(), 12);

    return <EspacioGourmetOrderForm initialDeliveryDates={deliveryDates} />;
}
