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

function baseClasses(): string {
    return [
        "inline-flex items-center justify-center",
        "rounded-lg",
        // Taller, but not crazy wide → 3 per row on the hero
        "px-6 py-4 sm:px-6 sm:py-5",
        "min-w-[210px] max-w-[240px]",
        // Bigger, wrap-friendly text
        "text-[17px] sm:text-[18px]",
        "font-semibold leading-snug",
        "text-center",
        "whitespace-normal break-words",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // IMPORTANT: ring offset should match the page background (works for dark/light)
        "focus-visible:ring-offset-[var(--background)]",
        "font-body",
    ].join(" ");
}

function variantClasses(variant: ButtonVariant): string {
    if (variant === "secondary") {
        return [
            // Token-driven surface instead of hardcoded white
            "bg-[var(--background)]",
            "border border-[var(--brand-alabaster)]",
            "text-[var(--brand-heading)]",
            // Subtle hover that works in both themes
            "hover:bg-[var(--brand-alabaster)]/25",
            "hover:border-[var(--brand-alabaster)]",
            "focus-visible:ring-[var(--brand-heading)]",
            // Tiny lift (optional, but matches your primary hover feel)
            "shadow-sm hover:shadow-md hover:-translate-y-[1px] active:shadow-sm active:translate-y-0",
        ].join(" ");
    }

    // primary
    return [
        "bg-[var(--brand-raspberry)]",
        "text-white",
        "border border-[var(--brand-raspberry)]",
        "shadow-md",
        "hover:shadow-lg hover:-translate-y-[1px]",
        "active:shadow-sm active:translate-y-0",
        "focus-visible:ring-[var(--brand-raspberry)]",
    ].join(" ");
}

export default function Button(props: ButtonProps) {
    const variant: ButtonVariant = props.variant ?? "primary";
    const classes = `${baseClasses()} ${variantClasses(variant)} ${props.className ?? ""}`.trim();

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
