import type { ReactNode } from "react";
import s from "../exhibits.module.css";
export function Choices({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: string[];
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className={s.choices} role="group" aria-label={label}>
      {items.map((item, i) => (
        <button
          type="button"
          key={item}
          aria-pressed={value === i}
          onClick={() => onChange(i)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
export function Readout({
  tag,
  children,
}: {
  tag: string;
  children: ReactNode;
}) {
  return (
    <div className={s.readout} aria-live="polite">
      <span>{tag}</span>
      <div>{children}</div>
    </div>
  );
}
export function Scope({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div
      className={s.scopeFrame}
      tabIndex={0}
      aria-label="Diagram; scroll sideways on a narrow screen"
    >
      <svg
        className={s.scope}
        viewBox="0 0 760 340"
        role="img"
        aria-label={label}
      >
        {children}
      </svg>
    </div>
  );
}
export function Wire({ d, active = true }: { d: string; active?: boolean }) {
  return (
    <g fill="none">
      <path d={d} stroke="#334346" strokeWidth="8" />
      <path d={d} stroke={active ? "#b69c65" : "#53615d"} strokeWidth="2" />
      {active ? (
        <path
          className={s.flow}
          d={d}
          stroke="#c7e1c5"
          strokeWidth="3"
          strokeDasharray="3 23"
        />
      ) : null}
    </g>
  );
}
export function Node({
  x,
  y,
  label,
  sub,
  active = true,
}: {
  x: number;
  y: number;
  label: string;
  sub?: string;
  active?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M-84 -32H72L84 -20V32H-72L-84 20Z"
        fill={active ? "#223436" : "#121d21"}
        stroke={active ? "#b89a62" : "#3d4e4f"}
      />
      <text
        textAnchor="middle"
        y={sub ? -2 : 5}
        fill={active ? "#f1ddaf" : "#a0aca2"}
        fontSize="17"
        fontFamily="Georgia,serif"
      >
        {label}
      </text>
      {sub ? (
        <text textAnchor="middle" y="19" fill="#9aafa6" fontSize="11">
          {sub}
        </text>
      ) : null}
    </g>
  );
}
