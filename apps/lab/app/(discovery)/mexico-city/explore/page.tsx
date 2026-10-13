import Expansions from "@/components/mexico-city/Expansions";
import "@/components/mexico-city/mexico-city.css";
import "@/components/mexico-city/saved-city.css";
export const metadata = { title: "Explorar · Mexico city discovery game" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  return <Expansions from={typeof p.from === "string" ? p.from : ""} />;
}
