"use client";

import Image from "next/image";
import { Check, CreditCard, MessageCircle, Minus, Plus } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import {
    buildEspacioGourmetWhatsAppUrl,
    ESPACIO_GOURMET_ORDER,
    formatMxCurrency,
    getEspacioGourmetOrderTotal,
    isAllowedDeliveryDate,
    isAllowedDeliveryTime,
    type DeliveryDateOption,
    type EspacioGourmetPaymentMethod,
} from "@/lib/orders/espacioGourmet";

type FormErrors = Partial<{
    customerName: string;
    deliveryDate: string;
    deliveryTime: string;
    address: string;
}>;

function fieldClass(hasError: boolean): string {
    return [
        "mt-2 box-border w-full min-w-0 max-w-full rounded-lg border bg-white px-4 py-3 text-base text-[#25180f] shadow-sm outline-none transition",
        "placeholder:text-[#8a6d5a]",
        "focus:border-[#d45d1a] focus:ring-2 focus:ring-[#f4b26a]/45",
        hasError ? "border-[#b91c1c]" : "border-[#ead7c6]",
    ].join(" ");
}

function ErrorText({ children }: { children?: string }) {
    if (!children) return null;

    return <p className="mt-2 text-sm font-medium text-[#b91c1c]">{children}</p>;
}

type EspacioGourmetOrderFormProps = {
    initialDeliveryDates: DeliveryDateOption[];
};

const productPhotos = [
    {
        src: "/images/espacio-gourmet/cochinita-pot.webp",
        alt: "Cochinita pibil recién salida del horno en una olla",
        title: "Cochinita recién salida del horno",
    },
    {
        src: "/images/espacio-gourmet/cochinita-shredded.webp",
        alt: "Cochinita pibil desmenuzada en una olla",
        title: "Carne suave y desmenuzada",
    },
    {
        src: "/images/espacio-gourmet/cebolla-morada.webp",
        alt: "Cebollita morada preparada en un plato",
        title: "Cebollita morada preparada",
    },
    {
        src: "/images/espacio-gourmet/salsa-habanero.webp",
        alt: "Salsa de chile habanero en un plato",
        title: "Salsa de chile habanero",
    },
    {
        src: "/images/espacio-gourmet/package.webp",
        alt: "Bote de un kilo de cochinita pibil con cebollita y salsa",
        title: "Presentación de 1 kilo",
    },
];

