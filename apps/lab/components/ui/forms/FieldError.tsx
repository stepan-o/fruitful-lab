"use client";

import React from "react";

type FieldErrorProps = {
  id: string;
  message?: string;
  className?: string;
};

export default function FieldError({ id, message, className = "" }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={[
        "mt-1 text-xs",
        "text-[var(--brand-rust)]",
        className,
      ].join(" ")}
    >
      {message}
    </p>
  );
}
