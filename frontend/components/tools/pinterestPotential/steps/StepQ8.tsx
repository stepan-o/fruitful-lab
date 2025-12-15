"use client";

import { Q8 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepSlider from "./StepSlider";

export default function StepQ8({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) {
  return <StepSlider question={Q8} value={value} onChange={onChange} error={error} />;
}