export default function EspacioGourmetOrderForm({ initialDeliveryDates }: EspacioGourmetOrderFormProps) {
    const [deliveryDates] = useState<DeliveryDateOption[]>(initialDeliveryDates);
    const [customerName, setCustomerName] = useState("");
    const [quantityKilos, setQuantityKilos] = useState(1);
    const [deliveryDate, setDeliveryDate] = useState(initialDeliveryDates[0]?.value ?? "");
    const [deliveryTime, setDeliveryTime] = useState("");
    const [address, setAddress] = useState("");
    const [reference, setReference] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<EspacioGourmetPaymentMethod>("Efectivo");
    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState<FormErrors>({});

    const total = useMemo(() => getEspacioGourmetOrderTotal(quantityKilos), [quantityKilos]);
    const selectedDeliveryLabel = deliveryDates.find((date) => date.value === deliveryDate)?.label ?? deliveryDate;

    function clearError(field: keyof FormErrors) {
        setErrors((current) => {
            const next = { ...current };
            delete next[field];
            return next;
        });
    }

    function validate(): boolean {
        const nextErrors: FormErrors = {};

        if (!customerName.trim()) {
            nextErrors.customerName = "Escribe tu nombre.";
        }

        if (!deliveryDate) {
            nextErrors.deliveryDate = "Elige el día de entrega.";
        } else if (!isAllowedDeliveryDate(deliveryDate)) {
            nextErrors.deliveryDate = "Los pedidos son con un día de anticipación y se entregan de martes a domingo.";
        }

        if (!deliveryTime) {
            nextErrors.deliveryTime = "Elige una hora de entrega.";
        } else if (!isAllowedDeliveryTime(deliveryTime)) {
            nextErrors.deliveryTime = "Las entregas empiezan a partir de las 9:00 AM.";
        }

        if (!address.trim()) {
            nextErrors.address = "Escribe la dirección completa de entrega.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const whatsappUrl = buildEspacioGourmetWhatsAppUrl({
            customerName,
            quantityKilos,
            deliveryDate: selectedDeliveryLabel,
            deliveryTime,
            address,
            reference,
            paymentMethod,
            notes,
        });

        window.location.assign(whatsappUrl);
    }

    return (
        <main className="box-border min-h-screen overflow-x-hidden bg-[#fff7ec] text-[#25180f]">
            <section className="mx-auto box-border w-full max-w-xl px-4 py-4 sm:px-6 sm:py-8">
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="box-border w-full min-w-0 rounded-lg border border-[#ead7c6] bg-white p-4 shadow-xl shadow-[#6d2f12]/10 sm:p-6"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#a93d11]">
                                Haz tu pedido a Espacio Gourmet
                            </p>
                            <h2 className="mt-2 text-2xl font-black text-[#25180f]">Cochinita pibil</h2>
                            <p className="mt-2 text-sm leading-relaxed text-[#6d5446]">
                                WhatsApp se abrirá con tu pedido listo para revisar y enviar.
                            </p>
                        </div>
                        <div className="w-fit rounded-lg bg-[#fff1df] px-3 py-2 text-left sm:text-right">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#a93d11]">Total</p>
                            <p className="mt-1 whitespace-nowrap text-xl font-black text-[#25180f]">
                                {formatMxCurrency(total)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 min-w-0 rounded-lg bg-[#fff8f0] px-4 py-3 text-sm leading-relaxed text-[#6d5446]">
                        <p>
                            Bote de 1 kilo. Incluye cebollita preparada y salsa de chile habanero. Entrega incluida en
                            todo Cancún.
                        </p>
                        <p className="mt-1 font-bold text-[#25180f]">
                            Pedidos con un día de anticipación. Entregas de martes a domingo.
                        </p>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="customerName" className="text-sm font-bold text-[#25180f]">
                                Nombre
                            </label>
                            <input
                                id="customerName"
                                name="customerName"
                                value={customerName}
                                onChange={(event) => {
                                    setCustomerName(event.target.value);
                                    clearError("customerName");
                                }}
                                className={fieldClass(Boolean(errors.customerName))}
                                placeholder="Tu nombre"
                                autoComplete="name"
                            />
                            <ErrorText>{errors.customerName}</ErrorText>
                        </div>

                        <div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm font-bold text-[#25180f]">Cantidad</p>
                                    <p className="mt-1 text-sm text-[#6d5446]">Solo kilos completos.</p>
                                </div>
                                <div className="flex h-12 w-fit items-center overflow-hidden rounded-lg border border-[#ead7c6] bg-[#fff8f0]">
                                    <button
                                        type="button"
                                        aria-label="Restar un kilo"
                                        disabled={quantityKilos <= 1}
                                        onClick={() => setQuantityKilos((current) => Math.max(1, current - 1))}
                                        className="grid h-12 w-12 place-items-center text-[#25180f] transition hover:bg-white disabled:cursor-not-allowed disabled:text-[#c4aa98]"
                                    >
                                        <Minus className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <p className="min-w-20 px-4 text-center text-lg font-black" aria-live="polite">
                                        {quantityKilos} kg
                                    </p>
                                    <button
                                        type="button"
                                        aria-label="Agregar un kilo"
                                        onClick={() => setQuantityKilos((current) => current + 1)}
                                        className="grid h-12 w-12 place-items-center text-[#25180f] transition hover:bg-white"
                                    >
                                        <Plus className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="deliveryDate" className="text-sm font-bold text-[#25180f]">
                                Día de entrega
                            </label>
                            <select
                                id="deliveryDate"
                                name="deliveryDate"
                                value={deliveryDate}
                                onChange={(event) => {
                                    setDeliveryDate(event.target.value);
                                    clearError("deliveryDate");
                                }}
                                className={fieldClass(Boolean(errors.deliveryDate))}
                            >
                                {deliveryDates.length === 0 ? (
                                    <option value="">Cargando días</option>
                                ) : (
                                    deliveryDates.map((date) => (
                                        <option key={date.value} value={date.value}>
                                            {date.label}
                                        </option>
                                    ))
                                )}
                            </select>
                            <ErrorText>{errors.deliveryDate}</ErrorText>
                        </div>

                        <div>
                            <label htmlFor="deliveryTime" className="text-sm font-bold text-[#25180f]">
                                Hora de entrega
                            </label>
                            <input
                                id="deliveryTime"
                                name="deliveryTime"
                                value={deliveryTime}
                                onChange={(event) => {
                                    setDeliveryTime(event.target.value);
                                    clearError("deliveryTime");
                                }}
                                className={fieldClass(Boolean(errors.deliveryTime))}
                                type="time"
                                min={ESPACIO_GOURMET_ORDER.earliestDeliveryTime}
                                step="900"
                            />
                            <p className="mt-2 text-sm text-[#6d5446]">A partir de las 9:00 AM.</p>
                            <ErrorText>{errors.deliveryTime}</ErrorText>
                        </div>

                        <div>
                            <label htmlFor="address" className="text-sm font-bold text-[#25180f]">
                                Dirección completa
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={address}
                                onChange={(event) => {
                                    setAddress(event.target.value);
                                    clearError("address");
                                }}
                                className={`${fieldClass(Boolean(errors.address))} min-h-24 resize-y`}
                                placeholder="Calle, número, colonia y cualquier detalle importante"
                                autoComplete="street-address"
                            />
                            <ErrorText>{errors.address}</ErrorText>
                        </div>

                        <div>
                            <label htmlFor="reference" className="text-sm font-bold text-[#25180f]">
                                Referencia
                            </label>
                            <input
                                id="reference"
                                name="reference"
                                value={reference}
                                onChange={(event) => setReference(event.target.value)}
                                className={fieldClass(false)}
                                placeholder="Color de casa, entre calles, caseta, etc."
                            />
                        </div>

                        <div>
                            <p className="text-sm font-bold text-[#25180f]">Forma de pago</p>
                            <div className="mt-2 grid grid-cols-2 gap-3">
                                {(["Efectivo", "Transferencia"] as EspacioGourmetPaymentMethod[]).map((method) => {
                                    const isSelected = paymentMethod === method;

                                    return (
                                        <button
                                            key={method}
                                            type="button"
                                            aria-pressed={isSelected}
                                            onClick={() => setPaymentMethod(method)}
                                            className={[
                                                "flex h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold transition",
                                                isSelected
                                                    ? "border-[#d45d1a] bg-[#fff1df] text-[#25180f] shadow-sm"
                                                    : "border-[#ead7c6] bg-white text-[#6d5446] hover:border-[#d45d1a]",
                                            ].join(" ")}
                                        >
                                            {isSelected ? <Check className="h-4 w-4" aria-hidden="true" /> : <CreditCard className="h-4 w-4" aria-hidden="true" />}
                                            {method}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="text-sm font-bold text-[#25180f]">
                                Notas opcionales
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                className={`${fieldClass(false)} min-h-20 resize-y`}
                                placeholder="Ej. llamar al llegar, entregar en recepción..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 box-border flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#15803d] px-5 py-4 text-base font-black text-white shadow-lg shadow-[#15803d]/20 transition hover:bg-[#126c34] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                        <MessageCircle className="h-5 w-5" aria-hidden="true" />
                        Enviar pedido por WhatsApp
                    </button>
                </form>

                <div className="mt-6 space-y-3" aria-label="Fotos de la cochinita pibil">
                    {productPhotos.map((photo) => (
                        <div key={photo.src} className="overflow-hidden rounded-lg border border-[#ead7c6] bg-white">
                            <div className="aspect-[4/3] overflow-hidden">
                                <Image
                                    src={photo.src}
                                    alt={photo.alt}
                                    width={1200}
                                    height={900}
                                    sizes="(max-width: 640px) 100vw, 576px"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="px-4 py-3">
                                <p className="text-sm font-bold text-[#25180f]">{photo.title}</p>
                                {photo.src === "/images/espacio-gourmet/package.webp" ? (
                                    <p className="mt-1 text-sm text-[#6d5446]">
                                        Bote de 1 kilo: {formatMxCurrency(ESPACIO_GOURMET_ORDER.unitPrice)}. Incluye
                                        cebollita preparada y salsa de chile habanero.
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
