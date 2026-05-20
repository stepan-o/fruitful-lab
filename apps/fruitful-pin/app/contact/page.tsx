import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Contact" title="Start with a Pinterest fit conversation." description="The live booking link and form destination will be confirmed during the site inventory. This placeholder keeps the route ready without changing the current live site." />
      <div className="mx-auto max-w-3xl rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
        <Link className="text-sm font-semibold text-[var(--raspberry)] underline-offset-4 hover:underline" href="/">
          Return to the foundation homepage
        </Link>
      </div>
    </div>
  );
}
