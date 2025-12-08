// frontend/components/layout/BookCallButton.tsx
import React from "react";

type BookCallButtonProps = {
  fullWidth?: boolean;
};

export function BookCallButton({ fullWidth = false }: BookCallButtonProps) {
  const base =
    "rounded-md bg-[#0B132B] px-3 py-2 text-sm md:text-base font-medium text-white shadow hover:bg-[#050814]";
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
