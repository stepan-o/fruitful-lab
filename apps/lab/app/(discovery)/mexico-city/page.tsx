import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import FieldLanding from "@/components/mexico-city/FieldEntry";
import "@/components/mexico-city/mexico-city.css";
import "@/components/mexico-city/field-game.css";
export const metadata: Metadata = { title: "Mexico city discovery game · Sal a descubrir", description: "Sal de tu ruta. Descubre la Ciudad de México, registra tus hallazgos y reta a tus amigos." };
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  for (const key of ["place", "zone", "borough"]) if (typeof params[key] === "string") redirect(`/mexico-city/atlas?${new URLSearchParams({ [key]: params[key] as string })}`);
  return <FieldLanding signedIn={!!(await getCurrentUser())} />;
}
