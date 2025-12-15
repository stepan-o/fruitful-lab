"use client";

import React from "react";

export type RadioOption = { label: string; value: number };

type RadioPillGroupProps = {
  name: string;
  value?: number;
  options: RadioOption[];
  onChange: (value: number) => void;
  errorId?: string;
  describedBy?: string;
  disabled?: boolean;
  className?: string;
};

export default function RadioPillGroup({
  name,
  value,
  options,
  onChange,
  errorId,
  describedBy,
  disabled = false,
  className = "",
}: RadioPillGroupProps) {
  const described = [describedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div role="radiogroup" aria-describedby={described} className={["grid gap-2", className].join(" ")}
    >
      {options.map((opt, i) => {
        const checked = value === opt.value;
        const base =
          "group relative flex items-center gap-3 rounded-lg border p-3 transition-colors " +
          "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]";
        const focusRing =
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--brand-raspberry)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--background)]";
        const selectedRing = checked ? " ring-1 ring-[var(--brand-raspberry)]" : "";
        return (
          <label
            key={`${name}:${opt.label}:${i}`}
            className={[base, focusRing, selectedRing].join(" ")}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={checked}
              onChange={() => onChange(opt.value)}
              aria-describedby={described}
              disabled={disabled}
            />
            <span className="text-sm text-[var(--foreground)]">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}
