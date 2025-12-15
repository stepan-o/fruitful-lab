"use client";

import React from "react";

export type CheckboxOption = {
    label: string;
    value: number;     // kept (used for compute lookups / legacy)
    id?: number;       // NEW: stable option id (preferred for Answers storage)
};

type Props = {
    /** Selected option keys (ids if provided, otherwise values). */
    values: number[];
    options: CheckboxOption[];
    onChange: (values: number[]) => void;
    columns?: 1 | 2 | 3;
    showSelectedCount?: boolean;
    describedBy?: string;
    className?: string;
    disabled?: boolean;
};

export default function CheckboxCardGrid({
                                             values,
                                             options,
                                             onChange,
                                             columns,
                                             showSelectedCount = true,
                                             describedBy,
                                             className = "",
                                             disabled = false,
                                         }: Props) {
    const colClass =
        columns === 1
            ? "grid-cols-1"
            : columns === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

    // Use option.id when present; otherwise fall back to option.value (legacy behavior)
    const keyOf = (opt: CheckboxOption) => (typeof opt.id === "number" ? opt.id : opt.value);

    function toggle(key: number) {
        const set = new Set(values);
        if (set.has(key)) set.delete(key);
        else set.add(key);

        // preserve original options order when emitting
        const next = options.map(keyOf).filter((k) => set.has(k));
        onChange(next);
    }

    return (
        <div className={className} aria-describedby={describedBy}>
            <div className={["grid gap-2", colClass].join(" ")}>
                {options.map((opt, i) => {
                    const key = keyOf(opt);
                    const checked = values.includes(key);

                    const base =
                        "group relative flex items-center gap-3 rounded-lg border p-3 transition-colors " +
                        "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]";
                    const focusRing =
                        "focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--brand-raspberry)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--background)]";
                    const selectedRing = checked ? " ring-1 ring-[var(--brand-raspberry)]" : "";

                    return (
                        <label key={`cb:${opt.label}:${key}:${i}`} className={[base, focusRing, selectedRing].join(" ")}>
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                onChange={() => toggle(key)}
                                aria-describedby={describedBy}
                                disabled={disabled}
                            />
                            <span className="text-sm text-[var(--foreground)]">{opt.label}</span>
                        </label>
                    );
                })}
            </div>

            {showSelectedCount && (
                <div className="mt-2 text-xs text-[var(--foreground-muted)]">Selected: {values.length}</div>
            )}
        </div>
    );
}
