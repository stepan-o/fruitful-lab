import type { Metadata } from "next";
import { FlowerMessageQuiz } from "@/components/quiz/FlowerMessageQuiz";

export const metadata: Metadata = {
  title: "What Flower Message Do You Need Right Now?",
  description:
    "Take the Bloom Whispers flower-message quiz and receive a meaningful flower, reflection, and tiny ritual.",
};

export default function FlowerMessageQuizPage() {
  return <FlowerMessageQuiz />;
}
