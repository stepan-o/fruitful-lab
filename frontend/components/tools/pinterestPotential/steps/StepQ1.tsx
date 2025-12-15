"use client";

import { Q1 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepRadio from "./StepRadio";

export default function StepQ1({ value, onChange, error }: { value?: number; onChange: (v: number) => void; error?: string }) {
  return <StepRadio question={Q1} value={value} onChange={onChange} error={error} />;
}
