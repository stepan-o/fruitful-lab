import HeroSection from "@/components/home/HeroSection";
import ClientStrip from "@/components/home/ClientStrip";
import ServicesStrip from "@/components/home/ServicesStrip";
import CaseStudyTeaser from "@/components/home/CaseStudyTeaser";
import ProcessStrip from "@/components/home/ProcessStrip";
import FinalCTASection from "@/components/home/FinalCTASection";

export default function HomePage() {
  return (
    <div className="bg-slate-50">
      <HeroSection />
      <ClientStrip />
      <ServicesStrip />
      <CaseStudyTeaser />
      <ProcessStrip />
      <FinalCTASection />
    </div>
  );
}
