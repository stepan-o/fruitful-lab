"use client";

import React, { ReactNode } from "react";

type HelperTextProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export default function HelperText({ id, children, className = "" }: HelperTextProps) {
  return (
    <p
      id={id}
      className={[
        "mt-1 text-xs leading-relaxed",
        "text-[var(--foreground-muted)]",
        className,
      ].join(" ")}
    >
      {children}
    </p>
  );
}
