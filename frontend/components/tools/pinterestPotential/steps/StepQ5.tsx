"use client";

import { Q5 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepRadio from "./StepRadio";

export default function StepQ5({ value, onChange, error }: { value?: number; onChange: (v: number) => void; error?: string }) {
  return <StepRadio question={Q5} value={value} onChange={onChange} error={error} />;
}
