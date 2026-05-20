import Link from "next/link";

export default function ContractorFooter() {
    return (
        <footer className="border-t border-[var(--border)] bg-[var(--background)]">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-4 py-8 text-sm text-[var(--foreground-muted)] sm:px-6">
                <div className="flex flex-wrap items-center gap-4">
                    <Link
                        href="/tools"
                        className="text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        ← Back to public tools
                    </Link>

                    <Link
                        href="/contractor"
                        className="text-[var(--foreground)] underline underline-offset-4 hover:text-[var(--brand-heading)] transition-colors"
                    >
                        Contractor home
                    </Link>
                </div>

                <div className="text-[11px]">
                    Fruitful Lab • Contractor area • Access-controlled
                </div>
            </div>
        </footer>
    );
}