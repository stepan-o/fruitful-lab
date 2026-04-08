// frontend/app/(flow)/layout.tsx
import type { ReactNode } from "react";
import FlowHeader from "@/components/layout/FlowHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function FlowLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            <FlowHeader backHref="/tools" />

            {/* Theme toggle (all calculator pages) */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex justify-end pt-3 sm:pt-4">
                    <ThemeToggle />
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
                {children}
            </main>

            <SiteFooter />
        </div>
    );
}
