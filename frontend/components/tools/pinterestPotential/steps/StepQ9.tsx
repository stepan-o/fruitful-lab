"use client";

import { Q9 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import StepCheckbox from "./StepCheckbox";

export default function StepQ9({ values, onChange, error }: { values: number[]; onChange: (v: number[]) => void; error?: string }) {
  return <StepCheckbox question={Q9} values={values} onChange={onChange} error={error} />;
}
