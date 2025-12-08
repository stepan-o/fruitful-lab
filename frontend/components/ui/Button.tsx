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
        "font-body",
    ];

    if (variant === "secondary") {
        return [
            ...base,
            "bg-white/95",
            "border border-[var(--brand-alabaster)]",
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
        "border border-[var(--brand-raspberry)]",
        "shadow-md",
        "hover:shadow-lg hover:-translate-y-[1px]",
        "active:shadow-sm active:translate-y-0",
        "focus-visible:ring-[var(--brand-raspberry)]",
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
