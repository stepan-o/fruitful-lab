import { notFound, redirect } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ deck: string }>;
}) {
  const { deck } = await params;
  if (deck !== "overview" && deck !== "architecture") notFound();
  redirect(
    `/stepanoskin/loopforge/${deck}/${deck === "overview" ? "the-factory" : "the-thesis"}`,
  );
}
