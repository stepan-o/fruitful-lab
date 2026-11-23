import type { Metadata } from "next";
import { FlowerMessageQuizPreview } from "@/components/quiz/FlowerMessageQuizPreview";

export const metadata: Metadata = {
  title: "Flower Message Quiz Preview",
  description: "Local preview for the Bloom Whispers flower message quiz flow.",
};

export default function QuizPreviewPage() {
  return <FlowerMessageQuizPreview />;
}
