"use client";

import SliderWithTicks from "@/components/ui/forms/SliderWithTicks";
import FieldError from "@/components/ui/forms/FieldError";
import type { SliderStepProps } from "./StepTypes";

export default function StepSlider({ question, value, onChange, error }: SliderStepProps) {
  const errorId = `${question.id}-error`;
  return (
    <div>
      <div className="mt-2">
        <SliderWithTicks
          value={value}
          min={question.min}
          max={question.max}
          step={question.step}
          onChange={onChange}
          leftLabel={question.id === "Q7" ? "Not seasonal" : question.id === "Q8" ? "Low competition" : undefined}
          rightLabel={question.id === "Q7" ? "Very seasonal" : question.id === "Q8" ? "High competition" : undefined}
          errorId={error ? errorId : undefined}
        />
        <FieldError id={errorId} message={error} />
      </div>
    </div>
  );
}
