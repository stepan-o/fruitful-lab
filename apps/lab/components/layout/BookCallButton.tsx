// frontend/components/layout/BookCallButton.tsx
import React from "react";

type BookCallButtonProps = {
    fullWidth?: boolean;
};

export function BookCallButton({ fullWidth = false }: BookCallButtonProps) {
    const base =
        "rounded-md border border-[var(--brand-raspberry)] bg-[var(--brand-raspberry)] px-4 py-2 text-sm md:text-base font-semibold text-white hover:bg-white hover:text-[var(--brand-raspberry)] hover:shadow-sm transition-colors";
    const width = fullWidth ? "w-full text-center" : "";

    return (
        <a
            href="https://calendly.com/fruitfulab/15min"
            target="_blank"
            rel="noopener noreferrer"
            className={`${base} ${width}`}
        >
            Book a Call
        </a>
    );
}