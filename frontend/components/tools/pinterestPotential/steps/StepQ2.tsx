"use client";

import { Q2 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepCheckbox from "./StepCheckbox";

export default function StepQ2({ values, onChange, error }: { values: number[]; onChange: (v: number[]) => void; error?: string }) {
  return <StepCheckbox question={Q2} values={values} onChange={onChange} error={error} />;
}
