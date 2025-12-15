"use client";

import { Q7 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepSlider from "./StepSlider";

export default function StepQ7({ value, onChange, error }: { value: number; onChange: (v: number) => void; error?: string }) {
  return <StepSlider question={Q7} value={value} onChange={onChange} error={error} />;
}
