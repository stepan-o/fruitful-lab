"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import FlowHeader from "@/components/layout/FlowHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ThemeToggle from "@/components/ui/ThemeToggle";

const CHROMELESS_FLOW_ROUTES = new Set(["/tools/pinterest-fit-assessment"]);

export default function FlowShell({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isChromelessRoute = pathname ? CHROMELESS_FLOW_ROUTES.has(pathname) : false;

    if (isChromelessRoute) {
        return (
            <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
                <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <FlowHeader backHref="/tools" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex justify-end pt-3 sm:pt-4">
                    <ThemeToggle />
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

            <SiteFooter />
        </div>
    );
}
