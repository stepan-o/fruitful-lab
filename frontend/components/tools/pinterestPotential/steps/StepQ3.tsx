"use client";

import { Q3 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepCheckbox from "./StepCheckbox";

export default function StepQ3({ values, onChange, error }: { values: number[]; onChange: (v: number[]) => void; error?: string }) {
  return <StepCheckbox question={Q3} values={values} onChange={onChange} error={error} />;
}
