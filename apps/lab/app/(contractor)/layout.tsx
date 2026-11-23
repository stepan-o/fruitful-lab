// frontend/app/(contractor)/layout.tsx
// Server component layout that enforces contractor/admin access before rendering children
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ContractorHeader from "@/components/layout/ContractorHeader";
import ContractorFooter from "@/components/layout/ContractorFooter";

export default async function ContractorGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Fallback auth gate: if no user (cookie missing/invalid/expired), send to login
  // Best-effort next preserved as "/contractor"; middleware handles full fidelity
  if (!user) {
    redirect("/login?next=/contractor");
  }

  // Fail closed: only admins or members of the 'contractor' group may proceed
  const isAllowed = user.is_admin || user.groups?.includes("contractor");
  if (!isAllowed) {
    redirect("/tools");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <ContractorHeader user={user} />
      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        {children}
      </main>
      <ContractorFooter />
    </div>
  );
}
