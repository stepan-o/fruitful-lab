// frontend/app/(contractor)/layout.tsx
// Server component layout that enforces contractor/admin access before rendering children
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

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

  return <>{children}</>;
}
