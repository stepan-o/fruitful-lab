import { PinterestReadinessCheck } from "@/components/PinterestReadinessCheck";

export const metadata = {
  title: "Pinterest Readiness Check",
  description:
    "Take the Fruitful Pin Pinterest Readiness Check to see whether Pinterest is a real opportunity for your brand or a distraction to save for later.",
};

export default function PinterestReadinessCheckPage() {
  return (
    <div className="readiness-page bg-white">
      <section className="readiness-assessment-section px-5 py-10 sm:px-8 lg:py-16">
        <PinterestReadinessCheck />
      </section>
    </div>
  );
}
