"use client";

import { Q6 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepRadio from "./StepRadio";

export default function StepQ6({ value, onChange, error }: { value?: number; onChange: (v: number) => void; error?: string }) {
  return <StepRadio question={Q6} value={value} onChange={onChange} error={error} />;
}
