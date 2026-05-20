"use client";

import React from "react";

type SliderWithTicksProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  errorId?: string;
  describedBy?: string;
  className?: string;
  disabled?: boolean;
};

export default function SliderWithTicks({
  value,
  min,
  max,
  step,
  onChange,
  leftLabel,
  rightLabel,
  errorId,
  describedBy,
  className = "",
  disabled = false,
}: SliderWithTicksProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)));
  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = clamp(Number(e.target.value));
    onChange(v);
  };

  const ticks = [] as number[];
  for (let i = min; i <= max; i += step) ticks.push(i);

  const described = [describedBy, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["w-full", className].join(" ")}> 
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onInput}
        aria-describedby={described}
        disabled={disabled}
        className={[
          "w-full appearance-none",
          // track
          "h-2 rounded-full",
          "bg-[var(--surface)]",
          // remove default outline; we handle focus ring below
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        ].join(" ")}
      />

      {/* Ticks */}
      <div className="mt-2 flex items-center justify-between">
        {ticks.map((t) => (
          <span key={`tick:${t}`} className="text-[11px] text-[var(--foreground-muted)]">
            {t}
          </span>
        ))}
      </div>

      {/* End labels */}
      {(leftLabel || rightLabel) && (
        <div className="mt-1 flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
          <span>{leftLabel ?? ""}</span>
          <span>{rightLabel ?? ""}</span>
        </div>
      )}

      {/* Value bubble (reduced motion friendly: no animated transform) */}
      <div className="mt-1 text-xs text-[var(--foreground-muted)]">Selected: {value}</div>
    </div>
  );
}
