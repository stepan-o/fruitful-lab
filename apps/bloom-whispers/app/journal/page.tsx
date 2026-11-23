import type { Metadata } from "next";
import { JournalArchive } from "@/components/JournalArchive";

export const metadata: Metadata = {
  title: "The Bloom Journal",
  description:
    "Browse Bloom Whispers stories, flower meanings, folklore, podcast notes, and practical floral guides.",
};

export default function JournalPage() {
  return <JournalArchive />;
}
