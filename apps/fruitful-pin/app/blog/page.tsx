import { PageHeader } from "@/components/PageHeader";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return <PageHeader eyebrow="Blog" title="Pinterest thinking, strategy, and experiments." description="This index will render WordPress-authored posts in a later iteration. For now it anchors the public URL and template boundary." />;
}
