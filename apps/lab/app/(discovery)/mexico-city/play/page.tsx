import type { Metadata, Viewport } from "next";
import { getCurrentUser } from "@/lib/auth";
import FieldApp from "@/components/mexico-city/FieldApp";
import "@/components/mexico-city/mexico-city.css";
import "@/components/mexico-city/field-game.css";
export const metadata: Metadata = { title: "Juega · Mexico city discovery game", robots: { index: false, follow: false } };
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  return <FieldApp initialUser={user ? { id: String(user.id), name: user.full_name || "Explorador", admin: user.is_admin } : null} guest={params.guest === "1"} demo={params.demo === "1"} initialMode={typeof params.mode === "string" ? params.mode : "home"} invite={typeof params.invite === "string" ? params.invite : ""} />;
}
