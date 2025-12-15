"use client";

import { Q4 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepRadio from "./StepRadio";

export default function StepQ4({ value, onChange, error }: { value?: number; onChange: (v: number) => void; error?: string }) {
  return <StepRadio question={Q4} value={value} onChange={onChange} error={error} />;
}
