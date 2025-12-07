"use client";

import Link from "next/link";
import { MouseEvent, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonAsButtonProps = CommonProps & {
  href?: undefined;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  type?: "button" | "submit" | "reset";
};

type ButtonAsLinkProps = CommonProps & {
  href: string;
  onClick?: undefined;
  type?: never;
};

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function baseClasses(variant: ButtonVariant): string {
  const base = [
    "inline-flex items-center justify-center",
    "rounded-md", // radius ~6px
    "px-5 py-3",
    "text-sm font-semibold",
    "transition-colors duration-200",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "font-body",
  ];

  if (variant === "secondary") {
    return [
      ...base,
      "bg-white",
      "border border-[var(--brand-heading)]", // Prussian Blue border
      "text-[var(--brand-heading)]",
      "hover:bg-[var(--brand-alabaster)]",
      "focus-visible:ring-[var(--brand-heading)]",
    ].join(" ");
  }

  // primary
  return [
    ...base,
    "bg-[var(--brand-raspberry)]",
    "text-white",
    "hover:bg-white",
    "hover:text-[var(--brand-raspberry)]",
    "hover:border hover:border-[var(--brand-raspberry)]",
    "focus-visible:ring-[var(--brand-raspberry)]",
    // subtle hover shadow
    "hover:shadow-sm",
  ].join(" ");
}

export default function Button(props: ButtonProps) {
  const variant: ButtonVariant = props.variant ?? "primary";
  const classes = `${baseClasses(variant)} ${props.className ?? ""}`.trim();

  if ("href" in props && props.href) {
    const { href, children } = props;
    return (
      <Link href={href} className={classes} prefetch={false}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", children } = props as ButtonAsButtonProps;
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
